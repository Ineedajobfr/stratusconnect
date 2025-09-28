import React from 'react';

export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>
        <h1>StratusConnect Test</h1>
        <p>If you can see this, React is working!</p>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
