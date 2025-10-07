-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create security alerts table
CREATE TABLE IF NOT EXISTS security_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    source TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);

CREATE INDEX IF NOT EXISTS idx_security_alerts_timestamp ON security_alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved ON security_alerts(resolved);

CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at ON rate_limits(updated_at);

-- Create RLS policies
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Security events policies
CREATE POLICY "Users can view their own security events" ON security_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all security events" ON security_events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin users can view all security events" ON security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Security alerts policies
CREATE POLICY "Admin users can manage security alerts" ON security_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Service role can manage all security alerts" ON security_alerts
    FOR ALL USING (auth.role() = 'service_role');

-- Rate limits policies
CREATE POLICY "Service role can manage rate limits" ON rate_limits
    FOR ALL USING (auth.role() = 'service_role');

-- Create functions for cleanup
CREATE OR REPLACE FUNCTION cleanup_old_security_events()
RETURNS void AS $$
BEGIN
    -- Delete security events older than 90 days
    DELETE FROM security_events 
    WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Delete resolved security alerts older than 30 days
    DELETE FROM security_alerts 
    WHERE resolved = TRUE 
    AND resolved_at < NOW() - INTERVAL '30 days';
    
    -- Delete rate limit entries older than 24 hours
    DELETE FROM rate_limits 
    WHERE updated_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Create a function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type TEXT,
    p_severity TEXT,
    p_ip_address TEXT,
    p_user_agent TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO security_events (
        event_type,
        severity,
        ip_address,
        user_agent,
        user_id,
        details
    ) VALUES (
        p_event_type,
        p_severity,
        p_ip_address,
        p_user_agent,
        p_user_id,
        p_details
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to create security alerts
CREATE OR REPLACE FUNCTION create_security_alert(
    p_type TEXT,
    p_severity TEXT,
    p_title TEXT,
    p_description TEXT,
    p_source TEXT DEFAULT 'system',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    alert_id UUID;
BEGIN
    INSERT INTO security_alerts (
        type,
        severity,
        title,
        description,
        source,
        metadata
    ) VALUES (
        p_type,
        p_severity,
        p_title,
        p_description,
        p_source,
        p_metadata
    ) RETURNING id INTO alert_id;
    
    RETURN alert_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get security stats
CREATE OR REPLACE FUNCTION get_security_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_alerts', (SELECT COUNT(*) FROM security_alerts),
        'resolved_alerts', (SELECT COUNT(*) FROM security_alerts WHERE resolved = TRUE),
        'unresolved_alerts', (SELECT COUNT(*) FROM security_alerts WHERE resolved = FALSE),
        'critical_alerts', (SELECT COUNT(*) FROM security_alerts WHERE severity = 'critical' AND resolved = FALSE),
        'high_alerts', (SELECT COUNT(*) FROM security_alerts WHERE severity = 'high' AND resolved = FALSE),
        'medium_alerts', (SELECT COUNT(*) FROM security_alerts WHERE severity = 'medium' AND resolved = FALSE),
        'low_alerts', (SELECT COUNT(*) FROM security_alerts WHERE severity = 'low' AND resolved = FALSE),
        'events_last_24h', (SELECT COUNT(*) FROM security_events WHERE timestamp > NOW() - INTERVAL '24 hours'),
        'events_last_7d', (SELECT COUNT(*) FROM security_events WHERE timestamp > NOW() - INTERVAL '7 days'),
        'events_last_30d', (SELECT COUNT(*) FROM security_events WHERE timestamp > NOW() - INTERVAL '30 days')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON security_events TO anon, authenticated;
GRANT SELECT ON security_alerts TO anon, authenticated;
GRANT EXECUTE ON FUNCTION log_security_event TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_security_alert TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_security_stats TO anon, authenticated;

-- Create a scheduled job to clean up old data (this would need to be set up in Supabase dashboard)
-- SELECT cron.schedule('cleanup-security-data', '0 2 * * *', 'SELECT cleanup_old_security_events();');

-- Insert some initial data for testing
INSERT INTO security_alerts (type, severity, title, description, source, metadata) VALUES
('system_startup', 'low', 'Security System Initialized', 'StratusConnect security system has been successfully initialized', 'system', '{"version": "1.0.0", "features": ["rate_limiting", "input_validation", "malicious_code_scanning", "bot_detection"]}'),
('configuration', 'low', 'Security Headers Configured', 'Content Security Policy and security headers have been configured', 'system', '{"csp_enabled": true, "security_headers": ["X-Content-Type-Options", "X-XSS-Protection", "X-Frame-Options"]}');

COMMENT ON TABLE security_events IS 'Logs all security-related events and threats';
COMMENT ON TABLE security_alerts IS 'Security alerts that require attention or action';
COMMENT ON TABLE rate_limits IS 'Rate limiting data for preventing abuse';
