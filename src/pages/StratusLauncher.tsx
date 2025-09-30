import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    BarChart3,
    Briefcase,
    Check,
    Monitor,
    Navigation,
    Plane,
    Settings,
    Shield,
    Users
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TerminalSection {
  id: string;
  label: string;
  route: string;
  icon: React.ComponentType<any>;
  description: string;
  fullDescription: string;
  features: string[];
  status: 'active' | 'beta' | 'coming-soon';
}

interface TopNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  active: boolean;
}

const topNavItems: TopNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, active: true },
  { id: 'live-flights', label: 'Live Flights', icon: Plane, active: false },
  { id: 'routes', label: 'Routes', icon: Navigation, active: false },
  { id: 'operations', label: 'Operations', icon: Shield, active: false },
  { id: 'terminals', label: 'Terminals', icon: Monitor, active: false }
];

const terminalSections: TerminalSection[] = [
  { 
    id: 'broker', 
    label: 'Broker Terminal', 
    route: '/demo/broker', 
    icon: Briefcase, 
    description: 'Quote management & client relations',
    fullDescription: 'Comprehensive broker management system for aviation deals, client relations, and market analysis.',
    features: [
      'Real-time market data & pricing',
      'Client relationship management',
      'Deal tracking & analytics',
      'Automated quote generation',
      'Compliance monitoring'
    ],
    status: 'active'
  },
  { 
    id: 'operator', 
    label: 'Operator Terminal', 
    route: '/demo/operator', 
    icon: Settings, 
    description: 'Flight operations & fleet management',
    fullDescription: 'Complete flight operations control center for managing aircraft, schedules, and operational efficiency.',
    features: [
      'Flight scheduling & dispatch',
      'Aircraft maintenance tracking',
      'Crew scheduling & management',
      'Weather monitoring & alerts',
      'Operational reporting'
    ],
    status: 'active'
  },
  { 
    id: 'pilot', 
    label: 'Pilot Terminal', 
    route: '/demo/pilot', 
    icon: Plane, 
    description: 'Flight planning & execution',
    fullDescription: 'Advanced flight planning and execution tools for pilots with real-time navigation and weather data.',
    features: [
      'Flight planning & routing',
      'Weather analysis & alerts',
      'Navigation & charts',
      'Flight documentation',
      'Performance monitoring'
    ],
    status: 'active'
  },
  { 
    id: 'crew', 
    label: 'Crew Terminal', 
    route: '/demo/crew', 
    icon: Users, 
    description: 'Crew management & scheduling',
    fullDescription: 'Comprehensive crew management system for scheduling, training, and crew coordination.',
    features: [
      'Crew scheduling & assignments',
      'Training & certification tracking',
      'Performance management',
      'Communication tools',
      'Compliance reporting'
    ],
    status: 'demo'
  }
];

