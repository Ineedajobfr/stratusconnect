-- Create DSAR (Data Subject Access Request) tables
-- Implements GDPR data subject rights workflow

-- DSAR requests table
CREATE TABLE IF NOT EXISTS public.dsar_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  request_type text NOT NULL CHECK (request_type IN ('access', 'portability', 'erasure', 'restriction', 'objection')),
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')) DEFAULT 'pending',
  description text NOT NULL,
  requested_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  rejection_reason text,
  response_data jsonb,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- DSAR audit log for tracking all actions
CREATE TABLE IF NOT EXISTS public.dsar_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.dsar_requests(id) ON DELETE CASCADE,
  action text NOT NULL,
  performed_by uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  performed_at timestamptz DEFAULT now(),
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text
);

-- Data processing activities record
CREATE TABLE IF NOT EXISTS public.data_processing_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_name text NOT NULL,
  purpose text NOT NULL,
  legal_basis text NOT NULL,
  data_categories text[] NOT NULL,
  data_subjects text[] NOT NULL,
  recipients text[],
  third_country_transfers boolean DEFAULT false,
  safeguards text,
  retention_period text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dsar_requests_user_id ON public.dsar_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_dsar_requests_status ON public.dsar_requests(status);
CREATE INDEX IF NOT EXISTS idx_dsar_requests_requested_at ON public.dsar_requests(requested_at);
CREATE INDEX IF NOT EXISTS idx_dsar_audit_log_request_id ON public.dsar_audit_log(request_id);
CREATE INDEX IF NOT EXISTS idx_dsar_audit_log_performed_at ON public.dsar_audit_log(performed_at);

-- Row Level Security policies
ALTER TABLE public.dsar_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsar_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_processing_activities ENABLE ROW LEVEL SECURITY;

-- DSAR requests policies
CREATE POLICY "Users can view their own DSAR requests" ON public.dsar_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own DSAR requests" ON public.dsar_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending DSAR requests" ON public.dsar_requests
  FOR UPDATE USING (
    auth.uid() = user_id AND 
    status = 'pending'
  );

CREATE POLICY "Admins can view all DSAR requests" ON public.dsar_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update DSAR requests" ON public.dsar_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- DSAR audit log policies
CREATE POLICY "Users can view audit logs for their requests" ON public.dsar_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.dsar_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all audit logs" ON public.dsar_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can create audit logs" ON public.dsar_audit_log
  FOR INSERT WITH CHECK (true);

-- Data processing activities policies (admin only)
CREATE POLICY "Only admins can view processing activities" ON public.data_processing_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage processing activities" ON public.data_processing_activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for DSAR management
CREATE OR REPLACE FUNCTION public.create_dsar_request(
  p_user_id uuid,
  p_request_type text,
  p_description text
) RETURNS uuid AS $$
DECLARE
  v_request_id uuid;
BEGIN
  INSERT INTO public.dsar_requests (
    user_id,
    request_type,
    description,
    status
  ) VALUES (
    p_user_id,
    p_request_type,
    p_description,
    'pending'
  ) RETURNING id INTO v_request_id;
  
  -- Log the creation
  INSERT INTO public.dsar_audit_log (
    request_id,
    action,
    performed_by,
    details
  ) VALUES (
    v_request_id,
    'request_created',
    p_user_id,
    jsonb_build_object(
      'request_type', p_request_type,
      'description', p_description
    )
  );
  
  RETURN v_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update DSAR status
