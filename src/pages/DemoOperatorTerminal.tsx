import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import { useNavigate } from 'react-router-dom';

export default function DemoOperatorTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  return (
    <>
      <ModernHelpGuide 
        terminalType="operator" 
        activeTab={activeTab} 
        showOnMount={true} 
        isDemo={true}
      />
      <div className="min-h-screen bg-app relative overflow-hidden">
        <StarfieldRunwayBackground />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Operator Terminal</h1>
              <p className="text-gray-300 mb-8">Demo version - All features simulated</p>
              
              <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Demo Mode Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    This is a demonstration of the Operator Terminal. All data is simulated and no real transactions will occur.
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Return to Home
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}