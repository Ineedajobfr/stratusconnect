-- First, check if the demo user profiles already exist and create them if they don't
INSERT INTO user_profiles (user_id, username, full_name, role, level, trust_score, headline, bio, company, location)
SELECT u.id, 'BRK3847', 'Michael Chen', 'broker', 2, 85.5, 
       'Senior Aviation Charter Broker', 
       'Experienced charter broker specializing in executive and corporate travel with over 8 years in the industry.',
       'SkyBridge Aviation', 'New York, NY'
FROM auth.users u 
WHERE u.email = 'broker@stratusconnect.org'
AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = u.id);

INSERT INTO user_profiles (user_id, username, full_name, role, level, trust_score, headline, bio, company, location)
SELECT u.id, 'OPR9273', 'Sarah Johnson', 'operator', 3, 92.3,
       'Fleet Operations Manager',
       'Managing a diverse fleet of business jets with focus on safety, efficiency, and premium service delivery.',
       'Elite Charter Co.', 'Los Angeles, CA'
FROM auth.users u 
WHERE u.email = 'operator@stratusconnect.org'
AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = u.id);

INSERT INTO user_profiles (user_id, username, full_name, role, level, trust_score, headline, bio, company, location)
SELECT u.id, 'CRW5619', 'Captain James Wilson', 'crew', 2, 88.7,
       'Commercial Pilot & Flight Instructor', 
       'ATP-rated pilot with 15,000+ flight hours across multiple aircraft types. Safety is my top priority.',
       'Independent', 'Miami, FL'
FROM auth.users u 
WHERE u.email = 'crew@stratusconnect.org'
AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = u.id);

INSERT INTO user_profiles (user_id, username, full_name, role, level, trust_score, headline, bio, company, location)
SELECT u.id, 'PLT8432', 'Emily Rodriguez', 'pilot', 2, 91.2,
       'Corporate Jet Captain',
       'Dedicated aviation professional with extensive experience in international operations and VIP transport.',
       'Apex Aviation', 'Dallas, TX'
FROM auth.users u 
WHERE u.email = 'pilot@stratusconnect.org'
AND NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = u.id);