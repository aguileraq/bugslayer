export const DIALOGUE_SPEAKERS = ['senior', 'v4lk', 'system'] as const;

export type DialogueSpeaker = (typeof DIALOGUE_SPEAKERS)[number];

export interface DialogueStep {
  readonly speaker: DialogueSpeaker;
  readonly textKey: string;
  readonly parameters?: Readonly<Record<string, string | number>>;
}

export interface DialogueSequence {
  readonly id: string;
  readonly steps: readonly DialogueStep[];
}
