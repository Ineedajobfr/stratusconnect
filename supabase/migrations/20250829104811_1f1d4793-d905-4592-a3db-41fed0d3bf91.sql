-- Create user profiles system tables

-- Enhanced profiles table (extends existing)
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'broker',
  avatar_url text,
  headline text,
  bio text CHECK (length(bio) <= 400),
  location text,
  company text,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  level integer DEFAULT 1,
  trust_score numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Experience table
CREATE TABLE public.experience (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Credentials table
CREATE TABLE public.credentials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  issuer text,
  number_masked text,
  issued_at date,
  expires_at date,
  status text NOT NULL DEFAULT 'pending',
  file_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- References table
CREATE TABLE public.references (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ref_name text NOT NULL,
  ref_company text,
  ref_contact_masked text,
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activity table
CREATE TABLE public.activity (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  summary text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Privacy settings table
CREATE TABLE public.privacy_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  show_email boolean DEFAULT false,
  show_phone boolean DEFAULT false,
  show_activity boolean DEFAULT true,
  allow_messages boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Public profiles are viewable by verified users" 
ON public.user_profiles FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = (select auth.uid()) AND p.verification_status = 'approved'));

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

-- RLS Policies for experience
CREATE POLICY "Users can manage their own experience" 
ON public.experience FOR ALL 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Verified users can view experience" 
ON public.experience FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = (select auth.uid()) AND p.verification_status = 'approved'));

-- RLS Policies for credentials
CREATE POLICY "Users can manage their own credentials" 
ON public.credentials FOR ALL 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Level 2 counterparties can view masked credentials" 
ON public.credentials FOR SELECT 
USING (EXISTS (SELECT 1 FROM user_profiles up WHERE up.user_id = (select auth.uid()) AND up.level >= 2));

-- RLS Policies for references
CREATE POLICY "Users can manage their own references" 
ON public.references FOR ALL 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Verified users can view references" 
ON public.references FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = (select auth.uid()) AND p.verification_status = 'approved'));

-- RLS Policies for activity
CREATE POLICY "Users can view their own activity" 
ON public.activity FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "System can insert activity" 
ON public.activity FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public activity viewable by verified users" 
ON public.activity FOR SELECT 
USING (EXISTS (SELECT 1 FROM privacy_settings ps WHERE ps.user_id = activity.user_id AND ps.show_activity = true) 
       AND EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = (select auth.uid()) AND p.verification_status = 'approved'));

-- RLS Policies for privacy_settings
CREATE POLICY "Users can manage their own privacy settings" 
ON public.privacy_settings FOR ALL 
USING ((select auth.uid()) = user_id);

-- Create updated_at trigger for profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_privacy_settings_updated_at
  BEFORE UPDATE ON public.privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique username
CREATE OR REPLACE FUNCTION public.generate_unique_profile_username()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    new_username text;
    chars text[] := ARRAY['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];
    nums text[] := ARRAY['0','1','2','3','4','5','6','7','8','9'];
    counter integer := 0;
BEGIN
    LOOP
        -- Generate 3 letters + 4 numbers pattern
        new_username := 
            chars[floor(random() * array_length(chars, 1) + 1)] ||
            chars[floor(random() * array_length(chars, 1) + 1)] ||
            chars[floor(random() * array_length(chars, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)] ||
            nums[floor(random() * array_length(nums, 1) + 1)];
        
        -- Check if username is unique
        IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE username = new_username) THEN
            RETURN new_username;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique username after 100 attempts';
        END IF;
    END LOOP;
END;
$$;