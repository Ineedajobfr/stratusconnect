import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Plane, Edit, Trash2, Loader2 } from "lucide-react";

interface Aircraft {
  id: string;
  tail_number: string;
  aircraft_type: string;
  manufacturer: string;
  model: string;
  year_manufactured: number;
  seats: number;
  max_range_nm: number;
  cruise_speed_knots: number;
  hourly_rate: number;
  availability_status: string;
  base_location: string;
  description: string;
  created_at: string;
}

export default function FleetManagement() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tail_number: "",
    aircraft_type: "",
    manufacturer: "",
    model: "",
    year_manufactured: new Date().getFullYear(),
    seats: 4,
    max_range_nm: 1000,
    cruise_speed_knots: 400,
    hourly_rate: 5000,
    availability_status: "available",
    base_location: "",
    description: "",
  });

  useEffect(() => {
    fetchAircraft();
  }, []);

  const fetchAircraft = async () => {
    try {
      const { data, error } = await supabase
        .from("aircraft")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAircraft(data || []);
    } catch (error) {
      console.error("Error fetching aircraft:", error);
      toast({
        title: "Error",
        description: "Failed to load fleet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tail_number: "",
      aircraft_type: "",
      manufacturer: "",
      model: "",
      year_manufactured: new Date().getFullYear(),
      seats: 4,
      max_range_nm: 1000,
      cruise_speed_knots: 400,
      hourly_rate: 5000,
      availability_status: "available",
      base_location: "",
      description: "",
    });
    setEditingAircraft(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to manage your fleet",
          variant: "destructive",
        });
        return;
      }

      if (editingAircraft) {
        const { error } = await supabase
          .from("aircraft")
          .update(formData)
          .eq("id", editingAircraft.id);

        if (error) throw error;
        toast({ title: "Success", description: "Aircraft updated successfully" });
      } else {
        const { error } = await supabase
          .from("aircraft")
          .insert([{ ...formData, operator_id: user.id }]);

        if (error) throw error;
        toast({ title: "Success", description: "Aircraft added to fleet successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchAircraft();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save aircraft",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (aircraft: Aircraft) => {
    setEditingAircraft(aircraft);
    setFormData({
      tail_number: aircraft.tail_number,
      aircraft_type: aircraft.aircraft_type,
      manufacturer: aircraft.manufacturer || "",
      model: aircraft.model || "",
      year_manufactured: aircraft.year_manufactured || new Date().getFullYear(),
      seats: aircraft.seats,
      max_range_nm: aircraft.max_range_nm || 1000,
      cruise_speed_knots: aircraft.cruise_speed_knots || 400,
      hourly_rate: aircraft.hourly_rate,
      availability_status: aircraft.availability_status,
      base_location: aircraft.base_location || "",
      description: aircraft.description || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this aircraft from your fleet?")) {
      return;
    }

    try {
      const { error } = await supabase.from("aircraft").delete().eq("id", id);
      if (error) throw error;
      
      toast({ title: "Success", description: "Aircraft removed from fleet" });
      fetchAircraft();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete aircraft",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: "bg-green-500/20 text-green-400 border-green-500/30",
      maintenance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      booked: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return variants[status as keyof typeof variants] || variants.available;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Fleet Management</h2>
          <p className="text-slate-400">Manage your aircraft inventory and availability</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Aircraft
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingAircraft ? "Edit Aircraft" : "Add New Aircraft"}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingAircraft ? "Update aircraft information" : "Add a new aircraft to your fleet"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tail_number" className="text-white">Tail Number</Label>
                  <Input
                    id="tail_number"
                    value={formData.tail_number}
                    onChange={(e) => setFormData({ ...formData, tail_number: e.target.value })}
                    placeholder="N123AB"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aircraft_type" className="text-white">Aircraft Type</Label>
                  <Input
                    id="aircraft_type"
                    value={formData.aircraft_type}
                    onChange={(e) => setFormData({ ...formData, aircraft_type: e.target.value })}
                    placeholder="Light Jet"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer" className="text-white">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Cessna"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-white">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Citation CJ3+"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-white">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year_manufactured}
                    onChange={(e) => setFormData({ ...formData, year_manufactured: parseInt(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seats" className="text-white">Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="range" className="text-white">Max Range (NM)</Label>
                  <Input
                    id="range"
                    type="number"
                    value={formData.max_range_nm}
                    onChange={(e) => setFormData({ ...formData, max_range_nm: parseInt(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speed" className="text-white">Cruise Speed (kts)</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={formData.cruise_speed_knots}
                    onChange={(e) => setFormData({ ...formData, cruise_speed_knots: parseInt(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate" className="text-white">Hourly Rate ($)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-white">Status</Label>
                  <Select value={formData.availability_status} onValueChange={(value) => setFormData({ ...formData, availability_status: value })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="available" className="text-white">Available</SelectItem>
                      <SelectItem value="maintenance" className="text-white">Maintenance</SelectItem>
                      <SelectItem value="booked" className="text-white">Booked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Base Location</Label>
                  <Input
                    id="location"
                    value={formData.base_location}
                    onChange={(e) => setFormData({ ...formData, base_location: e.target.value })}
                    placeholder="KJFK"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional aircraft details..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingAircraft ? "Update" : "Add"} Aircraft
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Your Fleet</CardTitle>
          <CardDescription className="text-slate-400">
            {aircraft.length} aircraft in your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {aircraft.length === 0 ? (
            <div className="text-center py-8">
              <Plane className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No aircraft in your fleet yet</p>
              <p className="text-slate-500 text-sm">Add your first aircraft to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Tail Number</TableHead>
                  <TableHead className="text-slate-300">Aircraft</TableHead>
                  <TableHead className="text-slate-300">Seats</TableHead>
                  <TableHead className="text-slate-300">Hourly Rate</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aircraft.map((plane) => (
                  <TableRow key={plane.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">{plane.tail_number}</TableCell>
                    <TableCell className="text-slate-300">
                      {plane.manufacturer} {plane.model}
                      <div className="text-sm text-slate-500">{plane.aircraft_type}</div>
                    </TableCell>
                    <TableCell className="text-slate-300">{plane.seats}</TableCell>
                    <TableCell className="text-slate-300">${plane.hourly_rate.toLocaleString()}/hr</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(plane.availability_status)}>
                        {plane.availability_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{plane.base_location}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(plane)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(plane.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}