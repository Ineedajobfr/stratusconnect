-- Consolidate Multiple Permissive RLS Policies
-- Remove duplicate and overlapping policies to improve performance

-- Drop all existing policies that have multiple permissive policies
-- and recreate them as single, consolidated policies

-- Aircraft table - consolidate multiple SELECT policies
DROP POLICY IF EXISTS "Authenticated users can view aircraft for marketplace" ON public.aircraft;
DROP POLICY IF EXISTS "Operators can view their own aircraft details" ON public.aircraft;

CREATE POLICY "aircraft_consolidated_select" ON public.aircraft
    FOR SELECT USING (
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin' OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'broker'
    );

-- Aircraft utilization - consolidate multiple policies
DROP POLICY IF EXISTS "Operators can manage their aircraft utilization" ON public.aircraft_utilization;
DROP POLICY IF EXISTS "Operators can view their aircraft utilization" ON public.aircraft_utilization;

CREATE POLICY "aircraft_utilization_consolidated" ON public.aircraft_utilization
    FOR ALL USING (
        aircraft_id IN (
            SELECT id FROM aircraft 
            WHERE operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        ) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Credentials - consolidate multiple policies
DROP POLICY IF EXISTS "Level 2 counterparties can view masked credentials" ON public.credentials;
DROP POLICY IF EXISTS "Users can manage their own credentials" ON public.credentials;

CREATE POLICY "credentials_consolidated" ON public.credentials
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        ((SELECT verification_level FROM users WHERE id = (SELECT auth.uid())) >= 2 AND
         (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('broker', 'operator'))
    );

-- Crew availability - consolidate multiple policies
DROP POLICY IF EXISTS "Authenticated users can view crew availability" ON public.crew_availability;
DROP POLICY IF EXISTS "Crew can manage their own availability" ON public.crew_availability;

CREATE POLICY "crew_availability_consolidated" ON public.crew_availability
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('broker', 'operator', 'admin')
    );

-- Crew certifications - consolidate multiple policies
DROP POLICY IF EXISTS "Authenticated users can view basic crew certifications" ON public.crew_certifications;
DROP POLICY IF EXISTS "Crew can manage their own certifications" ON public.crew_certifications;

CREATE POLICY "crew_certifications_consolidated" ON public.crew_certifications
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('broker', 'operator', 'admin')
    );

-- Crew profiles - consolidate multiple policies
DROP POLICY IF EXISTS "Authenticated users can discover available crew" ON public.crew_profiles;
DROP POLICY IF EXISTS "Brokers can view crew profiles for active hiring" ON public.crew_profiles;
DROP POLICY IF EXISTS "Crew can manage their own profile" ON public.crew_profiles;

CREATE POLICY "crew_profiles_consolidated" ON public.crew_profiles
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('broker', 'operator', 'admin') OR
        (availability_status = 'available' AND (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'broker')
    );

-- Hiring requests - consolidate multiple policies
DROP POLICY IF EXISTS "Brokers can view their hiring requests" ON public.hiring_requests;
DROP POLICY IF EXISTS "Crew can view requests for them" ON public.hiring_requests;

