-- ========================================
-- CREATE MARKETPLACE TABLES (COMPLETE VERSION)
-- Creates all missing tables for the marketplace
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CREATE MARKETPLACE_LISTINGS TABLE (IF DOESN'T EXIST)
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  aircraft_id UUID REFERENCES aircraft(id),
  aircraft_model_id UUID,
  title TEXT,
  description TEXT,
  listing_type TEXT DEFAULT 'charter' CHECK (listing_type IN ('sale', 'charter', 'empty_leg')),
  category TEXT CHECK (category IN ('heavy', 'medium', 'light', 'turboprop', 'helicopter')),
  asking_price NUMERIC,
  original_price NUMERIC,
  discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
  currency TEXT DEFAULT 'USD',
  departure_location TEXT,
  destination TEXT,
  departure_date TIMESTAMPTZ,
  arrival_date TIMESTAMPTZ,
  passengers INTEGER,
  flight_hours NUMERIC,
  minimum_bid NUMERIC,
  special_requirements TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold', 'expired')),
  distance_nm INTEGER,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. CREATE AIRCRAFT_MODELS TABLE (IF DOESN'T EXIST)
-- ============================================================================
CREATE TABLE IF NOT EXISTS aircraft_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('heavy', 'medium', 'light', 'turboprop', 'helicopter')),
  typical_pax INTEGER,
  max_range_nm INTEGER,
  cruise_speed_kts INTEGER,
  baggage_capacity_cuft INTEGER,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(manufacturer, model)
);

-- ============================================================================
-- 3. CREATE TRIP_REQUESTS TABLE (IF DOESN'T EXIST)
-- ============================================================================
CREATE TABLE IF NOT EXISTS trip_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_type TEXT DEFAULT 'one-way' CHECK (trip_type IN ('one-way', 'round-trip', 'multi-leg')),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  dep_time TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ,
  legs JSONB DEFAULT '[]'::jsonb,
  pax INTEGER NOT NULL,
  preferred_category TEXT,
  max_budget NUMERIC,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  total_distance_nm INTEGER,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','fulfilled','cancelled')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. CREATE PREFERRED_VENDORS TABLE (IF DOESN'T EXIST)
-- ============================================================================
CREATE TABLE IF NOT EXISTS preferred_vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, operator_id)
);

