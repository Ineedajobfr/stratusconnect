// FREE Database System - No external services, no costs
// Uses localStorage and IndexedDB for zero-cost data storage

export interface FreeDatabaseConfig {
  name: string;
  version: number;
  stores: string[];
}

export interface FreeDatabaseRecord {
  id: string;
  data: any;
  createdAt: string;
  updatedAt: string;
  version: number;
}

class FreeDatabase {
  private static instance: FreeDatabase;
  private db: IDBDatabase | null = null;
  private config: FreeDatabaseConfig = {
    name: 'StratusConnectDB',
    version: 1,
    stores: [
      'users',
      'deals',
      'payments',
      'audit_logs',
      'documents',
      'notifications',
      'settings'
    ]
  };

  static getInstance(): FreeDatabase {
    if (!FreeDatabase.instance) {
      FreeDatabase.instance = new FreeDatabase();
    }
    return FreeDatabase.instance;
  }

  /**
   * Initialize free database
   */
  async initialize(): Promise<void> {
    try {
      // Try IndexedDB first (more robust)
      if ('indexedDB' in window) {
        await this.initializeIndexedDB();
      } else {
        // Fallback to localStorage
        this.initializeLocalStorage();
      }
    } catch (error) {
      console.warn('IndexedDB failed, falling back to localStorage:', error);
      this.initializeLocalStorage();
    }
  }

  /**
   * Initialize IndexedDB
   */
  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.name, this.config.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        this.config.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
          }
        });
      };
    });
  }

  /**
   * Initialize localStorage fallback
   */
  private initializeLocalStorage(): void {
    // localStorage is always available
    console.log('Using localStorage for database');
  }

  /**
   * Create record in free database
   */
  async create(storeName: string, data: any): Promise<string> {
    const id = crypto.randomUUID();
    const record: FreeDatabaseRecord = {
      id,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    if (this.db) {
      await this.createIndexedDB(storeName, record);
    } else {
      this.createLocalStorage(storeName, record);
    }

    return id;
  }

  /**
   * Read record from free database
   */
  async read(storeName: string, id: string): Promise<FreeDatabaseRecord | null> {
    if (this.db) {
      return await this.readIndexedDB(storeName, id);
    } else {
      return this.readLocalStorage(storeName, id);
    }
  }

  /**
   * Update record in free database
   */
  async update(storeName: string, id: string, data: any): Promise<boolean> {
    const existing = await this.read(storeName, id);
    if (!existing) return false;

    const updatedRecord: FreeDatabaseRecord = {
      ...existing,
      data: { ...existing.data, ...data },
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    };

    if (this.db) {
      return await this.updateIndexedDB(storeName, updatedRecord);
    } else {
      return this.updateLocalStorage(storeName, updatedRecord);
    }
  }

  /**
   * Delete record from free database
   */
  async delete(storeName: string, id: string): Promise<boolean> {
    if (this.db) {
      return await this.deleteIndexedDB(storeName, id);
    } else {
      return this.deleteLocalStorage(storeName, id);
    }
  }

  /**
   * List records from free database
   */
  async list(storeName: string, limit: number = 100, offset: number = 0): Promise<FreeDatabaseRecord[]> {
    if (this.db) {
      return await this.listIndexedDB(storeName, limit, offset);
    } else {
      return this.listLocalStorage(storeName, limit, offset);
    }
  }

  /**
   * Search records in free database
   */
  async search(storeName: string, query: (record: FreeDatabaseRecord) => boolean): Promise<FreeDatabaseRecord[]> {
    if (this.db) {
      return await this.searchIndexedDB(storeName, query);
    } else {
      return this.searchLocalStorage(storeName, query);
    }
  }

  // IndexedDB implementations
  private async createIndexedDB(storeName: string, record: FreeDatabaseRecord): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async readIndexedDB(storeName: string, id: string): Promise<FreeDatabaseRecord | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  private async updateIndexedDB(storeName: string, record: FreeDatabaseRecord): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(record);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteIndexedDB(storeName: string, id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  private async listIndexedDB(storeName: string, limit: number, offset: number): Promise<FreeDatabaseRecord[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        const sorted = results.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        resolve(sorted.slice(offset, offset + limit));
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async searchIndexedDB(storeName: string, query: (record: FreeDatabaseRecord) => boolean): Promise<FreeDatabaseRecord[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        const filtered = results.filter(query);
        resolve(filtered);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // localStorage implementations
  private createLocalStorage(storeName: string, record: FreeDatabaseRecord): void {
    try {
      const key = `db_${storeName}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(record);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to create record in localStorage:', error);
    }
  }

  private readLocalStorage(storeName: string, id: string): FreeDatabaseRecord | null {
    try {
      const key = `db_${storeName}`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      return records.find((record: FreeDatabaseRecord) => record.id === id) || null;
    } catch (error) {
      console.error('Failed to read record from localStorage:', error);
      return null;
    }
  }

  private updateLocalStorage(storeName: string, record: FreeDatabaseRecord): boolean {
    try {
      const key = `db_${storeName}`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      const index = records.findIndex((r: FreeDatabaseRecord) => r.id === record.id);
      
      if (index === -1) return false;
      
      records[index] = record;
      localStorage.setItem(key, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error('Failed to update record in localStorage:', error);
      return false;
    }
  }

  private deleteLocalStorage(storeName: string, id: string): boolean {
    try {
      const key = `db_${storeName}`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = records.filter((record: FreeDatabaseRecord) => record.id !== id);
      
      if (filtered.length === records.length) return false;
      
      localStorage.setItem(key, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete record from localStorage:', error);
      return false;
    }
  }

  private listLocalStorage(storeName: string, limit: number, offset: number): FreeDatabaseRecord[] {
    try {
      const key = `db_${storeName}`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      const sorted = records.sort((a: FreeDatabaseRecord, b: FreeDatabaseRecord) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sorted.slice(offset, offset + limit);
    } catch (error) {
      console.error('Failed to list records from localStorage:', error);
      return [];
    }
  }

  private searchLocalStorage(storeName: string, query: (record: FreeDatabaseRecord) => boolean): FreeDatabaseRecord[] {
    try {
      const key = `db_${storeName}`;
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      return records.filter(query);
    } catch (error) {
      console.error('Failed to search records in localStorage:', error);
      return [];
    }
  }

  /**
   * Export data (free backup)
   */
  async exportData(): Promise<Record<string, FreeDatabaseRecord[]>> {
    const data: Record<string, FreeDatabaseRecord[]> = {};
    
    for (const storeName of this.config.stores) {
      data[storeName] = await this.list(storeName, 10000, 0); // Export all records
    }
    
    return data;
  }

  /**
   * Import data (free restore)
   */
  async importData(data: Record<string, FreeDatabaseRecord[]>): Promise<void> {
    for (const [storeName, records] of Object.entries(data)) {
      for (const record of records) {
        await this.create(storeName, record.data);
      }
    }
  }

  /**
   * Clear all data (free reset)
   */
  async clearAllData(): Promise<void> {
    for (const storeName of this.config.stores) {
      if (this.db) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.clear();
      } else {
        localStorage.removeItem(`db_${storeName}`);
      }
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    
    for (const storeName of this.config.stores) {
      const records = await this.list(storeName, 10000, 0);
      stats[storeName] = records.length;
    }
    
    return stats;
  }
}

// Create singleton instance
export const freeDatabase = FreeDatabase.getInstance();

// Initialize database on import
freeDatabase.initialize();
