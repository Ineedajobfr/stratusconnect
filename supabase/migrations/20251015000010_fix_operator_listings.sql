-- ========================================
-- FIX OPERATOR LISTINGS CREATION
-- Ensures operators can create and manage their own listings
-- ========================================

-- 1. Ensure marketplace_listings table exists with all required columns
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

-- 2. Add missing columns if they don't exist
DO $$
BEGIN
  -- Add price column if it doesn't exist (for backward compatibility)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='price') THEN
    ALTER TABLE marketplace_listings ADD COLUMN price NUMERIC;
  END IF;
  
  -- Add departure_airport column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='departure_airport') THEN
    ALTER TABLE marketplace_listings ADD COLUMN departure_airport TEXT;
  END IF;
  
  -- Add destination_airport column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='destination_airport') THEN
    ALTER TABLE marketplace_listings ADD COLUMN destination_airport TEXT;
  END IF;
  
  -- Add dep_time column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='dep_time') THEN
    ALTER TABLE marketplace_listings ADD COLUMN dep_time TIMESTAMPTZ;
  END IF;
  
  -- Add arr_time column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='arr_time') THEN
    ALTER TABLE marketplace_listings ADD COLUMN arr_time TIMESTAMPTZ;
  END IF;
  
  -- Add seats column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='seats') THEN
    ALTER TABLE marketplace_listings ADD COLUMN seats INTEGER;
  END IF;
END $$;

-- 3. Enable RLS on marketplace_listings
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view active listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can manage own listings" ON marketplace_listings;
DROP POLICY IF EXISTS "Operators can create listings" ON marketplace_listings;

-- 5. Create comprehensive RLS policies for marketplace_listings

-- Anyone can view active listings
CREATE POLICY "Users can view active listings" ON marketplace_listings FOR SELECT TO authenticated 
USING (status = 'active');

-- Operators can view their own listings (all statuses)
CREATE POLICY "Operators can view own listings" ON marketplace_listings FOR SELECT TO authenticated 
USING (operator_id = auth.uid());

-- Operators can create their own listings
CREATE POLICY "Operators can create listings" ON marketplace_listings FOR INSERT TO authenticated 
WITH CHECK (operator_id = auth.uid());

-- Operators can update their own listings
CREATE POLICY "Operators can update own listings" ON marketplace_listings FOR UPDATE TO authenticated 
USING (operator_id = auth.uid());

-- Operators can delete their own listings
CREATE POLICY "Operators can delete own listings" ON marketplace_listings FOR DELETE TO authenticated 
USING (operator_id = auth.uid());

-- 6. Create aircraft_models table if it doesn't exist
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

-- 7. Enable RLS on aircraft_models
ALTER TABLE aircraft_models ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for aircraft_models
CREATE POLICY "Anyone can view aircraft models" ON aircraft_models FOR SELECT TO authenticated 
USING (true);

-- 9. Insert some sample aircraft models for testing
INSERT INTO aircraft_models (manufacturer, model, category, typical_pax, max_range_nm, cruise_speed_kts, description) VALUES
('Gulfstream', 'G650ER', 'heavy', 19, 7500, 516, 'Ultra-long-range business jet with exceptional performance'),
('Gulfstream', 'G550', 'heavy', 16, 6750, 488, 'Long-range business jet with proven reliability'),
('Bombardier', 'Global 7500', 'heavy', 19, 7700, 516, 'Ultra-long-range business jet with spacious cabin'),
('Bombardier', 'Challenger 650', 'heavy', 12, 4000, 488, 'Super-midsize business jet with excellent range'),
('Cessna', 'Citation X+', 'medium', 12, 3500, 528, 'Fastest business jet in production'),
('Cessna', 'Citation CJ4', 'light', 10, 2200, 451, 'Light business jet with excellent efficiency'),
('Embraer', 'Phenom 300E', 'light', 9, 2010, 521, 'Light business jet with advanced avionics'),
('Pilatus', 'PC-24', 'light', 8, 2000, 440, 'Super versatile light business jet'),
('King Air', '350i', 'turboprop', 11, 1800, 312, 'Turboprop with excellent short-field performance'),
('Piaggio', 'P.180 Avanti', 'turboprop', 9, 1500, 402, 'Fast turboprop with unique design')
ON CONFLICT (manufacturer, model) DO NOTHING;

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_operator_id ON marketplace_listings(operator_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_listing_type ON marketplace_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_created_at ON marketplace_listings(created_at);

-- 11. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON marketplace_listings TO authenticated;
GRANT SELECT ON aircraft_models TO authenticated;

-- 12. Create function to update listing view count
CREATE OR REPLACE FUNCTION increment_listing_view_count(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE marketplace_listings 
  SET view_count = view_count + 1 
  WHERE id = listing_id AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- 13. Create function to update listing inquiry count
CREATE OR REPLACE FUNCTION increment_listing_inquiry_count(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE marketplace_listings 
  SET inquiry_count = inquiry_count + 1 
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;

-- 14. Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_listing_view_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_listing_inquiry_count TO authenticated;

-- ========================================
-- OPERATOR LISTINGS CREATION FIXED
-- ========================================
