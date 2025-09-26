import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Send, Edit, Eye, Clock, Users, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow, format } from 'date-fns';
import { RFQWorkflow, RFQData } from '@/lib/real-workflows/rfq-workflow';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState<RFQData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load RFQs from real workflow with fallback to mock data
  useEffect(() => {
    const loadRFQs = async () => {
      if (!user?.id) {
        // Load mock data if no user
        loadMockRFQs();
        return;
      }
      
      try {
        setLoading(true);
        const data = await RFQWorkflow.getBrokerRFQs(user.id);
        setRfqs(data);
      } catch (error) {
        console.error('Error loading RFQs from real workflow, falling back to mock data:', error);
        // Fallback to mock data if real workflow fails
        loadMockRFQs();
      } finally {
        setLoading(false);
      }
    };

    const loadMockRFQs = () => {
      const mockRFQs: RFQData[] = [
        {
          id: '1',
          broker_id: user?.id || 'demo-broker',
          status: 'quoting',
          legs: [
            {
              origin: 'KJFK',
              destination: 'KLAX',
              departure_date: '2024-12-15',
              departure_time: '14:00',
              arrival_date: '2024-12-15',
              arrival_time: '17:30',
              airport_codes: {
                origin: 'KJFK',
                destination: 'KLAX'
              }
            }
          ],
          pax_count: 8,
          special_requirements: 'Corporate trip for executive team',
          budget_range: {
            min: 50000,
            max: 75000
          },
          preferred_aircraft_types: ['Gulfstream G650', 'Bombardier Global 6000'],
          urgency: 'medium',
          client_info: {
            name: 'John Smith',
            company: 'Acme Corp',
            email: 'john@acme.com',
            phone: '+1-555-0123'
          },
          notes: 'Corporate trip for executive team',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          quote_count: 3,
        },
        {
          id: '2',
          broker_id: user?.id || 'demo-broker',
          status: 'booked',
          legs: [
            {
              origin: 'KMIA',
              destination: 'MYNN',
              departure_date: '2024-12-10',
              departure_time: '10:00',
              arrival_date: '2024-12-10',
              arrival_time: '11:30',
              airport_codes: {
                origin: 'KMIA',
                destination: 'MYNN'
              }
            }
          ],
          pax_count: 4,
          special_requirements: 'Weekend getaway to Bahamas',
          budget_range: {
            min: 25000,
            max: 35000
          },
          preferred_aircraft_types: ['Cessna Citation X', 'Hawker 4000'],
          urgency: 'low',
          client_info: {
            name: 'Sarah Johnson',
            company: 'Luxury Travel LLC',
            email: 'sarah@luxurytravel.com',
            phone: '+1-555-0456'
          },
          notes: 'Weekend getaway to Bahamas',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          quote_count: 5,
        },
        {
          id: '3',
          broker_id: user?.id || 'demo-broker',
          status: 'draft',
          legs: [
            {
              origin: 'KORD',
              destination: 'KDFW',
              departure_date: '2024-12-20',
              departure_time: '09:00',
              arrival_date: '2024-12-20',
              arrival_time: '11:30',
              airport_codes: {
                origin: 'KORD',
                destination: 'KDFW'
              }
            }
          ],
          pax_count: 6,
          special_requirements: 'Client meeting in Dallas',
          budget_range: {
            min: 35000,
            max: 45000
          },
          preferred_aircraft_types: ['Embraer Legacy 500', 'Cessna Citation CJ4'],
          urgency: 'high',
          client_info: {
            name: 'Mike Wilson',
            company: 'Tech Solutions Inc',
            email: 'mike@techsolutions.com',
            phone: '+1-555-0789'
          },
          notes: 'Client meeting in Dallas',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          quote_count: 0,
        }
      ];
      setRfqs(mockRFQs);
    };

    loadRFQs();
  }, [user?.id]);

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

  const sendRFQ = async (rfqId: string) => {
    try {
      // Try to use real workflow first
      if (user?.id) {
        await RFQWorkflow.updateRFQStatus(rfqId, 'sent');
        // Refresh RFQs from real workflow
        const data = await RFQWorkflow.getBrokerRFQs(user.id);
        setRfqs(data);
      } else {
        // Fallback to local state update
        setRfqs(prev => 
          prev.map(rfq => 
            rfq.id === rfqId 
              ? { ...rfq, status: 'sent' as const, updated_at: new Date().toISOString() }
              : rfq
          )
        );
      }
    } catch (error) {
      console.error('Error sending RFQ:', error);
      // Fallback to local state update
      setRfqs(prev => 
        prev.map(rfq => 
          rfq.id === rfqId 
            ? { ...rfq, status: 'sent' as const, updated_at: new Date().toISOString() }
            : rfq
        )
      );
    }
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
