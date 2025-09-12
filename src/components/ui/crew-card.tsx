import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Clock, CheckCircle, AlertCircle, Settings } from "lucide-react";

interface CrewMember {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  crew_profiles?: {
    licence_expiry: string;
    availability_status: string;
  };
}

interface CrewCardProps {
  member: CrewMember;
  onEdit?: (member: CrewMember) => void;
  onAssign?: (member: CrewMember) => void;
}

export const CrewCard: React.FC<CrewCardProps> = ({
  member,
  onEdit,
  onAssign
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'pilot':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'crew':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'pilot':
        return 'bg-blue-100 text-blue-800';
      case 'crew':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'unavailable':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isLicenceExpired = () => {
    if (!member.crew_profiles?.licence_expiry) return false;
    return new Date(member.crew_profiles.licence_expiry) < new Date();
  };

  const isLicenceExpiringSoon = () => {
    if (!member.crew_profiles?.licence_expiry) return false;
    const expiryDate = new Date(member.crew_profiles.licence_expiry);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate < thirtyDaysFromNow && expiryDate > new Date();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.avatar_url} />
            <AvatarFallback>
              {getInitials(member.full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">
              {member.full_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              {getRoleIcon(member.role)}
              <span className="capitalize">{member.role}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Availability Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <Badge className={getAvailabilityColor(member.crew_profiles?.availability_status || 'unknown')}>
              {getAvailabilityIcon(member.crew_profiles?.availability_status || 'unknown')}
              <span className="ml-1 capitalize">
                {member.crew_profiles?.availability_status || 'Unknown'}
              </span>
            </Badge>
          </div>

          {/* Licence Status */}
          {member.crew_profiles?.licence_expiry && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Licence Expiry</span>
                <div className="flex items-center gap-1">
                  {isLicenceExpired() && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  {isLicenceExpiringSoon() && !isLicenceExpired() && (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                  {!isLicenceExpired() && !isLicenceExpiringSoon() && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className={`text-sm ${
                    isLicenceExpired() 
                      ? 'text-red-600' 
                      : isLicenceExpiringSoon() 
                        ? 'text-yellow-600' 
                        : 'text-gray-600'
                  }`}>
                    {formatDate(member.crew_profiles.licence_expiry)}
                  </span>
                </div>
              </div>
              
              {isLicenceExpired() && (
                <div className="p-2 bg-slate-800 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ Licence expired - cannot be assigned
                  </p>
                </div>
              )}
              
              {isLicenceExpiringSoon() && !isLicenceExpired() && (
                <div className="p-2 bg-slate-800 border border-yellow-200 rounded-md">
                  <p className="text-xs text-yellow-600 font-medium">
                    ⚠️ Licence expires soon - renewal needed
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit?.(member)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onAssign?.(member)}
              disabled={member.crew_profiles?.availability_status === 'unavailable' || isLicenceExpired()}
            >
              <Users className="h-4 w-4 mr-1" />
              Assign
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
