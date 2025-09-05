import { useState } from "react";
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
import { User, Briefcase, Award, Calendar, DollarSign, Globe, Shield } from "lucide-react";
import { NavigationArrows } from "@/components/NavigationArrows";
export default function CrewTerminal() {
  const [activeSection, setActiveSection] = useState("profile");
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
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-8">
            {/* Professional Profile Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Professional Profile</h1>
                <p className="text-gunmetal mt-2">Aviation career management and certifications</p>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProfileWidget />
              <div className="lg:col-span-2">
                <CrewProfile />
              </div>
            </div>
            
            <CrewAnalytics section="profile" />
          </div>
        );
      case "verification":
        return (
          <div className="space-y-6">
            <VerificationSystem />
          </div>
        );
      case "jobs":
        return (
          <div className="space-y-6">
            <CrewJobs />
            <CrewAnalytics section="jobs" />
          </div>
        );
      case "certifications":
        return (
          <div className="space-y-6">
            <CrewCertifications />
            <CrewAnalytics section="certifications" />
          </div>
        );
      case "availability":
        return (
          <div className="space-y-6">
            <CrewAvailability />
            <CrewAnalytics section="availability" />
          </div>
        );
      case "news":
        return (
          <div className="space-y-6">
            <AviationNews />
          </div>
        );
      case "earnings":
        return (
          <div className="space-y-8">
            {/* Earnings Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Earnings Overview</h1>
                <p className="text-gunmetal mt-2">Track your completed jobs and earnings</p>
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
          </div>
        );
      default:
        return <CrewProfile />;
    }
  };
  return <TerminalLayout title="Crew Terminal" userRole="Flight Crew" menuItems={menuItems} activeTab={activeSection} onTabChange={setActiveSection} bannerText="Professional service wins repeat work. Your calendar is your shop window." terminalType="crew">
      {renderContent()}
    </TerminalLayout>;
}