import React from 'react';
import { Dice as DiceType } from '../types/dice';
import { DICE_COLORS } from '../constants/diceColors';

interface DiceProps {
  die: DiceType;
  onClick: (diceId: string, e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDoubleClick: (diceId: string, e: React.MouseEvent) => void;
}

export const Dice: React.FC<DiceProps> = ({
  die,
  onClick,
  onDragStart,
  onDoubleClick,
}) => {
  return (
    <div
      data-dice-id={die.id}
      draggable
      onClick={(e) => onClick(die.id, e)}
      onDragStart={onDragStart}
      onDoubleClick={(e) => onDoubleClick(die.id, e)}
      style={{
        width: '40px',
        height: '40px',
        backgroundColor: DICE_COLORS[die.color],
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
  );
}; 