-- Create verified test users for each terminal type
-- This script creates fully verified users for testing the real terminals

-- First, let's create the users in auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
-- Broker Test User
(
  '550e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'broker@test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Alex", "last_name": "Broker", "role": "broker"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
-- Operator Test User
(
  '550e8400-e29b-41d4-a716-446655440002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'operator@test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Sarah", "last_name": "Operator", "role": "operator"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
-- Pilot Test User
(
  '550e8400-e29b-41d4-a716-446655440003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pilot@test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Mike", "last_name": "Pilot", "role": "pilot"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
-- Crew Test User
(
  '550e8400-e29b-41d4-a716-446655440004',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'crew@test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Emma", "last_name": "Crew", "role": "crew"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Now create the profiles for each user
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  role,
  verification_status,
  company_name,
  license_number,
  license_authority,
  years_experience,
  fleet_size,
  aircraft_types,
  operating_regions,
  license_type,
  total_flight_hours,
  aircraft_ratings,
  current_employer,
  specialties,
  certifications,
  languages_spoken,
  id_document_url,
  license_document_url,
  additional_documents,
  verification_notes,
  verified_at,
  verified_by,
  created_at,
  updated_at
) VALUES 
-- Broker Profile
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Alex',
  'Broker',
  'broker',
  'approved',
  'Elite Aviation Brokers',
  'BRO-2024-001',
  'FAA',
  8,
  NULL,
  NULL,
  'North America, Europe',
  NULL,
  NULL,
  NULL,
  'Elite Aviation Brokers',
  'Corporate Jets, Turboprops',
  'Certified Aircraft Broker',
  'English, Spanish',
  'https://example.com/documents/broker_id.pdf',
  'https://example.com/documents/broker_license.pdf',
  '{"insurance": "https://example.com/documents/broker_insurance.pdf"}',
  'All documents verified and approved',
  NOW(),
  '00000000-0000-0000-0000-000000000000',
  NOW(),
  NOW()
),
-- Operator Profile
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Sarah',
  'Operator',
  'operator',
  'approved',
  'SkyHigh Operations',
  'OP-2024-002',
  'FAA',
  12,
  15,
  'Gulfstream G650, Bombardier Global 7500, Cessna Citation X+',
  'North America, Caribbean',
  NULL,
  NULL,
  NULL,
  'SkyHigh Operations',
  'Long-range jets, Corporate charters',
  'Part 135 Certificate, IS-BAO Stage 3',
  'English, French',
  'https://example.com/documents/operator_id.pdf',
  'https://example.com/documents/operator_license.pdf',
  '{"insurance": "https://example.com/documents/operator_insurance.pdf", "certificate": "https://example.com/documents/part135.pdf"}',
  'All documents verified and approved',
  NOW(),
  '00000000-0000-0000-0000-000000000000',
  NOW(),
  NOW()
),
-- Pilot Profile
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Mike',
  'Pilot',
  'pilot',
  'approved',
  NULL,
  'PIL-2024-003',
  'FAA',
  15,
  NULL,
  NULL,
  'North America, Europe, Asia',
  'Airline Transport Pilot',
  8500,
  'Gulfstream G650, Bombardier Global, Boeing 737',
  'SkyHigh Operations',
  'Long-range jets, International operations',
  'ATP, Type ratings: G650, Global 7500, B737',
  'English, German',
  'https://example.com/documents/pilot_id.pdf',
  'https://example.com/documents/pilot_license.pdf',
  '{"medical": "https://example.com/documents/pilot_medical.pdf", "type_ratings": "https://example.com/documents/type_ratings.pdf"}',
  'All documents verified and approved',
  NOW(),
  '00000000-0000-0000-0000-000000000000',
  NOW(),
  NOW()
),
-- Crew Profile
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Emma',
  'Crew',
  'crew',
  'approved',
  NULL,
  NULL,
  NULL,
  6,
  NULL,
  NULL,
  'North America, Europe',
  NULL,
  NULL,
  NULL,
  'SkyHigh Operations',
  'Corporate jets, VIP service',
  'Cabin Crew Certificate, First Aid, CPR',
  'English, Spanish, French',
  'https://example.com/documents/crew_id.pdf',
  NULL,
  '{"certificates": "https://example.com/documents/crew_certificates.pdf", "training": "https://example.com/documents/crew_training.pdf"}',
  'All documents verified and approved',
  NOW(),
  '00000000-0000-0000-0000-000000000000',
  NOW(),
  NOW()
);

