import { useState, useCallback, useRef, useEffect } from 'react';

// Optimized state hook that prevents unnecessary re-renders
export const useOptimizedState = <T>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const stateRef = useRef<T>(initialState);

  const setOptimizedState = useCallback((newState: T | ((prevState: T) => T)) => {
    const nextState = typeof newState === 'function' 
      ? (newState as (prevState: T) => T)(stateRef.current)
      : newState;
    
    // Only update if the state actually changed
    if (nextState !== stateRef.current) {
      stateRef.current = nextState;
      setState(nextState);
    }
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return [state, setOptimizedState] as const;
};

// Batched state updates for better performance
export const useBatchedState = <T extends Record<string, unknown>>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((updates: Partial<T>) => {
    // Accumulate updates
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Batch updates in next tick
    timeoutRef.current = setTimeout(() => {
      setState(prevState => ({ ...prevState, ...pendingUpdates.current }));
      pendingUpdates.current = {};
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchUpdate] as const;
};