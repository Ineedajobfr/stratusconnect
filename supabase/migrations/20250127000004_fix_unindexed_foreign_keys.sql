-- Fix Unindexed Foreign Keys
-- Add missing indexes for all foreign key constraints to improve performance

-- Activity table foreign keys
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON public.activity(user_id);

-- Admin invite codes foreign keys
CREATE INDEX IF NOT EXISTS idx_admin_invite_codes_created_by ON public.admin_invite_codes(created_by);
CREATE INDEX IF NOT EXISTS idx_admin_invite_codes_used_by ON public.admin_invite_codes(used_by);

-- Companies foreign keys
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON public.companies(created_by);

-- Credentials foreign keys
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON public.credentials(user_id);

-- Deals foreign keys
CREATE INDEX IF NOT EXISTS idx_deals_aircraft_id ON public.deals(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_deals_listing_id ON public.deals(listing_id);
CREATE INDEX IF NOT EXISTS idx_deals_winning_bid_id ON public.deals(winning_bid_id);

-- Experience foreign keys
CREATE INDEX IF NOT EXISTS idx_experience_user_id ON public.experience(user_id);

-- Marketplace listings foreign keys
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_aircraft_id ON public.marketplace_listings(aircraft_id);

-- Page content foreign keys
CREATE INDEX IF NOT EXISTS idx_page_content_updated_by ON public.page_content(updated_by);

-- Psych items foreign keys
CREATE INDEX IF NOT EXISTS idx_psych_items_module_id ON public.psych_items(module_id);

-- Psych responses foreign keys
CREATE INDEX IF NOT EXISTS idx_psych_responses_item_id ON public.psych_responses(item_id);
CREATE INDEX IF NOT EXISTS idx_psych_responses_module_id ON public.psych_responses(module_id);
CREATE INDEX IF NOT EXISTS idx_psych_responses_user_id ON public.psych_responses(user_id);

-- Psych scores foreign keys
CREATE INDEX IF NOT EXISTS idx_psych_scores_session_id ON public.psych_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_psych_scores_user_id ON public.psych_scores(user_id);

-- Psych sessions foreign keys
CREATE INDEX IF NOT EXISTS idx_psych_sessions_test_id ON public.psych_sessions(test_id);
CREATE INDEX IF NOT EXISTS idx_psych_sessions_user_id ON public.psych_sessions(user_id);

-- Psych share tokens foreign keys
CREATE INDEX IF NOT EXISTS idx_psych_share_tokens_user_id ON public.psych_share_tokens(user_id);

-- References foreign keys
CREATE INDEX IF NOT EXISTS idx_references_user_id ON public.references(user_id);

-- Sanctions matches foreign keys
CREATE INDEX IF NOT EXISTS idx_sanctions_matches_entity_id ON public.sanctions_matches(entity_id);

-- Security events foreign keys
CREATE INDEX IF NOT EXISTS idx_security_events_resolved_by ON public.security_events(resolved_by);

-- Security settings foreign keys
CREATE INDEX IF NOT EXISTS idx_security_settings_updated_by ON public.security_settings(updated_by);

-- User reviews foreign keys
CREATE INDEX IF NOT EXISTS idx_user_reviews_deal_id ON public.user_reviews(deal_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_hiring_request_id ON public.user_reviews(hiring_request_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_reviewee_id ON public.user_reviews(reviewee_id);

-- Verification documents foreign keys
CREATE INDEX IF NOT EXISTS idx_verification_documents_sanctions_screening_id ON public.verification_documents(sanctions_screening_id);

-- Add composite indexes for frequently queried foreign key combinations
CREATE INDEX IF NOT EXISTS idx_deals_aircraft_listing ON public.deals(aircraft_id, listing_id);
CREATE INDEX IF NOT EXISTS idx_psych_responses_user_module ON public.psych_responses(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_psych_scores_user_session ON public.psych_scores(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_deal_reviewee ON public.user_reviews(deal_id, reviewee_id);

-- Add partial indexes for active/important records
CREATE INDEX IF NOT EXISTS idx_admin_invite_codes_active ON public.admin_invite_codes(created_by) WHERE used_by IS NULL;
CREATE INDEX IF NOT EXISTS idx_deals_active ON public.deals(aircraft_id, listing_id) WHERE status IN ('active', 'pending', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_psych_sessions_active ON public.psych_sessions(user_id, test_id) WHERE completed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_reviews_pending ON public.user_reviews(deal_id, reviewee_id) WHERE status = 'pending';

-- Update table statistics for better query planning
ANALYZE activity;
ANALYZE admin_invite_codes;
ANALYZE companies;
ANALYZE credentials;
ANALYZE deals;
ANALYZE experience;
ANALYZE marketplace_listings;
ANALYZE page_content;
ANALYZE psych_items;
ANALYZE psych_responses;
ANALYZE psych_scores;
ANALYZE psych_sessions;
ANALYZE psych_share_tokens;
ANALYZE references;
ANALYZE sanctions_matches;
ANALYZE security_events;
ANALYZE security_settings;
ANALYZE user_reviews;
ANALYZE verification_documents;
