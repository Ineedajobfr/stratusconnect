-- ========================================
-- SAFE MIGRATION - APPLIES ALL OPERATOR TERMINAL FEATURES
-- This version checks existing schema and only adds what's missing
-- ========================================

-- Step 1: Create new tables (safe with IF NOT EXISTS)
-- ========================================

CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_hash TEXT NOT NULL,
  file_type TEXT NOT NULL,
  ai_classification JSONB DEFAULT '{}'::jsonb,
  moderation_status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  storage_path TEXT,
  public_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS image_moderation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES image_uploads(id) ON DELETE CASCADE,
  model_version TEXT,
  confidence_scores JSONB DEFAULT '{}'::jsonb,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  severity TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aircraft_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL,
  typical_pax INTEGER,
  max_range_nm INTEGER,
  cruise_speed_kts INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(manufacturer, model)
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES auth.users(id),
  deal_id UUID,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  description TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  stripe_payout_id TEXT,
  arrival_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commission_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL,
  rate_percentage NUMERIC(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS operator_fleet (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  registration TEXT NOT NULL UNIQUE,
  category TEXT,
  seats INTEGER NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  availability TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add columns to existing tables
-- ========================================

DO $$
BEGIN
  -- Add columns to marketplace_listings if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='operator_id') THEN
    ALTER TABLE marketplace_listings ADD COLUMN operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='title') THEN
    ALTER TABLE marketplace_listings ADD COLUMN title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='description') THEN
    ALTER TABLE marketplace_listings ADD COLUMN description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='price') THEN
    ALTER TABLE marketplace_listings ADD COLUMN price NUMERIC;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='currency') THEN
    ALTER TABLE marketplace_listings ADD COLUMN currency TEXT DEFAULT 'USD';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='departure_airport') THEN
    ALTER TABLE marketplace_listings ADD COLUMN departure_airport TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='destination_airport') THEN
    ALTER TABLE marketplace_listings ADD COLUMN destination_airport TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='dep_time') THEN
    ALTER TABLE marketplace_listings ADD COLUMN dep_time TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='seats') THEN
    ALTER TABLE marketplace_listings ADD COLUMN seats INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='status') THEN
    ALTER TABLE marketplace_listings ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='view_count') THEN
    ALTER TABLE marketplace_listings ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='inquiry_count') THEN
    ALTER TABLE marketplace_listings ADD COLUMN inquiry_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='marketplace_listings' AND column_name='metadata') THEN
    ALTER TABLE marketplace_listings ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- Add columns to profiles table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='company_name') THEN
    ALTER TABLE profiles ADD COLUMN company_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='stripe_account_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_account_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email_verified') THEN
    ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='reputation_score') THEN
    ALTER TABLE profiles ADD COLUMN reputation_score NUMERIC DEFAULT 0;
  END IF;
END $$;

-- Step 3: Enable RLS on all tables
-- ========================================

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies (safe with IF EXISTS)
-- ========================================

DROP POLICY IF EXISTS "Users can view active listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can view own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can create listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can update own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can delete own listings" ON marketplace_listings;

DROP POLICY IF EXISTS "Anyone can view aircraft models" ON aircraft_models;

DROP POLICY IF EXISTS "Operators can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Brokers can view deal transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can insert transactions" ON transactions;

DROP POLICY IF EXISTS "Operators can view own payouts" ON payouts;
DROP POLICY IF EXISTS "Anyone can insert payouts" ON payouts;

DROP POLICY IF EXISTS "Anyone can view commission rates" ON commission_rates;

DROP POLICY IF EXISTS "Operators can view own fleet" ON operator_fleet;
DROP POLICY IF EXISTS "Operators can insert own aircraft" ON operator_fleet;
DROP POLICY IF EXISTS "Operators can update own aircraft" ON operator_fleet;

DROP POLICY IF EXISTS "Users can view own uploads" ON image_uploads;
DROP POLICY IF EXISTS "Users can insert own uploads" ON image_uploads;

DROP POLICY IF EXISTS "Users can view own security events" ON security_events;
DROP POLICY IF EXISTS "Anyone can insert security events" ON security_events;

-- Step 5: Create RLS policies
-- ========================================

-- Marketplace Listings Policies
CREATE POLICY "Users can view active listings" ON marketplace_listings 
  FOR SELECT TO authenticated 
  USING (status = 'active');

CREATE POLICY "Operators can view own listings" ON marketplace_listings 
  FOR SELECT TO authenticated 
  USING (operator_id = auth.uid());

CREATE POLICY "Operators can create listings" ON marketplace_listings 
  FOR INSERT TO authenticated 
  WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Operators can update own listings" ON marketplace_listings 
  FOR UPDATE TO authenticated 
  USING (operator_id = auth.uid());

CREATE POLICY "Operators can delete own listings" ON marketplace_listings 
  FOR DELETE TO authenticated 
  USING (operator_id = auth.uid());

-- Aircraft Models Policies
CREATE POLICY "Anyone can view aircraft models" ON aircraft_models 
  FOR SELECT TO authenticated 
  USING (true);

