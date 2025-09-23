// ============================================================================
// Workflow Automation - Smart Templates & Bulk Operations
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  FileText, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Users,
  Plane,
  DollarSign,
  Calendar,
  Bell,
  ArrowRight,
  BarChart3,
  Brain,
  RefreshCw
} from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'rfq' | 'communication' | 'followup' | 'reporting';
  steps: WorkflowStep[];
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
}

interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'delay' | 'notification';
  title: string;
  description: string;
  config: any;
  order: number;
}

interface BulkOperation {
  id: string;
  name: string;
  type: 'rfq' | 'quotes' | 'clients' | 'reports';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  processedItems: number;
  startTime?: Date;
  endTime?: Date;
  errors?: string[];
}

export const WorkflowAutomation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'rfq' as const
  });

  useEffect(() => {
    loadTemplates();
    loadBulkOperations();
  }, []);

  const loadTemplates = () => {
    const mockTemplates: WorkflowTemplate[] = [
      {
        id: '1',
        name: 'Standard RFQ Creation',
        description: 'Automated RFQ creation with validation and client notification',
        category: 'rfq',
        isActive: true,
        usageCount: 45,
        lastUsed: new Date(Date.now() - 1000 * 60 * 30),
        steps: [
          {
            id: '1',
            type: 'action',
            title: 'Validate Route Data',
            description: 'Check IATA codes and route validity',
            config: { validateIATA: true, checkRoute: true },
            order: 1
          },
          {
            id: '2',
            type: 'action',
            title: 'Calculate Pricing',
            description: 'Run AI pricing analysis',
            config: { useAI: true, includeFuel: true },
            order: 2
          },
          {
            id: '3',
            type: 'notification',
            title: 'Notify Client',
            description: 'Send RFQ confirmation to client',
            config: { email: true, sms: false },
            order: 3
          }
        ]
      },
      {
        id: '2',
        name: 'Quote Follow-up Sequence',
        description: 'Automated follow-up for pending quotes',
        category: 'followup',
        isActive: true,
        usageCount: 23,
        lastUsed: new Date(Date.now() - 1000 * 60 * 60),
        steps: [
          {
            id: '1',
            type: 'delay',
            title: 'Wait 24 Hours',
            description: 'Wait for initial response',
            config: { hours: 24 },
            order: 1
          },
          {
            id: '2',
            type: 'notification',
            title: 'Send Reminder',
            description: 'Send follow-up email to operator',
            config: { template: 'quote_reminder' },
            order: 2
          },
          {
            id: '3',
            type: 'condition',
            title: 'Check Response',
            description: 'If no response, escalate',
            config: { escalateAfter: 48 },
            order: 3
          }
        ]
      },
      {
        id: '3',
        name: 'Weekly Performance Report',
        description: 'Generate and send weekly performance reports',
        category: 'reporting',
        isActive: false,
        usageCount: 8,
        lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        steps: [
          {
            id: '1',
            type: 'action',
            title: 'Collect Data',
            description: 'Gather metrics and performance data',
            config: { includeMetrics: true, includeRevenue: true },
            order: 1
          },
          {
            id: '2',
            type: 'action',
            title: 'Generate Report',
            description: 'Create PDF report with charts',
            config: { format: 'PDF', includeCharts: true },
            order: 2
          },
          {
            id: '3',
            type: 'notification',
            title: 'Send Report',
            description: 'Email report to management',
            config: { recipients: ['manager@company.com'] },
            order: 3
          }
        ]
      }
    ];
    setTemplates(mockTemplates);
  };

  const loadBulkOperations = () => {
    const mockOperations: BulkOperation[] = [
      {
        id: '1',
        name: 'Bulk RFQ Creation',
        type: 'rfq',
        status: 'completed',
        progress: 100,
        totalItems: 25,
        processedItems: 25,
        startTime: new Date(Date.now() - 1000 * 60 * 10),
        endTime: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: '2',
        name: 'Quote Analysis',
        type: 'quotes',
        status: 'running',
        progress: 65,
        totalItems: 150,
        processedItems: 98,
        startTime: new Date(Date.now() - 1000 * 60 * 3)
      },
      {
        id: '3',
        name: 'Client Communication',
        type: 'clients',
        status: 'failed',
        progress: 30,
        totalItems: 50,
        processedItems: 15,
        startTime: new Date(Date.now() - 1000 * 60 * 15),
        errors: ['Invalid email addresses', 'Template not found']
      }
    ];
    setBulkOperations(mockOperations);
  };

  const createTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) return;

    const template: WorkflowTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      isActive: false,
      usageCount: 0,
      steps: []
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', description: '', category: 'rfq' });
    setIsCreatingTemplate(false);
  };

  const toggleTemplate = (templateId: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, isActive: !template.isActive }
          : template
      )
    );
  };

  const runTemplate = (templateId: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { 
              ...template, 
              usageCount: template.usageCount + 1,
              lastUsed: new Date()
            }
          : template
      )
    );
    
    // Simulate template execution
    alert(`Running template: ${templates.find(t => t.id === templateId)?.name}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rfq': return <FileText className="w-4 h-4" />;
      case 'communication': return <Users className="w-4 h-4" />;
      case 'followup': return <Bell className="w-4 h-4" />;
      case 'reporting': return <BarChart3 className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'running': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'failed': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-bright">Workflow Automation</h2>
          <p className="text-text/70">Automate repetitive tasks and streamline operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-terminal-border text-text hover:bg-surface-2"
            onClick={() => setIsCreatingTemplate(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
          <Button
            className="bg-brand hover:bg-brand-600 text-text"
          >
            <Play className="w-4 h-4 mr-2" />
            Run All Active
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-surface-2">
          <TabsTrigger value="templates" className="data-[state=active]:bg-brand data-[state=active]:text-text">
            Templates
          </TabsTrigger>
          <TabsTrigger value="operations" className="data-[state=active]:bg-brand data-[state=active]:text-text">
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-brand data-[state=active]:text-text">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {/* Create New Template */}
          {isCreatingTemplate && (
            <Card className="card-predictive">
              <CardHeader>
                <CardTitle className="text-bright">Create New Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Template name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-surface-2 border-terminal-border text-text placeholder:text-text/50"
                  />
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-surface-2 border-terminal-border text-text">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rfq">RFQ Management</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="reporting">Reporting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Template description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-surface-2 border-terminal-border text-text placeholder:text-text/50"
                />
                <div className="flex gap-2">
                  <Button onClick={createTemplate} className="bg-brand hover:bg-brand-600 text-text">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreatingTemplate(false)}
                    className="border-terminal-border text-text hover:bg-surface-2"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Templates List */}
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="card-predictive">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand/20 rounded-lg">
                        {getCategoryIcon(template.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-bright">{template.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={template.isActive ? 'border-green-400 text-green-400' : 'border-gray-400 text-gray-400'}
                          >
                            {template.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-text/70 mb-2">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-text/50">
                          <span>{template.steps.length} steps</span>
                          <span>Used {template.usageCount} times</span>
                          {template.lastUsed && (
                            <span>Last used: {template.lastUsed.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runTemplate(template.id)}
                        className="border-brand/30 text-brand hover:bg-brand/10"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleTemplate(template.id)}
                        className="border-terminal-border text-text hover:bg-surface-2"
                      >
                        {template.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-terminal-border text-text hover:bg-surface-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bulk Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="text-bright">Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkOperations.map((operation) => (
                  <div key={operation.id} className="p-4 bg-surface-2 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand/20 rounded-lg">
                          <Zap className="w-4 h-4 text-brand" />
                        </div>
                        <div>
                          <h4 className="font-medium text-text">{operation.name}</h4>
                          <p className="text-sm text-text/70 capitalize">
                            {operation.type} • {operation.totalItems} items
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-surface-1 rounded-full h-2 mb-3">
                      <div
                        className="bg-brand h-2 rounded-full transition-all duration-500"
                        style={{ width: `${operation.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-text/70">
                      <span>{operation.processedItems} / {operation.totalItems} processed</span>
                      <span>{operation.progress}% complete</span>
                    </div>
                    
                    {operation.errors && operation.errors.length > 0 && (
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">Errors:</span>
                        </div>
                        {operation.errors.map((error, index) => (
                          <p key={index} className="text-xs text-red-400">• {error}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-predictive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-text/70">Templates Executed</p>
                    <p className="text-2xl font-bold text-bright">1,247</p>
                    <p className="text-xs text-green-400">+23% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-text/70">Time Saved</p>
                    <p className="text-2xl font-bold text-bright">342h</p>
                    <p className="text-xs text-blue-400">This month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-text/70">Success Rate</p>
                    <p className="text-2xl font-bold text-bright">94.2%</p>
                    <p className="text-xs text-purple-400">+2.1% improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="text-bright">Automation Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-surface-2 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-brand/50 mx-auto mb-2" />
                  <p className="text-text/70">Performance charts would be here</p>
                  <p className="text-xs text-text/50">Integration with analytics library</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
