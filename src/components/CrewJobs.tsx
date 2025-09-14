import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, MapPin, Calendar, DollarSign,
  CheckCircle, Clock, X, MessageSquare,
  Plane, User, Building
} from "lucide-react";

interface HiringRequest {
  id: string;
  broker_id: string;
  crew_id: string;
  job_title: string;
  job_description: string;
  flight_date: string;
  return_date: string;
  departure_location: string;
  destination: string;
  aircraft_type: string;
  duration_hours: number;
  offered_rate: number;
  hiring_fee: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  message: string;
  created_at: string;
  broker_profile?: {
    full_name: string;
    company_name: string;
  };
}

export default function CrewJobs() {
  const [hiringRequests, setHiringRequests] = useState<HiringRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HiringRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [crewProfileId, setCrewProfileId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
    fetchHiringRequests();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        // Get crew profile ID
        const { data: profile } = await supabase
          .from("crew_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();
          
        if (profile) {
          setCrewProfileId(profile.id);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchHiringRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get crew profile first
      const { data: crewProfile } = await supabase
        .from("crew_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!crewProfile) return;

      const { data, error } = await supabase
        .from("hiring_requests")
        .select(`
          *,
          broker_profile:profiles!hiring_requests_broker_id_fkey (
            full_name,
            company_name
          )
        `)
        .eq("crew_id", crewProfile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHiringRequests((data || []) as unknown as HiringRequest[]);
    } catch (error: unknown) {
      console.error("Error fetching hiring requests:", error);
    }
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
      const updateData: Record<string, unknown> = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'accepted') {
        updateData.accepted_at = new Date().toISOString();
      }

      if (responseMessage.trim()) {
        updateData.message = responseMessage;
      }

      const { error } = await supabase
        .from("hiring_requests")
        .update(updateData)
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Response Sent",
        description: `Job request ${status} successfully`,
      });

      setIsResponseDialogOpen(false);
      setSelectedRequest(null);
      setResponseMessage("");
      fetchHiringRequests();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error)?.message || "Failed to respond to request",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-terminal-warning';
      case 'accepted': return 'bg-terminal-success';
      case 'declined': return 'bg-terminal-danger';
      case 'completed': return 'bg-terminal-info';
      default: return 'bg-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <X className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalEarnings = (rate: number, hours: number, fee: number) => {
    const gross = rate * hours;
    const net = gross - fee;
    return { gross, net, fee };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Job Requests</h2>
          <p className="text-slate-400">Manage your job opportunities and applications</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            {hiringRequests.filter(r => r.status === 'pending').length} Pending
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-terminal-warning" />
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-xl font-bold text-white">
                  {hiringRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Accepted</p>
                <p className="text-xl font-bold text-white">
                  {hiringRequests.filter(r => r.status === 'accepted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-terminal-info" />
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-xl font-bold text-white">
                  {hiringRequests.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Est. Earnings</p>
                <p className="text-xl font-bold text-white">
                  ${hiringRequests
                    .filter(r => r.status === 'accepted' || r.status === 'completed')
                    .reduce((sum, r) => sum + (r.offered_rate * r.duration_hours - r.hiring_fee), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Requests List */}
      <div className="space-y-4">
        {hiringRequests.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center">No job requests yet</p>
              <p className="text-slate-500 text-sm text-center">Job opportunities will appear here when brokers find your profile</p>
            </CardContent>
          </Card>
        ) : (
          hiringRequests.map((request) => {
            const earnings = calculateTotalEarnings(request.offered_rate, request.duration_hours, request.hiring_fee);
            
            return (
              <Card key={request.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <span>{request.job_title}</span>
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {request.broker_profile?.company_name || "Unknown Company"}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(request.status)} text-white`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">
                          {request.departure_location} → {request.destination}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">
                          {formatDate(request.flight_date)}
                          {request.return_date && ` - ${formatDate(request.return_date)}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Plane className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{request.aircraft_type}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{request.duration_hours} hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">${request.offered_rate}/hr</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">
                          {request.broker_profile?.full_name || "Unknown Broker"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {request.job_description && (
                    <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                      <p className="text-slate-300 text-sm">{request.job_description}</p>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Earnings Breakdown</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Gross Pay</p>
                        <p className="text-white font-bold">${earnings.gross.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Platform Fee (10%)</p>
                        <p className="text-terminal-warning">-${earnings.fee.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Net Pay</p>
                        <p className="text-terminal-success font-bold">${earnings.net.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex justify-end space-x-2">
                      <Dialog open={isResponseDialogOpen && selectedRequest?.id === request.id} onOpenChange={setIsResponseDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                            className="border-slate-600 text-white hover:bg-slate-700"
                          >
                            <MessageSquare className="mr-1 h-4 w-4" />
                            Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Respond to Job Request</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              {request.job_title} - {request.broker_profile?.company_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-white mb-2 block">
                                Message (Optional)
                              </label>
                              <Textarea
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                placeholder="Add a message to your response..."
                                className="bg-slate-700 border-slate-600 text-white"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                onClick={() => respondToRequest(request.id, 'declined')}
                                className="border-terminal-danger text-terminal-danger hover:bg-terminal-danger hover:text-white"
                              >
                                <X className="mr-1 h-4 w-4" />
                                Decline
                              </Button>
                              <Button 
                                onClick={() => respondToRequest(request.id, 'accepted')}
                                className="bg-terminal-success hover:bg-terminal-success/80"
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Accept Job
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {request.message && (
                    <div className="mt-4 p-3 bg-terminal-info/10 border border-terminal-info/20 rounded-lg">
                      <p className="text-terminal-info text-sm font-medium">Message:</p>
                      <p className="text-slate-300 text-sm">{request.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}