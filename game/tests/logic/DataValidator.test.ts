import { describe, expect, it } from 'vitest';

import {
  DataValidationError,
  DataValidator,
} from '../../src/logic/DataValidator';
import {
  ATTACK_PATTERN_IDS,
  CHALLENGE_CATEGORIES,
  ENCOUNTER_ORDER,
  type AttackPatternId,
  type ChallengeCategory,
  type EnemyArchetypeId,
} from '../../src/types';

function createChallenges() {
  return CHALLENGE_CATEGORIES.flatMap((category) => [
    {
      id: `${category}-1`,
      category,
      mode: 'typed',
      code: `const ${category} = 1`,
      instructionKey: `challenge.${category}.1.instruction`,
      damage: 25,
      timeLimitMs: 8_000,
      acceptedAnswers: ['number'],
    },
    {
      id: `${category}-2`,
      category,
      mode: 'multiple-choice',
      code: `const ${category}: number = 1`,
      instructionKey: `challenge.${category}.2.instruction`,
      damage: 25,
      timeLimitMs: 8_000,
      options: ['number', 'string', 'boolean'],
      correctIndex: 0,
    },
    {
      id: `${category}-3`,
      category,
      mode: 'typed',
      code: `let ${category} = true`,
      instructionKey: `challenge.${category}.3.instruction`,
      damage: 25,
      timeLimitMs: 8_000,
      acceptedAnswers: ['boolean'],
      caseSensitive: false,
    },
  ]);
}

function createSpawn(
  id: string,
  archetypeId: EnemyArchetypeId,
  attackIds: readonly AttackPatternId[],
) {
  return {
    id,
    archetypeId,
    position: { x: 600, y: 270 },
    maxHp: 100,
    attackIds: [...attackIds],
    attackParams: Object.fromEntries(
      attackIds.map((attackId) => [
        attackId,
        { damage: 10, intervalMs: 1_000 },
      ]),
    ),
  };
}

function createEncounter(
  id: (typeof ENCOUNTER_ORDER)[number],
  category: ChallengeCategory,
  spawns: ReturnType<typeof createSpawn>[],
) {
  return {
    id,
    mapKey: `tilemap.${id}`,
    category,
    enemySpawns: spawns,
    challengePool: [`${category}-1`, `${category}-2`, `${category}-3`],
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
      requiredEnemyIds: spawns.map((spawn) => spawn.id),
    },
    transitionTextKey: `transition.${id}`,
  };
}

function createValidBundle() {
  const challenges = createChallenges();
  const encounters = [
    {
      ...createEncounter('parse-mantis', 'syntax', [
        createSpawn('parse-1', 'parse-mantis', ['parse.linearAttack']),
      ]),
      tutorial: {
        stepKeys: ['tutorial.move', 'tutorial.dodge', 'tutorial.answer'],
      },
    },
    createEncounter('mutable-widow', 'variable', [
      createSpawn('widow-1', 'mutable-widow', [
        'widow.reassignmentVolley',
        'widow.scopeWeb',
      ]),
      createSpawn('widow-2', 'mutable-widow', [
        'widow.reassignmentVolley',
        'widow.scopeWeb',
      ]),
    ]),
    createEncounter('cast-hornet', 'type', [
      createSpawn('hornet-1', 'cast-hornet', [
        'hornet.typeSting',
        'hornet.castingSwarm',
      ]),
      createSpawn('hornet-2', 'cast-hornet', [
        'hornet.typeSting',
        'hornet.castingSwarm',
      ]),
      createSpawn('hornet-3', 'cast-hornet', [
        'hornet.typeSting',
        'hornet.castingSwarm',
      ]),
    ]),
    createEncounter('boolean-beetle', 'logic', [
      createSpawn('beetle-1', 'boolean-beetle', [
        'beetle.booleanBurst',
        'beetle.xorCrossfire',
        'beetle.falsePath',
        'beetle.branchCharge',
      ]),
    ]),
  ];

  const finalSequence = {
    terminalState: 'DemoEnd',
    steps: [
      {
        id: 'senior-v4lk-dialogue',
        type: 'dialogue',
        actorIds: ['senior-engineer', 'v4lk'],
        dialogueKey: 'final.dialogue.opening',
      },
      {
        id: 'habitat-corruption',
        type: 'environmentCorruption',
        actorIds: [],
        effectKey: 'effect.final.corruption',
        durationMs: 1_000,
      },
      {
        id: 'monolith-appearance',
        type: 'actorAppearance',
        actorIds: ['mycelial-monolith'],
      },
      {
        id: 'beetle-infection',
        type: 'enemyInfection',
        actorIds: ['boolean-beetle'],
      },
      {
        id: 'infected-minions',
        type: 'minionAppearance',
        actorIds: [
          'parse-mantis-infected',
          'mutable-widow-infected',
          'cast-hornet-infected',
          'boolean-beetle-infected',
        ],
      },
      {
        id: 'v4lk-warning',
        type: 'warning',
        actorIds: ['v4lk'],
        dialogueKey: 'final.dialogue.warning',
      },
      {
        id: 'extraction-lock',
        type: 'extractionLockOn',
        actorIds: ['senior-engineer', 'v4lk'],
      },
      {
        id: 'senior-extraction',
        type: 'actorExtraction',
        actorIds: ['senior-engineer'],
      },
      {
        id: 'v4lk-extraction',
        type: 'actorExtraction',
        actorIds: ['v4lk'],
      },
      {
        id: 'fade',
        type: 'fade',
        actorIds: [],
        durationMs: 1_000,
      },
      {
        id: 'demo-end',
        type: 'demoEndTransition',
        actorIds: [],
        completionSignal: 'demoEndReady',
      },
    ],
  };

  const localeKeys = [
    ...challenges.map((challenge) => challenge.instructionKey),
    ...encounters.map((encounter) => encounter.transitionTextKey),
    'tutorial.move',
    'tutorial.dodge',
    'tutorial.answer',
    'final.dialogue.opening',
    'final.dialogue.warning',
  ];
  const messages = Object.fromEntries(
    localeKeys.map((key) => [key, `Localized: ${key}`]),
  );
  const missingRequiredAssetKeys: string[] = [];

  return {
    manifest: {
      version: '1',
      assets: [
        ...ENCOUNTER_ORDER.map((encounterId) => ({
          key: `tilemap.${encounterId}`,
          type: 'tilemap',
          category: 'tilemap',
          url: `./assets/tilemaps/${encounterId}.json`,
          required: true,
          format: 'tiled-json',
        })),
        {
          key: 'effect.final.corruption',
          type: 'image',
          category: 'mycelial-monolith',
          url: './assets/effects/final-corruption.png',
          required: true,
        },
      ],
    },
    locales: {
      es: { ...messages },
      en: { ...messages },
    },
    challenges,
    registeredAttackIds: [...ATTACK_PATTERN_IDS],
    encounters,
    finalSequence,
    missingRequiredAssetKeys,
  };
}

