// MessagingCenter - Full Direct Messaging UI
// Real-time messaging with Supabase integration

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { communicationService, type Conversation, type Message } from '@/lib/communication-service';
import {
    ArrowLeft,
    Check,
    CheckCheck,
    Circle,
    MessageSquare,
    MoreVertical,
    Paperclip,
    Search,
    Send
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function MessagingCenter() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load conversations
  useEffect(() => {
    if (!user?.id) return;
    loadConversations();
  }, [user?.id]);

  // Load messages when conversation selected
  useEffect(() => {
    if (!user?.id || !selectedConversation) return;
    loadMessages();
    markAsRead();
  }, [selectedConversation?.id, user?.id]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!user?.id) return;

    const subscription = communicationService.subscribeToMessages(user.id, (message) => {
      // If message is for current conversation, add it
      if (selectedConversation && 
          (message.senderId === selectedConversation.participantId || 
           message.recipientId === selectedConversation.participantId)) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      
      // Update conversation list
      loadConversations();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, selectedConversation?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    if (!user?.id) return;
    try {
      const convs = await communicationService.getConversations(user.id);
      setConversations(convs);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!user?.id || !selectedConversation) return;
    try {
      const msgs = await communicationService.getMessages(user.id, selectedConversation.participantId);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    }
  };

  const markAsRead = async () => {
    if (!user?.id || !selectedConversation) return;
    await communicationService.markAsRead(user.id, selectedConversation.participantId);
    loadConversations(); // Refresh to update unread counts
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || !selectedConversation) return;

    setSending(true);
    try {
      const success = await communicationService.sendMessage(
        user.id,
        selectedConversation.participantId,
        newMessage.trim()
      );

      if (success) {
        setNewMessage('');
        loadMessages();
        loadConversations();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleFileAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id || !selectedConversation) return;

    try {
      const attachment = await communicationService.uploadAttachment(file, user.id);
      if (attachment) {
        await communicationService.sendMessage(
          user.id,
          selectedConversation.participantId,
          `Sent a file: ${file.name}`,
          [attachment]
        );
        loadMessages();
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      broker: 'bg-blue-500',
      operator: 'bg-green-500',
      pilot: 'bg-purple-500',
      crew: 'bg-orange-500',
      admin: 'bg-red-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading messages...</div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen flex overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
      }}
    >
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col border-r border-white/10`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Messages
          </h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-40" />
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 text-left hover:bg-white/5 transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={`${getRoleBadgeColor(conv.participantRole)} text-white`}>
                          {getInitials(conv.participantName)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {conv.participantName}
                        </h3>
                        <span className="text-xs text-white/60">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white/60 truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge className="ml-2 bg-orange-500 text-white text-xs px-2">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>

                      <Badge className={`mt-1 text-xs ${getRoleBadgeColor(conv.participantRole)} text-white`}>
                        {conv.participantRole}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${getRoleBadgeColor(selectedConversation.participantRole)} text-white`}>
                    {getInitials(selectedConversation.participantName)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-semibold text-white">
                    {selectedConversation.participantName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getRoleBadgeColor(selectedConversation.participantRole)} text-white`}>
                      {selectedConversation.participantRole}
                    </Badge>
                    {selectedConversation.online && (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <Circle className="h-2 w-2 fill-current" />
                        Online
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isOwnMessage = msg.senderId === user?.id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className={`${getRoleBadgeColor(msg.senderRole)} text-white text-xs`}>
                              {getInitials(msg.senderName)}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              isOwnMessage
                                ? 'bg-orange-600 text-white'
                                : 'bg-white/10 text-white border border-white/20'
                            }`}
                          >
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mb-2 space-y-1">
                                {msg.attachments.map((attachment) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm underline"
                                  >
                                    <Paperclip className="h-4 w-4" />
                                    {attachment.name}
                                  </a>
                                ))}
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                          </div>

                          <div className={`flex items-center gap-1 mt-1 text-xs text-white/60 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            <span>{formatTime(msg.timestamp)}</span>
                            {isOwnMessage && (
                              msg.read ? (
                                <CheckCheck className="h-3 w-3 text-blue-400" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileAttachment}
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-white flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>

                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-black/30 border-white/20 text-white placeholder:text-white/40"
                  disabled={sending}
                />

                <Button
                  type="submit"
                  size="icon"
                  className="bg-orange-600 hover:bg-orange-700 text-white flex-shrink-0"
                  disabled={!newMessage.trim() || sending}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/60">
            <div className="text-center">
              <MessageSquare className="h-20 w-20 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}














