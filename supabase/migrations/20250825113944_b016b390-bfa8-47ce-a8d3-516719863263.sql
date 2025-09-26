-- Crew and Pilot Management Tables
CREATE TABLE public.crew_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  crew_type TEXT NOT NULL DEFAULT 'pilot',
  license_number TEXT,
  license_type TEXT,
  experience_years INTEGER DEFAULT 0,
  total_flight_hours INTEGER DEFAULT 0,
  certifications TEXT[],
  languages TEXT[],
  availability_status TEXT NOT NULL DEFAULT 'available',
  hourly_rate NUMERIC,
  base_location TEXT,
  willing_to_travel BOOLEAN DEFAULT true,
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crew certifications and qualifications
CREATE TABLE public.crew_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crew_id UUID NOT NULL,
  certification_name TEXT NOT NULL,
  certification_number TEXT,
  issuing_authority TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crew availability calendar
CREATE TABLE public.crew_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crew_id UUID NOT NULL,
  available_from TIMESTAMP WITH TIME ZONE NOT NULL,
  available_to TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hiring requests from brokers to crew
CREATE TABLE public.hiring_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID NOT NULL,
  crew_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  flight_date TIMESTAMP WITH TIME ZONE,
  return_date TIMESTAMP WITH TIME ZONE,
  departure_location TEXT,
  destination TEXT,
  aircraft_type TEXT,
  duration_hours INTEGER,
  offered_rate NUMERIC,
  hiring_fee NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.crew_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crew_profiles
CREATE POLICY "Crew can manage their own profile" 
ON public.crew_profiles 
FOR ALL 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Everyone can view crew profiles" 
ON public.crew_profiles 
FOR SELECT 
USING (true);

-- RLS Policies for crew_certifications
CREATE POLICY "Crew can manage their own certifications" 
ON public.crew_certifications 
FOR ALL 
USING ((select auth.uid()) IN (SELECT user_id FROM crew_profiles WHERE id = crew_certifications.crew_id));

CREATE POLICY "Everyone can view crew certifications" 
ON public.crew_certifications 
FOR SELECT 
USING (true);

-- RLS Policies for crew_availability
CREATE POLICY "Crew can manage their own availability" 
ON public.crew_availability 
FOR ALL 
USING ((select auth.uid()) IN (SELECT user_id FROM crew_profiles WHERE id = crew_availability.crew_id));

CREATE POLICY "Everyone can view crew availability" 
ON public.crew_availability 
FOR SELECT 
USING (true);

-- RLS Policies for hiring_requests
CREATE POLICY "Brokers can create hiring requests" 
ON public.hiring_requests 
FOR INSERT 
WITH CHECK ((select auth.uid()) = broker_id);

CREATE POLICY "Brokers can view their hiring requests" 
ON public.hiring_requests 
FOR SELECT 
USING ((select auth.uid()) = broker_id);

CREATE POLICY "Crew can view requests for them" 
ON public.hiring_requests 
FOR SELECT 
USING ((select auth.uid()) IN (SELECT user_id FROM crew_profiles WHERE id = hiring_requests.crew_id));

CREATE POLICY "Crew can update requests for them" 
ON public.hiring_requests 
FOR UPDATE 
USING ((select auth.uid()) IN (SELECT user_id FROM crew_profiles WHERE id = hiring_requests.crew_id));

-- Add triggers for updated_at
CREATE TRIGGER update_crew_profiles_updated_at
BEFORE UPDATE ON public.crew_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hiring_requests_updated_at
BEFORE UPDATE ON public.hiring_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();