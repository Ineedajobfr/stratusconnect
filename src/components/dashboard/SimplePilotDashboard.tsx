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
  Clock,
  MapPin,
  DollarSign,
  Award,
  Shield,
  FileText,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { UnifiedTerminalLayout, TerminalIcons } from "../demo/UnifiedTerminalLayout";

export default function SimplePilotDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  // Dummy data for elite feel
  const pilotData = {
    name: "Capt. Sarah Johnson",
    role: "Senior Pilot",
    status: "available" as const,
    avatar: "",
    totalHours: 12500,
    rating: 4.9,
    completedFlights: 847,
    monthlyEarnings: 18500,
    nextFlight: "Dec 28, 14:30 UTC",
    aircraft: "Gulfstream G550"
  };

  const sidebarItems = [
    { id: "profile", label: "Pilot Profile", icon: <TerminalIcons.Profile />, active: true },
    { id: "schedule", label: "Flight Schedule", icon: <TerminalIcons.Schedule /> },
    { id: "assignments", label: "Current Assignments", icon: <TerminalIcons.Jobs /> },
    { id: "earnings", label: "Flight Earnings", icon: <TerminalIcons.Earnings /> },
    { id: "licenses", label: "Licenses & Ratings", icon: <TerminalIcons.Licenses /> },
    { id: "network", label: "Professional Network", icon: <TerminalIcons.Network /> },
    { id: "messages", label: "Messages", icon: <TerminalIcons.Messages /> },
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
      earnings: 2500,
      status: "scheduled"
    },
    {
      id: "FL-002", 
      route: "LAX → MIA",
      date: "Dec 30, 09:00 UTC",
      aircraft: "Citation X+",
      passengers: 4,
      duration: "4h 30m",
      earnings: 1800,
      status: "scheduled"
    },
    {
      id: "FL-003",
      route: "MIA → LHR",
      date: "Jan 2, 16:00 UTC", 
      aircraft: "Gulfstream G650",
      passengers: 6,
      duration: "8h 45m",
      earnings: 4200,
      status: "scheduled"
    }
  ];

  const recentEarnings = [
    { month: "December 2024", amount: 18500, flights: 12, avgPerFlight: 1542 },
    { month: "November 2024", amount: 16200, flights: 10, avgPerFlight: 1620 },
    { month: "October 2024", amount: 19800, flights: 14, avgPerFlight: 1414 }
  ];

  const licenses = [
    { name: "Airline Transport Pilot (ATP)", status: "Current", expiry: "2025-12-31", hours: 12500 },
    { name: "Boeing 737 Type Rating", status: "Current", expiry: "2025-08-15", hours: 3200 },
    { name: "Gulfstream G550", status: "Current", expiry: "2025-09-10", hours: 1800 },
    { name: "Citation X+", status: "Current", expiry: "2025-07-15", hours: 950 },
    { name: "First Class Medical", status: "Current", expiry: "2025-03-15", hours: 0 }
  ];

  return (
    <UnifiedTerminalLayout
      title="Pilot Terminal"
      subtitle="Professional flight operations and career management"
      user={pilotData}
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
          <TabsTrigger value="licenses" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            <Award className="h-4 w-4 mr-2" />
            Licenses
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
                    <p className="text-slate-400 text-sm">Total Hours</p>
                    <p className="text-3xl font-bold text-orange-400">{pilotData.totalHours.toLocaleString()}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Rating</p>
                    <p className="text-3xl font-bold text-green-400">{pilotData.rating}</p>
                  </div>
                  <Star className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Flights Completed</p>
                    <p className="text-3xl font-bold text-blue-400">{pilotData.completedFlights}</p>
                  </div>
                  <Plane className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Monthly Earnings</p>
                    <p className="text-3xl font-bold text-cyan-400">${pilotData.monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Pilot Profile</CardTitle>
              <CardDescription>Professional aviation credentials and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-xl">SJ</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{pilotData.name}</div>
                  <div className="text-slate-400">ATPL • {pilotData.totalHours.toLocaleString()} hours</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Verified
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-slate-400">{pilotData.rating} (47 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Type Ratings</h4>
                  <div className="space-y-2">
                    {licenses.slice(1, 4).map((license, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-slate-300">{license.name}</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {license.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Languages</h4>
                  <div className="space-y-2">
                    {['English', 'French', 'Spanish', 'German'].map((lang, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Experience Summary</h4>
                <p className="text-slate-300">13 years commercial aviation, 8 years private charter. Specialized in long-haul international flights and VIP transport. Certified on multiple aircraft types with impeccable safety record.</p>
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
                <CardDescription>Your scheduled flight assignments</CardDescription>
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
                  <div>Next available: {pilotData.nextFlight}</div>
                  <div>Preferred aircraft: {pilotData.aircraft}</div>
                  <div>Max flight duration: 12 hours</div>
                  <div>International flights: Yes</div>
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
              <CardDescription>Active and upcoming flight assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingFlights.map((flight, index) => (
                  <div key={flight.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <Plane className="h-5 w-5 text-black" />
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Departure:</span>
                        <span className="text-white ml-2">{flight.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Passengers:</span>
                        <span className="text-white ml-2">{flight.passengers}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        Contact Crew
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
                    <p className="text-3xl font-bold text-orange-400">${pilotData.monthlyEarnings.toLocaleString()}</p>
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
                    <p className="text-3xl font-bold text-green-400">$1,542</p>
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
                    <p className="text-3xl font-bold text-blue-400">$198,500</p>
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

        {/* Licenses Tab */}
        <TabsContent value="licenses" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-orange-400">Licenses & Certifications</CardTitle>
              <CardDescription>Your current aviation credentials and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licenses.map((license, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{license.name}</div>
                        <div className="text-sm text-slate-400">
                          {license.hours > 0 ? `${license.hours.toLocaleString()} hours` : 'Medical Certificate'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-1">
                        {license.status}
                      </Badge>
                      <div className="text-sm text-slate-400">Expires: {license.expiry}</div>
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
                  { name: "Capt. Mike Chen", role: "Senior Pilot", company: "Global Aviation", rating: 4.8 },
                  { name: "Capt. Emma Davis", role: "Chief Pilot", company: "Elite Charters", rating: 4.9 },
                  { name: "Capt. James Wilson", role: "Training Captain", company: "Skyline Aviation", rating: 4.7 },
                  { name: "Capt. Lisa Rodriguez", role: "Fleet Manager", company: "Premier Air", rating: 4.9 }
                ].map((pilot, index) => (
                  <div key={index} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">{pilot.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{pilot.name}</div>
                        <div className="text-sm text-slate-400">{pilot.role} • {pilot.company}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm text-slate-400">{pilot.rating}</span>
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
                    <span className="text-black font-bold text-sm">GA</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Global Aviation</h3>
                        <p className="text-sm text-slate-400">Re: JFK → LAX Assignment</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">10 min ago</p>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                          New
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Hi Sarah, you've been assigned to the JFK → LAX flight on Dec 28th. 
                      G550 N425SC, 8 passengers. Please confirm availability and review the flight plan. 
                      Weather looks good for departure at 14:30 UTC."
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
                    <span className="text-white font-bold text-sm">EW</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Emma Wilson (Crew)</h3>
                        <p className="text-sm text-slate-400">Re: Flight Coordination</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">2 hours ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Hi Captain! Looking forward to working with you on the LAX → MIA flight. 
                      I've prepared the cabin service plan. Any special requirements for the passengers? 
                      I'll be at the aircraft 2 hours before departure."
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
                    <span className="text-white font-bold text-sm">MC</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Mike Chen (Operations)</h3>
                        <p className="text-sm text-slate-400">Re: Schedule Update</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">4 hours ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Your MIA → LHR flight has been confirmed for Jan 2nd. 
                      G650 N892AV, 6 passengers. Departure time moved to 16:00 UTC. 
                      Please update your schedule and confirm receipt."
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
                    <span className="text-white font-bold text-sm">LR</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">Lisa Rodriguez (Broker)</h3>
                        <p className="text-sm text-slate-400">Re: Client Feedback</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">1 day ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Excellent work on the recent charter! The client was very impressed with your professionalism. 
                      They've requested you specifically for their next trip. 
                      Thank you for representing us so well!"
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
                    <span className="text-white font-bold text-sm">JW</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">James Wilson (Training)</h3>
                        <p className="text-sm text-slate-400">Re: Recurrent Training</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">2 days ago</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">
                      "Your recurrent training is due next month. 
                      Please schedule your simulator session for the G550. 
                      Available slots: Jan 15th, 18th, or 22nd. Let me know your preference."
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
