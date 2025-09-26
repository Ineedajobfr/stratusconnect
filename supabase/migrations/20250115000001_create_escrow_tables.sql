-- Create escrow management tables for regulated payment processing
-- Supports FCA and EU regulated escrow providers

-- Escrow intents table
CREATE TABLE IF NOT EXISTS public.escrow_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL,
  provider_intent_id text NOT NULL,
  provider text NOT NULL CHECK (provider IN ('shieldpay', 'mangopay', 'lemonway')),
  amount decimal(15,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL CHECK (currency IN ('GBP', 'EUR', 'USD')),
  buyer_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'funded', 'released', 'refunded', 'disputed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  released_at timestamptz,
  refunded_at timestamptz,
  dispute_created_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(provider, provider_intent_id)
);

-- Escrow releases table for tracking partial releases
CREATE TABLE IF NOT EXISTS public.escrow_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id uuid NOT NULL REFERENCES public.escrow_intents(id) ON DELETE CASCADE,
  amount decimal(15,2) NOT NULL CHECK (amount > 0),
  reason text NOT NULL,
  released_by uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  released_at timestamptz DEFAULT now(),
  provider_release_id text,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Payment receipts table for audit trail
CREATE TABLE IF NOT EXISTS public.payment_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id uuid NOT NULL REFERENCES public.escrow_intents(id) ON DELETE CASCADE,
  transaction_id text NOT NULL,
  receipt_type text NOT NULL CHECK (receipt_type IN ('funding', 'release', 'refund')),
  amount decimal(15,2) NOT NULL,
  currency text NOT NULL,
  pdf_url text NOT NULL,
  audit_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Webhook events table for tracking payment provider webhooks
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_type text NOT NULL,
  intent_id uuid REFERENCES public.escrow_intents(id) ON DELETE SET NULL,
  payload jsonb NOT NULL,
  signature text NOT NULL,
  processed boolean DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  error_message text
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_escrow_intents_deal_id ON public.escrow_intents(deal_id);
CREATE INDEX IF NOT EXISTS idx_escrow_intents_buyer_id ON public.escrow_intents(buyer_id);
CREATE INDEX IF NOT EXISTS idx_escrow_intents_seller_id ON public.escrow_intents(seller_id);
CREATE INDEX IF NOT EXISTS idx_escrow_intents_status ON public.escrow_intents(status);
CREATE INDEX IF NOT EXISTS idx_escrow_intents_created_at ON public.escrow_intents(created_at);
CREATE INDEX IF NOT EXISTS idx_escrow_releases_intent_id ON public.escrow_releases(intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_intent_id ON public.payment_receipts(intent_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed);

-- Row Level Security policies
ALTER TABLE public.escrow_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Escrow intents policies
CREATE POLICY "Users can view their own escrow intents" ON public.escrow_intents
  FOR SELECT USING (
    (select auth.uid()) = buyer_id OR 
    (select auth.uid()) = seller_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Users can create escrow intents" ON public.escrow_intents
  FOR INSERT WITH CHECK (
    (select auth.uid()) = buyer_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = (select auth.uid()) AND role IN ('admin', 'broker')
    )
  );

CREATE POLICY "Users can update their own escrow intents" ON public.escrow_intents
  FOR UPDATE USING (
    (select auth.uid()) = buyer_id OR 
    (select auth.uid()) = seller_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Escrow releases policies
CREATE POLICY "Users can view releases for their intents" ON public.escrow_releases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.escrow_intents 
      WHERE id = intent_id AND (
        buyer_id = (select auth.uid()) OR 
        seller_id = (select auth.uid())
      )
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Users can create releases for their intents" ON public.escrow_releases
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.escrow_intents 
      WHERE id = intent_id AND (
        buyer_id = (select auth.uid()) OR 
        seller_id = (select auth.uid())
      )
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Payment receipts policies
CREATE POLICY "Users can view receipts for their intents" ON public.payment_receipts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.escrow_intents 
      WHERE id = intent_id AND (
        buyer_id = (select auth.uid()) OR 
        seller_id = (select auth.uid())
      )
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Webhook events policies (admin only)
CREATE POLICY "Only admins can view webhook events" ON public.webhook_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Functions for escrow management
CREATE OR REPLACE FUNCTION public.create_escrow_intent(
  p_deal_id uuid,
  p_provider text,
  p_provider_intent_id text,
  p_amount decimal,
  p_currency text,
  p_buyer_id uuid,
  p_seller_id uuid,
  p_description text
) RETURNS uuid AS $$
DECLARE
  v_intent_id uuid;
BEGIN
  INSERT INTO public.escrow_intents (
    deal_id,
    provider,
    provider_intent_id,
    amount,
    currency,
    buyer_id,
    seller_id,
    description,
    status
  ) VALUES (
    p_deal_id,
    p_provider,
    p_provider_intent_id,
    p_amount,
    p_currency,
    p_buyer_id,
    p_seller_id,
    p_description,
    'pending'
  ) RETURNING id INTO v_intent_id;
  
  RETURN v_intent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update escrow status
CREATE OR REPLACE FUNCTION public.update_escrow_status(
  p_intent_id uuid,
  p_status text,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS void AS $$
BEGIN
  UPDATE public.escrow_intents 
  SET 
    status = p_status,
    updated_at = now(),
    metadata = metadata || p_metadata
  WHERE id = p_intent_id;
  
  -- Set specific timestamps based on status
  CASE p_status
    WHEN 'released' THEN
      UPDATE public.escrow_intents 
      SET released_at = now() 
      WHERE id = p_intent_id;
    WHEN 'refunded' THEN
      UPDATE public.escrow_intents 
      SET refunded_at = now() 
      WHERE id = p_intent_id;
    WHEN 'disputed' THEN
      UPDATE public.escrow_intents 
      SET dispute_created_at = now() 
      WHERE id = p_intent_id;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create payment receipt
CREATE OR REPLACE FUNCTION public.create_payment_receipt(
  p_intent_id uuid,
  p_transaction_id text,
  p_receipt_type text,
  p_amount decimal,
  p_currency text,
  p_pdf_url text,
  p_audit_hash text,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid AS $$
DECLARE
  v_receipt_id uuid;
BEGIN
  INSERT INTO public.payment_receipts (
    intent_id,
    transaction_id,
    receipt_type,
    amount,
    currency,
    pdf_url,
    audit_hash,
    metadata
  ) VALUES (
    p_intent_id,
    p_transaction_id,
    p_receipt_type,
    p_amount,
    p_currency,
    p_pdf_url,
    p_audit_hash,
    p_metadata
  ) RETURNING id INTO v_receipt_id;
  
  RETURN v_receipt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON TABLE public.escrow_intents IS 'Escrow intents for regulated payment processing';
COMMENT ON TABLE public.escrow_releases IS 'Partial releases of escrow funds';
COMMENT ON TABLE public.payment_receipts IS 'Payment receipts and audit trail';
COMMENT ON TABLE public.webhook_events IS 'Payment provider webhook events';

-- Add constraints
ALTER TABLE public.escrow_intents 
ADD CONSTRAINT chk_escrow_amount_positive CHECK (amount > 0);

ALTER TABLE public.escrow_releases 
ADD CONSTRAINT chk_release_amount_positive CHECK (amount > 0);

ALTER TABLE public.payment_receipts 
ADD CONSTRAINT chk_receipt_amount_positive CHECK (amount > 0);
