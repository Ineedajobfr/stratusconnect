import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, BellRing, CheckCircle, AlertTriangle, Info, 
  MessageSquare, DollarSign, Plane, Clock, X, AlertCircle
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read_at: string | null;
  action_url: string | null;
  created_at: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    setupRealtimeSubscription();
  }, [fetchNotifications, setupRealtimeSubscription]);

  const fetchNotifications = useCallback(async () => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                  .from("notifications")
                  .select("*")
                  .eq("user_id", user.id)
                  .order("created_at", { ascending: false })
                  .limit(50);

                if (error) throw error;
                
                setNotifications((data || []) as Notification[]);
                setUnreadCount(data?.filter(n => !n.read_at).length || 0);
              } catch (error) {
                console.error("Error fetching notifications:", error);
              } finally {
                setLoading(false);
              }
            }, [data, user, auth, getUser, from, select, eq, id, order, ascending, limit, Notification, filter, read_at, length]);

  const setupRealtimeSubscription = useCallback(async () => {
              const { data: { user } } = await supabase.auth.getUser();
              
              if (!user) return;

              const channel = supabase
                .channel(`user-notifications-${user.id}`)
                .on(
                  'postgres_changes',
                  {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                  },
                  (payload) => {
                    const newNotification = payload.new as Notification;
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    
                    // Show toast for new notification
                    toast({
                      title: newNotification.title,
                      description: newNotification.message,
                      variant: newNotification.type === 'error' ? 'destructive' : 'default',
                    });
                  }
                )
                .subscribe();

              return () => {
                supabase.removeChannel(channel);
              };
            }, [data, user, auth, getUser, id, on, event, schema, table, filter, new, Notification, toast, title, description, message, variant, type, subscribe, removeChannel]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .is("read_at", null);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setUnreadCount(0);
      
      toast({
        title: "All notifications marked as read",
        description: "Your notification center has been cleared",
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read_at) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-terminal-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-terminal-warning" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-terminal-danger" />;
      default:
        return <Info className="h-5 w-5 text-terminal-info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-terminal-success';
      case 'warning':
        return 'border-l-terminal-warning';
      case 'error':
        return 'border-l-terminal-danger';
      default:
        return 'border-l-terminal-info';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
    
    if (notification.action_url) {
      // Navigate to the action URL
      window.location.href = notification.action_url;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Bell className="mr-2 h-6 w-6" />
            Notification Center
          </h2>
          <p className="text-slate-400">Stay updated with your aviation activities</p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Badge variant="outline" className="bg-terminal-danger/20 text-terminal-danger border-terminal-danger/30">
              <BellRing className="mr-1 h-3 w-3" />
              {unreadCount} unread
            </Badge>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Notifications</CardTitle>
          <CardDescription className="text-slate-400">
            {notifications.length === 0 
              ? "No notifications yet" 
              : `${notifications.length} total notifications`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">No notifications</p>
              <p className="text-slate-500 text-sm">
                You'll receive updates about deals, messages, and platform activities here
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-slate-700/30 ${
                      getNotificationColor(notification.type)
                    } ${
                      !notification.read_at ? 'bg-slate-700/20' : 'bg-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-medium ${
                              !notification.read_at ? 'text-white' : 'text-slate-300'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read_at && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${
                            !notification.read_at ? 'text-slate-300' : 'text-slate-400'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-slate-500">
                              {formatTime(notification.created_at)}
                            </span>
                            {notification.action_url && (
                              <Badge variant="outline" className="text-xs">
                                Click to view
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-slate-400 hover:text-white h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Notification Preferences</CardTitle>
          <CardDescription className="text-slate-400">
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <h4 className="text-white font-medium">New Messages</h4>
                <p className="text-sm text-slate-400">Deal communication updates</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-terminal-success" />
              <div>
                <h4 className="text-white font-medium">Deal Updates</h4>
                <p className="text-sm text-slate-400">Bid updates and deal status</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Plane className="h-5 w-5 text-primary" />
              <div>
                <h4 className="text-white font-medium">New Listings</h4>
                <p className="text-sm text-slate-400">Matching your saved searches</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-terminal-warning" />
              <div>
                <h4 className="text-white font-medium">System Updates</h4>
                <p className="text-sm text-slate-400">Platform news and maintenance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}