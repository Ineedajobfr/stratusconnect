-- ========================================
-- MARKETPLACE ENHANCEMENTS
-- Comprehensive marketplace with multi-leg trips, aircraft directory, 
-- empty legs, safety ratings, and trust system
-- 
-- COMPATIBLE WITH EXISTING SCHEMA
-- Uses existing column names where they exist
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. AIRCRAFT MODELS REFERENCE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS aircraft_models (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
-- 2. CREATE/EXTEND TRIP_REQUESTS FOR MULTI-LEG SUPPORT
-- ============================================================================

-- First, create the base table if it doesn't exist
CREATE TABLE IF NOT EXISTS trip_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  dep_time TIMESTAMPTZ NOT NULL,
  pax INTEGER NOT NULL,
  preferred_category TEXT,
  max_budget NUMERIC,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','fulfilled','cancelled')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Now add the new columns if they don't exist
DO $$
BEGIN
  -- Add trip type column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='trip_requests' AND column_name='trip_type') THEN
    ALTER TABLE trip_requests ADD COLUMN trip_type TEXT DEFAULT 'one-way' 
      CHECK (trip_type IN ('one-way', 'round-trip', 'multi-leg'));
  END IF;
  
  -- Add legs JSONB for multi-leg trips
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='trip_requests' AND column_name='legs') THEN
    ALTER TABLE trip_requests ADD COLUMN legs JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  -- Add return date for round trips
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='trip_requests' AND column_name='return_date') THEN
    ALTER TABLE trip_requests ADD COLUMN return_date TIMESTAMPTZ;
  END IF;
  
  -- Add total distance
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='trip_requests' AND column_name='total_distance_nm') THEN
    ALTER TABLE trip_requests ADD COLUMN total_distance_nm INTEGER;
  END IF;
  
  -- Add urgency level
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='trip_requests' AND column_name='urgency') THEN
    ALTER TABLE trip_requests ADD COLUMN urgency TEXT DEFAULT 'normal'
      CHECK (urgency IN ('low', 'normal', 'high', 'urgent'));
  END IF;
END $$;

-- ============================================================================
-- 3. CREATE/EXTEND MARKETPLACE_LISTINGS FOR EMPTY LEGS
-- ============================================================================

-- First, create the base table if it doesn't exist (using existing schema column names)
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  aircraft_id UUID,
  title TEXT,
  description TEXT,
  listing_type TEXT CHECK (listing_type IN ('sale','charter','empty_leg','block_hours')),
  asking_price NUMERIC,
  minimum_bid NUMERIC,
  currency TEXT DEFAULT 'USD',
  departure_location TEXT,
  destination TEXT,
  departure_date TIMESTAMPTZ,
  arrival_date TIMESTAMPTZ,
  passengers INTEGER,
  flight_hours NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'closed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Now add the new columns if they don't exist
DO $$
BEGIN
  -- Add active boolean column for easier querying (based on status)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='active') THEN
    ALTER TABLE marketplace_listings ADD COLUMN active BOOLEAN DEFAULT true;
    -- Sync active with status column if status exists
    UPDATE marketplace_listings SET active = (status = 'active') WHERE status IS NOT NULL;
  END IF;

  -- Add discount percentage for empty legs
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='discount_percent') THEN
    ALTER TABLE marketplace_listings ADD COLUMN discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100);
  END IF;
  
  -- Add original price (before discount)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='original_price') THEN
    ALTER TABLE marketplace_listings ADD COLUMN original_price NUMERIC;
  END IF;
  
  -- Add aircraft model reference
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='aircraft_model_id') THEN
    ALTER TABLE marketplace_listings ADD COLUMN aircraft_model_id UUID REFERENCES aircraft_models(id);
  END IF;
  
  -- Add category for filtering
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='category') THEN
    ALTER TABLE marketplace_listings ADD COLUMN category TEXT 
      CHECK (category IN ('heavy', 'medium', 'light', 'turboprop', 'helicopter'));
  END IF;
  
  -- Add distance for calculations
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='distance_nm') THEN
    ALTER TABLE marketplace_listings ADD COLUMN distance_nm INTEGER;
  END IF;
  
  -- Add views counter
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='view_count') THEN
    ALTER TABLE marketplace_listings ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
  
  -- Add inquiry counter
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='inquiry_count') THEN
    ALTER TABLE marketplace_listings ADD COLUMN inquiry_count INTEGER DEFAULT 0;
  END IF;
  
  -- Add expiry date for listings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='expires_at') THEN
    ALTER TABLE marketplace_listings ADD COLUMN expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- Trigger to sync active column with status column
CREATE OR REPLACE FUNCTION sync_marketplace_listing_active()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync active boolean with status text
  IF NEW.status IS NOT NULL THEN
    NEW.active := (NEW.status = 'active');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_marketplace_listing_active ON marketplace_listings;
