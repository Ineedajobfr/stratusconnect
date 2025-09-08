import React from 'react';

export const TestComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="text-white text-4xl font-bold">
        🚀 NEW COMPONENT LOADED! 🚀
        <br />
        <span className="text-2xl">This proves the new components are working!</span>
        <br />
        <span className="text-lg">Timestamp: {new Date().toISOString()}</span>
      </div>
    </div>
  );
};