CREATE OR REPLACE FUNCTION public.update_dsar_status(
  p_request_id uuid,
  p_status text,
  p_admin_notes text DEFAULT NULL,
  p_rejection_reason text DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_old_status text;
BEGIN
  -- Get current status
  SELECT status INTO v_old_status 
  FROM public.dsar_requests 
  WHERE id = p_request_id;
  
  -- Update the request
  UPDATE public.dsar_requests 
  SET 
    status = p_status,
    admin_notes = COALESCE(p_admin_notes, admin_notes),
    rejection_reason = COALESCE(p_rejection_reason, rejection_reason),
    completed_at = CASE WHEN p_status = 'completed' THEN now() ELSE completed_at END,
    updated_at = now()
  WHERE id = p_request_id;
  
  -- Log the status change
  INSERT INTO public.dsar_audit_log (
    request_id,
    action,
    performed_by,
    details
  ) VALUES (
    p_request_id,
    'status_updated',
    auth.uid(),
    jsonb_build_object(
      'old_status', v_old_status,
      'new_status', p_status,
      'admin_notes', p_admin_notes,
      'rejection_reason', p_rejection_reason
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log DSAR actions
CREATE OR REPLACE FUNCTION public.log_dsar_action(
  p_request_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}'::jsonb
) RETURNS void AS $$
BEGIN
  INSERT INTO public.dsar_audit_log (
    request_id,
    action,
    performed_by,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_request_id,
    p_action,
    auth.uid(),
    p_details,
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default data processing activities
INSERT INTO public.data_processing_activities (
  activity_name,
  purpose,
  legal_basis,
  data_categories,
  data_subjects,
  recipients,
  third_country_transfers,
  safeguards,
  retention_period
) VALUES 
(
  'User Account Management',
  'Creating and managing user accounts for platform access',
  'Contract',
  ARRAY['Identity Data', 'Contact Data', 'Technical Data'],
  ARRAY['Brokers', 'Operators', 'Pilots', 'Crew'],
  ARRAY['Stratus Connect', 'Payment Processors'],
  false,
  'Data processed within UK/EU',
  'Account closure + 7 years'
),
(
  'Identity Verification',
  'Verifying user identity and aviation credentials',
  'Legal Obligation',
  ARRAY['Identity Data', 'Aviation Credentials'],
  ARRAY['Brokers', 'Operators', 'Pilots', 'Crew'],
  ARRAY['Stratus Connect', 'Verification Providers'],
  false,
  'Data processed within UK/EU',
  'Credential expiry + 2 years'
),
(
  'Payment Processing',
  'Processing payments and managing escrow transactions',
  'Contract',
  ARRAY['Financial Data', 'Identity Data'],
  ARRAY['Brokers', 'Operators'],
  ARRAY['Stratus Connect', 'Payment Processors'],
  false,
  'Data processed within UK/EU',
  '7 years (legal requirement)'
),
(
  'Service Delivery',
  'Providing platform services and facilitating transactions',
  'Contract',
  ARRAY['All Data Categories'],
  ARRAY['All User Types'],
  ARRAY['Stratus Connect'],
  false,
  'Data processed within UK/EU',
  'Service termination + 7 years'
),
(
  'Compliance Monitoring',
  'Monitoring compliance with aviation regulations',
  'Legal Obligation',
  ARRAY['Aviation Credentials', 'Financial Data'],
  ARRAY['Operators', 'Pilots', 'Crew'],
  ARRAY['Stratus Connect', 'Regulatory Authorities'],
  false,
  'Data processed within UK/EU',
  'Regulatory requirement period'
),
(
  'Security and Fraud Prevention',
  'Preventing fraud and ensuring platform security',
  'Legitimate Interests',
  ARRAY['Technical Data', 'Identity Data'],
  ARRAY['All User Types'],
  ARRAY['Stratus Connect', 'Security Providers'],
  false,
  'Data processed within UK/EU',
  '2 years'
),
(
  'Marketing Communications',
  'Sending marketing communications to users',
  'Consent',
  ARRAY['Contact Data'],
  ARRAY['All User Types'],
  ARRAY['Stratus Connect'],
  false,
  'Data processed within UK/EU',
  'Until consent withdrawn'
);

-- Add comments
COMMENT ON TABLE public.dsar_requests IS 'Data Subject Access Requests for GDPR compliance';
COMMENT ON TABLE public.dsar_audit_log IS 'Audit log for all DSAR actions and status changes';
COMMENT ON TABLE public.data_processing_activities IS 'Record of Processing Activities as required by GDPR Article 30';

-- Add constraints
ALTER TABLE public.dsar_requests 
ADD CONSTRAINT chk_dsar_request_type CHECK (request_type IN ('access', 'portability', 'erasure', 'restriction', 'objection'));

ALTER TABLE public.dsar_requests 
ADD CONSTRAINT chk_dsar_status CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected'));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dsar_requests_updated_at
  BEFORE UPDATE ON public.dsar_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_processing_activities_updated_at
  BEFORE UPDATE ON public.data_processing_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
