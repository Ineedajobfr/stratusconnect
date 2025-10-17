-- ========================================
-- COMPLETE MARKETPLACE FIX
-- Fixes all remaining database issues
-- ========================================

-- 1. Create missing job_posts table (referenced in console errors)
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

-- 2. Create missing requests table (referenced in console errors)
CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 3. Ensure all required columns exist in marketplace_listings
ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS title TEXT;

ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS arrival_date TIMESTAMPTZ;

ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 4. Make aircraft_id nullable (we use aircraft_model_id instead)
ALTER TABLE public.marketplace_listings 
ALTER COLUMN aircraft_id DROP NOT NULL;

-- 5. Create aircraft_models table if it doesn't exist
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

-- 6. Insert sample aircraft models
INSERT INTO aircraft_models (manufacturer, model, category, typical_pax, max_range_nm, cruise_speed_kts, description) VALUES
  ('Gulfstream', 'G650', 'heavy', 14, 7000, 516, 'Long-range luxury business jet'),
  ('Gulfstream', 'G550', 'heavy', 14, 6750, 488, 'Ultra-long-range business jet'),
  ('Bombardier', 'Global 7500', 'heavy', 17, 7700, 516, 'Industry-leading range'),
  ('Bombardier', 'Global 6000', 'heavy', 13, 6000, 488, 'High-performance long-range jet'),
  ('Dassault', 'Falcon 8X', 'heavy', 12, 6450, 488, 'Tri-engine ultra-long-range jet'),
  ('Cessna', 'Citation X', 'medium', 8, 3242, 527, 'Fastest civilian aircraft'),
  ('Bombardier', 'Challenger 350', 'medium', 10, 3200, 470, 'Super mid-size business jet'),
  ('Gulfstream', 'G280', 'medium', 10, 3600, 482, 'Super mid-size jet'),
  ('Embraer', 'Praetor 600', 'medium', 12, 4018, 466, 'Disruptive super midsize jet'),
  ('Cessna', 'Citation CJ4', 'light', 7, 2165, 451, 'Best-selling light business jet'),
  ('Embraer', 'Phenom 300', 'light', 8, 2010, 453, 'Most delivered light jet'),
  ('HondaJet', 'Elite S', 'light', 6, 1547, 422, 'Advanced very light jet'),
  ('Pilatus', 'PC-12', 'turboprop', 9, 1845, 285, 'Versatile single-engine turboprop'),
  ('Beechcraft', 'King Air 350', 'turboprop', 11, 1806, 312, 'Iconic twin-engine turboprop'),
  ('Airbus', 'H145', 'helicopter', 8, 370, 134, 'Twin-engine multi-purpose helicopter')
ON CONFLICT (manufacturer, model) DO NOTHING;

-- 7. Add sample marketplace listings
INSERT INTO public.marketplace_listings (
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
  arrival_date,
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
    NOW() + INTERVAL '2 days' + INTERVAL '7 hours',
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
    NOW() + INTERVAL '3 days' + INTERVAL '4 hours',
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
    NOW() + INTERVAL '1 day' + INTERVAL '2 hours',
    4,
    'active'
  )
ON CONFLICT DO NOTHING;

-- 8. Enable RLS on all tables
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft_models ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies
CREATE POLICY "Anyone can view job posts" ON job_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view requests" ON requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view aircraft models" ON aircraft_models FOR SELECT TO authenticated USING (true);

-- 10. Grant permissions
GRANT SELECT ON job_posts TO authenticated;
GRANT SELECT ON requests TO authenticated;
GRANT SELECT ON aircraft_models TO authenticated;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

