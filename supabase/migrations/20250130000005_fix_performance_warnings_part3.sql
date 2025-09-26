-- Fix Performance Warnings - Part 3
-- Composite Indexes and Advanced Optimizations

-- 1. Create Composite Indexes for Complex Queries
CREATE INDEX IF NOT EXISTS idx_requests_broker_status_date ON public.requests(broker_company_id, status, departure_date);
CREATE INDEX IF NOT EXISTS idx_quotes_operator_status_price ON public.quotes(operator_company_id, status, price);
CREATE INDEX IF NOT EXISTS idx_bookings_broker_operator_status ON public.bookings(broker_company_id, operator_company_id, status);
CREATE INDEX IF NOT EXISTS idx_job_posts_type_status_featured ON public.job_posts(job_type, status, is_featured);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_status_created ON public.job_applications(job_post_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_contracts_deal_status_created ON public.contracts(deal_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_receipts_payer_payee_status ON public.receipts(payer_id, payee_id, status);

-- 2. Create Partial Indexes for Better Performance
CREATE INDEX IF NOT EXISTS idx_requests_active ON public.requests(departure_date, status) WHERE status IN ('open', 'quoted', 'accepted');
CREATE INDEX IF NOT EXISTS idx_quotes_pending ON public.quotes(created_at, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_bookings_upcoming ON public.bookings(created_at, status) WHERE status = 'upcoming';
CREATE INDEX IF NOT EXISTS idx_job_posts_active ON public.job_posts(created_at, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_job_applications_pending ON public.job_applications(created_at, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_contracts_draft ON public.contracts(created_at, status) WHERE status = 'draft';
CREATE INDEX IF NOT EXISTS idx_receipts_pending ON public.receipts(created_at, status) WHERE status = 'pending';

-- 3. Create Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_requests_text_search ON public.requests USING gin(to_tsvector('english', origin || ' ' || destination || ' ' || COALESCE(notes, '')));
CREATE INDEX IF NOT EXISTS idx_job_posts_text_search ON public.job_posts USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_forum_posts_text_search ON public.forum_posts USING gin(to_tsvector('english', title || ' ' || content));

-- 4. Create JSONB Indexes for Better Performance
CREATE INDEX IF NOT EXISTS idx_requests_aircraft_preferences ON public.requests USING gin(aircraft_preferences);
CREATE INDEX IF NOT EXISTS idx_job_posts_required_skills ON public.job_posts USING gin(required_skills);
CREATE INDEX IF NOT EXISTS idx_job_posts_aircraft_types ON public.job_posts USING gin(aircraft_types);
CREATE INDEX IF NOT EXISTS idx_contracts_parties ON public.contracts USING gin(parties);
CREATE INDEX IF NOT EXISTS idx_contracts_terms ON public.contracts USING gin(terms);
CREATE INDEX IF NOT EXISTS idx_contracts_financial_terms ON public.contracts USING gin(financial_terms);
CREATE INDEX IF NOT EXISTS idx_receipts_breakdown ON public.receipts USING gin(breakdown);
CREATE INDEX IF NOT EXISTS idx_document_storage_metadata ON public.document_storage USING gin(metadata);

-- 5. Create Function Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_company_role_verification ON public.users(company_id, role, verification_status);
CREATE INDEX IF NOT EXISTS idx_companies_type_approved ON public.companies(type, approved);
CREATE INDEX IF NOT EXISTS idx_requests_broker_status_budget ON public.requests(broker_company_id, status, budget_min, budget_max);
CREATE INDEX IF NOT EXISTS idx_quotes_operator_price_status ON public.quotes(operator_company_id, price, status);

-- 6. Create Time-based Partitioning Indexes
CREATE INDEX IF NOT EXISTS idx_requests_created_at_partition ON public.requests(created_at) WHERE created_at >= '2024-01-01';
CREATE INDEX IF NOT EXISTS idx_bookings_created_at_partition ON public.bookings(created_at) WHERE created_at >= '2024-01-01';
CREATE INDEX IF NOT EXISTS idx_job_posts_created_at_partition ON public.job_posts(created_at) WHERE created_at >= '2024-01-01';
CREATE INDEX IF NOT EXISTS idx_contracts_created_at_partition ON public.contracts(created_at) WHERE created_at >= '2024-01-01';
CREATE INDEX IF NOT EXISTS idx_receipts_created_at_partition ON public.receipts(created_at) WHERE created_at >= '2024-01-01';
