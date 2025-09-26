// Lazy Loader Component - Industry Standard Implementation
// FCA Compliant Aviation Platform

import React, { Suspense, lazy, ComponentType } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LazyLoaderProps {
  fallback?: React.ComponentType;
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
  className?: string;
}

// Default loading fallback
const DefaultFallback: React.FC = () => (
  <Card className="p-8 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
      <p className="text-gray-600">Loading component...</p>
    </div>
  </Card>
);

// Default error boundary
const DefaultErrorBoundary: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <Card className="p-8 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-600 mb-4">
        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Component</h3>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </Card>
);

// Error boundary wrapper
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<{ error: Error; retry: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyLoader Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <this.props.fallback error={this.state.error} retry={() => this.setState({ hasError: false, error: null })} />;
    }

    return this.props.children;
  }
}

// Main LazyLoader component
export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  fallback: Fallback = DefaultFallback,
  errorBoundary: ErrorBoundaryComponent = DefaultErrorBoundary,
  className
}) => {
  return (
    <div className={className}>
      <ErrorBoundary fallback={ErrorBoundaryComponent}>
        <Suspense fallback={<Fallback />}>
          {/* This will be replaced by the actual lazy component */}
          <div />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

// Utility function to create lazy components
export const createLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType,
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>
): React.LazyExoticComponent<T> => {
  const LazyComponent = lazy(importFunc);
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <ErrorBoundary fallback={errorBoundary || DefaultErrorBoundary}>
      <Suspense fallback={fallback ? <fallback /> : <DefaultFallback />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    </ErrorBoundary>
  )) as React.LazyExoticComponent<T>;
};

// Pre-configured lazy components for common use cases
export const LazyCard = createLazyComponent(
  () => import('@/components/ui/card').then(module => ({ default: module.Card })),
  () => <DefaultFallback />
);

export const LazyButton = createLazyComponent(
  () => import('@/components/ui/button').then(module => ({ default: module.Button })),
  () => <DefaultFallback />
);

export const LazyModal = createLazyComponent(
  () => import('@/components/ui/modal').then(module => ({ default: module.Modal })),
  () => <DefaultFallback />
);

// Route-based lazy loading
export const LazyRoute = createLazyComponent(
  () => import('react-router-dom').then(module => ({ default: module.Route })),
  () => <DefaultFallback />
);

// Terminal-specific lazy components
export const LazyBrokerTerminal = createLazyComponent(
  () => import('@/pages/BrokerTerminal'),
  () => <DefaultFallback />
);

export const LazyOperatorTerminal = createLazyComponent(
  () => import('@/pages/OperatorTerminal'),
  () => <DefaultFallback />
);

export const LazyPilotTerminal = createLazyComponent(
  () => import('@/pages/PilotTerminal'),
  () => <DefaultFallback />
);

export const LazyCrewTerminal = createLazyComponent(
  () => import('@/pages/CrewTerminal'),
  () => <DefaultFallback />
);

export const LazyAdminTerminal = createLazyComponent(
  () => import('@/pages/AdminTerminal'),
  () => <DefaultFallback />
);

// Widget lazy components
export const LazyWeatherWidget = createLazyComponent(
  () => import('@/components/Weather/WeatherWidget').then(module => ({ default: module.WeatherWidget })),
  () => <DefaultFallback />
);

export const LazyRiskAssessmentWidget = createLazyComponent(
  () => import('@/components/Risk/RiskAssessmentWidget').then(module => ({ default: module.RiskAssessmentWidget })),
  () => <DefaultFallback />
);

export const LazyAuditTrailWidget = createLazyComponent(
  () => import('@/components/Audit/AuditTrailWidget').then(module => ({ default: module.AuditTrailWidget })),
  () => <DefaultFallback />
);

export const LazyAIInsightsWidget = createLazyComponent(
  () => import('@/components/AI/AIInsightsWidget').then(module => ({ default: module.AIInsightsWidget })),
  () => <DefaultFallback />
);

// Chart lazy components
export const LazyChart = createLazyComponent(
  () => import('@/components/Charts/Chart').then(module => ({ default: module.Chart })),
  () => <DefaultFallback />
);

export const LazyLineChart = createLazyComponent(
  () => import('@/components/Charts/LineChart').then(module => ({ default: module.LineChart })),
  () => <DefaultFallback />
);

export const LazyBarChart = createLazyComponent(
  () => import('@/components/Charts/BarChart').then(module => ({ default: module.BarChart })),
  () => <DefaultFallback />
);

// Form lazy components
export const LazyForm = createLazyComponent(
  () => import('@/components/ui/form').then(module => ({ default: module.Form })),
  () => <DefaultFallback />
);

export const LazyInput = createLazyComponent(
  () => import('@/components/ui/input').then(module => ({ default: module.Input })),
  () => <DefaultFallback />
);

export const LazySelect = createLazyComponent(
  () => import('@/components/ui/select').then(module => ({ default: module.Select })),
  () => <DefaultFallback />
);

// Table lazy components
export const LazyTable = createLazyComponent(
  () => import('@/components/ui/table').then(module => ({ default: module.Table })),
  () => <DefaultFallback />
);

export const LazyDataTable = createLazyComponent(
  () => import('@/components/ui/data-table').then(module => ({ default: module.DataTable })),
  () => <DefaultFallback />
);

// Hook for lazy loading with retry logic
export const useLazyLoad = <T>(
  importFunc: () => Promise<T>,
  deps: any[] = []
): { data: T | null; loading: boolean; error: Error | null; retry: () => void } => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await importFunc();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, deps);

  React.useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, retry: load };
};

// Higher-order component for lazy loading
export const withLazyLoad = <P extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ComponentType,
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>
) => {
  const LazyComponent = createLazyComponent(importFunc, fallback, errorBoundary);
  
  return React.forwardRef<any, P>((props, ref) => (
    <LazyComponent {...props} ref={ref} />
  ));
};