export default function StratusLauncher() {
  const [currentScreen, setCurrentScreen] = useState<'title' | 'menu'>('title');
  const [selectedTopNav, setSelectedTopNav] = useState(0);
  const [selectedTerminal, setSelectedTerminal] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const navigate = useNavigate();

  // Handle keyboard navigation
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (currentScreen === 'title') {
      if (event.key === 'Enter') {
        event.preventDefault();
        setCurrentScreen('menu');
        setShowInstructions(false);
      }
    } else if (currentScreen === 'menu') {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          setSelectedTerminal(prev => {
            const newIndex = event.key === 'ArrowLeft' 
              ? Math.max(0, prev - 1) 
              : Math.min(terminalSections.length - 1, prev + 1);
            return newIndex;
          });
          break;
        case 'Enter':
          event.preventDefault();
          const terminal = terminalSections[selectedTerminal];
          if (terminal && terminal.status === 'active') {
            navigate(terminal.route);
          }
          break;
        case 'Escape':
          setCurrentScreen('title');
          break;
        case 'Tab':
          event.preventDefault();
          setSelectedTerminal(prev => 
            prev === terminalSections.length - 1 ? 0 : prev + 1
          );
          break;
      }
    }
  }, [currentScreen, selectedTerminal, navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Keep instructions visible and flashing slowly like a loading screen
  useEffect(() => {
    if (currentScreen === 'title') {
      setShowInstructions(true);
    }
  }, [currentScreen]);

  if (currentScreen === 'title') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Aviation background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJhdmlhdGlvbi1ncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmE1MDA7c3RvcC1vcGFjaXR5OjAuOCIvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNzUwMDtzdG9wLW9wYWNpdHk6MC42Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MC45Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNhdmlhdGlvbi1ncmFkaWVudCkiLz4KPC9zdmc+')`,
          }}
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-20"></div>
        </div>

        {/* Main title with enhanced styling */}
        <div className="relative z-10 text-center">
          <div className="bg-white/95 backdrop-blur-sm px-12 py-6 mb-6 inline-block shadow-2xl border border-white/20">
            <h1 className="text-6xl font-black text-black tracking-wider drop-shadow-lg">STRATUS</h1>
          </div>
          <h2 className="text-3xl text-white mb-8 tracking-wide font-light drop-shadow-lg">
            YOUR WORLD OF AVIATION
          </h2>
          
          <div className="text-white/90 text-xl font-mono bg-black/30 px-6 py-3 rounded backdrop-blur-sm animate-pulse" style={{ animationDuration: '2s' }}>
            PRESS [Enter] TO ENTER THE TERMINAL
          </div>
        </div>

        {/* Enhanced atmospheric elements */}
        <div className="absolute top-8 left-8 text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm">
          STRATUSCONNECT
        </div>
        <div className="absolute bottom-8 right-8 text-white/80 text-sm font-mono bg-black/30 px-4 py-2 rounded backdrop-blur-sm">
          AVIATION NETWORK
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Aviation sunset background with multiple aircraft */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJzdW5zZXQtZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY2YjAwO3N0b3Atb3BhY2l0eTowLjkiLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjQwMDA7c3RvcC1vcGFjaXR5OjAuNyIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjAuOTUiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSJ1cmwoI3N1bnNldC1ncmFkaWVudCkiLz4KPC9zdmc+')`,
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">STRATUSCONNECT</h1>
          <p className="text-white/70 text-lg">Choose Your Terminal</p>
        </div>
      </div>

      {/* Terminal Cards Grid */}
      <div className="relative z-10 px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {terminalSections.map((terminal, index) => {
            const Icon = terminal.icon;
            return (
              <Card
                key={terminal.id}
                className={`bg-black/40 backdrop-blur-sm border-white/20 hover:bg-black/60 transition-all duration-300 transform hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  selectedTerminal === index 
                    ? 'ring-2 ring-amber-400 bg-amber-900/20 border-amber-400/50 scale-105' 
                    : ''
                }`}
                tabIndex={0}
                onClick={() => {
                  setSelectedTerminal(index);
                  if (terminal.status === 'active') {
                    navigate(terminal.route);
                  }
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-white">{terminal.label}</CardTitle>
                        <Badge 
                          variant={terminal.status === 'active' ? 'default' : 'secondary'}
                          className={`${
                            terminal.status === 'active' 
                              ? 'bg-green-600 text-white' 
                              : terminal.status === 'demo'
                              ? 'bg-amber-600 text-white'
                              : 'bg-gray-600 text-gray-300'
                          }`}
                        >
                          {terminal.status === 'active' ? 'ONLINE' : terminal.status === 'demo' ? 'DEMO' : 'OFFLINE'}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm">{terminal.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/80 text-sm leading-relaxed">
                    {terminal.fullDescription}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {terminal.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-white/70 text-sm">
                          <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (terminal.status === 'active') {
                          navigate(terminal.route);
                        } else if (terminal.status === 'demo') {
                          alert(`Demo mode for ${terminal.label} - Limited functionality available!`);
                        }
                      }}
                      disabled={terminal.status === 'offline'}
                      className={`flex-1 ${
                        terminal.status === 'active'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : terminal.status === 'demo'
                          ? 'bg-amber-500 hover:bg-amber-600 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {terminal.status === 'active' ? 'Access Terminal' : 
                       terminal.status === 'demo' ? 'Try Demo' : 'Terminal Offline'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to demo route
                        navigate(terminal.route);
                      }}
                      className="flex-1 border-amber-400/50 text-amber-200 hover:bg-amber-400/10"
                    >
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <Button 
          variant="outline" 
          onClick={() => {
            setCurrentScreen('title');
            setSelectedTerminal(0);
          }}
          className="border-amber-400/50 text-amber-200 hover:bg-amber-400/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Title
        </Button>
      </div>

      {/* Keyboard Navigation Instructions */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="flex justify-between items-center text-white/60 text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←→</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Esc</kbd>
              <span>Back</span>
            </span>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-semibold">STRATUSCONNECT</div>
            <div className="text-xs">Aviation Terminal System</div>
          </div>
        </div>
      </div>
    </div>
  );
}
