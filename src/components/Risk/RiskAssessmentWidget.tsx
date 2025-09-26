// Risk Assessment Widget - Industry Standard
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Plane, 
  Users, 
  MapPin, 
  Cloud,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';
import { riskAssessmentService, type RiskFactors, type RiskAssessment } from '@/lib/risk-assessment-service';
import { toast } from '@/hooks/use-toast';

interface RiskAssessmentWidgetProps {
  rfqId?: string;
  aircraft?: string;
  route?: {
    from: string;
    to: string;
    waypoints: string[];
  };
  onRiskChange?: (assessment: RiskAssessment) => void;
  className?: string;
}

export function RiskAssessmentWidget({ 
  rfqId, 
  aircraft = 'Gulfstream G650',
  route = { from: 'KJFK', to: 'KLAX', waypoints: [] },
  onRiskChange,
  className = ''
}: RiskAssessmentWidgetProps) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (rfqId || aircraft) {
      performRiskAssessment();
    }
  }, [rfqId, aircraft, route]);

  const performRiskAssessment = async () => {
    try {
      setLoading(true);
      
      // Create mock risk factors for demonstration
      const factors: RiskFactors = {
        aircraft: {
          type: aircraft,
          age: Math.floor(Math.random() * 15) + 5, // 5-20 years
          maintenance: {
            lastInspection: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            hoursSinceInspection: Math.floor(Math.random() * 100),
            airworthinessDirectives: Math.floor(Math.random() * 3),
            incidents: Math.floor(Math.random() * 2)
          },
          operator: {
            id: 'op-001',
            name: 'Elite Aviation',
            rating: 4.2 + Math.random() * 0.6, // 4.2-4.8
            experience: Math.floor(Math.random() * 10) + 5, // 5-15 years
            fleetSize: Math.floor(Math.random() * 20) + 5, // 5-25 aircraft
            safetyRecord: {
              incidents: Math.floor(Math.random() * 3),
              accidents: 0,
              violations: Math.floor(Math.random() * 2),
              lastIncident: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : null
            }
          }
        },
        route: {
          from: route.from,
          to: route.to,
          waypoints: route.waypoints,
          distance: Math.floor(Math.random() * 3000) + 1000, // 1000-4000 nm
          airspace: ['civilian', 'controlled'],
          terrain: ['flat', 'mountainous', 'coastal', 'urban'][Math.floor(Math.random() * 4)] as any,
          weather: {
            conditions: Math.random() > 0.7 ? ['TS', 'RA'] : ['CLR'],
            wind: Math.floor(Math.random() * 30) + 5, // 5-35 knots
            visibility: Math.floor(Math.random() * 10) + 1, // 1-10 SM
            ceiling: Math.floor(Math.random() * 10000) + 1000 // 1000-11000 ft
          }
        },
        flight: {
          duration: Math.floor(Math.random() * 8) + 2, // 2-10 hours
          timeOfDay: ['day', 'night', 'dawn', 'dusk'][Math.floor(Math.random() * 4)] as any,
          season: ['spring', 'summer', 'fall', 'winter'][Math.floor(Math.random() * 4)] as any,
          specialEvents: []
        },
        crew: {
          captain: {
            experience: Math.floor(Math.random() * 15) + 5, // 5-20 years
            certifications: ['ATP', 'Type Rating'],
            recentTraining: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            hours: Math.floor(Math.random() * 5000) + 1000 // 1000-6000 hours
          },
          firstOfficer: {
            experience: Math.floor(Math.random() * 10) + 2, // 2-12 years
            certifications: ['Commercial', 'Instrument'],
            recentTraining: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            hours: Math.floor(Math.random() * 3000) + 500 // 500-3500 hours
          }
        }
      };
      
      const result = await riskAssessmentService.assessRisk(factors);
      setAssessment(result);
      
      if (onRiskChange) {
        onRiskChange(result);
      }
      
      toast({
        title: "Risk Assessment Complete",
        description: `Overall risk level: ${result.riskLevel}`,
      });
    } catch (error) {
      console.error('Error performing risk assessment:', error);
      toast({
        title: "Risk Assessment Error",
        description: "Failed to perform risk assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'severe': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'moderate': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'severe': return <XCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'aircraft': return <Plane className="w-4 h-4" />;
      case 'operator': return <Users className="w-4 h-4" />;
      case 'route': return <MapPin className="w-4 h-4" />;
      case 'weather': return <Cloud className="w-4 h-4" />;
      case 'crew': return <Users className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className={`terminal-card ${className}`}>
        <CardContent className="text-center py-12">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-accent" />
          <p className="text-gunmetal">Performing risk assessment...</p>
        </CardContent>
      </Card>
    );
  }

  if (!assessment) {
    return (
      <Card className={`terminal-card ${className}`}>
        <CardContent className="text-center py-12">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-30 text-gunmetal" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Risk Assessment</h3>
          <p className="text-gunmetal mb-4">Click to perform risk assessment</p>
          <Button onClick={performRiskAssessment} className="btn-terminal-accent">
            <Shield className="w-4 h-4 mr-2" />
            Assess Risk
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Risk Assessment
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getRiskColor(assessment.riskLevel)}>
                <div className="flex items-center gap-1">
                  {getRiskIcon(assessment.riskLevel)}
                  {assessment.riskLevel.toUpperCase()}
                </div>
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {assessment.overallScore}/100
              </div>
              <Progress 
                value={assessment.overallScore} 
                className="w-full h-2 mb-2"
              />
              <p className="text-sm text-gunmetal">
                Overall Safety Score
              </p>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(assessment.categories).map(([category, data]) => (
                <div key={category} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {getCategoryIcon(category)}
                    <span className="text-sm font-medium text-foreground capitalize">
                      {category}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {data.score}
                  </div>
                  <Progress value={data.score} className="w-full h-1" />
                </div>
              ))}
            </div>

            {/* Alerts */}
            {assessment.alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  Safety Alerts
                </h4>
                {assessment.alerts.map((alert) => (
                  <div key={alert.id} className="p-3 border border-terminal-border rounded-lg bg-terminal-card/30">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-foreground text-sm">{alert.title}</h5>
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gunmetal mb-1">{alert.description}</p>
                        <p className="text-xs text-accent">{alert.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed View */}
            {showDetails && (
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Detailed Analysis</h4>
                
                {Object.entries(assessment.categories).map(([category, data]) => (
                  <div key={category} className="p-3 border border-terminal-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(category)}
                      <span className="font-medium text-foreground capitalize">{category}</span>
                      <Badge className="ml-auto">
                        {data.score}/100
                      </Badge>
                    </div>
                    
                    {data.factors.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-gunmetal mb-1">Risk Factors:</p>
                        <ul className="text-xs text-gunmetal space-y-1">
                          {data.factors.map((factor, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-red-400" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {data.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm text-gunmetal mb-1">Recommendations:</p>
                        <ul className="text-xs text-accent space-y-1">
                          {data.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {/* Compliance Status */}
                <div className="p-3 border border-terminal-border rounded-lg">
                  <h5 className="font-medium text-foreground mb-2">Compliance Status</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {assessment.compliance.fca ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span>FCA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assessment.compliance.easa ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span>EASA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assessment.compliance.faa ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span>FAA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {assessment.compliance.icao ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span>ICAO</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={performRiskAssessment}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reassess
              </Button>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
