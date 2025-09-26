-- Comprehensive Row Level Security Policies
-- Implements multi-tenant security for StratusConnect

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_applications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT company_id 
        FROM users 
        WHERE id = (select auth.uid())
    );
END;
$$;

-- Helper function to get user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM users 
        WHERE id = (select auth.uid())
    );
END;
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$;

-- Companies policies
CREATE POLICY "companies_select_own" ON companies
    FOR SELECT USING (
        id = get_user_company_id() OR is_admin()
    );

CREATE POLICY "companies_insert_admin" ON companies
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "companies_update_own" ON companies
    FOR UPDATE USING (
        id = get_user_company_id() OR is_admin()
    );

-- Users policies
CREATE POLICY "users_select_company" ON users
    FOR SELECT USING (
        company_id = get_user_company_id() OR is_admin()
    );

CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (
        id = (select auth.uid()) OR is_admin()
    );

CREATE POLICY "users_insert_admin" ON users
    FOR INSERT WITH CHECK (is_admin());

-- Requests policies
CREATE POLICY "requests_select_broker" ON requests
    FOR SELECT USING (
        broker_company_id = get_user_company_id() OR is_admin()
    );

CREATE POLICY "requests_select_operators" ON requests
    FOR SELECT USING (
        get_user_role() = 'operator' AND status = 'open'
    );

CREATE POLICY "requests_insert_broker" ON requests
    FOR INSERT WITH CHECK (
        broker_company_id = get_user_company_id() AND get_user_role() = 'broker'
    );

CREATE POLICY "requests_update_broker" ON requests
    FOR UPDATE USING (
        broker_company_id = get_user_company_id() OR is_admin()
    );

-- Quotes policies
CREATE POLICY "quotes_select_broker" ON quotes
    FOR SELECT USING (
        request_id IN (
            SELECT id FROM requests 
            WHERE broker_company_id = get_user_company_id()
        ) OR is_admin()
    );

CREATE POLICY "quotes_select_operator" ON quotes
    FOR SELECT USING (
        operator_company_id = get_user_company_id() OR is_admin()
    );

CREATE POLICY "quotes_insert_operator" ON quotes
    FOR INSERT WITH CHECK (
        operator_company_id = get_user_company_id() AND get_user_role() = 'operator'
    );

CREATE POLICY "quotes_update_operator" ON quotes
    FOR UPDATE USING (
        operator_company_id = get_user_company_id() OR is_admin()
    );

-- Bookings policies
CREATE POLICY "bookings_select_participants" ON bookings
    FOR SELECT USING (
        broker_company_id = get_user_company_id() OR 
        operator_company_id = get_user_company_id() OR 
        is_admin()
    );

CREATE POLICY "bookings_insert_admin" ON bookings
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "bookings_update_participants" ON bookings
    FOR UPDATE USING (
        broker_company_id = get_user_company_id() OR 
        operator_company_id = get_user_company_id() OR 
        is_admin()
    );

-- Flights policies
CREATE POLICY "flights_select_participants" ON flights
    FOR SELECT USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE broker_company_id = get_user_company_id() OR 
                  operator_company_id = get_user_company_id()
        ) OR is_admin()
    );

CREATE POLICY "flights_select_crew" ON flights
    FOR SELECT USING (
        id IN (
            SELECT flight_id FROM crew_assignments 
            WHERE user_id = (select auth.uid())
        )
    );

CREATE POLICY "flights_update_operator" ON flights
    FOR UPDATE USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE operator_company_id = get_user_company_id()
        ) OR is_admin()
    );

CREATE POLICY "flights_update_crew" ON flights
    FOR UPDATE USING (
        id IN (
            SELECT flight_id FROM crew_assignments 
            WHERE user_id = (select auth.uid())
        )
    );

-- Crew assignments policies
CREATE POLICY "crew_assignments_select_company" ON crew_assignments
    FOR SELECT USING (
        flight_id IN (
            SELECT f.id FROM flights f
            JOIN bookings b ON f.booking_id = b.id
            WHERE b.operator_company_id = get_user_company_id()
        ) OR 
        user_id = (select auth.uid()) OR 
        is_admin()
    );

