-- Fix database constraint issues and optimize for better performance
-- Note: Not using CONCURRENTLY since we're in a transaction block

-- First, let's check if profiles table exists and fix the role constraint
DO $$
BEGIN
  -- Check if profiles table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'profiles_role_check') THEN
      ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
    END IF;
    
    -- Add updated constraint that allows all the roles we use
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'broker', 'operator', 'pilot', 'crew'));
  END IF;
END $$;

-- Ensure user_profiles table has proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Add indexes on commonly queried fields for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_departure_date ON marketplace_listings(departure_date);

CREATE INDEX IF NOT EXISTS idx_crew_profiles_availability ON crew_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_crew_profiles_user_id ON crew_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_operator_id ON deals(operator_id);
CREATE INDEX IF NOT EXISTS idx_deals_broker_id ON deals(broker_id);

-- Optimize messages table for better performance
CREATE INDEX IF NOT EXISTS idx_messages_deal_id ON messages(deal_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Add function to clean up old data periodically (for performance)
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clean up old security events (older than 90 days)
  DELETE FROM security_events WHERE created_at < now() - interval '90 days';
  
  -- Clean up expired AI warnings
  DELETE FROM ai_warnings WHERE expires_at < now() AND acknowledged = true;
  
  -- Clean up old audit logs (older than 1 year)
  DELETE FROM audit_logs WHERE created_at < now() - interval '1 year';
END;
$$;