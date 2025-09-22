// Predictive Analytics Component
// Provides AI-powered insights and recommendations for operators and brokers

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  MapPin,
  Clock,
  DollarSign,
  Plane,
  Users,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Zap
} from 'lucide-react';

interface PredictiveAnalyticsProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  className?: string;
}

const analyticsData = {
  broker: {
    title: "Market Intelligence",
    insights: [
      {
        type: "demand_forecast",
        title: "Demand Forecast",
        description: "Charter demand expected to increase 23% next month",
        value: "+23%",
        trend: "up",
        icon: TrendingUp,
        color: "text-green-400",
        details: [
          "Transatlantic routes up 35%",
          "European domestic +18%",
          "Middle East +12%"
        ]
      },
      {
        type: "pricing_optimization",
        title: "Pricing Opportunities",
        description: "3 routes showing 15% price increase potential",
        value: "15%",
        trend: "up",
        icon: DollarSign,
        color: "text-blue-400",
        details: [
          "London-Dubai: +18% potential",
          "New York-London: +12% potential",
          "Paris-Geneva: +15% potential"
        ]
      },
      {
        type: "empty_legs",
        title: "Empty Leg Opportunities",
        description: "12 empty legs available for backhaul optimization",
        value: "12",
        trend: "neutral",
        icon: Plane,
        color: "text-purple-400",
        details: [
          "Gulfstream G650: London-Dubai",
          "Global 6000: Paris-New York",
          "Challenger 350: Geneva-London"
        ]
      }
    ],
    recommendations: [
      {
        title: "Focus on Transatlantic Routes",
        description: "High demand and pricing potential for next 30 days",
        impact: "High",
        action: "Increase marketing for LHR-JFK routes"
      },
      {
        title: "Partner with Premium Operators",
        description: "3 ARGUS Platinum operators expanding in your region",
        impact: "Medium",
        action: "Reach out to Elite Aviation Group"
      }
    ]
  },
  operator: {
    title: "Fleet Optimization",
    insights: [
      {
        type: "utilization",
        title: "Fleet Utilization",
        description: "Current utilization at 78%, optimal positioning recommended",
        value: "78%",
        trend: "up",
        icon: BarChart3,
        color: "text-green-400",
        details: [
          "Gulfstream G550: 85% utilization",
          "Challenger 350: 72% utilization",
          "Global 6000: 76% utilization"
        ]
      },
      {
        type: "positioning",
        title: "Aircraft Positioning",
        description: "Move N425SC to Miami for 40% higher demand",
        value: "40%",
        trend: "up",
        icon: MapPin,
        color: "text-blue-400",
        details: [
          "Miami-London: 15 requests/week",
          "Miami-Paris: 12 requests/week",
          "Current location: 8 requests/week"
        ]
      },
      {
        type: "crew_optimization",
        title: "Crew Efficiency",
        description: "2 additional crew members needed for peak season",
        value: "2",
        trend: "neutral",
        icon: Users,
        color: "text-orange-400",
        details: [
          "Gulfstream G550 Captain needed",
          "Cabin crew for long-haul flights",
          "Contract pilots available in Miami"
        ]
      }
    ],
    recommendations: [
      {
        title: "Reposition to Miami",
        description: "40% higher demand and better pricing in Miami market",
        impact: "High",
        action: "Schedule repositioning flight for next week"
      },
      {
        title: "Hire Additional Crew",
        description: "Peak season approaching, need 2 more crew members",
        impact: "High",
        action: "Post crew positions on StratusConnect"
      }
    ]
  },
  pilot: {
    title: "Career Insights",
    insights: [
      {
        type: "job_opportunities",
        title: "Job Opportunities",
        description: "15 new positions matching your profile this week",
        value: "15",
        trend: "up",
        icon: Target,
        color: "text-green-400",
        details: [
          "Gulfstream G650: 5 positions",
          "Global 6000: 4 positions",
          "Challenger 350: 6 positions"
        ]
      },
      {
        type: "market_demand",
        title: "Market Demand",
        description: "Gulfstream pilots in high demand, rates up 12%",
        value: "12%",
        trend: "up",
        icon: TrendingUp,
        color: "text-blue-400",
        details: [
          "Gulfstream G650: $850/day average",
          "Gulfstream G550: $750/day average",
          "Global 6000: $700/day average"
        ]
      },
      {
        type: "skill_gaps",
        title: "Skill Development",
        description: "Type rating in Global 6000 could increase opportunities 35%",
        value: "35%",
        trend: "up",
        icon: Lightbulb,
        color: "text-purple-400",
        details: [
          "Global 6000 type rating needed",
          "Long-haul experience preferred",
          "Multi-language skills valuable"
        ]
      }
    ],
    recommendations: [
      {
        title: "Apply for Gulfstream Positions",
        description: "High demand and premium rates for your aircraft type",
        impact: "High",
        action: "Update availability and apply to 5 positions"
      },
      {
        title: "Consider Type Rating",
        description: "Global 6000 rating would significantly expand opportunities",
        impact: "Medium",
        action: "Research training programs in your area"
      }
    ]
  },
  crew: {
    title: "Assignment Intelligence",
    insights: [
      {
        type: "assignment_opportunities",
        title: "Assignment Opportunities",
        description: "8 new assignments matching your specialties this week",
        value: "8",
        trend: "up",
        icon: Target,
        color: "text-green-400",
        details: [
          "VIP Service: 3 assignments",
          "Long-haul: 2 assignments",
          "Corporate: 3 assignments"
        ]
      },
      {
        type: "specialty_demand",
        title: "Specialty Demand",
        description: "French language skills in high demand, rates up 20%",
        value: "20%",
        trend: "up",
        icon: TrendingUp,
        color: "text-blue-400",
        details: [
          "French speakers: $400/day average",
          "German speakers: $350/day average",
          "Arabic speakers: $450/day average"
        ]
      },
      {
        type: "availability_optimization",
        title: "Availability Optimization",
        description: "Weekend availability could increase assignments 60%",
        value: "60%",
        trend: "up",
        icon: Calendar,
        color: "text-purple-400",
        details: [
          "Weekend flights: High demand",
          "Holiday periods: Premium rates",
          "Last-minute assignments: +40% pay"
        ]
      }
    ],
    recommendations: [
      {
        title: "Update Language Skills",
        description: "French language skills could increase your rates by 20%",
        impact: "High",
        action: "Consider language certification courses"
      },
      {
        title: "Expand Weekend Availability",
        description: "Weekend assignments offer 60% more opportunities",
        impact: "Medium",
        action: "Update availability calendar for weekends"
      }
    ]
  }
};

