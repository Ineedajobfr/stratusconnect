import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Calendar, Clock, Users, BarChart3, Settings, User, Shield, Briefcase, Award, FileText, Plane, CheckCircle, DollarSign, MessageCircle, Bell, ChevronLeft, ChevronRight, LogOut, MapPin, Star, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StarfieldRunwayBackground } from "../StarfieldRunwayBackground";
interface User {
  name: string;
  role: string;
  status: 'available' | 'busy' | 'offline';
  avatar?: string;
}
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
}
interface UnifiedTerminalLayoutProps {
  title: string;
  subtitle: string;
  user: User;
  sidebarItems: SidebarItem[];
  children: React.ReactNode;
  onNavigate?: (direction: 'back' | 'forward') => void;
  onLogout?: () => void;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
}
export const UnifiedTerminalLayout: React.FC<UnifiedTerminalLayoutProps> = ({
  title,
  subtitle,
  user,
  sidebarItems,
  children,
  onNavigate,
  onLogout,
  onNotificationClick,
  onMessageClick
}) => {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'AVAILABLE';
      case 'busy':
        return 'BUSY';
      case 'offline':
        return 'OFFLINE';
      default:
        return status.toUpperCase();
    }
  };
  return <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Star Background */}
      <div className="absolute inset-0 z-0">
        <StarfieldRunwayBackground intensity={0.4} starCount={120} />
      </div>
      
      {/* Main Terminal Interface */}
      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Terminal Status Bar */}
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <StratusConnectLogo className="text-orange-400 text-lg mr-6" />
                <div className="text-sm text-slate-400">
                  TERMINAL STATUS: <span className="text-white">OPERATIONAL</span>
                </div>
                <div className="text-sm text-slate-400">
                  USER: <span className="text-orange-400">{user.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-400">
                  ROLE: <span className="text-cyan-400">{user.role}</span>
                </div>
                <div className="text-sm text-slate-400">
                  TIME: <span className="text-white">{new Date().toLocaleTimeString()}</span>
                </div>
                {/* Page Navigation */}
                {onNavigate && <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => onNavigate('back')} className="text-slate-400 hover:text-white hover:bg-slate-700">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onNavigate('forward')} className="text-slate-400 hover:text-white hover:bg-slate-700">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 bg-slate-900 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>;
};

// Icon components for consistency
interface IconProps {
  className?: string;
  [key: string]: unknown;
}
export const TerminalIcons = {
  Profile: (props: IconProps) => <User className="h-4 w-4" {...props} />,
  Trust: (props: IconProps) => <Shield className="h-4 w-4" {...props} />,
  Jobs: (props: IconProps) => <Award className="h-4 w-4" {...props} />,
  Schedule: (props: IconProps) => <Calendar className="h-4 w-4" {...props} />,
  Certifications: (props: IconProps) => <FileText className="h-4 w-4" {...props} />,
  Licenses: (props: IconProps) => <FileText className="h-4 w-4" {...props} />,
  Logbook: (props: IconProps) => <Plane className="h-4 w-4" {...props} />,
  Earnings: (props: IconProps) => <DollarSign className="h-4 w-4" {...props} />,
  Network: (props: IconProps) => <Users className="h-4 w-4" {...props} />,
  Training: (props: IconProps) => <Award className="h-4 w-4" {...props} />,
  News: (props: IconProps) => <FileText className="h-4 w-4" {...props} />,
  Requests: (props: IconProps) => <Plane className="h-4 w-4" {...props} />,
  Bookings: (props: IconProps) => <CheckCircle className="h-4 w-4" {...props} />,
  Fleet: (props: IconProps) => <Plane className="h-4 w-4" {...props} />,
  Crew: (props: IconProps) => <Users className="h-4 w-4" {...props} />,
  Analytics: (props: IconProps) => <BarChart3 className="h-4 w-4" {...props} />,
  Settings: (props: IconProps) => <Settings className="h-4 w-4" {...props} />,
  Location: (props: IconProps) => <MapPin className="h-4 w-4" {...props} />,
  Time: (props: IconProps) => <Clock className="h-4 w-4" {...props} />,
  Dashboard: (props: IconProps) => <BarChart3 className="h-4 w-4" {...props} />,
  Dispatch: (props: IconProps) => <Plane className="h-4 w-4" {...props} />,
  Maintenance: (props: IconProps) => <Settings className="h-4 w-4" {...props} />,
  Marketplace: (props: IconProps) => <BarChart3 className="h-4 w-4" {...props} />,
  Communications: (props: IconProps) => <MessageCircle className="h-4 w-4" {...props} />,
  Compliance: (props: IconProps) => <Shield className="h-4 w-4" {...props} />,
  FileText: (props: IconProps) => <FileText className="h-4 w-4" {...props} />,
  Star: (props: IconProps) => <Star className="h-4 w-4" {...props} />
};