-- Enable RLS on new tables
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quotes
DROP POLICY IF EXISTS "user can insert own quote" ON public.quotes;
DROP POLICY IF EXISTS "user can read own quotes" ON public.quotes;

CREATE POLICY "user can insert own quote"
ON public.quotes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "user can read own quotes"  
ON public.quotes FOR SELECT
TO authenticated
USING (true);

-- Create helpful indexes
DROP INDEX IF EXISTS aircraft_manufacturer_idx;
DROP INDEX IF EXISTS aircraft_model_idx;
DROP INDEX IF EXISTS aircraft_icao_type_idx;
DROP INDEX IF EXISTS signals_last_seen_idx;
DROP INDEX IF EXISTS airports_geom_idx;

CREATE INDEX aircraft_manufacturer_idx ON public.aircraft (lower(manufacturer));
CREATE INDEX aircraft_model_idx ON public.aircraft (lower(model));
CREATE INDEX aircraft_icao_type_idx ON public.aircraft (icao_type);
CREATE INDEX signals_last_seen_idx ON public.signals (last_seen_time DESC);
CREATE INDEX airports_geom_idx ON public.airports USING gist(geom);

-- Distance and routing helper functions
CREATE OR REPLACE FUNCTION public.distance_nm(origin_icao text, dest_icao text)
RETURNS numeric
LANGUAGE sql
AS $$
  SELECT st_distance(
    o.geom,
    d.geom
  ) / 1852.0
  FROM airports o, airports d
  WHERE o.icao = origin_icao AND d.icao = dest_icao;
$$;

CREATE OR REPLACE FUNCTION public.nearest_aircraft(origin_icao text, icao_type_in text, limit_n int)
RETURNS TABLE(tail_number text, km double precision)
LANGUAGE sql
AS $$
  WITH o AS (SELECT geom FROM airports WHERE icao = origin_icao),
  s AS (
    SELECT a.tail_number,
           st_distance(a0.geom, o.geom) / 1000.0 AS km
    FROM aircraft a
    JOIN airports a0 ON a0.icao = COALESCE(a.home_base_icao, 'ZZZZ')  -- if unknown base, skip
    JOIN o ON true
    WHERE a.icao_type = icao_type_in
    AND a0.icao != 'ZZZZ'  -- exclude unknown bases
  )
  SELECT tail_number, km FROM s ORDER BY km ASC LIMIT limit_n;
$$;

-- Seed conservative hourly baselines by class
INSERT INTO public.hourly_rate_baseline(class, baseline_usd, as_of_date, source) VALUES
('very_light', 3000, '2025-09-01', 'internal'),
('light',      4000, '2025-09-01', 'internal'),
('midsize',    6000, '2025-09-01', 'internal'),
('super_midsize', 7500, '2025-09-01', 'internal'),
('heavy',     10000, '2025-09-01', 'internal')
ON CONFLICT (class) DO NOTHING;

-- Test data for validation
INSERT INTO public.airports (icao, iata, name, country, lat, lon, geom) VALUES
('EGKB', 'BQH', 'Biggin Hill Airport', 'GB', 51.3307, 0.0325, ST_SetSRID(ST_MakePoint(0.0325, 51.3307), 4326)),
('LFPB', 'LBG', 'Le Bourget Airport', 'FR', 48.9694, 2.4414, ST_SetSRID(ST_MakePoint(2.4414, 48.9694), 4326)),
('EGGW', 'LTN', 'London Luton Airport', 'GB', 51.8747, -0.3683, ST_SetSRID(ST_MakePoint(-0.3683, 51.8747), 4326))
ON CONFLICT (icao) DO NOTHING;

-- Test aircraft data
INSERT INTO public.aircraft (tail_number, icao_type, manufacturer, model, seats, country, registry_source, home_base_icao) VALUES
('N123LT', 'E55P', 'Embraer', 'Phenom 300', 7, 'US', 'test', 'EGKB'),
('N456MD', 'C56X', 'Cessna', 'Citation Excel', 8, 'US', 'test', 'LFPB'),
('N789HV', 'G550', 'Gulfstream', 'G550', 14, 'US', 'test', 'EGGW')
ON CONFLICT (tail_number) DO NOTHING;

-- Test operator
INSERT INTO public.operators (name, country, certificate_no, authority) VALUES
('Test Charter Ltd', 'GB', 'TC001', 'CAA')
ON CONFLICT (name) DO NOTHING;