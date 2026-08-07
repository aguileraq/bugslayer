import type { GameState } from '../types';

export interface MovementIntent {
  readonly x: number;
  readonly y: number;
}

export interface InputState {
  readonly up: boolean;
  readonly down: boolean;
  readonly left: boolean;
  readonly right: boolean;
  readonly confirm: boolean;
  readonly pause: boolean;
}

const CONFIRM_STATES: ReadonlySet<GameState> = new Set([
  'Exploration',
  'Dialogue',
  'Paused',
]);

const PAUSE_STATES: ReadonlySet<GameState> = new Set([
  'Exploration',
  'Playing',
]);

export class InputManager {
  #up = false;
  #down = false;
  #left = false;
  #right = false;
  #confirmPressed = false;
  #pausePressed = false;
  #confirmConsumed = false;
  #pauseConsumed = false;

  public get state(): InputState {
    return {
      up: this.#up,
      down: this.#down,
      left: this.#left,
      right: this.#right,
      confirm: this.#confirmPressed && !this.#confirmConsumed,
      pause: this.#pausePressed && !this.#pauseConsumed,
    };
  }

  public movementIntent(): MovementIntent {
    let x = 0;
    let y = 0;
    if (this.#left) x -= 1;
    if (this.#right) x += 1;
    if (this.#up) y -= 1;
    if (this.#down) y += 1;
    return { x, y };
  }

  public hasConfirm(state: GameState): boolean {
    if (!CONFIRM_STATES.has(state)) return false;
    if (!this.#confirmPressed || this.#confirmConsumed) return false;
    this.#confirmConsumed = true;
    return true;
  }

  public hasPause(state: GameState): boolean {
    if (!PAUSE_STATES.has(state)) return false;
    if (!this.#pausePressed || this.#pauseConsumed) return false;
    this.#pauseConsumed = true;
    return true;
  }

  public keyDown(key: string): void {
    switch (key) {
      case 'ArrowUp':
      case 'Up':
        this.#up = true;
        break;
      case 'ArrowDown':
      case 'Down':
        this.#down = true;
        break;
      case 'ArrowLeft':
      case 'Left':
        this.#left = true;
        break;
      case 'ArrowRight':
      case 'Right':
        this.#right = true;
        break;
      case 'Enter':
        this.#confirmPressed = true;
        this.#confirmConsumed = false;
        break;
      case 'Escape':
        this.#pausePressed = true;
        this.#pauseConsumed = false;
        break;
    }
  }

  public keyUp(key: string): void {
    switch (key) {
      case 'ArrowUp':
      case 'Up':
        this.#up = false;
        break;
      case 'ArrowDown':
      case 'Down':
        this.#down = false;
        break;
      case 'ArrowLeft':
      case 'Left':
        this.#left = false;
        break;
      case 'ArrowRight':
      case 'Right':
        this.#right = false;
        break;
      case 'Enter':
        this.#confirmPressed = false;
        this.#confirmConsumed = false;
        break;
      case 'Escape':
        this.#pausePressed = false;
        this.#pauseConsumed = false;
        break;
    }
  }

  public reset(): void {
    this.#up = false;
    this.#down = false;
    this.#left = false;
    this.#right = false;
    this.#confirmPressed = false;
    this.#pausePressed = false;
    this.#confirmConsumed = false;
    this.#pauseConsumed = false;
  }
}
