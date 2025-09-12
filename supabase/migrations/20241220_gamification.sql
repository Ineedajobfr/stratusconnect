-- 001_gamification.sql
-- Duolingo-style league system for StratusConnect

-- Leagues from Bronze → Diamond (tweak names/order freely)
create table public.sc_leagues (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,        -- 'bronze' | 'silver' | ...
  name          text not null,               -- 'Bronze League'
  sort_order    int  not null,               -- 1..6
  color_hsl     text not null default '25 70% 45%', -- for badges/rings
  created_at    timestamptz not null default now()
);

insert into public.sc_leagues (code, name, sort_order, color_hsl) values
('bronze','Bronze League',1, '43 74% 66%'),
('silver','Silver League',2, '217 10% 75%'),
('gold','Gold League',3, '38 92% 50%'),
('platinum','Platinum League',4, '208 26% 44%'),
('emerald','Emerald League',5, '173 58% 39%'),
('diamond','Diamond League',6, '27 87% 67%');

-- Weekly seasons
create table public.sc_seasons (
  id          uuid primary key default gen_random_uuid(),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  status      text not null check (status in ('scheduled','active','ended')) default 'scheduled',
  created_at  timestamptz not null default now()
);

-- Membership (one row per user per season)
create table public.sc_league_members (
  user_id     uuid not null references auth.users(id) on delete cascade,
  season_id   uuid not null references public.sc_seasons(id) on delete cascade,
  league_id   uuid not null references public.sc_leagues(id),
  points      int  not null default 0,
  rank        int,
  last_event  timestamptz,
  created_at  timestamptz not null default now(),
  primary key (user_id, season_id)
);

-- XP events (append-only)
create table public.sc_xp_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  season_id   uuid not null references public.sc_seasons(id) on delete cascade,
  event_type  text not null check (event_type in (
    'rfq_posted',
    'quote_submitted_fast',           -- operator p50 < 5m
    'quote_accepted',
    'deal_completed_on_time',
    'dispute_free_deal',              -- closes with no dispute
    'kyc_completed',
    'credentials_up_to_date',         -- pilot/crew/operator docs valid
    'saved_search_hit_response',      -- broker acts within X mins
    'fallthrough_recovered',          -- re-market success
    'community_helpful'               -- manual admin award
  )),
  points      int not null,
  meta        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- Badges (optional)
create table public.sc_badges (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,      -- 'fast_responder', 'top_perf'
  name        text not null,
  description text not null,
  color_hsl   text not null default '208 26% 44%',
  icon        text not null default 'zap',
  created_at  timestamptz not null default now()
);

create table public.sc_user_badges (
  user_id     uuid not null references auth.users(id) on delete cascade,
  badge_id    uuid not null references public.sc_badges(id) on delete cascade,
  awarded_at  timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- Read helpers
create or replace view public.sc_leaderboard as
select
  m.season_id,
  m.user_id,
  m.points,
  m.rank,
  l.code as league_code,
  l.name as league_name,
  l.sort_order,
  l.color_hsl
from public.sc_league_members m
join public.sc_leagues l on l.id = m.league_id;

-- RPC function for atomic point increments
create or replace function public.sc_add_points(p_user_id uuid, p_season_id uuid, p_points int)
returns void language plpgsql as $$
begin
  update public.sc_league_members
  set points = points + p_points, last_event = now()
  where user_id = p_user_id and season_id = p_season_id;
end; $$;

-- Minimal RLS (adjust to your roles)
alter table public.sc_league_members enable row level security;
alter table public.sc_xp_events      enable row level security;
alter table public.sc_user_badges    enable row level security;

create policy "own membership" on public.sc_league_members
  for select using (auth.uid() = user_id);

create policy "own events" on public.sc_xp_events
  for select using (auth.uid() = user_id);

create policy "own badges" on public.sc_user_badges
  for select using (auth.uid() = user_id);

-- Public read access for leaderboard
create policy "public leaderboard" on public.sc_leaderboard
  for select using (true);

-- Admin role (service key) can do anything; app clients read-only as above.

-- Seed first season (adjust dates)
insert into public.sc_seasons (starts_at, ends_at, status)
values (
  date_trunc('week', now() at time zone 'utc'),
  date_trunc('week', now() at time zone 'utc') + interval '7 day',
  'active'
);
