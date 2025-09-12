// ============================================================================
// src/components/Marketplace/FiltersDrawer.tsx
// ============================================================================

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Checkbox 
} from '@/components/ui/checkbox';
import { 
  Filter, 
  X,
  RotateCcw
} from 'lucide-react';
import { Currency } from '@/lib/marketplace';

interface Filters {
  route: string;
  minSeats: string;
  maxPrice: string;
  currency: Currency;
  verifiedOnly: boolean;
  emptyLegsOnly: boolean;
  sortBy: 'dealScore' | 'price' | 'date';
  // New competitive filters
  safetyRating: string;
  wyvernStatus: string;
  instantQuoteOnly: boolean;
  autoMatchOnly: boolean;
  maxResponseTime: string;
  minCompletionRate: string;
}

interface FiltersDrawerProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FiltersDrawer({ 
  filters, 
  onFiltersChange, 
  onClear, 
  isOpen, 
  onClose 
}: FiltersDrawerProps) {
  if (!isOpen) return null;

  const updateFilter = (key: keyof Filters, value: Record<string, unknown>) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Advanced Filters
            </CardTitle>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Route Filter */}
          <div>
            <Label htmlFor="route">Route</Label>
            <Input
              id="route"
              placeholder="e.g., London - New York or LHR-JFK"
              value={filters.route}
              onChange={(e) => updateFilter('route', e.target.value)}
            />
          </div>

          {/* Seats and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minSeats">Minimum Seats</Label>
              <Input
                id="minSeats"
                type="number"
                placeholder="4"
                value={filters.minSeats}
                onChange={(e) => updateFilter('minSeats', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Maximum Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="5000000"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Currency */}
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={filters.currency} 
              onValueChange={(value) => updateFilter('currency', value as Currency)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Safety Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="safetyRating">ARGUS Safety Rating</Label>
              <Select 
                value={filters.safetyRating} 
                onValueChange={(value) => updateFilter('safetyRating', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any rating</SelectItem>
                  <SelectItem value="ARGUS Platinum">ARGUS Platinum</SelectItem>
                  <SelectItem value="ARGUS Gold">ARGUS Gold</SelectItem>
                  <SelectItem value="ARGUS Silver">ARGUS Silver</SelectItem>
                  <SelectItem value="Not Rated">Not Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="wyvernStatus">WYVERN Status</Label>
              <Select 
                value={filters.wyvernStatus} 
                onValueChange={(value) => updateFilter('wyvernStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  <SelectItem value="WYVERN Elite">WYVERN Elite</SelectItem>
                  <SelectItem value="WYVERN Certified">WYVERN Certified</SelectItem>
                  <SelectItem value="Not Certified">Not Certified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Performance Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxResponseTime">Max Response Time (minutes)</Label>
              <Input
                id="maxResponseTime"
                type="number"
                placeholder="e.g., 10"
                value={filters.maxResponseTime}
                onChange={(e) => updateFilter('maxResponseTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="minCompletionRate">Min Completion Rate (%)</Label>
              <Input
                id="minCompletionRate"
                type="number"
                placeholder="e.g., 95"
                value={filters.minCompletionRate}
                onChange={(e) => updateFilter('minCompletionRate', e.target.value)}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verifiedOnly"
                checked={filters.verifiedOnly}
                onCheckedChange={(checked) => updateFilter('verifiedOnly', !!checked)}
              />
              <Label htmlFor="verifiedOnly">Verified Operators Only</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emptyLegsOnly"
                checked={filters.emptyLegsOnly}
                onCheckedChange={(checked) => updateFilter('emptyLegsOnly', !!checked)}
              />
              <Label htmlFor="emptyLegsOnly">Empty Legs Only</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="instantQuoteOnly"
                checked={filters.instantQuoteOnly}
                onCheckedChange={(checked) => updateFilter('instantQuoteOnly', !!checked)}
              />
              <Label htmlFor="instantQuoteOnly">Instant Quotes Only</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoMatchOnly"
                checked={filters.autoMatchOnly}
                onCheckedChange={(checked) => updateFilter('autoMatchOnly', !!checked)}
              />
              <Label htmlFor="autoMatchOnly">Auto-Match Enabled Only</Label>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => updateFilter('sortBy', value as string)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dealScore">Deal Score (Best First)</SelectItem>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="date">Date (Earliest First)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={onClear}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 btn-terminal-accent"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
