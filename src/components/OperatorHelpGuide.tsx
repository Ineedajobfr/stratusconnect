import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Info
} from "lucide-react";

interface HelpContent {
  title: string;
  items: Array<{
    section: string;
    description: string;
    icon?: any;
    locked?: boolean;
  }>;
  demoNote?: string;
}

interface OperatorHelpGuideProps {
  activeTab: string;
  onClose?: () => void;
  showOnMount?: boolean;
}

export const OperatorHelpGuide = ({ activeTab, onClose, showOnMount = true }: OperatorHelpGuideProps) => {
  const [isVisible, setIsVisible] = useState(showOnMount);
  const [hasBeenShown, setHasBeenShown] = useState<Set<string>>(new Set());

  // Show help automatically when tab changes (but only once per tab for showOnMount=false, always for demo)
  useEffect(() => {
    if (showOnMount) {
      // For demo mode, always show guide when tab changes
      setIsVisible(true);
    } else if (!hasBeenShown.has(activeTab)) {
      // For normal mode, show only once per tab
      setIsVisible(true);
      setHasBeenShown(prev => new Set([...prev, activeTab]));
    }
  }, [activeTab, showOnMount, hasBeenShown]);

  const getHelpContent = (tab: string): HelpContent => {
    const content: Record<string, HelpContent> = {
      dashboard: {
        title: "Operator Command Center",
        items: [
          {
            section: "Fleet Status",
            description: "Monitor your entire fleet - active aircraft, current flights, and maintenance schedules",
            icon: Plane
          },
          {
            section: "Today's Bookings",
            description: "View confirmed and pending bookings for today with real-time updates",
            icon: BarChart3
          },
          {
            section: "Revenue Metrics",
            description: "Track monthly revenue, utilization rates, and performance against targets",
            icon: DollarSign
          },
          {
            section: "Fleet Overview",
            description: "Detailed status of each aircraft including location, next flight, and utilization",
            icon: CheckCircle
          },
          {
            section: "Recent Bookings",
            description: "Latest booking activity with client details and revenue information",
            icon: ArrowRight
          }
        ],
        demoNote: "Profile features are inactive in demo mode and unlock after verification."
      },
      verification: {
        title: "Fortress of Trust Verification",
        items: [
          {
            section: "Identity Verification",
            description: "Upload government-issued ID and complete identity verification process",
            icon: Shield
          },
          {
            section: "Business Documentation",
            description: "Provide business registration, insurance, and operational certificates",
            icon: CheckCircle
          },
          {
            section: "Background Screening",
            description: "Complete security screening and sanctions list verification",
            icon: Lock
          },
          {
            section: "Advanced Tools Access",
            description: "Full profile, messaging, and advanced analytics unlock after verification",
            icon: ArrowRight,
            locked: true
          }
        ],
        demoNote: "Once verified, your full profile and advanced tools unlock."
      },
      fleet: {
        title: "Fleet Management Center",
        items: [
          {
            section: "Fleet Overview",
            description: "Comprehensive view of all aircraft with status, location, and utilization metrics",
            icon: Plane
          },
          {
            section: "Add Aircraft",
            description: "Register new aircraft to your fleet (inactive until verification)",
            icon: Plane,
            locked: true
          },
          {
            section: "Aircraft Details",
            description: "Detailed specifications, maintenance history, and performance data",
            icon: CheckCircle
          },
          {
            section: "Booking Management",
            description: "View and manage bookings for each aircraft in your fleet",
            icon: BarChart3
          }
        ],
        demoNote: "Aircraft management tools become fully active after verification."
      },
      marketplace: {
        title: "Aviation Marketplace",
        items: [
          {
            section: "Your Listings",
            description: "View your aircraft alongside bids from verified brokers",
            icon: Plane
          },
          {
            section: "Bid Management",
            description: "Review asking price vs minimum bid price and broker offers",
            icon: DollarSign
          },
          {
            section: "Accept Bids",
            description: "Accepting a bid opens direct messaging and deal flow with the broker",
            icon: MessageSquare
          },
          {
            section: "Deal Flow",
            description: "Once accepted, coordinate logistics and finalize terms through messaging",
            icon: ArrowRight
          }
        ],
        demoNote: "Accepting a bid here would open a deal flow with the broker."
      },
      messages: {
        title: "Secure Messaging Center",
        items: [
          {
            section: "Deal Communication",
            description: "Messaging unlocks once a deal is agreed with a broker",
            icon: MessageSquare,
            locked: true
          },
          {
            section: "Logistics Coordination",
            description: "Use chat to coordinate flight details, crew requirements, and logistics",
            icon: ArrowRight,
            locked: true
          },
          {
            section: "Final Terms",
            description: "Finalize contract terms, payment schedules, and special requirements",
            icon: CheckCircle,
            locked: true
          }
        ],
        demoNote: "Messaging only unlocks once a deal is agreed with a broker."
      },
      news: {
        title: "Aviation Intelligence Hub",
        items: [
          {
            section: "Industry Updates",
            description: "Live aviation industry news relevant to operators and flight operations",
            icon: Globe
          },
          {
            section: "Market Intelligence",
            description: "Trends affecting charter rates, fuel costs, and operational regulations",
            icon: BarChart3
          },
          {
            section: "Regulatory Changes",
            description: "Important updates on aviation regulations and compliance requirements",
            icon: Shield
          },
          {
            section: "Market Opportunities",
            description: "Identify new routes, seasonal trends, and emerging market opportunities",
            icon: ArrowRight
          }
        ],
        demoNote: "Stay informed with real-time aviation industry intelligence."
      },
      revenue: {
        title: "Revenue Analytics Dashboard",
        items: [
          {
            section: "Profit Margins",
            description: "Track profit margins across different aircraft and route types",
            icon: DollarSign
          },
          {
            section: "Cost Per Hour",
            description: "Monitor operational costs and optimize pricing strategies",
            icon: BarChart3
          },
          {
            section: "Revenue Overview",
            description: "Comprehensive revenue analysis with forecasting and trends",
            icon: ArrowRight
          },
          {
            section: "Advanced Analytics",
            description: "Detailed financial reporting requires verification and premium access",
            icon: Lock,
            locked: true
          }
        ],
        demoNote: "Advanced analytics unlock when you are verified."
      }
    };

    return content[tab] || {
      title: "Help Guide",
      items: [],
      demoNote: "Navigate through the operator terminal to access different features."
    };
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-20 z-40 bg-slate-800/90 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Help
      </Button>
    );
  }

  const content = getHelpContent(activeTab);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-6xl mx-auto p-4">
        <Card className="bg-slate-800/90 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Info className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{content.title}</h3>
                  <p className="text-sm text-slate-400">Interactive demo walkthrough</p>
                </div>
              </div>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {content.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    item.locked 
                      ? 'bg-slate-700/50 border border-yellow-500/30' 
                      : 'bg-slate-700/30 border border-slate-600'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    item.locked 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {item.icon && <item.icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-white">{item.section}</h4>
                      {item.locked && (
                        <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 text-xs">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {content.demoNote && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-300">{content.demoNote}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};