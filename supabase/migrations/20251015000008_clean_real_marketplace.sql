-- ========================================
-- CLEAN REAL MARKETPLACE - NO DUMMY DATA
-- Creates empty marketplace for real users only
-- ========================================

-- 1. Create marketplace_listings table (if doesn't exist)
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

-- 2. Create aircraft_models table (if doesn't exist)
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

-- 3. Create trip_requests table (if doesn't exist)
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

-- 4. Create requests table for dashboard
CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  origin TEXT,
  destination TEXT,
  departure_date TIMESTAMPTZ,
  passengers INTEGER,
  budget NUMERIC,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'quoted', 'accepted', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create quotes table for dashboard
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  aircraft_id UUID,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  valid_until TIMESTAMPTZ,
  terms TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create bookings table for dashboard
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_company_id UUID REFERENCES auth.users(id),
  operator_id UUID REFERENCES auth.users(id),
  quote_id UUID REFERENCES quotes(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create job_posts table for dashboard
CREATE TABLE IF NOT EXISTS job_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  company_name TEXT,
  location TEXT,
  salary_range TEXT,
  employment_type TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create preferred_vendors table
CREATE TABLE IF NOT EXISTS preferred_vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(broker_id, operator_id)
);

-- 9. Create saved_searches table
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

-- 10. Add safety ratings to profiles (if columns don't exist)
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

-- 11. Make aircraft_id nullable in marketplace_listings
ALTER TABLE public.marketplace_listings 
ALTER COLUMN aircraft_id DROP NOT NULL;

-- 12. Enable RLS on all tables
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferred_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS policies for real users
CREATE POLICY "Users can view active listings" ON marketplace_listings FOR SELECT TO authenticated 
USING (status = 'active' OR operator_id = auth.uid());

CREATE POLICY "Operators can manage own listings" ON marketplace_listings FOR ALL TO authenticated 
USING (operator_id = auth.uid());

CREATE POLICY "Users can view open trip requests" ON trip_requests FOR SELECT TO authenticated 
USING (status = 'open' OR broker_id = auth.uid());

CREATE POLICY "Brokers can manage own trip requests" ON trip_requests FOR ALL TO authenticated 
USING (broker_id = auth.uid());

CREATE POLICY "Users can view requests" ON requests FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Brokers can manage own requests" ON requests FOR ALL TO authenticated 
USING (broker_id = auth.uid());

CREATE POLICY "Users can view quotes" ON quotes FOR SELECT TO authenticated 
USING (operator_id = auth.uid() OR request_id IN (
  SELECT id FROM requests WHERE broker_id = auth.uid()
));

CREATE POLICY "Operators can manage own quotes" ON quotes FOR ALL TO authenticated 
USING (operator_id = auth.uid());

CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT TO authenticated 
USING (broker_company_id = auth.uid() OR operator_id = auth.uid());

CREATE POLICY "Users can manage own bookings" ON bookings FOR ALL TO authenticated 
USING (broker_company_id = auth.uid() OR operator_id = auth.uid());

CREATE POLICY "Anyone can view job posts" ON job_posts FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Anyone can view aircraft models" ON aircraft_models FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Brokers can manage own preferred vendors" ON preferred_vendors FOR ALL TO authenticated 
USING (broker_id = auth.uid());

CREATE POLICY "Users can manage own saved searches" ON saved_searches FOR ALL TO authenticated 
USING (user_id = auth.uid());

-- 14. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_operator ON marketplace_listings(operator_id);
CREATE INDEX IF NOT EXISTS idx_trip_requests_status ON trip_requests(status);
CREATE INDEX IF NOT EXISTS idx_trip_requests_broker ON trip_requests(broker_id);
CREATE INDEX IF NOT EXISTS idx_requests_broker ON requests(broker_id);
CREATE INDEX IF NOT EXISTS idx_quotes_request ON quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_operator ON quotes(operator_id);
CREATE INDEX IF NOT EXISTS idx_bookings_broker ON bookings(broker_company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_operator ON bookings(operator_id);

-- 15. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON marketplace_listings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON trip_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON quotes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bookings TO authenticated;
GRANT SELECT ON job_posts TO authenticated;
GRANT SELECT ON aircraft_models TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON preferred_vendors TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON saved_searches TO authenticated;

-- ========================================
-- CLEAN REAL MARKETPLACE READY
-- ========================================

