-- AI Hunter System - Real Data, Real Actions, Real Audit Trail
-- FCA Compliant Aviation Platform - The Hunter, Not the Demo

-- 1. AI Recommendation Log - Every decision is logged
CREATE TABLE IF NOT EXISTS ai_recommendation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL,
  model_version text NOT NULL,
  insight_type text NOT NULL,     -- demand, pricing, hire, maintenance
  inputs jsonb NOT NULL,
  outputs jsonb NOT NULL,
  inputs_sha256 text NOT NULL,
  outputs_sha256 text NOT NULL,
  latency_ms integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Market Demand Materialized View - Real data, real insights
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_market_demand AS
SELECT
  fs.origin || '-' || fs.destination as route,
  date_trunc('day', fs.departure_time) as day,
  count(*) as rfq_count,
  avg(ms.price_usd) as avg_price_usd,
  min(ms.price_usd) as min_price_usd,
  max(ms.price_usd) as max_price_usd,
  stddev(ms.price_usd) as price_volatility,
  count(DISTINCT fs.broker_company_id) as unique_brokers,
  count(DISTINCT ms.operator_company_id) as unique_operators
FROM flight_segments fs
JOIN marketplace_listings ms ON ms.segment_id = fs.id
WHERE fs.departure_time >= now() - interval '90 days'
GROUP BY 1,2;

-- 3. Fleet Utilization Materialized View - Real fleet data
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_fleet_utilization AS
SELECT
  a.id as aircraft_id,
  a.registration,
  a.model,
  a.operator_company_id,
  count(f.id) as total_flights,
  sum(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time))/3600) as total_hours,
  avg(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time))/3600) as avg_flight_duration,
  count(CASE WHEN f.status = 'completed' THEN 1 END) as completed_flights,
  count(CASE WHEN f.status = 'cancelled' THEN 1 END) as cancelled_flights,
  max(f.departure_time) as last_flight_date
FROM aircraft a
LEFT JOIN flights f ON f.aircraft_id = a.id
WHERE f.departure_time >= now() - interval '30 days' OR f.departure_time IS NULL
GROUP BY a.id, a.registration, a.model, a.operator_company_id;

-- 4. Pilot Performance Materialized View - Real pilot data
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_pilot_performance AS
SELECT
  p.id as pilot_id,
  p.name,
  p.rating,
  p.total_hours,
  count(f.id) as flights_completed,
  avg(f.rating) as avg_flight_rating,
  count(CASE WHEN f.status = 'completed' THEN 1 END) as successful_flights,
  count(CASE WHEN f.status = 'cancelled' THEN 1 END) as cancelled_flights,
  sum(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time))/3600) as hours_flown,
  max(f.departure_time) as last_flight_date
FROM pilots p
LEFT JOIN flights f ON f.pilot_id = p.id
WHERE f.departure_time >= now() - interval '90 days' OR f.departure_time IS NULL
GROUP BY p.id, p.name, p.rating, p.total_hours;

-- 5. Weather Impact Materialized View - Real weather data
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_weather_impact AS
SELECT
  ws.airport_code,
  ws.observation_time,
  ws.weather_condition,
  ws.wind_speed,
  ws.visibility,
  count(f.id) as flights_affected,
  avg(CASE WHEN f.status = 'cancelled' THEN 1.0 ELSE 0.0 END) as cancellation_rate
FROM weather_snapshots ws
LEFT JOIN flights f ON f.origin_airport = ws.airport_code 
  AND f.departure_time BETWEEN ws.observation_time - interval '2 hours' AND ws.observation_time + interval '2 hours'
WHERE ws.observation_time >= now() - interval '30 days'
GROUP BY ws.airport_code, ws.observation_time, ws.weather_condition, ws.wind_speed, ws.visibility;

