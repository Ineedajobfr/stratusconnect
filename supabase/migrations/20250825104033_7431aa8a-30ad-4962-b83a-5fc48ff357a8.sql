-- Create user profiles table for additional user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('operator', 'broker')),
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create aircraft table for operator's fleet
CREATE TABLE public.aircraft (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  tail_number TEXT NOT NULL UNIQUE,
  aircraft_type TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  year_manufactured INTEGER,
  seats INTEGER NOT NULL,
  max_range_nm INTEGER,
  cruise_speed_knots INTEGER,
  hourly_rate DECIMAL(10,2) NOT NULL,
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'maintenance', 'booked')),
  base_location TEXT,
  description TEXT,
  images TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create marketplace listings table
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE NOT NULL,
  operator_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  departure_location TEXT NOT NULL,
  destination TEXT,
  departure_date TIMESTAMPTZ,
  return_date TIMESTAMPTZ,
  asking_price DECIMAL(10,2) NOT NULL,
  minimum_bid DECIMAL(10,2),
  flight_hours DECIMAL(4,1),
  passengers INTEGER,
  listing_type TEXT NOT NULL DEFAULT 'charter' CHECK (listing_type IN ('charter', 'empty_leg', 'block_hours')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'completed', 'cancelled')),
  description TEXT,
  special_requirements TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bids table
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE NOT NULL,
  broker_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  bid_amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create deals table for accepted transactions
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE NOT NULL,
  winning_bid_id UUID REFERENCES public.bids(id) ON DELETE SET NULL,
  operator_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  broker_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE NOT NULL,
  final_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  contract_terms TEXT,
  flight_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table for deal communications
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'contract', 'payment')),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table for transaction records
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  payer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'full_payment', 'refund')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for aircraft
CREATE POLICY "Everyone can view available aircraft" ON public.aircraft FOR SELECT USING (true);
CREATE POLICY "Operators can manage their own aircraft" ON public.aircraft FOR INSERT WITH CHECK (auth.uid() = operator_id);
CREATE POLICY "Operators can update their own aircraft" ON public.aircraft FOR UPDATE USING (auth.uid() = operator_id);
CREATE POLICY "Operators can delete their own aircraft" ON public.aircraft FOR DELETE USING (auth.uid() = operator_id);

-- Create RLS policies for marketplace listings
CREATE POLICY "Everyone can view active listings" ON public.marketplace_listings FOR SELECT USING (true);
CREATE POLICY "Operators can create listings for their aircraft" ON public.marketplace_listings FOR INSERT WITH CHECK (auth.uid() = operator_id);
CREATE POLICY "Operators can update their own listings" ON public.marketplace_listings FOR UPDATE USING (auth.uid() = operator_id);
CREATE POLICY "Operators can delete their own listings" ON public.marketplace_listings FOR DELETE USING (auth.uid() = operator_id);

-- Create RLS policies for bids
CREATE POLICY "Users can view bids on their listings or their own bids" ON public.bids FOR SELECT USING (
  auth.uid() = broker_id OR 
  auth.uid() IN (SELECT operator_id FROM public.marketplace_listings WHERE id = listing_id)
);
CREATE POLICY "Brokers can create bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = broker_id);
CREATE POLICY "Brokers can update their own bids" ON public.bids FOR UPDATE USING (auth.uid() = broker_id);

-- Create RLS policies for deals
CREATE POLICY "Deal participants can view deals" ON public.deals FOR SELECT USING (
  auth.uid() = operator_id OR auth.uid() = broker_id
);
CREATE POLICY "Operators can create deals" ON public.deals FOR INSERT WITH CHECK (auth.uid() = operator_id);
CREATE POLICY "Deal participants can update deals" ON public.deals FOR UPDATE USING (
  auth.uid() = operator_id OR auth.uid() = broker_id
);

-- Create RLS policies for messages
CREATE POLICY "Deal participants can view messages" ON public.messages FOR SELECT USING (
  auth.uid() IN (SELECT operator_id FROM public.deals WHERE id = deal_id) OR
  auth.uid() IN (SELECT broker_id FROM public.deals WHERE id = deal_id)
);
CREATE POLICY "Deal participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  auth.uid() IN (
    SELECT operator_id FROM public.deals WHERE id = deal_id
    UNION
    SELECT broker_id FROM public.deals WHERE id = deal_id
  )
);

-- Create RLS policies for payments
CREATE POLICY "Deal participants can view payments" ON public.payments FOR SELECT USING (
  auth.uid() = payer_id OR
  auth.uid() IN (SELECT operator_id FROM public.deals WHERE id = deal_id) OR
  auth.uid() IN (SELECT broker_id FROM public.deals WHERE id = deal_id)
);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = payer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aircraft_updated_at
  BEFORE UPDATE ON public.aircraft
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bids_updated_at
  BEFORE UPDATE ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'broker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_aircraft_operator_id ON public.aircraft(operator_id);
CREATE INDEX idx_aircraft_availability ON public.aircraft(availability_status);
CREATE INDEX idx_listings_status ON public.marketplace_listings(status);
CREATE INDEX idx_listings_operator ON public.marketplace_listings(operator_id);
CREATE INDEX idx_bids_listing ON public.bids(listing_id);
CREATE INDEX idx_bids_broker ON public.bids(broker_id);
CREATE INDEX idx_deals_operator ON public.deals(operator_id);
CREATE INDEX idx_deals_broker ON public.deals(broker_id);
CREATE INDEX idx_messages_deal ON public.messages(deal_id);
CREATE INDEX idx_payments_deal ON public.payments(deal_id);