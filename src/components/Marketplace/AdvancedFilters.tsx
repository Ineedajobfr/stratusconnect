// Advanced Filters - Comprehensive filtering sidebar for marketplace search
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { type AdvancedSearchFilters, type AircraftCategory, type AircraftModel } from "@/lib/marketplace-service";
import { Filter, RotateCcw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AirportLookup } from "./AirportLookup";

interface AdvancedFiltersProps {
  filters: AdvancedSearchFilters;
  onChange: (filters: AdvancedSearchFilters) => void;
  aircraftModels?: AircraftModel[];
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
  showListingType?: boolean;
}

const CATEGORIES: { value: AircraftCategory; label: string }[] = [
  { value: 'heavy', label: 'Heavy Jets' },
  { value: 'medium', label: 'Medium Jets' },
  { value: 'light', label: 'Light Jets' },
  { value: 'turboprop', label: 'Turboprops' },
  { value: 'helicopter', label: 'Helicopters' }
];

const ARGUS_RATINGS = [
  { value: 'platinum', label: 'ARGUS Platinum' },
  { value: 'gold', label: 'ARGUS Gold' },
  { value: 'silver', label: 'ARGUS Silver' }
];

const WYVERN_STATUS = [
  { value: 'elite', label: 'WYVERN Elite' },
  { value: 'certified', label: 'WYVERN Certified' }
];

