-- Create AI monitoring system and security enhancements

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

-- Insert default security settings
INSERT INTO public.security_settings (setting_name, setting_value, description) VALUES
('ai_monitoring_enabled', 'true', 'Enable AI-powered security monitoring'),
('max_login_attempts', '5', 'Maximum login attempts before account lockout'),
('session_timeout_minutes', '60', 'Session timeout in minutes'),
('ip_tracking_enabled', 'false', 'Track IP addresses (disabled for privacy)'),
('admin_protection_level', 'maximum', 'Admin account protection level'),
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

-- Create security monitoring function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_severity TEXT DEFAULT 'low',
  p_description TEXT DEFAULT '',
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO security_events (
    user_id, 
    event_type, 
    severity, 
    description, 
    metadata
  ) VALUES (
    p_user_id,
    p_event_type,
    p_severity,
    p_description,
    p_metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Create AI warning function
CREATE OR REPLACE FUNCTION public.create_ai_warning(
  p_user_id UUID,
  p_warning_type TEXT,
  p_message TEXT,
  p_severity TEXT DEFAULT 'warning',
  p_expires_hours INTEGER DEFAULT 24
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  warning_id UUID;
BEGIN
  INSERT INTO ai_warnings (
    user_id,
    warning_type,
    message,
    severity,
    expires_at
  ) VALUES (
    p_user_id,
    p_warning_type,
    p_message,
    p_severity,
    now() + INTERVAL '1 hour' * p_expires_hours
  ) RETURNING id INTO warning_id;
  
  RETURN warning_id;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_ai_warnings_user_id ON ai_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_warnings_acknowledged ON ai_warnings(acknowledged);

-- Add triggers for automatic security monitoring
CREATE OR REPLACE FUNCTION public.monitor_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log profile changes for monitoring
  IF TG_OP = 'UPDATE' THEN
    -- Check for suspicious role changes
    IF OLD.role != NEW.role THEN
      PERFORM log_security_event(
        NEW.user_id,
        'role_change',
        'high',
        format('Role changed from %s to %s', OLD.role, NEW.role),
        jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role)
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for profile monitoring
DROP TRIGGER IF EXISTS profile_security_monitor ON profiles;
CREATE TRIGGER profile_security_monitor
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION monitor_profile_changes();