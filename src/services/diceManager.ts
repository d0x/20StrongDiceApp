import { Dice, DiceState, DiceZone, INITIAL_DICE_COUNTS, MAX_MONSTER_ZONES } from '../types/dice';

class DiceManager {
  private state: DiceState;
  private listeners: ((state: DiceState) => void)[] = [];
  private selectedDiceForValue: string | null = null;

  constructor(activeMonsterZones: number = 1) {
    this.state = {
      dice: this.initializeDice(),
      activeMonsterZones: this.validateMonsterZones(activeMonsterZones),
      rerollCounter: 0
    };
  }

  public subscribe(listener: (state: DiceState) => void): void {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: (state: DiceState) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  decrementRerollCounter(): void {
    this.state.rerollCounter = Math.max(0, this.state.rerollCounter - 1);
    this.notifyListeners();
  }

  incrementRerollCounter(): void {
    this.state.rerollCounter++;
    this.notifyListeners();
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
    this.notifyListeners();
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

    // Alle Auswahlen aufheben
    this.clearDiceSelection();
    this.notifyListeners();
  }

  // Aktuellen State abrufen
  getState(): DiceState {
    return { ...this.state };
  }

  // Anzahl der aktiven Monster-Zonen ändern
  setActiveMonsterZones(count: number): void {
    this.state.activeMonsterZones = this.validateMonsterZones(count);
    this.notifyListeners();
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
    this.notifyListeners();
  }

  // Spiel zurücksetzen
  resetGame(): void {
    this.state = {
      dice: this.initializeDice(), // Alle Würfel starten verdeckt
      activeMonsterZones: 1,
      rerollCounter: 0
    };
    this.notifyListeners();
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
    this.notifyListeners();
  }

  // Alle Würfel abwählen
  clearDiceSelection(): void {
    this.state.dice = this.state.dice.map(dice => ({
      ...dice,
      selected: false
    }));
    this.notifyListeners();
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

  // Drag & Drop Logik
  public handleDiceDrop(diceIds: string[], targetZone: DiceZone, isAddMonsterCard: boolean = false, activeMonsterZones: number = 0): void {
    if (isAddMonsterCard) {
      const newZone = `monster${activeMonsterZones + 1}` as DiceZone;
      // Aktiviere zuerst die neue Monster-Zone
      this.setActiveMonsterZones(activeMonsterZones + 1);
      // Dann verschiebe die Würfel
      this.moveDiceMultiple(diceIds, newZone);
    } else {
      this.moveDiceMultiple(diceIds, targetZone);
    }
    // Deselektiere alle Würfel nach dem Verschieben
    this.clearDiceSelection();
  }

  public handleDiceDragStart(diceId: string): string[] {
    const selectedDiceIds = this.state.dice.filter(d => d.selected).map(d => d.id);
    return selectedDiceIds.length > 0 ? selectedDiceIds : [diceId];
  }

  // Würfel-Auswahl Logik
  public handleDiceClick(diceId: string): void {
    this.toggleDiceSelection(diceId);
  }

  public handleDiceDoubleClick(diceId: string): void {
    this.selectedDiceForValue = diceId;
    this.notifyListeners();
  }

  public getSelectedDiceForValue(): string | null {
    return this.selectedDiceForValue;
  }

  public clearSelectedDiceForValue(): void {
    this.selectedDiceForValue = null;
    this.notifyListeners();
  }

  // Würfel-Wert-Änderung Logik
  public handleValueSelect(value: number): void {
    if (this.selectedDiceForValue) {
      this.setDiceValue(this.selectedDiceForValue, value);
      this.selectedDiceForValue = null;
      this.notifyListeners();
    }
  }

  public handleRandomRoll(): void {
    if (this.selectedDiceForValue) {
      this.rollDice(this.selectedDiceForValue);
      this.selectedDiceForValue = null;
      this.notifyListeners();
    }
  }

  public handleDeleteZone(monsterNumber: number): void {
    // Verschiebe alle Würfel aus der Monster-Zone in den Pool
    const zoneName = `monster${monsterNumber}` as DiceZone;
    const diceInZone = this.state.dice.filter(d => d.zone === zoneName);
    
    // Erschöpfe die Würfel
    this.moveDiceMultiple(diceInZone.map(d => d.id), 'exhausted');
    
    // Verschiebe die Würfel aus den nachfolgenden Zonen nach oben
    for (let i = monsterNumber; i < this.state.activeMonsterZones; i++) {
      const currentZone = `monster${i + 1}` as DiceZone;
      const nextZone = `monster${i}` as DiceZone;
      const diceToMove = this.state.dice.filter(d => d.zone === currentZone);
      this.moveDiceMultiple(diceToMove.map(d => d.id), nextZone);
    }
    
    // Reduziere die Anzahl der aktiven Monster-Zonen
    if (this.state.activeMonsterZones > 1) {
      this.setActiveMonsterZones(this.state.activeMonsterZones - 1);
    }
  }
}

export const diceManager = new DiceManager(); 