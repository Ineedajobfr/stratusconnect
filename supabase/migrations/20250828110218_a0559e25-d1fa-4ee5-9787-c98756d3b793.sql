-- Create sanctions screening tables for fortress of trust
CREATE TABLE public.sanctions_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_name text NOT NULL,
  source text NOT NULL DEFAULT 'opensanctions',
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  record_count integer NOT NULL DEFAULT 0,
  checksum text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.sanctions_entities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id text NOT NULL UNIQUE,
  name text NOT NULL,
  aliases text[],
  birth_date date,
  nationalities text[],
  addresses text[],
  entity_type text NOT NULL DEFAULT 'person',
  sanctions_reason text,
  sanctions_date date,
  sanctions_authority text,
  risk_score numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.sanctions_screenings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  screening_type text NOT NULL DEFAULT 'verification',
  search_terms jsonb NOT NULL,
  matches_found integer NOT NULL DEFAULT 0,
  risk_level text NOT NULL DEFAULT 'low',
  status text NOT NULL DEFAULT 'completed',
  screened_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '90 days'),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.sanctions_matches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  screening_id uuid NOT NULL REFERENCES public.sanctions_screenings(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES public.sanctions_entities(id),
  match_score numeric NOT NULL DEFAULT 0,
  match_type text NOT NULL DEFAULT 'name',
  match_details jsonb,
  false_positive boolean DEFAULT false,
  verified_by uuid,
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sanctions_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctions_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctions_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctions_matches ENABLE ROW LEVEL SECURITY;

-- Create policies for sanctions_lists (admin only manages, all can read)
CREATE POLICY "Admins can manage sanctions lists" 
ON public.sanctions_lists 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Authenticated users can view sanctions lists" 
ON public.sanctions_lists 
FOR SELECT 
USING (true);

-- Create policies for sanctions_entities (admin manages, system reads for screening)
CREATE POLICY "System can manage sanctions entities" 
ON public.sanctions_entities 
FOR ALL 
USING (true);

-- Create policies for sanctions_screenings
CREATE POLICY "Users can view their own screenings" 
ON public.sanctions_screenings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create screenings" 
ON public.sanctions_screenings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all screenings" 
ON public.sanctions_screenings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create policies for sanctions_matches
CREATE POLICY "Users can view their own matches" 
ON public.sanctions_matches 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM sanctions_screenings 
  WHERE id = sanctions_matches.screening_id
));

CREATE POLICY "System can create matches" 
ON public.sanctions_matches 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage matches" 
ON public.sanctions_matches 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create indexes for performance
CREATE INDEX idx_sanctions_entities_name ON public.sanctions_entities USING gin(to_tsvector('english', name));
CREATE INDEX idx_sanctions_entities_aliases ON public.sanctions_entities USING gin(aliases);
CREATE INDEX idx_sanctions_screenings_user_id ON public.sanctions_screenings(user_id);
CREATE INDEX idx_sanctions_screenings_expires_at ON public.sanctions_screenings(expires_at);
CREATE INDEX idx_sanctions_matches_screening_id ON public.sanctions_matches(screening_id);

-- Create function to update updated_at timestamp
CREATE TRIGGER update_sanctions_entities_updated_at
BEFORE UPDATE ON public.sanctions_entities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add sanctions screening to existing verification_documents table
ALTER TABLE public.verification_documents 
ADD COLUMN sanctions_screened boolean DEFAULT false,
ADD COLUMN sanctions_risk_level text DEFAULT 'pending',
ADD COLUMN sanctions_screening_id uuid REFERENCES public.sanctions_screenings(id);