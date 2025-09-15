import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Plane, MapPin, Calendar, Users, Clock, DollarSign, Loader2, Plus, 
  Search, Filter, Bell, Bookmark, TrendingUp, Globe, Zap 
} from "lucide-react";

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

interface SearchFilters {
  departure: string;
  destination: string;
  minPrice: string;
  maxPrice: string;
  aircraftType: string;
  listingType: string;
  minSeats: string;
  dateFrom: string;
  dateTo: string;
}

export default function EnhancedMarketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Record<string, unknown>[]>([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState(0);
  const { toast } = useToast();

  const [filters, setFilters] = useState<SearchFilters>({
    departure: "",
    destination: "",
    minPrice: "",
    maxPrice: "",
    aircraftType: "",
    listingType: "",
    minSeats: "",
    dateFrom: "",
    dateTo: "",
  });

  const [stats, setStats] = useState({
    totalListings: 0,
    avgPrice: 0,
    popularRoutes: [] as string[],
    recentActivity: 0,
  });

  useEffect(() => {
    fetchUserRole();
    fetchListings();
    fetchSavedSearches();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, searchQuery, filters]);

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
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
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
            .from('users')
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
      calculateStats(listingsWithOperators);
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

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('marketplace-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'marketplace_listings'
        },
        (payload) => {
          setRealTimeUpdates(prev => prev + 1);
          fetchListings();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Listing Available",
              description: "A new charter opportunity has been posted",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchSavedSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setSavedSearches(data || []);
    } catch (error) {
      console.error("Error fetching saved searches:", error);
    }
  };

  const calculateStats = (data: MarketplaceListing[]) => {
    const totalListings = data.length;
    const avgPrice = data.reduce((acc, listing) => acc + listing.asking_price, 0) / totalListings || 0;
    
    const routeCounts: { [key: string]: number } = {};
    data.forEach(listing => {
      const route = `${listing.departure_location}-${listing.destination}`;
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    });
    
    const popularRoutes = Object.entries(routeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([route]) => route);

    const recentActivity = data.filter(listing => 
      new Date(listing.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;

    setStats({ totalListings, avgPrice, popularRoutes, recentActivity });
  };

  const applyFilters = () => {
    let filtered = listings;

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.departure_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.aircraft.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.aircraft.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.departure) {
      filtered = filtered.filter(listing => 
        listing.departure_location.toLowerCase().includes(filters.departure.toLowerCase())
      );
    }

    if (filters.destination) {
      filtered = filtered.filter(listing => 
        listing.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(listing => listing.asking_price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(listing => listing.asking_price <= parseFloat(filters.maxPrice));
    }

    if (filters.aircraftType) {
      filtered = filtered.filter(listing => 
        listing.aircraft.aircraft_type.toLowerCase().includes(filters.aircraftType.toLowerCase())
      );
    }

    if (filters.listingType) {
      filtered = filtered.filter(listing => listing.listing_type === filters.listingType);
    }

    if (filters.minSeats) {
      filtered = filtered.filter(listing => listing.aircraft.seats >= parseInt(filters.minSeats));
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(listing => 
        new Date(listing.departure_date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(listing => 
        new Date(listing.departure_date) <= new Date(filters.dateTo)
      );
    }

    setFilteredListings(filtered);
  };

  const saveCurrentSearch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const searchName = `Search ${new Date().toLocaleDateString()}`;
      const { error } = await supabase
        .from("saved_searches")
        .insert([{
          user_id: user.id,
          name: searchName,
          filters: { ...filters, searchQuery },
          alert_enabled: true
        }]);

      if (error) throw error;

      toast({
        title: "Search Saved",
        description: "You'll be notified of new listings matching these criteria",
      });

      fetchSavedSearches();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save search",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      departure: "",
      destination: "",
      minPrice: "",
      maxPrice: "",
      aircraftType: "",
      listingType: "",
      minSeats: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchQuery("");
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
          <h2 className="text-2xl font-bold text-white">Enhanced Marketplace</h2>
          <p className="text-slate-400">Advanced charter opportunity platform</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-terminal-success border-terminal-success">
            <Zap className="mr-1 h-3 w-3" />
            {realTimeUpdates} Live Updates
          </Badge>
        </div>
      </div>

      {/* Market Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-slate-400">Active Listings</p>
                <p className="text-xl font-bold text-white">{stats.totalListings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Avg. Price</p>
                <p className="text-xl font-bold text-white">${Math.round(stats.avgPrice).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-terminal-warning" />
              <div>
                <p className="text-sm text-slate-400">24h Activity</p>
                <p className="text-xl font-bold text-white">{stats.recentActivity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-slate-400">Top Route</p>
                <p className="text-sm font-bold text-white">{stats.popularRoutes[0] || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by route, aircraft, or operator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={saveCurrentSearch}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <Bell className="mr-2 h-4 w-4" />
                Save Alert
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-700/30 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-white">Departure</Label>
                  <Input
                    placeholder="KJFK"
                    value={filters.departure}
                    onChange={(e) => setFilters({...filters, departure: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Destination</Label>
                  <Input
                    placeholder="KLAX"
                    value={filters.destination}
                    onChange={(e) => setFilters({...filters, destination: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Min Price</Label>
                  <Input
                    type="number"
                    placeholder="25000"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Max Price</Label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Aircraft Type</Label>
                  <Input
                    placeholder="Light Jet"
                    value={filters.aircraftType}
                    onChange={(e) => setFilters({...filters, aircraftType: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Listing Type</Label>
                  <Select value={filters.listingType} onValueChange={(value) => setFilters({...filters, listingType: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="" className="text-white">All types</SelectItem>
                      <SelectItem value="charter" className="text-white">Charter</SelectItem>
                      <SelectItem value="empty_leg" className="text-white">Empty Leg</SelectItem>
                      <SelectItem value="block_hours" className="text-white">Block Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Min Seats</Label>
                  <Input
                    type="number"
                    placeholder="4"
                    value={filters.minSeats}
                    onChange={(e) => setFilters({...filters, minSeats: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Date From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="col-span-2 flex space-x-2">
                  <Button onClick={clearFilters} variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            <div className="text-sm text-slate-400">
              Showing {filteredListings.length} of {listings.length} listings
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid gap-6">
        {filteredListings.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-8">
              <Plane className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No listings match your criteria</p>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search terms</p>
            </CardContent>
          </Card>
        ) : (
          filteredListings.map((listing) => (
            <Card key={listing.id} className="bg-slate-800/50 border-slate-700 hover:border-primary/50 transition-colors">
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
                  <div className="flex space-x-2">
                    <Badge 
                      variant="outline" 
                      className={
                        listing.listing_type === 'empty_leg' 
                          ? "bg-terminal-success/20 text-terminal-success border-terminal-success/30"
                          : "bg-primary/20 text-primary border-primary/30"
                      }
                    >
                      {listing.listing_type.replace('_', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-slate-300">
                    <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                    <span>{listing.departure_location} → {listing.destination}</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                    <span>{new Date(listing.departure_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Users className="mr-2 h-4 w-4 text-slate-400" />
                    <span>{listing.aircraft.seats} seats</span>
                  </div>
                  <div className="flex items-center text-terminal-success">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span className="font-bold">${listing.asking_price.toLocaleString()}</span>
                  </div>
                </div>
                
                {listing.description && (
                  <p className="text-slate-400 text-sm">{listing.description}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-500">
                    Posted {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                      View Details
                    </Button>
                    {userRole === "broker" && (
                      <Button size="sm">Place Bid</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}