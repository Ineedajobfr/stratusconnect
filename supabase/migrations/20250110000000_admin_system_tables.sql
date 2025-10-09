-- ============================================
-- ADMIN SYSTEM TABLES
-- For AI Assistant, Automation, Fraud Detection, Audit Logging
-- ============================================

-- Admin Audit Log
-- Tracks all admin actions for compliance and accountability
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  affected_table text,
  affected_record_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_action ON public.admin_audit_log(action);
CREATE INDEX idx_admin_audit_log_affected_table ON public.admin_audit_log(affected_table);

COMMENT ON TABLE public.admin_audit_log IS 'Complete audit trail of all admin actions';

-- Admin Automation Rules
-- Configurable automation rules for common admin tasks
CREATE TABLE IF NOT EXISTS public.admin_automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger text NOT NULL CHECK (trigger IN (
    'new_verification_request',
    'payment_failed',
    'user_reported_spam',
    'inactive_operator',
    'document_uploaded',
    'transaction_completed',
    'support_ticket_created',
    'system_error'
  )),
  condition jsonb NOT NULL DEFAULT '[]'::jsonb,
  action jsonb NOT NULL DEFAULT '[]'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  execution_count integer NOT NULL DEFAULT 0,
  last_executed timestamptz,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_automation_rules_enabled ON public.admin_automation_rules(enabled);
CREATE INDEX idx_automation_rules_trigger ON public.admin_automation_rules(trigger);
CREATE INDEX idx_automation_rules_created_by ON public.admin_automation_rules(created_by);

COMMENT ON TABLE public.admin_automation_rules IS 'Configurable automation rules for admin tasks';

-- Admin Notifications
-- System notifications for admins
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  category text DEFAULT 'general' CHECK (category IN (
    'general',
    'verification',
    'transaction',
    'security',
    'system',
    'support'
  )),
  read boolean NOT NULL DEFAULT false,
  action_url text,
  action_label text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

CREATE INDEX idx_admin_notifications_admin_id ON public.admin_notifications(admin_id);
CREATE INDEX idx_admin_notifications_read ON public.admin_notifications(read);
CREATE INDEX idx_admin_notifications_severity ON public.admin_notifications(severity);
CREATE INDEX idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);

COMMENT ON TABLE public.admin_notifications IS 'Notifications for admin users';

-- Fraud Alerts
-- AI-powered fraud detection alerts
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id uuid,
  risk_score integer NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'false_positive')),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  resolution_notes text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_fraud_alerts_user_id ON public.fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_status ON public.fraud_alerts(status);
CREATE INDEX idx_fraud_alerts_risk_score ON public.fraud_alerts(risk_score DESC);
CREATE INDEX idx_fraud_alerts_created_at ON public.fraud_alerts(created_at DESC);

COMMENT ON TABLE public.fraud_alerts IS 'Fraud detection alerts with risk scoring';

-- Fraud Blocklist
-- Blocked IPs, emails, payment methods
CREATE TABLE IF NOT EXISTS public.fraud_blocklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('ip', 'email', 'card', 'device')),
  reason text,
  active boolean NOT NULL DEFAULT true,
  added_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX idx_fraud_blocklist_value ON public.fraud_blocklist(value);
CREATE INDEX idx_fraud_blocklist_type ON public.fraud_blocklist(type);
CREATE INDEX idx_fraud_blocklist_active ON public.fraud_blocklist(active);

COMMENT ON TABLE public.fraud_blocklist IS 'Blocklist for fraudulent IPs, emails, cards';

-- User Login History
-- Track user logins for fraud detection
CREATE TABLE IF NOT EXISTS public.user_login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text NOT NULL,
  user_agent text,
  location_country text,
  location_city text,
  success boolean NOT NULL DEFAULT true,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_login_history_user_id ON public.user_login_history(user_id);
CREATE INDEX idx_login_history_ip_address ON public.user_login_history(ip_address);
CREATE INDEX idx_login_history_created_at ON public.user_login_history(created_at DESC);
CREATE INDEX idx_login_history_success ON public.user_login_history(success);

COMMENT ON TABLE public.user_login_history IS 'User login history for security monitoring';

-- System Error Logs
-- Application error tracking
CREATE TABLE IF NOT EXISTS public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL,
  error_message text NOT NULL,
  error_stack text,
  user_id uuid REFERENCES auth.users(id),
  url text,
  user_agent text,
  severity text NOT NULL DEFAULT 'error' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  metadata jsonb DEFAULT '{}'::jsonb,
  resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_error_logs_error_type ON public.error_logs(error_type);
CREATE INDEX idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX idx_error_logs_resolved ON public.error_logs(resolved);
CREATE INDEX idx_error_logs_user_id ON public.error_logs(user_id);

COMMENT ON TABLE public.error_logs IS 'Application error logs';

