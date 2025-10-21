// Role Selection Page - First step in Magic Link Authentication
// Users select their role before proceeding to signup

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Briefcase, Building2, Plane, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'broker',
      title: 'Broker',
      description: 'Connect clients with operators and manage aviation deals',
      icon: Building2,
      // Rich mahogany with burnished gold - like aged whiskey and luxury wood
      primaryColor: 'rgba(101, 67, 33, 0.95)', // Deep mahogany
      secondaryColor: 'rgba(212, 175, 55, 0.85)', // Burnished gold
      accentColor: 'rgba(255, 215, 0, 0.7)', // Bright gold
      iconColor: 'text-amber-200',
      titleColor: 'text-amber-100',
      descriptionColor: 'text-amber-50/90',
      buttonStyle: 'bg-gradient-to-r from-amber-900 via-yellow-900 to-amber-800 hover:from-amber-800 hover:via-yellow-800 hover:to-amber-700 text-amber-100 border-amber-600/60',
      glowColor: 'rgba(212, 175, 55, 0.4)'
    },
    {
      id: 'operator',
      title: 'Operator',
      description: 'Manage your fleet and respond to broker requests',
      icon: Plane,
      // Deep obsidian with copper highlights - like polished metal and dark wood
      primaryColor: 'rgba(15, 15, 15, 0.98)', // Obsidian black
      secondaryColor: 'rgba(184, 115, 51, 0.8)', // Rich copper
      accentColor: 'rgba(205, 127, 50, 0.7)', // Bright copper
      iconColor: 'text-copper-200',
      titleColor: 'text-copper-100',
      descriptionColor: 'text-copper-50/90',
      buttonStyle: 'bg-gradient-to-r from-gray-900 via-copper-900 to-gray-800 hover:from-gray-800 hover:via-copper-800 hover:to-gray-700 text-copper-100 border-copper-600/60',
      glowColor: 'rgba(184, 115, 51, 0.4)'
    },
    {
      id: 'pilot',
      title: 'Pilot',
      description: 'Find flying opportunities and manage your career',
      icon: Users,
      // Deep burgundy with brass accents - like aged leather and brass fittings
      primaryColor: 'rgba(80, 20, 20, 0.95)', // Deep burgundy
      secondaryColor: 'rgba(181, 166, 66, 0.85)', // Antique brass
      accentColor: 'rgba(205, 149, 12, 0.7)', // Bright brass
      iconColor: 'text-brass-200',
      titleColor: 'text-brass-100',
      descriptionColor: 'text-brass-50/90',
      buttonStyle: 'bg-gradient-to-r from-red-900 via-yellow-800 to-red-800 hover:from-red-800 hover:via-yellow-700 hover:to-red-700 text-brass-100 border-brass-600/60',
      glowColor: 'rgba(181, 166, 66, 0.4)'
    },
    {
      id: 'crew',
      title: 'Crew',
      description: 'Find cabin crew opportunities and manage assignments',
      icon: Briefcase,
      // Rich cognac with platinum highlights - like luxury spirits and precious metals
      primaryColor: 'rgba(139, 69, 19, 0.95)', // Rich cognac
      secondaryColor: 'rgba(229, 228, 226, 0.85)', // Platinum silver
      accentColor: 'rgba(255, 255, 255, 0.8)', // Bright platinum
      iconColor: 'text-platinum-200',
      titleColor: 'text-platinum-100',
      descriptionColor: 'text-platinum-50/90',
      buttonStyle: 'bg-gradient-to-r from-orange-900 via-gray-800 to-orange-800 hover:from-orange-800 hover:via-gray-700 hover:to-orange-700 text-platinum-100 border-platinum-600/60',
      glowColor: 'rgba(229, 228, 226, 0.4)'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    navigate(`/signup-form?role=${roleId}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Burnt Orange to Obsidian Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      
      {/* Cinematic Vignette - Creates spotlight effect on center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
      
      {/* Subtle golden-orange glow in the center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
        }}
      />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-orange-500/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div 
              className="text-white text-lg font-bold bg-black/50 px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
              style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
              onClick={() => navigate('/')}
            >
              STRATUSCONNECT
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Choose Your Role</h1>
              <p className="text-orange-300/80">Select your professional role to get started</p>
            </div>
          </div>
          <Button
            onClick={() => {
              // Check if user is authenticated to determine where to navigate
              const isAuthenticated = localStorage.getItem('testUser') || document.cookie.includes('supabase');
              if (isAuthenticated) {
                navigate('/home');
              } else {
                navigate('/');
              }
            }}
            variant="outline"
            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(255, 140, 0, 0.5)' }}>
            JOIN THE SYSTEM
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Select your professional role to begin your secure onboarding process.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.id}
                className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => handleRoleSelect(role.id)}
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 140, 0, 0.2), 0 0 20px rgba(255, 140, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-800/20 rounded-xl">
                      <IconComponent className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{role.title} Terminal</CardTitle>
                      <CardDescription className="text-white/80">{role.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="mt-12 text-center">
          <div className="bg-black/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 max-w-2xl mx-auto relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-green-400/50"
               style={{
                 boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(34, 197, 94, 0.2)',
               }}
               onClick={() => navigate('/')}
          >
            <h3 className="text-lg font-semibold text-green-400 mb-2" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}>Secure Authentication</h3>
            <p className="text-green-200/90 text-sm">
              We use passwordless authentication with magic links for enhanced security. 
              No passwords to remember, no security risks to worry about.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
