// Merit Engine - Server-side Merit Point awarding with Continuity, multipliers, and caps
import { createClient } from "@supabase/supabase-js";
import { LeagueConfig } from "./league-config";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!, 
  import.meta.env.VITE_SUPABASE_SERVICE_KEY! // Service key for server-side operations
);

export type MeritAwardInput = {
  userId: string;
  role: "broker" | "operator" | "pilot" | "crew";
  event: string;
  basePoints?: number;
  meta?: Record<string, unknown>;
  sourceKey: string; // idempotency e.g. "deal:123|rule:quote_accepted"
};

export type MeritAwardResult = {
  ok?: boolean;
  awarded?: number;
  multiplier?: number;
  streakDays?: number;
  eventId?: string;
  skipped?: 'cap' | 'duplicate' | 'no_points';
  error?: string;
};

// Get active season ID
async function activeSeasonId(): Promise<string> {
  const { data, error } = await supabase
    .from("sc_seasons")
    .select("id")
    .eq("status", "active")
    .single();
  
  if (error) throw error;
  return data.id as string;
}

// Get user's current streak
async function streakDays(userId: string): Promise<number> {
  const { data } = await supabase
    .from("sc_streaks")
    .select("current_streak")
    .eq("user_id", userId)
    .maybeSingle();
  
  return data?.current_streak ?? 0;
}

// Check if user is within caps for an event type
async function withinCap(userId: string, eventType: string, limit: number, windowSql: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc("sc_count_events_window", { 
      p_user_id: userId, 
      p_event: eventType, 
      p_window: windowSql 
    });
  
  if (error) throw error;
  return (data as number) < limit;
}