export function AdvancedFilters({
  filters,
  onChange,
  aircraftModels = [],
  onSearch,
  onReset,
  loading = false,
  showListingType = true
}: AdvancedFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.min_price || 0,
    filters.max_price || 1000000
  ]);

  const [selectedCategories, setSelectedCategories] = useState<AircraftCategory[]>(
    Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : []
  );

  const [selectedArgus, setSelectedArgus] = useState<string[]>(filters.argus_rating || []);
  const [selectedWyvern, setSelectedWyvern] = useState<string[]>(filters.wyvern_status || []);

  useEffect(() => {
    setPriceRange([filters.min_price || 0, filters.max_price || 1000000]);
  }, [filters.min_price, filters.max_price]);

  const handleCategoryToggle = (category: AircraftCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onChange({ ...filters, category: newCategories.length > 0 ? newCategories : undefined });
  };

  const handleArgusToggle = (rating: string) => {
    const newArgus = selectedArgus.includes(rating)
      ? selectedArgus.filter(r => r !== rating)
      : [...selectedArgus, rating];
    
    setSelectedArgus(newArgus);
    onChange({ ...filters, argus_rating: newArgus.length > 0 ? newArgus as any : undefined });
  };

  const handleWyvernToggle = (status: string) => {
    const newWyvern = selectedWyvern.includes(status)
      ? selectedWyvern.filter(s => s !== status)
      : [...selectedWyvern, status];
    
    setSelectedWyvern(newWyvern);
    onChange({ ...filters, wyvern_status: newWyvern.length > 0 ? newWyvern as any : undefined });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const applyPriceFilter = () => {
    onChange({
      ...filters,
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 1000000 ? priceRange[1] : undefined
    });
  };

  return (
    <Card className="terminal-card sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Filter className="w-5 h-5 text-accent" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Listing Type */}
        {showListingType && (
          <div className="space-y-3">
            <Label className="text-white">Listing Type</Label>
            <Select
              value={filters.listing_type || 'all'}
              onValueChange={(value) => onChange({ ...filters, listing_type: value as any })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">All Types</SelectItem>
                <SelectItem value="charter" className="text-white">Charter</SelectItem>
                <SelectItem value="empty_leg" className="text-white">Empty Leg</SelectItem>
                <SelectItem value="sale" className="text-white">For Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Aircraft Category */}
        <div className="space-y-3">
          <Label className="text-white">Aircraft Category</Label>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${cat.value}`}
                  checked={selectedCategories.includes(cat.value)}
                  onCheckedChange={() => handleCategoryToggle(cat.value)}
                  className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <label
                  htmlFor={`cat-${cat.value}`}
                  className="text-sm font-medium text-slate-300 cursor-pointer"
                >
                  {cat.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Aircraft Model */}
        {aircraftModels.length > 0 && (
          <div className="space-y-3">
            <Label className="text-white">Specific Model</Label>
            <Select
              value={filters.aircraft_model_id || 'any'}
              onValueChange={(value) => onChange({ 
                ...filters, 
                aircraft_model_id: value === 'any' ? undefined : value 
              })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Any model" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                <SelectItem value="any" className="text-white">Any Model</SelectItem>
                {aircraftModels.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="text-white">
                    {model.manufacturer} {model.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Airports */}
        <div className="space-y-3">
          <AirportLookup
            value={filters.departure_airport || ""}
            onChange={(value) => onChange({ ...filters, departure_airport: value || undefined })}
            label="Departure Airport"
            placeholder="Any airport"
          />
        </div>

        <div className="space-y-3">
          <AirportLookup
            value={filters.destination_airport || ""}
            onChange={(value) => onChange({ ...filters, destination_airport: value || undefined })}
            label="Destination Airport"
            placeholder="Any airport"
          />
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-white">Departure Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={filters.dep_date_from || ''}
              onChange={(e) => onChange({ ...filters, dep_date_from: e.target.value || undefined })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="From"
            />
            <Input
              type="date"
              value={filters.dep_date_to || ''}
              onChange={(e) => onChange({ ...filters, dep_date_to: e.target.value || undefined })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="To"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="space-y-3">
          <Label className="text-white">Minimum Passengers</Label>
          <Input
            type="number"
            value={filters.min_pax || ''}
            onChange={(e) => onChange({ ...filters, min_pax: e.target.value ? parseInt(e.target.value) : undefined })}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Any"
            min="1"
          />
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-white">
            Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={applyPriceFilter}
            max={1000000}
            step={5000}
            className="py-4"
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setPriceRange([val, priceRange[1]]);
              }}
              onBlur={applyPriceFilter}
              className="bg-slate-700 border-slate-600 text-white text-sm"
              placeholder="Min"
            />
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1000000;
                setPriceRange([priceRange[0], val]);
              }}
              onBlur={applyPriceFilter}
              className="bg-slate-700 border-slate-600 text-white text-sm"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Discount (for empty legs) */}
        {filters.listing_type === 'empty_leg' && (
          <div className="space-y-3">
            <Label className="text-white">Minimum Discount %</Label>
            <Input
              type="number"
              value={filters.min_discount || ''}
              onChange={(e) => onChange({ ...filters, min_discount: e.target.value ? parseInt(e.target.value) : undefined })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Any discount"
              min="0"
              max="100"
            />
          </div>
        )}

        {/* Safety Ratings */}
        <div className="space-y-3">
          <Label className="text-white">Safety Certifications</Label>
          
          <div className="space-y-2">
            <div className="text-xs text-slate-400 font-semibold">ARGUS Rating</div>
            {ARGUS_RATINGS.map((rating) => (
              <div key={rating.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`argus-${rating.value}`}
                  checked={selectedArgus.includes(rating.value)}
                  onCheckedChange={() => handleArgusToggle(rating.value)}
                  className="border-slate-600 data-[state=checked]:bg-orange-500"
                />
                <label
                  htmlFor={`argus-${rating.value}`}
                  className="text-sm font-medium text-slate-300 cursor-pointer"
                >
                  {rating.label}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-2 mt-3">
            <div className="text-xs text-slate-400 font-semibold">WYVERN Status</div>
            {WYVERN_STATUS.map((status) => (
              <div key={status.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`wyvern-${status.value}`}
                  checked={selectedWyvern.includes(status.value)}
                  onCheckedChange={() => handleWyvernToggle(status.value)}
                  className="border-slate-600 data-[state=checked]:bg-orange-500"
                />
                <label
                  htmlFor={`wyvern-${status.value}`}
                  className="text-sm font-medium text-slate-300 cursor-pointer"
                >
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Score */}
        <div className="space-y-3">
          <Label className="text-white">Minimum Trust Score</Label>
          <Input
            type="number"
            value={filters.min_trust_score || ''}
            onChange={(e) => onChange({ ...filters, min_trust_score: e.target.value ? parseInt(e.target.value) : undefined })}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Any score"
            min="0"
            max="100"
          />
        </div>

        {/* Verified Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified-only"
            checked={filters.verified_only || false}
            onCheckedChange={(checked) => onChange({ ...filters, verified_only: checked as boolean })}
            className="border-slate-600 data-[state=checked]:bg-orange-500"
          />
          <label
            htmlFor="verified-only"
            className="text-sm font-medium text-slate-300 cursor-pointer"
          >
            Verified Operators Only
          </label>
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <Label className="text-white">Sort By</Label>
          <Select
            value={filters.sort_by || 'date'}
            onValueChange={(value) => onChange({ ...filters, sort_by: value as any })}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="date" className="text-white">Latest First</SelectItem>
              <SelectItem value="price_asc" className="text-white">Price: Low to High</SelectItem>
              <SelectItem value="price_desc" className="text-white">Price: High to Low</SelectItem>
              <SelectItem value="trust_score" className="text-white">Trust Score</SelectItem>
              <SelectItem value="response_time" className="text-white">Response Time</SelectItem>
              <SelectItem value="discount" className="text-white">Best Discount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-600">
          <Button
            onClick={onSearch}
            disabled={loading}
            className="w-full btn-terminal-accent"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Searching...' : 'Apply Filters'}
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

