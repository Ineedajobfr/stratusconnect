// Operator Empty Legs Component
// Post empty leg opportunities with discounted pricing

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { marketplaceService, type MarketplaceListing } from "@/lib/marketplace-service";
import {
    Clock,
    DollarSign,
    Edit,
    Loader2,
    Plane,
    Plus,
    RefreshCw,
    Save,
    Trash2,
    TrendingDown,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { AirportLookup } from "./AirportLookup";

interface OperatorEmptyLegsProps {
  onEmptyLegCreated?: () => void;
}

export function OperatorEmptyLegs({ onEmptyLegCreated }: OperatorEmptyLegsProps) {
  const { toast } = useToast();
  const [emptyLegs, setEmptyLegs] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLeg, setEditingLeg] = useState<MarketplaceListing | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departure_airport: "",
    destination_airport: "",
    dep_time: "",
    arr_time: "",
    seats: 0,
    price: 0,
    original_price: 0,
    discount_percent: 0,
    currency: "USD"
  });

  useEffect(() => {
    loadEmptyLegs();
  }, []);

  const loadEmptyLegs = async () => {
    setLoading(true);
    try {
      const listings = await marketplaceService.getMyListings();
      const emptyLegListings = listings.filter(l => l.listing_type === 'empty_leg');
      setEmptyLegs(emptyLegListings);
    } catch (error) {
      console.error('Error loading empty legs:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load empty legs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmptyLeg = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const listingData = {
        ...formData,
        listing_type: 'empty_leg' as const,
        category: 'heavy', // Default category for empty legs
        distance_nm: 0 // Would be calculated based on airports
      };

      await marketplaceService.createListing(listingData);
      toast({
        title: "Success",
        description: "Empty leg posted successfully"
      });
      
      setShowCreateForm(false);
      resetForm();
      loadEmptyLegs();
      onEmptyLegCreated?.();
    } catch (error) {
      console.error('Error creating empty leg:', error);
      toast({
        title: "Create Failed",
        description: "Failed to create empty leg",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmptyLeg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeg) return;

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        listing_type: 'empty_leg' as const
      };

      await marketplaceService.updateListing(editingLeg.id, updateData);
      toast({
        title: "Success",
        description: "Empty leg updated successfully"
      });
      
      setEditingLeg(null);
      resetForm();
      loadEmptyLegs();
    } catch (error) {
      console.error('Error updating empty leg:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update empty leg",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmptyLeg = async (legId: string) => {
    if (!confirm('Are you sure you want to delete this empty leg?')) return;

    try {
      await marketplaceService.deleteListing(legId);
      toast({
        title: "Success",
        description: "Empty leg deleted successfully"
      });
      loadEmptyLegs();
    } catch (error) {
      console.error('Error deleting empty leg:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete empty leg",
        variant: "destructive"
      });
    }
  };

  const handleEditEmptyLeg = (leg: MarketplaceListing) => {
    setFormData({
      title: leg.title || "",
      description: leg.description || "",
      departure_airport: leg.departure_airport || "",
      destination_airport: leg.destination_airport || "",
      dep_time: leg.dep_time || "",
      arr_time: leg.arr_time || "",
      seats: leg.seats || 0,
      price: leg.price || 0,
      original_price: leg.original_price || 0,
      discount_percent: leg.discount_percent || 0,
      currency: leg.currency || "USD"
    });
    setEditingLeg(leg);
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      departure_airport: "",
      destination_airport: "",
      dep_time: "",
      arr_time: "",
      seats: 0,
      price: 0,
      original_price: 0,
      discount_percent: 0,
      currency: "USD"
    });
    setEditingLeg(null);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !showCreateForm) {
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
          <h2 className="text-2xl font-bold text-white">Empty Legs</h2>
          <p className="text-gray-400">Post empty leg opportunities with discounted pricing</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadEmptyLegs}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Empty Leg
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Legs</p>
                <p className="text-2xl font-bold text-white">
                  {emptyLegs.filter(l => l.active).length}
                </p>
              </div>
              <Plane className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-orange-400">
                  {emptyLegs.reduce((sum, l) => sum + (l.view_count || 0), 0)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Discount</p>
                <p className="text-2xl font-bold text-green-400">
                  {emptyLegs.length > 0 
                    ? Math.round(emptyLegs.reduce((sum, l) => sum + (l.discount_percent || 0), 0) / emptyLegs.length)
                    : 0}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Inquiries</p>
                <p className="text-2xl font-bold text-purple-400">
                  {emptyLegs.reduce((sum, l) => sum + (l.inquiry_count || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="bg-slate-800/50 border-orange-500">
          <CardHeader>
            <CardTitle>
              {editingLeg ? 'Edit Empty Leg' : 'Post New Empty Leg'}
            </CardTitle>
            <CardDescription>
              Fill in the details for your empty leg opportunity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingLeg ? handleUpdateEmptyLeg : handleCreateEmptyLeg} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., G650 Empty Leg - LAX to JFK"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Seats Available</Label>
                  <Input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-white"
                    min="1"
                  />
                </div>

                <AirportLookup
                  value={formData.departure_airport}
                  onChange={(value) => setFormData({...formData, departure_airport: value})}
                  label="Departure Airport *"
                />

                <AirportLookup
                  value={formData.destination_airport}
                  onChange={(value) => setFormData({...formData, destination_airport: value})}
                  label="Destination Airport *"
                />

                <div className="space-y-2">
                  <Label className="text-white">Departure Date & Time *</Label>
                  <Input
                    type="datetime-local"
                    value={formData.dep_time}
                    onChange={(e) => setFormData({...formData, dep_time: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Arrival Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.arr_time}
                    onChange={(e) => setFormData({...formData, arr_time: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Empty Leg Price *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({...formData, currency: value})}
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
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Original Price</Label>
                  <Input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({...formData, original_price: parseFloat(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Discount %</Label>
                  <Input
                    type="number"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({...formData, discount_percent: parseInt(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the empty leg opportunity..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : editingLeg ? "Update Empty Leg" : "Post Empty Leg"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="border-slate-600 text-white hover:bg-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Empty Legs List */}
      {emptyLegs.length === 0 && !showCreateForm ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Empty Legs Posted</h3>
            <p className="text-gray-400 mb-6">
              Post empty leg opportunities to maximize aircraft utilization and revenue
            </p>
            <Button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post First Empty Leg
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emptyLegs.map((leg) => (
            <Card key={leg.id} className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg line-clamp-2">
                      {leg.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      {leg.departure_airport} → {leg.destination_airport}
                    </CardDescription>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    EMPTY LEG
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                {leg.description && (
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {leg.description}
                  </p>
                )}

                {/* Schedule */}
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Departure: {formatDate(leg.dep_time || '')}</span>
                  </div>
                  {leg.arr_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Arrival: {formatDate(leg.arr_time)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{leg.seats} seats available</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-400">
                    {formatPrice(leg.price || 0, leg.currency)}
                  </div>
                  {leg.original_price && leg.original_price > (leg.price || 0) && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(leg.original_price, leg.currency)}
                      </span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {leg.discount_percent}% OFF
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span>Views: {leg.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Inquiries: {leg.inquiry_count || 0}</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    {new Date(leg.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditEmptyLeg(leg)}
                    className="flex-1 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteEmptyLeg(leg.id)}
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
