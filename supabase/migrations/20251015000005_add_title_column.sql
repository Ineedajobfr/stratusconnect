-- ========================================
-- ADD TITLE COLUMN TO MARKETPLACE_LISTINGS
-- Simple fix for the missing title column
-- ========================================

-- Add the title column if it doesn't exist
ALTER TABLE public.marketplace_listings 
ADD COLUMN IF NOT EXISTS title TEXT;

-- Update existing rows to have titles based on aircraft model or route
UPDATE public.marketplace_listings 
SET title = COALESCE(title, 
  CASE 
    WHEN aircraft_model_id IS NOT NULL THEN 
      (SELECT CONCAT(manufacturer, ' ', model, ' - ', departure_location, ' to ', destination) 
       FROM aircraft_models 
       WHERE aircraft_models.id = marketplace_listings.aircraft_model_id)
    ELSE CONCAT(departure_location, ' to ', destination)
  END
)
WHERE title IS NULL OR title = '';

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

