-- ========================================
-- BILLING & TRANSACTIONS SYSTEM
-- Creates tables for operator billing, transactions, and Stripe integration
-- ========================================

-- 1. Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES auth.users(id),
  deal_id UUID,
  booking_id UUID,
  type TEXT NOT NULL CHECK (type IN ('payment', 'payout', 'refund', 'chargeback', 'commission')),
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  stripe_charge_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create payouts table
CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  stripe_payout_id TEXT,
  arrival_date TIMESTAMPTZ,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create commission_rates table
CREATE TABLE IF NOT EXISTS commission_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL CHECK (service_type IN ('charter', 'hiring', 'sale')),
  rate_percentage NUMERIC(5,2) NOT NULL CHECK (rate_percentage >= 0 AND rate_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Add Stripe fields to profiles table
DO $$
BEGIN
  -- Add stripe_account_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='stripe_account_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_account_id TEXT;
  END IF;
  
  -- Add stripe_charges_enabled if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='stripe_charges_enabled') THEN
    ALTER TABLE profiles ADD COLUMN stripe_charges_enabled BOOLEAN DEFAULT false;
  END IF;
  
  -- Add stripe_payouts_enabled if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='stripe_payouts_enabled') THEN
    ALTER TABLE profiles ADD COLUMN stripe_payouts_enabled BOOLEAN DEFAULT false;
  END IF;
  
  -- Add stripe_details_submitted if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='stripe_details_submitted') THEN
    ALTER TABLE profiles ADD COLUMN stripe_details_submitted BOOLEAN DEFAULT false;
  END IF;
  
  -- Add payout_frequency if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='payout_frequency') THEN
    ALTER TABLE profiles ADD COLUMN payout_frequency TEXT DEFAULT 'weekly' CHECK (payout_frequency IN ('daily', 'weekly', 'monthly'));
  END IF;
  
  -- Add minimum_payout_amount if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='minimum_payout_amount') THEN
    ALTER TABLE profiles ADD COLUMN minimum_payout_amount INTEGER DEFAULT 10000; -- $100.00 in cents
  END IF;
END $$;

-- 5. Enable RLS on all tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for transactions
-- Operators can view their own transactions
CREATE POLICY "Operators can view own transactions" ON transactions FOR SELECT TO authenticated 
USING (operator_id = auth.uid());

-- Brokers can view transactions for their deals
CREATE POLICY "Brokers can view deal transactions" ON transactions FOR SELECT TO authenticated 
USING (broker_id = auth.uid());

-- Anyone can insert transactions (for system logging)
CREATE POLICY "Anyone can insert transactions" ON transactions FOR INSERT TO authenticated 
WITH CHECK (true);

-- Operators can update their own transactions
CREATE POLICY "Operators can update own transactions" ON transactions FOR UPDATE TO authenticated 
USING (operator_id = auth.uid());

-- 7. Create RLS policies for payouts
-- Operators can view their own payouts
CREATE POLICY "Operators can view own payouts" ON payouts FOR SELECT TO authenticated 
USING (operator_id = auth.uid());

-- Anyone can insert payouts (for system logging)
CREATE POLICY "Anyone can insert payouts" ON payouts FOR INSERT TO authenticated 
WITH CHECK (true);

-- Operators can update their own payouts
CREATE POLICY "Operators can update own payouts" ON payouts FOR UPDATE TO authenticated 
USING (operator_id = auth.uid());

-- 8. Create RLS policies for commission_rates
-- Anyone can view commission rates
CREATE POLICY "Anyone can view commission rates" ON commission_rates FOR SELECT TO authenticated 
USING (is_active = true);

