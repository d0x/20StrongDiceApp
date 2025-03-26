import { Dice, DiceState, DiceZone, INITIAL_DICE_COUNTS, MAX_MONSTER_ZONES } from '../types/dice';

class DiceManager {
  private state: DiceState;

  constructor(activeMonsterZones: number = 1) {
    this.state = {
      dice: this.initializeDice(),
      activeMonsterZones: this.validateMonsterZones(activeMonsterZones),
      rerollCounter: 0
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
          zone: 'pool',
          hidden: true // Alle Würfel starten verdeckt
        });
      }
    });

    return dice;
  }

  private rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Mehrere Würfel in eine neue Zone verschieben
  moveDiceMultiple(diceIds: string[], newZone: DiceZone): void {
    // Prüfen ob die Monster-Zone aktiv ist
    if (newZone.startsWith('monster')) {
      const monsterNumber = parseInt(newZone.replace('monster', ''));
      if (monsterNumber > this.state.activeMonsterZones) {
        return; // Monster-Zone ist nicht aktiv
      }
    }

    this.state.dice = this.state.dice.map(dice => {
      if (diceIds.includes(dice.id)) {
        return {
          ...dice,
          zone: newZone,
          hidden: !newZone.startsWith('monster')
        };
      }
      return dice;
    });
  }

  // Bestehende moveDice-Methode bleibt für Einzelwürfel
  moveDice(diceId: string, newZone: DiceZone): void {
    this.moveDiceMultiple([diceId], newZone);
  }

  // Alle Würfel in einer Zone neu würfeln
  rerollDiceInZone(zone: DiceZone): void {
    this.state.dice = this.state.dice.map(dice => {
      if (dice.zone === zone) {
        return {
          ...dice,
          value: this.rollDice(),
          hidden: false // Würfel wird beim Würfeln sichtbar
        };
      }
      return dice;
    });
    
    if (zone === 'muster') {
      this.state.rerollCounter++;
    }
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

  // Würfel aus Aufmarsch und Monster-Zonen erschöpfen
  exhaustDice(): void {
    this.state.dice = this.state.dice.map(dice => {
      if (dice.zone === 'muster' || dice.zone.startsWith('monster')) {
        return {
          ...dice,
          zone: 'exhausted',
          hidden: true // Würfel wird beim Erschöpfen verdeckt
        };
      }
      return dice;
    });
    // Reset des Würfel-Counters beim Erschöpfen
    this.state.rerollCounter = 0;
  }

  // Spiel zurücksetzen
  resetGame(): void {
    this.state = {
      dice: this.initializeDice(), // Alle Würfel starten verdeckt
      activeMonsterZones: 1,
      rerollCounter: 0
    };
  }
}

export const diceManager = new DiceManager(); 