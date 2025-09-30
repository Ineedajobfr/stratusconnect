// Status Banner for Homepage
// FCA Compliant Aviation Platform

import { realTimeMonitoring } from '@/lib/real-time-monitoring';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    ExternalLink
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export interface StatusData {
  uptime: number;
  p50Response: number;
  p90Response: number;
  p99Response: number;
  incidents: Array<{
    id: string;
    title: string;
    status: 'investigating' | 'resolved';
    createdAt: string;
    resolvedAt?: string;
  }>;
  lastUpdated: string;
}

export function StatusBanner() {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = () => {
      try {
        const systemStatus = realTimeMonitoring.getSystemStatus();
        
        const statusData: StatusData = {
          uptime: systemStatus.uptime.current,
          p50Response: systemStatus.uptime.p50,
          p90Response: systemStatus.uptime.p90,
          p99Response: systemStatus.uptime.p99,
          incidents: [], // Real-time monitoring doesn't track incidents yet
          lastUpdated: systemStatus.lastUpdated
        };
        
        setStatusData(statusData);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchStatus();
    
    // Update every 10 seconds
    const interval = setInterval(fetchStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-slate-800 border-b border-blue-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Clock className="w-4 h-4 animate-spin text-blue-600 mr-2" />
            <span className="text-blue-800 text-sm">Loading status...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!statusData) {
    return (
      <div className="bg-slate-800 border-b border-yellow-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-yellow-800 text-sm">Status data unavailable</span>
          </div>
        </div>
      </div>
    );
  }

  const activeIncidents = statusData.incidents.filter(inc => inc.status === 'investigating');
  const isHealthy = activeIncidents.length === 0 && statusData.uptime > 99.9;

  return (
    <div className="border-b py-3 bg-black/80 backdrop-blur-sm border-slate-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isHealthy ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-white" />
              )}
              <span className="text-sm font-medium text-white">
                {isHealthy ? 'All systems operational' : 'Service issues detected'}
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-white" />
                <span className="text-white">Uptime: {statusData.uptime}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-white" />
                <span className="text-white">P50: {statusData.p50Response}ms</span>
              </div>
              {activeIncidents.length > 0 && (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-white" />
                  <span className="text-white">{activeIncidents.length} active incident(s)</span>
                </div>
              )}
            </div>
          </div>
          
          <Link 
            to="/status" 
            className="flex items-center gap-1 text-sm font-medium text-white hover:text-white transition-colors"
          >
            <span>View live status</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
