-- Quote Loop System - Core Transaction Engine
-- Implements the complete RFQ → Quote → Deal → Payment workflow

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create RFQ table (Request for Quote)
CREATE TABLE IF NOT EXISTS rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    broker_company_id UUID REFERENCES companies(id),
    
    -- Client requirements
    client_name TEXT NOT NULL,
    client_company TEXT,
    client_email TEXT,
    client_phone TEXT,
    
    -- Flight details
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ,
    passenger_count INTEGER NOT NULL DEFAULT 1,
    
    -- Aircraft preferences
    aircraft_preferences JSONB DEFAULT '{}',
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    currency TEXT DEFAULT 'USD',
    
    -- Status and timing
    status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'quoting', 'quoted', 'expired', 'cancelled')),
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMPTZ,
    
    -- Additional details
    notes TEXT,
    special_requirements TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT valid_passenger_count CHECK (passenger_count > 0),
    CONSTRAINT valid_budget CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max)
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    operator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    operator_company_id UUID REFERENCES companies(id),
    
    -- Quote details
    price DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    aircraft_id UUID REFERENCES aircraft(id),
    aircraft_model TEXT,
    aircraft_tail_number TEXT,
    
    -- Terms and conditions
    valid_until TIMESTAMPTZ NOT NULL,
    terms TEXT,
    notes TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn', 'expired')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_price CHECK (price > 0),
    CONSTRAINT valid_currency CHECK (currency = (SELECT currency FROM rfqs WHERE id = rfq_id))
);

-- Create deals table (when quotes are accepted)
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    
    -- Parties
    broker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    broker_company_id UUID REFERENCES companies(id),
    operator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    operator_company_id UUID REFERENCES companies(id),
    
    -- Financial details
    total_price DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    broker_commission DECIMAL(12,2) NOT NULL, -- 3.5% of total
    operator_commission DECIMAL(12,2) NOT NULL, -- 3.5% of total
    platform_fee DECIMAL(12,2) NOT NULL, -- 7% total split
    
    -- Payment processing
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    payment_method_id TEXT,
    
    -- Contract and legal
    contract_signed BOOLEAN DEFAULT false,
    contract_url TEXT,
    terms_accepted_at TIMESTAMPTZ,
    
    -- Status tracking
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_progress', 'completed', 'cancelled', 'disputed')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_total_price CHECK (total_price > 0),
    CONSTRAINT valid_commissions CHECK (broker_commission >= 0 AND operator_commission >= 0),
    CONSTRAINT valid_platform_fee CHECK (platform_fee = broker_commission + operator_commission)
);

-- Create crew_hiring table
CREATE TABLE IF NOT EXISTS crew_hiring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    
    -- Parties
    hiring_party_id UUID NOT NULL REFERENCES auth.users(id), -- broker or operator
    hiring_company_id UUID REFERENCES companies(id),
    pilot_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Flight details
    route TEXT NOT NULL,
    departure_date TIMESTAMPTZ NOT NULL,
    arrival_date TIMESTAMPTZ NOT NULL,
    
    -- Financial
    daily_rate DECIMAL(10,2) NOT NULL,
    total_payment DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- 10% commission
    commission_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
    
    -- Contract
    contract_signed BOOLEAN DEFAULT false,
    contract_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_rates CHECK (daily_rate > 0 AND total_payment > 0),
    CONSTRAINT valid_commission CHECK (commission_rate >= 0 AND commission_amount >= 0)
);

