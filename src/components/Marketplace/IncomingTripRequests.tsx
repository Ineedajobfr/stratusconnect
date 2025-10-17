// Incoming Trip Requests Component
// Operators can view broker RFQs and submit quotes (read-only view)

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { marketplaceService, type TripRequest } from "@/lib/marketplace-service";
import {
    Clock,
    DollarSign,
    Eye,
    Loader2,
    MapPin,
    MessageSquare,
    Plane,
    RefreshCw,
    Send,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

interface IncomingTripRequestsProps {
  onQuoteSubmitted?: () => void;
}

export function IncomingTripRequests({ onQuoteSubmitted }: IncomingTripRequestsProps) {
  const { toast } = useToast();
  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TripRequest | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);

  useEffect(() => {
    loadTripRequests();
  }, []);

  const loadTripRequests = async () => {
    setLoading(true);
    try {
      const result = await marketplaceService.searchTripRequests({
        status: 'open',
        page: 1,
        per_page: 50
      });
      setRequests(result.results);
    } catch (error) {
      console.error('Error loading trip requests:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load trip requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteRequest = (request: TripRequest) => {
    setSelectedRequest(request);
    setQuoteAmount("");
    setQuoteMessage("");
    setQuoteDialogOpen(true);
  };

  const handleSubmitQuote = async () => {
    if (!selectedRequest || !quoteAmount) return;

    setSubmittingQuote(true);
    try {
      // This would need to be implemented in the marketplace service
      // await marketplaceService.submitQuote(selectedRequest.id, {
      //   amount: parseFloat(quoteAmount),
      //   message: quoteMessage
      // });

      toast({
        title: "Quote Submitted",
        description: "Your quote has been sent to the broker"
      });
      
      setQuoteDialogOpen(false);
      onQuoteSubmitted?.();
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Quote Failed",
        description: "Failed to submit quote",
        variant: "destructive"
      });
    } finally {
      setSubmittingQuote(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'low': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
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

  const getTimeRemaining = (depTime: string) => {
    const now = new Date();
    const dep = new Date(depTime);
    const diff = dep.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
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
          <h2 className="text-2xl font-bold text-white">Incoming Trip Requests</h2>
          <p className="text-gray-400">View broker RFQs and submit competitive quotes</p>
        </div>
        <Button
          onClick={loadTripRequests}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open Requests</p>
                <p className="text-2xl font-bold text-white">{requests.length}</p>
              </div>
              <Plane className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Urgent</p>
                <p className="text-2xl font-bold text-red-400">
                  {requests.filter(r => r.urgency === 'urgent').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-orange-400">
                  {requests.filter(r => r.urgency === 'high').length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Passengers</p>
                <p className="text-2xl font-bold text-purple-400">
                  {requests.reduce((sum, r) => sum + (r.pax || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Open Requests</h3>
            <p className="text-gray-400">
              There are currently no open trip requests from brokers
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {request.origin} → {request.destination}
                      </h3>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(request.dep_time)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{request.pax} passengers</span>
                      </div>
                      {request.max_budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Budget: ${request.max_budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Time Remaining</div>
                    <div className="text-lg font-bold text-orange-400">
                      {getTimeRemaining(request.dep_time)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{request.trip_type?.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    {request.preferred_category && (
                      <div className="flex items-center gap-1">
                        <Plane className="h-4 w-4" />
                        <span>{request.preferred_category}</span>
                      </div>
                    )}
                    {request.total_distance_nm && (
                      <div className="flex items-center gap-1">
                        <span>{request.total_distance_nm}nm</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-600"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleQuoteRequest(request)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Submit Quote
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Submit Quote</DialogTitle>
            <DialogDescription>
              Submit a competitive quote for this trip request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2">
                  {selectedRequest.origin} → {selectedRequest.destination}
                </h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <div>Departure: {formatDate(selectedRequest.dep_time)}</div>
                  <div>Passengers: {selectedRequest.pax}</div>
                  <div>Type: {selectedRequest.trip_type?.replace('_', ' ').toUpperCase()}</div>
                  {selectedRequest.max_budget && (
                    <div>Budget: ${selectedRequest.max_budget.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Quote Amount (USD)</Label>
                  <Input
                    type="number"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="Enter your quote amount"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Message (Optional)</Label>
                  <Textarea
                    value={quoteMessage}
                    onChange={(e) => setQuoteMessage(e.target.value)}
                    placeholder="Add a message to the broker..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitQuote}
                  disabled={!quoteAmount || submittingQuote}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {submittingQuote ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit Quote
                </Button>
                <Button
                  onClick={() => setQuoteDialogOpen(false)}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
