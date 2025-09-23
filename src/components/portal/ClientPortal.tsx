import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Star, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Award,
  Settings,
  Bell,
  Shield,
  CreditCard,
  History,
  Plus,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinDate: string;
  totalSpent: number;
  totalFlights: number;
  averageRating: number;
  lastActivity: string;
  preferences: {
    aircraftTypes: string[];
    routes: string[];
    budget: {
      min: number;
      max: number;
    };
    communication: 'email' | 'phone' | 'both';
  };
}

interface FlightRequest {
  id: string;
  clientId: string;
  route: string;
  aircraft: string;
  passengers: number;
  date: string;
  status: 'pending' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  broker: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  attachments: string[];
}

interface Quote {
  id: string;
  requestId: string;
  operator: string;
  aircraft: string;
  price: number;
  validity: string;
  status: 'active' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  features: string[];
  terms: string;
}

interface ClientActivity {
  id: string;
  type: 'request' | 'quote' | 'booking' | 'message' | 'call';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

export const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in real app, this would come from API
  const clients: ClientProfile[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@eliteaviation.com',
      phone: '+44 20 7123 4567',
      company: 'Elite Aviation Group',
      tier: 'Platinum',
      joinDate: '2023-01-15',
      totalSpent: 1250000,
      totalFlights: 45,
      averageRating: 4.8,
      lastActivity: '2 hours ago',
      preferences: {
        aircraftTypes: ['Gulfstream G650', 'Bombardier Global 7500'],
        routes: ['LHR → JFK', 'LAX → HNL'],
        budget: { min: 50000, max: 150000 },
        communication: 'both'
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@globaljets.com',
      phone: '+1 555 123 4567',
      company: 'Global Jet Services',
      tier: 'Gold',
      joinDate: '2023-03-22',
      totalSpent: 750000,
      totalFlights: 28,
      averageRating: 4.6,
      lastActivity: '1 day ago',
      preferences: {
        aircraftTypes: ['Challenger 350', 'Citation X+'],
        routes: ['CDG → DXB', 'FRA → MIA'],
        budget: { min: 30000, max: 80000 },
        communication: 'email'
      }
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'm.chen@premierair.com',
      phone: '+44 20 7654 3210',
      company: 'Premier Air Charter',
      tier: 'Silver',
      joinDate: '2023-06-10',
      totalSpent: 320000,
      totalFlights: 15,
      averageRating: 4.4,
      lastActivity: '3 hours ago',
      preferences: {
        aircraftTypes: ['Phenom 300', 'Citation CJ4'],
        routes: ['NRT → LAX', 'SIN → HKG'],
        budget: { min: 20000, max: 50000 },
        communication: 'phone'
      }
    }
  ];

  const flightRequests: FlightRequest[] = [
    {
      id: 'FR001',
      clientId: '1',
      route: 'LHR → JFK',
      aircraft: 'Gulfstream G650',
      passengers: 8,
      date: '2024-03-20',
      status: 'confirmed',
      price: 85000,
      broker: 'Alex Thompson',
      createdAt: '2024-03-15T10:30:00Z',
      updatedAt: '2024-03-16T14:20:00Z',
      notes: 'Client prefers morning departure',
      attachments: ['passenger_list.pdf', 'special_requests.docx']
    },
    {
      id: 'FR002',
      clientId: '2',
      route: 'CDG → DXB',
      aircraft: 'Challenger 350',
      passengers: 6,
      date: '2024-03-25',
      status: 'quoted',
      price: 45000,
      broker: 'Sarah Wilson',
      createdAt: '2024-03-18T09:15:00Z',
      updatedAt: '2024-03-18T16:45:00Z',
      notes: 'Waiting for client confirmation',
      attachments: ['quote_details.pdf']
    },
    {
      id: 'FR003',
      clientId: '3',
      route: 'NRT → LAX',
      aircraft: 'Phenom 300',
      passengers: 4,
      date: '2024-03-22',
      status: 'pending',
      price: 0,
      broker: 'Mike Davis',
      createdAt: '2024-03-19T11:00:00Z',
      updatedAt: '2024-03-19T11:00:00Z',
      notes: 'New request, awaiting quotes',
      attachments: []
    }
  ];

