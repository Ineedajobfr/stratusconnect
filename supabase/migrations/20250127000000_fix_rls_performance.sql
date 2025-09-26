-- Fix RLS Performance Issues
-- Replace auth.<function>() with (select auth.<function>()) for better performance

-- Drop and recreate all RLS policies with optimized auth function calls

-- Aircraft table policies
DROP POLICY IF EXISTS "Operators can manage their own aircraft" ON public.aircraft;
DROP POLICY IF EXISTS "Operators can update their own aircraft" ON public.aircraft;
DROP POLICY IF EXISTS "Operators can delete their own aircraft" ON public.aircraft;
DROP POLICY IF EXISTS "Operators can view their own aircraft details" ON public.aircraft;

CREATE POLICY "Operators can manage their own aircraft" ON public.aircraft
    FOR ALL USING (
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

CREATE POLICY "Operators can update their own aircraft" ON public.aircraft
    FOR UPDATE USING (
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

CREATE POLICY "Operators can delete their own aircraft" ON public.aircraft
    FOR DELETE USING (
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

CREATE POLICY "Operators can view their own aircraft details" ON public.aircraft
    FOR SELECT USING (
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

-- Marketplace listings policies
DROP POLICY IF EXISTS "Operators can create listings for their aircraft" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Operators can update their own listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Operators can delete their own listings" ON public.marketplace_listings;

CREATE POLICY "Operators can create listings for their aircraft" ON public.marketplace_listings
    FOR INSERT WITH CHECK (
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

CREATE POLICY "Operators can update their own listings" ON public.marketplace_listings
    FOR UPDATE USING (
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

CREATE POLICY "Operators can delete their own listings" ON public.marketplace_listings
    FOR DELETE USING (
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

-- Bids policies
DROP POLICY IF EXISTS "Users can view bids on their listings or their own bids" ON public.bids;
DROP POLICY IF EXISTS "Brokers can create bids" ON public.bids;
DROP POLICY IF EXISTS "Brokers can update their own bids" ON public.bids;

CREATE POLICY "Users can view bids on their listings or their own bids" ON public.bids
    FOR SELECT USING (
        bidder_id = (SELECT auth.uid()) OR
        listing_id IN (
            SELECT id FROM marketplace_listings 
            WHERE operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

CREATE POLICY "Brokers can create bids" ON public.bids
    FOR INSERT WITH CHECK (
        bidder_id = (SELECT auth.uid()) AND
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'broker'
    );

CREATE POLICY "Brokers can update their own bids" ON public.bids
    FOR UPDATE USING (
        bidder_id = (SELECT auth.uid())
    );

-- Deals policies
DROP POLICY IF EXISTS "Deal participants can view deals" ON public.deals;
DROP POLICY IF EXISTS "Operators can create deals" ON public.deals;
DROP POLICY IF EXISTS "Deal participants can update deals" ON public.deals;

CREATE POLICY "Deal participants can view deals" ON public.deals
    FOR SELECT USING (
        broker_id = (SELECT auth.uid()) OR
        operator_id = (SELECT auth.uid()) OR
        broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

CREATE POLICY "Operators can create deals" ON public.deals
    FOR INSERT WITH CHECK (
        operator_id = (SELECT auth.uid()) AND
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'operator'
    );

CREATE POLICY "Deal participants can update deals" ON public.deals
    FOR UPDATE USING (
        broker_id = (SELECT auth.uid()) OR
        operator_id = (SELECT auth.uid()) OR
        broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
        operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

-- Messages policies
DROP POLICY IF EXISTS "Deal participants can view messages" ON public.messages;
DROP POLICY IF EXISTS "Deal participants can send messages" ON public.messages;

CREATE POLICY "Deal participants can view messages" ON public.messages
    FOR SELECT USING (
        sender_id = (SELECT auth.uid()) OR
        receiver_id = (SELECT auth.uid()) OR
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

CREATE POLICY "Deal participants can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = (SELECT auth.uid()) AND (
            receiver_id IS NOT NULL OR
            deal_id IN (
                SELECT id FROM deals 
                WHERE broker_id = (SELECT auth.uid()) OR
                      operator_id = (SELECT auth.uid()) OR
                      broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                      operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
            )
        )
    );

-- Payments policies
DROP POLICY IF EXISTS "Deal participants can view payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;

CREATE POLICY "Deal participants can view payments" ON public.payments
    FOR SELECT USING (
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

CREATE POLICY "Users can create payments" ON public.payments
    FOR INSERT WITH CHECK (
        payer_id = (SELECT auth.uid()) OR
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

-- Verification documents policies
DROP POLICY IF EXISTS "Users can view their own verification documents" ON public.verification_documents;
DROP POLICY IF EXISTS "Users can upload their own verification documents" ON public.verification_documents;
DROP POLICY IF EXISTS "Users can update their own verification documents" ON public.verification_documents;

CREATE POLICY "Users can view their own verification documents" ON public.verification_documents
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Users can upload their own verification documents" ON public.verification_documents
    FOR INSERT WITH CHECK (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Users can update their own verification documents" ON public.verification_documents
    FOR UPDATE USING (
        user_id = (SELECT auth.uid())
    );

-- Message attachments policies
DROP POLICY IF EXISTS "Deal participants can view message attachments" ON public.message_attachments;
DROP POLICY IF EXISTS "Deal participants can upload message attachments" ON public.message_attachments;

CREATE POLICY "Deal participants can view message attachments" ON public.message_attachments
    FOR SELECT USING (
        message_id IN (
            SELECT id FROM messages 
            WHERE sender_id = (SELECT auth.uid()) OR
                  receiver_id = (SELECT auth.uid()) OR
                  deal_id IN (
                      SELECT id FROM deals 
                      WHERE broker_id = (SELECT auth.uid()) OR
                            operator_id = (SELECT auth.uid()) OR
                            broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                            operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
                  )
        )
    );

CREATE POLICY "Deal participants can upload message attachments" ON public.message_attachments
    FOR INSERT WITH CHECK (
        message_id IN (
            SELECT id FROM messages 
            WHERE sender_id = (SELECT auth.uid()) AND (
                receiver_id IS NOT NULL OR
                deal_id IN (
                    SELECT id FROM deals 
                    WHERE broker_id = (SELECT auth.uid()) OR
                          operator_id = (SELECT auth.uid()) OR
                          broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                          operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
                )
            )
        )
    );

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (
        user_id = (SELECT auth.uid())
    );

-- Saved searches policies
DROP POLICY IF EXISTS "Users can manage their own saved searches" ON public.saved_searches;

CREATE POLICY "Users can manage their own saved searches" ON public.saved_searches
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

-- Aircraft utilization policies
DROP POLICY IF EXISTS "Operators can view their aircraft utilization" ON public.aircraft_utilization;
DROP POLICY IF EXISTS "Operators can manage their aircraft utilization" ON public.aircraft_utilization;

CREATE POLICY "Operators can view their aircraft utilization" ON public.aircraft_utilization
    FOR SELECT USING (
        aircraft_id IN (
            SELECT id FROM aircraft 
            WHERE operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

CREATE POLICY "Operators can manage their aircraft utilization" ON public.aircraft_utilization
    FOR ALL USING (
        aircraft_id IN (
            SELECT id FROM aircraft 
            WHERE operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

-- User ratings policies
DROP POLICY IF EXISTS "Users can view ratings about themselves" ON public.user_ratings;
DROP POLICY IF EXISTS "Deal participants can rate each other" ON public.user_ratings;
DROP POLICY IF EXISTS "Users can view ratings for completed deals" ON public.user_ratings;

CREATE POLICY "Users can view ratings about themselves" ON public.user_ratings
    FOR SELECT USING (
        rated_user_id = (SELECT auth.uid()) OR
        rater_id = (SELECT auth.uid())
    );

CREATE POLICY "Deal participants can rate each other" ON public.user_ratings
    FOR INSERT WITH CHECK (
        rater_id = (SELECT auth.uid()) AND
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

CREATE POLICY "Users can view ratings for completed deals" ON public.user_ratings
    FOR SELECT USING (
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

-- Performance metrics policies
DROP POLICY IF EXISTS "Users can view their own performance metrics" ON public.performance_metrics;

CREATE POLICY "Users can view their own performance metrics" ON public.performance_metrics
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Maintenance schedules policies
DROP POLICY IF EXISTS "Operators can manage their maintenance schedules" ON public.maintenance_schedules;

CREATE POLICY "Operators can manage their maintenance schedules" ON public.maintenance_schedules
    FOR ALL USING (
        aircraft_id IN (
            SELECT id FROM aircraft 
            WHERE operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

-- Contracts policies
DROP POLICY IF EXISTS "Deal participants can view contracts" ON public.contracts;
DROP POLICY IF EXISTS "Deal participants can create contracts" ON public.contracts;
DROP POLICY IF EXISTS "Deal participants can update contracts" ON public.contracts;

CREATE POLICY "Deal participants can view contracts" ON public.contracts
    FOR SELECT USING (
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

CREATE POLICY "Deal participants can create contracts" ON public.contracts
    FOR INSERT WITH CHECK (
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

CREATE POLICY "Deal participants can update contracts" ON public.contracts
    FOR UPDATE USING (
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

-- Billing schedules policies
DROP POLICY IF EXISTS "Deal participants can manage billing schedules" ON public.billing_schedules;

CREATE POLICY "Deal participants can manage billing schedules" ON public.billing_schedules
    FOR ALL USING (
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

-- Escrow accounts policies
DROP POLICY IF EXISTS "Deal participants can view escrow accounts" ON public.escrow_accounts;

CREATE POLICY "Deal participants can view escrow accounts" ON public.escrow_accounts
    FOR SELECT USING (
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

-- Crew profiles policies
DROP POLICY IF EXISTS "Crew can manage their own profile" ON public.crew_profiles;
DROP POLICY IF EXISTS "Brokers can view crew profiles for active hiring" ON public.crew_profiles;

CREATE POLICY "Crew can manage their own profile" ON public.crew_profiles
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Brokers can view crew profiles for active hiring" ON public.crew_profiles
    FOR SELECT USING (
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'broker' AND
        availability_status = 'available'
    );

-- Crew certifications policies
DROP POLICY IF EXISTS "Crew can manage their own certifications" ON public.crew_certifications;

CREATE POLICY "Crew can manage their own certifications" ON public.crew_certifications
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

-- Crew availability policies
DROP POLICY IF EXISTS "Crew can manage their own availability" ON public.crew_availability;

CREATE POLICY "Crew can manage their own availability" ON public.crew_availability
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

-- Hiring requests policies
DROP POLICY IF EXISTS "Brokers can create hiring requests" ON public.hiring_requests;
DROP POLICY IF EXISTS "Brokers can view their hiring requests" ON public.hiring_requests;
DROP POLICY IF EXISTS "Crew can view requests for them" ON public.hiring_requests;
DROP POLICY IF EXISTS "Crew can update requests for them" ON public.hiring_requests;

CREATE POLICY "Brokers can create hiring requests" ON public.hiring_requests
    FOR INSERT WITH CHECK (
        broker_id = (SELECT auth.uid()) AND
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'broker'
    );

CREATE POLICY "Brokers can view their hiring requests" ON public.hiring_requests
    FOR SELECT USING (
        broker_id = (SELECT auth.uid())
    );

CREATE POLICY "Crew can view requests for them" ON public.hiring_requests
    FOR SELECT USING (
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('pilot', 'crew')
    );

CREATE POLICY "Crew can update requests for them" ON public.hiring_requests
    FOR UPDATE USING (
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) IN ('pilot', 'crew')
    );

-- Sanctions screenings policies
DROP POLICY IF EXISTS "Users can view their own screenings" ON public.sanctions_screenings;

CREATE POLICY "Users can view their own screenings" ON public.sanctions_screenings
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Strikes policies
DROP POLICY IF EXISTS "Users can view their own strikes" ON public.strikes;

CREATE POLICY "Users can view their own strikes" ON public.strikes
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (
        id = (SELECT auth.uid())
    );

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (
        id = (SELECT auth.uid())
    );

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (
        id = (SELECT auth.uid())
    );

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (
        id = (SELECT auth.uid())
    );

-- Admin invite codes policies
DROP POLICY IF EXISTS "Admins can manage invite codes" ON public.admin_invite_codes;

CREATE POLICY "Admins can manage invite codes" ON public.admin_invite_codes
    FOR ALL USING (
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- User sessions policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;

CREATE POLICY "Users can view their own sessions" ON public.user_sessions
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Sanctions matches policies
DROP POLICY IF EXISTS "Users can view their own matches" ON public.sanctions_matches;

CREATE POLICY "Users can view their own matches" ON public.sanctions_matches
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- AI warnings policies
DROP POLICY IF EXISTS "Users can view their own warnings" ON public.ai_warnings;
DROP POLICY IF EXISTS "Users can acknowledge their warnings" ON public.ai_warnings;

CREATE POLICY "Users can view their own warnings" ON public.ai_warnings
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Users can acknowledge their warnings" ON public.ai_warnings
    FOR UPDATE USING (
        user_id = (SELECT auth.uid())
    );

-- User profiles policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (
        user_id = (SELECT auth.uid())
    );

-- Experience policies
DROP POLICY IF EXISTS "Users can manage their own experience" ON public.experience;

CREATE POLICY "Users can manage their own experience" ON public.experience
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

-- Credentials policies
DROP POLICY IF EXISTS "Users can manage their own credentials" ON public.credentials;
DROP POLICY IF EXISTS "Level 2 counterparties can view masked credentials" ON public.credentials;

CREATE POLICY "Users can manage their own credentials" ON public.credentials
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "Level 2 counterparties can view masked credentials" ON public.credentials
    FOR SELECT USING (
        (SELECT verification_level FROM users WHERE id = (SELECT auth.uid())) >= 2
    );

-- References policies
DROP POLICY IF EXISTS "Users can manage their own references" ON public.references;

CREATE POLICY "Users can manage their own references" ON public.references
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

-- Psych scores policies
DROP POLICY IF EXISTS "scores read self" ON public.psych_scores;

CREATE POLICY "scores read self" ON public.psych_scores
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Psych consent policies
DROP POLICY IF EXISTS "consent self upsert" ON public.psych_consent;
DROP POLICY IF EXISTS "consent self update" ON public.psych_consent;
DROP POLICY IF EXISTS "consent self read" ON public.psych_consent;

CREATE POLICY "consent self upsert" ON public.psych_consent
    FOR INSERT WITH CHECK (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "consent self update" ON public.psych_consent
    FOR UPDATE USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "consent self read" ON public.psych_consent
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Activity policies
DROP POLICY IF EXISTS "Users can view their own activity" ON public.activity;

CREATE POLICY "Users can view their own activity" ON public.activity
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Privacy settings policies
DROP POLICY IF EXISTS "Users can manage their own privacy settings" ON public.privacy_settings;

CREATE POLICY "Users can manage their own privacy settings" ON public.privacy_settings
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

-- Profiles policies
DROP POLICY IF EXISTS "profiles self upsert" ON public.profiles;
DROP POLICY IF EXISTS "profiles self update" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "profiles self upsert" ON public.profiles
    FOR INSERT WITH CHECK (
        id = (SELECT auth.uid())
    );

CREATE POLICY "profiles self update" ON public.profiles
    FOR UPDATE USING (
        id = (SELECT auth.uid())
    );

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (
        id = (SELECT auth.uid())
    );

-- Companies policies
DROP POLICY IF EXISTS "companies member read" ON public.companies;
DROP POLICY IF EXISTS "companies owner admin update" ON public.companies;

CREATE POLICY "companies member read" ON public.companies
    FOR SELECT USING (
        id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

CREATE POLICY "companies owner admin update" ON public.companies
    FOR UPDATE USING (
        id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Company members policies
DROP POLICY IF EXISTS "company_members self read" ON public.company_members;
DROP POLICY IF EXISTS "company_members owner manage" ON public.company_members;
DROP POLICY IF EXISTS "company_members owner admin manage" ON public.company_members;
DROP POLICY IF EXISTS "company_members owner admin delete" ON public.company_members;

CREATE POLICY "company_members self read" ON public.company_members
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "company_members owner manage" ON public.company_members
    FOR ALL USING (
        company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
    );

CREATE POLICY "company_members owner admin manage" ON public.company_members
    FOR ALL USING (
        company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

CREATE POLICY "company_members owner admin delete" ON public.company_members
    FOR DELETE USING (
        company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Platform admins policies
DROP POLICY IF EXISTS "platform_admins self read" ON public.platform_admins;

CREATE POLICY "platform_admins self read" ON public.platform_admins
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- User reviews policies
DROP POLICY IF EXISTS "Users can create reviews for completed transactions" ON public.user_reviews;
DROP POLICY IF EXISTS "Reviewers can update their own reviews" ON public.user_reviews;

CREATE POLICY "Users can create reviews for completed transactions" ON public.user_reviews
    FOR INSERT WITH CHECK (
        reviewer_id = (SELECT auth.uid()) AND
        deal_id IN (
            SELECT id FROM deals 
            WHERE broker_id = (SELECT auth.uid()) OR
                  operator_id = (SELECT auth.uid()) OR
                  broker_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid())) OR
                  operator_company_id = (SELECT company_id FROM users WHERE id = (SELECT auth.uid()))
        )
    );

CREATE POLICY "Reviewers can update their own reviews" ON public.user_reviews
    FOR UPDATE USING (
        reviewer_id = (SELECT auth.uid())
    );

-- Psych sessions policies
DROP POLICY IF EXISTS "sessions insert self" ON public.psych_sessions;
DROP POLICY IF EXISTS "sessions read self" ON public.psych_sessions;
DROP POLICY IF EXISTS "sessions update self" ON public.psych_sessions;

CREATE POLICY "sessions insert self" ON public.psych_sessions
    FOR INSERT WITH CHECK (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "sessions read self" ON public.psych_sessions
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "sessions update self" ON public.psych_sessions
    FOR UPDATE USING (
        user_id = (SELECT auth.uid())
    );

-- Psych responses policies
DROP POLICY IF EXISTS "responses insert self" ON public.psych_responses;
DROP POLICY IF EXISTS "responses read self" ON public.psych_responses;

CREATE POLICY "responses insert self" ON public.psych_responses
    FOR INSERT WITH CHECK (
        user_id = (SELECT auth.uid())
    );

CREATE POLICY "responses read self" ON public.psych_responses
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Page content policies
DROP POLICY IF EXISTS "page_content owners can insert" ON public.page_content;
DROP POLICY IF EXISTS "page_content owners can update" ON public.page_content;
DROP POLICY IF EXISTS "page_content owners can delete" ON public.page_content;

CREATE POLICY "page_content owners can insert" ON public.page_content
    FOR INSERT WITH CHECK (
        owner_id = (SELECT auth.uid())
    );

CREATE POLICY "page_content owners can update" ON public.page_content
    FOR UPDATE USING (
        owner_id = (SELECT auth.uid())
    );

CREATE POLICY "page_content owners can delete" ON public.page_content
    FOR DELETE USING (
        owner_id = (SELECT auth.uid())
    );

-- Audit logs policies
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;

CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
    FOR SELECT USING (
        user_id = (SELECT auth.uid())
    );

-- Security settings policies
DROP POLICY IF EXISTS "Admin can manage security settings" ON public.security_settings;

CREATE POLICY "Admin can manage security settings" ON public.security_settings
    FOR ALL USING (
        (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
    );

-- Psych share tokens policies
DROP POLICY IF EXISTS "users can manage their own share tokens" ON public.psych_share_tokens;

CREATE POLICY "users can manage their own share tokens" ON public.psych_share_tokens
    FOR ALL USING (
        user_id = (SELECT auth.uid())
    );

-- Additional policies for profiles table
DROP POLICY IF EXISTS "profiles_secure_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_restricted_public_read" ON public.profiles;

CREATE POLICY "profiles_secure_read" ON public.profiles
    FOR SELECT USING (
        id = (SELECT auth.uid()) OR
        (SELECT verification_level FROM users WHERE id = (SELECT auth.uid())) >= 2
    );

CREATE POLICY "profiles_restricted_public_read" ON public.profiles
    FOR SELECT USING (
        (SELECT verification_level FROM users WHERE id = (SELECT auth.uid())) >= 1
    );
