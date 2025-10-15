-- Migration: Add role-specific fields and verification columns to profiles table
-- For Magic Link Authentication System

-- Add role-specific fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS
  -- Common fields (already exist: first_name, last_name, phone, country)
  
  -- Broker-specific fields
  company_name TEXT,
  license_number TEXT,
  license_authority TEXT,
  years_experience INTEGER,
  
  -- Operator-specific fields  
  fleet_size INTEGER,
  aircraft_types TEXT[],
  operating_regions TEXT[],
  
  -- Pilot-specific fields
  license_type TEXT, -- ATP, CPL, PPL
  total_flight_hours INTEGER,
  aircraft_ratings TEXT[],
  current_employer TEXT,
  
  -- Crew-specific fields
  specialties TEXT[], -- VIP service, corporate events, etc.
  certifications TEXT[], -- Cabin crew training, first aid, etc.
  languages_spoken TEXT[],
  
  -- Document URLs
  id_document_url TEXT,
  license_document_url TEXT,
  additional_documents JSONB, -- Store array of document objects
  
  -- Verification status
  verification_status TEXT DEFAULT 'pending_documents' CHECK (verification_status IN (
    'pending_documents',
    'pending_verification', 
    'approved',
    'rejected'
  )),
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON public.profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create document storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Admin can view all documents
CREATE POLICY "Admins can view all documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create verification queue view for admin
CREATE OR REPLACE VIEW public.verification_queue AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  p.role,
  p.verification_status,
  p.created_at,
  p.updated_at,
  p.company_name,
  p.license_number,
  p.license_authority,
  p.years_experience,
  p.fleet_size,
  p.aircraft_types,
  p.operating_regions,
  p.license_type,
  p.total_flight_hours,
  p.aircraft_ratings,
  p.current_employer,
  p.specialties,
  p.certifications,
  p.languages_spoken,
  p.id_document_url,
  p.license_document_url,
  p.additional_documents,
  p.verification_notes
FROM public.profiles p
WHERE p.verification_status IN ('pending_verification', 'rejected')
ORDER BY p.created_at ASC;

-- RLS for verification queue view
ALTER VIEW public.verification_queue SET (security_invoker = true);

-- Grant access to verification queue for admins
GRANT SELECT ON public.verification_queue TO authenticated;

-- Create function to update verification status
CREATE OR REPLACE FUNCTION public.update_verification_status(
  user_id UUID,
  new_status TEXT,
  notes TEXT DEFAULT NULL,
  verified_by_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is admin (if verified_by_id is provided)
  IF verified_by_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = verified_by_id AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Only admins can verify users';
    END IF;
  END IF;

  -- Update verification status
  UPDATE public.profiles
  SET 
    verification_status = new_status,
    verification_notes = notes,
    verified_at = CASE WHEN new_status = 'approved' THEN NOW() ELSE verified_at END,
    verified_by = verified_by_id,
    updated_at = NOW()
  WHERE id = user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admins will be checked inside function)
GRANT EXECUTE ON FUNCTION public.update_verification_status TO authenticated;

-- Create notification function for verification status changes
CREATE OR REPLACE FUNCTION public.notify_verification_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Send notification when verification status changes
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      data
    ) VALUES (
      NEW.id,
      CASE NEW.verification_status
        WHEN 'approved' THEN 'Account Approved'
        WHEN 'rejected' THEN 'Account Verification Required'
        ELSE 'Verification Status Updated'
      END,
      CASE NEW.verification_status
        WHEN 'approved' THEN 'Your account has been approved! You can now access all platform features.'
        WHEN 'rejected' THEN 'Your account verification was not approved. Please review the notes and resubmit your documents.'
        ELSE 'Your verification status has been updated.'
      END,
      'verification',
      jsonb_build_object(
        'status', NEW.verification_status,
        'notes', NEW.verification_notes,
        'verified_at', NEW.verified_at
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for verification status notifications
DROP TRIGGER IF EXISTS verification_status_notification ON public.profiles;
CREATE TRIGGER verification_status_notification
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_verification_status_change();

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.verification_status IS 'Current verification status: pending_documents, pending_verification, approved, rejected';
COMMENT ON COLUMN public.profiles.company_name IS 'Company name for brokers and operators';
COMMENT ON COLUMN public.profiles.license_number IS 'Professional license or certificate number';
COMMENT ON COLUMN public.profiles.license_authority IS 'Issuing authority (FAA, EASA, CAA, etc.)';
COMMENT ON COLUMN public.profiles.years_experience IS 'Years of professional experience';
COMMENT ON COLUMN public.profiles.fleet_size IS 'Number of aircraft in operator fleet';
COMMENT ON COLUMN public.profiles.aircraft_types IS 'Array of aircraft types operated';
COMMENT ON COLUMN public.profiles.operating_regions IS 'Array of regions where operations occur';
COMMENT ON COLUMN public.profiles.license_type IS 'Pilot license type (ATP, CPL, PPL)';
COMMENT ON COLUMN public.profiles.total_flight_hours IS 'Total flight hours for pilots';
COMMENT ON COLUMN public.profiles.aircraft_ratings IS 'Array of aircraft ratings for pilots';
COMMENT ON COLUMN public.profiles.current_employer IS 'Current employer for pilots';
COMMENT ON COLUMN public.profiles.specialties IS 'Array of crew specialties';
COMMENT ON COLUMN public.profiles.certifications IS 'Array of crew certifications';
COMMENT ON COLUMN public.profiles.languages_spoken IS 'Array of languages spoken by crew';
COMMENT ON COLUMN public.profiles.id_document_url IS 'URL to uploaded ID document';
COMMENT ON COLUMN public.profiles.license_document_url IS 'URL to uploaded license document';
COMMENT ON COLUMN public.profiles.additional_documents IS 'JSONB array of additional document objects';
COMMENT ON COLUMN public.profiles.verification_notes IS 'Admin notes about verification decision';
COMMENT ON COLUMN public.profiles.verified_at IS 'Timestamp when account was approved';
COMMENT ON COLUMN public.profiles.verified_by IS 'Admin user who verified the account';

COMMENT ON VIEW public.verification_queue IS 'View of users pending verification for admin dashboard';
COMMENT ON FUNCTION public.update_verification_status IS 'Function to update user verification status (admin only)';