CREATE TRIGGER trg_sync_marketplace_listing_active
  BEFORE INSERT OR UPDATE ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION sync_marketplace_listing_active();

-- ============================================================================
-- 4. SAFETY RATINGS & CERTIFICATIONS
-- ============================================================================
DO $$
BEGIN
  -- Add ARGUS rating to profiles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='argus_rating') THEN
    ALTER TABLE profiles ADD COLUMN argus_rating TEXT 
      CHECK (argus_rating IN ('platinum', 'gold', 'silver', 'not_rated'));
  END IF;
  
  -- Add WYVERN status to profiles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='wyvern_status') THEN
    ALTER TABLE profiles ADD COLUMN wyvern_status TEXT 
      CHECK (wyvern_status IN ('elite', 'certified', 'not_certified'));
  END IF;
  
  -- Add response time tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='avg_response_time_minutes') THEN
    ALTER TABLE profiles ADD COLUMN avg_response_time_minutes INTEGER;
  END IF;
  
  -- Add completion rate
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='completion_rate') THEN
    ALTER TABLE profiles ADD COLUMN completion_rate NUMERIC(5,2) CHECK (completion_rate >= 0 AND completion_rate <= 100);
  END IF;
  
  -- Add total completed deals
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='total_deals_completed') THEN
    ALTER TABLE profiles ADD COLUMN total_deals_completed INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================================================
-- 5. PREFERRED VENDORS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS preferred_vendors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, operator_id)
);

-- ============================================================================
-- 6. SAVED SEARCHES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_type TEXT NOT NULL CHECK (search_type IN ('aircraft', 'empty_leg', 'trip_request')),
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  notify_on_match BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. AIRPORT DIRECTORY CACHE
-- ============================================================================
CREATE TABLE IF NOT EXISTS airports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  icao_code TEXT UNIQUE,
  iata_code TEXT,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  timezone TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. QUOTES TABLE (if not exists from quote_loop_system)
-- ============================================================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_request_id UUID REFERENCES trip_requests(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  aircraft_id UUID,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  valid_until TIMESTAMPTZ,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'withdrawn')),
  response_time_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8b. USER REPUTATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_reputation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rated_by UUID REFERENCES auth.users(id),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  transaction_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8c. SECURITY EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. MARKETPLACE VIEWS/INQUIRIES TRACKING
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketplace_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('view', 'inquiry', 'quote_request', 'booking')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Aircraft models
CREATE INDEX IF NOT EXISTS idx_aircraft_models_category ON aircraft_models(category);
CREATE INDEX IF NOT EXISTS idx_aircraft_models_manufacturer ON aircraft_models(manufacturer);

-- Trip requests
CREATE INDEX IF NOT EXISTS idx_trip_requests_trip_type ON trip_requests(trip_type);
CREATE INDEX IF NOT EXISTS idx_trip_requests_origin ON trip_requests(origin);
CREATE INDEX IF NOT EXISTS idx_trip_requests_destination ON trip_requests(destination);
CREATE INDEX IF NOT EXISTS idx_trip_requests_dep_time ON trip_requests(dep_time);
CREATE INDEX IF NOT EXISTS idx_trip_requests_urgency ON trip_requests(urgency);

