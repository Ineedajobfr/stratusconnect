import React from 'react';

export const TestDemoBroker: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🚀 NEW DEMO BROKER DASHBOARD - TEST VERSION
      </h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-900 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">This is the NEW layout!</h2>
          <p className="text-blue-200">
            If you can see this, the new demo components are working properly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-green-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">✅ Component Loaded</h3>
            <p className="text-green-200">New demo component is working</p>
          </div>
          
          <div className="bg-purple-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🎯 Routing Fixed</h3>
            <p className="text-purple-200">Demo routes are properly configured</p>
          </div>
          
          <div className="bg-orange-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🚀 Deployment Live</h3>
            <p className="text-orange-200">Fresh deployment successful</p>
          </div>
        </div>
      </div>
    </div>
  );
};
