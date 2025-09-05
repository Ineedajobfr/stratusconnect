import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Clock, DollarSign, Award, Calendar, Star, CheckCircle, Users, Briefcase } from "lucide-react";

interface CrewAnalyticsProps {
  section: string;
}

export const CrewAnalytics = ({ section }: CrewAnalyticsProps) => {
  const getAnalyticsData = () => {
    switch (section) {
      case "profile":
        return {
          title: "Profile Analytics",
          metrics: [
            { label: "Profile Views", value: "247", change: "+18%", icon: Users, color: "text-blue-400" },
            { label: "Profile Score", value: "94%", change: "+6%", icon: Star, color: "text-yellow-400" },
            { label: "Completion Rate", value: "89%", change: "+12%", icon: CheckCircle, color: "text-green-400" },
            { label: "Response Rate", value: "2.4h", change: "-0.8h", icon: Clock, color: "text-purple-400" }
          ]
        };
      case "jobs":
        return {
          title: "Job Performance Analytics", 
          metrics: [
            { label: "Applications Sent", value: "34", change: "+12", icon: Briefcase, color: "text-blue-400" },
            { label: "Interview Rate", value: "68%", change: "+15%", icon: TrendingUp, color: "text-green-400" },
            { label: "Success Rate", value: "24%", change: "+8%", icon: CheckCircle, color: "text-yellow-400" },
            { label: "Avg Response", value: "1.2d", change: "-0.5d", icon: Clock, color: "text-purple-400" }
          ]
        };
      case "certifications":
        return {
          title: "Certification Analytics",
          metrics: [
            { label: "Active Certs", value: "12", change: "+2", icon: Award, color: "text-blue-400" },
            { label: "Expiring Soon", value: "3", change: "0", icon: Calendar, color: "text-yellow-400" },
            { label: "Renewal Rate", value: "98%", change: "+2%", icon: TrendingUp, color: "text-green-400" },
            { label: "Compliance Score", value: "96%", change: "+1%", icon: CheckCircle, color: "text-purple-400" }
          ]
        };
      case "availability":
        return {
          title: "Availability Analytics",
          metrics: [
            { label: "Available Days", value: "18", change: "+3", icon: Calendar, color: "text-blue-400" },
            { label: "Booking Rate", value: "72%", change: "+8%", icon: TrendingUp, color: "text-green-400" },
            { label: "Hours Logged", value: "156h", change: "+24h", icon: Clock, color: "text-yellow-400" },
            { label: "Utilization", value: "84%", change: "+12%", icon: BarChart3, color: "text-purple-400" }
          ]
        };
      case "earnings":
        return {
          title: "Earnings Analytics",
          metrics: [
            { label: "MTD Earnings", value: "$8.4K", change: "+24%", icon: DollarSign, color: "text-green-400" },
            { label: "YTD Earnings", value: "$124K", change: "+18%", icon: TrendingUp, color: "text-blue-400" },
            { label: "Avg Per Job", value: "$2.1K", change: "+8%", icon: Star, color: "text-yellow-400" },
            { label: "Hours/Week", value: "38.2h", change: "+4.2h", icon: Clock, color: "text-purple-400" }
          ]
        };
      default:
        return {
          title: "General Analytics",
          metrics: [
            { label: "Activity Score", value: "87", change: "+5", icon: BarChart3, color: "text-blue-400" },
            { label: "Performance", value: "94%", change: "+8%", icon: TrendingUp, color: "text-green-400" },
            { label: "Efficiency", value: "92%", change: "+3%", icon: CheckCircle, color: "text-yellow-400" },
            { label: "Rating", value: "4.8", change: "+0.2", icon: Star, color: "text-purple-400" }
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
        
        {/* Quick insights */}
        <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Quick Insights</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1">
            {section === "profile" && (
              <>
                <li>• Profile views increased 18% this month</li>
                <li>• Consider updating your availability calendar</li>
                <li>• Add more certifications to boost visibility</li>
              </>
            )}
            {section === "jobs" && (
              <>
                <li>• Your interview rate is above average (68% vs 52%)</li>
                <li>• Peak job postings: Tuesday-Thursday 9-11 AM</li>
                <li>• Consider expanding to mid-size aircraft roles</li>
              </>
            )}
            {section === "certifications" && (
              <>
                <li>• 3 certifications expire within 90 days</li>
                <li>• ICAO English Proficiency renewal recommended</li>
                <li>• Your compliance score is excellent (96%)</li>
              </>
            )}
            {section === "availability" && (
              <>
                <li>• 18 available days this month (+3 vs last month)</li>
                <li>• Peak demand periods: Dec 15-31, Mar 10-25</li>
                <li>• Your booking rate is 20% above average</li>
              </>
            )}
            {section === "earnings" && (
              <>
                <li>• On track for $148K annual earnings (+22% YoY)</li>
                <li>• Highest paying routes: JFK-LAX, MIA-TEB</li>
                <li>• Weekend shifts offer 35% premium rates</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};