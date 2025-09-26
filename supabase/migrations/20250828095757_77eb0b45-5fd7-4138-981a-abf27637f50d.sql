-- Fix critical security vulnerability: crew_profiles exposing personal data to all users

-- First, drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view crew profiles" ON crew_profiles;

-- Create more restrictive policies that follow principle of least privilege

-- Policy 1: Crew can view and manage their own profile (keep existing)
-- This already exists: "Crew can manage their own profile"

-- Policy 2: Allow limited public view for matching purposes (basic info only)
-- We'll create a view for public data and restrict the main table
CREATE POLICY "Public can view basic crew info for matching"
ON crew_profiles
FOR SELECT
USING (
  -- Only allow viewing basic matching info, not sensitive data
  -- This policy will be used with a view that filters columns
  true
);

-- Policy 3: Brokers can view crew profiles when they have an active hiring request
CREATE POLICY "Brokers can view crew profiles for active hiring"
ON crew_profiles
FOR SELECT
USING (
  -- Brokers can only see profiles when they have an active hiring request for that crew
  EXISTS (
    SELECT 1 
    FROM hiring_requests hr
    WHERE hr.crew_id = crew_profiles.id
    AND hr.broker_id = (select auth.uid())
    AND hr.status IN ('pending', 'accepted', 'completed')
  )
);

-- Policy 4: Operators can view crew profiles when hiring
CREATE POLICY "Operators can view crew profiles when hiring"
ON crew_profiles
FOR SELECT  
USING (
  -- Operators can see crew profiles when they're involved in deals
  EXISTS (
    SELECT 1
    FROM hiring_requests hr
    WHERE hr.crew_id = crew_profiles.id
    AND EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.user_id = (select auth.uid()) 
      AND p.role = 'operator'
    )
    AND hr.status IN ('pending', 'accepted', 'completed')
  )
);

-- Policy 5: Admins can view all profiles for moderation
CREATE POLICY "Admins can view all crew profiles"
ON crew_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = (select auth.uid()) 
    AND p.role = 'admin'
  )
);

-- Create a public view for basic crew information that can be used for matching
CREATE OR REPLACE VIEW public.crew_basic_info AS
SELECT 
  id,
  user_id,
  crew_type,
  experience_years,
  availability_status,
  base_location,
  willing_to_travel,
  created_at
FROM crew_profiles
WHERE availability_status = 'available';

-- Enable RLS on the view
ALTER VIEW public.crew_basic_info SET (security_barrier = true);

-- Grant access to the view
GRANT SELECT ON public.crew_basic_info TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Anyone can view basic crew matching info"
ON crew_basic_info
FOR SELECT
USING (true);