describe('DataValidator', () => {
  const validator = new DataValidator();

  it('accepts a complete deterministic data bundle', () => {
    const report = validator.validate(createValidBundle());

    expect(report).toEqual({ valid: true, issues: [] });
    expect(validator.validateOrThrow(createValidBundle())).toEqual(report);
  });

  it('reports broken Challenge, map, effect, and attack references together', () => {
    const bundle = createValidBundle();
    bundle.encounters[0]!.mapKey = 'tilemap.missing';
    bundle.encounters[0]!.challengePool[0] = 'syntax-missing';
    bundle.registeredAttackIds = bundle.registeredAttackIds.filter(
      (attackId) => attackId !== 'parse.linearAttack',
    );
    bundle.finalSequence.steps[1]!.effectKey = 'effect.missing';

    const report = validator.validate(bundle);

    expect(report.valid).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'MISSING_REFERENCE',
        'UNREGISTERED_ATTACK',
      ]),
    );
    expect(report.issues.map((issue) => issue.path)).toEqual(
      expect.arrayContaining([
        'encounters[0].mapKey',
        'encounters[0].challengePool[0]',
        'finalSequence.steps[1].effectKey',
      ]),
    );
  });

  it('rejects incorrect Challenge and Encounter categories', () => {
    const bundle = createValidBundle();
    bundle.challenges[0]!.category = 'logic';
    bundle.encounters[0]!.category = 'logic';

    const report = validator.validate(bundle);

    expect(report.valid).toBe(false);
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'INVALID_VALUE',
          path: 'encounters[0].category',
        }),
        expect.objectContaining({
          code: 'INVALID_COUNT',
          path: 'challenges.category.syntax',
        }),
      ]),
    );
  });

  it('reports locale keys missing from either language', () => {
    const bundle = createValidBundle();
    delete bundle.locales.en['challenge.syntax.1.instruction'];

    const report = validator.validate(bundle);

    expect(report.valid).toBe(false);
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          domain: 'locale',
          code: 'MISSING_LOCALE_KEY',
          bootCode: 'BOOT_LOCALE_INVALID',
        }),
      ]),
    );
  });

  it('aggregates every issue deterministically and blocks invalid data', () => {
    const bundle = createValidBundle();
    bundle.manifest.assets.push({ ...bundle.manifest.assets[0]! });
    bundle.missingRequiredAssetKeys.push('tilemap.parse-mantis');
    bundle.challenges[1]!.correctIndex = 9;
    bundle.finalSequence.steps.pop();

    const first = validator.validate(bundle);
    const second = validator.validate(bundle);

    expect(first.valid).toBe(false);
    expect(first.issues).toEqual(second.issues);
    expect(first.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'DUPLICATE_ID',
        'MISSING_REQUIRED_ASSET',
        'INVALID_VALUE',
        'MISSING_SEQUENCE_STEP',
        'INVALID_ORDER',
      ]),
    );
    expect(first.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'MISSING_REQUIRED_ASSET',
          bootCode: 'BOOT_ASSET_LOAD_FAILED',
        }),
      ]),
    );

    try {
      validator.validateOrThrow(bundle);
      throw new Error('Expected invalid data to be blocked.');
    } catch (error) {
      expect(error).toBeInstanceOf(DataValidationError);
      if (error instanceof DataValidationError) {
        expect(error.code).toBe('BOOT_DATA_INVALID');
        expect(error.issues).toEqual(first.issues);
      }
    }
  });
});
