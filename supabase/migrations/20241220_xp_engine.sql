-- 100_xp_engine.sql
-- XP Engine: Streaks, multipliers, quests, and idempotent events

-- Daily activity tracking for streaks
create table public.sc_daily_activity (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  scored boolean not null default false,
  primary key (user_id, day)
);

-- Streak management with storm shelters
create table public.sc_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_scored_date date,
  shelters_available int not null default 1,         -- "storm shelters"
  updated_at timestamptz not null default now()
);

-- XP events (append only, idempotent via source_key)
create table public.sc_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('broker','operator','pilot','crew')),
  season_id uuid not null references public.sc_seasons(id) on delete cascade,
  event_type text not null,
  base_points int not null,
  multiplier numeric(3,2) not null default 1.0,
  awarded_points int not null,
  meta jsonb not null default '{}'::jsonb,
  source_key text not null, -- e.g. "deal:123|rule:quote_accepted"
  created_at timestamptz not null default now(),
  unique (user_id, source_key) -- idempotency
);

-- Daily quests tracking
create table public.sc_daily_quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_code text not null,
  quest_type text not null check (quest_type in ('daily', 'weekly')),
  target_count int not null default 1,
  current_count int not null default 0,
  completed boolean not null default false,
  xp_bonus int not null,
  assigned_date date not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, quest_code, assigned_date)
);

-- Weekly missions (role-specific goals)
create table public.sc_weekly_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  season_id uuid not null references public.sc_seasons(id) on delete cascade,
  mission_code text not null,
  target_count int not null,
  current_count int not null default 0,
  completed boolean not null default false,
  xp_bonus int not null,
  created_at timestamptz not null default now(),
  unique (user_id, season_id, mission_code)
);

-- Fast atomic add points
create or replace function public.sc_add_points(p_user uuid, p_season uuid, p_pts int)
returns void language plpgsql as $$
begin
  update public.sc_league_members
  set points = points + p_pts, last_event = now()
  where user_id = p_user and season_id = p_season;
end$$;

-- Helper: upsert streak on daily score
create or replace function public.sc_touch_streak(p_user uuid, p_when timestamptz)
returns void language plpgsql as $$
declare
  d date := (p_when at time zone 'utc')::date;
  prev date;
  cur int;
  best int;
  shelters int;
begin
  insert into public.sc_daily_activity(user_id, day, scored)
  values (p_user, d, true)
  on conflict (user_id, day) do update set scored = true;

  select last_scored_date, current_streak, best_streak, shelters_available
  into prev, cur, best, shelters
  from public.sc_streaks where user_id = p_user for update;

  if not found then
    insert into public.sc_streaks(user_id, current_streak, best_streak, last_scored_date)
    values (p_user, 1, 1, d);
    return;
  end if;

  if prev is null then
    cur := 1;
  elsif d = prev then
    -- already counted today
    cur := cur;
  elsif d = prev + 1 then
    cur := cur + 1;
  elsif d = prev + 2 and shelters > 0 then
    -- use a shelter to bridge a missed day
    cur := cur + 1;
    shelters := shelters - 1;
  else
    cur := 1;
  end if;

  if cur > best then best := cur; end if;

  update public.sc_streaks
  set current_streak = cur,
      best_streak = best,
      last_scored_date = d,
      shelters_available = shelters,
      updated_at = now()
  where user_id = p_user;
end$$;

-- Count events in time window for caps
create or replace function public.sc_count_events_window(p_user_id uuid, p_event text, p_window text)
returns int language sql as $$
  select count(*) from sc_xp_events
  where user_id = p_user_id and event_type = p_event and created_at > now() - (p_window)::interval;
$$;

-- Award XP with idempotency and caps
create or replace function public.sc_award_xp(
  p_user_id uuid,
  p_role text,
  p_event_type text,
  p_base_points int,
  p_meta jsonb default '{}'::jsonb,
  p_source_key text
)
returns jsonb language plpgsql as $$
declare
  v_season_id uuid;
  v_streak_days int;
  v_multiplier numeric(3,2);
  v_awarded_points int;
  v_event_id uuid;
  v_cap_check boolean := true;
begin
  -- Get active season
  select id into v_season_id from sc_seasons where status = 'active' limit 1;
  if v_season_id is null then
    return jsonb_build_object('error', 'No active season');
  end if;

  -- Check caps based on event type
  if p_event_type = 'rfq_posted_quality' then
    select sc_count_events_window(p_user_id, p_event_type, '7 days') < 10 into v_cap_check;
  elsif p_event_type = 'saved_search_hit_response' then
    select sc_count_events_window(p_user_id, p_event_type, '1 day') < 10 into v_cap_check;
  elsif p_event_type = 'quote_submitted_fast' then
    select sc_count_events_window(p_user_id, p_event_type, '7 days') < 20 into v_cap_check;
  end if;

  if not v_cap_check then
    return jsonb_build_object('skipped', 'cap');
  end if;

  -- Get streak and calculate multiplier
  select current_streak into v_streak_days from sc_streaks where user_id = p_user_id;
  v_streak_days := coalesce(v_streak_days, 0);
  
  if v_streak_days >= 14 then
    v_multiplier := 2.0;
  elsif v_streak_days >= 7 then
    v_multiplier := 1.5;
  elsif v_streak_days >= 3 then
    v_multiplier := 1.2;
  else
    v_multiplier := 1.0;
  end if;

  v_awarded_points := round(p_base_points * v_multiplier);

  -- Insert event (idempotent)
  insert into sc_xp_events (
    user_id, role, season_id, event_type, base_points, 
    multiplier, awarded_points, meta, source_key
  ) values (
    p_user_id, p_role, v_season_id, p_event_type, p_base_points,
    v_multiplier, v_awarded_points, p_meta, p_source_key
  ) returning id into v_event_id;

  -- Add to league points
  perform sc_add_points(p_user_id, v_season_id, v_awarded_points);
  
  -- Update streak
  perform sc_touch_streak(p_user_id, now());

  return jsonb_build_object(
    'ok', true, 
    'awarded', v_awarded_points,
    'multiplier', v_multiplier,
    'streak_days', v_streak_days,
    'event_id', v_event_id
  );

exception
  when unique_violation then
    return jsonb_build_object('skipped', 'duplicate');
  when others then
    return jsonb_build_object('error', SQLERRM);
end$$;

-- RLS policies
alter table public.sc_daily_activity enable row level security;
alter table public.sc_streaks enable row level security;
alter table public.sc_xp_events enable row level security;
alter table public.sc_daily_quests enable row level security;
alter table public.sc_weekly_missions enable row level security;

-- Users can see their own data
create policy "own daily activity" on public.sc_daily_activity for select using (auth.uid() = user_id);
create policy "own streaks" on public.sc_streaks for all using (auth.uid() = user_id);
create policy "own xp events" on public.sc_xp_events for select using (auth.uid() = user_id);
create policy "own daily quests" on public.sc_daily_quests for all using (auth.uid() = user_id);
create policy "own weekly missions" on public.sc_weekly_missions for all using (auth.uid() = user_id);

-- Admin can see all (service key)
create policy "admin all daily activity" on public.sc_daily_activity for all using (true);
create policy "admin all streaks" on public.sc_streaks for all using (true);
create policy "admin all xp events" on public.sc_xp_events for all using (true);
create policy "admin all daily quests" on public.sc_daily_quests for all using (true);
create policy "admin all weekly missions" on public.sc_weekly_missions for all using (true);
