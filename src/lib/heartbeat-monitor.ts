// Heartbeat Monitoring System
// Ensures all functions are always working

interface HeartbeatConfig {
  interval: number;
  timeout: number;
  maxFailures: number;
  autoRestart: boolean;
}

interface FunctionStatus {
  name: string;
  lastCheck: number;
  status: 'healthy' | 'degraded' | 'failed';
  failures: number;
  responseTime: number;
  error?: string;
}

class HeartbeatMonitor {
  private config: HeartbeatConfig = {
    interval: 30000, // 30 seconds
    timeout: 5000,   // 5 seconds
    maxFailures: 3,
    autoRestart: true
  };

  private functions = new Map<string, () => Promise<any>>();
  private statuses = new Map<string, FunctionStatus>();
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.setupDefaultFunctions();
    this.start();
  }

  private setupDefaultFunctions() {
    // Add default functions to monitor
    this.addFunction('localStorage', async () => {
      const testKey = 'heartbeat_test';
      const testValue = Date.now().toString();
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return retrieved === testValue;
    });

    this.addFunction('persistentStorage', async () => {
      const { persistentStorage } = await import('./persistent-storage');
      return persistentStorage.getStats();
    });

    this.addFunction('errorRecovery', async () => {
      const { errorRecovery } = await import('./error-recovery');
      return errorRecovery.getStatus();
    });

    this.addFunction('network', async () => {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    });
  }

  addFunction(name: string, fn: () => Promise<any>) {
    this.functions.set(name, fn);
    this.statuses.set(name, {
      name,
      lastCheck: 0,
      status: 'healthy',
      failures: 0,
      responseTime: 0
    });
  }

  removeFunction(name: string) {
    this.functions.delete(name);
    this.statuses.delete(name);
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.checkAllFunctions();
    }, this.config.interval);

    console.log('💓 Heartbeat monitor started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('💓 Heartbeat monitor stopped');
  }

  private async checkAllFunctions() {
    const promises = Array.from(this.functions.entries()).map(([name, fn]) => 
      this.checkFunction(name, fn)
    );

    await Promise.allSettled(promises);
  }

  private async checkFunction(name: string, fn: () => Promise<any>) {
    const startTime = Date.now();
    const status = this.statuses.get(name)!;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), this.config.timeout);
      });

      await Promise.race([fn(), timeoutPromise]);
      
      const responseTime = Date.now() - startTime;
      
      // Function succeeded
      status.status = 'healthy';
      status.failures = 0;
      status.responseTime = responseTime;
      status.lastCheck = Date.now();
      delete status.error;

    } catch (error) {
      // Function failed
      status.failures++;
      status.responseTime = Date.now() - startTime;
      status.lastCheck = Date.now();
      status.error = error instanceof Error ? error.message : String(error);

      if (status.failures >= this.config.maxFailures) {
        status.status = 'failed';
        console.error(`❌ Function ${name} has failed ${status.failures} times`);
        
        if (this.config.autoRestart) {
          this.attemptRestart(name);
        }
      } else {
        status.status = 'degraded';
        console.warn(`⚠️ Function ${name} failed (${status.failures}/${this.config.maxFailures})`);
      }
    }

    this.statuses.set(name, status);
  }

  private async attemptRestart(name: string) {
    console.log(`🔄 Attempting to restart function ${name}...`);
    
    try {
      // Try to restart the function
      const fn = this.functions.get(name);
      if (fn) {
        await fn();
        console.log(`✅ Function ${name} restarted successfully`);
        
        const status = this.statuses.get(name)!;
        status.status = 'healthy';
        status.failures = 0;
        this.statuses.set(name, status);
      }
    } catch (error) {
      console.error(`❌ Failed to restart function ${name}:`, error);
    }
  }

  getStatus(name?: string) {
    if (name) {
      return this.statuses.get(name);
    }
    return Object.fromEntries(this.statuses);
  }

  getOverallHealth() {
    const statuses = Array.from(this.statuses.values());
    const healthy = statuses.filter(s => s.status === 'healthy').length;
    const degraded = statuses.filter(s => s.status === 'degraded').length;
    const failed = statuses.filter(s => s.status === 'failed').length;
    const total = statuses.length;

    if (failed > 0) return 'critical';
    if (degraded > 0) return 'degraded';
    if (healthy === total) return 'healthy';
    return 'unknown';
  }

  getHealthReport() {
    const health = this.getOverallHealth();
    const statuses = Object.fromEntries(this.statuses);
    
    return {
      overall: health,
      timestamp: Date.now(),
      functions: statuses,
      summary: {
        total: Object.keys(statuses).length,
        healthy: Object.values(statuses).filter((s: any) => s.status === 'healthy').length,
        degraded: Object.values(statuses).filter((s: any) => s.status === 'degraded').length,
        failed: Object.values(statuses).filter((s: any) => s.status === 'failed').length
      }
    };
  }

  updateConfig(newConfig: Partial<HeartbeatConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Restart with new interval if changed
    if (newConfig.interval && this.isRunning) {
      this.stop();
      this.start();
    }
  }

  forceCheck() {
    this.checkAllFunctions();
  }

  isHealthy() {
    return this.getOverallHealth() === 'healthy';
  }
}

// Create singleton instance
export const heartbeatMonitor = new HeartbeatMonitor();

// Export types
export type { FunctionStatus, HeartbeatConfig };

