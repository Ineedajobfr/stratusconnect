-- Fix Performance Warnings - Part 1
-- Addresses Supabase Performance Advisor warnings

-- 1. Fix Extension Security Warnings
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2. Fix Auth Configuration Warnings
ALTER DATABASE postgres SET log_statement = 'mod';
ALTER DATABASE postgres SET log_min_duration_statement = 1000;
ALTER DATABASE postgres SET log_checkpoints = on;
ALTER DATABASE postgres SET log_connections = on;
ALTER DATABASE postgres SET log_disconnections = on;
ALTER DATABASE postgres SET log_lock_waits = on;

-- 3. Create Missing Indexes for Foreign Keys
CREATE INDEX IF NOT EXISTS idx_companies_type ON public.companies(type);
CREATE INDEX IF NOT EXISTS idx_companies_approved ON public.companies(approved);
CREATE INDEX IF NOT EXISTS idx_requests_broker_company_id ON public.requests(broker_company_id);
CREATE INDEX IF NOT EXISTS idx_requests_created_by ON public.requests(created_by);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_departure_date ON public.requests(departure_date);
CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON public.quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_operator_company_id ON public.quotes(operator_company_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_bookings_request_id ON public.bookings(request_id);
CREATE INDEX IF NOT EXISTS idx_bookings_quote_id ON public.bookings(quote_id);
CREATE INDEX IF NOT EXISTS idx_bookings_broker_company_id ON public.bookings(broker_company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_operator_company_id ON public.bookings(operator_company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
