import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';

export default function DemoTest() {
  const navigate = useNavigate();

  const demoRoutes = [
    { name: 'Broker Demo', path: '/demo/broker', description: 'FCA compliant trading floor' },
    { name: 'Operator Demo', path: '/demo/operator', description: 'Mission control with KYC verification' },
    { name: 'Pilot Demo', path: '/demo/pilot', description: 'Advanced cockpit with compliance tracking' },
    { name: 'Crew Demo', path: '/demo/crew', description: 'Professional flight deck with data rights' }
  ];

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <StratusConnectLogo className="text-4xl mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Demo Terminal Test</h1>
          <p className="text-muted-foreground">Test access to all demo terminals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoRoutes.map((demo) => (
            <Card key={demo.name} className="terminal-card">
              <CardHeader>
                <CardTitle className="text-foreground">{demo.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{demo.description}</p>
                <Button 
                  onClick={() => navigate(demo.path)}
                  className="w-full btn-terminal-accent"
                >
                  Access {demo.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
