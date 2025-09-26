import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Calendar,
  Users,
  Plane,
  Briefcase,
  AlertTriangle,
  Plus,
  Save,
  Send
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  template_type: 'pilot_hire' | 'crew_hire' | 'aircraft_charter' | 'brokerage_agreement' | 'maintenance_contract';
  content: string;
  variables: Record<string, string>;
  is_active: boolean;
}

interface Deal {
  id: string;
  title: string;
  broker_id: string;
  operator_id: string;
  pilot_id?: string;
  crew_id?: string;
  aircraft_id: string;
  status: string;
  total_amount: number;
  broker_commission: number;
  operator_amount: number;
  start_date: string;
  end_date: string;
  broker: {
    name: string;
    company: string;
    email: string;
  };
  operator: {
    name: string;
    company: string;
    email: string;
  };
  pilot?: {
    name: string;
    email: string;
    certifications: string[];
  };
  crew?: {
    name: string;
    email: string;
    role: string;
  };
  aircraft: {
    make: string;
    model: string;
    registration: string;
  };
}

interface Contract {
  id: string;
  deal_id: string;
  template_id: string;
  contract_number: string;
  title: string;
  content: string;
  pdf_url?: string;
  status: 'draft' | 'pending_review' | 'approved' | 'signed' | 'executed' | 'cancelled';
  parties: Record<string, any>;
  terms: Record<string, any>;
  financial_terms: Record<string, any>;
  dates: Record<string, any>;
  signatures?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface ContractGeneratorProps {
  dealId: string;
  onClose: () => void;
}

const ContractGenerator = React.memo(function ContractGenerator({ dealId, onClose }: ContractGeneratorProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [contractData, setContractData] = useState({
    title: '',
    parties: {} as Record<string, any>,
    terms: {} as Record<string, any>,
    financial_terms: {} as Record<string, any>,
    dates: {} as Record<string, any>
  });
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTemplates: ContractTemplate[] = [
      {
        id: '1',
        name: 'Standard Pilot Hire Agreement',
        description: 'Standard template for hiring pilots',
        template_type: 'pilot_hire',
        content: '<html><body><h1>PILOT HIRE AGREEMENT</h1><p>This agreement is between {{operator_name}} and {{pilot_name}} for the position of {{position}}.</p><p>Start Date: {{start_date}}</p><p>End Date: {{end_date}}</p><p>Hourly Rate: {{hourly_rate}}</p><p>Aircraft: {{aircraft_type}}</p></body></html>',
        variables: {
          operator_name: 'string',
          pilot_name: 'string',
          position: 'string',
          start_date: 'date',
          end_date: 'date',
          hourly_rate: 'currency',
          aircraft_type: 'string'
        },
        is_active: true
      },
      {
        id: '2',
        name: 'Standard Crew Hire Agreement',
        description: 'Standard template for hiring crew members',
        template_type: 'crew_hire',
        content: '<html><body><h1>CREW HIRE AGREEMENT</h1><p>This agreement is between {{operator_name}} and {{crew_name}} for the position of {{position}}.</p><p>Start Date: {{start_date}}</p><p>End Date: {{end_date}}</p><p>Hourly Rate: {{hourly_rate}}</p><p>Aircraft: {{aircraft_type}}</p></body></html>',
        variables: {
          operator_name: 'string',
          crew_name: 'string',
          position: 'string',
          start_date: 'date',
          end_date: 'date',
          hourly_rate: 'currency',
          aircraft_type: 'string'
        },
        is_active: true
      },
      {
        id: '3',
        name: 'Aircraft Charter Agreement',
        description: 'Standard template for aircraft charter agreements',
        template_type: 'aircraft_charter',
        content: '<html><body><h1>AIRCRAFT CHARTER AGREEMENT</h1><p>This agreement is between {{operator_name}} and {{broker_name}} for charter services.</p><p>Flight Date: {{flight_date}}</p><p>Route: {{route}}</p><p>Charter Rate: {{charter_rate}}</p><p>Aircraft: {{aircraft_type}}</p></body></html>',
        variables: {
          operator_name: 'string',
          broker_name: 'string',
          flight_date: 'date',
          route: 'string',
          charter_rate: 'currency',
          aircraft_type: 'string'
        },
        is_active: true
      }
    ];

    const mockDeal: Deal = {
      id: dealId,
      title: 'Gulfstream G650 Charter - NYC to LAX',
      broker_id: 'broker-1',
      operator_id: 'operator-1',
      pilot_id: 'pilot-1',
      crew_id: 'crew-1',
      aircraft_id: 'aircraft-1',
      status: 'confirmed',
      total_amount: 50000,
      broker_commission: 5000,
      operator_amount: 45000,
      start_date: '2024-02-01',
      end_date: '2024-02-05',
      broker: {
        name: 'John Broker',
        company: 'Elite Aviation Brokers',
        email: 'john@eliteaviation.com'
      },
      operator: {
        name: 'Sarah Operator',
        company: 'SkyHigh Operations',
        email: 'sarah@skyhigh.com'
      },
      pilot: {
        name: 'Captain Mike Smith',
        email: 'mike@skyhigh.com',
        certifications: ['ATP', 'G650 Type Rating', 'First Class Medical']
      },
      crew: {
        name: 'Maria Rodriguez',
        email: 'maria@skyhigh.com',
        role: 'Flight Attendant'
      },
      aircraft: {
        make: 'Gulfstream',
        model: 'G650',
        registration: 'N123AB'
      }
    };

    const mockContracts: Contract[] = [
      {
        id: '1',
        deal_id: dealId,
        template_id: '1',
        contract_number: 'CONTRACT-2024-000001',
        title: 'Pilot Hire Agreement - Captain Mike Smith',
        content: '<html><body><h1>PILOT HIRE AGREEMENT</h1><p>This agreement is between SkyHigh Operations and Captain Mike Smith for the position of Senior Captain.</p><p>Start Date: 2024-02-01</p><p>End Date: 2024-02-05</p><p>Hourly Rate: $150.00</p><p>Aircraft: Gulfstream G650</p></body></html>',
        status: 'signed',
        parties: {
          operator: { name: 'SkyHigh Operations', email: 'sarah@skyhigh.com' },
          pilot: { name: 'Captain Mike Smith', email: 'mike@skyhigh.com' }
        },
        terms: {
          position: 'Senior Captain',
          responsibilities: 'Safe operation of aircraft, passenger safety, compliance with regulations'
        },
        financial_terms: {
          hourly_rate: 150.00,
          total_hours: 20,
          total_amount: 3000.00
        },
        dates: {
          start_date: '2024-02-01',
          end_date: '2024-02-05',
          contract_date: '2024-01-20'
        },
        signatures: {
          operator_signed: true,
          pilot_signed: true,
          signed_at: '2024-01-20T10:30:00Z'
        },
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:30:00Z'
      }
    ];

    setTemplates(mockTemplates);
    setDeal(mockDeal);
    setContracts(mockContracts);
    setLoading(false);
  }, [dealId]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setContractData(prev => ({
        ...prev,
        title: template.name,
        parties: {
          operator: deal?.operator,
          broker: deal?.broker,
          pilot: deal?.pilot,
          crew: deal?.crew
        },
        terms: {
          aircraft: deal?.aircraft,
          position: deal?.pilot ? 'Pilot' : 'Crew Member'
        },
        financial_terms: {
          total_amount: deal?.total_amount,
          broker_commission: deal?.broker_commission,
          operator_amount: deal?.operator_amount
        },
        dates: {
          start_date: deal?.start_date,
          end_date: deal?.end_date,
          contract_date: new Date().toISOString().split('T')[0]
        }
      }));
    }
  };

  const handleGenerateContract = async () => {
    if (!selectedTemplate || !deal) return;
    
    setGenerating(true);
    try {
      // TODO: Implement actual API call
      console.log('Generating contract:', { templateId: selectedTemplate, dealId, contractData });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert('Contract generated successfully!');
      onClose();
    } catch (error) {
      console.error('Error generating contract:', error);
      alert('Error generating contract. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadContract = async (contractId: string) => {
    // TODO: Implement actual PDF download
    console.log('Downloading contract:', contractId);
  };

  const handleViewContract = (contractId: string) => {
    // TODO: Implement contract viewer
    console.log('Viewing contract:', contractId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      case 'pending_review': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'signed': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'executed': return 'bg-green-600/20 text-green-600 border-green-600/30';
      case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'pending_review': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'executed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-accent"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <Alert className="bg-terminal-bg border-terminal-border">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-terminal-fg">
          Deal not found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-terminal-fg">Contract Generator</h1>
          <p className="text-terminal-muted">Generate contracts for deal: {deal.title}</p>
        </div>
        <Button variant="outline" onClick={onClose} className="border-terminal-border text-terminal-fg">
          Close
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="bg-terminal-bg border-terminal-border">
          <TabsTrigger value="templates" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="existing" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            <Briefcase className="h-4 w-4 mr-2" />
            Existing Contracts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Template Selection */}
          <Card className="bg-terminal-bg border-terminal-border">
            <CardHeader>
              <CardTitle className="text-terminal-fg">Select Contract Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate === template.id 
                        ? 'border-terminal-accent bg-terminal-accent/10' 
                        : 'border-terminal-border hover:border-terminal-accent/50'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="h-6 w-6 text-terminal-accent" />
                        <h3 className="font-semibold text-terminal-fg">{template.name}</h3>
                      </div>
                      <p className="text-sm text-terminal-muted mb-3">{template.description}</p>
                      <Badge variant="outline" className="border-terminal-border text-terminal-fg">
                        {template.template_type.replace('_', ' ')}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contract Details */}
          {selectedTemplate && (
            <Card className="bg-terminal-bg border-terminal-border">
              <CardHeader>
                <CardTitle className="text-terminal-fg">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-terminal-fg">Contract Title</label>
                    <Input
                      value={contractData.title}
                      onChange={(e) => setContractData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    />
                  </div>
                  <div>
                    <label className="text-terminal-fg">Contract Date</label>
                    <Input
                      type="date"
                      value={contractData.dates.contract_date}
                      onChange={(e) => setContractData(prev => ({
                        ...prev,
                        dates: { ...prev.dates, contract_date: e.target.value }
                      }))}
                      className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-terminal-fg mb-3">Parties</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-terminal-muted">Operator</h5>
                      <p className="text-terminal-fg">{deal.operator.name}</p>
                      <p className="text-sm text-terminal-muted">{deal.operator.company}</p>
                      <p className="text-sm text-terminal-muted">{deal.operator.email}</p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-terminal-muted">Broker</h5>
                      <p className="text-terminal-fg">{deal.broker.name}</p>
                      <p className="text-sm text-terminal-muted">{deal.broker.company}</p>
                      <p className="text-sm text-terminal-muted">{deal.broker.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-terminal-fg mb-3">Financial Terms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-terminal-muted">Total Amount</label>
                      <p className="text-lg font-semibold text-terminal-fg">
                        {formatCurrency(deal.total_amount)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-terminal-muted">Broker Commission</label>
                      <p className="text-lg font-semibold text-terminal-fg">
                        {formatCurrency(deal.broker_commission)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-terminal-muted">Operator Amount</label>
                      <p className="text-lg font-semibold text-terminal-fg">
                        {formatCurrency(deal.operator_amount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleGenerateContract}
                    disabled={generating}
                    className="bg-terminal-accent hover:bg-terminal-accent/90"
                  >
                    {generating ? 'Generating...' : 'Generate Contract'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPreview(true)}
                    className="border-terminal-border text-terminal-fg"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="existing" className="space-y-6">
          {/* Existing Contracts */}
          <Card className="bg-terminal-bg border-terminal-border">
            <CardHeader>
              <CardTitle className="text-terminal-fg">Existing Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              {contracts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Contracts Found</h3>
                  <p className="text-terminal-muted">
                    Generate your first contract using the templates above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map(contract => (
                    <Card key={contract.id} className="bg-terminal-bg border-terminal-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-terminal-fg">{contract.title}</h3>
                              <Badge className={getStatusColor(contract.status)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(contract.status)}
                                  <span>{contract.status.replace('_', ' ')}</span>
                                </div>
                              </Badge>
                            </div>
                            
                            <p className="text-terminal-muted">Contract #{contract.contract_number}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-terminal-muted">
                              <div>
                                <p className="font-semibold">Created</p>
                                <p>{formatDate(contract.created_at)}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Last Updated</p>
                                <p>{formatDate(contract.updated_at)}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Status</p>
                                <p className="capitalize">{contract.status.replace('_', ' ')}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewContract(contract.id)}
                              className="border-terminal-border text-terminal-fg"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadContract(contract.id)}
                              className="border-terminal-border text-terminal-fg"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default ContractGenerator;
