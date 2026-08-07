import type { TypedChallenge, MultipleChoiceChallenge } from '../../types';

export const LOGIC_CHALLENGES: readonly (TypedChallenge | MultipleChoiceChallenge)[] = [
  {
    id: 'logic-01',
    category: 'logic',
    mode: 'typed',
    code: 'true && false',
    instructionKey: 'challenge.logic.01.instruction',
    damage: 25,
    timeLimitMs: 8000,
    acceptedAnswers: ['false'],
  },
  {
    id: 'logic-02',
    category: 'logic',
    mode: 'multiple-choice',
    code: '!true || false',
    instructionKey: 'challenge.logic.02.instruction',
    damage: 25,
    timeLimitMs: 8000,
    options: ['false', 'true', 'undefined'],
    correctIndex: 0,
  },
  {
    id: 'logic-03',
    category: 'logic',
    mode: 'typed',
    code: 'true ^ false',
    instructionKey: 'challenge.logic.03.instruction',
    damage: 25,
    timeLimitMs: 8000,
    acceptedAnswers: ['1', 'true'],
  },
];
