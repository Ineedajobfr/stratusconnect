-- Fix critical security issues: RLS policies and table access controls

-- 1. Fix Aircraft table - Remove public access to business financial data
DROP POLICY IF EXISTS "Everyone can view available aircraft" ON aircraft;

-- Create restrictive policies for aircraft access
CREATE POLICY "Authenticated users can view aircraft for marketplace"
ON aircraft
FOR SELECT
TO authenticated
USING (availability_status = 'available');

CREATE POLICY "Operators can view their own aircraft"
ON aircraft  
FOR SELECT
USING (auth.uid() = operator_id);

-- 2. Fix Marketplace Listings - Remove public access to business operations data
DROP POLICY IF EXISTS "Everyone can view active listings" ON marketplace_listings;

-- Create authenticated-only access for marketplace listings
CREATE POLICY "Authenticated users can view active listings"
ON marketplace_listings
FOR SELECT
TO authenticated
USING (status = 'active');

-- 3. Improve profiles table security - Ensure only own profile access
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

CREATE POLICY "Users can only view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 4. Secure crew availability - require authentication
DROP POLICY IF EXISTS "Everyone can view crew availability" ON crew_availability;

CREATE POLICY "Authenticated users can view crew availability"
ON crew_availability
FOR SELECT
TO authenticated
USING (true);

-- 5. Secure crew certifications - tighten access
DROP POLICY IF EXISTS "Authenticated users can view crew certifications" ON crew_certifications;
DROP POLICY IF EXISTS "Restrict sensitive certification data" ON crew_certifications;

-- Only allow viewing certifications with business relationship
CREATE POLICY "Limited crew certification access"
ON crew_certifications
FOR SELECT
USING (
  -- Crew can see their own certifications
  auth.uid() IN (
    SELECT user_id FROM crew_profiles WHERE id = crew_certifications.crew_id
  ) 
  OR
  -- Admins can see all certifications
  EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
  OR
  -- Brokers/operators with active hiring relationships can see certifications
  EXISTS (
    SELECT 1 FROM hiring_requests hr
    WHERE hr.crew_id = crew_certifications.crew_id
    AND (hr.broker_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role = 'operator'
    ))
    AND hr.status IN ('pending', 'accepted', 'completed')
  )
);