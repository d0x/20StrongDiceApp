import React, { useState, useEffect } from 'react';
import { DiceZoneComponent } from './DiceZone';
import { diceManager } from '../services/diceManager';
import { DiceState, DiceZone as DiceZoneType } from '../types/dice';

export const DiceManager: React.FC = () => {
  const [state, setState] = useState<DiceState>(diceManager.getState());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    // Hier können wir später Event-Listener für State-Änderungen hinzufügen
  }, []);

  const handleDrop = (diceIds: string[], zone: DiceZoneType) => {
    diceManager.moveDiceMultiple(diceIds, zone);
    setState(diceManager.getState());
  };

  const handleExhaust = () => {
    diceManager.exhaustDice();
    setState(diceManager.getState());
  };

  const handleReset = () => {
    diceManager.resetGame();
    setState(diceManager.getState());
    setShowResetConfirm(false);
  };

  const handleReroll = (selectedDiceIds: string[]) => {
    diceManager.rerollDiceInZone('muster', selectedDiceIds);
    setState(diceManager.getState());
  };

  return (
    <div style={{ 
      height: '100vh',
      display: 'grid',
      gridTemplateAreas: `
        "banished banished"
        "exhausted pool"
        "exhaust-button pool"
        "monsters muster"
      `,
      gridTemplateRows: 'auto auto auto 1fr',
      gridTemplateColumns: '200px 1fr',
      gap: '10px',
      padding: '10px',
      overflow: 'hidden'
    }}>
      {/* Verbannt Zone */}
      <div style={{ gridArea: 'banished' }}>
        <DiceZoneComponent
          zone="banished"
          dice={state.dice.filter(d => d.zone === 'banished')}
          onDrop={handleDrop}
        />
      </div>

      {/* Erschöpft Zone */}
      <div style={{ gridArea: 'exhausted' }}>
        <DiceZoneComponent
          zone="exhausted"
          dice={state.dice.filter(d => d.zone === 'exhausted')}
          onDrop={handleDrop}
        />
      </div>

      {/* Würfelpool */}
      <div style={{ gridArea: 'pool' }}>
        <DiceZoneComponent
          zone="pool"
          dice={state.dice.filter(d => d.zone === 'pool')}
          onDrop={handleDrop}
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
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
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
        gap: '10px'
      }}>
        {Array.from({ length: state.activeMonsterZones }, (_, i) => (
          <DiceZoneComponent
            key={`monster${i + 1}`}
            zone={`monster${i + 1}` as DiceZoneType}
            dice={state.dice.filter(d => d.zone === `monster${i + 1}`)}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Aufmarsch Zone */}
      <div style={{ 
        gridArea: 'muster',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <DiceZoneComponent
          zone="muster"
          dice={state.dice.filter(d => d.zone === 'muster')}
          onDrop={handleDrop}
          onReroll={handleReroll}
          rerollCount={state.rerollCounter}
        />
      </div>

      {/* Footer - Kontrollen */}
      <div style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #ccc',
        display: 'flex',
        gap: '10px'
      }}>
        <button onClick={() => {
          diceManager.setActiveMonsterZones(state.activeMonsterZones + 1);
          setState(diceManager.getState());
        }}>+ Monster</button>
        <button onClick={() => {
          diceManager.setActiveMonsterZones(state.activeMonsterZones - 1);
          setState(diceManager.getState());
        }}>- Monster</button>
        <button 
          onClick={() => setShowResetConfirm(true)}
          style={{ marginLeft: 'auto', backgroundColor: '#ff4444', color: 'white' }}
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
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginTop: 0 }}>Spiel zurücksetzen?</h3>
            <p>Möchten Sie das Spiel wirklich zurücksetzen? Alle Würfel werden in den Pool zurückgelegt und die Monster-Zonen auf 1 zurückgesetzt.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowResetConfirm(false)}>Abbrechen</button>
              <button 
                onClick={handleReset}
                style={{ backgroundColor: '#ff4444', color: 'white' }}
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