// Real-time Notification Service - Industry Standard Implementation
// FCA Compliant Aviation Platform

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  userId: string;
  type: 'rfq_received' | 'quote_received' | 'quote_accepted' | 'quote_rejected' | 'payment_received' | 'escrow_released' | 'dispute_created' | 'system_alert';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationChannel {
  id: string;
  userId: string;
  type: 'email' | 'push' | 'sms' | 'in_app';
  enabled: boolean;
  settings: Record<string, any>;
}

class NotificationService {
  private subscriptions: Map<string, any> = new Map();

  // Send notification to user
  async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          read: false,
          priority: notification.priority,
          expires_at: notification.expiresAt
        })
        .select()
        .single();

      if (error) throw error;

      // Send real-time notification
      await this.sendRealtimeNotification(userId, data);

      // Send external notifications (email, push, SMS)
      await this.sendExternalNotifications(userId, data);

      return {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        read: data.read,
        priority: data.priority,
        createdAt: data.created_at,
        expiresAt: data.expires_at
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Get notifications for user
  async getNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        read: notification.read,
        priority: notification.priority,
        createdAt: notification.created_at,
        expiresAt: notification.expires_at
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void): () => void {
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        const notification = payload.new as any;
        callback({
          id: notification.id,
          userId: notification.user_id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          read: notification.read,
          priority: notification.priority,
          createdAt: notification.created_at,
          expiresAt: notification.expires_at
        });
      })
      .subscribe();

    this.subscriptions.set(userId, subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(userId);
    };
  }

  // Send RFQ notification to operators
  async notifyRFQReceived(rfqId: string, brokerId: string): Promise<void> {
    try {
      // Get all operators
      const { data: operators, error } = await supabase
        .from('operators')
        .select('id, company_name')
        .eq('status', 'active');

      if (error) throw error;

      // Get RFQ details
      const { data: rfq, error: rfqError } = await supabase
        .from('rfqs')
        .select('legs, total_passengers, total_value, currency')
        .eq('id', rfqId)
        .single();

      if (rfqError) throw error;

      // Send notification to each operator
      for (const operator of operators) {
        await this.sendNotification(operator.id, {
          type: 'rfq_received',
          title: 'New RFQ Available',
          message: `New charter request: ${rfq.legs[0]?.from} to ${rfq.legs[0]?.to} for ${rfq.total_passengers} passengers`,
          data: {
            rfqId,
            brokerId,
            route: `${rfq.legs[0]?.from} to ${rfq.legs[0]?.to}`,
            passengers: rfq.total_passengers,
            value: rfq.total_value,
            currency: rfq.currency
          },
          priority: 'high'
        });
      }
    } catch (error) {
      console.error('Error notifying operators about RFQ:', error);
    }
  }

  // Send quote notification to broker
  async notifyQuoteReceived(rfqId: string, quoteId: string, operatorId: string): Promise<void> {
    try {
      // Get RFQ broker
      const { data: rfq, error: rfqError } = await supabase
        .from('rfqs')
        .select('broker_id, legs, total_passengers')
        .eq('id', rfqId)
        .single();

      if (rfqError) throw error;

      // Get operator details
      const { data: operator, error: operatorError } = await supabase
        .from('operators')
        .select('company_name')
        .eq('id', operatorId)
        .single();

      if (operatorError) throw error;

      // Get quote details
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('price, currency, aircraft')
        .eq('id', quoteId)
        .single();

      if (quoteError) throw error;

      await this.sendNotification(rfq.broker_id, {
        type: 'quote_received',
        title: 'New Quote Received',
        message: `${operator.company_name} submitted a quote for ${rfq.legs[0]?.from} to ${rfq.legs[0]?.to}`,
        data: {
          rfqId,
          quoteId,
          operatorId,
          operatorName: operator.company_name,
          price: quote.price,
          currency: quote.currency,
          aircraft: quote.aircraft
        },
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error notifying broker about quote:', error);
    }
  }

  // Send quote acceptance notification
  async notifyQuoteAccepted(quoteId: string, operatorId: string): Promise<void> {
    try {
      // Get quote details
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select(`
          rfq_id,
          price,
          currency,
          aircraft,
          rfqs!quotes_rfq_id_fkey (
            broker_id,
            legs
          )
        `)
        .eq('id', quoteId)
        .single();

      if (quoteError) throw error;

      const rfq = quote.rfqs;

      await this.sendNotification(operatorId, {
        type: 'quote_accepted',
        title: 'Quote Accepted!',
        message: `Your quote for ${rfq.legs[0]?.from} to ${rfq.legs[0]?.to} has been accepted`,
        data: {
          quoteId,
          rfqId: quote.rfq_id,
          price: quote.price,
          currency: quote.currency,
          aircraft: quote.aircraft
        },
        priority: 'high'
      });
    } catch (error) {
      console.error('Error notifying operator about quote acceptance:', error);
    }
  }

  // Send payment notification
  async notifyPaymentReceived(bookingId: string, operatorId: string, amount: number, currency: string): Promise<void> {
    try {
      await this.sendNotification(operatorId, {
        type: 'payment_received',
        title: 'Payment Received',
        message: `Payment of ${currency} ${amount.toLocaleString()} has been received and is held in escrow`,
        data: {
          bookingId,
          amount,
          currency
        },
        priority: 'high'
      });
    } catch (error) {
      console.error('Error notifying operator about payment:', error);
    }
  }

  // Send escrow release notification
  async notifyEscrowReleased(escrowId: string, operatorId: string, amount: number, currency: string): Promise<void> {
    try {
      await this.sendNotification(operatorId, {
        type: 'escrow_released',
        title: 'Funds Released',
        message: `Escrow funds of ${currency} ${amount.toLocaleString()} have been released to your account`,
        data: {
          escrowId,
          amount,
          currency
        },
        priority: 'high'
      });
    } catch (error) {
      console.error('Error notifying operator about escrow release:', error);
    }
  }

  // Send dispute notification
  async notifyDisputeCreated(escrowId: string, brokerId: string, operatorId: string, reason: string): Promise<void> {
    try {
      // Notify both parties
      const parties = [
        { id: brokerId, role: 'broker' },
        { id: operatorId, role: 'operator' }
      ];

      for (const party of parties) {
        await this.sendNotification(party.id, {
          type: 'dispute_created',
          title: 'Dispute Created',
          message: `A dispute has been created for escrow ${escrowId}. Reason: ${reason}`,
          data: {
            escrowId,
            reason,
            role: party.role
          },
          priority: 'urgent'
        });
      }
    } catch (error) {
      console.error('Error notifying parties about dispute:', error);
    }
  }

  // Private helper methods
  private async sendRealtimeNotification(userId: string, notification: any): Promise<void> {
    // Send real-time notification via WebSocket
    await supabase
      .channel(`notifications:${userId}`)
      .send({
        type: 'broadcast',
        event: 'notification',
        payload: notification
      });
  }

  private async sendExternalNotifications(userId: string, notification: any): Promise<void> {
    try {
      // Get user notification preferences
      const { data: channels, error } = await supabase
        .from('notification_channels')
        .select('*')
        .eq('user_id', userId)
        .eq('enabled', true);

      if (error) throw error;

      // Send to each enabled channel
      for (const channel of channels) {
        switch (channel.type) {
          case 'email':
            await this.sendEmailNotification(userId, notification, channel.settings);
            break;
          case 'push':
            await this.sendPushNotification(userId, notification, channel.settings);
            break;
          case 'sms':
            await this.sendSMSNotification(userId, notification, channel.settings);
            break;
        }
      }
    } catch (error) {
      console.error('Error sending external notifications:', error);
    }
  }

  private async sendEmailNotification(userId: string, notification: any, settings: any): Promise<void> {
    // In a real implementation, this would send email via SendGrid, AWS SES, etc.
    console.log(`Sending email notification to user ${userId}:`, notification.title);
  }

  private async sendPushNotification(userId: string, notification: any, settings: any): Promise<void> {
    // In a real implementation, this would send push notification via FCM, APNS, etc.
    console.log(`Sending push notification to user ${userId}:`, notification.title);
  }

  private async sendSMSNotification(userId: string, notification: any, settings: any): Promise<void> {
    // In a real implementation, this would send SMS via Twilio, AWS SNS, etc.
    console.log(`Sending SMS notification to user ${userId}:`, notification.title);
  }
}

export const notificationService = new NotificationService();
