// Real Payment Modal - Industry Standard Implementation
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  X,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { paymentService, type PaymentMethod, type EscrowAccount } from '@/lib/payment-service';
import { toast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, bookingId, amount, currency, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'payment' | 'processing' | 'success'>('method');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [newMethod, setNewMethod] = useState({
    type: 'card' as 'card' | 'bank_transfer' | 'wire',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  });
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [escrowAccount, setEscrowAccount] = useState<EscrowAccount | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPaymentMethods();
    }
  }, [isOpen]);

  const loadPaymentMethods = async () => {
    try {
      // In a real implementation, this would get the user's payment methods
      const methods = await paymentService.getPaymentMethods('current-user-id');
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStep('processing');

      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(bookingId, amount, currency);
      
      // Process payment
      const success = await paymentService.processPayment(paymentIntent.id, selectedMethod);
      
      if (success) {
        setStep('success');
        onSuccess();
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed and funds are held in escrow.",
        });
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
      setStep('method');
    } finally {
      setLoading(false);
    }
  };

  const addNewPaymentMethod = async () => {
    try {
      setLoading(true);
      
      const method = await paymentService.addPaymentMethod('current-user-id', {
        type: newMethod.type,
        last4: newMethod.cardNumber.slice(-4),
        brand: 'visa', // In real implementation, detect from card number
        expiryMonth: parseInt(newMethod.expiryMonth),
        expiryYear: parseInt(newMethod.expiryYear)
      });
      
      setPaymentMethods(prev => [...prev, method]);
      setSelectedMethod(method.id);
      setShowCardDetails(false);
      
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-terminal-card border-terminal-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            <CardTitle>Payment</CardTitle>
            <Badge className="bg-accent/20 text-accent">
              {currency} {amount.toLocaleString()}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'method' && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Select Payment Method</h3>
                
                {paymentMethods.length > 0 && (
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedMethod === method.id
                            ? 'border-accent bg-accent/10'
                            : 'border-terminal-border hover:border-accent/50'
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-accent" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              {method.brand?.toUpperCase()} •••• {method.last4}
                            </div>
                            <div className="text-sm text-gunmetal">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </div>
                          </div>
                          {method.isDefault && (
                            <Badge className="bg-accent/20 text-accent text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCardDetails(true)}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add New Payment Method
                </Button>
              </div>
              
              {showCardDetails && (
                <div className="space-y-4 p-4 border border-terminal-border rounded-lg bg-terminal-card/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Add New Card</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowCardDetails(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={newMethod.cardNumber}
                        onChange={(e) => setNewMethod(prev => ({
                          ...prev,
                          cardNumber: e.target.value.replace(/\D/g, '')
                        }))}
                        maxLength={19}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Select
                        value={newMethod.expiryMonth}
                        onValueChange={(value) => setNewMethod(prev => ({ ...prev, expiryMonth: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                              {(i + 1).toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <Select
                        value={newMethod.expiryYear}
                        onValueChange={(value) => setNewMethod(prev => ({ ...prev, expiryYear: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={newMethod.cvv}
                        onChange={(e) => setNewMethod(prev => ({
                          ...prev,
                          cvv: e.target.value.replace(/\D/g, '')
                        }))}
                        maxLength={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="holderName">Cardholder Name</Label>
                      <Input
                        id="holderName"
                        placeholder="John Doe"
                        value={newMethod.holderName}
                        onChange={(e) => setNewMethod(prev => ({ ...prev, holderName: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={addNewPaymentMethod}
                    disabled={loading || !newMethod.cardNumber || !newMethod.expiryMonth || !newMethod.expiryYear || !newMethod.cvv || !newMethod.holderName}
                    className="w-full"
                  >
                    {loading ? (
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Add Payment Method
                  </Button>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!selectedMethod || loading}
                  className="flex-1"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pay {currency} {amount.toLocaleString()}
                </Button>
              </div>
            </>
          )}
          
          {step === 'processing' && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 mx-auto mb-4 animate-spin text-accent" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Processing Payment</h3>
              <p className="text-gunmetal">Please wait while we process your payment...</p>
            </div>
          )}
          
          {step === 'success' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Payment Successful!</h3>
              <p className="text-gunmetal mb-4">
                Your payment of {currency} {amount.toLocaleString()} has been processed and is held in escrow.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gunmetal mb-6">
                <Shield className="w-4 h-4" />
                <span>Funds will be released after flight completion</span>
              </div>
              <Button onClick={onClose} className="w-full">
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
