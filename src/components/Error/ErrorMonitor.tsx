// Error Monitor Component - Industry Standard Implementation
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { errorService, ErrorInfo, ErrorMetrics } from '@/lib/error-service';
import { 
  AlertTriangle, 
  Bug, 
  Activity, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download,
  Trash2,
  Filter,
  Search,
  Clock,
  Shield
} from 'lucide-react';

interface ErrorMonitorProps {
  className?: string;
}

export const ErrorMonitor: React.FC<ErrorMonitorProps> = ({ className }) => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [metrics, setMetrics] = useState<ErrorMetrics>({
    totalErrors: 0,
    errorsByCategory: {},
    errorsBySeverity: {},
    averageResolutionTime: 0,
    criticalErrors: 0,
    resolvedErrors: 0
  });
  const [filteredErrors, setFilteredErrors] = useState<ErrorInfo[]>([]);
  const [filters, setFilters] = useState({
    severity: 'all',
    category: 'all',
    resolved: 'all',
    search: ''
  });
  const [selectedError, setSelectedError] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    loadErrors();
    const interval = setInterval(loadErrors, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [errors, filters]);

  const loadErrors = () => {
    const allErrors = errorService.getAllErrors();
    setErrors(allErrors);
    setMetrics(errorService.getErrorMetrics());
  };

  const applyFilters = () => {
    let filtered = errors;

    if (filters.severity !== 'all') {
      filtered = filtered.filter(error => error.severity === filters.severity);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(error => error.category === filters.category);
    }

    if (filters.resolved !== 'all') {
      const isResolved = filters.resolved === 'resolved';
      filtered = filtered.filter(error => error.resolved === isResolved);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(error => 
        error.message.toLowerCase().includes(searchTerm) ||
        error.component?.toLowerCase().includes(searchTerm) ||
        error.id.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredErrors(filtered);
  };

  const handleResolveError = (errorId: string) => {
    const resolution = prompt('Enter resolution details:');
    if (resolution) {
      errorService.resolveError(errorId, resolution);
      loadErrors();
    }
  };

  const handleClearResolved = () => {
    errorService.clearResolvedErrors();
    loadErrors();
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all errors? This action cannot be undone.')) {
      errorService.clearAllErrors();
      loadErrors();
    }
  };

  const exportErrors = () => {
    const data = errorService.exportErrors();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'network': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'validation': return <Shield className="h-4 w-4 text-yellow-600" />;
      case 'authentication': return <Shield className="h-4 w-4 text-red-600" />;
      case 'authorization': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'business': return <Bug className="h-4 w-4 text-orange-600" />;
      case 'system': return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <Bug className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bug className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold">Error Monitor</h3>
            <Badge variant={metrics.criticalErrors > 0 ? "destructive" : "default"}>
              {metrics.criticalErrors} Critical
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button onClick={loadErrors} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportErrors} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleClearResolved} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Resolved
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Errors</p>
                    <p className="text-2xl font-bold">{metrics.totalErrors}</p>
                  </div>
                  <Bug className="h-8 w-8 text-red-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Critical Errors</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.criticalErrors}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.resolvedErrors}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resolution Rate</p>
                    <p className="text-2xl font-bold">
                      {metrics.totalErrors > 0 
                        ? Math.round((metrics.resolvedErrors / metrics.totalErrors) * 100)
                        : 0}%
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-blue-600" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Errors by Severity</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.errorsBySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <Badge className={getSeverityColor(severity)}>
                        {severity.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3">Errors by Category</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.errorsByCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(category)}
                        <span className="capitalize">{category}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search errors..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="network">Network</option>
                <option value="validation">Validation</option>
                <option value="authentication">Authentication</option>
                <option value="authorization">Authorization</option>
                <option value="business">Business</option>
                <option value="system">System</option>
              </select>
              
              <select
                value={filters.resolved}
                onChange={(e) => setFilters(prev => ({ ...prev, resolved: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredErrors.map((error) => (
                <Card 
                  key={error.id} 
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedError?.id === error.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedError(error)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(error.category)}
                      <div>
                        <p className="font-medium">{error.message}</p>
                        <p className="text-sm text-gray-600">
                          {error.component && `${error.component} • `}
                          {formatTime(error.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(error.severity)}>
                        {error.severity}
                      </Badge>
                      {error.resolved ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Error Resolution Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(metrics.averageResolutionTime / 1000 / 60)}m
                  </p>
                  <p className="text-sm text-gray-600">Avg Resolution Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.totalErrors > 0 
                      ? Math.round((metrics.resolvedErrors / metrics.totalErrors) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Resolution Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {metrics.totalErrors - metrics.resolvedErrors}
                  </p>
                  <p className="text-sm text-gray-600">Pending Resolution</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Error Management</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Clear Resolved Errors</p>
                    <p className="text-sm text-gray-600">Remove all resolved errors from memory</p>
                  </div>
                  <Button onClick={handleClearResolved} variant="outline">
                    Clear
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Clear All Errors</p>
                    <p className="text-sm text-gray-600">Remove all errors from memory (irreversible)</p>
                  </div>
                  <Button onClick={handleClearAll} variant="destructive">
                    Clear All
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Error Details Modal */}
      {selectedError && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Error Details</h3>
            <Button
              onClick={() => setSelectedError(null)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Error ID</p>
                <p className="font-mono text-sm">{selectedError.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Severity</p>
                <Badge className={getSeverityColor(selectedError.severity)}>
                  {selectedError.severity.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="capitalize">{selectedError.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Component</p>
                <p>{selectedError.component || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timestamp</p>
                <p>{formatTime(selectedError.timestamp)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center space-x-2">
                  {selectedError.resolved ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>{selectedError.resolved ? 'Resolved' : 'Unresolved'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Message</p>
              <p className="bg-gray-100 p-3 rounded-md">{selectedError.message}</p>
            </div>
            
            {selectedError.stack && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Stack Trace</p>
                <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto">
                  {selectedError.stack}
                </pre>
              </div>
            )}
            
            {selectedError.resolution && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Resolution</p>
                <p className="bg-green-100 p-3 rounded-md">{selectedError.resolution}</p>
              </div>
            )}
            
            {!selectedError.resolved && (
              <Button
                onClick={() => handleResolveError(selectedError.id)}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
