import React, { useState } from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { CrewFlightDeck } from '@/components/demo/CrewFlightDeck';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';

export default function DemoCrewTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <>
      <ModernHelpGuide 
        terminalType="crew" 
        activeTab={activeTab} 
        showOnMount={true} 
        isDemo={true}
      />
      <div className="min-h-screen bg-app relative overflow-hidden">
        <StarfieldRunwayBackground />
        <div className="relative z-10">
          <DemoBanner />
          <CrewFlightDeck />
        </div>
      </div>
    </>
  );
}