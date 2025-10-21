import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, DollarSign, Plane, Calendar, Globe, MessageSquare, Gauge, Activity, Users, Fuel } from "lucide-react";

interface OperatorAnalyticsProps {
  section: string;
}

export const OperatorAnalytics = ({ section }: OperatorAnalyticsProps) => {
  const getAnalyticsData = () => {
    switch (section) {
      case "fleet":
        return {
          title: "Fleet Performance Analytics",
          metrics: [
            { label: "Fleet Utilization", value: "74.5%", change: "+8.2%", icon: Gauge, color: "text-blue-400" },
            { label: "Active Aircraft", value: "15", change: "+2", icon: Plane, color: "text-green-400" },
            { label: "Flight Hours", value: "1,247h", change: "+186h", icon: Clock, color: "text-yellow-400" },
            { label: "Revenue/Hour", value: "$3,240", change: "+12%", icon: DollarSign, color: "text-purple-400" }
          ]
        };
      case "marketplace":
        return {
          title: "Marketplace Performance",
          metrics: [
            { label: "Bookings MTD", value: "89", change: "+24%", icon: Calendar, color: "text-blue-400" },
            { label: "Conversion Rate", value: "67%", change: "+15%", icon: TrendingUp, color: "text-green-400" },
            { label: "Avg Booking Value", value: "$42K", change: "+18%", icon: DollarSign, color: "text-yellow-400" },
            { label: "Market Share", value: "12.3%", change: "+2.1%", icon: Globe, color: "text-purple-400" }
          ]
        };
      case "messages":
        return {
          title: "Communication Analytics",
          metrics: [
            { label: "Messages", value: "423", change: "+67", icon: MessageSquare, color: "text-blue-400" },
            { label: "Response Rate", value: "96%", change: "+4%", icon: TrendingUp, color: "text-green-400" },
            { label: "Avg Response", value: "3.2m", change: "-1.1m", icon: Clock, color: "text-yellow-400" },
            { label: "Active Chats", value: "34", change: "+12", icon: Users, color: "text-purple-400" }
          ]
        };
      case "revenue":
        return {
          title: "Revenue Analytics",
          metrics: [
            { label: "Revenue MTD", value: "$1.2M", change: "+28%", icon: DollarSign, color: "text-green-400" },
            { label: "Revenue YTD", value: "$14.8M", change: "+22%", icon: BarChart3, color: "text-blue-400" },
            { label: "Profit Margin", value: "34.2%", change: "+5.1%", icon: TrendingUp, color: "text-yellow-400" },
            { label: "Cost Per Hour", value: "$2,140", change: "-8%", icon: Fuel, color: "text-purple-400" }
          ]
        };
      default:
        return {
          title: "Operations Analytics",
          metrics: [
            { label: "Operational Score", value: "94", change: "+6", icon: Activity, color: "text-blue-400" },
            { label: "Efficiency", value: "89%", change: "+12%", icon: TrendingUp, color: "text-green-400" },
            { label: "Safety Rating", value: "A+", change: "Maintained", icon: Gauge, color: "text-yellow-400" },
            { label: "Client Rating", value: "4.9", change: "+0.1", icon: Users, color: "text-purple-400" }
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
            const isPositive = !metric.change.includes('-') && metric.change !== 'Maintained';
            return (
              <div key={index} className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${isPositive ? 'text-green-400 border-green-400/30' : metric.change === 'Maintained' ? 'text-blue-400 border-blue-400/30' : 'text-red-400 border-red-400/30'}`}
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
        
        {/* Operational insights */}
        <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Operational Insights</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1">
            {section === "fleet" && (
              <>
                <li>• G550 has highest utilization rate (89.2%)</li>
                <li>• Maintenance costs down 12% vs last quarter</li>
                <li>• Consider adding Citation X+ for mid-range routes</li>
              </>
            )}
            {section === "marketplace" && (
              <>
                <li>• Peak booking times: 8-11 AM, 2-4 PM EST</li>
                <li>• JFK-LAX corridor generates 32% of revenue</li>
                <li>• Weekend premium rates up 18% YoY</li>
              </>
            )}
            {section === "messages" && (
              <>
                <li>• Response time under 5min increases booking by 45%</li>
                <li>• Broker communications show highest engagement</li>
                <li>• Auto-responses handle 23% of initial inquiries</li>
              </>
            )}
            {section === "revenue" && (
              <>
                <li>• Q4 revenue tracking 28% above forecast</li>
                <li>• International routes yield 67% higher margins</li>
                <li>• Fuel hedging saved $340K this quarter</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
