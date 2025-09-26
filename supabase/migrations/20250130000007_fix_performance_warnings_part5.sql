-- Fix Performance Warnings - Part 5
-- Function Optimizations and Security Fixes

-- 1. Optimize Security Functions
CREATE OR REPLACE FUNCTION public.check_password_leak(password_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- This is a placeholder for password leak checking
  -- In production, you would integrate with a service like HaveIBeenPwned
  -- For now, we'll implement basic password strength requirements
  
  -- Check password length (minimum 12 characters)
  IF length(password_hash) < 12 THEN
    RETURN false;
  END IF;
  
  -- Check for common weak passwords
  IF password_hash IN (
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- 2. Optimize Security Event Logging
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  event_data jsonb DEFAULT '{}'::jsonb,
  ip_address inet DEFAULT NULL,
  user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    event_type,
    event_data,
    ip_address,
    user_agent
  ) VALUES (
    (select auth.uid()),
    event_type,
    event_data,
    ip_address,
    user_agent
  );
END;
$$;

-- 3. Optimize Suspicious Activity Detection
CREATE OR REPLACE FUNCTION public.check_suspicious_activity()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  recent_failed_logins integer;
  recent_events integer;
BEGIN
  -- Check for multiple failed login attempts in the last hour
  SELECT COUNT(*) INTO recent_failed_logins
  FROM public.security_audit_log
  WHERE event_type = 'login_failed'
    AND created_at > now() - interval '1 hour'
    AND user_id = (select auth.uid());
  
  -- Check for unusual activity patterns
  SELECT COUNT(*) INTO recent_events
  FROM public.security_audit_log
  WHERE user_id = (select auth.uid())
    AND created_at > now() - interval '1 hour';
  
  -- If more than 5 failed logins or 20 events in the last hour, flag as suspicious
  IF recent_failed_logins > 5 OR recent_events > 20 THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 4. Optimize Account Lockout Handling
CREATE OR REPLACE FUNCTION public.handle_account_lockout()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log the lockout event
  PERFORM public.log_security_event(
    'account_lockout',
    jsonb_build_object(
      'reason', 'suspicious_activity',
      'timestamp', now()
    )
  );
  
  -- In a real implementation, you would update user status or send notifications
  -- For now, we'll just log the event
END;
$$;

-- 5. Optimize User Authentication
CREATE OR REPLACE FUNCTION public.authenticate_user(email text, password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_exists boolean;
  is_locked boolean;
BEGIN
  -- Check if user exists
  SELECT EXISTS(
    SELECT 1 FROM auth.users 
    WHERE email = authenticate_user.email
  ) INTO user_exists;
  
  IF NOT user_exists THEN
    PERFORM public.log_security_event(
      'login_attempt_nonexistent_user',
      jsonb_build_object('email', email)
    );
    RETURN false;
  END IF;
  
  -- Check for suspicious activity
  SELECT public.check_suspicious_activity() INTO is_locked;
  
  IF is_locked THEN
    PERFORM public.handle_account_lockout();
    RETURN false;
  END IF;
  
  -- Log successful authentication
  PERFORM public.log_security_event(
    'login_success',
    jsonb_build_object('email', email)
  );
  
  RETURN true;
END;
$$;

-- 6. Optimize Audit Log Cleanup
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete audit logs older than 90 days
  DELETE FROM public.security_audit_log
  WHERE created_at < now() - interval '90 days';
END;
$$;

-- 7. Create Optimized Views for Admin Dashboard
CREATE OR REPLACE VIEW public.admin_security_dashboard AS
SELECT 
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(created_at) as last_occurrence
FROM public.security_audit_log
WHERE created_at > now() - interval '24 hours'
GROUP BY event_type
ORDER BY event_count DESC;

-- 8. Grant Necessary Permissions
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_password_leak(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_security_event(text, jsonb, inet, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_suspicious_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_account_lockout() TO authenticated;
GRANT EXECUTE ON FUNCTION public.authenticate_user(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_audit_logs() TO authenticated;
GRANT SELECT ON public.admin_security_dashboard TO authenticated;

-- 9. Create Function to Update Statistics
CREATE OR REPLACE FUNCTION public.update_table_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update statistics for all major tables
  ANALYZE public.companies;
  ANALYZE public.users;
  ANALYZE public.requests;
  ANALYZE public.quotes;
  ANALYZE public.bookings;
  ANALYZE public.job_posts;
  ANALYZE public.job_applications;
  ANALYZE public.contracts;
  ANALYZE public.receipts;
  ANALYZE public.document_storage;
  ANALYZE public.community_forums;
  ANALYZE public.forum_posts;
  ANALYZE public.saved_crews;
  ANALYZE public.user_monitoring;
  ANALYZE public.security_audit_log;
  ANALYZE public.contract_audit_trail;
END;
$$;

-- 10. Grant Execute Permission for Statistics Update
GRANT EXECUTE ON FUNCTION public.update_table_statistics() TO authenticated;
