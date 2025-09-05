-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Check and create missing tables only

-- Create operators table if not exists
CREATE TABLE IF NOT EXISTS public.operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  country text,
  certificate_no text,
  authority text,
  contact jsonb,
  regions text[],
  updated_at timestamptz DEFAULT now()
);

-- Create airports table if not exists  
CREATE TABLE IF NOT EXISTS public.airports (
  icao text PRIMARY KEY,
  iata text,
  name text,
  country text,
  lat double precision,
  lon double precision,
  geom geography(point),
  updated_at timestamptz DEFAULT now()
);

-- Create hourly_rate_baseline table if not exists
CREATE TABLE IF NOT EXISTS public.hourly_rate_baseline (
  class text PRIMARY KEY,           -- very_light, light, midsize, super_midsize, heavy, uln
  baseline_usd numeric NOT NULL,
  as_of_date date NOT NULL,
  source text
);

-- Create signals table if not exists
CREATE TABLE IF NOT EXISTS public.signals (
  tail_number text PRIMARY KEY,
  last_seen_time timestamptz,
  last_seen_icao text,
  utilisation_hrs_7d numeric,
  reposition_bias_km numeric
);

-- Create quotes table if not exists
CREATE TABLE IF NOT EXISTS public.quotes (
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

-- Modify existing aircraft table to add missing columns
DO $$
BEGIN
  -- Add icao24 column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='icao24') THEN
    ALTER TABLE public.aircraft ADD COLUMN icao24 text;
  END IF;
  
  -- Add registry_source column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='registry_source') THEN
    ALTER TABLE public.aircraft ADD COLUMN registry_source text;
  END IF;
  
  -- Add operator_name column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='operator_name') THEN
    ALTER TABLE public.aircraft ADD COLUMN operator_name text;
  END IF;
  
  -- Add operator_cert column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='operator_cert') THEN
    ALTER TABLE public.aircraft ADD COLUMN operator_cert text;
  END IF;
  
  -- Add country column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='country') THEN
    ALTER TABLE public.aircraft ADD COLUMN country text;
  END IF;
  
  -- Add home_base_icao column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='home_base_icao') THEN
    ALTER TABLE public.aircraft ADD COLUMN home_base_icao text;
  END IF;
  
  -- Add mtow_kg column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='mtow_kg') THEN
    ALTER TABLE public.aircraft ADD COLUMN mtow_kg numeric;
  END IF;
END $$;