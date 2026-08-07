import { describe, expect, it, vi } from 'vitest';

import { FinalSequenceController } from '../../src/combat/FinalSequenceController';
import { FINAL_SEQUENCE_CONFIG } from '../../src/data/final-sequence';
import type { FinalSequenceConfig } from '../../src/types';

const simpleConfig: FinalSequenceConfig = {
  steps: [
    { id: 'step-1', type: 'environmentCorruption', actorIds: [], durationMs: 1000 },
    { id: 'step-2', type: 'dialogue', actorIds: ['v4lk'], completionSignal: 'dialogueDone' },
    { id: 'step-3', type: 'demoEndTransition', actorIds: [], completionSignal: 'endReady' },
  ],
  terminalState: 'DemoEnd',
};

describe('FinalSequenceController', () => {
  it('starts inactive and not completed', () => {
    const controller = new FinalSequenceController(simpleConfig);

    expect(controller.active).toBe(false);
    expect(controller.completed).toBe(false);
    expect(controller.currentIndex).toBe(0);
    expect(controller.totalSteps).toBe(3);
  });

  it('activates on start and notifies step start', () => {
    const onStepStart = vi.fn();
    const controller = new FinalSequenceController(simpleConfig, { onStepStart });

    controller.start();

    expect(controller.active).toBe(true);
    expect(onStepStart).toHaveBeenCalledWith(simpleConfig.steps[0], 0);
  });

  it('advances duration-based step after elapsed time', () => {
    const onStepComplete = vi.fn();
    const controller = new FinalSequenceController(simpleConfig, { onStepComplete });

    controller.start();
    controller.update(500);
    expect(controller.currentIndex).toBe(0);

    controller.update(500); // total 1000ms = durationMs
    expect(controller.currentIndex).toBe(1);
    expect(onStepComplete).toHaveBeenCalledWith(simpleConfig.steps[0], 0);
  });

  it('advances signal-based step when signal received', () => {
    const controller = new FinalSequenceController(simpleConfig);

    controller.start();
    controller.update(1000); // advance step-1 (duration)

    // Now at step-2 (signal-based)
    expect(controller.currentStep?.id).toBe('step-2');
    controller.update(5000); // time alone doesn't advance

    expect(controller.currentIndex).toBe(1); // still waiting

    controller.signal('dialogueDone');
    controller.update(0); // process signal

    expect(controller.currentIndex).toBe(2);
  });

  it('completes after all steps finish', () => {
    const onSequenceComplete = vi.fn();
    const controller = new FinalSequenceController(simpleConfig, { onSequenceComplete });

    controller.start();
    controller.update(1000); // step-1 done
    controller.signal('dialogueDone');
    controller.update(0); // step-2 done
    controller.signal('endReady');
    controller.update(0); // step-3 done

    expect(controller.completed).toBe(true);
    expect(controller.active).toBe(false);
    expect(onSequenceComplete).toHaveBeenCalledTimes(1);
    expect(controller.progress).toBe(1);
  });

  it('times out after 30s and advances forcefully', () => {
    const onStepTimeout = vi.fn();
    const controller = new FinalSequenceController(simpleConfig, { onStepTimeout });

    controller.start();
    controller.update(1000); // step-1 done (duration)

    // step-2 is signal-based, never receives signal
    controller.update(30_000); // timeout!

    expect(onStepTimeout).toHaveBeenCalledWith(simpleConfig.steps[1], 1);
    expect(controller.currentIndex).toBe(2); // advanced past stuck step
  });

  it('ignores wrong signal names', () => {
    const controller = new FinalSequenceController(simpleConfig);

    controller.start();
    controller.update(1000); // step-1

    controller.signal('wrongSignal');
    controller.update(0);

    expect(controller.currentIndex).toBe(1); // still at step-2
  });

  it('does not start twice', () => {
    const onStepStart = vi.fn();
    const controller = new FinalSequenceController(simpleConfig, { onStepStart });

    controller.start();
    controller.start(); // ignored

    expect(onStepStart).toHaveBeenCalledTimes(1);
  });

  it('reset allows restarting', () => {
    const controller = new FinalSequenceController(simpleConfig);

    controller.start();
    controller.update(1000);
    expect(controller.currentIndex).toBe(1);

    controller.reset();
    expect(controller.active).toBe(false);
    expect(controller.completed).toBe(false);
    expect(controller.currentIndex).toBe(0);

    controller.start();
    expect(controller.active).toBe(true);
  });

  it('works with the full FINAL_SEQUENCE_CONFIG (10 steps)', () => {
    const controller = new FinalSequenceController(FINAL_SEQUENCE_CONFIG);

    expect(controller.totalSteps).toBe(10);
    controller.start();
    expect(controller.currentStep?.id).toBe('fs-dialogue-01');
  });

  it('progress reflects advancement', () => {
    const controller = new FinalSequenceController(simpleConfig);

    controller.start();
    expect(controller.progress).toBeCloseTo(0);

    controller.update(1000); // step-1 done
    expect(controller.progress).toBeCloseTo(1 / 3, 1);

    controller.signal('dialogueDone');
    controller.update(0); // step-2 done
    expect(controller.progress).toBeCloseTo(2 / 3, 1);
  });
});
