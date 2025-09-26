// Escrow Management Component - Industry Standard
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  FileText,
  MessageSquare,
  Download
} from 'lucide-react';
import { paymentService, type EscrowAccount } from '@/lib/payment-service';
import { toast } from '@/hooks/use-toast';

interface EscrowManagerProps {
  userId: string;
  role: 'broker' | 'operator';
}

export function EscrowManager({ userId, role }: EscrowManagerProps) {
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<EscrowAccount | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [releaseReason, setReleaseReason] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState('');

  useEffect(() => {
    loadEscrowAccounts();
  }, [userId, role]);

  const loadEscrowAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await paymentService.getEscrowAccounts(userId, role);
      setEscrowAccounts(accounts);
    } catch (error) {
      console.error('Error loading escrow accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseEscrow = async (accountId: string) => {
    try {
      await paymentService.releaseEscrow(accountId, releaseReason);
      await loadEscrowAccounts();
      setShowReleaseModal(false);
      setReleaseReason('');
      toast({
        title: "Funds Released",
        description: "Escrow funds have been released successfully.",
      });
    } catch (error) {
      console.error('Error releasing escrow:', error);
      toast({
        title: "Release Failed",
        description: "Failed to release funds. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRefundEscrow = async (accountId: string) => {
    try {
      await paymentService.refundEscrow(accountId, 'Refund requested by broker');
      await loadEscrowAccounts();
      toast({
        title: "Refund Processed",
        description: "Funds have been refunded successfully.",
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: "Refund Failed",
        description: "Failed to process refund. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateDispute = async (accountId: string) => {
    try {
      await paymentService.createDispute(accountId, disputeReason, [disputeEvidence]);
      await loadEscrowAccounts();
      setShowDisputeModal(false);
      setDisputeReason('');
      setDisputeEvidence('');
      toast({
        title: "Dispute Created",
        description: "Your dispute has been submitted and is under review.",
      });
    } catch (error) {
      console.error('Error creating dispute:', error);
      toast({
        title: "Dispute Failed",
        description: "Failed to create dispute. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'held': return 'bg-yellow-500/20 text-yellow-400';
      case 'released': return 'bg-green-500/20 text-green-400';
      case 'refunded': return 'bg-blue-500/20 text-blue-400';
      case 'disputed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'held': return <Clock className="w-4 h-4" />;
      case 'released': return <CheckCircle className="w-4 h-4" />;
      case 'refunded': return <DollarSign className="w-4 h-4" />;
      case 'disputed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
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

  if (loading) {
    return (
      <Card className="terminal-card">
        <CardContent className="text-center py-12">
          <Clock className="w-8 h-8 mx-auto mb-4 animate-spin text-accent" />
          <p className="text-gunmetal">Loading escrow accounts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Escrow Management</h2>
          <p className="text-gunmetal">Manage your escrow accounts and fund releases</p>
        </div>
        <Badge className="bg-accent/20 text-accent">
          {escrowAccounts.length} Account{escrowAccounts.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {escrowAccounts.length === 0 ? (
        <Card className="terminal-card">
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-30 text-gunmetal" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Escrow Accounts</h3>
            <p className="text-gunmetal">Escrow accounts will appear here when payments are processed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {escrowAccounts.map((account) => (
            <Card key={account.id} className="terminal-card hover:terminal-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent" />
                    <div>
                      <CardTitle className="text-lg">
                        Escrow Account #{account.id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-gunmetal">
                        Created {formatDate(account.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(account.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(account.status)}
                        {account.status}
                      </div>
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAccount(account)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gunmetal">Amount</p>
                    <p className="text-xl font-bold text-foreground">
                      {account.currency} {account.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gunmetal">Role</p>
                    <p className="text-sm text-foreground capitalize">{role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gunmetal">Status</p>
                    <p className="text-sm text-foreground capitalize">{account.status}</p>
                  </div>
                </div>

                {account.status === 'held' && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Release Conditions</h4>
                      <ul className="space-y-1">
                        {account.releaseConditions.map((condition, index) => (
                          <li key={index} className="text-sm text-gunmetal flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      {role === 'broker' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setSelectedAccount(account);
                              setShowReleaseModal(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Release Funds
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefundEscrow(account.id)}
                          >
                            <DollarSign className="w-4 h-4 mr-1" />
                            Refund
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDisputeModal(true);
                        }}
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Create Dispute
                      </Button>
                    </div>
                  </div>
                )}

                {account.status === 'disputed' && account.disputeReason && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="font-medium text-red-400 mb-1">Dispute Details</h4>
                    <p className="text-sm text-gunmetal">{account.disputeReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Release Modal */}
      {showReleaseModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle>Release Escrow Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gunmetal mb-2">
                  Release {selectedAccount.currency} {selectedAccount.amount.toLocaleString()} to the operator?
                </p>
                <Textarea
                  placeholder="Reason for release (optional)"
                  value={releaseReason}
                  onChange={(e) => setReleaseReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReleaseModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReleaseEscrow(selectedAccount.id)}
                  className="flex-1"
                >
                  Release Funds
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle>Create Dispute</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gunmetal mb-2">
                  Create a dispute for {selectedAccount.currency} {selectedAccount.amount.toLocaleString()}
                </p>
                <Textarea
                  placeholder="Reason for dispute"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Evidence or additional information"
                  value={disputeEvidence}
                  onChange={(e) => setDisputeEvidence(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDisputeModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCreateDispute(selectedAccount.id)}
                  className="flex-1"
                >
                  Create Dispute
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
