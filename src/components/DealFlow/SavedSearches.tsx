// Saved Searches with Price-Drop and Last-Minute Alerts
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Zap, 
  TrendingDown,
  Clock,
  MapPin,
  Users,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export interface SavedSearch {
  id: string;
  name: string;
  from: string;
  to: string;
  dateFrom: string;
  dateTo: string;
  passengers: number;
  budgetMax: number;
  currency: string;
  aircraftTypes: string[];
  verifiedOnly: boolean;
  emptyLegsOnly: boolean;
  priceDropAlert: boolean;
  lastMinuteAlert: boolean;
  alertThreshold: number; // percentage drop
  lastMinuteHours: number; // hours before departure
  active: boolean;
  createdAt: string;
  lastAlert: string | null;
  matchCount: number;
}

export interface SearchAlert {
  id: string;
  searchId: string;
  type: 'price_drop' | 'last_minute' | 'new_match';
  title: string;
  message: string;
  listingId: string;
  price: number;
  currency: string;
  savings: number;
  createdAt: string;
  read: boolean;
}

export function SavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [alerts, setAlerts] = useState<SearchAlert[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);

  useEffect(() => {
    loadSearches();
    loadAlerts();
  }, []);

  const loadSearches = () => {
    // Mock data - in production would load from API
    const mockSearches: SavedSearch[] = [
      {
        id: 'SS_001',
        name: 'LHR to JFK Business',
        from: 'LHR',
        to: 'JFK',
        dateFrom: '2024-01-20',
        dateTo: '2024-01-25',
        passengers: 8,
        budgetMax: 500000, // £5,000
        currency: 'GBP',
        aircraftTypes: ['Gulfstream G650', 'Global 6000'],
        verifiedOnly: true,
        emptyLegsOnly: false,
        priceDropAlert: true,
        lastMinuteAlert: true,
        alertThreshold: 15, // 15% drop
        lastMinuteHours: 24, // 24 hours
        active: true,
        createdAt: '2024-01-15T10:00:00Z',
        lastAlert: '2024-01-16T14:30:00Z',
        matchCount: 12
      },
      {
        id: 'SS_002',
        name: 'Empty Legs Europe',
        from: 'CDG',
        to: 'LHR',
        dateFrom: '2024-01-20',
        dateTo: '2024-01-30',
        passengers: 4,
        budgetMax: 200000, // £2,000
        currency: 'GBP',
        aircraftTypes: ['Citation X', 'Phenom 300'],
        verifiedOnly: false,
        emptyLegsOnly: true,
        priceDropAlert: true,
        lastMinuteAlert: true,
        alertThreshold: 20, // 20% drop
        lastMinuteHours: 12, // 12 hours
        active: true,
        createdAt: '2024-01-10T08:00:00Z',
        lastAlert: null,
        matchCount: 3
      }
    ];
    setSearches(mockSearches);
  };

  const loadAlerts = () => {
    // Mock alerts - in production would load from API
    const mockAlerts: SearchAlert[] = [
      {
        id: 'ALERT_001',
        searchId: 'SS_001',
        type: 'price_drop',
        title: 'Price Drop Alert: LHR to JFK',
        message: 'Gulfstream G650 dropped 18% to £4,100',
        listingId: 'LIST_001',
        price: 410000,
        currency: 'GBP',
        savings: 90000,
        createdAt: '2024-01-16T14:30:00Z',
        read: false
      },
      {
        id: 'ALERT_002',
        searchId: 'SS_002',
        type: 'last_minute',
        title: 'Last Minute: CDG to LHR',
        message: 'Citation X available in 8 hours for £1,800',
        listingId: 'LIST_002',
        price: 180000,
        currency: 'GBP',
        savings: 20000,
        createdAt: '2024-01-16T16:45:00Z',
        read: false
      }
    ];
    setAlerts(mockAlerts);
  };

  const createSearch = (searchData: Omit<SavedSearch, 'id' | 'createdAt' | 'lastAlert' | 'matchCount'>) => {
    const newSearch: SavedSearch = {
      ...searchData,
      id: `SS_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastAlert: null,
      matchCount: 0
    };
    setSearches(prev => [...prev, newSearch]);
    setShowCreateForm(false);
  };

  const updateSearch = (id: string, updates: Partial<SavedSearch>) => {
    setSearches(prev => prev.map(search => 
      search.id === id ? { ...search, ...updates } : search
    ));
  };

  const deleteSearch = (id: string) => {
    setSearches(prev => prev.filter(search => search.id !== id));
  };

  const markAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'last_minute':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'new_match':
        return <Zap className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'price_drop':
        return 'bg-green-100 text-green-800';
      case 'last_minute':
        return 'bg-orange-100 text-orange-800';
      case 'new_match':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Active Alerts ({alerts.filter(a => !a.read).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge className={getAlertBadgeColor(alert.type)}>
                            {alert.type.replace('_', ' ')}
                          </Badge>
                          {!alert.read && (
                            <Badge variant="outline" className="text-blue-600">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Price: £{(alert.price / 100).toLocaleString()}</span>
                          <span>Savings: £{(alert.savings / 100).toLocaleString()}</span>
                          <span>{new Date(alert.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      {!alert.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAlertRead(alert.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Searches */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Saved Searches ({searches.length})
            </CardTitle>
            <Button onClick={() => setShowCreateForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {searches.map(search => (
              <Card key={search.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{search.name}</h3>
                      <Badge variant="outline" className={
                        search.active ? 'text-green-600' : 'text-gray-600'
                      }>
                        {search.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="secondary">
                        {search.matchCount} matches
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{search.from} → {search.to}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{search.passengers} pax</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span>Max £{(search.budgetMax / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{search.dateFrom} to {search.dateTo}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {search.verifiedOnly && (
                        <Badge variant="outline" className="text-blue-600">
                          Verified Only
                        </Badge>
                      )}
                      {search.emptyLegsOnly && (
                        <Badge variant="outline" className="text-purple-600">
                          Empty Legs Only
                        </Badge>
                      )}
                      {search.priceDropAlert && (
                        <Badge variant="outline" className="text-green-600">
                          Price Drop Alert ({search.alertThreshold}%)
                        </Badge>
                      )}
                      {search.lastMinuteAlert && (
                        <Badge variant="outline" className="text-orange-600">
                          Last Minute Alert ({search.lastMinuteHours}h)
                        </Badge>
                      )}
                    </div>
                    
                    {search.lastAlert && (
                      <p className="text-sm text-gray-500">
                        Last alert: {new Date(search.lastAlert).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSearch(search)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSearch(search.id, { active: !search.active })}
                    >
                      {search.active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSearch(search.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {(showCreateForm || editingSearch) && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle>
              {editingSearch ? 'Edit Search' : 'Create New Search'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchForm
              search={editingSearch}
              onSubmit={editingSearch ? 
                (data) => {
                  updateSearch(editingSearch.id, data);
                  setEditingSearch(null);
                } : 
                createSearch
              }
              onCancel={() => {
                setShowCreateForm(false);
                setEditingSearch(null);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface SearchFormProps {
  search?: SavedSearch | null;
  onSubmit: (data: Omit<SavedSearch, 'id' | 'createdAt' | 'lastAlert' | 'matchCount'>) => void;
  onCancel: () => void;
}

function SearchForm({ search, onSubmit, onCancel }: SearchFormProps) {
  const [formData, setFormData] = useState({
    name: search?.name || '',
    from: search?.from || '',
    to: search?.to || '',
    dateFrom: search?.dateFrom || '',
    dateTo: search?.dateTo || '',
    passengers: search?.passengers || 1,
    budgetMax: search?.budgetMax || 0,
    currency: search?.currency || 'GBP',
    aircraftTypes: search?.aircraftTypes || [],
    verifiedOnly: search?.verifiedOnly || false,
    emptyLegsOnly: search?.emptyLegsOnly || false,
    priceDropAlert: search?.priceDropAlert || false,
    lastMinuteAlert: search?.lastMinuteAlert || false,
    alertThreshold: search?.alertThreshold || 15,
    lastMinuteHours: search?.lastMinuteHours || 24,
    active: search?.active || true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Search Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., LHR to JFK Business"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="from">From (IATA)</Label>
          <Input
            id="from"
            value={formData.from}
            onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value.toUpperCase() }))}
            placeholder="LHR"
            maxLength={3}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="to">To (IATA)</Label>
          <Input
            id="to"
            value={formData.to}
            onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value.toUpperCase() }))}
            placeholder="JFK"
            maxLength={3}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dateFrom">Date From</Label>
          <Input
            id="dateFrom"
            type="date"
            value={formData.dateFrom}
            onChange={(e) => setFormData(prev => ({ ...prev, dateFrom: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dateTo">Date To</Label>
          <Input
            id="dateTo"
            type="date"
            value={formData.dateTo}
            onChange={(e) => setFormData(prev => ({ ...prev, dateTo: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="passengers">Passengers</Label>
          <Input
            id="passengers"
            type="number"
            min="1"
            max="20"
            value={formData.passengers}
            onChange={(e) => setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) || 1 }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="budgetMax">Max Budget</Label>
          <Input
            id="budgetMax"
            type="number"
            min="0"
            value={formData.budgetMax}
            onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: parseInt(e.target.value) || 0 }))}
            placeholder="500000"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold">Filters</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="verifiedOnly"
            checked={formData.verifiedOnly}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verifiedOnly: checked }))}
          />
          <Label htmlFor="verifiedOnly">Verified operators only</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="emptyLegsOnly"
            checked={formData.emptyLegsOnly}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emptyLegsOnly: checked }))}
          />
          <Label htmlFor="emptyLegsOnly">Empty legs only</Label>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold">Alerts</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="priceDropAlert"
            checked={formData.priceDropAlert}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, priceDropAlert: checked }))}
          />
          <Label htmlFor="priceDropAlert">Price drop alerts</Label>
        </div>
        
        {formData.priceDropAlert && (
          <div>
            <Label htmlFor="alertThreshold">Alert threshold (%)</Label>
            <Input
              id="alertThreshold"
              type="number"
              min="5"
              max="50"
              value={formData.alertThreshold}
              onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) || 15 }))}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Switch
            id="lastMinuteAlert"
            checked={formData.lastMinuteAlert}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, lastMinuteAlert: checked }))}
          />
          <Label htmlFor="lastMinuteAlert">Last minute alerts</Label>
        </div>
        
        {formData.lastMinuteAlert && (
          <div>
            <Label htmlFor="lastMinuteHours">Last minute threshold (hours)</Label>
            <Input
              id="lastMinuteHours"
              type="number"
              min="1"
              max="72"
              value={formData.lastMinuteHours}
              onChange={(e) => setFormData(prev => ({ ...prev, lastMinuteHours: parseInt(e.target.value) || 24 }))}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {search ? 'Update Search' : 'Create Search'}
        </Button>
      </div>
    </form>
  );
}
