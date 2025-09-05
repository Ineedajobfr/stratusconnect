-- Fix critical security issues from the security checklist

-- 1. Fix Auth Configuration: Set OTP expiry to recommended 1 hour (3600 seconds)
UPDATE auth.config 
SET otp_exp = 3600 
WHERE instance_id = '00000000-0000-0000-0000-000000000000';

-- 2. Enable leaked password protection
UPDATE auth.config 
SET enable_leaked_password_protection = true 
WHERE instance_id = '00000000-0000-0000-0000-000000000000';

-- 3. Fix Aircraft table - Remove public access to business financial data
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

-- 4. Fix Marketplace Listings - Remove public access to business operations data
DROP POLICY IF EXISTS "Everyone can view active listings" ON marketplace_listings;

-- Create authenticated-only access for marketplace listings
CREATE POLICY "Authenticated users can view active listings"
ON marketplace_listings
FOR SELECT
TO authenticated
USING (status = 'active');

-- 5. Improve profiles table security - Ensure only own profile access
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

CREATE POLICY "Users can only view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 6. Enable RLS on any tables that might not have it enabled
-- (This is defensive - most should already have RLS)
ALTER TABLE market_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- 7. Ensure email confirmations are enabled by default for new signups
UPDATE auth.config 
SET enable_signup = true,
    enable_confirmations = true
WHERE instance_id = '00000000-0000-0000-0000-000000000000';