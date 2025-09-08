import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Plane, Clock, CheckCircle, Users, BarChart3, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { QuoteCard } from "../ui/quote-card";
import { FleetCard } from "../ui/fleet-card";
import { CrewCard } from "../ui/crew-card";
import { AnalyticsChart } from "../analytics/AnalyticsChart";
import { NotificationCenter } from "../ui/notification-center";

interface Request {
  id: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passenger_count: number;
  status: string;
  created_at: string;
  companies?: {
    name: string;
  };
}

interface Quote {
  id: string;
  request_id: string;
  price: number;
  currency: string;
  status: string;
  created_at: string;
  requests?: Request;
  aircraft?: {
    model: string;
    tail_number: string;
  };
}

interface Booking {
  id: string;
  total_price: number;
  currency: string;
  status: string;
  created_at: string;
  requests: Request;
  quotes: Quote;
  flights?: Flight[];
}

interface Flight {
  id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_datetime: string;
  arrival_datetime: string;
  status: string;
}

interface Aircraft {
  id: string;
  tail_number: string;
  model: string;
  category: string;
  seats: number;
  status: string;
  photo_url?: string;
}

interface CrewMember {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  crew_profiles?: {
    licence_expiry: string;
    availability_status: string;
  };
}

export const OperatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    myQuotes: 0,
    acceptedQuotes: 0,
    activeBookings: 0,
    fleetSize: 0,
    crewSize: 0,
    winRate: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchRequests(),
        fetchQuotes(),
        fetchBookings(),
        fetchAircraft(),
        fetchCrew(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          companies (name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          requests (*),
          aircraft (model, tail_number)
        `)
        .eq('operator_company_id', user?.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          requests (*),
          quotes (*),
          flights (*)
        `)
        .eq('operator_company_id', user?.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAircraft = async () => {
    try {
      const { data, error } = await supabase
        .from('aircraft')
        .select('*')
        .eq('operator_company_id', user?.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAircraft(data || []);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
    }
  };

  const fetchCrew = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          role,
          avatar_url,
          crew_profiles (licence_expiry, availability_status)
        `)
        .eq('company_id', user?.company_id)
        .in('role', ['pilot', 'crew'])
        .order('full_name');

      if (error) throw error;
      setCrew(data || []);
    } catch (error) {
      console.error('Error fetching crew:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [requestsResult, quotesResult, bookingsResult, aircraftResult, crewResult] = await Promise.all([
        supabase
          .from('requests')
          .select('id')
          .eq('status', 'open'),
        supabase
          .from('quotes')
          .select('id, status')
          .eq('operator_company_id', user?.company_id),
        supabase
          .from('bookings')
          .select('id, total_price, status')
          .eq('operator_company_id', user?.company_id),
        supabase
          .from('aircraft')
          .select('id')
          .eq('operator_company_id', user?.company_id),
        supabase
          .from('users')
          .select('id')
          .eq('company_id', user?.company_id)
          .in('role', ['pilot', 'crew'])
      ]);

      if (requestsResult.error) throw requestsResult.error;
      if (quotesResult.error) throw quotesResult.error;
      if (bookingsResult.error) throw bookingsResult.error;
      if (aircraftResult.error) throw aircraftResult.error;
      if (crewResult.error) throw crewResult.error;

      const totalRequests = requestsResult.data?.length || 0;
      const myQuotes = quotesResult.data?.length || 0;
      const acceptedQuotes = quotesResult.data?.filter(q => q.status === 'accepted').length || 0;
      const activeBookings = bookingsResult.data?.filter(b => b.status === 'upcoming' || b.status === 'in_progress').length || 0;
      const fleetSize = aircraftResult.data?.length || 0;
      const crewSize = crewResult.data?.length || 0;
      const winRate = myQuotes > 0 ? (acceptedQuotes / myQuotes) * 100 : 0;
      const totalRevenue = bookingsResult.data?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

      setStats({
        totalRequests,
        myQuotes,
        acceptedQuotes,
        activeBookings,
        fleetSize,
        crewSize,
        winRate,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleQuoteSubmit = async (requestId: string, quoteData: any) => {
    try {
      const { error } = await supabase.functions.invoke('submit-quote', {
        body: {
          request_id: requestId,
          ...quoteData
        }
      });

      if (error) throw error;

      // Refresh data
      fetchQuotes();
      fetchStats();
    } catch (error) {
      console.error('Error submitting quote:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'rejected':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Operator Dashboard</h1>
          <p className="text-gray-600">Manage your fleet, crew, and charter operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Aircraft
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Quotes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myQuotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-sm text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Open Requests</TabsTrigger>
          <TabsTrigger value="quotes">My Quotes</TabsTrigger>
          <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="crew">Crew</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Plane className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No open requests</h3>
                <p className="text-gray-600">New charter requests will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {request.origin} → {request.destination}
                        </CardTitle>
                        <CardDescription>
                          {new Date(request.departure_date).toLocaleDateString()}
                          {request.return_date && ` - ${new Date(request.return_date).toLocaleDateString()}`}
                          • {request.passenger_count} passengers
                          • {request.companies?.name}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleQuoteSubmit(request.id, {})}
                      className="w-full"
                    >
                      Submit Quote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          {quotes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No quotes submitted</h3>
                <p className="text-gray-600">Your submitted quotes will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <Card key={quote.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(quote.status)}
                          {quote.requests?.origin} → {quote.requests?.destination}
                        </CardTitle>
                        <CardDescription>
                          ${quote.price.toLocaleString()} {quote.currency}
                          {quote.aircraft && ` • ${quote.aircraft.model} (${quote.aircraft.tail_number})`}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active bookings</h3>
                <p className="text-gray-600">Your accepted quotes will appear here as bookings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {booking.requests.origin} → {booking.requests.destination}
                        </CardTitle>
                        <CardDescription>
                          ${booking.total_price.toLocaleString()} {booking.currency}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        Assign Crew
                      </Button>
                      <Button variant="outline" className="w-full">
                        Update Flight Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Fleet Management</h3>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Aircraft
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aircraft.map((aircraft) => (
              <FleetCard key={aircraft.id} aircraft={aircraft} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crew" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Crew Management</h3>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Crew Member
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crew.map((member) => (
              <CrewCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsChart />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};
