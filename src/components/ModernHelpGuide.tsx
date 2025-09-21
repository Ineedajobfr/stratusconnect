import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  HelpCircle, 
  Shield, 
  Plane, 
  BarChart3, 
  MessageSquare,
  Globe,
  DollarSign,
  CheckCircle,
  Lock,
  ArrowRight,
  Info,
  Users,
  Calendar,
  Award,
  Briefcase,
  Clock,
  MapPin
} from 'lucide-react';

interface HelpStep {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  status?: 'locked' | 'available' | 'completed';
  action?: string;
}

interface HelpContent {
  title: string;
  description: string;
  steps: HelpStep[];
  quickTips?: string[];
  demoNote?: string;
}

interface ModernHelpGuideProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  activeTab: string;
  onClose?: () => void;
  showOnMount?: boolean;
  isDemo?: boolean;
}

export const ModernHelpGuide: React.FC<ModernHelpGuideProps> = ({
  terminalType,
  activeTab,
  onClose,
  showOnMount = false,
  isDemo = false
}) => {
  const [isVisible, setIsVisible] = useState(showOnMount);
  const [hasBeenShown, setHasBeenShown] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (showOnMount || isDemo) {
      setIsVisible(true);
    } else if (!hasBeenShown.has(`${terminalType}-${activeTab}`)) {
      setIsVisible(true);
      setHasBeenShown(prev => new Set([...prev, `${terminalType}-${activeTab}`]));
    }
  }, [activeTab, terminalType, showOnMount, isDemo, hasBeenShown]);

  const getHelpContent = (): HelpContent => {
    const baseContent = {
      title: `${terminalType.charAt(0).toUpperCase() + terminalType.slice(1)} Terminal Guide`,
      description: `Navigate and utilize your ${terminalType} terminal effectively`,
      quickTips: [
        "Use the tabs above to navigate between different sections",
        "Click on cards and data tiles for detailed information",
        "Real-time aircraft tracking shows live flight positions",
        "Personalized feed provides role-specific updates and insights"
      ]
    };

    const terminalSpecificContent = {
      broker: {
        steps: [
          {
            title: "Marketplace Access",
            description: "Browse and manage aircraft listings, create RFQs, and track deals",
            icon: Plane,
            status: 'available' as const
          },
          {
            title: "Client Management",
            description: "Manage client relationships and communication",
            icon: Users,
            status: 'available' as const
          },
          {
            title: "Deal Tracking",
            description: "Monitor active deals and payment status",
            icon: BarChart3,
            status: 'available' as const
          },
          {
            title: "Trust & Verification",
            description: "Access verification systems and compliance tools",
            icon: Shield,
            status: 'available' as const
          }
        ]
      },
      operator: {
        steps: [
          {
            title: "Fleet Management",
            description: "Manage your aircraft fleet and availability",
            icon: Plane,
            status: 'available' as const
          },
          {
            title: "Booking Management",
            description: "Handle incoming bookings and scheduling",
            icon: Calendar,
            status: 'available' as const
          },
          {
            title: "Crew Coordination",
            description: "Manage pilot and crew assignments",
            icon: Users,
            status: 'available' as const
          },
          {
            title: "Analytics & Reports",
            description: "View performance metrics and financial reports",
            icon: BarChart3,
            status: 'available' as const
          }
        ]
      },
      pilot: {
        steps: [
          {
            title: "Flight Schedule",
            description: "View upcoming flights and assignments",
            icon: Calendar,
            status: 'available' as const
          },
          {
            title: "Job Pipeline",
            description: "Browse and apply for available positions",
            icon: Briefcase,
            status: 'available' as const
          },
          {
            title: "Certifications",
            description: "Manage licenses and certifications",
            icon: Award,
            status: 'available' as const
          },
          {
            title: "Earnings Tracking",
            description: "Monitor flight earnings and payments",
            icon: DollarSign,
            status: 'available' as const
          }
        ]
      },
      crew: {
        steps: [
          {
            title: "Assignments",
            description: "View upcoming crew assignments and duties",
            icon: Calendar,
            status: 'available' as const
          },
          {
            title: "Job Requests",
            description: "Browse available crew positions",
            icon: Briefcase,
            status: 'available' as const
          },
          {
            title: "Certifications",
            description: "Manage crew certifications and training",
            icon: Award,
            status: 'available' as const
          },
          {
            title: "Availability",
            description: "Set your availability and schedule preferences",
            icon: Clock,
            status: 'available' as const
          }
        ]
      }
    };

    return {
      ...baseContent,
      ...terminalSpecificContent[terminalType],
      demoNote: isDemo ? "This is a demo terminal with sample data. Features are simulated for demonstration purposes." : undefined
    };
  };

  const content = getHelpContent();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-2xl max-h-[90vh] bg-terminal-card border-terminal-border shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <HelpCircle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">{content.title}</CardTitle>
              <p className="text-sm text-gunmetal mt-1">{content.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="text-gunmetal hover:text-foreground hover:bg-terminal-border/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Tips */}
          {content.quickTips && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-accent" />
                Quick Tips
              </h3>
              <div className="grid gap-2">
                {content.quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-gunmetal">
                    <ArrowRight className="h-3 w-3 text-accent mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Features */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-terminal-success" />
              Key Features
            </h3>
            <div className="grid gap-3">
              {content.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-terminal-bg/50 border border-terminal-border/50 hover:border-terminal-border transition-colors">
                  <div className="p-2 bg-accent/20 rounded-lg flex-shrink-0">
                    {step.icon && <step.icon className="h-4 w-4 text-accent" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{step.title}</h4>
                    <p className="text-xs text-gunmetal mt-1">{step.description}</p>
                    {step.action && (
                      <Badge variant="outline" className="text-xs mt-2 border-accent/30 text-accent">
                        {step.action}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Note */}
          {content.demoNote && (
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-accent">{content.demoNote}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-terminal-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className="text-gunmetal border-terminal-border hover:bg-terminal-border/50"
            >
              Got it
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className="btn-terminal-accent"
            >
              Start Exploring
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