-- ============================================================================
-- 5. CREATE SAVED_SEARCHES TABLE (IF DOESN'T EXIST)
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_type TEXT NOT NULL CHECK (search_type IN ('aircraft', 'empty_leg', 'trip_request')),
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  notify_on_match BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. ADD SAFETY RATINGS TO PROFILES (IF COLUMNS DON'T EXIST)
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema='public' AND table_name='profiles' AND column_name='argus_rating') THEN
    ALTER TABLE profiles ADD COLUMN argus_rating TEXT CHECK (argus_rating IN ('platinum', 'gold', 'silver', 'not_rated'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema='public' AND table_name='profiles' AND column_name='wyvern_status') THEN
    ALTER TABLE profiles ADD COLUMN wyvern_status TEXT CHECK (wyvern_status IN ('elite', 'certified', 'not_certified'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema='public' AND table_name='profiles' AND column_name='avg_response_time_minutes') THEN
    ALTER TABLE profiles ADD COLUMN avg_response_time_minutes INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema='public' AND table_name='profiles' AND column_name='completion_rate') THEN
    ALTER TABLE profiles ADD COLUMN completion_rate NUMERIC(5,2) CHECK (completion_rate >= 0 AND completion_rate <= 100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema='public' AND table_name='profiles' AND column_name='total_deals_completed') THEN
    ALTER TABLE profiles ADD COLUMN total_deals_completed INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================================================
-- 7. INSERT SAMPLE AIRCRAFT MODELS DATA
-- ============================================================================
INSERT INTO aircraft_models (manufacturer, model, category, typical_pax, max_range_nm, cruise_speed_kts, description) VALUES
  -- Heavy Jets
  ('Gulfstream', 'G650', 'heavy', 14, 7000, 516, 'Long-range luxury business jet'),
  ('Gulfstream', 'G550', 'heavy', 14, 6750, 488, 'Ultra-long-range business jet'),
  ('Bombardier', 'Global 7500', 'heavy', 17, 7700, 516, 'Industry-leading range'),
  ('Bombardier', 'Global 6000', 'heavy', 13, 6000, 488, 'High-performance long-range jet'),
  ('Dassault', 'Falcon 8X', 'heavy', 12, 6450, 488, 'Tri-engine ultra-long-range jet'),
  ('Boeing', 'BBJ MAX', 'heavy', 25, 6640, 470, 'Boeing Business Jet'),
  
  -- Medium Jets
  ('Cessna', 'Citation X', 'medium', 8, 3242, 527, 'Fastest civilian aircraft'),
  ('Bombardier', 'Challenger 350', 'medium', 10, 3200, 470, 'Super mid-size business jet'),
  ('Gulfstream', 'G280', 'medium', 10, 3600, 482, 'Super mid-size jet'),
  ('Embraer', 'Praetor 600', 'medium', 12, 4018, 466, 'Disruptive super midsize jet'),
  ('Dassault', 'Falcon 2000', 'medium', 10, 3350, 482, 'Versatile business jet'),
  
  -- Light Jets
  ('Cessna', 'Citation CJ4', 'light', 7, 2165, 451, 'Best-selling light business jet'),
  ('Embraer', 'Phenom 300', 'light', 8, 2010, 453, 'Most delivered light jet'),
  ('Pilatus', 'PC-24', 'light', 8, 2000, 440, 'Super versatile jet'),
  ('HondaJet', 'Elite S', 'light', 6, 1547, 422, 'Advanced very light jet'),
  ('Cessna', 'Citation M2', 'light', 6, 1550, 404, 'Entry-level light jet'),
  
  -- Turboprops
  ('Pilatus', 'PC-12', 'turboprop', 9, 1845, 285, 'Versatile single-engine turboprop'),
  ('Beechcraft', 'King Air 350', 'turboprop', 11, 1806, 312, 'Iconic twin-engine turboprop'),
  ('Daher', 'TBM 960', 'turboprop', 6, 1730, 330, 'High-performance turboprop'),
  ('Cessna', 'Caravan', 'turboprop', 14, 1070, 186, 'Utility turboprop'),
  
  -- Helicopters
  ('Airbus', 'H145', 'helicopter', 8, 370, 134, 'Twin-engine multi-purpose helicopter'),
  ('Sikorsky', 'S-76', 'helicopter', 12, 473, 155, 'Medium twin-engine helicopter'),
  ('Bell', '429', 'helicopter', 7, 373, 142, 'Light twin-engine helicopter'),
  ('Leonardo', 'AW139', 'helicopter', 15, 573, 165, 'Medium twin-engine helicopter')
ON CONFLICT (manufacturer, model) DO NOTHING;

-- ============================================================================
-- 8. INSERT SAMPLE MARKETPLACE LISTINGS
-- ============================================================================
INSERT INTO marketplace_listings (
  operator_id,
  aircraft_model_id,
  title,
  description,
  listing_type,
  category,
  asking_price,
  currency,
  departure_location,
  destination,
  departure_date,
  passengers,
  status
) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM aircraft_models WHERE manufacturer = 'Gulfstream' AND model = 'G650' LIMIT 1),
    'Gulfstream G650 - New York to London',
    'Luxury long-range business jet available for charter. Fully equipped with latest amenities.',
    'charter',
    'heavy',
    45000,
    'USD',
    'KJFK',
    'EGLL',
    NOW() + INTERVAL '2 days',
    8,
    'active'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM aircraft_models WHERE manufacturer = 'Cessna' AND model = 'Citation X' LIMIT 1),
    'Cessna Citation X - Los Angeles to Chicago',
    'Fast and efficient medium jet perfect for business travel.',
    'charter',
    'medium',
    25000,
    'USD',
    'KLAX',
    'KORD',
    NOW() + INTERVAL '3 days',
    6,
    'active'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM aircraft_models WHERE manufacturer = 'HondaJet' AND model = 'Elite S' LIMIT 1),
    'HondaJet Elite S - Miami to Atlanta',
    'Advanced very light jet with exceptional fuel efficiency.',
    'charter',
    'light',
    15000,
    'USD',
    'KMIA',
    'KATL',
    NOW() + INTERVAL '1 day',
    4,
    'active'
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Marketplace listings RLS
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Everyone can view active listings" ON marketplace_listings;
  DROP POLICY IF EXISTS "Operators can manage own listings" ON marketplace_listings;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create RLS policies
