-- Demo Bots Seed Data - Beta Terminal Testing
-- FCA Compliant Aviation Platform - Realistic Demo Users

-- demo users for beta terminal testing
insert into public.users (id, full_name, email, role, company, is_demo)
values
  (gen_random_uuid(), 'Ethan Broker', 'demo.broker1@stratus.test', 'broker', 'BlueWing Charters', true),
  (gen_random_uuid(), 'Amelia Ops',   'demo.operator1@stratus.test', 'operator', 'AeroOps Ltd', true),
  (gen_random_uuid(), 'Sam Pilot',    'demo.pilot1@stratus.test', 'pilot', 'Freelance', true),
  (gen_random_uuid(), 'Nadia Crew',   'demo.crew1@stratus.test', 'crew', 'CrewOne', true)
on conflict (email) do nothing;

-- sample aircraft for demo operator
insert into public.aircraft (id, tail_number, type, operator_id)
select gen_random_uuid(), 'G550-Demo', 'Gulfstream G550', u.id
from public.users u where u.email = 'demo.operator1@stratus.test'
on conflict (tail_number) do nothing;

-- sample routes for demo testing
insert into public.routes (id, origin, destination, distance_nm)
values
  (gen_random_uuid(), 'LTN', 'NCE', 580),
  (gen_random_uuid(), 'FRA', 'LCY', 345),
  (gen_random_uuid(), 'LHR', 'JFK', 3450),
  (gen_random_uuid(), 'CDG', 'LAX', 5600)
on conflict (origin, destination) do nothing;

-- sample companies for demo users
insert into public.companies (id, name, type, approved)
values
  (gen_random_uuid(), 'BlueWing Charters', 'broker', true),
  (gen_random_uuid(), 'AeroOps Ltd', 'operator', true),
  (gen_random_uuid(), 'CrewOne', 'crew', true)
on conflict (name) do nothing;

-- sample RFQs for testing
insert into public.requests (id, origin, destination, departure_date, aircraft_type, passengers, broker_company_id, status)
select 
  gen_random_uuid(),
  'London Luton',
  'Nice',
  '2025-10-10',
  'Gulfstream G550',
  8,
  c.id,
  'open'
from public.companies c where c.name = 'BlueWing Charters'
on conflict do nothing;

-- sample quotes for testing
insert into public.quotes (id, request_id, operator_company_id, price, currency, status)
select 
  gen_random_uuid(),
  r.id,
  c.id,
  14500 + floor(random() * 1500),
  'GBP',
  'pending'
from public.requests r
cross join public.companies c 
where c.name = 'AeroOps Ltd'
on conflict do nothing;

