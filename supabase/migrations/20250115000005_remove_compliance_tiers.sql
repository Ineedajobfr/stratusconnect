-- Remove Compliance Tier Fields
-- FCA Compliant Aviation Platform

-- Remove compliance tier fields from deals table if they exist
ALTER TABLE public.deals 
  DROP COLUMN IF EXISTS compliance_level,
  DROP COLUMN IF EXISTS compliance_fee_bp,
  DROP COLUMN IF EXISTS compliance_fee_amount,
  DROP COLUMN IF EXISTS compliance_package,
  DROP COLUMN IF EXISTS compliance_options;

-- Remove compliance tier fields from transactions table if they exist
ALTER TABLE public.transactions
  DROP COLUMN IF EXISTS compliance_level,
  DROP COLUMN IF EXISTS compliance_fee_bp,
  DROP COLUMN IF EXISTS compliance_fee_amount,
  DROP COLUMN IF EXISTS compliance_package;

-- Remove compliance tier fields from quotes table if they exist
ALTER TABLE public.quotes
  DROP COLUMN IF EXISTS compliance_level,
  DROP COLUMN IF EXISTS compliance_fee_bp,
  DROP COLUMN IF EXISTS compliance_fee_amount,
  DROP COLUMN IF EXISTS compliance_package;

-- Remove compliance tier fields from payments table if they exist
ALTER TABLE public.payments
  DROP COLUMN IF EXISTS compliance_level,
  DROP COLUMN IF EXISTS compliance_fee_bp,
  DROP COLUMN IF EXISTS compliance_fee_amount,
  DROP COLUMN IF EXISTS compliance_package;

-- Remove compliance tier fields from invoices table if they exist
ALTER TABLE public.invoices
  DROP COLUMN IF EXISTS compliance_level,
  DROP COLUMN IF EXISTS compliance_fee_bp,
  DROP COLUMN IF EXISTS compliance_fee_amount,
  DROP COLUMN IF EXISTS compliance_package;

-- Remove compliance tier fields from receipts table if they exist
ALTER TABLE public.receipts
  DROP COLUMN IF EXISTS compliance_level,
  DROP COLUMN IF EXISTS compliance_fee_bp,
  DROP COLUMN IF EXISTS compliance_fee_amount,
  DROP COLUMN IF EXISTS compliance_package;

-- Remove any compliance tier enum types if they exist
DROP TYPE IF EXISTS compliance_level;
DROP TYPE IF EXISTS compliance_package;
DROP TYPE IF EXISTS compliance_option;

-- Add comment to confirm compliance is universal
COMMENT ON TABLE public.deals IS 'All deals include universal compliance: deposit-before-contact, signed quotes, immutable receipts, evidence bundles';
COMMENT ON TABLE public.transactions IS 'All transactions include universal compliance features';
COMMENT ON TABLE public.quotes IS 'All quotes include universal compliance features';
COMMENT ON TABLE public.payments IS 'All payments include universal compliance features';
COMMENT ON TABLE public.invoices IS 'All invoices include universal compliance features';
COMMENT ON TABLE public.receipts IS 'All receipts include universal compliance features';

