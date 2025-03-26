import { Dice, DiceState, DiceZone, INITIAL_DICE_COUNTS, MAX_MONSTER_ZONES } from '../types/dice';

class DiceManager {
  private state: DiceState;

  constructor(activeMonsterZones: number = 1) {
    this.state = {
      dice: this.initializeDice(),
      activeMonsterZones: this.validateMonsterZones(activeMonsterZones)
    };
  }

  private validateMonsterZones(count: number): number {
    return Math.max(1, Math.min(MAX_MONSTER_ZONES, count));
  }

  private initializeDice(): Dice[] {
    const dice: Dice[] = [];
    let idCounter = 0;

    Object.entries(INITIAL_DICE_COUNTS).forEach(([color, count]) => {
      for (let i = 0; i < count; i++) {
        dice.push({
          id: `dice-${idCounter++}`,
          color: color as Dice['color'],
          value: this.rollDice(),
          zone: 'pool'
        });
      }
    });

    return dice;
  }

  private rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Würfel in eine neue Zone verschieben
  moveDice(diceId: string, newZone: DiceZone): void {
    // Prüfen ob die Monster-Zone aktiv ist
    if (newZone.startsWith('monster')) {
      const monsterNumber = parseInt(newZone.replace('monster', ''));
      if (monsterNumber > this.state.activeMonsterZones) {
        return; // Monster-Zone ist nicht aktiv
      }
    }

    const diceIndex = this.state.dice.findIndex(d => d.id === diceId);
    if (diceIndex === -1) return;

    this.state.dice[diceIndex] = {
      ...this.state.dice[diceIndex],
      zone: newZone
    };
  }

  // Alle Würfel in einer Zone neu würfeln
  rerollDiceInZone(zone: DiceZone): void {
    this.state.dice = this.state.dice.map(dice => {
      if (dice.zone === zone) {
        return {
          ...dice,
          value: this.rollDice()
        };
      }
      return dice;
    });
  }

  // Würfel nach Farbe filtern
  getDiceByColor(color: Dice['color']): Dice[] {
    return this.state.dice.filter(dice => dice.color === color);
  }

  // Würfel nach Zone filtern
  getDiceByZone(zone: DiceZone): Dice[] {
    return this.state.dice.filter(dice => dice.zone === zone);
  }

  // Alle Würfel in Monster-Zonen
  getMonsterDice(): Dice[] {
    return this.state.dice.filter(dice => 
      dice.zone.startsWith('monster')
    );
  }

  // Aktuellen State abrufen
  getState(): DiceState {
    return { ...this.state };
  }

  // Anzahl der aktiven Monster-Zonen ändern
  setActiveMonsterZones(count: number): void {
    this.state.activeMonsterZones = this.validateMonsterZones(count);
  }

  // Würfel zurücksetzen
  resetDice(): void {
    this.state.dice = this.initializeDice();
  }

  // Prüfen ob eine Monster-Zone aktiv ist
  isMonsterZoneActive(zone: DiceZone): boolean {
    if (!zone.startsWith('monster')) return false;
    const monsterNumber = parseInt(zone.replace('monster', ''));
    return monsterNumber <= this.state.activeMonsterZones;
  }

  // Würfel aus Aufmarsch und Monster-Zonen erschöpfen
  exhaustDice(): void {
    this.state.dice = this.state.dice.map(dice => {
      if (dice.zone === 'muster' || dice.zone.startsWith('monster')) {
        return {
          ...dice,
          zone: 'exhausted'
        };
      }
      return dice;
    });
  }
}

export const diceManager = new DiceManager(); 