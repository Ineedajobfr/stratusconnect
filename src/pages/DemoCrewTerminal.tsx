import React, { useState } from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { CrewFlightDeck } from '@/components/demo/CrewFlightDeck';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { HelpCircle } from 'lucide-react';

export default function DemoCrewTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  return (
    <>
      {showHelpGuide && (
        <ModernHelpGuide 
          terminalType="crew" 
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
          <CrewFlightDeck />
          
          {/* Help Guide Button */}
          <button
            onClick={() => setShowHelpGuide(true)}
            className="fixed top-4 right-4 z-50 w-12 h-12 bg-accent/20 hover:bg-accent/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-accent/30"
            title="Help Guide"
          >
            <HelpCircle className="w-6 h-6 text-white" />
          </button>
          
          {/* StratusConnect Logo */}
          <div className="fixed top-4 left-4 z-50">
            <StratusConnectLogo className="text-white" />
          </div>
        </div>
      </div>
    </>
  );
}