-- 6. Event Impact Materialized View - Real event data
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_event_impact AS
SELECT
  ec.event_name,
  ec.event_date,
  ec.location,
  ec.event_type,
  count(f.id) as flights_affected,
  avg(ms.price_usd) as avg_price_during_event,
  avg(ms.price_usd) - LAG(avg(ms.price_usd)) OVER (PARTITION BY ec.location ORDER BY ec.event_date) as price_change
FROM events_calendar ec
LEFT JOIN flights f ON f.origin_airport = ec.location OR f.destination_airport = ec.location
LEFT JOIN marketplace_listings ms ON ms.segment_id = f.id
WHERE ec.event_date >= now() - interval '90 days'
GROUP BY ec.event_name, ec.event_date, ec.location, ec.event_type;

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_log_user_id ON ai_recommendation_log(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_log_role ON ai_recommendation_log(role);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_log_insight_type ON ai_recommendation_log(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_recommendation_log_created_at ON ai_recommendation_log(created_at);

CREATE INDEX IF NOT EXISTS idx_mv_market_demand_route ON mv_market_demand(route);
CREATE INDEX IF NOT EXISTS idx_mv_market_demand_day ON mv_market_demand(day);
CREATE INDEX IF NOT EXISTS idx_mv_fleet_utilization_aircraft_id ON mv_fleet_utilization(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_mv_pilot_performance_pilot_id ON mv_pilot_performance(pilot_id);
CREATE INDEX IF NOT EXISTS idx_mv_weather_impact_airport_code ON mv_weather_impact(airport_code);
CREATE INDEX IF NOT EXISTS idx_mv_event_impact_location ON mv_event_impact(location);

-- 8. RLS Policies for AI Recommendation Log
ALTER TABLE ai_recommendation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI recommendations"
ON ai_recommendation_log
FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all AI recommendations"
ON ai_recommendation_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = (select auth.uid()) 
    AND platform_role = 'admin'
  )
);

-- 9. Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_ai_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW mv_market_demand;
  REFRESH MATERIALIZED VIEW mv_fleet_utilization;
  REFRESH MATERIALIZED VIEW mv_pilot_performance;
  REFRESH MATERIALIZED VIEW mv_weather_impact;
  REFRESH MATERIALIZED VIEW mv_event_impact;
END;
$$;

-- 10. Function to log AI recommendations
CREATE OR REPLACE FUNCTION log_ai_recommendation(
  p_user_id uuid,
  p_role text,
  p_model_version text,
  p_insight_type text,
  p_inputs jsonb,
  p_outputs jsonb,
  p_latency_ms integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recommendation_id uuid;
  inputs_hash text;
  outputs_hash text;
BEGIN
  -- Generate hashes for audit trail
  inputs_hash := encode(digest(p_inputs::text, 'sha256'), 'hex');
  outputs_hash := encode(digest(p_outputs::text, 'sha256'), 'hex');
  
  -- Insert the recommendation
  INSERT INTO ai_recommendation_log (
    user_id,
    role,
    model_version,
    insight_type,
    inputs,
    outputs,
    inputs_sha256,
    outputs_sha256,
    latency_ms
  ) VALUES (
    p_user_id,
    p_role,
    p_model_version,
    p_insight_type,
    p_inputs,
    p_outputs,
    inputs_hash,
    outputs_hash,
    p_latency_ms
  ) RETURNING id INTO recommendation_id;
  
  RETURN recommendation_id;
END;
$$;

-- 11. Grant permissions
GRANT SELECT ON ai_recommendation_log TO authenticated;
GRANT SELECT ON mv_market_demand TO authenticated;
GRANT SELECT ON mv_fleet_utilization TO authenticated;
GRANT SELECT ON mv_pilot_performance TO authenticated;
GRANT SELECT ON mv_weather_impact TO authenticated;
GRANT SELECT ON mv_event_impact TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_ai_views() TO authenticated;
GRANT EXECUTE ON FUNCTION log_ai_recommendation(uuid, text, text, text, jsonb, jsonb, integer) TO authenticated;
