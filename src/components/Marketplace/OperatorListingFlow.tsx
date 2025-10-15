// Operator Listing Flow - Comprehensive marketplace for operators
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
          marketplaceService,
          type AircraftModel,
          type MarketplaceListing,
          type TripRequest
} from "@/lib/marketplace-service";
import {
          CheckCircle,
          Clock,
          DollarSign,
          Edit,
          Eye,
          Loader2,
          MapPin,
          MessageSquare,
          Plane,
          Plus,
          RefreshCw,
          Save,
          Trash2,
          TrendingUp,
          Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { AirportLookup } from "./AirportLookup";
import { TrustBadge } from "./TrustBadge";

interface OperatorListingFlowProps {
  className?: string;
}

export function OperatorListingFlow({ className }: OperatorListingFlowProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(false);

  // Listings state
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [showListingForm, setShowListingForm] = useState(false);
  const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);

  // Trip requests state
  const [availableRequests, setAvailableRequests] = useState<TripRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<TripRequest | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");

  // Aircraft models
  const [aircraftModels, setAircraftModels] = useState<AircraftModel[]>([]);

  // Listing form state
  const [listingForm, setListingForm] = useState({
    title: "",
    description: "",
    listing_type: "charter" as "sale" | "charter" | "empty_leg",
    category: "" as string,
    aircraft_model_id: "",
    price: 0,
    original_price: 0,
    discount_percent: 0,
    currency: "USD",
    departure_airport: "",
    destination_airport: "",
    dep_time: "",
    arr_time: "",
    seats: 0,
    distance_nm: 0
  });

  // Load data on mount
  useEffect(() => {
    loadAircraftModels();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'listings':
        loadMyListings();
        break;
      case 'trip-requests':
        loadTripRequests();
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

  const loadMyListings = async () => {
    setLoading(true);
    try {
      const listings = await marketplaceService.getMyListings();
      setMyListings(listings);
    } catch (error) {
      console.error('Load listings error:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load your listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTripRequests = async () => {
    setLoading(true);
    try {
      const result = await marketplaceService.searchTripRequests({
        status: 'open',
        page: 1,
        per_page: 50
      });
      setAvailableRequests(result.results);
    } catch (error) {
      console.error('Load trip requests error:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load trip requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await marketplaceService.createListing(listingForm);
      toast({
        title: "Success",
        description: "Listing created successfully"
      });
      setShowListingForm(false);
      resetForm();
      loadMyListings();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    setLoading(true);
    try {
      await marketplaceService.updateListing(editingListing.id, listingForm);
      toast({
        title: "Success",
        description: "Listing updated successfully"
      });
      setEditingListing(null);
      setShowListingForm(false);
      resetForm();
      loadMyListings();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update listing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setLoading(true);
    try {
      await marketplaceService.deleteListing(listingId);
      toast({
        title: "Success",
        description: "Listing deleted successfully"
      });
      loadMyListings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditListing = (listing: MarketplaceListing) => {
    setEditingListing(listing);
    setListingForm({
      title: listing.title,
      description: listing.description || "",
      listing_type: listing.listing_type,
      category: listing.category || "",
      aircraft_model_id: listing.aircraft_model_id || "",
      price: listing.price || 0,
      original_price: listing.original_price || 0,
      discount_percent: listing.discount_percent || 0,
      currency: listing.currency,
      departure_airport: listing.departure_airport || "",
      destination_airport: listing.destination_airport || "",
      dep_time: listing.dep_time ? new Date(listing.dep_time).toISOString().slice(0, 16) : "",
      arr_time: listing.arr_time ? new Date(listing.arr_time).toISOString().slice(0, 16) : "",
      seats: listing.seats || 0,
      distance_nm: listing.distance_nm || 0
    });
    setShowListingForm(true);
  };

  const resetForm = () => {
    setListingForm({
      title: "",
      description: "",
      listing_type: "charter",
      category: "",
      aircraft_model_id: "",
      price: 0,
      original_price: 0,
      discount_percent: 0,
      currency: "USD",
      departure_airport: "",
      destination_airport: "",
      dep_time: "",
      arr_time: "",
      seats: 0,
      distance_nm: 0
    });
  };

  const handleSubmitQuote = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      await marketplaceService.submitQuote(selectedRequest.id, {
        price: parseFloat(quoteAmount),
        currency: "USD",
        message: quoteMessage
      } as any);

      toast({
        title: "Success",
        description: "Quote submitted successfully"
      });

      setQuoteDialogOpen(false);
      setQuoteAmount("");
      setQuoteMessage("");
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="listings" className="data-[state=active]:bg-orange-500">
            <Plane className="w-4 h-4 mr-2" />
            My Listings
          </TabsTrigger>
          <TabsTrigger value="trip-requests" className="data-[state=active]:bg-blue-500">
            <MessageSquare className="w-4 h-4 mr-2" />
            Trip Requests
          </TabsTrigger>
          <TabsTrigger value="empty-legs" className="data-[state=active]:bg-green-500">
            <TrendingUp className="w-4 h-4 mr-2" />
            Empty Legs
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-500">
            <Eye className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* My Listings Tab */}
        <TabsContent value="listings" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">My Listings</h2>
            <div className="flex gap-2">
              <Button
                onClick={loadMyListings}
                variant="outline"
                className="border-terminal-border"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingListing(null);
                  setShowListingForm(!showListingForm);
                }}
                className="btn-terminal-accent"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Listing
              </Button>
            </div>
          </div>

          {/* Listing Form */}
          {showListingForm && (
            <Card className="terminal-card border-orange-500">
              <CardHeader>
                <CardTitle>
                  {editingListing ? 'Edit Listing' : 'Create New Listing'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingListing ? handleUpdateListing : handleCreateListing} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-white">Title *</Label>
                      <Input
                        value={listingForm.title}
                        onChange={(e) => setListingForm({...listingForm, title: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., G650 - Charter Available"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-white">Description</Label>
                      <Textarea
                        value={listingForm.description}
                        onChange={(e) => setListingForm({...listingForm, description: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Describe your offering..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Listing Type *</Label>
                      <Select
                        value={listingForm.listing_type}
                        onValueChange={(value: any) => setListingForm({...listingForm, listing_type: value})}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="charter" className="text-white">Charter</SelectItem>
                          <SelectItem value="empty_leg" className="text-white">Empty Leg</SelectItem>
                          <SelectItem value="sale" className="text-white">For Sale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Aircraft Model</Label>
                      <Select
                        value={listingForm.aircraft_model_id}
                        onValueChange={(value) => setListingForm({...listingForm, aircraft_model_id: value})}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                          {aircraftModels.map((model) => (
                            <SelectItem key={model.id} value={model.id} className="text-white">
                              {model.manufacturer} {model.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <AirportLookup
                      value={listingForm.departure_airport}
                      onChange={(value) => setListingForm({...listingForm, departure_airport: value})}
                      label="Departure Airport"
                    />

                    <AirportLookup
                      value={listingForm.destination_airport}
                      onChange={(value) => setListingForm({...listingForm, destination_airport: value})}
                      label="Destination Airport"
                    />

                    <div className="space-y-2">
                      <Label className="text-white">Departure Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={listingForm.dep_time}
                        onChange={(e) => setListingForm({...listingForm, dep_time: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Seats</Label>
                      <Input
                        type="number"
                        value={listingForm.seats}
                        onChange={(e) => setListingForm({...listingForm, seats: parseInt(e.target.value) || 0})}
                        className="bg-slate-700 border-slate-600 text-white"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Price *</Label>
                      <div className="flex gap-2">
                        <Select
                          value={listingForm.currency}
                          onValueChange={(value) => setListingForm({...listingForm, currency: value})}
                        >
                          <SelectTrigger className="w-24 bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="USD" className="text-white">USD</SelectItem>
                            <SelectItem value="EUR" className="text-white">EUR</SelectItem>
                            <SelectItem value="GBP" className="text-white">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={listingForm.price}
                          onChange={(e) => setListingForm({...listingForm, price: parseFloat(e.target.value) || 0})}
                          className="bg-slate-700 border-slate-600 text-white flex-1"
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>

                    {listingForm.listing_type === 'empty_leg' && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-white">Original Price</Label>
                          <Input
                            type="number"
                            value={listingForm.original_price}
                            onChange={(e) => setListingForm({...listingForm, original_price: parseFloat(e.target.value) || 0})}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white">Discount %</Label>
                          <Input
                            type="number"
                            value={listingForm.discount_percent}
                            onChange={(e) => setListingForm({...listingForm, discount_percent: parseInt(e.target.value) || 0})}
                            className="bg-slate-700 border-slate-600 text-white"
                            min="0"
                            max="100"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-terminal-accent"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : editingListing ? "Update Listing" : "Create Listing"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowListingForm(false);
                        setEditingListing(null);
                        resetForm();
                      }}
                      disabled={loading}
                      className="border-terminal-border"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Listings Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myListings.map((listing) => (
                <Card key={listing.id} className="terminal-card hover:border-orange-500 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base text-foreground line-clamp-2">
                        {listing.title}
                      </CardTitle>
                      <Badge className={listing.active ? 'bg-green-500' : 'bg-gray-500'}>
                        {listing.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs capitalize">
                      {listing.listing_type.replace('_', ' ')}
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
                        <Clock className="w-3 h-3" />
                        <span>{new Date(listing.dep_time).toLocaleDateString()}</span>
                      </div>
                    )}

                    {listing.price && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-accent" />
                        <span className="text-lg font-bold text-white">
                          {listing.currency} {listing.price.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-600">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{listing.view_count || 0}</div>
                        <div className="text-xs text-slate-400">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{listing.inquiry_count || 0}</div>
                        <div className="text-xs text-slate-400">Inquiries</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={() => handleEditListing(listing)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-terminal-border"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteListing(listing.id)}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {myListings.length === 0 && !showListingForm && (
                <Card className="terminal-card md:col-span-2 lg:col-span-3">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Plane className="w-16 h-16 text-slate-500 mb-4 opacity-50" />
                    <p className="text-slate-400 text-lg">No listings yet</p>
                    <p className="text-slate-500 text-sm mb-4">Create your first listing to start receiving requests</p>
                    <Button
                      onClick={() => setShowListingForm(true)}
                      className="btn-terminal-accent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Listing
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Trip Requests Tab */}
        <TabsContent value="trip-requests" className="space-y-6 mt-6">
          <h2 className="text-2xl font-bold text-foreground">Open Trip Requests</h2>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {availableRequests.map((request) => (
                <Card key={request.id} className="terminal-card hover:border-blue-500 transition-colors">
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
                          <Badge variant="outline" className="text-xs capitalize">
                            {request.trip_type.replace('-', ' ')}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {request.origin} → {request.destination}
                        </h3>

                        {request.broker && (
                          <div className="mb-3">
                            <TrustBadge
                              trustScore={request.broker_trust?.trust_score || 0}
                              verified={request.broker_trust?.verified}
                              size="sm"
                              showDetails={false}
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Departure</p>
                            <p className="font-medium text-foreground">
                              {new Date(request.dep_time).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Passengers</p>
                            <p className="font-medium text-foreground">
                              <Users className="w-3 h-3 inline mr-1" />
                              {request.pax}
                            </p>
                          </div>
                          {request.preferred_category && (
                            <div>
                              <p className="text-muted-foreground">Category</p>
                              <p className="font-medium text-foreground capitalize">{request.preferred_category}</p>
                            </div>
                          )}
                          {request.max_budget && (
                            <div>
                              <p className="text-muted-foreground">Budget</p>
                              <p className="font-medium text-foreground">${request.max_budget.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedRequest(request);
                          setQuoteDialogOpen(true);
                        }}
                        className="btn-terminal-accent ml-4"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {availableRequests.length === 0 && (
                <Card className="terminal-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="w-16 h-16 text-slate-500 mb-4 opacity-50" />
                    <p className="text-slate-400 text-lg">No open trip requests</p>
                    <p className="text-slate-500 text-sm">Check back later for new opportunities</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Empty Legs Tab */}
        <TabsContent value="empty-legs" className="space-y-6 mt-6">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-accent mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Empty Leg Manager</h3>
            <p className="text-slate-400 mb-4">
              Quickly post empty leg flights from your schedule
            </p>
            <Button className="btn-terminal-accent">
              <Plus className="w-4 h-4 mr-2" />
              Post Empty Leg
            </Button>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6 mt-6">
          <h2 className="text-2xl font-bold text-foreground">Performance Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="terminal-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {myListings.reduce((sum, l) => sum + (l.view_count || 0), 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">Total Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {myListings.reduce((sum, l) => sum + (l.inquiry_count || 0), 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {myListings.filter(l => l.active).length}
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {myListings.length > 0
                    ? ((myListings.reduce((sum, l) => sum + (l.inquiry_count || 0), 0) /
                        myListings.reduce((sum, l) => sum + (l.view_count || 0), 1)) * 100).toFixed(1)
                    : 0}%
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quote Submission Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Submit Quote</DialogTitle>
            <DialogDescription className="text-slate-400">
              Provide your quote for this trip request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-white">Quote Amount (USD)</Label>
              <Input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Enter your quote"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Message (Optional)</Label>
              <Textarea
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Additional details about your quote..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmitQuote}
                disabled={loading || !quoteAmount}
                className="flex-1 btn-terminal-accent"
              >
                {loading ? "Submitting..." : "Submit Quote"}
              </Button>
              <Button
                onClick={() => setQuoteDialogOpen(false)}
                variant="outline"
                className="border-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

