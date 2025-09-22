import React, { useState } from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { DemoPilotDashboard } from '@/components/demo/DemoPilotDashboard';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export default function DemoPilotTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  return (
    <>
      {showHelpGuide && (
        <ModernHelpGuide 
          terminalType="pilot" 
          activeTab={activeTab} 
          showOnMount={false} 
          isDemo={true}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
      <div className="min-h-screen bg-app relative overflow-hidden">
        <StarfieldRunwayBackground />
        <div className="relative z-10">
          <DemoBanner />
          <DemoPilotDashboard />
          
          {/* Help Guide Button */}
          <Button
            onClick={() => setShowHelpGuide(true)}
            className="fixed top-4 right-4 z-50 w-12 h-12 bg-accent/20 hover:bg-accent/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-accent/30"
            title="Help Guide"
          >
            <HelpCircle className="w-6 h-6 text-white" />
          </Button>
          
          {/* StratusConnect Logo */}
              <div className="fixed top-4 left-4 z-50">
                <StratusConnectLogo className="text-white text-2xl" />
              </div>
        </div>
      </div>
    </>
  );
}