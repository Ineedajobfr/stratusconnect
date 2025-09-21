import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TerminalLayout } from "@/components/TerminalLayout";
import { KPICard } from "@/components/KPICard";
import { Section } from "@/components/Section";
import { DataTile } from "@/components/DataTile";
import CrewProfile from "@/components/CrewProfile";
import CrewJobs from "@/components/CrewJobs";
import CrewCertifications from "@/components/CrewCertifications";
import CrewAvailability from "@/components/CrewAvailability";
import VerificationSystem from "@/components/VerificationSystem";
import { AviationNews } from "@/components/AviationNews";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { CrewAnalytics } from "@/components/analytics/CrewAnalytics";
import { ProfileWidget } from "@/components/ProfileWidget";
import { FlightRadar24Widget } from "@/components/flight-tracking/FlightRadar24Widget";
import { PersonalizedFeed } from "@/components/feed/PersonalizedFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Award, Calendar, DollarSign, Globe, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavigationArrows } from "@/components/NavigationArrows";
export default function CrewTerminal() {
  const [activeSection, setActiveSection] = useState("profile");
  const location = useLocation();
  const isBetaMode = location.pathname.startsWith('/beta/');
  
  const menuItems = [{
    id: "profile",
    label: "My Profile",
    icon: User
  }, {
    id: "verification",
    label: "Fortress of Trust",
    icon: Shield
  }, {
    id: "jobs",
    label: "Job Requests",
    icon: Briefcase
  }, {
    id: "certifications",
    label: "Certifications",
    icon: Award
  }, {
    id: "availability",
    label: "Availability",
    icon: Calendar
  }, {
    id: "news",
    label: "Aviation News",
    icon: Globe
  }, {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign
  }];
  const renderContent = () => {
    return (
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 bg-terminal-card border-terminal-border text-xs overflow-x-auto">
          <TabsTrigger value="profile" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Profile</TabsTrigger>
          <TabsTrigger value="verification" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Trust</TabsTrigger>
          <TabsTrigger value="jobs" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Jobs</TabsTrigger>
          <TabsTrigger value="certifications" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Certs</TabsTrigger>
          <TabsTrigger value="availability" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Schedule</TabsTrigger>
          <TabsTrigger value="earnings" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Earnings</TabsTrigger>
          <TabsTrigger value="news" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">News</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Crew Terminal Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Crew Terminal</h1>
              <p className="text-gunmetal mt-1">Professional Service Excellence • Flight Crew Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-data-positive text-sm">
                <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
                <span className="font-mono">AVAILABLE</span>
              </div>
              <div className="text-gunmetal text-sm font-mono">
                {new Date().toLocaleTimeString()} UTC
              </div>
            </div>
          </div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Service Hours"
              value="1,240"
              delta="+45 this month"
              icon={Clock}
              variant="info"
            />
            <KPICard
              title="Active Jobs"
              value="2"
              delta="1 pending approval"
              icon={Briefcase}
              variant="warning"
            />
            <KPICard
              title="Certifications"
              value="8"
              delta="All current"
              icon={Award}
              variant="success"
            />
            <KPICard
              title="Rating"
              value="4.8/5"
              delta="Excellent"
              icon={CheckCircle}
              variant="success"
            />
          </div>

          {/* Flight Tracking Widget */}
          <Card className="bg-terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-cyan-400">Live Flight Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <FlightRadar24Widget />
            </CardContent>
          </Card>

          {/* Personalized Feed */}
          <PersonalizedFeed />

          {/* Profile Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProfileWidget />
            </div>
            <div className="lg:col-span-2">
              <CrewProfile />
            </div>
          </div>
          
          <CrewAnalytics section="profile" />
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <VerificationSystem />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <CrewJobs />
          <CrewAnalytics section="jobs" />
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <CrewCertifications />
          <CrewAnalytics section="certifications" />
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <CrewAvailability />
          <CrewAnalytics section="availability" />
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Earnings Overview</h1>
              <p className="text-gunmetal mt-1">Track your completed jobs and earnings</p>
            </div>
          </div>

          <CrewAnalytics section="earnings" />
          
          <Section
            title="Earnings Dashboard"
            subtitle="Detailed earnings and payment history"
          >
            <div className="relative">
              <PrivacyOverlay 
                title="Earnings Tracking" 
                description="Detailed earnings and payment history require account verification. Complete your profile to access this feature." 
                onUnlock={() => console.log('Unlock earnings')} 
                icon="chart" 
              />
              <div className="text-center text-gunmetal py-12">
                <p>Earnings tracking and payment history...</p>
              </div>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <AviationNews />
        </TabsContent>
      </Tabs>
    );
  };
  return <TerminalLayout title="Crew Terminal" userRole="Flight Crew" menuItems={menuItems} activeTab={activeSection} onTabChange={setActiveSection} bannerText="Professional service wins repeat work. Your calendar is your shop window." terminalType="crew">
      {renderContent()}
    </TerminalLayout>;
}