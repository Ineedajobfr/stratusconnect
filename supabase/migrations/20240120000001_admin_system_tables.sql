-- Admin System Tables Migration
-- Creates all necessary tables for comprehensive admin functionality

-- Commission Rules Table
CREATE TABLE IF NOT EXISTS commission_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('broker', 'operator', 'pilot', 'crew')),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'hire', 'service')),
    rate_percentage DECIMAL(5,2) NOT NULL CHECK (rate_percentage >= 0 AND rate_percentage <= 100),
    minimum_amount DECIMAL(10,2),
    maximum_amount DECIMAL(10,2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Security Events Table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL CHECK (event_type IN ('login', 'failed_login', 'suspicious_activity', 'data_breach', 'system_error', 'admin_action')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('security', 'financial', 'communication', 'features', 'compliance')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Deals Table (Enhanced)
CREATE TABLE IF NOT EXISTS deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    broker_id UUID REFERENCES auth.users(id) NOT NULL,
    operator_id UUID REFERENCES auth.users(id) NOT NULL,
    pilot_id UUID REFERENCES auth.users(id),
    crew_id UUID REFERENCES auth.users(id),
    aircraft_id UUID,
    route TEXT NOT NULL,
    departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE,
    passengers INTEGER DEFAULT 1,
    quote_amount DECIMAL(12,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'escrowed', 'released', 'refunded')),
    escrow_amount DECIMAL(12,2) DEFAULT 0,
    signed_quote_pdf TEXT,
    dispute_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC Documents Table
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'pilot_license', 'insurance', 'aircraft_registration', 'other')),
    file_url TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sanctions Entities Table
CREATE TABLE IF NOT EXISTS sanctions_entities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('individual', 'organization', 'vessel', 'aircraft')),
    source TEXT NOT NULL CHECK (source IN ('OFAC', 'OFSI', 'EU', 'UN', 'OpenSanctions')),
    source_id TEXT NOT NULL,
    aliases TEXT[],
    countries TEXT[],
    birth_date DATE,
    sanctions_program TEXT,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Profiles Table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sanctions_checked BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sanctions_match BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS documents_uploaded BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS insurance_expiry DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_expiry DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS aircraft_registrations TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_deals INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS revenue DECIMAL(12,2) DEFAULT 0;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);

CREATE INDEX IF NOT EXISTS idx_deals_broker_id ON deals(broker_id);
CREATE INDEX IF NOT EXISTS idx_deals_operator_id ON deals(operator_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);

CREATE INDEX IF NOT EXISTS idx_sanctions_entities_name ON sanctions_entities USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_sanctions_entities_source ON sanctions_entities(source);

CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_profiles_sanctions_checked ON profiles(sanctions_checked);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- RLS Policies
ALTER TABLE commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanctions_entities ENABLE ROW LEVEL SECURITY;

-- Admin can access all tables
CREATE POLICY "Admin access to commission_rules" ON commission_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to security_events" ON security_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to system_settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to deals" ON deals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to kyc_documents" ON kyc_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to sanctions_entities" ON sanctions_entities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Users can view their own KYC documents
CREATE POLICY "Users can view own kyc_documents" ON kyc_documents
    FOR SELECT USING (user_id = auth.uid());

-- Users can view their own deals
CREATE POLICY "Users can view own deals" ON deals
    FOR SELECT USING (
        broker_id = auth.uid() OR 
        operator_id = auth.uid() OR 
        pilot_id = auth.uid() OR 
        crew_id = auth.uid()
    );

-- Insert default commission rules
INSERT INTO commission_rules (role, transaction_type, rate_percentage, created_by) VALUES
('broker', 'sale', 7.00, (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('operator', 'sale', 7.00, (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('broker', 'hire', 10.00, (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('operator', 'hire', 10.00, (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('pilot', 'service', 0.00, (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('crew', 'service', 0.00, (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (key, value, description, category, updated_by) VALUES
('maintenance_mode', 'false', 'Enable maintenance mode', 'features', (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('pilot_marketplace', 'true', 'Enable pilot marketplace', 'features', (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('crew_marketplace', 'true', 'Enable crew marketplace', 'features', (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('demo_mode', 'false', 'Enable demo mode', 'features', (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('require_kyc', 'true', 'Require KYC verification', 'compliance', (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('require_sanctions_check', 'true', 'Require sanctions screening', 'compliance', (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('email_verification', 'true', 'Require email verification', 'security', (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1)),
('two_factor_auth', 'true', 'Enable two-factor authentication', 'security', (SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com' LIMIT 1))
ON CONFLICT (key) DO NOTHING;
