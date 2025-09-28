import React from 'react';

export default function BetaTest() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Beta Test Page</h1>
      <p>This is a simple test page to verify the beta routing works.</p>
      <div className="mt-4">
        <a href="/beta/broker" className="text-blue-400 hover:underline mr-4">Broker Terminal</a>
        <a href="/beta/operator" className="text-blue-400 hover:underline">Operator Terminal</a>
      </div>
    </div>
  );
}
