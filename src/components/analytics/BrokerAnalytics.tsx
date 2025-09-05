import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, DollarSign, FileText, Users, Globe, MessageSquare, AlertTriangle, Bookmark, Settings, Star } from "lucide-react";

interface BrokerAnalyticsProps {
  section: string;
}

export const BrokerAnalytics = ({ section }: BrokerAnalyticsProps) => {
  const getAnalyticsData = () => {
    switch (section) {
      case "marketplace":
        return {
          title: "Marketplace Analytics",
          metrics: [
            { label: "Listings Viewed", value: "1,247", change: "+18%", icon: Globe, color: "text-blue-400" },
            { label: "Quotes Requested", value: "89", change: "+24%", icon: FileText, color: "text-green-400" },
            { label: "Success Rate", value: "34%", change: "+8%", icon: TrendingUp, color: "text-yellow-400" },
            { label: "Avg Response", value: "8m", change: "-2m", icon: Clock, color: "text-purple-400" }
          ]
        };
      case "requests":
        return {
          title: "Request Analytics",
          metrics: [
            { label: "Active Requests", value: "24", change: "+8", icon: FileText, color: "text-blue-400" },
            { label: "Quote Rate", value: "73%", change: "+12%", icon: TrendingUp, color: "text-green-400" },
            { label: "Win Rate", value: "28%", change: "+5%", icon: Star, color: "text-yellow-400" },
            { label: "Avg Value", value: "$42K", change: "+15%", icon: DollarSign, color: "text-purple-400" }
          ]
        };
      case "quotes":
        return {
          title: "Quote Performance",
          metrics: [
            { label: "Quotes Sent", value: "147", change: "+23", icon: FileText, color: "text-blue-400" },
            { label: "Acceptance Rate", value: "31%", change: "+7%", icon: TrendingUp, color: "text-green-400" },
            { label: "Avg Quote Time", value: "12m", change: "-4m", icon: Clock, color: "text-yellow-400" },
            { label: "Revenue Impact", value: "$2.1M", change: "+18%", icon: DollarSign, color: "text-purple-400" }
          ]
        };
      case "messages":
        return {
          title: "Communication Analytics",
          metrics: [
            { label: "Messages Sent", value: "342", change: "+28", icon: MessageSquare, color: "text-blue-400" },
            { label: "Response Rate", value: "94%", change: "+6%", icon: TrendingUp, color: "text-green-400" },
            { label: "Avg Response", value: "4.2m", change: "-1.8m", icon: Clock, color: "text-yellow-400" },
            { label: "Conversations", value: "67", change: "+15", icon: Users, color: "text-purple-400" }
          ]
        };
      case "directory":
        return {
          title: "Directory Usage Analytics",
          metrics: [
            { label: "Contacts Viewed", value: "89", change: "+12", icon: Users, color: "text-blue-400" },
            { label: "New Connections", value: "23", change: "+8", icon: TrendingUp, color: "text-green-400" },
            { label: "Contact Rate", value: "67%", change: "+15%", icon: MessageSquare, color: "text-yellow-400" },
            { label: "Network Score", value: "8.4", change: "+0.6", icon: Star, color: "text-purple-400" }
          ]
        };
      case "transactions":
        return {
          title: "Transaction Analytics",
          metrics: [
            { label: "Completed", value: "156", change: "+34", icon: DollarSign, color: "text-green-400" },
            { label: "Total Volume", value: "$4.8M", change: "+28%", icon: BarChart3, color: "text-blue-400" },
            { label: "Commission", value: "$336K", change: "+28%", icon: TrendingUp, color: "text-yellow-400" },
            { label: "Avg Deal Size", value: "$31K", change: "+12%", icon: Star, color: "text-purple-400" }
          ]
        };
      case "alerts":
        return {
          title: "Alert Analytics",
          metrics: [
            { label: "Active Alerts", value: "12", change: "+3", icon: AlertTriangle, color: "text-yellow-400" },
            { label: "Resolved Today", value: "8", change: "+2", icon: TrendingUp, color: "text-green-400" },
            { label: "Response Time", value: "2.3m", change: "-0.8m", icon: Clock, color: "text-blue-400" },
            { label: "Alert Score", value: "92%", change: "+5%", icon: Star, color: "text-purple-400" }
          ]
        };
      case "saved":
        return {
          title: "Saved Jets Analytics", 
          metrics: [
            { label: "Jets Saved", value: "47", change: "+12", icon: Bookmark, color: "text-blue-400" },
            { label: "Booking Rate", value: "23%", change: "+8%", icon: TrendingUp, color: "text-green-400" },
            { label: "Avg Save Time", value: "3.2d", change: "+0.8d", icon: Clock, color: "text-yellow-400" },
            { label: "Success Rate", value: "67%", change: "+15%", icon: Star, color: "text-purple-400" }
          ]
        };
      case "profile":
        return {
          title: "Profile Analytics",
          metrics: [
            { label: "Profile Views", value: "284", change: "+22%", icon: Users, color: "text-blue-400" },
            { label: "Broker Rating", value: "4.7", change: "+0.3", icon: Star, color: "text-yellow-400" },
            { label: "Trust Score", value: "94%", change: "+6%", icon: TrendingUp, color: "text-green-400" },
            { label: "Network Size", value: "167", change: "+28", icon: Globe, color: "text-purple-400" }
          ]
        };
      default:
        return {
          title: "Performance Analytics",
          metrics: [
            { label: "Activity Score", value: "92", change: "+8", icon: BarChart3, color: "text-blue-400" },
            { label: "Success Rate", value: "78%", change: "+12%", icon: TrendingUp, color: "text-green-400" },
            { label: "Efficiency", value: "89%", change: "+5%", icon: Clock, color: "text-yellow-400" },
            { label: "Client Rating", value: "4.8", change: "+0.2", icon: Star, color: "text-purple-400" }
          ]
        };
    }
  };

  const analyticsData = getAnalyticsData();

  return (
    <Card className="terminal-card">
      <CardHeader className="border-b border-terminal-border">
        <CardTitle className="terminal-subheader text-neutral-300">{analyticsData.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {analyticsData.metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.change.startsWith('+');
            return (
              <div key={index} className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${isPositive ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}
                  >
                    {metric.change}
                  </Badge>
                </div>
                <div className={`text-xl font-bold ${metric.color} mb-1`}>
                  {metric.value}
                </div>
                <div className="text-xs text-slate-400">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Market insights */}
        <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Market Insights</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1">
            {section === "marketplace" && (
              <>
                <li>• Peak activity: Tuesday-Thursday 8-11 AM EST</li>
                <li>• JFK-LAX route has highest demand (+42%)</li>
                <li>• Mid-size jets showing strongest growth</li>
              </>
            )}
            {section === "requests" && (
              <>
                <li>• Your win rate is 15% above market average</li>
                <li>• Response time under 10min increases success by 34%</li>
                <li>• Holiday season bookings up 67%</li>
              </>
            )}
            {section === "quotes" && (
              <>
                <li>• Competitive quotes win 3x more often</li>
                <li>• Include alternative aircraft for +23% success</li>
                <li>• Same-day quotes have 45% higher acceptance</li>
              </>
            )}
            {section === "transactions" && (
              <>
                <li>• Q4 revenue tracking 28% above target</li>
                <li>• Repeat clients generate 67% of revenue</li>
                <li>• Premium routes yield 40% higher margins</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};