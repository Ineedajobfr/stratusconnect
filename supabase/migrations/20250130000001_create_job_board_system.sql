-- Job Board System Migration
-- Creates comprehensive job posting and application system

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
    posted_by UUID NOT NULL REFERENCES auth.users(id),
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
    job_post_id UUID NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES auth.users(id),
    cover_letter TEXT,
    proposed_rate DECIMAL(10,2),
    availability_start DATE,
    availability_end DATE,
    relevant_experience TEXT,
    additional_skills TEXT[],
    portfolio_urls TEXT[],
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected', 'withdrawn')),
    application_score INTEGER CHECK (application_score BETWEEN 0 AND 100),
    skills_match_percentage INTEGER CHECK (skills_match_percentage BETWEEN 0 AND 100),
    experience_match_percentage INTEGER CHECK (experience_match_percentage BETWEEN 0 AND 100),
    notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Application Messages Table
CREATE TABLE IF NOT EXISTS public.job_application_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    message TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'message' CHECK (message_type IN ('message', 'question', 'answer', 'update', 'reminder')),
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Crews Table (Broker Favorites)
CREATE TABLE IF NOT EXISTS public.saved_crews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id UUID NOT NULL REFERENCES auth.users(id),
    crew_id UUID NOT NULL REFERENCES auth.users(id),
    notes TEXT,
    tags TEXT[],
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(broker_id, crew_id)
);

-- Community Forums Table
CREATE TABLE IF NOT EXISTS public.community_forums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('general', 'pilot', 'crew', 'broker', 'operator', 'technical', 'safety', 'training')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    is_public BOOLEAN DEFAULT true,
    is_moderated BOOLEAN DEFAULT false,
    member_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Members Table
CREATE TABLE IF NOT EXISTS public.forum_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forum_id UUID NOT NULL REFERENCES public.community_forums(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(forum_id, user_id)
);

-- Forum Posts Table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forum_id UUID NOT NULL REFERENCES public.community_forums(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    post_type TEXT NOT NULL DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'question', 'announcement', 'job_share', 'experience_share')),
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum Post Replies Table
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES public.forum_replies(id),
    is_solution BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity Monitoring Table
CREATE TABLE IF NOT EXISTS public.user_activity_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'job_apply', 'job_post', 'forum_post', 'message_send', 'profile_update', 'skill_update')),
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Warnings Table
CREATE TABLE IF NOT EXISTS public.user_warnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    warning_type TEXT NOT NULL CHECK (warning_type IN ('inactivity', 'undercutting', 'policy_violation', 'spam', 'inappropriate_behavior')),
    warning_level INTEGER NOT NULL CHECK (warning_level BETWEEN 1 AND 3),
    description TEXT NOT NULL,
    issued_by UUID NOT NULL REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account Termination Queue Table
CREATE TABLE IF NOT EXISTS public.account_termination_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    termination_reason TEXT NOT NULL,
    termination_date TIMESTAMP WITH TIME ZONE NOT NULL,
    warnings_count INTEGER DEFAULT 0,
    last_warning_date TIMESTAMP WITH TIME ZONE,
    grace_period_ends TIMESTAMP WITH TIME ZONE,
    is_processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_posts_posted_by ON public.job_posts(posted_by);
CREATE INDEX IF NOT EXISTS idx_job_posts_status ON public.job_posts(status);
CREATE INDEX IF NOT EXISTS idx_job_posts_job_type ON public.job_posts(job_type);
CREATE INDEX IF NOT EXISTS idx_job_posts_created_at ON public.job_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_job_posts_expires_at ON public.job_posts(expires_at);
CREATE INDEX IF NOT EXISTS idx_job_posts_company_id ON public.job_posts(company_id);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_post_id ON public.job_applications(job_post_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at);

CREATE INDEX IF NOT EXISTS idx_saved_crews_broker_id ON public.saved_crews(broker_id);
CREATE INDEX IF NOT EXISTS idx_saved_crews_crew_id ON public.saved_crews(crew_id);

