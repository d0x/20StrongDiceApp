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

  const handleDrop = (diceId: string, zone: DiceZoneType) => {
    diceManager.moveDice(diceId, zone);
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

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header - Verbannt Zone */}
      <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <DiceZoneComponent
          zone="banished"
          dice={state.dice.filter(d => d.zone === 'banished')}
          onDrop={handleDrop}
          style={{ width: '100%', minHeight: '60px' }}
        />
      </div>

      {/* Scrollbarer Content */}
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Mittlerer Bereich - Erschöpft links, Pool rechts */}
        <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
          <DiceZoneComponent
            zone="exhausted"
            dice={state.dice.filter(d => d.zone === 'exhausted')}
            onDrop={handleDrop}
            style={{ width: '200px' }}
          />
          <DiceZoneComponent
            zone="pool"
            dice={state.dice.filter(d => d.zone === 'pool')}
            onDrop={handleDrop}
            style={{ flex: 1 }}
          />
        </div>

        {/* Unterer Bereich - Monster links, Aufmarsch rechts */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Monster Zonen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '200px' }}>
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
          <DiceZoneComponent
            zone="muster"
            dice={state.dice.filter(d => d.zone === 'muster')}
            onDrop={handleDrop}
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* Footer - Kontrollen */}
      <div style={{ 
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #ccc'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExhaust}>Erschöpfen</button>
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