CREATE POLICY "hiring_requests_consolidated_select" ON public.hiring_requests
    FOR SELECT USING (
        broker_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('pilot', 'crew') OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Page content - consolidate multiple policies
DROP POLICY IF EXISTS "Anyone can view content" ON public.page_content;
DROP POLICY IF EXISTS "page_content public read" ON public.page_content;

CREATE POLICY "page_content_consolidated_select" ON public.page_content
    FOR SELECT USING (true);

-- Performance metrics - consolidate multiple policies
DROP POLICY IF EXISTS "System can manage performance metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "Users can view their own performance metrics" ON public.performance_metrics;

CREATE POLICY "performance_metrics_consolidated" ON public.performance_metrics
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Platform admins - consolidate multiple policies
DROP POLICY IF EXISTS "platform_admins self read" ON public.platform_admins;
DROP POLICY IF EXISTS "platform_admins system manage" ON public.platform_admins;

CREATE POLICY "platform_admins_consolidated" ON public.platform_admins
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Profiles - consolidate multiple policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles self upsert" ON public.profiles;

CREATE POLICY "profiles_consolidated_insert" ON public.profiles
    FOR INSERT WITH CHECK (
        id = (SELECT auth.uid())
    );

-- Psych consent - consolidate multiple policies
DROP POLICY IF EXISTS "admin access to consent" ON public.psych_consent;
DROP POLICY IF EXISTS "consent self upsert" ON public.psych_consent;
DROP POLICY IF EXISTS "consent self read" ON public.psych_consent;
DROP POLICY IF EXISTS "consent self update" ON public.psych_consent;

CREATE POLICY "psych_consent_consolidated" ON public.psych_consent
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Psych responses - consolidate multiple policies
DROP POLICY IF EXISTS "admin access to responses" ON public.psych_responses;
DROP POLICY IF EXISTS "responses insert self" ON public.psych_responses;
DROP POLICY IF EXISTS "responses read self" ON public.psych_responses;

CREATE POLICY "psych_responses_consolidated" ON public.psych_responses
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Psych scores - consolidate multiple policies
DROP POLICY IF EXISTS "admin access to scores" ON public.psych_scores;
DROP POLICY IF EXISTS "scores read self" ON public.psych_scores;
DROP POLICY IF EXISTS "scores read shared" ON public.psych_scores;

CREATE POLICY "psych_scores_consolidated" ON public.psych_scores
    FOR SELECT USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin' OR
        (SELECT verification_level FROM users WHERE id = (SELECT auth.uid())) >= 2
    );

-- Psych sessions - consolidate multiple policies
DROP POLICY IF EXISTS "admin access to sessions" ON public.psych_sessions;
DROP POLICY IF EXISTS "sessions insert self" ON public.psych_sessions;
DROP POLICY IF EXISTS "sessions read self" ON public.psych_sessions;
DROP POLICY IF EXISTS "sessions update self" ON public.psych_sessions;

CREATE POLICY "psych_sessions_consolidated" ON public.psych_sessions
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- User achievements - consolidate multiple policies
DROP POLICY IF EXISTS "System can manage achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can view all achievements" ON public.user_achievements;

CREATE POLICY "user_achievements_consolidated" ON public.user_achievements
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- User ratings - consolidate multiple policies
DROP POLICY IF EXISTS "Users can view ratings about themselves" ON public.user_ratings;
DROP POLICY IF EXISTS "Users can view ratings for completed deals" ON public.user_ratings;

CREATE POLICY "user_ratings_consolidated_select" ON public.user_ratings
    FOR SELECT USING (
        rated_user_id = (SELECT auth.uid()) OR
        rater_id = (SELECT auth.uid()) OR
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

-- User sessions - consolidate multiple policies
DROP POLICY IF EXISTS "System can manage sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;

CREATE POLICY "user_sessions_consolidated" ON public.user_sessions
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Users - consolidate multiple policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;

CREATE POLICY "users_consolidated_select" ON public.users
    FOR SELECT USING (
        id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin' OR
        company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

-- Users - consolidate multiple UPDATE policies
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

CREATE POLICY "users_consolidated_update" ON public.users
    FOR UPDATE USING (
        id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Add missing policies for tables that need them
-- Add policies for tables that might be missing RLS
ALTER TABLE IF EXISTS user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS psych_share_tokens ENABLE ROW LEVEL SECURITY;

-- Create missing policies for user_achievements
CREATE POLICY "user_achievements_consolidated" ON public.user_achievements
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Create missing policies for user_reviews
CREATE POLICY "user_reviews_consolidated" ON public.user_reviews
    FOR ALL USING (
        reviewer_id = (SELECT auth.uid()) OR
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        ) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Create missing policies for psych_share_tokens
CREATE POLICY "psych_share_tokens_consolidated" ON public.psych_share_tokens
    FOR ALL USING (
        user_id = (SELECT auth.uid()) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Update table statistics after policy changes
ANALYZE aircraft;
ANALYZE aircraft_utilization;
ANALYZE credentials;
ANALYZE crew_availability;
ANALYZE crew_certifications;
ANALYZE crew_profiles;
ANALYZE hiring_requests;
ANALYZE page_content;
ANALYZE performance_metrics;
ANALYZE platform_admins;
ANALYZE profiles;
ANALYZE psych_consent;
ANALYZE psych_responses;
ANALYZE psych_scores;
ANALYZE psych_sessions;
ANALYZE user_achievements;
ANALYZE user_ratings;
ANALYZE user_sessions;
ANALYZE users;
ANALYZE user_reviews;
ANALYZE psych_share_tokens;
