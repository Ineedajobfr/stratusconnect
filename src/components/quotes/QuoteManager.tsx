import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, DollarSign, Plane, Users, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow, format } from 'date-fns';

interface Quote {
  id: string;
  rfq_id: string;
  operator_id: string;
  operator_name: string;
  aircraft_id: string;
  aircraft_registration: string;
  aircraft_make: string;
  aircraft_model: string;
  price_total: number;
  currency: string;
  expires_at: string;
  terms?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  ferry_time?: number;
  hourly_rate?: number;
  surcharges?: number;
  risks?: string[];
}

const statusColors = {
  pending: 'text-yellow-400',
  accepted: 'text-green-400',
  declined: 'text-red-400',
  expired: 'text-gray-400',
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
};

export const QuoteManager: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockQuotes: Quote[] = [
      {
        id: '1',
        rfq_id: 'rfq-1',
        operator_id: 'op-1',
        operator_name: 'SkyHigh Aviation',
        aircraft_id: 'ac-1',
        aircraft_registration: 'N123SH',
        aircraft_make: 'Gulfstream',
        aircraft_model: 'G650ER',
        price_total: 45000,
        currency: 'USD',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours from now
        terms: 'Standard charter terms apply. Fuel surcharge may apply.',
        status: 'pending',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        ferry_time: 2.5,
        hourly_rate: 8500,
        surcharges: 2500,
        risks: ['Short runway at destination'],
      },
      {
        id: '2',
        rfq_id: 'rfq-1',
        operator_id: 'op-2',
        operator_name: 'Elite Air Charter',
        aircraft_id: 'ac-2',
        aircraft_registration: 'N456EA',
        aircraft_make: 'Bombardier',
        aircraft_model: 'Global 7500',
        price_total: 52000,
        currency: 'USD',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // 12 hours from now
        terms: 'Premium service with concierge support included.',
        status: 'pending',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        ferry_time: 3.0,
        hourly_rate: 9000,
        surcharges: 3000,
        risks: [],
      },
      {
        id: '3',
        rfq_id: 'rfq-2',
        operator_id: 'op-3',
        operator_name: 'Coastal Aviation',
        aircraft_id: 'ac-3',
        aircraft_registration: 'N789CA',
        aircraft_make: 'Cessna',
        aircraft_model: 'Citation X',
        price_total: 28000,
        currency: 'USD',
        expires_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago (expired)
        terms: 'Basic charter service.',
        status: 'expired',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        ferry_time: 1.5,
        hourly_rate: 6000,
        surcharges: 1000,
        risks: ['Aircraft availability uncertain'],
      },
    ];

    setQuotes(mockQuotes);
  }, []);

  const getFilteredQuotes = () => {
    let filtered = quotes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.operator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.aircraft_registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.aircraft_make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.aircraft_model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const acceptQuote = (quoteId: string) => {
    setQuotes(prev => 
      prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'accepted' as const }
          : quote
      )
    );
  };

  const declineQuote = (quoteId: string) => {
    setQuotes(prev => 
      prev.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'declined' as const }
          : quote
      )
    );
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const filteredQuotes = getFilteredQuotes();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Quote Management</h2>
          <p className="text-gray-400">Review and manage quotes from operators</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by operator, aircraft, or registration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredQuotes.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-8 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No quotes found</h3>
              <p className="text-gray-500">Quotes will appear here when operators respond to your requests.</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuotes.map((quote) => {
            const isQuoteExpired = isExpired(quote.expires_at);
            const timeLeft = getTimeUntilExpiry(quote.expires_at);
            
            return (
              <Card key={quote.id} className="border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`${statusColors[quote.status]}`}
                      >
                        {statusLabels[quote.status]}
                      </Badge>
                      {isQuoteExpired && quote.status === 'pending' && (
                        <Badge variant="destructive">
                          EXPIRED
                        </Badge>
                      )}
                      {!isQuoteExpired && quote.status === 'pending' && (
                        <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
                          {timeLeft}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        ${quote.price_total.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">{quote.currency}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">{quote.operator_name}</h3>
                        <p className="text-sm text-gray-400">
                          {quote.aircraft_make} {quote.aircraft_model} - {quote.aircraft_registration}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="text-gray-400">Hourly Rate</div>
                          <div className="font-medium">${quote.hourly_rate?.toLocaleString()}/hr</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="text-gray-400">Ferry Time</div>
                          <div className="font-medium">{quote.ferry_time}h</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="text-gray-400">Max Pax</div>
                          <div className="font-medium">8</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="text-gray-400">Surcharges</div>
                          <div className="font-medium">${quote.surcharges?.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {quote.risks && quote.risks.length > 0 && (
                      <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded">
                        <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-red-400 mb-1">Risks Identified:</div>
                          <ul className="text-xs text-red-300 space-y-1">
                            {quote.risks.map((risk, index) => (
                              <li key={index}>• {risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {quote.terms && (
                      <div className="p-3 bg-gray-800/50 rounded">
                        <div className="text-sm text-gray-400 mb-1">Terms:</div>
                        <p className="text-sm text-gray-300">{quote.terms}</p>
                      </div>
                    )}

                    {quote.status === 'pending' && !isQuoteExpired && (
                      <div className="flex gap-3 pt-4">
                        <Button 
                          className="bg-green-600 hover:bg-green-700 flex-1"
                          onClick={() => acceptQuote(quote.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Quote
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-400 hover:bg-red-900/20 flex-1"
                          onClick={() => declineQuote(quote.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
