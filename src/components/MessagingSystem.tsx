import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Loader2, Handshake } from "lucide-react";
import { sanitizeMessageContent, validateInput } from "@/utils/sanitize";

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
  marketplace_listings?: {
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
}

export default function MessagingSystem() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserDeals();
  }, []);

  useEffect(() => {
    if (selectedDeal) {
      fetchMessages(selectedDeal.id);
      // Set up real-time messaging
      const channel = supabase
        .channel(`deal-messages-${selectedDeal.id}`)
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

  const fetchMessages = async (dealId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`*`)
        .eq("deal_id", dealId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedDeal) return;

    // Validate and sanitize the message content
    const validation = validateInput(newMessage, 1000);
    if (!validation.isValid) {
      toast({
        title: "Invalid Message",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    const sanitizedContent = sanitizeMessageContent(newMessage.trim());

    setSending(true);
    try {
      const { error } = await supabase
        .from("messages")
        .insert([{
          deal_id: selectedDeal.id,
          sender_id: currentUserId,
          content: sanitizedContent,
          message_type: "text",
        }]);

      if (error) throw error;
      setNewMessage("");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      in_progress: "bg-green-500/20 text-green-400 border-green-500/30",
      completed: "bg-green-600/20 text-green-500 border-green-600/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <p className="text-slate-400">Communication hub for your active deals</p>
        </div>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No active deals</p>
            <p className="text-slate-500 text-sm">
              Messaging becomes available when you have active deals with other users
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Messages</h2>
        <p className="text-slate-400">Communication hub for your active deals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Deals List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Handshake className="mr-2 h-5 w-5" />
              Active Deals
            </CardTitle>
            <CardDescription className="text-slate-400">
              {deals.length} active deal{deals.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              <div className="space-y-2 p-4">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedDeal?.id === deal.id
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-slate-700/30 hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium text-sm">
                        {deal.aircraft.manufacturer} {deal.aircraft.model}
                      </h4>
                      <Badge className={getStatusBadge(deal.status)}>
                        {deal.status}
                      </Badge>
                    </div>
                    <div className="text-slate-400 text-xs space-y-1">
                      <div>{deal.aircraft.tail_number}</div>
                      <div>
                        {deal.marketplace_listings.departure_location} → {deal.marketplace_listings.destination}
                      </div>
                      <div>${deal.final_amount.toLocaleString()}</div>
                      <div className="text-slate-500">
                        {currentUserId === deal.operator_id ? 'With Broker' : 'With Operator'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 h-full">
            {selectedDeal ? (
              <>
                <CardHeader>
                  <CardTitle className="text-white">
                    {selectedDeal.aircraft.manufacturer} {selectedDeal.aircraft.model} - {selectedDeal.aircraft.tail_number}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Conversation with {currentUserId === selectedDeal.operator_id ? 'Broker' : 'Operator'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-[450px]">
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
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 ${
                              message.sender_id === currentUserId
                                ? "text-primary-foreground/70"
                                : "text-slate-400"
                            }`}>
                              {formatDate(message.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <form onSubmit={sendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={sending}
                    />
                    <Button type="submit" disabled={sending || !newMessage.trim()}>
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Select a deal to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}