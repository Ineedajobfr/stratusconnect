import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  className?: string;
}

export const ProfessionalDataCard: React.FC<DataCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badge,
  className = ""
}) => {
  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${
                trend.isPositive ? 'text-white' : 'text-red-400'
              }`}>
                <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                <span className="ml-1">vs last month</span>
              </div>
            )}
          </div>
          {badge && (
            <Badge variant={badge.variant} className="ml-2">
              {badge.text}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface FlightCardProps {
  route: string;
  date: string;
  aircraft: string;
  status: 'scheduled' | 'boarding' | 'in_flight' | 'landed' | 'delayed';
  passengers: number;
  duration?: string;
  earnings?: number;
  rating?: number;
  className?: string;
}

export const ProfessionalFlightCard: React.FC<FlightCardProps> = ({
  route,
  date,
  aircraft,
  status,
  passengers,
  duration,
  earnings,
  rating,
  className = ""
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'boarding':
        return 'bg-yellow-500';
      case 'in_flight':
        return 'bg-green-500';
      case 'landed':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'boarding':
        return 'Boarding';
      case 'in_flight':
        return 'In Flight';
      case 'landed':
        return 'Landed';
      case 'delayed':
        return 'Delayed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <h3 className="font-semibold text-white">{route}</h3>
          </div>
          <Badge className={`${getStatusColor(status)} text-white`}>
            {getStatusText(status)}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center justify-between">
            <span>{date}</span>
            <span className="text-orange-400 font-medium">{aircraft}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>{passengers} PAX</span>
            {duration && <span>{duration}</span>}
          </div>
          
          {(earnings || rating) && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              {earnings && (
                <span className="text-white font-medium">${earnings.toLocaleString()}</span>
              )}
              {rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-orange-400 font-medium">{rating}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ProfileCardProps {
  name: string;
  title: string;
  rating: number;
  flights: number;
  location: string;
  typeRatings: string[];
  operatingRegions: string[];
  className?: string;
}

export const ProfessionalProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  rating,
  flights,
  location,
  typeRatings,
  operatingRegions,
  className = ""
}) => {
  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="text-orange-400 font-medium">{title}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-orange-400 font-bold">{rating}</span>
                <span className="text-gray-400 text-sm">({flights} flights)</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <span>📍</span>
                <span className="text-sm">{location}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Type Ratings</h4>
            <div className="flex flex-wrap gap-2">
              {typeRatings.map((rating, index) => (
                <Badge key={index} variant="outline" className="border-orange-500 text-orange-400">
                  {rating}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Operating Regions</h4>
            <p className="text-gray-400 text-sm">{operatingRegions.join(', ')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
