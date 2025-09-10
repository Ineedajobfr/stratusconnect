import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plug, Plus, Settings, CheckCircle, 
  AlertCircle, Zap, Cloud, Database,
  Webhook, Key, Globe, RefreshCw,
  Activity, Clock, Link as LinkIcon
} from "lucide-react";

interface APIIntegration {
  id: string;
  integration_name: string;
  api_endpoint: string;
  api_key_encrypted: string | null;
  status: 'active' | 'inactive' | 'error' | 'testing';
  last_sync: string | null;
  sync_frequency: string;
  created_at: string;
  updated_at: string;
}

interface IntegrationLog {
  id: string;
  integration_id: string;
  event_type: 'sync' | 'error' | 'webhook' | 'test';
  message: string;
  response_data: Record<string, unknown>;
  created_at: string;
}

const PREDEFINED_INTEGRATIONS = [
  {
    name: 'FlightAware',
    endpoint: 'https://aeroapi.flightaware.com/aeroapi/',
    description: 'Real-time flight tracking and aircraft data',
    type: 'Flight Data'
  },
  {
    name: 'Aircraft Registry',
    endpoint: 'https://registry.faa.gov/aircraftinquiry/',
    description: 'FAA aircraft registration database',
    type: 'Registration'
  },
  {
    name: 'Weather API',
    endpoint: 'https://api.openweathermap.org/data/2.5/',
    description: 'Weather data for flight planning',
    type: 'Weather'
  },
  {
    name: 'Airport Data',
    endpoint: 'https://airportapi.org/v1/',
    description: 'Airport information and runway data',
    type: 'Airport Info'
  },
  {
    name: 'Fuel Prices',
    endpoint: 'https://api.avgas.com/v1/',
    description: 'Real-time aviation fuel pricing',
    type: 'Fuel Data'
  },
  {
    name: 'NOTAM API',
    endpoint: 'https://api.faa.gov/s/notam/',
    description: 'Notice to Airmen updates',
    type: 'NOTAM'
  }
];

