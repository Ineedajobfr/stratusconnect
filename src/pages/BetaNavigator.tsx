import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  User, Plane, Users, Shield, ArrowRight, 
  BarChart3, MessageSquare, Calendar, Globe
} from 'lucide-react';

export default function BetaNavigator() {
  const navigate = useNavigate();

  const terminals = [
    {
      id: 'broker',
      title: 'Broker Terminal',
      description: 'Charter request management, market intelligence, and commission tracking',
      icon: BarChart3,
      features: ['Live marketplace feed', 'Quote management', 'Win rate analytics', 'Commission calculator'],
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/30',
      path: '/beta/broker'
    },
    {
      id: 'operator',
      title: 'Operator Terminal', 
      description: 'Fleet management, maintenance scheduling, and revenue optimization',
      icon: Plane,
      features: ['Fleet status monitor', 'Revenue analytics', 'Maintenance tracking', 'Marketplace listings'],
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      path: '/beta/operator'
    },
    {
      id: 'crew',
      title: 'Crew Terminal',
      description: 'Professional pilot and crew member job and certification management',
      icon: User,
      features: ['Job requests', 'Certification tracking', 'Availability calendar', 'Earnings overview'],
      color: 'from-purple-500/20 to-violet-500/20', 
      borderColor: 'border-purple-500/30',
      path: '/beta/crew'
    },
    {
      id: 'admin',
      title: 'Admin Terminal',
      description: 'System administration, user management, and security oversight',
      icon: Shield,
      features: ['User verification', 'Security monitoring', 'System analytics', 'Audit trails'],
      color: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30', 
      path: '/beta/admin'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-6">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-3 py-1">
              BETA ACCESS
            </Badge>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            StratusConnect <span className="text-orange-400">Beta</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Professional aviation platform terminals - full access without authentication for beta testing
          </p>
        </div>

        {/* Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {terminals.map((terminal) => {
            const Icon = terminal.icon;
            return (
              <Card 
                key={terminal.id}
                className={`terminal-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${terminal.color} border ${terminal.borderColor}`}
                onClick={() => navigate(terminal.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">{terminal.title}</CardTitle>
                        <p className="text-slate-300 text-sm mt-1">{terminal.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {terminal.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                          <span className="text-xs text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Button 
                      onClick={() => navigate(terminal.path)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                    >
                      Access {terminal.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Beta Testing Guidelines</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
            <div>
              <h4 className="font-medium text-white mb-2">🔓 No Authentication</h4>
              <p>All terminals accessible without login for testing purposes</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">📊 Sample Data</h4>
              <p>Pre-populated with realistic aviation industry data</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">🚀 Full Features</h4>
              <p>Complete terminal functionality including all workflows</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}