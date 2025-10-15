// Aircraft Details Modal - Detailed view of marketplace listing
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type MarketplaceListing } from "@/lib/marketplace-service";
import {
          Calendar,
          Gauge,
          Heart,
          MapPin,
          MessageCircle,
          Plane,
          Send,
          TrendingDown,
          Users
} from "lucide-react";
import { TrustBadge } from "./TrustBadge";

interface AircraftDetailsModalProps {
  listing: MarketplaceListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestQuote?: (listingId: string) => void;
  onAddToFavorites?: (listingId: string) => void;
  onContactOperator?: (listingId: string) => void;
  currentUserRole?: string;
}

export function AircraftDetailsModal({
  listing,
  open,
  onOpenChange,
  onRequestQuote,
  onAddToFavorites,
  onContactOperator,
  currentUserRole
}: AircraftDetailsModalProps) {
  if (!listing) return null;

  const isEmptyLeg = listing.listing_type === 'empty_leg';
  const hasDiscount = listing.discount_percent && listing.discount_percent > 0;
  const isBroker = currentUserRole === 'broker';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <Plane className="w-6 h-6 text-accent" />
                {listing.title}
              </DialogTitle>
              <DialogDescription className="text-slate-300 mt-2">
                {listing.operator?.company_name || listing.operator?.full_name}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {listing.listing_type && (
                <Badge className={`
                  ${listing.listing_type === 'empty_leg' ? 'bg-green-500' : 
                    listing.listing_type === 'charter' ? 'bg-blue-500' : 'bg-purple-500'}
                `}>
                  {listing.listing_type.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
              {isEmptyLeg && hasDiscount && (
                <Badge className="bg-orange-500">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {listing.discount_percent}% OFF
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="aircraft" className="data-[state=active]:bg-slate-600">
              Aircraft
            </TabsTrigger>
            <TabsTrigger value="operator" className="data-[state=active]:bg-slate-600">
              Operator
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Price & Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Price</div>
                  <div className="flex items-baseline gap-3">
                    <div className="text-3xl font-bold text-white">
                      {listing.currency} {listing.price?.toLocaleString()}
                    </div>
                    {hasDiscount && listing.original_price && (
                      <div className="text-lg text-slate-400 line-through">
                        {listing.currency} {listing.original_price.toLocaleString()}
                      </div>
                    )}
                  </div>
                  {hasDiscount && listing.original_price && (
                    <div className="text-sm text-green-400 mt-1">
                      Save {listing.currency} {(listing.original_price - (listing.price || 0)).toLocaleString()}
                    </div>
                  )}
                </div>

                {listing.distance_nm && (
                  <div>
                    <div className="text-sm text-slate-400">Price per Nautical Mile</div>
                    <div className="text-lg font-semibold text-white">
                      {listing.currency} {((listing.price || 0) / listing.distance_nm).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {listing.departure_airport && listing.destination_airport && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="text-lg font-semibold">
                      {listing.departure_airport} → {listing.destination_airport}
                    </span>
                  </div>
                )}

                {listing.dep_time && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{new Date(listing.dep_time).toLocaleString()}</span>
                  </div>
                )}

                {listing.seats && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-accent" />
                    <span>{listing.seats} seats available</span>
                  </div>
                )}

                {listing.distance_nm && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Gauge className="w-4 h-4 text-accent" />
                    <span>{listing.distance_nm} nautical miles</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-slate-600" />

            {/* Description */}
            {listing.description && (
              <div>
                <h3 className="font-semibold text-white mb-2">Description</h3>
                <p className="text-slate-300">{listing.description}</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 bg-slate-700/30 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{listing.view_count || 0}</div>
                <div className="text-xs text-slate-400">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{listing.inquiry_count || 0}</div>
                <div className="text-xs text-slate-400">Inquiries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {listing.created_at ? Math.floor((Date.now() - new Date(listing.created_at).getTime()) / 86400000) : 0}
                </div>
                <div className="text-xs text-slate-400">Days Listed</div>
              </div>
            </div>
          </TabsContent>

          {/* Aircraft Tab */}
          <TabsContent value="aircraft" className="space-y-6 mt-6">
            {listing.aircraft_model && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white text-lg mb-3">Aircraft Specifications</h3>
                  <div className="grid grid-cols-2 gap-4 bg-slate-700/30 rounded-lg p-4">
                    <div>
                      <div className="text-sm text-slate-400">Manufacturer</div>
                      <div className="font-semibold text-white">{listing.aircraft_model.manufacturer}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Model</div>
                      <div className="font-semibold text-white">{listing.aircraft_model.model}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Category</div>
                      <div className="font-semibold text-white capitalize">{listing.aircraft_model.category}</div>
                    </div>
                    {listing.aircraft_model.typical_pax && (
                      <div>
                        <div className="text-sm text-slate-400">Typical Passengers</div>
                        <div className="font-semibold text-white">{listing.aircraft_model.typical_pax}</div>
                      </div>
                    )}
                    {listing.aircraft_model.max_range_nm && (
                      <div>
                        <div className="text-sm text-slate-400">Maximum Range</div>
                        <div className="font-semibold text-white">{listing.aircraft_model.max_range_nm} NM</div>
                      </div>
                    )}
                    {listing.aircraft_model.cruise_speed_kts && (
                      <div>
                        <div className="text-sm text-slate-400">Cruise Speed</div>
                        <div className="font-semibold text-white">{listing.aircraft_model.cruise_speed_kts} kts</div>
                      </div>
                    )}
                  </div>
                </div>

                {listing.aircraft_model.description && (
                  <div>
                    <h4 className="font-semibold text-white mb-2">About this Aircraft</h4>
                    <p className="text-slate-300">{listing.aircraft_model.description}</p>
                  </div>
                )}
              </div>
            )}

            {!listing.aircraft_model && (
              <div className="text-center py-8 text-slate-400">
                <Plane className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aircraft specifications not available</p>
              </div>
            )}
          </TabsContent>

          {/* Operator Tab */}
          <TabsContent value="operator" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white text-lg mb-3">Operator Information</h3>
                <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-sm text-slate-400">Company Name</div>
                    <div className="font-semibold text-white text-lg">
                      {listing.operator?.company_name || listing.operator?.full_name || 'Unknown'}
                    </div>
                  </div>

                  {listing.operator && (
                    <TrustBadge
                      trustScore={listing.operator_trust?.trust_score || 0}
                      reputationScore={listing.operator_trust?.reputation_score}
                      verified={listing.operator_trust?.verified}
                      argusRating={listing.operator.argus_rating}
                      wyvernStatus={listing.operator.wyvern_status}
                      avgResponseTime={listing.operator.avg_response_time_minutes}
                      completionRate={listing.operator.completion_rate}
                      totalDeals={listing.operator.total_deals_completed}
                      size="md"
                      showDetails={true}
                    />
                  )}
                </div>
              </div>

              {listing.operator && (
                <div className="grid grid-cols-2 gap-4">
                  {listing.operator.avg_response_time_minutes !== undefined && (
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-sm text-slate-400">Avg Response Time</div>
                      <div className="text-xl font-bold text-white">{listing.operator.avg_response_time_minutes}m</div>
                    </div>
                  )}

                  {listing.operator.completion_rate !== undefined && (
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <div className="text-sm text-slate-400">Completion Rate</div>
                      <div className="text-xl font-bold text-white">{listing.operator.completion_rate.toFixed(1)}%</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        {isBroker && (
          <div className="flex gap-3 pt-6 border-t border-slate-600">
            {onRequestQuote && (
              <Button onClick={() => onRequestQuote(listing.id)} className="flex-1 btn-terminal-accent">
                <Send className="w-4 h-4 mr-2" />
                Request Quote
              </Button>
            )}
            {onContactOperator && (
              <Button 
                onClick={() => onContactOperator(listing.id)}
                variant="outline"
                className="border-slate-600 hover:bg-slate-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Button>
            )}
            {onAddToFavorites && (
              <Button
                onClick={() => onAddToFavorites(listing.id)}
                variant="outline"
                className="border-slate-600 hover:bg-slate-700"
              >
                <Heart className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

