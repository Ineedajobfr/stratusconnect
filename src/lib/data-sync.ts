// Data Synchronization System
// Ensures data is always up-to-date and synchronized

interface SyncConfig {
  interval: number;
  batchSize: number;
  retryAttempts: number;
  conflictResolution: 'server' | 'client' | 'merge';
}

interface SyncItem {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  version: number;
  action: 'create' | 'update' | 'delete';
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: number;
  pendingItems: number;
  syncInProgress: boolean;
  errors: string[];
}

class DataSync {
  private config: SyncConfig = {
    interval: 10000, // 10 seconds
    batchSize: 50,
    retryAttempts: 3,
    conflictResolution: 'merge'
  };

  private syncQueue: SyncItem[] = [];
  private status: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: 0,
    pendingItems: 0,
    syncInProgress: false,
    errors: []
  };

  private intervalId: NodeJS.Timeout | null = null;
  private retryTimeouts = new Map<string, NodeJS.Timeout>();

  constructor() {
    this.setupNetworkMonitoring();
    this.setupVisibilityMonitoring();
    this.startSync();
  }

  private setupNetworkMonitoring() {
    window.addEventListener('online', () => {
      this.status.isOnline = true;
      console.log('🌐 Network connection restored');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.status.isOnline = false;
      console.log('🌐 Network connection lost - queuing changes');
    });
  }

  private setupVisibilityMonitoring() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.status.isOnline) {
        this.processSyncQueue();
      }
    });
  }

  private startSync() {
    this.intervalId = setInterval(() => {
      if (this.status.isOnline && !this.status.syncInProgress) {
        this.processSyncQueue();
      }
    }, this.config.interval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    // Clear all retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  // Add item to sync queue
  queueSync(item: Omit<SyncItem, 'timestamp' | 'version'>) {
    const syncItem: SyncItem = {
      ...item,
      timestamp: Date.now(),
      version: 1
    };

    // Check for existing item with same ID and type
    const existingIndex = this.syncQueue.findIndex(
      existing => existing.id === item.id && existing.type === item.type
    );

    if (existingIndex >= 0) {
      // Update existing item
      this.syncQueue[existingIndex] = syncItem;
    } else {
      // Add new item
      this.syncQueue.push(syncItem);
    }

    this.status.pendingItems = this.syncQueue.length;
    console.log(`📝 Queued sync item: ${item.type}:${item.id}`);
  }

  // Process sync queue
  private async processSyncQueue() {
    if (this.syncQueue.length === 0 || this.status.syncInProgress) {
      return;
    }

    this.status.syncInProgress = true;
    this.status.errors = [];

    try {
      // Process items in batches
      const batches = this.chunkArray(this.syncQueue, this.config.batchSize);
      
      for (const batch of batches) {
        await this.syncBatch(batch);
      }

      this.status.lastSync = Date.now();
      console.log(`✅ Sync completed: ${this.syncQueue.length} items processed`);

    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.status.errors.push(error instanceof Error ? error.message : String(error));
    } finally {
      this.status.syncInProgress = false;
    }
  }

  private async syncBatch(batch: SyncItem[]) {
    const promises = batch.map(item => this.syncItem(item));
    const results = await Promise.allSettled(promises);

    // Remove successfully synced items
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const itemIndex = this.syncQueue.findIndex(
          queued => queued.id === batch[index].id && queued.type === batch[index].type
        );
        if (itemIndex >= 0) {
          this.syncQueue.splice(itemIndex, 1);
        }
      }
    });

    this.status.pendingItems = this.syncQueue.length;
  }

  private async syncItem(item: SyncItem): Promise<void> {
    try {
      // Simulate API call - replace with actual API
      await this.simulateApiCall(item);
      
      console.log(`✅ Synced ${item.type}:${item.id}`);
      
    } catch (error) {
      console.error(`❌ Failed to sync ${item.type}:${item.id}:`, error);
      
      // Retry logic
      const retryKey = `${item.type}:${item.id}`;
      const retryCount = this.getRetryCount(retryKey);
      
      if (retryCount < this.config.retryAttempts) {
        this.scheduleRetry(item, retryKey, retryCount + 1);
      } else {
        console.error(`❌ Max retries exceeded for ${item.type}:${item.id}`);
        this.status.errors.push(`Max retries exceeded for ${item.type}:${item.id}`);
      }
    }
  }

  private async simulateApiCall(item: SyncItem): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    // Simulate occasional failures
    if (Math.random() < 0.1) {
      throw new Error('Simulated network error');
    }
  }

  private scheduleRetry(item: SyncItem, retryKey: string, retryCount: number) {
    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    
    const timeout = setTimeout(() => {
      this.retryTimeouts.delete(retryKey);
      this.syncItem(item);
    }, delay);

    this.retryTimeouts.set(retryKey, timeout);
    console.log(`🔄 Scheduled retry ${retryCount} for ${item.type}:${item.id} in ${delay}ms`);
  }

  private getRetryCount(retryKey: string): number {
    // This would typically be stored in a more persistent way
    return 0;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Public methods
  getStatus(): SyncStatus {
    return { ...this.status };
  }

  getQueueLength(): number {
    return this.syncQueue.length;
  }

  clearQueue() {
    this.syncQueue = [];
    this.status.pendingItems = 0;
    console.log('🧹 Sync queue cleared');
  }

  forceSync() {
    if (this.status.isOnline) {
      this.processSyncQueue();
    }
  }

  updateConfig(newConfig: Partial<SyncConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Convenience methods for common data types
  syncUser(userId: string, userData: any, action: 'create' | 'update' | 'delete' = 'update') {
    this.queueSync({
      id: userId,
      type: 'user',
      data: userData,
      action
    });
  }

  syncDeal(dealId: string, dealData: any, action: 'create' | 'update' | 'delete' = 'update') {
    this.queueSync({
      id: dealId,
      type: 'deal',
      data: dealData,
      action
    });
  }

  syncMessage(messageId: string, messageData: any, action: 'create' | 'update' | 'delete' = 'create') {
    this.queueSync({
      id: messageId,
      type: 'message',
      data: messageData,
      action
    });
  }

  syncDocument(docId: string, docData: any, action: 'create' | 'update' | 'delete' = 'create') {
    this.queueSync({
      id: docId,
      type: 'document',
      data: docData,
      action
    });
  }
}

// Create singleton instance
export const dataSync = new DataSync();

// Export types
export type { SyncConfig, SyncItem, SyncStatus };
