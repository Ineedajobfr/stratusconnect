import React, { useState } from 'react';
import { Check, X, MessageSquare, DollarSign, Calendar, Plane, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  bidderCompany: string;
  bidAmount: number;
  originalPrice: number;
  submittedAt: Date;
  expiresAt: Date;
  message?: string;
  bidderRating: number;
  totalDeals: number;
  verificationStatus: 'verified' | 'pending' | 'basic';
}

interface Aircraft {
  id: string;
  model: string;
  tailNumber: string;
  route: string;
  date: Date;
  minBid: number;
  askingPrice: number;
}

interface BidWorkflowProps {
  aircraft: Aircraft;
  bids: Bid[];
  onAcceptBid: (bidId: string, bid: Bid) => void;
  onRejectBid: (bidId: string) => void;
  onClose: () => void;
  demoMode?: boolean;
}

export const BidWorkflow: React.FC<BidWorkflowProps> = ({
  aircraft,
  bids,
  onAcceptBid,
  onRejectBid,
  onClose,
  demoMode = false
}) => {
  const [processingBid, setProcessingBid] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAcceptBid = async (bid: Bid) => {
    setProcessingBid(bid.id);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onAcceptBid(bid.id, bid);
      
      toast({
        title: "Bid Accepted!",
        description: `Deal confirmed with ${bid.bidderCompany} for $${bid.bidAmount.toLocaleString()}. Secure messaging now enabled.`,
      });

      if (demoMode) {
        toast({
          title: "Demo Mode",
          description: "In production, this would create a real deal and enable messaging.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingBid(null);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    setProcessingBid(bidId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      onRejectBid(bidId);
      
      toast({
        title: "Bid Rejected",
        description: "Bid has been declined and broker has been notified.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingBid(null);
    }
  };

  const getVerificationBadge = (status: Bid['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500">Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Basic</Badge>;
    }
  };

  const calculateSavings = (bid: Bid) => {
    const savings = aircraft.askingPrice - bid.bidAmount;
    const percentage = ((savings / aircraft.askingPrice) * 100);
    return { savings, percentage };
  };

  const sortedBids = [...bids].sort((a, b) => b.bidAmount - a.bidAmount);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto terminal-card">
        <CardHeader className="border-b border-terminal-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Plane className="w-5 h-5" />
                <span>{aircraft.model} - {aircraft.tailNumber}</span>
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{aircraft.route}</span>
                </span>
                <span>{aircraft.date.toLocaleDateString()}</span>
                <Badge className="bg-terminal-info/20 text-terminal-info border-terminal-info">
                  {bids.length} Bid{bids.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Pricing Overview */}
          <Card className="mb-6 terminal-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-terminal-success">
                    ${aircraft.askingPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Asking Price</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-terminal-warning">
                    ${aircraft.minBid.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Minimum Bid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-terminal-info">
                    ${sortedBids[0]?.bidAmount.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Highest Bid</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bids List */}
          <div className="space-y-4">
            {sortedBids.length === 0 ? (
              <Card className="terminal-card">
                <CardContent className="p-8 text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground">No bids received yet</p>
                  <p className="text-sm text-muted-foreground">Bids will appear here when brokers submit them</p>
                </CardContent>
              </Card>
            ) : (
              sortedBids.map((bid, index) => {
                const { savings, percentage } = calculateSavings(bid);
                const isProcessing = processingBid === bid.id;
                
                return (
                  <Card key={bid.id} className={`terminal-card ${index === 0 ? 'ring-2 ring-terminal-success/30' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">{bid.bidderName}</span>
                              {getVerificationBadge(bid.verificationStatus)}
                            </div>
                            {index === 0 && (
                              <Badge className="bg-terminal-success/20 text-terminal-success border-terminal-success">
                                Highest Bid
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-3">
                            {bid.bidderCompany} • {bid.totalDeals} deals completed • {bid.bidderRating}/5 rating
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-2xl font-bold text-terminal-success">
                                ${bid.bidAmount.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">Bid Amount</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-terminal-info">
                                {savings > 0 ? '-' : '+'}${Math.abs(savings).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                vs Asking ({percentage > 0 ? '-' : '+'}{Math.abs(percentage).toFixed(1)}%)
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Expires: {bid.expiresAt.toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Submitted: {bid.submittedAt.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>

                          {bid.message && (
                            <div className="bg-terminal-card/30 p-3 rounded-lg mb-4">
                              <p className="text-sm text-foreground italic">"{bid.message}"</p>
                            </div>
                          )}

                          {bid.bidAmount < aircraft.minBid && (
                            <div className="flex items-center space-x-2 text-orange-500 mb-4">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-sm">Below minimum bid threshold</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-6">
                          <Button
                            onClick={() => handleAcceptBid(bid)}
                            disabled={isProcessing || bid.bidAmount < aircraft.minBid}
                            className="bg-terminal-success hover:bg-terminal-success/80 text-white min-w-24"
                          >
                            {isProcessing ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processing</span>
                              </div>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Accept
                              </>
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => handleRejectBid(bid.id)}
                            disabled={isProcessing}
                            className="border-red-500 text-red-500 hover:bg-red-500/10 min-w-24"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Action Summary */}
          {sortedBids.length > 0 && (
            <Card className="mt-6 terminal-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <span>💡 Accepting a bid will:</span>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Enable secure messaging</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4" />
                      <span>Create confirmed deal</span>
                    </div>
                  </div>
                  {demoMode && (
                    <Badge variant="outline" className="border-terminal-warning text-terminal-warning">
                      Demo Mode
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};