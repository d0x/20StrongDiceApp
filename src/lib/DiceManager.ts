export interface Dice {
  id: string;
  value: number;
  zone: 'muster' | 'exhausted' | 'monster';
  monsterId?: string;
  isSelected: boolean;
}

interface DiceManagerState {
  dice: Dice[];
  rerollCounter: number;
}

export class DiceManager {
  private state: DiceManagerState;
  private listeners: ((state: DiceManagerState) => void)[] = [];

  constructor() {
    this.state = {
      dice: [],
      rerollCounter: 0
    };
  }

  addListener(listener: (state: DiceManagerState) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (state: DiceManagerState) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): DiceManagerState {
    return { ...this.state };
  }

  addDice(dice: Dice) {
    this.state.dice.push(dice);
    this.notifyListeners();
  }

  removeDice(diceId: string) {
    this.state.dice = this.state.dice.filter(d => d.id !== diceId);
    this.notifyListeners();
  }

  moveDice(diceId: string, targetZone: Dice['zone'], targetMonsterId?: string) {
    const dice = this.state.dice.find(d => d.id === diceId);
    if (dice) {
      dice.zone = targetZone;
      dice.monsterId = targetMonsterId;
      this.notifyListeners();
    }
  }

  selectDice(diceId: string) {
    const dice = this.state.dice.find(d => d.id === diceId);
    if (dice) {
      dice.isSelected = true;
      this.notifyListeners();
    }
  }

  deselectDice(diceId: string) {
    const dice = this.state.dice.find(d => d.id === diceId);
    if (dice) {
      dice.isSelected = false;
      this.notifyListeners();
    }
  }

  deselectAllDice() {
    this.state.dice.forEach(dice => {
      dice.isSelected = false;
    });
    this.notifyListeners();
  }

  incrementRerollCounter(): void {
    this.state.rerollCounter++;
    this.notifyListeners();
  }

  decrementRerollCounter(): void {
    this.state.rerollCounter = Math.max(0, this.state.rerollCounter - 1);
    this.notifyListeners();
  }
} 