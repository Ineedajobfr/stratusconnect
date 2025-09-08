import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Plane, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { NewRequestForm } from "./NewRequestForm";
import { QuoteCard } from "./QuoteCard";
import { BookingTimeline } from "./BookingTimeline";
import { NotificationCenter } from "./NotificationCenter";

interface Request {
  id: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passenger_count: number;
  status: string;
  created_at: string;
  quotes?: Quote[];
}

interface Quote {
  id: string;
  price: number;
  currency: string;
  operator_company_id: string;
  status: string;
  created_at: string;
  companies?: {
    name: string;
  };
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

export const BrokerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    totalBookings: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchBookings();
      fetchStats();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          quotes (
            id,
            price,
            currency,
            status,
            created_at,
            companies (name),
            aircraft (model, tail_number)
          )
        `)
        .eq('broker_company_id', user?.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
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
        .eq('broker_company_id', user?.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [requestsResult, bookingsResult] = await Promise.all([
        supabase
          .from('requests')
          .select('id, status')
          .eq('broker_company_id', user?.company_id),
        supabase
          .from('bookings')
          .select('id, total_price, currency')
          .eq('broker_company_id', user?.company_id)
      ]);

      if (requestsResult.error) throw requestsResult.error;
      if (bookingsResult.error) throw bookingsResult.error;

      const totalRequests = requestsResult.data?.length || 0;
      const activeRequests = requestsResult.data?.filter(r => r.status === 'open').length || 0;
      const totalBookings = bookingsResult.data?.length || 0;
      const totalSpent = bookingsResult.data?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

      setStats({
        totalRequests,
        activeRequests,
        totalBookings,
        totalSpent
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCreated = () => {
    setShowNewRequestForm(false);
    fetchRequests();
    fetchStats();
  };

  const handleQuoteAccepted = async (quoteId: string, requestId: string) => {
    try {
      const { error } = await supabase.functions.invoke('accept-quote', {
        body: { quote_id: quoteId, request_id: requestId }
      });

      if (error) throw error;

      // Refresh data
      fetchRequests();
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
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
      case 'cancelled':
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
          <h1 className="text-3xl font-bold">Broker Dashboard</h1>
          <p className="text-gray-600">Manage your charter requests and bookings</p>
        </div>
        <Button onClick={() => setShowNewRequestForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <span className="text-sm text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Plane className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                <p className="text-gray-600 mb-4">Create your first charter request to get started</p>
                <Button onClick={() => setShowNewRequestForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Request
                </Button>
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
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.quotes && request.quotes.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Quotes ({request.quotes.length})</h4>
                        {request.quotes.map((quote) => (
                          <QuoteCard
                            key={quote.id}
                            quote={quote}
                            onAccept={() => handleQuoteAccepted(quote.id, request.id)}
                            canAccept={request.status === 'open'}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No quotes received yet</p>
                    )}
                  </CardContent>
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
                    {booking.flights && booking.flights.length > 0 && (
                      <BookingTimeline flights={booking.flights} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenter />
        </TabsContent>
      </Tabs>

      {/* New Request Form Modal */}
      {showNewRequestForm && (
        <NewRequestForm
          onClose={() => setShowNewRequestForm(false)}
          onSuccess={handleRequestCreated}
        />
      )}
    </div>
  );
};
