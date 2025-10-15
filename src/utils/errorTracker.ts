// Error Tracker - For AI Security System
// Tracks real errors that occur in the application

interface TrackedError {
    id: string;
    message: string;
    stack?: string;
    timestamp: Date;
    component?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorTracker {
    private errors: TrackedError[] = [];
    private maxErrors = 50; // Keep last 50 errors

    constructor() {
        this.initializeGlobalErrorHandling();
    }

    private initializeGlobalErrorHandling() {
        // Track unhandled errors
        window.addEventListener('error', (event) => {
            this.trackError({
                message: event.message,
                stack: event.error?.stack,
                component: this.extractComponentFromStack(event.error?.stack),
                severity: this.determineSeverity(event.error)
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError({
                message: `Unhandled Promise Rejection: ${event.reason}`,
                stack: event.reason?.stack,
                component: this.extractComponentFromStack(event.reason?.stack),
                severity: 'high'
            });
        });

        // Make error tracker available globally for AI system
        (window as any).__errorTracker = this;
        (window as any).__errorCount = () => this.errors.length;
        (window as any).__recentErrors = () => this.errors.slice(-10).map(e => e.message);
    }

    private extractComponentFromStack(stack?: string): string {
        if (!stack) return 'Unknown';
        
        // Try to extract component name from stack trace
        const lines = stack.split('\n');
        for (const line of lines) {
            if (line.includes('.tsx:') || line.includes('.ts:')) {
                const match = line.match(/(\w+)\.tsx?:\d+:\d+/);
                if (match) {
                    return match[1];
                }
            }
        }
        return 'Unknown';
    }

    private determineSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
        if (!error) return 'medium';
        
        const message = error.message?.toLowerCase() || '';
        
        // Critical errors
        if (message.includes('cannot read property') || 
            message.includes('undefined is not a function') ||
            message.includes('network error') ||
            message.includes('database')) {
            return 'critical';
        }
        
        // High severity
        if (message.includes('failed to') || 
            message.includes('timeout') ||
            message.includes('unauthorized')) {
            return 'high';
        }
        
        // Medium severity
        if (message.includes('warning') || 
            message.includes('deprecated')) {
            return 'medium';
        }
        
        return 'low';
    }

    public trackError(error: Omit<TrackedError, 'id' | 'timestamp'>) {
        const trackedError: TrackedError = {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            ...error
        };

        this.errors.push(trackedError);
        
        // Keep only the most recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Update global counters for AI system
        (window as any).__errorCount = this.errors.length;
        (window as any).__recentErrors = this.errors.slice(-10).map(e => e.message);

        console.log(`🚨 Error Tracked: ${trackedError.message}`, trackedError);
    }

    public getRecentErrors(count: number = 10): TrackedError[] {
        return this.errors.slice(-count);
    }

    public getErrorsBySeverity(severity: TrackedError['severity']): TrackedError[] {
        return this.errors.filter(error => error.severity === severity);
    }

    public clearErrors() {
        this.errors = [];
        (window as any).__errorCount = 0;
        (window as any).__recentErrors = [];
    }

    public getErrorStats() {
        const stats = {
            total: this.errors.length,
            critical: this.errors.filter(e => e.severity === 'critical').length,
            high: this.errors.filter(e => e.severity === 'high').length,
            medium: this.errors.filter(e => e.severity === 'medium').length,
            low: this.errors.filter(e => e.severity === 'low').length,
            recent: this.errors.slice(-5).map(e => ({
                message: e.message,
                severity: e.severity,
                timestamp: e.timestamp,
                component: e.component
            }))
        };

        return stats;
    }
}

// Initialize error tracker
export const errorTracker = new ErrorTracker();

// Export for use in components
export const trackError = (error: Omit<TrackedError, 'id' | 'timestamp'>) => {
    errorTracker.trackError(error);
};

export default errorTracker;