-- Transactions Policies
CREATE POLICY "Operators can view own transactions" ON transactions 
  FOR SELECT TO authenticated 
  USING (operator_id = auth.uid());

CREATE POLICY "Brokers can view deal transactions" ON transactions 
  FOR SELECT TO authenticated 
  USING (broker_id = auth.uid());

CREATE POLICY "Anyone can insert transactions" ON transactions 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Payouts Policies
CREATE POLICY "Operators can view own payouts" ON payouts 
  FOR SELECT TO authenticated 
  USING (operator_id = auth.uid());

CREATE POLICY "Anyone can insert payouts" ON payouts 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Commission Rates Policies
CREATE POLICY "Anyone can view commission rates" ON commission_rates 
  FOR SELECT TO authenticated 
  USING (is_active = true);

-- Operator Fleet Policies
CREATE POLICY "Operators can view own fleet" ON operator_fleet 
  FOR SELECT TO authenticated 
  USING (operator_id = auth.uid());

CREATE POLICY "Operators can insert own aircraft" ON operator_fleet 
  FOR INSERT TO authenticated 
  WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Operators can update own aircraft" ON operator_fleet 
  FOR UPDATE TO authenticated 
  USING (operator_id = auth.uid());

-- Image Uploads Policies
CREATE POLICY "Users can view own uploads" ON image_uploads 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own uploads" ON image_uploads 
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Security Events Policies
CREATE POLICY "Users can view own security events" ON security_events 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert security events" ON security_events 
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Step 6: Insert sample data
-- ========================================

-- Insert aircraft models (safe with ON CONFLICT)
INSERT INTO aircraft_models (manufacturer, model, category, typical_pax, max_range_nm, cruise_speed_kts, description) VALUES
('Gulfstream', 'G650ER', 'heavy', 19, 7500, 516, 'Ultra-long-range business jet'),
('Gulfstream', 'G550', 'heavy', 16, 6750, 488, 'Long-range business jet'),
('Bombardier', 'Global 7500', 'heavy', 19, 7700, 516, 'Ultra-long-range business jet'),
('Bombardier', 'Challenger 650', 'heavy', 12, 4000, 488, 'Super-midsize business jet'),
('Cessna', 'Citation X+', 'medium', 12, 3500, 528, 'Fastest business jet'),
('Cessna', 'Citation CJ4', 'light', 10, 2200, 451, 'Light business jet'),
('Embraer', 'Phenom 300E', 'light', 9, 2010, 521, 'Light business jet'),
('Pilatus', 'PC-24', 'light', 8, 2000, 440, 'Super versatile light jet'),
('King Air', '350i', 'turboprop', 11, 1800, 312, 'Turboprop'),
('Piaggio', 'P.180 Avanti', 'turboprop', 9, 1500, 402, 'Fast turboprop')
ON CONFLICT (manufacturer, model) DO NOTHING;

-- Insert commission rates (safe with ON CONFLICT)
INSERT INTO commission_rates (service_type, rate_percentage) VALUES
('charter', 7.00),
('hiring', 10.00),
('sale', 3.00)
ON CONFLICT DO NOTHING;

-- Step 7: Grant permissions
-- ========================================

GRANT SELECT, INSERT, UPDATE, DELETE ON marketplace_listings TO authenticated;
GRANT SELECT ON aircraft_models TO authenticated;
GRANT SELECT, INSERT, UPDATE ON transactions TO authenticated;
GRANT SELECT, INSERT ON payouts TO authenticated;
GRANT SELECT ON commission_rates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON operator_fleet TO authenticated;
GRANT SELECT, INSERT ON image_uploads TO authenticated;
GRANT SELECT, INSERT ON security_events TO authenticated;

-- Step 8: Create indexes for performance
-- ========================================

CREATE INDEX IF NOT EXISTS idx_marketplace_listings_operator_id ON marketplace_listings(operator_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_transactions_operator_id ON transactions(operator_id);
CREATE INDEX IF NOT EXISTS idx_payouts_operator_id ON payouts(operator_id);
CREATE INDEX IF NOT EXISTS idx_operator_fleet_operator_id ON operator_fleet(operator_id);
CREATE INDEX IF NOT EXISTS idx_image_uploads_user_id ON image_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);

-- ========================================
-- VERIFY MIGRATION SUCCESS
-- ========================================

SELECT 
  CASE 
    WHEN COUNT(*) >= 8 THEN '✅ Migration successful! ' || COUNT(*)::text || ' tables ready'
    ELSE '⚠️ Only ' || COUNT(*)::text || ' tables found - check for errors above'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'image_uploads',
  'security_events',
  'marketplace_listings',
  'aircraft_models',
  'transactions',
  'payouts',
  'commission_rates',
  'operator_fleet'
);

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

SELECT '🎉 Operator Terminal database setup complete!' as message;
SELECT '📝 Next step: Create aircraft-images storage bucket in Supabase Storage' as next_action;