CREATE POLICY "crew_assignments_insert_operator" ON crew_assignments
    FOR INSERT WITH CHECK (
        flight_id IN (
            SELECT f.id FROM flights f
            JOIN bookings b ON f.booking_id = b.id
            WHERE b.operator_company_id = get_user_company_id()
        ) AND get_user_role() = 'operator'
    );

CREATE POLICY "crew_assignments_update_crew" ON crew_assignments
    FOR UPDATE USING (
        user_id = (select auth.uid()) OR 
        flight_id IN (
            SELECT f.id FROM flights f
            JOIN bookings b ON f.booking_id = b.id
            WHERE b.operator_company_id = get_user_company_id()
        ) OR 
        is_admin()
    );

-- Aircraft policies
CREATE POLICY "aircraft_select_operator" ON aircraft
    FOR SELECT USING (
        operator_company_id = get_user_company_id() OR 
        id IN (
            SELECT DISTINCT aircraft_id FROM quotes 
            WHERE request_id IN (
                SELECT id FROM requests 
                WHERE broker_company_id = get_user_company_id()
            )
        ) OR 
        is_admin()
    );

CREATE POLICY "aircraft_insert_operator" ON aircraft
    FOR INSERT WITH CHECK (
        operator_company_id = get_user_company_id() AND get_user_role() = 'operator'
    );

CREATE POLICY "aircraft_update_operator" ON aircraft
    FOR UPDATE USING (
        operator_company_id = get_user_company_id() OR is_admin()
    );

-- Maintenance policies
CREATE POLICY "maintenance_select_operator" ON maintenance
    FOR SELECT USING (
        aircraft_id IN (
            SELECT id FROM aircraft 
            WHERE operator_company_id = get_user_company_id()
        ) OR is_admin()
    );

CREATE POLICY "maintenance_insert_operator" ON maintenance
    FOR INSERT WITH CHECK (
        aircraft_id IN (
            SELECT id FROM aircraft 
            WHERE operator_company_id = get_user_company_id()
        ) AND get_user_role() = 'operator'
    );

CREATE POLICY "maintenance_update_operator" ON maintenance
    FOR UPDATE USING (
        aircraft_id IN (
            SELECT id FROM aircraft 
            WHERE operator_company_id = get_user_company_id()
        ) OR is_admin()
    );

-- Crew profiles policies
CREATE POLICY "crew_profiles_select_own" ON crew_profiles
    FOR SELECT USING (
        user_id = (select auth.uid()) OR 
        user_id IN (
            SELECT id FROM users 
            WHERE company_id = get_user_company_id()
        ) OR 
        is_admin()
    );

CREATE POLICY "crew_profiles_update_own" ON crew_profiles
    FOR UPDATE USING (
        user_id = (select auth.uid()) OR 
        user_id IN (
            SELECT id FROM users 
            WHERE company_id = get_user_company_id()
        ) OR 
        is_admin()
    );

CREATE POLICY "crew_profiles_insert_own" ON crew_profiles
    FOR INSERT WITH CHECK (
        user_id = (select auth.uid()) OR is_admin()
    );

-- Documents policies
CREATE POLICY "documents_select_owner" ON documents
    FOR SELECT USING (
        (owner_type = 'user' AND owner_id = (select auth.uid())) OR
        (owner_type = 'company' AND owner_id = get_user_company_id()) OR
        (owner_type = 'booking' AND owner_id IN (
            SELECT id FROM bookings 
            WHERE broker_company_id = get_user_company_id() OR 
                  operator_company_id = get_user_company_id()
        )) OR
        (owner_type = 'aircraft' AND owner_id IN (
            SELECT id FROM aircraft 
            WHERE operator_company_id = get_user_company_id()
        )) OR
        is_admin()
    );