-- Insert some sample data for testing

-- Sample RFQs for broker testing
INSERT INTO public.rfqs (
  id,
  broker_id,
  operator_id,
  aircraft_type,
  departure_airport,
  arrival_airport,
  departure_date,
  return_date,
  passengers,
  budget,
  special_requirements,
  status,
  created_at,
  updated_at
) VALUES 
(
  'rfq-001',
  '550e8400-e29b-41d4-a716-446655440001',
  NULL,
  'Gulfstream G650',
  'KJFK',
  'EGLL',
  '2024-02-15 10:00:00',
  '2024-02-18 15:00:00',
  8,
  150000,
  'WiFi, catering, ground transportation',
  'active',
  NOW(),
  NOW()
),
(
  'rfq-002',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  'Bombardier Global 7500',
  'KLAX',
  'EGLL',
  '2024-02-20 14:00:00',
  '2024-02-22 12:00:00',
  12,
  180000,
  'Pet-friendly, medical equipment',
  'quoted',
  NOW(),
  NOW()
);

-- Sample quotes for operator testing
INSERT INTO public.quotes (
  id,
  rfq_id,
  operator_id,
  broker_id,
  aircraft_id,
  price,
  currency,
  valid_until,
  terms,
  status,
  created_at,
  updated_at
) VALUES 
(
  'quote-001',
  'rfq-001',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'aircraft-001',
  145000,
  'USD',
  NOW() + INTERVAL '7 days',
  'Standard terms, fuel surcharge may apply',
  'pending',
  NOW(),
  NOW()
);

-- Sample aircraft for operator testing
INSERT INTO public.aircraft (
  id,
  operator_id,
  model,
  registration,
  seats,
  range_nm,
  status,
  created_at,
  updated_at
) VALUES 
(
  'aircraft-001',
  '550e8400-e29b-41d4-a716-446655440002',
  'Gulfstream G650',
  'N123GX',
  14,
  7500,
  'available',
  NOW(),
  NOW()
),
(
  'aircraft-002',
  '550e8400-e29b-41d4-a716-446655440002',
  'Bombardier Global 7500',
  'N456BG',
  16,
  7700,
  'available',
  NOW(),
  NOW()
);

-- Sample job posts for pilot/crew testing
INSERT INTO public.job_posts (
  id,
  operator_id,
  title,
  description,
  aircraft_type,
  departure_location,
  destination,
  start_date,
  end_date,
  requirements,
  compensation,
  status,
  created_at,
  updated_at
) VALUES 
(
  'job-001',
  '550e8400-e29b-41d4-a716-446655440002',
  'Gulfstream G650 Captain',
  'Seeking experienced G650 captain for corporate charter operations',
  'Gulfstream G650',
  'New York, NY',
  'London, UK',
  '2024-02-15',
  '2024-02-18',
  'ATP License, G650 Type Rating, 3000+ hours',
  '$800/day',
  'active',
  NOW(),
  NOW()
),
(
  'job-002',
  '550e8400-e29b-41d4-a716-446655440002',
  'Senior Cabin Crew',
  'Experienced cabin crew for VIP corporate flights',
  'Bombardier Global 7500',
  'Los Angeles, CA',
  'Paris, France',
  '2024-02-20',
  '2024-02-22',
  '5+ years experience, VIP service training',
  '$400/day',
  'active',
  NOW(),
  NOW()
);

-- Create admin user for verification (if not exists)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@stratusconnect.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Admin", "last_name": "User", "role": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  role,
  verification_status,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  'Admin',
  'User',
  'admin',
  'approved',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Test users created successfully!' as message;

