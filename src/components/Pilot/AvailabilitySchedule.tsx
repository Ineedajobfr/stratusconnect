import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plane, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  aircraftTypes: string[];
  regions: string[];
  shortNotice: boolean;
  dayRate: number;
  status: 'available' | 'booked' | 'blocked';
}

interface PilotAvailability {
  id: string;
  pilotId: string;
  slots: AvailabilitySlot[];
  preferences: {
    maxFlightHours: number;
    minRestHours: number;
    preferredRegions: string[];
    shortNoticeAvailable: boolean;
    dayRateRange: { min: number; max: number };
  };
}

export default function AvailabilitySchedule({ terminalType }: { terminalType: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<AvailabilitySlot>>({
    startTime: '08:00',
    endTime: '18:00',
    aircraftTypes: [],
    regions: [],
    shortNotice: false,
    dayRate: 800
  });

  const [availability, setAvailability] = useState<PilotAvailability>({
    id: 'avail-001',
    pilotId: 'pilot-001',
    slots: [
      {
        id: 'slot-001',
        date: '2025-09-20',
        startTime: '08:00',
        endTime: '18:00',
        aircraftTypes: ['Gulfstream G650', 'Bombardier Global 7500'],
        regions: ['Europe', 'North America'],
        shortNotice: true,
        dayRate: 1200,
        status: 'available'
      },
      {
        id: 'slot-002',
        date: '2025-09-21',
        startTime: '10:00',
        endTime: '20:00',
        aircraftTypes: ['Cessna Citation XLS+'],
        regions: ['Europe'],
        shortNotice: false,
        dayRate: 800,
        status: 'booked'
      },
      {
        id: 'slot-003',
        date: '2025-09-22',
        startTime: '06:00',
        endTime: '16:00',
        aircraftTypes: ['Gulfstream G650', 'Bombardier Global 7500', 'Cessna Citation XLS+'],
        regions: ['Europe', 'Middle East', 'Asia'],
        shortNotice: true,
        dayRate: 1500,
        status: 'available'
      }
    ],
    preferences: {
      maxFlightHours: 8,
      minRestHours: 12,
      preferredRegions: ['Europe', 'North America', 'Middle East'],
      shortNoticeAvailable: true,
      dayRateRange: { min: 800, max: 2000 }
    }
  });

  const aircraftTypes = [
    'Gulfstream G650',
    'Gulfstream G700',
    'Bombardier Global 7500',
    'Bombardier Global 8000',
    'Cessna Citation XLS+',
    'Cessna Citation CJ4',
    'Dassault Falcon 8X',
    'Dassault Falcon 6X',
    'Embraer Legacy 650E',
    'Pilatus PC-24'
  ];

  const regions = [
    'Europe',
    'North America',
    'South America',
    'Asia',
    'Middle East',
    'Africa',
    'Oceania'
  ];

  const addAvailabilitySlot = () => {
    if (!selectedDate || !newSlot.startTime || !newSlot.endTime) return;

    const slot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      date: selectedDate.toISOString().split('T')[0],
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      aircraftTypes: newSlot.aircraftTypes || [],
      regions: newSlot.regions || [],
      shortNotice: newSlot.shortNotice || false,
      dayRate: newSlot.dayRate || 800,
      status: 'available'
    };

    setAvailability(prev => ({
      ...prev,
      slots: [...prev.slots, slot]
    }));

    setNewSlot({
      startTime: '08:00',
      endTime: '18:00',
      aircraftTypes: [],
      regions: [],
      shortNotice: false,
      dayRate: 800
    });
    setIsEditing(false);
  };

  const toggleAircraftType = (type: string) => {
    setNewSlot(prev => ({
      ...prev,
      aircraftTypes: prev.aircraftTypes?.includes(type)
        ? prev.aircraftTypes.filter(t => t !== type)
        : [...(prev.aircraftTypes || []), type]
    }));
  };

  const toggleRegion = (region: string) => {
    setNewSlot(prev => ({
      ...prev,
      regions: prev.regions?.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...(prev.regions || []), region]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'booked': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'blocked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'booked': return <Clock className="w-4 h-4" />;
      case 'blocked': return <X className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-accent" />
            Availability & Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available Days:</span>
                  <span className="text-sm font-medium">{availability.slots.filter(s => s.status === 'available').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Booked Days:</span>
                  <span className="text-sm font-medium">{availability.slots.filter(s => s.status === 'booked').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Day Rate:</span>
                  <span className="text-sm font-medium">£{Math.round(availability.slots.reduce((acc, slot) => acc + slot.dayRate, 0) / availability.slots.length)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Preferences</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Max Flight Hours:</span>
                  <span className="text-sm font-medium">{availability.preferences.maxFlightHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Min Rest Hours:</span>
                  <span className="text-sm font-medium">{availability.preferences.minRestHours}h</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Short Notice:</span>
                  <Switch 
                    checked={availability.preferences.shortNoticeAvailable}
                    onCheckedChange={(checked) => setAvailability(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, shortNoticeAvailable: checked }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Day Rate Range</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Minimum:</span>
                  <span className="text-sm font-medium">£{availability.preferences.dayRateRange.min}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Maximum:</span>
                  <span className="text-sm font-medium">£{availability.preferences.dayRateRange.max}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar and Add Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-accent" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                Add Availability
              </CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                size="sm"
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Add Slot'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Start Time</label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-terminal-input-bg border border-terminal-input-border rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">End Time</label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-terminal-input-bg border border-terminal-input-border rounded-md text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Day Rate (£)</label>
                  <input
                    type="number"
                    value={newSlot.dayRate}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, dayRate: parseInt(e.target.value) || 0 }))}
                    className="w-full mt-1 px-3 py-2 bg-terminal-input-bg border border-terminal-input-border rounded-md text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={newSlot.shortNotice}
                    onCheckedChange={(checked) => setNewSlot(prev => ({ ...prev, shortNotice: checked }))}
                  />
                  <span className="text-sm text-foreground">Available for short notice</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Aircraft Types</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {aircraftTypes.map(type => (
                      <label key={type} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newSlot.aircraftTypes?.includes(type) || false}
                          onChange={() => toggleAircraftType(type)}
                          className="rounded"
                        />
                        <span className="text-xs">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Regions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {regions.map(region => (
                      <label key={region} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newSlot.regions?.includes(region) || false}
                          onChange={() => toggleRegion(region)}
                          className="rounded"
                        />
                        <span className="text-xs">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={addAvailabilitySlot} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Click "Add Slot" to set your availability</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Availability Slots List */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Your Availability Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availability.slots.map(slot => (
              <div key={slot.id} className="p-4 border rounded-lg hover:bg-terminal-card/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(slot.status)}
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {new Date(slot.date).toLocaleDateString()} • {slot.startTime} - {slot.endTime}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        £{slot.dayRate} per day
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(slot.status)}>
                    {slot.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Aircraft Types</h4>
                    <div className="flex flex-wrap gap-1">
                      {slot.aircraftTypes.map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          <Plane className="w-3 h-3 mr-1" />
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Regions</h4>
                    <div className="flex flex-wrap gap-1">
                      {slot.regions.map(region => (
                        <Badge key={region} variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {slot.shortNotice && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-accent">
                    <AlertTriangle className="w-4 h-4" />
                    Available for short notice
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
