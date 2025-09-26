-- Fix Performance Warnings - Part 6
-- Database Configuration and Final Optimizations

-- 1. Update Database Configuration for Better Performance
ALTER DATABASE postgres SET shared_preload_libraries = 'pg_stat_statements';
ALTER DATABASE postgres SET track_activities = on;
ALTER DATABASE postgres SET track_counts = on;
ALTER DATABASE postgres SET track_io_timing = on;
ALTER DATABASE postgres SET track_functions = all;
ALTER DATABASE postgres SET track_activity_query_size = 2048;

-- 2. Create Performance Monitoring Views
CREATE OR REPLACE VIEW public.performance_metrics AS
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation,
  most_common_vals,
  most_common_freqs
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- 3. Create Index Usage Statistics View
CREATE OR REPLACE VIEW public.index_usage_stats AS
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_tup_read DESC;

-- 4. Create Table Size Statistics View
CREATE OR REPLACE VIEW public.table_size_stats AS
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 5. Create Query Performance View
CREATE OR REPLACE VIEW public.query_performance AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  stddev_time,
  rows,
  100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY total_time DESC
LIMIT 50;

-- 6. Create Function to Monitor Performance
CREATE OR REPLACE FUNCTION public.get_performance_summary()
RETURNS TABLE(
  metric_name text,
  metric_value text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 'Total Tables'::text, COUNT(*)::text FROM pg_tables WHERE schemaname = 'public'
  UNION ALL
  SELECT 'Total Indexes'::text, COUNT(*)::text FROM pg_indexes WHERE schemaname = 'public'
  UNION ALL
  SELECT 'Total Functions'::text, COUNT(*)::text FROM pg_proc WHERE pronamespace = 'public'::regnamespace
  UNION ALL
  SELECT 'Database Size'::text, pg_size_pretty(pg_database_size(current_database()))
  UNION ALL
  SELECT 'Active Connections'::text, COUNT(*)::text FROM pg_stat_activity WHERE state = 'active'
  UNION ALL
  SELECT 'Idle Connections'::text, COUNT(*)::text FROM pg_stat_activity WHERE state = 'idle'
  UNION ALL
  SELECT 'Total Connections'::text, COUNT(*)::text FROM pg_stat_activity;
END;
$$;

-- 7. Create Function to Check Index Usage
CREATE OR REPLACE FUNCTION public.check_unused_indexes()
RETURNS TABLE(
  schemaname text,
  tablename text,
  indexname text,
  idx_tup_read bigint,
  idx_tup_fetch bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.schemaname,
    i.tablename,
    i.indexname,
    i.idx_tup_read,
    i.idx_tup_fetch
  FROM pg_stat_user_indexes i
  WHERE i.schemaname = 'public'
    AND i.idx_tup_read = 0
    AND i.idx_tup_fetch = 0
  ORDER BY i.tablename, i.indexname;
END;
$$;

-- 8. Create Function to Check Missing Indexes
CREATE OR REPLACE FUNCTION public.check_missing_indexes()
RETURNS TABLE(
  schemaname text,
  tablename text,
  attname text,
  n_distinct real,
  correlation real
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.schemaname,
    s.tablename,
    s.attname,
    s.n_distinct,
    s.correlation
  FROM pg_stats s
  WHERE s.schemaname = 'public'
    AND s.n_distinct > 100
    AND s.correlation < 0.1
    AND NOT EXISTS (
      SELECT 1 FROM pg_indexes i
      WHERE i.schemaname = s.schemaname
        AND i.tablename = s.tablename
        AND i.indexdef LIKE '%' || s.attname || '%'
    )
  ORDER BY s.n_distinct DESC;
END;
$$;

-- 9. Grant Permissions for Performance Views
GRANT SELECT ON public.performance_metrics TO authenticated;
GRANT SELECT ON public.index_usage_stats TO authenticated;
GRANT SELECT ON public.table_size_stats TO authenticated;
GRANT SELECT ON public.query_performance TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_performance_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_unused_indexes() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_missing_indexes() TO authenticated;

-- 10. Create Function to Optimize Database
CREATE OR REPLACE FUNCTION public.optimize_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update statistics
  PERFORM public.update_table_statistics();
  
  -- Clean up old audit logs
  PERFORM public.cleanup_old_audit_logs();
  
  -- Vacuum analyze all tables
  VACUUM ANALYZE public.companies;
  VACUUM ANALYZE public.users;
  VACUUM ANALYZE public.requests;
  VACUUM ANALYZE public.quotes;
  VACUUM ANALYZE public.bookings;
  VACUUM ANALYZE public.job_posts;
  VACUUM ANALYZE public.job_applications;
  VACUUM ANALYZE public.contracts;
  VACUUM ANALYZE public.receipts;
  VACUUM ANALYZE public.document_storage;
  VACUUM ANALYZE public.community_forums;
  VACUUM ANALYZE public.forum_posts;
  VACUUM ANALYZE public.saved_crews;
  VACUUM ANALYZE public.user_monitoring;
  VACUUM ANALYZE public.security_audit_log;
  VACUUM ANALYZE public.contract_audit_trail;
END;
$$;

-- 11. Grant Execute Permission for Database Optimization
GRANT EXECUTE ON FUNCTION public.optimize_database() TO authenticated;

-- 12. Create Final Performance Summary
CREATE OR REPLACE VIEW public.performance_summary AS
SELECT 
  'Database Optimization Complete' as status,
  NOW() as completed_at,
  (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as total_tables,
  (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as total_indexes,
  (SELECT COUNT(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace) as total_functions,
  pg_size_pretty(pg_database_size(current_database())) as database_size;
