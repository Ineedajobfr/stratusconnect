// Operator Listing Flow Component
// Post aircraft, manage listings, empty legs

import { marketplaceService, type MarketplaceListing } from "@/lib/marketplace-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
    Calendar,
    Clock,
    DollarSign,
    Edit,
    MapPin,
    Plane,
    Plus,
    RefreshCw,
    Save,
    Trash2,
    TrendingUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

interface OperatorListingFlowProps {
  className?: string;
}

export function OperatorListingFlow({ className }: OperatorListingFlowProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("listings");
  
  // Listings state
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);
  
  // New listing form
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    listing_type: "charter" as "sale" | "charter" | "empty_leg",
    price: 0,
    currency: "USD",
    departure_airport: "",
    destination_airport: "",
    dep_time: "",
    arr_time: "",
    seats: 0,
    metadata: {}
  });

  // Load user's listings
  useEffect(() => {
    if (activeTab === "listings") {
      loadMyListings();
    }
  }, [activeTab]);

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

  const handleCreateListing = async () => {
    try {
      await marketplaceService.createListing(newListing);
      toast({
        title: "Success",
        description: "Listing created successfully"
      });
      setShowCreateForm(false);
      resetForm();
      loadMyListings();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing",
        variant: "destructive"
      });
    }
  };

  const handleUpdateListing = async () => {
    if (!editingListing) return;

    try {
      await marketplaceService.updateListing(editingListing.id, newListing);
      toast({
        title: "Success",
        description: "Listing updated successfully"
      });
      setEditingListing(null);
      resetForm();
      loadMyListings();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update listing",
        variant: "destructive"
      });
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

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
        description: error instanceof Error ? error.message : "Failed to delete listing",
        variant: "destructive"
      });
    }
  };

  const handleEditListing = (listing: MarketplaceListing) => {
    setEditingListing(listing);
    setNewListing({
      title: listing.title,
      description: listing.description || "",
      listing_type: listing.listing_type,
      price: listing.price || 0,
      currency: listing.currency,
      departure_airport: listing.departure_airport || "",
      destination_airport: listing.destination_airport || "",
      dep_time: listing.dep_time ? new Date(listing.dep_time).toISOString().slice(0, 16) : "",
      arr_time: listing.arr_time ? new Date(listing.arr_time).toISOString().slice(0, 16) : "",
      seats: listing.seats || 0,
      metadata: listing.metadata || {}
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setNewListing({
      title: "",
      description: "",
      listing_type: "charter",
      price: 0,
      currency: "USD",
      departure_airport: "",
      destination_airport: "",
      dep_time: "",
      arr_time: "",
      seats: 0,
      metadata: {}
    });
  };

  const cancelEdit = () => {
    setEditingListing(null);
    setShowCreateForm(false);
    resetForm();
  };

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="listings" className="data-[state=active]:bg-orange-500">
            <Plane className="w-4 h-4 mr-2" />
            My Listings
          </TabsTrigger>
          <TabsTrigger value="empty-legs" className="data-[state=active]:bg-green-500">
            <TrendingUp className="w-4 h-4 mr-2" />
            Empty Legs
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-500">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
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
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="btn-terminal-accent"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Listing
              </Button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <Card className="terminal-card border-orange-500">
              <CardHeader>
                <CardTitle>
                  {editingListing ? 'Edit Listing' : 'Create New Listing'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Title *</Label>
                    <Input
                      value={newListing.title}
                      onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., G650 - Charter Available"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={newListing.description}
                      onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Describe your offering..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Listing Type *</Label>
                    <Select
                      value={newListing.listing_type}
                      onValueChange={(value: any) => setNewListing({...newListing, listing_type: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charter">Charter</SelectItem>
                        <SelectItem value="empty_leg">Empty Leg</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Price *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={newListing.currency}
                        onValueChange={(value) => setNewListing({...newListing, currency: value})}
                      >
                        <SelectTrigger className="w-24 bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={newListing.price}
                        onChange={(e) => setNewListing({...newListing, price: parseFloat(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white flex-1"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Departure Airport (ICAO)</Label>
                    <Input
                      value={newListing.departure_airport}
                      onChange={(e) => setNewListing({...newListing, departure_airport: e.target.value.toUpperCase()})}
                      className="bg-slate-700 border-slate-600 text-white"
                      maxLength={4}
                      placeholder="EGLL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Destination Airport (ICAO)</Label>
                    <Input
                      value={newListing.destination_airport}
                      onChange={(e) => setNewListing({...newListing, destination_airport: e.target.value.toUpperCase()})}
                      className="bg-slate-700 border-slate-600 text-white"
                      maxLength={4}
                      placeholder="LFPG"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Departure Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={newListing.dep_time}
                      onChange={(e) => setNewListing({...newListing, dep_time: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Arrival Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={newListing.arr_time}
                      onChange={(e) => setNewListing({...newListing, arr_time: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Seats</Label>
                    <Input
                      type="number"
                      value={newListing.seats}
                      onChange={(e) => setNewListing({...newListing, seats: parseInt(e.target.value)})}
                      className="bg-slate-700 border-slate-600 text-white"
                      min="0"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={editingListing ? handleUpdateListing : handleCreateListing}
                    className="btn-terminal-accent"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingListing ? 'Update Listing' : 'Create Listing'}
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="border-terminal-border"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map((listing) => (
              <Card key={listing.id} className="terminal-card hover:border-orange-500 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground">{listing.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {listing.listing_type.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <Badge className={listing.active ? 'bg-green-500' : 'bg-gray-500'}>
                      {listing.active ? 'Active' : 'Inactive'}
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

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
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
          </div>

          {myListings.length === 0 && !loading && (
            <div className="text-center py-12">
              <Plane className="w-16 h-16 text-accent mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Listings Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first listing to start receiving requests
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="btn-terminal-accent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Listing
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Empty Legs Tab */}
        <TabsContent value="empty-legs" className="space-y-6 mt-6">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Empty Leg Management</h3>
            <p className="text-muted-foreground">
              Quickly post and manage empty leg flights
            </p>
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6 mt-6">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Availability Calendar</h3>
            <p className="text-muted-foreground">
              Manage your fleet availability and bookings
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

