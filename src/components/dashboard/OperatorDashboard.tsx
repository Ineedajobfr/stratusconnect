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
import { VerificationSystem } from '@/components/verification/VerificationSystem';
import { NavigationControls } from '@/components/NavigationControls';
import StarfieldBackground from '@/components/StarfieldBackground';
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
  Bell,
  CheckSquare
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
      case 'accepted': return 'bg-green-500/20 text-white border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'available': return 'bg-green-500/20 text-white border-green-500/30';
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
    <div className="min-h-screen bg-slate-900 text-white relative">
      <StarfieldBackground />
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
            <NotificationsCenter />
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

      {/* Navigation Controls */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-3">
        <NavigationControls 
          onPrevious={() => window.history.back()}
          onNext={() => window.history.forward()}
          showHome={true}
          showHelp={true}
          helpPage="operator"
        />
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 grid grid-cols-11">
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
            <TabsTrigger value="escrow" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Escrow
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="verification" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="fleet" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Plane className="h-4 w-4 mr-2" />
              Fleet
            </TabsTrigger>
            <TabsTrigger value="empty-legs" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Empty Legs
            </TabsTrigger>
            <TabsTrigger value="crew" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Crew
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
            <RFQManager />
          </TabsContent>

          {/* My Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <QuoteManager />
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
            
            {/* Message Threads */}
            <div className="space-y-4">
              {/* Thread 1 */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">SB</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">Sarah Brooks</h3>
                          <p className="text-sm text-slate-400">Re: G550 Availability Inquiry</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">5 min ago</p>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                            New
                          </Badge>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "Hi Mike, I have a client looking for G550 availability JFK → LAX on Dec 28th. 
                        Can you confirm if N425SC is available? They need 8 seats and prefer morning departure."
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
                      <span className="text-white font-bold text-sm">JM</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">James Mitchell</h3>
                          <p className="text-sm text-slate-400">Re: Fleet Maintenance Update</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">1 hour ago</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "Our Citation X+ N892AV is back from maintenance and ready for service. 
                        All systems green. We can offer competitive rates for your upcoming charters."
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
                      <span className="text-white font-bold text-sm">LC</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">Lisa Chen</h3>
                          <p className="text-sm text-slate-400">Re: G650 Charter Confirmation</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "Thanks for the quick response! My client has confirmed the MIA → LHR charter. 
                        Please send over the contract and crew details. 
                        They're very excited about the G650 experience."
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
                      <span className="text-white font-bold text-sm">DR</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">David Rodriguez</h3>
                          <p className="text-sm text-slate-400">Re: Pilot Availability</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">4 hours ago</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "Captain Johnson is available for your Dec 30th flight. 
                        He has 12,500 hours on Gulfstream aircraft. 
                        Should I confirm him for the assignment?"
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
                      <span className="text-white font-bold text-sm">EW</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white">Emma Wilson</h3>
                          <p className="text-sm text-slate-400">Re: Catering Requirements</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">1 day ago</p>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">
                        "For the VIP charter, we need premium catering for 6 passengers. 
                        Any dietary restrictions? We can arrange Michelin-starred meals 
                        and premium beverages. Please confirm by tomorrow."
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

          {/* Escrow Tab */}
          <TabsContent value="escrow" className="space-y-6">
            <EscrowManager />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <TaskInbox />
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <VerificationSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}