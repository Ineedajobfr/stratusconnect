-- Fix Duplicate Indexes and Extension Issues
-- Remove duplicate indexes and move extensions to dedicated schema

-- Create dedicated schema for extensions
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move PostGIS extension to extensions schema
ALTER EXTENSION postgis SET SCHEMA extensions;

-- Move citext extension to extensions schema  
ALTER EXTENSION citext SET SCHEMA extensions;

-- Drop duplicate indexes
-- Deals table duplicate indexes
DROP INDEX IF EXISTS idx_deals_broker;
DROP INDEX IF EXISTS idx_deals_operator;

-- Keep the more descriptive index names
-- idx_deals_broker_id and idx_deals_operator_id are kept

-- Marketplace listings duplicate indexes
DROP INDEX IF EXISTS idx_listings_status;

-- Keep idx_marketplace_listings_status

-- Messages duplicate indexes
DROP INDEX IF EXISTS idx_messages_deal;

-- Keep idx_messages_deal_id

-- Grant permissions on extensions schema
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO service_role;

-- Update search path to include extensions schema
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Create function to check if user is admin (optimized version)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin';
END;
$$;

-- Create function to get user company ID (optimized version)
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (SELECT company_id FROM users WHERE id = (SELECT auth.uid()));
END;
$$;

-- Create function to get user role (optimized version)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (SELECT role FROM users WHERE id = (SELECT auth.uid()));
END;
$$;

-- Create function to check verification level (optimized version)
CREATE OR REPLACE FUNCTION get_user_verification_level()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN (SELECT verification_level FROM users WHERE id = (SELECT auth.uid()));
END;
$$;

-- Add indexes for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_verification_level ON users(verification_level);
CREATE INDEX IF NOT EXISTS idx_aircraft_operator_company_id ON aircraft(operator_company_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_operator_company_id ON marketplace_listings(operator_company_id);
CREATE INDEX IF NOT EXISTS idx_deals_broker_id ON deals(broker_id);
CREATE INDEX IF NOT EXISTS idx_deals_operator_id ON deals(operator_id);
CREATE INDEX IF NOT EXISTS idx_deals_broker_company_id ON deals(broker_company_id);
CREATE INDEX IF NOT EXISTS idx_deals_operator_company_id ON deals(operator_company_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_deal_id ON messages(deal_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_crew_profiles_user_id ON crew_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_crew_profiles_availability_status ON crew_profiles(availability_status);
CREATE INDEX IF EXISTS idx_hiring_requests_broker_id ON hiring_requests(broker_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rated_user_id ON user_ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rater_id ON user_ratings(rater_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_deal_id ON user_ratings(deal_id);
CREATE INDEX IF NOT EXISTS idx_contracts_deal_id ON contracts(deal_id);
CREATE INDEX IF NOT EXISTS idx_billing_schedules_deal_id ON billing_schedules(deal_id);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_deal_id ON escrow_accounts(deal_id);
CREATE INDEX IF NOT EXISTS idx_crew_certifications_user_id ON crew_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_crew_availability_user_id ON crew_availability(user_id);
CREATE INDEX IF NOT EXISTS idx_sanctions_screenings_user_id ON sanctions_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_strikes_user_id ON strikes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sanctions_matches_user_id ON sanctions_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_warnings_user_id ON ai_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_user_id ON experience(user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_references_user_id ON references(user_id);
CREATE INDEX IF NOT EXISTS idx_psych_scores_user_id ON psych_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_psych_consent_user_id ON psych_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_company_members_user_id ON company_members(user_id);
CREATE INDEX IF NOT EXISTS idx_company_members_company_id ON company_members(company_id);
CREATE INDEX IF NOT EXISTS idx_platform_admins_user_id ON platform_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_reviewer_id ON user_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_deal_id ON user_reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_psych_sessions_user_id ON psych_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_psych_responses_user_id ON psych_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_page_content_owner_id ON page_content(owner_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_psych_share_tokens_user_id ON psych_share_tokens(user_id);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_deals_participants ON deals(broker_id, operator_id, broker_company_id, operator_company_id);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages(sender_id, receiver_id, deal_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_utilization_aircraft_id ON aircraft_utilization(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_aircraft_id ON maintenance_schedules(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_contracts_deal_participants ON contracts(deal_id);
CREATE INDEX IF NOT EXISTS idx_billing_schedules_deal_participants ON billing_schedules(deal_id);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_deal_participants ON escrow_accounts(deal_id);

-- Add partial indexes for better performance on filtered queries
CREATE INDEX IF NOT EXISTS idx_crew_profiles_available ON crew_profiles(availability_status) WHERE availability_status = 'available';
CREATE INDEX IF NOT EXISTS idx_deals_active ON deals(status) WHERE status IN ('active', 'pending', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_messages_recent ON messages(created_at) WHERE created_at > NOW() - INTERVAL '30 days';
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- Update table statistics for better query planning
ANALYZE users;
ANALYZE companies;
ANALYZE aircraft;
ANALYZE marketplace_listings;
ANALYZE deals;
ANALYZE messages;
ANALYZE notifications;
ANALYZE crew_profiles;
ANALYZE hiring_requests;
ANALYZE verification_documents;
ANALYZE user_ratings;
ANALYZE contracts;
ANALYZE billing_schedules;
ANALYZE escrow_accounts;
ANALYZE crew_certifications;
ANALYZE crew_availability;
ANALYZE sanctions_screenings;
ANALYZE strikes;
ANALYZE user_sessions;
ANALYZE sanctions_matches;
ANALYZE ai_warnings;
ANALYZE user_profiles;
ANALYZE experience;
ANALYZE credentials;
ANALYZE references;
ANALYZE psych_scores;
ANALYZE psych_consent;
ANALYZE activity;
ANALYZE privacy_settings;
ANALYZE profiles;
ANALYZE company_members;
ANALYZE platform_admins;
ANALYZE user_reviews;
ANALYZE psych_sessions;
ANALYZE psych_responses;
ANALYZE page_content;
ANALYZE audit_logs;
ANALYZE psych_share_tokens;
ANALYZE aircraft_utilization;
ANALYZE maintenance_schedules;
ANALYZE performance_metrics;
ANALYZE saved_searches;
ANALYZE message_attachments;
ANALYZE payments;
ANALYZE user_achievements;
