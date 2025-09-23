-- Create internal_max schema for Max internal operator
CREATE SCHEMA IF NOT EXISTS internal_max;

-- Event bus table to capture platform events
CREATE TABLE internal_max.event_bus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type TEXT NOT NULL,
    actor_user_id UUID REFERENCES auth.users(id),
    payload JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Findings table for Max's analysis results
CREATE TABLE internal_max.findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warn', 'high', 'critical')),
    event_id UUID REFERENCES internal_max.event_bus(id),
    label TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    linked_object_type TEXT,
    linked_object_id UUID,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id)
);

-- Tasks table for Admin actions
CREATE TABLE internal_max.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    kind TEXT NOT NULL CHECK (kind IN ('alert', 'review', 'enrich', 'generate_report', 'route')),
    summary TEXT NOT NULL,
    suggested_action JSONB NOT NULL DEFAULT '{}',
    assignee TEXT NOT NULL DEFAULT 'admin',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done')),
    due_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES auth.users(id)
);

-- Reports table for generated documents
CREATE TABLE internal_max.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('weekly_digest', 'compliance_pack')),
    blob_url TEXT,
    checksum TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Performance tracking table
CREATE TABLE internal_max.performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    context JSONB DEFAULT '{}'
);

-- Audit logs for Max actions
CREATE TABLE internal_max.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor TEXT NOT NULL DEFAULT 'max_worker',
    action TEXT NOT NULL,
    target_type TEXT,
    target_id UUID,
    details JSONB DEFAULT '{}',
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_event_bus_type ON internal_max.event_bus(type);
CREATE INDEX idx_event_bus_status ON internal_max.event_bus(status);
CREATE INDEX idx_event_bus_occurred_at ON internal_max.event_bus(occurred_at);
CREATE INDEX idx_findings_severity ON internal_max.findings(severity);
CREATE INDEX idx_findings_status ON internal_max.findings(status);
CREATE INDEX idx_findings_created_at ON internal_max.findings(created_at);
CREATE INDEX idx_tasks_status ON internal_max.tasks(status);
CREATE INDEX idx_tasks_kind ON internal_max.tasks(kind);
CREATE INDEX idx_tasks_created_at ON internal_max.tasks(created_at);
CREATE INDEX idx_reports_type ON internal_max.reports(report_type);
CREATE INDEX idx_reports_period ON internal_max.reports(period_start, period_end);

-- Enable Row Level Security
ALTER TABLE internal_max.event_bus ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_max.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_max.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_max.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_max.performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_max.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Admin and max_worker only
CREATE POLICY "Admin and max_worker can read all event_bus" ON internal_max.event_bus
    FOR SELECT USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@stratusconnect.com'
        )
    );

CREATE POLICY "max_worker can write event_bus" ON internal_max.event_bus
    FOR INSERT USING (auth.role() = 'service_role');

CREATE POLICY "max_worker can update event_bus" ON internal_max.event_bus
    FOR UPDATE USING (auth.role() = 'service_role');

-- Similar policies for other tables
CREATE POLICY "Admin can read all findings" ON internal_max.findings
    FOR SELECT USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@stratusconnect.com'
        )
    );

CREATE POLICY "max_worker can manage findings" ON internal_max.findings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin can read all tasks" ON internal_max.tasks
    FOR SELECT USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@stratusconnect.com'
        )
    );

CREATE POLICY "Admin can update tasks" ON internal_max.tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@stratusconnect.com'
        )
    );

CREATE POLICY "max_worker can manage tasks" ON internal_max.tasks
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin can read all reports" ON internal_max.reports
    FOR SELECT USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@stratusconnect.com'
        )
    );

CREATE POLICY "max_worker can manage reports" ON internal_max.reports
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin can read performance data" ON internal_max.performance
    FOR SELECT USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@stratusconnect.com'
        )
    );

CREATE POLICY "max_worker can manage performance data" ON internal_max.performance
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin can read audit logs" ON internal_max.audit_logs
    FOR SELECT USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email LIKE '%@stratusconnect.com'
        )
    );

CREATE POLICY "max_worker can write audit logs" ON internal_max.audit_logs
    FOR INSERT USING (auth.role() = 'service_role');

-- Create a function to log Max actions
CREATE OR REPLACE FUNCTION internal_max.log_action(
    action_name TEXT,
    target_type TEXT DEFAULT NULL,
    target_id UUID DEFAULT NULL,
    action_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO internal_max.audit_logs (actor, action, target_type, target_id, details)
    VALUES ('max_worker', action_name, target_type, target_id, action_details)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
