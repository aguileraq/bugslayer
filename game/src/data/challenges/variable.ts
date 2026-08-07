import type { TypedChallenge, MultipleChoiceChallenge } from '../../types';

export const VARIABLE_CHALLENGES: readonly (TypedChallenge | MultipleChoiceChallenge)[] = [
  {
    id: 'variable-01',
    category: 'variable',
    mode: 'typed',
    code: 'let x = 5;\nx = 10;',
    instructionKey: 'challenge.variable.01.instruction',
    damage: 25,
    timeLimitMs: 8000,
    acceptedAnswers: ['10'],
  },
  {
    id: 'variable-02',
    category: 'variable',
    mode: 'multiple-choice',
    code: 'const arr = [1, 2, 3];',
    instructionKey: 'challenge.variable.02.instruction',
    damage: 25,
    timeLimitMs: 8000,
    options: ['No', 'Sí', 'Depende'],
    correctIndex: 0,
  },
  {
    id: 'variable-03',
    category: 'variable',
    mode: 'typed',
    code: 'let name = "Ada";\nname = ',
    instructionKey: 'challenge.variable.03.instruction',
    damage: 25,
    timeLimitMs: 8000,
    acceptedAnswers: ['"Bob"', "'Bob'", 'Bob'],
  },
];
