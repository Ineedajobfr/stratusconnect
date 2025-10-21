import React from 'react';
import { MobileTerminal, MobileNavTabs, MobileStatsGrid, MobileTerminalCard } from '../MobileTerminalLayout';
import { MobileResponsive, MobileGrid, MobileText, MobileStack } from '../MobileResponsive';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mobile Broker Terminal
export const MobileBrokerTerminal: React.FC<{
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}> = ({ children, activeTab = 'dashboard', onTabChange = () => {} }) => {
  const tabs = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Requests', value: 'requests', count: 5 },
    { label: 'Quotes', value: 'quotes', count: 12 },
    { label: 'Deals', value: 'deals', count: 3 },
    { label: 'Analytics', value: 'analytics' }
  ];

  const header = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <MobileText size="title" className="text-body">Broker Terminal</MobileText>
        <Badge variant="outline" className="text-xs">Beta</Badge>
      </div>
      <MobileNavTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );

  return (
    <MobileTerminal header={header}>
      {children}
    </MobileTerminal>
  );
};

// Mobile Operator Terminal
export const MobileOperatorTerminal: React.FC<{
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}> = ({ children, activeTab = 'dashboard', onTabChange = () => {} }) => {
  const tabs = [
    { label: 'Overview', value: 'dashboard' },
    { label: 'Fleet', value: 'fleet', count: 8 },
    { label: 'Bookings', value: 'bookings', count: 15 },
    { label: 'Crew', value: 'crew', count: 24 },
    { label: 'Reports', value: 'reports' }
  ];

  const header = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <MobileText size="title" className="text-body">Operator Terminal</MobileText>
        <Badge variant="outline" className="text-xs">Live</Badge>
      </div>
      <MobileNavTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );

  return (
    <MobileTerminal header={header}>
      {children}
    </MobileTerminal>
  );
};

// Mobile Pilot Terminal
export const MobilePilotTerminal: React.FC<{
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}> = ({ children, activeTab = 'dashboard', onTabChange = () => {} }) => {
  const tabs = [
    { label: 'Schedule', value: 'dashboard' },
    { label: 'Flights', value: 'flights', count: 3 },
    { label: 'Logbook', value: 'logbook' },
    { label: 'Training', value: 'training', count: 2 },
    { label: 'Profile', value: 'profile' }
  ];

  const header = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <MobileText size="title" className="text-body">Pilot Terminal</MobileText>
        <Badge variant="outline" className="text-xs">Active</Badge>
      </div>
      <MobileNavTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );

  return (
    <MobileTerminal header={header}>
      {children}
    </MobileTerminal>
  );
};

// Mobile Crew Terminal
export const MobileCrewTerminal: React.FC<{
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}> = ({ children, activeTab = 'dashboard', onTabChange = () => {} }) => {
  const tabs = [
    { label: 'Schedule', value: 'dashboard' },
    { label: 'Assignments', value: 'assignments', count: 4 },
    { label: 'Availability', value: 'availability' },
    { label: 'Certifications', value: 'certs', count: 1 },
    { label: 'Profile', value: 'profile' }
  ];

  const header = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <MobileText size="title" className="text-body">Crew Terminal</MobileText>
        <Badge variant="outline" className="text-xs">On Duty</Badge>
      </div>
      <MobileNavTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );

  return (
    <MobileTerminal header={header}>
      {children}
    </MobileTerminal>
  );
};

// Mobile Admin Terminal
export const MobileAdminTerminal: React.FC<{
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}> = ({ children, activeTab = 'dashboard', onTabChange = () => {} }) => {
  const tabs = [
    { label: 'Overview', value: 'dashboard' },
    { label: 'Users', value: 'users', count: 245 },
    { label: 'Analytics', value: 'analytics' },
    { label: 'System', value: 'system', count: 2 },
    { label: 'Settings', value: 'settings' }
  ];

  const header = (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <MobileText size="title" className="text-body">Admin Terminal</MobileText>
        <Badge variant="destructive" className="text-xs">Secure</Badge>
      </div>
      <MobileNavTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );

  return (
    <MobileTerminal header={header}>
      {children}
    </MobileTerminal>
  );
};

// Mobile Terminal Dashboard Template
export const MobileTerminalDashboard: React.FC<{
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }>;
  quickActions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  cards: Array<{
    title: string;
    content: React.ReactNode;
    actions?: React.ReactNode;
  }>;
}> = ({ stats, quickActions, cards }) => {
  return (
    <MobileStack spacing="normal">
      {/* Stats Grid */}
      <MobileStatsGrid stats={stats} />
      
      {/* Quick Actions */}
      {quickActions && quickActions.length > 0 && (
        <div className="space-y-2">
          <MobileText size="subtitle" className="text-body">Quick Actions</MobileText>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
                className="flex-1 sm:flex-initial min-w-0"
              >
                <span className="truncate">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Dashboard Cards */}
      <MobileGrid columns={1}>
        {cards.map((card, index) => (
          <MobileTerminalCard
            key={index}
            title={card.title}
            actions={card.actions}
          >
            {card.content}
          </MobileTerminalCard>
        ))}
      </MobileGrid>
    </MobileStack>
  );
};
