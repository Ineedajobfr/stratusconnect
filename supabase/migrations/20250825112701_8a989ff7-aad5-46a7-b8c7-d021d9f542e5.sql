-- Phase 3: Financial Management Tables
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL,
  contract_template TEXT NOT NULL,
  contract_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL,
  signed_by_operator UUID,
  signed_by_broker UUID,
  operator_signature_date TIMESTAMP WITH TIME ZONE,
  broker_signature_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing schedules table
CREATE TABLE public.billing_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL,
  billing_type TEXT NOT NULL DEFAULT 'milestone',
  schedule_data JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create escrow accounts table
CREATE TABLE public.escrow_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL,
  account_id TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phase 4: Advanced Analytics Tables
CREATE TABLE public.market_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route TEXT NOT NULL,
  aircraft_type TEXT NOT NULL,
  trend_data JSONB NOT NULL,
  confidence_score NUMERIC,
  forecast_period TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.api_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_name TEXT NOT NULL,
  api_endpoint TEXT NOT NULL,
  api_key_encrypted TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency TEXT DEFAULT 'hourly',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contracts
CREATE POLICY "Deal participants can view contracts" 
ON public.contracts 
FOR SELECT 
USING (((select auth.uid()) IN ( SELECT deals.operator_id FROM deals WHERE deals.id = contracts.deal_id)) OR 
       ((select auth.uid()) IN ( SELECT deals.broker_id FROM deals WHERE deals.id = contracts.deal_id)));

CREATE POLICY "Deal participants can create contracts" 
ON public.contracts 
FOR INSERT 
WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Deal participants can update contracts" 
ON public.contracts 
FOR UPDATE 
USING (((select auth.uid()) IN ( SELECT deals.operator_id FROM deals WHERE deals.id = contracts.deal_id)) OR 
       ((select auth.uid()) IN ( SELECT deals.broker_id FROM deals WHERE deals.id = contracts.deal_id)));

-- RLS Policies for billing schedules
CREATE POLICY "Deal participants can manage billing schedules" 
ON public.billing_schedules 
FOR ALL 
USING (((select auth.uid()) IN ( SELECT deals.operator_id FROM deals WHERE deals.id = billing_schedules.deal_id)) OR 
       ((select auth.uid()) IN ( SELECT deals.broker_id FROM deals WHERE deals.id = billing_schedules.deal_id)));

-- RLS Policies for escrow accounts
CREATE POLICY "Deal participants can view escrow accounts" 
ON public.escrow_accounts 
FOR SELECT 
USING (((select auth.uid()) IN ( SELECT deals.operator_id FROM deals WHERE deals.id = escrow_accounts.deal_id)) OR 
       ((select auth.uid()) IN ( SELECT deals.broker_id FROM deals WHERE deals.id = escrow_accounts.deal_id)));

-- RLS Policies for market trends
CREATE POLICY "Everyone can view market trends" 
ON public.market_trends 
FOR SELECT 
USING (true);

-- RLS Policies for API integrations (admin only - using system)
CREATE POLICY "System can manage API integrations" 
ON public.api_integrations 
FOR ALL 
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_schedules_updated_at
BEFORE UPDATE ON public.billing_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_escrow_accounts_updated_at
BEFORE UPDATE ON public.escrow_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_integrations_updated_at
BEFORE UPDATE ON public.api_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();