-- Live Production Schema with Row Level Security
-- FCA Compliant Aviation Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('broker', 'operator', 'pilot', 'crew', 'admin')),
  company_name TEXT,
  phone TEXT,
  address JSONB,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  kyc_verified_at TIMESTAMPTZ,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table
CREATE TABLE public.deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES public.users(id) NOT NULL,
  operator_id UUID REFERENCES public.users(id) NOT NULL,
  route TEXT NOT NULL,
  aircraft TEXT NOT NULL,
  departure_date TIMESTAMPTZ NOT NULL,
  price_pennies INTEGER NOT NULL,
  currency TEXT NOT NULL,
  platform_fee_pennies INTEGER NOT NULL,
  net_to_operator_pennies INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'quoted', 'accepted', 'paid', 'completed', 'cancelled', 'disputed')),
  stripe_payment_intent_id TEXT,
  receipt_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hires table
CREATE TABLE public.hires (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  operator_id UUID REFERENCES public.users(id) NOT NULL,
  pilot_id UUID REFERENCES public.users(id),
  crew_id UUID REFERENCES public.users(id),
  role TEXT NOT NULL,
  salary_pennies INTEGER NOT NULL,
  currency TEXT NOT NULL,
  hiring_fee_pennies INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'paid', 'completed', 'cancelled')),
  stripe_payment_intent_id TEXT,
  receipt_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK ((pilot_id IS NOT NULL AND crew_id IS NULL) OR (pilot_id IS NULL AND crew_id IS NOT NULL))
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id),
  hire_id UUID REFERENCES public.hires(id),
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount_pennies INTEGER NOT NULL,
  currency TEXT NOT NULL,
  application_fee_pennies INTEGER NOT NULL,
  net_amount_pennies INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  receipt_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK ((deal_id IS NOT NULL AND hire_id IS NULL) OR (deal_id IS NULL AND hire_id IS NOT NULL))
);

-- Credentials table
CREATE TABLE public.credentials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  credential_type TEXT NOT NULL CHECK (credential_type IN ('pilot_license', 'crew_certification', 'operator_license')),
  credential_number TEXT NOT NULL,
  issuing_authority TEXT NOT NULL,
  issued_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sanctions results table
CREATE TABLE public.sanctions_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  screening_date TIMESTAMPTZ NOT NULL,
  provider TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('clear', 'hit', 'review_required')),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log table (append-only)
CREATE TABLE public.audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- DSAR requests table
CREATE TABLE public.dsar_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'export', 'erasure', 'rectification')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  description TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  admin_notes TEXT
);

-- Stripe webhook events table (for idempotency)
CREATE TABLE public.stripe_webhook_events (
  id TEXT PRIMARY KEY,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanctions_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsar_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Deals policies
CREATE POLICY "Users can view deals they're involved in" ON public.deals
  FOR SELECT USING (
    auth.uid() = broker_id OR 
    auth.uid() = operator_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Brokers can create deals" ON public.deals
  FOR INSERT WITH CHECK (
    auth.uid() = broker_id AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'broker')
  );

CREATE POLICY "Operators can update deals they're involved in" ON public.deals
  FOR UPDATE USING (
    auth.uid() = operator_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Hires policies
CREATE POLICY "Users can view hires they're involved in" ON public.hires
  FOR SELECT USING (
    auth.uid() = operator_id OR 
    auth.uid() = pilot_id OR 
    auth.uid() = crew_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Operators can create hires" ON public.hires
  FOR INSERT WITH CHECK (
    auth.uid() = operator_id AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'operator')
  );

-- Payments policies
CREATE POLICY "Users can view payments for their deals/hires" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.deals d 
      WHERE d.id = deal_id AND (d.broker_id = auth.uid() OR d.operator_id = auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM public.hires h 
      WHERE h.id = hire_id AND (h.operator_id = auth.uid() OR h.pilot_id = auth.uid() OR h.crew_id = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Credentials policies
CREATE POLICY "Users can view own credentials" ON public.credentials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own credentials" ON public.credentials
  FOR ALL USING (auth.uid() = user_id);

-- Sanctions results policies
CREATE POLICY "Users can view own sanctions results" ON public.sanctions_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sanctions results" ON public.sanctions_results
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Audit log policies (read-only for users, full access for admins)
CREATE POLICY "Users can view own audit log" ON public.audit_log
  FOR SELECT USING (auth.uid() = actor_id);

CREATE POLICY "Admins can view all audit log" ON public.audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- DSAR requests policies
CREATE POLICY "Users can manage own DSAR requests" ON public.dsar_requests
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all DSAR requests" ON public.dsar_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Stripe webhook events policies (admin only)
CREATE POLICY "Admins can manage webhook events" ON public.stripe_webhook_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes for performance
CREATE INDEX idx_deals_broker_id ON public.deals(broker_id);
CREATE INDEX idx_deals_operator_id ON public.deals(operator_id);
CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_hires_operator_id ON public.hires(operator_id);
CREATE INDEX idx_hires_pilot_id ON public.hires(pilot_id);
CREATE INDEX idx_hires_crew_id ON public.hires(crew_id);
CREATE INDEX idx_payments_deal_id ON public.payments(deal_id);
CREATE INDEX idx_payments_hire_id ON public.payments(hire_id);
CREATE INDEX idx_credentials_user_id ON public.credentials(user_id);
CREATE INDEX idx_credentials_expiry ON public.credentials(expiry_date);
CREATE INDEX idx_sanctions_user_id ON public.sanctions_results(user_id);
CREATE INDEX idx_audit_log_actor_id ON public.audit_log(actor_id);
CREATE INDEX idx_audit_log_timestamp ON public.audit_log(timestamp);
CREATE INDEX idx_dsar_user_id ON public.dsar_requests(user_id);

-- Functions for audit logging
CREATE OR REPLACE FUNCTION log_audit_event(
  p_actor_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_log (
    actor_id, action, resource_type, resource_id, 
    details, ip_address, user_agent, timestamp
  ) VALUES (
    p_actor_id, p_action, p_resource_type, p_resource_id,
    p_details, p_ip_address, p_user_agent, NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can receive payouts (KYC verified)
CREATE OR REPLACE FUNCTION can_receive_payouts(p_user_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_user_id 
    AND kyc_status = 'verified'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check credential expiry
CREATE OR REPLACE FUNCTION is_credential_expired(p_user_id UUID, p_credential_type TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.credentials 
    WHERE user_id = p_user_id 
    AND credential_type = p_credential_type 
    AND expiry_date < CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hires_updated_at BEFORE UPDATE ON public.hires
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON public.credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