CREATE POLICY "Everyone can view active listings"
ON marketplace_listings FOR SELECT
TO authenticated
USING (status = 'active' OR operator_id = auth.uid());

CREATE POLICY "Operators can manage own listings"
ON marketplace_listings FOR ALL
TO authenticated
USING (operator_id = auth.uid());

-- Trip requests RLS
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view all open trip requests" ON trip_requests;
  DROP POLICY IF EXISTS "Brokers can create trip requests" ON trip_requests;
  DROP POLICY IF EXISTS "Brokers can update own trip requests" ON trip_requests;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can view all open trip requests"
ON trip_requests FOR SELECT
TO authenticated
USING (status = 'open' OR broker_id = auth.uid());

CREATE POLICY "Brokers can create trip requests"
ON trip_requests FOR INSERT
TO authenticated
WITH CHECK (broker_id = auth.uid());

CREATE POLICY "Brokers can update own trip requests"
ON trip_requests FOR UPDATE
TO authenticated
USING (broker_id = auth.uid());

-- Aircraft models RLS (public read)
ALTER TABLE aircraft_models ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Anyone can view aircraft models" ON aircraft_models;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Anyone can view aircraft models"
ON aircraft_models FOR SELECT
TO authenticated
USING (true);

-- Preferred vendors RLS
ALTER TABLE preferred_vendors ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Brokers can manage own preferred vendors" ON preferred_vendors;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Brokers can manage own preferred vendors"
ON preferred_vendors FOR ALL
TO authenticated
USING (broker_id = auth.uid());

-- Saved searches RLS
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage own saved searches" ON saved_searches;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Users can manage own saved searches"
ON saved_searches FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- ============================================================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Aircraft models
CREATE INDEX IF NOT EXISTS idx_aircraft_models_category ON aircraft_models(category);
CREATE INDEX IF NOT EXISTS idx_aircraft_models_manufacturer ON aircraft_models(manufacturer);

-- Marketplace listings
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_listing_type_status ON marketplace_listings(listing_type, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_departure_date ON marketplace_listings(departure_date);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_asking_price ON marketplace_listings(asking_price);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_departure_location ON marketplace_listings(departure_location);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_aircraft_model_id ON marketplace_listings(aircraft_model_id);

-- Trip requests
CREATE INDEX IF NOT EXISTS idx_trip_requests_status ON trip_requests(status);
CREATE INDEX IF NOT EXISTS idx_trip_requests_broker_id ON trip_requests(broker_id);
CREATE INDEX IF NOT EXISTS idx_trip_requests_trip_type ON trip_requests(trip_type);
CREATE INDEX IF NOT EXISTS idx_trip_requests_origin ON trip_requests(origin);
CREATE INDEX IF NOT EXISTS idx_trip_requests_destination ON trip_requests(destination);
CREATE INDEX IF NOT EXISTS idx_trip_requests_dep_time ON trip_requests(dep_time);

-- Preferred vendors
CREATE INDEX IF NOT EXISTS idx_preferred_vendors_broker ON preferred_vendors(broker_id);
CREATE INDEX IF NOT EXISTS idx_preferred_vendors_operator ON preferred_vendors(operator_id);

-- Saved searches
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);

-- ============================================================================
-- 11. GRANT PERMISSIONS
-- ============================================================================
DO $$
BEGIN
  -- Grant on tables if they exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='aircraft_models') THEN
    GRANT SELECT ON aircraft_models TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='trip_requests') THEN
    GRANT SELECT, INSERT, UPDATE ON trip_requests TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='marketplace_listings') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON marketplace_listings TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='preferred_vendors') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON preferred_vendors TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='saved_searches') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON saved_searches TO authenticated;
  END IF;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

