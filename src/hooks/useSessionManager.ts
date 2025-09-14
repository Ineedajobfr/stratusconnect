import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SessionManagerOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
}

export const useSessionManager = ({
  timeoutMinutes = 60, // Increased from 20 to 60 minutes
  warningMinutes = 5,   // Increased from 2 to 5 minutes
  onTimeout,
  onWarning
}: SessionManagerOptions = {}) => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Session Expired",
      description: "You have been signed out due to inactivity.",
      variant: "destructive"
    });
    onTimeout?.();
  }, [navigate, onTimeout]);

  const showWarning = useCallback(() => {
    toast({
      title: "Session Warning",
      description: `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
      variant: "destructive"
    });
    onWarning?.();
  }, [warningMinutes, onWarning]);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Set warning timer
    const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
    warningRef.current = setTimeout(showWarning, warningTime);

    // Set timeout timer
    const timeoutTime = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(signOut, timeoutTime);
  }, [timeoutMinutes, warningMinutes, signOut, showWarning]);

  useEffect(() => {
    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttled activity handler
    let throttleTimeout: NodeJS.Timeout;
    const handleActivity = () => {
      if (throttleTimeout) return;
      
      throttleTimeout = setTimeout(() => {
        resetTimer();
        throttleTimeout = null;
      }, 1000); // Throttle to once per second
    };

    // Tab close/beforeunload handler
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      event.preventDefault();
      await supabase.auth.signOut();
      return '';
    };

    // Page visibility change handler (for tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - pause the timer instead of immediate logout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningRef.current) {
          clearTimeout(warningRef.current);
        }
      } else {
        // Tab is visible again - reset normal timer
        resetTimer();
      }
    };

    // Initialize timer
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }

      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resetTimer, signOut]);

  return { resetTimer };
};