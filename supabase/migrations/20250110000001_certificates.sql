create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Certificates table with multi-signature support
create table if not exists public.certificates (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  cert_type text not null,             -- e.g. "Pilot Verification", "Broker Accreditation"
  subject_id uuid,                      -- optional user id
  subject_name text not null,
  subject_email text,                   -- optional
  claims jsonb not null,                -- payload fields
  issued_by text not null default 'issuer-committee',
  key_id text not null default 'threshold-2of2',
  signature text not null default '',   -- deprecated single signature field
  signatures jsonb not null default '[]'::jsonb, -- [{kid, sig}] array
  digest text not null,                 -- hex SHA-256 of canonical json
  expires_at timestamptz,               -- optional expiry
  pdf_url text,                         -- optional stored PDF link
  status text not null default 'active', -- active, revoked, expired
  anchor_root text,                     -- merkle root at issue time
  anchor_ts timestamptz                 -- when anchored
);

-- Certificate events for audit trail
create table if not exists public.certificate_events (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  certificate_id uuid not null references public.certificates(id),
  event_type text not null, -- issued, verified, revoked
  meta jsonb not null default '{}'::jsonb
);

-- Tamper evident ledger
create table if not exists public.ledger (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  type text not null,                -- cert.issue, cert.revoke, verify, tx.approve, etc
  subject text not null,             -- certificate id or tx id
  payload jsonb not null,
  prev_hash text,                    -- hex of previous row hash in this stream
  row_hash text not null             -- hex sha256 of (created_at || type || subject || payload || prev_hash)
);

-- WebAuthn admin storage
create table if not exists public.admin_accounts (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  display_name text not null,
  role text not null default 'admin'
);

create table if not exists public.admin_credentials (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references public.admin_accounts(id) on delete cascade,
  credential_id text not null unique,
  public_key text not null,
  counter bigint not null default 0,
  transports text[],
  aaguid text,
  created_at timestamptz not null default now()
);

-- High value approvals M of N
create table if not exists public.hv_transactions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  kind text not null, -- cert.issue or cert.revoke
  target_id uuid,     -- certificate id affected
  summary text not null,
  amount_numeric numeric,           -- optional declared value
  status text not null default 'pending' -- pending, approved, rejected, applied
);

create table if not exists public.hv_approvals (
  id uuid primary key default uuid_generate_v4(),
  tx_id uuid not null references public.hv_transactions(id) on delete cascade,
  admin_id uuid not null references public.admin_accounts(id),
  created_at timestamptz not null default now(),
  assertion jsonb not null -- WebAuthn assertion metadata stored for audit
);

-- Public keys table for multiple issuers
create table if not exists public.issuer_public_keys (
  key_id text primary key,
  public_b64 text not null,
  enabled boolean not null default true
);

-- Enable RLS on all tables
alter table public.certificates enable row level security;
alter table public.certificate_events enable row level security;
alter table public.ledger enable row level security;
alter table public.admin_accounts enable row level security;
alter table public.admin_credentials enable row level security;
alter table public.hv_transactions enable row level security;
alter table public.hv_approvals enable row level security;
alter table public.issuer_public_keys enable row level security;

-- RLS Policies
create policy cert_read on public.certificates for select
  to authenticated using (true);

create policy cert_event_read on public.certificate_events for select
  to authenticated using (true);

create policy cert_write on public.certificates for all
  to service_role using (true) with check (true);

create policy cert_event_write on public.certificate_events for all
  to service_role using (true) with check (true);

create policy ledger_ro on public.ledger for select
  to authenticated using (true);

create policy ledger_srv on public.ledger for insert
  to service_role with check (true);

create policy admin_read on public.admin_accounts for select to service_role using (true);
create policy admin_creds_rw on public.admin_credentials for all to service_role using (true) with check (true);

create policy hv_read on public.hv_transactions for select to authenticated using (true);
create policy hv_rw_srv on public.hv_transactions for all to service_role using (true) with check (true);

create policy hvap_rw_srv on public.hv_approvals for all to service_role using (true) with check (true);

create policy keys_ro on public.issuer_public_keys for select to authenticated using (true);
create policy keys_srv on public.issuer_public_keys for all to service_role using (true) with check (true);

-- Immutability guard via trigger
create or replace function public.prevent_cert_mutation()
returns trigger language plpgsql as $$
begin
  if tg_op='UPDATE' then
    raise exception 'Certificates are immutable. Use revoke to change status.';
  end if;
  return null;
end $$;

drop trigger if exists trg_prevent_cert_update on public.certificates;
create trigger trg_prevent_cert_update
before update on public.certificates
for each row execute function public.prevent_cert_mutation();

-- Hash chaining via trigger
create or replace function public.ledger_before_insert()
returns trigger language plpgsql as $$
declare
  v_prev text;
begin
  select l.row_hash into v_prev
  from public.ledger l
  where l.subject = new.subject
  order by l.created_at desc
  limit 1;

  new.prev_hash := v_prev;

  new.row_hash := encode(
    digest(
      coalesce(to_char(new.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),'')
      || new.type || new.subject || coalesce(new.payload::text,'')
      || coalesce(new.prev_hash,''),
      'sha256'
    ),
    'hex'
  );
  return new;
end $$;

drop trigger if exists trg_ledger_before_insert on public.ledger;
create trigger trg_ledger_before_insert
before insert on public.ledger
for each row execute function public.ledger_before_insert();

-- Helper view for public verification with limited fields
create or replace view public.certificates_public as
select id, created_at, cert_type, subject_name, expires_at, issued_by, key_id, signatures, digest, status, anchor_root
from public.certificates;
