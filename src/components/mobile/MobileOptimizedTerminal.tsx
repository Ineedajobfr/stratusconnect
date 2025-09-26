// Mobile Optimized Terminal - Industry Standard
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  Settings,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

interface MobileOptimizedTerminalProps {
  children: React.ReactNode;
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  className?: string;
}

export function MobileOptimizedTerminal({ 
  children, 
  terminalType,
  className = ''
}: MobileOptimizedTerminalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="w-4 h-4" />;
    if (isTablet) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const getDeviceLabel = () => {
    if (isMobile) return 'Mobile';
    if (isTablet) return 'Tablet';
    return 'Desktop';
  };

  if (isMobile) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}>
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-terminal-card/95 backdrop-blur-sm border-b border-terminal-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {terminalType.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground capitalize">
                  {terminalType} Terminal
                </h1>
                <div className="flex items-center gap-1 text-xs text-gunmetal">
                  {getDeviceIcon()}
                  {getDeviceLabel()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="w-10 h-10 p-0"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-10 h-10 p-0"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="border-t border-terminal-border bg-terminal-card/95 backdrop-blur-sm">
              <div className="p-4 space-y-2">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'rfqs' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('rfqs')}
                >
                  RFQs
                </Button>
                <Button
                  variant={activeTab === 'quotes' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('quotes')}
                >
                  Quotes
                </Button>
                <Button
                  variant={activeTab === 'payments' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('payments')}
                >
                  Payments
                </Button>
                <Button
                  variant={activeTab === 'weather' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('weather')}
                >
                  Weather
                </Button>
                <Button
                  variant={activeTab === 'risk' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('risk')}
                >
                  Risk Assessment
                </Button>
                <Button
                  variant={activeTab === 'audit' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('audit')}
                >
                  Audit Trail
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${className}`}>
        {/* Tablet Header */}
        <div className="sticky top-0 z-50 bg-terminal-card/95 backdrop-blur-sm border-b border-terminal-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {terminalType.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground capitalize">
                  {terminalType} Terminal
                </h1>
                <div className="flex items-center gap-1 text-sm text-gunmetal">
                  {getDeviceIcon()}
                  {getDeviceLabel()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button size="sm" variant="ghost">
                <Bell className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tablet Content */}
        <div className="p-6 space-y-6">
          {children}
        </div>
      </div>
    );
  }

  // Desktop - return original content
  return <div className={className}>{children}</div>;
}

// Mobile-optimized card component
export function MobileCard({ 
  title, 
  children, 
  collapsible = false,
  defaultCollapsed = false,
  className = ''
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <Card className={`terminal-card ${className}`}>
      <CardHeader 
        className={`${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{title}</span>
          {collapsible && (
            <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}

// Mobile-optimized button group
export function MobileButtonGroup({ 
  buttons, 
  className = ''
}: {
  buttons: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    active?: boolean;
  }>;
  className?: string;
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.active ? 'default' : button.variant || 'outline'}
          onClick={button.onClick}
          className="flex-1"
        >
          {button.icon && <span className="mr-2">{button.icon}</span>}
          {button.label}
        </Button>
      ))}
    </div>
  );
}

// Mobile-optimized data table
export function MobileDataTable({ 
  data, 
  columns, 
  className = ''
}: {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {data.map((row, index) => (
        <Card key={index} className="terminal-card">
          <CardContent className="p-4">
            <div className="space-y-2">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-center">
                  <span className="text-sm text-gunmetal">{column.label}</span>
                  <span className="text-sm text-foreground">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mobile-optimized stats grid
export function MobileStatsGrid({ 
  stats, 
  className = ''
}: {
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <Card key={index} className="terminal-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gunmetal mb-1">
              {stat.label}
            </div>
            {stat.change && (
              <Badge 
                className={
                  stat.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                  stat.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }
              >
                {stat.change}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
