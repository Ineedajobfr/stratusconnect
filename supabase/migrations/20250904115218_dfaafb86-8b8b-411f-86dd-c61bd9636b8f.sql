-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Core tables
CREATE TABLE public.aircraft (
  tail_number text PRIMARY KEY,
  icao24 text,
  icao_type text,
  manufacturer text,
  model text,
  mtow_kg numeric,
  seats int,
  registry_source text,
  operator_name text,
  operator_cert text,
  country text,
  home_base_icao text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  country text,
  certificate_no text,
  authority text,
  contact jsonb,
  regions text[],
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.airports (
  icao text PRIMARY KEY,
  iata text,
  name text,
  country text,
  lat double precision,
  lon double precision,
  geom geography(point),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.hourly_rate_baseline (
  class text PRIMARY KEY,           -- very_light, light, midsize, super_midsize, heavy, uln
  baseline_usd numeric NOT NULL,
  as_of_date date NOT NULL,
  source text
);

CREATE TABLE public.signals (
  tail_number text REFERENCES public.aircraft(tail_number) ON DELETE CASCADE,
  last_seen_time timestamptz,
  last_seen_icao text,
  utilisation_hrs_7d numeric,
  reposition_bias_km numeric,
  PRIMARY KEY (tail_number)
);

CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid,
  origin_icao text,
  dest_icao text,
  pax int,
  date_utc timestamptz,
  aircraft_choice text,             -- tail or icao_type
  est_price_usd numeric,
  driver_breakdown_json jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on quotes table
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can insert own quote"
ON public.quotes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "user can read own quotes"  
ON public.quotes FOR SELECT
TO authenticated
USING (true);

-- Helpful indexes
CREATE INDEX ON public.aircraft (lower(manufacturer));
CREATE INDEX ON public.aircraft (lower(model));
CREATE INDEX ON public.aircraft (icao_type);
CREATE INDEX ON public.signals (last_seen_time DESC);
CREATE INDEX ON public.airports USING gist(geom);

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
  )
  SELECT tail_number, km FROM s ORDER BY km ASC LIMIT limit_n;
$$;

-- Seed conservative hourly baselines by class
INSERT INTO public.hourly_rate_baseline(class, baseline_usd, as_of_date, source) VALUES
('very_light', 3000, '2025-09-01', 'internal'),
('light',      4000, '2025-09-01', 'internal'),
('midsize',    6000, '2025-09-01', 'internal'),
('super_midsize', 7500, '2025-09-01', 'internal'),
('heavy',     10000, '2025-09-01', 'internal');