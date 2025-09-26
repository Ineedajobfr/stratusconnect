-- Remove Unused Indexes
-- Drop indexes that have never been used to improve performance and reduce storage overhead

-- User ratings unused indexes
DROP INDEX IF EXISTS idx_user_ratings_rated_user_id;
DROP INDEX IF EXISTS idx_user_ratings_deal_id;

-- User achievements unused indexes
DROP INDEX IF EXISTS idx_user_achievements_user_id;

-- Performance metrics unused indexes
DROP INDEX IF EXISTS idx_performance_metrics_user_id;

-- Market analytics unused indexes
DROP INDEX IF EXISTS idx_market_analytics_route;
DROP INDEX IF EXISTS idx_market_analytics_aircraft_type;
DROP INDEX IF EXISTS idx_market_analytics_created_at;

-- Aircraft utilization unused indexes
DROP INDEX IF EXISTS idx_aircraft_utilization_aircraft_id;

-- Maintenance schedules unused indexes
DROP INDEX IF EXISTS idx_maintenance_schedules_aircraft_id;

-- Aircraft unused indexes
DROP INDEX IF EXISTS idx_aircraft_operator_id;
DROP INDEX IF EXISTS idx_aircraft_availability;
DROP INDEX IF EXISTS aircraft_manufacturer_idx;
DROP INDEX IF EXISTS aircraft_model_idx;
DROP INDEX IF EXISTS aircraft_icao_type_idx;

-- Marketplace listings unused indexes
DROP INDEX IF EXISTS idx_listings_status;
DROP INDEX IF EXISTS idx_listings_operator;
DROP INDEX IF EXISTS idx_marketplace_listings_status;
DROP INDEX IF EXISTS idx_marketplace_listings_departure_date;

-- Bids unused indexes
DROP INDEX IF EXISTS idx_bids_listing;
DROP INDEX IF EXISTS idx_bids_broker;

-- Deals unused indexes
DROP INDEX IF EXISTS idx_deals_operator;
DROP INDEX IF EXISTS idx_deals_broker;
DROP INDEX IF EXISTS idx_deals_status;
DROP INDEX IF EXISTS idx_deals_operator_id;
DROP INDEX IF EXISTS idx_deals_broker_id;

-- Messages unused indexes
DROP INDEX IF EXISTS idx_messages_deal;
DROP INDEX IF EXISTS idx_messages_created_at;
DROP INDEX IF EXISTS idx_messages_deal_id;
DROP INDEX IF EXISTS idx_messages_sender_id;

-- Payments unused indexes
DROP INDEX IF EXISTS idx_payments_deal;

-- Signals unused indexes
DROP INDEX IF EXISTS signals_last_seen_idx;

-- Airports unused indexes
DROP INDEX IF EXISTS airports_geom_idx;

-- Profiles unused indexes
DROP INDEX IF EXISTS idx_profiles_username;

-- Company members unused indexes
DROP INDEX IF EXISTS idx_company_members_user;

-- Sanctions screenings unused indexes
DROP INDEX IF EXISTS idx_sanctions_screenings_expires_at;
DROP INDEX IF EXISTS idx_sanctions_screenings_user_id;

-- Users unused indexes
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_verification_status;

-- Sanctions matches unused indexes
DROP INDEX IF EXISTS idx_sanctions_matches_screening_id;

-- User sessions unused indexes
DROP INDEX IF EXISTS idx_user_sessions_token;
DROP INDEX IF EXISTS idx_user_sessions_user_id;
DROP INDEX IF EXISTS idx_user_sessions_expires_at;

-- Sanctions entities unused indexes
DROP INDEX IF EXISTS idx_sanctions_entities_name;
DROP INDEX IF EXISTS idx_sanctions_entities_aliases;

-- Security events unused indexes
DROP INDEX IF EXISTS idx_security_events_user_id;
DROP INDEX IF EXISTS idx_security_events_created_at;
DROP INDEX IF EXISTS idx_security_events_severity;

-- AI warnings unused indexes
DROP INDEX IF EXISTS idx_ai_warnings_user_id;
DROP INDEX IF EXISTS idx_ai_warnings_acknowledged;

-- User profiles unused indexes
DROP INDEX IF EXISTS idx_user_profiles_user_id;
DROP INDEX IF EXISTS idx_user_profiles_username;
DROP INDEX IF EXISTS idx_user_profiles_role;

-- Crew profiles unused indexes
DROP INDEX IF EXISTS idx_crew_profiles_availability;
DROP INDEX IF EXISTS idx_crew_profiles_user_id;

-- Update table statistics after index removal
ANALYZE user_ratings;
ANALYZE user_achievements;
ANALYZE performance_metrics;
ANALYZE market_analytics;
ANALYZE aircraft_utilization;
ANALYZE maintenance_schedules;
ANALYZE aircraft;
ANALYZE marketplace_listings;
ANALYZE bids;
ANALYZE deals;
ANALYZE messages;
ANALYZE payments;
ANALYZE signals;
ANALYZE airports;
ANALYZE profiles;
ANALYZE company_members;
ANALYZE sanctions_screenings;
ANALYZE users;
ANALYZE sanctions_matches;
ANALYZE user_sessions;
ANALYZE sanctions_entities;
ANALYZE security_events;
ANALYZE ai_warnings;
ANALYZE user_profiles;
ANALYZE crew_profiles;
