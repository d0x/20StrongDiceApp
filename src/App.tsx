import React from 'react';
import { GameTable } from './components/GameTable';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <div style={{ 
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#1e1e1e'
    }}>
      <GameTable />
    </div>
  );
};

export default App; 