export default function PredictiveAnalytics({ terminalType, className = "" }: PredictiveAnalyticsProps) {
  const [activeInsight, setActiveInsight] = useState(0);
  const data = analyticsData[terminalType];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Analytics Card */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">{data.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-powered insights and recommendations for optimal performance
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.insights.map((insight, index) => (
              <Card 
                key={index} 
                className={`terminal-card cursor-pointer transition-all duration-200 hover:terminal-glow ${
                  activeInsight === index ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => setActiveInsight(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <insight.icon className={`w-8 h-8 ${insight.color}`} />
                    <div className="flex items-center space-x-1">
                      {insight.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-400" />}
                      {insight.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-400" />}
                      <span className="text-2xl font-bold text-foreground">{insight.value}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Insight */}
          {data.insights[activeInsight] && (
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {React.createElement(data.insights[activeInsight].icon, { 
                    className: `w-5 h-5 ${data.insights[activeInsight].color}` 
                  })}
                  <span>{data.insights[activeInsight].title} Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.insights[activeInsight].details.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="terminal-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                <span>AI Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-accent/10 rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={rec.impact === 'High' ? 'destructive' : rec.impact === 'Medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <Button size="sm" variant="outline" className="text-xs">
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span>Market Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Charter Demand</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">+15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Pricing</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">+8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Empty Legs</span>
                <div className="flex items-center space-x-1">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">-12%</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Crew Availability</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">+22%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <div className="flex items-center space-x-1">
                  <TrendingDown className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">-18%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">+5%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
