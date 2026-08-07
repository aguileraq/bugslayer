import type { DialogueSequence } from '../../types';

export const OFFICE_WAKE_DIALOGUE: DialogueSequence = {
  id: 'office.wake',
  steps: [
    {
      speaker: 'senior',
      textKey: 'dialogue.office.wake.01',
    },
    {
      speaker: 'senior',
      textKey: 'dialogue.office.wake.02',
    },
  ],
};

export const OFFICE_V4LK_INTRO_DIALOGUE: DialogueSequence = {
  id: 'office.v4lk-intro',
  steps: [
    {
      speaker: 'v4lk',
      textKey: 'dialogue.office.v4lk.01',
    },
    {
      speaker: 'senior',
      textKey: 'dialogue.office.v4lk.02',
    },
    {
      speaker: 'v4lk',
      textKey: 'dialogue.office.v4lk.03',
    },
    {
      speaker: 'v4lk',
      textKey: 'dialogue.office.v4lk.04',
    },
  ],
};

export const OFFICE_DIALOGUES = [
  OFFICE_WAKE_DIALOGUE,
  OFFICE_V4LK_INTRO_DIALOGUE,
] as const;
