-- Create deposit_payments table for tracking contact reveal deposits
CREATE TABLE IF NOT EXISTS deposit_payments (
  id TEXT PRIMARY KEY, -- Stripe payment intent ID
  deal_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  platform_fee INTEGER NOT NULL, -- Platform fee in cents
  net_amount INTEGER NOT NULL, -- Net amount after fees in cents
  status TEXT NOT NULL DEFAULT 'requires_payment_method',
  audit_hash TEXT NOT NULL, -- SHA256 hash for audit trail
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_deposit_payments_deal_id ON deposit_payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_deposit_payments_user_id ON deposit_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_payments_status ON deposit_payments(status);
CREATE INDEX IF NOT EXISTS idx_deposit_payments_created_at ON deposit_payments(created_at);

-- Enable RLS
ALTER TABLE deposit_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own deposit payments
CREATE POLICY "Users can view their own deposit payments" ON deposit_payments
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own deposit payments
CREATE POLICY "Users can insert their own deposit payments" ON deposit_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own deposit payments
CREATE POLICY "Users can update their own deposit payments" ON deposit_payments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Admins can view all deposit payments
CREATE POLICY "Admins can view all deposit payments" ON deposit_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deposit_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_deposit_payments_updated_at
  BEFORE UPDATE ON deposit_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_deposit_payments_updated_at();

-- Add comment for documentation
COMMENT ON TABLE deposit_payments IS 'Tracks deposit payments required to reveal contact information before deal completion';
COMMENT ON COLUMN deposit_payments.audit_hash IS 'SHA256 hash of payment data for audit trail integrity';
COMMENT ON COLUMN deposit_payments.status IS 'Stripe payment intent status: requires_payment_method, requires_confirmation, requires_action, processing, requires_capture, canceled, succeeded';
