// Monthly Statements and VAT Invoices
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  Receipt,
  Building,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export interface MonthlyStatement {
  id: string;
  userId: string;
  userType: 'broker' | 'operator';
  period: string; // YYYY-MM
  currency: string;
  totalTransactions: number;
  totalVolume: number; // in minor units
  totalFees: number; // in minor units
  netPayout: number; // in minor units
  stripePayouts: number; // in minor units
  reconciliation: {
    status: 'matched' | 'mismatch' | 'pending';
    difference: number;
    lastChecked: string;
  };
  transactions: StatementTransaction[];
  generatedAt: string;
  downloadUrl: string;
}

export interface StatementTransaction {
  id: string;
  date: string;
  type: 'deal' | 'hiring' | 'refund' | 'adjustment';
  description: string;
  amount: number; // in minor units
  currency: string;
  fee: number; // in minor units
  net: number; // in minor units
  stripeTransactionId: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface VATInvoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  userType: 'broker' | 'operator';
  period: string;
  currency: string;
  vatRate: number; // percentage
  vatNumber: string;
  companyName: string;
  companyAddress: string;
  lineItems: VATLineItem[];
  subtotal: number; // in minor units
  vatAmount: number; // in minor units
  total: number; // in minor units
  generatedAt: string;
  downloadUrl: string;
}

export interface VATLineItem {
  description: string;
  quantity: number;
  unitPrice: number; // in minor units
  total: number; // in minor units
  vatRate: number; // percentage
  vatAmount: number; // in minor units
}

