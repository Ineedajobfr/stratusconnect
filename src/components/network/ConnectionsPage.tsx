import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Users, 
  Plus, 
  Star, 
  MessageCircle, 
  Plane, 
  Building2, 
  UserCheck,
  Filter,
  MapPin,
  Calendar,
  Award,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Connection {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar?: string;
  status: "connected" | "pending" | "saved" | "blocked";
  mutualConnections: number;
  lastInteraction?: string;
  rating?: number;
  specialties?: string[];
  isVerified: boolean;
  connectionType: "professional" | "saved_operator" | "saved_crew" | "saved_pilot";
}

export function ConnectionsPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setConnections(generateMockConnections(user?.role || "broker"));
      setIsLoading(false);
    }, 1000);
  };

  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || connection.role === filterRole;
    const matchesStatus = filterStatus === "all" || connection.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getConnectionTypeLabel = (type: string) => {
    switch (type) {
      case "saved_operator": return "Saved Operator";
      case "saved_crew": return "Saved Crew";
      case "saved_pilot": return "Saved Pilot";
      default: return "Professional Connection";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "broker": return <Building2 className="h-4 w-4" />;
      case "operator": return <Plane className="h-4 w-4" />;
      case "pilot": return <UserCheck className="h-4 w-4" />;
      case "crew": return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "broker": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "operator": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pilot": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "crew": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (!user) {
    return <div>Please log in to view your network.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Network</h1>
          <p className="text-muted-foreground">
            Manage your professional connections and saved contacts
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-terminal-card/50 border-terminal-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search connections by name or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Role: {filterRole === "all" ? "All" : filterRole}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterRole("all")}>
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("broker")}>
                    Brokers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("operator")}>
                    Operators
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("pilot")}>
                    Pilots
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("crew")}>
                    Crew
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {filterStatus === "all" ? "All" : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("connected")}>
                    Connected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("saved")}>
                    Saved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Connections</p>
                <p className="text-2xl font-bold text-foreground">{connections.length}</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saved Operators</p>
                <p className="text-2xl font-bold text-foreground">
                  {connections.filter(c => c.connectionType === "saved_operator").length}
                </p>
              </div>
              <Plane className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saved Crew</p>
                <p className="text-2xl font-bold text-foreground">
                  {connections.filter(c => c.connectionType === "saved_crew" || c.connectionType === "saved_pilot").length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold text-foreground">
                  {connections.filter(c => c.status === "pending").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="bg-terminal-card/50 border-terminal-border animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-terminal-border/50 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredConnections.map((connection) => (
            <Card key={connection.id} className="bg-terminal-card/50 border-terminal-border hover:bg-terminal-card transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback>
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{connection.name}</h3>
                        {connection.isVerified && (
                          <Shield className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{connection.company}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getRoleColor(connection.role)}>
                    {getRoleIcon(connection.role)}
                    <span className="ml-1 capitalize">{connection.role}</span>
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {connection.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {connection.mutualConnections} mutual connections
                  </div>
                  {connection.rating && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                      {connection.rating}/5 rating
                    </div>
                  )}
                </div>

                {connection.specialties && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {connection.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {connection.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{connection.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {getConnectionTypeLabel(connection.connectionType)}
                  </Badge>
                  <div className="flex space-x-2">
                    {connection.status === "connected" && (
                      <>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </>
                    )}
                    {connection.status === "pending" && (
                      <Button size="sm">
                        Accept
                      </Button>
                    )}
                    {connection.status === "saved" && (
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!isLoading && filteredConnections.length === 0 && (
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No connections found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or start building your network.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Find Connections
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Mock data generator - replace with real API calls
function generateMockConnections(userRole: string): Connection[] {
  const baseConnections: Connection[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "broker",
      company: "SkyHigh Aviation",
      location: "New York, NY",
      status: "connected",
      mutualConnections: 12,
      lastInteraction: "2 days ago",
      rating: 4.8,
      specialties: ["Private Jets", "International", "VIP Services"],
      isVerified: true,
      connectionType: "professional"
    },
    {
      id: "2",
      name: "Mike Chen",
      role: "operator",
      company: "Elite Air Services",
      location: "Los Angeles, CA",
      status: "saved",
      mutualConnections: 8,
      lastInteraction: "1 week ago",
      rating: 4.9,
      specialties: ["Gulfstream G650", "Trans-Atlantic", "Crew Management"],
      isVerified: true,
      connectionType: "saved_operator"
    },
    {
      id: "3",
      name: "Captain David Rodriguez",
      role: "pilot",
      company: "Premium Flight Services",
      location: "Miami, FL",
      status: "connected",
      mutualConnections: 15,
      lastInteraction: "3 days ago",
      rating: 4.7,
      specialties: ["Boeing 737", "International", "Type Rating Instructor"],
      isVerified: true,
      connectionType: "saved_pilot"
    },
    {
      id: "4",
      name: "Emma Thompson",
      role: "crew",
      company: "Luxury Flight Attendants",
      location: "Chicago, IL",
      status: "pending",
      mutualConnections: 5,
      rating: 4.6,
      specialties: ["VIP Service", "Catering", "Multi-language"],
      isVerified: false,
      connectionType: "saved_crew"
    }
  ];

  // Add role-specific connections
  if (userRole === "broker") {
    baseConnections.push(
      {
        id: "5",
        name: "Alex Kumar",
        role: "operator",
        company: "Global Aviation Partners",
        location: "London, UK",
        status: "saved",
        mutualConnections: 3,
        lastInteraction: "2 weeks ago",
        rating: 4.5,
        specialties: ["Airbus A320", "European Routes", "Charter Services"],
        isVerified: true,
        connectionType: "saved_operator"
      }
    );
  }

  return baseConnections;
}
