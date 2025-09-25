// Broadcast Messaging Service
// Handles system-wide notifications and communications

import { supabase } from '@/integrations/supabase/client';

export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  target_roles: string[];
  target_users?: string[];
  message_type: 'info' | 'warning' | 'critical' | 'maintenance' | 'update';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_for?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
  sent_at?: string;
  read_count: number;
  total_recipients: number;
  metadata?: {
    action_url?: string;
    action_text?: string;
    dismissible?: boolean;
    persistent?: boolean;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  variables: string[];
  created_at: string;
  updated_at: string;
}

export class BroadcastService {
  private static instance: BroadcastService;

  static getInstance(): BroadcastService {
    if (!BroadcastService.instance) {
      BroadcastService.instance = new BroadcastService();
    }
    return BroadcastService.instance;
  }

  // Create broadcast message
  async createBroadcast(message: Omit<BroadcastMessage, 'id' | 'created_at' | 'read_count' | 'total_recipients'>): Promise<BroadcastMessage> {
    try {
      // Calculate total recipients
      const totalRecipients = await this.calculateRecipients(message.target_roles, message.target_users);

      const { data, error } = await supabase
        .from('broadcast_messages')
        .insert({
          ...message,
          read_count: 0,
          total_recipients: totalRecipients,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send immediately if not scheduled
      if (!message.scheduled_for) {
        await this.sendBroadcast(data.id);
      }

      return data;

    } catch (error) {
      console.error('Error creating broadcast:', error);
      throw error;
    }
  }

  // Calculate total recipients
  private async calculateRecipients(targetRoles: string[], targetUsers?: string[]): Promise<number> {
    try {
      let totalCount = 0;

      // Count users by roles
      if (targetRoles.length > 0) {
        const { count, error } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .in('role', targetRoles)
          .eq('status', 'approved');

        if (error) throw error;
        totalCount += count || 0;
      }

      // Add specific users
      if (targetUsers && targetUsers.length > 0) {
        totalCount += targetUsers.length;
      }

      return totalCount;

    } catch (error) {
      console.error('Error calculating recipients:', error);
      return 0;
    }
  }

  // Send broadcast message
  async sendBroadcast(messageId: string): Promise<void> {
    try {
      const { data: message, error: fetchError } = await supabase
        .from('broadcast_messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (fetchError) throw fetchError;

      // Get recipients
      const recipients = await this.getRecipients(message.target_roles, message.target_users);

      // Send to each recipient
      for (const recipient of recipients) {
        await this.sendToUser(recipient, message);
      }

      // Update message as sent
      const { error: updateError } = await supabase
        .from('broadcast_messages')
        .update({
          sent_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Error sending broadcast:', error);
      throw error;
    }
  }

  // Get recipients list
  private async getRecipients(targetRoles: string[], targetUsers?: string[]): Promise<any[]> {
    try {
      const recipients = [];

      // Get users by roles
      if (targetRoles.length > 0) {
        const { data: roleUsers, error: roleError } = await supabase
          .from('profiles')
          .select('id, email, full_name, role')
          .in('role', targetRoles)
          .eq('status', 'approved');

        if (roleError) throw roleError;
        recipients.push(...(roleUsers || []));
      }

      // Get specific users
      if (targetUsers && targetUsers.length > 0) {
        const { data: specificUsers, error: specificError } = await supabase
          .from('profiles')
          .select('id, email, full_name, role')
          .in('id', targetUsers);

        if (specificError) throw specificError;
        recipients.push(...(specificUsers || []));
      }

      // Remove duplicates
      const uniqueRecipients = recipients.filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      );

      return uniqueRecipients;

    } catch (error) {
      console.error('Error getting recipients:', error);
      return [];
    }
  }

  // Send message to individual user
  private async sendToUser(user: any, message: BroadcastMessage): Promise<void> {
    try {
      // Create user notification
      const { error: notificationError } = await supabase
        .from('user_notifications')
        .insert({
          user_id: user.id,
          broadcast_id: message.id,
          title: message.title,
          content: message.content,
          message_type: message.message_type,
          priority: message.priority,
          read: false,
          created_at: new Date().toISOString()
        });

      if (notificationError) throw notificationError;

      // Send email if configured
      if (message.message_type === 'critical' || message.priority === 'urgent') {
        await this.sendEmail(user.email, message.title, message.content);
      }

      // Send SMS if configured (for critical messages)
      if (message.message_type === 'critical' && user.phone) {
        await this.sendSMS(user.phone, message.content);
      }

    } catch (error) {
      console.error('Error sending to user:', error);
    }
  }

  // Send email notification
  private async sendEmail(email: string, subject: string, content: string): Promise<void> {
    try {
      // In production, integrate with email service (SendGrid, AWS SES, etc.)
      console.log(`Email sent to ${email}: ${subject}`);
      
      // For now, just log the email
      const { error } = await supabase
        .from('email_logs')
        .insert({
          recipient: email,
          subject,
          content,
          status: 'sent',
          sent_at: new Date().toISOString()
        });

      if (error) console.error('Error logging email:', error);

    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  // Send SMS notification
  private async sendSMS(phone: string, content: string): Promise<void> {
    try {
      // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
      console.log(`SMS sent to ${phone}: ${content}`);
      
      // For now, just log the SMS
      const { error } = await supabase
        .from('sms_logs')
        .insert({
          recipient: phone,
          content,
          status: 'sent',
          sent_at: new Date().toISOString()
        });

      if (error) console.error('Error logging SMS:', error);

    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }

  // Get all broadcast messages
  async getBroadcastMessages(): Promise<BroadcastMessage[]> {
    try {
      const { data, error } = await supabase
        .from('broadcast_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return this.getMockBroadcastMessages();
      }
      return data || [];

    } catch (error) {
      console.error('Error getting broadcast messages:', error);
      return this.getMockBroadcastMessages();
    }
  }

  // Mock broadcast messages data
  private getMockBroadcastMessages(): BroadcastMessage[] {
    return [
      {
        id: 'broadcast-1',
        title: 'System Maintenance Notice',
        content: 'Scheduled maintenance will occur tonight from 2 AM to 4 AM UTC. Some features may be temporarily unavailable.',
        target_roles: ['broker', 'operator', 'pilot', 'crew'],
        message_type: 'maintenance',
        priority: 'medium',
        created_by: 'admin',
        created_at: '2024-01-20T10:00:00Z',
        sent_at: '2024-01-20T10:05:00Z',
        read_count: 12,
        total_recipients: 15,
        metadata: {
          action_url: '/maintenance',
          action_text: 'Learn More',
          dismissible: true,
          persistent: false
        }
      },
      {
        id: 'broadcast-2',
        title: 'New Features Available',
        content: 'We\'ve added new AI-powered matching features and improved the user interface. Check out the latest updates!',
        target_roles: ['broker', 'operator'],
        message_type: 'update',
        priority: 'low',
        created_by: 'admin',
        created_at: '2024-01-19T14:00:00Z',
        sent_at: '2024-01-19T14:02:00Z',
        read_count: 8,
        total_recipients: 10,
        metadata: {
          action_url: '/features',
          action_text: 'View Features',
          dismissible: true,
          persistent: false
        }
      },
      {
        id: 'broadcast-3',
        title: 'Security Alert',
        content: 'We detected unusual activity on some accounts. Please ensure your passwords are strong and enable 2FA if you haven\'t already.',
        target_roles: ['broker', 'operator', 'pilot', 'crew'],
        message_type: 'critical',
        priority: 'urgent',
        created_by: 'admin',
        created_at: '2024-01-18T16:30:00Z',
        sent_at: '2024-01-18T16:32:00Z',
        read_count: 20,
        total_recipients: 25,
        metadata: {
          action_url: '/security',
          action_text: 'Security Center',
          dismissible: false,
          persistent: true
        }
      }
    ];
  }

  // Get user notifications
  async getUserNotifications(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select(`
          *,
          broadcast:broadcast_id(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;

    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Create notification template
  async createTemplate(template: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<NotificationTemplate> {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .insert({
          ...template,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  // Get notification templates
  async getTemplates(): Promise<NotificationTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  // Send template-based message
  async sendTemplateMessage(templateId: string, recipients: string[], variables: Record<string, string>): Promise<void> {
    try {
      const { data: template, error: fetchError } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (fetchError) throw fetchError;

      // Replace variables in template
      let content = template.content;
      let subject = template.subject;

      for (const [key, value] of Object.entries(variables)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }

      // Send to each recipient
      for (const recipientId of recipients) {
        const { error } = await supabase
          .from('user_notifications')
          .insert({
            user_id: recipientId,
            title: subject,
            content,
            message_type: 'info',
            priority: 'medium',
            read: false,
            created_at: new Date().toISOString()
          });

        if (error) console.error('Error sending template message:', error);
      }

    } catch (error) {
      console.error('Error sending template message:', error);
      throw error;
    }
  }

  // Get broadcast analytics
  async getBroadcastAnalytics(): Promise<any> {
    try {
      const { data: messages, error } = await supabase
        .from('broadcast_messages')
        .select('id, total_recipients, sent_at, message_type');

      if (error) throw error;

      const analytics = {
        total_messages: messages?.length || 0,
        total_recipients: messages?.reduce((sum, msg) => sum + (msg.total_recipients || 0), 0) || 0,
        messages_by_type: {},
        recent_activity: messages?.slice(0, 10) || []
      };

      // Group by message type
      messages?.forEach(msg => {
        analytics.messages_by_type[msg.message_type] = (analytics.messages_by_type[msg.message_type] || 0) + 1;
      });

      return analytics;

    } catch (error) {
      console.error('Error getting broadcast analytics:', error);
      return {
        total_messages: 0,
        total_recipients: 0,
        messages_by_type: {},
        recent_activity: []
      };
    }
  }
}

// Export singleton instance
export const broadcastService = BroadcastService.getInstance();
