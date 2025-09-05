-- ============ REVIEW SYSTEM ============
-- User reviews table for broker-operator and operator-crew interactions
CREATE TABLE IF NOT EXISTS public.user_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  hiring_request_id uuid REFERENCES public.hiring_requests(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  review_type text NOT NULL CHECK (review_type IN ('broker_to_operator', 'operator_to_broker', 'operator_to_crew', 'crew_to_operator')),
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(reviewer_id, reviewee_id, deal_id),
  UNIQUE(reviewer_id, reviewee_id, hiring_request_id)
);

-- Enable RLS
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Users can create reviews for completed transactions"
ON public.user_reviews FOR INSERT
WITH CHECK (
  auth.uid() = reviewer_id AND
  (
    (deal_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM deals d 
      WHERE d.id = deal_id 
      AND (d.operator_id = reviewer_id OR d.broker_id = reviewer_id)
      AND d.status = 'completed'
    )) OR
    (hiring_request_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM hiring_requests hr 
      WHERE hr.id = hiring_request_id 
      AND (hr.broker_id = reviewer_id OR hr.crew_id IN (
        SELECT cp.id FROM crew_profiles cp WHERE cp.user_id = reviewer_id
      ))
      AND hr.status = 'completed'
    ))
  )
);

CREATE POLICY "Anyone can view reviews"
ON public.user_reviews FOR SELECT
USING (true);

CREATE POLICY "Reviewers can update their own reviews"
ON public.user_reviews FOR UPDATE
USING (auth.uid() = reviewer_id);

-- ============ PSYCHOMETRIC TEST SYSTEM ============
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Core tables
CREATE TABLE IF NOT EXISTS public.psych_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  duration_min int NOT NULL DEFAULT 20,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.psych_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES public.psych_tests(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  order_index int NOT NULL,
  item_count int NOT NULL,
  time_hint_min int NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  UNIQUE(test_id, code)
);

CREATE TABLE IF NOT EXISTS public.psych_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES public.psych_modules(id) ON DELETE CASCADE,
  type text NOT NULL,
  payload jsonb NOT NULL,
  trait_map jsonb NOT NULL,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.psych_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES public.psych_tests(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text CHECK (status IN ('in_progress','completed','abandoned')) DEFAULT 'in_progress',
  seconds_spent int DEFAULT 0,
  attention_flags jsonb DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.psych_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.psych_sessions(id) ON DELETE CASCADE,
  module_id uuid REFERENCES public.psych_modules(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.psych_items(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  response jsonb NOT NULL,
  ms_elapsed int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, item_id)
);

CREATE TABLE IF NOT EXISTS public.psych_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.psych_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  trait text NOT NULL,
  raw numeric NOT NULL,
  zscore numeric,
  percentile numeric,
  module_code text,
  created_at timestamptz DEFAULT now()
);

-- Consent for sharing results platform-wide
CREATE TABLE IF NOT EXISTS public.psych_consent (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  share_profile boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Public share tokens (optional)
CREATE TABLE IF NOT EXISTS public.psych_share_tokens (
  token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Norms (coarse defaults; replace with field data later)
CREATE TABLE IF NOT EXISTS public.psych_norms (
  trait text PRIMARY KEY,
  mean numeric NOT NULL,
  sd numeric NOT NULL
);

INSERT INTO public.psych_norms(trait, mean, sd) VALUES
('O', 0, 1),('C',0,1),('E',0,1),('A',0,1),('N',0,1),
('RISK',0,1),('DECISION',0,1),('SAFETY',0,1),('INTEGRITY',0,1),('TEAM',0,1)
ON CONFLICT (trait) DO NOTHING;

-- ============ Row Level Security ============
ALTER TABLE public.psych_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_share_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psych_norms ENABLE ROW LEVEL SECURITY;

-- Read-only for catalog tables
CREATE POLICY "catalog read" ON public.psych_tests FOR SELECT USING (true);
CREATE POLICY "modules read" ON public.psych_modules FOR SELECT USING (true);
CREATE POLICY "items read" ON public.psych_items FOR SELECT USING (true);
CREATE POLICY "norms read" ON public.psych_norms FOR SELECT USING (true);

-- Sessions and responses: owner only
CREATE POLICY "sessions insert self" ON public.psych_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions read self" ON public.psych_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions update self" ON public.psych_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "responses insert self" ON public.psych_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "responses read self" ON public.psych_responses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "scores read self" ON public.psych_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scores read shared" ON public.psych_scores FOR SELECT USING (
  user_id IN (
    SELECT pc.user_id FROM psych_consent pc WHERE pc.share_profile = true
  )
);

-- Consent
CREATE POLICY "consent self upsert" ON public.psych_consent FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "consent self update" ON public.psych_consent FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "consent self read" ON public.psych_consent FOR SELECT USING (auth.uid() = user_id);

-- Insert seed test data
INSERT INTO public.psych_tests(code, name, description, duration_min)
VALUES ('SC-CORE-20','Stratus Core Profile','20 minute blended profile for aviation roles',20)
ON CONFLICT (code) DO NOTHING;

-- Insert modules
WITH t AS (SELECT id FROM public.psych_tests WHERE code='SC-CORE-20')
INSERT INTO public.psych_modules(test_id, code, name, order_index, item_count, time_hint_min, config)
SELECT t.id, m.code, m.name, m.order_index, m.item_count, m.time_hint_min, m.config::jsonb
FROM (VALUES
('big5','Core Traits (Big Five short)',1,24,6,'{"likert_points":5,"reverse_key":true}'),
('risk','Risk Appetite',2,12,4,'{"likert_points":7}'),
('decision','Decision Style',3,8,3,'{"likert_points":5}'),
('sjt','Situational Judgement',4,6,6,'{"choices":4}'),
('integrity','Integrity and Safety',5,6,2,'{"likert_points":5}')
) AS m(code,name,order_index,item_count,time_hint_min,config), t
ON CONFLICT DO NOTHING;