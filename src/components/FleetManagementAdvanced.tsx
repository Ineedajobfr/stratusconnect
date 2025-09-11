import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plane, Wrench, Calendar as CalendarIcon, BarChart3, DollarSign, 
  Clock, AlertTriangle, CheckCircle, Activity, TrendingUp,
  Fuel, MapPin, Users, Settings, Target, Zap, Plus
} from "lucide-react";

interface Aircraft {
  id: string;
  tail_number: string;
  aircraft_type: string;
  manufacturer: string;
  model: string;
  seats: number;
  max_range_nm: number;
  hourly_rate: number;
  availability_status: string;
  base_location: string;
}

interface AircraftUtilization {
  id: string;
  aircraft_id: string;
  flight_hours: number;
  revenue_generated: number;
  utilization_percentage: number;
  maintenance_due_date: string;
  last_flight_date: string;
  status: 'active' | 'maintenance' | 'unavailable';
}

interface MaintenanceSchedule {
  id: string;
  aircraft_id: string;
  maintenance_type: string;
  scheduled_date: string;
  estimated_duration_hours: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost_estimate: number;
  actual_cost: number;
  notes: string;
}

export default function FleetManagementAdvanced() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [utilization, setUtilization] = useState<{ [key: string]: AircraftUtilization }>({});
  const [maintenance, setMaintenance] = useState<MaintenanceSchedule[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [fleetMetrics, setFleetMetrics] = useState({
    totalAircraft: 0,
    avgUtilization: 0,
    totalRevenue: 0,
    maintenanceAlerts: 0,
    activeFlights: 0
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    aircraft_id: "",
    maintenance_type: "annual",
    scheduled_date: "",
    estimated_duration_hours: 24,
    cost_estimate: 0,
    notes: ""
  });

  useEffect(() => {
    fetchFleetData();
  }, []);

  const fetchFleetData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch aircraft
      const { data: aircraftData } = await supabase
        .from("aircraft")
        .select("*")
        .eq("operator_id", user.id);

      if (aircraftData) {
        setAircraft(aircraftData);
        
        // Fetch utilization data for each aircraft
        const utilizationPromises = aircraftData.map(async (plane) => {
          const { data } = await supabase
            .from("aircraft_utilization")
            .select("*")
            .eq("aircraft_id", plane.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          
          return { aircraftId: plane.id, data };
        });

        const utilizationResults = await Promise.all(utilizationPromises);
        const utilizationMap: { [key: string]: AircraftUtilization } = {};
        
        utilizationResults.forEach(({ aircraftId, data }) => {
          if (data) {
            utilizationMap[aircraftId] = data as AircraftUtilization;
          } else {
            // Create mock utilization data if none exists
            utilizationMap[aircraftId] = {
              id: `mock-${aircraftId}`,
              aircraft_id: aircraftId,
              flight_hours: Math.random() * 1000 + 500,
              revenue_generated: Math.random() * 2000000 + 500000,
              utilization_percentage: Math.random() * 80 + 20,
              maintenance_due_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
              last_flight_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: Math.random() > 0.8 ? 'maintenance' : 'active'
            };
          }
        });

        setUtilization(utilizationMap);

        // Calculate fleet metrics
        const totalAircraft = aircraftData.length;
        const avgUtilization = Object.values(utilizationMap).reduce((acc, util) => acc + util.utilization_percentage, 0) / totalAircraft;
        const totalRevenue = Object.values(utilizationMap).reduce((acc, util) => acc + util.revenue_generated, 0);
        const maintenanceAlerts = Object.values(utilizationMap).filter(util => 
          new Date(util.maintenance_due_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).length;
        const activeFlights = Object.values(utilizationMap).filter(util => util.status === 'active').length;

        setFleetMetrics({
          totalAircraft,
          avgUtilization,
          totalRevenue,
          maintenanceAlerts,
          activeFlights
        });

        // Fetch maintenance schedules
        const { data: maintenanceData } = await supabase
          .from("maintenance_schedules")
          .select("*")
          .in("aircraft_id", aircraftData.map(a => a.id))
          .order("scheduled_date", { ascending: true });

        setMaintenance((maintenanceData || []) as MaintenanceSchedule[]);
      }
    } catch (error) {
      console.error("Error fetching fleet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("maintenance_schedules")
        .insert([maintenanceForm]);

      if (error) throw error;

      toast({
        title: "Maintenance Scheduled",
        description: "Maintenance has been successfully scheduled",
      });

      setMaintenanceDialogOpen(false);
      setMaintenanceForm({
        aircraft_id: "",
        maintenance_type: "annual",
        scheduled_date: "",
        estimated_duration_hours: 24,
        cost_estimate: 0,
        notes: ""
      });
      fetchFleetData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule maintenance",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-terminal-success/20 text-terminal-success border-terminal-success/30';
      case 'maintenance':
        return 'bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30';
      case 'unavailable':
        return 'bg-terminal-danger/20 text-terminal-danger border-terminal-danger/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-600/30';
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage > 70) return 'text-terminal-success';
    if (percentage > 40) return 'text-terminal-warning';
    return 'text-terminal-danger';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Fleet Management</h2>
          <p className="text-slate-400">Optimize aircraft utilization and maintenance</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={maintenanceDialogOpen} onOpenChange={setMaintenanceDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Schedule Maintenance</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Plan maintenance for your aircraft
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleScheduleMaintenance} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Aircraft</Label>
                  <Select value={maintenanceForm.aircraft_id} onValueChange={(value) => setMaintenanceForm({...maintenanceForm, aircraft_id: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select aircraft" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {aircraft.map((plane) => (
                        <SelectItem key={plane.id} value={plane.id} className="text-white">
                          {plane.tail_number} - {plane.manufacturer} {plane.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Maintenance Type</Label>
                  <Select value={maintenanceForm.maintenance_type} onValueChange={(value) => setMaintenanceForm({...maintenanceForm, maintenance_type: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="annual" className="text-white">Annual Inspection</SelectItem>
                      <SelectItem value="100hr" className="text-white">100 Hour Inspection</SelectItem>
                      <SelectItem value="progressive" className="text-white">Progressive Maintenance</SelectItem>
                      <SelectItem value="repair" className="text-white">Repair Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Scheduled Date</Label>
                    <Input
                      type="datetime-local"
                      value={maintenanceForm.scheduled_date}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, scheduled_date: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Duration (hours)</Label>
                    <Input
                      type="number"
                      value={maintenanceForm.estimated_duration_hours}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, estimated_duration_hours: parseInt(e.target.value)})}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Cost Estimate ($)</Label>
                  <Input
                    type="number"
                    value={maintenanceForm.cost_estimate}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, cost_estimate: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Notes</Label>
                  <Textarea
                    value={maintenanceForm.notes}
                    onChange={(e) => setMaintenanceForm({...maintenanceForm, notes: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Additional maintenance notes..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setMaintenanceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Maintenance</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-400">Total Aircraft</p>
                <p className="text-2xl font-bold text-white">{fleetMetrics.totalAircraft}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Avg. Utilization</p>
                <p className="text-2xl font-bold text-white">{fleetMetrics.avgUtilization.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <p className="text-xl font-bold text-white">${(fleetMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-terminal-warning" />
              <div>
                <p className="text-sm text-slate-400">Maintenance Due</p>
                <p className="text-2xl font-bold text-white">{fleetMetrics.maintenanceAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-terminal-info" />
              <div>
                <p className="text-sm text-slate-400">Active Now</p>
                <p className="text-2xl font-bold text-white">{fleetMetrics.activeFlights}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-700">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-primary">
            Fleet Overview
          </TabsTrigger>
          <TabsTrigger value="utilization" className="text-white data-[state=active]:bg-primary">
            Utilization
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="text-white data-[state=active]:bg-primary">
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="optimization" className="text-white data-[state=active]:bg-primary">
            Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {aircraft.map((plane) => {
              const util = utilization[plane.id];
              return (
                <Card key={plane.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Plane className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="text-white font-bold text-lg">
                            {plane.tail_number}
                          </h3>
                          <p className="text-slate-400">
                            {plane.manufacturer} {plane.model} • {plane.seats} seats
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              <span className="text-slate-300">{plane.base_location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3 text-slate-400" />
                              <span className="text-slate-300">${plane.hourly_rate.toLocaleString()}/hr</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={getStatusColor(util?.status || 'active')}>
                          {util?.status || 'active'}
                        </Badge>
                        {util && (
                          <div className="mt-2 space-y-1">
                            <div className="text-sm">
                              <span className="text-slate-400">Utilization: </span>
                              <span className={`font-bold ${getUtilizationColor(util.utilization_percentage)}`}>
                                {util.utilization_percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-slate-400">Revenue: </span>
                              <span className="text-terminal-success font-bold">
                                ${(util.revenue_generated / 1000).toFixed(0)}K
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Aircraft Utilization Analysis</CardTitle>
              <CardDescription className="text-slate-400">
                Track flight hours, revenue, and efficiency metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aircraft.map((plane) => {
                  const util = utilization[plane.id];
                  if (!util) return null;

                  return (
                    <div key={plane.id} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-medium">{plane.tail_number}</h4>
                        <Badge className={getStatusColor(util.status)}>
                          {util.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm">Flight Hours</p>
                          <p className="text-white font-bold">{util.flight_hours.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Revenue Generated</p>
                          <p className="text-terminal-success font-bold">
                            ${(util.revenue_generated / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Utilization Rate</p>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={util.utilization_percentage} 
                              className="w-16 h-2"
                            />
                            <span className={`text-sm font-bold ${getUtilizationColor(util.utilization_percentage)}`}>
                              {util.utilization_percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Last Flight</p>
                          <p className="text-white">
                            {new Date(util.last_flight_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Maintenance Schedule</CardTitle>
              <CardDescription className="text-slate-400">
                Upcoming and completed maintenance activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No maintenance scheduled</p>
                  </div>
                ) : (
                  maintenance.map((maint) => {
                    const plane = aircraft.find(a => a.id === maint.aircraft_id);
                    const isOverdue = new Date(maint.scheduled_date) < new Date();
                    
                    return (
                      <div key={maint.id} className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">
                              {plane?.tail_number} - {maint.maintenance_type}
                            </h4>
                            <p className="text-slate-400 text-sm">
                              Scheduled: {new Date(maint.scheduled_date).toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span className="text-slate-300">
                                Duration: {maint.estimated_duration_hours}h
                              </span>
                              {maint.cost_estimate > 0 && (
                                <span className="text-slate-300">
                                  Est. Cost: ${maint.cost_estimate.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              maint.status === 'completed' ? 'bg-terminal-success/20 text-terminal-success border-terminal-success/30' :
                              maint.status === 'in_progress' ? 'bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30' :
                              isOverdue ? 'bg-terminal-danger/20 text-terminal-danger border-terminal-danger/30' :
                              'bg-slate-600/20 text-slate-400 border-slate-600/30'
                            }>
                              {isOverdue && maint.status === 'scheduled' ? 'Overdue' : maint.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Fleet Optimization Recommendations</CardTitle>
              <CardDescription className="text-slate-400">
                AI-powered insights to improve fleet performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-4">Performance Opportunities</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-terminal-success/10 border border-terminal-success/20 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="h-4 w-4 text-terminal-success" />
                        <span className="text-white text-sm font-medium">Utilization Boost</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Increase N123AB utilization by 15% with strategic repositioning
                      </p>
                    </div>

                    <div className="p-3 bg-terminal-warning/10 border border-terminal-warning/20 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-terminal-warning" />
                        <span className="text-white text-sm font-medium">Revenue Optimization</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Adjust hourly rates on underutilized aircraft to match market demand
                      </p>
                    </div>

                    <div className="p-3 bg-terminal-info/10 border border-terminal-info/20 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <Wrench className="h-4 w-4 text-terminal-info" />
                        <span className="text-white text-sm font-medium">Maintenance Efficiency</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Bundle maintenance activities to reduce downtime by 20%
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Market Insights</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-white text-sm font-medium">Demand Forecast</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        25% increase in light jet demand expected next quarter
                      </p>
                    </div>

                    <div className="p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-white text-sm font-medium">Route Optimization</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Consider KJFK-KBOS corridor for higher utilization
                      </p>
                    </div>

                    <div className="p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-white text-sm font-medium">Competitive Edge</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Your fleet has 12% better utilization than market average
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}