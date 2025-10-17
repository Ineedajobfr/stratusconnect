-- ========================================
-- ADD MISSING COLUMNS TO MARKETPLACE_LISTINGS
-- Fixes the "column does not exist" errors
-- ========================================

-- Add the missing columns that the frontend expects
ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS title TEXT;

ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS arrival_date TIMESTAMPTZ;

ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update existing rows to have default values where needed
UPDATE public.marketplace_listings 
SET title = COALESCE(title, 
  CASE 
    WHEN aircraft_model_id IS NOT NULL THEN 
      (SELECT CONCAT(manufacturer, ' ', model) 
       FROM aircraft_models 
       WHERE aircraft_models.id = marketplace_listings.aircraft_model_id)
    ELSE CONCAT(departure_location, ' to ', destination)
  END
)
WHERE title IS NULL;

-- Add some sample data to test the marketplace
INSERT INTO public.marketplace_listings (
  operator_id,
  aircraft_model_id,
  title,
  description,
  listing_type,
  category,
  asking_price,
  currency,
  departure_location,
  destination,
  departure_date,
  arrival_date,
  passengers,
  status
) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM aircraft_models WHERE manufacturer = 'Gulfstream' AND model = 'G650' LIMIT 1),
    'Gulfstream G650 - New York to London',
    'Luxury long-range business jet available for charter. Fully equipped with latest amenities.',
    'charter',
    'heavy',
    45000,
    'USD',
    'KJFK',
    'EGLL',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '7 hours',
    8,
    'active'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM aircraft_models WHERE manufacturer = 'Cessna' AND model = 'Citation X' LIMIT 1),
    'Cessna Citation X - Los Angeles to Chicago',
    'Fast and efficient medium jet perfect for business travel.',
    'charter',
    'medium',
    25000,
    'USD',
    'KLAX',
    'KORD',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '4 hours',
    6,
    'active'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM aircraft_models WHERE manufacturer = 'HondaJet' AND model = 'Elite S' LIMIT 1),
    'HondaJet Elite S - Miami to Atlanta',
    'Advanced very light jet with exceptional fuel efficiency.',
    'charter',
    'light',
    15000,
    'USD',
    'KMIA',
    'KATL',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day' + INTERVAL '2 hours',
    4,
    'active'
  )
ON CONFLICT DO NOTHING;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

