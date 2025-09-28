// AI Hunter Widget - The Real Deal
// FCA Compliant Aviation Platform - No More Pretty Demos

import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plane, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  createQuote, 
  adjustPrice, 
  requestPilot, 
  requestCrew, 
  fleetAction,
  getAIInsights,
  getMarketData,
  getFleetData,
  getPilotData,
  getCrewData
} from '@/lib/server-actions';

interface Insight {
  route?: string;
  aircraft_id?: string;
  pilot_id?: string;
  crew_id?: string;
  name?: string;
  registration?: string;
  model?: string;
  predicted_demand?: number;
  optimal_price?: number;
  optimal_rate?: number;
  current_utilization?: number;
  currency: string;
  confidence: number;
  why: Array<{
    feature: string;
    weight: number;
    value: number;
    impact: string;
  }>;
  data_as_of: string;
  sample_size?: number;
  price_volatility?: number;
  market_activity?: number;
  maintenance_due?: boolean;
  next_maintenance?: string;
  completion_rate?: number;
  hours_flown?: number;
  rating?: number;
}

interface AIHunterWidgetProps {
  routes?: string[];
  aircraft_ids?: string[];
  currency?: string;
}

export default function AIHunterWidget({ 
  routes = ["EGGW-LFPB", "EGGW-LIRQ", "EGGW-LEMD"], 
  aircraft_ids = [],
  currency = "GBP" 
}: AIHunterWidgetProps) {
  const { user } = useAuth();
  const role = user?.role || 'guest';
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [role, routes.join(','), aircraft_ids.join(','), currency]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = role === 'broker' ? { routes, currency } : 
                    role === 'operator' ? { aircraft_ids, currency } : 
                    { currency };
      
      const result = await getAIInsights(role || 'broker', params);
      
      if (result.success) {
        setInsights(result.insights || []);
      } else {
        setError(result.error || 'Failed to load insights');
      }
    } catch (err) {
      setError('Failed to load insights');
      console.error('Load insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, insight: Insight) => {
    setActionLoading(action);
    
    try {
      let result;
      
      switch (action) {
        case 'create_quote':
          result = await createQuote({
            route: insight.route!,
            price: insight.optimal_price!,
            currency: insight.currency
          });
          break;
        case 'adjust_price':
          result = await adjustPrice({
            route: insight.route!,
            newPrice: insight.optimal_price!,
            currency: insight.currency
          });
          break;
        case 'request_pilot':
          result = await requestPilot({
            pilot_id: insight.pilot_id!,
            route: insight.route!,
            departure_date: new Date().toISOString(),
            rate: insight.optimal_rate!,
            currency: insight.currency
          });
          break;
        case 'request_crew':
          result = await requestCrew({
            crew_id: insight.crew_id!,
            route: insight.route!,
            departure_date: new Date().toISOString(),
            rate: insight.optimal_rate!,
            currency: insight.currency
          });
          break;
        case 'fleet_maintenance':
          result = await fleetAction({
            aircraft_id: insight.aircraft_id!,
            action: 'maintenance',
            reason: 'AI recommended maintenance'
          });
          break;
        case 'fleet_deploy':
          result = await fleetAction({
            aircraft_id: insight.aircraft_id!,
            action: 'deploy'
          });
          break;
      }
      
      if (result.success) {
        // Reload insights after action
        await loadInsights();
      } else {
        setError(result.error || 'Action failed');
      }
    } catch (err) {
      setError('Action failed');
      console.error('Action error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getActionButton = (insight: Insight) => {
    const isLoading = actionLoading !== null;
    
    switch (role) {
      case 'broker':
        return (
          <Button 
            onClick={() => handleAction('create_quote', insight)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Create Quote at This Price'}
          </Button>
        );
      case 'operator':
        if (insight.aircraft_id) {
          return (
            <div className="flex gap-2">
              <Button 
                onClick={() => handleAction('adjust_price', insight)}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? 'Adjusting...' : 'Set New Price'}
              </Button>
              {insight.maintenance_due && (
                <Button 
                  onClick={() => handleAction('fleet_maintenance', insight)}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  Schedule Maintenance
                </Button>
              )}
            </div>
          );
        }
        return null;
      case 'pilot':
        return (
          <Button 
            onClick={() => handleAction('request_pilot', insight)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Requesting...' : 'Request This Pilot'}
          </Button>
        );
      case 'crew':
        return (
          <Button 
            onClick={() => handleAction('request_crew', insight)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Requesting...' : 'Request This Crew'}
          </Button>
        );
      default:
        return null;
    }
  };

  const getInsightTitle = () => {
    switch (role) {
      case 'broker': return 'Market Calls';
      case 'operator': return 'Fleet Intelligence';
      case 'pilot': return 'Pilot Opportunities';
      case 'crew': return 'Crew Opportunities';
      default: return 'AI Insights';
    }
  };

  const getInsightIcon = () => {
    switch (role) {
      case 'broker': return <TrendingUp className="w-5 h-5" />;
      case 'operator': return <Plane className="w-5 h-5" />;
      case 'pilot': return <Users className="w-5 h-5" />;
      case 'crew': return <Users className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getInsightIcon()}
            {getInsightTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getInsightIcon()}
            {getInsightTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getInsightIcon()}
          {getInsightTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No insights available</p>
              <p className="text-sm">Check back later for market intelligence</p>
            </div>
          ) : (
            insights.map((insight, index) => (
              <Card key={index} className="terminal-card border-terminal-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {role === 'broker' ? 'Route' : 
                         role === 'operator' ? 'Aircraft' : 
                         'Professional'}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {insight.route || insight.registration || insight.name}
                      </p>
                      {insight.model && (
                        <p className="text-sm text-muted-foreground">{insight.model}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {role === 'broker' ? 'Optimal Price' : 
                         role === 'operator' ? 'Optimal Rate' : 
                         'Recommended Rate'}
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {new Intl.NumberFormat('en-GB', { 
                          style: 'currency', 
                          currency: insight.currency 
                        }).format(insight.optimal_price || insight.optimal_rate || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">
                        {role === 'broker' ? 'Predicted Demand' : 
                         role === 'operator' ? 'Utilization' : 
                         'Rating'}
                      </p>
                      <p className="text-foreground font-medium">
                        {role === 'broker' ? insight.predicted_demand : 
                         role === 'operator' ? `${Math.round((insight.current_utilization || 0) * 100)}%` : 
                         insight.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Confidence</p>
                      <p className="text-foreground font-medium">
                        {Math.round((insight.confidence || 0) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data as of</p>
                      <p className="text-foreground font-medium">
                        {new Date(insight.data_as_of).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Why</Badge>
                      <div className="text-xs text-muted-foreground">
                        {insight.why.slice(0, 2).map(w => 
                          `${w.feature} ${Math.round(w.weight * 100)}%`
                        ).join(' · ')}
                      </div>
                    </div>
                  </div>

                  {insight.why.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-2">Key Factors:</p>
                      <div className="space-y-1">
                        {insight.why.slice(0, 3).map((factor, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{factor.feature}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-foreground">{factor.impact}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(factor.weight * 100)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {getActionButton(insight)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
