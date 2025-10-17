-- ========================================
-- OPERATOR PROFILE SYSTEM
-- Creates tables for operator profiles, fleet, and certifications
-- ========================================

-- 1. Create operator_fleet table
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
  total_flight_hours NUMERIC,
  last_maintenance TIMESTAMPTZ,
  next_maintenance_due TIMESTAMPTZ,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'in-use', 'maintenance')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add profile columns if they don't exist
DO $$
BEGIN
  -- Add company_name if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='company_name') THEN
    ALTER TABLE profiles ADD COLUMN company_name TEXT;
  END IF;
  
  -- Add license_number if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='license_number') THEN
    ALTER TABLE profiles ADD COLUMN license_number TEXT;
  END IF;
  
  -- Add aoc_number if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='aoc_number') THEN
    ALTER TABLE profiles ADD COLUMN aoc_number TEXT;
  END IF;
  
  -- Add insurance_provider if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='insurance_provider') THEN
    ALTER TABLE profiles ADD COLUMN insurance_provider TEXT;
  END IF;
  
  -- Add insurance_policy_number if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='insurance_policy_number') THEN
    ALTER TABLE profiles ADD COLUMN insurance_policy_number TEXT;
  END IF;
  
  -- Add headquarters if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='headquarters') THEN
    ALTER TABLE profiles ADD COLUMN headquarters TEXT;
  END IF;
  
  -- Add established_year if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='established_year') THEN
    ALTER TABLE profiles ADD COLUMN established_year INTEGER;
  END IF;
  
  -- Add total_flights_completed if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='total_flights_completed') THEN
    ALTER TABLE profiles ADD COLUMN total_flights_completed INTEGER DEFAULT 0;
  END IF;
  
  -- Add email_verified if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='email_verified') THEN
    ALTER TABLE profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;
  
  -- Add phone_verified if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='phone_verified') THEN
    ALTER TABLE profiles ADD COLUMN phone_verified BOOLEAN DEFAULT false;
  END IF;
  
  -- Add identity_verified if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='identity_verified') THEN
    ALTER TABLE profiles ADD COLUMN identity_verified BOOLEAN DEFAULT false;
  END IF;
  
  -- Add business_verified if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='business_verified') THEN
    ALTER TABLE profiles ADD COLUMN business_verified BOOLEAN DEFAULT false;
  END IF;
  
  -- Add reputation_score if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='reputation_score') THEN
    ALTER TABLE profiles ADD COLUMN reputation_score NUMERIC DEFAULT 0;
  END IF;
END $$;

-- 3. Enable RLS on operator_fleet
ALTER TABLE operator_fleet ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for operator_fleet
-- Operators can view their own fleet
CREATE POLICY "Operators can view own fleet" ON operator_fleet FOR SELECT TO authenticated 
USING (operator_id = auth.uid());

-- Anyone can view available aircraft
CREATE POLICY "Anyone can view available fleet" ON operator_fleet FOR SELECT TO authenticated 
USING (availability = 'available');

-- Operators can insert their own aircraft
CREATE POLICY "Operators can insert own aircraft" ON operator_fleet FOR INSERT TO authenticated 
WITH CHECK (operator_id = auth.uid());

-- Operators can update their own aircraft
CREATE POLICY "Operators can update own aircraft" ON operator_fleet FOR UPDATE TO authenticated 
USING (operator_id = auth.uid());

-- Operators can delete their own aircraft
CREATE POLICY "Operators can delete own aircraft" ON operator_fleet FOR DELETE TO authenticated 
USING (operator_id = auth.uid());

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_operator_fleet_operator_id ON operator_fleet(operator_id);
CREATE INDEX IF NOT EXISTS idx_operator_fleet_availability ON operator_fleet(availability);
CREATE INDEX IF NOT EXISTS idx_operator_fleet_category ON operator_fleet(category);
CREATE INDEX IF NOT EXISTS idx_operator_fleet_registration ON operator_fleet(registration);

-- 6. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON operator_fleet TO authenticated;

-- 7. Create function to update updated_at timestamp
CREATE TRIGGER update_operator_fleet_updated_at 
    BEFORE UPDATE ON operator_fleet 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Create function to get fleet statistics
CREATE OR REPLACE FUNCTION get_fleet_statistics(p_operator_id UUID)
RETURNS TABLE (
  total_aircraft BIGINT,
  available_aircraft BIGINT,
  in_use_aircraft BIGINT,
  maintenance_aircraft BIGINT,
  total_seats BIGINT,
  heavy_jets BIGINT,
  medium_jets BIGINT,
  light_jets BIGINT,
  turboprops BIGINT,
  helicopters BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_aircraft,
    COUNT(*) FILTER (WHERE availability = 'available') as available_aircraft,
    COUNT(*) FILTER (WHERE availability = 'in-use') as in_use_aircraft,
    COUNT(*) FILTER (WHERE availability = 'maintenance') as maintenance_aircraft,
    COALESCE(SUM(seats), 0) as total_seats,
    COUNT(*) FILTER (WHERE category = 'heavy') as heavy_jets,
    COUNT(*) FILTER (WHERE category = 'medium') as medium_jets,
    COUNT(*) FILTER (WHERE category = 'light') as light_jets,
    COUNT(*) FILTER (WHERE category = 'turboprop') as turboprops,
    COUNT(*) FILTER (WHERE category = 'helicopter') as helicopters
  FROM operator_fleet
  WHERE operator_id = p_operator_id;
END;
$$ LANGUAGE plpgsql;

-- 9. Grant execute permission
GRANT EXECUTE ON FUNCTION get_fleet_statistics TO authenticated;

-- ========================================
-- OPERATOR PROFILE SYSTEM READY
-- ========================================
