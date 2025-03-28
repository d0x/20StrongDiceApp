import type { DiceZone } from '../types/dice';
import type { CSSProperties } from 'react';
import { zoneColors, baseColors, baseStyles } from './theme';

export const getZoneStyle = (zone: DiceZone, additionalStyle?: CSSProperties): CSSProperties => {
  const baseStyle: CSSProperties = {
    ...baseStyles,
    backgroundColor: baseColors.background,
    color: baseColors.text,
    ...additionalStyle
  };

  return {
    ...baseStyle,
    backgroundColor: zoneColors[zone]
  };
}; 