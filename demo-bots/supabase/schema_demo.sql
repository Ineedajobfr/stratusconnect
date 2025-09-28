-- Demo Bots Schema - Beta Terminal Testing
-- FCA Compliant Aviation Platform - Proof of Life System

-- demo flags on users
alter table public.users add column if not exists is_demo boolean default false;

-- events table
create table if not exists public.demo_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid,
  actor_role text check (actor_role in ('broker','operator','pilot','crew')),
  action text not null,
  context text,
  object_type text,
  object_id uuid,
  payload jsonb,
  client_tz text,
  client_ua text,
  recorded_by text default 'playwright'
);

-- feedback table
create table if not exists public.demo_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  persona text not null,
  journey text not null,
  score int check (score between 1 and 10),
  friction_point text,
  bug text,
  suggestion text,
  session_video_url text
);

-- service role key will insert. lock everyone else.
alter table public.demo_events enable row level security;
alter table public.demo_feedback enable row level security;

create policy "events insert by service"
on public.demo_events for insert
to service_role
with check (true);

create policy "feedback insert by service"
on public.demo_feedback for insert
to service_role
with check (true);

-- no public selects
create policy "no select"
on public.demo_events for select
to anon, authenticated
using (false);

create policy "no select fb"
on public.demo_feedback for select
to anon, authenticated
using (false);

-- Create indexes for performance
create index if not exists idx_demo_events_actor_role on public.demo_events(actor_role);
create index if not exists idx_demo_events_action on public.demo_events(action);
create index if not exists idx_demo_events_created_at on public.demo_events(created_at);
create index if not exists idx_demo_events_actor_id on public.demo_events(actor_id);

create index if not exists idx_demo_feedback_persona on public.demo_feedback(persona);
create index if not exists idx_demo_feedback_journey on public.demo_feedback(journey);
create index if not exists idx_demo_feedback_created_at on public.demo_feedback(created_at);


