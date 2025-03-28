import { useState, useEffect } from 'react';
import { DiceState } from '../types/dice';
import { diceManager } from '../services/diceManager';

export const useDiceManager = () => {
  const [state, setState] = useState<DiceState>(diceManager.getState());

  useEffect(() => {
    const handleStateChange = (newState: DiceState) => {
      setState(newState);
    };

    // Abonniere State-Änderungen
    diceManager.subscribe(handleStateChange);

    // Cleanup beim Unmount
    return () => {
      diceManager.unsubscribe(handleStateChange);
    };
  }, []);

  return state;
}; 