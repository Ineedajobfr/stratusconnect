-- Fix missing RLS policies for psych_share_tokens table
CREATE POLICY "users can manage their own share tokens" ON public.psych_share_tokens 
FOR ALL USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- Add trigger for updated_at on user_reviews
CREATE OR REPLACE FUNCTION public.update_user_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_user_reviews_updated_at_trigger
  BEFORE UPDATE ON public.user_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_reviews_updated_at();