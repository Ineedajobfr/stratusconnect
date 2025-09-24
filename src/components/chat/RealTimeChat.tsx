// ============================================================================
// Real-time Chat Integration - Multi-party Communication
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  PhoneOff,
  VideoOff,
  Users,
  Circle,
  Clock,
  CheckCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isOwn: boolean;
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}

interface ChatParticipant {
  id: string;
  name: string;
  role: 'broker' | 'operator' | 'client' | 'team';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface RealTimeChatProps {
  chatId: string;
  participants: ChatParticipant[];
  onClose?: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

export const RealTimeChat: React.FC<RealTimeChatProps> = ({
  chatId,
  participants,
  onClose,
  isMinimized = false,
  onMinimize
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock messages for demo
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'Elite Aviation',
        senderId: 'op_001',
        content: 'Good morning! I have availability for your LHR-JFK request. Would you like to see the quote?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'text',
        status: 'read',
        isOwn: false
      },
      {
        id: '2',
        sender: 'You',
        senderId: 'broker_001',
        content: 'Yes, please send the quote details. My client is looking for a Gulfstream G650.',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        type: 'text',
        status: 'read',
        isOwn: true
      },
      {
        id: '3',
        sender: 'Elite Aviation',
        senderId: 'op_001',
        content: 'Perfect! I have a G650 available. Here are the details:',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        type: 'text',
        status: 'read',
        isOwn: false
      },
      {
        id: '4',
        sender: 'Elite Aviation',
        senderId: 'op_001',
        content: 'Aircraft: Gulfstream G650\nRoute: LHR → JFK\nDate: March 15, 2024\nPrice: $85,000\nPassengers: 8\nSpecial: VIP handling included',
        timestamp: new Date(Date.now() - 1000 * 60 * 18),
        type: 'text',
        status: 'read',
        isOwn: false
      }
    ];
    setMessages(mockMessages);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      senderId: 'broker_001',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sending',
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent': return <CheckCircle className="w-3 h-3 text-gray-400" />;
      case 'delivered': return <CheckCircle2 className="w-3 h-3 text-blue-400" />;
      case 'read': return <CheckCircle2 className="w-3 h-3 text-green-400" />;
      default: return null;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onMinimize}
          className="bg-brand hover:bg-brand-600 text-text rounded-full w-12 h-12 shadow-lg"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-96 h-[600px] bg-surface-1 border-terminal-border shadow-2xl">
      <CardHeader className="bg-surface-2 border-b border-terminal-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participant) => (
                <Avatar key={participant.id} className="w-8 h-8 border-2 border-surface-1">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {participants.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-surface-1 flex items-center justify-center">
                  <span className="text-xs text-text/70">+{participants.length - 3}</span>
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-sm text-bright">
                {participants.length === 2 
                  ? participants.find(p => p.id !== 'broker_001')?.name
                  : `${participants.length} participants`
                }
              </CardTitle>
              <div className="flex items-center gap-1">
                <Circle className="w-3 h-3 text-green-400 fill-current" />
                <span className="text-xs text-text/70">
                  {participants.filter(p => p.isOnline).length} online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="text-text/70 hover:text-text hover:bg-surface-1"
              onClick={() => setIsCallActive(!isCallActive)}
            >
              {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-text/70 hover:text-text hover:bg-surface-1"
              onClick={() => setIsVideoActive(!isVideoActive)}
            >
              {isVideoActive ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-text/70 hover:text-text hover:bg-surface-1"
              onClick={onMinimize}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {!message.isOwn && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={participants.find(p => p.id === message.senderId)?.avatar} />
                    <AvatarFallback className="text-xs">
                      {message.sender.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`space-y-1 ${message.isOwn ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-brand text-text'
                        : 'bg-surface-2 text-text'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs text-text/50 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.isOwn && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {isTyping.length > 0 && (
          <div className="px-4 py-2 border-t border-terminal-border">
            <div className="flex items-center gap-2 text-sm text-text/70">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-brand rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span>{isTyping.join(', ')} is typing...</span>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-terminal-border">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-text/70 hover:text-text hover:bg-surface-2"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-surface-2 border-terminal-border text-text placeholder:text-text/50 focus:ring-brand/50"
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-text/70 hover:text-text hover:bg-surface-2"
            >
              <Smile className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-text/70 hover:text-text hover:bg-surface-2"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-brand hover:bg-brand-600 text-text disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