CREATE INDEX IF NOT EXISTS idx_forum_posts_forum_id ON public.forum_posts(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON public.forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON public.forum_posts(created_at);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity_monitoring(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity_monitoring(created_at);

CREATE INDEX IF NOT EXISTS idx_user_warnings_user_id ON public.user_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_warnings_expires_at ON public.user_warnings(expires_at);

-- Insert default job categories
INSERT INTO public.job_categories (name, description, icon) VALUES
('Commercial Pilot', 'Commercial aviation pilot positions', '✈️'),
('Private Pilot', 'Private aircraft pilot positions', '🛩️'),
('Flight Instructor', 'Flight training and instruction positions', '👨‍🏫'),
('Crew Chief', 'Aircraft maintenance and crew management', '🔧'),
('Flight Attendant', 'Passenger service and safety positions', '👩‍✈️'),
('Ground Crew', 'Ground operations and support positions', '🚁'),
('Maintenance', 'Aircraft maintenance and repair positions', '🔨'),
('Dispatch', 'Flight planning and dispatch positions', '📋'),
('Management', 'Aviation management and operations positions', '👔'),
('Other', 'Other aviation-related positions', '📝');

-- Create RLS policies
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_application_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_termination_queue ENABLE ROW LEVEL SECURITY;

-- Job Categories Policies
CREATE POLICY "Anyone can view job categories" ON public.job_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage job categories" ON public.job_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND role = 'admin')
);

-- Job Posts Policies
CREATE POLICY "Anyone can view active job posts" ON public.job_posts FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view their own job posts" ON public.job_posts FOR SELECT USING (posted_by = (select auth.uid()));
CREATE POLICY "Brokers and operators can create job posts" ON public.job_posts FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND role IN ('broker', 'operator'))
);
CREATE POLICY "Users can update their own job posts" ON public.job_posts FOR UPDATE USING (posted_by = (select auth.uid()));
CREATE POLICY "Users can delete their own job posts" ON public.job_posts FOR DELETE USING (posted_by = (select auth.uid()));

-- Job Applications Policies
CREATE POLICY "Users can view their own applications" ON public.job_applications FOR SELECT USING (applicant_id = (select auth.uid()));
CREATE POLICY "Job posters can view applications for their jobs" ON public.job_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.job_posts WHERE id = job_post_id AND posted_by = (select auth.uid()))
);
CREATE POLICY "Pilots and crew can create applications" ON public.job_applications FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND role IN ('pilot', 'crew'))
);
CREATE POLICY "Users can update their own applications" ON public.job_applications FOR UPDATE USING (applicant_id = (select auth.uid()));
CREATE POLICY "Job posters can update applications for their jobs" ON public.job_applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.job_posts WHERE id = job_post_id AND posted_by = (select auth.uid()))
);

-- Saved Crews Policies
CREATE POLICY "Users can view their own saved crews" ON public.saved_crews FOR SELECT USING (broker_id = (select auth.uid()));
CREATE POLICY "Brokers can manage their saved crews" ON public.saved_crews FOR ALL USING (
    broker_id = (select auth.uid()) AND
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND role = 'broker')
);

-- Community Forums Policies
CREATE POLICY "Anyone can view public forums" ON public.community_forums FOR SELECT USING (is_public = true);
CREATE POLICY "Members can view private forums" ON public.community_forums FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.forum_members WHERE forum_id = id AND user_id = (select auth.uid()))
);
CREATE POLICY "Users can create forums" ON public.community_forums FOR INSERT WITH CHECK (
    created_by = (select auth.uid())
);

