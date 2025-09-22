import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Plane,
  Clock,
  Target,
  Search,
  Bell,
  Award,
  BarChart3,
  Zap,
  Star,
  MapPin,
  Calendar,
  GitCompare,
  Save,
  Eye,
  Plus,
  Filter,
  Download,
  UserPlus,
  Briefcase,
  CreditCard,
  Building,
  Activity
} from 'lucide-react';

interface RFQ {
  id: string;
  route: string;
  aircraft: string;
  date: string;
  price: number;
  currency: string;
  status: 'quoted' | 'sent' | 'accepted' | 'rejected';
  legs: number;
  passengers: number;
  specialRequirements: string;
  quotes: Quote[];
}

interface Quote {
  id: string;
  operator: string;
  price: number;
  currency: string;
  validUntil: string;
  aircraft: string;
  verified: boolean;
  rating: number;
  responseTime: number;
  dealScore: number;
}

interface Pilot {
  id: string;
  name: string;
  role: string;
  experience: number;
  hourlyRate: number;
  currency: string;
  credentials: {
    license: string;
    medical: string;
    typeRating: string[];
    expiry: string;
  };
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  experience: number;
  hourlyRate: number;
  currency: string;
  specialties: string[];
  certifications: string[];
}

export default function DemoOperatorTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [isDemoMode] = useState(true);

  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: 'RFQ-001',
      route: 'London - New York',
      aircraft: 'Gulfstream G650',
      date: '2024-01-20',
      price: 45000,
      currency: 'USD',
      status: 'quoted',
      legs: 1,
      passengers: 8,
      specialRequirements: 'VIP handling, customs clearance',
      quotes: []
    },
    {
      id: 'RFQ-002',
      route: 'Paris - Dubai',
      aircraft: 'Bombardier Global 6000',
      date: '2024-01-22',
      price: 38000,
      currency: 'EUR',
      status: 'sent',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Pet transport, special catering',
      quotes: []
    }
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 'Q-001',
      operator: 'Elite Aviation',
      price: 45000,
      currency: 'USD',
      validUntil: '2024-01-18T18:00:00Z',
      aircraft: 'Gulfstream G650',
      verified: true,
      rating: 4.8,
      responseTime: 15,
      dealScore: 92
    }
  ]);

  const [pilots] = useState<Pilot[]>([
    {
      id: 'PILOT-001',
      name: 'Sarah Williams',
      role: 'Captain',
      experience: 8,
      hourlyRate: 200,
      currency: 'USD',
      credentials: {
        license: 'ATPL',
        medical: 'Class 1',
        typeRating: ['G650', 'G550', 'Citation X'],
        expiry: '2024-12-31'
      }
    },
    {
      id: 'PILOT-002',
      name: 'Mike Johnson',
      role: 'First Officer',
      experience: 5,
      hourlyRate: 150,
      currency: 'USD',
      credentials: {
        license: 'ATPL',
        medical: 'Class 1',
        typeRating: ['G650', 'G550', 'Citation X'],
        expiry: '2024-12-31'
      }
    }
  ]);

  const [crew] = useState<CrewMember[]>([
    {
      id: 'CREW-001',
      name: 'Emma Davis',
      role: 'Senior Flight Attendant',
      experience: 6,
      hourlyRate: 45,
      currency: 'USD',
      specialties: ['VIP Service', 'International Routes'],
      certifications: ['Safety Training', 'First Aid', 'Wine Service']
    },
    {
      id: 'CREW-002',
      name: 'James Wilson',
      role: 'Flight Attendant',
      experience: 3,
      hourlyRate: 35,
      currency: 'USD',
      specialties: ['Catering', 'Ground Operations'],
      certifications: ['Safety Training', 'First Aid']
    }
  ]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Active RFQs</p>
                <p className="text-2xl font-bold text-foreground">{rfqs.length}</p>
                <p className="text-xs text-white">+8% this week</p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Fleet Utilization</p>
                <p className="text-2xl font-bold text-foreground">87%</p>
                <p className="text-xs text-data-positive">+12% this month</p>
              </div>
              <Plane className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">$2.4M</p>
                <p className="text-xs text-data-positive">+15% vs last month</p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Active Crew</p>
                <p className="text-2xl font-bold text-foreground">{pilots.length + crew.length}</p>
                <p className="text-xs text-white">All certified</p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-terminal-border/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-data-positive rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">New RFQ received</p>
                  <p className="text-xs text-gunmetal">London - New York • Gulfstream G650</p>
                </div>
              </div>
              <Badge className="bg-data-positive/20 text-data-positive border-data-positive/30">
                New
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-terminal-border/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Quote submitted</p>
                  <p className="text-xs text-gunmetal">Paris - Dubai • $38,000</p>
                </div>
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/30">
                Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRFQs = () => (
    <div className="space-y-4">
      {rfqs.map(rfq => (
        <Card key={rfq.id} className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{rfq.route}</h3>
                <p className="text-sm text-gunmetal">{rfq.aircraft} • {rfq.passengers} passengers</p>
                <p className="text-sm text-gunmetal">Departure: {rfq.date}</p>
              </div>
              <Badge className={
                rfq.status === 'quoted' ? 'bg-data-positive/20 text-data-positive border-data-positive/30' :
                rfq.status === 'sent' ? 'bg-accent/20 text-accent border-accent/30' :
                'bg-gunmetal/20 text-gunmetal border-gunmetal/30'
              }>
                {rfq.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-foreground">
                  {rfq.currency} {rfq.price.toLocaleString()}
                </div>
                <div className="text-sm text-gunmetal">
                  {rfq.legs} leg{rfq.legs > 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-terminal-border">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/80">
                  <Target className="w-4 h-4 mr-2" />
                  Auto-Quote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPilots = () => (
    <div className="space-y-4">
      {pilots.map(pilot => (
        <Card key={pilot.id} className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{pilot.name}</h3>
                <p className="text-sm text-gunmetal">{pilot.role} • {pilot.experience} years experience</p>
                <p className="text-sm text-gunmetal">${pilot.hourlyRate}/hour • {pilot.credentials.license}</p>
              </div>
              <Badge className="bg-data-positive/20 text-data-positive border-data-positive/30">
                Available
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gunmetal">
                Type Ratings: {pilot.credentials.typeRating.join(', ')}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-terminal-border">
                  <Eye className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/80">
                  <FileText className="w-4 h-4 mr-2" />
                  Credentials
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCrew = () => (
    <div className="space-y-4">
      {crew.map(crewMember => (
        <Card key={crewMember.id} className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{crewMember.name}</h3>
                <p className="text-sm text-gunmetal">{crewMember.role} • {crewMember.experience} years experience</p>
                <p className="text-sm text-gunmetal">${crewMember.hourlyRate}/hour</p>
              </div>
              <Badge className="bg-data-positive/20 text-data-positive border-data-positive/30">
                Available
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gunmetal">
                Specialties: {crewMember.specialties.join(', ')}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-terminal-border">
                  <Eye className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/80">
                  <FileText className="w-4 h-4 mr-2" />
                  Certificates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFleet = () => (
    <div className="space-y-4">
      <Card className="terminal-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Gulfstream G650</h3>
              <p className="text-sm text-gunmetal">Registration: N650SC • 8 passengers</p>
              <p className="text-sm text-gunmetal">Next maintenance: Feb 15, 2024</p>
            </div>
            <Badge className="bg-data-positive/20 text-data-positive border-data-positive/30">
              Available
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gunmetal">
              Utilization: 87% • 245 flight hours this month
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-terminal-border">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/80">
                <FileText className="w-4 h-4 mr-2" />
                Maintenance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Revenue Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-terminal-border/20 rounded-lg">
              <p className="text-sm text-gunmetal">This Month</p>
              <p className="text-2xl font-bold text-foreground">$2,400,000</p>
              <p className="text-xs text-data-positive">+15% vs last month</p>
            </div>
            <div className="p-4 bg-terminal-border/20 rounded-lg">
              <p className="text-sm text-gunmetal">Average per Flight</p>
              <p className="text-2xl font-bold text-foreground">$45,000</p>
              <p className="text-xs text-data-positive">+8% vs last month</p>
            </div>
            <div className="p-4 bg-terminal-border/20 rounded-lg">
              <p className="text-sm text-gunmetal">Platform Fees</p>
              <p className="text-2xl font-bold text-foreground">$24,000</p>
              <p className="text-xs text-gunmetal">1% of revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <ModernHelpGuide 
        terminalType="operator" 
        activeTab={activeTab} 
        showOnMount={true} 
        isDemo={true}
      />
      <div className="min-h-screen bg-app relative overflow-hidden">
        <StarfieldRunwayBackground />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center hover:bg-accent/80 transition-colors cursor-pointer"
              >
                <span className="text-white font-bold text-sm">SC</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">StratusConnect</h1>
                <p className="text-gunmetal">Operator Terminal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-gunmetal text-sm font-mono">
                {new Date().toLocaleTimeString()} UTC
              </div>
              {isDemoMode && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>

          {/* Main Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="rfqs" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                RFQs
              </TabsTrigger>
              <TabsTrigger value="pilots" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Pilots
              </TabsTrigger>
              <TabsTrigger value="crew" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Crew
              </TabsTrigger>
              <TabsTrigger value="fleet" className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Fleet
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              {renderDashboard()}
            </TabsContent>
            <TabsContent value="rfqs">
              {renderRFQs()}
            </TabsContent>
            <TabsContent value="pilots">
              {renderPilots()}
            </TabsContent>
            <TabsContent value="crew">
              {renderCrew()}
            </TabsContent>
            <TabsContent value="fleet">
              {renderFleet()}
            </TabsContent>
            <TabsContent value="billing">
              {renderBilling()}
            </TabsContent>
          </Tabs>

          {/* Demo Notice */}
          {isDemoMode && (
            <Card className="mt-8 bg-slate-800 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-yellow-400 font-medium">Demo Mode Active</p>
                    <p className="text-sm text-gray-300">
                      This is a demonstration of the Operator Terminal. All data is simulated and no real transactions will occur.
                      The platform operates 100% free until revenue is generated.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}