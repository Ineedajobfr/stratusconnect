-- ========================================
-- APPLY ALL OPERATOR TERMINAL MIGRATIONS
-- Run this in Supabase SQL Editor to apply all migrations at once
-- ========================================

-- MIGRATION 1: Image Upload Security System
-- ========================================

-- Create image_uploads table for audit trail
CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_hash TEXT NOT NULL,
  file_type TEXT NOT NULL,
  ai_classification JSONB DEFAULT '{}'::jsonb,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  storage_path TEXT,
  public_url TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS image_moderation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES image_uploads(id) ON DELETE CASCADE,
  model_version TEXT,
  confidence_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  processing_time_ms INTEGER,
  server_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_image_uploads_user_id ON image_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_image_uploads_status ON image_uploads(moderation_status);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);

-- ========================================
-- MIGRATION 2: Fix Operator Listings
-- ========================================

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  aircraft_id UUID,
  aircraft_model_id UUID,
  title TEXT,
  description TEXT,
  listing_type TEXT DEFAULT 'charter' CHECK (listing_type IN ('sale', 'charter', 'empty_leg')),
  category TEXT CHECK (category IN ('heavy', 'medium', 'light', 'turboprop', 'helicopter')),
  asking_price NUMERIC,
  original_price NUMERIC,
  discount_percent INTEGER,
  currency TEXT DEFAULT 'USD',
  departure_location TEXT,
  destination TEXT,
  departure_date TIMESTAMPTZ,
  arrival_date TIMESTAMPTZ,
  passengers INTEGER,
  price NUMERIC,
  departure_airport TEXT,
  destination_airport TEXT,
  dep_time TIMESTAMPTZ,
  arr_time TIMESTAMPTZ,
  seats INTEGER,
  distance_nm INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold', 'expired')),
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aircraft_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('heavy', 'medium', 'light', 'turboprop', 'helicopter')),
  typical_pax INTEGER,
  max_range_nm INTEGER,
  cruise_speed_kts INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(manufacturer, model)
);

-- Enable RLS
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft_models ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Users can view active listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can view own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can create listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can update own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can delete own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Anyone can view aircraft models" ON aircraft_models;

-- Create RLS policies for marketplace_listings
CREATE POLICY "Users can view active listings" ON marketplace_listings FOR SELECT TO authenticated 
USING (status = 'active');

CREATE POLICY "Operators can view own listings" ON marketplace_listings FOR SELECT TO authenticated 
USING (operator_id = auth.uid());

CREATE POLICY "Operators can create listings" ON marketplace_listings FOR INSERT TO authenticated 
WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Operators can update own listings" ON marketplace_listings FOR UPDATE TO authenticated 
USING (operator_id = auth.uid());

CREATE POLICY "Operators can delete own listings" ON marketplace_listings FOR DELETE TO authenticated 
USING (operator_id = auth.uid());

-- Create RLS policies for aircraft_models
CREATE POLICY "Anyone can view aircraft models" ON aircraft_models FOR SELECT TO authenticated 
USING (true);

-- Insert sample aircraft models
INSERT INTO aircraft_models (manufacturer, model, category, typical_pax, max_range_nm, cruise_speed_kts, description) VALUES
('Gulfstream', 'G650ER', 'heavy', 19, 7500, 516, 'Ultra-long-range business jet'),
('Gulfstream', 'G550', 'heavy', 16, 6750, 488, 'Long-range business jet'),
('Bombardier', 'Global 7500', 'heavy', 19, 7700, 516, 'Ultra-long-range business jet'),
('Bombardier', 'Challenger 650', 'heavy', 12, 4000, 488, 'Super-midsize business jet'),
('Cessna', 'Citation X+', 'medium', 12, 3500, 528, 'Fastest business jet'),
('Cessna', 'Citation CJ4', 'light', 10, 2200, 451, 'Light business jet'),
('Embraer', 'Phenom 300E', 'light', 9, 2010, 521, 'Light business jet'),
('Pilatus', 'PC-24', 'light', 8, 2000, 440, 'Super versatile light jet'),
('King Air', '350i', 'turboprop', 11, 1800, 312, 'Turboprop with excellent performance'),
('Piaggio', 'P.180 Avanti', 'turboprop', 9, 1500, 402, 'Fast turboprop')
ON CONFLICT (manufacturer, model) DO NOTHING;

