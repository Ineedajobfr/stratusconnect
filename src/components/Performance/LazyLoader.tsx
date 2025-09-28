import React, { Suspense, ComponentType, ReactNode, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Default fallback component
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  </div>
);

// Generic lazy component creator
function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Basic lazy components for common UI elements
export const LazyButton = createLazyComponent(
  () => import('@/components/ui/button').then(module => ({ default: module.Button })),
  <DefaultFallback />
);

export const LazyCard = createLazyComponent(
  () => import('@/components/ui/card').then(module => ({ default: module.Card })),
  <DefaultFallback />
);

export const LazyDialog = createLazyComponent(
  () => import('@/components/ui/dialog').then(module => ({ default: module.Dialog })),
  <DefaultFallback />
);

// Higher-order component for lazy loading
interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback = <DefaultFallback />,
  delay = 0 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Hook for dynamic imports
export const useDynamicImport = <T,>(importFn: () => Promise<T>) => {
  const [component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    importFn()
      .then(setComponent)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { component, loading, error };
};

// Preload function for better performance
export const preloadComponent = (importFn: () => Promise<any>) => {
  const componentImport = importFn();
  return componentImport;
};

export default LazyLoader;