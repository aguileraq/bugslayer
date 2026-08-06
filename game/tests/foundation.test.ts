import { describe, expect, it } from 'vitest';

import { APP_TITLE, GAME_DIMENSIONS } from '../src/foundation';

describe('project foundation', () => {
  it('keeps the approved game identity and logical resolution', () => {
    expect(APP_TITLE).toBe('BugSlayer');
    expect(GAME_DIMENSIONS).toEqual({ width: 960, height: 540 });
  });
});
