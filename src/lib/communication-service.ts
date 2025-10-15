// Communication Service - Direct messaging, group chats, video calls
// Real-time communication for all users

import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  content: string;
  attachments: Attachment[];
  timestamp: string;
  read: boolean;
  type: 'text' | 'document' | 'image' | 'system';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  participants: GroupParticipant[];
  createdBy: string;
  createdAt: string;
  lastActivity: string;
  unreadCount: number;
  avatar?: string;
}

export interface GroupParticipant {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
  isAdmin: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface VideoCallSession {
  id: string;
  roomId: string;
  participants: string[];
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'active' | 'ended';
  recordingUrl?: string;
}

class CommunicationService {
  // Get all conversations for a user
  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          created_at,
          read,
          sender:users!sender_id (
            id,
            full_name,
            role
          ),
          recipient:users!recipient_id (
            id,
            full_name,
            role
          )
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      (data || []).forEach(msg => {
        const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
        const partner = msg.sender_id === userId ? msg.recipient : msg.sender;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            participantId: partnerId,
            participantName: partner.full_name || 'Unknown',
            participantRole: partner.role || 'user',
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount: 0,
            online: false,
          });
        }
        
        // Count unread messages
        if (msg.recipient_id === userId && !msg.read) {
          const conv = conversationMap.get(partnerId)!;
          conv.unreadCount++;
        }
      });

      return Array.from(conversationMap.values());
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      return [];
    }
  }

  // Get messages between two users
  async getMessages(userId: string, partnerId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          attachments,
          created_at,
          read,
          type,
          sender:users!sender_id (
            full_name,
            role
          )
        `)
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        senderName: msg.sender.full_name || 'Unknown',
        senderRole: msg.sender.role || 'user',
        recipientId: msg.recipient_id,
        content: msg.content,
        attachments: msg.attachments || [],
        timestamp: msg.created_at,
        read: msg.read,
        type: msg.type as any,
      }));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return [];
    }
  }

  // Send a message
  async sendMessage(
    senderId: string,
    recipientId: string,
    content: string,
    attachments: Attachment[] = []
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          recipient_id: recipientId,
          content,
          attachments,
          type: attachments.length > 0 ? 'document' : 'text',
          read: false,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Send email notification
      await this.sendEmailNotification(recipientId, senderId, content);

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  // Mark messages as read
  async markAsRead(userId: string, partnerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', partnerId)
        .eq('recipient_id', userId)
        .eq('read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      return false;
    }
  }

  // Get group chats
  async getGroupChats(userId: string): Promise<GroupChat[]> {
    try {
      const { data, error } = await supabase
        .from('group_chats')
        .select(`
          id,
          name,
          description,
          created_by,
          created_at,
          last_activity,
          avatar,
          group_chat_members (
            user_id,
            is_admin,
            joined_at,
            users (
              full_name,
              role
            )
          ),
          group_messages (
            id,
            read_by
          )
        `)
        .contains('group_chat_members.user_id', [userId])
        .order('last_activity', { ascending: false });

      if (error) throw error;

      return (data || []).map(chat => {
        const unreadCount = chat.group_messages?.filter(
          msg => !msg.read_by?.includes(userId)
        ).length || 0;

        return {
          id: chat.id,
          name: chat.name,
          description: chat.description || '',
          participants: chat.group_chat_members?.map(member => ({
            id: member.user_id,
            name: member.users.full_name || 'Unknown',
            role: member.users.role || 'user',
            joinedAt: member.joined_at,
            isAdmin: member.is_admin,
          })) || [],
          createdBy: chat.created_by,
          createdAt: chat.created_at,
          lastActivity: chat.last_activity,
          unreadCount,
          avatar: chat.avatar,
        };
      });
    } catch (error) {
      console.error('Failed to fetch group chats:', error);
      return [];
    }
  }

  // Create group chat
  async createGroupChat(
    creatorId: string,
    name: string,
    description: string,
    participantIds: string[]
  ): Promise<string | null> {
    try {
      // Create group chat
      const { data: chat, error: chatError } = await supabase
        .from('group_chats')
        .insert({
          name,
          description,
          created_by: creatorId,
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
        })
        .select()
        .single();

      if (chatError) throw chatError;

      // Add members
      const members = [creatorId, ...participantIds].map(userId => ({
        group_chat_id: chat.id,
        user_id: userId,
        is_admin: userId === creatorId,
        joined_at: new Date().toISOString(),
      }));

      const { error: membersError } = await supabase
        .from('group_chat_members')
        .insert(members);

      if (membersError) throw membersError;

      return chat.id;
    } catch (error) {
      console.error('Failed to create group chat:', error);
      return null;
    }
  }

  // Send group message
  async sendGroupMessage(
    groupId: string,
    senderId: string,
    content: string,
    attachments: Attachment[] = []
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_chat_id: groupId,
          sender_id: senderId,
          content,
          attachments,
          type: attachments.length > 0 ? 'document' : 'text',
          read_by: [senderId],
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update last activity
      await supabase
        .from('group_chats')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', groupId);

      return true;
    } catch (error) {
      console.error('Failed to send group message:', error);
      return false;
    }
  }

  // Upload attachment
  async uploadAttachment(file: File, userId: string): Promise<Attachment | null> {
    try {
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(fileName);

      return {
        id: data.path,
        name: file.name,
        type: file.type,
        size: file.size,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to upload attachment:', error);
      return null;
    }
  }

  // Create video call session
  async createVideoCall(
    creatorId: string,
    participantIds: string[],
    scheduled: boolean = false
  ): Promise<VideoCallSession | null> {
    try {
      const roomId = `stratus-call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('video_calls')
        .insert({
          room_id: roomId,
          creator_id: creatorId,
          participants: [creatorId, ...participantIds],
          start_time: new Date().toISOString(),
          status: scheduled ? 'scheduled' : 'active',
        })
        .select()
        .single();

      if (error) throw error;

      // Send notifications to participants
      for (const participantId of participantIds) {
        await this.sendSMSAlert(participantId, 'Video call starting', roomId);
      }

      return {
        id: data.id,
        roomId: data.room_id,
        participants: data.participants,
        startTime: data.start_time,
        status: data.status as any,
      };
    } catch (error) {
      console.error('Failed to create video call:', error);
      return null;
    }
  }

  // Send email notification
  private async sendEmailNotification(
    recipientId: string,
    senderId: string,
    messagePreview: string
  ): Promise<void> {
    try {
      const { data: recipient } = await supabase
        .from('users')
        .select('email, full_name, email_notifications')
        .eq('id', recipientId)
        .single();

      const { data: sender } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', senderId)
        .single();

      if (!recipient?.email_notifications) return;

      // Would integrate with email service (SendGrid, AWS SES, etc.)
      console.log('Email notification sent:', {
        to: recipient.email,
        subject: `New message from ${sender?.full_name}`,
        preview: messagePreview.substring(0, 100),
      });

      // Log notification
      await supabase
        .from('notifications')
        .insert({
          user_id: recipientId,
          type: 'message',
          title: 'New Message',
          message: `${sender?.full_name}: ${messagePreview.substring(0, 50)}...`,
          read: false,
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  // Send SMS alert
  private async sendSMSAlert(
    userId: string,
    message: string,
    metadata: string = ''
  ): Promise<void> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('phone, sms_notifications')
        .eq('id', userId)
        .single();

      if (!user?.sms_notifications || !user?.phone) return;

      // Would integrate with Twilio, AWS SNS, etc.
      console.log('SMS alert sent:', {
        to: user.phone,
        message,
        metadata,
      });

      // Log notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'sms',
          title: 'SMS Alert',
          message,
          read: false,
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Failed to send SMS alert:', error);
    }
  }

  // Subscribe to real-time messages
  subscribeToMessages(userId: string, callback: (message: Message) => void) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as any);
        }
      )
      .subscribe();
  }
}

export const communicationService = new CommunicationService();














