import { getErrorMessage } from '@/utils/errorHandler';
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, Plus, Clock, MapPin, 
  CheckCircle, X, Edit
} from "lucide-react";

interface CrewAvailability {
  id: string;
  crew_id: string;
  available_from: string;
  available_to: string;
  status: 'available' | 'booked' | 'unavailable';
  notes: string;
  created_at: string;
}

export default function CrewAvailability() {
  const [availabilities, setAvailabilities] = useState<CrewAvailability[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [crewProfileId, setCrewProfileId] = useState<string>("");
  const { toast } = useToast();

  const [availabilityForm, setAvailabilityForm] = useState({
    available_from: "",
    available_to: "",
    notes: ""
  });

  useEffect(() => {
    fetchUserData();
    fetchAvailabilities();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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

  const fetchAvailabilities = async () => {
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
        .from("crew_availability")
        .select("*")
        .eq("crew_id", crewProfile.id)
        .order("available_from", { ascending: true });

      if (error) throw error;
      setAvailabilities((data || []) as CrewAvailability[]);
    } catch (error: unknown) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const createAvailability = async () => {
    if (!availabilityForm.available_from || !availabilityForm.available_to || !crewProfileId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    const fromDate = new Date(availabilityForm.available_from);
    const toDate = new Date(availabilityForm.available_to);
    
    if (fromDate >= toDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("crew_availability")
        .insert({
          crew_id: crewProfileId,
          available_from: availabilityForm.available_from,
          available_to: availabilityForm.available_to,
          notes: availabilityForm.notes,
          status: 'available'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Availability period added successfully",
      });

      setIsCreateDialogOpen(false);
      setAvailabilityForm({
        available_from: "",
        available_to: "",
        notes: ""
      });
      fetchAvailabilities();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const { error } = await supabase
        .from("crew_availability")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Availability period deleted",
      });

      fetchAvailabilities();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to delete availability period",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-terminal-success';
      case 'booked': return 'bg-terminal-warning';
      case 'unavailable': return 'bg-terminal-danger';
      default: return 'bg-terminal-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'booked': return <Clock className="h-4 w-4" />;
      case 'unavailable': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateRange = (from: string, to: string) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const now = new Date();
    
    const durationMs = toDate.getTime() - fromDate.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    
    const isUpcoming = fromDate > now;
    const isCurrent = fromDate <= now && toDate >= now;
    const isPast = toDate < now;
    
    return {
      formatted: `${formatDateTime(from)} - ${formatDateTime(to)}`,
      duration: durationDays,
      isUpcoming,
      isCurrent,
      isPast
    };
  };

  // Quick availability templates
  const addQuickAvailability = (days: number) => {
    const now = new Date();
    const fromDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Tomorrow
    const toDate = new Date(fromDate.getTime() + (days * 24 * 60 * 60 * 1000));
    
    setAvailabilityForm({
      available_from: fromDate.toISOString().slice(0, 16),
      available_to: toDate.toISOString().slice(0, 16),
      notes: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Availability Calendar</h2>
          <p className="text-slate-400">Manage your availability for job assignments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-terminal-success hover:bg-terminal-success/80">
              <Plus className="mr-2 h-4 w-4" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Availability Period</DialogTitle>
              <DialogDescription className="text-slate-400">
                Set when you're available for job assignments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Available From</Label>
                  <Input
                    type="datetime-local"
                    value={availabilityForm.available_from}
                    onChange={(e) => setAvailabilityForm(prev => ({ 
                      ...prev, 
                      available_from: e.target.value 
                    }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Available To</Label>
                  <Input
                    type="datetime-local"
                    value={availabilityForm.available_to}
                    onChange={(e) => setAvailabilityForm(prev => ({ 
                      ...prev, 
                      available_to: e.target.value 
                    }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Quick templates */}
              <div>
                <Label className="text-white mb-2 block">Quick Add</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuickAvailability(7)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Next 7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuickAvailability(14)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Next 2 weeks
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addQuickAvailability(30)}
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    Next month
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-white">Notes (Optional)</Label>
                <Textarea
                  value={availabilityForm.notes}
                  onChange={(e) => setAvailabilityForm(prev => ({ 
                    ...prev, 
                    notes: e.target.value 
                  }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Any special notes about your availability..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button onClick={createAvailability} className="bg-terminal-success hover:bg-terminal-success/80">
                  Add Availability
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-400">Total Periods</p>
                <p className="text-xl font-bold text-white">{availabilities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Available</p>
                <p className="text-xl font-bold text-white">
                  {availabilities.filter(a => a.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-terminal-warning" />
              <div>
                <p className="text-sm text-slate-400">Booked</p>
                <p className="text-xl font-bold text-white">
                  {availabilities.filter(a => a.status === 'booked').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-terminal-info" />
              <div>
                <p className="text-sm text-slate-400">Upcoming Days</p>
                <p className="text-xl font-bold text-white">
                  {availabilities
                    .filter(a => new Date(a.available_from) > new Date())
                    .reduce((sum, a) => {
                      const from = new Date(a.available_from);
                      const to = new Date(a.available_to);
                      return sum + Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
                    }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability List */}
      <div className="space-y-4">
        {availabilities.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center">No availability periods set</p>
              <p className="text-slate-500 text-sm text-center">Add your availability to help brokers find you for jobs</p>
            </CardContent>
          </Card>
        ) : (
          availabilities.map((availability) => {
            const dateInfo = formatDateRange(availability.available_from, availability.available_to);
            
            return (
              <Card key={availability.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-white">
                          {dateInfo.duration} day{dateInfo.duration !== 1 ? 's' : ''} available
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {dateInfo.formatted}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {dateInfo.isCurrent && (
                        <Badge className="bg-terminal-info text-white">
                          Current
                        </Badge>
                      )}
                      {dateInfo.isUpcoming && (
                        <Badge className="bg-terminal-success text-white">
                          Upcoming
                        </Badge>
                      )}
                      {dateInfo.isPast && (
                        <Badge className="bg-terminal-muted text-white">
                          Past
                        </Badge>
                      )}
                      <Badge className={`${getStatusColor(availability.status)} text-white`}>
                        {getStatusIcon(availability.status)}
                        <span className="ml-1 capitalize">{availability.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {availability.notes && (
                        <div className="mb-2">
                          <p className="text-slate-300 text-sm">{availability.notes}</p>
                        </div>
                      )}
                      <p className="text-slate-400 text-sm">
                        Added on {formatDateTime(availability.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteAvailability(availability.id)}
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        <X className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}