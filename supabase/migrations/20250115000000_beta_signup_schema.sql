-- ========================================
-- BETA SIGNUP COMPREHENSIVE DATA SCHEMA
-- ========================================
-- Extends existing user management for beta testing

-- Beta signup applications table
CREATE TABLE public.beta_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Basic Information
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  country text NOT NULL,
  timezone text DEFAULT 'UTC',
  
  -- Professional Information
  role text NOT NULL CHECK (role IN ('broker', 'operator', 'pilot', 'crew', 'ground_support', 'other')),
  job_title text,
  years_in_aviation integer,
  primary_aircraft_types text[], -- Array of aircraft types
  fleet_size integer, -- For operators
  annual_flight_hours integer, -- For pilots
  
  -- Business Information
  company_name text,
  company_type text CHECK (company_type IN ('private_jet_operator', 'charter_company', 'corporate_flight_dept', 'aviation_broker', 'ground_support', 'other')),
  business_registration_number text,
  operating_countries text[], -- Array of countries
  current_software_tools text[], -- Array of tools they use
  
  -- Platform Preferences
  primary_use_case text,
  expected_monthly_volume integer,
  budget_range text CHECK (budget_range IN ('under_1k', '1k_5k', '5k_10k', '10k_25k', '25k_50k', 'over_50k')),
  preferred_communication text CHECK (preferred_communication IN ('email', 'phone', 'sms', 'in_app')),
  
  -- Beta Testing Commitment
  availability_hours_per_week integer,
  preferred_testing_schedule text,
  feedback_method_preference text CHECK (feedback_method_preference IN ('in_app', 'email', 'phone_interview', 'video_call')),
  willing_to_interview boolean DEFAULT false,
  nda_agreed boolean DEFAULT false,
  
  -- Application Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'waitlisted')),
  priority_score integer DEFAULT 0, -- Calculated based on criteria
  assigned_to_admin uuid REFERENCES auth.users(id),
  review_notes text,
  approved_at timestamp with time zone,
  rejected_at timestamp with time zone,
  rejection_reason text,
  
  -- Verification Status
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  documents_uploaded boolean DEFAULT false,
  documents_verified boolean DEFAULT false,
  
  -- Beta Testing Progress
  beta_started_at timestamp with time zone,
  last_active_at timestamp with time zone,
  feedback_count integer DEFAULT 0,
  bug_reports_count integer DEFAULT 0,
  feature_requests_count integer DEFAULT 0,
  
  -- Metadata
  source text DEFAULT 'website', -- How they found us
  referral_code text,
  ip_address text,
  user_agent text,
  
  -- Admin Notes
  admin_notes text,
  internal_tags text[] -- For categorization
);

-- Beta signup documents table
CREATE TABLE public.beta_signup_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid NOT NULL REFERENCES public.beta_signups(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('government_id', 'pilot_license', 'broker_license', 'company_registration', 'insurance', 'references', 'other')),
  file_name text NOT NULL,
  file_path text NOT NULL, -- Supabase storage path
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  verified_at timestamp with time zone,
  verified_by uuid REFERENCES auth.users(id),
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  admin_notes text
);

-- Beta testing feedback table
CREATE TABLE public.beta_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid NOT NULL REFERENCES public.beta_signups(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('bug_report', 'feature_request', 'general_feedback', 'usability_issue', 'performance_issue')),
  title text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'duplicate')),
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  resolution_notes text,
  user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5) -- How satisfied they are with resolution
);

-- Beta testing sessions table
CREATE TABLE public.beta_testing_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid NOT NULL REFERENCES public.beta_signups(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('onboarding', 'feature_test', 'usability_test', 'interview', 'demo')),
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ended_at timestamp with time zone,
  duration_minutes integer,
  notes text,
  recorded boolean DEFAULT false,
  recording_url text,
  feedback_collected boolean DEFAULT false
);

-- Beta signup references table
CREATE TABLE public.beta_signup_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid NOT NULL REFERENCES public.beta_signups(id) ON DELETE CASCADE,
  reference_name text NOT NULL,
  reference_company text,
  reference_email text,
  reference_phone text,
  relationship text, -- How they know the applicant
  years_known integer,
  contact_verified boolean DEFAULT false,
  contacted_at timestamp with time zone,
  response_received boolean DEFAULT false,
  response_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_beta_signups_email ON public.beta_signups(email);
