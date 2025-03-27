import React from 'react';
import { Dice } from '../types/dice';
import type { DiceZone } from '../types/dice';

const getZoneName = (zone: DiceZone): string => {
  switch (zone) {
    case 'banished':
      return 'Verbannt';
    case 'exhausted':
      return 'Erschöpft';
    case 'muster':
      return 'Aufmarsch';
    case 'pool':
      return 'Würfelpool';
    case 'monster1':
    case 'monster2':
    case 'monster3':
    case 'monster4':
    case 'monster5':
      return 'Monster';
    default:
      return zone;
  }
};

interface DiceZoneProps {
  zone: DiceZone;
  dice: Dice[];
  allDice: Dice[]; // Alle Würfel im Spiel
  onDrop: (diceIds: string[], zone: DiceZone) => void;
  onReroll?: (selectedDice: string[]) => void;
  rerollCount?: number;
  onDiceSelect?: (diceId: string) => void;
  onDelete?: () => void;
  isAddMonsterCard?: boolean;
  onAddMonster?: () => void;
  onIncrementCounter?: () => void;
  onDecrementCounter?: () => void;
  style?: React.CSSProperties;
}

export const DiceZoneComponent: React.FC<DiceZoneProps> = ({ 
  zone, 
  dice,
  allDice,
  onDrop, 
  onReroll, 
  rerollCount, 
  onDiceSelect,
  onDelete,
  isAddMonsterCard,
  onAddMonster,
  onIncrementCounter,
  onDecrementCounter,
  style 
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const diceIds = e.dataTransfer.getData('diceIds').split(',');
    onDrop(diceIds, zone);
  };

  const handleDiceClick = (diceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onDiceSelect) {
      onDiceSelect(diceId);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    const diceId = e.currentTarget.getAttribute('data-dice-id');
    if (!diceId) return;

    // Verwende alle ausgewählten Würfel aus allen Zonen für den Drag & Drop
    const selectedDiceIds = allDice.filter(d => d.selected).map(d => d.id);
    const currentSelection = selectedDiceIds.length > 0 ? selectedDiceIds : [diceId];
    e.dataTransfer.setData('diceIds', currentSelection.join(','));
  };

  const handleReroll = () => {
    if (onReroll) {
      const selectedDiceIds = dice.filter(d => d.selected).map(d => d.id);
      onReroll(selectedDiceIds);
    }
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      data-zone={zone}
      style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '10px',
        minHeight: '60px',
        backgroundColor: isAddMonsterCard ? '#e8f5e9' : '#f5f5f5',
        ...style
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleZoneClick}
    >
      <div style={{ marginBottom: '5px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{isAddMonsterCard ? 'Neue Monster-Zone' : getZoneName(zone)}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {(zone === 'muster' || zone === 'exhausted') && onReroll && (
            <>
              {zone === 'muster' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <button
                    onClick={onDecrementCounter}
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Würfe: {rerollCount || 0}
                  </span>
                  <button
                    onClick={onIncrementCounter}
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    +
                  </button>
                </div>
              )}
              <button
                onClick={handleReroll}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Neu Würfeln
              </button>
            </>
          )}
          {zone.startsWith('monster') && onDelete && (
            <button
              onClick={onDelete}
              style={{
                padding: '4px 8px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🗑️
            </button>
          )}
          {isAddMonsterCard && onAddMonster && (
            <button
              onClick={onAddMonster}
              style={{
                padding: '4px 8px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              +
            </button>
          )}
        </div>
      </div>
      {!isAddMonsterCard && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {dice.map(die => (
            <div
              key={die.id}
              data-dice-id={die.id}
              draggable
              onClick={(e) => handleDiceClick(die.id, e)}
              onDragStart={handleDragStart}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: die.color,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: die.hidden ? 'transparent' : 'white',
                fontWeight: 'bold',
                cursor: 'move',
                position: 'relative',
                outline: die.selected ? '3px solid #4CAF50' : 'none',
              }}
            >
              {die.value}
              {die.hidden && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '50%'
                }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 