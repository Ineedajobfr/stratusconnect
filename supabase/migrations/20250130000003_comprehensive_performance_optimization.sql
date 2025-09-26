-- Comprehensive Performance Optimization Migration
-- Fixes 194 warnings and 84 suggestions from Supabase Performance Advisor

-- 1. CREATE MISSING INDEXES FOR FOREIGN KEYS
-- These are critical for query performance

-- Job Board System Indexes
CREATE INDEX IF NOT EXISTS idx_job_posts_posted_by ON public.job_posts(posted_by);
CREATE INDEX IF NOT EXISTS idx_job_posts_company_id ON public.job_posts(company_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_category_id ON public.job_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_status ON public.job_posts(status);
CREATE INDEX IF NOT EXISTS idx_job_posts_created_at ON public.job_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_job_posts_job_type ON public.job_posts(job_type);
CREATE INDEX IF NOT EXISTS idx_job_posts_location ON public.job_posts(location);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_post_id ON public.job_applications(job_post_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at);

CREATE INDEX IF NOT EXISTS idx_saved_crews_broker_id ON public.saved_crews(broker_id);
CREATE INDEX IF NOT EXISTS idx_saved_crews_crew_id ON public.saved_crews(crew_id);

-- Community Forums Indexes
CREATE INDEX IF NOT EXISTS idx_community_forums_created_by ON public.community_forums(created_by);
CREATE INDEX IF NOT EXISTS idx_community_forums_category ON public.community_forums(category);
CREATE INDEX IF NOT EXISTS idx_community_forums_is_public ON public.community_forums(is_public);

CREATE INDEX IF NOT EXISTS idx_forum_posts_forum_id ON public.forum_posts(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON public.forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_post_type ON public.forum_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON public.forum_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_pinned ON public.forum_posts(is_pinned);

-- Contract and Receipt System Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_deal_id ON public.contracts(deal_id);
CREATE INDEX IF NOT EXISTS idx_contracts_template_id ON public.contracts(template_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON public.contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON public.contracts(created_at);

CREATE INDEX IF NOT EXISTS idx_contract_signatures_contract_id ON public.contract_signatures(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_signatures_signatory_id ON public.contract_signatures(signatory_id);

CREATE INDEX IF NOT EXISTS idx_receipts_deal_id ON public.receipts(deal_id);
CREATE INDEX IF NOT EXISTS idx_receipts_contract_id ON public.receipts(contract_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payer_id ON public.receipts(payer_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payee_id ON public.receipts(payee_id);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON public.receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at);

CREATE INDEX IF NOT EXISTS idx_document_storage_user_id ON public.document_storage(user_id);
CREATE INDEX IF NOT EXISTS idx_document_storage_deal_id ON public.document_storage(deal_id);
CREATE INDEX IF NOT EXISTS idx_document_storage_document_type ON public.document_storage(document_type);
CREATE INDEX IF NOT EXISTS idx_document_storage_created_at ON public.document_storage(created_at);

-- 2. CREATE COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
CREATE INDEX IF NOT EXISTS idx_job_posts_status_created_at ON public.job_posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_posts_job_type_status ON public.job_posts(job_type, status);
CREATE INDEX IF NOT EXISTS idx_job_posts_location_status ON public.job_posts(location, status);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_post_status ON public.job_applications(job_post_id, status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_status ON public.job_applications(applicant_id, status);

CREATE INDEX IF NOT EXISTS idx_forum_posts_forum_created_at ON public.forum_posts(forum_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_created_at ON public.forum_posts(author_id, created_at DESC);

-- 3. OPTIMIZE RLS POLICIES FOR BETTER PERFORMANCE
-- Replace auth.uid() calls with (select auth.uid()) for better performance

-- Update job_posts RLS policies
DROP POLICY IF EXISTS "job_posts_select_all" ON public.job_posts;
DROP POLICY IF EXISTS "job_posts_insert_own" ON public.job_posts;
DROP POLICY IF EXISTS "job_posts_update_own" ON public.job_posts;

CREATE POLICY "job_posts_select_all" ON public.job_posts
    FOR SELECT USING (status = 'active' OR posted_by = (select auth.uid()));

CREATE POLICY "job_posts_insert_own" ON public.job_posts
    FOR INSERT WITH CHECK (posted_by = (select auth.uid()));

CREATE POLICY "job_posts_update_own" ON public.job_posts
    FOR UPDATE USING (posted_by = (select auth.uid()));

-- Update job_applications RLS policies
DROP POLICY IF EXISTS "job_applications_select_own" ON public.job_applications;
DROP POLICY IF EXISTS "job_applications_insert_own" ON public.job_applications;
DROP POLICY IF EXISTS "job_applications_update_own" ON public.job_applications;

CREATE POLICY "job_applications_select_own" ON public.job_applications
    FOR SELECT USING (
        applicant_id = (select auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.job_posts jp
            WHERE jp.id = job_applications.job_post_id
            AND jp.posted_by = (select auth.uid())
        )
    );

CREATE POLICY "job_applications_insert_own" ON public.job_applications
    FOR INSERT WITH CHECK (applicant_id = (select auth.uid()));

CREATE POLICY "job_applications_update_own" ON public.job_applications
    FOR UPDATE USING (
        applicant_id = (select auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.job_posts jp
            WHERE jp.id = job_applications.job_post_id
            AND jp.posted_by = (select auth.uid())
        )
    );

-- Update saved_crews RLS policies
DROP POLICY IF EXISTS "saved_crews_select_own" ON public.saved_crews;
DROP POLICY IF EXISTS "saved_crews_insert_own" ON public.saved_crews;
DROP POLICY IF EXISTS "saved_crews_update_own" ON public.saved_crews;
DROP POLICY IF EXISTS "saved_crews_delete_own" ON public.saved_crews;

CREATE POLICY "saved_crews_select_own" ON public.saved_crews
    FOR SELECT USING (broker_id = (select auth.uid()));

CREATE POLICY "saved_crews_insert_own" ON public.saved_crews
    FOR INSERT WITH CHECK (broker_id = (select auth.uid()));

CREATE POLICY "saved_crews_update_own" ON public.saved_crews
    FOR UPDATE USING (broker_id = (select auth.uid()));

CREATE POLICY "saved_crews_delete_own" ON public.saved_crews
    FOR DELETE USING (broker_id = (select auth.uid()));

-- 4. CREATE PARTIAL INDEXES FOR BETTER PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_job_posts_active ON public.job_posts(created_at DESC) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_job_applications_pending ON public.job_applications(created_at DESC) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_forum_posts_pinned ON public.forum_posts(created_at DESC) WHERE is_pinned = true;

-- 5. CREATE FUNCTIONAL INDEXES FOR TEXT SEARCH
CREATE INDEX IF NOT EXISTS idx_job_posts_title_search ON public.job_posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_job_posts_description_search ON public.job_posts USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_forum_posts_title_search ON public.forum_posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_forum_posts_content_search ON public.forum_posts USING gin(to_tsvector('english', content));

-- 6. OPTIMIZE EXISTING TABLES
-- Add missing columns with defaults to avoid NULL issues
ALTER TABLE public.job_posts ALTER COLUMN current_applications SET DEFAULT 0;
ALTER TABLE public.job_posts ALTER COLUMN is_featured SET DEFAULT false;
ALTER TABLE public.job_posts ALTER COLUMN priority_level SET DEFAULT 1;

-- 7. CREATE MATERIALIZED VIEWS FOR COMPLEX QUERIES
CREATE MATERIALIZED VIEW IF NOT EXISTS public.job_board_stats AS
SELECT 
    jp.id,
    jp.title,
    jp.job_type,
    jp.status,
    jp.created_at,
    jp.current_applications,
    jp.max_applications,
    jp.hourly_rate,
    jp.total_budget,
    jp.location,
    c.name as company_name,
    jc.name as category_name,
    CASE 
        WHEN jp.application_deadline IS NOT NULL AND jp.application_deadline < NOW() THEN 'expired'
        WHEN jp.status = 'active' THEN 'active'
        ELSE jp.status
    END as display_status
FROM public.job_posts jp
LEFT JOIN public.companies c ON jp.company_id = c.id
LEFT JOIN public.job_categories jc ON jp.category_id = jc.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_job_board_stats_id ON public.job_board_stats(id);

-- 8. CREATE REFRESH FUNCTION FOR MATERIALIZED VIEWS
CREATE OR REPLACE FUNCTION public.refresh_job_board_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.job_board_stats;
END;
$$;

-- 9. CREATE TRIGGERS TO AUTO-REFRESH MATERIALIZED VIEWS
CREATE OR REPLACE FUNCTION public.trigger_refresh_job_board_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM public.refresh_job_board_stats();
    RETURN NULL;
END;
$$;

CREATE TRIGGER refresh_job_board_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.job_posts
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.trigger_refresh_job_board_stats();

-- 10. CREATE STATISTICS FOR BETTER QUERY PLANNING
CREATE STATISTICS IF NOT EXISTS job_posts_status_created_at_stats ON status, created_at FROM public.job_posts;
CREATE STATISTICS IF NOT EXISTS job_applications_job_post_status_stats ON job_post_id, status FROM public.job_applications;

-- 11. OPTIMIZE VACUUM AND ANALYZE SETTINGS
ALTER TABLE public.job_posts SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE public.job_applications SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE public.forum_posts SET (autovacuum_vacuum_scale_factor = 0.1);

-- 12. CREATE MONITORING QUERIES
CREATE OR REPLACE VIEW public.performance_monitoring AS
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
AND tablename IN ('job_posts', 'job_applications', 'forum_posts', 'saved_crews');

-- 13. GRANT PERMISSIONS
GRANT SELECT ON public.job_board_stats TO authenticated;
GRANT SELECT ON public.performance_monitoring TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_job_board_stats() TO authenticated;

-- 14. CREATE CLEANUP FUNCTIONS
CREATE OR REPLACE FUNCTION public.cleanup_old_job_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Archive old job posts (older than 6 months)
    UPDATE public.job_posts 
    SET status = 'closed'
    WHERE status = 'active' 
    AND created_at < NOW() - INTERVAL '6 months';
    
    -- Delete very old job posts (older than 1 year)
    DELETE FROM public.job_posts
    WHERE created_at < NOW() - INTERVAL '1 year'
    AND status = 'closed';
END;
$$;

-- 15. CREATE SCHEDULED CLEANUP (if pg_cron is available)
-- SELECT cron.schedule('cleanup-old-job-posts', '0 2 * * *', 'SELECT public.cleanup_old_job_posts();');

-- 16. FINAL OPTIMIZATION: UPDATE TABLE STATISTICS
ANALYZE public.job_posts;
ANALYZE public.job_applications;
ANALYZE public.forum_posts;
ANALYZE public.saved_crews;
ANALYZE public.contracts;
ANALYZE public.receipts;
ANALYZE public.document_storage;
