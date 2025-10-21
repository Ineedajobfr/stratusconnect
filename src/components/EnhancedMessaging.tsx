import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PrivacyRedaction } from "@/components/PrivacyRedaction";
import { 
  MessageCircle, Send, Loader2, Handshake, Paperclip, 
  Download, FileText, Image, Video, Archive, Lock,
  MessageSquare, Clock, CheckCircle2, AlertTriangle
} from "lucide-react";

interface Deal {
  id: string;
  status: string;
  final_amount: number;
  operator_id: string;
  broker_id: string;
  aircraft: {
    tail_number: string;
    manufacturer: string;
    model: string;
  };
  marketplace_listings: {
    departure_location: string;
    destination: string;
    departure_date: string;
  };
}

interface Message {
  id: string;
  content: string;
  message_type: string;
  created_at: string;
  sender_id: string;
  attachments?: MessageAttachment[];
}

interface MessageAttachment {
  id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
}

export default function EnhancedMessaging() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserDeals();
  }, []);

  useEffect(() => {
    if (selectedDeal) {
      fetchMessages(selectedDeal.id);
      // Set up real-time messaging
      const channel = supabase
        .channel(`enhanced-deal-messages-${selectedDeal.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `deal_id=eq.${selectedDeal.id}`
          },
          (payload) => {
            fetchMessages(selectedDeal.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedDeal]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserDeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          aircraft:aircraft_id (
            tail_number,
            manufacturer,
            model
          ),
          marketplace_listings:listing_id (
            departure_location,
            destination,
            departure_date
          )
        `)
        .or(`operator_id.eq.${user.id},broker_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeals(data || []);
      
      if (data && data.length > 0 && !selectedDeal) {
        setSelectedDeal(data[0]);
      }

      // Fetch unread counts for each deal
      for (const deal of data || []) {
        await fetchUnreadCount(deal.id);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast({
        title: "Error",
        description: "Failed to load your deals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async (dealId: string) => {
    try {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq("deal_id", dealId)
        .neq("sender_id", currentUserId)
        .is("read_at", null);

      setUnreadCounts(prev => ({ ...prev, [dealId]: count || 0 }));
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchMessages = async (dealId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`*`)
        .eq("deal_id", dealId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch attachments for each message
      const messagesWithAttachments = await Promise.all(
        (data || []).map(async (message) => {
          const { data: attachments } = await supabase
            .from("message_attachments")
            .select("*")
            .eq("message_id", message.id);

          return { ...message, attachments: attachments || [] };
        })
      );

      setMessages(messagesWithAttachments);

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("deal_id", dealId)
        .neq("sender_id", currentUserId)
        .is("read_at", null);

      setUnreadCounts(prev => ({ ...prev, [dealId]: 0 }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleViolationDetected = async (content: string, violations: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Log the violation attempt
      await supabase
        .from('audit_logs')
        .insert([{
          actor_id: user.id,
          action: 'privacy_violation_attempt',
          target_type: 'message',
          target_id: selectedDeal?.id || 'unknown',
          after_values: {
            violations,
            content: content.substring(0, 100) + '...' // Log partial content for review
          }
        }]);

      // Check if this user has multiple violations (auto-strike system)
      const { count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('actor_id', user.id)
        .eq('action', 'privacy_violation_attempt')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

      if ((count || 0) >= 3) {
        toast({
          title: 'Multiple Privacy Violations Detected',
          description: 'Your account has been flagged for repeated attempts to share contact information.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error logging violation:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedDeal) return;

    setSending(true);
    try {
      // Check for privacy violations in the message
      const patterns = {
        email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        phone: /(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/g,
        social: /@[A-Za-z0-9_]+|linkedin\.com\/|facebook\.com\/|instagram\.com\/|twitter\.com\/|whatsapp/gi,
      };

      const hasViolations = Object.values(patterns).some(pattern => pattern.test(newMessage));

      if (hasViolations && selectedDeal.status !== 'confirmed') {
        toast({
          title: 'Privacy Violation Detected',
          description: 'Contact information cannot be shared until deal is confirmed.',
          variant: 'destructive',
        });
        
        // Log the violation attempt
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await handleViolationDetected(newMessage, ['contact_info_attempt']);
        }
        
        setSending(false);
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .insert([{
          deal_id: selectedDeal.id,
          sender_id: currentUserId,
          content: newMessage.trim(),
          message_type: "text",
          has_violations: hasViolations
        }])
        .select()
        .single();

      if (error) throw error;
      setNewMessage("");
      
      // Create notification for the other party
      const recipientId = currentUserId === selectedDeal.operator_id 
        ? selectedDeal.broker_id 
        : selectedDeal.operator_id;

      await supabase
        .from("notifications")
        .insert([{
          user_id: recipientId,
          title: "New Message",
          message: `New message in deal: ${selectedDeal.aircraft.manufacturer} ${selectedDeal.aircraft.model}`,
          type: "info",
          action_url: `/messages/${selectedDeal.id}`
        }]);

    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !selectedDeal) return;

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUserId}/${selectedDeal.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(fileName);

      // Create message with attachment
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert([{
          deal_id: selectedDeal.id,
          sender_id: currentUserId,
          content: `Shared file: ${file.name}`,
          message_type: "file",
        }])
        .select()
        .single();

      if (messageError) throw messageError;

      // Create attachment record
      const { error: attachmentError } = await supabase
        .from("message_attachments")
        .insert([{
          message_id: messageData.id,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type
        }]);

      if (attachmentError) throw attachmentError;

      toast({
        title: "File Shared",
        description: `${file.name} has been shared successfully`,
      });

      fetchMessages(selectedDeal.id);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.startsWith('image/')) return Image;
    if (mimeType?.startsWith('video/')) return Video;
    if (mimeType?.includes('pdf') || mimeType?.includes('document')) return FileText;
    return Archive;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30",
      confirmed: "bg-terminal-info/20 text-terminal-info border-terminal-info/30",
      in_progress: "bg-terminal-success/20 text-terminal-success border-terminal-success/30",
      completed: "bg-terminal-success/20 text-terminal-success border-terminal-success/30",
      cancelled: "bg-terminal-danger/20 text-terminal-danger border-terminal-danger/30",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Enhanced Messaging</h2>
          <p className="text-slate-400">Secure communication hub for your deals</p>
        </div>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No active deals</p>
            <p className="text-slate-500 text-sm">
              Secure messaging becomes available when you have active deals
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Enhanced Messaging</h2>
          <p className="text-slate-400">Secure communication with file sharing</p>
        </div>
        <Badge variant="outline" className="text-terminal-success border-terminal-success">
          <Lock className="mr-1 h-3 w-3" />
          End-to-End Encrypted
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Enhanced Deals List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Handshake className="mr-2 h-5 w-5" />
              Active Conversations
            </CardTitle>
            <CardDescription className="text-slate-400">
              {deals.length} active deal{deals.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[550px]">
              <div className="space-y-2 p-4">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedDeal?.id === deal.id
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-slate-700/30 hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium text-sm">
                        {deal.aircraft.manufacturer} {deal.aircraft.model}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {unreadCounts[deal.id] > 0 && (
                          <Badge className="bg-terminal-danger text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {unreadCounts[deal.id]}
                          </Badge>
                        )}
                        <Badge className={getStatusBadge(deal.status)}>
                          {deal.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-slate-400 text-xs space-y-1">
                      <div className="flex items-center">
                        <span className="font-mono">{deal.aircraft.tail_number}</span>
                        <CheckCircle2 className="ml-2 h-3 w-3 text-terminal-success" />
                      </div>
                      <div>
                        {deal.marketplace_listings.departure_location} → {deal.marketplace_listings.destination}
                      </div>
                      <div className="text-terminal-success font-bold">
                        ${deal.final_amount.toLocaleString()}
                      </div>
                      <div className="text-slate-500 flex items-center">
                        <MessageCircle className="mr-1 h-3 w-3" />
                        {currentUserId === deal.operator_id
                          ? `Broker`
                          : `Operator` }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Enhanced Messages */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 h-full">
            {selectedDeal ? (
              <>
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div>
                      {selectedDeal.aircraft.manufacturer} {selectedDeal.aircraft.model} - {selectedDeal.aircraft.tail_number}
                    </div>
                    <Badge className={getStatusBadge(selectedDeal.status)}>
                      {selectedDeal.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Secure conversation with {currentUserId === selectedDeal.operator_id ? 'Broker' : 'Operator'} • ${selectedDeal.final_amount.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-[550px]">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4 p-2">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === currentUserId ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender_id === currentUserId
                                ? "bg-primary text-primary-foreground"
                                : "bg-slate-700 text-white"
                            }`}
                          >
                           <div className="text-sm mb-1">
                             <PrivacyRedaction
                               content={message.content}
                               dealConfirmed={selectedDeal.status === 'confirmed'}
                               onViolationDetected={handleViolationDetected}
                             />
                           </div>
                            
                            {/* File Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => {
                                  const FileIcon = getFileIcon(attachment.mime_type || "");
                                  return (
                                    <div
                                      key={attachment.id}
                                      className="flex items-center space-x-2 p-2 bg-black/20 rounded border"
                                    >
                                      <FileIcon className="h-4 w-4" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">
                                          {attachment.file_name}
                                        </p>
                                        <p className="text-xs opacity-70">
                                          {formatFileSize(attachment.file_size)}
                                        </p>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => window.open(attachment.file_url, '_blank')}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            
                            <div className={`text-xs mt-2 flex items-center justify-between ${
                              message.sender_id === currentUserId
                                ? "text-primary-foreground/70"
                                : "text-slate-400"
                            }`}>
                              <span>{formatTime(message.created_at)}</span>
                              {message.sender_id === currentUserId && (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {/* Enhanced Message Input */}
                  <div className="space-y-3">
                    <form onSubmit={sendMessage} className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your secure message..."
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={sending || uploading}
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={sending || uploading}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Paperclip className="h-4 w-4" />
                        )}
                      </Button>
                      <Button type="submit" disabled={sending || uploading || !newMessage.trim()}>
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                    <div className="text-xs text-slate-500 flex items-center justify-center">
                      <Lock className="mr-1 h-3 w-3" />
                      Messages are encrypted and secure
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
