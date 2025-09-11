import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, AlertCircle, DollarSign, FileText, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'rfq_sent' | 'quote_received' | 'quote_accepted' | 'funds_held' | 'funds_released' | 'expiring_documents' | 'task_due' | 'verification_required';
  entity_type: 'rfq' | 'quote' | 'deal' | 'task' | 'verification' | 'document';
  entity_id: string;
  title: string;
  body: string;
  link?: string;
  read_at?: string;
  created_at: string;
}

const notificationIcons = {
  rfq_sent: Bell,
  quote_received: DollarSign,
  quote_accepted: Check,
  funds_held: Shield,
  funds_released: DollarSign,
  expiring_documents: FileText,
  task_due: Clock,
  verification_required: AlertCircle,
};

const notificationColors = {
  rfq_sent: 'text-blue-500',
  quote_received: 'text-green-500',
  quote_accepted: 'text-emerald-500',
  funds_held: 'text-yellow-500',
  funds_released: 'text-green-500',
  expiring_documents: 'text-orange-500',
  task_due: 'text-red-500',
  verification_required: 'text-purple-500',
};

export const NotificationsCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'quote_received',
        entity_type: 'quote',
        entity_id: 'quote-1',
        title: 'New Quote Received',
        body: 'You have received a new quote for your NYC to LAX trip request',
        link: '/terminal/broker/quotes/quote-1',
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      },
      {
        id: '2',
        type: 'funds_held',
        entity_type: 'deal',
        entity_id: 'deal-1',
        title: 'Funds Held in Escrow',
        body: 'Payment of $45,000 has been held in escrow for your charter booking',
        link: '/terminal/broker/deals/deal-1',
        read_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '3',
        type: 'expiring_documents',
        entity_type: 'document',
        entity_id: 'doc-1',
        title: 'Document Expiring Soon',
        body: 'Your pilot medical certificate expires in 7 days',
        link: '/terminal/pilot/documents',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: '4',
        type: 'task_due',
        entity_type: 'task',
        entity_id: 'task-1',
        title: 'Task Due Today',
        body: 'Complete KYC verification for new client',
        link: '/terminal/broker/tasks',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read_at).length);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, read_at: new Date().toISOString() }
          : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
    );
    setUnreadCount(0);
  };

  const unreadNotifications = notifications.filter(n => !n.read_at);
  const readNotifications = notifications.filter(n => n.read_at);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-96 z-50">
          <Card className="border-orange-500/20 bg-black/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="unread" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
                  <TabsTrigger value="unread">
                    Unread ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    All ({notifications.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="unread" className="mt-0">
                  <ScrollArea className="h-96">
                    {unreadNotifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400">
                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No unread notifications</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {unreadNotifications.map((notification) => {
                          const Icon = notificationIcons[notification.type];
                          return (
                            <div
                              key={notification.id}
                              className="p-4 hover:bg-gray-900/50 cursor-pointer border-l-2 border-orange-500"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <Icon className={`h-5 w-5 mt-0.5 ${notificationColors[notification.type]}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.body}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="all" className="mt-0">
                  <ScrollArea className="h-96">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400">
                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {notifications.map((notification) => {
                          const Icon = notificationIcons[notification.type];
                          const isRead = !!notification.read_at;
                          return (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-gray-900/50 cursor-pointer ${
                                isRead ? 'opacity-60' : 'border-l-2 border-orange-500'
                              }`}
                              onClick={() => !isRead && markAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <Icon className={`h-5 w-5 mt-0.5 ${notificationColors[notification.type]}`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${isRead ? 'text-gray-400' : 'text-white'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.body}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
