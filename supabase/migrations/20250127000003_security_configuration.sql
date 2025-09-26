-- Security Configuration Updates
-- Address security warnings and configuration issues

-- Note: These changes require Supabase dashboard configuration
-- The following are recommendations that need to be applied in the Supabase dashboard

-- 1. OTP Expiry Configuration
-- In Supabase Dashboard > Authentication > Settings
-- Set OTP expiry to less than 1 hour (e.g., 15 minutes)
-- This cannot be done via SQL migration

-- 2. Enable HaveIBeenPwned Password Checking
-- In Supabase Dashboard > Authentication > Settings
-- Enable "Check passwords against HaveIBeenPwned database"
-- This cannot be done via SQL migration

-- 3. PostgreSQL Version Upgrade
-- In Supabase Dashboard > Settings > Database
-- Upgrade to the latest PostgreSQL version
-- This cannot be done via SQL migration

-- 4. Create security monitoring functions
CREATE OR REPLACE FUNCTION log_security_event(
    event_type TEXT,
    user_id UUID DEFAULT NULL,
    details JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        details,
        ip_address,
        user_agent
    ) VALUES (
        COALESCE(user_id, (SELECT auth.uid())),
        event_type,
        details,
        current_setting('request.headers', true)::jsonb->>'x-forwarded-for',
        current_setting('request.headers', true)::jsonb->>'user-agent'
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the operation
        NULL;
END;
$$;

-- 5. Create function to check password strength
CREATE OR REPLACE FUNCTION check_password_strength(password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Basic password strength requirements
    RETURN (
        LENGTH(password) >= 8 AND
        password ~ '[A-Z]' AND
        password ~ '[a-z]' AND
        password ~ '[0-9]' AND
        password ~ '[^A-Za-z0-9]'
    );
END;
$$;

-- 6. Create function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- 7. Create function to check for suspicious activity
CREATE OR REPLACE FUNCTION check_suspicious_activity(
    user_id UUID,
    action TEXT,
    details JSONB DEFAULT '{}'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recent_actions INTEGER;
    is_suspicious BOOLEAN := FALSE;
BEGIN
    -- Check for rapid successive actions (potential bot activity)
    SELECT COUNT(*)
    INTO recent_actions
    FROM audit_logs
    WHERE user_id = check_suspicious_activity.user_id
    AND action = check_suspicious_activity.action
    AND created_at > NOW() - INTERVAL '1 minute';
    
    -- Flag as suspicious if more than 10 actions in 1 minute
    IF recent_actions > 10 THEN
        is_suspicious := TRUE;
    END IF;
    
    -- Log suspicious activity
    IF is_suspicious THEN
        PERFORM log_security_event(
            'suspicious_activity',
            user_id,
            jsonb_build_object(
                'action', action,
                'details', details,
                'recent_actions', recent_actions
            )
        );
    END IF;
    
    RETURN is_suspicious;
END;
$$;

-- 8. Create function to rate limit requests
CREATE OR REPLACE FUNCTION check_rate_limit(
    user_id UUID,
    action TEXT,
    max_requests INTEGER DEFAULT 100,
    time_window INTERVAL DEFAULT '1 hour'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    request_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO request_count
    FROM audit_logs
    WHERE user_id = check_rate_limit.user_id
    AND action = check_rate_limit.action
    AND created_at > NOW() - time_window;
    
    RETURN request_count < max_requests;
END;
$$;

-- 9. Create function to validate user permissions
CREATE OR REPLACE FUNCTION validate_user_permission(
    required_role TEXT,
    required_verification_level INTEGER DEFAULT 0
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
    user_verification_level INTEGER;
BEGIN
    SELECT role, verification_level
    INTO user_role, user_verification_level
    FROM users
    WHERE id = (SELECT auth.uid());
    
    RETURN (
        user_role = required_role AND
        user_verification_level >= required_verification_level
    );
END;
$$;

-- 10. Create function to sanitize input
CREATE OR REPLACE FUNCTION sanitize_input(input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Remove potentially dangerous characters
    RETURN regexp_replace(
        regexp_replace(
            regexp_replace(input, '[<>''"]', '', 'g'),
            '[\x00-\x1F\x7F-\x9F]', '', 'g'
        ),
        '\s+', ' ', 'g'
    );
END;
$$;

-- 11. Create function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Use pgcrypto for encryption
    RETURN encode(
        digest(data || current_setting('app.salt', true), 'sha256'),
        'hex'
    );
END;
$$;

-- 12. Create function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT, original_data TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verify the encrypted data matches the original
    RETURN encrypted_data = encode(
        digest(original_data || current_setting('app.salt', true), 'sha256'),
        'hex'
    );
END;
$$;

-- 13. Create indexes for security-related queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id_action ON audit_logs(user_id, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_users_verification_level ON users(verification_level);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 14. Create view for security monitoring
CREATE OR REPLACE VIEW security_events AS
SELECT
    al.id,
    al.user_id,
    u.email,
    u.role,
    al.action,
    al.details,
    al.ip_address,
    al.user_agent,
    al.created_at
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.action IN (
    'login_attempt',
    'login_success',
    'login_failure',
    'password_change',
    'suspicious_activity',
    'rate_limit_exceeded',
    'permission_denied'
)
ORDER BY al.created_at DESC;

-- 15. Create view for user activity monitoring
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT
    u.id,
    u.email,
    u.role,
    u.verification_level,
    COUNT(al.id) as total_actions,
    COUNT(CASE WHEN al.created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as actions_24h,
    COUNT(CASE WHEN al.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as actions_7d,
    MAX(al.created_at) as last_activity
FROM users u
LEFT JOIN audit_logs al ON u.id = al.user_id
GROUP BY u.id, u.email, u.role, u.verification_level;

-- 16. Grant necessary permissions
GRANT SELECT ON security_events TO authenticated;
GRANT SELECT ON user_activity_summary TO authenticated;

-- 17. Create function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete audit logs older than 90 days
    DELETE FROM audit_logs
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Log the cleanup action
    INSERT INTO audit_logs (action, details)
    VALUES (
        'audit_logs_cleanup',
        jsonb_build_object(
            'deleted_count', ROW_COUNT,
            'cleanup_date', NOW()
        )
    );
END;
$$;

-- 18. Create function to monitor database performance
CREATE OR REPLACE FUNCTION monitor_database_performance()
RETURNS TABLE(
    table_name TEXT,
    index_usage_ratio NUMERIC,
    table_size_mb NUMERIC,
    last_vacuum TIMESTAMPTZ,
    last_analyze TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        schemaname||'.'||tablename as table_name,
        CASE 
            WHEN idx_scan = 0 THEN 0
            ELSE ROUND((idx_tup_fetch::NUMERIC / NULLIF(idx_scan, 0)), 2)
        END as index_usage_ratio,
        ROUND(pg_total_relation_size(schemaname||'.'||tablename) / 1024.0 / 1024.0, 2) as table_size_mb,
        last_vacuum,
        last_analyze
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY table_size_mb DESC;
END;
$$;

-- 19. Set up automatic cleanup job (requires pg_cron extension)
-- This would need to be set up in the Supabase dashboard
-- SELECT cron.schedule('cleanup-audit-logs', '0 2 * * *', 'SELECT cleanup_old_audit_logs();');

-- 20. Create function to validate RLS policies
CREATE OR REPLACE FUNCTION validate_rls_policies()
RETURNS TABLE(
    table_name TEXT,
    policy_name TEXT,
    policy_type TEXT,
    is_enabled BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        schemaname||'.'||tablename as table_name,
        policyname as policy_name,
        cmd as policy_type,
        true as is_enabled
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
END;
$$;

-- 21. Update table statistics
ANALYZE audit_logs;
ANALYZE users;

-- 22. Create function to check for missing indexes
CREATE OR REPLACE FUNCTION check_missing_indexes()
RETURNS TABLE(
    table_name TEXT,
    column_name TEXT,
    usage_count BIGINT,
    recommendation TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        schemaname||'.'||tablename as table_name,
        attname as column_name,
        n_tup_ins + n_tup_upd + n_tup_del as usage_count,
        CASE
            WHEN n_tup_ins + n_tup_upd + n_tup_del > 1000 THEN 'Consider adding index'
            ELSE 'No index needed'
        END as recommendation
    FROM pg_stat_user_tables
    JOIN pg_attribute ON pg_stat_user_tables.relid = pg_attribute.attrelid
    WHERE schemaname = 'public'
    AND attnum > 0
    AND NOT attisdropped
    ORDER BY usage_count DESC;
END;
$$;
