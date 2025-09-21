import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  HelpCircle, X, ChevronRight, Shield, Lock, CheckCircle, 
  AlertTriangle, Plane, Users, MessageSquare, BarChart3, 
  Calendar, DollarSign, Globe, Building
} from 'lucide-react';

type StepStatus = 'locked' | 'available' | 'completed';

interface HelpStep {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  status?: StepStatus;
  action?: string;
}

interface HelpContent {
  title: string;
  description: string;
  steps: HelpStep[];
  verificationRequired?: boolean;
}

interface HelpGuideProps {
  page: string;
  userRole: string;
  isVerified: boolean;
  onClose?: () => void;
  showOnMount?: boolean;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({
  page,
  userRole,
  isVerified,
  onClose,
  showOnMount = false
}) => {
  const [isVisible, setIsVisible] = useState(showOnMount);
  const [hasBeenShown, setHasBeenShown] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (showOnMount || (!hasBeenShown.has(`${page}-${userRole}`) && !showOnMount)) {
      setIsVisible(true);
      setHasBeenShown(prev => new Set(prev).add(`${page}-${userRole}`));
    }
  }, [page, userRole, showOnMount]);

  const getHelpContent = (): HelpContent => {
    const baseContent: Record<string, HelpContent> = {
      'operator-dashboard': {
        title: 'Operator Dashboard',
        description: 'Your command center for fleet operations, bookings, and revenue tracking.',
        verificationRequired: true,
        steps: [
          {
            title: 'Fleet Status Overview',
            description: 'Monitor all aircraft availability, utilization rates, and maintenance schedules in real-time.',
            icon: Plane,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Today\'s Bookings',
            description: 'View confirmed flights, pending requests, and revenue for current operations.',
            icon: Calendar,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Revenue Metrics',
            description: 'Track monthly revenue, profit margins, and performance against targets.',
            icon: DollarSign,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Profile Management',
            description: 'Update company information and verification documents.',
            icon: Users,
            status: 'available' as 'locked' | 'available' | 'completed',
            action: 'Always accessible for profile updates'
          }
        ]
      },
      'operator-fleet': {
        title: 'Fleet Management',
        description: 'Manage your aircraft portfolio, maintenance, and operational status.',
        verificationRequired: true,
        steps: [
          {
            title: 'Aircraft Registry',
            description: 'Add and manage aircraft with detailed specifications, documents, and certifications.',
            icon: Plane,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Maintenance Scheduling',
            description: 'Track upcoming maintenance, inspections, and compliance requirements.',
            icon: AlertTriangle,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Utilization Analytics',
            description: 'Monitor flight hours, revenue per aircraft, and optimization opportunities.',
            icon: BarChart3,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Insurance & Documents',
            description: 'Manage insurance policies, airworthiness certificates, and compliance documents.',
            icon: Shield,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          }
        ]
      },
      'operator-marketplace': {
        title: 'Marketplace',
        description: 'List your aircraft, review bids, and close deals with charter brokers.',
        verificationRequired: true,
        steps: [
          {
            title: 'Create Listings',
            description: 'Post available aircraft with routes, dates, and pricing to attract brokers.',
            icon: Building,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Review Bids',
            description: 'Evaluate broker offers, compare bid amounts, and review broker credentials.',
            icon: DollarSign,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Accept Deals',
            description: 'Accept winning bids to create confirmed deals and unlock secure messaging.',
            icon: CheckCircle,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed',
            action: 'Accepting bids opens dedicated chat channels'
          },
          {
            title: 'Market Intelligence',
            description: 'Access pricing trends, popular routes, and competitive analysis.',
            icon: BarChart3,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          }
        ]
      },
      'operator-messages': {
        title: 'Secure Messaging',
        description: 'Communicate with brokers through encrypted, deal-specific chat channels.',
        verificationRequired: false,
        steps: [
          {
            title: 'Deal-Based Chats',
            description: 'Each confirmed deal creates a private, secure messaging channel.',
            icon: MessageSquare,
            status: 'available',
            action: 'Messaging unlocks when deals are confirmed'
          },
          {
            title: 'File Sharing',
            description: 'Share contracts, flight plans, catering requirements, and handling instructions.',
            icon: Shield,
            status: 'available' as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Quick Templates',
            description: 'Use pre-built templates for common communications like slot times and requirements.',
            icon: CheckCircle,
            status: 'available'
          },
          {
            title: 'Privacy Protection',
            description: 'Contact information is restricted until deals are finalized for security.',
            icon: Lock,
            status: 'completed',
            action: 'System automatically enforces privacy rules'
          }
        ]
      },
      'operator-news': {
        title: 'Aviation News',
        description: 'Stay informed with industry news, regulations, and operational alerts.',
        verificationRequired: false,
        steps: [
          {
            title: 'Industry Headlines',
            description: 'Curated news from aviation industry sources and regulatory bodies.',
            icon: Globe,
            status: 'available'
          },
          {
            title: 'Operational Alerts',
            description: 'Weather alerts, airspace restrictions, and safety notices affecting operations.',
            icon: AlertTriangle,
            status: 'available'
          },
          {
            title: 'Market Updates',
            description: 'Charter market trends, fuel prices, and economic factors affecting pricing.',
            icon: BarChart3,
            status: 'available'
          },
          {
            title: 'Personalized Feed',
            description: 'Filter news by aircraft type, operating regions, and business focus areas.',
            icon: Users,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          }
        ]
      },
      'operator-revenue': {
        title: 'Revenue Analytics',
        description: 'Comprehensive financial analysis and performance reporting.',
        verificationRequired: true,
        steps: [
          {
            title: 'Revenue Dashboard',
            description: 'Track monthly revenue, profit margins, and year-over-year growth metrics.',
            icon: DollarSign,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Cost Analysis',
            description: 'Monitor operating costs, fuel expenses, and maintenance spending per aircraft.',
            icon: BarChart3,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Performance Benchmarks',
            description: 'Compare your metrics against industry averages and competitive benchmarks.',
            icon: BarChart3,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          },
          {
            title: 'Export Reports',
            description: 'Generate detailed reports for accounting, tax preparation, and business planning.',
            icon: CheckCircle,
            status: (isVerified ? 'available' : 'locked') as 'locked' | 'available' | 'completed'
          }
        ]
      }
    };

    return baseContent[`${userRole}-${page}` as keyof typeof baseContent] || {
      title: 'Help Guide',
      description: 'Navigate this section effectively.',
      steps: [
        {
          title: 'Getting Started',
          description: 'Explore the features available in this section.',
          icon: HelpCircle,
          status: 'available'
        }
      ]
    };
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

const getStatusIcon = (status: StepStatus) => {
  switch (status) {
    case 'locked': return Lock;
    case 'completed': return CheckCircle;
    default: return ChevronRight;
  }
};

const getStatusColor = (status: StepStatus) => {
  switch (status) {
    case 'locked': return 'text-terminal-warning';
    case 'completed': return 'text-terminal-success';
    default: return 'text-terminal-info';
  }
};
  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed top-6 right-6 z-50 border-terminal-border bg-terminal-card/90 text-foreground hover:bg-terminal-card backdrop-blur-sm shadow-lg"
      >
        <HelpCircle className="mr-2 h-4 w-4" />
        Help
      </Button>
    );
  }

  const content = getHelpContent();

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <Card 
        className="terminal-card bg-terminal-card/80 backdrop-blur-sm w-96 h-96 max-h-[400px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="border-b border-terminal-border">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl text-foreground">{content.title}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {content.description}
              </CardDescription>
              {content.verificationRequired && !isVerified && (
                <Badge variant="outline" className="text-terminal-warning border-terminal-warning">
                  <Shield className="mr-1 h-3 w-3" />
                  Verification Required
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[280px]">
            <div className="p-4 space-y-3">
              {content.steps.map((step, index) => {
                const Icon = step.icon || HelpCircle;
                const status: StepStatus = step.status ?? 'available';
                const StatusIcon = getStatusIcon(status);
                
                return (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      status === 'locked' 
                        ? 'bg-terminal-warning/5 border border-terminal-warning/20' 
                        : 'bg-terminal-card/30 hover:bg-terminal-card/50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <Icon className={`h-5 w-5 ${getStatusColor(status)}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground text-sm">{step.title}</h4>
                        <StatusIcon className={`h-3 w-3 ${getStatusColor(status)}`} />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      {step.action && (
                        <p className="text-xs text-terminal-info font-medium">
                          💡 {step.action}
                        </p>
                      )}
                      {status === 'locked' && (
                        <Badge variant="outline" className="text-xs text-terminal-warning border-terminal-warning/50">
                          <Lock className="mr-1 h-3 w-3" />
                          Requires Verification
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {content.verificationRequired && !isVerified && (
                <div className="mt-6 p-4 bg-terminal-warning/10 border border-terminal-warning/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-terminal-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-terminal-warning mb-1">
                        Verification Required
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Complete the Fortress of Trust verification process to unlock all features. 
                        Upload your business registration, insurance documents, and aircraft certifications.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};