import type { FinalSequenceConfig } from '../types';

export const FINAL_SEQUENCE_CONFIG: FinalSequenceConfig = {
  steps: [
    {
      id: 'fs-dialogue-01',
      type: 'dialogue',
      actorIds: ['senior-engineer', 'v4lk'],
      dialogueKey: 'finalSequence.dialogue.01',
      durationMs: 4500,
      completionSignal: 'dialogueComplete',
    },
    {
      id: 'fs-corruption',
      type: 'environmentCorruption',
      actorIds: [],
      effectKey: 'monolith.corruption',
      durationMs: 3000,
    },
    {
      id: 'fs-monolith-appear',
      type: 'actorAppearance',
      actorIds: ['mycelial-monolith'],
      effectKey: 'monolith.idle',
      durationMs: 2500,
    },
    {
      id: 'fs-beetle-infection',
      type: 'enemyInfection',
      actorIds: ['boolean-beetle'],
      effectKey: 'enemy.boolean-beetle.infection-reactivation',
      durationMs: 2000,
    },
    {
      id: 'fs-minions',
      type: 'minionAppearance',
      actorIds: ['parse-mantis-infected', 'mutable-widow-infected', 'cast-hornet-infected'],
      effectKey: 'infected-enemy.summon',
      durationMs: 2000,
    },
    {
      id: 'fs-warning',
      type: 'warning',
      actorIds: ['v4lk'],
      dialogueKey: 'finalSequence.warning.01',
      durationMs: 4500,
      completionSignal: 'warningAcknowledged',
    },
    {
      id: 'fs-lock-on',
      type: 'extractionLockOn',
      actorIds: ['senior-engineer', 'v4lk'],
      effectKey: 'monolith.dependency-network',
      durationMs: 1500,
    },
    {
      id: 'fs-extract-senior',
      type: 'actorExtraction',
      actorIds: ['senior-engineer'],
      effectKey: 'extraction.senior-engineer',
      durationMs: 2000,
    },
    {
      id: 'fs-extract-v4lk',
      type: 'actorExtraction',
      actorIds: ['v4lk'],
      effectKey: 'v4lk.materialize-idle',
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
