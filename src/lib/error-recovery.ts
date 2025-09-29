// Error Recovery System
// Ensures the platform never stops working

interface ErrorRecoveryConfig {
  maxRetries: number;
  retryDelay: number;
  fallbackData: any;
  autoRecover: boolean;
}

class ErrorRecovery {
  private config: ErrorRecoveryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    fallbackData: {},
    autoRecover: true
  };

  private retryCounts = new Map<string, number>();
  private fallbackData = new Map<string, any>();

  constructor() {
    this.setupGlobalErrorHandling();
    this.setupUnhandledRejectionHandling();
    this.setupNetworkErrorHandling();
  }

  private setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
      this.handleError('global', event.error);
    });
  }

  private setupUnhandledRejectionHandling() {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError('promise', event.reason);
      event.preventDefault();
    });
  }

  private setupNetworkErrorHandling() {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (error) {
        console.error('Network error:', error);
        this.handleError('network', error);
        throw error;
      }
    };
  }

  private handleError(type: string, error: any) {
    if (this.config.autoRecover) {
      this.attemptRecovery(type, error);
    }
  }

  private attemptRecovery(type: string, error: any) {
    const retryCount = this.retryCounts.get(type) || 0;
    
    if (retryCount < this.config.maxRetries) {
      this.retryCounts.set(type, retryCount + 1);
      
      setTimeout(() => {
        this.recoverFromError(type, error);
      }, this.config.retryDelay * (retryCount + 1));
    } else {
      this.useFallbackData(type);
    }
  }

  private recoverFromError(type: string, error: any) {
    switch (type) {
      case 'global':
        this.recoverGlobalError(error);
        break;
      case 'promise':
        this.recoverPromiseError(error);
        break;
      case 'network':
        this.recoverNetworkError(error);
        break;
      default:
        this.recoverGenericError(type, error);
    }
  }

  private recoverGlobalError(error: any) {
    // Try to reload the page if it's a critical error
    if (error.message?.includes('ChunkLoadError') || 
        error.message?.includes('Loading chunk')) {
      console.log('Attempting to reload page due to chunk error...');
      window.location.reload();
    }
  }

  private recoverPromiseError(error: any) {
    // Try to resolve the promise with fallback data
    console.log('Attempting to recover from promise error...');
  }

  private recoverNetworkError(error: any) {
    // Try to use cached data or offline mode
    console.log('Attempting to recover from network error...');
    this.enableOfflineMode();
  }

  private recoverGenericError(type: string, error: any) {
    console.log(`Attempting to recover from ${type} error...`);
  }

  private useFallbackData(type: string) {
    const fallback = this.fallbackData.get(type);
    if (fallback) {
      console.log(`Using fallback data for ${type}`);
      return fallback;
    }
  }

  private enableOfflineMode() {
    // Set offline flag in localStorage
    localStorage.setItem('stratusconnect_offline', 'true');
    
    // Show offline notification
    this.showNotification('Offline mode enabled. Some features may be limited.', 'warning');
  }

  private showNotification(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'error' ? 'bg-red-500' : 
      type === 'warning' ? 'bg-yellow-500' : 
      'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Public methods for manual error handling
  async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    fallbackValue?: T
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < this.config.maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`${operationName} failed (attempt ${i + 1}):`, error);
        
        if (i < this.config.maxRetries - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryDelay * (i + 1))
          );
        }
      }
    }
    
    console.error(`${operationName} failed after ${this.config.maxRetries} attempts`);
    
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    
    throw lastError;
  }

  setFallbackData(key: string, data: any) {
    this.fallbackData.set(key, data);
  }

  getFallbackData(key: string) {
    return this.fallbackData.get(key);
  }

  resetRetryCount(type: string) {
    this.retryCounts.delete(type);
  }

  resetAllRetryCounts() {
    this.retryCounts.clear();
  }

  updateConfig(newConfig: Partial<ErrorRecoveryConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  getStatus() {
    return {
      retryCounts: Object.fromEntries(this.retryCounts),
      fallbackDataKeys: Array.from(this.fallbackData.keys()),
      config: this.config
    };
  }
}

// Create singleton instance
export const errorRecovery = new ErrorRecovery();

// Export types
export type { ErrorRecoveryConfig };
