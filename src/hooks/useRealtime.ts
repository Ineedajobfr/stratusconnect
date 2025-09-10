import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Record<string, any>;
  old: Record<string, any>;
  schema: string;
  table: string;
}

interface UseRealtimeOptions {
  table?: string;
  event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
  filter?: string;
  onUpdate?: (payload: RealtimePayload) => void;
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const {
    table = '*',
    event = '*',
    filter,
    onUpdate
  } = options;

  useEffect(() => {
    if (!onUpdate) return;

    // Mock realtime - simplified for build
    return () => {};
  }, [table, event, filter, onUpdate]);
}

// Legacy exports for compatibility
export const useMessagesRealtime = useRealtime;
export const useNotificationsRealtime = useRealtime;