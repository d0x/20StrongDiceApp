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
          hidden: true, // Alle Würfel starten verdeckt
          selected: false // Kein Würfel ist initial ausgewählt
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

    // Finde die Würfel, die tatsächlich in eine neue Zone verschoben werden
    const diceToMove = this.state.dice.filter(dice => 
      diceIds.includes(dice.id) && dice.zone !== newZone
    );

    this.state.dice = this.state.dice.map(dice => {
      if (diceIds.includes(dice.id)) {
        return {
          ...dice,
          zone: newZone,
          // Nur Würfel verstecken, die tatsächlich in eine neue Zone verschoben wurden
          hidden: diceToMove.includes(dice) ? !newZone.startsWith('monster') : dice.hidden,
          // Behalte die Auswahl bei
          selected: dice.selected
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
  rerollDiceInZone(zone: DiceZone, selectedDiceIds: string[] = []): void {
    this.state.dice = this.state.dice.map(dice => {
      // Wenn Würfel in der Zone sind und entweder keine Würfel ausgewählt sind oder der Würfel ausgewählt ist
      if (dice.zone === zone && (selectedDiceIds.length === 0 || selectedDiceIds.includes(dice.id))) {
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

  // Alle ausgewählten Würfel in eine neue Zone verschieben
  moveSelectedDice(newZone: DiceZone): void {
    const selectedDiceIds = this.getSelectedDice().map(dice => dice.id);
    if (selectedDiceIds.length > 0) {
      this.moveDiceMultiple(selectedDiceIds, newZone);
      this.clearDiceSelection();
    }
  }
}

export const diceManager = new DiceManager(); 