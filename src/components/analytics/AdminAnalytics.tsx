import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Clock, AlertTriangle, CheckCircle, UserCheck, Eye, Globe, Activity, BarChart3, TrendingUp, FileText } from "lucide-react";

interface AdminAnalyticsProps {
  section: string;
}

export const AdminAnalytics = ({ section }: AdminAnalyticsProps) => {
  const getAnalyticsData = () => {
    switch (section) {
      case "verification":
        return {
          title: "Verification System Analytics",
          metrics: [
            { label: "Pending Reviews", value: "47", change: "+12", icon: Clock, color: "text-yellow-400" },
            { label: "Approved Today", value: "23", change: "+8", icon: CheckCircle, color: "text-green-400" },
            { label: "Approval Rate", value: "87%", change: "+5%", icon: TrendingUp, color: "text-blue-400" },
            { label: "Avg Review Time", value: "4.2h", change: "-1.1h", icon: UserCheck, color: "text-purple-400" }
          ]
        };
      case "users":
        return {
          title: "User Management Analytics",
          metrics: [
            { label: "Total Users", value: "15,847", change: "+127", icon: Users, color: "text-blue-400" },
            { label: "Active Sessions", value: "892", change: "+34", icon: Activity, color: "text-green-400" },
            { label: "New Registrations", value: "67", change: "+18", icon: TrendingUp, color: "text-yellow-400" },
            { label: "User Satisfaction", value: "94%", change: "+3%", icon: CheckCircle, color: "text-purple-400" }
          ]
        };
      case "security":
        return {
          title: "Security Analytics",
          metrics: [
            { label: "Security Score", value: "94%", change: "+2%", icon: Shield, color: "text-green-400" },
            { label: "Threats Blocked", value: "234", change: "+45", icon: AlertTriangle, color: "text-red-400" },
            { label: "System Uptime", value: "99.97%", change: "+0.02%", icon: Activity, color: "text-blue-400" },
            { label: "Failed Logins", value: "89", change: "-23", icon: Clock, color: "text-yellow-400" }
          ]
        };
      case "analytics":
        return {
          title: "Platform Analytics",
          metrics: [
            { label: "Daily Active Users", value: "3,247", change: "+12%", icon: Users, color: "text-blue-400" },
            { label: "Transaction Volume", value: "$2.4M", change: "+28%", icon: BarChart3, color: "text-green-400" },
            { label: "System Performance", value: "98.2%", change: "+1.1%", icon: Activity, color: "text-yellow-400" },
            { label: "Support Tickets", value: "34", change: "-12", icon: FileText, color: "text-purple-400" }
          ]
        };
      default:
        return {
          title: "System Overview Analytics",
          metrics: [
            { label: "Platform Health", value: "98%", change: "+2%", icon: Activity, color: "text-green-400" },
            { label: "User Growth", value: "+8.4%", change: "This Month", icon: TrendingUp, color: "text-blue-400" },
            { label: "Security Level", value: "HIGH", change: "Excellent", icon: Shield, color: "text-yellow-400" },
            { label: "Performance", value: "A+", change: "Optimal", icon: BarChart3, color: "text-purple-400" }
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
            const isPositive = metric.change.startsWith('+') || ['Excellent', 'Optimal', 'This Month'].includes(metric.change);
            const isNeutral = ['Excellent', 'Optimal', 'HIGH', 'A+'].includes(metric.value);
            return (
              <div key={index} className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      isNeutral ? 'text-blue-400 border-blue-400/30' : 
                      isPositive ? 'text-green-400 border-green-400/30' : 
                      'text-red-400 border-red-400/30'
                    }`}
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
        
        {/* System insights */}
        <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">System Insights</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1">
            {section === "verification" && (
              <>
                <li>• 87% approval rate maintained (target: 85%)</li>
                <li>• Peak verification times: 9-11 AM, 2-4 PM EST</li>
                <li>• FAA API integration reduced review time by 34%</li>
              </>
            )}
            {section === "users" && (
              <>
                <li>• User growth accelerating (+127 this week)</li>
                <li>• Broker segment showing strongest adoption</li>
                <li>• Mobile usage up 45% vs desktop</li>
              </>
            )}
            {section === "security" && (
              <>
                <li>• Zero critical vulnerabilities detected</li>
                <li>• 99.97% uptime exceeds SLA requirements</li>
                <li>• Advanced threat detection blocked 234 attacks</li>
              </>
            )}
            {section === "analytics" && (
              <>
                <li>• Platform performance optimal across all metrics</li>
                <li>• Transaction volume up 28% month-over-month</li>
                <li>• User engagement scores in top 5% of industry</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
