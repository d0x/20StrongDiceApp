import type { DiceZone } from '../types/dice';

export const getZoneName = (zone: DiceZone): string => {
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