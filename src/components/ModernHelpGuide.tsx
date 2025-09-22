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
  MapPin,
  Search,
  FileText
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
      description: `Master your ${terminalType} terminal with these essential features and workflows`,
      quickTips: [
        "Navigate between sections using the tab bar at the top",
        "Click on any card or data tile to access detailed information",
        "Use real-time tracking to monitor aircraft positions and status",
        "Check your personalized feed for role-specific updates and opportunities"
      ]
    };

    const terminalSpecificContent = {
      broker: {
        title: "Broker Terminal Guide",
        description: "Master the broker workflow: from RFQ creation to deal completion",
        quickTips: [
          "Start in Dashboard to see your active deals and market overview",
          "Use RFQs & Quotes tab to create new requests and compare operator quotes",
          "Marketplace shows available aircraft and empty legs you can book immediately",
          "Saved Searches automatically alert you to price drops and new opportunities",
          "Flight Tracking lets you monitor your client's flights in real-time",
          "Reputation tab shows your performance metrics and ranking among brokers",
          "Billing section handles invoicing, payments, and financial statements"
        ],
        steps: [
          {
            title: "Dashboard Overview",
            description: "Your command center showing active deals, market trends, and performance metrics. Track your success rate and earnings here.",
            icon: BarChart3,
            status: 'available' as const
          },
          {
            title: "RFQ Creation & Quote Management",
            description: "Create detailed flight requests for your clients. Compare operator quotes side-by-side and negotiate the best deals.",
            icon: Plane,
            status: 'available' as const
          },
          {
            title: "Marketplace & Saved Searches",
            description: "Browse available aircraft and empty legs. Set up automated alerts for price drops and route availability.",
            icon: Search,
            status: 'available' as const
          },
          {
            title: "Real-Time Flight Tracking",
            description: "Monitor your client's flights live. Track aircraft positions, delays, and provide real-time updates to clients.",
            icon: Globe,
            status: 'available' as const
          },
          {
            title: "Reputation & Ranking System",
            description: "Build your broker reputation through successful deals. Higher rankings unlock premium features and better operator relationships.",
            icon: Award,
            status: 'available' as const
          },
          {
            title: "Billing & Financial Management",
            description: "Handle invoicing, track payments, and manage your commission structure. All transactions are FCA compliant.",
            icon: DollarSign,
            status: 'available' as const
          }
        ]
      },
      operator: {
        title: "Operator Terminal Guide",
        description: "Maximize your fleet utilization and manage operations efficiently",
        quickTips: [
          "Dashboard shows your fleet status, bookings, and performance metrics",
          "Requests tab displays incoming broker RFQs - respond quickly to win deals",
          "Fleet tab manages aircraft availability, maintenance, and positioning",
          "Crew tab helps you find and hire qualified pilots and cabin crew",
          "Analytics tab tracks utilization rates, revenue, and operational efficiency",
          "Flight Tracking monitors your aircraft in real-time",
          "Billing handles invoicing, payments, and financial reporting"
        ],
        steps: [
          {
            title: "Request Management",
            description: "View incoming broker requests and submit competitive quotes. Quick response times and competitive pricing win more deals.",
            icon: Plane,
            status: 'available' as const
          },
          {
            title: "Fleet Operations",
            description: "Manage aircraft availability, schedule maintenance, and optimize fleet positioning for maximum utilization.",
            icon: Calendar,
            status: 'available' as const
          },
          {
            title: "Crew Management & Hiring",
            description: "Find qualified pilots and cabin crew for your flights. Browse profiles, check certifications, and hire the best talent.",
            icon: Users,
            status: 'available' as const
          },
          {
            title: "Performance Analytics",
            description: "Track fleet utilization, revenue per aircraft, and operational metrics. Identify opportunities to increase efficiency and profits.",
            icon: BarChart3,
            status: 'available' as const
          },
          {
            title: "Real-Time Flight Monitoring",
            description: "Monitor your aircraft positions, track delays, and provide updates to clients. Ensure operational excellence.",
            icon: Globe,
            status: 'available' as const
          },
          {
            title: "Financial Management",
            description: "Handle invoicing, track payments, and manage your revenue streams. All transactions are FCA compliant.",
            icon: DollarSign,
            status: 'available' as const
          }
        ]
      },
      pilot: {
        title: "Pilot Terminal Guide",
        description: "Manage your flying career and find new opportunities",
        quickTips: [
          "Profile tab showcases your experience, ratings, and certifications to operators",
          "Schedule tab shows your upcoming flights and availability calendar",
          "Jobs tab lists available positions - apply directly to operators",
          "Licenses tab manages your certifications and tracks expiry dates",
          "Logbook tab records your flight hours and experience",
          "Earnings tab tracks your income and payment history",
          "Network tab connects you with other aviation professionals"
        ],
        steps: [
          {
            title: "Professional Profile",
            description: "Showcase your experience, ratings, and certifications. A complete profile attracts more job opportunities from operators.",
            icon: Users,
            status: 'available' as const
          },
          {
            title: "Flight Schedule & Availability",
            description: "Manage your schedule and set availability. Operators can see when you're free and book you for flights.",
            icon: Calendar,
            status: 'available' as const
          },
          {
            title: "Job Opportunities",
            description: "Browse available pilot positions from operators. Apply directly and build relationships with charter companies.",
            icon: Briefcase,
            status: 'available' as const
          },
          {
            title: "Certification Management",
            description: "Track your licenses, ratings, and medical certificates. Get alerts before they expire to maintain compliance.",
            icon: Award,
            status: 'available' as const
          },
          {
            title: "Digital Logbook",
            description: "Record your flight hours, routes, and experience. Build a comprehensive record of your aviation career.",
            icon: FileText,
            status: 'available' as const
          },
          {
            title: "Earnings & Payments",
            description: "Track your income, view payment history, and manage your financial records. All payments are secure and compliant.",
            icon: DollarSign,
            status: 'available' as const
          }
        ]
      },
      crew: {
        title: "Crew Terminal Guide",
        description: "Manage your cabin crew career and find new opportunities",
        quickTips: [
          "Profile tab showcases your experience, specialties, and certifications to operators",
          "Schedule tab shows your upcoming assignments and availability calendar",
          "Assignments tab lists your confirmed flights and duties",
          "Services tab highlights your special skills (catering, languages, medical)",
          "Profile tab manages your certifications and tracks training requirements",
          "Availability tab sets when you're free for new assignments",
          "Network tab connects you with other cabin crew and operators"
        ],
        steps: [
          {
            title: "Professional Profile",
            description: "Showcase your experience, specialties, and certifications. Highlight your unique skills like languages, medical training, or catering expertise.",
            icon: Users,
            status: 'available' as const
          },
          {
            title: "Assignment Management",
            description: "View your confirmed flights, duties, and client requirements. Stay organized and prepared for each assignment.",
            icon: Calendar,
            status: 'available' as const
          },
          {
            title: "Job Opportunities",
            description: "Browse available cabin crew positions from operators. Apply for flights that match your schedule and interests.",
            icon: Briefcase,
            status: 'available' as const
          },
          {
            title: "Service Specialties",
            description: "Highlight your special skills like fine dining service, medical training, or language abilities. These skills increase your value to operators.",
            icon: Award,
            status: 'available' as const
          },
          {
            title: "Certification Tracking",
            description: "Manage your safety certifications, medical training, and service qualifications. Stay current with all requirements.",
            icon: Shield,
            status: 'available' as const
          },
          {
            title: "Availability Management",
            description: "Set your schedule preferences and availability. Operators can see when you're free and book you for flights.",
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

        <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2 pb-4 scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent">
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
