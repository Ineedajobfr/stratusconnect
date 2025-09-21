import React, { useState } from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { DemoPilotDashboard } from '@/components/demo/DemoPilotDashboard';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';

export default function DemoPilotTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <>
      <ModernHelpGuide 
        terminalType="pilot" 
        activeTab={activeTab} 
        showOnMount={true} 
        isDemo={true}
      />
      <div className="min-h-screen bg-app relative overflow-hidden">
        <StarfieldRunwayBackground />
        <div className="relative z-10">
          <DemoBanner />
          <DemoPilotDashboard />
        </div>
      </div>
    </>
  );
}