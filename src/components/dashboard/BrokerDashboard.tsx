import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BarChart3, 
  Plane, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  DollarSign,
  Calendar,
  AlertCircle
} from "lucide-react";

interface TripRequest {
  id: string;
  route: string;
  date: string;
  passengers: number;
  status: 'pending' | 'quotes_received' | 'quoted' | 'booked';
  quotesCount: number;
  timeRemaining: string;
  client: string;
}

interface EmptyLeg {
  id: string;
  route: string;
  date: string;
  aircraft: string;
  price: number;
  operator: string;
  discount: number;
  seats: number;
}

interface Quote {
  id: string;
  requestId: string;
  operator: string;
  aircraft: string;
  price: number;
  validUntil: string;
  status: 'pending' | 'accepted' | 'declined';
}

export default function BrokerDashboard() {
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
      status: 'quotes_received',
      quotesCount: 3,
      timeRemaining: '2h 15m',
      client: 'Tech Corp'
    },
    {
      id: 'TR-002',
      route: 'LHR → CDG',
      date: '2025-01-18',
      passengers: 4,
      status: 'pending',
      quotesCount: 0,
      timeRemaining: '1d 4h',
      client: 'Global Finance'
    },
    {
      id: 'TR-003',
      route: 'MIA → SFO',
      date: '2025-01-20',
      passengers: 12,
      status: 'booked',
      quotesCount: 5,
      timeRemaining: 'Completed',
      client: 'Luxury Travel'
    }
  ]);

  const [emptyLegs] = useState<EmptyLeg[]>([
    {
      id: 'EL-001',
      route: 'Paris → London',
      date: '2025-01-16',
      aircraft: 'Gulfstream G550',
      price: 15000,
      operator: 'Elite Aviation',
      discount: 25,
      seats: 8
    },
    {
      id: 'EL-002',
      route: 'NYC → Miami',
      date: '2025-01-19',
      aircraft: 'Citation X',
      price: 8500,
      operator: 'SkyBridge',
      discount: 30,
      seats: 6
    }
  ]);

  const [recentQuotes] = useState<Quote[]>([
    {
      id: 'Q-001',
      requestId: 'TR-001',
      operator: 'Premier Jets',
      aircraft: 'Gulfstream G650',
      price: 45000,
      validUntil: '2025-01-14',
      status: 'pending'
    },
    {
      id: 'Q-002',
      requestId: 'TR-001',
      operator: 'Elite Aviation',
      aircraft: 'Bombardier Global 6000',
      price: 42000,
      validUntil: '2025-01-14',
      status: 'pending'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'quotes_received': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'booked': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Awaiting Quotes';
      case 'quotes_received': return 'Quotes Received';
      case 'booked': return 'Booked';
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
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">BROKER TERMINAL</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-slate-400">BROKER</div>
              <div className="text-lg font-bold text-orange-400">Sarah Mitchell</div>
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
              <Plane className="h-4 w-4 mr-2" />
              My Requests
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Quote Management
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Search className="h-4 w-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Star className="h-4 w-4 mr-2" />
              Saved Jets
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Active Requests</CardTitle>
                  <Plane className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold text-white">{tripRequests.filter(r => r.status !== 'booked').length}</div>
                  <p className="text-xs text-slate-400">+2 from last week</p>
          </CardContent>
        </Card>

              <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Quotes Received</CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold text-white">{recentQuotes.length}</div>
                  <p className="text-xs text-slate-400">+5 from yesterday</p>
          </CardContent>
        </Card>

              <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold text-white">87%</div>
                  <p className="text-xs text-slate-400">+3% from last month</p>
          </CardContent>
        </Card>

              <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold text-white">12</div>
                  <p className="text-xs text-slate-400">3 unread</p>
          </CardContent>
        </Card>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Trip Requests */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-orange-400">Recent Trip Requests</CardTitle>
                  <CardDescription>Your latest client requests and their status</CardDescription>
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
                          <div className="text-sm text-slate-400">{request.client} • {request.passengers} passengers</div>
                          <div className="text-sm text-slate-400">{request.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                        <div className="text-sm text-slate-400 mt-1">
                          {request.quotesCount} quotes
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Empty Leg Opportunities */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-orange-400">Empty Leg Opportunities</CardTitle>
                  <CardDescription>Special deals and repositioning flights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emptyLegs.map((leg) => (
                    <div key={leg.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plane className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{leg.route}</div>
                          <div className="text-sm text-slate-400">{leg.aircraft} • {leg.seats} seats</div>
                          <div className="text-sm text-slate-400">{leg.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-400">${leg.price.toLocaleString()}</div>
                        <div className="text-sm text-green-400">{leg.discount}% off</div>
                        <div className="text-sm text-slate-400">{leg.operator}</div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="btn-terminal-accent h-16 text-lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Post New Trip Request
                  </Button>
                  <Button className="btn-terminal-secondary h-16 text-lg">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Marketplace
                  </Button>
                  <Button className="btn-terminal-secondary h-16 text-lg">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    View Messages
                </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">My Trip Requests</h2>
              <Button className="btn-terminal-accent">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="quotes_received">Quotes Received</option>
                <option value="booked">Booked</option>
              </select>
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
                          <div className="text-slate-400">{request.client} • {request.passengers} passengers</div>
                          <div className="text-slate-400">{request.date} • {request.timeRemaining}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                      <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                      </Badge>
                          <div className="text-sm text-slate-400 mt-1">
                            {request.quotesCount} quotes received
                          </div>
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

          {/* Quote Management Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Quote Management</h2>
            
            <div className="space-y-6">
              {recentQuotes.map((quote) => (
                <Card key={quote.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plane className="h-8 w-8 text-black" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">{quote.operator}</div>
                          <div className="text-slate-400">{quote.aircraft}</div>
                          <div className="text-slate-400">Request: {quote.requestId}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-400">${quote.price.toLocaleString()}</div>
                          <div className="text-sm text-slate-400">Valid until: {quote.validUntil}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Button className="btn-terminal-accent">
                            Accept
                          </Button>
                          <Button className="btn-terminal-secondary">
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Marketplace</h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search empty legs..."
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button className="btn-terminal-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emptyLegs.map((leg) => (
                <Card key={leg.id} className="bg-slate-800 border-slate-700 hover:border-orange-500 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Plane className="h-8 w-8 text-black" />
                      </div>
                      <div className="text-xl font-bold text-white mb-2">{leg.route}</div>
                      <div className="text-slate-400 mb-2">{leg.aircraft}</div>
                      <div className="text-slate-400 mb-4">{leg.date} • {leg.seats} seats</div>
                      <div className="text-2xl font-bold text-orange-400 mb-2">${leg.price.toLocaleString()}</div>
                      <div className="text-green-400 mb-4">{leg.discount}% off regular price</div>
                      <div className="text-slate-400 mb-4">{leg.operator}</div>
                      <Button className="btn-terminal-accent w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>No messages yet. Start a conversation with an operator!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Jets Tab */}
          <TabsContent value="saved" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Saved Jets & Operators</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Star className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>No saved jets or operators yet. Start saving your favorites!</p>
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
                  <Users className="h-16 w-16 mx-auto mb-4 text-slate-600" />
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