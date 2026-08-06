import { describe, expect, it } from 'vitest';

import {
  ATTACK_PATTERN_IDS,
  CHALLENGE_CATEGORIES,
  CHALLENGE_MODES,
  ENCOUNTER_ORDER,
  ENEMY_ARCHETYPE_IDS,
  FINAL_SEQUENCE_STEP_TYPES,
  GAME_STATES,
  SUPPORTED_LANGUAGES,
  type AssetManifest,
  type EncounterConfig,
  type FinalSequenceConfig,
  type LocaleBundle,
  type MultipleChoiceChallenge,
  type PauseContext,
  type RunStatistics,
  type TypedChallenge,
} from '../../src/types';

const typedChallenge = {
  id: 'syntax-01',
  category: 'syntax',
  mode: 'typed',
  code: 'const total = 1',
  instructionKey: 'challenge.syntax.01.instruction',
  damage: 25,
  timeLimitMs: 8_000,
  acceptedAnswers: [';'],
} satisfies TypedChallenge;

const multipleChoiceChallenge = {
  id: 'syntax-02',
  category: 'syntax',
  mode: 'multiple-choice',
  code: 'const answer: number = 42;',
  instructionKey: 'challenge.syntax.02.instruction',
  damage: 25,
  timeLimitMs: 8_000,
  options: ['number', 'string', 'boolean'],
  correctIndex: 0,
} satisfies MultipleChoiceChallenge;

const encounter = {
  id: 'parse-mantis',
  mapKey: 'tilemap.compilation-garden',
  category: 'syntax',
  enemySpawns: [
    {
      id: 'parse-mantis-01',
      archetypeId: 'parse-mantis',
      position: { x: 640, y: 270 },
      maxHp: 100,
      attackIds: ['parse.linearAttack'],
      attackParams: {
        'parse.linearAttack': {
          damage: 10,
          projectileSpeed: 160,
        },
      },
    },
  ],
  challengePool: [typedChallenge.id, multipleChoiceChallenge.id],
  challengeIntervalMs: 5_000,
  defaultTimeLimitMs: 8_000,
  penalty: {
    type: 'extraProjectiles',
    multiplier: 2,
    durationMs: 5_000,
  },
  damageTargetMode: 'roundRobin',
  completionRule: {
    type: 'allRequiredEnemiesDefeated',
    requiredEnemyIds: ['parse-mantis-01'],
  },
  transitionTextKey: 'transition.parse-mantis.complete',
  tutorial: {
    stepKeys: ['tutorial.move', 'tutorial.dodge', 'tutorial.answer'],
  },
} satisfies EncounterConfig;

const pausedChallenge = {
  cause: 'visibility',
  returnState: 'Challenge',
  challengeSnapshot: {
    remainingMs: 4_250,
    typedAnswer: 'number',
    selectedOptionIndex: null,
  },
} satisfies PauseContext;

const locale = {
  language: 'es',
  messages: {
    'challenge.syntax.01.instruction': 'Completa el código.',
  },
} satisfies LocaleBundle;

const assetManifest = {
  version: '1',
  assets: [
    {
      key: 'font.geist-pixel-square',
      type: 'font',
      category: 'font',
      url: './assets/fonts/geist-pixel-square.woff2',
      required: true,
      family: 'Geist Pixel Square',
    },
    {
      key: 'player.idle',
      type: 'spritesheet',
      category: 'player',
      url: './assets/sprites/senior-engineer-idle.png',
      required: true,
      expectedDimensions: { width: 384, height: 512 },
      frameConfig: { frameWidth: 128, frameHeight: 128 },
    },
  ],
} satisfies AssetManifest;

const finalSequence = {
  steps: [
    {
      id: 'demo-end',
      type: 'demoEndTransition',
      actorIds: [],
      completionSignal: 'demoEndReady',
    },
  ],
  terminalState: 'DemoEnd',
} satisfies FinalSequenceConfig;

const statistics = {
  finalScore: 1_250,
  correctCount: 8,
  incorrectCount: 2,
  maxStreak: 5,
  totalPlayTimeMs: 180_000,
  furthestEncounterId: 'boolean-beetle',
} satisfies RunStatistics;

describe('core contracts', () => {
  it('exposes only the thirteen approved primary states', () => {
    expect(GAME_STATES).toEqual([
      'Boot',
      'LanguageSelect',
      'Menu',
      'Intro',
      'Exploration',
      'Dialogue',
      'Playing',
      'Challenge',
      'Paused',
      'Transitioning',
      'Defeat',
      'FinalSequence',
      'DemoEnd',
    ]);
  });

  it('fixes the four encounters and enemy archetypes in demo order', () => {
    expect(ENCOUNTER_ORDER).toEqual([
      'parse-mantis',
      'mutable-widow',
      'cast-hornet',
      'boolean-beetle',
    ]);
    expect(ENEMY_ARCHETYPE_IDS).toEqual(ENCOUNTER_ORDER);
  });

  it('exposes the complete approved challenge and attack vocabulary', () => {
    expect(CHALLENGE_CATEGORIES).toHaveLength(4);
    expect(CHALLENGE_MODES).toEqual(['typed', 'multiple-choice']);
    expect(ATTACK_PATTERN_IDS).toHaveLength(9);
  });

  it('represents data-driven content without Phaser dependencies', () => {
    expect(encounter.enemySpawns[0].maxHp).toBe(100);
    expect(typedChallenge.acceptedAnswers).toEqual([';']);
    expect(multipleChoiceChallenge.options).toHaveLength(3);
    expect(pausedChallenge.challengeSnapshot.remainingMs).toBe(4_250);
    expect(locale.language).toBe('es');
    expect(assetManifest.assets).toHaveLength(2);
    expect(finalSequence.terminalState).toBe('DemoEnd');
    expect(statistics.furthestEncounterId).toBe('boolean-beetle');
  });

  it('supports exactly the two localized languages and narrative step types', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['es', 'en']);
    expect(FINAL_SEQUENCE_STEP_TYPES).toHaveLength(10);
  });
});
