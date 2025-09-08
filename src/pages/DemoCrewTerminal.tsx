import React from 'react';

export default function DemoCrewTerminal() {
  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      color: '#00ff00',
      fontSize: '3rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      textAlign: 'center',
      fontWeight: 'bold',
      fontFamily: 'monospace'
    }}>
      <div style={{ marginBottom: '20px' }}>
        🚀 NEW CREW TERMINAL LOADED! 🚀
      </div>
      <div style={{ fontSize: '1.5rem', color: '#ff6600' }}>
        This is the NEW component - deployment working!
      </div>
      <div style={{ fontSize: '1rem', color: '#888', marginTop: '20px' }}>
        Timestamp: {new Date().toISOString()}
      </div>
    </div>
  );
}