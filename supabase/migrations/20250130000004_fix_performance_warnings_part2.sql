-- Fix Performance Warnings - Part 2
-- Strategic Indexes for Better Performance

-- 1. Create Strategic Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_requests_origin_destination ON public.requests(origin, destination);
CREATE INDEX IF NOT EXISTS idx_requests_departure_date_status ON public.requests(departure_date, status);
CREATE INDEX IF NOT EXISTS idx_quotes_price_status ON public.quotes(price, status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at_status ON public.bookings(created_at, status);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON public.companies(created_at);
CREATE INDEX IF NOT EXISTS idx_users_company_id_role ON public.users(company_id, role);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON public.users(verification_status);

-- 2. Fix Job Board Performance
CREATE INDEX IF NOT EXISTS idx_job_posts_job_type_status ON public.job_posts(job_type, status);
CREATE INDEX IF NOT EXISTS idx_job_posts_posted_by ON public.job_posts(posted_by);
CREATE INDEX IF NOT EXISTS idx_job_posts_company_id ON public.job_posts(company_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_category_id ON public.job_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_location ON public.job_posts(location);
CREATE INDEX IF NOT EXISTS idx_job_posts_start_date ON public.job_posts(start_date);
CREATE INDEX IF NOT EXISTS idx_job_posts_hourly_rate ON public.job_posts(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_job_posts_created_at ON public.job_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_post_id ON public.job_applications(job_post_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at);

-- 3. Fix Contract System Performance
CREATE INDEX IF NOT EXISTS idx_contracts_deal_id ON public.contracts(deal_id);
CREATE INDEX IF NOT EXISTS idx_contracts_template_id ON public.contracts(template_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON public.contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON public.contracts(created_at);
CREATE INDEX IF NOT EXISTS idx_contract_signatures_contract_id ON public.contract_signatures(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_signatures_signatory_id ON public.contract_signatures(signatory_id);
CREATE INDEX IF NOT EXISTS idx_receipts_deal_id ON public.receipts(deal_id);
CREATE INDEX IF NOT EXISTS idx_receipts_contract_id ON public.receipts(contract_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payer_id ON public.receipts(payer_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payee_id ON public.receipts(payee_id);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON public.receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at);

-- 4. Fix Document Storage Performance
CREATE INDEX IF NOT EXISTS idx_document_storage_user_id ON public.document_storage(user_id);
CREATE INDEX IF NOT EXISTS idx_document_storage_deal_id ON public.document_storage(deal_id);
CREATE INDEX IF NOT EXISTS idx_document_storage_document_type ON public.document_storage(document_type);
CREATE INDEX IF NOT EXISTS idx_document_storage_created_at ON public.document_storage(created_at);

-- 5. Fix Community Forums Performance
CREATE INDEX IF NOT EXISTS idx_community_forums_category ON public.community_forums(category);
CREATE INDEX IF NOT EXISTS idx_community_forums_created_by ON public.community_forums(created_by);
CREATE INDEX IF NOT EXISTS idx_community_forums_is_public ON public.community_forums(is_public);
CREATE INDEX IF NOT EXISTS idx_community_forums_created_at ON public.community_forums(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_posts_forum_id ON public.forum_posts(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON public.forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_post_type ON public.forum_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_pinned ON public.forum_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON public.forum_posts(created_at);

-- 6. Fix Saved Crews Performance
CREATE INDEX IF NOT EXISTS idx_saved_crews_broker_id ON public.saved_crews(broker_id);
CREATE INDEX IF NOT EXISTS idx_saved_crews_crew_id ON public.saved_crews(crew_id);
CREATE INDEX IF NOT EXISTS idx_saved_crews_saved_at ON public.saved_crews(saved_at);

-- 7. Fix User Monitoring Performance
CREATE INDEX IF NOT EXISTS idx_user_monitoring_user_id ON public.user_monitoring(user_id);
CREATE INDEX IF NOT EXISTS idx_user_monitoring_monitoring_type ON public.user_monitoring(monitoring_type);
CREATE INDEX IF NOT EXISTS idx_user_monitoring_created_at ON public.user_monitoring(created_at);
CREATE INDEX IF NOT EXISTS idx_user_warnings_user_id ON public.user_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_warnings_warning_type ON public.user_warnings(warning_type);
CREATE INDEX IF NOT EXISTS idx_user_warnings_created_at ON public.user_warnings(created_at);

-- 8. Fix Security Audit Log Performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_type ON public.security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_ip_address ON public.security_audit_log(ip_address);

-- 9. Fix Contract Audit Trail Performance
CREATE INDEX IF NOT EXISTS idx_contract_audit_trail_contract_id ON public.contract_audit_trail(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_audit_trail_action ON public.contract_audit_trail(action);
CREATE INDEX IF NOT EXISTS idx_contract_audit_trail_created_at ON public.contract_audit_trail(created_at);