-- 9. Insert default commission rates
INSERT INTO commission_rates (service_type, rate_percentage, description) VALUES
('charter', 7.00, 'Charter flight commission'),
('hiring', 10.00, 'Pilot/crew hiring commission'),
('sale', 3.00, 'Aircraft sale commission')
ON CONFLICT DO NOTHING;

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_operator_id ON transactions(operator_id);
CREATE INDEX IF NOT EXISTS idx_transactions_broker_id ON transactions(broker_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payment_intent_id ON transactions(stripe_payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_payouts_operator_id ON payouts(operator_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON payouts(created_at);
CREATE INDEX IF NOT EXISTS idx_payouts_stripe_payout_id ON payouts(stripe_payout_id);

CREATE INDEX IF NOT EXISTS idx_commission_rates_service_type ON commission_rates(service_type);
CREATE INDEX IF NOT EXISTS idx_commission_rates_is_active ON commission_rates(is_active);

-- 11. Create function to calculate commission
CREATE OR REPLACE FUNCTION calculate_commission(
  p_amount INTEGER,
  p_service_type TEXT
) RETURNS INTEGER AS $$
DECLARE
  commission_rate NUMERIC;
  commission_amount INTEGER;
BEGIN
  -- Get the current commission rate for the service type
  SELECT rate_percentage INTO commission_rate
  FROM commission_rates
  WHERE service_type = p_service_type
    AND is_active = true
    AND (effective_to IS NULL OR effective_to > NOW())
  ORDER BY effective_from DESC
  LIMIT 1;
  
  -- If no rate found, use default
  IF commission_rate IS NULL THEN
    commission_rate := 7.0; -- Default 7%
  END IF;
  
  -- Calculate commission amount
  commission_amount := ROUND(p_amount * commission_rate / 100);
  
  RETURN commission_amount;
END;
$$ LANGUAGE plpgsql;

-- 12. Create function to create transaction
CREATE OR REPLACE FUNCTION create_transaction(
  p_operator_id UUID,
  p_broker_id UUID,
  p_deal_id UUID,
  p_type TEXT,
  p_amount INTEGER,
  p_currency TEXT DEFAULT 'USD',
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  transaction_id UUID;
  commission_amount INTEGER;
BEGIN
  -- Create the transaction
  INSERT INTO transactions (
    operator_id,
    broker_id,
    deal_id,
    type,
    amount,
    currency,
    description,
    metadata
  ) VALUES (
    p_operator_id,
    p_broker_id,
    p_deal_id,
    p_type,
    p_amount,
    p_currency,
    p_description,
    p_metadata
  ) RETURNING id INTO transaction_id;
  
  -- If this is a payment, create a commission transaction
  IF p_type = 'payment' THEN
    commission_amount := calculate_commission(p_amount, 'charter');
    
    INSERT INTO transactions (
      operator_id,
      broker_id,
      deal_id,
      type,
      amount,
      currency,
      description,
      metadata
    ) VALUES (
      p_operator_id,
      p_broker_id,
      p_deal_id,
      'commission',
      commission_amount,
      p_currency,
      'Platform commission',
      jsonb_build_object('original_transaction_id', transaction_id)
    );
  END IF;
  
  RETURN transaction_id;
END;
$$ LANGUAGE plpgsql;

-- 13. Create function to update transaction status
CREATE OR REPLACE FUNCTION update_transaction_status(
  p_transaction_id UUID,
  p_status TEXT,
  p_stripe_payment_intent_id TEXT DEFAULT NULL,
  p_stripe_transfer_id TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  UPDATE transactions
  SET 
    status = p_status,
    stripe_payment_intent_id = COALESCE(p_stripe_payment_intent_id, stripe_payment_intent_id),
    stripe_transfer_id = COALESCE(p_stripe_transfer_id, stripe_transfer_id),
    completed_at = CASE WHEN p_status = 'completed' THEN NOW() ELSE completed_at END,
    updated_at = NOW()
  WHERE id = p_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- 14. Create function to get operator earnings summary
CREATE OR REPLACE FUNCTION get_operator_earnings_summary(
  p_operator_id UUID,
  p_start_date TIMESTAMPTZ DEFAULT NULL,
  p_end_date TIMESTAMPTZ DEFAULT NULL
) RETURNS TABLE (
  total_earnings INTEGER,
  total_commission INTEGER,
  net_earnings INTEGER,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'payout' AND status = 'completed' THEN amount ELSE 0 END), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN type = 'commission' AND status = 'completed' THEN amount ELSE 0 END), 0) as total_commission,
    COALESCE(SUM(CASE WHEN type = 'payout' AND status = 'completed' THEN amount 
                      WHEN type = 'commission' AND status = 'completed' THEN -amount 
                      ELSE 0 END), 0) as net_earnings,
    COUNT(*) as transaction_count
  FROM transactions
  WHERE operator_id = p_operator_id
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date);
END;
$$ LANGUAGE plpgsql;

-- 15. Grant permissions
GRANT SELECT, INSERT, UPDATE ON transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON payouts TO authenticated;
GRANT SELECT ON commission_rates TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_commission TO authenticated;
GRANT EXECUTE ON FUNCTION create_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION update_transaction_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_operator_earnings_summary TO authenticated;

-- 16. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at 
    BEFORE UPDATE ON payouts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- BILLING & TRANSACTIONS SYSTEM READY
-- ========================================
