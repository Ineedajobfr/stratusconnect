-- Create job_posts table for job board functionality
-- This migration creates the missing job_posts table that the job board workflow expects

-- Job Categories Table
CREATE TABLE IF NOT EXISTS public.job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Board Posts Table
CREATE TABLE IF NOT EXISTS public.job_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    job_type TEXT NOT NULL CHECK (job_type IN ('pilot', 'crew', 'both')),
    category_id UUID REFERENCES public.job_categories(id),
    posted_by UUID NOT NULL REFERENCES public.profiles(id),
    company_id UUID REFERENCES public.companies(id),
    location TEXT,
    start_date DATE,
    end_date DATE,
    duration_days INTEGER,
    hourly_rate DECIMAL(10,2),
    total_budget DECIMAL(12,2),
    required_skills TEXT[],
    preferred_skills TEXT[],
    minimum_experience_years INTEGER DEFAULT 0,
    aircraft_types TEXT[],
    flight_hours_required INTEGER,
    certifications_required TEXT[],
    languages_required TEXT[],
    timezone TEXT,
    remote_work_allowed BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'filled')),
    application_deadline TIMESTAMP WITH TIME ZONE,
    max_applications INTEGER,
    current_applications INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('general', 'technical', 'safety', 'regulations', 'career', 'events')),
    tags TEXT[],
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Comments Table
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.community_comments(id),
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Crew Table
CREATE TABLE IF NOT EXISTS public.saved_crew (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    crew_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, crew_id)
);

-- Enable RLS on all tables
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_crew ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_categories
CREATE POLICY "Anyone can view job categories" ON public.job_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage job categories" ON public.job_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for job_posts
CREATE POLICY "Anyone can view active job posts" ON public.job_posts FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view their own job posts" ON public.job_posts FOR SELECT USING (posted_by = auth.uid());
CREATE POLICY "Users can create job posts" ON public.job_posts FOR INSERT WITH CHECK (posted_by = auth.uid());
CREATE POLICY "Users can update their own job posts" ON public.job_posts FOR UPDATE USING (posted_by = auth.uid());
CREATE POLICY "Users can delete their own job posts" ON public.job_posts FOR DELETE USING (posted_by = auth.uid());

-- RLS Policies for job_applications
CREATE POLICY "Users can view their own applications" ON public.job_applications FOR SELECT USING (applicant_id = auth.uid());
CREATE POLICY "Job posters can view applications for their jobs" ON public.job_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.job_posts WHERE id = job_applications.job_id AND posted_by = auth.uid())
);
CREATE POLICY "Users can create applications" ON public.job_applications FOR INSERT WITH CHECK (applicant_id = auth.uid());
CREATE POLICY "Job posters can update application status" ON public.job_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.job_posts WHERE id = job_applications.job_id AND posted_by = auth.uid())
);

-- RLS Policies for community_posts
CREATE POLICY "Anyone can view active community posts" ON public.community_posts FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create community posts" ON public.community_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update their own community posts" ON public.community_posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Users can delete their own community posts" ON public.community_posts FOR DELETE USING (author_id = auth.uid());

-- RLS Policies for community_comments
CREATE POLICY "Anyone can view community comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Users can create community comments" ON public.community_comments FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update their own community comments" ON public.community_comments FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Users can delete their own community comments" ON public.community_comments FOR DELETE USING (author_id = auth.uid());

-- RLS Policies for saved_crew
CREATE POLICY "Users can view their own saved crew" ON public.saved_crew FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own saved crew" ON public.saved_crew FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_job_posts_posted_by ON public.job_posts(posted_by);
CREATE INDEX idx_job_posts_status ON public.job_posts(status);
CREATE INDEX idx_job_posts_job_type ON public.job_posts(job_type);
CREATE INDEX idx_job_posts_created_at ON public.job_posts(created_at);
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX idx_community_posts_author_id ON public.community_posts(author_id);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at);
CREATE INDEX idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX idx_saved_crew_user_id ON public.saved_crew(user_id);

-- Add updated_at triggers
CREATE TRIGGER update_job_categories_updated_at BEFORE UPDATE ON public.job_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_posts_updated_at BEFORE UPDATE ON public.job_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON public.community_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_crew_updated_at BEFORE UPDATE ON public.saved_crew FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default job categories
INSERT INTO public.job_categories (name, description, icon) VALUES
('Pilot', 'Commercial and private pilot positions', '✈️'),
('Crew', 'Flight attendant and cabin crew positions', '👥'),
('Maintenance', 'Aircraft maintenance and engineering', '🔧'),
('Operations', 'Ground operations and dispatch', '📋'),
('Management', 'Aviation management positions', '👔'),
('Training', 'Flight training and instruction', '📚')
ON CONFLICT (name) DO NOTHING;
