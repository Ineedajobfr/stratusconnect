// Error Boundary Component - Industry Standard Implementation
// FCA Compliant Aviation Platform

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { errorService } from '@/lib/error-service';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Send,
  Copy,
  CheckCircle
} from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
  allowRetry?: boolean;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
  retryCount: number;
  isReporting: boolean;
  isReported: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isReporting: false,
      isReported: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorBoundaryState = errorService.createErrorBoundaryState(error, errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo,
      errorId: errorBoundaryState.errorId
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        errorId: undefined,
        retryCount: prevState.retryCount + 1,
        isReported: false
      }));
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = async () => {
    if (!this.state.errorId) return;

    this.setState({ isReporting: true });

    try {
      // In a real implementation, this would send the error report to a service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      this.setState({ isReported: true });
    } catch (error) {
      console.error('Failed to report error:', error);
    } finally {
      this.setState({ isReporting: false });
    }
  };

  handleCopyError = () => {
    if (this.state.errorId) {
      const error = errorService.getError(this.state.errorId);
      if (error) {
        const errorText = `
Error ID: ${error.id}
Message: ${error.message}
Component: ${error.component || 'Unknown'}
Timestamp: ${error.timestamp.toISOString()}
Stack: ${error.stack || 'No stack trace available'}
        `.trim();
        
        navigator.clipboard.writeText(errorText);
      }
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.errorId ? errorService.getError(this.state.errorId) : null;
      const userFriendlyMessage = error ? errorService.createUserFriendlyMessage(error) : 'An unexpected error occurred';
      const recoverySuggestions = error ? errorService.getRecoverySuggestions(error) : [];

      return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${this.props.className || ''}`}>
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-600">Something went wrong</CardTitle>
              <p className="text-gray-600 mt-2">{userFriendlyMessage}</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error ID and Status */}
              {this.state.errorId && (
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bug className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-mono">Error ID: {this.state.errorId}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={this.handleCopyError}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              )}

              {/* Recovery Suggestions */}
              {recoverySuggestions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">What you can try:</h3>
                  <ul className="space-y-1">
                    {recoverySuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mt-2" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Error Details (Development Only) */}
              {this.props.showDetails && this.state.error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <details className="mt-2">
                      <summary className="cursor-pointer font-semibold">Error Details</summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {this.props.allowRetry !== false && this.state.retryCount < this.maxRetries && (
                  <Button onClick={this.handleRetry} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                  </Button>
                )}
                
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                
                {this.state.errorId && !this.state.isReported && (
                  <Button
                    onClick={this.handleReportError}
                    disabled={this.state.isReporting}
                    variant="outline"
                    className="flex-1"
                  >
                    {this.state.isReporting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {this.state.isReporting ? 'Reporting...' : 'Report Error'}
                  </Button>
                )}
                
                {this.state.isReported && (
                  <Button disabled className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Error Reported
                  </Button>
                )}
              </div>

              {/* Retry Count Warning */}
              {this.state.retryCount >= this.maxRetries && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Maximum retry attempts reached. Please try refreshing the page or contact support.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error handling
export function useErrorHandler() {
  const handleError = (error: Error, context?: any) => {
    return errorService.handleAsyncError(error, context);
  };

  const handleNetworkError = (error: Error, url: string, method: string) => {
    return errorService.handleNetworkError(error, url, method);
  };

  const handleValidationError = (message: string, field: string, value: any) => {
    return errorService.handleValidationError(message, field, value);
  };

  const handleAuthError = (error: Error, userId?: string) => {
    return errorService.handleAuthError(error, userId);
  };

  const handleBusinessError = (message: string, context: any) => {
    return errorService.handleBusinessError(message, context);
  };

  return {
    handleError,
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    handleBusinessError
  };
}