// Award Merit Points with full validation, caps, and Continuity
export async function awardMeritPoints({
  userId,
  role,
  event,
  basePoints,
  meta = {},
  sourceKey
}: MeritAwardInput): Promise<MeritAwardResult> {
  try {
    const seasonId = await activeSeasonId();

    // Check caps based on event type
    if (event === "rfq_posted_quality") {
      const ok = await withinCap(userId, event, LeagueConfig.caps.broker.rfq_posted_quality_weekly, "7 days");
      if (!ok) return { skipped: "cap" };
    }
    if (event === "saved_search_hit_response") {
      const ok = await withinCap(userId, event, LeagueConfig.caps.broker.saved_search_hit_response_daily, "1 day");
      if (!ok) return { skipped: "cap" };
    }
    if (event === "quote_submitted_fast") {
      const ok = await withinCap(userId, event, LeagueConfig.caps.operator.quote_submitted_fast_weekly, "7 days");
      if (!ok) return { skipped: "cap" };
    }

    // Get base points for the event
    let pts = basePoints;
    if (!pts) {
      const rolePoints = LeagueConfig.points[role as keyof typeof LeagueConfig.points] as Record<string, number>;
      pts = rolePoints?.[event] || LeagueConfig.points.shared[event as keyof typeof LeagueConfig.points.shared] || 0;
    }
    
    if (!pts) return { skipped: "no_points" };

    // Get streak and calculate multiplier
    const streak = await streakDays(userId);
    const multiplier = LeagueConfig.multiplier(streak);
    const awarded = Math.round(pts * multiplier);

    // Award Merit Points using the database function (handles idempotency)
    const { data, error } = await supabase
      .rpc("sc_award_xp", {
        p_user_id: userId,
        p_role: role,
        p_event_type: event,
        p_base_points: pts,
        p_meta: meta,
        p_source_key: sourceKey
      });

    if (error) {
      if (error.message.includes("duplicate key")) return { skipped: "duplicate" };
      throw error;
    }

    return {
      ok: true,
      awarded: data.awarded,
      multiplier: data.multiplier,
      streakDays: data.streak_days,
      eventId: data.event_id
    };

  } catch (error) {
    console.error("Merit Point award error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Award Briefing completion bonus
export async function awardBriefingBonus(userId: string, briefingCode: string, bonusPoints: number): Promise<MeritAwardResult> {
  return awardMeritPoints({
    userId,
    role: "shared", // Briefing bonuses are shared
    event: "briefing_completed",
    basePoints: bonusPoints,
    meta: { briefingCode },
    sourceKey: `briefing:${briefingCode}|user:${userId}|${Date.now()}`
  });
}

// Award weekly Order completion
export async function awardOrderBonus(userId: string, orderCode: string, bonusPoints: number): Promise<MeritAwardResult> {
  return awardMeritPoints({
    userId,
    role: "shared", // Order bonuses are shared
    event: "order_completed",
    basePoints: bonusPoints,
    meta: { orderCode },
    sourceKey: `order:${orderCode}|user:${userId}|${Date.now()}`
  });
}

// Award Continuity shelter (earned by completing Orders)
export async function awardContinuityShelter(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from("sc_streaks")
    .update({ 
      shelters_available: supabase.raw("shelters_available + 1"),
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId);

  return !error;
}

// Get user's streak info
export async function getUserStreak(userId: string): Promise<{
  currentStreak: number;
  bestStreak: number;
  sheltersAvailable: number;
  lastScoredDate: string | null;
}> {
  const { data, error } = await supabase
    .from("sc_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  
  return {
    currentStreak: data?.current_streak ?? 0,
    bestStreak: data?.best_streak ?? 0,
    sheltersAvailable: data?.shelters_available ?? 1,
    lastScoredDate: data?.last_scored_date ?? null
  };
}

// Get user's daily quests
export async function getUserDailyQuests(userId: string): Promise<unknown[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from("sc_daily_quests")
    .select("*")
    .eq("user_id", userId)
    .eq("assigned_date", today);

  if (error) throw error;
  return data || [];
}

// Get user's weekly missions
export async function getUserWeeklyMissions(userId: string): Promise<unknown[]> {
  const seasonId = await activeSeasonId();
  
  const { data, error } = await supabase
    .from("sc_weekly_missions")
    .select("*")
    .eq("user_id", userId)
    .eq("season_id", seasonId);

  if (error) throw error;
  return data || [];
}

// Assign daily quests to user
export async function assignDailyQuests(userId: string, role: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const { DAILY_QUESTS } = await import("./league-config");
  
  // Get 3 random quests for the user's role
  const roleQuests = DAILY_QUESTS.filter(q => q.role === role || q.role === "shared");
  const selectedQuests = roleQuests.sort(() => 0.5 - Math.random()).slice(0, 3);
  
  const questsToInsert = selectedQuests.map(quest => ({
    user_id: userId,
    quest_code: quest.code,
    quest_type: "daily",
    target_count: 1,
    xp_bonus: quest.pts,
    assigned_date: today
  }));

  const { error } = await supabase
    .from("sc_daily_quests")
    .upsert(questsToInsert, { 
      onConflict: "user_id,quest_code,assigned_date",
      ignoreDuplicates: true 
    });

  if (error) throw error;
}

// Assign weekly missions to user
export async function assignWeeklyMissions(userId: string, role: string): Promise<void> {
  const seasonId = await activeSeasonId();
  const { WEEKLY_MISSIONS } = await import("./league-config");
  
  // Get missions for the user's role
  const roleMissions = WEEKLY_MISSIONS.filter(m => m.role === role || m.role === "shared");
  
  const missionsToInsert = roleMissions.map(mission => ({
    user_id: userId,
    season_id: seasonId,
    mission_code: mission.code,
    target_count: mission.target,
    xp_bonus: mission.pts
  }));

  const { error } = await supabase
    .from("sc_weekly_missions")
    .upsert(missionsToInsert, { 
      onConflict: "user_id,season_id,mission_code",
      ignoreDuplicates: true 
    });

  if (error) throw error;
}

// Update quest progress
export async function updateQuestProgress(userId: string, questCode: string, increment: number = 1): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  const { error } = await supabase
    .from("sc_daily_quests")
    .update({ 
      current_count: supabase.raw(`current_count + ${increment}`),
      completed: supabase.raw("current_count + 1 >= target_count")
    })
    .eq("user_id", userId)
    .eq("quest_code", questCode)
    .eq("assigned_date", today)
    .eq("completed", false);

  if (error) throw error;
}

// Update mission progress
export async function updateMissionProgress(userId: string, missionCode: string, increment: number = 1): Promise<void> {
  const seasonId = await activeSeasonId();
  
  const { error } = await supabase
    .from("sc_weekly_missions")
    .update({ 
      current_count: supabase.raw(`current_count + ${increment}`),
      completed: supabase.raw("current_count + 1 >= target_count")
    })
    .eq("user_id", userId)
    .eq("season_id", seasonId)
    .eq("mission_code", missionCode)
    .eq("completed", false);

  if (error) throw error;
}

// Get user's recent Merit Point events
export async function getUserMeritEvents(userId: string, limit: number = 10): Promise<unknown[]> {
  const { data, error } = await supabase
    .from("sc_xp_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Get user's total Merit Points for current season
export async function getUserSeasonMeritPoints(userId: string): Promise<number> {
  const seasonId = await activeSeasonId();
  
  const { data, error } = await supabase
    .from("sc_league_members")
    .select("points")
    .eq("user_id", userId)
    .eq("season_id", seasonId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.points ?? 0;
}
