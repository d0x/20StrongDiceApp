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
  style?: React.CSSProperties;
}

export const DiceZoneComponent: React.FC<DiceZoneProps> = ({ zone, dice, onDrop, style }) => {
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
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{getZoneName(zone)}</div>
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
              color: 'white',
              fontWeight: 'bold',
              cursor: 'move'
            }}
          >
            {die.value}
          </div>
        ))}
      </div>
    </div>
  );
}; 