export function MonthlyStatements() {
  const [statements, setStatements] = useState<MonthlyStatement[]>([]);
  const [invoices, setInvoices] = useState<VATInvoice[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<'broker' | 'operator'>('broker');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatements();
    loadInvoices();
  }, [selectedPeriod, selectedUserType]);

  const loadStatements = async () => {
    setLoading(true);
    // Free tier: Use mock data instead of API calls
    const mockStatements: MonthlyStatement[] = [
      {
        id: 'STMT_001',
        userId: 'user_001',
        userType: 'broker',
        period: '2024-01',
        currency: 'GBP',
        totalTransactions: 23,
        totalVolume: 2500000, // £25,000
        totalFees: 175000, // £1,750 (7%)
        netPayout: 2325000, // £23,250
        stripePayouts: 2325000, // £23,250
        reconciliation: {
          status: 'matched',
          difference: 0,
          lastChecked: '2024-01-16T10:00:00Z'
        },
        transactions: [
          {
            id: 'TXN_001',
            date: '2024-01-15T14:30:00Z',
            type: 'deal',
            description: 'LHR to JFK - Gulfstream G650',
            amount: 1000000, // £10,000
            currency: 'GBP',
            fee: 70000, // £700
            net: 930000, // £9,300
            stripeTransactionId: 'pi_1234567890',
            status: 'completed'
          }
        ],
        generatedAt: '2024-01-16T09:00:00Z',
        downloadUrl: '/api/statements/STMT_001/download'
      }
    ];
    setStatements(mockStatements);
    setLoading(false);
  };

  const loadInvoices = async () => {
    // Mock data - in production would load from API
    const mockInvoices: VATInvoice[] = [
      {
        id: 'INV_001',
        invoiceNumber: 'SC-2024-001',
        userId: 'user_001',
        userType: 'broker',
        period: '2024-01',
        currency: 'GBP',
        vatRate: 20, // 20% VAT
        vatNumber: 'GB123456789',
        companyName: 'Test Aviation Ltd',
        companyAddress: '123 Aviation Street, London, UK',
        lineItems: [
          {
            description: 'Platform Commission (7%)',
            quantity: 1,
            unitPrice: 175000, // £1,750
            total: 175000, // £1,750
            vatRate: 20,
            vatAmount: 35000, // £350
          }
        ],
        subtotal: 175000, // £1,750
        vatAmount: 35000, // £350
        total: 210000, // £2,100
        generatedAt: '2024-01-16T09:00:00Z',
        downloadUrl: '/api/invoices/INV_001/download'
      }
    ];
    setInvoices(mockInvoices);
  };

  const generateStatement = async () => {
    if (!selectedPeriod) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newStatement: MonthlyStatement = {
      id: `STMT_${Date.now()}`,
      userId: 'user_001',
      userType: selectedUserType,
      period: selectedPeriod,
      currency: 'GBP',
      totalTransactions: 0,
      totalVolume: 0,
      totalFees: 0,
      netPayout: 0,
      stripePayouts: 0,
      reconciliation: {
        status: 'pending',
        difference: 0,
        lastChecked: new Date().toISOString()
      },
      transactions: [],
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/statements/STMT_${Date.now()}/download`
    };
    
    setStatements(prev => [newStatement, ...prev]);
    setLoading(false);
  };

  const generateInvoice = async (statementId: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statement = statements.find(s => s.id === statementId);
    if (!statement) return;
    
    const newInvoice: VATInvoice = {
      id: `INV_${Date.now()}`,
      invoiceNumber: `SC-${statement.period.replace('-', '-')}-${Date.now().toString().slice(-4)}`,
      userId: statement.userId,
      userType: statement.userType,
      period: statement.period,
      currency: statement.currency,
      vatRate: 20,
      vatNumber: 'GB123456789',
      companyName: 'Test Aviation Ltd',
      companyAddress: '123 Aviation Street, London, UK',
      lineItems: [
        {
          description: 'Platform Commission (7%)',
          quantity: 1,
          unitPrice: statement.totalFees,
          total: statement.totalFees,
          vatRate: 20,
          vatAmount: Math.round(statement.totalFees * 0.2),
        }
      ],
      subtotal: statement.totalFees,
      vatAmount: Math.round(statement.totalFees * 0.2),
      total: statement.totalFees + Math.round(statement.totalFees * 0.2),
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/invoices/INV_${Date.now()}/download`
    };
    
    setInvoices(prev => [newInvoice, ...prev]);
    setLoading(false);
  };

  const downloadStatement = (statementId: string) => {
    const statement = statements.find(s => s.id === statementId);
    if (statement) {
      // In production, this would trigger actual download
      console.log('Downloading statement:', statement.downloadUrl);
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
      // In production, this would trigger actual download
      console.log('Downloading invoice:', invoice.downloadUrl);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  };

  const getReconciliationStatus = (status: string) => {
    switch (status) {
      case 'matched':
        return { color: 'green', icon: CheckCircle, text: 'Matched' };
      case 'mismatch':
        return { color: 'red', icon: AlertCircle, text: 'Mismatch' };
      case 'pending':
        return { color: 'yellow', icon: AlertCircle, text: 'Pending' };
      default:
        return { color: 'gray', icon: AlertCircle, text: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate New Statement */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Statement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                placeholder="2024-01"
              />
            </div>
            
            <div>
              <Label htmlFor="userType">User Type</Label>
              <Select value={selectedUserType} onValueChange={(value: 'broker' | 'operator') => setSelectedUserType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-48">
                  <SelectItem value="broker">Broker</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={generateStatement} 
                disabled={!selectedPeriod || loading}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Statement'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statements */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Monthly Statements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statements.map(statement => {
              const reconciliation = getReconciliationStatus(statement.reconciliation.status);
              const ReconciliationIcon = reconciliation.icon;
              
              return (
                <Card key={statement.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          {statement.period} - {statement.userType.charAt(0).toUpperCase() + statement.userType.slice(1)}
                        </h3>
                        <Badge variant="outline" className={
                          reconciliation.color === 'green' ? 'text-green-600' :
                          reconciliation.color === 'red' ? 'text-red-600' :
                          'text-yellow-600'
                        }>
                          <ReconciliationIcon className="w-3 h-3 mr-1" />
                          {reconciliation.text}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Transactions: </span>
                          <span className="font-medium">{statement.totalTransactions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Volume: </span>
                          <span className="font-medium">{formatCurrency(statement.totalVolume, statement.currency)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Fees: </span>
                          <span className="font-medium">{formatCurrency(statement.totalFees, statement.currency)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Net Payout: </span>
                          <span className="font-medium">{formatCurrency(statement.netPayout, statement.currency)}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Generated: {new Date(statement.generatedAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadStatement(statement.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadStatement(statement.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => generateInvoice(statement.id)}
                        disabled={loading}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        VAT Invoice
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* VAT Invoices */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            VAT Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map(invoice => (
              <Card key={invoice.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                      <Badge variant="outline" className="text-blue-600">
                        VAT Invoice
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Company: </span>
                        <span className="font-medium">{invoice.companyName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">VAT Number: </span>
                        <span className="font-medium">{invoice.vatNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Subtotal: </span>
                        <span className="font-medium">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">VAT ({invoice.vatRate}%): </span>
                        <span className="font-medium">{formatCurrency(invoice.vatAmount, invoice.currency)}</span>
                      </div>
                    </div>
                    
                    <div className="text-lg font-semibold mb-2">
                      Total: {formatCurrency(invoice.total, invoice.currency)}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Generated: {new Date(invoice.generatedAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadInvoice(invoice.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
