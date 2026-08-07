import type { TypedChallenge, MultipleChoiceChallenge } from '../../types';

export const TYPE_CHALLENGES: readonly (TypedChallenge | MultipleChoiceChallenge)[] = [
  {
    id: 'type-01',
    category: 'type',
    mode: 'typed',
    code: 'const n: number = 42;',
    instructionKey: 'challenge.type.01.instruction',
    damage: 25,
    timeLimitMs: 8000,
    acceptedAnswers: ['number'],
  },
  {
    id: 'type-02',
    category: 'type',
    mode: 'multiple-choice',
    code: 'function greet(): string {\n  return "hello";\n}',
    instructionKey: 'challenge.type.02.instruction',
    damage: 25,
    timeLimitMs: 8000,
    options: ['string', 'void', 'number'],
    correctIndex: 0,
  },
  {
    id: 'type-03',
    category: 'type',
    mode: 'typed',
    code: 'const flag: boolean = true;',
    instructionKey: 'challenge.type.03.instruction',
    damage: 25,
    timeLimitMs: 8000,
    acceptedAnswers: ['boolean'],
  },
];
