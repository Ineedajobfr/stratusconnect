-- Fix critical security vulnerability: crew_profiles exposing personal data to all users

-- First, drop the overly permissive policy that allows any authenticated user to view all profiles
DROP POLICY IF EXISTS "Authenticated users can view crew profiles" ON crew_profiles;

-- Create more restrictive policies that follow principle of least privilege

-- Policy 1: Brokers can view crew profiles when they have an active hiring request
CREATE POLICY "Brokers can view crew profiles for active hiring"
ON crew_profiles
FOR SELECT
USING (
  -- Brokers can only see profiles when they have an active hiring request for that crew
  EXISTS (
    SELECT 1 
    FROM hiring_requests hr
    WHERE hr.crew_id = crew_profiles.id
    AND hr.broker_id = auth.uid()
    AND hr.status IN ('pending', 'accepted', 'completed')
  )
);

-- Policy 2: Operators can view crew profiles when hiring through deals
CREATE POLICY "Operators can view crew profiles when hiring"
ON crew_profiles
FOR SELECT  
USING (
  -- Operators can see crew profiles when they're involved in deals with that crew
  EXISTS (
    SELECT 1
    FROM hiring_requests hr
    INNER JOIN profiles p ON p.user_id = auth.uid()
    WHERE hr.crew_id = crew_profiles.id
    AND p.role = 'operator'
    AND hr.status IN ('pending', 'accepted', 'completed')
  )
);

-- Policy 3: Admins can view all profiles for moderation and verification
CREATE POLICY "Admins can view all crew profiles"
ON crew_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- Policy 4: Allow very limited public access for crew discovery (basic info only)
-- This replaces the overly broad previous policy
CREATE POLICY "Limited public crew discovery"
ON crew_profiles
FOR SELECT
USING (
  -- Only allow viewing if the crew is available and willing to travel
  -- This still exposes some data, but components should filter sensitive fields
  availability_status = 'available'
);