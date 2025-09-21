import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Plane, 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Star,
  Plus,
  Bell,
  MessageCircle,
  Zap,
  Award,
  Shield,
  Globe,
  Search,
  Filter,
  Eye,
  BarChart3,
  CheckSquare,
  FileText,
  Building2,
  UserCheck,
  Settings
} from "lucide-react";
import { getRoleConfig } from "@/lib/navigation-config";
import { FlightRadar24Widget } from "@/components/flight-tracking/FlightRadar24Widget";

interface FeedItem {
  id: string;
  type: "flight_opportunity" | "network_activity" | "system_notification" | "market_update" | "assignment_update";
  title: string;
  description: string;
  timestamp: string;
  priority: "low" | "medium" | "high";
  metadata?: Record<string, any>;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: "default" | "secondary" | "outline";
  }>;
}

interface QuickStats {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}

export function PersonalizedFeed() {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      loadPersonalizedFeed();
    }
  }, [user]);

  const loadPersonalizedFeed = async () => {
    setIsLoading(true);
    // Simulate API call - in real implementation, this would fetch from your backend
    setTimeout(() => {
      setFeedItems(generateFeedItems(user?.role || "broker"));
      setQuickStats(generateQuickStats(user?.role || "broker"));
      setIsLoading(false);
    }, 1000);
  };

  const getFleetTailNumbers = () => {
    // Mock fleet data - in real implementation, this would come from the user's fleet
    if (user?.role === "operator") {
      return ["N123SC", "N456SC", "N789SC"];
    } else if (user?.role === "broker") {
      return ["N425SC", "N892AV", "N123CX"]; // Saved aircraft from trusted operators
    }
    return [];
  };

  if (!user) {
    return <div>Please log in to view your personalized feed.</div>;
  }

  const roleConfig = getRoleConfig(user.role);

  return (
    <div className="space-y-6">
      {/* Welcome Header with Search */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-6 border border-accent/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user.fullName}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening in your {roleConfig?.displayName.toLowerCase()} dashboard today.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search flights, users, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-terminal-bg/50 border-terminal-border focus:border-accent"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-terminal-card/50 border-terminal-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    {stat.change && (
                      <div className="flex items-center mt-1">
                        <span className={`text-xs ${
                          stat.trend === "up" ? "text-green-400" : 
                          stat.trend === "down" ? "text-red-400" : 
                          "text-muted-foreground"
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    )}
                  </div>
                  <Icon className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      {roleConfig && (
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-accent" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks for {roleConfig.displayName.toLowerCase()}s
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roleConfig.quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="justify-start h-auto p-4 hover:bg-terminal-card"
                    onClick={() => {
                      // Handle quick action
                      console.log(`Quick action: ${action.id}`);
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3 text-accent" />
                    <div className="text-left">
                      <div className="font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flight Tracking Section */}
      {(user.role === "operator" || user.role === "broker") && (
        <FlightRadar24Widget 
          tailNumbers={getFleetTailNumbers()}
          role={user.role}
          showMap={true}
          autoRefresh={true}
          refreshInterval={30}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <Card className="bg-terminal-card/50 border-terminal-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-accent" />
                Activity Feed
              </CardTitle>
              <CardDescription>
                Recent updates and opportunities in your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-terminal-border/50 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  feedItems.map((item) => (
                    <FeedItemCard key={item.id} item={item} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Messages */}
          <Card className="bg-terminal-card/50 border-terminal-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-accent" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generateRecentMessages(user.role).map((message, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-terminal-bg/50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {message.sender.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{message.sender}</p>
                      <p className="text-xs text-muted-foreground truncate">{message.preview}</p>
                      <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Updates */}
          <Card className="bg-terminal-card/50 border-terminal-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                Market Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generateMarketUpdates().map((update, index) => (
                  <div key={index} className="p-3 bg-terminal-bg/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {update.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{update.time}</span>
                    </div>
                    <p className="text-sm text-foreground">{update.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FeedItemCard({ item }: { item: FeedItem }) {
  const getItemIcon = () => {
    switch (item.type) {
      case "flight_opportunity":
        return <Plane className="h-5 w-5 text-accent" />;
      case "network_activity":
        return <Users className="h-5 w-5 text-blue-400" />;
      case "system_notification":
        return <Bell className="h-5 w-5 text-yellow-400" />;
      case "market_update":
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case "assignment_update":
        return <Calendar className="h-5 w-5 text-purple-400" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = () => {
    switch (item.priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-terminal-bg/50 border border-terminal-border hover:bg-terminal-bg transition-colors">
      <div className="flex-shrink-0">
        {getItemIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
          <Badge variant="outline" className={getPriorityColor()}>
            {item.priority}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
          {item.actions && (
            <div className="flex space-x-2">
              {item.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={action.action}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock data generators - replace with real API calls
function generateRecentMessages(role: string) {
  const baseMessages = [
    { sender: "Sarah Johnson", preview: "Re: JFK → LAX Quote Request", time: "2 min ago" },
    { sender: "Mike Chen", preview: "Fleet update for your client", time: "15 min ago" },
    { sender: "David Rodriguez", preview: "Pilot availability confirmed", time: "1 hour ago" }
  ];

  if (role === "broker") {
    return [
      ...baseMessages,
      { sender: "Elite Aviation", preview: "New empty leg opportunity", time: "2 hours ago" }
    ];
  } else if (role === "operator") {
    return [
      ...baseMessages,
      { sender: "Global Charters", preview: "Request for G650 availability", time: "30 min ago" }
    ];
  }

  return baseMessages;
}

function generateMarketUpdates() {
  return [
    { category: "Charter Rates", message: "Northeast region rates up 15%", time: "1 hour ago" },
    { category: "Weather", message: "Winter storm affecting East Coast", time: "2 hours ago" },
    { category: "Regulations", message: "New FAA requirements effective Jan 1", time: "1 day ago" }
  ];
}

function generateFeedItems(role: string): FeedItem[] {
  const baseItems: FeedItem[] = [
    {
      id: "1",
      type: "flight_opportunity",
      title: "New Flight Opportunity",
      description: "Private jet charter from NYC to LAX available for next week",
      timestamp: "2 hours ago",
      priority: "high",
      actions: [
        { label: "View Details", action: () => console.log("View details") },
        { label: "Apply", action: () => console.log("Apply") }
      ]
    },
    {
      id: "2",
      type: "network_activity",
      title: "New Connection Request",
      description: "John Smith, Senior Pilot at SkyHigh Aviation wants to connect",
      timestamp: "4 hours ago",
      priority: "medium",
      actions: [
        { label: "Accept", action: () => console.log("Accept") },
        { label: "Decline", action: () => console.log("Decline") }
      ]
    }
  ];

  // Add role-specific items
  if (role === "broker") {
    baseItems.unshift({
      id: "3",
      type: "market_update",
      title: "Market Update",
      description: "Charter rates increased 15% in Northeast region",
      timestamp: "1 hour ago",
      priority: "medium"
    });
  } else if (role === "pilot") {
    baseItems.unshift({
      id: "4",
      type: "assignment_update",
      title: "Assignment Update",
      description: "Your flight assignment for tomorrow has been confirmed",
      timestamp: "30 minutes ago",
      priority: "high"
    });
  }

  return baseItems;
}

function generateQuickStats(role: string): QuickStats[] {
  const baseStats: QuickStats[] = [
    {
      label: "Active Assignments",
      value: 3,
      change: "+2 this week",
      trend: "up",
      icon: Calendar
    },
    {
      label: "Network Connections",
      value: 127,
      change: "+5 this week",
      trend: "up",
      icon: Users
    }
  ];

  if (role === "broker") {
    return [
      ...baseStats,
      {
        label: "Quotes Sent",
        value: 12,
        change: "+3 today",
        trend: "up",
        icon: Plane
      },
      {
        label: "Success Rate",
        value: "87%",
        change: "+3% this month",
        trend: "up",
        icon: TrendingUp
      },
      {
        label: "Revenue",
        value: "$45,200",
        change: "+12% this month",
        trend: "up",
        icon: DollarSign
      },
      {
        label: "Messages",
        value: 12,
        change: "3 unread",
        trend: "neutral",
        icon: MessageCircle
      }
    ];
  } else if (role === "operator") {
    return [
      ...baseStats,
      {
        label: "New Requests",
        value: 5,
        change: "+3 from yesterday",
        trend: "up",
        icon: Bell
      },
      {
        label: "Active Quotes",
        value: 8,
        change: "2 expiring today",
        trend: "neutral",
        icon: DollarSign
      },
      {
        label: "Fleet Utilization",
        value: "78%",
        change: "+5% from last month",
        trend: "up",
        icon: Plane
      },
      {
        label: "Quote Success",
        value: "65%",
        change: "+8% from last month",
        trend: "up",
        icon: TrendingUp
      }
    ];
  } else if (role === "pilot") {
    return [
      ...baseStats,
      {
        label: "Flight Hours",
        value: "2,847",
        change: "+45 this month",
        trend: "up",
        icon: Plane
      },
      {
        label: "Certifications",
        value: 8,
        change: "All current",
        trend: "neutral",
        icon: Award
      },
      {
        label: "Earnings",
        value: "$12,500",
        change: "+8% this month",
        trend: "up",
        icon: DollarSign
      },
      {
        label: "Rating",
        value: "4.9★",
        change: "+0.1 this quarter",
        trend: "up",
        icon: Star
      }
    ];
  } else if (role === "crew") {
    return [
      ...baseStats,
      {
        label: "Opportunities",
        value: 6,
        change: "+2 this week",
        trend: "up",
        icon: Briefcase
      },
      {
        label: "Service Rating",
        value: "4.8★",
        change: "+0.2 this month",
        trend: "up",
        icon: Star
      },
      {
        label: "Earnings",
        value: "$8,400",
        change: "+15% this month",
        trend: "up",
        icon: DollarSign
      },
      {
        label: "Availability",
        value: "85%",
        change: "Next 30 days",
        trend: "neutral",
        icon: Calendar
      }
    ];
  }

  return baseStats;
}
