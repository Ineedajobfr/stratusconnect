-- Add missing icao_type column to aircraft table
ALTER TABLE public.aircraft ADD COLUMN IF NOT EXISTS icao_type text;

-- Create helpful indexes (avoiding duplicates)
CREATE INDEX IF NOT EXISTS aircraft_manufacturer_idx ON public.aircraft (lower(manufacturer));
CREATE INDEX IF NOT EXISTS aircraft_model_idx ON public.aircraft (lower(model));
CREATE INDEX IF NOT EXISTS aircraft_icao_type_idx ON public.aircraft (icao_type);
CREATE INDEX IF NOT EXISTS signals_last_seen_idx ON public.signals (last_seen_time DESC);
CREATE INDEX IF NOT EXISTS airports_geom_idx ON public.airports USING gist(geom);

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

CREATE OR REPLACE FUNCTION public.nearest_aircraft_by_type(origin_icao text, icao_type_in text, limit_n int)
RETURNS TABLE(tail_number text, km double precision)
LANGUAGE sql
AS $$
  WITH o AS (SELECT geom FROM airports WHERE icao = origin_icao),
  s AS (
    SELECT a.tail_number,
           st_distance(a0.geom, o.geom) / 1000.0 AS km
    FROM aircraft a
    JOIN airports a0 ON a0.icao = COALESCE(a.home_base_icao, a.base_location)
    JOIN o ON true
    WHERE a.icao_type = icao_type_in
    AND a0.icao IS NOT NULL
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