import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, PlayCircle, RefreshCw, Settings, XCircle, Zap } from 'lucide-react';
import { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  category: 'CRM' | 'OPS' | 'Payment' | 'Other';
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  icon: string;
}

export default function IntegrationsHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'CRM',
      description: 'Sync contacts, deals, and activities',
      status: 'disconnected',
      icon: '☁️',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'CRM',
      description: 'Marketing automation and CRM',
      status: 'disconnected',
      icon: '🔶',
    },
    {
      id: 'skylegs',
      name: 'Skylegs',
      category: 'OPS',
      description: 'Flight operations management',
      status: 'disconnected',
      icon: '✈️',
    },
    {
      id: 'leon',
      name: 'Leon',
      category: 'OPS',
      description: 'Aircraft scheduling software',
      status: 'disconnected',
      icon: '📅',
    },
    {
      id: 'fl3xx',
      name: 'FL3XX',
      category: 'OPS',
      description: 'Business aviation management',
      status: 'disconnected',
      icon: '🛫',
    },
  ]);

  const getStatusBadge = (status: string) => {
    const config = {
      connected: { label: 'CONNECTED', className: 'status-badge-success', icon: <CheckCircle className="w-3 h-3" /> },
      disconnected: { label: 'NOT CONNECTED', className: 'status-badge-neutral', icon: <XCircle className="w-3 h-3" /> },
      error: { label: 'ERROR', className: 'status-badge-danger', icon: <XCircle className="w-3 h-3" /> },
    };
    
    return config[status as keyof typeof config] || config.disconnected;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-enterprise-gold font-mono flex items-center gap-3">
            <Zap className="w-8 h-8" />
            Integration Hub
          </h1>
          <p className="text-white/60 mt-2 font-mono">
            Connect StratusConnect with your existing tools - All integrations are FREE
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            const badgeConfig = getStatusBadge(integration.status);
            
            return (
              <EnterpriseCard
                key={integration.id}
                title={`${integration.icon} ${integration.name}`}
                description={integration.description}
                actions={
                  <Badge className={cn('status-badge flex items-center gap-1', badgeConfig.className)}>
                    {badgeConfig.icon}
                    {badgeConfig.label}
                  </Badge>
                }
              >
                <div className="space-y-4">
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Badge className="status-badge status-badge-info">
                      {integration.category}
                    </Badge>
                    {integration.lastSync && (
                      <span className="text-xs font-mono text-white/60">
                        Last sync: {new Date(integration.lastSync).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-enterprise-success/30 text-white hover:bg-enterprise-success/10"
                        >
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Sync Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-enterprise-primary/20 text-white hover:bg-enterprise-primary/10"
                        >
                          <Settings className="w-3 h-3 mr-2" />
                          Configure
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="col-span-2 bg-enterprise-gold text-black hover:bg-enterprise-gold/80"
                        size="sm"
                      >
                        <PlayCircle className="w-3 h-3 mr-2" />
                        Connect {integration.name}
                      </Button>
                    )}
                  </div>

                  {/* Connection info */}
                  {integration.status === 'connected' && (
                    <div className="bg-enterprise-success/10 border border-enterprise-success/30 p-3 rounded text-xs font-mono text-white/80">
                      ✓ Bidirectional sync enabled • Auto-sync every 5 minutes
                    </div>
                  )}
                </div>
              </EnterpriseCard>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <EnterpriseCard title="Total Integrations" status="live">
            <div className="text-4xl font-bold text-enterprise-gold font-mono">
              {integrations.length}
            </div>
          </EnterpriseCard>

          <EnterpriseCard title="Active Connections">
            <div className="text-4xl font-bold text-enterprise-success font-mono">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
          </EnterpriseCard>

          <EnterpriseCard title="Data Synced Today">
            <div className="text-4xl font-bold text-white font-mono">
              1,247
            </div>
          </EnterpriseCard>

          <EnterpriseCard title="Sync Success Rate">
            <div className="text-4xl font-bold text-enterprise-success font-mono">
              99.2%
            </div>
          </EnterpriseCard>
        </div>
      </div>
    </div>
  );
}

