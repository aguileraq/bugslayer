import type { EncounterId } from './encounter';

export interface RunStatistics {
  readonly finalScore: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly maxStreak: number;
  readonly totalPlayTimeMs: number;
  readonly furthestEncounterId: EncounterId | null;
}
