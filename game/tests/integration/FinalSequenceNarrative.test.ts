import { describe, expect, it, vi } from 'vitest';

import { assetManifest } from '../../src/assets';
import {
  EncounterManager,
  FinalSequenceController,
  type EncounterConfig,
} from '../../src/combat';
import {
  DemoEndFlow,
  GameStateMachine,
  RunManager,
  SessionSettings,
} from '../../src/core';
import {
  BOOLEAN_BEETLE_ENCOUNTER,
  CAST_HORNET_ENCOUNTER,
  FINAL_SEQUENCE_CONFIG,
  INITIAL_LOCALES,
  MUTABLE_WIDOW_ENCOUNTER,
  PARSE_MANTIS_ENCOUNTER,
} from '../../src/data';
import type { Language } from '../../src/types';

const EXPECTED_STEP_IDS = [
  'fs-dialogue-01',
  'fs-corruption',
  'fs-monolith-appear',
  'fs-beetle-infection',
  'fs-minions',
  'fs-warning',
  'fs-lock-on',
  'fs-extract-senior',
  'fs-extract-v4lk',
  'fs-fade-end',
] as const;

const REQUIRED_NARRATIVE_ASSETS = [
  'monolith.idle',
  'monolith.spore-injection',
  'monolith.dependency-takeover',
  'monolith.corruption',
  'monolith.dependency-network',
  'infected-enemy.summon',
  'enemy.parse-mantis.infected-idle',
  'enemy.mutable-widow.infected-idle',
  'enemy.cast-hornet.infected-idle',
  'enemy.boolean-beetle.infected-idle',
  'enemy.boolean-beetle.infection-reactivation',
  'extraction.senior-engineer',
  'v4lk.materialize-idle',
  'ui.demo-end.card',
] as const;

const ENCOUNTERS: readonly EncounterConfig[] = [
  PARSE_MANTIS_ENCOUNTER,
  MUTABLE_WIDOW_ENCOUNTER,
  CAST_HORNET_ENCOUNTER,
  BOOLEAN_BEETLE_ENCOUNTER,
];

function reachBooleanBeetle(): {
  readonly manager: EncounterManager;
  readonly stateMachine: GameStateMachine;
} {
  const settings = new SessionSettings();
  settings.setLanguage('es');
  const manager = new EncounterManager(ENCOUNTERS, new RunManager(settings));

  for (let encounterIndex = 0; encounterIndex < ENCOUNTERS.length; encounterIndex++) {
    manager.startEncounter();
    for (const enemy of manager.enemies) enemy.applyDamage(enemy.maxHp);
    if (!manager.isLastEncounter) expect(manager.advance()).toBe(true);
  }

  const stateMachine = new GameStateMachine('Playing');
  stateMachine.transition('encounterCompleted');
  return { manager, stateMachine };
}

describe('FinalSequence narrative verification', () => {
  it('enters FinalSequence after Boolean Beetle and completes all ten steps in order', () => {
    const { manager, stateMachine } = reachBooleanBeetle();
    expect(manager.currentEncounter?.id).toBe('boolean-beetle');
    expect(manager.completionDestination()).toBe('finalSequence');
    expect(stateMachine.state).toBe('Transitioning');
    expect(stateMachine.transition('finalSequenceReady').to).toBe('FinalSequence');

    const started: string[] = [];
    const completed: string[] = [];
    const onSequenceComplete = vi.fn(() => {
      stateMachine.transition('extractionComplete');
    });
    const controller = new FinalSequenceController(FINAL_SEQUENCE_CONFIG, {
      onStepStart: (step) => started.push(step.id),
      onStepComplete: (step) => completed.push(step.id),
      onSequenceComplete,
    });

    controller.start();
    while (controller.active) {
      const step = controller.currentStep;
      expect(step).toBeDefined();
      if (step?.completionSignal !== undefined) {
        controller.signal(step.completionSignal);
      }
      controller.update(step?.durationMs ?? 0);
    }

    expect(started).toEqual(EXPECTED_STEP_IDS);
    expect(completed).toEqual(EXPECTED_STEP_IDS);
    expect(controller.completed).toBe(true);
    expect(onSequenceComplete).toHaveBeenCalledTimes(1);
    expect(stateMachine.state).toBe('DemoEnd');
  });

  it('uses only registered required narrative assets', () => {
    const definitions = new Map(
      assetManifest.assets.map((definition) => [definition.key, definition]),
    );

    for (const key of REQUIRED_NARRATIVE_ASSETS) {
      expect(definitions.get(key)).toEqual(
        expect.objectContaining({ key, required: true }),
      );
    }
    for (const step of FINAL_SEQUENCE_CONFIG.steps) {
      if (step.effectKey !== undefined) {
        expect(definitions.has(step.effectKey)).toBe(true);
      }
    }
  });

  it('contains no combat, HP, attack, victory or Challenge configuration', () => {
    for (const step of FINAL_SEQUENCE_CONFIG.steps) {
      expect(step).not.toHaveProperty('hp');
      expect(step).not.toHaveProperty('maxHp');
      expect(step).not.toHaveProperty('attackIds');
      expect(step).not.toHaveProperty('challengePool');
      expect(step.type).not.toBe('combat');
    }
    expect(FINAL_SEQUENCE_CONFIG.terminalState).toBe('DemoEnd');
  });

  it.each(['es', 'en'] as const)(
    'provides every narrative and DemoEnd message in %s without claiming victory',
    (language) => {
      const messages: Readonly<Record<string, string>> = INITIAL_LOCALES[language];
      const localizedKeys = [
        ...FINAL_SEQUENCE_CONFIG.steps.flatMap((step) =>
          step.dialogueKey === undefined ? [] : [step.dialogueKey],
        ),
        'demoEnd.title',
        'demoEnd.thanks',
        'demoEnd.restart',
        'demoEnd.exitToMenu',
      ];

      for (const key of localizedKeys) {
        expect(messages[key]?.trim().length).toBeGreaterThan(0);
      }

      const ending = `${messages['demoEnd.title']} ${messages['demoEnd.thanks']}`.toLowerCase();
      expect(ending).not.toContain(language === 'es' ? 'victoria' : 'victory');
      expect(ending).not.toContain(language === 'es' ? 'monolith derrotado' : 'monolith defeated');
    },
  );

  it.each(['es', 'en'] as const)(
    'preserves %s when restarting or returning to Menu from DemoEnd',
    (language: Language) => {
      const restartSettings = new SessionSettings();
      restartSettings.setLanguage(language);
      const restart = new DemoEndFlow(
        restartSettings,
        new GameStateMachine('DemoEnd'),
      ).restart();
      expect(restart.destination).toBe('OfficeScene');
      expect(restart.transition.to).toBe('Intro');
      expect(restart.settings.language).toBe(language);

      const menuSettings = new SessionSettings();
      menuSettings.setLanguage(language);
      const menu = new DemoEndFlow(
        menuSettings,
        new GameStateMachine('DemoEnd'),
      ).exitToMenu();
      expect(menu.destination).toBe('MenuScene');
      expect(menu.transition.to).toBe('Menu');
      expect(menu.settings.language).toBe(language);
    },
  );
});
