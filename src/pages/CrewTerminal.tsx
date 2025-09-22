import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, Award, Calendar, DollarSign, Globe, Shield, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModernHelpGuide } from "@/components/ModernHelpGuide";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { HelpCircle } from "lucide-react";

export default function CrewTerminal() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isBetaMode = location.pathname.startsWith('/beta/');
  
        return (
    <>
      {showHelpGuide && (
        <ModernHelpGuide 
          terminalType="crew" 
          activeTab={activeSection} 
          showOnMount={false} 
          isDemo={false}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
      <div className="min-h-screen bg-app relative overflow-hidden">
        <StarfieldRunwayBackground />
        
        {/* Header */}
        <div className="relative z-10 bg-terminal-card border-b border-terminal-border px-6 py-4 backdrop-blur-modern">
            <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center hover:bg-accent/80 transition-colors cursor-pointer"
              >
                <span className="text-white font-bold text-sm">SC</span>
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground">StratusConnect</h1>
                <p className="text-sm text-gunmetal">Crew Terminal</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-data-positive text-sm">
              <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
              <span className="font-mono">CREW ACTIVE</span>
            </div>
            <div className="text-gunmetal text-sm font-mono">
              {new Date().toLocaleTimeString()} UTC
                    </div>
                      </div>
                    </div>
                  </div>
                  
        {/* Main Content */}
        <div className="relative z-10 p-6">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 bg-terminal-card border-terminal-border text-xs overflow-x-auto tabs-modern">
            <TabsTrigger value="dashboard" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Profile</TabsTrigger>
            <TabsTrigger value="verification" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Trust</TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Jobs</TabsTrigger>
            <TabsTrigger value="certifications" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Certifications</TabsTrigger>
            <TabsTrigger value="availability" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Availability</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Analytics</TabsTrigger>
            <TabsTrigger value="news" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">News</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Flight Hours"
                value="1,247"
                delta="+89 this month"
                icon={Clock}
                variant="info"
                className="animate-fade-in-up"
                style={{animationDelay: '0.1s'}}
              />
              <KPICard
                title="Active Jobs"
                value="2"
                delta="1 pending approval"
                icon={Briefcase}
                variant="warning"
                className="animate-fade-in-up"
                style={{animationDelay: '0.2s'}}
              />
              <KPICard
                title="Certifications"
                value="8"
                delta="All current"
                icon={Award}
                variant="success"
                className="animate-fade-in-up"
                style={{animationDelay: '0.3s'}}
              />
              <KPICard
                title="Rating"
                value="4.7/5"
                delta="Excellent"
                icon={CheckCircle}
                variant="success"
                className="animate-fade-in-up"
                style={{animationDelay: '0.4s'}}
              />
                    </div>

            {/* Flight Tracking Widget */}
            <Card className="terminal-card animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <CardHeader>
                <CardTitle className="text-accent">Real-time Aircraft Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <FlightRadar24Widget />
              </CardContent>
            </Card>

            {/* Personalized Feed */}
            <PersonalizedFeed />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProfileWidget />
              
              <Section 
                title="Today's Assignments"
                subtitle="Upcoming flights and duties"
                className="animate-fade-in-up"
                style={{animationDelay: '0.6s'}}
              >
                <div className="space-y-0">
                  {[
                    { 
                      time: "09:00", 
                      flight: "JFK → LAX", 
                      aircraft: "Gulfstream G650", 
                      role: "Flight Attendant",
                      status: "Confirmed",
                      statusColor: "text-terminal-success"
                    },
                    { 
                      time: "15:30", 
                      flight: "LAX → LAS", 
                      aircraft: "Citation X", 
                      role: "Cabin Crew",
                      status: "Pending",
                      statusColor: "text-terminal-warning"
                    },
                    { 
                      time: "19:00", 
                      flight: "LAS → JFK", 
                      aircraft: "Gulfstream G650", 
                      role: "Flight Attendant",
                      status: "Standby",
                      statusColor: "text-terminal-info"
                    }
                  ].map((assignment, index) => (
                    <DataTile
                      key={index}
                      title={`${assignment.time} - ${assignment.flight}`}
                      subtitle={`${assignment.aircraft} • ${assignment.role}`}
                      rightSlot={
                        <div className="text-right">
                          <Badge className={`${assignment.statusColor} bg-opacity-20`}>
                            {assignment.status}
                          </Badge>
                    </div>
                      }
                      className="data-tile-modern animate-slide-in-right"
                      style={{animationDelay: `${0.7 + index * 0.1}s`}}
                    />
                  ))}
                </div>
              </Section>

              <Section 
                title="Weather & Notices"
                subtitle="Current conditions and alerts"
                className="animate-fade-in-up"
                style={{animationDelay: '0.8s'}}
              >
                <div className="space-y-0">
                  {[
                    { 
                      location: "JFK", 
                      condition: "Clear", 
                      visibility: "10+ SM", 
                      wind: "NW 8kt",
                      status: "Good"
                    },
                    { 
                      location: "LAX", 
                      condition: "Partly Cloudy", 
                      visibility: "8 SM", 
                      wind: "W 12kt",
                      status: "Good"
                    },
                    { 
                      location: "LAS", 
                      condition: "Clear", 
                      visibility: "10+ SM", 
                      wind: "Calm",
                      status: "Excellent"
                    }
                  ].map((weather, index) => (
                    <DataTile
                      key={index}
                      title={weather.location}
                      subtitle={`${weather.condition} • ${weather.visibility}`}
                      rightSlot={
                        <div className="text-right">
                          <div className="text-sm text-gunmetal">{weather.wind}</div>
                          <Badge className="text-terminal-success bg-terminal-success/20 text-xs">
                            {weather.status}
                          </Badge>
              </div>
                      }
                      className="data-tile-modern animate-slide-in-right"
                      style={{animationDelay: `${0.9 + index * 0.1}s`}}
                    />
                  ))}
              </div>
              </Section>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <CrewProfile />
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <VerificationSystem />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <CrewJobs />
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <CrewCertifications />
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <CrewAvailability />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <CrewAnalytics />
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <AviationNews />
          </TabsContent>
        </Tabs>
              </div>
        
        {/* Help Guide Button */}
        <button
          onClick={() => setShowHelpGuide(true)}
          className="fixed top-4 right-4 z-50 w-12 h-12 bg-accent/20 hover:bg-accent/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-accent/30"
          title="Help Guide"
        >
          <HelpCircle className="w-6 h-6 text-white" />
        </button>
        
        {/* StratusConnect Logo */}
        <div className="fixed top-4 left-4 z-50">
          <StratusConnectLogo className="text-white text-2xl" />
        </div>
      </div>
    </>
  );
}