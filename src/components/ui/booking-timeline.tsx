import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Plane, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface Flight {
  id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_datetime: string;
  arrival_datetime: string;
  status: string;
  actual_departure_time?: string;
  actual_arrival_time?: string;
  delay_reason?: string;
}

interface BookingTimelineProps {
  flights: Flight[];
  showDetails?: boolean;
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({
  flights,
  showDetails = true
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'boarding':
        return <Plane className="h-4 w-4 text-yellow-500" />;
      case 'departed':
        return <Plane className="h-4 w-4 text-green-500" />;
      case 'in_flight':
        return <Plane className="h-4 w-4 text-green-500" />;
      case 'landed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-900/20 text-blue-400 border-blue-500/30';
      case 'boarding':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'departed':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'in_flight':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'landed':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'delayed':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-900/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'boarding':
        return 'Boarding';
      case 'departed':
        return 'Departed';
      case 'in_flight':
        return 'In Flight';
      case 'landed':
        return 'Landed';
      case 'delayed':
        return 'Delayed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentStatus = () => {
    const activeFlight = flights.find(f => 
      ['boarding', 'departed', 'in_flight'].includes(f.status)
    );
    return activeFlight ? activeFlight.status : 'scheduled';
  };

  const isCompleted = () => {
    return flights.every(f => f.status === 'landed' || f.status === 'cancelled');
  };

  if (flights.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Plane className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No flights scheduled</h3>
          <p className="text-gray-600">Flight details will appear here once assigned</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className="flex items-center gap-2">
        <h4 className="font-semibold">Flight Status</h4>
        <Badge className={getStatusColor(getCurrentStatus())}>
          {getStatusDisplay(getCurrentStatus())}
        </Badge>
        {isCompleted() && (
          <Badge className="bg-green-900/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      {/* Flight Timeline */}
      <div className="space-y-3">
        {flights.map((flight, index) => (
          <Card key={flight.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getStatusIcon(flight.status)}
                  <CardTitle className="text-base">
                    {flight.departure_airport} → {flight.arrival_airport}
                  </CardTitle>
                </div>
                <Badge className={getStatusColor(flight.status)}>
                  {getStatusDisplay(flight.status)}
                </Badge>
              </div>
              <CardDescription>
                {formatDateTime(flight.departure_datetime)}
                {flight.actual_departure_time && (
                  <span className="text-green-600 ml-2">
                    (Actual: {formatTime(flight.actual_departure_time)})
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            
            {showDetails && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Departure:</span>
                    <span>
                      {flight.actual_departure_time 
                        ? formatTime(flight.actual_departure_time)
                        : formatTime(flight.departure_datetime)
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Arrival:</span>
                    <span>
                      {flight.actual_arrival_time 
                        ? formatTime(flight.actual_arrival_time)
                        : formatTime(flight.arrival_datetime)
                      }
                    </span>
                  </div>

                  {flight.delay_reason && (
                    <div className="mt-2 p-2 bg-slate-800 rounded-md">
                      <div className="flex items-center gap-2 text-sm text-yellow-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Delay Reason:</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        {flight.delay_reason}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}

            {/* Timeline connector */}
            {index < flights.length - 1 && (
              <div className="absolute -bottom-2 left-6 w-0.5 h-4 bg-orange-500/30"></div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary */}
      {showDetails && (
        <div className="mt-4 p-3 bg-slate-800 rounded-md">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total Flights:</span>
            <span>{flights.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Completed:</span>
            <span>{flights.filter(f => f.status === 'landed').length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Delayed:</span>
            <span>{flights.filter(f => f.status === 'delayed').length}</span>
          </div>
        </div>
      )}
    </div>
  );
};
