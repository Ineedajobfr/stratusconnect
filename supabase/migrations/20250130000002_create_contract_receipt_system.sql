-- Contract and Receipt System Migration
-- Creates comprehensive contract generation and receipt system

-- Contract Templates Table
CREATE TABLE IF NOT EXISTS public.contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL CHECK (template_type IN ('pilot_hire', 'crew_hire', 'aircraft_charter', 'brokerage_agreement', 'maintenance_contract')),
    content TEXT NOT NULL, -- HTML template content
    variables JSONB, -- Template variables and their types
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Contracts Table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id),
    template_id UUID NOT NULL REFERENCES public.contract_templates(id),
    contract_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Final contract content
    pdf_url TEXT, -- URL to generated PDF
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'signed', 'executed', 'cancelled')),
    parties JSONB NOT NULL, -- Contract parties information
    terms JSONB NOT NULL, -- Contract terms and conditions
    financial_terms JSONB NOT NULL, -- Payment terms, rates, etc.
    dates JSONB NOT NULL, -- Important dates (start, end, review, etc.)
    signatures JSONB, -- Digital signatures data
    created_by UUID NOT NULL REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    signed_at TIMESTAMP WITH TIME ZONE,
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract Signatures Table
CREATE TABLE IF NOT EXISTS public.contract_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    signatory_id UUID NOT NULL REFERENCES auth.users(id),
    signature_data TEXT NOT NULL, -- Base64 encoded signature
    signature_type TEXT NOT NULL DEFAULT 'digital' CHECK (signature_type IN ('digital', 'electronic', 'wet')),
    ip_address INET,
    user_agent TEXT,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Receipts Table
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id),
    contract_id UUID REFERENCES public.contracts(id),
    receipt_number TEXT NOT NULL UNIQUE,
    receipt_type TEXT NOT NULL CHECK (receipt_type IN ('payment', 'commission', 'refund', 'adjustment', 'final_settlement')),
    payer_id UUID NOT NULL REFERENCES auth.users(id),
    payee_id UUID NOT NULL REFERENCES auth.users(id),
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    description TEXT NOT NULL,
    breakdown JSONB, -- Detailed breakdown of charges
    payment_method TEXT,
    transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
    pdf_url TEXT, -- URL to generated PDF receipt
    created_by UUID NOT NULL REFERENCES auth.users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Storage Table