-- Create performance_metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    company_id UUID REFERENCES companies(id),
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(12,2) NOT NULL,
    metric_unit TEXT,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rfqs_broker_id ON rfqs(broker_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
CREATE INDEX IF NOT EXISTS idx_rfqs_created_at ON rfqs(created_at);
CREATE INDEX IF NOT EXISTS idx_rfqs_expires_at ON rfqs(expires_at);

CREATE INDEX IF NOT EXISTS idx_quotes_rfq_id ON quotes(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotes_operator_id ON quotes(operator_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);

CREATE INDEX IF NOT EXISTS idx_deals_rfq_id ON deals(rfq_id);
CREATE INDEX IF NOT EXISTS idx_deals_quote_id ON deals(quote_id);
CREATE INDEX IF NOT EXISTS idx_deals_broker_id ON deals(broker_id);
CREATE INDEX IF NOT EXISTS idx_deals_operator_id ON deals(operator_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_payment_status ON deals(payment_status);

CREATE INDEX IF NOT EXISTS idx_crew_hiring_deal_id ON crew_hiring(deal_id);
CREATE INDEX IF NOT EXISTS idx_crew_hiring_pilot_id ON crew_hiring(pilot_id);
CREATE INDEX IF NOT EXISTS idx_crew_hiring_status ON crew_hiring(status);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_company_id ON performance_metrics(company_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crew_hiring_updated_at BEFORE UPDATE ON crew_hiring FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate commissions
CREATE OR REPLACE FUNCTION calculate_commissions(total_price DECIMAL(12,2))
RETURNS TABLE(
    broker_commission DECIMAL(12,2),
    operator_commission DECIMAL(12,2),
    platform_fee DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY SELECT
        (total_price * 0.035)::DECIMAL(12,2) as broker_commission,
        (total_price * 0.035)::DECIMAL(12,2) as operator_commission,
        (total_price * 0.07)::DECIMAL(12,2) as platform_fee;
END;
$$ LANGUAGE plpgsql;

-- Create function to create deal from accepted quote
CREATE OR REPLACE FUNCTION create_deal_from_quote(
    p_quote_id UUID,
    p_payment_intent_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_deal_id UUID;
    v_quote RECORD;
    v_commissions RECORD;
BEGIN
    -- Get quote details
    SELECT q.*, r.broker_id, r.broker_company_id, r.currency
    INTO v_quote
    FROM quotes q
    JOIN rfqs r ON q.rfq_id = r.id
    WHERE q.id = p_quote_id AND q.status = 'accepted';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quote not found or not accepted';
    END IF;
    
    -- Calculate commissions
    SELECT * INTO v_commissions FROM calculate_commissions(v_quote.price);
    
    -- Create deal
    INSERT INTO deals (
        rfq_id,
        quote_id,
        broker_id,
        broker_company_id,
        operator_id,
        operator_company_id,
        total_price,
        currency,
        broker_commission,
        operator_commission,
        platform_fee,
        stripe_payment_intent_id,
        status
    ) VALUES (
        v_quote.rfq_id,
        v_quote.id,
        v_quote.broker_id,
        v_quote.broker_company_id,
        v_quote.operator_id,
        v_quote.operator_company_id,
        v_quote.price,
        v_quote.currency,
        v_commissions.broker_commission,
        v_commissions.operator_commission,
        v_commissions.platform_fee,
        p_payment_intent_id,
        'confirmed'
    ) RETURNING id INTO v_deal_id;
    
    -- Update RFQ status
    UPDATE rfqs SET status = 'quoted' WHERE id = v_quote.rfq_id;
    
    -- Log the transaction
    INSERT INTO audit_logs (action, table_name, record_id, new_values)
    VALUES ('deal_created', 'deals', v_deal_id, jsonb_build_object('quote_id', p_quote_id));
    
    RETURN v_deal_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update performance metrics
CREATE OR REPLACE FUNCTION update_performance_metrics(
    p_user_id UUID,
    p_company_id UUID DEFAULT NULL,
    p_metric_type TEXT,
    p_metric_value DECIMAL(12,2),
    p_period_start TIMESTAMPTZ DEFAULT NOW() - INTERVAL '1 day',
    p_period_end TIMESTAMPTZ DEFAULT NOW()
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO performance_metrics (
        user_id,
        company_id,
        metric_type,
        metric_value,
        period_start,
        period_end
    ) VALUES (
        p_user_id,
        p_company_id,
        p_metric_type,
        p_metric_value,
        p_period_start,
        p_period_end
    );
END;
$$ LANGUAGE plpgsql;



