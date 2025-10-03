// Fleet Management System - CRUD for aircraft inventory
// Includes maintenance tracking and availability calendar

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    AlertCircle,
    CheckCircle,
    Edit,
    Eye,
    MapPin,
    Plane,
    Plus,
    Trash2
} from 'lucide-react';
import { useState } from 'react';

export interface Aircraft {
  id: string;
  tailNumber: string;
  model: string;
  category: 'light_jet' | 'midsize_jet' | 'heavy_jet' | 'turboprop' | 'helicopter';
  seats: number;
  rangeNm: number;
  year: number;
  hourlyRate: number;
  homeBase: string;
  status: 'available' | 'in_use' | 'maintenance' | 'grounded';
  nextMaintenance: string;
  photoUrl?: string;
  specifications?: {
    cruiseSpeed: number;
    maxAltitude: number;
    baggageCapacity: number;
  };
}

export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  type: 'scheduled' | 'unscheduled' | 'inspection';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  status: 'pending' | 'in_progress' | 'completed';
  mechanic?: string;
  notes?: string;
}

interface FleetManagementProps {
  operatorId: string;
  onAircraftUpdate?: (aircraft: Aircraft) => void;
}

export function FleetManagement({ operatorId, onAircraftUpdate }: FleetManagementProps) {
  const [aircraft, setAircraft] = useState<Aircraft[]>([
    {
      id: '1',
      tailNumber: 'N123SC',
      model: 'Gulfstream G550',
      category: 'heavy_jet',
      seats: 14,
      rangeNm: 6750,
      year: 2018,
      hourlyRate: 8500,
      homeBase: 'KJFK',
      status: 'available',
      nextMaintenance: '2025-11-15',
      specifications: {
        cruiseSpeed: 488,
        maxAltitude: 51000,
        baggageCapacity: 226
      }
    },
    {
      id: '2',
      tailNumber: 'N456AV',
      model: 'Citation X+',
      category: 'midsize_jet',
      seats: 12,
      rangeNm: 3460,
      year: 2020,
      hourlyRate: 5800,
      homeBase: 'KBOS',
      status: 'in_use',
      nextMaintenance: '2025-10-30',
      specifications: {
        cruiseSpeed: 527,
        maxAltitude: 51000,
        baggageCapacity: 90
      }
    }
  ]);

  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  // New aircraft form state
  const [newAircraft, setNewAircraft] = useState<Partial<Aircraft>>({
    tailNumber: '',
    model: '',
    category: 'midsize_jet',
    seats: 8,
    rangeNm: 3000,
    year: new Date().getFullYear(),
    hourlyRate: 5000,
    homeBase: '',
    status: 'available',
    nextMaintenance: '',
  });

  const handleAddAircraft = () => {
    if (newAircraft.tailNumber && newAircraft.model) {
      const aircraft: Aircraft = {
        id: Date.now().toString(),
        tailNumber: newAircraft.tailNumber,
        model: newAircraft.model,
        category: newAircraft.category || 'midsize_jet',
        seats: newAircraft.seats || 8,
        rangeNm: newAircraft.rangeNm || 3000,
        year: newAircraft.year || new Date().getFullYear(),
        hourlyRate: newAircraft.hourlyRate || 5000,
        homeBase: newAircraft.homeBase || '',
        status: newAircraft.status || 'available',
        nextMaintenance: newAircraft.nextMaintenance || '',
      };

      setAircraft(prev => [...prev, aircraft]);
      setIsAdding(false);
      setNewAircraft({
        tailNumber: '',
        model: '',
        category: 'midsize_jet',
        seats: 8,
        rangeNm: 3000,
        year: new Date().getFullYear(),
        hourlyRate: 5000,
        homeBase: '',
        status: 'available',
        nextMaintenance: '',
      });

      if (onAircraftUpdate) {
        onAircraftUpdate(aircraft);
      }
    }
  };

  const handleDeleteAircraft = (id: string) => {
    if (confirm('Are you sure you want to remove this aircraft from your fleet?')) {
      setAircraft(prev => prev.filter(a => a.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>;
      case 'in_use':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Use</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Maintenance</Badge>;
      case 'grounded':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Grounded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'light_jet':
        return 'Light Jet';
      case 'midsize_jet':
        return 'Midsize Jet';
      case 'heavy_jet':
        return 'Heavy Jet';
      case 'turboprop':
        return 'Turboprop';
      case 'helicopter':
        return 'Helicopter';
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-terminal-card/50 border-terminal-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Plane className="w-5 h-5 text-accent" />
              Fleet Management ({aircraft.length} Aircraft)
            </CardTitle>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-accent hover:bg-accent/80 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Aircraft
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Add Aircraft Form */}
      {isAdding && (
        <Card className="bg-terminal-card/50 border-accent/50">
          <CardHeader>
            <CardTitle className="text-foreground">Add New Aircraft</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Tail Number *</Label>
                <Input
                  value={newAircraft.tailNumber}
                  onChange={(e) => setNewAircraft(prev => ({ ...prev, tailNumber: e.target.value }))}
                  placeholder="N123SC"
                  className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-foreground">Model *</Label>
                <Input
                  value={newAircraft.model}
                  onChange={(e) => setNewAircraft(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="Gulfstream G550"
                  className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-foreground">Category</Label>
                <Select 
                  value={newAircraft.category} 
                  onValueChange={(value: any) => setNewAircraft(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-2 bg-terminal-bg border-terminal-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-terminal-card border-terminal-border">
                    <SelectItem value="light_jet">Light Jet</SelectItem>
                    <SelectItem value="midsize_jet">Midsize Jet</SelectItem>
                    <SelectItem value="heavy_jet">Heavy Jet</SelectItem>
                    <SelectItem value="turboprop">Turboprop</SelectItem>
                    <SelectItem value="helicopter">Helicopter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">Seats</Label>
                <Input
                  type="number"
                  value={newAircraft.seats}
                  onChange={(e) => setNewAircraft(prev => ({ ...prev, seats: Number(e.target.value) }))}
                  className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-foreground">Range (nm)</Label>
                <Input
                  type="number"
                  value={newAircraft.rangeNm}
                  onChange={(e) => setNewAircraft(prev => ({ ...prev, rangeNm: Number(e.target.value) }))}
                  className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-foreground">Year</Label>
                <Input
                  type="number"
                  value={newAircraft.year}
                  onChange={(e) => setNewAircraft(prev => ({ ...prev, year: Number(e.target.value) }))}
                  className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-foreground">Hourly Rate ($)</Label>
                <Input
                  type="number"
                  value={newAircraft.hourlyRate}
                  onChange={(e) => setNewAircraft(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                  className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-foreground">Home Base (ICAO)</Label>
                <Input
                  value={newAircraft.homeBase}
                  onChange={(e) => setNewAircraft(prev => ({ ...prev, homeBase: e.target.value }))}
                  placeholder="KJFK"
                  className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div>
                <Label className="text-foreground">Next Maintenance</Label>
                <Input
                  type="date"
                  value={newAircraft.nextMaintenance}
                  onChange={(e) => setNewAircraft(prev => ({ ...prev, nextMaintenance: e.target.value }))}
                  className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-terminal-border">
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="flex-1 border-terminal-border text-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAircraft}
                disabled={!newAircraft.tailNumber || !newAircraft.model}
                className="flex-1 bg-accent hover:bg-accent/80 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Add Aircraft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aircraft.map((ac) => (
          <Card key={ac.id} className="bg-terminal-card/50 border-terminal-border hover:border-accent/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">{ac.model}</CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">{ac.tailNumber}</div>
                </div>
                {getStatusBadge(ac.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Aircraft Image Placeholder */}
              <div className="w-full h-48 bg-terminal-bg/50 rounded-lg flex items-center justify-center border border-terminal-border">
                {ac.photoUrl ? (
                  <img src={ac.photoUrl} alt={ac.model} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No photo available</p>
                  </div>
                )}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-terminal-bg/30 rounded text-center">
                  <div className="text-xs text-muted-foreground">Category</div>
                  <div className="text-sm font-semibold text-foreground">{getCategoryLabel(ac.category)}</div>
                </div>
                <div className="p-2 bg-terminal-bg/30 rounded text-center">
                  <div className="text-xs text-muted-foreground">Seats</div>
                  <div className="text-sm font-semibold text-foreground">{ac.seats}</div>
                </div>
                <div className="p-2 bg-terminal-bg/30 rounded text-center">
                  <div className="text-xs text-muted-foreground">Range</div>
                  <div className="text-sm font-semibold text-foreground">{ac.rangeNm} nm</div>
                </div>
                <div className="p-2 bg-terminal-bg/30 rounded text-center">
                  <div className="text-xs text-muted-foreground">Year</div>
                  <div className="text-sm font-semibold text-foreground">{ac.year}</div>
                </div>
              </div>

              {/* Pricing & Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-terminal-bg/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Hourly Rate</span>
                  <span className="font-semibold text-accent">${ac.hourlyRate.toLocaleString()}/hr</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-terminal-bg/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Home Base</span>
                  </div>
                  <span className="font-semibold text-foreground">{ac.homeBase}</span>
                </div>
              </div>

              {/* Maintenance Alert */}
              {new Date(ac.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Maintenance due: {new Date(ac.nextMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-terminal-border">
                <Button variant="outline" size="sm" className="border-terminal-border text-foreground">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="border-terminal-border text-foreground">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDeleteAircraft(ac.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {aircraft.length === 0 && !isAdding && (
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="text-center py-12">
            <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Aircraft in Fleet</h3>
            <p className="text-muted-foreground mb-4">Add your first aircraft to start accepting charter requests</p>
            <Button onClick={() => setIsAdding(true)} className="bg-accent hover:bg-accent/80 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Aircraft
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Fleet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{aircraft.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Aircraft</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {aircraft.filter(a => a.status === 'available').length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Available Now</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {aircraft.filter(a => a.status === 'in_use').length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">In Operation</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {aircraft.filter(a => a.status === 'maintenance').length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Maintenance</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






