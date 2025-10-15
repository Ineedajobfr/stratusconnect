// Broker Marketplace Component
// Search listings, create RFQs, view trip requests

import { marketplaceService, type MarketplaceListing, type TripRequest } from "@/lib/marketplace-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    MapPin,
    Plane,
    Plus,
    Search,
    Shield,
    Star,
    TrendingUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

interface BrokerMarketplaceProps {
  className?: string;
}

export function BrokerMarketplace({ className }: BrokerMarketplaceProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("search");
  
  // Search state
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listingType, setListingType] = useState<string>("all");
  const [departureAirport, setDepartureAirport] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Trip Request state
  const [myRequests, setMyRequests] = useState<TripRequest[]>([]);
  const [showCreateRFQ, setShowCreateRFQ] = useState(false);
  const [newRFQ, setNewRFQ] = useState({
    origin: "",
    destination: "",
    dep_time: "",
    pax: 1,
    preferred_category: "",
    max_budget: 0
  });

  // Load data
  useEffect(() => {
    if (activeTab === "search") {
      handleSearch();
    } else if (activeTab === "requests") {
      loadMyRequests();
    }
  }, [activeTab]);

  const handleSearch = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        per_page: 12
      };

      if (searchQuery) params.q = searchQuery;
      if (listingType && listingType !== "all") params.listing_type = listingType;
      if (departureAirport) params.departure_airport = departureAirport;

      const result = await marketplaceService.searchListings(params);
      setListings(result.results);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
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

  const handleCreateRFQ = async () => {
    try {
      await marketplaceService.createTripRequest(newRFQ);
      toast({
        title: "Success",
        description: "Trip request created successfully"
      });
      setShowCreateRFQ(false);
      setNewRFQ({
        origin: "",
        destination: "",
        dep_time: "",
        pax: 1,
        preferred_category: "",
        max_budget: 0
      });
      loadMyRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create trip request",
        variant: "destructive"
      });
    }
  };

  const getTrustBadge = (trustScore: number) => {
    if (trustScore >= 80) return { color: "bg-green-500", label: "Excellent" };
    if (trustScore >= 60) return { color: "bg-blue-500", label: "Good" };
    if (trustScore >= 40) return { color: "bg-yellow-500", label: "Fair" };
    return { color: "bg-gray-500", label: "New" };
  };

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="search" className="data-[state=active]:bg-orange-500">
            <Search className="w-4 h-4 mr-2" />
            Search Marketplace
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-blue-500">
            <FileText className="w-4 h-4 mr-2" />
            My RFQs
          </TabsTrigger>
          <TabsTrigger value="empty-legs" className="data-[state=active]:bg-green-500">
            <TrendingUp className="w-4 h-4 mr-2" />
            Empty Legs
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6 mt-6">
          {/* Search Filters */}
          <Card className="terminal-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-accent" />
                Search Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Aircraft type, route..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Listing Type</Label>
                  <Select value={listingType} onValueChange={setListingType}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="charter">Charter</SelectItem>
                      <SelectItem value="empty_leg">Empty Leg</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Departure Airport</Label>
                  <Input
                    placeholder="ICAO code"
                    value={departureAirport}
                    onChange={(e) => setDepartureAirport(e.target.value.toUpperCase())}
                    className="bg-slate-700 border-slate-600 text-white"
                    maxLength={4}
                  />
                </div>

                <div className="space-y-2 flex items-end">
                  <Button
                    onClick={() => handleSearch(1)}
                    className="w-full btn-terminal-accent"
                    disabled={loading}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const trustBadge = getTrustBadge(listing.operator_trust?.trust_score || 0);
              return (
                <Card key={listing.id} className="terminal-card hover:border-orange-500 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground">{listing.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {listing.operator?.company_name || listing.operator?.full_name}
                        </p>
                      </div>
                      <Badge className={trustBadge.color}>
                        {trustBadge.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Route */}
                    {listing.departure_airport && listing.destination_airport && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="text-foreground">
                          {listing.departure_airport} → {listing.destination_airport}
                        </span>
                      </div>
                    )}

                    {/* Aircraft */}
                    {listing.aircraft && (
                      <div className="flex items-center gap-2 text-sm">
                        <Plane className="w-4 h-4 text-accent" />
                        <span className="text-foreground">
                          {listing.aircraft.model || listing.aircraft.type}
                        </span>
                      </div>
                    )}

                    {/* Departure Time */}
                    {listing.dep_time && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-foreground">
                          {new Date(listing.dep_time).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    {listing.price && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-accent" />
                        <span className="text-foreground font-semibold">
                          {listing.currency} {listing.price.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Seats */}
                    {listing.seats && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-accent" />
                        <span className="text-foreground">
                          {listing.seats} seats
                        </span>
                      </div>
                    )}

                    {/* Verified Badge */}
                    {listing.operator_trust?.verified && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Verified Operator</span>
                      </div>
                    )}

                    {/* Trust Score */}
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-foreground">
                        Trust Score: {Math.round(listing.operator_trust?.trust_score || 0)}
                      </span>
                    </div>

                    <Button className="w-full btn-terminal-accent mt-4">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
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
        </TabsContent>

        {/* My RFQs Tab */}
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

          {/* Create RFQ Form */}
          {showCreateRFQ && (
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle>Create Trip Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Origin (ICAO)</Label>
                    <Input
                      value={newRFQ.origin}
                      onChange={(e) => setNewRFQ({...newRFQ, origin: e.target.value.toUpperCase()})}
                      className="bg-slate-700 border-slate-600 text-white"
                      maxLength={4}
                      placeholder="EGLL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Destination (ICAO)</Label>
                    <Input
                      value={newRFQ.destination}
                      onChange={(e) => setNewRFQ({...newRFQ, destination: e.target.value.toUpperCase()})}
                      className="bg-slate-700 border-slate-600 text-white"
                      maxLength={4}
                      placeholder="LFPG"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Departure Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={newRFQ.dep_time}
                      onChange={(e) => setNewRFQ({...newRFQ, dep_time: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Passengers</Label>
                    <Input
                      type="number"
                      value={newRFQ.pax}
                      onChange={(e) => setNewRFQ({...newRFQ, pax: parseInt(e.target.value)})}
                      className="bg-slate-700 border-slate-600 text-white"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Category (Optional)</Label>
                    <Input
                      value={newRFQ.preferred_category}
                      onChange={(e) => setNewRFQ({...newRFQ, preferred_category: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., heavy, midsize"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Budget (Optional)</Label>
                    <Input
                      type="number"
                      value={newRFQ.max_budget}
                      onChange={(e) => setNewRFQ({...newRFQ, max_budget: parseFloat(e.target.value)})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateRFQ} className="btn-terminal-accent">
                    Create Request
                  </Button>
                  <Button
                    onClick={() => setShowCreateRFQ(false)}
                    variant="outline"
                    className="border-terminal-border"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requests List */}
          <div className="grid grid-cols-1 gap-4">
            {myRequests.map((request) => (
              <Card key={request.id} className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={`text-xs ${
                          request.status === 'open' ? 'bg-green-500' :
                          request.status === 'fulfilled' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                          {request.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(request.created_at).toLocaleString()}
                        </span>
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
                            <p className="font-medium text-foreground">{request.preferred_category}</p>
                          </div>
                        )}
                        {request.max_budget && (
                          <div>
                            <p className="text-muted-foreground">Max Budget</p>
                            <p className="font-medium text-foreground">${request.max_budget.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button className="btn-terminal-accent ml-4">
                      View Quotes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Empty Legs Tab */}
        <TabsContent value="empty-legs" className="space-y-6 mt-6">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Empty Legs Coming Soon</h3>
            <p className="text-muted-foreground">
              Browse available empty leg flights at discounted rates
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

