// Operator Listings Component
// View and manage operator's own marketplace listings

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { marketplaceService, type MarketplaceListing } from "@/lib/marketplace-service";
import {
    Edit,
    Eye,
    Loader2,
    MapPin,
    Plane,
    Plus,
    RefreshCw,
    Trash2,
    TrendingUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

interface OperatorListingsProps {
  onEditListing?: (listing: MarketplaceListing) => void;
  onCreateListing?: () => void;
}

export function OperatorListings({ onEditListing, onCreateListing }: OperatorListingsProps) {
  const { toast } = useToast();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await marketplaceService.getMyListings();
      setListings(data);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load your listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await marketplaceService.deleteListing(listingId);
      toast({
        title: "Success",
        description: "Listing deleted successfully"
      });
      loadListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete listing",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (listing: MarketplaceListing) => {
    try {
      const newStatus = listing.active ? 'inactive' : 'active';
      await marketplaceService.updateListing(listing.id, { 
        ...listing, 
        active: newStatus === 'active' 
      });
      toast({
        title: "Status Updated",
        description: `Listing ${newStatus === 'active' ? 'activated' : 'deactivated'}`
      });
      loadListings();
    } catch (error) {
      console.error('Error updating listing status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update listing status",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string, active: boolean) => {
    if (!active) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'sold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'charter': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'empty_leg': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'sale': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Listings</h2>
          <p className="text-gray-400">Manage your aircraft listings and track performance</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadListings}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={onCreateListing}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Listings</p>
                <p className="text-2xl font-bold text-white">{listings.length}</p>
              </div>
              <Plane className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-400">
                  {listings.filter(l => l.active).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-orange-400">
                  {listings.reduce((sum, l) => sum + (l.view_count || 0), 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Inquiries</p>
                <p className="text-2xl font-bold text-purple-400">
                  {listings.reduce((sum, l) => sum + (l.inquiry_count || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Listings Yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first aircraft listing to start receiving inquiries from brokers
            </p>
            <Button
              onClick={onCreateListing}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg line-clamp-2">
                      {listing.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      {listing.aircraft_model?.manufacturer} {listing.aircraft_model?.model}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Badge className={getStatusColor(listing.status || 'active', listing.active)}>
                      {listing.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getListingTypeColor(listing.listing_type)}>
                    {listing.listing_type?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {listing.category && (
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {listing.category.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                {listing.description && (
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {listing.description}
                  </p>
                )}

                {/* Route */}
                {(listing.departure_airport || listing.destination_airport) && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {listing.departure_airport || 'Any'} → {listing.destination_airport || 'Any'}
                    </span>
                  </div>
                )}

                {/* Price */}
                {listing.price && (
                  <div className="text-2xl font-bold text-orange-400">
                    {formatPrice(listing.price, listing.currency)}
                    {listing.original_price && listing.original_price > listing.price && (
                      <span className="text-sm text-gray-400 ml-2 line-through">
                        {formatPrice(listing.original_price, listing.currency)}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{listing.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{listing.inquiry_count || 0}</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditListing?.(listing)}
                    className="flex-1 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(listing)}
                    className={`flex-1 ${
                      listing.active 
                        ? 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/20' 
                        : 'border-green-500 text-green-400 hover:bg-green-500/20'
                    }`}
                  >
                    {listing.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteListing(listing.id)}
                    className="px-3"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
