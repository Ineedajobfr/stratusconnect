// Enhanced Demo Marketplace - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  DollarSign, 
  Shield,
  AlertTriangle,
  CheckCircle,
  GitCompare as Compare,
  Save,
  Eye
} from 'lucide-react';
import { MOCK_LISTINGS, Listing, Currency } from '@/lib/marketplace';
import FiltersDrawer from '@/components/Marketplace/FiltersDrawer';
import ListingCard from '@/components/Marketplace/ListingCard';
import CompareModal from '@/components/Marketplace/CompareModal';

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

export default function DemoMarketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [compareList, setCompareList] = useState<Listing[]>([]);
  const [savedList, setSavedList] = useState<Listing[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    route: '',
    minSeats: '',
    maxPrice: '',
    currency: 'USD',
    verifiedOnly: false,
    emptyLegsOnly: false,
    sortBy: 'dealScore',
    safetyRating: '',
    wyvernStatus: '',
    instantQuoteOnly: false,
    autoMatchOnly: false,
    maxResponseTime: '',
    minCompletionRate: ''
  });

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  // Load mock data
  useEffect(() => {
    setListings(MOCK_LISTINGS);
    setFilteredListings(MOCK_LISTINGS);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...listings];

    if (filters.route) {
      filtered = filtered.filter(listing => 
        listing.from.toLowerCase().includes(filters.route.toLowerCase()) ||
        listing.to.toLowerCase().includes(filters.route.toLowerCase()) ||
        `${listing.from}-${listing.to}`.toLowerCase().includes(filters.route.toLowerCase())
      );
    }

    if (filters.minSeats) {
      filtered = filtered.filter(listing => listing.seats >= parseInt(filters.minSeats));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(listing => listing.priceMinor <= parseInt(filters.maxPrice));
    }

    if (filters.currency) {
      filtered = filtered.filter(listing => listing.currency === filters.currency);
    }

    if (filters.verifiedOnly) {
      filtered = filtered.filter(listing => listing.operatorVerified);
    }

    if (filters.emptyLegsOnly) {
      filtered = filtered.filter(listing => listing.emptyLeg);
    }

    if (filters.safetyRating) {
      filtered = filtered.filter(listing => listing.safetyRating === filters.safetyRating);
    }

    if (filters.wyvernStatus) {
      filtered = filtered.filter(listing => listing.wyvernStatus === filters.wyvernStatus);
    }

    if (filters.instantQuoteOnly) {
      filtered = filtered.filter(listing => listing.instantQuote === true);
    }

    if (filters.autoMatchOnly) {
      filtered = filtered.filter(listing => listing.autoMatch === true);
    }

    if (filters.maxResponseTime) {
      filtered = filtered.filter(listing => 
        listing.p50Response && listing.p50Response <= parseInt(filters.maxResponseTime)
      );
    }

    if (filters.minCompletionRate) {
      filtered = filtered.filter(listing => 
        listing.completionRate && listing.completionRate >= parseInt(filters.minCompletionRate)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dealScore':
          return dealScore(b) - dealScore(a);
        case 'price':
          return a.priceMinor - b.priceMinor;
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [filters, listings]);

  const addToCompare = (listing: Listing) => {
    if (compareList.length < 3 && !compareList.find(l => l.id === listing.id)) {
      setCompareList(prev => [...prev, listing]);
    }
  };

  const removeFromCompare = (listing: Listing) => {
    setCompareList(prev => prev.filter(l => l.id !== listing.id));
  };

  const saveListing = (listing: Listing) => {
    if (!savedList.find(l => l.id === listing.id)) {
      setSavedList(prev => [...prev, listing]);
    }
  };

  const clearFilters = () => {
    setFilters({
      route: '',
      minSeats: '',
      maxPrice: '',
      currency: 'USD',
      verifiedOnly: false,
      emptyLegsOnly: false,
      sortBy: 'dealScore',
      safetyRating: '',
      wyvernStatus: '',
      instantQuoteOnly: false,
      autoMatchOnly: false,
      maxResponseTime: '',
      minCompletionRate: ''
    });
  };

  const handleBook = (listing: Listing) => {
    if (!listing.operatorVerified) {
      alert('Booking blocked: Operator must be verified before booking');
      return;
    }
    
    alert(`Booking initiated for ${listing.operator} - ${listing.aircraft}\n\nIn production, this would redirect to Stripe Connect for FCA compliant payment processing.`);
  };

  const handleView = (listing: Listing) => {
    alert(`Viewing details for ${listing.operator} - ${listing.aircraft}\n\nRoute: ${listing.from} → ${listing.to}\nDate: ${new Date(listing.date).toLocaleDateString()}\nPrice: ${listing.priceMinor / 100} ${listing.currency}`);
  };

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Marketplace</h1>
            <p className="text-gunmetal">Bloomberg-style decision tools for aviation deals</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-blue-900/50 text-blue-100 border-blue-700">
              <Shield className="w-3 h-3 mr-1" />
              FCA Compliant
            </Badge>
            {isDemoMode && (
              <Badge className="bg-blue-800/50 text-blue-100 border-blue-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Compliance Notice */}
        <Card className="mb-8 border-blue-700 bg-blue-900/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-100">Transparent Fee Structure</h3>
                <p className="text-blue-200 text-sm mt-1">
                  7% platform commission automatically deducted by Stripe Connect. No custody of client funds. 
                  All prices shown include fees. Net to operator clearly displayed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setShowFilters(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters ({filteredListings.length} results)
          </Button>
          
          {compareList.length > 0 && (
            <Button
              onClick={() => setShowCompare(true)}
              className="btn-terminal-accent flex items-center gap-2"
            >
              <Compare className="w-4 h-4" />
              Compare ({compareList.length}/3)
            </Button>
          )}
          
          {savedList.length > 0 && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Saved ({savedList.length})
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {(filters.route || filters.minSeats || filters.maxPrice || filters.verifiedOnly || filters.emptyLegsOnly || 
          filters.safetyRating || filters.wyvernStatus || filters.instantQuoteOnly || filters.autoMatchOnly || 
          filters.maxResponseTime || filters.minCompletionRate) && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gunmetal">Active filters:</span>
                {filters.route && (
                  <Badge variant="outline">Route: {filters.route}</Badge>
                )}
                {filters.minSeats && (
                  <Badge variant="outline">Min seats: {filters.minSeats}</Badge>
                )}
                {filters.maxPrice && (
                  <Badge variant="outline">Max price: {filters.maxPrice}</Badge>
                )}
                {filters.verifiedOnly && (
                  <Badge variant="outline">Verified only</Badge>
                )}
                {filters.emptyLegsOnly && (
                  <Badge variant="outline">Empty legs only</Badge>
                )}
                {filters.safetyRating && (
                  <Badge variant="outline">Safety: {filters.safetyRating}</Badge>
                )}
                {filters.wyvernStatus && (
                  <Badge variant="outline">WYVERN: {filters.wyvernStatus}</Badge>
                )}
                {filters.instantQuoteOnly && (
                  <Badge variant="outline">Instant quotes only</Badge>
                )}
                {filters.autoMatchOnly && (
                  <Badge variant="outline">Auto-match only</Badge>
                )}
                {filters.maxResponseTime && (
                  <Badge variant="outline">Max response: {filters.maxResponseTime}min</Badge>
                )}
                {filters.minCompletionRate && (
                  <Badge variant="outline">Min completion: {filters.minCompletionRate}%</Badge>
                )}
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                >
                  Clear all
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings */}
        <div className="space-y-4">
          {filteredListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onCompare={addToCompare}
              onSave={saveListing}
              onView={handleView}
              onBook={handleBook}
              canCompare={compareList.length < 3 && !compareList.find(l => l.id === listing.id)}
              canSave={!savedList.find(l => l.id === listing.id)}
              isDemoMode={isDemoMode}
            />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <Card className="terminal-card">
            <CardContent className="text-center py-12">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-accent opacity-60" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Listings Found
              </h3>
              <p className="text-gunmetal mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button
                onClick={() => setShowFilters(true)}
                className="btn-terminal-accent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Adjust Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters Drawer */}
        <FiltersDrawer
          filters={filters}
          onFiltersChange={setFilters}
          onClear={clearFilters}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />

        {/* Compare Modal */}
        <CompareModal
          listings={compareList}
          isOpen={showCompare}
          onClose={() => setShowCompare(false)}
          onRemove={removeFromCompare}
        />

        {/* Demo Notice */}
        {isDemoMode && (
          <Card className="mt-8 bg-blue-900/30 border-blue-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-100">Demo Mode</h3>
                  <p className="text-blue-200 text-sm mt-1">
                    This marketplace demonstrates advanced filtering, deal scoring, and comparison tools. 
                    In production, this would connect to real aircraft data and Stripe Connect for payments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Import dealScore function
import { dealScore } from '@/lib/marketplace';
