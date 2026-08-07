import type { TypedChallenge, MultipleChoiceChallenge } from '../../types';

export const SYNTAX_CHALLENGES: readonly (TypedChallenge | MultipleChoiceChallenge)[] = [
  {
    id: 'syntax-01',
    category: 'syntax',
    mode: 'typed',
    code: 'const total = 1',
    instructionKey: 'challenge.syntax.01.instruction',
    damage: 25,
    timeLimitMs: 8000,
    acceptedAnswers: [';'],
  },
  {
    id: 'syntax-02',
    category: 'syntax',
    mode: 'multiple-choice',
    code: 'const answer: number = 42;',
    instructionKey: 'challenge.syntax.02.instruction',
    damage: 25,
    timeLimitMs: 8000,
    options: ['number', 'string', 'boolean'],
    correctIndex: 0,
  },
  {
    id: 'syntax-03',
    category: 'syntax',
    mode: 'typed',
    code: 'let name: string = "Ada"',
    instructionKey: 'challenge.syntax.03.instruction',
    damage: 25,
    timeLimitMs: 8000,
    acceptedAnswers: [';'],
  },
];
