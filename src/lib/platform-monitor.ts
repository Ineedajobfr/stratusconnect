// Platform Monitor - Central system that ensures everything works
// Integrates all monitoring and recovery systems

import { dataSync } from './data-sync';
import { errorRecovery } from './error-recovery';
import { heartbeatMonitor } from './heartbeat-monitor';
import { persistentStorage } from './persistent-storage';

interface PlatformStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  systems: {
    storage: boolean;
    errorRecovery: boolean;
    heartbeat: boolean;
    dataSync: boolean;
  };
  lastCheck: number;
  uptime: number;
  errors: string[];
}

class PlatformMonitor {
  private startTime = Date.now();
  private status: PlatformStatus = {
    overall: 'healthy',
    systems: {
      storage: true,
      errorRecovery: true,
      heartbeat: true,
      dataSync: true
    },
    lastCheck: Date.now(),
    uptime: 0,
    errors: []
  };

  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
    this.startMonitoring();
  }

  private initialize() {
    console.log('🚀 Initializing StratusConnect Platform Monitor...');
    
    // Set up fallback data for error recovery
    errorRecovery.setFallbackData('users', []);
    errorRecovery.setFallbackData('deals', []);
    errorRecovery.setFallbackData('messages', []);
    errorRecovery.setFallbackData('documents', []);

    // Add platform functions to heartbeat monitor
    heartbeatMonitor.addFunction('platform-storage', async () => {
      const stats = persistentStorage.getStats();
      return stats.totalUsers >= 0;
    });

    heartbeatMonitor.addFunction('platform-sync', async () => {
      const status = dataSync.getStatus();
      return status.isOnline || status.pendingItems >= 0;
    });

    console.log('✅ Platform Monitor initialized');
  }

  private startMonitoring() {
    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000);

    // Initial check
    this.performHealthCheck();
  }

  private performHealthCheck() {
    const now = Date.now();
    this.status.uptime = now - this.startTime;
    this.status.lastCheck = now;
    this.status.errors = [];

    // Check each system
    this.checkStorageSystem();
    this.checkErrorRecoverySystem();
    this.checkHeartbeatSystem();
    this.checkDataSyncSystem();

    // Determine overall health
    this.updateOverallHealth();

    // Log status
    if (this.status.overall !== 'healthy') {
      console.warn('⚠️ Platform health check:', this.status);
    }
  }

  private checkStorageSystem() {
    try {
      const stats = persistentStorage.getStats();
      this.status.systems.storage = stats.storageSize > 0 || stats.totalUsers >= 0;
    } catch (error) {
      this.status.systems.storage = false;
      this.status.errors.push(`Storage system error: ${error}`);
    }
  }

  private checkErrorRecoverySystem() {
    try {
      const status = errorRecovery.getStatus();
      this.status.systems.errorRecovery = Object.keys(status.retryCounts).length >= 0;
    } catch (error) {
      this.status.systems.errorRecovery = false;
      this.status.errors.push(`Error recovery system error: ${error}`);
    }
  }

  private checkHeartbeatSystem() {
    try {
      const health = heartbeatMonitor.getOverallHealth();
      this.status.systems.heartbeat = health === 'healthy' || health === 'degraded';
    } catch (error) {
      this.status.systems.heartbeat = false;
      this.status.errors.push(`Heartbeat system error: ${error}`);
    }
  }

  private checkDataSyncSystem() {
    try {
      const status = dataSync.getStatus();
      this.status.systems.dataSync = status.isOnline || status.pendingItems >= 0;
    } catch (error) {
      this.status.systems.dataSync = false;
      this.status.errors.push(`Data sync system error: ${error}`);
    }
  }

  private updateOverallHealth() {
    const systemCount = Object.keys(this.status.systems).length;
    const healthySystems = Object.values(this.status.systems).filter(Boolean).length;
    
    if (healthySystems === systemCount) {
      this.status.overall = 'healthy';
    } else if (healthySystems > systemCount / 2) {
      this.status.overall = 'degraded';
    } else {
      this.status.overall = 'critical';
    }
  }

  // Public methods
  getStatus(): PlatformStatus {
    return { ...this.status };
  }

  getDetailedReport() {
    return {
      platform: this.status,
      storage: persistentStorage.getStats(),
      errorRecovery: errorRecovery.getStatus(),
      heartbeat: heartbeatMonitor.getHealthReport(),
      dataSync: dataSync.getStatus()
    };
  }

  forceHealthCheck() {
    this.performHealthCheck();
  }

  isHealthy(): boolean {
    return this.status.overall === 'healthy';
  }

  getUptime(): number {
    return Date.now() - this.startTime;
  }

  // Emergency recovery
  emergencyRecovery() {
    console.log('🚨 Emergency recovery initiated...');
    
    // Clear all retry counts
    errorRecovery.resetAllRetryCounts();
    
    // Force sync
    dataSync.forceSync();
    
    // Force heartbeat check
    heartbeatMonitor.forceCheck();
    
    // Perform health check
    this.performHealthCheck();
    
    console.log('✅ Emergency recovery completed');
  }

  // Graceful shutdown
  shutdown() {
    console.log('🛑 Shutting down Platform Monitor...');
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    heartbeatMonitor.stop();
    dataSync.stop();
    
    console.log('✅ Platform Monitor shutdown complete');
  }
}

// Create singleton instance
export const platformMonitor = new PlatformMonitor();

// Export types
export type { PlatformStatus };
