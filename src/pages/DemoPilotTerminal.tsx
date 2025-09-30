import CommunityForums from '@/components/community/CommunityForums';
import DocumentStorage from '@/components/documents/DocumentStorage';
import { FlightRadar24Widget } from '@/components/flight-tracking/FlightRadar24Widget';
import JobBoard from '@/components/job-board/JobBoard';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import NoteTakingSystem from '@/components/NoteTakingSystem';
import RealTimeFlightTracker from '@/components/RealTimeFlightTracker';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertTriangle,
    ArrowUp,
    Award,
    BarChart3,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    HelpCircle,
    Navigation,
    Plane,
    Plus,
    RefreshCw,
    Settings,
    Shield,
    Star,
    User,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Flight {
  id: string;
  flightNumber: string;
  route: string;
  aircraft: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'active' | 'completed';
  operator: string;
  pay: number;
  currency: string;
  requirements: string[];
  flightHours: number;
}

interface Certification {
  id: string;
  name: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  hoursRequired: number;
  hoursCompleted: number;
}

export default function DemoPilotTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showJobBoard, setShowJobBoard] = useState(false);
  const [showCommunityForums, setShowCommunityForums] = useState(false);
  const [showDocumentStorage, setShowDocumentStorage] = useState(false);
  const navigate = useNavigate();

  const [flights] = useState<Flight[]>([
    {
      id: 'F-001',
      flightNumber: 'SC-1234',
      route: 'LHR - JFK',
      aircraft: 'Gulfstream G650',
      date: '2025-09-20',
      time: '14:30',
      duration: '7h 30m',
      status: 'upcoming',
      operator: 'SkyBridge Aviation',
      pay: 2500,
      currency: 'USD',
      requirements: ['Type Rating', 'IFR Current', 'High Altitude'],
      flightHours: 7.5
    },
    {
      id: 'F-002',
      flightNumber: 'SC-1235',
      route: 'CDG - LAX',
      aircraft: 'Global 6000',
      date: '2025-09-18',
      time: '09:15',
      duration: '11h 45m',
      status: 'active',
      operator: 'Elite Wings',
      pay: 3500,
      currency: 'USD',
      requirements: ['Oceanic Rating', 'ETOPS', 'Long Range'],
      flightHours: 11.75
    },
    {
      id: 'F-003',
      flightNumber: 'SC-1236',
      route: 'FRA - DXB',
      aircraft: 'Challenger 350',
      date: '2025-09-15',
      time: '16:20',
      duration: '6h 15m',
      status: 'completed',
      operator: 'AeroLux',
      pay: 2000,
      currency: 'USD',
      requirements: ['Type Rating', 'IFR Current'],
      flightHours: 6.25
    }
  ]);

  const [certifications] = useState<Certification[]>([
    {
      id: 'C-001',
      name: 'Gulfstream G650 Type Rating',
      expiryDate: '2026-03-15',
      status: 'valid',
      hoursRequired: 100,
      hoursCompleted: 150
    },
    {
      id: 'C-002',
      name: 'IFR Currency',
      expiryDate: '2025-10-20',
      status: 'expiring',
      hoursRequired: 6,
      hoursCompleted: 6
    },
    {
      id: 'C-003',
      name: 'Medical Certificate',
      expiryDate: '2025-12-01',
      status: 'valid',
      hoursRequired: 0,
      hoursCompleted: 0
    }
  ]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Flight Hours & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Total Flight Hours</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2,847</div>
            <p className="text-xs text-muted-foreground">+25 this month</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47.5</div>
            <p className="text-xs text-muted-foreground">hours flown</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Safety Rating</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4.9/5</div>
            <p className="text-xs text-muted-foreground">+0.1 vs last month</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$8,500</div>
            <p className="text-xs text-muted-foreground">+$1,200 vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Flight Tracker */}
      <RealTimeFlightTracker terminalType="pilot" />

      {/* Upcoming Flights */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-accent" />
            Upcoming Flights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flights.filter(f => f.status === 'upcoming').map((flight) => (
              <div key={flight.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{flight.flightNumber} - {flight.route}</p>
                    <p className="text-sm text-muted-foreground">
                      {flight.date} • {flight.time} • {flight.aircraft}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {flight.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{flight.pay} {flight.currency}</p>
                  <p className="text-sm text-muted-foreground">{flight.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications Status */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            Certifications Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 border border-terminal-border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">Expires: {cert.expiryDate}</p>
                  {cert.hoursRequired > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{cert.hoursCompleted}/{cert.hoursRequired} hours</span>
                      </div>
                      <div className="w-full bg-terminal-border rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (cert.hoursCompleted / cert.hoursRequired) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <Badge 
                  variant={cert.status === 'valid' ? 'default' : 
                          cert.status === 'expiring' ? 'secondary' : 'destructive'}
                  className={
                    cert.status === 'valid' ? 'bg-green-100 text-green-800' :
                    cert.status === 'expiring' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFlights = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">My Flights</h2>
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
        {flights.map((flight) => (
          <Card key={flight.id} className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant={flight.status === 'completed' ? 'default' : 
                              flight.status === 'active' ? 'secondary' : 'outline'}
                      className={
                        flight.status === 'completed' ? 'bg-green-100 text-green-800' :
                        flight.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground">
                      {flight.flightNumber} - {flight.route}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Aircraft</p>
                      <p className="font-medium text-foreground">{flight.aircraft}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-medium text-foreground">{flight.date} {flight.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">{flight.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Flight Hours</p>
                      <p className="font-medium text-foreground">{flight.flightHours}h</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {flight.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Operator</p>
                      <p className="font-medium text-foreground">{flight.operator}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Pay</p>
                      <p className="text-lg font-bold text-accent">{flight.pay} {flight.currency}</p>
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
              <p className="font-medium text-foreground">Captain James Mitchell</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">License</p>
              <p className="font-medium text-foreground">ATP • Multi-Engine</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="font-medium text-foreground">12 years</p>
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
              <Award className="w-5 h-5 text-accent" />
              Certifications & Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Type Ratings</p>
              <div className="flex flex-wrap gap-2">
                {['Gulfstream G650', 'Global 6000', 'Challenger 350', 'Citation X'].map((type) => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {['IFR', 'VFR', 'Oceanic', 'ETOPS', 'High Altitude'].map((spec) => (
                  <Badge key={spec} variant="outline">{spec}</Badge>
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
              <p className="text-2xl font-bold text-foreground">$8,500</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Flight Hours</p>
              <p className="font-medium text-foreground">2,847</p>
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
      <NoteTakingSystem terminalType="pilot" />
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
        role="pilot"
      />
    </div>
  );

  return (
    <>
      {showHelpGuide && (
      <ModernHelpGuide 
        terminalType="pilot" 
        activeTab={activeTab} 
          showOnMount={false} 
        isDemo={true}
          onClose={() => setShowHelpGuide(false)}
      />
      )}
      <div className="min-h-screen relative overflow-hidden scroll-smooth">
        {/* Cinematic Burnt Orange to Obsidian Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
          }}
        />
        
        {/* Cinematic Vignette - Creates spotlight effect on center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
          }}
        />
        
        {/* Subtle golden-orange glow in the center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
          }}
        />
        
        {/* Subtle grid pattern overlay - more refined */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
        </div>
        
        {/* Header */}
        <header className="relative z-10 sticky top-0 backdrop-blur-modern border-b border-terminal-border bg-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <StratusConnectLogo className="text-orange-400 text-lg mr-6" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Pilot Terminal (Demo)</h1>
                  <p className="text-sm text-gunmetal">Captain James Mitchell • ATP Multi-Engine</p>
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
              <TabsList className="flex w-max min-w-full justify-start space-x-1 backdrop-blur-sm" style={{ backgroundColor: 'hsla(210, 30%, 15%, 0.5)' }}>
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="flights" className="flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  Flights
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
            <TabsContent value="flights" className="scroll-smooth">
              {renderFlights()}
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
              <JobBoard userRole="pilot" />
            </TabsContent>
            <TabsContent value="community" className="scroll-smooth">
              <CommunityForums userRole="pilot" />
            </TabsContent>
            <TabsContent value="documents" className="scroll-smooth">
              <DocumentStorage userRole="pilot" />
            </TabsContent>
          </Tabs>
        </main>

        {/* Demo Banner */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-terminal-warning text-terminal-bg text-center py-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Demo Mode Active. This is a demonstration of the Pilot Terminal. All data is simulated and no real transactions will occur.
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
      
      {/* Intelligent AI Chatbot */}
            <RealTimeFlightTracker terminalType="pilot" />
    </>
  );
}