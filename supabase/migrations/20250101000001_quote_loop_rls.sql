-- Row Level Security Policies for Quote Loop System
-- Ensures proper access control for all transaction tables

-- Enable RLS on all tables
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_hiring ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RFQs Policies
-- Brokers can see their own RFQs
CREATE POLICY "Brokers can view own RFQs" ON rfqs
    FOR SELECT USING (
        broker_id = auth.uid() OR
        broker_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Brokers can create RFQs
CREATE POLICY "Brokers can create RFQs" ON rfqs
    FOR INSERT WITH CHECK (
        broker_id = auth.uid() AND
        broker_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Brokers can update their own RFQs
CREATE POLICY "Brokers can update own RFQs" ON rfqs
    FOR UPDATE USING (
        broker_id = auth.uid() OR
        broker_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Operators can view open RFQs (for quoting)
CREATE POLICY "Operators can view open RFQs" ON rfqs
    FOR SELECT USING (
        status IN ('open', 'quoting') AND
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'operator'
        )
    );

-- Admins can view all RFQs
CREATE POLICY "Admins can view all RFQs" ON rfqs
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Quotes Policies
-- Brokers can view quotes for their RFQs
CREATE POLICY "Brokers can view quotes for own RFQs" ON quotes
    FOR SELECT USING (
        rfq_id IN (
            SELECT id FROM rfqs WHERE broker_id = auth.uid()
        )
    );

-- Operators can view their own quotes
CREATE POLICY "Operators can view own quotes" ON quotes
    FOR SELECT USING (
        operator_id = auth.uid() OR
        operator_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Operators can create quotes for open RFQs
CREATE POLICY "Operators can create quotes" ON quotes
    FOR INSERT WITH CHECK (
        operator_id = auth.uid() AND
        operator_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        ) AND
        rfq_id IN (
            SELECT id FROM rfqs WHERE status IN ('open', 'quoting')
        )
    );

-- Operators can update their own pending quotes
CREATE POLICY "Operators can update own pending quotes" ON quotes
    FOR UPDATE USING (
        operator_id = auth.uid() AND
        status = 'pending'
    );

-- Brokers can accept/reject quotes for their RFQs
CREATE POLICY "Brokers can update quotes for own RFQs" ON quotes
    FOR UPDATE USING (
        rfq_id IN (
            SELECT id FROM rfqs WHERE broker_id = auth.uid()
        )
    );

-- Admins can view all quotes
CREATE POLICY "Admins can view all quotes" ON quotes
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Deals Policies
-- Brokers can view deals they're involved in
CREATE POLICY "Brokers can view own deals" ON deals
    FOR SELECT USING (
        broker_id = auth.uid() OR
        broker_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Operators can view deals they're involved in
CREATE POLICY "Operators can view own deals" ON deals
    FOR SELECT USING (
        operator_id = auth.uid() OR
        operator_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Brokers can update deals they're involved in
CREATE POLICY "Brokers can update own deals" ON deals
    FOR UPDATE USING (
        broker_id = auth.uid() OR
        broker_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Operators can update deals they're involved in
CREATE POLICY "Operators can update own deals" ON deals
    FOR UPDATE USING (
        operator_id = auth.uid() OR
        operator_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Admins can view all deals
CREATE POLICY "Admins can view all deals" ON deals
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Crew Hiring Policies
-- Pilots can view their own hiring records
CREATE POLICY "Pilots can view own hiring records" ON crew_hiring
    FOR SELECT USING (
        pilot_id = auth.uid()
    );

-- Hiring parties can view their hiring records
CREATE POLICY "Hiring parties can view own hiring records" ON crew_hiring
    FOR SELECT USING (
        hiring_party_id = auth.uid() OR
        hiring_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Brokers and operators can create crew hiring
CREATE POLICY "Brokers and operators can create crew hiring" ON crew_hiring
    FOR INSERT WITH CHECK (
        hiring_party_id = auth.uid() AND
        hiring_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        ) AND
        auth.uid() IN (
            SELECT id FROM users WHERE role IN ('broker', 'operator')
        )
    );

-- Pilots can update their own hiring status
CREATE POLICY "Pilots can update own hiring status" ON crew_hiring
    FOR UPDATE USING (
        pilot_id = auth.uid()
    );

-- Hiring parties can update their hiring records
CREATE POLICY "Hiring parties can update own hiring records" ON crew_hiring
    FOR UPDATE USING (
        hiring_party_id = auth.uid() OR
        hiring_company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- Admins can view all crew hiring
CREATE POLICY "Admins can view all crew hiring" ON crew_hiring
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Performance Metrics Policies
-- Users can view their own metrics
CREATE POLICY "Users can view own metrics" ON performance_metrics
    FOR SELECT USING (
        user_id = auth.uid() OR
        company_id IN (
            SELECT company_id FROM users WHERE id = auth.uid()
        )
    );

-- System can insert metrics (for automated updates)
CREATE POLICY "System can insert metrics" ON performance_metrics
    FOR INSERT WITH CHECK (true);

-- Admins can view all metrics
CREATE POLICY "Admins can view all metrics" ON performance_metrics
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Audit Logs Policies
-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs" ON audit_logs
    FOR SELECT USING (
        user_id = auth.uid()
    );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM users WHERE role = 'admin'
        )
    );

-- Create function to check if user can access RFQ
CREATE OR REPLACE FUNCTION can_access_rfq(rfq_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM rfqs r
        WHERE r.id = rfq_uuid AND (
            r.broker_id = auth.uid() OR
            r.broker_company_id IN (
                SELECT company_id FROM users WHERE id = auth.uid()
            ) OR
            (r.status IN ('open', 'quoting') AND auth.uid() IN (
                SELECT id FROM users WHERE role = 'operator'
            )) OR
            auth.uid() IN (
                SELECT id FROM users WHERE role = 'admin'
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can access quote
CREATE OR REPLACE FUNCTION can_access_quote(quote_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM quotes q
        JOIN rfqs r ON q.rfq_id = r.id
        WHERE q.id = quote_uuid AND (
            r.broker_id = auth.uid() OR
            r.broker_company_id IN (
                SELECT company_id FROM users WHERE id = auth.uid()
            ) OR
            q.operator_id = auth.uid() OR
            q.operator_company_id IN (
                SELECT company_id FROM users WHERE id = auth.uid()
            ) OR
            auth.uid() IN (
                SELECT id FROM users WHERE role = 'admin'
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user can access deal
CREATE OR REPLACE FUNCTION can_access_deal(deal_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM deals d
        WHERE d.id = deal_uuid AND (
            d.broker_id = auth.uid() OR
            d.broker_company_id IN (
                SELECT company_id FROM users WHERE id = auth.uid()
            ) OR
            d.operator_id = auth.uid() OR
            d.operator_company_id IN (
                SELECT company_id FROM users WHERE id = auth.uid()
            ) OR
            auth.uid() IN (
                SELECT id FROM users WHERE role = 'admin'
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;






