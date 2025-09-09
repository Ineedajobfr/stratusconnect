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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-64 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 flex flex-col shadow-2xl">
          {/* Branding */}
          <div className="p-6 border-b border-slate-700/50">
            <h2 
              className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent cursor-pointer hover:text-cyan-400 transition-all duration-300"
              onClick={() => window.location.href = '/'}
            >
              StratusConnect
            </h2>
            <p className="text-sm text-slate-400 font-medium">Aviation Professional</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                  item.active 
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`transition-transform duration-300 ${item.active ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="bg-slate-600/80 text-white text-xs px-2 py-1">
                    {item.badge}
                  </Badge>
                )}
                {item.active && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300" />
                )}
              </button>
            ))}
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-400 font-medium">System Operational</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Top Header */}
          <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{title}</h1>
                <p className="text-slate-400 text-sm font-medium mt-1">{subtitle}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Navigation Arrows */}
                {onNavigate && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('prev')}
                      className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('next')}
                      className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl"
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
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50 relative transition-all duration-300 rounded-xl"
                  >
                    <Bell className="h-4 w-4" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  </Button>
                )}

                {/* Messages */}
                {onMessageClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMessageClick}
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}

                {/* User Profile */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400 font-medium">Welcome back,</p>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-black text-sm font-bold shadow-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                {/* Logout */}
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <Badge 
                className={`${getStatusColor(user.status)} text-white px-4 py-2 rounded-full font-medium shadow-lg`}
              >
                {getStatusText(user.status)}
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-auto">
            <div className="space-y-6">
              {children}
            </div>
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
