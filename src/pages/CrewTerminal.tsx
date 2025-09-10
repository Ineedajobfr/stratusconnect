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
import { User, Briefcase, Award, Calendar, DollarSign, Globe, Shield, Brain } from "lucide-react";
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
    id: "psychometric",
    label: "Personality Test",
    icon: Brain
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
              <div className="lg:col-span-1">
                {/* Crew Profile Card */}
                <div className="terminal-card p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-terminal-glow/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-terminal-glow" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">Captain Sarah Chen</h3>
                      <p className="text-gunmetal">Gulfstream G650 Type Rating</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-terminal-success/20 text-terminal-success">Available</Badge>
                        <Badge className="bg-terminal-info/20 text-terminal-info">Level 2 Verified</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-terminal-border">
                    <div>
                      <p className="text-xs text-gunmetal uppercase tracking-wide">Total Hours</p>
                      <p className="text-lg font-semibold text-foreground">8,240</p>
                    </div>
                    <div>
                      <p className="text-xs text-gunmetal uppercase tracking-wide">Experience</p>
                      <p className="text-lg font-semibold text-foreground">12 Years</p>
                    </div>
                  </div>
                </div>
              </div>
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
      case "psychometric":
        return (
          <div className="space-y-6">
            <div className="terminal-card p-6">
              <div className="flex items-center mb-6">
                <Brain className="w-8 h-8 text-accent mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Aviation Personality Assessment</h2>
                  <p className="text-gunmetal">Complete your psychometric evaluation to enhance your crew profile and improve job matching</p>
                </div>
              </div>
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-6 text-accent opacity-60" />
                <h3 className="text-xl font-semibold text-foreground mb-4">Personality Test</h3>
                <p className="text-gunmetal mb-6 max-w-md mx-auto">
                  Take our aviation-specific personality assessment to understand your working style, communication preferences, and how you work with operators and passengers.
                </p>
                <button 
                  onClick={() => window.open('/psych', '_blank')}
                  className="btn-terminal-accent px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            </div>
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