-- Marketplace listings (using existing column names)
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_listing_type_status ON marketplace_listings(listing_type, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_departure_date ON marketplace_listings(departure_date);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_asking_price ON marketplace_listings(asking_price);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_expires_at ON marketplace_listings(expires_at);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_departure_location ON marketplace_listings(departure_location);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_operator ON marketplace_listings(operator_id);

-- Quotes (note: existing quotes table uses 'request_id' not 'trip_request_id')
CREATE INDEX IF NOT EXISTS idx_quotes_request ON quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_operator ON quotes(operator_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- Preferred vendors
CREATE INDEX IF NOT EXISTS idx_preferred_vendors_broker ON preferred_vendors(broker_id);
CREATE INDEX IF NOT EXISTS idx_preferred_vendors_operator ON preferred_vendors(operator_id);

-- Saved searches
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_type ON saved_searches(search_type);

-- Airports (using existing column names: icao, iata, not icao_code, iata_code)
CREATE INDEX IF NOT EXISTS idx_airports_icao ON airports(icao);
CREATE INDEX IF NOT EXISTS idx_airports_iata ON airports(iata);
CREATE INDEX IF NOT EXISTS idx_airports_name ON airports(name);

-- Activity tracking
CREATE INDEX IF NOT EXISTS idx_marketplace_activity_listing ON marketplace_activity(listing_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_activity_type ON marketplace_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_activity_created ON marketplace_activity(created_at);

-- ============================================================================
-- 11. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Trip requests
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view all open trip requests" ON trip_requests;
  DROP POLICY IF EXISTS "Brokers can create trip requests" ON trip_requests;
  DROP POLICY IF EXISTS "Brokers can update own trip requests" ON trip_requests;
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

-- Marketplace listings
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Operators can create listings" ON marketplace_listings;
  DROP POLICY IF EXISTS "Everyone can view active listings" ON marketplace_listings;
  DROP POLICY IF EXISTS "Operators can update own listings" ON marketplace_listings;
  DROP POLICY IF EXISTS "Operators can delete own listings" ON marketplace_listings;
END $$;

CREATE POLICY "Operators can create listings"
ON marketplace_listings FOR INSERT
TO authenticated
WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Everyone can view active listings"
ON marketplace_listings FOR SELECT
TO authenticated
USING (active = true OR operator_id = auth.uid());

CREATE POLICY "Operators can update own listings"
ON marketplace_listings FOR UPDATE
TO authenticated
USING (operator_id = auth.uid());

CREATE POLICY "Operators can delete own listings"
ON marketplace_listings FOR DELETE
TO authenticated
USING (operator_id = auth.uid());

-- Preferred vendors
ALTER TABLE preferred_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brokers can manage own preferred vendors"
ON preferred_vendors FOR ALL
TO authenticated
USING (broker_id = auth.uid());

-- Saved searches
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved searches"
ON saved_searches FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Airports (public read)
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view airports"
ON airports FOR SELECT
TO authenticated
USING (true);

-- Aircraft models (public read)
ALTER TABLE aircraft_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view aircraft models"
ON aircraft_models FOR SELECT
TO authenticated
USING (true);

-- Quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operators can create quotes"
ON quotes FOR INSERT
TO authenticated
WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Users can view relevant quotes"
ON quotes FOR SELECT
TO authenticated
USING (
  operator_id = auth.uid() OR 
  trip_request_id IN (SELECT id FROM trip_requests WHERE broker_id = auth.uid())
);

CREATE POLICY "Operators can update own quotes"
ON quotes FOR UPDATE
TO authenticated
USING (operator_id = auth.uid());

-- Marketplace activity
ALTER TABLE marketplace_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can track own activity"
ON marketplace_activity FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Listing owners can view activity"
ON marketplace_activity FOR SELECT
TO authenticated
USING (
  listing_id IN (SELECT id FROM marketplace_listings WHERE operator_id = auth.uid())
  OR user_id = auth.uid()
);

-- User reputation
ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all ratings"
ON user_reputation FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create ratings for completed transactions"
ON user_reputation FOR INSERT
TO authenticated
WITH CHECK (rated_by = auth.uid());

-- Security events
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security events"
ON security_events FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System can insert security events"
ON security_events FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================================================
-- 12. SAMPLE AIRCRAFT MODELS DATA
-- ============================================================================
INSERT INTO aircraft_models (manufacturer, model, category, typical_pax, max_range_nm, cruise_speed_kts, description) VALUES
  -- Heavy Jets
  ('Gulfstream', 'G650', 'heavy', 14, 7000, 516, 'Long-range luxury business jet with exceptional speed and comfort'),
  ('Gulfstream', 'G550', 'heavy', 14, 6750, 488, 'Ultra-long-range business jet with spacious cabin'),
  ('Bombardier', 'Global 7500', 'heavy', 17, 7700, 516, 'Industry-leading range and cabin size'),
  ('Bombardier', 'Global 6000', 'heavy', 13, 6000, 488, 'High-performance long-range jet'),
  ('Dassault', 'Falcon 8X', 'heavy', 12, 6450, 488, 'Tri-engine ultra-long-range business jet'),
  ('Boeing', 'BBJ MAX', 'heavy', 25, 6640, 470, 'Boeing Business Jet with airliner comfort'),
  
  -- Medium Jets
  ('Cessna', 'Citation X', 'medium', 8, 3242, 527, 'Fastest civilian aircraft in production'),
  ('Bombardier', 'Challenger 350', 'medium', 10, 3200, 470, 'Super mid-size business jet with excellent range'),
  ('Gulfstream', 'G280', 'medium', 10, 3600, 482, 'Super mid-size jet with advanced avionics'),
  ('Embraer', 'Praetor 600', 'medium', 12, 4018, 466, 'Disruptive super midsize jet'),
  ('Dassault', 'Falcon 2000', 'medium', 10, 3350, 482, 'Versatile business jet with transcontinental range'),
  
  -- Light Jets
  ('Cessna', 'Citation CJ4', 'light', 7, 2165, 451, 'Best-selling light business jet'),
  ('Embraer', 'Phenom 300', 'light', 8, 2010, 453, 'Most delivered light jet worldwide'),
  ('Pilatus', 'PC-24', 'light', 8, 2000, 440, 'Super versatile jet with short-field capability'),
  ('HondaJet', 'Elite S', 'light', 6, 1547, 422, 'Advanced very light jet with unique design'),
  ('Cessna', 'Citation M2', 'light', 6, 1550, 404, 'Entry-level light jet with excellent performance'),
  
  -- Turboprops
  ('Pilatus', 'PC-12', 'turboprop', 9, 1845, 285, 'Versatile single-engine turboprop'),
  ('Beechcraft', 'King Air 350', 'turboprop', 11, 1806, 312, 'Iconic twin-engine turboprop'),
  ('Daher', 'TBM 960', 'turboprop', 6, 1730, 330, 'High-performance single-engine turboprop'),
  ('Cessna', 'Caravan', 'turboprop', 14, 1070, 186, 'Utility turboprop for short runways'),
  
  -- Helicopters
  ('Airbus', 'H145', 'helicopter', 8, 370, 134, 'Twin-engine multi-purpose helicopter'),
  ('Sikorsky', 'S-76', 'helicopter', 12, 473, 155, 'Medium twin-engine helicopter'),
  ('Bell', '429', 'helicopter', 7, 373, 142, 'Light twin-engine helicopter'),
  ('Leonardo', 'AW139', 'helicopter', 15, 573, 165, 'Medium twin-engine helicopter')
ON CONFLICT (manufacturer, model) DO NOTHING;

-- ============================================================================
-- 13. SAMPLE AIRPORTS DATA (Popular airports for autocomplete)
-- ============================================================================
INSERT INTO airports (icao_code, iata_code, name, city, country, popular) VALUES
  ('KJFK', 'JFK', 'John F. Kennedy International Airport', 'New York', 'United States', true),
  ('KLAX', 'LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States', true),
  ('EGLL', 'LHR', 'London Heathrow Airport', 'London', 'United Kingdom', true),
  ('LFPG', 'CDG', 'Paris Charles de Gaulle Airport', 'Paris', 'France', true),
  ('EDDF', 'FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany', true),
  ('OMDB', 'DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates', true),
  ('WSSS', 'SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore', true),
  ('RJTT', 'HND', 'Tokyo Haneda Airport', 'Tokyo', 'Japan', true),
  ('VHHH', 'HKG', 'Hong Kong International Airport', 'Hong Kong', 'Hong Kong', true),
  ('YSSY', 'SYD', 'Sydney Airport', 'Sydney', 'Australia', true),
  ('KTEB', 'TEB', 'Teterboro Airport', 'Teterboro', 'United States', true),
  ('KBOS', 'BOS', 'Boston Logan International Airport', 'Boston', 'United States', true),
  ('KMIA', 'MIA', 'Miami International Airport', 'Miami', 'United States', true),
  ('KSFO', 'SFO', 'San Francisco International Airport', 'San Francisco', 'United States', true),
  ('KORD', 'ORD', 'Chicago O''Hare International Airport', 'Chicago', 'United States', true),
  ('KATL', 'ATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States', true),
  ('KLAS', 'LAS', 'Harry Reid International Airport', 'Las Vegas', 'United States', true),
  ('EGKK', 'LGW', 'London Gatwick Airport', 'London', 'United Kingdom', true),
  ('EHAM', 'AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands', true),
  ('LEMD', 'MAD', 'Adolfo Suárez Madrid-Barajas Airport', 'Madrid', 'Spain', true),
  ('LIRF', 'FCO', 'Leonardo da Vinci-Fiumicino Airport', 'Rome', 'Italy', true),
  ('LSZH', 'ZRH', 'Zurich Airport', 'Zurich', 'Switzerland', true),
  ('LOWW', 'VIE', 'Vienna International Airport', 'Vienna', 'Austria', true),
  ('EDDM', 'MUC', 'Munich Airport', 'Munich', 'Germany', true),
  ('LTFM', 'IST', 'Istanbul Airport', 'Istanbul', 'Turkey', true)
ON CONFLICT (icao_code) DO NOTHING;

-- ============================================================================
-- 14. GRANT PERMISSIONS
-- ============================================================================
GRANT ALL ON aircraft_models TO authenticated;
GRANT ALL ON trip_requests TO authenticated;
GRANT ALL ON marketplace_listings TO authenticated;
GRANT ALL ON preferred_vendors TO authenticated;
GRANT ALL ON saved_searches TO authenticated;
GRANT ALL ON airports TO authenticated;
GRANT ALL ON quotes TO authenticated;
GRANT ALL ON marketplace_activity TO authenticated;
GRANT ALL ON user_reputation TO authenticated;
GRANT ALL ON security_events TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

