-- Fix function security by setting search_path
CREATE OR REPLACE FUNCTION public.distance_nm(origin_icao text, dest_icao text)
RETURNS numeric
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
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
SECURITY DEFINER
SET search_path = public
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