import React, { useState } from 'react';

interface User {
  name?: string;
  address?: {
    street?: string;
    city?: string;
  };
  preferences?: {
    theme?: string;
  };
}

const App: React.FC = () => {
  const [user] = useState<User>({
    name: 'Max Mustermann',
    address: {
      street: 'Hauptstraße 1',
      city: 'Berlin'
    }
  });

  // Beispiel für optional chaining
  const streetName = user?.address?.street || 'Keine Adresse angegeben';
  const theme = user?.preferences?.theme || 'Standard-Theme';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Optional Chaining Demo</h1>
      <div>
        <p>Name: {user?.name || 'Nicht angegeben'}</p>
        <p>Straße: {streetName}</p>
        <p>Stadt: {user?.address?.city || 'Nicht angegeben'}</p>
        <p>Theme: {theme}</p>
      </div>
    </div>
  );
};

export default App; 