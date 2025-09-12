import React from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { CrewFlightDeck } from '@/components/demo/CrewFlightDeck';

export default function DemoCrewTerminal() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <DemoBanner />
      <CrewFlightDeck />
    </div>
  );
}