-- Admin Dashboard Widgets Configuration
-- Store custom dashboard widget layouts per admin
CREATE TABLE IF NOT EXISTS public.admin_dashboard_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_type text NOT NULL,
  position_x integer NOT NULL DEFAULT 0,
  position_y integer NOT NULL DEFAULT 0,
  width integer NOT NULL DEFAULT 1,
  height integer NOT NULL DEFAULT 1,
  config jsonb DEFAULT '{}'::jsonb,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(admin_id, widget_type)
);

CREATE INDEX idx_dashboard_widgets_admin_id ON public.admin_dashboard_widgets(admin_id);
CREATE INDEX idx_dashboard_widgets_visible ON public.admin_dashboard_widgets(visible);

COMMENT ON TABLE public.admin_dashboard_widgets IS 'Customizable admin dashboard widget configurations';

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- Admin Audit Log: Only admins can read
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin Automation Rules: Admins can manage
CREATE POLICY "Admins can manage automation rules"
  ON public.admin_automation_rules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin Notifications: Users can view their own notifications
CREATE POLICY "Admins can view their notifications"
  ON public.admin_notifications
  FOR SELECT
  USING (admin_id = auth.uid());

CREATE POLICY "Admins can update their notifications"
  ON public.admin_notifications
  FOR UPDATE
  USING (admin_id = auth.uid());

-- Fraud Alerts: Only admins can access
CREATE POLICY "Admins can manage fraud alerts"
  ON public.fraud_alerts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Fraud Blocklist: Only admins can access
CREATE POLICY "Admins can manage blocklist"
  ON public.fraud_blocklist
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- User Login History: Users can view their own, admins can view all
CREATE POLICY "Users can view their own login history"
  ON public.user_login_history
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all login history"
  ON public.user_login_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Error Logs: Only admins can access
CREATE POLICY "Admins can manage error logs"
  ON public.error_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin Dashboard Widgets: Admins can manage their own
CREATE POLICY "Admins can manage their dashboard widgets"
  ON public.admin_dashboard_widgets
  FOR ALL
  USING (admin_id = auth.uid());

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automation rules
DROP TRIGGER IF EXISTS update_automation_rules_updated_at ON public.admin_automation_rules;
CREATE TRIGGER update_automation_rules_updated_at
  BEFORE UPDATE ON public.admin_automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for dashboard widgets
DROP TRIGGER IF EXISTS update_dashboard_widgets_updated_at ON public.admin_dashboard_widgets;
CREATE TRIGGER update_dashboard_widgets_updated_at
  BEFORE UPDATE ON public.admin_dashboard_widgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log admin actions (helper for application code)
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action text,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_affected_table text DEFAULT NULL,
  p_affected_record_id text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_id,
    action,
    details,
    ip_address,
    user_agent,
    affected_table,
    affected_record_id
  )
  VALUES (
    auth.uid(),
    p_action,
    p_details,
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    current_setting('request.headers', true)::json->>'user-agent',
    p_affected_table,
    p_affected_record_id
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create admin notification
CREATE OR REPLACE FUNCTION create_admin_notification(
  p_admin_id uuid,
  p_title text,
  p_message text,
  p_severity text DEFAULT 'info',
  p_category text DEFAULT 'general',
  p_action_url text DEFAULT NULL,
  p_action_label text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO public.admin_notifications (
    admin_id,
    title,
    message,
    severity,
    category,
    action_url,
    action_label
  )
  VALUES (
    p_admin_id,
    p_title,
    p_message,
    p_severity,
    p_category,
    p_action_url,
    p_action_label
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify all admins
CREATE OR REPLACE FUNCTION notify_all_admins(
  p_title text,
  p_message text,
  p_severity text DEFAULT 'info',
  p_category text DEFAULT 'general'
)
RETURNS integer AS $$
DECLARE
  v_count integer := 0;
  v_admin_id uuid;
BEGIN
  FOR v_admin_id IN 
    SELECT id FROM public.profiles WHERE role = 'admin'
  LOOP
    PERFORM create_admin_notification(
      v_admin_id,
      p_title,
      p_message,
      p_severity,
      p_category
    );
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default automation rule templates
INSERT INTO public.admin_automation_rules (
  name,
  description,
  trigger,
  condition,
  action,
  enabled,
  created_by
)
SELECT 
  'Auto-Approve High Quality Verifications',
  'Automatically approve verification requests with document quality > 90%',
  'document_uploaded',
  '[{"field": "document_quality_score", "operator": "greater_than", "value": 90}]'::jsonb,
  '[{"type": "auto_approve", "params": {}}, {"type": "send_notification", "params": {"title": "Verification Approved", "message": "Your account has been verified!"}}]'::jsonb,
  false,
  (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_automation_rules 
  WHERE name = 'Auto-Approve High Quality Verifications'
)
AND EXISTS (SELECT 1 FROM auth.users WHERE email LIKE '%admin%');

COMMENT ON COLUMN public.admin_automation_rules.condition IS 'Array of conditions: [{field, operator, value}]';
COMMENT ON COLUMN public.admin_automation_rules.action IS 'Array of actions: [{type, params}]';
COMMENT ON COLUMN public.fraud_alerts.flags IS 'Array of fraud flags: ["velocity_abuse", "location_mismatch", etc.]';

