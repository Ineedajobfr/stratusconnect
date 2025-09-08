-- Comprehensive Aviation Platform Schema Migration
-- Implements the full StratusConnect database schema as per blueprint

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create companies table (multi-tenant foundation)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('broker', 'operator', 'admin')),
    industry_ids TEXT[],
    approved BOOLEAN DEFAULT false,
    aoc_number TEXT,
    aoc_expiry DATE,
    insurance_expiry DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roles reference table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('broker', 'Aircraft charter broker', '{"can_create_requests": true, "can_accept_quotes": true, "can_view_own_requests": true}'),
('operator', 'Aircraft operator/owner', '{"can_submit_quotes": true, "can_manage_fleet": true, "can_assign_crew": true}'),
('pilot', 'Aircraft pilot', '{"can_update_flight_status": true, "can_view_assignments": true}'),
('crew', 'Flight crew member', '{"can_view_assignments": true, "can_update_availability": true}'),
('admin', 'Platform administrator', '{"can_view_all": true, "can_manage_users": true, "can_override": true}')
ON CONFLICT (name) DO NOTHING;

-- Update users table to include company_id and role
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT REFERENCES roles(name);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create requests table (charter flight requests)
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_company_id UUID NOT NULL REFERENCES companies(id),
    created_by UUID NOT NULL REFERENCES users(id),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ,
    passenger_count INTEGER NOT NULL DEFAULT 1,
    aircraft_preferences JSONB DEFAULT '{}',
    notes TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'quoted', 'accepted', 'cancelled', 'expired')),
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    operator_company_id UUID NOT NULL REFERENCES companies(id),
    created_by UUID NOT NULL REFERENCES users(id),
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    aircraft_id UUID,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES requests(id),
    quote_id UUID NOT NULL REFERENCES quotes(id),
    broker_company_id UUID NOT NULL REFERENCES companies(id),
    operator_company_id UUID NOT NULL REFERENCES companies(id),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')),
    contract_signed BOOLEAN DEFAULT false,
    total_price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'escrowed', 'released', 'refunded')),
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create flights table
CREATE TABLE IF NOT EXISTS flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    departure_datetime TIMESTAMPTZ NOT NULL,
    arrival_datetime TIMESTAMPTZ NOT NULL,
    aircraft_id UUID,
    pilot_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'boarding', 'departed', 'in_flight', 'landed', 'delayed', 'cancelled')),
    actual_departure_time TIMESTAMPTZ,
    actual_arrival_time TIMESTAMPTZ,
    delay_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crew_assignments table
CREATE TABLE IF NOT EXISTS crew_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role TEXT NOT NULL CHECK (role IN ('Captain', 'First Officer', 'Flight Attendant', 'Engineer', 'Purser')),
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'declined', 'replaced')),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create aircraft table
CREATE TABLE IF NOT EXISTS aircraft (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_company_id UUID NOT NULL REFERENCES companies(id),
    tail_number TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('light_jet', 'midsize_jet', 'heavy_jet', 'turboprop', 'helicopter')),
    seats INTEGER NOT NULL,
    range_nm INTEGER,
    year INTEGER,
    aoc_expiry DATE,
    photo_url TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'grounded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(operator_company_id, tail_number)
);

-- Create maintenance table
CREATE TABLE IF NOT EXISTS maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_id UUID NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('100_hour', 'annual', 'inspection', 'repair', 'other')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'overdue')),
    notes TEXT,
    file_url TEXT,
    next_due DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crew_profiles table
CREATE TABLE IF NOT EXISTS crew_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    licence_number TEXT,
    licence_expiry DATE,
    ratings TEXT[],
    hours_flown INTEGER DEFAULT 0,
    passport_number TEXT,
    passport_expiry DATE,
    medical_certificate_expiry DATE,
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
    base_airport TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_type TEXT NOT NULL CHECK (owner_type IN ('user', 'company', 'booking', 'aircraft')),
    owner_id UUID NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pilot_license', 'medical_cert', 'insurance_cert', 'aoc_cert', 'contract', 'passport', 'other')),
    file_path TEXT NOT NULL,
    file_url TEXT,
    expiry_date DATE,
    verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sanctions table
CREATE TABLE IF NOT EXISTS sanctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    list_name TEXT NOT NULL,
    matched_name TEXT NOT NULL,
    date_checked TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('clear', 'flagged', 'under_review')),
    notes TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    request_id UUID REFERENCES requests(id),
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
    file_url TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type TEXT NOT NULL CHECK (type IN ('quote_submitted', 'quote_accepted', 'flight_delay', 'admin_alert', 'crew_assigned', 'booking_created', 'payment_required')),
    related_id UUID,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    date DATE NOT NULL,
    requests_posted INTEGER DEFAULT 0,
    quotes_submitted INTEGER DEFAULT 0,
    bookings_completed INTEGER DEFAULT 0,
    avg_response_time_minutes DECIMAL(10,2),
    win_rate DECIMAL(5,2),
    revenue DECIMAL(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    action_type TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT
);

-- Create performance table
CREATE TABLE IF NOT EXISTS performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    operator_response_time_minutes INTEGER,
    on_time_performance BOOLEAN,
    sla_breaches INTEGER DEFAULT 0,
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crew_requests table (for hiring)
CREATE TABLE IF NOT EXISTS crew_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operator_company_id UUID NOT NULL REFERENCES companies(id),
    created_by UUID NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    required_role TEXT NOT NULL,
    required_ratings TEXT[],
    start_date DATE,
    end_date DATE,
    location TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crew_applications table
CREATE TABLE IF NOT EXISTS crew_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_request_id UUID NOT NULL REFERENCES crew_requests(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    message TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_requests_broker_company ON requests(broker_company_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_departure_date ON requests(departure_date);
CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_operator_company ON quotes(operator_company_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_bookings_broker_company ON bookings(broker_company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_operator_company ON bookings(operator_company_id);
CREATE INDEX IF NOT EXISTS idx_flights_booking_id ON flights(booking_id);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);
CREATE INDEX IF NOT EXISTS idx_crew_assignments_flight_id ON crew_assignments(flight_id);
CREATE INDEX IF NOT EXISTS idx_crew_assignments_user_id ON crew_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_operator_company ON aircraft(operator_company_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flights_updated_at BEFORE UPDATE ON flights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aircraft_updated_at BEFORE UPDATE ON aircraft FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crew_profiles_updated_at BEFORE UPDATE ON crew_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crew_requests_updated_at BEFORE UPDATE ON crew_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
