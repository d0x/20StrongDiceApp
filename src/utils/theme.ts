import type { DiceZone } from '../types/dice';

export const zoneColors: Record<DiceZone, string> = {
  muster: '#1b2a1b',
  exhausted: '#2a1f1b',
  banished: '#2a1b1b',
  pool: '#1b1f2a',
  monster1: '#2a1b2a',
  monster2: '#2a1b2a',
  monster3: '#2a1b2a',
  monster4: '#2a1b2a',
  monster5: '#2a1b2a'
};

export const baseColors = {
  background: '#1a1a1a',
  text: '#fff',
  border: '#444',
  button: {
    primary: '#4CAF50',
    danger: '#ff4444',
    warning: '#ffa726'
  }
};

export const baseStyles = {
  border: '1px solid #444',
  borderRadius: '4px',
  padding: '10px',
  minHeight: '100px'
};

export const buttonStyles = {
  base: {
    padding: '4px 8px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  small: {
    padding: '2px 6px',
    fontSize: '12px'
  },
  primary: {
    backgroundColor: baseColors.button.primary
  },
  danger: {
    backgroundColor: baseColors.button.danger
  },
  warning: {
    backgroundColor: baseColors.button.warning
  }
}; 