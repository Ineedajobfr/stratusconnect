import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, DollarSign, MessageSquare, Plane, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'bid' | 'message' | 'deal' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  metadata?: {
    dealId?: string;
    bidAmount?: number;
    aircraftId?: string;
    route?: string;
  };
}

interface NotificationSystemProps {
  isVisible: boolean;
  onClose: () => void;
  userRole: 'operator' | 'broker' | 'pilot' | 'crew' | 'admin';
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  isVisible,
  onClose,
  userRole
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Demo notifications for different user roles
  useEffect(() => {
    const generateNotifications = (): Notification[] => {
      const baseNotifications: Notification[] = [
        {
          id: '1',
          type: 'system',
          title: 'System Update',
          message: 'Platform maintenance completed. All systems operational.',
          timestamp: new Date(Date.now() - 5 * 60000),
          isRead: false,
          priority: 'low'
        }
      ];

      if (userRole === 'operator') {
        return [
          {
            id: '2',
            type: 'bid',
            title: 'New Bid Received',
            message: 'Premium Charter Group bid $48,500 for your Gulfstream G550 (N425SC)',
            timestamp: new Date(Date.now() - 2 * 60000),
            isRead: false,
            priority: 'high',
            metadata: {
              bidAmount: 48500,
              aircraftId: 'N425SC',
              route: 'KJFK → KLAX'
            }
          },
          {
            id: '3',
            type: 'deal',
            title: 'Deal Confirmed',
            message: 'Charter agreement signed for Citation X+ flight to Miami',
            timestamp: new Date(Date.now() - 15 * 60000),
            isRead: false,
            priority: 'medium'
          },
          {
            id: '4',
            type: 'message',
            title: 'New Message',
            message: 'Broker requested ground handling details for tomorrow\'s flight',
            timestamp: new Date(Date.now() - 30 * 60000),
            isRead: true,
            priority: 'medium'
          },
          {
            id: '5',
            type: 'alert',
            title: 'Maintenance Due',
            message: 'N156JT requires 100-hour inspection within 7 days',
            timestamp: new Date(Date.now() - 2 * 3600000),
            isRead: false,
            priority: 'critical'
          },
          ...baseNotifications
        ];
      }

      return baseNotifications;
    };

    const newNotifications = generateNotifications();
    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.isRead).length);
  }, [userRole]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'bid':
        return <DollarSign className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'deal':
        return <Calendar className="w-4 h-4" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500 border-red-500';
      case 'high':
        return 'text-orange-500 border-orange-500';
      case 'medium':
        return 'text-blue-500 border-blue-500';
      default:
        return 'text-gray-500 border-gray-500';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Handle different notification actions
    if (notification.type === 'bid' && notification.metadata?.aircraftId) {
      toast({
        title: "Opening Marketplace",
        description: `Viewing bids for ${notification.metadata.aircraftId}`
      });
    } else if (notification.type === 'message') {
      toast({
        title: "Opening Messages",
        description: "Navigating to secure messaging"
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-md mx-4 max-h-[80vh] terminal-card">
        <div className="flex items-center justify-between p-4 border-b border-terminal-border">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-foreground" />
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark All Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-terminal-border/30 hover:bg-terminal-card/30 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-terminal-card/20' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-full border ${getPriorityColor(notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      {notification.metadata && (
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground font-mono">
                          {notification.metadata.bidAmount && (
                            <span>${notification.metadata.bidAmount.toLocaleString()}</span>
                          )}
                          {notification.metadata.aircraftId && (
                            <span>{notification.metadata.aircraftId}</span>
                          )}
                          {notification.metadata.route && (
                            <span>{notification.metadata.route}</span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
