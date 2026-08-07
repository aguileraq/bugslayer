import { describe, expect, it } from 'vitest';

import { PauseController } from '../../src/combat/PauseController';
import { GameStateMachine } from '../../src/core/GameStateMachine';

describe('PauseController', () => {
  describe('manual pause', () => {
    it('accepts manual pause from Playing', () => {
      const sm = new GameStateMachine('Playing');
      const controller = new PauseController(sm);

      const result = controller.requestManualPause();

      expect(result.accepted).toBe(true);
      expect(result.type).toBe('manual');
      expect(sm.state).toBe('Paused');
      expect(sm.pauseContext?.cause).toBe('manual');
      expect(sm.pauseContext?.returnState).toBe('Playing');
    });

    it('accepts manual pause from Exploration', () => {
      const sm = new GameStateMachine('Exploration');
      const controller = new PauseController(sm);

      const result = controller.requestManualPause();

      expect(result.accepted).toBe(true);
      expect(result.type).toBe('manual');
      expect(sm.state).toBe('Paused');
      expect(sm.pauseContext?.returnState).toBe('Exploration');
    });

    it('REJECTS manual pause from Challenge (pauseBlocked)', () => {
      const sm = new GameStateMachine('Challenge');
      const controller = new PauseController(sm);

      const result = controller.requestManualPause();

      expect(result.accepted).toBe(false);
      expect(result.type).toBe('blocked');
      expect(sm.state).toBe('Challenge'); // unchanged
    });

    it('rejects manual pause from non-pausable states', () => {
      const sm = new GameStateMachine('Transitioning');
      const controller = new PauseController(sm);

      const result = controller.requestManualPause();

      expect(result.accepted).toBe(false);
      expect(result.type).toBe('blocked');
    });
  });

  describe('safety pause', () => {
    it('accepts safety pause from Playing', () => {
      const sm = new GameStateMachine('Playing');
      const controller = new PauseController(sm);

      const result = controller.requestSafetyPause();

      expect(result.accepted).toBe(true);
      expect(result.type).toBe('safety');
      expect(sm.state).toBe('Paused');
      expect(sm.pauseContext?.cause).toBe('visibility');
      expect(sm.pauseContext?.returnState).toBe('Playing');
    });

    it('accepts safety pause from Challenge with snapshot', () => {
      const sm = new GameStateMachine('Challenge');
      const controller = new PauseController(sm);
      const snapshot = { remainingMs: 4000, typedAnswer: 'num', selectedOptionIndex: null };

      const result = controller.requestSafetyPause(snapshot);

      expect(result.accepted).toBe(true);
      expect(result.type).toBe('safety');
      expect(sm.state).toBe('Paused');
      expect(sm.pauseContext?.returnState).toBe('Challenge');
      if (sm.pauseContext?.returnState === 'Challenge') {
        expect(sm.pauseContext.challengeSnapshot).toEqual(snapshot);
      }
    });

    it('accepts safety pause from Exploration', () => {
      const sm = new GameStateMachine('Exploration');
      const controller = new PauseController(sm);

      const result = controller.requestSafetyPause();

      expect(result.accepted).toBe(true);
      expect(sm.state).toBe('Paused');
    });

    it('rejects safety pause from non-pausable states', () => {
      const sm = new GameStateMachine('Boot');
      const controller = new PauseController(sm);

      const result = controller.requestSafetyPause();

      expect(result.accepted).toBe(false);
    });
  });

  describe('resume', () => {
    it('resumes to saved state', () => {
      const sm = new GameStateMachine('Playing');
      const controller = new PauseController(sm);

      controller.requestManualPause();
      expect(sm.state).toBe('Paused');

      const returnState = controller.resume();
      expect(returnState).toBe('Playing');
      expect(sm.state).toBe('Playing');
    });

    it('resumes Challenge from safety pause', () => {
      const sm = new GameStateMachine('Challenge');
      const controller = new PauseController(sm);

      controller.requestSafetyPause({ remainingMs: 3000, typedAnswer: '', selectedOptionIndex: null });
      const returnState = controller.resume();

      expect(returnState).toBe('Challenge');
      expect(sm.state).toBe('Challenge');
    });

    it('returns null if not paused', () => {
      const sm = new GameStateMachine('Playing');
      const controller = new PauseController(sm);

      expect(controller.resume()).toBeNull();
    });
  });

  describe('restart and exit', () => {
    it('restart from Paused goes to Intro', () => {
      const sm = new GameStateMachine('Paused');
      const controller = new PauseController(sm);

      expect(controller.restart()).toBe(true);
      expect(sm.state).toBe('Intro');
    });

    it('exitToMenu from Paused goes to Menu', () => {
      const sm = new GameStateMachine('Paused');
      const controller = new PauseController(sm);

      expect(controller.exitToMenu()).toBe(true);
      expect(sm.state).toBe('Menu');
    });

    it('restart from Defeat goes to Intro', () => {
      const sm = new GameStateMachine('Defeat');
      const controller = new PauseController(sm);

      expect(controller.restart()).toBe(true);
      expect(sm.state).toBe('Intro');
    });

    it('exitToMenu from Defeat goes to Menu', () => {
      const sm = new GameStateMachine('Defeat');
      const controller = new PauseController(sm);

      expect(controller.exitToMenu()).toBe(true);
      expect(sm.state).toBe('Menu');
    });
  });
});
