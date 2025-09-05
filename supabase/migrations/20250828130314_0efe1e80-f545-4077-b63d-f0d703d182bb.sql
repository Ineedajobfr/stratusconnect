-- Create security monitoring functions and triggers (Part 2)

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

-- Create function to check user security status
CREATE OR REPLACE FUNCTION public.get_user_security_status(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  security_status JSONB;
  event_count INTEGER;
  warning_count INTEGER;
BEGIN
  -- Count recent security events
  SELECT COUNT(*) INTO event_count
  FROM security_events 
  WHERE user_id = p_user_id 
  AND created_at > now() - INTERVAL '24 hours';
  
  -- Count unacknowledged warnings
  SELECT COUNT(*) INTO warning_count
  FROM ai_warnings 
  WHERE user_id = p_user_id 
  AND acknowledged = false 
  AND (expires_at IS NULL OR expires_at > now());
  
  security_status := jsonb_build_object(
    'recent_events', event_count,
    'active_warnings', warning_count,
    'risk_level', CASE 
      WHEN event_count > 5 THEN 'high'
      WHEN event_count > 2 THEN 'medium'
      ELSE 'low'
    END
  );
  
  RETURN security_status;
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
      
      -- Create AI warning for role changes
      PERFORM create_ai_warning(
        NEW.user_id,
        'security_alert',
        'Your account role has been changed. If this was not authorized by you, please contact support immediately.',
        'danger',
        72
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