CREATE INDEX idx_beta_signups_status ON public.beta_signups(status);
CREATE INDEX idx_beta_signups_role ON public.beta_signups(role);
CREATE INDEX idx_beta_signups_priority_score ON public.beta_signups(priority_score DESC);
CREATE INDEX idx_beta_signups_created_at ON public.beta_signups(created_at);
CREATE INDEX idx_beta_signups_company_name ON public.beta_signups(company_name);

CREATE INDEX idx_beta_signup_documents_signup_id ON public.beta_signup_documents(signup_id);
CREATE INDEX idx_beta_signup_documents_type ON public.beta_signup_documents(document_type);
CREATE INDEX idx_beta_signup_documents_status ON public.beta_signup_documents(verification_status);

CREATE INDEX idx_beta_feedback_signup_id ON public.beta_feedback(signup_id);
CREATE INDEX idx_beta_feedback_type ON public.beta_feedback(feedback_type);
CREATE INDEX idx_beta_feedback_status ON public.beta_feedback(status);
CREATE INDEX idx_beta_feedback_priority ON public.beta_feedback(priority);

-- Enable RLS
ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_signup_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_testing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_signup_references ENABLE ROW LEVEL SECURITY;

-- RLS Policies for beta_signups
CREATE POLICY "Users can view their own beta signup" ON public.beta_signups
  FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can update their own beta signup" ON public.beta_signups
  FOR UPDATE USING (auth.uid()::text = email);

CREATE POLICY "Admins can view all beta signups" ON public.beta_signups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all beta signups" ON public.beta_signups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for documents
CREATE POLICY "Users can view their own documents" ON public.beta_signup_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.beta_signups 
      WHERE id = signup_id AND email = auth.uid()::text
    )
  );

CREATE POLICY "Admins can view all documents" ON public.beta_signup_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to calculate priority score
CREATE OR REPLACE FUNCTION calculate_beta_priority_score(signup_id uuid)
RETURNS integer AS $$
DECLARE
  score integer := 0;
  signup_record public.beta_signups%ROWTYPE;
BEGIN
  SELECT * INTO signup_record FROM public.beta_signups WHERE id = signup_id;
  
  -- Base score
  score := 10;
  
  -- Years in aviation (more experience = higher priority)
  IF signup_record.years_in_aviation IS NOT NULL THEN
    score := score + LEAST(signup_record.years_in_aviation, 20);
  END IF;
  
  -- Company type (operators and brokers get higher priority)
  IF signup_record.company_type IN ('private_jet_operator', 'charter_company', 'aviation_broker') THEN
    score := score + 15;
  ELSIF signup_record.company_type = 'corporate_flight_dept' THEN
    score := score + 10;
  END IF;
  
  -- Fleet size (larger fleets = higher priority)
  IF signup_record.fleet_size IS NOT NULL THEN
    score := score + LEAST(signup_record.fleet_size / 5, 20);
  END IF;
  
  -- Expected volume (higher volume = higher priority)
  IF signup_record.expected_monthly_volume IS NOT NULL THEN
    score := score + LEAST(signup_record.expected_monthly_volume / 10, 15);
  END IF;
  
  -- Availability (more availability = higher priority)
  IF signup_record.availability_hours_per_week IS NOT NULL THEN
    score := score + LEAST(signup_record.availability_hours_per_week, 10);
  END IF;
  
  -- Willing to interview (shows engagement)
  IF signup_record.willing_to_interview THEN
    score := score + 5;
  END IF;
  
  -- Documents uploaded (shows seriousness)
  IF signup_record.documents_uploaded THEN
    score := score + 10;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate priority score
CREATE OR REPLACE FUNCTION update_beta_priority_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.priority_score := calculate_beta_priority_score(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_beta_priority_score
  BEFORE INSERT OR UPDATE ON public.beta_signups
  FOR EACH ROW
  EXECUTE FUNCTION update_beta_priority_score();

-- Create function to send beta approval notification
CREATE OR REPLACE FUNCTION notify_beta_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
    -- Update approved_at timestamp
    NEW.approved_at := now();
    
    -- Here you would typically send an email notification
    -- For now, we'll just log it
    RAISE NOTICE 'Beta signup approved for: %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_beta_approval
  BEFORE UPDATE ON public.beta_signups
  FOR EACH ROW
  EXECUTE FUNCTION notify_beta_approval();
