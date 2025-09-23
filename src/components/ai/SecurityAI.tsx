import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Eye, EyeOff, X, Activity, Zap, Users, Globe, Database } from 'lucide-react';

interface SecurityAIProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  userType: 'broker' | 'operator' | 'pilot' | 'crew';
}

interface SecurityThreat {
  id: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  type: 'intrusion' | 'anomaly' | 'compliance' | 'access' | 'data' | 'network';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
  status: 'active' | 'investigating' | 'resolved' | 'false-positive';
  affectedSystems: string[];
  recommendedActions: string[];
}

interface SecurityMetrics {
  totalThreats: number;
  activeThreats: number;
  resolvedThreats: number;
  falsePositives: number;
  systemHealth: number;
  complianceScore: number;
  lastScan: Date;
}

export const SecurityAI: React.FC<SecurityAIProps> = ({
  isVisible,
  onToggleVisibility,
  userType
}) => {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalThreats: 0,
    activeThreats: 0,
    resolvedThreats: 0,
    falsePositives: 0,
    systemHealth: 98,
    complianceScore: 95,
    lastScan: new Date()
  });
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'threats' | 'compliance' | 'network'>('dashboard');

  // Generate security threats
  const generateSecurityThreats = (): SecurityThreat[] => {
    const threatTypes = [
      {
        type: 'intrusion',
        level: 'high',
        title: 'Suspicious Login Attempt',
        description: 'Multiple failed login attempts detected from IP address 192.168.1.100',
        source: 'Authentication System',
        affectedSystems: ['User Authentication', 'Session Management'],
        recommendedActions: ['Block IP address', 'Require additional verification', 'Notify security team']
      },
      {
        type: 'anomaly',
        level: 'medium',
        title: 'Unusual Data Access Pattern',
        description: 'User accessing data outside normal business hours and geographic location',
        source: 'Access Log Monitor',
        affectedSystems: ['Data Access Layer', 'User Permissions'],
        recommendedActions: ['Verify user identity', 'Review access permissions', 'Enable additional monitoring']
      },
      {
        type: 'compliance',
        level: 'high',
        title: 'Data Retention Policy Violation',
        description: 'Sensitive data retained beyond required retention period',
        source: 'Compliance Scanner',
        affectedSystems: ['Data Storage', 'Backup Systems'],
        recommendedActions: ['Archive old data', 'Update retention policies', 'Audit data lifecycle']
      },
      {
        type: 'network',
        level: 'critical',
        title: 'Potential DDoS Attack',
        description: 'Unusual traffic patterns detected from multiple sources',
        source: 'Network Monitor',
        affectedSystems: ['Network Infrastructure', 'Load Balancers'],
        recommendedActions: ['Activate DDoS protection', 'Scale up resources', 'Monitor traffic patterns']
      }
    ];

    return threatTypes.slice(0, Math.floor(Math.random() * 3) + 1).map((threat, index) => ({
      id: `threat-${Date.now()}-${index}`,
      ...threat,
      level: 'medium' as const,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      status: Math.random() > 0.7 ? 'resolved' as const : 'active' as const
    }));
  };

  const startSecurityScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const newThreats = generateSecurityThreats();
      setThreats(newThreats);
      
      const activeThreats = newThreats.filter(t => t.status === 'active').length;
      setMetrics(prev => ({
        ...prev,
        totalThreats: prev.totalThreats + newThreats.length,
        activeThreats,
        resolvedThreats: prev.resolvedThreats + newThreats.filter(t => t.status === 'resolved').length,
        lastScan: new Date(),
        systemHealth: Math.max(85, 98 - (activeThreats * 3)),
        complianceScore: Math.max(90, 95 - (activeThreats * 2))
      }));
      
      setIsScanning(false);
    }, 3000);
  };

  const resolveThreat = (threatId: string) => {
    setThreats(prev => prev.map(threat => 
      threat.id === threatId 
        ? { ...threat, status: 'resolved' as const }
        : threat
    ));
    
    setMetrics(prev => ({
      ...prev,
      activeThreats: Math.max(0, prev.activeThreats - 1),
      resolvedThreats: prev.resolvedThreats + 1,
      systemHealth: Math.min(100, prev.systemHealth + 2),
      complianceScore: Math.min(100, prev.complianceScore + 1)
    }));
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'intrusion': return <Lock className="w-4 h-4" />;
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'compliance': return <Shield className="w-4 h-4" />;
      case 'access': return <Users className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'network': return <Globe className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-400';
    if (health >= 85) return 'text-yellow-400';
    if (health >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  if (!isVisible) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={onToggleVisibility}
          className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group relative"
          aria-label="Open Security AI"
        >
          <Shield className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {metrics.activeThreats > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
              <span className="text-white text-xs font-bold">{metrics.activeThreats}</span>
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Security AI overlay */}
      <div className="absolute top-6 right-6 w-96 max-h-[85vh] bg-black/30 backdrop-blur-xl border border-red-500/20 rounded-3xl shadow-2xl pointer-events-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-500/20 bg-gradient-to-r from-red-600/20 to-orange-600/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Security AI</h3>
              <p className="text-white/70 text-xs">Advanced Threat Protection</p>
            </div>
          </div>
          <button
            onClick={onToggleVisibility}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="p-2 border-b border-red-500/20">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-3 h-3" /> },
              { id: 'threats', label: 'Threats', icon: <AlertTriangle className="w-3 h-3" /> },
              { id: 'compliance', label: 'Compliance', icon: <CheckCircle className="w-3 h-3" /> },
              { id: 'network', label: 'Network', icon: <Globe className="w-3 h-3" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-red-500/30 text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-red-500/20">
          <button
            onClick={startSecurityScan}
            disabled={isScanning}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
              isScanning
                ? 'bg-orange-500/80 text-white opacity-50 cursor-not-allowed'
                : 'bg-red-500/80 hover:bg-red-500 text-white'
            }`}
          >
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Scanning...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Security Scan
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'dashboard' && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white/80 text-sm">System Health</span>
                  </div>
                  <div className={`text-2xl font-bold ${getHealthColor(metrics.systemHealth)}`}>
                    {metrics.systemHealth}%
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-white/80 text-sm">Compliance</span>
                  </div>
                  <div className={`text-2xl font-bold ${getHealthColor(metrics.complianceScore)}`}>
                    {metrics.complianceScore}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">Active Threats</span>
                  <span className="text-red-400 font-bold">{metrics.activeThreats}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">Resolved Threats</span>
                  <span className="text-green-400 font-bold">{metrics.resolvedThreats}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80 text-sm">Total Threats</span>
                  <span className="text-white font-bold">{metrics.totalThreats}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'threats' && (
            <div className="p-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {threats.map((threat, index) => (
                  <div
                    key={threat.id}
                    className={`p-3 rounded-xl border animate-in slide-in-from-bottom-2 duration-500 ${getThreatLevelColor(threat.level)}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getThreatIcon(threat.type)}
                        <span className="text-sm font-medium">{threat.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-60">
                          {threat.timestamp.toLocaleTimeString()}
                        </span>
                        {threat.status === 'active' && (
                          <button
                            onClick={() => resolveThreat(threat.id)}
                            className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-2">{threat.description}</p>
                    <div className="text-xs opacity-60">
                      Source: {threat.source} • Status: {threat.status}
                    </div>
                  </div>
                ))}
                
                {threats.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-green-400/30 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">No active threats detected</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="p-4">
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400/30 mx-auto mb-3" />
                <p className="text-white/60 text-sm">Compliance monitoring active</p>
                <p className="text-white/40 text-xs mt-2">FAA • EASA • ICAO • GDPR</p>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="p-4">
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-blue-400/30 mx-auto mb-3" />
                <p className="text-white/60 text-sm">Network monitoring active</p>
                <p className="text-white/40 text-xs mt-2">Traffic analysis • DDoS protection • SSL monitoring</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-red-500/20 bg-gradient-to-r from-red-600/10 to-orange-600/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Security AI • Advanced Threat Protection</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
