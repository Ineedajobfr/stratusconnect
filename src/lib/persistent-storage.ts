// Persistent Data Storage System
// Ensures all user data is always saved and available

interface StorageData {
  users: Record<string, any>;
  deals: Record<string, any>;
  messages: Record<string, any>;
  documents: Record<string, any>;
  settings: Record<string, any>;
  lastUpdated: number;
}

class PersistentStorage {
  private storageKey = 'stratusconnect_data';
  private backupKey = 'stratusconnect_backup';
  private data: StorageData = {
    users: {},
    deals: {},
    messages: {},
    documents: {},
    settings: {},
    lastUpdated: Date.now()
  };

  constructor() {
    this.loadData();
    this.setupAutoSave();
    this.setupBackup();
  }

  private loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = { ...this.data, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
      this.loadFromBackup();
    }
  }

  private loadFromBackup() {
    try {
      const backup = localStorage.getItem(this.backupKey);
      if (backup) {
        this.data = { ...this.data, ...JSON.parse(backup) };
      }
    } catch (error) {
      console.warn('Failed to load backup data:', error);
    }
  }

  private saveData() {
    try {
      this.data.lastUpdated = Date.now();
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      // Also save as backup
      localStorage.setItem(this.backupKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  private setupAutoSave() {
    // Save every 5 seconds
    setInterval(() => {
      this.saveData();
    }, 5000);

    // Save before page unload
    window.addEventListener('beforeunload', () => {
      this.saveData();
    });

    // Save on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveData();
      }
    });
  }

  private setupBackup() {
    // Create backup every minute
    setInterval(() => {
      try {
        const backup = JSON.stringify(this.data);
        localStorage.setItem(this.backupKey, backup);
      } catch (error) {
        console.warn('Failed to create backup:', error);
      }
    }, 60000);
  }

  // User data methods
  saveUser(userId: string, userData: any) {
    this.data.users[userId] = {
      ...userData,
      lastUpdated: Date.now()
    };
    this.saveData();
  }

  getUser(userId: string) {
    return this.data.users[userId] || null;
  }

  getAllUsers() {
    return Object.values(this.data.users);
  }

  // Deal data methods
  saveDeal(dealId: string, dealData: any) {
    this.data.deals[dealId] = {
      ...dealData,
      lastUpdated: Date.now()
    };
    this.saveData();
  }

  getDeal(dealId: string) {
    return this.data.deals[dealId] || null;
  }

  getAllDeals() {
    return Object.values(this.data.deals);
  }

  // Message data methods
  saveMessage(messageId: string, messageData: any) {
    this.data.messages[messageId] = {
      ...messageData,
      lastUpdated: Date.now()
    };
    this.saveData();
  }

  getMessage(messageId: string) {
    return this.data.messages[messageId] || null;
  }

  getMessagesByConversation(conversationId: string) {
    return Object.values(this.data.messages)
      .filter((msg: any) => msg.conversationId === conversationId)
      .sort((a: any, b: any) => a.timestamp - b.timestamp);
  }

  // Document data methods
  saveDocument(docId: string, docData: any) {
    this.data.documents[docId] = {
      ...docData,
      lastUpdated: Date.now()
    };
    this.saveData();
  }

  getDocument(docId: string) {
    return this.data.documents[docId] || null;
  }

  getAllDocuments() {
    return Object.values(this.data.documents);
  }

  // Settings methods
  saveSetting(key: string, value: any) {
    this.data.settings[key] = {
      value,
      lastUpdated: Date.now()
    };
    this.saveData();
  }

  getSetting(key: string, defaultValue: any = null) {
    return this.data.settings[key]?.value || defaultValue;
  }

  // Search methods
  searchUsers(query: string) {
    const users = this.getAllUsers();
    return users.filter((user: any) => 
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase()) ||
      user.role?.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchDeals(query: string) {
    const deals = this.getAllDeals();
    return deals.filter((deal: any) => 
      deal.aircraft?.toLowerCase().includes(query.toLowerCase()) ||
      deal.origin?.toLowerCase().includes(query.toLowerCase()) ||
      deal.destination?.toLowerCase().includes(query.toLowerCase()) ||
      deal.operator?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Export/Import methods
  exportData() {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string) {
    try {
      const imported = JSON.parse(jsonData);
      this.data = { ...this.data, ...imported };
      this.saveData();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear data methods
  clearAllData() {
    this.data = {
      users: {},
      deals: {},
      messages: {},
      documents: {},
      settings: {},
      lastUpdated: Date.now()
    };
    this.saveData();
  }

  clearUserData(userId: string) {
    delete this.data.users[userId];
    // Also clear user's deals and messages
    Object.keys(this.data.deals).forEach(dealId => {
      if (this.data.deals[dealId].userId === userId) {
        delete this.data.deals[dealId];
      }
    });
    Object.keys(this.data.messages).forEach(msgId => {
      if (this.data.messages[msgId].userId === userId) {
        delete this.data.messages[msgId];
      }
    });
    this.saveData();
  }

  // Statistics
  getStats() {
    return {
      totalUsers: Object.keys(this.data.users).length,
      totalDeals: Object.keys(this.data.deals).length,
      totalMessages: Object.keys(this.data.messages).length,
      totalDocuments: Object.keys(this.data.documents).length,
      lastUpdated: this.data.lastUpdated,
      storageSize: JSON.stringify(this.data).length
    };
  }
}

// Create singleton instance
export const persistentStorage = new PersistentStorage();

// Export types
export type { StorageData };
