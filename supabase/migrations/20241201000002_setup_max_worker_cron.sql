-- Set up cron job for max_worker Edge Function
-- This will trigger the max-worker function every minute

-- Create the cron job (this requires pg_cron extension)
-- Note: pg_cron extension needs to be enabled in Supabase dashboard
CREATE OR REPLACE FUNCTION setup_max_worker_cron()
RETURNS void AS $$
BEGIN
    -- Check if pg_cron extension is available
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Schedule max_worker to run every minute
        PERFORM cron.schedule(
            'max-worker',
            '* * * * *', -- Every minute
            'SELECT net.http_post(
                url:=''https://your-project.supabase.co/functions/v1/max-worker'',
                headers:=''{"Content-Type": "application/json", "Authorization": "Bearer your-service-role-key"}''::jsonb,
                body:=''{"trigger": "cron"}''::jsonb
            );'
        );
        
        RAISE NOTICE 'Max worker cron job scheduled successfully';
    ELSE
        RAISE NOTICE 'pg_cron extension not available. Please enable it in Supabase dashboard.';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Alternative: Create a simpler cron setup using Supabase Edge Functions
-- This creates a function that can be called by external cron services
CREATE OR REPLACE FUNCTION trigger_max_worker()
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    -- Call the max-worker Edge Function
    SELECT net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/max-worker',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.supabase_service_key')
        ),
        body := jsonb_build_object('trigger', 'cron')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for monitoring max worker performance
CREATE OR REPLACE VIEW internal_max.worker_performance AS
SELECT 
    DATE_TRUNC('hour', occurred_at) as hour,
    COUNT(*) as events_processed,
    COUNT(CASE WHEN status = 'processed' THEN 1 END) as events_successful,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as events_pending,
    AVG(EXTRACT(EPOCH FROM (processed_at - occurred_at))) as avg_processing_time_seconds
FROM internal_max.event_bus
WHERE occurred_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', occurred_at)
ORDER BY hour DESC;

-- Create a function to get current max worker status
CREATE OR REPLACE FUNCTION internal_max.get_worker_status()
RETURNS jsonb AS $$
DECLARE
    status jsonb;
BEGIN
    SELECT jsonb_build_object(
        'pending_events', (SELECT COUNT(*) FROM internal_max.event_bus WHERE status = 'pending'),
        'processed_last_hour', (SELECT COUNT(*) FROM internal_max.event_bus WHERE status = 'processed' AND processed_at >= NOW() - INTERVAL '1 hour'),
        'open_findings', (SELECT COUNT(*) FROM internal_max.findings WHERE status = 'open'),
        'critical_findings', (SELECT COUNT(*) FROM internal_max.findings WHERE severity = 'critical' AND status = 'open'),
        'open_tasks', (SELECT COUNT(*) FROM internal_max.tasks WHERE status = 'open'),
        'last_processed_event', (SELECT MAX(processed_at) FROM internal_max.event_bus WHERE status = 'processed'),
        'worker_health', CASE 
            WHEN (SELECT COUNT(*) FROM internal_max.event_bus WHERE status = 'pending' AND occurred_at < NOW() - INTERVAL '10 minutes') > 0 
            THEN 'degraded'
            ELSE 'healthy'
        END
    ) INTO status;
    
    RETURN status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions for the status function
GRANT EXECUTE ON FUNCTION internal_max.get_worker_status() TO authenticated;

-- Create indexes for better performance on event processing
CREATE INDEX IF NOT EXISTS idx_event_bus_processing ON internal_max.event_bus(status, occurred_at) 
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_findings_severity_status ON internal_max.findings(severity, status, created_at);

CREATE INDEX IF NOT EXISTS idx_tasks_status_created ON internal_max.tasks(status, created_at);

-- Create a function to clean up old processed events (run daily)
CREATE OR REPLACE FUNCTION internal_max.cleanup_old_events()
RETURNS void AS $$
BEGIN
    -- Delete processed events older than 30 days
    DELETE FROM internal_max.event_bus 
    WHERE status = 'processed' 
    AND processed_at < NOW() - INTERVAL '30 days';
    
    -- Delete resolved findings older than 90 days
    DELETE FROM internal_max.findings 
    WHERE status = 'resolved' 
    AND resolved_at < NOW() - INTERVAL '90 days';
    
    -- Delete completed tasks older than 90 days
    DELETE FROM internal_max.tasks 
    WHERE status = 'done' 
    AND completed_at < NOW() - INTERVAL '90 days';
    
    RAISE NOTICE 'Cleaned up old max worker data';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup function to run daily (if pg_cron is available)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        PERFORM cron.schedule(
            'max-cleanup',
            '0 2 * * *', -- Daily at 2 AM
            'SELECT internal_max.cleanup_old_events();'
        );
        RAISE NOTICE 'Max cleanup cron job scheduled';
    END IF;
END $$;
