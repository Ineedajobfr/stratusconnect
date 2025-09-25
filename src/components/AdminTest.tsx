// Admin System Test Component
// Used to verify admin functionality works correctly

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { AdminDatabase } from "@/lib/admin-database";
import { broadcastService } from "@/lib/broadcast-service";
import { disputeService } from "@/lib/dispute-service";
import { aiMonitoringService } from "@/lib/ai-monitoring-service";

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

const AdminTest = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = async () => {
    setRunning(true);
    setTests([]);

    const testCases = [
      {
        name: "Database Connection",
        test: async () => {
          const start = Date.now();
          const users = await AdminDatabase.getAllUsers();
          const duration = Date.now() - start;
          return { success: true, message: `Connected successfully. Found ${users.length} users.`, duration };
        }
      },
      {
        name: "System Stats",
        test: async () => {
          const start = Date.now();
          const stats = await AdminDatabase.getSystemStats();
          const duration = Date.now() - start;
          return { success: true, message: `Stats loaded. Total users: ${stats.totalUsers}`, duration };
        }
      },
      {
        name: "Security Events",
        test: async () => {
          const start = Date.now();
          const events = await AdminDatabase.getSecurityEvents(10);
          const duration = Date.now() - start;
          return { success: true, message: `Loaded ${events.length} security events`, duration };
        }
      },
      {
        name: "Commission Rules",
        test: async () => {
          const start = Date.now();
          const rules = await AdminDatabase.getCommissionRules();
          const duration = Date.now() - start;
          return { success: true, message: `Loaded ${rules.length} commission rules`, duration };
        }
      },
      {
        name: "Broadcast Service",
        test: async () => {
          const start = Date.now();
          const messages = await broadcastService.getBroadcastMessages();
          const duration = Date.now() - start;
          return { success: true, message: `Broadcast service working. ${messages.length} messages`, duration };
        }
      },
      {
        name: "Dispute Service",
        test: async () => {
          const start = Date.now();
          const disputes = await disputeService.getDisputes();
          const duration = Date.now() - start;
          return { success: true, message: `Dispute service working. ${disputes.length} disputes`, duration };
        }
      },
      {
        name: "AI Monitoring",
        test: async () => {
          const start = Date.now();
          const alerts = await aiMonitoringService.getFraudAlerts();
          const duration = Date.now() - start;
          return { success: true, message: `AI monitoring working. ${alerts.length} alerts`, duration };
        }
      }
    ];

    for (const testCase of testCases) {
      try {
        setTests(prev => [...prev, { name: testCase.name, status: 'pending', message: 'Running...' }]);
        
        const result = await testCase.test();
        
        setTests(prev => prev.map(t => 
          t.name === testCase.name 
            ? { 
                name: testCase.name, 
                status: result.success ? 'success' : 'error', 
                message: result.message,
                duration: result.duration
              }
            : t
        ));
      } catch (error) {
        setTests(prev => prev.map(t => 
          t.name === testCase.name 
            ? { 
                name: testCase.name, 
                status: 'error', 
                message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
              }
            : t
        ));
      }
    }

    setRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    }
  };

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Admin System Test Suite
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Verify that all admin system components are working correctly
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={running}
            className="btn-terminal-accent"
          >
            {running ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Admin System Tests'
            )}
          </Button>

          {tests.length > 0 && (
            <div className="space-y-2">
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg border border-terminal-border">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <p className="font-medium text-foreground">{test.name}</p>
                      <p className="text-sm text-muted-foreground">{test.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                    {test.duration && (
                      <span className="text-xs text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tests.length > 0 && !running && (
            <div className="mt-4 p-4 bg-terminal-card/50 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Test Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {tests.filter(t => t.status === 'success').length}
                  </div>
                  <div className="text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {tests.filter(t => t.status === 'error').length}
                  </div>
                  <div className="text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {tests.length}
                  </div>
                  <div className="text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTest;
