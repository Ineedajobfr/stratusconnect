import React from 'react';

// EMERGENCY OVERRIDE - FORCE NEW COMPONENT
export default function DemoCrewTerminal() {
  // Force immediate render
  if (typeof window !== 'undefined') {
    document.title = "NEW CREW TERMINAL - DEPLOYMENT WORKING!";
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ff0000',
      color: '#ffffff',
      fontSize: '4rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      fontWeight: 'bold',
      zIndex: 9999
    }}>
      <div style={{ marginBottom: '30px' }}>
        🚨 EMERGENCY DEPLOYMENT TEST 🚨
      </div>
      <div style={{ fontSize: '2rem', marginBottom: '20px' }}>
        NEW COMPONENT IS LOADING!
      </div>
      <div style={{ fontSize: '1.5rem', color: '#ffff00' }}>
        If you see this, the deployment works!
      </div>
      <div style={{ fontSize: '1rem', color: '#ccc', marginTop: '30px' }}>
        Time: {new Date().toLocaleString()}
      </div>
    </div>
  );
}