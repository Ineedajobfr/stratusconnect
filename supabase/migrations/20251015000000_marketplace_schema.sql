-- ========================================
-- STRATUSCONNECT MARKETPLACE SCHEMA
-- Adds marketplace functionality to existing schema
-- No duplicates - extends existing tables
-- ========================================

-- Add marketplace columns to existing aircraft table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='aircraft' AND column_name='operator_id') THEN
    ALTER TABLE aircraft ADD COLUMN operator_id UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='aircraft' AND column_name='category') THEN
    ALTER TABLE aircraft ADD COLUMN category TEXT; -- 'heavy','medium','light','turboprop','helicopter'
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='aircraft' AND column_name='base_airport') THEN
    ALTER TABLE aircraft ADD COLUMN base_airport TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='aircraft' AND column_name='availability') THEN
    ALTER TABLE aircraft ADD COLUMN availability JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Enhance marketplace_listings table (already exists, just add missing columns)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='title') THEN
    ALTER TABLE marketplace_listings ADD COLUMN title TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='description') THEN
    ALTER TABLE marketplace_listings ADD COLUMN description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='listing_type') THEN
    ALTER TABLE marketplace_listings ADD COLUMN listing_type TEXT CHECK (listing_type IN ('sale','charter','empty_leg'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='price') THEN
    ALTER TABLE marketplace_listings ADD COLUMN price NUMERIC;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='currency') THEN
    ALTER TABLE marketplace_listings ADD COLUMN currency TEXT DEFAULT 'USD';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='operator_id') THEN
    ALTER TABLE marketplace_listings ADD COLUMN operator_id UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='departure_airport') THEN
    ALTER TABLE marketplace_listings ADD COLUMN departure_airport TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='destination_airport') THEN
    ALTER TABLE marketplace_listings ADD COLUMN destination_airport TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='dep_time') THEN
    ALTER TABLE marketplace_listings ADD COLUMN dep_time TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='arr_time') THEN
    ALTER TABLE marketplace_listings ADD COLUMN arr_time TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='seats') THEN
    ALTER TABLE marketplace_listings ADD COLUMN seats INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='active') THEN
    ALTER TABLE marketplace_listings ADD COLUMN active BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='marketplace_listings' AND column_name='metadata') THEN
    ALTER TABLE marketplace_listings ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create trip_requests table (broker RFQs)
CREATE TABLE IF NOT EXISTS trip_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES auth.users(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  dep_time TIMESTAMPTZ NOT NULL,
  pax INTEGER NOT NULL,
  preferred_category TEXT,
  max_budget NUMERIC,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','fulfilled','cancelled')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_reputation table (ratings/reviews)
CREATE TABLE IF NOT EXISTS user_reputation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rated_by UUID REFERENCES auth.users(id),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  transaction_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create security_events table (audit trail)
CREATE TABLE IF NOT EXISTS security_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add reputation_score column to profiles/users tables
DO $$
BEGIN
  -- Check if users table exists and add reputation_score
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='users') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='reputation_score') THEN
      ALTER TABLE users ADD COLUMN reputation_score NUMERIC DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='verified') THEN
      ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
    END IF;
  END IF;
  
  -- Check if profiles table exists and add reputation_score
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='profiles') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='reputation_score') THEN
      ALTER TABLE profiles ADD COLUMN reputation_score NUMERIC DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='verified') THEN
      ALTER TABLE profiles ADD COLUMN verified BOOLEAN DEFAULT false;
    END IF;
  END IF;
END $$;

-- Create user_trust VIEW for marketplace ranking
-- Combines reputation score, verification status, and activity
CREATE OR REPLACE VIEW user_trust AS
SELECT
  COALESCE(u.id, p.id) AS user_id,
  COALESCE(u.reputation_score, p.reputation_score, 0) AS reputation_score,
  COALESCE(u.verified, p.verified, false) AS verified,
  COALESCE(a.activity_count, 0) AS activity_count,
  (
    COALESCE(u.reputation_score, p.reputation_score, 0) * 0.6 +
    (CASE WHEN COALESCE(u.verified, p.verified, false) THEN 20 ELSE 0 END) +
    COALESCE(a.activity_count, 0) * 0.2
  ) AS trust_score
