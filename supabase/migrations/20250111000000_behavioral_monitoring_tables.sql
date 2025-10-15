-- Create behavioral monitoring tables for enhanced security

-- Behavioral logs table
CREATE TABLE public.behavioral_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  pattern_data JSONB NOT NULL,
  suspicious_activities JSONB DEFAULT '[]'::jsonb,
  risk_score NUMERIC(3,2) DEFAULT 0.0 CHECK (risk_score >= 0 AND risk_score <= 1),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rate limits table (if not exists)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security events table (if not exists)
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address TEXT,
  user_agent TEXT,
  user_id UUID REFERENCES auth.users(id),
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User risk profiles table
CREATE TABLE public.user_risk_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  overall_risk_score NUMERIC(3,2) DEFAULT 0.0 CHECK (risk_score >= 0 AND risk_score <= 1),
  behavioral_risk_score NUMERIC(3,2) DEFAULT 0.0,
  activity_risk_score NUMERIC(3,2) DEFAULT 0.0,
  device_fingerprint TEXT,
  last_activity TIMESTAMP WITH TIME ZONE,
  suspicious_activity_count INTEGER DEFAULT 0,
  last_suspicious_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Security alerts table
CREATE TABLE public.security_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on all tables
ALTER TABLE public.behavioral_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for behavioral_logs
CREATE POLICY "Admin can view all behavioral logs" ON public.behavioral_logs
FOR SELECT USING (EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

CREATE POLICY "System can insert behavioral logs" ON public.behavioral_logs
FOR INSERT WITH CHECK (true);

-- RLS Policies for rate_limits
CREATE POLICY "Admin can view rate limits" ON public.rate_limits
FOR SELECT USING (EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

CREATE POLICY "System can manage rate limits" ON public.rate_limits
FOR ALL USING (true);

-- RLS Policies for security_events
CREATE POLICY "Admin can view security events" ON public.security_events
FOR SELECT USING (EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

CREATE POLICY "System can insert security events" ON public.security_events
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update security events" ON public.security_events
FOR UPDATE USING (EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- RLS Policies for user_risk_profiles
CREATE POLICY "Users can view own risk profile" ON public.user_risk_profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all risk profiles" ON public.user_risk_profiles
FOR SELECT USING (EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

CREATE POLICY "System can manage risk profiles" ON public.user_risk_profiles
FOR ALL USING (true);

-- RLS Policies for security_alerts
CREATE POLICY "Users can view own alerts" ON public.security_alerts
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all alerts" ON public.security_alerts
FOR SELECT USING (EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

CREATE POLICY "System can insert alerts" ON public.security_alerts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update alerts" ON public.security_alerts
FOR UPDATE USING (EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Create indexes for performance
CREATE INDEX idx_behavioral_logs_user_id ON public.behavioral_logs(user_id);
CREATE INDEX idx_behavioral_logs_ip_address ON public.behavioral_logs(ip_address);
CREATE INDEX idx_behavioral_logs_timestamp ON public.behavioral_logs(timestamp);
CREATE INDEX idx_behavioral_logs_risk_score ON public.behavioral_logs(risk_score);

CREATE INDEX idx_rate_limits_key ON public.rate_limits(key);
CREATE INDEX idx_rate_limits_updated_at ON public.rate_limits(updated_at);

CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_timestamp ON public.security_events(timestamp);
CREATE INDEX idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX idx_security_events_ip_address ON public.security_events(ip_address);

CREATE INDEX idx_user_risk_profiles_user_id ON public.user_risk_profiles(user_id);
CREATE INDEX idx_user_risk_profiles_overall_risk_score ON public.user_risk_profiles(overall_risk_score);

CREATE INDEX idx_security_alerts_user_id ON public.security_alerts(user_id);
CREATE INDEX idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX idx_security_alerts_status ON public.security_alerts(status);
CREATE INDEX idx_security_alerts_created_at ON public.security_alerts(created_at);

-- Create function to update user risk profiles
CREATE OR REPLACE FUNCTION update_user_risk_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user risk profile when behavioral logs are inserted
  INSERT INTO public.user_risk_profiles (
    user_id,
    behavioral_risk_score,
    last_activity,
    suspicious_activity_count,
    last_suspicious_activity,
    updated_at
  )
  VALUES (
    NEW.user_id,
    NEW.risk_score,
    NEW.timestamp,
    CASE WHEN NEW.risk_score > 0.5 THEN 1 ELSE 0 END,
    CASE WHEN NEW.risk_score > 0.5 THEN NEW.timestamp ELSE NULL END,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    behavioral_risk_score = GREATEST(
      user_risk_profiles.behavioral_risk_score,
      NEW.risk_score
    ),
    last_activity = NEW.timestamp,
    suspicious_activity_count = user_risk_profiles.suspicious_activity_count + 
      CASE WHEN NEW.risk_score > 0.5 THEN 1 ELSE 0 END,
    last_suspicious_activity = CASE 
      WHEN NEW.risk_score > 0.5 THEN NEW.timestamp 
      ELSE user_risk_profiles.last_suspicious_activity 
    END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for behavioral logs
CREATE TRIGGER update_user_risk_profile_trigger
  AFTER INSERT ON public.behavioral_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_user_risk_profile();

-- Create function to clean up old behavioral logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_behavioral_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.behavioral_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old rate limits (keep last 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE updated_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE public.behavioral_logs IS 'Stores detailed behavioral analysis data for security monitoring';
COMMENT ON TABLE public.user_risk_profiles IS 'Maintains user risk scores and behavioral patterns';
COMMENT ON TABLE public.security_alerts IS 'Security alerts generated from behavioral analysis';
COMMENT ON COLUMN public.behavioral_logs.pattern_data IS 'JSON data containing mouse movements, keyboard activity, timing, etc.';
COMMENT ON COLUMN public.behavioral_logs.suspicious_activities IS 'JSON array of detected suspicious activities';
COMMENT ON COLUMN public.behavioral_logs.risk_score IS 'Calculated risk score from 0.0 to 1.0';

