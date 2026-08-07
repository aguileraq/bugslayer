import { describe, expect, it } from 'vitest';

import { GameStateMachine } from '../../src/core/GameStateMachine';
import type { PauseContext } from '../../src/types';

describe('GameStateMachine', () => {
  describe('boot and menu flow', () => {
    it('follows Boot → LanguageSelect → Menu → Intro', () => {
      const sm = new GameStateMachine();

      expect(sm.state).toBe('Boot');
      expect(sm.transition('bootComplete')).toEqual(
        expect.objectContaining({ allowed: true, from: 'Boot', to: 'LanguageSelect' }),
      );
      expect(sm.transition('languageConfirmed')).toEqual(
        expect.objectContaining({ allowed: true, from: 'LanguageSelect', to: 'Menu' }),
      );
      expect(sm.transition('startRun')).toEqual(
        expect.objectContaining({ allowed: true, from: 'Menu', to: 'Intro' }),
      );
      expect(sm.state).toBe('Intro');
    });
  });

  describe('office flow', () => {
    it('follows Intro → Exploration → Dialogue → Exploration → Transitioning', () => {
      const sm = new GameStateMachine('Intro');

      expect(sm.transition('wakeDialogueComplete')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Exploration' }),
      );
      expect(sm.transition('dialogueStarted')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Dialogue' }),
      );
      expect(sm.transition('dialogueComplete')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Exploration' }),
      );
      expect(sm.transition('officeExitReached')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Transitioning' }),
      );
    });
  });

  describe('combat flow (Playing ↔ Challenge)', () => {
    it('transitions Playing → Challenge → Playing', () => {
      const sm = new GameStateMachine('Playing');

      expect(sm.transition('challengePresented')).toEqual(
        expect.objectContaining({ allowed: true, from: 'Playing', to: 'Challenge' }),
      );
      expect(sm.state).toBe('Challenge');
      expect(sm.transition('challengeClosed')).toEqual(
        expect.objectContaining({ allowed: true, from: 'Challenge', to: 'Playing' }),
      );
      expect(sm.state).toBe('Playing');
    });

    it('allows encounterCompleted from Playing', () => {
      const sm = new GameStateMachine('Playing');

      expect(sm.transition('encounterCompleted')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Transitioning' }),
      );
    });

    it('allows encounterCompleted from Challenge (silent close)', () => {
      const sm = new GameStateMachine('Challenge');

      expect(sm.transition('encounterCompleted')).toEqual(
        expect.objectContaining({ allowed: true, from: 'Challenge', to: 'Transitioning' }),
      );
    });

    it('allows playerDefeated from Playing', () => {
      const sm = new GameStateMachine('Playing');

      expect(sm.transition('playerDefeated')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Defeat' }),
      );
    });

    it('allows playerDefeated from Challenge (silent close)', () => {
      const sm = new GameStateMachine('Challenge');

      expect(sm.transition('playerDefeated')).toEqual(
        expect.objectContaining({ allowed: true, from: 'Challenge', to: 'Defeat' }),
      );
    });

    it('transitions through multiple encounters', () => {
      const sm = new GameStateMachine('Transitioning');

      expect(sm.transition('encounterReady')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Playing' }),
      );
      sm.reset('Transitioning');
      expect(sm.transition('nextEncounterReady')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Playing' }),
      );
      sm.reset('Transitioning');
      expect(sm.transition('finalSequenceReady')).toEqual(
        expect.objectContaining({ allowed: true, to: 'FinalSequence' }),
      );
    });
  });

  describe('pause — manual', () => {
    it('pauses from Playing with manual context and resumes to Playing', () => {
      const sm = new GameStateMachine('Playing');
      const context: PauseContext = { cause: 'manual', returnState: 'Playing' };

      const pauseResult = sm.transition('manualPauseRequested', context);
      expect(pauseResult).toEqual(
        expect.objectContaining({ allowed: true, from: 'Playing', to: 'Paused' }),
      );
      expect(sm.pauseContext).toEqual(context);

      const resumeResult = sm.transition('resumeRequested');
      expect(resumeResult).toEqual(
        expect.objectContaining({ allowed: true, from: 'Paused', to: 'Playing' }),
      );
      expect(sm.pauseContext).toBeNull();
    });

    it('pauses from Exploration and resumes to Exploration', () => {
      const sm = new GameStateMachine('Exploration');
      const context: PauseContext = { cause: 'manual', returnState: 'Exploration' };

      sm.transition('manualPauseRequested', context);
      expect(sm.state).toBe('Paused');

      sm.transition('resumeRequested');
      expect(sm.state).toBe('Exploration');
    });

    it('REJECTS manual pause from Challenge (pauseBlocked)', () => {
      const sm = new GameStateMachine('Challenge');

      const result = sm.transition('manualPauseRequested');
      expect(result).toEqual(
        expect.objectContaining({ allowed: false, from: 'Challenge', to: null }),
      );
      expect(sm.state).toBe('Challenge');
    });
  });

  describe('pause — safety (visibility)', () => {
    it('accepts safety pause from Playing', () => {
      const sm = new GameStateMachine('Playing');
      const context: PauseContext = { cause: 'visibility', returnState: 'Playing' };

      const result = sm.transition('safetyPauseRequested', context);
      expect(result).toEqual(
        expect.objectContaining({ allowed: true, to: 'Paused' }),
      );
      expect(sm.pauseContext).toEqual(context);
    });

    it('accepts safety pause from Challenge with snapshot', () => {
      const sm = new GameStateMachine('Challenge');
      const context: PauseContext = {
        cause: 'visibility',
        returnState: 'Challenge',
        challengeSnapshot: {
          remainingMs: 4250,
          typedAnswer: 'numb',
          selectedOptionIndex: null,
        },
      };

      const result = sm.transition('safetyPauseRequested', context);
      expect(result).toEqual(
        expect.objectContaining({ allowed: true, from: 'Challenge', to: 'Paused' }),
      );
      expect(sm.pauseContext).toEqual(context);

      // Resume returns to Challenge
      const resume = sm.transition('resumeRequested');
      expect(resume).toEqual(
        expect.objectContaining({ allowed: true, from: 'Paused', to: 'Challenge' }),
      );
      expect(sm.pauseContext).toBeNull();
    });

    it('accepts safety pause from Exploration', () => {
      const sm = new GameStateMachine('Exploration');
      const context: PauseContext = { cause: 'visibility', returnState: 'Exploration' };

      sm.transition('safetyPauseRequested', context);
      expect(sm.state).toBe('Paused');

      sm.transition('resumeRequested');
      expect(sm.state).toBe('Exploration');
    });
  });

  describe('defeat and reset', () => {
    it('allows restart from Defeat (back to Intro)', () => {
      const sm = new GameStateMachine('Defeat');

      const result = sm.transition('restartRequested');
      expect(result).toEqual(
        expect.objectContaining({ allowed: true, from: 'Defeat', to: 'Intro' }),
      );
    });

    it('allows exit to menu from Defeat', () => {
      const sm = new GameStateMachine('Defeat');

      const result = sm.transition('exitToMenuRequested');
      expect(result).toEqual(
        expect.objectContaining({ allowed: true, from: 'Defeat', to: 'Menu' }),
      );
    });

    it('allows restart from Paused', () => {
      const sm = new GameStateMachine('Paused');

      expect(sm.transition('restartRequested')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Intro' }),
      );
    });

    it('allows exit to menu from Paused', () => {
      const sm = new GameStateMachine('Paused');

      expect(sm.transition('exitToMenuRequested')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Menu' }),
      );
    });

    it('allows restart and exit from DemoEnd', () => {
      const sm = new GameStateMachine('DemoEnd');

      expect(sm.transition('restartRequested')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Intro' }),
      );

      sm.reset('DemoEnd');
      expect(sm.transition('exitToMenuRequested')).toEqual(
        expect.objectContaining({ allowed: true, to: 'Menu' }),
      );
    });
  });

  describe('invalid transitions', () => {
    it('rejects transitions not in the table', () => {
      const sm = new GameStateMachine('Boot');

      const result = sm.transition('startRun');
      expect(result).toEqual(
        expect.objectContaining({ allowed: false, from: 'Boot', to: null }),
      );
      expect(sm.state).toBe('Boot');
    });

    it('rejects challengePresented from Exploration', () => {
      const sm = new GameStateMachine('Exploration');

      expect(sm.transition('challengePresented')).toEqual(
        expect.objectContaining({ allowed: false }),
      );
    });

    it('rejects encounterReady from Playing', () => {
      const sm = new GameStateMachine('Playing');

      expect(sm.transition('encounterReady')).toEqual(
        expect.objectContaining({ allowed: false }),
      );
    });
  });

  describe('history and canTransition', () => {
    it('tracks all transition attempts in history', () => {
      const sm = new GameStateMachine('Playing');

      sm.transition('challengePresented');
      sm.transition('manualPauseRequested'); // rejected from Challenge
      sm.transition('challengeClosed');

      expect(sm.history).toHaveLength(3);
      expect(sm.history[0]?.allowed).toBe(true);
      expect(sm.history[1]?.allowed).toBe(false);
      expect(sm.history[2]?.allowed).toBe(true);
    });

    it('canTransition returns correct availability', () => {
      const sm = new GameStateMachine('Playing');

      expect(sm.canTransition('challengePresented')).toBe(true);
      expect(sm.canTransition('manualPauseRequested')).toBe(true);
      expect(sm.canTransition('encounterReady')).toBe(false);
      expect(sm.canTransition('bootComplete')).toBe(false);
    });
  });

  describe('reset', () => {
    it('resets to specified state and clears pause context', () => {
      const sm = new GameStateMachine('Playing');
      sm.transition('manualPauseRequested', { cause: 'manual', returnState: 'Playing' });

      sm.reset('Boot');
      expect(sm.state).toBe('Boot');
      expect(sm.pauseContext).toBeNull();
    });
  });
});
