import React, { useState, useEffect, useCallback } from 'react';
import { DiceZoneComponent } from './DiceZone';
import { DiceWheel } from './DiceWheel';
import { diceManager } from '../services/diceManager';
import { DiceState, DiceZone as DiceZoneType } from '../types/dice';

export const DiceManager: React.FC = () => {
  const [state, setState] = useState<DiceState>(diceManager.getState());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showValueSelector, setShowValueSelector] = useState(false);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Prüfe, ob der Click auf einem Würfel oder in einer Zone war
      const target = e.target as HTMLElement;
      const isDice = target.closest('[data-dice-id]');
      const isZone = target.closest('[data-zone]');
      
      if (!isDice && !isZone) {
        diceManager.clearDiceSelection();
        setState(diceManager.getState());
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleDrop = (diceIds: string[], zone: DiceZoneType) => {
    diceManager.moveDiceMultiple(diceIds, zone);
    diceManager.clearDiceSelection();
    setState(diceManager.getState());
  };

  const handleDiceSelect = (diceId: string) => {
    diceManager.toggleDiceSelection(diceId);
    setState(diceManager.getState());
  };

  const handleExhaust = () => {
    diceManager.exhaustDice();
    diceManager.setActiveMonsterZones(1);
    setState(diceManager.getState());
  };

  const handleReset = () => {
    diceManager.resetGame();
    setState(diceManager.getState());
    setShowResetConfirm(false);
  };

  const handleReroll = (selectedDiceIds: string[], zone: DiceZoneType) => {
    diceManager.rerollDiceInZone(zone, selectedDiceIds);
    setState(diceManager.getState());
  };

  const handleDeleteZone = (monsterNumber: number) => {
    // Verschiebe alle Würfel aus der Monster-Zone in den Pool
    const zoneName = `monster${monsterNumber}` as DiceZoneType;
    const diceInZone = state.dice.filter(d => d.zone === zoneName);
    
    // Erschöpfe die Würfel
    diceManager.moveDiceMultiple(diceInZone.map(d => d.id), 'exhausted');
    
    // Verschiebe die Würfel aus den nachfolgenden Zonen nach oben
    for (let i = monsterNumber; i < state.activeMonsterZones; i++) {
      const currentZone = `monster${i + 1}` as DiceZoneType;
      const nextZone = `monster${i}` as DiceZoneType;
      const diceToMove = state.dice.filter(d => d.zone === currentZone);
      diceManager.moveDiceMultiple(diceToMove.map(d => d.id), nextZone);
    }
    
    // Reduziere die Anzahl der aktiven Monster-Zonen
    if (state.activeMonsterZones > 1) {
      diceManager.setActiveMonsterZones(state.activeMonsterZones - 1);
    }
    
    setState(diceManager.getState());
  };

  const handleIncrementCounter = () => {
    diceManager.incrementRerollCounter();
    setState(diceManager.getState());
  };

  const handleDecrementCounter = () => {
    diceManager.decrementRerollCounter();
    setState(diceManager.getState());
  };

  const handleValueSelect = (value: number) => {
    // Implementation of handleValueSelect
  };

  const handleRandomValue = () => {
    // Implementation of handleRandomValue
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
          dice={state.dice.filter(d => d.zone === 'banished')}
          allDice={state.dice}
          onDrop={handleDrop}
          onDiceSelect={handleDiceSelect}
          style={{ flex: 1 }}
        />
      </div>

      {/* Erschöpft Zone */}
      <div style={{ gridArea: 'exhausted', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DiceZoneComponent
          zone="exhausted"
          dice={state.dice.filter(d => d.zone === 'exhausted')}
          allDice={state.dice}
          onDrop={handleDrop}
          onDiceSelect={handleDiceSelect}
          onReroll={(selectedDiceIds) => handleReroll(selectedDiceIds, 'exhausted')}
          style={{ flex: 1 }}
        />
      </div>

      {/* Würfelpool */}
      <div style={{ gridArea: 'pool', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DiceZoneComponent
          zone="pool"
          dice={state.dice.filter(d => d.zone === 'pool')}
          allDice={state.dice}
          onDrop={handleDrop}
          onDiceSelect={handleDiceSelect}
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
            padding: '8px 16px',
            backgroundColor: '#ffa726',
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
        gap: '10px',
        height: '100%'
      }}>
        {Array.from({ length: state.activeMonsterZones }, (_, i) => (
          <DiceZoneComponent
            key={`monster${i + 1}`}
            zone={`monster${i + 1}` as DiceZoneType}
            dice={state.dice.filter(d => d.zone === `monster${i + 1}`)}
            allDice={state.dice}
            onDrop={handleDrop}
            onDiceSelect={handleDiceSelect}
            onDelete={state.activeMonsterZones > 1 ? () => handleDeleteZone(i + 1) : undefined}
            style={{ flex: 1 }}
          />
        ))}
        {state.activeMonsterZones < 5 && (
          <DiceZoneComponent
            zone="monster1"
            dice={[]}
            allDice={state.dice}
            onDrop={handleDrop}
            onDiceSelect={handleDiceSelect}
            isAddMonsterCard
            onAddMonster={() => {
              diceManager.setActiveMonsterZones(state.activeMonsterZones + 1);
              setState(diceManager.getState());
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
          dice={state.dice.filter(d => d.zone === 'muster')}
          allDice={state.dice}
          onDrop={handleDrop}
          onReroll={(selectedDiceIds) => handleReroll(selectedDiceIds, 'muster')}
          rerollCount={state.rerollCounter}
          onDiceSelect={handleDiceSelect}
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
                  backgroundColor: '#3a3a3a',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Abbrechen
              </button>
              <button 
                onClick={handleReset}
                style={{ 
                  backgroundColor: '#ff4444', 
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}

      {showValueSelector && (
        <DiceWheel
          onSelect={handleValueSelect}
          onRandom={handleRandomValue}
          isOpen={showValueSelector}
          onClose={() => setShowValueSelector(false)}
        />
      )}
    </div>
  );
}; 