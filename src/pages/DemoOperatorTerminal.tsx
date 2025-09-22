// Enhanced Demo Operator Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import AISearchAssistant from '@/components/AISearchAssistant';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import AIChatbot from '@/components/AIChatbot';
import NoteTakingSystem from '@/components/NoteTakingSystem';
import EnhancedAIChatbot from '@/components/EnhancedAIChatbot';
import { FlightRadar24Widget } from '@/components/flight-tracking/FlightRadar24Widget';
import AviationNews from '@/components/AviationNews';
import JobPostingManagement from '@/components/Operator/JobPostingManagement';
import FleetAssignmentTracking from '@/components/Operator/FleetAssignmentTracking';
import OperatorAnalytics from '@/components/Operator/OperatorAnalytics';
import FloatingChat from '@/components/FloatingChat';
import { RankingDashboard } from '@/components/gamification/RankingDashboard';
import { TierSystem } from '@/components/gamification/TierSystem';
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
  Activity,
  Settings,
  Wrench,
  Fuel,
  Navigation,
  Headphones,
  HelpCircle,
  ArrowUp,
  RefreshCw,
  Globe
} from 'lucide-react';

interface RFQ {
  id: string;
  route: string;
  aircraft: string;
  date: string;
  price: number;
  currency: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  legs: number;
  passengers: number;
  specialRequirements: string;
  broker: string;
  priority: 'low' | 'medium' | 'high';
}

interface Pilot {
  id: string;
  name: string;
  rating: number;
  hours: number;
  certifications: string[];
  availability: string;
  location: string;
  hourlyRate: number;
  currency: string;
  status: 'available' | 'assigned' | 'offline';
}

interface Crew {
  id: string;
  name: string;
  role: string;
  rating: number;
  experience: number;
  languages: string[];
  availability: string;
  location: string;
  hourlyRate: number;
  currency: string;
  status: 'available' | 'assigned' | 'offline';
}

