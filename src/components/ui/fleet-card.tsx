import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Users, Settings, AlertCircle, CheckCircle } from "lucide-react";

interface Aircraft {
  id: string;
  tail_number: string;
  model: string;
  category: string;
  seats: number;
  status: string;
  photo_url?: string;
  range_nm?: number;
  year?: number;
}

interface FleetCardProps {
  aircraft: Aircraft;
  onEdit?: (aircraft: Aircraft) => void;
  onMaintenance?: (aircraft: Aircraft) => void;
}

export const FleetCard: React.FC<FleetCardProps> = ({
  aircraft,
  onEdit,
  onMaintenance
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_use':
        return <Plane className="h-4 w-4 text-blue-500" />;
      case 'maintenance':
        return <Settings className="h-4 w-4 text-yellow-500" />;
      case 'grounded':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Plane className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'in_use':
        return 'bg-blue-900/20 text-blue-400 border-blue-500/30';
      case 'maintenance':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'grounded':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-900/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryDisplay = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatRange = (range: number) => {
    if (range >= 1000) {
      return `${(range / 1000).toFixed(1)}k nm`;
    }
    return `${range} nm`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getStatusIcon(aircraft.status)}
            <CardTitle className="text-lg">{aircraft.model}</CardTitle>
          </div>
          <Badge className={getStatusColor(aircraft.status)}>
            {aircraft.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <span className="font-mono text-sm">{aircraft.tail_number}</span>
          {aircraft.year && (
            <span className="text-gray-500">• {aircraft.year}</span>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Aircraft Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-600" />
              <span>{aircraft.seats} passengers</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Plane className="h-4 w-4 text-gray-600" />
              <span>{getCategoryDisplay(aircraft.category)}</span>
            </div>
            
            {aircraft.range_nm && (
              <div className="flex items-center gap-2 text-sm">
                <Plane className="h-4 w-4 text-gray-600" />
                <span>{formatRange(aircraft.range_nm)} range</span>
              </div>
            )}
          </div>

          {/* Aircraft Photo Placeholder */}
          {aircraft.photo_url ? (
            <div className="w-full h-32 bg-slate-900/20 rounded-md overflow-hidden border border-slate-700">
              <img 
                src={aircraft.photo_url} 
                alt={aircraft.model}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-slate-900/20 rounded-md flex items-center justify-center border border-slate-700">
              <Plane className="h-8 w-8 text-slate-400" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit?.(aircraft)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onMaintenance?.(aircraft)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Maintenance
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
