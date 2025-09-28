import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  bundleSize: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

const PerformanceMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 45,
    loadTime: 1200,
    renderTime: 16,
    bundleSize: 2048
  });
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  // Mock performance monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    setStartTime(Date.now());
    
    // Simulate performance metrics collection
    const interval = setInterval(() => {
      setMetrics(prev => ({
        fps: Math.max(30, prev.fps + (Math.random() - 0.5) * 10),
        memoryUsage: Math.min(100, Math.max(20, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        loadTime: prev.loadTime + (Math.random() - 0.5) * 100,
        renderTime: Math.max(8, prev.renderTime + (Math.random() - 0.5) * 4),
        bundleSize: prev.bundleSize
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Generate performance alerts
  useEffect(() => {
    if (!isMonitoring) return;

    const checkPerformance = () => {
      const newAlerts: PerformanceAlert[] = [];

      if (metrics.fps < 30) {
        newAlerts.push({
          id: Date.now().toString(),
          type: 'warning',
          message: `Low FPS detected: ${metrics.fps.toFixed(1)} fps`,
          timestamp: new Date(),
          severity: 'medium'
        });
      }

      if (metrics.memoryUsage > 80) {
        newAlerts.push({
          id: Date.now().toString() + '_mem',
          type: 'error',
          message: `High memory usage: ${metrics.memoryUsage.toFixed(1)}%`,
          timestamp: new Date(),
          severity: 'high'
        });
      }

      if (metrics.renderTime > 20) {
        newAlerts.push({
          id: Date.now().toString() + '_render',
          type: 'warning',
          message: `Slow render time: ${metrics.renderTime.toFixed(1)}ms`,
          timestamp: new Date(),
          severity: 'medium'
        });
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
      }
    };

    const interval = setInterval(checkPerformance, 5000);
    return () => clearInterval(interval);
  }, [isMonitoring, metrics]);

  const getPerformanceScore = useCallback(() => {
    const fpsScore = (metrics.fps / 60) * 25;
    const memoryScore = ((100 - metrics.memoryUsage) / 100) * 25;
    const renderScore = (Math.max(0, 30 - metrics.renderTime) / 30) * 25;
    const loadScore = (Math.max(0, 3000 - metrics.loadTime) / 3000) * 25;
    
    return Math.round(fpsScore + memoryScore + renderScore + loadScore);
  }, [metrics]);

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <CardTitle>Performance Monitor</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isMonitoring ? "default" : "secondary"}>
                {isMonitoring ? "Monitoring" : "Idle"}
              </Badge>
              <Button
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                variant={isMonitoring ? "destructive" : "default"}
                size="sm"
              >
                {isMonitoring ? "Stop" : "Start"} Monitoring
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Performance Score</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{getPerformanceScore()}</div>
                      <Progress value={getPerformanceScore()} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">FPS</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{metrics.fps.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">frames/sec</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Memory</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{metrics.memoryUsage.toFixed(1)}%</div>
                      <Progress value={metrics.memoryUsage} className="mt-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Render Time</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{metrics.renderTime.toFixed(1)}ms</div>
                      <div className="text-xs text-muted-foreground">per frame</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Load Time</label>
                    <div className="text-2xl font-bold">{metrics.loadTime.toFixed(0)}ms</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bundle Size</label>
                    <div className="text-2xl font-bold">{(metrics.bundleSize / 1024).toFixed(1)}KB</div>
                  </div>
                </div>
                {isMonitoring && (
                  <div>
                    <label className="text-sm font-medium">Session Duration</label>
                    <div className="text-2xl font-bold">
                      {Math.floor((Date.now() - startTime) / 1000)}s
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Performance Alerts</h3>
                {alerts.length > 0 && (
                  <Button onClick={clearAlerts} variant="outline" size="sm">
                    Clear All
                  </Button>
                )}
              </div>
              
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No performance alerts
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.type === 'error' 
                          ? 'border-red-200 bg-red-50' 
                          : alert.type === 'warning'
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge variant={alert.type === 'error' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;