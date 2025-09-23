import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KPICard } from "@/components/KPICard";
import { Section } from "@/components/Section";
import { DataTile } from "@/components/DataTile";
import VerificationSystem from "@/components/VerificationSystem";
import AviationNews from "@/components/AviationNews";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { ProfileWidget } from "@/components/ProfileWidget";
import { FlightRadar24Widget } from "@/components/flight-tracking/FlightRadar24Widget";
import { PersonalizedFeed } from "@/components/feed/PersonalizedFeed";
import NoteTakingSystem from "@/components/NoteTakingSystem";
import EnhancedAIChatbot from "@/components/EnhancedAIChatbot";
import AISearchAssistant from "@/components/AISearchAssistant";
import PredictiveAnalytics from "@/components/PredictiveAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Briefcase, 
  Award, 
  Calendar, 
  DollarSign, 
  Globe, 
  Shield, 
  Plane,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  FileText,
  Navigation,
  Plus,
  RefreshCw,
  ArrowUp,
  BarChart3,
  TrendingUp,
  Activity,
  Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModernHelpGuide } from "@/components/ModernHelpGuide";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import ModernPlasmaBackground from "@/components/ModernPlasmaBackground";

export default function PilotTerminal() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isBetaMode = location.pathname.startsWith('/beta/');

  return (
    <ModernPlasmaBackground>
      {showHelpGuide && (
        <ModernHelpGuide 
          terminalType="pilot" 
          activeTab={activeSection} 
          showOnMount={true} 
          isDemo={false}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
      <div className="min-h-screen relative overflow-hidden">
        
        {/* Header */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-2xl" terminalType="pilot" />
            <div>
              <h1 className="text-2xl font-bold text-white">Pilot Terminal</h1>
              <p className="text-sm text-white/70">Professional pilot management platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-mono">PILOT ACTIVE</span>
            </div>
                <div className="text-white/70 text-sm font-mono">
              {new Date().toLocaleTimeString()} UTC
            </div>
            <Button
              onClick={() => setShowHelpGuide(true)}
              className="w-12 h-12 bg-blue-500/20 hover:bg-blue-500/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-blue-500/30"
              title="Help Guide"
            >
              <HelpCircle className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className="relative z-10 p-6">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent pb-2">
            <TabsList className="flex w-max min-w-full justify-start space-x-1 bg-surface-1 ring-1 ring-white/5 backdrop-blur-sm">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 icon-glow" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <Shield className="w-4 h-4 icon-glow" />
                Trust
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 icon-glow" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Award className="w-4 h-4 icon-glow" />
                Licenses
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 icon-glow" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 icon-glow" />
                Earnings
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="w-4 h-4 icon-glow" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Navigation className="w-4 h-4 icon-glow" />
                Tracking
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Globe className="w-4 h-4 icon-glow" />
                News
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Flight Hours"
                value="2,847"
                delta="+127 this month"
                icon={Clock}
                variant="info"
                className="animate-fade-in-up"
                style={{animationDelay: '0.1s'}}
              />
              <KPICard
                title="Active Jobs"
                value="3"
                delta="2 pending approval"
                icon={Briefcase}
                variant="warning"
                className="animate-fade-in-up"
                style={{animationDelay: '0.2s'}}
              />
              <KPICard
                title="Certifications"
                value="12"
                delta="All current"
                icon={Award}
                variant="success"
                className="animate-fade-in-up"
                style={{animationDelay: '0.3s'}}
              />
              <KPICard
                title="Rating"
                value="4.9/5"
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

            {/* AI Components */}
            <AISearchAssistant terminalType="pilot" className="mb-6" />
            <PredictiveAnalytics terminalType="pilot" className="mb-6" />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProfileWidget />
              
              <Section 
                title="Today's Schedule"
                subtitle="Upcoming flights and duties"
                className="animate-fade-in-up"
                style={{animationDelay: '0.6s'}}
              >
                <div className="space-y-0">
                  {[
                    { 
                      time: "08:00", 
                      flight: "JFK → LAX", 
                      aircraft: "Gulfstream G650", 
                      status: "Confirmed",
                      statusColor: "text-terminal-success"
                    },
                    { 
                      time: "14:30", 
                      flight: "LAX → LAS", 
                      aircraft: "Citation X", 
                      status: "Pending",
                      statusColor: "text-terminal-warning"
                    },
                    { 
                      time: "18:00", 
                      flight: "LAS → JFK", 
                      aircraft: "Gulfstream G650", 
                      status: "Standby",
                      statusColor: "text-terminal-info"
                    }
                  ].map((flight, index) => (
                    <DataTile
                      key={index}
                      title={`${flight.time} - ${flight.flight}`}
                      subtitle={flight.aircraft}
                      rightSlot={
                        <div className="text-right">
                          <Badge className={`${flight.statusColor} bg-opacity-20`}>
                            {flight.status}
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

          <TabsContent value="verification" className="space-y-6">
            <VerificationSystem />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Section 
              title="Flight Schedule"
              subtitle="Your upcoming flights and availability"
            >
              <div className="text-center text-gunmetal py-12">
                <Calendar className="w-16 h-16 mx-auto mb-6 opacity-30" />
                <p className="terminal-subheader mb-2">Schedule Management</p>
                <p className="text-sm">
                  View and manage your flight schedule, availability, and duty times
                </p>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <Section 
              title="Pilot Certifications"
              subtitle="Current ratings and medical certificates"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    type: "ATP License", 
                    number: "ATP-123456", 
                    expires: "2025-12-15", 
                    status: "Current",
                    statusColor: "text-terminal-success"
                  },
                  { 
                    type: "Gulfstream G650", 
                    number: "G650-789", 
                    expires: "2024-03-20", 
                    status: "Expires Soon",
                    statusColor: "text-terminal-warning"
                  },
                  { 
                    type: "Medical Class 1", 
                    number: "MED-456789", 
                    expires: "2025-06-10", 
                    status: "Current",
                    statusColor: "text-terminal-success"
                  },
                  { 
                    type: "Instrument Rating", 
                    number: "IR-123456", 
                    expires: "2026-01-15", 
                    status: "Current",
                    statusColor: "text-terminal-success"
                  }
                ].map((cert, index) => (
                  <div key={index} className="terminal-card p-6 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{cert.type}</h3>
                      <Badge className={`${cert.statusColor} bg-opacity-20`}>
                        {cert.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gunmetal">Number:</span>
                        <span className="text-foreground font-mono">{cert.number}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gunmetal">Expires:</span>
                        <span className="text-foreground">{cert.expires}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Section 
              title="Job Pipeline"
              subtitle="Available positions and applications"
            >
              <div className="space-y-0">
                {[
                  { 
                    position: "Captain - Gulfstream G650", 
                    operator: "Elite Aviation", 
                    location: "New York, NY", 
                    pay: "$180,000/year",
                    status: "Applied",
                    statusColor: "text-terminal-info"
                  },
                  { 
                    position: "First Officer - Citation X", 
                    operator: "Charter Pro", 
                    location: "Miami, FL", 
                    pay: "$95,000/year",
                    status: "Interview",
                    statusColor: "text-terminal-warning"
                  },
                  { 
                    position: "Captain - Falcon 7X", 
                    operator: "Executive Jets", 
                    location: "Los Angeles, CA", 
                    pay: "$165,000/year",
                    status: "Available",
                    statusColor: "text-terminal-success"
                  }
                ].map((job, index) => (
                  <DataTile
                    key={index}
                    title={job.position}
                    subtitle={`${job.operator} • ${job.location}`}
                    rightSlot={
                      <div className="text-right">
                        <div className="text-accent font-semibold text-sm mb-1">{job.pay}</div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${job.statusColor} bg-opacity-20 text-xs`}>
                            {job.status}
                          </Badge>
                          <Button size="sm" className="btn-terminal-accent text-xs">
                            {job.status === "Available" ? "Apply" : "View"}
                          </Button>
                        </div>
                      </div>
                    }
                    className="data-tile-modern animate-slide-in-right"
                    style={{animationDelay: `${index * 0.1}s`}}
                  />
                ))}
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Earnings Overview</h1>
                <p className="text-gunmetal mt-2">Track your flight earnings and payment history</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title="This Month"
                value="$12,400"
                delta="+8.2% from last month"
                icon={DollarSign}
                variant="success"
                className="animate-fade-in-up"
                style={{animationDelay: '0.1s'}}
              />
              <KPICard
                title="YTD Earnings"
                value="$148,200"
                delta="+15.3% from last year"
                icon={DollarSign}
                variant="info"
                className="animate-fade-in-up"
                style={{animationDelay: '0.2s'}}
              />
              <KPICard
                title="Avg. per Flight"
                value="$2,100"
                delta="+$150 improvement"
                icon={DollarSign}
                variant="success"
                className="animate-fade-in-up"
                style={{animationDelay: '0.3s'}}
              />
            </div>

            <Section
              title="Recent Payments"
              subtitle="Latest earnings and payment details"
            >
              <div className="relative">
                <PrivacyOverlay 
                  title="Earnings Tracking" 
                  description="Detailed earnings and payment history require account verification. Complete your profile to access this feature." 
                  onUnlock={() => console.log('Unlock earnings')} 
                  icon="chart" 
                />
                <div className="text-center text-gunmetal py-12">
                  <DollarSign className="w-16 h-16 mx-auto mb-6 opacity-30" />
                  <p className="terminal-subheader mb-2">Payment History</p>
                  <p className="text-sm">
                    Detailed earnings and payment history will appear here
                  </p>
                </div>
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Note Taking System</h2>
                <Button className="btn-terminal-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </div>
              <NoteTakingSystem terminalType="pilot" />
            </div>
          </TabsContent>

          <TabsContent value="tracking">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Flight Tracking</h2>
                <Button className="btn-terminal-accent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <FlightRadar24Widget 
                tailNumbers={['N123SC', 'N456AV', 'N789OP']}
                showMap={true}
                autoRefresh={true}
                refreshInterval={30}
                role="pilot"
              />
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <AviationNews />
          </TabsContent>
        </Tabs>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-accent/80 hover:bg-accent rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm border border-accent/30"
        title="Scroll to Top"
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </Button>
      
      {/* Enhanced AI Chatbot */}
      <EnhancedAIChatbot terminalType="pilot" />
      
    </ModernPlasmaBackground>
  );
}
