import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { 
  Calendar, 
  Clock, 
  Users, 
  BarChart3, 
  Settings, 
  User, 
  Shield, 
  Briefcase, 
  Award, 
  FileText, 
  Plane, 
  CheckCircle, 
  DollarSign, 
  MessageCircle, 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  MapPin,
  Star,
  Home
} from "lucide-react";
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

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Star Background */}
      <div className="absolute inset-0 z-0">
        <StarfieldRunwayBackground intensity={0.4} starCount={120} />
      </div>
      
      {/* Main Terminal Interface */}
      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
          {/* Terminal Header */}
          <header className="p-6 border-b border-slate-700">
            {/* StratusConnect Logo */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SC</span>
                </div>
                <div>
                  <StratusConnectLogo className="text-xl" />
                  <p className="text-muted-foreground text-xs">Aviation Platform</p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center space-x-2">
                {onNavigate && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('back')}
                      className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('forward')}
                      className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Terminal Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {onNotificationClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNotificationClick}
                    className="text-slate-400 hover:text-white hover:bg-slate-700 relative"
                  >
                    <Bell className="h-4 w-4" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                  </Button>
                )}

                {onMessageClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMessageClick}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Home Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>

            {/* Title Section */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-orange-400">{title}</h2>
              <p className="text-slate-400 text-sm">{subtitle}</p>
            </div>

            {/* User Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                {/* Logout */}
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <Badge 
                className={`${getStatusColor(user.status)} text-white px-3 py-1`}
              >
                {getStatusText(user.status)}
              </Badge>
            </div>
          </header>

          {/* Sidebar Navigation */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <div
                  key={item.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                    ${item.active 
                      ? 'bg-orange-500 text-white' 
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge className="bg-orange-500 text-white">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Footer */}
          <footer className="p-6 border-t border-slate-700">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-2">STRATUS CONNECT TERMINAL v3.2</div>
              <div className="text-xs text-slate-500">
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
              </div>
            </div>
          </footer>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Terminal Status Bar */}
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
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
                {onNavigate && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('back')}
                      className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('forward')}
                      className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 bg-slate-900 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
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