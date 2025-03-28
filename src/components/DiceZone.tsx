import React, { useState } from 'react';
import { Dice } from '../types/dice';
import type { DiceZone } from '../types/dice';
import { DiceWheel } from './DiceWheel';
import { diceManager } from '../services/diceManager';
import { Dice as DiceComponent } from './Dice';
import { getZoneName } from '../utils/viewUtils';
import { getZoneStyle } from '../utils/styleUtils';
import { useDiceManager } from '../hooks/useDiceManager';
import { buttonStyles } from '../utils/theme';

interface DiceZoneProps {
  zone: DiceZone;
  onDelete?: () => void;
  isAddMonsterCard?: boolean;
  onAddMonster?: () => void;
  onIncrementCounter?: () => void;
  onDecrementCounter?: () => void;
  style?: React.CSSProperties;
  activeMonsterZones?: number;
}

export const DiceZoneComponent: React.FC<DiceZoneProps> = ({ 
  zone, 
  onDelete,
  isAddMonsterCard,
  onAddMonster,
  onIncrementCounter,
  onDecrementCounter,
  style,
  activeMonsterZones = 0
}) => {
  const diceState = useDiceManager();
  const selectedDiceForValue = diceManager.getSelectedDiceForValue();

  const zoneDice = diceState.dice.filter(d => d.zone === zone);
  const allDice = diceState.dice;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const diceIds = e.dataTransfer.getData('diceIds').split(',');
    diceManager.handleDiceDrop(diceIds, zone, isAddMonsterCard, activeMonsterZones);
  };

  const handleDiceClick = (diceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    diceManager.handleDiceClick(diceId);
  };

  const handleDiceDoubleClick = (diceId: string, e: React.MouseEvent) => {
    e.preventDefault();
    diceManager.handleDiceDoubleClick(diceId);
  };

  const handleDragStart = (e: React.DragEvent) => {
    const diceId = e.currentTarget.getAttribute('data-dice-id');
    if (!diceId) return;
    const diceIds = diceManager.handleDiceDragStart(diceId);
    e.dataTransfer.setData('diceIds', diceIds.join(','));
  };

  const handleReroll = () => {
    const selectedDiceIds = diceState.dice.filter(d => d.selected).map(d => d.id);
    diceManager.rerollDiceInZone(zone, selectedDiceIds);
  };

  const handleZoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleValueSelect = (value: number) => {
    diceManager.handleValueSelect(value);
  };

  const handleRandomRoll = () => {
    diceManager.handleRandomRoll();
  };

  return (
    <>
      <div
        data-zone={zone}
        style={getZoneStyle(zone, style)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleZoneClick}
      >
        <div style={{ marginBottom: '5px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{isAddMonsterCard ? 'Neue Monster-Zone' : getZoneName(zone)}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(zone === 'muster' || zone === 'exhausted') && (
              <>
                {zone === 'muster' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      onClick={onDecrementCounter}
                      style={{
                        ...buttonStyles.base,
                        ...buttonStyles.small,
                        ...buttonStyles.danger
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      Würfe: {diceState.rerollCounter}
                    </span>
                    <button
                      onClick={onIncrementCounter}
                      style={{
                        ...buttonStyles.base,
                        ...buttonStyles.small,
                        ...buttonStyles.primary
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
                <button
                  onClick={handleReroll}
                  style={{
                    ...buttonStyles.base,
                    ...buttonStyles.primary
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
                  ...buttonStyles.base,
                  ...buttonStyles.danger
                }}
              >
                🗑️
              </button>
            )}
            {isAddMonsterCard && onAddMonster && (
              <button
                onClick={onAddMonster}
                style={{
                  ...buttonStyles.base,
                  ...buttonStyles.primary
                }}
              >
                +
              </button>
            )}
          </div>
        </div>
        {!isAddMonsterCard && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {zoneDice.map(die => (
              <DiceComponent
                key={die.id}
                die={die}
                onClick={handleDiceClick}
                onDragStart={handleDragStart}
                onDoubleClick={handleDiceDoubleClick}
              />
            ))}
          </div>
        )}
      </div>
      <DiceWheel
        isOpen={!!selectedDiceForValue}
        onClose={() => diceManager.clearSelectedDiceForValue()}
        onSelect={handleValueSelect}
        onRandom={handleRandomRoll}
      />
    </>
  );
}; 