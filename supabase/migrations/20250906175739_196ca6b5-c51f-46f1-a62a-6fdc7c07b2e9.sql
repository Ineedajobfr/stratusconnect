-- Broker Demo Schema
-- USERS
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role text CHECK (role IN ('admin','broker','operator','pilot','crew')) NOT NULL,
  full_name text NOT NULL,
  company text,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- AIRCRAFT AND MARKET
CREATE TABLE IF NOT EXISTS operators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  country text,
  fleet_size int DEFAULT 0,
  verified boolean DEFAULT false,
  aoc_expiry date
);

CREATE TABLE IF NOT EXISTS aircraft (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id uuid REFERENCES operators(id) ON DELETE CASCADE,
  type text NOT NULL,
  tail text UNIQUE NOT NULL,
  base text,
  status text CHECK (status IN ('active','maintenance','inactive')) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  aircraft_id uuid REFERENCES aircraft(id) ON DELETE CASCADE,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_at timestamptz NOT NULL,
  price_gbp numeric(12,2) NOT NULL,
  is_empty_leg boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- TRUST
CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type text CHECK (entity_type IN ('operator','broker','pilot')) NOT NULL,
  entity_id uuid NOT NULL,
  status text CHECK (status IN ('verified','pending','rejected')) NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  reviewed_at timestamptz
);

-- REQUESTS AND QUOTES
CREATE TABLE IF NOT EXISTS charter_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id uuid REFERENCES profiles(id),
  client_name text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  departure_at timestamptz NOT NULL,
  status text CHECK (status IN ('awaiting_quotes','operator_responded','pending_approval','confirmed','cancelled')) DEFAULT 'awaiting_quotes',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id uuid REFERENCES charter_requests(id) ON DELETE CASCADE,
  operator_id uuid REFERENCES operators(id) ON DELETE SET NULL,
  aircraft_id uuid REFERENCES aircraft(id) ON DELETE SET NULL,
  amount_gbp numeric(12,2) NOT NULL,
  valid_until timestamptz NOT NULL,
  status text CHECK (status IN ('sent','accepted','rejected','expired')) DEFAULT 'sent',
  notes text
);

-- MESSAGING
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_type text CHECK (thread_type IN ('operator','client')) NOT NULL,
  thread_ref uuid NOT NULL,
  sender_profile_id uuid REFERENCES profiles(id),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- DIRECTORY
CREATE TABLE IF NOT EXISTS crew_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  role text CHECK (role IN ('captain','first_officer','cabin_crew')) NOT NULL,
  hours int DEFAULT 0,
  licences text[],
  verified boolean DEFAULT false
);

-- ANALYTICS
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id uuid REFERENCES profiles(id),
  deals_count int DEFAULT 0,
  revenue_gbp numeric(12,2) DEFAULT 0,
  avg_quote_response_seconds int DEFAULT 0,
  month date NOT NULL
);

CREATE TABLE IF NOT EXISTS market_trends (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric text NOT NULL,
  value numeric(12,2) NOT NULL,
  note text,
  month date NOT NULL
);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id uuid REFERENCES charter_requests(id),
  quote_id uuid REFERENCES quotes(id),
  total_gbp numeric(12,2) NOT NULL,
  commission_rate numeric(5,2) DEFAULT 10.0,
  commission_gbp numeric(12,2) GENERATED ALWAYS AS (round(total_gbp * commission_rate / 100.0, 2)) STORED,
  status text CHECK (status IN ('paid','pending')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- ALERTS
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  body text,
  severity text CHECK (severity IN ('info','success','warning','critical')) DEFAULT 'info',
  created_at timestamptz DEFAULT now(),
  seen boolean DEFAULT false
);

