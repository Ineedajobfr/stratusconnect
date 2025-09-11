// Operator Capacity Calendar with Instant Quotes
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Plane, 
  Clock, 
  DollarSign, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export interface CapacitySlot {
  id: string;
  date: string;
  time: string;
  aircraft: string;
  base: string;
  range: number; // nautical miles
  seats: number;
  status: 'available' | 'booked' | 'maintenance';
  instantQuoteEnabled: boolean;
  basePricePerNm: number;
  currency: string;
}

export interface InstantQuote {
  id: string;
  route: string;
  distance: number;
  price: number;
  currency: string;
  aircraft: string;
  seats: number;
  generatedAt: string;
  validUntil: string;
}

export function OperatorCapacityCalendar() {
  const [capacitySlots, setCapacitySlots] = useState<CapacitySlot[]>([
    {
      id: 'SLOT_001',
      date: '2024-01-20',
      time: '14:00',
      aircraft: 'Gulfstream G650',
      base: 'LHR',
      range: 7500,
      seats: 8,
      status: 'available',
      instantQuoteEnabled: true,
      basePricePerNm: 25,
      currency: 'USD'
    },
    {
      id: 'SLOT_002',
      date: '2024-01-21',
      time: '09:00',
      aircraft: 'Citation X',
      base: 'CDG',
      range: 3500,
      seats: 6,
      status: 'available',
      instantQuoteEnabled: true,
      basePricePerNm: 18,
      currency: 'EUR'
    },
    {
      id: 'SLOT_003',
      date: '2024-01-22',
      time: '16:00',
      aircraft: 'Global 6000',
      base: 'JFK',
      range: 6000,
      seats: 12,
      status: 'booked',
      instantQuoteEnabled: false,
      basePricePerNm: 22,
      currency: 'USD'
    }
  ]);

  const [instantQuotes, setInstantQuotes] = useState<InstantQuote[]>([]);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    aircraft: '',
    base: '',
    range: 0,
    seats: 0,
    basePricePerNm: 0,
    currency: 'USD'
  });

  const addCapacitySlot = () => {
    if (!newSlot.date || !newSlot.aircraft || !newSlot.base) {
      alert('Please fill in all required fields');
      return;
    }

    const slot: CapacitySlot = {
      id: `SLOT_${Date.now()}`,
      date: newSlot.date,
      time: newSlot.time,
      aircraft: newSlot.aircraft,
      base: newSlot.base,
      range: newSlot.range,
      seats: newSlot.seats,
      status: 'available',
      instantQuoteEnabled: true,
      basePricePerNm: newSlot.basePricePerNm,
      currency: newSlot.currency
    };

    setCapacitySlots(prev => [...prev, slot]);
    setNewSlot({
      date: '',
      time: '',
      aircraft: '',
      base: '',
      range: 0,
      seats: 0,
      basePricePerNm: 0,
      currency: 'USD'
    });
    setShowAddSlot(false);
  };

  const generateInstantQuote = (slot: CapacitySlot, destination: string) => {
    // Simulate route calculation
    const distance = Math.floor(Math.random() * 2000) + 500; // 500-2500 nm
    const price = Math.round(distance * slot.basePricePerNm);
    
    const quote: InstantQuote = {
      id: `QUOTE_${Date.now()}`,
      route: `${slot.base}-${destination}`,
      distance,
      price,
      currency: slot.currency,
      aircraft: slot.aircraft,
      seats: slot.seats,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
    };

    setInstantQuotes(prev => [...prev, quote]);
    alert(`Instant quote generated!\n\nRoute: ${quote.route}\nDistance: ${quote.distance} nm\nPrice: ${quote.currency} ${quote.price.toLocaleString()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'booked':
        return <Clock className="w-4 h-4" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Capacity Calendar
            </CardTitle>
            <Button onClick={() => setShowAddSlot(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Capacity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Upload your fleet availability to generate instant quotes for common routes
          </p>
        </CardContent>
      </Card>

      {/* Add Capacity Slot Form */}
      {showAddSlot && (
        <Card className="terminal-card border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Add Capacity Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newSlot.time}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="aircraft">Aircraft</Label>
                <Input
                  id="aircraft"
                  value={newSlot.aircraft}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, aircraft: e.target.value }))}
                  placeholder="e.g., Gulfstream G650"
                />
              </div>
              <div>
                <Label htmlFor="base">Base</Label>
                <Input
                  id="base"
                  value={newSlot.base}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, base: e.target.value }))}
                  placeholder="e.g., LHR"
                />
              </div>
              <div>
                <Label htmlFor="range">Range (nm)</Label>
                <Input
                  id="range"
                  type="number"
                  value={newSlot.range}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, range: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="seats">Seats</Label>
                <Input
                  id="seats"
                  type="number"
                  value={newSlot.seats}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, seats: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price per NM</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={newSlot.basePricePerNm}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, basePricePerNm: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={newSlot.currency}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={addCapacitySlot}>
                Add Capacity
              </Button>
              <Button onClick={() => setShowAddSlot(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capacity Slots */}
      <div className="space-y-4">
        {capacitySlots.map(slot => (
          <Card key={slot.id} className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{slot.aircraft}</h3>
                    <Badge className={getStatusColor(slot.status)}>
                      {getStatusIcon(slot.status)}
                      <span className="ml-1">{slot.status}</span>
                    </Badge>
                    {slot.instantQuoteEnabled && (
                      <Badge className="bg-green-100 text-green-800">
                        <Zap className="w-3 h-3 mr-1" />
                        Instant Quotes
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {slot.date} at {slot.time} • Base: {slot.base}
                  </p>
                  <p className="text-sm text-gray-600">
                    Range: {slot.range.toLocaleString()} nm • Seats: {slot.seats}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Base Price</p>
                  <p className="font-medium">{slot.currency} {slot.basePricePerNm}/nm</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{slot.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{slot.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Base</p>
                  <p className="font-medium">{slot.base}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Range</p>
                  <p className="font-medium">{slot.range.toLocaleString()} nm</p>
                </div>
              </div>
              
              {slot.status === 'available' && slot.instantQuoteEnabled && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => generateInstantQuote(slot, 'NYC')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Quote: NYC
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => generateInstantQuote(slot, 'LAX')}
                    variant="outline"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Quote: LAX
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => generateInstantQuote(slot, 'DXB')}
                    variant="outline"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Quote: DXB
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instant Quotes */}
      {instantQuotes.length > 0 && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Generated Instant Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {instantQuotes.map(quote => (
                <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{quote.route}</p>
                    <p className="text-sm text-gray-600">
                      {quote.aircraft} • {quote.seats} seats • {quote.distance} nm
                    </p>
                    <p className="text-sm text-gray-500">
                      Generated: {new Date(quote.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {quote.currency} {quote.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Valid until: {new Date(quote.validUntil).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