CREATE TABLE IF NOT EXISTS public.document_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    deal_id UUID REFERENCES public.deals(id),
    document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'receipt', 'invoice', 'agreement', 'certificate', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    is_public BOOLEAN DEFAULT false,
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Trail Table
CREATE TABLE IF NOT EXISTS public.contract_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'approved', 'signed', 'executed', 'cancelled', 'viewed', 'downloaded')),
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contracts_deal_id ON public.contracts(deal_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON public.contracts(created_at);
CREATE INDEX IF NOT EXISTS idx_contracts_contract_number ON public.contracts(contract_number);

CREATE INDEX IF NOT EXISTS idx_contract_signatures_contract_id ON public.contract_signatures(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_signatures_signatory_id ON public.contract_signatures(signatory_id);

CREATE INDEX IF NOT EXISTS idx_receipts_deal_id ON public.receipts(deal_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payer_id ON public.receipts(payer_id);
CREATE INDEX IF NOT EXISTS idx_receipts_payee_id ON public.receipts(payee_id);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON public.receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at);

CREATE INDEX IF NOT EXISTS idx_document_storage_user_id ON public.document_storage(user_id);
CREATE INDEX IF NOT EXISTS idx_document_storage_deal_id ON public.document_storage(deal_id);
CREATE INDEX IF NOT EXISTS idx_document_storage_document_type ON public.document_storage(document_type);

CREATE INDEX IF NOT EXISTS idx_contract_audit_trail_contract_id ON public.contract_audit_trail(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_audit_trail_performed_by ON public.contract_audit_trail(performed_by);

-- Insert default contract templates
INSERT INTO public.contract_templates (name, description, template_type, content, variables, created_by) VALUES
('Standard Pilot Hire Agreement', 'Standard template for hiring pilots', 'pilot_hire', 
'<html><body><h1>PILOT HIRE AGREEMENT</h1><p>This agreement is between {{operator_name}} and {{pilot_name}} for the position of {{position}}.</p><p>Start Date: {{start_date}}</p><p>End Date: {{end_date}}</p><p>Hourly Rate: {{hourly_rate}}</p><p>Aircraft: {{aircraft_type}}</p></body></html>',
'{"operator_name": "string", "pilot_name": "string", "position": "string", "start_date": "date", "end_date": "date", "hourly_rate": "currency", "aircraft_type": "string"}',
'00000000-0000-0000-0000-000000000000'),

('Standard Crew Hire Agreement', 'Standard template for hiring crew members', 'crew_hire',
'<html><body><h1>CREW HIRE AGREEMENT</h1><p>This agreement is between {{operator_name}} and {{crew_name}} for the position of {{position}}.</p><p>Start Date: {{start_date}}</p><p>End Date: {{end_date}}</p><p>Hourly Rate: {{hourly_rate}}</p><p>Aircraft: {{aircraft_type}}</p></body></html>',
'{"operator_name": "string", "crew_name": "string", "position": "string", "start_date": "date", "end_date": "date", "hourly_rate": "currency", "aircraft_type": "string"}',
'00000000-0000-0000-0000-000000000000'),

('Aircraft Charter Agreement', 'Standard template for aircraft charter agreements', 'aircraft_charter',
'<html><body><h1>AIRCRAFT CHARTER AGREEMENT</h1><p>This agreement is between {{operator_name}} and {{broker_name}} for charter services.</p><p>Flight Date: {{flight_date}}</p><p>Route: {{route}}</p><p>Charter Rate: {{charter_rate}}</p><p>Aircraft: {{aircraft_type}}</p></body></html>',
'{"operator_name": "string", "broker_name": "string", "flight_date": "date", "route": "string", "charter_rate": "currency", "aircraft_type": "string"}',
'00000000-0000-0000-0000-000000000000');

-- Enable RLS
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_audit_trail ENABLE ROW LEVEL SECURITY;

-- Contract Templates Policies
CREATE POLICY "Anyone can view active contract templates" ON public.contract_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage contract templates" ON public.contract_templates FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND role = 'admin')
);

-- Contracts Policies
CREATE POLICY "Users can view contracts they are party to" ON public.contracts FOR SELECT USING (
    (select auth.uid()) = ANY(SELECT jsonb_array_elements_text(parties->'user_ids'))
);
CREATE POLICY "Users can create contracts for their deals" ON public.contracts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.deals WHERE id = deal_id AND (broker_id = (select auth.uid()) OR operator_id = (select auth.uid())))
);
CREATE POLICY "Users can update contracts they created" ON public.contracts FOR UPDATE USING (created_by = (select auth.uid()));

-- Contract Signatures Policies
CREATE POLICY "Users can view signatures for their contracts" ON public.contract_signatures FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND (select auth.uid()) = ANY(SELECT jsonb_array_elements_text(parties->'user_ids')))
);
CREATE POLICY "Users can create signatures for their contracts" ON public.contract_signatures FOR INSERT WITH CHECK (
    signatory_id = (select auth.uid()) AND
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND (select auth.uid()) = ANY(SELECT jsonb_array_elements_text(parties->'user_ids')))
);

-- Receipts Policies
CREATE POLICY "Users can view receipts they are party to" ON public.receipts FOR SELECT USING (
    payer_id = (select auth.uid()) OR payee_id = (select auth.uid())
);
CREATE POLICY "Users can create receipts for their deals" ON public.receipts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.deals WHERE id = deal_id AND (broker_id = (select auth.uid()) OR operator_id = (select auth.uid())))
);