-- ========================================
-- MIGRATION 3: Billing & Transactions
-- ========================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES auth.users(id),
  deal_id UUID,
  booking_id UUID,
  type TEXT NOT NULL CHECK (type IN ('payment', 'payout', 'refund', 'chargeback', 'commission')),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  stripe_payout_id TEXT,
  arrival_date TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commission_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL CHECK (service_type IN ('charter', 'hiring', 'sale')),
  rate_percentage NUMERIC(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Stripe fields to profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='stripe_account_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_account_id TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='payout_frequency') THEN
    ALTER TABLE profiles ADD COLUMN payout_frequency TEXT DEFAULT 'weekly';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Operators can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Brokers can view deal transactions" ON transactions;
DROP POLICY IF EXISTS "Anyone can insert transactions" ON transactions;
DROP POLICY IF EXISTS "Operators can update own transactions" ON transactions;
DROP POLICY IF EXISTS "Operators can view own payouts" ON payouts;
DROP POLICY IF EXISTS "Anyone can insert payouts" ON payouts;
DROP POLICY IF EXISTS "Anyone can view commission rates" ON commission_rates;

-- Create RLS policies for transactions
CREATE POLICY "Operators can view own transactions" ON transactions FOR SELECT TO authenticated 
USING (operator_id = auth.uid());

CREATE POLICY "Brokers can view deal transactions" ON transactions FOR SELECT TO authenticated 
USING (broker_id = auth.uid());

CREATE POLICY "Anyone can insert transactions" ON transactions FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "Operators can update own transactions" ON transactions FOR UPDATE TO authenticated 
USING (operator_id = auth.uid());

-- Create RLS policies for payouts
CREATE POLICY "Operators can view own payouts" ON payouts FOR SELECT TO authenticated 
USING (operator_id = auth.uid());

CREATE POLICY "Anyone can insert payouts" ON payouts FOR INSERT TO authenticated 
WITH CHECK (true);

-- Create RLS policies for commission_rates
CREATE POLICY "Anyone can view commission rates" ON commission_rates FOR SELECT TO authenticated 
USING (is_active = true);

-- Insert commission rates
INSERT INTO commission_rates (service_type, rate_percentage) VALUES
('charter', 7.00),
('hiring', 10.00),
('sale', 3.00)
ON CONFLICT DO NOTHING;

-- ========================================
-- MIGRATION 4: Operator Profile System
-- ========================================

CREATE TABLE IF NOT EXISTS operator_fleet (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  registration TEXT NOT NULL UNIQUE,
  category TEXT CHECK (category IN ('heavy', 'medium', 'light', 'turboprop', 'helicopter')),
  seats INTEGER NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  year_of_manufacture INTEGER,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'in-use', 'maintenance')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add profile columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='company_name') THEN
    ALTER TABLE profiles ADD COLUMN company_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='license_number') THEN
    ALTER TABLE profiles ADD COLUMN license_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email_verified') THEN
    ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone_verified') THEN
    ALTER TABLE profiles ADD COLUMN phone_verified BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='reputation_score') THEN
    ALTER TABLE profiles ADD COLUMN reputation_score NUMERIC DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE operator_fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Operators can view own fleet" ON operator_fleet;
DROP POLICY IF EXISTS "Anyone can view available fleet" ON operator_fleet;
DROP POLICY IF EXISTS "Operators can insert own aircraft" ON operator_fleet;
DROP POLICY IF EXISTS "Operators can update own aircraft" ON operator_fleet;
DROP POLICY IF EXISTS "Operators can delete own aircraft" ON operator_fleet;
DROP POLICY IF EXISTS "Users can view own uploads" ON image_uploads;
DROP POLICY IF EXISTS "Users can insert own uploads" ON image_uploads;
DROP POLICY IF EXISTS "Users can view own moderation logs" ON image_moderation_logs;
DROP POLICY IF EXISTS "Users can view own security events" ON security_events;
DROP POLICY IF EXISTS "Anyone can insert security events" ON security_events;

-- Create RLS policies for operator_fleet
CREATE POLICY "Operators can view own fleet" ON operator_fleet FOR SELECT TO authenticated 
USING (operator_id = auth.uid());

CREATE POLICY "Anyone can view available fleet" ON operator_fleet FOR SELECT TO authenticated 
USING (availability = 'available');

CREATE POLICY "Operators can insert own aircraft" ON operator_fleet FOR INSERT TO authenticated 
WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Operators can update own aircraft" ON operator_fleet FOR UPDATE TO authenticated 
USING (operator_id = auth.uid());

CREATE POLICY "Operators can delete own aircraft" ON operator_fleet FOR DELETE TO authenticated 
USING (operator_id = auth.uid());

-- Create RLS policies for image_uploads
CREATE POLICY "Users can view own uploads" ON image_uploads FOR SELECT TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own uploads" ON image_uploads FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Create RLS policies for image_moderation_logs
CREATE POLICY "Users can view own moderation logs" ON image_moderation_logs FOR SELECT TO authenticated 
USING (
  upload_id IN (
    SELECT id FROM image_uploads WHERE user_id = auth.uid()
  )
);

-- Create RLS policies for security_events
CREATE POLICY "Users can view own security events" ON security_events FOR SELECT TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert security events" ON security_events FOR INSERT TO authenticated 
WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON marketplace_listings TO authenticated;
GRANT SELECT ON aircraft_models TO authenticated;
GRANT SELECT, INSERT, UPDATE ON transactions TO authenticated;
GRANT SELECT, INSERT ON payouts TO authenticated;
GRANT SELECT ON commission_rates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON operator_fleet TO authenticated;
GRANT SELECT, INSERT ON image_uploads TO authenticated;
GRANT SELECT, INSERT ON image_moderation_logs TO authenticated;
GRANT SELECT, INSERT ON security_events TO authenticated;

-- ========================================
-- VERIFY MIGRATIONS
-- ========================================

-- Check tables created
SELECT 
  CASE 
    WHEN COUNT(*) = 9 THEN '✅ All 9 tables created successfully'
    ELSE '❌ Missing tables: ' || (9 - COUNT(*))::text
  END as migration_status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'image_uploads',
  'image_moderation_logs',
  'security_events',
  'marketplace_listings',
  'aircraft_models',
  'transactions',
  'payouts',
  'commission_rates',
  'operator_fleet'
);

-- ========================================
-- MIGRATIONS COMPLETE
-- ========================================

SELECT '🎉 All migrations applied successfully! Check the result above.' as status;