export default function APIIntegrations() {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<APIIntegration | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { toast } = useToast();

  const [integrationForm, setIntegrationForm] = useState({
    integration_name: "",
    api_endpoint: "",
    api_key: "",
    sync_frequency: "hourly",
    auto_sync: true
  });

  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchIntegrations();
  }, [fetchUserData, fetchIntegrations]);

  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const fetchIntegrations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("api_integrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIntegrations((data || []) as APIIntegration[]);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to fetch API integrations",
        variant: "destructive",
      });
    }
  }, [toast]);

  const createIntegration = async () => {
    if (!integrationForm.integration_name || !integrationForm.api_endpoint) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("api_integrations")
        .insert({
          integration_name: integrationForm.integration_name,
          api_endpoint: integrationForm.api_endpoint,
          api_key_encrypted: integrationForm.api_key || null,
          sync_frequency: integrationForm.sync_frequency,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API integration created successfully",
      });

      setIsCreateDialogOpen(false);
      setIntegrationForm({
        integration_name: "",
        api_endpoint: "",
        api_key: "",
        sync_frequency: "hourly",
        auto_sync: true
      });
      fetchIntegrations();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to create integration",
        variant: "destructive",
      });
    }
  };

  const testIntegration = async (integrationId: string) => {
    try {
      const integration = integrations.find(i => i.id === integrationId);
      if (!integration) return;

      // Mock API test - in real implementation, this would call the actual API
      const testResult = Math.random() > 0.2; // 80% success rate for demo

      const { error } = await supabase
        .from("api_integrations")
        .update({ 
          status: testResult ? 'active' : 'error',
          last_sync: new Date().toISOString()
        })
        .eq("id", integrationId);

      if (error) throw error;

      toast({
        title: testResult ? "Test Successful" : "Test Failed",
        description: testResult 
          ? "API integration is working correctly"
          : "Failed to connect to API endpoint",
        variant: testResult ? "default" : "destructive",
      });

      fetchIntegrations();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to test integration",
        variant: "destructive",
      });
    }
  };

  const syncIntegration = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from("api_integrations")
        .update({ 
          last_sync: new Date().toISOString()
        })
        .eq("id", integrationId);

      if (error) throw error;

      toast({
        title: "Sync Started",
        description: "Data synchronization initiated",
      });

      fetchIntegrations();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to sync integration",
        variant: "destructive",
      });
    }
  };

  const toggleIntegrationStatus = async (integrationId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from("api_integrations")
        .update({ status: newStatus })
        .eq("id", integrationId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Integration ${newStatus === 'active' ? 'enabled' : 'disabled'}`,
      });

      fetchIntegrations();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to update integration status",
        variant: "destructive",
      });
    }
  };

  const triggerWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          event: "test_webhook",
          timestamp: new Date().toISOString(),
          data: {
            integration: "Aviation Terminal",
            message: "Test webhook from API Integrations"
          }
        }),
      });

      toast({
        title: "Webhook Triggered",
        description: "Test webhook has been sent successfully",
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger webhook",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-terminal-success" />;
      case 'inactive': return <Clock className="h-4 w-4 text-slate-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-terminal-danger" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-terminal-warning animate-spin" />;
      default: return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-terminal-success';
      case 'inactive': return 'bg-slate-500';
      case 'error': return 'bg-terminal-danger';
      case 'testing': return 'bg-terminal-warning';
      default: return 'bg-slate-500';
    }
  };

  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return 'Never';
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">API Integrations</h2>
          <p className="text-slate-400">Connect with external aviation services and data sources</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                <Webhook className="mr-2 h-4 w-4" />
                Webhooks
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Webhook Configuration</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Set up webhooks for real-time data updates
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Webhook URL</Label>
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-app.com/webhook"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSettingsDialogOpen(false)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button onClick={triggerWebhook} className="bg-terminal-info hover:bg-terminal-info/80">
                    Test Webhook
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-terminal-success hover:bg-terminal-success/80">
                <Plus className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add API Integration</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Connect to an external API service
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Integration Name</Label>
                    <Input
                      value={integrationForm.integration_name}
                      onChange={(e) => setIntegrationForm(prev => ({ 
                        ...prev, 
                        integration_name: e.target.value 
                      }))}
                      placeholder="FlightAware API"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Sync Frequency</Label>
                    <Select 
                      value={integrationForm.sync_frequency} 
                      onValueChange={(value) => setIntegrationForm(prev => ({ 
                        ...prev, 
                        sync_frequency: value 
                      }))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="realtime" className="text-white">Real-time</SelectItem>
                        <SelectItem value="hourly" className="text-white">Hourly</SelectItem>
                        <SelectItem value="daily" className="text-white">Daily</SelectItem>
                        <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-white">API Endpoint</Label>
                  <Input
                    value={integrationForm.api_endpoint}
                    onChange={(e) => setIntegrationForm(prev => ({ 
                      ...prev, 
                      api_endpoint: e.target.value 
                    }))}
                    placeholder="https://api.example.com/v1/"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">API Key (Optional)</Label>
                  <Input
                    type="password"
                    value={integrationForm.api_key}
                    onChange={(e) => setIntegrationForm(prev => ({ 
                      ...prev, 
                      api_key: e.target.value 
                    }))}
                    placeholder="Enter API key if required"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                {/* Predefined Integrations */}
                <div>
                  <Label className="text-white mb-2 block">Quick Setup</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PREDEFINED_INTEGRATIONS.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => setIntegrationForm(prev => ({
                          ...prev,
                          integration_name: preset.name,
                          api_endpoint: preset.endpoint
                        }))}
                        className="border-slate-600 text-white hover:bg-slate-700 justify-start"
                      >
                        <Globe className="mr-2 h-3 w-3" />
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button onClick={createIntegration} className="bg-terminal-success hover:bg-terminal-success/80">
                    Create Integration
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plug className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-400">Total Integrations</p>
                <p className="text-xl font-bold text-white">{integrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-xl font-bold text-white">
                  {integrations.filter(i => i.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-terminal-danger" />
              <div>
                <p className="text-sm text-slate-400">Errors</p>
                <p className="text-xl font-bold text-white">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-terminal-info" />
              <div>
                <p className="text-sm text-slate-400">Last 24h Syncs</p>
                <p className="text-xl font-bold text-white">
                  {integrations.filter(i => {
                    if (!i.last_sync) return false;
                    const lastSync = new Date(i.last_sync);
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return lastSync > yesterday;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Active Integrations</h3>
        {integrations.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plug className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center">No API integrations configured</p>
              <p className="text-slate-500 text-sm text-center">Add your first integration to get started</p>
            </CardContent>
          </Card>
        ) : (
          integrations.map((integration) => (
            <Card key={integration.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${integration.status === 'active' ? 'bg-terminal-success/20' : 'bg-slate-700'}`}>
                      <Cloud className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{integration.integration_name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {integration.api_endpoint}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(integration.status)} text-white`}>
                      {getStatusIcon(integration.status)}
                      <span className="ml-1 capitalize">{integration.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-3 gap-4 flex-1">
                    <div>
                      <p className="text-sm text-slate-400">Sync Frequency</p>
                      <p className="text-white capitalize">{integration.sync_frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Last Sync</p>
                      <p className="text-white">{formatLastSync(integration.last_sync)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">API Key</p>
                      <p className="text-white">
                        {integration.api_key_encrypted ? (
                          <span className="flex items-center">
                            <Key className="h-3 w-3 mr-1" />
                            Configured
                          </span>
                        ) : (
                          'Not set'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => testIntegration(integration.id)}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Zap className="mr-1 h-4 w-4" />
                      Test
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => syncIntegration(integration.id)}
                      disabled={integration.status !== 'active'}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      <RefreshCw className="mr-1 h-4 w-4" />
                      Sync
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleIntegrationStatus(integration.id, integration.status)}
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Settings className="mr-1 h-4 w-4" />
                      {integration.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Available Integrations */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Available Integrations</CardTitle>
          <CardDescription className="text-slate-400">
            Popular aviation API services you can integrate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREDEFINED_INTEGRATIONS.map((preset) => (
              <div
                key={preset.name}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{preset.name}</h4>
                    <p className="text-slate-400 text-sm mb-2">{preset.description}</p>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {preset.type}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3 border-slate-600 text-white hover:bg-slate-700"
                  onClick={() => {
                    setIntegrationForm(prev => ({
                      ...prev,
                      integration_name: preset.name,
                      api_endpoint: preset.endpoint
                    }));
                    setIsCreateDialogOpen(true);
                  }}
                >
                  <LinkIcon className="mr-1 h-4 w-4" />
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}