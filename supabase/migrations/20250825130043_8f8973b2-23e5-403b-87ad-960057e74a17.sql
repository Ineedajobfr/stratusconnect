-- Create demo user profiles after users are created
-- First, let's insert demo profiles for our demo users
INSERT INTO public.profiles (user_id, email, full_name, company_name, role, phone) VALUES
-- We'll need to get actual user IDs after creating the auth users
-- For now, create the structure to support our demo accounts
('00000000-0000-0000-0000-000000000001', 'broker@stratusconnect.com', 'Demo Broker User', 'StratusConnect Demo', 'broker', '+1-555-BROKER'),
('00000000-0000-0000-0000-000000000002', 'operator@stratusconnect.com', 'Demo Operator User', 'Flight Operations Demo', 'operator', '+1-555-OPERATOR'),
('00000000-0000-0000-0000-000000000003', 'crew@stratusconnect.com', 'Demo Crew Member', 'Aviation Crew Demo', 'crew', '+1-555-CREW'),
('00000000-0000-0000-0000-000000000004', 'admin@stratusconnect.com', 'Demo Administrator', 'StratusConnect Admin', 'admin', '+1-555-ADMIN')
ON CONFLICT (user_id) DO NOTHING;