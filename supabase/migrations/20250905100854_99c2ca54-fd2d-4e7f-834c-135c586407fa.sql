-- Create or replace timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create page_content table for site-wide editable content
CREATE TABLE IF NOT EXISTS public.page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name text NOT NULL,
  section_key text NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT page_content_unique UNIQUE (page_name, section_key)
);

-- Enable RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Public can read page content
CREATE POLICY IF NOT EXISTS "page_content public read"
ON public.page_content
FOR SELECT
USING (true);

-- Owners can manage page content (by email whitelist)
CREATE POLICY IF NOT EXISTS "page_content owners can insert"
ON public.page_content
FOR INSERT
WITH CHECK ((current_setting('request.jwt.claims', true)::jsonb ->> 'email') IN ('stratuscharter@gmail.com','Lordbroctree1@gmail.com'));

CREATE POLICY IF NOT EXISTS "page_content owners can update"
ON public.page_content
FOR UPDATE
USING ((current_setting('request.jwt.claims', true)::jsonb ->> 'email') IN ('stratuscharter@gmail.com','Lordbroctree1@gmail.com'));

CREATE POLICY IF NOT EXISTS "page_content owners can delete"
ON public.page_content
FOR DELETE
USING ((current_setting('request.jwt.claims', true)::jsonb ->> 'email') IN ('stratuscharter@gmail.com','Lordbroctree1@gmail.com'));

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_page_content_updated_at ON public.page_content;
CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Allow users to view their own audit logs for receipts/audit trail visibility
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view their own audit logs"
ON public.audit_logs
FOR SELECT
USING (actor_id = (select auth.uid()));