CREATE POLICY "documents_insert_owner" ON documents
    FOR INSERT WITH CHECK (
        (owner_type = 'user' AND owner_id = (select auth.uid())) OR
        (owner_type = 'company' AND owner_id = get_user_company_id()) OR
        is_admin()
    );

-- Sanctions policies (admin only)
CREATE POLICY "sanctions_admin_only" ON sanctions
    FOR ALL USING (is_admin());

-- Messages policies
CREATE POLICY "messages_select_participants" ON messages
    FOR SELECT USING (
        sender_id = (select auth.uid()) OR 
        receiver_id = (select auth.uid()) OR
        booking_id IN (
            SELECT id FROM bookings 
            WHERE broker_company_id = get_user_company_id() OR 
                  operator_company_id = get_user_company_id()
        ) OR
        request_id IN (
            SELECT id FROM requests 
            WHERE broker_company_id = get_user_company_id()
        ) OR
        is_admin()
    );

CREATE POLICY "messages_insert_participants" ON messages
    FOR INSERT WITH CHECK (
        sender_id = (select auth.uid()) AND (
            receiver_id IS NOT NULL OR
            booking_id IN (
                SELECT id FROM bookings 
                WHERE broker_company_id = get_user_company_id() OR 
                      operator_company_id = get_user_company_id()
            ) OR
            request_id IN (
                SELECT id FROM requests 
                WHERE broker_company_id = get_user_company_id()
            )
        )
    );

-- Notifications policies
CREATE POLICY "notifications_select_own" ON notifications
    FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "notifications_insert_own" ON notifications
    FOR INSERT WITH CHECK (user_id = (select auth.uid()) OR is_admin());

CREATE POLICY "notifications_update_own" ON notifications
    FOR UPDATE USING (user_id = (select auth.uid()));

-- Analytics policies
CREATE POLICY "analytics_select_company" ON analytics
    FOR SELECT USING (
        company_id = get_user_company_id() OR is_admin()
    );

CREATE POLICY "analytics_insert_admin" ON analytics
    FOR INSERT WITH CHECK (is_admin());

-- Audit logs policies (admin only)
CREATE POLICY "audit_logs_admin_only" ON audit_logs
    FOR ALL USING (is_admin());

-- Performance policies
CREATE POLICY "performance_select_company" ON performance
    FOR SELECT USING (
        booking_id IN (
            SELECT id FROM bookings 
            WHERE broker_company_id = get_user_company_id() OR 
                  operator_company_id = get_user_company_id()
        ) OR is_admin()
    );

CREATE POLICY "performance_insert_admin" ON performance
    FOR INSERT WITH CHECK (is_admin());

-- Crew requests policies
CREATE POLICY "crew_requests_select_operator" ON crew_requests
    FOR SELECT USING (
        operator_company_id = get_user_company_id() OR 
        get_user_role() IN ('pilot', 'crew') OR 
        is_admin()
    );

CREATE POLICY "crew_requests_insert_operator" ON crew_requests
    FOR INSERT WITH CHECK (
        operator_company_id = get_user_company_id() AND get_user_role() = 'operator'
    );

CREATE POLICY "crew_requests_update_operator" ON crew_requests
    FOR UPDATE USING (
        operator_company_id = get_user_company_id() OR is_admin()
    );

-- Crew applications policies
CREATE POLICY "crew_applications_select_participants" ON crew_applications
    FOR SELECT USING (
        applicant_id = (select auth.uid()) OR
        crew_request_id IN (
            SELECT id FROM crew_requests 
            WHERE operator_company_id = get_user_company_id()
        ) OR
        is_admin()
    );

CREATE POLICY "crew_applications_insert_crew" ON crew_applications
    FOR INSERT WITH CHECK (
        applicant_id = (select auth.uid()) AND get_user_role() IN ('pilot', 'crew')
    );

CREATE POLICY "crew_applications_update_operator" ON crew_applications
    FOR UPDATE USING (
        crew_request_id IN (
            SELECT id FROM crew_requests 
            WHERE operator_company_id = get_user_company_id()
        ) OR is_admin()
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
