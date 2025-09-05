-- Create strikes table for enforcement tracking
CREATE TABLE public.strikes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  severity TEXT NOT NULL DEFAULT 'minor', -- minor, severe
  count INTEGER NOT NULL DEFAULT 1,
  resolved_flag BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL, -- admin who issued the strike
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID
);

-- Enable RLS
ALTER TABLE public.strikes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can manage strikes" ON public.strikes
FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view their own strikes" ON public.strikes
FOR SELECT USING (user_id = auth.uid());

-- Create commission_settings table
CREATE TABLE public.commission_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_type TEXT NOT NULL, -- booking, crew_hiring
  commission_rate DECIMAL(5,4) NOT NULL, -- 0.07 for 7%, 0.10 for 10%
  applies_to_role TEXT NOT NULL, -- broker, operator
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.commission_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view commission settings" ON public.commission_settings
FOR SELECT USING (true);

CREATE POLICY "Admin can manage commission settings" ON public.commission_settings
FOR ALL USING (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

-- Insert default commission settings
INSERT INTO public.commission_settings (transaction_type, commission_rate, applies_to_role) VALUES 
('booking', 0.07, 'broker'),
('booking', 0.07, 'operator'),
('crew_hiring', 0.10, 'operator');

-- Create audit_logs table for complete activity tracking
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- user, deal, message, etc
  target_id TEXT NOT NULL,
  before_values JSONB,
  after_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can view all audit logs" ON public.audit_logs
FOR SELECT USING (EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
FOR INSERT WITH CHECK (true);

-- Add commission_amount column to payments table
ALTER TABLE public.payments ADD COLUMN commission_amount NUMERIC DEFAULT 0;

-- Add redacted_content column to messages table  
ALTER TABLE public.messages ADD COLUMN redacted_content TEXT;
ALTER TABLE public.messages ADD COLUMN has_violations BOOLEAN DEFAULT false;