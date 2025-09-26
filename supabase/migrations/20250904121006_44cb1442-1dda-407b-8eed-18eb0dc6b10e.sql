-- Enable extensions
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles table
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username citext UNIQUE NOT NULL CHECK (username ~ '^[A-Za-z0-9_]{3,20}$'),
  display_name text NOT NULL,
  platform_role text NOT NULL CHECK (platform_role IN ('broker','operator','pilot','crew')),
  avatar_url text,
  phone text,
  country text,
  created_at timestamptz DEFAULT now()
);

-- Companies table
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  reg_no text,
  country text,
  created_by uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Company members table
CREATE TABLE public.company_members (
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  member_role text NOT NULL CHECK (member_role IN ('owner','admin','member')),
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (company_id, user_id)
);

-- Platform admins table
CREATE TABLE public.platform_admins (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  is_admin boolean DEFAULT false,
  is_reviewer boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);
CREATE INDEX IF NOT EXISTS idx_company_members_user ON public.company_members (user_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles public read limited"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "profiles self upsert"
ON public.profiles FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "profiles self update"
ON public.profiles FOR UPDATE
USING ((select auth.uid()) = user_id);

-- RLS Policies for companies
CREATE POLICY "companies member read"
ON public.companies FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.company_members m
  WHERE m.company_id = companies.id AND m.user_id = (select auth.uid())
));

CREATE POLICY "companies owner admin update"
ON public.companies FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.company_members m
  WHERE m.company_id = companies.id AND m.user_id = (select auth.uid())
  AND m.member_role IN ('owner','admin')
));

CREATE POLICY "companies create"
ON public.companies FOR INSERT
WITH CHECK (true);

-- RLS Policies for company members
CREATE POLICY "company_members self read"
ON public.company_members FOR SELECT
USING (user_id = (select auth.uid()));

CREATE POLICY "company_members owner manage"
ON public.company_members FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.company_members m
  WHERE m.company_id = company_members.company_id
  AND m.user_id = (select auth.uid())
  AND m.member_role IN ('owner','admin')
));

-- RLS Policies for platform admins
CREATE POLICY "platform_admins self read"
ON public.platform_admins FOR SELECT
USING ((select auth.uid()) = user_id);