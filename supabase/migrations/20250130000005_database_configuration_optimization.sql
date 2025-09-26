-- Database Configuration Optimization Migration
-- Optimizes database settings for better performance

-- 1. OPTIMIZE TABLE SETTINGS
-- Set optimal autovacuum and analyze settings

ALTER TABLE public.job_posts SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 50,
    autovacuum_analyze_threshold = 50
);

ALTER TABLE public.job_applications SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 50,
    autovacuum_analyze_threshold = 50
);

ALTER TABLE public.forum_posts SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 50,
    autovacuum_analyze_threshold = 50
);

ALTER TABLE public.contracts SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 50,
    autovacuum_analyze_threshold = 50
);

ALTER TABLE public.receipts SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05,
    autovacuum_vacuum_threshold = 50,
    autovacuum_analyze_threshold = 50
);

-- 2. CREATE CONNECTION POOLING OPTIMIZATION
-- Set optimal connection settings

ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- 3. CREATE QUERY OPTIMIZATION SETTINGS
-- Optimize query planning and execution

ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';

-- 4. CREATE MONITORING FUNCTIONS
-- Functions to monitor database performance

CREATE OR REPLACE FUNCTION public.get_table_stats()
RETURNS TABLE(
    table_name text,
    row_count bigint,
    table_size text,
    index_size text,
    total_size text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::text,
        t.n_tup_ins - t.n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(c.oid)) as table_size,
        pg_size_pretty(pg_indexes_size(c.oid)) as index_size,
        pg_size_pretty(pg_total_relation_size(c.oid)) as total_size
    FROM pg_stat_user_tables t
    JOIN pg_class c ON c.relname = t.table_name
    WHERE t.schemaname = 'public'
    ORDER BY pg_total_relation_size(c.oid) DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_slow_queries()
RETURNS TABLE(
    query text,
    calls bigint,
    total_time double precision,
    mean_time double precision,
    rows bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.query::text,
        q.calls,
        q.total_time,
        q.mean_time,
        q.rows
    FROM pg_stat_statements q
    WHERE q.mean_time > 1000  -- Queries taking more than 1 second on average
    ORDER BY q.mean_time DESC
    LIMIT 20;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_index_usage()
RETURNS TABLE(
    table_name text,
    index_name text,
    idx_scan bigint,
    idx_tup_read bigint,
    idx_tup_fetch bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::text,
        i.index_name::text,
        i.idx_scan,
        i.idx_tup_read,
        i.idx_tup_fetch
    FROM pg_stat_user_tables t
    JOIN pg_stat_user_indexes i ON i.relid = t.relid
    WHERE t.schemaname = 'public'
    ORDER BY i.idx_scan DESC;
END;
$$;

-- 5. CREATE CLEANUP FUNCTIONS
-- Functions to clean up old data and optimize storage

CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Clean up old job posts
    DELETE FROM public.job_posts
    WHERE created_at < NOW() - INTERVAL '1 year'
    AND status = 'closed';
    
    -- Clean up old forum posts (keep pinned posts)
    DELETE FROM public.forum_posts
    WHERE created_at < NOW() - INTERVAL '2 years'
    AND is_pinned = false;
    
    -- Clean up old audit logs
    DELETE FROM public.security_audit_log
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Clean up old notifications
    DELETE FROM public.notifications
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND is_read = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.optimize_tables()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Analyze all tables
    ANALYZE public.job_posts;
    ANALYZE public.job_applications;
    ANALYZE public.forum_posts;
    ANALYZE public.saved_crews;
    ANALYZE public.contracts;
    ANALYZE public.receipts;
    ANALYZE public.document_storage;
    ANALYZE public.profiles;
    ANALYZE public.companies;
    ANALYZE public.requests;
    ANALYZE public.quotes;
    ANALYZE public.bookings;
    
    -- Refresh materialized views
    PERFORM public.refresh_job_board_stats();
    PERFORM public.refresh_user_permissions();
END;
$$;

-- 6. CREATE SCHEDULED JOBS (if pg_cron is available)
-- These would be set up in the Supabase dashboard

-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT public.cleanup_old_data();');
-- SELECT cron.schedule('optimize-tables', '0 3 * * 0', 'SELECT public.optimize_tables();');

-- 7. CREATE PERFORMANCE MONITORING VIEWS
CREATE OR REPLACE VIEW public.performance_dashboard AS
SELECT 
    'Database Size' as metric,
    pg_size_pretty(pg_database_size(current_database())) as value
UNION ALL
SELECT 
    'Active Connections',
    current_setting('max_connections')::text
UNION ALL
SELECT 
    'Shared Buffers',
    current_setting('shared_buffers')
UNION ALL
SELECT 
    'Work Memory',
    current_setting('work_mem')
UNION ALL
SELECT 
    'Maintenance Work Memory',
    current_setting('maintenance_work_mem');

CREATE OR REPLACE VIEW public.table_performance AS
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- 8. GRANT PERMISSIONS
GRANT SELECT ON public.performance_dashboard TO authenticated;
GRANT SELECT ON public.table_performance TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_table_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_slow_queries() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_index_usage() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_data() TO authenticated;
GRANT EXECUTE ON FUNCTION public.optimize_tables() TO authenticated;

-- 9. CREATE ALERT FUNCTIONS
-- Functions to alert on performance issues

CREATE OR REPLACE FUNCTION public.check_performance_alerts()
RETURNS TABLE(
    alert_type text,
    message text,
    severity text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    db_size bigint;
    slow_queries_count integer;
    unused_indexes_count integer;
BEGIN
    -- Check database size
    SELECT pg_database_size(current_database()) INTO db_size;
    IF db_size > 1000000000 THEN  -- 1GB
        RETURN QUERY SELECT 'database_size'::text, 'Database size is large: ' || pg_size_pretty(db_size), 'warning'::text;
    END IF;
    
    -- Check for slow queries
    SELECT COUNT(*) INTO slow_queries_count
    FROM pg_stat_statements
    WHERE mean_time > 5000;  -- 5 seconds
    
    IF slow_queries_count > 0 THEN
        RETURN QUERY SELECT 'slow_queries'::text, 'Found ' || slow_queries_count || ' slow queries', 'error'::text;
    END IF;
    
    -- Check for unused indexes
    SELECT COUNT(*) INTO unused_indexes_count
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0;
    
    IF unused_indexes_count > 10 THEN
        RETURN QUERY SELECT 'unused_indexes'::text, 'Found ' || unused_indexes_count || ' unused indexes', 'info'::text;
    END IF;
    
    RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_performance_alerts() TO authenticated;

-- 10. FINAL OPTIMIZATION
-- Run initial optimization
SELECT public.optimize_tables();
