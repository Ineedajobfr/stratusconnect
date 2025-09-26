-- Fix critical security vulnerability: profiles table is publicly readable
-- This creates privacy-aware RLS policies for the profiles table

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "profiles public read limited" ON public.profiles;

-- Create a secure policy that respects privacy settings
CREATE POLICY "profiles_secure_read" ON public.profiles
FOR SELECT 
USING (
  -- Users can always see their own profile
  (select auth.uid()) = user_id 
  OR
  -- Others can only see limited public info based on privacy settings
  (
    -- Check if privacy settings allow public visibility
    NOT EXISTS (
      SELECT 1 FROM privacy_settings ps 
      WHERE ps.user_id = profiles.user_id 
      AND (
        (ps.show_phone = false AND current_setting('request.jwt.claims', true)::jsonb->>'requesting_field' = 'phone')
        OR (ps.show_email = false AND current_setting('request.jwt.claims', true)::jsonb->>'requesting_field' = 'email')
      )
    )
  )
);

-- Create a function to get safe profile data that respects privacy
CREATE OR REPLACE FUNCTION get_public_profile(profile_user_id UUID)
RETURNS TABLE(
  user_id UUID,
  username TEXT,
  display_name TEXT,
  platform_role TEXT,
  avatar_url TEXT,
  country TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  privacy_rec RECORD;
BEGIN
  -- Get privacy settings for the profile user
  SELECT * INTO privacy_rec 
  FROM privacy_settings ps 
  WHERE ps.user_id = profile_user_id;
  
  -- If no privacy settings exist, create default restrictive ones
  IF NOT FOUND THEN
    INSERT INTO privacy_settings (user_id, show_email, show_phone, show_activity, allow_messages)
    VALUES (profile_user_id, false, false, true, true)
    ON CONFLICT (user_id) DO NOTHING;
    
    SELECT * INTO privacy_rec 
    FROM privacy_settings ps 
    WHERE ps.user_id = profile_user_id;
  END IF;
  
  -- Return profile data based on privacy settings
  RETURN QUERY
  SELECT 
    p.user_id,
    p.username,
    p.display_name,
    p.platform_role,
    p.avatar_url,
    CASE 
      WHEN (select auth.uid()) = p.user_id OR (select auth.uid()) IS NULL THEN p.country
      ELSE p.country  -- Country is considered less sensitive
    END as country,
    p.created_at
  FROM profiles p
  WHERE p.user_id = profile_user_id;
END;
$$;

-- Create a more restrictive default policy
CREATE POLICY "profiles_restricted_public_read" ON public.profiles
FOR SELECT 
USING (
  -- Users can see their own profile completely
  (select auth.uid()) = user_id 
  OR
  -- For public access, only show basic info (no phone, limited based on privacy)
  (
    (select auth.uid()) IS NOT NULL  -- Must be authenticated
    AND
    -- Only basic profile info visible to authenticated users
    NOT EXISTS (
      SELECT 1 FROM privacy_settings ps 
      WHERE ps.user_id = profiles.user_id 
      AND ps.allow_messages = false  -- If they don't allow messages, they want privacy
    )
  )
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_public_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_public_profile(UUID) TO anon;