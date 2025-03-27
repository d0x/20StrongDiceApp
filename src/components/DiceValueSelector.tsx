import React from 'react';

interface DiceValueSelectorProps {
  onSelect: (value: number) => void;
  onRandom: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DiceValueSelector: React.FC<DiceValueSelectorProps> = ({
  onSelect,
  onRandom,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const values = [1, 2, 3, 4, 5, 6];
  const positions = [
    { top: '0%', left: '50%', transform: 'translateX(-50%)' }, // 12 Uhr
    { top: '25%', left: '75%', transform: 'translate(-50%, -50%)' }, // 2 Uhr
    { top: '50%', left: '75%', transform: 'translate(-50%, -50%)' }, // 4 Uhr
    { top: '75%', left: '50%', transform: 'translateX(-50%)' }, // 6 Uhr
    { top: '50%', left: '25%', transform: 'translate(-50%, -50%)' }, // 8 Uhr
    { top: '25%', left: '25%', transform: 'translate(-50%, -50%)' }, // 10 Uhr
  ];

  return (
    <div
      style={{
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
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          backgroundColor: 'white',
          borderRadius: '50%',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {values.map((value, index) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...positions[index]
            }}
          >
            {value}
          </button>
        ))}
        <button
          onClick={onRandom}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🎲
        </button>
      </div>
    </div>
  );
}; 