-- Forum Posts Policies
CREATE POLICY "Anyone can view forum posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create forum posts" ON public.forum_posts FOR INSERT WITH CHECK (author_id = (select auth.uid()));
CREATE POLICY "Users can update their own forum posts" ON public.forum_posts FOR UPDATE USING (author_id = (select auth.uid()));
CREATE POLICY "Users can delete their own forum posts" ON public.forum_posts FOR DELETE USING (author_id = (select auth.uid()));

-- User Activity Monitoring Policies
CREATE POLICY "Users can view their own activity" ON public.user_activity_monitoring FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "System can insert activity records" ON public.user_activity_monitoring FOR INSERT WITH CHECK (true);

-- User Warnings Policies
CREATE POLICY "Users can view their own warnings" ON public.user_warnings FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Admins can manage warnings" ON public.user_warnings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND role = 'admin')
);

-- Account Termination Queue Policies
CREATE POLICY "Admins can view termination queue" ON public.account_termination_queue FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = (select auth.uid()) AND role = 'admin')
);
CREATE POLICY "System can manage termination queue" ON public.account_termination_queue FOR ALL USING (true);

-- Create functions for job matching
CREATE OR REPLACE FUNCTION public.calculate_skills_match(
    required_skills TEXT[],
    applicant_skills TEXT[]
) RETURNS INTEGER AS $$
DECLARE
    match_count INTEGER;
    total_required INTEGER;
BEGIN
    total_required := array_length(required_skills, 1);
    IF total_required IS NULL OR total_required = 0 THEN
        RETURN 100;
    END IF;
    
    SELECT COUNT(*) INTO match_count
    FROM unnest(required_skills) AS req_skill
    WHERE req_skill = ANY(applicant_skills);
    
    RETURN (match_count * 100) / total_required;
END;
$$ LANGUAGE plpgsql;

-- Create function to update job post application count
CREATE OR REPLACE FUNCTION public.update_job_post_application_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.job_posts 
        SET current_applications = current_applications + 1
        WHERE id = NEW.job_post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.job_posts 
        SET current_applications = current_applications - 1
        WHERE id = OLD.job_post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application count
CREATE TRIGGER trigger_update_job_post_application_count
    AFTER INSERT OR DELETE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_job_post_application_count();

-- Create function to check for undercutting behavior
CREATE OR REPLACE FUNCTION public.check_undercutting_behavior(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    recent_applications INTEGER;
    low_rate_applications INTEGER;
    undercutting_threshold DECIMAL(10,2);
BEGIN
    -- Get recent applications count (last 30 days)
    SELECT COUNT(*) INTO recent_applications
    FROM public.job_applications ja
    JOIN public.job_posts jp ON ja.job_post_id = jp.id
    WHERE ja.applicant_id = user_id
    AND ja.created_at > NOW() - INTERVAL '30 days';
    
    -- Get applications with rates significantly below market average
    SELECT COUNT(*) INTO low_rate_applications
    FROM public.job_applications ja
    JOIN public.job_posts jp ON ja.job_post_id = jp.id
    WHERE ja.applicant_id = user_id
    AND ja.created_at > NOW() - INTERVAL '30 days'
    AND ja.proposed_rate < (jp.hourly_rate * 0.7); -- 30% below posted rate
    
    -- Check if user is undercutting (more than 50% of applications are low rate)
    IF recent_applications > 5 AND (low_rate_applications::DECIMAL / recent_applications) > 0.5 THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Create function to check user inactivity
CREATE OR REPLACE FUNCTION public.check_user_inactivity(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    last_activity TIMESTAMP WITH TIME ZONE;
    days_inactive INTEGER;
BEGIN
    SELECT MAX(created_at) INTO last_activity
    FROM public.user_activity_monitoring
    WHERE user_id = user_id;
    
    IF last_activity IS NULL THEN
        RETURN true; -- No activity recorded
    END IF;
    
    days_inactive := EXTRACT(DAYS FROM NOW() - last_activity);
    
    -- Consider inactive if no activity for 30+ days
    RETURN days_inactive >= 30;
END;
$$ LANGUAGE plpgsql;
