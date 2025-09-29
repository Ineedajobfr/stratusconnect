import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, MapPin, Calendar, Users, DollarSign, Plane, Clock } from 'lucide-react';

interface SearchFilters {
  aircraftType: string[];
  origin: string;
  destination: string;
  dateRange: {
    start: string;
    end: string;
  };
  passengers: number;
  budget: {
    min: number;
    max: number;
  };
  operator: string[];
  amenities: string[];
  availability: 'immediate' | 'flexible' | 'any';
}

interface SearchResult {
  id: string;
  operator: string;
  aircraft: string;
  origin: string;
  destination: string;
  price: number;
  availability: string;
  passengers: number;
  range: number;
  amenities: string[];
  rating: number;
  image: string;
}

interface AdvancedSearchProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  onResults: (results: SearchResult[]) => void;
}

export default function AdvancedSearch({ terminalType, onResults }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    aircraftType: [],
    origin: '',
    destination: '',
    dateRange: {
      start: '',
      end: ''
    },
    passengers: 8,
    budget: {
      min: 0,
      max: 100000
    },
    operator: [],
    amenities: [],
    availability: 'any'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const aircraftTypes = [
    'Gulfstream G550',
    'Gulfstream G650',
    'Falcon 7X',
    'Falcon 8X',
    'Citation X',
    'Citation X+',
    'Global 6000',
    'Global 7500',
    'Challenger 350',
    'Challenger 650',
    'Legacy 500',
    'Legacy 650'
  ];

  const operators = [
    'SkyWest Executive',
    'Albion Air',
    'Blue Meridian',
    'Elite Aviation',
    'Premier Jets',
    'Luxury Air',
    'Executive Flights',
    'Private Wings'
  ];

  const amenities = [
    'WiFi',
    'Satellite Phone',
    'Entertainment System',
    'Conference Table',
    'Lavatory',
    'Galley',
    'Crew Rest',
    'Medical Equipment',
    'Pet Friendly',
    'Smoking Allowed'
  ];

  const airports = [
    'EGLL', 'KJFK', 'KLAX', 'LFPG', 'EDDF', 'LSGG', 'LIRF', 'LEMD',
    'KORD', 'KDFW', 'KIAH', 'KATL', 'KMIA', 'KSEA', 'KPHX', 'KDEN'
  ];

  const mockResults: SearchResult[] = [
    {
      id: '1',
      operator: 'SkyWest Executive',
      aircraft: 'Gulfstream G550',
      origin: 'EGLL',
      destination: 'KJFK',
      price: 45000,
      availability: '2024-01-15',
      passengers: 12,
      range: 6750,
      amenities: ['WiFi', 'Entertainment System', 'Conference Table'],
      rating: 4.8,
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      operator: 'Albion Air',
      aircraft: 'Falcon 7X',
      origin: 'EGLL',
      destination: 'KJFK',
      price: 38000,
      availability: '2024-01-16',
      passengers: 8,
      range: 5950,
      amenities: ['WiFi', 'Satellite Phone', 'Lavatory'],
      rating: 4.6,
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      operator: 'Blue Meridian',
      aircraft: 'Citation X',
      origin: 'EGLL',
      destination: 'KJFK',
      price: 32000,
      availability: '2024-01-17',
      passengers: 6,
      range: 3500,
      amenities: ['WiFi', 'Entertainment System'],
      rating: 4.4,
      image: '/api/placeholder/300/200'
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const filteredResults = mockResults.filter(result => {
        if (filters.aircraftType.length > 0 && !filters.aircraftType.includes(result.aircraft)) {
          return false;
        }
        if (filters.origin && result.origin !== filters.origin) {
          return false;
        }
        if (filters.destination && result.destination !== filters.destination) {
          return false;
        }
        if (result.price < filters.budget.min || result.price > filters.budget.max) {
          return false;
        }
        if (filters.operator.length > 0 && !filters.operator.includes(result.operator)) {
          return false;
        }
        return true;
      });
      setResults(filteredResults);
      onResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'aircraftType' | 'operator' | 'amenities', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      aircraftType: [],
      origin: '',
      destination: '',
      dateRange: { start: '', end: '' },
      passengers: 8,
      budget: { min: 0, max: 100000 },
      operator: [],
      amenities: [],
      availability: 'any'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Advanced Search</CardTitle>
              <p className="text-gray-400">Find the perfect aircraft for your needs</p>
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="From (ICAO)"
                value={filters.origin}
                onChange={(e) => updateFilter('origin', e.target.value.toUpperCase())}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="To (ICAO)"
                value={filters.destination}
                onChange={(e) => updateFilter('destination', e.target.value.toUpperCase())}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Aircraft Type */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">Aircraft Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {aircraftTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.aircraftType.includes(type)}
                      onCheckedChange={() => toggleArrayFilter('aircraftType', type)}
                    />
                    <label htmlFor={type} className="text-sm text-gray-300">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Passengers & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Passengers: {filters.passengers}
                </label>
                <Slider
                  value={[filters.passengers]}
                  onValueChange={(value) => updateFilter('passengers', value[0])}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  Budget: ${filters.budget.min.toLocaleString()} - ${filters.budget.max.toLocaleString()}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.budget.min}
                    onChange={(e) => updateFilter('budget', { ...filters.budget, min: parseInt(e.target.value) || 0 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.budget.max}
                    onChange={(e) => updateFilter('budget', { ...filters.budget, max: parseInt(e.target.value) || 100000 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Operators */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">Operators</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {operators.map((operator) => (
                  <div key={operator} className="flex items-center space-x-2">
                    <Checkbox
                      id={operator}
                      checked={filters.operator.includes(operator)}
                      onCheckedChange={() => toggleArrayFilter('operator', operator)}
                    />
                    <label htmlFor={operator} className="text-sm text-gray-300">{operator}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => toggleArrayFilter('amenities', amenity)}
                    />
                    <label htmlFor={amenity} className="text-sm text-gray-300">{amenity}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-3 block">Availability</label>
              <Select value={filters.availability} onValueChange={(value: any) => updateFilter('availability', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Time</SelectItem>
                  <SelectItem value="immediate">Immediate (Today)</SelectItem>
                  <SelectItem value="flexible">Flexible (Within 7 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Clear All Filters
              </Button>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search with Filters'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {results.length} Results Found
            </h3>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            {results.map((result) => (
              <Card key={result.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-white">{result.aircraft}</h4>
                        <Badge className="bg-green-500 text-white">{result.operator}</Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-white font-medium">{result.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">{result.origin} → {result.destination}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{result.passengers} passengers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300">{result.range} nm range</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-400" />
                          <span className="text-gray-300">Available: {result.availability}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-gray-300 border-gray-600">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-white mb-2">
                        ${result.price.toLocaleString()}
                      </div>
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
