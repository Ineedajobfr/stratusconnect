import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Plane, 
  BarChart3, 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Search,
  Filter,
  Plus,
  Eye,
  DollarSign,
  Calendar,
  AlertCircle,
  Settings,
  FileText,
  Shield,
  Bell
} from "lucide-react";

interface TripRequest {
  id: string;
  route: string;
  date: string;
  passengers: number;
  aircraftType: string;
  budget: string;
  urgency: string;
  broker: string;
  timeRemaining: string;
  status: 'new' | 'quoted' | 'accepted' | 'declined';
}

interface Quote {
  id: string;
  requestId: string;
  aircraft: string;
  price: number;
  status: 'pending' | 'accepted' | 'declined';
  submittedAt: string;
  validUntil: string;
}

interface FleetAircraft {
  id: string;
  tailNumber: string;
  type: string;
  capacity: number;
  range: number;
  status: 'available' | 'in_use' | 'maintenance';
  location: string;
  nextAvailable: string;
}

interface EmptyLeg {
  id: string;
  route: string;
  date: string;
  aircraft: string;
  price: number;
  seats: number;
  status: 'active' | 'booked' | 'expired';
}

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app this would come from Supabase
  const [tripRequests] = useState<TripRequest[]>([
    {
      id: 'TR-001',
      route: 'JFK → LAX',
      date: '2025-01-15',
      passengers: 8,
      aircraftType: 'Heavy Jet',
      budget: '$50,000 - $100,000',
      urgency: 'Standard',
      broker: 'Elite Charters',
      timeRemaining: '2h 15m',
      status: 'new'
    },
    {
      id: 'TR-002',
      route: 'LHR → CDG',
      date: '2025-01-18',
      passengers: 4,
      aircraftType: 'Mid-Size Jet',
      budget: '$25,000 - $50,000',
      urgency: 'Urgent',
      broker: 'Global Aviation',
      timeRemaining: '1d 4h',
      status: 'quoted'
    }
  ]);

  const [myQuotes] = useState<Quote[]>([
    {
      id: 'Q-001',
      requestId: 'TR-001',
      aircraft: 'Gulfstream G650',
      price: 75000,
      status: 'pending',
      submittedAt: '2025-01-13',
      validUntil: '2025-01-14'
    },
    {
      id: 'Q-002',
      requestId: 'TR-002',
      aircraft: 'Citation X',
      price: 35000,
      status: 'accepted',
      submittedAt: '2025-01-12',
      validUntil: '2025-01-13'
    }
  ]);

  const [fleet] = useState<FleetAircraft[]>([
    {
      id: 'F-001',
      tailNumber: 'N123SC',
      type: 'Gulfstream G650',
      capacity: 12,
      range: 7500,
      status: 'available',
      location: 'JFK',
      nextAvailable: 'Available now'
    },
    {
      id: 'F-002',
      tailNumber: 'N456SC',
      type: 'Citation X',
      capacity: 8,
      range: 3500,
      status: 'in_use',
      location: 'LAX',
      nextAvailable: '2025-01-16'
    }
  ]);

  const [emptyLegs] = useState<EmptyLeg[]>([
    {
      id: 'EL-001',
      route: 'Paris → London',
      date: '2025-01-16',
      aircraft: 'Gulfstream G550',
      price: 15000,
      seats: 8,
      status: 'active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'quoted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'accepted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_use': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'maintenance': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'New Request';
      case 'quoted': return 'Quoted';
      case 'accepted': return 'Accepted';
      case 'declined': return 'Declined';
      case 'available': return 'Available';
      case 'in_use': return 'In Use';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Plane className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">OPERATOR TERMINAL</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-slate-400">OPERATOR</div>
              <div className="text-lg font-bold text-orange-400">Elite Aviation Group</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-orange-400">
                {new Date().toLocaleTimeString()}
              </div>
              <div className="text-sm text-slate-400">{new Date().toLocaleDateString()}</div>
            </div>
        </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Requests Board
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              My Quotes
            </TabsTrigger>
            <TabsTrigger value="fleet" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Plane className="h-4 w-4 mr-2" />
              Fleet Management
            </TabsTrigger>
            <TabsTrigger value="empty-legs" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Empty Legs
            </TabsTrigger>
            <TabsTrigger value="crew" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Crew Directory
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">New Requests</CardTitle>
                  <Bell className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold text-white">{tripRequests.filter(r => r.status === 'new').length}</div>
                  <p className="text-xs text-slate-400">+3 from yesterday</p>
          </CardContent>
        </Card>

              <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Active Quotes</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold text-white">{myQuotes.filter(q => q.status === 'pending').length}</div>
                  <p className="text-xs text-slate-400">2 expiring today</p>
          </CardContent>
        </Card>

              <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Fleet Utilization</CardTitle>
                  <Plane className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold text-white">78%</div>
                  <p className="text-xs text-slate-400">+5% from last month</p>
          </CardContent>
        </Card>

              <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Quote Success</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold text-white">65%</div>
                  <p className="text-xs text-slate-400">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Requests */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-orange-400">Recent Trip Requests</CardTitle>
                  <CardDescription>Latest requests from brokers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tripRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plane className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{request.route}</div>
                          <div className="text-sm text-slate-400">{request.broker} • {request.passengers} passengers</div>
                          <div className="text-sm text-slate-400">{request.date} • {request.budget}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                        <div className="text-sm text-slate-400 mt-1">
                          {request.timeRemaining}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Fleet Status */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-orange-400">Fleet Status</CardTitle>
                  <CardDescription>Current aircraft availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fleet.map((aircraft) => (
                    <div key={aircraft.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plane className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{aircraft.tailNumber}</div>
                          <div className="text-sm text-slate-400">{aircraft.type}</div>
                          <div className="text-sm text-slate-400">{aircraft.location} • {aircraft.capacity} seats</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(aircraft.status)}>
                          {getStatusText(aircraft.status)}
                        </Badge>
                        <div className="text-sm text-slate-400 mt-1">
                          {aircraft.nextAvailable}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="btn-terminal-accent h-16 text-lg">
                    <Bell className="h-5 w-5 mr-2" />
                    View Requests
                  </Button>
                  <Button className="btn-terminal-secondary h-16 text-lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Post Empty Leg
                  </Button>
                  <Button className="btn-terminal-secondary h-16 text-lg">
                    <Users className="h-5 w-5 mr-2" />
                    Find Crew
                  </Button>
                  <Button className="btn-terminal-secondary h-16 text-lg">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Board Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Incoming Trip Requests</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="quoted">Quoted</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {tripRequests.map((request) => (
                <Card key={request.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plane className="h-8 w-8 text-black" />
                        </div>
                      <div>
                          <div className="text-xl font-bold text-white">{request.route}</div>
                          <div className="text-slate-400">{request.broker} • {request.passengers} passengers</div>
                          <div className="text-slate-400">{request.date} • {request.aircraftType}</div>
                          <div className="text-slate-400">Budget: {request.budget} • Urgency: {request.urgency}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                      <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                      </Badge>
                          <div className="text-sm text-slate-400 mt-1">
                            {request.timeRemaining}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button className="btn-terminal-accent">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {request.status === 'new' && (
                            <Button className="btn-terminal-secondary">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Submit Quote
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>

          {/* My Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">My Quotes & Requests</h2>
            
            <div className="space-y-6">
              {myQuotes.map((quote) => (
                <Card key={quote.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-8 w-8 text-black" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">Request {quote.requestId}</div>
                          <div className="text-slate-400">{quote.aircraft}</div>
                          <div className="text-slate-400">Submitted: {quote.submittedAt}</div>
                          <div className="text-slate-400">Valid until: {quote.validUntil}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-400">${quote.price.toLocaleString()}</div>
                          <Badge className={getStatusColor(quote.status)}>
                            {getStatusText(quote.status)}
                          </Badge>
                        </div>
                        <Button className="btn-terminal-accent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
              </CardContent>
            </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fleet Management Tab */}
          <TabsContent value="fleet" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Fleet Management</h2>
              <Button className="btn-terminal-accent">
                <Plus className="h-4 w-4 mr-2" />
                Add Aircraft
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fleet.map((aircraft) => (
                <Card key={aircraft.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Plane className="h-8 w-8 text-black" />
                      </div>
                      <div className="text-xl font-bold text-white mb-2">{aircraft.tailNumber}</div>
                      <div className="text-slate-400 mb-2">{aircraft.type}</div>
                      <div className="text-slate-400 mb-4">{aircraft.capacity} seats • {aircraft.range}nm range</div>
                      <Badge className={getStatusColor(aircraft.status)}>
                        {getStatusText(aircraft.status)}
                      </Badge>
                      <div className="text-sm text-slate-400 mt-2">{aircraft.location}</div>
                      <div className="text-sm text-slate-400">{aircraft.nextAvailable}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>

          {/* Empty Legs Tab */}
          <TabsContent value="empty-legs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Empty Leg Management</h2>
              <Button className="btn-terminal-accent">
                <Plus className="h-4 w-4 mr-2" />
                Post Empty Leg
              </Button>
            </div>

            <div className="space-y-4">
              {emptyLegs.map((leg) => (
                <Card key={leg.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plane className="h-8 w-8 text-black" />
                        </div>
                      <div>
                          <div className="text-xl font-bold text-white">{leg.route}</div>
                          <div className="text-slate-400">{leg.aircraft} • {leg.seats} seats</div>
                          <div className="text-slate-400">{leg.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-400">${leg.price.toLocaleString()}</div>
                          <Badge className={getStatusColor(leg.status)}>
                            {getStatusText(leg.status)}
                      </Badge>
                    </div>
                        <Button className="btn-terminal-accent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                      </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>

          {/* Crew Directory Tab */}
          <TabsContent value="crew" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Crew & Pilot Directory</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Users className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Crew directory and pilot search functionality coming soon!</p>
          </div>
              </CardContent>
            </Card>
        </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Analytics and reporting features coming soon!</p>
          </div>
              </CardContent>
            </Card>
        </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>No messages yet. Start a conversation with a broker!</p>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Profile & Verification</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Settings className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Profile management and Fortress of Trust verification coming soon!</p>
                </div>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}