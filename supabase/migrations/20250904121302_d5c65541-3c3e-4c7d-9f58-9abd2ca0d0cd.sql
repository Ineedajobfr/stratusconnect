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
) OR NOT EXISTS (
  SELECT 1 FROM public.company_members m2
  WHERE m2.company_id = company_members.company_id
));

-- Policy to allow company owners/admins to manage members
CREATE POLICY "company_members owner admin manage"
ON public.company_members FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.company_members m
  WHERE m.company_id = company_members.company_id
  AND m.user_id = (select auth.uid())
  AND m.member_role IN ('owner','admin')
));

CREATE POLICY "company_members owner admin delete"
ON public.company_members FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.company_members m
  WHERE m.company_id = company_members.company_id
  AND m.user_id = (select auth.uid())
  AND m.member_role IN ('owner','admin')
));

-- RLS Policies for platform admins
CREATE POLICY "platform_admins self read"
ON public.platform_admins FOR SELECT
USING ((select auth.uid()) = user_id);

-- Allow system to manage admin flags (will be done via service role)
CREATE POLICY "platform_admins system manage"
ON public.platform_admins FOR ALL
USING (true);