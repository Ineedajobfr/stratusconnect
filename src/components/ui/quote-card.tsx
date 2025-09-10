import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Plane, DollarSign, CheckCircle } from "lucide-react";

interface Quote {
  id: string;
  price: number;
  currency: string;
  status: string;
  created_at: string;
  companies?: {
    name: string;
  };
  aircraft?: {
    model: string;
    tail_number: string;
  };
}

interface QuoteCardProps {
  quote: Quote;
  onAccept?: () => void;
  canAccept?: boolean;
  showOperator?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  onAccept,
  canAccept = false,
  showOperator = true
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getStatusIcon(quote.status)}
            <CardTitle className="text-lg">
              {formatPrice(quote.price, quote.currency)}
            </CardTitle>
          </div>
          <Badge className={getStatusColor(quote.status)}>
            {quote.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(quote.created_at)}
          </span>
          {showOperator && quote.companies && (
            <span className="flex items-center gap-1">
              <Plane className="h-3 w-3" />
              {quote.companies.name}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {quote.aircraft && (
          <div className="mb-3 p-2 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <Plane className="h-4 w-4 text-gray-600" />
              <span className="font-medium">{quote.aircraft.model}</span>
              <span className="text-gray-500">({quote.aircraft.tail_number})</span>
            </div>
          </div>
        )}
        
        {canAccept && quote.status === 'pending' && (
          <Button 
            onClick={onAccept}
            className="w-full"
            size="sm"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept Quote
          </Button>
        )}
        
        {quote.status === 'accepted' && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Quote Accepted
          </div>
        )}
        
        {quote.status === 'rejected' && (
          <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Quote Rejected
          </div>
        )}
      </CardContent>
    </Card>
  );
};
