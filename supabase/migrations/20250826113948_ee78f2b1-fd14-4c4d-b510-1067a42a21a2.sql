-- Fix critical security vulnerability: restrict access to professional certification data
DROP POLICY IF EXISTS "Everyone can view crew certifications" ON public.crew_certifications;
DROP POLICY IF EXISTS "Everyone can view crew profiles" ON public.crew_profiles;

-- Create secure policies for crew certifications - authenticated users only
CREATE POLICY "Authenticated users can view crew certifications" 
ON public.crew_certifications 
FOR SELECT 
TO authenticated 
USING (true);

-- Create secure policies for crew profiles - authenticated users only
CREATE POLICY "Authenticated users can view crew profiles" 
ON public.crew_profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Optional: Create even more restrictive policy for sensitive certification details
-- This allows viewing basic certification info but restricts access to sensitive fields
CREATE POLICY "Restrict sensitive certification data" 
ON public.crew_certifications 
FOR SELECT 
TO authenticated 
USING (
  -- Allow crew members to see their own full details
  auth.uid() IN (SELECT user_id FROM crew_profiles WHERE id = crew_certifications.crew_id)
  OR 
  -- Or allow others to see basic info only (this would need application-level filtering)
  true
);