-- Document Storage Policies
CREATE POLICY "Users can view their own documents" ON public.document_storage FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can manage their own documents" ON public.document_storage FOR ALL USING (user_id = (select auth.uid()));

-- Contract Audit Trail Policies
CREATE POLICY "Users can view audit trail for their contracts" ON public.contract_audit_trail FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.contracts WHERE id = contract_id AND (select auth.uid()) = ANY(SELECT jsonb_array_elements_text(parties->'user_ids')))
);
CREATE POLICY "System can create audit trail entries" ON public.contract_audit_trail FOR INSERT WITH CHECK (true);

-- Create functions for contract generation
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS TEXT AS $$
DECLARE
    contract_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the next counter value
    SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 'CONTRACT-(\d+)') AS INTEGER)), 0) + 1
    INTO counter
    FROM public.contracts
    WHERE contract_number LIKE 'CONTRACT-%';
    
    -- Format as CONTRACT-YYYY-NNNNNN
    contract_number := 'CONTRACT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(counter::TEXT, 6, '0');
    
    RETURN contract_number;
END;
$$ LANGUAGE plpgsql;

-- Create function for receipt generation
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
    receipt_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the next counter value
    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 'RECEIPT-(\d+)') AS INTEGER)), 0) + 1
    INTO counter
    FROM public.receipts
    WHERE receipt_number LIKE 'RECEIPT-%';
    
    -- Format as RECEIPT-YYYY-NNNNNN
    receipt_number := 'RECEIPT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(counter::TEXT, 6, '0');
    
    RETURN receipt_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to log contract actions
CREATE OR REPLACE FUNCTION public.log_contract_action(
    p_contract_id UUID,
    p_action TEXT,
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.contract_audit_trail (
        contract_id,
        action,
        performed_by,
        details,
        ip_address,
        user_agent
    ) VALUES (
        p_contract_id,
        p_action,
        (select auth.uid()),
        p_details,
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic contract number generation
CREATE OR REPLACE FUNCTION public.set_contract_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
        NEW.contract_number := public.generate_contract_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_contract_number
    BEFORE INSERT ON public.contracts
    FOR EACH ROW EXECUTE FUNCTION public.set_contract_number();

-- Create triggers for automatic receipt number generation
CREATE OR REPLACE FUNCTION public.set_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
        NEW.receipt_number := public.generate_receipt_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_receipt_number
    BEFORE INSERT ON public.receipts
    FOR EACH ROW EXECUTE FUNCTION public.set_receipt_number();

-- Create function to generate contract summary
CREATE OR REPLACE FUNCTION public.generate_contract_summary(contract_id UUID)
RETURNS TEXT AS $$
DECLARE
    contract_record RECORD;
    summary TEXT;
BEGIN
    SELECT 
        c.title,
        c.contract_number,
        c.parties,
        c.financial_terms,
        c.dates,
        d.id as deal_id,
        d.status as deal_status
    INTO contract_record
    FROM public.contracts c
    JOIN public.deals d ON c.deal_id = d.id
    WHERE c.id = contract_id;
    
    IF NOT FOUND THEN
        RETURN 'Contract not found';
    END IF;
    
    summary := 'Contract: ' || contract_record.title || ' (' || contract_record.contract_number || ')' || E'\n';
    summary := summary || 'Deal ID: ' || contract_record.deal_id || E'\n';
    summary := summary || 'Status: ' || contract_record.deal_status || E'\n';
    summary := summary || 'Parties: ' || contract_record.parties::TEXT || E'\n';
    summary := summary || 'Financial Terms: ' || contract_record.financial_terms::TEXT || E'\n';
    summary := summary || 'Dates: ' || contract_record.dates::TEXT;
    
    RETURN summary;
END;
$$ LANGUAGE plpgsql;
