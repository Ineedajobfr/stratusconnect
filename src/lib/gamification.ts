import { supabase } from "@/integrations/supabase/client";
import { DEMOTE_BOTTOM_PCT, PROMOTE_TOP_PCT, STARTING_LEAGUE_CODE, XP_RULES } from "./league-constants";
import { VerificationStatus, verifyEligibilityForXpEvent } from "./verification-gate";

// Get current active season
export async function getActiveSeason() {
  const { data, error } = await supabase
    .from("sc_seasons")
    .select("*")
    .eq("status", "active")
    .order("starts_at", { ascending: false })
    .limit(1)
    .single();
  
  if (error) throw error;
  return data;
}

// Ensure user has a membership row for the season
export async function ensureMembership(userId: string) {
  const season = await getActiveSeason();
  const { data: leagueRow } = await supabase
    .from("sc_leagues")
    .select("id")
    .eq("code", STARTING_LEAGUE_CODE)
    .single();

  const { data, error } = await supabase
    .from("sc_league_members")
    .select("*")
    .eq("user_id", userId)
    .eq("season_id", season.id)
    .maybeSingle();

  if (!data) {
    const { error: insErr } = await supabase
      .from("sc_league_members")
      .insert({
        user_id: userId,
        season_id: season.id,
        league_id: leagueRow!.id,
        points: 0
      });
    if (insErr) throw insErr;
  }
  return season.id;
}

// Record an XP event safely with verification gate
export async function recordXpEvent(opts: {
  userId: string;
  type: keyof typeof XP_RULES;
  meta?: Record<string, any>;
  verificationStatus?: VerificationStatus;
}) {
  const { userId, type, meta = {}, verificationStatus } = opts;
  const points = XP_RULES[type];
  if (!points) return;

  // Verify eligibility if verification status provided
  if (verificationStatus) {
    const eligibility = verifyEligibilityForXpEvent(verificationStatus, type);
    if (!eligibility.eligible) {
      console.warn(`User ${userId} not eligible for ${type}: ${eligibility.reason}`);
      return;
    }
  }

  const seasonId = await ensureMembership(userId);

  const { error: evErr } = await supabase
    .from("sc_xp_events")
    .insert({
      user_id: userId,
      season_id: seasonId,
      event_type: type,
      points,
      meta: {
        ...meta,
        verified: true,
        timestamp: new Date().toISOString()
      }
    });
  if (evErr) throw evErr;

  const { error: upErr } = await supabase.rpc("sc_add_points", {
    p_user_id: userId,
    p_season_id: seasonId,
    p_points: points
  });
  if (upErr) throw upErr;
}

// Rank within season (simple dense_rank by points)
export async function refreshRanks(seasonId: string) {
  const { data: members, error } = await supabase
    .from("sc_league_members")
    .select("user_id, points")
    .eq("season_id", seasonId);
  if (error) throw error;

  const sorted = [...(members ?? [])].sort((a, b) => b.points - a.points);
  for (let i = 0; i < sorted.length; i++) {
    const { error: e } = await supabase
      .from("sc_league_members")
      .update({ rank: i + 1 })
      .eq("user_id", sorted[i].user_id)
      .eq("season_id", seasonId);
    if (e) throw e;
  }
}

// End-of-season promotions / demotions
export async function closeSeasonAndRoll() {
  const season = await getActiveSeason();
  // Rank refresh
  await refreshRanks(season.id);

  const { data: rows } = await supabase
    .from("sc_leaderboard")
    .select("user_id, points, rank, league_code, sort_order")
    .eq("season_id", season.id);

  if (!rows) return;

  const total = rows.length;
  const promoteCutoff = Math.floor(total * PROMOTE_TOP_PCT);
  const demoteCutoff = Math.floor(total * DEMOTE_BOTTOM_PCT);

  const nextLeague = async (sort: number, dir: 1 | -1) => {
    const { data } = await supabase
      .from("sc_leagues")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });
    const found = data?.find(l => l.sort_order === sort + dir);
    return found?.id ?? data?.find(l => l.sort_order === sort)?.id;
  };

  // promotions
  const top = [...rows].sort((a, b) => a.rank - b.rank).slice(0, promoteCutoff);
  for (const r of top) {
    const leagueId = await nextLeague(r.sort_order, 1);
    if (!leagueId) continue;
    await supabase
      .from("sc_league_members")
      .update({ league_id: leagueId })
      .eq("user_id", r.user_id)
      .eq("season_id", season.id);
  }

  // demotions
  const bottom = [...rows].sort((a, b) => b.rank - a.rank).slice(0, demoteCutoff);
  for (const r of bottom) {
    const leagueId = await nextLeague(r.sort_order, -1);
    if (!leagueId) continue;
    await supabase
      .from("sc_league_members")
      .update({ league_id: leagueId })
      .eq("user_id", r.user_id)
      .eq("season_id", season.id);
  }

  // Close and create next week
  await supabase
    .from("sc_seasons")
    .update({ status: "ended" })
    .eq("id", season.id);
  
  const starts = new Date(season.ends_at);
  const ends = new Date(starts.getTime() + 7 * 24 * 3600 * 1000);
  
  await supabase
    .from("sc_seasons")
    .insert({
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      status: "active"
    });

  // Seed membership rows for next season with same league, zero points
  const { data: prevMembers } = await supabase
    .from("sc_league_members")
    .select("user_id, league_id")
    .eq("season_id", season.id);
  
  const nextSeason = await getActiveSeason();
  const inserts = (prevMembers ?? []).map(m => ({
    user_id: m.user_id,
    season_id: nextSeason.id,
    league_id: m.league_id,
    points: 0
  }));
  
  if (inserts.length) {
    await supabase.from("sc_league_members").insert(inserts);
  }
}

// Get user's current league and stats
export async function getUserLeagueStats(userId: string) {
  const season = await getActiveSeason();
  
  const { data: membership, error } = await supabase
    .from("sc_leaderboard")
    .select("*")
    .eq("user_id", userId)
    .eq("season_id", season.id)
    .single();

  if (error) throw error;
  return membership;
}

// Get leaderboard for current season
export async function getCurrentLeaderboard(limit: number = 30) {
  const season = await getActiveSeason();
  
  const { data, error } = await supabase
    .from("sc_leaderboard")
    .select("*")
    .eq("season_id", season.id)
    .order("points", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Get user's XP events for current season
export async function getUserXpEvents(userId: string, limit: number = 50) {
  const season = await getActiveSeason();
  
  const { data, error } = await supabase
    .from("sc_xp_events")
    .select("*")
    .eq("user_id", userId)
    .eq("season_id", season.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
