-- Create helper function to find nearest airport
CREATE OR REPLACE FUNCTION public.find_nearest_airport(lat_param double precision, lon_param double precision)
RETURNS TABLE(icao text, distance_km double precision)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    a.icao,
    ST_Distance(a.geom, ST_SetSRID(ST_MakePoint(lon_param, lat_param), 4326)) / 1000.0 AS distance_km
  FROM airports a
  WHERE a.geom IS NOT NULL
  ORDER BY a.geom <-> ST_SetSRID(ST_MakePoint(lon_param, lat_param), 4326)
  LIMIT 1;
$$;