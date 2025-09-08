import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  LogOut, 
  Bell, 
  MessageSquare,
  Settings,
  BarChart3,
  Plane,
  Users,
  Calendar,
  Shield,
  Award,
  FileText,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle,
  Star
} from "lucide-react";

interface TerminalLayoutProps {
  title: string;
  subtitle: string;
  user: {
    name: string;
    role: string;
    status: 'available' | 'busy' | 'offline';
    avatar?: string;
  };
  sidebarItems: Array<{
    id: string;
    label: string;
    icon: ReactNode;
    active?: boolean;
    badge?: string | number;
  }>;
  children: ReactNode;
  onNavigate?: (direction: 'prev' | 'next') => void;
  onLogout?: () => void;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
}

export const UnifiedTerminalLayout: React.FC<TerminalLayoutProps> = ({
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Branding */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">StratusConnect</h2>
            <p className="text-sm text-gray-400">Aviation Professional</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="bg-gray-600 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">System Operational</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                <p className="text-gray-400 text-sm">{subtitle}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Navigation Arrows */}
                {onNavigate && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('prev')}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('next')}
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Notifications */}
                {onNotificationClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNotificationClick}
                    className="text-gray-400 hover:text-white hover:bg-gray-700 relative"
                  >
                    <Bell className="h-4 w-4" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                  </Button>
                )}

                {/* Messages */}
                {onMessageClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMessageClick}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Welcome back,</p>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                  </div>
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
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
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

          {/* Main Content */}
          <main className="flex-1 bg-gray-900 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

// Icon components for consistency
export const TerminalIcons = {
  Profile: (props: any) => <User className="h-4 w-4" {...props} />,
  Trust: (props: any) => <Shield className="h-4 w-4" {...props} />,
  Jobs: (props: any) => <Award className="h-4 w-4" {...props} />,
  Schedule: (props: any) => <Calendar className="h-4 w-4" {...props} />,
  Certifications: (props: any) => <FileText className="h-4 w-4" {...props} />,
  Logbook: (props: any) => <Plane className="h-4 w-4" {...props} />,
  Earnings: (props: any) => <DollarSign className="h-4 w-4" {...props} />,
  Network: (props: any) => <Users className="h-4 w-4" {...props} />,
  Training: (props: any) => <Award className="h-4 w-4" {...props} />,
  News: (props: any) => <FileText className="h-4 w-4" {...props} />,
  Requests: (props: any) => <Plane className="h-4 w-4" {...props} />,
  Bookings: (props: any) => <CheckCircle className="h-4 w-4" {...props} />,
  Fleet: (props: any) => <Plane className="h-4 w-4" {...props} />,
  Crew: (props: any) => <Users className="h-4 w-4" {...props} />,
  Analytics: (props: any) => <BarChart3 className="h-4 w-4" {...props} />,
  Settings: (props: any) => <Settings className="h-4 w-4" {...props} />,
  Location: (props: any) => <MapPin className="h-4 w-4" {...props} />,
  Time: (props: any) => <Clock className="h-4 w-4" {...props} />,
  Star: (props: any) => <Star className="h-4 w-4" {...props} />
};
