-- Sequential Invoice Numbering System
-- FCA Compliant Aviation Platform

-- Invoice counters table to track sequential numbering
CREATE TABLE public.invoice_counters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_country text NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    last_sequence_number integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT invoice_counters_pkey PRIMARY KEY (id),
    CONSTRAINT invoice_counters_unique_period UNIQUE (company_country, year, month)
);

-- Sequential invoices table to store all generated invoices
CREATE TABLE public.sequential_invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_number text NOT NULL,
    company_country text NOT NULL,
    currency text NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    sequence_number integer NOT NULL,
    vat_rate numeric(5,2) NOT NULL,
    vat_amount integer NOT NULL,
    total_amount integer NOT NULL,
    exchange_rate numeric(10,6),
    base_currency text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    audit_hash text NOT NULL,
    CONSTRAINT sequential_invoices_pkey PRIMARY KEY (id),
    CONSTRAINT sequential_invoices_invoice_number_key UNIQUE (invoice_number)
);

-- Exchange rates table for currency conversion tracking
CREATE TABLE public.exchange_rates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    from_currency text NOT NULL,
    to_currency text NOT NULL,
    rate numeric(10,6) NOT NULL,
    timestamp timestamp with time zone DEFAULT now() NOT NULL,
    source text NOT NULL,
    CONSTRAINT exchange_rates_pkey PRIMARY KEY (id)
);

-- Indexes for performance
CREATE INDEX idx_invoice_counters_country_year_month ON public.invoice_counters (company_country, year, month);
CREATE INDEX idx_sequential_invoices_invoice_number ON public.sequential_invoices (invoice_number);
CREATE INDEX idx_sequential_invoices_company_country ON public.sequential_invoices (company_country);
CREATE INDEX idx_sequential_invoices_year_month ON public.sequential_invoices (year, month);
CREATE INDEX idx_exchange_rates_currencies ON public.exchange_rates (from_currency, to_currency);
CREATE INDEX idx_exchange_rates_timestamp ON public.exchange_rates (timestamp);

-- RLS Policies
ALTER TABLE public.invoice_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequential_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Invoice counters policies
CREATE POLICY "Users can view invoice counters for their company" ON public.invoice_counters
    FOR SELECT USING (
        company_country IN (
            SELECT DISTINCT country FROM public.users 
            WHERE id = (select auth.uid())
        )
    );

CREATE POLICY "Admin can manage all invoice counters" ON public.invoice_counters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (select auth.uid()) AND role = 'admin'
        )
    );

-- Sequential invoices policies
CREATE POLICY "Users can view their company invoices" ON public.sequential_invoices
    FOR SELECT USING (
        company_country IN (
            SELECT DISTINCT country FROM public.users 
            WHERE id = (select auth.uid())
        )
    );

CREATE POLICY "Admin can manage all sequential invoices" ON public.sequential_invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (select auth.uid()) AND role = 'admin'
        )
    );

-- Exchange rates policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view exchange rates" ON public.exchange_rates
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage exchange rates" ON public.exchange_rates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = (select auth.uid()) AND role = 'admin'
        )
    );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_invoice_counters_updated_at 
    BEFORE UPDATE ON public.invoice_counters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial counters for common countries
INSERT INTO public.invoice_counters (company_country, year, month, last_sequence_number) VALUES
('GB', 2024, 1, 0),
('GB', 2024, 2, 0),
('GB', 2024, 3, 0),
('GB', 2024, 4, 0),
('GB', 2024, 5, 0),
('GB', 2024, 6, 0),
('GB', 2024, 7, 0),
('GB', 2024, 8, 0),
('GB', 2024, 9, 0),
('GB', 2024, 10, 0),
('GB', 2024, 11, 0),
('GB', 2024, 12, 0),
('US', 2024, 1, 0),
('US', 2024, 2, 0),
('US', 2024, 3, 0),
('US', 2024, 4, 0),
('US', 2024, 5, 0),
('US', 2024, 6, 0),
('US', 2024, 7, 0),
('US', 2024, 8, 0),
('US', 2024, 9, 0),
('US', 2024, 10, 0),
('US', 2024, 11, 0),
('US', 2024, 12, 0);

-- Insert sample exchange rates
INSERT INTO public.exchange_rates (from_currency, to_currency, rate, source) VALUES
('USD', 'GBP', 0.79, 'ECB'),
('GBP', 'USD', 1.27, 'ECB'),
('EUR', 'GBP', 0.86, 'ECB'),
('GBP', 'EUR', 1.16, 'ECB'),
('USD', 'EUR', 0.92, 'ECB'),
('EUR', 'USD', 1.09, 'ECB'),
('CHF', 'GBP', 0.88, 'ECB'),
('GBP', 'CHF', 1.14, 'ECB');