FROM (
  -- Combine users from both users and profiles tables
  SELECT id, reputation_score, verified FROM users
  UNION
  SELECT id, reputation_score, verified FROM profiles
) AS combined_users
LEFT JOIN users u ON u.id = combined_users.id
LEFT JOIN profiles p ON p.id = combined_users.id
LEFT JOIN (
  SELECT actor_id, COUNT(*)::numeric as activity_count
  FROM (
    SELECT operator_id AS actor_id FROM marketplace_listings WHERE operator_id IS NOT NULL
    UNION ALL
    SELECT broker_id AS actor_id FROM trip_requests WHERE broker_id IS NOT NULL
  ) t
  GROUP BY actor_id
) a ON a.actor_id = combined_users.id;

-- Trigger to update reputation_score when new rating is added
CREATE OR REPLACE FUNCTION update_reputation_score()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Update users table if exists
  UPDATE users
  SET reputation_score = (
    SELECT COALESCE(AVG(rating)::numeric, 0) 
    FROM user_reputation 
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  
  -- Update profiles table if exists
  UPDATE profiles
  SET reputation_score = (
    SELECT COALESCE(AVG(rating)::numeric, 0) 
    FROM user_reputation 
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger if not exists
DROP TRIGGER IF EXISTS trg_update_reputation ON user_reputation;
CREATE TRIGGER trg_update_reputation
AFTER INSERT OR UPDATE ON user_reputation
FOR EACH ROW EXECUTE PROCEDURE update_reputation_score();

-- Enable RLS on new tables
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trip_requests
CREATE POLICY "Users can view all open trip requests"
ON trip_requests FOR SELECT
TO authenticated
USING (status = 'open' OR broker_id = auth.uid());

CREATE POLICY "Brokers can create trip requests"
ON trip_requests FOR INSERT
TO authenticated
WITH CHECK (broker_id = auth.uid());

CREATE POLICY "Brokers can update own trip requests"
ON trip_requests FOR UPDATE
TO authenticated
USING (broker_id = auth.uid());

-- RLS Policies for user_reputation
CREATE POLICY "Users can view all ratings"
ON user_reputation FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create ratings for completed transactions"
ON user_reputation FOR INSERT
TO authenticated
WITH CHECK (rated_by = auth.uid());

-- RLS Policies for security_events
CREATE POLICY "Users can view own security events"
ON security_events FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System can insert security events"
ON security_events FOR INSERT
TO authenticated
WITH CHECK (true);

-- Enhance marketplace_listings RLS if not exists
DO $$
BEGIN
  -- Drop existing policies if they exist to avoid conflicts
  DROP POLICY IF EXISTS "Operators can create listings" ON marketplace_listings;
  DROP POLICY IF EXISTS "Everyone can view active listings" ON marketplace_listings;
  DROP POLICY IF EXISTS "Operators can update own listings" ON marketplace_listings;
  DROP POLICY IF EXISTS "Operators can delete own listings" ON marketplace_listings;
END $$;

-- Create new RLS policies for marketplace_listings
CREATE POLICY "Operators can create listings"
ON marketplace_listings FOR INSERT
TO authenticated
WITH CHECK (operator_id = auth.uid());

CREATE POLICY "Everyone can view active listings"
ON marketplace_listings FOR SELECT
TO authenticated
USING (active = true OR operator_id = auth.uid());

CREATE POLICY "Operators can update own listings"
ON marketplace_listings FOR UPDATE
TO authenticated
USING (operator_id = auth.uid());

CREATE POLICY "Operators can delete own listings"
ON marketplace_listings FOR DELETE
TO authenticated
USING (operator_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_active ON marketplace_listings(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_type ON marketplace_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_departure ON marketplace_listings(departure_airport);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_operator ON marketplace_listings(operator_id);
CREATE INDEX IF NOT EXISTS idx_trip_requests_status ON trip_requests(status);
CREATE INDEX IF NOT EXISTS idx_trip_requests_broker ON trip_requests(broker_id);
CREATE INDEX IF NOT EXISTS idx_user_reputation_user ON user_reputation(user_id);

-- Grant necessary permissions
GRANT SELECT ON user_trust TO authenticated;
GRANT ALL ON trip_requests TO authenticated;
GRANT ALL ON user_reputation TO authenticated;
GRANT ALL ON security_events TO authenticated;
GRANT ALL ON marketplace_listings TO authenticated;

