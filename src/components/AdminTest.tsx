// Admin System Test Component
// Used to verify admin functionality works correctly

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { AdminDatabase } from "@/lib/admin-database";
import { broadcastService } from "@/lib/broadcast-service";
import { disputeService } from "@/lib/dispute-service-real";
import { aiMonitoringService } from "@/lib/ai-monitoring-service-real";

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
          await AdminDatabase.getAllUsers();
          return Date.now() - start;
        }
      },
      {
        name: "User Management",
        test: async () => {
          const start = Date.now();
          const users = await AdminDatabase.getAllUsers();
          return Date.now() - start;
        }
      },
      {
        name: "Deal Management",
        test: async () => {
          const start = Date.now();
          const deals = await AdminDatabase.getAllDeals();
          return Date.now() - start;
        }
      },
      {
        name: "Security Events",
        test: async () => {
          const start = Date.now();
          const events = await AdminDatabase.getSecurityEvents(10);
          return Date.now() - start;
        }
      },
      {
        name: "Broadcast Service",
        test: async () => {
          const start = Date.now();
          const messages = await broadcastService.getBroadcastMessages();
          return Date.now() - start;
        }
      },
      {
        name: "Dispute Service",
        test: async () => {
          const start = Date.now();
          const disputes = await disputeService.getDisputes();
          return Date.now() - start;
        }
      },
      {
        name: "AI Monitoring Service",
        test: async () => {
          const start = Date.now();
          const alerts = await aiMonitoringService.getFraudAlerts();
          return Date.now() - start;
        }
      },
      {
        name: "System Settings",
        test: async () => {
          const start = Date.now();
          const settings = await AdminDatabase.getSystemSettings();
          return Date.now() - start;
        }
      }
    ];

    for (const testCase of testCases) {
      const testResult: TestResult = {
        name: testCase.name,
        status: 'pending',
        message: 'Running...'
      };
      
      setTests(prev => [...prev, testResult]);

      try {
        const duration = await testCase.test();
        setTests(prev => prev.map(t => 
          t.name === testCase.name 
            ? { ...t, status: 'success', message: `Completed in ${duration}ms`, duration }
            : t
        ));
      } catch (error) {
        setTests(prev => prev.map(t => 
          t.name === testCase.name 
            ? { ...t, status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
            : t
        ));
      }
    }

    setRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-accent" />
          Admin System Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={running}
            className="w-full bg-accent hover:bg-accent/90"
          >
            {running ? 'Running Tests...' : 'Run System Tests'}
          </Button>

          {tests.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Test Results:</h4>
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-terminal-card/50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <span className="text-foreground">{test.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                    {test.duration && (
                      <span className="text-sm text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tests.length > 0 && tests.every(t => t.status !== 'pending') && (
            <div className="mt-4 p-3 rounded-lg bg-terminal-card/30">
              <h4 className="font-semibold text-foreground mb-2">Test Summary:</h4>
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
                  <div className="text-2xl font-bold text-accent">
                    {tests.reduce((acc, t) => acc + (t.duration || 0), 0)}ms
                  </div>
                  <div className="text-muted-foreground">Total Time</div>
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