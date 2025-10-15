// Broker Marketplace - Comprehensive marketplace for brokers
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
          marketplaceService,
          type AdvancedSearchFilters,
          type AircraftModel,
          type CreateTripRequestInput,
          type MarketplaceListing,
          type PreferredVendor,
          type SavedSearch,
          type TripRequest
} from "@/lib/marketplace-service";
import {
          Bookmark,
          Calendar,
          Heart,
          Loader2,
          MapPin,
          Plane,
          Plus,
          Save,
          Search,
          Trash2,
          TrendingUp,
          Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdvancedFilters } from "./AdvancedFilters";
import { AircraftDetailsModal } from "./AircraftDetailsModal";
import { TripTypeSelector } from "./TripTypeSelector";
import { TrustBadge } from "./TrustBadge";

interface BrokerMarketplaceProps {
  className?: string;
}

export function BrokerMarketplace({ className }: BrokerMarketplaceProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("search");
  const [loading, setLoading] = useState(false);

  // Search state
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    listing_type: 'all',
    page: 1,
    per_page: 24
  });
  const [aircraftModels, setAircraftModels] = useState<AircraftModel[]>([]);

  // Trip requests state
  const [myRequests, setMyRequests] = useState<TripRequest[]>([]);
  const [showCreateRFQ, setShowCreateRFQ] = useState(false);

  // Empty legs state
  const [emptyLegs, setEmptyLegs] = useState<MarketplaceListing[]>([]);

  // Saved searches state
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [savingSearch, setSavingSearch] = useState(false);

  // Preferred vendors state
  const [preferredVendors, setPreferredVendors] = useState<PreferredVendor[]>([]);

  // Details modal state
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadAircraftModels();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'search':
        handleSearch();
        break;
      case 'requests':
        loadMyRequests();
        break;
      case 'empty-legs':
        loadEmptyLegs();
        break;
      case 'saved-searches':
        loadSavedSearches();
        break;
      case 'preferred-vendors':
        loadPreferredVendors();
        break;
    }
  }, [activeTab]);

  const loadAircraftModels = async () => {
    try {
      const models = await marketplaceService.getAircraftModels();
      setAircraftModels(models);
    } catch (error) {
      console.error('Error loading aircraft models:', error);
    }
  };

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const result = await marketplaceService.advancedSearch({
        ...filters,
        page
      });
      setListings(result.results);
      setTotalPages(result.totalPages);
      setCurrentPage(result.page);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to search marketplace",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: AdvancedSearchFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      listing_type: 'all',
      page: 1,
      per_page: 24
    });
  };

  const loadMyRequests = async () => {
    setLoading(true);
    try {
      const requests = await marketplaceService.getMyTripRequests();
      setMyRequests(requests);
    } catch (error) {
      console.error('Load requests error:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load your trip requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTripRequest = async (tripData: CreateTripRequestInput) => {
    setLoading(true);
    try {
      await marketplaceService.createTripRequest(tripData);
      toast({
        title: "Success",
        description: "Trip request created successfully"
      });
      setShowCreateRFQ(false);
      loadMyRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create trip request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmptyLegs = async () => {
    setLoading(true);
    try {
      const result = await marketplaceService.searchEmptyLegs({
        page: 1,
        per_page: 24
      });
      setEmptyLegs(result.results);
    } catch (error) {
      console.error('Load empty legs error:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load empty legs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSearches = async () => {
    setLoading(true);
    try {
      const searches = await marketplaceService.getSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.error('Load saved searches error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSearch = async () => {
    setSavingSearch(true);
    try {
      const searchName = prompt("Enter a name for this search:");
      if (!searchName) return;

      await marketplaceService.saveSearch({
        name: searchName,
        search_type: 'aircraft',
        filters: filters as any,
        notify_on_match: false
      });

      toast({
        title: "Success",
        description: "Search saved successfully"
      });

      loadSavedSearches();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save search",
        variant: "destructive"
      });
    } finally {
      setSavingSearch(false);
    }
  };

  const handleDeleteSavedSearch = async (searchId: string) => {
    try {
      await marketplaceService.deleteSavedSearch(searchId);
      toast({
        title: "Success",
        description: "Saved search deleted"
      });
      loadSavedSearches();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete search",
        variant: "destructive"
      });
    }
  };

  const loadPreferredVendors = async () => {
    setLoading(true);
    try {
      const vendors = await marketplaceService.getPreferredVendors();
      setPreferredVendors(vendors);
    } catch (error) {
      console.error('Load preferred vendors error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setDetailsModalOpen(true);
  };

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="search" className="data-[state=active]:bg-orange-500">
            <Search className="w-4 h-4 mr-2" />
            Aircraft Search
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-blue-500">
            <Calendar className="w-4 h-4 mr-2" />
            My RFQs
          </TabsTrigger>
          <TabsTrigger value="empty-legs" className="data-[state=active]:bg-green-500">
            <TrendingUp className="w-4 h-4 mr-2" />
            Empty Legs
          </TabsTrigger>
          <TabsTrigger value="saved-searches" className="data-[state=active]:bg-purple-500">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="preferred-vendors" className="data-[state=active]:bg-pink-500">
            <Heart className="w-4 h-4 mr-2" />
            Vendors
          </TabsTrigger>
        </TabsList>

        {/* Aircraft Search Tab */}
        <TabsContent value="search" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Aircraft Directory</h2>
            <Button
              onClick={handleSaveSearch}
              disabled={savingSearch}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Search
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <AdvancedFilters
                filters={filters}
                onChange={handleFilterChange}
                aircraftModels={aircraftModels}
                onSearch={() => handleSearch(1)}
                onReset={handleResetFilters}
                loading={loading}
                showListingType={true}
              />
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : listings.length === 0 ? (
                <Card className="terminal-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Plane className="w-16 h-16 text-slate-500 mb-4" />
                    <p className="text-slate-400 text-lg">No aircraft found</p>
                    <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {listings.map((listing) => (
                      <Card
                        key={listing.id}
                        className="terminal-card hover:border-orange-500 transition-all cursor-pointer"
                        onClick={() => handleViewDetails(listing)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base text-foreground line-clamp-2">
                              {listing.title}
                            </CardTitle>
                            {listing.discount_percent && listing.discount_percent > 0 && (
                              <Badge className="bg-orange-500 flex-shrink-0">
                                -{listing.discount_percent}%
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-xs text-slate-400">
                            {listing.operator?.company_name || listing.operator?.full_name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {listing.departure_airport && listing.destination_airport && (
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                              <span className="truncate">
                                {listing.departure_airport} → {listing.destination_airport}
                              </span>
                            </div>
                          )}

                          {listing.dep_time && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span>{new Date(listing.dep_time).toLocaleDateString()}</span>
                            </div>
                          )}

                          {listing.seats && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Users className="w-3 h-3 flex-shrink-0" />
                              <span>{listing.seats} seats</span>
                            </div>
                          )}

                          {listing.price && (
                            <div className="text-lg font-bold text-white">
                              {listing.currency} {listing.price.toLocaleString()}
                            </div>
                          )}

                          {listing.operator && (
                            <TrustBadge
                              trustScore={listing.operator_trust?.trust_score || 0}
                              verified={listing.operator_trust?.verified}
                              argusRating={listing.operator.argus_rating}
                              wyvernStatus={listing.operator.wyvern_status}
                              size="sm"
                              showDetails={false}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => handleSearch(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="border-terminal-border"
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-4 text-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => handleSearch(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="border-terminal-border"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Trip Requests Tab */}
        <TabsContent value="requests" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">My Trip Requests</h2>
            <Button
              onClick={() => setShowCreateRFQ(!showCreateRFQ)}
              className="btn-terminal-accent"
            >
              <Plus className="w-4 h-4 mr-2" />
              New RFQ
            </Button>
          </div>

          {showCreateRFQ && (
            <TripTypeSelector
              onSubmit={handleCreateTripRequest}
              onCancel={() => setShowCreateRFQ(false)}
              loading={loading}
            />
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myRequests.map((request) => (
                <Card key={request.id} className="terminal-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={`
                            ${request.urgency === 'urgent' ? 'bg-red-500' :
                              request.urgency === 'high' ? 'bg-orange-500' :
                              request.urgency === 'normal' ? 'bg-blue-500' : 'bg-gray-500'}
                          `}>
                            {request.urgency || 'normal'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {request.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {request.trip_type.replace('-', ' ')}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {request.origin} → {request.destination}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                          <div>
                            <p className="text-muted-foreground">Departure</p>
                            <p className="font-medium text-foreground">
                              {new Date(request.dep_time).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Passengers</p>
                            <p className="font-medium text-foreground">{request.pax}</p>
                          </div>
                          {request.preferred_category && (
                            <div>
                              <p className="text-muted-foreground">Category</p>
                              <p className="font-medium text-foreground capitalize">{request.preferred_category}</p>
                            </div>
                          )}
                          {request.max_budget && (
                            <div>
                              <p className="text-muted-foreground">Max Budget</p>
                              <p className="font-medium text-foreground">${request.max_budget.toLocaleString()}</p>
                            </div>
                          )}
                        </div>

                        {request.quotes && request.quotes.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-600">
                            <p className="text-sm text-slate-400 mb-2">{request.quotes.length} quote(s) received</p>
                            <div className="flex gap-2">
                              <Button size="sm" className="btn-terminal-accent">
                                View Quotes
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {myRequests.length === 0 && !showCreateRFQ && (
                <Card className="terminal-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="w-16 h-16 text-slate-500 mb-4" />
                    <p className="text-slate-400 text-lg">No trip requests yet</p>
                    <p className="text-slate-500 text-sm mb-4">Create your first RFQ to get started</p>
                    <Button onClick={() => setShowCreateRFQ(true)} className="btn-terminal-accent">
                      <Plus className="w-4 h-4 mr-2" />
                      Create RFQ
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Empty Legs Tab */}
        <TabsContent value="empty-legs" className="space-y-6 mt-6">
          <h2 className="text-2xl font-bold text-foreground">Empty Leg Opportunities</h2>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emptyLegs.map((listing) => (
                <Card
                  key={listing.id}
                  className="terminal-card hover:border-green-500 transition-all cursor-pointer"
                  onClick={() => handleViewDetails(listing)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base text-foreground line-clamp-2">
                        {listing.title}
                      </CardTitle>
                      {listing.discount_percent && (
                        <Badge className="bg-green-500 flex-shrink-0">
                          {listing.discount_percent}% OFF
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="truncate">
                        {listing.departure_airport} → {listing.destination_airport}
                      </span>
                    </div>

                    {listing.original_price && listing.price && (
                      <div>
                        <div className="text-sm text-slate-400 line-through">
                          {listing.currency} {listing.original_price.toLocaleString()}
                        </div>
                        <div className="text-xl font-bold text-green-400">
                          {listing.currency} {listing.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-400">
                          Save {listing.currency} {(listing.original_price - listing.price).toLocaleString()}
                        </div>
                      </div>
                    )}

                    {listing.operator && (
                      <TrustBadge
                        trustScore={listing.operator_trust?.trust_score || 0}
                        verified={listing.operator_trust?.verified}
                        size="sm"
                        showDetails={false}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Saved Searches Tab */}
        <TabsContent value="saved-searches" className="space-y-6 mt-6">
          <h2 className="text-2xl font-bold text-foreground">Saved Searches</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSearches.map((search) => (
              <Card key={search.id} className="terminal-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-foreground">{search.name}</CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSavedSearch(search.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-xs capitalize">
                    {search.search_type.replace('_', ' ')} search
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full btn-terminal-accent" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Run Search
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Preferred Vendors Tab */}
        <TabsContent value="preferred-vendors" className="space-y-6 mt-6">
          <h2 className="text-2xl font-bold text-foreground">Preferred Vendors</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {preferredVendors.map((vendor) => (
              <Card key={vendor.id} className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    {vendor.operator?.company_name || vendor.operator?.full_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vendor.operator && (
                    <TrustBadge
                      trustScore={85}
                      verified={true}
                      argusRating={vendor.operator.argus_rating}
                      wyvernStatus={vendor.operator.wyvern_status}
                      avgResponseTime={vendor.operator.avg_response_time_minutes}
                      completionRate={vendor.operator.completion_rate}
                      totalDeals={vendor.operator.total_deals_completed}
                      size="sm"
                      showDetails={true}
                    />
                  )}
                  {vendor.notes && (
                    <p className="text-sm text-slate-400">{vendor.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Aircraft Details Modal */}
      <AircraftDetailsModal
        listing={selectedListing}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        onRequestQuote={(id) => {
          console.log('Request quote for:', id);
          setDetailsModalOpen(false);
        }}
        onAddToFavorites={(id) => {
          console.log('Add to favorites:', id);
        }}
        onContactOperator={(id) => {
          console.log('Contact operator:', id);
        }}
        currentUserRole="broker"
      />
    </div>
  );
}

