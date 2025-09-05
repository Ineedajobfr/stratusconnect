-- Create content management tables
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(page_name, section_key)
);

-- Enable RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view content" 
ON public.page_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage content" 
ON public.page_content 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Insert default content for existing pages
INSERT INTO public.page_content (page_name, section_key, content, content_type) VALUES
('home', 'hero_title', 'Professional Aviation Terminal', 'text'),
('home', 'hero_subtitle', 'Connecting verified operators, brokers, and crew in a secure, compliant ecosystem built for aviation professionals.', 'text'),
('about', 'title', 'About Stratus Connect', 'text'),
('about', 'description', 'Stratus Connect is the professional aviation terminal where verified operators, brokers, and crew connect in a secure, compliant ecosystem. Our platform ensures every interaction meets the highest standards of aviation professionalism and regulatory compliance.', 'text'),
('privacy', 'title', 'Privacy Policy', 'text'),
('terms', 'title', 'Terms and Conditions', 'text'),
('security', 'title', 'Security Features', 'text'),
('security', 'subtitle', 'Your security is our foundation. Every layer of our platform is built with enterprise-grade protection.', 'text');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();