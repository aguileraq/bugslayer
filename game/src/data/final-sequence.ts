import type { FinalSequenceConfig } from '../types';

export const FINAL_SEQUENCE_CONFIG: FinalSequenceConfig = {
  steps: [
    {
      id: 'fs-dialogue-01',
      type: 'dialogue',
      actorIds: ['senior-engineer', 'v4lk'],
      dialogueKey: 'finalSequence.dialogue.01',
      completionSignal: 'dialogueComplete',
    },
    {
      id: 'fs-corruption',
      type: 'environmentCorruption',
      actorIds: [],
      durationMs: 3000,
    },
    {
      id: 'fs-monolith-appear',
      type: 'actorAppearance',
      actorIds: ['mycelial-monolith'],
      durationMs: 2500,
    },
    {
      id: 'fs-beetle-infection',
      type: 'enemyInfection',
      actorIds: ['boolean-beetle'],
      durationMs: 2000,
    },
    {
      id: 'fs-minions',
      type: 'minionAppearance',
      actorIds: ['parse-mantis-infected', 'mutable-widow-infected', 'cast-hornet-infected'],
      durationMs: 2000,
    },
    {
      id: 'fs-warning',
      type: 'warning',
      actorIds: ['v4lk'],
      dialogueKey: 'finalSequence.warning.01',
      completionSignal: 'warningAcknowledged',
    },
    {
      id: 'fs-lock-on',
      type: 'extractionLockOn',
      actorIds: ['senior-engineer', 'v4lk'],
      durationMs: 1500,
    },
    {
      id: 'fs-extract-senior',
      type: 'actorExtraction',
      actorIds: ['senior-engineer'],
      durationMs: 2000,
    },
    {
      id: 'fs-extract-v4lk',
      type: 'actorExtraction',
      actorIds: ['v4lk'],
      durationMs: 1500,
    },
    {
      id: 'fs-fade-end',
      type: 'demoEndTransition',
      actorIds: [],
      completionSignal: 'demoEndReady',
    },
  ],
  terminalState: 'DemoEnd',
};
