import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { pilotDashboardService } from "@/lib/pilot-dashboard-service";
import NavigationArrows from "@/components/NavigationArrows";
import {
    ArrowUp,
    BarChart3,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Plane,
    Plus,
    RefreshCw,
    Settings,
    Shield,
    Star,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';
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

export default function PilotTerminal() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [dashboardMetrics, setDashboardMetrics] = useState({
        upcomingFlights: 0,
        completedFlights: 0,
        flightHours: 0,
        monthlyEarnings: 0,
        availability: 0
    });

    // Load dashboard data
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                if (user?.id) {
                    const metrics = await pilotDashboardService.getDashboardMetrics(user.id);
                    setDashboardMetrics({
                        upcomingFlights: metrics.upcomingFlights,
                        completedFlights: 0, // Will be calculated from completed flights
                        flightHours: metrics.totalFlightHours,
                        monthlyEarnings: metrics.monthlyEarnings,
                        availability: metrics.availabilityStatus === 'available' ? 100 : 0
                    });
                    
                    const flightData = await pilotDashboardService.getUpcomingFlights(user.id);
                    setFlights(flightData.map(flight => ({
                        id: flight.id,
                        flightNumber: flight.flightNumber,
                        route: flight.route,
                        aircraft: flight.aircraft,
                        date: flight.departureDate,
                        time: flight.departureDate.split('T')[1] || '12:00',
                        duration: '2h 30m',
                        status: flight.status as any,
                        operator: flight.operator,
                        pay: flight.pay,
                        currency: 'USD',
                        requirements: [flight.role],
                        flightHours: 2.5
                    })));
                    
                    const certData = await pilotDashboardService.getCertifications(user.id);
                    setCertifications(certData.map(cert => ({
                        id: cert.id,
                        name: cert.name,
                        expiryDate: cert.expiryDate,
                        status: cert.status as any,
                        hoursRequired: 0,
                        hoursCompleted: 0
                    })));
                }
            } catch (error) {
                console.error('Error loading pilot dashboard data:', error);
            }
        };

        loadDashboardData();
    }, []);

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Upcoming Flights</CardTitle>
                        <Plane className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.upcomingFlights}</div>
                        <p className="text-xs text-muted-foreground">
                            Next flight in 2 days
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Flight Hours</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.flightHours}</div>
                        <p className="text-xs text-muted-foreground">
                            +15 this month
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Monthly Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">${dashboardMetrics.monthlyEarnings}</div>
                        <p className="text-xs text-muted-foreground">
                            +$2,500 from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Availability</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.availability}%</div>
                        <p className="text-xs text-muted-foreground">
                            Available for bookings
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">4.9/5</div>
                        <p className="text-xs text-muted-foreground">
                            Based on 47 reviews
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Flights */}
            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent" />
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
                        <Shield className="w-5 h-5 text-accent" />
                        Certifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        cert.status === 'valid' ? 'bg-green-100' :
                                        cert.status === 'expiring' ? 'bg-yellow-100' : 'bg-red-100'
                                    }`}>
                                        <Shield className={`w-5 h-5 ${
                                            cert.status === 'valid' ? 'text-green-600' :
                                            cert.status === 'expiring' ? 'text-yellow-600' : 'text-red-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{cert.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <Badge className={`text-xs ${
                                                cert.status === 'valid' ? 'bg-green-500' :
                                                cert.status === 'expiring' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}>
                                                {cert.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-foreground">{cert.hoursCompleted}/{cert.hoursRequired}</p>
                                    <p className="text-sm text-muted-foreground">Hours</p>
                                </div>
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
                                        <Badge className={`text-xs ${
                                            flight.status === 'upcoming' ? 'bg-blue-500' :
                                            flight.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                        }`}>
                                            {flight.status}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {flight.flightNumber}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{flight.route}</h3>
                                    <p className="text-muted-foreground mb-4">{flight.aircraft}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Date</p>
                                            <p className="font-medium text-foreground">{flight.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Time</p>
                                            <p className="font-medium text-foreground">{flight.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Duration</p>
                                            <p className="font-medium text-foreground">{flight.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Pay</p>
                                            <p className="font-medium text-foreground">{flight.currency} {flight.pay}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Requirements:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {flight.requirements.map((req, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {req}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-6 flex flex-col gap-2">
                                    <Button className="btn-terminal-accent">
                                        View Details
                                    </Button>
                                    {flight.status === 'upcoming' && (
                                        <Button variant="outline" className="border-terminal-border">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Prepare
                                        </Button>
                                    )}
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
                            <p className="font-medium text-foreground">{user?.fullName || 'Pilot'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="font-medium text-foreground">Commercial Pilot</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Experience</p>
                            <p className="font-medium text-foreground">Professional</p>
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
                            <Shield className="w-5 h-5 text-accent" />
                            Certifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Active Certificates</p>
                            <div className="flex flex-wrap gap-2">
                                {['ATP License', 'First Class Medical', 'Gulfstream G650 Rating'].map((cert) => (
                                    <Badge key={cert} variant="secondary">{cert}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Aircraft Ratings</p>
                            <div className="flex flex-wrap gap-2">
                                {['Gulfstream G650', 'Global 6000', 'Challenger 350'].map((rating) => (
                                    <Badge key={rating} variant="outline">{rating}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-accent" />
                            Performance & Earnings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                            <p className="font-medium text-foreground">${dashboardMetrics.monthlyEarnings}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Flight Hours</p>
                            <p className="font-medium text-foreground">{dashboardMetrics.flightHours}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed Flights</p>
                            <p className="font-medium text-foreground">{dashboardMetrics.completedFlights}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Upcoming Flights</p>
                            <p className="font-medium text-foreground">{dashboardMetrics.upcomingFlights}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">My Documents</h2>
                <Button className="btn-terminal-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                </Button>
            </div>

            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle>Document Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Document storage and management will be available here.</p>
                </CardContent>
            </Card>
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
            <header className="relative z-10 sticky top-0 backdrop-blur-modern border-b border-terminal-border bg-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <StratusConnectLogo className="text-orange-400 text-lg mr-6" />
                            <div>
                                <h1 className="text-xl font-bold text-foreground">Pilot Terminal</h1>
                                <p className="text-sm text-gunmetal">{user?.fullName || user?.email} • Commercial Pilot</p>
                            </div>
                        </div>
                        
                        {/* Navigation Arrows */}
                        <NavigationArrows />
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-slate-400">
                                STATUS: <span className="text-green-400">AVAILABLE</span>
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
                    <TabsContent value="documents" className="scroll-smooth">
                        {renderDocuments()}
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