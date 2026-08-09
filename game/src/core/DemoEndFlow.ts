import type { GameStateMachine, TransitionResult } from './GameStateMachine';
import type { SessionSettings } from './SessionSettings';

export type DemoEndDestination = 'OfficeScene' | 'MenuScene';

export interface DemoEndNavigation {
  readonly destination: DemoEndDestination;
  readonly settings: SessionSettings;
  readonly transition: TransitionResult;
}

export class DemoEndFlow {
  readonly #settings: SessionSettings;
  readonly #stateMachine: GameStateMachine;

  public constructor(
    settings: SessionSettings,
    stateMachine: GameStateMachine,
  ) {
    this.#settings = settings;
    this.#stateMachine = stateMachine;
  }

  public restart(): DemoEndNavigation {
    return this.navigate('restartRequested', 'OfficeScene');
  }

  public exitToMenu(): DemoEndNavigation {
    return this.navigate('exitToMenuRequested', 'MenuScene');
  }

  private navigate(
    event: 'restartRequested' | 'exitToMenuRequested',
    destination: DemoEndDestination,
  ): DemoEndNavigation {
    const transition = this.#stateMachine.transition(event);
    if (!transition.allowed) {
      throw new Error(
        `DemoEnd navigation "${event}" is not allowed from ${transition.from}.`,
      );
    }
    return { destination, settings: this.#settings, transition };
  }
}
