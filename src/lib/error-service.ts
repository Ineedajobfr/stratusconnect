// Error Service - Industry Standard Implementation
// FCA Compliant Aviation Platform

export interface ErrorInfo {
  id: string;
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'validation' | 'authentication' | 'authorization' | 'business' | 'system';
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
  resolved?: boolean;
  resolution?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  averageResolutionTime: number;
  criticalErrors: number;
  resolvedErrors: number;
}

class ErrorService {
  private errors: Map<string, ErrorInfo> = new Map();
  private errorListeners: ((error: ErrorInfo) => void)[] = [];
  private maxErrors = 1000; // Maximum number of errors to keep in memory

  // Log an error
  logError(
    error: Error | string,
    context?: {
      component?: string;
      userId?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      category?: 'network' | 'validation' | 'authentication' | 'authorization' | 'business' | 'system';
      additionalInfo?: Record<string, any>;
    }
  ): string {
    const errorId = crypto.randomUUID();
    const timestamp = new Date();
    
    const errorInfo: ErrorInfo = {
      id: errorId,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      component: context?.component,
      userId: context?.userId,
      timestamp,
      severity: context?.severity || 'medium',
      category: context?.category || 'system',
      context: context?.additionalInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
      resolved: false
    };

    // Store error
    this.errors.set(errorId, errorInfo);

    // Cleanup old errors if we exceed the limit
    if (this.errors.size > this.maxErrors) {
      const oldestError = Array.from(this.errors.entries())
        .sort(([, a], [, b]) => a.timestamp.getTime() - b.timestamp.getTime())[0];
      this.errors.delete(oldestError[0]);
    }

    // Notify listeners
    this.errorListeners.forEach(listener => listener(errorInfo));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo);
    }

    // Send to external logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalLogger(errorInfo);
    }

    return errorId;
  }

  // Get error by ID
  getError(errorId: string): ErrorInfo | undefined {
    return this.errors.get(errorId);
  }

  // Get all errors
  getAllErrors(): ErrorInfo[] {
    return Array.from(this.errors.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // Get errors by severity
  getErrorsBySeverity(severity: string): ErrorInfo[] {
    return this.getAllErrors().filter(error => error.severity === severity);
  }

  // Get errors by category
  getErrorsByCategory(category: string): ErrorInfo[] {
    return this.getAllErrors().filter(error => error.category === category);
  }

  // Get unresolved errors
  getUnresolvedErrors(): ErrorInfo[] {
    return this.getAllErrors().filter(error => !error.resolved);
  }

  // Resolve an error
  resolveError(errorId: string, resolution: string): boolean {
    const error = this.errors.get(errorId);
    if (error) {
      error.resolved = true;
      error.resolution = resolution;
      this.errors.set(errorId, error);
      return true;
    }
    return false;
  }

  // Get error metrics
  getErrorMetrics(): ErrorMetrics {
    const allErrors = this.getAllErrors();
    const totalErrors = allErrors.length;
    
    const errorsByCategory = allErrors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = allErrors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const criticalErrors = allErrors.filter(error => error.severity === 'critical').length;
    const resolvedErrors = allErrors.filter(error => error.resolved).length;

    // Calculate average resolution time
    const resolvedErrorsWithTime = allErrors.filter(error => 
      error.resolved && error.resolution
    );
    const averageResolutionTime = resolvedErrorsWithTime.length > 0 
      ? resolvedErrorsWithTime.reduce((sum, error) => {
          const resolutionTime = error.timestamp.getTime() - error.timestamp.getTime();
          return sum + resolutionTime;
        }, 0) / resolvedErrorsWithTime.length
      : 0;

    return {
      totalErrors,
      errorsByCategory,
      errorsBySeverity,
      averageResolutionTime,
      criticalErrors,
      resolvedErrors
    };
  }

  // Subscribe to error events
  subscribeToErrors(listener: (error: ErrorInfo) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  // Clear all errors
  clearAllErrors(): void {
    this.errors.clear();
  }

  // Clear resolved errors
  clearResolvedErrors(): void {
    const unresolvedErrors = this.getUnresolvedErrors();
    this.errors.clear();
    unresolvedErrors.forEach(error => this.errors.set(error.id, error));
  }

  // Send error to external logging service
  private async sendToExternalLogger(errorInfo: ErrorInfo): Promise<void> {
    try {
      // In a real implementation, this would send to a service like Sentry, LogRocket, etc.
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo)
      });
    } catch (error) {
      console.error('Failed to send error to external logger:', error);
    }
  }

  // Create error boundary state
  createErrorBoundaryState(error: Error, errorInfo: React.ErrorInfo): ErrorBoundaryState {
    const errorId = this.logError(error, {
      component: 'ErrorBoundary',
      severity: 'high',
      category: 'system',
      additionalInfo: {
        componentStack: errorInfo.componentStack
      }
    });

    return {
      hasError: true,
      error,
      errorInfo,
      errorId
    };
  }

  // Handle async errors
  handleAsyncError(error: Error, context?: any): string {
    return this.logError(error, {
      ...context,
      category: 'system',
      severity: 'medium'
    });
  }

  // Handle network errors
  handleNetworkError(error: Error, url: string, method: string): string {
    return this.logError(error, {
      category: 'network',
      severity: 'medium',
      additionalInfo: { url, method }
    });
  }

  // Handle validation errors
  handleValidationError(message: string, field: string, value: any): string {
    return this.logError(message, {
      category: 'validation',
      severity: 'low',
      additionalInfo: { field, value }
    });
  }

  // Handle authentication errors
  handleAuthError(error: Error, userId?: string): string {
    return this.logError(error, {
      category: 'authentication',
      severity: 'high',
      userId,
      additionalInfo: { action: 'authentication' }
    });
  }

  // Handle authorization errors
  handleAuthzError(error: Error, userId: string, resource: string): string {
    return this.logError(error, {
      category: 'authorization',
      severity: 'high',
      userId,
      additionalInfo: { resource, action: 'authorization' }
    });
  }

  // Handle business logic errors
  handleBusinessError(message: string, context: any): string {
    return this.logError(message, {
      category: 'business',
      severity: 'medium',
      additionalInfo: context
    });
  }

  // Create user-friendly error message
  createUserFriendlyMessage(error: ErrorInfo): string {
    switch (error.category) {
      case 'network':
        return 'Network connection issue. Please check your internet connection and try again.';
      case 'validation':
        return 'Please check your input and try again.';
      case 'authentication':
        return 'Authentication failed. Please log in again.';
      case 'authorization':
        return 'You do not have permission to perform this action.';
      case 'business':
        return error.message;
      case 'system':
        return 'A system error occurred. Please try again or contact support.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Get error recovery suggestions
  getRecoverySuggestions(error: ErrorInfo): string[] {
    const suggestions: string[] = [];

    switch (error.category) {
      case 'network':
        suggestions.push('Check your internet connection');
        suggestions.push('Try refreshing the page');
        suggestions.push('Check if the service is available');
        break;
      case 'validation':
        suggestions.push('Check all required fields are filled');
        suggestions.push('Verify the format of your input');
        suggestions.push('Check for any special characters');
        break;
      case 'authentication':
        suggestions.push('Try logging in again');
        suggestions.push('Check your credentials');
        suggestions.push('Contact support if the issue persists');
        break;
      case 'authorization':
        suggestions.push('Contact your administrator for access');
        suggestions.push('Check if your account has the required permissions');
        break;
      case 'business':
        suggestions.push('Review your request and try again');
        suggestions.push('Contact support for assistance');
        break;
      case 'system':
        suggestions.push('Try refreshing the page');
        suggestions.push('Clear your browser cache');
        suggestions.push('Contact support if the issue persists');
        break;
    }

    return suggestions;
  }

  // Export errors for analysis
  exportErrors(): string {
    const errors = this.getAllErrors();
    const exportData = {
      errors,
      metrics: this.getErrorMetrics(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  }
}

export const errorService = new ErrorService();
