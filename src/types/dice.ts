export type DiceColor = 'yellow' | 'green' | 'blue' | 'purple' | 'red';

export type DiceZone = 'banished' | 'exhausted' | 'muster' | 'pool' | 'monster1' | 'monster2' | 'monster3' | 'monster4' | 'monster5';

export interface Dice {
  id: string;
  color: DiceColor;
  value: number;
  zone: DiceZone;
  hidden: boolean; // Würfel ist verdeckt, bis er neu gewürfelt wird
}

export interface DiceState {
  dice: Dice[];
  activeMonsterZones: number; // Anzahl der aktiven Monster-Zonen (1-5)
  rerollCounter: number; // Anzahl der Würfe in der Aufmarsch-Zone
}

export const INITIAL_DICE_COUNTS: Record<DiceColor, number> = {
  yellow: 4,
  green: 4,
  blue: 4,
  purple: 4,
  red: 1
};

export const MAX_MONSTER_ZONES = 5; 