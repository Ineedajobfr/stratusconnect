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
    icon?: React.ComponentType<any>;
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
  }, [activeTab, showOnMount]);

  const getHelpContent = (tab: string): HelpContent => {
    const content: Record<string, HelpContent> = {
      dashboard: {
        title: "Operator Terminal Dashboard",
        items: [
          {
            section: "Fleet Status Monitor",
            description: "Real-time view of aircraft availability, flight hours, and maintenance status",
            icon: Plane
          },
          {
            section: "Daily Operations",
            description: "Today's flights, upcoming bookings, and crew scheduling overview",
            icon: CheckCircle
          },
          {
            section: "Revenue Performance",
            description: "Monthly earnings, utilization rates, and profit margin tracking",
            icon: DollarSign
          },
          {
            section: "Market Listings",
            description: "Your active marketplace listings and incoming broker bids",
            icon: BarChart3
          },
          {
            section: "Verification Center",
            description: "Complete identity verification to unlock full platform features",
            icon: Shield as any,
            locked: true
          }
        ],
        demoNote: "In the live version, verification unlocks advanced features and higher trust scores."
      },
      verification: {
        title: "Fortress of Trust Verification",
        items: [
          {
            section: "Identity Verification", 
            description: "Upload government-issued ID and complete identity screening process",
            icon: Shield
          },
          {
            section: "Company Registration",
            description: "Verify business registration and aviation authority certifications",
            icon: CheckCircle
          },
          {
            section: "Insurance Documentation",
            description: "Provide current aviation insurance and liability coverage proof",
            icon: Shield
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
            icon: Plane as any,
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
            section: "Deal Creation",
            description: "Accept bids to create confirmed deals and unlock secure messaging",
            icon: CheckCircle
          },
          {
            section: "Market Intelligence",
            description: "Access pricing trends, route analysis, and competitive data",
            icon: BarChart3,
            locked: true
          }
        ],
        demoNote: "Market intelligence and advanced analytics require verification status."
      },
      messages: {
        title: "Secure Communication Hub",
        items: [
          {
            section: "Deal-Based Messaging",
            description: "Private, encrypted chat channels automatically created for confirmed deals",
            icon: MessageSquare
          },
          {
            section: "Broker Communication",
            description: "Direct contact with charter brokers for flight coordination and requirements",
            icon: MessageSquare
          },
          {
            section: "File Sharing",
            description: "Secure sharing of contracts, flight plans, and operational documents",
            icon: Shield
          },
          {
            section: "Privacy Protection",
            description: "Contact information protected until deals are confirmed and contracts signed",
            icon: Lock
          }
        ],
        demoNote: "Messaging channels open when deals are confirmed through the marketplace."
      },
      news: {
        title: "Aviation Industry News",
        items: [
          {
            section: "Industry Headlines", 
            description: "Latest aviation news, regulatory updates, and market developments",
            icon: Globe
          },
          {
            section: "Operational Alerts",
            description: "Weather advisories, airspace restrictions, and safety notices",
            icon: Shield
          },
          {
            section: "Market Analysis",
            description: "Charter demand trends, pricing analytics, and competitive intelligence",
            icon: BarChart3
          },
          {
            section: "Personalized Feed",
            description: "Customized news based on your fleet, routes, and business focus",
            icon: ArrowRight,
            locked: true
          }
        ],
        demoNote: "Personalized news feeds and advanced market data require verification."
      },
      revenue: {
        title: "Financial Analytics Center",
        items: [
          {
            section: "Revenue Dashboard",
            description: "Monthly revenue tracking, profit margins, and performance metrics",
            icon: DollarSign
          },
          {
            section: "Fleet Performance",
            description: "Individual aircraft profitability and utilization analysis",
            icon: Plane
          },
          {
            section: "Cost Management",
            description: "Operating expenses, maintenance costs, and budget tracking",
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
            icon: Lock as any,
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
    <div 
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <Card 
        className="terminal-card bg-terminal-card/80 backdrop-blur-sm w-96 h-96 max-h-[400px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-400" />
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

          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto terminal-scrollbar">
            {content.items.map((item, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 p-2 rounded-lg ${
                  item.locked 
                    ? 'bg-slate-700/50 border border-yellow-500/30' 
                    : 'bg-slate-700/30 border border-slate-600'
                }`}
              >
                <div className={`p-1 rounded-lg ${
                  item.locked 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {item.icon && <item.icon className="w-3 h-3" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-1">
                    <h4 className="text-xs font-medium text-white">{item.section}</h4>
                    {item.locked && (
                      <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 text-xs px-1 py-0">
                        <Lock className="w-2 h-2" />
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {content.demoNote && (
            <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
              <div className="flex items-start space-x-2">
                <Info className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-300">{content.demoNote}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};