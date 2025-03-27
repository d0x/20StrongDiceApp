import { Dice, DiceState, DiceZone, INITIAL_DICE_COUNTS, MAX_MONSTER_ZONES } from '../types/dice';

class DiceManager {
  private state: DiceState;
  private listeners: ((state: DiceState) => void)[] = [];

  constructor(activeMonsterZones: number = 1) {
    this.state = {
      dice: this.initializeDice(),
      activeMonsterZones: this.validateMonsterZones(activeMonsterZones),
      rerollCounter: 0
    };
  }

  decrementRerollCounter(): void {
    this.state.rerollCounter = Math.max(0, this.state.rerollCounter - 1);
  }

  incrementRerollCounter(): void {
    this.state.rerollCounter++;
  }
  

  private validateMonsterZones(count: number): number {
    return Math.max(1, Math.min(MAX_MONSTER_ZONES, count));
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  private rollDiceValue(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  private initializeDice(): Dice[] {
    const dice: Dice[] = [];
    let idCounter = 0;

    Object.entries(INITIAL_DICE_COUNTS).forEach(([color, count]) => {
      for (let i = 0; i < count; i++) {
        dice.push({
          id: `dice-${idCounter++}`,
          color: color as Dice['color'],
          value: this.rollDiceValue(),
          zone: 'pool',
          hidden: true,
          selected: false
        });
      }
    });

    return dice;
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
          hidden: newZone === 'pool' ? true : dice.hidden,
          // Behalte die Auswahl bei
          selected: dice.selected
        };
      }
      return dice;
    });
  }

  public rerollDiceInZone(zone: DiceZone, selectedDiceIds: string[] = []): void {
    this.state.dice = this.state.dice.map(dice => {
      if (dice.zone === zone && (selectedDiceIds.length === 0 || selectedDiceIds.includes(dice.id))) {
        return {
          ...dice,
          value: this.rollDiceValue(),
          hidden: false
        };
      }
      return dice;
    });
    
    if (zone === 'muster') {
      this.state.rerollCounter++;
    }
    this.notifyListeners();
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
          zone: 'exhausted'
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

  // Würfel auswählen/abwählen
  toggleDiceSelection(diceId: string): void {
    this.state.dice = this.state.dice.map(dice => {
      if (dice.id === diceId) {
        return {
          ...dice,
          selected: !dice.selected
        };
      }
      return dice;
    });
  }

  // Alle Würfel abwählen
  clearDiceSelection(): void {
    this.state.dice = this.state.dice.map(dice => ({
      ...dice,
      selected: false
    }));
  }

  // Alle ausgewählten Würfel abrufen
  getSelectedDice(): Dice[] {
    return this.state.dice.filter(dice => dice.selected);
  }

  public setDiceValue(diceId: string, value: number): void {
    const dice = this.state.dice.find(d => d.id === diceId);
    if (dice) {
      dice.value = value;
      dice.hidden = false;
      this.notifyListeners();
    }
  }

  public rollDice(diceId: string): void {
    const dice = this.state.dice.find(d => d.id === diceId);
    if (dice) {
      dice.value = this.rollDiceValue();
      dice.hidden = false;
      this.notifyListeners();
    }
  }
}

export const diceManager = new DiceManager(); 