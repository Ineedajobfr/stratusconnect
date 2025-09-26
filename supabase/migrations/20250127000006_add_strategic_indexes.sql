-- Add Strategic Indexes
-- Create indexes that will actually be used based on common query patterns

-- User-related indexes for authentication and profile queries
CREATE INDEX IF NOT EXISTS idx_users_email_active ON public.users(email) WHERE verification_status = 'approved';
CREATE INDEX IF NOT EXISTS idx_users_company_role ON public.users(company_id, role);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON public.users(verification_status) WHERE verification_status != 'approved';

-- Aircraft indexes for marketplace and operations
CREATE INDEX IF NOT EXISTS idx_aircraft_operator_status ON public.aircraft(operator_company_id, availability_status);
CREATE INDEX IF NOT EXISTS idx_aircraft_type_capacity ON public.aircraft(aircraft_type, passenger_capacity);
CREATE INDEX IF NOT EXISTS idx_aircraft_location ON public.aircraft(current_location);

-- Marketplace listings indexes for search and filtering
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_operator_status ON public.marketplace_listings(operator_company_id, status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_dates ON public.marketplace_listings(departure_date, return_date);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_price ON public.marketplace_listings(price_min, price_max);

-- Deals indexes for transaction management
CREATE INDEX IF NOT EXISTS idx_deals_participants_status ON public.deals(broker_id, operator_id, status);
CREATE INDEX IF NOT EXISTS idx_deals_dates ON public.deals(created_at, updated_at);
CREATE INDEX IF NOT EXISTS idx_deals_value ON public.deals(total_value);

-- Messages indexes for communication
CREATE INDEX IF NOT EXISTS idx_messages_participants ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_recent ON public.messages(created_at DESC) WHERE created_at > NOW() - INTERVAL '30 days';

-- Notifications indexes for user experience
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_recent ON public.notifications(created_at DESC) WHERE created_at > NOW() - INTERVAL '7 days';

-- Crew profiles indexes for hiring and availability
CREATE INDEX IF NOT EXISTS idx_crew_profiles_available ON public.crew_profiles(availability_status, role) WHERE availability_status = 'available';
CREATE INDEX IF NOT EXISTS idx_crew_profiles_location ON public.crew_profiles(current_location);
CREATE INDEX IF NOT EXISTS idx_crew_profiles_experience ON public.crew_profiles(years_experience);

-- Hiring requests indexes for job matching
CREATE INDEX IF NOT EXISTS idx_hiring_requests_broker_status ON public.hiring_requests(broker_id, status);
CREATE INDEX IF NOT EXISTS idx_hiring_requests_dates ON public.hiring_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_hiring_requests_location ON public.hiring_requests(departure_location, arrival_location);

-- Verification documents indexes for compliance
CREATE INDEX IF NOT EXISTS idx_verification_documents_user_status ON public.verification_documents(user_id, status);
CREATE INDEX IF NOT EXISTS idx_verification_documents_expiry ON public.verification_documents(expiry_date) WHERE expiry_date IS NOT NULL;

-- User ratings indexes for reputation system
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_avg ON public.user_ratings(rated_user_id, rating);
CREATE INDEX IF NOT EXISTS idx_user_ratings_recent ON public.user_ratings(created_at DESC) WHERE created_at > NOW() - INTERVAL '90 days';

-- Contracts indexes for legal management
CREATE INDEX IF NOT EXISTS idx_contracts_deal_status ON public.contracts(deal_id, status);
CREATE INDEX IF NOT EXISTS idx_contracts_dates ON public.contracts(created_at, effective_date);

-- Billing schedules indexes for financial management
CREATE INDEX IF NOT EXISTS idx_billing_schedules_deal_status ON public.billing_schedules(deal_id, status);
CREATE INDEX IF NOT EXISTS idx_billing_schedules_due ON public.billing_schedules(due_date) WHERE status = 'pending';

-- Escrow accounts indexes for payment security
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_deal_status ON public.escrow_accounts(deal_id, status);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_balance ON public.escrow_accounts(balance) WHERE balance > 0;

-- Crew certifications indexes for qualification tracking
CREATE INDEX IF NOT EXISTS idx_crew_certifications_user_type ON public.crew_certifications(user_id, certification_type);
CREATE INDEX IF NOT EXISTS idx_crew_certifications_expiry ON public.crew_certifications(expiry_date) WHERE expiry_date IS NOT NULL;

-- Crew availability indexes for scheduling
CREATE INDEX IF NOT EXISTS idx_crew_availability_user_dates ON public.crew_availability(user_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_crew_availability_status ON public.crew_availability(availability_status) WHERE availability_status = 'available';

-- Sanctions screenings indexes for compliance
CREATE INDEX IF NOT EXISTS idx_sanctions_screenings_user_status ON public.sanctions_screenings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_sanctions_screenings_dates ON public.sanctions_screenings(created_at, expires_at);

-- Strikes indexes for disciplinary tracking
CREATE INDEX IF NOT EXISTS idx_strikes_user_active ON public.strikes(user_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_strikes_dates ON public.strikes(created_at, expires_at);

-- User sessions indexes for security
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_active ON public.user_sessions(user_id, expires_at) WHERE expires_at > NOW();
CREATE INDEX IF NOT EXISTS idx_user_sessions_recent ON public.user_sessions(created_at DESC) WHERE created_at > NOW() - INTERVAL '30 days';

-- Sanctions matches indexes for compliance
CREATE INDEX IF NOT EXISTS idx_sanctions_matches_user_entity ON public.sanctions_matches(user_id, entity_id);
CREATE INDEX IF NOT EXISTS idx_sanctions_matches_dates ON public.sanctions_matches(created_at, resolved_at);

-- AI warnings indexes for monitoring
CREATE INDEX IF NOT EXISTS idx_ai_warnings_user_acknowledged ON public.ai_warnings(user_id, acknowledged);
CREATE INDEX IF NOT EXISTS idx_ai_warnings_severity ON public.ai_warnings(severity, created_at);

-- User profiles indexes for user management
CREATE INDEX IF NOT EXISTS idx_user_profiles_username_active ON public.user_profiles(username) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_location ON public.user_profiles(role, location);

-- Experience indexes for qualification tracking
CREATE INDEX IF NOT EXISTS idx_experience_user_type ON public.experience(user_id, experience_type);
CREATE INDEX IF NOT EXISTS idx_experience_dates ON public.experience(start_date, end_date);

-- Credentials indexes for verification
CREATE INDEX IF NOT EXISTS idx_credentials_user_type ON public.credentials(user_id, credential_type);
CREATE INDEX IF NOT EXISTS idx_credentials_expiry ON public.credentials(expiry_date) WHERE expiry_date IS NOT NULL;

-- References indexes for verification
CREATE INDEX IF NOT EXISTS idx_references_user_status ON public.references(user_id, status);
CREATE INDEX IF NOT EXISTS idx_references_contact ON public.references(contact_email, contact_phone);

-- Psych scores indexes for assessment
CREATE INDEX IF NOT EXISTS idx_psych_scores_user_session ON public.psych_scores(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_psych_scores_dates ON public.psych_scores(created_at, completed_at);

-- Psych consent indexes for compliance
CREATE INDEX IF NOT EXISTS idx_psych_consent_user_active ON public.psych_consent(user_id, consent_given) WHERE consent_given = true;
CREATE INDEX IF NOT EXISTS idx_psych_consent_dates ON public.psych_consent(created_at, expires_at);

-- Activity indexes for audit trails
CREATE INDEX IF NOT EXISTS idx_activity_user_recent ON public.activity(user_id, created_at DESC) WHERE created_at > NOW() - INTERVAL '30 days';
CREATE INDEX IF NOT EXISTS idx_activity_action ON public.activity(action, created_at);

-- Privacy settings indexes for user preferences
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user ON public.privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_settings_updated ON public.privacy_settings(updated_at DESC);

-- Profiles indexes for user management
CREATE INDEX IF NOT EXISTS idx_profiles_id_active ON public.profiles(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_profiles_updated ON public.profiles(updated_at DESC);

-- Companies indexes for organization management
CREATE INDEX IF NOT EXISTS idx_companies_type_approved ON public.companies(type, approved);
CREATE INDEX IF NOT EXISTS idx_companies_created ON public.companies(created_at DESC);

-- Company members indexes for organization structure
CREATE INDEX IF NOT EXISTS idx_company_members_company_user ON public.company_members(company_id, user_id);
CREATE INDEX IF NOT EXISTS idx_company_members_role ON public.company_members(role, status);

-- Platform admins indexes for administration
CREATE INDEX IF NOT EXISTS idx_platform_admins_user_active ON public.platform_admins(user_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_platform_admins_created ON public.platform_admins(created_at DESC);

-- User reviews indexes for reputation
CREATE INDEX IF NOT EXISTS idx_user_reviews_reviewee_rating ON public.user_reviews(reviewee_id, rating);
CREATE INDEX IF NOT EXISTS idx_user_reviews_recent ON public.user_reviews(created_at DESC) WHERE created_at > NOW() - INTERVAL '90 days';

-- Psych sessions indexes for assessment
CREATE INDEX IF NOT EXISTS idx_psych_sessions_user_test ON public.psych_sessions(user_id, test_id);
CREATE INDEX IF NOT EXISTS idx_psych_sessions_dates ON public.psych_sessions(created_at, completed_at);

-- Psych responses indexes for assessment data
CREATE INDEX IF NOT EXISTS idx_psych_responses_user_module ON public.psych_responses(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_psych_responses_dates ON public.psych_responses(created_at, completed_at);

-- Page content indexes for content management
CREATE INDEX IF NOT EXISTS idx_page_content_owner_active ON public.page_content(owner_id, status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_page_content_updated ON public.page_content(updated_at DESC);

-- Audit logs indexes for security monitoring
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_recent ON public.audit_logs(user_id, created_at DESC) WHERE created_at > NOW() - INTERVAL '30 days';
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action, created_at);

-- Psych share tokens indexes for data sharing
CREATE INDEX IF NOT EXISTS idx_psych_share_tokens_user_active ON public.psych_share_tokens(user_id, expires_at) WHERE expires_at > NOW();
CREATE INDEX IF NOT EXISTS idx_psych_share_tokens_created ON public.psych_share_tokens(created_at DESC);

-- Update table statistics for all tables
ANALYZE users;
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
ANALYZE companies;
ANALYZE company_members;
ANALYZE platform_admins;
ANALYZE user_reviews;
ANALYZE psych_sessions;
ANALYZE psych_responses;
ANALYZE page_content;
ANALYZE audit_logs;
ANALYZE psych_share_tokens;
