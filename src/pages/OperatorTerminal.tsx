import { OperatorBilling } from "@/components/Billing/OperatorBilling";
import DocumentStorage from "@/components/documents/DocumentStorage";
import JobBoard from "@/components/job-board/JobBoard";
import SavedCrews from "@/components/job-board/SavedCrews";
import { OperatorListingFlow } from "@/components/Marketplace/OperatorListingFlow";
import NoteTakingSystem from "@/components/NoteTakingSystem";
import { OperatorProfile } from "@/components/Profile/OperatorProfile";
import { OperatorReputation } from "@/components/Reputation/OperatorReputation";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { operatorDashboardService } from "@/lib/operator-dashboard-service";
import {
    Activity,
    ArrowUp,
    Award,
    BarChart3,
    Briefcase,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Plane,
    Plus,
    RefreshCw,
    Settings,
    StickyNote,
    TrendingUp,
    User,
    UserPlus,
    Users
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

interface FleetAircraft {
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

export default function OperatorTerminal() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [fleet, setFleet] = useState<FleetAircraft[]>([]);
    const [dashboardMetrics, setDashboardMetrics] = useState({
        fleetSize: 0,
        activeBookings: 0,
        pendingRfqs: 0,
        monthlyRevenue: 0,
        utilization: 0
    });

    // Load dashboard data
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                if (user?.id) {
                    const metrics = await operatorDashboardService.getDashboardMetrics(user.id);
                    setDashboardMetrics({
                        fleetSize: metrics.availableAircraft,
                        activeBookings: metrics.activeBookings,
                        pendingRfqs: metrics.pendingRFQs,
                        monthlyRevenue: metrics.monthlyRevenue,
                        utilization: metrics.fleetUtilization
                    });
                    
                    const rfqData = await operatorDashboardService.getPendingRFQs(user.id);
                    setRfqs(rfqData.map(rfq => ({
                        id: rfq.id,
                        route: rfq.route,
                        aircraft: 'Gulfstream G650',
                        date: rfq.departureDate,
                        price: 50000,
                        currency: 'USD',
                        status: 'pending' as const,
                        legs: 1,
                        passengers: rfq.passengers,
                        specialRequirements: 'Standard requirements',
                        broker: rfq.brokerName,
                        priority: 'medium' as any
                    })));
                    
                    const fleetData = await operatorDashboardService.getFleetStatus(user.id);
                    setFleet(fleetData.map(aircraft => ({
                        id: aircraft.id,
                        model: aircraft.model,
                        registration: aircraft.tailNumber,
                        status: aircraft.status as any,
                        location: aircraft.currentLocation,
                        nextFlight: aircraft.nextFlight?.route || 'N/A',
                        utilization: 75,
                        hours: 2500,
                        lastMaintenance: '2025-01-01',
                        nextMaintenance: aircraft.nextMaintenance
                    })));
                }
            } catch (error) {
                console.error('Error loading operator dashboard data:', error);
            }
        };

        loadDashboardData();
    }, []);

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Fleet Size</CardTitle>
                        <Plane className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.fleetSize}</div>
                        <p className="text-xs text-muted-foreground">
                            {fleet.filter(a => a.status === 'available').length} available
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Active Bookings</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.activeBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            +3 from last week
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Pending RFQs</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.pendingRfqs}</div>
                        <p className="text-xs text-muted-foreground">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Monthly Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">${dashboardMetrics.monthlyRevenue}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Utilization</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.utilization}%</div>
                        <p className="text-xs text-muted-foreground">
                            Fleet efficiency
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent RFQs */}
            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent" />
                        Recent RFQs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {rfqs.slice(0, 5).map((rfq) => (
                            <div key={rfq.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{rfq.route} - {rfq.aircraft}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {rfq.broker} • {rfq.passengers} passengers • {rfq.date}
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <Badge className={`text-xs ${
                                                rfq.priority === 'high' ? 'bg-red-500' : 
                                                rfq.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}>
                                                {rfq.priority}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {rfq.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-foreground">{rfq.currency} {rfq.price.toLocaleString()}</p>
                                    <Button size="sm" className="mt-2">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Fleet Status */}
            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plane className="w-5 h-5 text-accent" />
                        Fleet Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {fleet.slice(0, 5).map((aircraft) => (
                            <div key={aircraft.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        aircraft.status === 'available' ? 'bg-green-100' :
                                        aircraft.status === 'in-flight' ? 'bg-blue-100' :
                                        aircraft.status === 'maintenance' ? 'bg-red-100' : 'bg-yellow-100'
                                    }`}>
                                        <Plane className={`w-5 h-5 ${
                                            aircraft.status === 'available' ? 'text-green-600' :
                                            aircraft.status === 'in-flight' ? 'text-blue-600' :
                                            aircraft.status === 'maintenance' ? 'text-red-600' : 'text-yellow-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{aircraft.model} - {aircraft.registration}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {aircraft.location} • {aircraft.utilization}% utilization
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <Badge className={`text-xs ${
                                                aircraft.status === 'available' ? 'bg-green-500' :
                                                aircraft.status === 'in-flight' ? 'bg-blue-500' :
                                                aircraft.status === 'maintenance' ? 'bg-red-500' : 'bg-yellow-500'
                                            }`}>
                                                {aircraft.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-foreground">{aircraft.hours}h</p>
                                    <p className="text-sm text-muted-foreground">Flight hours</p>
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
                    New Quote
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {rfqs.map((rfq) => (
                    <Card key={rfq.id} className="terminal-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Badge className={`text-xs ${
                                            rfq.priority === 'high' ? 'bg-red-500' :
                                            rfq.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}>
                                            {rfq.priority}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {rfq.status}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{rfq.route}</h3>
                                    <p className="text-muted-foreground mb-4">{rfq.aircraft}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Broker</p>
                                            <p className="font-medium text-foreground">{rfq.broker}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Passengers</p>
                                            <p className="font-medium text-foreground">{rfq.passengers}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Date</p>
                                            <p className="font-medium text-foreground">{rfq.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Budget</p>
                                            <p className="font-medium text-foreground">{rfq.currency} {rfq.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {rfq.specialRequirements && (
                                        <div className="mt-4">
                                            <p className="text-sm text-muted-foreground mb-2">Special Requirements:</p>
                                            <p className="text-sm text-foreground">{rfq.specialRequirements}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-6 flex flex-col gap-2">
                                    <Button className="btn-terminal-accent">
                                        Submit Quote
                                    </Button>
                                    <Button variant="outline" className="border-terminal-border">
                                        View Details
                                    </Button>
                                </div>
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
                <h2 className="text-2xl font-bold text-foreground">Fleet Management</h2>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-terminal-border">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button className="btn-terminal-accent">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Aircraft
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {fleet.map((aircraft) => (
                    <Card key={aircraft.id} className="terminal-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Badge className={`text-xs ${
                                            aircraft.status === 'available' ? 'bg-green-500' :
                                            aircraft.status === 'in-flight' ? 'bg-blue-500' :
                                            aircraft.status === 'maintenance' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}>
                                            {aircraft.status}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {aircraft.registration}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{aircraft.model}</h3>
                                    <p className="text-muted-foreground mb-4">Registration: {aircraft.registration}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Location</p>
                                            <p className="font-medium text-foreground">{aircraft.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Utilization</p>
                                            <p className="font-medium text-foreground">{aircraft.utilization}%</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Flight Hours</p>
                                            <p className="font-medium text-foreground">{aircraft.hours}h</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Next Flight</p>
                                            <p className="font-medium text-foreground">{aircraft.nextFlight}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Maintenance:</p>
                                        <div className="flex gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Last:</p>
                                                <p className="font-medium text-foreground">{aircraft.lastMaintenance}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Next:</p>
                                                <p className="font-medium text-foreground">{aircraft.nextMaintenance}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-6 flex flex-col gap-2">
                                    <Button className="btn-terminal-accent">
                                        View Details
                                    </Button>
                                    <Button variant="outline" className="border-terminal-border">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderBookings = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Active Bookings</h2>
            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle>Booking Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Booking management interface will be available here.</p>
                </CardContent>
            </Card>
        </div>
    );

    const renderRevenue = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Revenue & Analytics</h2>
            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle>Revenue Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Revenue analytics and reporting will be available here.</p>
                </CardContent>
            </Card>
        </div>
    );

    const renderPilots = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Pilot Roster</h2>
                <Button className="btn-terminal-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Pilot
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="terminal-card">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <UserPlus className="w-12 h-12 text-accent mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No Pilots Yet</h3>
                            <p className="text-slate-400 text-sm mb-4">
                                Add pilots to your roster to manage assignments and schedules
                            </p>
                            <Button className="btn-terminal-accent">
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Pilot
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderCrew = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Cabin Crew</h2>
                <Button className="btn-terminal-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Crew Member
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="terminal-card">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">No Crew Members Yet</h3>
                            <p className="text-slate-400 text-sm mb-4">
                                Add crew members to manage assignments and schedules
                            </p>
                            <Button className="btn-terminal-accent">
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Crew Member
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
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
                            USER: <span className="text-orange-400">{user?.fullName || user?.email}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-slate-400">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {new Date().toLocaleTimeString()} UTC
                        </div>
                        <Button
                            onClick={() => navigate('/home')}
                            className="w-12 h-12 bg-accent/20 hover:bg-accent/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-accent/30"
                            title="Home"
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
                        <TabsList className="flex w-max min-w-full justify-start space-x-1 backdrop-blur-sm" style={{ backgroundColor: 'hsla(210, 30%, 15%, 0.5)' }}>
                            <TabsTrigger value="dashboard" className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Dashboard
                            </TabsTrigger>
                            <TabsTrigger value="marketplace" className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Marketplace
                            </TabsTrigger>
                            <TabsTrigger value="fleet" className="flex items-center gap-2">
                                <Plane className="w-4 h-4" />
                                Fleet
                            </TabsTrigger>
                            <TabsTrigger value="pilots" className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Pilots
                            </TabsTrigger>
                            <TabsTrigger value="crew" className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Crew
                            </TabsTrigger>
                            <TabsTrigger value="bookings" className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Bookings
                            </TabsTrigger>
                            <TabsTrigger value="billing" className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Billing
                            </TabsTrigger>
                            <TabsTrigger value="reputation" className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Reputation
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Documents
                            </TabsTrigger>
                            <TabsTrigger value="job-board" className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Job Board
                            </TabsTrigger>
                            <TabsTrigger value="notes" className="flex items-center gap-2">
                                <StickyNote className="w-4 h-4" />
                                Notes
                            </TabsTrigger>
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="dashboard" className="scroll-smooth">
                        {renderDashboard()}
                    </TabsContent>
                    
                    <TabsContent value="marketplace" className="scroll-smooth">
                        <OperatorListingFlow />
                    </TabsContent>
                    
                    <TabsContent value="fleet" className="scroll-smooth">
                        {renderFleet()}
                    </TabsContent>
                    
                    <TabsContent value="pilots" className="scroll-smooth">
                        {renderPilots()}
                    </TabsContent>
                    
                    <TabsContent value="crew" className="scroll-smooth">
                        {renderCrew()}
                    </TabsContent>
                    
                    <TabsContent value="bookings" className="scroll-smooth">
                        {renderBookings()}
                    </TabsContent>
                    
                    <TabsContent value="billing" className="scroll-smooth">
                        {user?.id && <OperatorBilling operatorId={user.id} />}
                    </TabsContent>
                    
                    <TabsContent value="reputation" className="scroll-smooth">
                        {user?.id && <OperatorReputation operatorId={user.id} />}
                    </TabsContent>
                    
                    <TabsContent value="documents" className="scroll-smooth">
                        <DocumentStorage />
                    </TabsContent>
                    
                    <TabsContent value="job-board" className="scroll-smooth">
                        <JobBoard />
                        <div className="mt-6">
                            <SavedCrews />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="notes" className="scroll-smooth">
                        <NoteTakingSystem />
                    </TabsContent>
                    
                    <TabsContent value="profile" className="scroll-smooth">
                        {user?.id && <OperatorProfile operatorId={user.id} />}
                    </TabsContent>
                </Tabs>
            </main>
            
            {/* Scroll to Top Button */}
            <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-accent/80 hover:bg-accent rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm border border-accent/30"
                title="Scroll to Top"
            >
                <ArrowUp className="w-6 h-6 text-white" />
            </Button>
        </div>
    );
}