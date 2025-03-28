import React, { useState, useEffect } from 'react';
import { DiceZoneComponent } from './DiceZone';
import { diceManager } from '../services/diceManager';
import { DiceZone as DiceZoneType } from '../types/dice';
import { useDiceManager } from '../hooks/useDiceManager';
import { buttonStyles } from '../utils/theme';

export const GameTable: React.FC = () => {
  const state = useDiceManager();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Prüfe, ob der Click auf einem Würfel oder in einer Zone war
      const target = e.target as HTMLElement;
      const isDice = target.closest('[data-dice-id]');
      const isZone = target.closest('[data-zone]');
      
      if (!isDice && !isZone) {
        diceManager.clearDiceSelection();
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleExhaust = () => {
    diceManager.exhaustDice();
    diceManager.setActiveMonsterZones(1);
  };

  const handleReset = () => {
    diceManager.resetGame();
    setShowResetConfirm(false);
  };

  const handleIncrementCounter = () => {
    diceManager.incrementRerollCounter();
  };

  const handleDecrementCounter = () => {
    diceManager.decrementRerollCounter();
  };

  return (
    <div 
      style={{ 
        height: '100vh',
        margin: 0,
        display: 'grid',
        gridTemplateAreas: `
          "banished banished"
          "exhausted pool"
          "exhaust-button pool"
          "monsters muster"
          "footer footer"
        `,
        gridTemplateRows: 'auto auto auto 1fr auto',
        gridTemplateColumns: '200px 1fr',
        gap: '10px',
        padding: '10px',
        overflow: 'hidden'
      }}
    >
      {/* Verbannt Zone */}
      <div style={{ gridArea: 'banished', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DiceZoneComponent
          zone="banished"
          style={{ flex: 1 }}
        />
      </div>

      {/* Erschöpft Zone */}
      <div style={{ gridArea: 'exhausted', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DiceZoneComponent
          zone="exhausted"
          style={{ flex: 1 }}
        />
      </div>

      {/* Würfelpool */}
      <div style={{ gridArea: 'pool', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DiceZoneComponent
          zone="pool"
          style={{ flex: 1 }}
        />
      </div>

      {/* Erschöpfen Button */}
      <div style={{ 
        gridArea: 'exhaust-button',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button 
          onClick={handleExhaust}
          style={{
            ...buttonStyles.base,
            ...buttonStyles.warning,
            fontSize: '14px'
          }}
        >
          Erschöpfen
        </button>
      </div>

      {/* Monster Zonen */}
      <div style={{ 
        gridArea: 'monsters',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100%'
      }}>
        {Array.from({ length: state.activeMonsterZones }, (_, i) => (
          <DiceZoneComponent
            key={`monster${i + 1}`}
            zone={`monster${i + 1}` as DiceZoneType}
            onDelete={state.activeMonsterZones > 1 ? () => diceManager.handleDeleteZone(i + 1) : undefined}
            style={{ flex: 1 }}
          />
        ))}
        {state.activeMonsterZones < 5 && (
          <DiceZoneComponent
            zone="monster1"
            isAddMonsterCard
            onAddMonster={() => {
              diceManager.setActiveMonsterZones(state.activeMonsterZones + 1);
            }}
            activeMonsterZones={state.activeMonsterZones}
            style={{ flex: 1 }}
          />
        )}
      </div>

      {/* Aufmarsch Zone */}
      <div style={{ 
        gridArea: 'muster',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100%'
      }}>
        <DiceZoneComponent
          zone="muster"
          onIncrementCounter={handleIncrementCounter}
          onDecrementCounter={handleDecrementCounter}
          style={{ flex: 1 }}
        />
      </div>

      {/* Footer - Kontrollen */}
      <div style={{ 
        gridArea: 'footer',
        padding: '10px',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setShowResetConfirm(true)}
          style={{ 
            marginLeft: 'auto',
            ...buttonStyles.base,
            ...buttonStyles.danger
          }}
        >
          Spiel zurücksetzen
        </button>
      </div>

      {/* Bestätigungsdialog */}
      {showResetConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            color: '#fff'
          }}>
            <h3 style={{ marginTop: 0 }}>Spiel zurücksetzen?</h3>
            <p>Möchten Sie das Spiel wirklich zurücksetzen? Alle Würfel werden in den Pool zurückgelegt und die Monster-Zonen auf 1 zurückgesetzt.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowResetConfirm(false)}
                style={{
                  ...buttonStyles.base,
                  backgroundColor: '#3a3a3a'
                }}
              >
                Abbrechen
              </button>
              <button 
                onClick={handleReset}
                style={{ 
                  ...buttonStyles.base,
                  ...buttonStyles.danger
                }}
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 