import React from 'react';
import { DiceManager } from './components/DiceManager';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <div style={{ 
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f0f0'
    }}>
      <DiceManager />
    </div>
  );
};

export default App; 