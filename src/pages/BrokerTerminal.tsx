import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TerminalTemplate from "@/components/TerminalTemplate";
import { useShortcuts } from "@/hooks/use-shortcuts";
import { useRef } from "react";
import { BarChart3, MessageSquare, TrendingUp, DollarSign, Clock, Users, Globe, Bookmark, FileText, Settings, AlertTriangle, Star, Calendar, Shield } from "lucide-react";
import type { User } from '@supabase/supabase-js';
import DemoMarketplace from './DemoMarketplace';

export default function BrokerTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isBetaMode = location.pathname.startsWith('/beta/');
  const searchRef = useRef<HTMLInputElement>(null);

  useShortcuts({
    "mod+k": () => searchRef.current?.focus(),
    "mod+f": () => {/* open filters */},
  });

  useEffect(() => {
    if (isBetaMode) {
      // Beta mode - create mock user
      setUser({
        id: 'beta-broker-user',
        email: 'beta.broker@stratusconnect.org',
        user_metadata: {
          full_name: 'Beta Broker',
          role: 'broker'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User);
      setLoading(false);
      return;
    }

    // Regular auth mode
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isBetaMode]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>;
  }
  if (!user && !isBetaMode) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Please log in to access the Broker Terminal</div>
      </div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <TerminalTemplate
            left={
              <div className="space-y-4">
                <div className="text-sm font-semibold">Filters & Search</div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Quote Requests Today</div>
                  <div className="text-2xl font-mono tabular">47</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Response Median</div>
                  <div className="text-2xl font-mono tabular">2.3m</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Risk Alerts</div>
                  <div className="text-2xl font-mono tabular text-red-400">3</div>
                </div>
              </div>
            }
            main={
              <div className="space-y-4">
                <div className="text-sm font-semibold">Live RFQs & Quotes</div>
                <div className="overflow-auto rounded-md border border-line">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead className="bg-white/5 text-white/80">
                      <tr>
                        <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Route</th>
                        <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Aircraft</th>
                        <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Quote</th>
                        <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">JFK → LAX</td>
                        <td className="px-3 py-2 text-xs">G650</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$45,000</td>
                        <td className="px-3 py-2 text-xs text-green-400">Active</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">LHR → CDG</td>
                        <td className="px-3 py-2 text-xs">A320</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$12,500</td>
                        <td className="px-3 py-2 text-xs text-yellow-400">Pending</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">SFO → NRT</td>
                        <td className="px-3 py-2 text-xs">B777</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$78,000</td>
                        <td className="px-3 py-2 text-xs text-green-400">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            }
            right={
              <div className="space-y-4">
                <div className="text-sm font-semibold">Risk & Alerts</div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Market Risk</div>
                  <div className="text-lg font-mono tabular text-green-400">Low</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Messages</div>
                  <div className="text-lg font-mono tabular">12</div>
                </div>
              </div>
            }
            bottom={
              <div className="space-y-2">
                <div className="text-sm font-semibold">Market Tape</div>
                <div className="font-mono text-xs text-textDim">
                  JFK-LAX: $45K ↑ | LHR-CDG: $12.5K → | SFO-NRT: $78K ↑ | Empty legs: 23 available
                </div>
              </div>
            }
          />
        );
      case "marketplace":
        return <DemoMarketplace />;
      default:
        return (
          <div className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Center
                </CardTitle>
                <p className="text-gunmetal">Advanced {activeTab} management and processing system</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-6 text-accent opacity-60" />
                  <h3 className="text-xl font-semibold text-foreground mb-4 capitalize">{activeTab} Management</h3>
                  <p className="text-gunmetal mb-6 max-w-md mx-auto">
                    This section is under development. Advanced {activeTab} features will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "marketplace", label: "Marketplace", icon: Globe },
    { id: "verification", label: "Fortress of Trust", icon: Shield },
    { id: "requests", label: "My Requests", icon: FileText },
    { id: "quotes", label: "Quotes", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "directory", label: "Directory", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "transactions", label: "Transactions", icon: DollarSign },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "saved", label: "Saved Jets", icon: Bookmark },
    { id: "profile", label: "Profile", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Terminal Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-white">Broker Terminal</h1>
              <div className="flex items-center space-x-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-mono">MARKET ACTIVE</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-slate-400 text-sm font-mono">
                {new Date().toLocaleTimeString()} UTC
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Navigation */}
      <div className="border-b border-slate-700 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 py-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
}