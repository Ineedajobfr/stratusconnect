// Sequential Invoice Generator Component
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calculator,
  Globe,
  Hash,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';
import { sequentialInvoiceHandler } from '@/lib/sequential-invoice-handler';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  dealId?: string;
  transactionId?: string;
}

export interface InvoiceFormData {
  companyCountry: string;
  currency: string;
  customerCountry?: string;
  baseCurrency?: string;
  lineItems: LineItem[];
  notes?: string;
}

export function SequentialInvoiceGenerator() {
  const [formData, setFormData] = useState<InvoiceFormData>({
    companyCountry: 'GB',
    currency: 'GBP',
    customerCountry: 'US',
    baseCurrency: 'GBP',
    lineItems: [
      {
        id: '1',
        description: 'Platform Commission (7%)',
        quantity: 1,
        unitPrice: 5950, // £59.50 in pence
        dealId: 'DEAL_123',
        transactionId: 'TXN_123'
      }
    ],
    notes: ''
  });

  const [generatedInvoice, setGeneratedInvoice] = useState<unknown>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countries = [
    { code: 'GB', name: 'United Kingdom', vatRate: 20 },
    { code: 'DE', name: 'Germany', vatRate: 19 },
    { code: 'FR', name: 'France', vatRate: 20 },
    { code: 'IT', name: 'Italy', vatRate: 22 },
    { code: 'ES', name: 'Spain', vatRate: 21 },
    { code: 'NL', name: 'Netherlands', vatRate: 21 },
    { code: 'CH', name: 'Switzerland', vatRate: 7.7 },
    { code: 'US', name: 'United States', vatRate: 0 },
    { code: 'AU', name: 'Australia', vatRate: 10 },
    { code: 'CA', name: 'Canada', vatRate: 13 },
    { code: 'SG', name: 'Singapore', vatRate: 7 },
    { code: 'HK', name: 'Hong Kong', vatRate: 0 },
    { code: 'AE', name: 'UAE', vatRate: 5 }
  ];

  const currencies = ['GBP', 'USD', 'EUR', 'CHF', 'AUD', 'CAD', 'SGD', 'HKD', 'AED'];

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0
    };
    
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  const removeLineItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const generateInvoice = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.companyCountry || !formData.currency) {
        throw new Error('Please select company country and currency');
      }

      if (formData.lineItems.length === 0) {
        throw new Error('Please add at least one line item');
      }

      if (formData.lineItems.some(item => !item.description || item.unitPrice <= 0)) {
        throw new Error('Please ensure all line items have description and valid price');
      }

      // Generate invoice
      const invoice = await sequentialInvoiceHandler.createSequentialInvoice({
        companyCountry: formData.companyCountry,
        currency: formData.currency,
        customerCountry: formData.customerCountry,
        lineItems: formData.lineItems,
        baseCurrency: formData.baseCurrency,
        notes: formData.notes
      });

      setGeneratedInvoice(invoice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  const getVATRate = (country: string) => {
    const countryData = countries.find(c => c.code === country);
    return countryData?.vatRate || 0;
  };

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    const vatRate = getVATRate(formData.companyCountry);
    const vatAmount = Math.round(subtotal * (vatRate / 100));
    const total = subtotal + vatAmount;

    return { subtotal, vatAmount, total, vatRate };
  };

  const totals = calculateTotals();

  if (generatedInvoice) {
    return (
      <Card className="terminal-card border-green-200 bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 title-glow">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span>Invoice Generated Successfully</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-600">Invoice Number</Label>
              <p className="font-mono font-medium">{generatedInvoice.invoiceNumber}</p>
            </div>
            <div>
              <Label className="text-gray-600">Sequence</Label>
              <p className="font-medium">{generatedInvoice.sequenceNumber}</p>
            </div>
            <div>
              <Label className="text-gray-600">VAT Rate</Label>
              <p className="font-medium">{generatedInvoice.vatRate}%</p>
            </div>
            <div>
              <Label className="text-gray-600">Total Amount</Label>
              <p className="font-medium">{formatCurrency(generatedInvoice.totalAmount, generatedInvoice.currency)}</p>
            </div>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <Label className="text-gray-600">Audit Hash</Label>
            <p className="font-mono text-sm break-all">{generatedInvoice.auditHash}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setGeneratedInvoice(null)} variant="outline">
              Generate Another
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="terminal-card bg-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 title-glow">
          <FileText className="w-6 h-6 text-accent" />
          <span>Sequential Invoice Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-600">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyCountry">Company Country</Label>
            <Select 
              value={formData.companyCountry} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, companyCountry: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name} ({country.vatRate}% VAT)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Invoice Currency</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerCountry">Customer Country (Optional)</Label>
            <Select 
              value={formData.customerCountry || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, customerCountry: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseCurrency">Base Currency (Optional)</Label>
            <Select 
              value={formData.baseCurrency || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, baseCurrency: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select base currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {currencies.map(currency => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Line Items</Label>
            <Button onClick={addLineItem} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {formData.lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-slate-700 rounded-lg">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Deal ID"
                    value={item.dealId || ''}
                    onChange={(e) => updateLineItem(item.id, 'dealId', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {formatCurrency(item.quantity * item.unitPrice, formData.currency)}
                  </Badge>
                  <Button 
                    onClick={() => removeLineItem(item.id)} 
                    variant="ghost" 
                    size="sm"
                    disabled={formData.lineItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Input
            placeholder="Additional notes for the invoice"
            value={formData.notes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-accent" />
            <span className="font-medium">Invoice Summary</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Label className="text-gray-600">Subtotal</Label>
              <p className="font-medium">{formatCurrency(totals.subtotal, formData.currency)}</p>
            </div>
            <div>
              <Label className="text-gray-600">VAT ({totals.vatRate}%)</Label>
              <p className="font-medium">{formatCurrency(totals.vatAmount, formData.currency)}</p>
            </div>
            <div>
              <Label className="text-gray-600">Total</Label>
              <p className="font-medium text-lg">{formatCurrency(totals.total, formData.currency)}</p>
            </div>
            <div>
              <Label className="text-gray-600">Next Invoice #</Label>
              <p className="font-mono text-sm">
                {formData.companyCountry}-{new Date().getFullYear()}{String(new Date().getMonth() + 1).padStart(2, '0')}-XXXXXX
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={generateInvoice}
          disabled={isGenerating}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isGenerating ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Generating Invoice...
            </>
          ) : (
            <>
              <Hash className="w-4 h-4 mr-2" />
              Generate Sequential Invoice
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

