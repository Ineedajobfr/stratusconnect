/**
 * WHITE-LABEL BOOKING WIDGET
 * Embeddable widget for operator websites
 * Fully customizable branding
 * 
 * Usage:
 * <script src="https://stratusconnect.com/widget.js"></script>
 * <div data-sc-widget="booking" data-operator="123"></div>
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plane, Search } from 'lucide-react';
import React, { useState } from 'react';

interface WidgetConfig {
  operatorId: string;
  brandColor?: string;
  logoUrl?: string;
  darkMode?: boolean;
}

export const BookingWidget: React.FC<WidgetConfig> = ({
  operatorId,
  brandColor = '#FFD700',
  logoUrl,
  darkMode = true,
}) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState<any[]>([]);

  const searchFlights = async () => {
    // Search available flights for operator
    setResults([
      {
        id: '1',
        from: from || 'New York',
        to: to || 'Miami',
        aircraft: 'Citation X',
        price: 24500,
        available: true,
      },
    ]);
  };

  const theme = {
    bg: darkMode ? '#0a0a0c' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    border: darkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    accent: brandColor,
  };

  return (
    <div
      className="rounded-lg p-6 shadow-2xl font-sans"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        maxWidth: '600px',
      }}
    >
      {/* Logo */}
      {logoUrl && (
        <img src={logoUrl} alt="Operator Logo" className="h-12 mb-4" />
      )}

      {/* Search Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs opacity-60 mb-1 block">FROM</label>
            <Input
              placeholder="Airport or City"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
          </div>
          <div>
            <label className="text-xs opacity-60 mb-1 block">TO</label>
            <Input
              placeholder="Airport or City"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs opacity-60 mb-1 block">DATE</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-xs opacity-60 mb-1 block">PASSENGERS</label>
            <Input
              type="number"
              min={1}
              max={20}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
            />
          </div>
        </div>

        <Button
          onClick={searchFlights}
          className="w-full font-semibold"
          style={{ backgroundColor: theme.accent, color: '#000' }}
        >
          <Search className="w-4 h-4 mr-2" />
          Search Available Flights
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="text-sm opacity-60">Available Flights</div>
          {results.map((flight) => (
            <div
              key={flight.id}
              className="p-4 rounded border"
              style={{ borderColor: theme.border, backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  <span className="font-semibold">{flight.aircraft}</span>
                </div>
                <Badge style={{ backgroundColor: theme.accent, color: '#000' }}>
                  AVAILABLE
                </Badge>
              </div>
              <div className="text-sm opacity-80 mb-3">
                {flight.from} → {flight.to}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold" style={{ color: theme.accent }}>
                  ${flight.price.toLocaleString()}
                </div>
                <Button size="sm" style={{ backgroundColor: theme.accent, color: '#000' }}>
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t opacity-40 text-xs text-center" style={{ borderColor: theme.border }}>
        Powered by StratusConnect
      </div>
    </div>
  );
};

