import React from 'react';

export default function DemoCrewTerminal() {
  return (
    <div style={{
      backgroundColor: 'red',
      color: 'white',
      fontSize: '4rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      textAlign: 'center',
      fontWeight: 'bold'
    }}>
      🚨 EMERGENCY TEST - NEW COMPONENT LOADED! 🚨
      <br />
      <div style={{ fontSize: '2rem', marginTop: '20px' }}>
        If you see this, the deployment is working!
      </div>
    </div>
  );
}