-- SAVED JETS
CREATE TABLE IF NOT EXISTS saved_jets (
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  aircraft_id uuid REFERENCES aircraft(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (profile_id, aircraft_id)
);

-- PROFILE SETTINGS
CREATE TABLE IF NOT EXISTS broker_settings (
  broker_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_routes text[],
  commission_standard numeric(5,2) DEFAULT 10.0,
  commission_repeat numeric(5,2) DEFAULT 8.0
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE charter_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jets ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Demo policies, permissive for now
CREATE POLICY "read_all_demo" ON marketplace_listings FOR SELECT USING (true);
CREATE POLICY "read_all_aircraft" ON aircraft FOR SELECT USING (true);
CREATE POLICY "read_all_ops" ON operators FOR SELECT USING (true);

CREATE POLICY "broker_own_requests" ON charter_requests
  FOR ALL USING (broker_id = auth.uid()) WITH CHECK (broker_id = auth.uid());

CREATE POLICY "broker_own_saves" ON saved_jets
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "broker_own_alerts" ON alerts
  FOR ALL USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

CREATE POLICY "quotes_visible" ON quotes FOR SELECT USING (true);
CREATE POLICY "quotes_create" ON quotes FOR INSERT WITH CHECK (true);

-- Demo broker
INSERT INTO profiles (id, role, full_name, company, email)
VALUES ('11111111-1111-1111-1111-111111111111','broker','Alex Smith','Global Jet Partners','alex@globaljet.com')
ON CONFLICT DO NOTHING;

-- Operators
INSERT INTO operators (id, name, country, fleet_size, verified, aoc_expiry) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','SkyLux Aviation','United Kingdom',12,true,'2026-12-31'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','JetOne Europe','Switzerland',8,true,'2026-08-14')
ON CONFLICT DO NOTHING;

-- Aircraft
INSERT INTO aircraft (id, operator_id, type, tail, base, status) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','Gulfstream G650','G-GLUX','LTN','active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','Falcon 7X','HB-JOE','GVA','active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','Citation XLS','G-CXLS','FAB','active')
ON CONFLICT DO NOTHING;

-- Marketplace
INSERT INTO marketplace_listings (aircraft_id, origin, destination, departure_at, price_gbp, is_empty_leg) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1','LTN','NCE','2025-09-12 09:30+00',48000,false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3','FAB','GVA','2025-09-13 07:00+00',14500,false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','CDG','DXB','2025-09-15 10:00+00',72000,true)
ON CONFLICT DO NOTHING;

-- Trust
INSERT INTO verifications (entity_type, entity_id, status, details, reviewed_at) VALUES
  ('operator','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','verified','{"aoc":"on file","insurance_expiry":"2026-12-31"}', now()),
  ('operator','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','verified','{"aoc":"on file"}', now())
ON CONFLICT DO NOTHING;

-- Requests
INSERT INTO charter_requests (id, broker_id, client_name, origin, destination, departure_at, status) VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1','11111111-1111-1111-1111-111111111111','Private Family','LTN','IBZ','2025-09-12 12:00+00','awaiting_quotes'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2','11111111-1111-1111-1111-111111111111','Hedge Fund','FAB','JFK','2025-09-14 08:00+00','operator_responded'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3','11111111-1111-1111-1111-111111111111','Royal Delegation','GVA','RUH','2025-09-16 05:30+00','pending_approval')
ON CONFLICT DO NOTHING;

-- Quotes
INSERT INTO quotes (request_id, operator_id, aircraft_id, amount_gbp, valid_until, status, notes) VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',13800,'2025-09-10 23:59+00','sent','Includes light catering'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',86500,'2025-09-12 23:59+00','sent','Crew confirmed'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',94200,'2025-09-15 23:59+00','sent','Slots held 24h')
ON CONFLICT DO NOTHING;

-- Messages
INSERT INTO messages (thread_type, thread_ref, sender_profile_id, text) VALUES
  ('operator','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','11111111-1111-1111-1111-111111111111','Can you confirm crew availability for the 12th'),
  ('client','cccccccc-cccc-cccc-cccc-ccccccccccc2','11111111-1111-1111-1111-111111111111','Please confirm catering and transfer in New York'),
  ('operator','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','11111111-1111-1111-1111-111111111111','Empty leg open, can discount if flexible')
ON CONFLICT DO NOTHING;

-- Directory crew
INSERT INTO crew_profiles (full_name, role, hours, licences, verified) VALUES
  ('James Morgan','captain',4200, array['EASA ATPL','Gulfstream type'], true),
  ('A. Patel','cabin_crew',1600, array['Gulfstream','Falcon'], true)
ON CONFLICT DO NOTHING;

-- Analytics
INSERT INTO performance_metrics (broker_id, deals_count, revenue_gbp, avg_quote_response_seconds, month) VALUES
  ('11111111-1111-1111-1111-111111111111',12,540000,4920,'2025-09-01')
ON CONFLICT DO NOTHING;

INSERT INTO market_trends (metric, value, note, month) VALUES
  ('demand_dubai_pct',14,'Route demand up for DXB','2025-09-01')
ON CONFLICT DO NOTHING;

-- Transactions
INSERT INTO deals (request_id, quote_id, total_gbp, commission_rate, status) VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1',(SELECT id FROM quotes q WHERE q.request_id='cccccccc-cccc-cccc-cccc-ccccccccccc1' LIMIT 1),13800,10,'paid'),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3',(SELECT id FROM quotes q WHERE q.request_id='cccccccc-cccc-cccc-cccc-ccccccccccc3' LIMIT 1),94200,10,'pending')
ON CONFLICT DO NOTHING;

-- Alerts
INSERT INTO alerts (profile_id, title, body, severity) VALUES
  ('11111111-1111-1111-1111-111111111111','New request: GVA to RUH','VIP client inquiry','info'),
  ('11111111-1111-1111-1111-111111111111','Commission paid','£1,380 received for Ibiza charter','success')
ON CONFLICT DO NOTHING;

-- Saved jets
INSERT INTO saved_jets (profile_id, aircraft_id) VALUES
  ('11111111-1111-1111-1111-111111111111','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1'),
  ('11111111-1111-1111-1111-111111111111','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2')
ON CONFLICT DO NOTHING;

-- Settings
INSERT INTO broker_settings (broker_id, preferred_routes, commission_standard, commission_repeat)
VALUES ('11111111-1111-1111-1111-111111111111', array['London','Geneva','Dubai'], 10, 8)
ON CONFLICT DO NOTHING;