interface Aircraft {
  id: string;
  model: string;
  registration: string;
  status: 'available' | 'in-flight' | 'maintenance' | 'scheduled';
  location: string;
  nextFlight: string;
  utilization: number;
  hours: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

export default function DemoOperatorTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [showWeekOneScoreboard, setShowWeekOneScoreboard] = useState(false);
  const [showWarRoomChecks, setShowWarRoomChecks] = useState(false);
  const [liveFlowResult, setLiveFlowResult] = useState<unknown>(null);
  const [warRoomResult, setWarRoomResult] = useState<unknown>(null);
  const [evidencePack, setEvidencePack] = useState<unknown>(null);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: 'RFQ-001',
      route: 'London - New York',
      aircraft: 'Gulfstream G650',
      date: '2025-09-20',
      price: 45000,
      currency: 'USD',
      status: 'pending',
      legs: 1,
      passengers: 8,
      specialRequirements: 'WiFi, catering for dietary restrictions',
      broker: 'Elite Aviation Brokers',
      priority: 'high'
    },
    {
      id: 'RFQ-002',
      route: 'Paris - Dubai',
      aircraft: 'Global 6000',
      date: '2025-09-25',
      price: 32000,
      currency: 'EUR',
      status: 'quoted',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Pet transport approved',
      broker: 'SkyHigh Aviation',
      priority: 'medium'
    },
    {
      id: 'RFQ-003',
      route: 'Los Angeles - Tokyo',
      aircraft: 'Bombardier Global 7500',
      date: '2025-09-28',
      price: 85000,
    currency: 'USD',
      status: 'accepted',
    legs: 1,
      passengers: 6,
      specialRequirements: 'VIP security detail',
      broker: 'Pacific Aviation Group',
      priority: 'high'
    }
  ]);

  const [pilots, setPilots] = useState<Pilot[]>([
    {
      id: 'P-001',
      name: 'Captain Sarah Mitchell',
      rating: 4.9,
      hours: 8500,
      certifications: ['ATP', 'Type Rating G650', 'IFR'],
      availability: 'Available',
      location: 'New York',
      hourlyRate: 450,
    currency: 'USD',
      status: 'available'
    },
    {
      id: 'P-002',
      name: 'Captain James Rodriguez',
    rating: 4.8,
      hours: 7200,
      certifications: ['ATP', 'Type Rating Global 6000', 'IFR'],
      availability: 'Available',
      location: 'London',
      hourlyRate: 420,
    currency: 'USD',
      status: 'available'
    },
    {
      id: 'P-003',
      name: 'Captain Emma Thompson',
    rating: 4.9,
      hours: 9200,
      certifications: ['ATP', 'Type Rating Global 7500', 'IFR', 'Captain'],
      availability: 'Assigned',
      location: 'Los Angeles',
      hourlyRate: 500,
    currency: 'USD',
      status: 'assigned'
    }
  ]);

  const [crew, setCrew] = useState<Crew[]>([
    {
      id: 'C-001',
      name: 'Sophie Chen',
      role: 'Senior Flight Attendant',
      rating: 4.9,
      experience: 8,
      languages: ['English', 'Mandarin', 'French'],
      availability: 'Available',
      location: 'New York',
      hourlyRate: 85,
    currency: 'USD',
      status: 'available'
    },
    {
      id: 'C-002',
      name: 'Marcus Johnson',
    role: 'Flight Attendant',
      rating: 4.7,
      experience: 5,
      languages: ['English', 'Spanish'],
      availability: 'Available',
      location: 'London',
      hourlyRate: 75,
      currency: 'USD',
      status: 'available'
    },
    {
      id: 'C-003',
      name: 'Isabella Rossi',
      role: 'Senior Flight Attendant',
    rating: 4.8,
      experience: 7,
      languages: ['English', 'Italian', 'French'],
      availability: 'Assigned',
      location: 'Paris',
      hourlyRate: 90,
    currency: 'USD',
      status: 'assigned'
    }
  ]);

  const [fleet, setFleet] = useState<Aircraft[]>([
    {
      id: 'A-001',
      model: 'Gulfstream G650',
      registration: 'N425SC',
      status: 'available',
      location: 'JFK',
      nextFlight: 'Tomorrow 14:00',
      utilization: 78,
      hours: 2850,
      lastMaintenance: '2025-08-15',
      nextMaintenance: '2025-10-15'
    },
    {
      id: 'A-002',
      model: 'Bombardier Global 6000',
      registration: 'N892AV',
      status: 'in-flight',
      location: 'LAX',
      nextFlight: 'Landing 16:30',
      utilization: 85,
      hours: 3200,
      lastMaintenance: '2025-07-20',
      nextMaintenance: '2025-09-20'
    },
    {
      id: 'A-003',
      model: 'Bombardier Global 7500',
      registration: 'N750SC',
      status: 'maintenance',
      location: 'Hangar 3',
      nextFlight: 'Available Sep 22',
      utilization: 92,
      hours: 1800,
      lastMaintenance: '2025-09-10',
      nextMaintenance: '2025-11-10'
    }
  ]);

  const handleLiveFlowTest = async () => {
    try {
      const result = await liveFlowTester.runComprehensiveTest();
    setLiveFlowResult(result);
    } catch (error) {
      console.error('Live flow test failed:', error);
    }
  };

  const handleWarRoomCheck = async () => {
    try {
    const result = await warRoomChecker.runAllChecks();
    setWarRoomResult(result);
    } catch (error) {
      console.error('War room check failed:', error);
    }
  };

  const handleGenerateEvidencePack = async () => {
    try {
      const pack = await evidencePackGenerator.generateComprehensivePack();
      setEvidencePack(pack);
    } catch (error) {
      console.error('Evidence pack generation failed:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Active RFQs</CardTitle>
            <FileText className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground">+8% this week</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Fleet Utilization</CardTitle>
            <Plane className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">87%</div>
            <p className="text-xs text-muted-foreground">+12% this month</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$2.4M</div>
            <p className="text-xs text-muted-foreground">+15% vs last month</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Active Crew</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
            <p className="text-xs text-muted-foreground">All certified</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Search Assistant */}
      <AISearchAssistant terminalType="operator" className="mb-6" />

      {/* Predictive Analytics */}
      <PredictiveAnalytics terminalType="operator" className="mb-6" />

      {/* Recent Activity */}
      <Card className="terminal-card">
          <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">New RFQ received</p>
              <p className="text-xs text-muted-foreground">London - New York • Gulfstream G650</p>
                  </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">New</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Quote submitted</p>
              <p className="text-xs text-muted-foreground">Paris - Dubai • $38,000</p>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Flight completed</p>
              <p className="text-xs text-muted-foreground">LAX - JFK • Payment processed</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">Complete</Badge>
            </div>
          </CardContent>
      </Card>

      {/* Fleet Status */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="text-foreground">Fleet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fleet.map((aircraft) => (
              <div key={aircraft.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Plane className="h-8 w-8 text-accent" />
                  <div>
                    <p className="font-medium text-foreground">{aircraft.model}</p>
                    <p className="text-sm text-muted-foreground">{aircraft.registration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={aircraft.status === 'available' ? 'default' : 
                            aircraft.status === 'in-flight' ? 'secondary' : 'destructive'}
                  >
                    {aircraft.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{aircraft.location}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRFQs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Request for Quotes</h2>
        <Button className="btn-terminal-accent">
          <Plus className="w-4 h-4 mr-2" />
          New RFQ
        </Button>
      </div>

      <div className="space-y-4">
        {rfqs.map((rfq) => (
          <Card key={rfq.id} className="terminal-card">
        <CardHeader>
              <div className="flex justify-between items-start">
              <div>
                  <CardTitle className="text-foreground">{rfq.route}</CardTitle>
                  <CardDescription>{rfq.aircraft} • {rfq.passengers} passengers</CardDescription>
              </div>
                <div className="flex space-x-2">
                  <Badge 
                    variant={rfq.priority === 'high' ? 'destructive' : 
                            rfq.priority === 'medium' ? 'secondary' : 'outline'}
                  >
                    {rfq.priority}
                  </Badge>
                  <Badge 
                    variant={rfq.status === 'accepted' ? 'default' : 
                            rfq.status === 'quoted' ? 'secondary' : 'outline'}
                  >
                    {rfq.status}
                  </Badge>
            </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <p className="text-sm font-medium text-gunmetal">Date</p>
                  <p className="text-foreground">{rfq.date}</p>
              </div>
              <div>
                  <p className="text-sm font-medium text-gunmetal">Budget</p>
                  <p className="text-foreground">{rfq.currency} {rfq.price.toLocaleString()}</p>
              </div>
              <div>
                  <p className="text-sm font-medium text-gunmetal">Broker</p>
                  <p className="text-foreground">{rfq.broker}</p>
              </div>
            </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gunmetal">Special Requirements</p>
                <p className="text-sm text-muted-foreground">{rfq.specialRequirements}</p>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
                <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                  Quote
              </Button>
            </div>
          </CardContent>
          </Card>
        ))}
                  </div>
                </div>
  );

  const renderPilots = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Pilot Management</h2>
        <Button className="btn-terminal-accent">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Pilot
        </Button>
              </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pilots.map((pilot) => (
          <Card key={pilot.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground">{pilot.name}</CardTitle>
                  <CardDescription>{pilot.hours.toLocaleString()} flight hours</CardDescription>
                </div>
                <Badge 
                  variant={pilot.status === 'available' ? 'default' : 
                          pilot.status === 'assigned' ? 'secondary' : 'outline'}
                >
                  {pilot.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-foreground">{pilot.rating}/5.0</span>
            </div>
              <div>
                <p className="text-sm font-medium text-gunmetal">Certifications</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pilot.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                  <p className="text-sm font-medium text-gunmetal">Location</p>
                  <p className="text-sm text-foreground">{pilot.location}</p>
              </div>
              <div>
                  <p className="text-sm font-medium text-gunmetal">Rate</p>
                  <p className="text-sm text-foreground">{pilot.currency} {pilot.hourlyRate}/hr</p>
              </div>
            </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                  View
              </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Assign
              </Button>
            </div>
          </CardContent>
          </Card>
        ))}
                  </div>
                </div>
  );

  const renderCrew = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Crew Management</h2>
        <Button className="btn-terminal-accent">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Crew
        </Button>
              </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crew.map((member) => (
          <Card key={member.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
                <Badge 
                  variant={member.status === 'available' ? 'default' : 
                          member.status === 'assigned' ? 'secondary' : 'outline'}
                >
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-foreground">{member.rating}/5.0</span>
                <span className="text-sm text-muted-foreground">• {member.experience} years</span>
            </div>
              <div>
                <p className="text-sm font-medium text-gunmetal">Languages</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                  <p className="text-sm font-medium text-gunmetal">Location</p>
                  <p className="text-sm text-foreground">{member.location}</p>
              </div>
              <div>
                  <p className="text-sm font-medium text-gunmetal">Rate</p>
                  <p className="text-sm text-foreground">{member.currency} {member.hourlyRate}/hr</p>
              </div>
            </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                  View
              </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Assign
              </Button>
            </div>
          </CardContent>
          </Card>
        ))}
            </div>
          </div>
  );

  const renderFleet = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Fleet Operations</h2>
        <Button className="btn-terminal-accent">
          <Plus className="w-4 h-4 mr-2" />
          Add Aircraft
        </Button>
      </div>

      <div className="space-y-4">
        {fleet.map((aircraft) => (
          <Card key={aircraft.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
            <div>
                  <CardTitle className="text-foreground">{aircraft.model}</CardTitle>
                  <CardDescription>{aircraft.registration} • {aircraft.hours.toLocaleString()} hours</CardDescription>
            </div>
                <Badge 
                  variant={aircraft.status === 'available' ? 'default' : 
                          aircraft.status === 'in-flight' ? 'secondary' : 
                          aircraft.status === 'maintenance' ? 'destructive' : 'outline'}
                >
                  {aircraft.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                  <p className="text-sm font-medium text-gunmetal">Location</p>
                  <p className="text-foreground">{aircraft.location}</p>
            </div>
            <div>
                  <p className="text-sm font-medium text-gunmetal">Next Flight</p>
                  <p className="text-foreground">{aircraft.nextFlight}</p>
            </div>
            <div>
                  <p className="text-sm font-medium text-gunmetal">Utilization</p>
                  <p className="text-foreground">{aircraft.utilization}%</p>
            </div>
                <div>
                  <p className="text-sm font-medium text-gunmetal">Next Maintenance</p>
                  <p className="text-foreground">{aircraft.nextMaintenance}</p>
          </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
                <Button variant="outline" size="sm">
                  <Wrench className="w-4 h-4 mr-2" />
                  Maintenance
                </Button>
                <Button variant="outline" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
              Schedule
            </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Billing & Analytics</h2>
        <Button className="btn-terminal-accent">
          <Download className="w-4 h-4 mr-2" />
          Export Report
            </Button>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$2.4M</div>
            <p className="text-xs text-muted-foreground">+15% vs last month</p>
        </CardContent>
      </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Platform Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$168K</div>
            <p className="text-xs text-muted-foreground">7% of revenue</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Active Flights</CardTitle>
            <Plane className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Avg Flight Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$200K</div>
            <p className="text-xs text-muted-foreground">+8% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
                <div>
                  <p className="font-medium text-foreground">LAX - JFK Flight</p>
                  <p className="text-sm text-muted-foreground">Sep 15, 2025 • Gulfstream G650</p>
            </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">$85,000</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">LHR - CDG Flight</p>
                  <p className="text-sm text-muted-foreground">Sep 18, 2025 • Global 6000</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">$45,000</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Analytics & Performance</h2>
        <Button className="btn-terminal-accent">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Fleet Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">87%</div>
            <p className="text-xs text-muted-foreground">+5% vs last month</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Revenue per Flight</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$185K</div>
            <p className="text-xs text-muted-foreground">+12% vs last month</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Crew Efficiency</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94%</div>
            <p className="text-xs text-muted-foreground">+3% vs last month</p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gunmetal">Customer Satisfaction</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4.8/5</div>
            <p className="text-xs text-muted-foreground">+0.2 vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="terminal-card">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Top Routes</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">LHR - JFK</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-terminal-border rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">CDG - LAX</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-terminal-border rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">FRA - DXB</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-terminal-border rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">68%</span>
                </div>
              </div>
          </div>
        </CardContent>
      </Card>

        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Aircraft Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Gulfstream G650</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-terminal-border rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Global 6000</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-terminal-border rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">88%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Challenger 350</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-terminal-border rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">76%</span>
                </div>
              </div>
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
      <NoteTakingSystem terminalType="operator" />
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
        role="operator"
      />
    </div>
  );

  return (
    <>
      {showHelpGuide && (
      <ModernHelpGuide 
        terminalType="operator" 
        activeTab={activeTab} 
          showOnMount={false} 
        isDemo={true}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
      
      <div className="min-h-screen bg-app relative overflow-hidden scroll-smooth">
      <StarfieldRunwayBackground />
      
        {/* Header */}
        <header className="relative z-10 bg-terminal-card border-b border-terminal-border px-6 py-4 backdrop-blur-modern">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <StratusConnectLogo className="text-orange-400 text-lg mr-6" />
              <div className="text-sm text-slate-400">
                TERMINAL STATUS: <span className="text-white">OPERATIONAL</span>
            </div>
              <div className="text-sm text-slate-400">
                USER: <span className="text-orange-400">Demo Operator</span>
          </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-400">
                <Clock className="w-4 h-4 inline mr-1" />
                {new Date().toLocaleTimeString()} UTC
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
                <CreditCard className="w-4 h-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
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
                Jobs
              </TabsTrigger>
              <TabsTrigger value="fleet-tracking" className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Fleet Tracking
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                News
              </TabsTrigger>
              <TabsTrigger value="rankings" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Rankings
              </TabsTrigger>
          </TabsList>
            </div>

            <TabsContent value="dashboard" className="scroll-smooth">
            {renderDashboard()}
          </TabsContent>

            <TabsContent value="rfqs" className="scroll-smooth">
            {renderRFQs()}
          </TabsContent>

            <TabsContent value="pilots" className="scroll-smooth">
            {renderPilots()}
          </TabsContent>

            <TabsContent value="crew" className="scroll-smooth">
            {renderCrew()}
          </TabsContent>

            <TabsContent value="fleet" className="scroll-smooth">
            {renderFleet()}
          </TabsContent>

            <TabsContent value="billing" className="scroll-smooth">
            {renderBilling()}
          </TabsContent>
            <TabsContent value="analytics" className="scroll-smooth">
              {renderAnalytics()}
          </TabsContent>
            <TabsContent value="notes" className="scroll-smooth">
              {renderNotes()}
          </TabsContent>
            <TabsContent value="tracking" className="scroll-smooth">
              {renderTracking()}
            </TabsContent>
            <TabsContent value="jobs" className="scroll-smooth">
              <JobPostingManagement terminalType="operator" />
            </TabsContent>
            <TabsContent value="fleet-tracking" className="scroll-smooth">
              <FleetAssignmentTracking terminalType="operator" />
            </TabsContent>
            <TabsContent value="news" className="scroll-smooth">
              <AviationNews terminalType="operator" />
            </TabsContent>
            <TabsContent value="rankings" className="scroll-smooth">
              <RankingDashboard userType="operator" />
            </TabsContent>
          </Tabs>
        </main>

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
      <EnhancedAIChatbot terminalType="operator" />
      
      {/* Floating Chat */}
      <FloatingChat userType="operator" isDemo={true} />
    </>
  );
}