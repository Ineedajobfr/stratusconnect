import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import NoteTakingSystem from '@/components/NoteTakingSystem';
import EnhancedAIChatbot from '@/components/EnhancedAIChatbot';
import { FlightRadar24Widget } from '@/components/flight-tracking/FlightRadar24Widget';
import { DemoBanner } from '@/components/DemoBanner';
import JobBoard from '@/components/job-board/JobBoard';
import CommunityForums from '@/components/community/CommunityForums';
import DocumentStorage from '@/components/documents/DocumentStorage';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle,
  ArrowUp,
  RefreshCw,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Award,
  Briefcase,
  Plane,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  FileText,
  Navigation,
  Bell,
  Settings,
  User,
  Phone,
  Mail,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

interface Assignment {
  id: string;
  flightNumber: string;
  route: string;
  aircraft: string;
  date: string;
  time: string;
  duration: string;
  passengers: number;
  status: 'upcoming' | 'active' | 'completed';
  operator: string;
  pay: number;
  currency: string;
  requirements: string[];
}

interface Performance {
  id: string;
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export default function DemoCrewTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showJobBoard, setShowJobBoard] = useState(false);
  const [showCommunityForums, setShowCommunityForums] = useState(false);
  const [showDocumentStorage, setShowDocumentStorage] = useState(false);
  const navigate = useNavigate();

  const [assignments] = useState<Assignment[]>([
    {
      id: 'A-001',
      flightNumber: 'SC-1234',
      route: 'LHR - JFK',
      aircraft: 'Gulfstream G650',
      date: '2025-09-20',
      time: '14:30',
      duration: '7h 30m',
      passengers: 8,
      status: 'upcoming',
      operator: 'SkyBridge Aviation',
      pay: 850,
      currency: 'USD',
      requirements: ['VIP Service', 'Multi-language', 'Dietary Restrictions']
    },
    {
      id: 'A-002',
      flightNumber: 'SC-1235',
      route: 'CDG - LAX',
      aircraft: 'Global 6000',
      date: '2025-09-18',
      time: '09:15',
      duration: '11h 45m',
      passengers: 12,
      status: 'active',
      operator: 'Elite Wings',
      pay: 950,
      currency: 'USD',
      requirements: ['Champagne Service', 'Gourmet Catering']
    },
    {
      id: 'A-003',
      flightNumber: 'SC-1236',
      route: 'FRA - DXB',
      aircraft: 'Challenger 350',
      date: '2025-09-15',
      time: '16:20',
      duration: '6h 15m',
      passengers: 6,
      status: 'completed',
      operator: 'AeroLux',
      pay: 750,
      currency: 'USD',
      requirements: ['Business Class Service']
    }
  ]);

  const [performance] = useState<Performance[]>([
    {
      id: 'P-001',
      metric: 'Service Rating',
      value: '4.9/5',
      trend: 'up',
      change: '+0.2'
    },
    {
      id: 'P-002',
      metric: 'Flights Completed',
      value: '47',
      trend: 'up',
      change: '+12'
    },
    {
      id: 'P-003',
      metric: 'Monthly Earnings',
      value: '$3,850',
      trend: 'up',
      change: '+$450'
    },
    {
      id: 'P-004',
      metric: 'Availability',
      value: '95%',
      trend: 'stable',
      change: '0%'
    }
  ]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performance.map((perf) => (
          <Card key={perf.id} className="terminal-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gunmetal">{perf.metric}</CardTitle>
              <div className={`w-2 h-2 rounded-full ${
                perf.trend === 'up' ? 'bg-green-400' : 
                perf.trend === 'down' ? 'bg-red-400' : 'bg-yellow-400'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{perf.value}</div>
              <p className="text-xs text-muted-foreground">
                {perf.change} vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Assignments */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Upcoming Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.filter(a => a.status === 'upcoming').map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{assignment.flightNumber} - {assignment.route}</p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.date} • {assignment.time} • {assignment.aircraft}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {assignment.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{assignment.pay} {assignment.currency}</p>
                  <p className="text-sm text-muted-foreground">{assignment.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Completed FRA - DXB flight</p>
                <p className="text-xs text-muted-foreground">2 hours ago • $750 earned</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">New assignment available</p>
                <p className="text-xs text-muted-foreground">LHR - JFK • Gulfstream G650</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Performance bonus earned</p>
                <p className="text-xs text-muted-foreground">$200 for excellent service rating</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My Assignments</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="border-terminal-border">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="btn-terminal-accent">
            <Plus className="w-4 h-4 mr-2" />
            Apply for New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant={assignment.status === 'completed' ? 'default' : 
                              assignment.status === 'active' ? 'secondary' : 'outline'}
                      className={
                        assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground">
                      {assignment.flightNumber} - {assignment.route}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Aircraft</p>
                      <p className="font-medium text-foreground">{assignment.aircraft}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-medium text-foreground">{assignment.date} {assignment.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">{assignment.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Passengers</p>
                      <p className="font-medium text-foreground">{assignment.passengers}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {assignment.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Operator</p>
                      <p className="font-medium text-foreground">{assignment.operator}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Pay</p>
                      <p className="text-lg font-bold text-accent">{assignment.pay} {assignment.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
        <Button className="btn-terminal-accent">
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">Sophie Chen</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium text-foreground">Senior Flight Attendant</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="font-medium text-foreground">8 years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium text-foreground">4.9/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              Languages & Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Languages</p>
              <div className="flex flex-wrap gap-2">
                {['English', 'Mandarin', 'French', 'Spanish'].map((lang) => (
                  <Badge key={lang} variant="secondary">{lang}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {['VIP Service', 'Gourmet Catering', 'Medical Assistance', 'Multi-cultural'].map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              Earnings & Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-foreground">$3,850</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Availability</p>
              <p className="font-medium text-foreground">95%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Available</p>
              <p className="font-medium text-foreground">Sep 22, 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Note Taking System</h2>
        <Button className="btn-terminal-accent">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>
      <NoteTakingSystem terminalType="crew" />
    </div>
  );

  const renderTracking = () => (
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
        role="crew"
      />
    </div>
  );

  return (
    <>
      {showHelpGuide && (
      <ModernHelpGuide 
        terminalType="crew" 
        activeTab={activeTab} 
          showOnMount={false} 
        isDemo={true}
          onClose={() => setShowHelpGuide(false)}
      />
      )}
      <div className="min-h-screen bg-app relative overflow-hidden scroll-smooth">
        <StarfieldRunwayBackground />
        
        {/* Header */}
        <header className="relative z-10 sticky top-0 bg-terminal-card/80 backdrop-blur-modern border-b border-terminal-border">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <StratusConnectLogo className="text-orange-400 text-lg mr-6" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Crew Terminal (Demo)</h1>
                  <p className="text-sm text-gunmetal">Sophie Chen • Senior Flight Attendant</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-400">
                  STATUS: <span className="text-green-400">AVAILABLE</span>
                </div>
                <Button
                  onClick={() => setShowHelpGuide(true)}
                  className="w-12 h-12 bg-accent/20 hover:bg-accent/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-accent/30"
                  title="Help Guide"
                >
                  <HelpCircle className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Main Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent pb-2 mb-6">
              <TabsList className="flex w-max min-w-full justify-start space-x-1 bg-terminal-card/50 backdrop-blur-sm">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Assignments
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Tracking
                </TabsTrigger>
                <TabsTrigger value="jobs" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Job Board
                </TabsTrigger>
                <TabsTrigger value="community" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Community
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="scroll-smooth">
              {renderDashboard()}
            </TabsContent>
            <TabsContent value="assignments" className="scroll-smooth">
              {renderAssignments()}
            </TabsContent>
            <TabsContent value="profile" className="scroll-smooth">
              {renderProfile()}
            </TabsContent>
            <TabsContent value="notes" className="scroll-smooth">
              {renderNotes()}
            </TabsContent>
            <TabsContent value="tracking" className="scroll-smooth">
              {renderTracking()}
            </TabsContent>
            <TabsContent value="jobs" className="scroll-smooth">
              <JobBoard userRole="crew" />
            </TabsContent>
            <TabsContent value="community" className="scroll-smooth">
              <CommunityForums userRole="crew" />
            </TabsContent>
            <TabsContent value="documents" className="scroll-smooth">
              <DocumentStorage userRole="crew" />
            </TabsContent>
          </Tabs>
        </main>

        {/* Demo Banner */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-terminal-warning text-terminal-bg text-center py-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Demo Mode Active. This is a demonstration of the Crew Terminal. All data is simulated and no real transactions will occur.
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
      <EnhancedAIChatbot terminalType="crew" />
    </>
  );
}