  const quotes: Quote[] = [
    {
      id: 'Q001',
      requestId: 'FR002',
      operator: 'Elite Aviation',
      aircraft: 'Challenger 350',
      price: 45000,
      validity: '2024-03-25',
      status: 'active',
      createdAt: '2024-03-18T14:30:00Z',
      features: ['WiFi', 'Catering', 'Ground Transport'],
      terms: 'Standard terms apply'
    },
    {
      id: 'Q002',
      requestId: 'FR002',
      operator: 'SkyBridge Aviation',
      aircraft: 'Challenger 350',
      price: 42000,
      validity: '2024-03-24',
      status: 'active',
      createdAt: '2024-03-18T15:45:00Z',
      features: ['WiFi', 'Catering'],
      terms: 'Flexible cancellation policy'
    }
  ];

  const clientActivity: ClientActivity[] = [
    {
      id: '1',
      type: 'request',
      description: 'New flight request: LHR → JFK on March 20',
      timestamp: '2024-03-15T10:30:00Z',
      status: 'success'
    },
    {
      id: '2',
      type: 'quote',
      description: 'Received 3 quotes for CDG → DXB route',
      timestamp: '2024-03-18T14:30:00Z',
      status: 'success'
    },
    {
      id: '3',
      type: 'booking',
      description: 'Confirmed booking for LHR → JFK',
      timestamp: '2024-03-16T14:20:00Z',
      status: 'success'
    },
    {
      id: '4',
      type: 'message',
      description: 'Client inquiry about empty leg opportunities',
      timestamp: '2024-03-17T09:15:00Z',
      status: 'pending'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClientData = selectedClient ? clients.find(c => c.id === selectedClient) : null;
  const clientRequests = selectedClient ? flightRequests.filter(r => r.clientId === selectedClient) : [];
  const clientQuotes = selectedClient ? quotes.filter(q => clientRequests.some(r => r.id === q.requestId)) : [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'quoted': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-500/20 text-purple-400';
      case 'Gold': return 'bg-yellow-500/20 text-yellow-400';
      case 'Silver': return 'bg-gray-500/20 text-gray-400';
      case 'Bronze': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-bright">Client Portal</h2>
          <p className="text-text/70">Comprehensive client management and relationship tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-brand hover:bg-brand-600 text-text"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-max min-w-full justify-start space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm rounded-xl p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <User className="w-4 h-4" />
            Client Overview
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <Plane className="w-4 h-4" />
            Flight Requests
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <DollarSign className="w-4 h-4" />
            Quotes & Pricing
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <History className="w-4 h-4" />
            Activity Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Client Search */}
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bright">
                <Search className="w-5 h-5 text-brand" />
                Client Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, company, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-surface-1 border-terminal-border text-text placeholder:text-text/50 focus:ring-brand/50"
                  />
                </div>
                <Button className="bg-brand hover:bg-brand-600 text-text">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Client List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                className={`card-predictive cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-brand/50 ${
                  selectedClient === client.id ? 'ring-2 ring-brand/50' : ''
                }`}
                onClick={() => setSelectedClient(client.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-bright">{client.name}</CardTitle>
                    <Badge className={`${getTierColor(client.tier)} border-transparent`}>
                      {client.tier}
                    </Badge>
                  </div>
                  <p className="text-text/70">{client.company}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-text/60" />
                      <span className="text-text/70">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-text/60" />
                      <span className="text-text/70">{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-text/60" />
                      <span className="text-text/70">{formatCurrency(client.totalSpent)} total</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Plane className="w-4 h-4 text-text/60" />
                      <span className="text-text/70">{client.totalFlights} flights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-text/70">{client.averageRating}/5.0 rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-text/60" />
                      <span className="text-text/70">Last active: {client.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Client Details */}
          {selectedClientData && (
            <Card className="card-predictive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bright">
                  <User className="w-5 h-5 text-brand" />
                  {selectedClientData.name} - Detailed Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-bright">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-text/60" />
                        <span className="text-text/70">{selectedClientData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-text/60" />
                        <span className="text-text/70">{selectedClientData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-text/60" />
                        <span className="text-text/70">Member since {formatDate(selectedClientData.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-bright">Preferences</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-text/70">Preferred Aircraft:</p>
                        <p className="text-text">{selectedClientData.preferences.aircraftTypes.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text/70">Common Routes:</p>
                        <p className="text-text">{selectedClientData.preferences.routes.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text/70">Budget Range:</p>
                        <p className="text-text">
                          {formatCurrency(selectedClientData.preferences.budget.min)} - {formatCurrency(selectedClientData.preferences.budget.max)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-text/70">Communication:</p>
                        <p className="text-text capitalize">{selectedClientData.preferences.communication}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bright">
                <Plane className="w-5 h-5 text-brand" />
                Flight Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flightRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-surface-2 rounded-lg border border-terminal-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-bright">{request.route}</h4>
                        <p className="text-sm text-text/70">{request.aircraft} • {request.passengers} passengers</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(request.status)} border-transparent`}>
                          {request.status}
                        </Badge>
                        {request.price > 0 && (
                          <span className="text-lg font-bold text-brand">{formatCurrency(request.price)}</span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-text/60" />
                        <span className="text-text/70">Date: {formatDate(request.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-text/60" />
                        <span className="text-text/70">Broker: {request.broker}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-text/60" />
                        <span className="text-text/70">Updated: {formatDate(request.updatedAt)}</span>
                      </div>
                    </div>
                    {request.notes && (
                      <div className="mt-3 p-3 bg-surface-1 rounded-lg">
                        <p className="text-sm text-text/70">
                          <strong>Notes:</strong> {request.notes}
                        </p>
                      </div>
                    )}
                    {request.attachments.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-text/70 mb-2">Attachments:</p>
                        <div className="flex gap-2">
                          {request.attachments.map((attachment, index) => (
                            <Button key={index} size="sm" variant="outline" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {attachment}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bright">
                <DollarSign className="w-5 h-5 text-brand" />
                Quotes & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="p-4 bg-surface-2 rounded-lg border border-terminal-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-bright">{quote.operator}</h4>
                        <p className="text-sm text-text/70">{quote.aircraft}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${
                          quote.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          quote.status === 'accepted' ? 'bg-blue-500/20 text-blue-400' :
                          quote.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        } border-transparent`}>
                          {quote.status}
                        </Badge>
                        <span className="text-xl font-bold text-brand">{formatCurrency(quote.price)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text/70">Valid until: {formatDate(quote.validity)}</p>
                        <p className="text-text/70">Created: {formatDate(quote.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-text/70">Features: {quote.features.join(', ')}</p>
                        <p className="text-text/70">Terms: {quote.terms}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="bg-brand hover:bg-brand-600 text-text">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bright">
                <History className="w-5 h-5 text-brand" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-surface-2 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'request' ? 'bg-blue-500/20' :
                      activity.type === 'quote' ? 'bg-green-500/20' :
                      activity.type === 'booking' ? 'bg-purple-500/20' :
                      activity.type === 'message' ? 'bg-yellow-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      {activity.type === 'request' && <Plane className="w-4 h-4 text-blue-400" />}
                      {activity.type === 'quote' && <DollarSign className="w-4 h-4 text-green-400" />}
                      {activity.type === 'booking' && <CheckCircle className="w-4 h-4 text-purple-400" />}
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-yellow-400" />}
                      {activity.type === 'call' && <Phone className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-text">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text/60">{formatDate(activity.timestamp)}</span>
                        <Badge className={`${
                          activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        } border-transparent text-xs`}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
