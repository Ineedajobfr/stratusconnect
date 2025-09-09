import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RFQManager } from '@/components/rfq/RFQManager';
import { QuoteManager } from '@/components/quotes/QuoteManager';
import { EscrowManager } from '@/components/payments/EscrowManager';
import { NotificationsCenter } from '@/components/notifications/NotificationsCenter';
import { TaskInbox } from '@/components/tasks/TaskInbox';
import { NavigationControls } from '@/components/NavigationControls';
import StarfieldBackground from '@/components/StarfieldBackground';
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
  AlertCircle,
  Bell,
  CheckSquare,
  Shield,
  FileText
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
    <div className="min-h-screen bg-slate-900 text-white relative">
      <StarfieldBackground />
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
            <NotificationsCenter />
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

      {/* Navigation Controls */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-3">
        <NavigationControls 
          onPrevious={() => window.history.back()}
          onNext={() => window.history.forward()}
          showHome={true}
          showHelp={true}
          helpPage="broker"
        />
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 grid grid-cols-9">
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
            <TabsTrigger value="escrow" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Escrow
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
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
            <RFQManager />
          </TabsContent>

          {/* Quote Management Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <QuoteManager />
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
                          <p className="text-sm text-slate-400">Re: JFK → LAX Quote Request</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">2 min ago</p>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                            New
                          </Badge>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "Hi Sarah, we have availability for your JFK → LAX request on Dec 28th. 
                        Our Gulfstream G550 is perfect for your 8 passengers. 
                        Quote: $45,000. Let me know if you need any details!"
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
                      <span className="text-white font-bold text-sm">EA</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">Elite Aviation</h3>
                          <p className="text-sm text-slate-400">Re: MIA → LHR Charter</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">1 hour ago</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "Thanks for considering us! Our G650 is available for your MIA → LHR trip. 
                        We can accommodate your 6 passengers comfortably. 
                        Total cost: $78,000 including catering and ground transport."
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
                      <span className="text-white font-bold text-sm">PA</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">Premier Air</h3>
                          <p className="text-sm text-slate-400">Re: LAX → MIA Empty Leg</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">3 hours ago</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "We have an empty leg LAX → MIA on Dec 30th. 
                        Citation X+ available at 40% discount. 
                        Perfect for your 4 passengers. Interested?"
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
                      <span className="text-white font-bold text-sm">SA</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">Skyline Aviation</h3>
                          <p className="text-sm text-slate-400">Re: Fleet Update</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">1 day ago</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "Hi Sarah, just wanted to update you on our new G650 addition to the fleet. 
                        We now have 3 Gulfstreams available for your clients. 
                        Let me know if you'd like to see our updated availability calendar."
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
                      <span className="text-white font-bold text-sm">CA</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">Charter Alliance</h3>
                          <p className="text-sm text-slate-400">Re: Partnership Proposal</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">2 days ago</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "We'd love to discuss a partnership with your brokerage. 
                        We can offer preferred rates and priority booking for your clients. 
                        Would you be available for a call this week?"
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

          {/* Saved Jets Tab */}
          <TabsContent value="saved" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Saved Jets & Operators</h2>
            
            {/* Saved Operators */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Saved Operators</CardTitle>
                <CardDescription>Your trusted aviation partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Global Aviation", aircraft: ["G550", "G650", "Citation X+"], rating: 4.9, saved: "2 days ago" },
                    { name: "Elite Aviation", aircraft: ["G650", "Falcon 7X"], rating: 4.8, saved: "1 week ago" },
                    { name: "Premier Air", aircraft: ["Citation X+", "Citation CJ4"], rating: 4.7, saved: "3 days ago" },
                    { name: "Skyline Aviation", aircraft: ["G550", "G650", "Global 6000"], rating: 4.9, saved: "5 days ago" }
                  ].map((operator, index) => (
                    <div key={index} className="p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-sm">{operator.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{operator.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-sm text-slate-400">{operator.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-600">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-400">Aircraft: {operator.aircraft.join(", ")}</div>
                        <div className="text-xs text-slate-500">Saved {operator.saved}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Saved Aircraft */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Saved Aircraft</CardTitle>
                <CardDescription>Your preferred aircraft configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { model: "Gulfstream G550", tail: "N425SC", seats: 8, range: "6,750 nm", operator: "Global Aviation" },
                    { model: "Gulfstream G650", tail: "N892AV", seats: 6, range: "7,500 nm", operator: "Elite Aviation" },
                    { model: "Citation X+", tail: "N123CX", seats: 4, range: "3,460 nm", operator: "Premier Air" },
                    { model: "Falcon 7X", tail: "N456FX", seats: 8, range: "6,000 nm", operator: "Skyline Aviation" }
                  ].map((aircraft, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Plane className="h-8 w-8 text-orange-400" />
                        <div>
                          <div className="font-semibold text-white">{aircraft.model}</div>
                          <div className="text-sm text-slate-400">{aircraft.tail} • {aircraft.seats} seats • {aircraft.range}</div>
                          <div className="text-xs text-slate-500">{aircraft.operator}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-600">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Profile & Verification</h2>
            
            {/* Profile Overview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Broker Profile</CardTitle>
                <CardDescription>Your professional aviation brokerage credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xl">SB</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">Sarah Brooks</div>
                    <div className="text-slate-400">Senior Aviation Broker • Elite Charters</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Verified
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-slate-400">4.9 (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">847</div>
                    <div className="text-slate-400 text-sm">Charters Booked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">$2.4M</div>
                    <div className="text-slate-400 text-sm">Total Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">98.5%</div>
                    <div className="text-slate-400 text-sm">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fortress of Trust */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Fortress of Trust</CardTitle>
                <CardDescription>Your security and verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Identity Verification", status: "Verified", icon: <Shield className="h-5 w-5" /> },
                    { name: "Business License", status: "Verified", icon: <FileText className="h-5 w-5" /> },
                    { name: "Insurance Coverage", status: "Verified", icon: <CheckCircle className="h-5 w-5" /> },
                    { name: "Background Check", status: "Verified", icon: <UserCheck className="h-5 w-5" /> },
                    { name: "Financial Verification", status: "Verified", icon: <DollarSign className="h-5 w-5" /> }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-green-400">{item.icon}</div>
                        <span className="text-white">{item.name}</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Help & Support</CardTitle>
                <CardDescription>Get assistance with your broker account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                    <FileText className="h-4 w-4 mr-2" />
                    How to Post Trip Requests
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Managing Client Communications
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Understanding Pricing & Commissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Shield className="h-4 w-4 mr-2" />
                    Fortress of Trust Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

          {/* Escrow Tab */}
          <TabsContent value="escrow" className="space-y-6">
            <EscrowManager />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <TaskInbox />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}