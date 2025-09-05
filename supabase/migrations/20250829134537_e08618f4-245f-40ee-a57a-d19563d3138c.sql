-- Create demo user profiles to avoid profile setup prompts
INSERT INTO user_profiles (user_id, username, full_name, role, level, trust_score, headline, bio, company, location)
VALUES 
  -- Broker demo user profile
  ((SELECT id FROM auth.users WHERE email = 'broker@stratusconnect.org'), 
   'BRK3847', 'Michael Chen', 'broker', 2, 85.5, 
   'Senior Aviation Charter Broker', 
   'Experienced charter broker specializing in executive and corporate travel with over 8 years in the industry.',
   'SkyBridge Aviation', 'New York, NY'),
   
  -- Operator demo user profile  
  ((SELECT id FROM auth.users WHERE email = 'operator@stratusconnect.org'),
   'OPR9273', 'Sarah Johnson', 'operator', 3, 92.3,
   'Fleet Operations Manager',
   'Managing a diverse fleet of business jets with focus on safety, efficiency, and premium service delivery.',
   'Elite Charter Co.', 'Los Angeles, CA'),
   
  -- Crew demo user profile
  ((SELECT id FROM auth.users WHERE email = 'crew@stratusconnect.org'),
   'CRW5619', 'Captain James Wilson', 'crew', 2, 88.7,
   'Commercial Pilot & Flight Instructor', 
   'ATP-rated pilot with 15,000+ flight hours across multiple aircraft types. Safety is my top priority.',
   'Independent', 'Miami, FL'),
   
  -- Pilot demo user profile
  ((SELECT id FROM auth.users WHERE email = 'pilot@stratusconnect.org'),
   'PLT8432', 'Emily Rodriguez', 'pilot', 2, 91.2,
   'Corporate Jet Captain',
   'Dedicated aviation professional with extensive experience in international operations and VIP transport.',
   'Apex Aviation', 'Dallas, TX')
ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  level = EXCLUDED.level,
  trust_score = EXCLUDED.trust_score,
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  company = EXCLUDED.company,
  location = EXCLUDED.location;