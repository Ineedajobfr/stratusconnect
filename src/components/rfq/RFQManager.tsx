import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Send, Edit, Eye, Clock, Users, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow, format } from 'date-fns';

interface RFQ {
  id: string;
  status: 'draft' | 'sent' | 'quoting' | 'decision' | 'booked' | 'flown' | 'reconciled';
  legs: Array<{
    origin: string;
    destination: string;
    departure_date: string;
    departure_time: string;
    arrival_date: string;
    arrival_time: string;
  }>;
  pax_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  quote_count?: number;
}

const statusColors = {
  draft: 'text-gray-400',
  sent: 'text-blue-400',
  quoting: 'text-yellow-400',
  decision: 'text-orange-400',
  booked: 'text-green-400',
  flown: 'text-emerald-400',
  reconciled: 'text-purple-400',
};

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent',
  quoting: 'Quoting',
  decision: 'Decision',
  booked: 'Booked',
  flown: 'Flown',
  reconciled: 'Reconciled',
};

export const RFQManager: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockRFQs: RFQ[] = [
      {
        id: '1',
        status: 'quoting',
        legs: [
          {
            origin: 'KJFK',
            destination: 'KLAX',
            departure_date: '2024-12-15',
            departure_time: '14:00',
            arrival_date: '2024-12-15',
            arrival_time: '17:30',
          }
        ],
        pax_count: 8,
        notes: 'Corporate trip for executive team',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        quote_count: 3,
      },
      {
        id: '2',
        status: 'booked',
        legs: [
          {
            origin: 'KMIA',
            destination: 'MYNN',
            departure_date: '2024-12-10',
            departure_time: '10:00',
            arrival_date: '2024-12-10',
            arrival_time: '11:30',
          }
        ],
        pax_count: 4,
        notes: 'Weekend getaway to Bahamas',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        quote_count: 5,
      },
      {
        id: '3',
        status: 'draft',
        legs: [
          {
            origin: 'KORD',
            destination: 'KDFW',
            departure_date: '2024-12-20',
            departure_time: '09:00',
            arrival_date: '2024-12-20',
            arrival_time: '11:30',
          }
        ],
        pax_count: 6,
        notes: 'Client meeting in Dallas',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    ];

    setRfqs(mockRFQs);
  }, []);

  const getFilteredRFQs = () => {
    let filtered = rfqs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(rfq => 
        rfq.legs.some(leg => 
          leg.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leg.destination.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        rfq.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rfq => rfq.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  };

  const sendRFQ = (rfqId: string) => {
    setRfqs(prev => 
      prev.map(rfq => 
        rfq.id === rfqId 
          ? { ...rfq, status: 'sent' as const, updated_at: new Date().toISOString() }
          : rfq
      )
    );
  };

  const filteredRFQs = getFilteredRFQs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Trip Requests</h2>
          <p className="text-gray-400">Manage your client charter requests</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by route, notes, or client..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="quoting">Quoting</SelectItem>
            <SelectItem value="decision">Decision</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="flown">Flown</SelectItem>
            <SelectItem value="reconciled">Reconciled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredRFQs.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No trip requests found</h3>
              <p className="text-gray-500">Create your first trip request to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRFQs.map((rfq) => (
            <Card key={rfq.id} className="border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`${statusColors[rfq.status]}`}
                    >
                      {statusLabels[rfq.status]}
                    </Badge>
                    {rfq.quote_count && rfq.quote_count > 0 && (
                      <Badge variant="secondary" className="bg-orange-600/20 text-orange-400">
                        {rfq.quote_count} quotes
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {rfq.status === 'draft' && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {rfq.status === 'draft' && (
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => sendRFQ(rfq.id)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {rfq.legs.map((leg, index) => (
                    <div key={index} className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{leg.origin}</span>
                      </div>
                      <div className="flex-1 h-px bg-gray-700"></div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{leg.destination}</span>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(rfq.legs[0].departure_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{rfq.pax_count} passengers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Updated {formatDistanceToNow(new Date(rfq.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {rfq.notes && (
                    <p className="text-sm text-gray-400 mt-3 p-3 bg-gray-800/50 rounded">
                      {rfq.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
