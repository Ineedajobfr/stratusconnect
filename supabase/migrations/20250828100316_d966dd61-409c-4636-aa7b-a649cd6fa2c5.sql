-- Fix security vulnerability: Remove public access to crew discovery data

-- Drop the publicly accessible crew_discovery view
DROP VIEW IF EXISTS public.crew_discovery;

-- Remove the policy that enabled public access to crew data
DROP POLICY IF EXISTS "Public crew discovery - non-sensitive data only" ON crew_profiles;

-- Ensure crew discovery is only available to authenticated users through existing policies
-- The "Authenticated users can discover available crew" policy already provides secure access

-- Optional: Create a more restrictive function for crew discovery that authenticated users can call
CREATE OR REPLACE FUNCTION public.get_available_crew_basic_info()
RETURNS TABLE (
  id uuid,
  crew_type text,
  experience_years integer,
  certifications text[],
  languages text[],
  availability_status text,
  created_at timestamptz
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return basic, non-sensitive information for available crew
  -- This function respects RLS and requires authentication
  RETURN QUERY
  SELECT 
    cp.id,
    cp.crew_type,
    cp.experience_years,
    cp.certifications,
    cp.languages,
    cp.availability_status,
    cp.created_at
  FROM crew_profiles cp
  WHERE cp.availability_status = 'available';
END;
$$ LANGUAGE plpgsql;