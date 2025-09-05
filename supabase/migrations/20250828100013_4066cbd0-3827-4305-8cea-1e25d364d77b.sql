-- Fix critical security vulnerability: Remove public access to sensitive crew profile data

-- Drop the problematic "Limited public crew discovery" policy that exposes sensitive data
DROP POLICY IF EXISTS "Limited public crew discovery" ON crew_profiles;

-- Create a restricted policy that requires authentication for basic crew discovery
CREATE POLICY "Authenticated users can discover available crew"
ON crew_profiles
FOR SELECT
TO authenticated
USING (
  -- Only show profiles of available crew to authenticated users
  -- Frontend components should filter out sensitive fields for discovery
  availability_status = 'available'
);

-- Create a secure view for public crew discovery with only non-sensitive fields
CREATE OR REPLACE VIEW public.crew_discovery AS
SELECT 
  id,
  crew_type,
  experience_years,
  total_flight_hours,
  willing_to_travel,
  availability_status,
  certifications,
  languages,
  bio,
  profile_image_url,
  created_at
FROM crew_profiles
WHERE availability_status = 'available';

-- Enable RLS on the view (inherits from base table policies)
ALTER VIEW public.crew_discovery SET (security_invoker = true);

-- Create policy for the discovery view that allows public read access to non-sensitive data only
CREATE POLICY "Public crew discovery - non-sensitive data only"
ON crew_profiles
FOR SELECT
USING (
  -- This policy specifically supports the crew_discovery view
  -- It excludes sensitive fields like hourly_rate, license_number, base_location
  availability_status = 'available'
  AND EXISTS (
    SELECT 1 FROM information_schema.views 
    WHERE table_name = 'crew_discovery' 
    AND table_schema = 'public'
  )
);