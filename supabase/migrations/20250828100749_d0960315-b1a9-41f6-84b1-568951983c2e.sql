-- Fix critical security issues - Database RLS policies only
-- Note: Auth settings (OTP expiry, leaked password protection) must be configured in Supabase Dashboard

-- 1. Fix Aircraft table - Remove public access to business financial data
DROP POLICY IF EXISTS "Everyone can view available aircraft" ON aircraft;

-- Create restrictive policies for aircraft access
CREATE POLICY "Authenticated users can view aircraft for marketplace"
ON aircraft
FOR SELECT
TO authenticated
USING (availability_status = 'available');

CREATE POLICY "Operators can view their own aircraft details"
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

-- 4. Secure crew availability data - require authentication
DROP POLICY IF EXISTS "Everyone can view crew availability" ON crew_availability;

CREATE POLICY "Authenticated users can view crew availability"
ON crew_availability
FOR SELECT
TO authenticated
USING (true);

-- 5. Secure crew certifications - require authentication for viewing
DROP POLICY IF EXISTS "Authenticated users can view crew certifications" ON crew_certifications;
DROP POLICY IF EXISTS "Restrict sensitive certification data" ON crew_certifications;

CREATE POLICY "Authenticated users can view basic crew certifications"
ON crew_certifications
FOR SELECT
TO authenticated
USING (true);

-- 6. Add policy to ensure market analytics requires authentication
DROP POLICY IF EXISTS "Everyone can view market analytics" ON market_analytics;

CREATE POLICY "Authenticated users can view market analytics"
ON market_analytics
FOR SELECT
TO authenticated
USING (true);

-- 7. Add policy to ensure market trends requires authentication  
DROP POLICY IF EXISTS "Everyone can view market trends" ON market_trends;

CREATE POLICY "Authenticated users can view market trends"
ON market_trends
FOR SELECT
TO authenticated
USING (true);