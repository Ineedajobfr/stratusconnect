// Enhanced Demo Operator Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue
// Updated: Removed CommunityForums - Force rebuild to clear cache

import AdvancedSearch from '@/components/AdvancedSearch';
import ContractGenerator from '@/components/contracts/ContractGenerator';
import ReceiptGenerator from '@/components/contracts/ReceiptGenerator';
import DocumentManagement from '@/components/DocumentManagement';
import DocumentStorage from '@/components/documents/DocumentStorage';
import JobBoard from '@/components/job-board/JobBoard';
import SavedCrews from '@/components/job-board/SavedCrews';
import NoteTakingSystem from '@/components/NoteTakingSystem';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { operatorDashboardService, type OperatorMetrics } from '@/lib/operator-dashboard-service';
import {
    Activity,
    AlertTriangle,
    ArrowUp,
    Award,
    BarChart3,
    Briefcase,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    FileText,
    Navigation,
    Plane,
    Plus,
    Receipt,
    Star,
    TrendingUp,
    User,
    UserPlus,
    Users,
    Wrench
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

// Profile Modal Component
const ProfileModal = ({ isOpen, onClose, userRole }: { isOpen: boolean; onClose: () => void; userRole: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-terminal-bg border border-terminal-border rounded-lg w-full max-w-6xl h-[80vh] overflow-hidden">
        <div className="flex h-full">
          {/* Profile Section */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-terminal-fg">Profile</h2>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-terminal-border text-terminal-fg"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Company Profile */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-terminal-fg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-terminal-fg mb-2">Company Name</label>
                      <input 
                        type="text" 
                        defaultValue="StratusConnect Aviation" 
                        className="w-full p-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-fg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-terminal-fg mb-2">License Number</label>
                      <input 
                        type="text" 
                        defaultValue="AV-OP-2024-001" 
                        className="w-full p-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-fg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-terminal-fg mb-2">Contact Email</label>
                      <input 
                        type="email" 
                        defaultValue="operations@stratusconnect.com" 
                        className="w-full p-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-fg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-terminal-fg mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        defaultValue="+1 (555) 123-4567" 
                        className="w-full p-3 bg-terminal-bg border border-terminal-border rounded-lg text-terminal-fg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fleet Information */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-terminal-fg">Fleet Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-terminal-border rounded-lg">
                      <div className="text-2xl font-bold text-terminal-fg">5</div>
                      <div className="text-sm text-terminal-muted">Total Aircraft</div>
                    </div>
                    <div className="text-center p-4 border border-terminal-border rounded-lg">
                      <div className="text-2xl font-bold text-terminal-fg">87%</div>
                      <div className="text-sm text-terminal-muted">Utilization</div>
                    </div>
                    <div className="text-center p-4 border border-terminal-border rounded-lg">
                      <div className="text-2xl font-bold text-terminal-fg">$2.4M</div>
                      <div className="text-sm text-terminal-muted">Monthly Revenue</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Fortress of Verification */}
          <div className="w-96 border-l border-terminal-border p-6 bg-terminal-bg/50">
            <h3 className="text-xl font-bold text-terminal-fg mb-6">Fortress of Verification</h3>
            
            <div className="space-y-4">
              <Card className="terminal-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-terminal-fg flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    FCA Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">License Status</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Insurance</span>
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Safety Rating</span>
                      <Badge className="bg-green-100 text-green-800">A+</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-terminal-fg flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Identity Verified</span>
                      <Badge className="bg-blue-100 text-blue-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Bank Account</span>
                      <Badge className="bg-blue-100 text-blue-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Tax Documents</span>
                      <Badge className="bg-blue-100 text-blue-800">✓</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-terminal-muted">Aircraft Certificates</span>
                      <Badge className="bg-blue-100 text-blue-800">✓</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-terminal-fg flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                    Pending Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-terminal-muted">
                    <p>• Annual safety audit due in 45 days</p>
                    <p>• Insurance renewal in 30 days</p>
                    <p>• Pilot certification updates</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DemoOperatorTerminal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<OperatorMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [showWeekOneScoreboard, setShowWeekOneScoreboard] = useState(false);

  // Load operator dashboard metrics
  useEffect(() => {
    const loadMetrics = async () => {
      if (user?.id) {
        setMetricsLoading(true);
        const data = await operatorDashboardService.getDashboardMetrics(user.id);
        setMetrics(data);
        setMetricsLoading(false);
      }
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, [user]);
  const [showWarRoomChecks, setShowWarRoomChecks] = useState(false);
  const [liveFlowResult, setLiveFlowResult] = useState<{ allPassed: boolean; summary: string } | null>(null);
  const [warRoomResult, setWarRoomResult] = useState<{ allChecksPassed: boolean; summary: string } | null>(null);
  const [evidencePack, setEvidencePack] = useState<{ id: string; timestamp: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showJobBoard, setShowJobBoard] = useState(false);
  const [showSavedCrews, setShowSavedCrews] = useState(false);
  const [showDocumentStorage, setShowDocumentStorage] = useState(false);
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [showReceiptGenerator, setShowReceiptGenerator] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showStickyNotes, setShowStickyNotes] = useState(true);
  const [dismissedNotes, setDismissedNotes] = useState<string[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isShowingNote, setIsShowingNote] = useState(true);

  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: 'RFQ-001',
      route: 'London - New York',
      aircraft: 'Gulfstream G650',
      date: '2025-09-20',
      price: 85000,
      currency: 'USD',
      status: 'pending',
      legs: 1,
      passengers: 8,
      specialRequirements: 'WiFi, premium catering, ground transportation',
      broker: 'Elite Aviation Brokers',
      priority: 'high',
      fees: {
        basePrice: 75000,
        fuelSurcharge: 8500,
        handling: 1200,
        catering: 800,
        total: 85000
      }
    },
    {
      id: 'RFQ-002',
      route: 'Paris - Dubai',
      aircraft: 'Global 6000',
      date: '2025-09-25',
      price: 65000,
      currency: 'EUR',
      status: 'quoted',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Pet transport approved, VIP terminal access',
      broker: 'SkyHigh Aviation',
      priority: 'medium',
      fees: {
        basePrice: 58000,
        fuelSurcharge: 4500,
        handling: 1500,
        catering: 1000,
        total: 65000
      }
    },
    {
      id: 'RFQ-003',
      route: 'Los Angeles - Tokyo',
      aircraft: 'Bombardier Global 7500',
      date: '2025-09-28',
      price: 125000,
      currency: 'USD',
      status: 'accepted',
      legs: 1,
      passengers: 16,
      specialRequirements: 'VIP security detail, custom interior',
      broker: 'Pacific Aviation Group',
      priority: 'high',
      fees: {
        basePrice: 110000,
        fuelSurcharge: 12000,
        handling: 2000,
        catering: 1000,
        total: 125000
      }
    },
    {
      id: 'RFQ-004',
      route: 'Dubai - Mumbai - Singapore',
      aircraft: 'Bombardier Challenger 350',
      date: '2025-10-02',
      price: 95000,
      currency: 'USD',
      status: 'pending',
      legs: 2,
      passengers: 8,
      specialRequirements: 'Multi-leg itinerary, cargo space for luxury goods',
      broker: 'Middle East Aviation',
      priority: 'medium',
      fees: {
        basePrice: 85000,
        fuelSurcharge: 7000,
        handling: 2000,
        catering: 1000,
        total: 95000
      }
    },
    {
      id: 'RFQ-005',
      route: 'New York - London - Paris - Rome',
      aircraft: 'Airbus ACJ320neo',
      date: '2025-10-05',
      price: 280000,
      currency: 'USD',
      status: 'quoted',
      legs: 3,
      passengers: 18,
      specialRequirements: 'European tour, diplomatic clearance, conference facilities',
      broker: 'European Executive',
      priority: 'high',
      fees: {
        basePrice: 250000,
        fuelSurcharge: 20000,
        handling: 5000,
        catering: 5000,
        total: 280000
      }
    },
    {
      id: 'RFQ-006',
      route: 'São Paulo - Buenos Aires',
      aircraft: 'Embraer Legacy 650E',
      date: '2025-10-08',
      price: 55000,
      currency: 'USD',
      status: 'pending',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Bilingual crew, South American customs expertise',
      broker: 'Latam Executive',
      priority: 'medium',
      fees: {
        basePrice: 50000,
        fuelSurcharge: 3000,
        handling: 1500,
        catering: 500,
        total: 55000
      }
    },
    {
      id: 'RFQ-007',
      route: 'Hong Kong - Sydney',
      aircraft: 'Bombardier Global 7500',
      date: '2025-10-12',
      price: 165000,
      currency: 'USD',
      status: 'quoted',
      legs: 1,
      passengers: 14,
      specialRequirements: 'Extended range, medical equipment, quarantine protocols',
      broker: 'Asia Pacific Aviation',
      priority: 'high',
      fees: {
        basePrice: 150000,
        fuelSurcharge: 10000,
        handling: 3000,
        catering: 2000,
        total: 165000
      }
    },
    {
      id: 'RFQ-008',
      route: 'Moscow - Istanbul - Dubai',
      aircraft: 'Gulfstream G550',
      date: '2025-10-15',
      price: 120000,
      currency: 'USD',
      status: 'pending',
      legs: 2,
      passengers: 10,
      specialRequirements: 'Multi-leg business trip, security detail, cargo space',
      broker: 'Eurasian Aviation',
      priority: 'medium',
      fees: {
        basePrice: 110000,
        fuelSurcharge: 7000,
        handling: 2000,
        catering: 1000,
        total: 120000
      }
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
    },
    {
      id: 'P-004',
      name: 'Captain Maria Rodriguez',
      rating: 4.8,
      hours: 7800,
      certifications: ['ATP', 'Type Rating Challenger 350', 'IFR', 'Multi-Engine'],
      availability: 'Available',
      location: 'Miami',
      hourlyRate: 460,
      currency: 'USD',
      status: 'available'
    },
    {
      id: 'P-005',
      name: 'Captain David Chen',
      rating: 4.7,
      hours: 6800,
      certifications: ['ATP', 'Type Rating G550', 'IFR'],
      availability: 'Available',
      location: 'Hong Kong',
      hourlyRate: 440,
      currency: 'USD',
      status: 'available'
    },
    {
      id: 'P-006',
      name: 'Captain Ahmed Al-Rashid',
      rating: 4.9,
      hours: 8900,
      certifications: ['ATP', 'Type Rating Falcon 8X', 'IFR', 'Multi-Engine'],
      availability: 'Assigned',
      location: 'Dubai',
      hourlyRate: 450,
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
    },
    {
      id: 'C-004',
      name: 'Isabella Martinez',
      role: 'VIP Flight Attendant',
      rating: 4.9,
      experience: 9,
      languages: ['English', 'Spanish', 'Portuguese'],
      availability: 'Available',
      location: 'Miami',
      hourlyRate: 95,
      currency: 'USD',
      status: 'available'
    },
    {
      id: 'C-005',
      name: 'Yuki Tanaka',
      role: 'Flight Attendant',
      rating: 4.7,
      experience: 5,
      languages: ['English', 'Japanese', 'Mandarin'],
      availability: 'Available',
      location: 'Tokyo',
      hourlyRate: 85,
      currency: 'USD',
      status: 'available'
    },
    {
      id: 'C-006',
      name: 'Fatima Al-Zahra',
      role: 'Senior Flight Attendant',
      rating: 4.8,
      experience: 8,
      languages: ['English', 'Arabic', 'French'],
      availability: 'Assigned',
      location: 'Dubai',
      hourlyRate: 92,
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
    },
    {
      id: 'A-004',
      model: 'Embraer Legacy 650E',
      registration: 'N650E',
      status: 'available',
      location: 'Miami',
      nextFlight: 'Miami - São Paulo',
      utilization: 78,
      hours: 1200,
      lastMaintenance: '2025-09-15',
      nextMaintenance: '2025-12-15'
    },
    {
      id: 'A-005',
      model: 'Airbus ACJ320neo',
      registration: 'N320N',
      status: 'maintenance',
      location: 'Paris',
      nextFlight: 'Paris - Dubai',
      utilization: 85,
      hours: 2100,
      lastMaintenance: '2025-10-01',
      nextMaintenance: '2025-10-15'
    },
    {
      id: 'A-006',
      model: 'Gulfstream G550',
      registration: 'N550G',
      status: 'available',
      location: 'Dubai',
      nextFlight: 'Dubai - Mumbai',
      utilization: 88,
      hours: 1650,
      lastMaintenance: '2025-09-20',
      nextMaintenance: '2025-11-20'
    },
    {
      id: 'A-007',
      model: 'Falcon 8X',
      registration: 'N8XF',
      status: 'scheduled',
      location: 'Zurich',
      nextFlight: 'Zurich - Singapore',
      utilization: 82,
      hours: 1400,
      lastMaintenance: '2025-09-25',
      nextMaintenance: '2025-12-25'
    }
  ]);

  // Sticky Notes for Help Guide
  const stickyNotes = [
    {
      id: "welcome",
      title: "Welcome to StratusConnect Operator Terminal! ✈️",
      content: "This is your operator dashboard. Here you can manage your fleet, track RFQs, and coordinate with pilots and crew. Let's explore the complete workflow!",
      position: { top: "10%", right: "2%" },
      color: "bg-blue-500",
      tab: "dashboard",
      order: 0
    },
    {
      id: "dashboard-metrics",
      title: "Dashboard Overview 📊",
      content: "Monitor your key metrics: Active RFQs, Fleet Utilization, Revenue, and Completed Flights. Keep an eye on your business performance!",
      position: { top: "20%", right: "2%" },
      color: "bg-green-500",
      tab: "dashboard",
      order: 1
    },
    {
      id: "rfqs-management",
      title: "RFQ Management 💼",
      content: "Review incoming RFQs from brokers. You can quote prices, assign aircraft, and manage the entire booking process from here.",
      position: { top: "30%", right: "2%" },
      color: "bg-purple-500",
      tab: "rfqs",
      order: 0
    },
    {
      id: "pilot-coordination",
      title: "Pilot Coordination 👨‍✈️",
      content: "Manage your pilot roster, assign flights, track certifications, and coordinate schedules. Keep your pilots happy and compliant!",
      position: { top: "40%", right: "2%" },
      color: "bg-orange-500",
      tab: "pilots",
      order: 0
    },
    {
      id: "crew-management",
      title: "Crew Management 👥",
      content: "Coordinate with your crew members, manage schedules, and ensure all safety protocols are followed. Team coordination is key!",
      position: { top: "50%", right: "2%" },
      color: "bg-teal-500",
      tab: "crew",
      order: 0
    },
    {
      id: "fleet-operations",
      title: "Fleet Operations 🛩️",
      content: "Monitor your aircraft status, schedule maintenance, track utilization, and ensure all aircraft are ready for operations.",
      position: { top: "60%", right: "2%" },
      color: "bg-indigo-500",
      tab: "fleet",
      order: 0
    },
    {
      id: "job-posting",
      title: "Job Posting 💼",
      content: "Post new job opportunities for pilots and crew members. This is where you recruit talent and fill positions in your operation.",
      position: { top: "70%", right: "2%" },
      color: "bg-yellow-500",
      tab: "jobs",
      order: 0
    },
    {
      id: "document-management",
      title: "Document Management 📁",
      content: "Store and organize contracts, receipts, and certifications. Keep everything color-coded: blue for contracts, green for receipts, orange for certificates.",
      position: { top: "80%", right: "2%" },
      color: "bg-red-500",
      tab: "documents",
      order: 0
    }
  ];

  // Sticky Notes Helper Functions
  const getCurrentTabNotes = () => {
    return stickyNotes
      .filter(note => note.tab === activeTab)
      .sort((a, b) => a.order - b.order);
  };

  const getCurrentNote = () => {
    const tabNotes = getCurrentTabNotes();
    const currentNote = tabNotes[currentNoteIndex];
    
    if (!currentNote || dismissedNotes.includes(currentNote.id)) {
      return null;
    }
    
    return currentNote;
  };

  const dismissNote = (noteId: string) => {
    setDismissedNotes(prev => [...prev, noteId]);
    setIsShowingNote(false);
    
    // Show next note after a delay
    setTimeout(() => {
      setCurrentNoteIndex(prev => prev + 1);
      setIsShowingNote(true);
    }, 10000);
  };

  // Reset note sequence when tab changes
  useEffect(() => {
    setCurrentNoteIndex(0);
    setIsShowingNote(true);
  }, [activeTab]);

  const handleLiveFlowTest = async () => {
    try {
      const result = { allPassed: true, summary: 'Demo mode - all tests passed' };
      setLiveFlowResult(result);
    } catch (error) {
      console.log('Live flow test completed with status:', error?.message || 'success');
    }
  };

  const handleWarRoomCheck = async () => {
    try {
      const result = { allChecksPassed: true, summary: 'Demo mode - all checks passed' };
      setWarRoomResult(result);
    } catch (error) {
      console.log('War room check completed with status:', error?.message || 'success');
    }
  };

  const handleGenerateEvidencePack = async () => {
    try {
      const pack = { id: 'demo-pack', timestamp: new Date().toISOString() };
      setEvidencePack(pack);
    } catch (error) {
      console.log('Evidence pack generation completed with status:', error?.message || 'success');
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

      {/* Advanced Search */}
      <AdvancedSearch terminalType="operator" onResults={(results) => console.log('Search results:', results)} />

      {/* Document Management */}
      <DocumentManagement userRole="operator" />

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
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowContractGenerator(true)}
            className="bg-terminal-accent hover:bg-terminal-accent/90"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Contract
          </Button>
          <Button 
            onClick={() => setShowReceiptGenerator(true)}
            className="bg-terminal-accent hover:bg-terminal-accent/90"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Generate Receipt
          </Button>
          <Button 
            onClick={() => {
              const reportData = {
                timestamp: new Date().toISOString(),
                rfqs: rfqs.length,
                fleet: fleet.length,
                crew: crew.length,
                activeDeals: rfqs.filter(rfq => rfq.status === 'pending').length
              };
              const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `operator_report_${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-terminal-accent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
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

  const renderFleetStatus = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Fleet Status</h2>
        <Button className="btn-terminal-accent">
          <Plus className="w-4 h-4 mr-2" />
          Add Aircraft
        </Button>
      </div>

      {/* Fleet Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="text-foreground">Aircraft Status</CardTitle>
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

        {/* Flight Radar Widget */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="text-foreground">Live Flight Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-terminal-bg border border-terminal-border rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                <p className="text-terminal-muted">Flight Radar Integration</p>
                <p className="text-sm text-terminal-muted">Real-time aircraft tracking</p>
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


  return (
    <>
      {showProfile && (
        <ProfileModal 
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          userRole="operator"
        />
      )}

      {/* Sticky Notes */}
      {showStickyNotes && isShowingNote && (() => {
        const currentNote = getCurrentNote();
        if (!currentNote) return null;
        
        return (
          <div
            className={`fixed z-[9999] w-80 p-4 rounded-lg shadow-2xl border-2 border-white/20 backdrop-blur-sm ${currentNote.color} text-white`}
            style={{
              top: currentNote.position.top,
              right: currentNote.position.right,
              animation: 'slideInFromRight 0.5s ease-out'
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg">{currentNote.title}</h3>
              <button
                onClick={() => dismissNote(currentNote.id)}
                className="text-white/80 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm leading-relaxed mb-3">{currentNote.content}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">
                {getCurrentTabNotes().findIndex(n => n.id === currentNote.id) + 1} of {getCurrentTabNotes().length}
              </span>
              <button
                onClick={() => dismissNote(currentNote.id)}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        );
      })()}

      {/* Toggle Sticky Notes Button */}
      <Button
        onClick={() => setShowStickyNotes(!showStickyNotes)}
        className="fixed top-4 right-4 z-[9998] bg-orange-500 hover:bg-orange-600 text-white"
        size="sm"
      >
        <Eye className="h-4 w-4" />
        {showStickyNotes ? 'Hide' : 'Show'} Guide
      </Button>
      
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
        <header className="relative z-10 border-b border-terminal-border px-6 py-4 backdrop-blur-modern bg-slate-800">
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
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
              <Button
                onClick={() => setShowProfile(true)}
                className="w-12 h-12 bg-accent/20 hover:bg-accent/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-accent/30"
                title="Profile & Verification"
              >
                <User className="w-6 h-6 text-white" />
              </Button>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Main Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent pb-2 mb-6">
              <TabsList className="flex w-max min-w-full justify-start space-x-1 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 5%, 0.9)' }}>
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
              <TabsTrigger value="fleet-status" className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Fleet Status
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
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Board
              </TabsTrigger>
              <TabsTrigger value="saved-crews" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Saved Crew Members
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

            <TabsContent value="fleet-status" className="scroll-smooth">
              {renderFleetStatus()}
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
            <TabsContent value="jobs" className="scroll-smooth">
              <JobBoard userRole="operator" />
            </TabsContent>
            <TabsContent value="saved-crews" className="scroll-smooth">
              <SavedCrews brokerId="demo-operator-1" />
            </TabsContent>
            <TabsContent value="documents" className="scroll-smooth">
              <DocumentStorage userRole="operator" />
            </TabsContent>
          </Tabs>
        </main>

        {/* Demo Banner */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-terminal-warning text-terminal-bg text-center py-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Demo Mode Active. This is a demonstration of the Operator Terminal. All data is simulated and no real transactions will occur. The platform operates 100% free until revenue is generated.
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
      
      {/* Contract Generator Modal */}
      {showContractGenerator && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-terminal-bg border border-terminal-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ContractGenerator 
              dealId="demo-deal-1" 
              onClose={() => setShowContractGenerator(false)} 
            />
          </div>
        </div>
      )}

      {/* Receipt Generator Modal */}
      {showReceiptGenerator && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-terminal-bg border border-terminal-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ReceiptGenerator 
              dealId="demo-deal-1" 
              onClose={() => setShowReceiptGenerator(false)} 
            />
          </div>
        </div>
      )}

    </>
  );
}
