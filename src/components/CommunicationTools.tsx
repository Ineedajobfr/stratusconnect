import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    AlertCircle,
    Bell,
    Check,
    CheckCheck,
    Clock,
    Info,
    MessageCircle,
    MoreVertical,
    Plus,
    Search,
    Send
} from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
  attachments?: {
    name: string;
    type: string;
    size: number;
  }[];
}

interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
  avatar?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  isRead: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface CommunicationToolsProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
}

export default function CommunicationTools({ terminalType }: CommunicationToolsProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'SkyWest Executive',
      type: 'direct',
      participants: ['current-user', 'skywest-exec'],
      lastMessage: {
        id: '1',
        sender: 'SkyWest Executive',
        senderId: 'skywest-exec',
        content: 'Charter quote ready for your review',
        timestamp: new Date('2024-01-15T10:30:00'),
        type: 'text',
        status: 'delivered',
        isRead: false
      },
      unreadCount: 2,
      isOnline: true,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      name: 'Broker Team',
      type: 'group',
      participants: ['current-user', 'broker1', 'broker2', 'broker3'],
      lastMessage: {
        id: '2',
        sender: 'Sarah Johnson',
        senderId: 'broker1',
        content: 'New G550 availability for London-NY route',
        timestamp: new Date('2024-01-15T09:15:00'),
        type: 'text',
        status: 'read',
        isRead: true
      },
      unreadCount: 0,
      isOnline: false,
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      name: 'Operations Channel',
      type: 'channel',
      participants: ['current-user', 'ops1', 'ops2', 'ops3', 'ops4'],
      lastMessage: {
        id: '3',
        sender: 'Mike Davis',
        senderId: 'ops1',
        content: 'Weather update: Clear skies for all European routes',
        timestamp: new Date('2024-01-15T08:45:00'),
        type: 'text',
        status: 'read',
        isRead: true
      },
      unreadCount: 0,
      isOnline: true,
      avatar: '/api/placeholder/40/40'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'SkyWest Executive',
      senderId: 'skywest-exec',
      content: 'Good morning! I have the charter quote ready for your Gulfstream G550 request.',
      timestamp: new Date('2024-01-15T10:30:00'),
      type: 'text',
      status: 'delivered',
      isRead: false
    },
    {
      id: '2',
      sender: 'SkyWest Executive',
      senderId: 'skywest-exec',
      content: 'The total cost is $45,000 for the London to New York route, including all fees.',
      timestamp: new Date('2024-01-15T10:32:00'),
      type: 'text',
      status: 'delivered',
      isRead: false
    },
    {
      id: '3',
      sender: 'You',
      senderId: 'current-user',
      content: 'Thank you! Can you send me the detailed breakdown?',
      timestamp: new Date('2024-01-15T10:35:00'),
      type: 'text',
      status: 'read',
      isRead: true
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Charter Request',
      message: 'Gulfstream G550 requested for London-NY route',
      type: 'info',
      timestamp: new Date('2024-01-15T11:00:00'),
      isRead: false,
      action: {
        label: 'View Request',
        onClick: () => console.log('View request')
      }
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'Payment of $45,000 received from SkyWest Executive',
      type: 'success',
      timestamp: new Date('2024-01-15T10:45:00'),
      isRead: false,
      action: {
        label: 'View Details',
        onClick: () => console.log('View payment')
      }
    },
    {
      id: '3',
      title: 'Weather Alert',
      message: 'Severe weather warning for European airspace',
      type: 'warning',
      timestamp: new Date('2024-01-15T09:30:00'),
      isRead: true,
      action: {
        label: 'View Alert',
        onClick: () => console.log('View weather alert')
      }
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight from 2-4 AM UTC',
      type: 'info',
      timestamp: new Date('2024-01-15T08:00:00'),
      isRead: true
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotifications = notifications.filter(notif =>
    notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadNotifications = notifications.filter(notif => !notif.isRead).length;
  const unreadMessages = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      senderId: 'current-user',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent',
      isRead: true
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: newMsg, unreadCount: 0 }
        : conv
    ));
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notification.id ? { ...notif, isRead: true } : notif
    ));
    
    if (notification.action) {
      notification.action.onClick();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'success': return <Check className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Communication</h2>
          <p className="text-gray-400">Messages, notifications, and team collaboration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'messages'
              ? 'bg-orange-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Messages
          {unreadMessages > 0 && (
            <Badge className="bg-red-500 text-white text-xs">
              {unreadMessages}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'notifications'
              ? 'bg-orange-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications
          {unreadNotifications > 0 && (
            <Badge className="bg-red-500 text-white text-xs">
              {unreadNotifications}
            </Badge>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-700 border-slate-600 text-white"
        />
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Conversations</h3>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-orange-600/20 border-orange-600'
                      : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback className="bg-slate-700 text-white">
                            {conversation.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white truncate">
                            {conversation.name}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs text-gray-400 border-gray-600"
                          >
                            {conversation.type}
                          </Badge>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-orange-600 text-white text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="bg-slate-800/50 border-slate-700 h-96 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.avatar} />
                        <AvatarFallback className="bg-slate-700 text-white">
                          {conversations.find(c => c.id === selectedConversation)?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-white">
                          {conversations.find(c => c.id === selectedConversation)?.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {conversations.find(c => c.id === selectedConversation)?.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === 'current-user'
                              ? 'bg-orange-600 text-white'
                              : 'bg-slate-700 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.senderId === 'current-user' && (
                              <div className="ml-1">
                                {getStatusIcon(message.status)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-700">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-slate-700 border-slate-600 text-white"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Select a conversation</h3>
                  <p className="text-gray-400">Choose a conversation to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-colors ${
                notification.isRead
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-slate-800/70 border-orange-600/50'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-400' : 'text-gray-300'}`}>
                      {notification.message}
                    </p>
                    {notification.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-gray-600 text-gray-300 hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          notification.action!.onClick();
                        }}
                      >
                        {notification.action.label}
                      </Button>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
