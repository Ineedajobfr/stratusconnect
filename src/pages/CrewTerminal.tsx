import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { crewDashboardService } from "@/lib/crew-dashboard-service";
import NavigationArrows from "@/components/NavigationArrows";
import {
    ArrowUp,
    Award,
    BarChart3,
    Bell,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    Globe,
    Navigation,
    Plane,
    Plus,
    RefreshCw,
    Settings,
    Star,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function CrewTerminal() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { user } = useAuth();
  const navigate = useNavigate();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [performance, setPerformance] = useState<Performance[]>([]);
    const [dashboardMetrics, setDashboardMetrics] = useState({
        upcomingFlights: 0,
        completedFlights: 0,
        monthlyEarnings: 0,
        serviceRating: 0,
        availability: 0
    });

    // Load dashboard data
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                if (user?.id) {
                    const metrics = await crewDashboardService.getDashboardMetrics(user.id);
                    setDashboardMetrics({
                        upcomingFlights: metrics.upcomingFlights,
                        completedFlights: metrics.completedFlights,
                        monthlyEarnings: metrics.monthlyEarnings,
                        serviceRating: metrics.averageRating,
                        availability: metrics.availabilityStatus === 'available' ? 100 : 0
                    });
                    
                    const assignmentData = await crewDashboardService.getUpcomingAssignments(user.id);
                    setAssignments(assignmentData.map(assignment => ({
                        id: assignment.id,
                        flightNumber: assignment.flightNumber,
                        route: assignment.route,
                        aircraft: assignment.aircraft,
                        date: assignment.departureDate,
                        time: assignment.departureDate.split('T')[1] || '12:00',
                        duration: `${assignment.duration}h`,
                        passengers: assignment.passengers,
                        status: assignment.status as any,
                        operator: assignment.operator,
                        pay: assignment.pay,
                        currency: 'USD',
                        requirements: assignment.specialRequests
                    })));
                    
                    // Create performance data from metrics
                    setPerformance([
                        {
                            id: '1',
                            metric: 'Service Rating',
                            value: metrics.averageRating.toString(),
                            trend: 'stable' as const,
                            change: '+0.1 from last month'
                        },
                        {
                            id: '2',
                            metric: 'Flights Completed',
                            value: metrics.completedFlights.toString(),
                            trend: 'up' as const,
                            change: '+3 from last month'
                        },
                        {
                            id: '3',
                            metric: 'Monthly Earnings',
                            value: `$${metrics.monthlyEarnings}`,
                            trend: 'up' as const,
                            change: '+$500 from last month'
                        },
                        {
                            id: '4',
                            metric: 'Availability',
                            value: `${metrics.availabilityStatus === 'available' ? 100 : 0}%`,
                            trend: 'stable' as const,
                            change: 'Same as last month'
                        }
                    ]);
                }
            } catch (error) {
                console.error('Error loading crew dashboard data:', error);
            }
        };

        loadDashboardData();
    }, []);

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
                                <p className="text-sm font-medium text-foreground">Completed flight assignment</p>
                                <p className="text-xs text-muted-foreground">2 hours ago • Flight completed successfully</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Bell className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">New assignment available</p>
                                <p className="text-xs text-muted-foreground">Check job board for new opportunities</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Award className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Performance bonus earned</p>
                                <p className="text-xs text-muted-foreground">Excellent service rating achieved</p>
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
                                        <Badge className={`text-xs ${
                                            assignment.status === 'upcoming' ? 'bg-blue-500' :
                                            assignment.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                        }`}>
                                            {assignment.status}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {assignment.flightNumber}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{assignment.route}</h3>
                                    <p className="text-muted-foreground mb-4">{assignment.aircraft}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Date</p>
                                            <p className="font-medium text-foreground">{assignment.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Time</p>
                                            <p className="font-medium text-foreground">{assignment.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Duration</p>
                                            <p className="font-medium text-foreground">{assignment.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Pay</p>
                                            <p className="font-medium text-foreground">{assignment.currency} {assignment.pay}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Requirements:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {assignment.requirements.map((req, index) => (
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
                                    {assignment.status === 'upcoming' && (
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
                            <p className="font-medium text-foreground">{user?.fullName || 'Crew Member'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="font-medium text-foreground">Flight Attendant</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Experience</p>
                            <p className="font-medium text-foreground">Professional</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium text-foreground">{dashboardMetrics.serviceRating}/5</span>
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
                                {['English', 'Spanish', 'French'].map((lang) => (
                                    <Badge key={lang} variant="secondary">{lang}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Specializations</p>
                            <div className="flex flex-wrap gap-2">
                                {['VIP Service', 'Gourmet Catering', 'Medical Assistance'].map((skill) => (
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
                            <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                            <p className="font-medium text-foreground">${dashboardMetrics.monthlyEarnings}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Availability</p>
                            <p className="font-medium text-foreground">{dashboardMetrics.availability}%</p>
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

    const renderNotes = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Flight Notes</h2>
                <Button className="btn-terminal-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                </Button>
            </div>

            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle>Recent Flight Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Flight notes and observations will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );

    const renderTracking = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Flight Tracking</h2>
            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle>Live Flight Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Real-time flight tracking will be available here.</p>
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
                                <h1 className="text-xl font-bold text-foreground">Crew Terminal</h1>
                                <p className="text-sm text-gunmetal">{user?.fullName || user?.email} • Flight Attendant</p>
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