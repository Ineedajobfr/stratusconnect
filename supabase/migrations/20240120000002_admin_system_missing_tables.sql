-- Missing Tables for Admin System Services
-- Creates tables needed by the admin services

-- Broadcast Messages Table
CREATE TABLE IF NOT EXISTS broadcast_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_roles TEXT[] NOT NULL,
    target_users UUID[],
    message_type TEXT NOT NULL CHECK (message_type IN ('info', 'warning', 'critical', 'maintenance', 'update')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    read_count INTEGER DEFAULT 0,
    total_recipients INTEGER DEFAULT 0,
    metadata JSONB
);

-- User Notifications Table
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    broadcast_id UUID REFERENCES broadcast_messages(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('info', 'warning', 'critical', 'maintenance', 'update')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Templates Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push', 'in_app')),
    variables TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deal_id UUID REFERENCES deals(id),
    complainant_id UUID REFERENCES auth.users(id) NOT NULL,
    respondent_id UUID REFERENCES auth.users(id) NOT NULL,
    dispute_type TEXT NOT NULL CHECK (dispute_type IN ('payment', 'service', 'communication', 'fraud', 'other')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed', 'escalated')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_admin UUID REFERENCES auth.users(id),
    resolution TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Dispute Evidence Table
CREATE TABLE IF NOT EXISTS dispute_evidence (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dispute_id UUID REFERENCES disputes(id) NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dispute Communications Table
CREATE TABLE IF NOT EXISTS dispute_communications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dispute_id UUID REFERENCES disputes(id) NOT NULL,
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dispute Resolutions Table
CREATE TABLE IF NOT EXISTS dispute_resolutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dispute_id UUID REFERENCES disputes(id) NOT NULL,
    resolution_type TEXT NOT NULL CHECK (resolution_type IN ('refund', 'partial_refund', 'service_credit', 'no_action', 'account_suspension')),
    amount DECIMAL(12,2),
    reason TEXT NOT NULL,
    admin_notes TEXT,
    resolved_by UUID REFERENCES auth.users(id) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- AI Monitors Table
CREATE TABLE IF NOT EXISTS ai_monitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('fraud_detection', 'anomaly_detection', 'pattern_analysis', 'risk_assessment')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
    confidence_threshold DECIMAL(3,2) NOT NULL DEFAULT 0.7,
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    config JSONB
);

-- Fraud Alerts Table
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    monitor_id UUID REFERENCES ai_monitors(id),
    user_id UUID REFERENCES auth.users(id),
    deal_id UUID REFERENCES deals(id),
    alert_type TEXT NOT NULL CHECK (alert_type IN ('suspicious_activity', 'pattern_anomaly', 'risk_escalation', 'fraud_indicators')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    confidence_score DECIMAL(3,2) NOT NULL,
    description TEXT NOT NULL,
    indicators TEXT[] NOT NULL,
    metadata JSONB,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'false_positive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id)
);

-- User Activities Table
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMS Logs Table
CREATE TABLE IF NOT EXISTS sms_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'delivered')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for new tables
ALTER TABLE broadcast_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

-- Admin access policies
CREATE POLICY "Admin access to broadcast_messages" ON broadcast_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to user_notifications" ON user_notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can view own notifications" ON user_notifications
    FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Admin access to notification_templates" ON notification_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to disputes" ON disputes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can view own disputes" ON disputes
    FOR SELECT USING (
        complainant_id = (select auth.uid()) OR 
        respondent_id = (select auth.uid())
    );

CREATE POLICY "Admin access to dispute_evidence" ON dispute_evidence
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to dispute_communications" ON dispute_communications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can view own dispute communications" ON dispute_communications
    FOR SELECT USING (
        sender_id = (select auth.uid()) OR
        EXISTS (
            SELECT 1 FROM disputes 
            WHERE disputes.id = dispute_communications.dispute_id 
            AND (disputes.complainant_id = (select auth.uid()) OR disputes.respondent_id = (select auth.uid()))
        )
    );

CREATE POLICY "Admin access to dispute_resolutions" ON dispute_resolutions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to ai_monitors" ON ai_monitors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to fraud_alerts" ON fraud_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to user_activities" ON user_activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can view own activities" ON user_activities
    FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Admin access to email_logs" ON email_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin access to sms_logs" ON sms_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (select auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_broadcast_messages_created_at ON broadcast_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications(read);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_priority ON disputes(priority);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON disputes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dispute_evidence_dispute_id ON dispute_evidence(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_communications_dispute_id ON dispute_communications(dispute_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_severity ON fraud_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_created_at ON fraud_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
