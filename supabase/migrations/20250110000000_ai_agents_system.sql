-- AI Co-Developer System Migration
-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_stat_statements";
create extension if not exists "vector";

-- Events table - everything is an event
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  occurred_at timestamptz not null default now(),
  actor_id uuid,
  actor_role text,
  type text not null,
  subtype text,
  source text,
  request_id text,
  session_id text,
  severity text default 'info',
  payload jsonb not null default '{}'::jsonb,
  hash text generated always as (encode(digest(coalesce(payload::text,''),'sha256'),'hex')) stored,
  embedding vector(384)
);

-- Agent jobs queue
create table if not exists public.agent_jobs (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  type text not null,
  status text not null default 'queued',
  priority int not null default 5,
  payload jsonb not null default '{}'::jsonb,
  attempts int not null default 0,
  last_error text,
  result jsonb
);

-- Agent reports - what agents discover
create table if not exists public.agent_reports (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  agent text not null,
  topic text not null,
  summary text not null,
  details jsonb,
  evidence jsonb,
  severity text default 'low',
  links jsonb
);

-- Agent actions - proposed patches only
create table if not exists public.agent_actions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  agent text not null,
  action text not null,
  target text not null,
  patch jsonb not null,
  status text not null default 'proposed',
  approved_by uuid,
  approved_at timestamptz
);

-- Feature flags for AI-controlled features
create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  rollout jsonb
);

-- Policy rules for gateway checks
create table if not exists public.policy_rules (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  scope text not null,
  condition jsonb not null default '{}'::jsonb,
  effect text not null check (effect in ('allow','deny')),
  owner_role text not null default 'admin',
  enabled boolean not null default true
);

-- RPC to emit events with RLS context
create or replace function public.emit_event(
  p_type text,
  p_subtype text,
  p_payload jsonb,
  p_severity text default 'info'
) returns uuid
language plpgsql
security definer
as $$
declare
  v_id uuid;
begin
  insert into public.events(type, subtype, payload, severity)
  values (p_type, p_subtype, coalesce(p_payload, '{}'::jsonb), coalesce(p_severity, 'info'))
  returning id into v_id;
  return v_id;
end $$;

-- Sample apply patch RPC called by Policy Gateway only
create or replace function public.apply_agent_patch(p_patch jsonb)
returns void
language plpgsql
security definer
as $$
begin
  -- placeholder guarded write. expand with your business logic procedures
  -- raise exception if patch does not match allowed targets
  perform 1;
end $$;

-- RLS
alter table public.events enable row level security;
alter table public.agent_jobs enable row level security;
alter table public.agent_reports enable row level security;
alter table public.agent_actions enable row level security;
alter table public.feature_flags enable row level security;
alter table public.policy_rules enable row level security;

-- RLS policies
create policy events_read for select on public.events
  to authenticated using (true);
create policy events_insert for insert on public.events
  to authenticated with check (true);

create policy jobs_ro for select on public.agent_jobs
  to service_role using (true);
create policy jobs_rw for insert on public.agent_jobs
  to service_role with check (true);
create policy jobs_update for update on public.agent_jobs
  to service_role using (true);

create policy reports_ro for select on public.agent_reports
  to authenticated using (true);
create policy reports_rw for insert on public.agent_reports
  to service_role with check (true);

create policy actions_ro for select on public.agent_actions
  to authenticated using (true);
create policy actions_rw for insert on public.agent_actions
  to service_role with check (true);
create policy actions_update for update on public.agent_actions
  to service_role using (true);

create policy flags_ro for select on public.feature_flags
  to authenticated using (true);
create policy flags_admin for all on public.feature_flags
  to service_role using (true) with check (true);

create policy rules_ro for select on public.policy_rules
  to service_role using (true);
create policy rules_rw for all on public.policy_rules
  to service_role using (true) with check (true);

-- Insert some default feature flags
insert into public.feature_flags (key, enabled, rollout) values
('ai_code_review', true, '{"percentage": 100}'),
('ai_security_monitoring', true, '{"percentage": 100}'),
('ai_performance_optimization', true, '{"percentage": 100}'),
('ai_auto_patches', false, '{"percentage": 0}')
on conflict (key) do nothing;

-- Insert default policy rules
insert into public.policy_rules (name, scope, condition, effect, owner_role, enabled) values
('allow_code_review', 'code_review', '{}', 'allow', 'admin', true),
('deny_destructive_actions', 'destructive', '{}', 'deny', 'admin', true),
('allow_performance_optimization', 'performance', '{}', 'allow', 'admin', true)
on conflict do nothing;
