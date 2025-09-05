-- Create AI monitoring system and security enhancements (Fixed JSON format)

-- Create security events table for AI monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_hash TEXT, -- Store hashed IP instead of actual IP
  user_agent_hash TEXT, -- Store hashed user agent
  blocked BOOLEAN DEFAULT false,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view security events
CREATE POLICY "Admins can view all security events" 
ON public.security_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- System can insert security events
CREATE POLICY "System can create security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- Admins can update security events
CREATE POLICY "Admins can update security events" 
ON public.security_events 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create AI warnings table
CREATE TABLE IF NOT EXISTS public.ai_warnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  warning_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'danger', 'critical')),
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on AI warnings
ALTER TABLE public.ai_warnings ENABLE ROW LEVEL SECURITY;

-- Users can view their own warnings
CREATE POLICY "Users can view their own warnings" 
ON public.ai_warnings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can acknowledge their warnings
CREATE POLICY "Users can acknowledge their warnings" 
ON public.ai_warnings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- System can create warnings
CREATE POLICY "System can create warnings" 
ON public.ai_warnings 
FOR INSERT 
WITH CHECK (true);

-- Create security settings table
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security settings
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage security settings
CREATE POLICY "Admins can manage security settings" 
ON public.security_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Insert default security settings with proper JSON format
INSERT INTO public.security_settings (setting_name, setting_value, description) VALUES
('ai_monitoring_enabled', '"true"', 'Enable AI-powered security monitoring'),
('max_login_attempts', '5', 'Maximum login attempts before account lockout'),
('session_timeout_minutes', '60', 'Session timeout in minutes'),
('ip_tracking_enabled', '"false"', 'Track IP addresses (disabled for privacy)'),
('admin_protection_level', '"maximum"', 'Admin account protection level'),
('suspicious_activity_threshold', '3', 'Number of suspicious activities before warning')
ON CONFLICT (setting_name) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Update audit_logs to remove IP tracking and add hashed identifiers
ALTER TABLE public.audit_logs 
DROP COLUMN IF EXISTS ip_address CASCADE,
DROP COLUMN IF EXISTS user_agent CASCADE;

ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS session_hash TEXT,
ADD COLUMN IF NOT EXISTS request_hash TEXT;