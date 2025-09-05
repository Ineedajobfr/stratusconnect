-- Add market intelligence and analytics tables
CREATE TABLE public.market_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route TEXT NOT NULL,
  aircraft_type TEXT NOT NULL,
  avg_price NUMERIC NOT NULL,
  min_price NUMERIC NOT NULL,
  max_price NUMERIC NOT NULL,
  listing_count INTEGER NOT NULL,
  demand_score NUMERIC DEFAULT 0,
  trend_direction TEXT DEFAULT 'stable', -- 'up', 'down', 'stable'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add fleet utilization tracking
CREATE TABLE public.aircraft_utilization (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aircraft_id UUID NOT NULL,
  flight_hours NUMERIC NOT NULL,
  revenue_generated NUMERIC NOT NULL,
  utilization_percentage NUMERIC NOT NULL,
  maintenance_due_date TIMESTAMP WITH TIME ZONE,
  last_flight_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'maintenance', 'unavailable'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add professional ratings and reputation system
CREATE TABLE public.user_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rated_user_id UUID NOT NULL,
  rater_user_id UUID NOT NULL,
  deal_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL, -- 'communication', 'reliability', 'professionalism', 'timeliness'
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(rater_user_id, deal_id, category)
);

-- Add professional achievements and badges
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL, -- 'deals_completed', 'perfect_rating', 'verified_operator', 'top_broker', 'safety_excellence'
  achievement_name TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Add performance metrics tracking
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL, -- 'response_rate', 'deal_closure_rate', 'avg_rating', 'total_revenue'
  metric_value NUMERIC NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add maintenance scheduling
CREATE TABLE public.maintenance_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aircraft_id UUID NOT NULL,
  maintenance_type TEXT NOT NULL, -- 'annual', '100hr', 'progressive', 'repair'
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_duration_hours INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  cost_estimate NUMERIC,
  actual_cost NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aircraft_utilization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for market_analytics (public read access for market intelligence)
CREATE POLICY "Everyone can view market analytics"
ON public.market_analytics
FOR SELECT
USING (true);

-- RLS Policies for aircraft_utilization
CREATE POLICY "Operators can view their aircraft utilization"
ON public.aircraft_utilization
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM aircraft a
    WHERE a.id = aircraft_utilization.aircraft_id
    AND a.operator_id = auth.uid()
  )
);

CREATE POLICY "Operators can manage their aircraft utilization"
ON public.aircraft_utilization
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM aircraft a
    WHERE a.id = aircraft_utilization.aircraft_id
    AND a.operator_id = auth.uid()
  )
);

-- RLS Policies for user_ratings
CREATE POLICY "Users can view ratings about themselves"
ON public.user_ratings
FOR SELECT
USING (rated_user_id = auth.uid());

CREATE POLICY "Deal participants can rate each other"
ON public.user_ratings
FOR INSERT
WITH CHECK (
  rater_user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM deals d
    WHERE d.id = user_ratings.deal_id
    AND (d.operator_id = auth.uid() OR d.broker_id = auth.uid())
    AND d.status = 'completed'
  )
);

CREATE POLICY "Users can view ratings for completed deals"
ON public.user_ratings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deals d
    WHERE d.id = user_ratings.deal_id
    AND (d.operator_id = auth.uid() OR d.broker_id = auth.uid())
  )
);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view all achievements"
ON public.user_achievements
FOR SELECT
USING (true);

CREATE POLICY "System can manage achievements"
ON public.user_achievements
FOR ALL
USING (true);

-- RLS Policies for performance_metrics
CREATE POLICY "Users can view their own performance metrics"
ON public.performance_metrics
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can manage performance metrics"
ON public.performance_metrics
FOR ALL
USING (true);

-- RLS Policies for maintenance_schedules
CREATE POLICY "Operators can manage their maintenance schedules"
ON public.maintenance_schedules
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM aircraft a
    WHERE a.id = maintenance_schedules.aircraft_id
    AND a.operator_id = auth.uid()
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_market_analytics_updated_at
BEFORE UPDATE ON public.market_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aircraft_utilization_updated_at
BEFORE UPDATE ON public.aircraft_utilization
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_schedules_updated_at
BEFORE UPDATE ON public.maintenance_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_market_analytics_route ON public.market_analytics(route);
CREATE INDEX idx_market_analytics_aircraft_type ON public.market_analytics(aircraft_type);
CREATE INDEX idx_market_analytics_created_at ON public.market_analytics(created_at);
CREATE INDEX idx_aircraft_utilization_aircraft_id ON public.aircraft_utilization(aircraft_id);
CREATE INDEX idx_user_ratings_rated_user_id ON public.user_ratings(rated_user_id);
CREATE INDEX idx_user_ratings_deal_id ON public.user_ratings(deal_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX idx_maintenance_schedules_aircraft_id ON public.maintenance_schedules(aircraft_id);