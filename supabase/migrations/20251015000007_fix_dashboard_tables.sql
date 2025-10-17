-- ========================================
-- FIX DASHBOARD TABLES FOR REAL USERS
-- Updates tables to match what dashboard services expect
-- ========================================

-- 1. Fix requests table to have the columns the dashboard expects
ALTER TABLE public.requests 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'quoted', 'accepted', 'cancelled'));

ALTER TABLE public.requests 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 2. Fix job_posts table to have the columns the dashboard expects
ALTER TABLE public.job_posts 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed'));

-- 3. Create quotes table if it doesn't exist (referenced in dashboard)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  aircraft_id UUID,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  valid_until TIMESTAMPTZ,
  terms TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create bookings table if it doesn't exist (referenced in dashboard)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_company_id UUID REFERENCES auth.users(id),
  operator_id UUID REFERENCES auth.users(id),
  quote_id UUID REFERENCES quotes(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Add some sample data for real users
INSERT INTO public.requests (
  broker_id,
  created_by,
  title,
  description,
  origin,
  destination,
  departure_date,
  passengers,
  budget,
  status
) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1),
    'New York to London Business Trip',
    'Need aircraft for executive business trip',
    'KJFK',
    'EGLL',
    NOW() + INTERVAL '5 days',
    6,
    50000,
    'open'
  ),
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1),
    'Miami to Los Angeles Charter',
    'Family vacation charter flight',
    'KMIA',
    'KLAX',
    NOW() + INTERVAL '10 days',
    8,
    35000,
    'quoted'
  )
ON CONFLICT DO NOTHING;

-- 6. Add sample quotes
INSERT INTO public.quotes (
  request_id,
  operator_id,
  price,
  currency,
  valid_until,
  terms,
  status
) VALUES
  (
    (SELECT id FROM requests LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1),
    45000,
    'USD',
    NOW() + INTERVAL '7 days',
    'Standard charter terms apply',
    'pending'
  ),
  (
    (SELECT id FROM requests LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1),
    42000,
    'USD',
    NOW() + INTERVAL '5 days',
    'Premium service included',
    'pending'
  )
ON CONFLICT DO NOTHING;

-- 7. Add sample bookings
INSERT INTO public.bookings (
  broker_company_id,
  operator_id,
  quote_id,
  status,
  total_amount,
  currency
) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1),
    (SELECT id FROM quotes LIMIT 1),
    'confirmed',
    45000,
    'USD'
  )
ON CONFLICT DO NOTHING;

-- 8. Enable RLS on all tables
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for real users
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT TO authenticated 
USING (operator_id = auth.uid() OR request_id IN (
  SELECT id FROM requests WHERE created_by = auth.uid()
));

CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT TO authenticated 
USING (broker_company_id = auth.uid() OR operator_id = auth.uid());

-- 10. Grant permissions
GRANT SELECT, INSERT, UPDATE ON quotes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON bookings TO authenticated;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

