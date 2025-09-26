-- Beta Signups Migration
-- Creates table for beta signup collection with RLS

create extension if not exists pgcrypto;

create table if not exists public.beta_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text,
  email citext not null,
  phone text,
  source text default 'landing_about',
  status text not null default 'pending', -- pending, verified, rejected
  ip_hash text,
  turnstile_score numeric,
  notion_sync_status text default 'pending', -- pending, success, fail
  notes text
);

create unique index if not exists ux_beta_signups_email on public.beta_signups(lower(email));

alter table public.beta_signups enable row level security;

-- Only admins can read
create policy "admin_read_beta_signups"
on public.beta_signups
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles 
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

-- No direct insert from clients. Inserts go via service role in Edge Function.
revoke insert on public.beta_signups from authenticated, anon;
