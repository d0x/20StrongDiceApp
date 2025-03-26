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
      return `Monster ${zone.replace('monster', '')}`;
    default:
      return zone;
  }
};

interface DiceZoneProps {
  zone: DiceZone;
  dice: Dice[];
  onDrop: (diceId: string, zone: DiceZone) => void;
  onReroll?: () => void;
  rerollCount?: number;
  style?: React.CSSProperties;
}

export const DiceZoneComponent: React.FC<DiceZoneProps> = ({ zone, dice, onDrop, onReroll, rerollCount, style }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const diceId = e.dataTransfer.getData('diceId');
    onDrop(diceId, zone);
  };

  return (
    <div
      style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '10px',
        minHeight: '60px',
        backgroundColor: '#f5f5f5',
        ...style
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div style={{ marginBottom: '5px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{getZoneName(zone)}</span>
        {zone === 'muster' && onReroll && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Würfe: {rerollCount || 0}
            </span>
            <button
              onClick={onReroll}
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
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {dice.map(die => (
          <div
            key={die.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('diceId', die.id)}
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
              position: 'relative'
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
    </div>
  );
}; 