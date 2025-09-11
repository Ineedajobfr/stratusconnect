import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Bell, 
  MessageCircle, 
  Settings, 
  Plane,
  Star,
  Utensils,
  Clock,
  MapPin,
  DollarSign,
  Award,
  Shield,
  FileText,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Coffee,
  Heart,
  Search,
  Wrench
} from "lucide-react";
import { UnifiedTerminalLayout, TerminalIcons } from "../demo/UnifiedTerminalLayout";

export default function SimpleCrewDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  // Dummy data for elite feel
  const crewData = {
    name: "Emma Davis",
    role: "Senior Flight Attendant",
    status: "available" as const,
    avatar: "",
    totalFlights: 1247,
    rating: 4.8,
    yearsExperience: 8,
    monthlyEarnings: 12500,
    nextFlight: "Dec 28, 14:30 UTC",
    aircraft: "Gulfstream G550"
  };

  const sidebarItems = [
    { id: "profile", label: "Crew Profile", icon: <TerminalIcons.Profile />, active: true },
    { id: "schedule", label: "Flight Schedule", icon: <TerminalIcons.Schedule /> },
    { id: "assignments", label: "Current Assignments", icon: <TerminalIcons.Jobs /> },
    { id: "earnings", label: "Flight Earnings", icon: <TerminalIcons.Earnings /> },
    { id: "services", label: "Service Capabilities", icon: <Wrench className="w-4 h-4" /> },
    { id: "network", label: "Professional Network", icon: <TerminalIcons.Network /> },
    { id: "messages", label: "Messages", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <TerminalIcons.Settings /> }
  ];

  const upcomingFlights = [
    {
      id: "FL-001",
      route: "JFK → LAX",
      date: "Dec 28, 14:30 UTC",
      aircraft: "Gulfstream G550",
      passengers: 8,
      duration: "5h 15m",
      earnings: 850,
      status: "scheduled",
      services: ["VIP Service", "Catering", "Concierge"]
    },
    {
      id: "FL-002", 
      route: "LAX → MIA",
      date: "Dec 30, 09:00 UTC",
      aircraft: "Citation X+",
      passengers: 4,
      duration: "4h 30m",
      earnings: 650,
      status: "scheduled",
      services: ["Standard Service", "Meal Service"]
    },
    {
      id: "FL-003",
      route: "MIA → LHR",
      date: "Jan 2, 16:00 UTC", 
      aircraft: "Gulfstream G650",
      passengers: 6,
      duration: "8h 45m",
      earnings: 1200,
      status: "scheduled",
      services: ["International Service", "VIP Service", "Catering"]
    }
  ];

  const recentEarnings = [
    { month: "December 2024", amount: 12500, flights: 12, avgPerFlight: 1042 },
    { month: "November 2024", amount: 11200, flights: 10, avgPerFlight: 1120 },
    { month: "October 2024", amount: 13800, flights: 14, avgPerFlight: 986 }
  ];

  const certifications = [
    { name: "Safety Training", status: "Current", expiry: "2025-06-15", hours: 40 },
    { name: "First Aid/CPR", status: "Current", expiry: "2025-03-20", hours: 8 },
    { name: "Food Safety", status: "Current", expiry: "2025-08-10", hours: 16 },
    { name: "VIP Service Training", status: "Current", expiry: "2025-05-30", hours: 24 },
    { name: "International Service", status: "Current", expiry: "2025-07-15", hours: 32 }
  ];

  const serviceCapabilities = [
    { service: "VIP Service", level: "Expert", experience: "5+ years" },
    { service: "International Flights", level: "Expert", experience: "6+ years" },
    { service: "Catering Management", level: "Advanced", experience: "4+ years" },
    { service: "Concierge Services", level: "Expert", experience: "3+ years" },
    { service: "Medical Assistance", level: "Certified", experience: "2+ years" }
  ];

  return (
    <UnifiedTerminalLayout
      title="Crew Terminal"
      subtitle="Professional cabin service and hospitality management"
      user={crewData}
      sidebarItems={sidebarItems}
      onNavigate={(direction) => console.log(`Navigate ${direction}`)}
      onLogout={() => console.log('Logout')}
      onNotificationClick={() => console.log('Notifications')}
      onMessageClick={() => console.log('Messages')}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Plane className="h-4 w-4 mr-2" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="earnings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <DollarSign className="h-4 w-4 mr-2" />
            Earnings
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Utensils className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="network" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Network
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Flights</p>
                    <p className="text-3xl font-bold text-orange-400">{crewData.totalFlights.toLocaleString()}</p>
                  </div>
                  <Plane className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Rating</p>
                    <p className="text-3xl font-bold text-green-400">{crewData.rating}</p>
                  </div>
                  <Star className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Experience</p>
                    <p className="text-3xl font-bold text-blue-400">{crewData.yearsExperience} years</p>
                  </div>
                  <Award className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Monthly Earnings</p>
                    <p className="text-3xl font-bold text-cyan-400">${crewData.monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Crew Profile</CardTitle>
              <CardDescription>Professional cabin service credentials and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-xl">ED</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{crewData.name}</div>
                  <div className="text-slate-400">{crewData.role} • {crewData.yearsExperience} years experience</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Verified
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-slate-400">{crewData.rating} (32 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Certifications</h4>
                  <div className="space-y-2">
                    {certifications.slice(0, 4).map((cert, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-slate-300">{cert.name}</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {cert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Languages</h4>
                  <div className="space-y-2">
                    {['English', 'French', 'Spanish', 'Italian', 'German'].map((lang, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Service Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {['VIP Service', 'International Flights', 'Catering Management', 'Concierge Services', 'Medical Assistance'].map((specialty, index) => (
                    <Badge key={index} className="bg-slate-700 text-slate-300 border-slate-600">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Experience Summary</h4>
                <p className="text-slate-300">8 years in private aviation with expertise in luxury service, international flights, and VIP client management. Specialized in Gulfstream and Citation aircraft with impeccable safety and service records.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Upcoming Flights</CardTitle>
                <CardDescription>Your scheduled cabin service assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingFlights.map((flight) => (
                  <div key={flight.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-white">{flight.route}</div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        {flight.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-400 space-y-1">
                      <div>Date: {flight.date}</div>
                      <div>Aircraft: {flight.aircraft}</div>
                      <div>Passengers: {flight.passengers} • Duration: {flight.duration}</div>
                      <div className="text-orange-400 font-semibold">Earnings: ${flight.earnings.toLocaleString()}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {flight.services.map((service, index) => (
                          <Badge key={index} className="bg-slate-600 text-slate-300 text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Availability Status</CardTitle>
                <CardDescription>Your current availability and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white">Available for assignments</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <div>Next available: {crewData.nextFlight}</div>
                  <div>Preferred aircraft: {crewData.aircraft}</div>
                  <div>Max flight duration: 12 hours</div>
                  <div>International flights: Yes</div>
                  <div>VIP service: Available</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Current Assignments</CardTitle>
              <CardDescription>Active and upcoming cabin service assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingFlights.map((flight, index) => (
                  <div key={flight.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <Utensils className="h-5 w-5 text-black" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{flight.route}</div>
                          <div className="text-sm text-slate-400">{flight.aircraft}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-400 font-semibold">${flight.earnings.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">{flight.duration}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-slate-400">Departure:</span>
                        <span className="text-white ml-2">{flight.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Passengers:</span>
                        <span className="text-white ml-2">{flight.passengers}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {flight.services.map((service, index) => (
                        <Badge key={index} className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        Contact Pilot
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">This Month</p>
                    <p className="text-3xl font-bold text-orange-400">${crewData.monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Avg per Flight</p>
                    <p className="text-3xl font-bold text-green-400">$1,042</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">YTD Total</p>
                    <p className="text-3xl font-bold text-blue-400">$142,500</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Earnings History</CardTitle>
              <CardDescription>Monthly earnings breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEarnings.map((earning, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{earning.month}</div>
                      <div className="text-sm text-slate-400">{earning.flights} flights</div>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-400 font-semibold">${earning.amount.toLocaleString()}</div>
                      <div className="text-sm text-slate-400">Avg: ${earning.avgPerFlight}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Service Capabilities</CardTitle>
              <CardDescription>Your professional service skills and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceCapabilities.map((capability, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{capability.service}</div>
                        <div className="text-sm text-slate-400">{capability.experience}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-1">
                        {capability.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Certifications</CardTitle>
              <CardDescription>Your current aviation service certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{cert.name}</div>
                        <div className="text-sm text-slate-400">
                          {cert.hours > 0 ? `${cert.hours} hours training` : 'Medical Certificate'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-1">
                        {cert.status}
                      </Badge>
                      <div className="text-sm text-slate-400">Expires: {cert.expiry}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Professional Network</CardTitle>
              <CardDescription>Connect with other aviation professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Sarah Mitchell", role: "Senior Flight Attendant", company: "Elite Charters", rating: 4.9 },
                  { name: "Mike Chen", role: "Cabin Manager", company: "Global Aviation", rating: 4.8 },
                  { name: "Lisa Rodriguez", role: "VIP Service Specialist", company: "Premier Air", rating: 4.9 },
                  { name: "James Wilson", role: "International Crew", company: "Skyline Aviation", rating: 4.7 }
                ].map((crew, index) => (
                  <div key={index} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">{crew.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{crew.name}</div>
                        <div className="text-sm text-slate-400">{crew.role} • {crew.company}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm text-slate-400">{crew.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          
          {/* Message Threads */}
          <div className="space-y-4">
            {/* Thread 1 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">SJ</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Capt. Sarah Johnson</h3>
                        <p className="text-sm text-slate-400">Re: LAX → MIA Flight Coordination</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">15 min ago</p>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Hi Emma! Looking forward to working with you on the LAX → MIA flight. 
                      I've reviewed the passenger manifest - 4 VIP clients. 
                      Any special service requirements I should know about?"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thread 2 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MC</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Mike Chen (Operations)</h3>
                        <p className="text-sm text-slate-400">Re: Catering Requirements</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">1 hour ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Emma, for the MIA → LHR flight, we need premium catering for 6 passengers. 
                      Client requested Michelin-starred meals. 
                      Can you coordinate with our catering partner for the special menu?"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thread 3 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LR</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Lisa Rodriguez (Broker)</h3>
                        <p className="text-sm text-slate-400">Re: Client Preferences</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">3 hours ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Hi Emma! The client for the JFK → LAX flight has specific dietary requirements. 
                      One passenger is vegan, another has gluten intolerance. 
                      Please ensure the catering accommodates these needs."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thread 4 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">EW</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Emma Wilson (Senior Crew)</h3>
                        <p className="text-sm text-slate-400">Re: Training Update</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">1 day ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Great job on the recent flights! Your VIP service skills are excellent. 
                      We have a new safety training module available. 
                      Please complete it by next week. Keep up the fantastic work!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thread 5 */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DR</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">David Rodriguez (Ground Ops)</h3>
                        <p className="text-sm text-slate-400">Re: Ground Transportation</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">2 days ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "For the LHR arrival, we've arranged luxury ground transport for your passengers. 
                      Two Mercedes S-Class vehicles will be waiting. 
                      Please coordinate with the ground team upon arrival."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-3">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  New Message
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UnifiedTerminalLayout>
  );
}
