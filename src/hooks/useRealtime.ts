import { useEffect, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeSubscription {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  filter?: string;
  callback: (payload: any) => void;
}

export const useRealtime = (subscriptions: RealtimeSubscription[]) => {
  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    // Clean up existing channels
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    // Create new subscriptions
    subscriptions.forEach(({ table, event, filter, callback }) => {
      const channelName = `${table}-${event}-${filter || 'all'}`;
      
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
            filter: filter ? `(${filter})` : undefined
          },
          callback
        )
        .subscribe();

      channelsRef.current.push(channel);
    });

    // Cleanup function
    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [subscriptions]);

  return channelsRef.current;
};

// Specific hooks for common use cases
export const useQuotesRealtime = (requestId: string, callback: (payload: any) => void) => {
  return useRealtime([
    {
      table: 'quotes',
      event: 'INSERT',
      filter: `request_id=eq.${requestId}`,
      callback
    },
    {
      table: 'quotes',
      event: 'UPDATE',
      filter: `request_id=eq.${requestId}`,
      callback
    }
  ]);
};

export const useFlightStatusRealtime = (bookingId: string, callback: (payload: any) => void) => {
  return useRealtime([
    {
      table: 'flights',
      event: 'UPDATE',
      filter: `booking_id=eq.${bookingId}`,
      callback
    }
  ]);
};

export const useNotificationsRealtime = (userId: string, callback: (payload: any) => void) => {
  return useRealtime([
    {
      table: 'notifications',
      event: 'INSERT',
      filter: `user_id=eq.${userId}`,
      callback
    }
  ]);
};

export const useMessagesRealtime = (threadId: string, callback: (payload: any) => void) => {
  return useRealtime([
    {
      table: 'messages',
      event: 'INSERT',
      filter: `thread_id=eq.${threadId}`,
      callback
    }
  ]);
};

export const useBookingRealtime = (bookingId: string, callback: (payload: any) => void) => {
  return useRealtime([
    {
      table: 'bookings',
      event: 'UPDATE',
      filter: `id=eq.${bookingId}`,
      callback
    },
    {
      table: 'flights',
      event: 'UPDATE',
      filter: `booking_id=eq.${bookingId}`,
      callback
    }
  ]);
};
