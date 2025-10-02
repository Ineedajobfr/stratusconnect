import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, DollarSign, Loader2, MapPin, Plane, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface MarketplaceListing {
  id: string;
  aircraft_id: string;
  departure_location: string;
  destination: string;
  departure_date: string;
  asking_price: number;
  minimum_bid: number;
  flight_hours: number;
  passengers: number;
  listing_type: string;
  status: string;
  description: string;
  created_at: string;
  aircraft: {
    tail_number: string;
    aircraft_type: string;
    manufacturer: string;
    model: string;
    seats: number;
    max_range_nm: number;
    hourly_rate: number;
  };
  operator_name: string;
  operator_company: string;
}

interface Bid {
  id: string;
  bid_amount: number;
  message: string;
  status: string;
  created_at: string;
  bidder_name: string;
  bidder_company: string;
}

import { getErrorMessage } from "@/utils/errorHandler";

export default function Marketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [bids, setBids] = useState<{ [key: string]: Bid[] }>({});
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [aircraft, setAircraft] = useState<Record<string, unknown>[]>([]);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const { toast } = useToast();

  const [listingForm, setListingForm] = useState({
    aircraft_id: "",
    departure_location: "",
    destination: "",
    departure_date: "",
    asking_price: "",
    minimum_bid: "",
    flight_hours: "",
    passengers: "",
    listing_type: "charter",
    description: "",
  });

  useEffect(() => {
    fetchUserRole();
    fetchListings();
  }, []);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
        
      setUserRole(data?.role || "");
      
      if (data?.role === "operator") {
        fetchAircraft();
      }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchAircraft = async () => {
    try {
      const { data } = await supabase
        .from("aircraft")
        .select("*")
        .eq("availability_status", "available");
      
      setAircraft(data || []);
    } catch (error) {
      console.error("Error fetching aircraft:", error);
    }
  };

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select(`
          *,
          aircraft:aircraft_id (
            tail_number,
            aircraft_type,
            manufacturer,
            model,
            seats,
            max_range_nm,
            hourly_rate
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Get operator names separately
      const listingsWithOperators = await Promise.all(
        (data || []).map(async (listing) => {
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name, company_name')
            .eq('id', listing.operator_id)
            .single();
          
          return {
            ...listing,
            operator_name: userData?.full_name || 'Unknown',
            operator_company: userData?.company_name || ''
          };
        })
      );

      setListings(listingsWithOperators);

      // Fetch bids for each listing
      for (const listing of listingsWithOperators) {
        await fetchBidsForListing(listing.id);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to load marketplace listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBidsForListing = async (listingId: string) => {
    try {
      const { data, error } = await supabase
        .from("bids")
        .select(`*`)
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Get bidder names separately
      const bidsWithBidders = await Promise.all(
        (data || []).map(async (bid) => {
          const { data: userData } = await supabase
            .from('profiles')
            .select('full_name, company_name')
            .eq('id', bid.broker_id)
            .single();
          
          return {
            ...bid,
            bidder_name: userData?.full_name || 'Unknown',
            bidder_company: userData?.company_name || ''
          };
        })
      );

      setBids(prev => ({ ...prev, [listingId]: bidsWithBidders }));
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("marketplace_listings")
        .insert([{
          ...listingForm,
          operator_id: user.id,
          asking_price: parseFloat(listingForm.asking_price),
          minimum_bid: parseFloat(listingForm.minimum_bid || "0"),
          flight_hours: parseFloat(listingForm.flight_hours || "0"),
          passengers: parseInt(listingForm.passengers || "1"),
        }]);

      if (error) throw error;

      toast({ title: "Success", description: "Listing created successfully" });
      setListingDialogOpen(false);
      setListingForm({
        aircraft_id: "",
        departure_location: "",
        destination: "",
        departure_date: "",
        asking_price: "",
        minimum_bid: "",
        flight_hours: "",
        passengers: "",
        listing_type: "charter",
        description: "",
      });
      fetchListings();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedListing) return;

      const { error } = await supabase
        .from("bids")
        .insert([{
          listing_id: selectedListing.id,
          broker_id: user.id,
          bid_amount: parseFloat(bidAmount),
          message: bidMessage,
        }]);

      if (error) throw error;

      toast({ title: "Success", description: "Bid placed successfully" });
      setBidDialogOpen(false);
      setBidAmount("");
      setBidMessage("");
      fetchBidsForListing(selectedListing.id);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleAcceptBid = async (bidId: string, listingId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Start a transaction-like operation
      const { data: bid } = await supabase
        .from("bids")
        .select("*, broker_id, bid_amount")
        .eq("id", bidId)
        .single();

      if (!bid) return;

      const { data: listing } = await supabase
        .from("marketplace_listings")
        .select("*, aircraft_id")
        .eq("id", listingId)
        .single();

      if (!listing) return;

      // Create a deal
      const { error: dealError } = await supabase
        .from("deals")
        .insert([{
          listing_id: listingId,
          winning_bid_id: bidId,
          operator_id: user.id,
          broker_id: bid.broker_id,
          aircraft_id: listing.aircraft_id,
          final_amount: bid.bid_amount,
          status: "pending",
        }]);

      if (dealError) throw dealError;

      // Update bid status
      await supabase
        .from("bids")
        .update({ status: "accepted" })
        .eq("id", bidId);

      // Update listing status
      await supabase
        .from("marketplace_listings")
        .update({ status: "closed" })
        .eq("id", listingId);

      toast({ title: "Success", description: "Bid accepted! A deal has been created." });
      fetchListings();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Marketplace</h2>
          <p className="text-slate-400">Browse available charter opportunities</p>
        </div>
        {userRole === "operator" && (
          <Dialog open={listingDialogOpen} onOpenChange={setListingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Listing</DialogTitle>
                <DialogDescription className="text-slate-400">
                  List your aircraft for charter opportunities
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateListing} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aircraft" className="text-white">Aircraft</Label>
                    <Select value={listingForm.aircraft_id} onValueChange={(value) => setListingForm({ ...listingForm, aircraft_id: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select aircraft" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {aircraft.map((plane) => (
                          <SelectItem key={String(plane.id)} value={String(plane.id)} className="text-white">
                            {String(plane.tail_number)} - {String(plane.manufacturer)} {String(plane.model)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listing_type" className="text-white">Listing Type</Label>
                    <Select value={listingForm.listing_type} onValueChange={(value) => setListingForm({ ...listingForm, listing_type: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="charter" className="text-white">Charter</SelectItem>
                        <SelectItem value="empty_leg" className="text-white">Empty Leg</SelectItem>
                        <SelectItem value="block_hours" className="text-white">Block Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departure" className="text-white">Departure</Label>
                    <Input
                      id="departure"
                      value={listingForm.departure_location}
                      onChange={(e) => setListingForm({ ...listingForm, departure_location: e.target.value })}
                      placeholder="KJFK"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-white">Destination</Label>
                    <Input
                      id="destination"
                      value={listingForm.destination}
                      onChange={(e) => setListingForm({ ...listingForm, destination: e.target.value })}
                      placeholder="KLAX"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departure_date" className="text-white">Departure Date</Label>
                    <Input
                      id="departure_date"
                      type="datetime-local"
                      value={listingForm.departure_date}
                      onChange={(e) => setListingForm({ ...listingForm, departure_date: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengers" className="text-white">Passengers</Label>
                    <Input
                      id="passengers"
                      type="number"
                      value={listingForm.passengers}
                      onChange={(e) => setListingForm({ ...listingForm, passengers: e.target.value })}
                      placeholder="4"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asking_price" className="text-white">Asking Price ($)</Label>
                    <Input
                      id="asking_price"
                      type="number"
                      value={listingForm.asking_price}
                      onChange={(e) => setListingForm({ ...listingForm, asking_price: e.target.value })}
                      placeholder="25000"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimum_bid" className="text-white">Minimum Bid ($)</Label>
                    <Input
                      id="minimum_bid"
                      type="number"
                      value={listingForm.minimum_bid}
                      onChange={(e) => setListingForm({ ...listingForm, minimum_bid: e.target.value })}
                      placeholder="20000"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={listingForm.description}
                    onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                    placeholder="Additional details about this charter opportunity..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setListingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Listing</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6">
        {listings.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-8">
              <Plane className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No active listings</p>
              <p className="text-slate-500 text-sm">Check back later for new opportunities</p>
            </CardContent>
          </Card>
        ) : (
          listings.map((listing) => (
            <Card key={listing.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Plane className="mr-2 h-5 w-5" />
                      {listing.aircraft.manufacturer} {listing.aircraft.model} - {listing.aircraft.tail_number}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Listed by {listing.operator_name} {listing.operator_company && `(${listing.operator_company})`}
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {listing.listing_type.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-slate-300">
                    <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-sm">Route</div>
                      <div className="font-medium">{listing.departure_location} → {listing.destination || "TBD"}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-sm">Date</div>
                      <div className="font-medium">
                        {listing.departure_date ? new Date(listing.departure_date).toLocaleDateString() : "Flexible"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Users className="mr-2 h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-sm">Passengers</div>
                      <div className="font-medium">{listing.passengers || listing.aircraft.seats} max</div>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <DollarSign className="mr-2 h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-sm">Asking Price</div>
                      <div className="font-medium">${listing.asking_price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {listing.description && (
                  <p className="text-slate-300 text-sm">{listing.description}</p>
                )}

                {bids[listing.id]?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Recent Bids</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {bids[listing.id].slice(0, 3).map((bid) => (
                        <div key={bid.id} className="flex justify-between items-center bg-slate-700/30 p-2 rounded">
                          <div>
                            <div className="text-slate-300 text-sm">
                              ${bid.bid_amount.toLocaleString()} by {bid.bidder_name}
                            </div>
                            {bid.message && (
                              <div className="text-slate-400 text-xs">{bid.message}</div>
                            )}
                          </div>
                          {userRole === "operator" && bid.status === "pending" && (
                            <Button size="sm" onClick={() => handleAcceptBid(bid.id, listing.id)}>
                              Accept
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userRole === "broker" && (
                  <div className="flex justify-end">
                    <Button onClick={() => {
                      setSelectedListing(listing);
                      setBidDialogOpen(true);
                    }}>
                      Place Bid
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bid Dialog */}
      <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Place Bid</DialogTitle>
            <DialogDescription className="text-slate-400">
              Submit your bid for this charter opportunity
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePlaceBid} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bid_amount" className="text-white">Bid Amount ($)</Label>
              <Input
                id="bid_amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
              {selectedListing?.minimum_bid && (
                <p className="text-slate-400 text-sm">
                  Minimum bid: ${selectedListing.minimum_bid.toLocaleString()}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bid_message" className="text-white">Message (Optional)</Label>
              <Textarea
                id="bid_message"
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                placeholder="Additional notes about your bid..."
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setBidDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Place Bid</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}