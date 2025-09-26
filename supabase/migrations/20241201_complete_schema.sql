-- ========================================
-- STRATUSCONNECT COMPLETE DATABASE SCHEMA
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- CORE USER MANAGEMENT
-- ========================================

-- User profiles with role-based access
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('broker', 'operator', 'pilot', 'crew', 'admin')),
  company_name TEXT,
  company_type TEXT CHECK (company_type IN ('individual', 'brokerage', 'operator', 'charter_company')),
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_level INTEGER DEFAULT 0 CHECK (verification_level >= 0 AND verification_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  email_digest_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- NOTIFICATIONS SYSTEM
-- ========================================

-- Notifications table - one place for every alert
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('rfq_sent', 'quote_received', 'quote_accepted', 'funds_held', 'funds_released', 'expiring_documents', 'task_due', 'verification_required')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('rfq', 'quote', 'deal', 'task', 'verification', 'document')),
  entity_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  channel_pref_json JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb
);

-- ========================================
-- TASK INBOX SYSTEM
-- ========================================

-- Task inbox - your day in one list
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_at TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  entity_type TEXT CHECK (entity_type IN ('rfq', 'quote', 'deal', 'verification', 'document')),
  entity_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'snoozed')),
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_json JSONB DEFAULT '{}'::jsonb
);

-- ========================================
-- RFQ AND QUOTE FLOW
-- ========================================

-- RFQ states: draft → sent → quoting → decision → booked → flown → reconciled
CREATE TABLE rfqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'quoting', 'decision', 'booked', 'flown', 'reconciled')),
  legs_json JSONB NOT NULL, -- Array of flight legs with origin, destination, dates, times
  pax_count INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RFQ recipients - who can see and quote on this RFQ
CREATE TABLE rfq_recipients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes from operators
CREATE TABLE quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  aircraft_id UUID, -- Will reference aircraft table when created
  price_total DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  terms TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CONTRACTS AND DOCUMENTS
-- ========================================

-- Document templates and generated documents
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id UUID, -- Will reference deals table when created
  type TEXT NOT NULL CHECK (type IN ('loi', 'charter_agreement', 'itinerary', 'passenger_manifest', 'receipt', 'contract')),
  version INTEGER DEFAULT 1,
  file_url TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  signed_at TIMESTAMP WITH TIME ZONE,
  sha256 TEXT, -- For integrity verification
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ESCROW FUNDS FLOW
-- ========================================

-- Wallet accounts for users and operators
CREATE TABLE wallet_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider_ref TEXT NOT NULL, -- Stripe account reference
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals created when quotes are accepted
CREATE TABLE deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'funds_held', 'in_dispute', 'released', 'refunded', 'chargeback')),
  fee_bps INTEGER DEFAULT 250, -- 2.5% fee in basis points
  total_amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Escrow ledger for all financial transactions
CREATE TABLE escrow_ledger (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('payment_intent', 'funds_held', 'release_to_operator', 'payout_fee', 'refund', 'chargeback')),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  provider_tx TEXT, -- Stripe transaction reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- ========================================
-- VERIFICATION AND TRUST
-- ========================================

-- Verification records for individuals and companies
CREATE TABLE verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('individual', 'company')),
  subject_id UUID NOT NULL, -- References profiles.id
  check_type TEXT NOT NULL CHECK (check_type IN ('id', 'liveness', 'sanction', 'licence', 'medical', 'ratings', 'company_registry', 'insurance', 'aoc', 'part_135')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  evidence_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- AIRCRAFT AND OPERATIONS
-- ========================================

-- Aircraft registry
CREATE TABLE aircraft (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  operator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registration TEXT UNIQUE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  max_pax INTEGER,
  range_nm INTEGER,
  runway_min_ft INTEGER,
  hourly_rate DECIMAL(10,2),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pilot and crew profiles
CREATE TABLE crew_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  licence_number TEXT,
  ratings JSONB, -- Array of ratings and endorsements
  medical_expiry DATE,
  total_hours INTEGER DEFAULT 0,
  availability_calendar JSONB, -- Availability schedule
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING ((select auth.uid()) = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING ((select auth.uid()) = id);

CREATE POLICY "Users can view own preferences" ON user_preferences FOR ALL USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR ALL USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view own tasks" ON tasks FOR ALL USING ((select auth.uid()) = user_id OR (select auth.uid()) = assigned_to);

CREATE POLICY "Brokers can view own RFQs" ON rfqs FOR ALL USING ((select auth.uid()) = broker_id);
CREATE POLICY "Operators can view RFQs they're invited to" ON rfqs FOR SELECT USING (
  EXISTS (SELECT 1 FROM rfq_recipients WHERE rfq_id = rfqs.id AND operator_id = (select auth.uid()))
);

CREATE POLICY "Users can view relevant quotes" ON quotes FOR ALL USING (
  (select auth.uid()) = operator_id OR 
  EXISTS (SELECT 1 FROM rfqs WHERE id = quotes.rfq_id AND broker_id = (select auth.uid()))
);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification when RFQ is sent
CREATE OR REPLACE FUNCTION create_rfq_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sent' AND OLD.status = 'draft' THEN
    INSERT INTO notifications (user_id, type, entity_type, entity_id, title, body, link)
    SELECT 
      operator_id,
      'rfq_sent',
      'rfq',
      NEW.id,
      'New RFQ Available',
      'A new trip request has been sent to you',
      '/terminal/operator/rfqs/' || NEW.id
    FROM rfq_recipients 
    WHERE rfq_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER rfq_sent_notification AFTER UPDATE ON rfqs FOR EACH ROW EXECUTE FUNCTION create_rfq_notification();

-- Function to create notification when quote is received
CREATE OR REPLACE FUNCTION create_quote_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, entity_type, entity_id, title, body, link)
  SELECT 
    broker_id,
    'quote_received',
    'quote',
    NEW.id,
    'New Quote Received',
    'You have received a new quote for your trip request',
    '/terminal/broker/quotes/' || NEW.id
  FROM rfqs 
  WHERE id = NEW.rfq_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER quote_received_notification AFTER INSERT ON quotes FOR EACH ROW EXECUTE FUNCTION create_quote_notification();

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_at ON tasks(due_at);
CREATE INDEX idx_rfqs_broker_id ON rfqs(broker_id);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_quotes_rfq_id ON quotes(rfq_id);
CREATE INDEX idx_quotes_operator_id ON quotes(operator_id);
CREATE INDEX idx_deals_broker_id ON deals(broker_id);
CREATE INDEX idx_deals_operator_id ON deals(operator_id);
CREATE INDEX idx_verifications_subject_id ON verifications(subject_id);
CREATE INDEX idx_aircraft_operator_id ON aircraft(operator_id);
