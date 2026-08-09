import Phaser from 'phaser';

import { FinalSequenceController } from '../combat/FinalSequenceController';
import { GameStateMachine } from '../core/GameStateMachine';
import { SessionSettings } from '../core/SessionSettings';
import { FINAL_SEQUENCE_CONFIG, INITIAL_LOCALE_BUNDLES } from '../data';
import { GAME_DIMENSIONS } from '../foundation';
import { LocalizationStore } from '../localization/LocalizationStore';
import type {
  FinalSequenceActorId,
  FinalSequenceStep,
  FinalSequenceStepType,
} from '../types';

const FONT_FAMILY = 'Geist Pixel Square';
const SCENE_KEY = 'FinalSequenceScene';
const DEMO_END_SCENE_KEY = 'DemoEndScene';

const ACTOR_POSITIONS: Readonly<
  Record<FinalSequenceActorId, Readonly<{ x: number; y: number }>>
> = {
  'senior-engineer': { x: 285, y: 350 },
  v4lk: { x: 405, y: 375 },
  'mycelial-monolith': { x: 710, y: 245 },
  'boolean-beetle': { x: 650, y: 370 },
  'parse-mantis-infected': { x: 535, y: 330 },
  'mutable-widow-infected': { x: 750, y: 390 },
  'cast-hornet-infected': { x: 580, y: 220 },
  'boolean-beetle-infected': { x: 650, y: 370 },
};

const ACTOR_TEXTURES: Readonly<Partial<Record<FinalSequenceActorId, string>>> = {
  'senior-engineer': 'player.idle',
  v4lk: 'v4lk.materialize-idle',
  'mycelial-monolith': 'monolith.idle',
  'boolean-beetle': 'enemy.boolean-beetle.defeat',
  'parse-mantis-infected': 'enemy.parse-mantis.infected-idle',
  'mutable-widow-infected': 'enemy.mutable-widow.infected-idle',
  'cast-hornet-infected': 'enemy.cast-hornet.infected-idle',
  'boolean-beetle-infected': 'enemy.boolean-beetle.infected-idle',
};

interface FinalSequenceSceneData {
  readonly settings?: SessionSettings;
  readonly stateMachine?: GameStateMachine;
}

function isDialogueStep(type: FinalSequenceStepType): boolean {
  return type === 'dialogue' || type === 'warning';
}

export class FinalSequenceScene extends Phaser.Scene {
  #settings = new SessionSettings();
  #stateMachine = new GameStateMachine('Transitioning');
  #localization?: LocalizationStore;
  #controller: FinalSequenceController | undefined;
  readonly #actors = new Map<FinalSequenceActorId, Phaser.GameObjects.Sprite>();
  #corruption: Phaser.GameObjects.Sprite | undefined;
  #dependencyNetwork: Phaser.GameObjects.Sprite | undefined;
  #dialoguePanel?: Phaser.GameObjects.Rectangle;
  #dialogueText?: Phaser.GameObjects.Text;
  #enterHandler?: () => void;
  #pointerHandler?: () => void;

  public constructor() {
    super({ key: SCENE_KEY });
  }

  public init(data: FinalSequenceSceneData): void {
    this.#settings = data.settings ?? new SessionSettings();
    if (!this.#settings.hasLanguage) this.#settings.setLanguage('es');
    this.#stateMachine = data.stateMachine ?? new GameStateMachine('Transitioning');
    this.#localization = new LocalizationStore(
      INITIAL_LOCALE_BUNDLES,
      this.#settings,
    );
  }

  public create(): void {
    const transition = this.#stateMachine.transition('finalSequenceReady');
    if (!transition.allowed) {
      throw new Error(
        `FinalSequence cannot start from state "${transition.from}".`,
      );
    }

    this.createEnvironment();
    this.createActors();
    this.createDialogueOverlay();
    this.setupNarrativeInput();

    this.#controller = new FinalSequenceController(FINAL_SEQUENCE_CONFIG, {
      onStepStart: (step) => this.presentStep(step),
      onStepComplete: (step) => this.completeStepPresentation(step),
      onStepTimeout: (step) =>
        console.warn(`[FinalSequenceScene] Forced completion for "${step.id}".`),
      onSequenceComplete: () => this.finishSequence(),
    });
    this.#controller.start();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  public override update(_time: number, deltaMs: number): void {
    this.#controller?.update(deltaMs);
  }

  private createEnvironment(): void {
    this.cameras.main.setBackgroundColor('#02070d');
    if (this.textures.exists('tileset.boolean-beetle-legacy-grove.base')) {
      this.add
        .tileSprite(
          GAME_DIMENSIONS.width / 2,
          GAME_DIMENSIONS.height / 2,
          GAME_DIMENSIONS.width,
          GAME_DIMENSIONS.height,
          'tileset.boolean-beetle-legacy-grove.base',
        )
        .setTint(0x63706a)
        .setDepth(-10);
    }
    this.add
      .rectangle(
        GAME_DIMENSIONS.width / 2,
        GAME_DIMENSIONS.height / 2,
        GAME_DIMENSIONS.width,
        GAME_DIMENSIONS.height,
        0x02070d,
        0.38,
      )
      .setDepth(-9);

    this.#corruption = this.createEffect(
      'monolith.corruption',
      GAME_DIMENSIONS.width / 2,
      GAME_DIMENSIONS.height / 2,
      5,
    )
      ?.setAlpha(0.42)
      .setVisible(false)
      .setDepth(-2);
    this.#dependencyNetwork = this.createEffect(
      'monolith.dependency-network',
      GAME_DIMENSIONS.width / 2,
      GAME_DIMENSIONS.height / 2,
      2.15,
    )
      ?.setAlpha(0.68)
      .setVisible(false)
      .setDepth(8);
  }

  private createActors(): void {
    const initiallyVisible = new Set<FinalSequenceActorId>([
      'senior-engineer',
      'v4lk',
      'boolean-beetle',
    ]);
    for (const actorId of Object.keys(ACTOR_TEXTURES) as FinalSequenceActorId[]) {
      const texture = ACTOR_TEXTURES[actorId];
      if (texture === undefined || !this.textures.exists(texture)) continue;
      const position = ACTOR_POSITIONS[actorId];
      const sprite = this.add
        .sprite(position.x, position.y, texture, 0)
        .setDepth(position.y)
        .setVisible(initiallyVisible.has(actorId));
      if (actorId === 'mycelial-monolith') sprite.setScale(1.2);
      if (actorId === 'v4lk') sprite.setTint(0x69f7ff);
      if (actorId === 'boolean-beetle') sprite.setAlpha(0.62);
      this.#actors.set(actorId, sprite);
    }
  }

  private createDialogueOverlay(): void {
    this.#dialoguePanel = this.add
      .rectangle(
        GAME_DIMENSIONS.width / 2,
        GAME_DIMENSIONS.height - 82,
        820,
        116,
        0x061526,
        0.96,
      )
      .setStrokeStyle(2, 0x69f7ff)
      .setDepth(100)
      .setVisible(false);
    this.#dialogueText = this.add
      .text(
        GAME_DIMENSIONS.width / 2,
        GAME_DIMENSIONS.height - 82,
        '',
        {
          align: 'center',
          color: '#d8fbff',
          fontFamily: FONT_FAMILY,
          fontSize: '18px',
          wordWrap: { width: 750 },
        },
      )
      .setOrigin(0.5)
      .setDepth(101)
      .setVisible(false);
  }

  private setupNarrativeInput(): void {
    this.#enterHandler = () => this.completeDialogueStep();
    this.#pointerHandler = () => this.completeDialogueStep();
    this.input.keyboard?.on('keydown-ENTER', this.#enterHandler);
    this.input.on('pointerdown', this.#pointerHandler);
  }

  private completeDialogueStep(): void {
    const step = this.#controller?.currentStep;
    if (
      step === undefined ||
      !isDialogueStep(step.type) ||
      step.completionSignal === undefined
    ) {
      return;
    }
    this.#controller?.signal(step.completionSignal);
    this.#controller?.update(0);
  }

  private presentStep(step: FinalSequenceStep): void {
    if (isDialogueStep(step.type)) {
      this.showDialogue(step.dialogueKey);
      return;
    }

    switch (step.type) {
      case 'environmentCorruption':
        this.#corruption?.setVisible(true);
        break;
      case 'actorAppearance':
        this.showActor('mycelial-monolith');
        break;
      case 'enemyInfection':
        this.hideActor('boolean-beetle');
        this.showActor('boolean-beetle-infected');
        break;
      case 'minionAppearance':
        this.showActor('parse-mantis-infected');
        this.showActor('mutable-widow-infected');
        this.showActor('cast-hornet-infected');
        break;
      case 'extractionLockOn':
        this.#dependencyNetwork?.setVisible(true);
        break;
      case 'actorExtraction':
        this.presentExtraction(step.actorIds);
        break;
      case 'demoEndTransition':
        this.hideDialogue();
        this.cameras.main.once(
          Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
          () => {
            if (step.completionSignal !== undefined) {
              this.#controller?.signal(step.completionSignal);
              this.#controller?.update(0);
            }
          },
        );
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        break;
      case 'fade':
        this.cameras.main.fadeOut(step.durationMs ?? 1000, 0, 0, 0);
        break;
      case 'dialogue':
      case 'warning':
        break;
    }
  }

  private completeStepPresentation(step: FinalSequenceStep): void {
    if (isDialogueStep(step.type)) this.hideDialogue();
    if (step.type === 'extractionLockOn') {
      this.#dependencyNetwork?.setVisible(false);
    }
    if (step.type === 'actorExtraction') {
      for (const actorId of step.actorIds) this.hideActor(actorId);
    }
  }

  private presentExtraction(actorIds: readonly FinalSequenceActorId[]): void {
    for (const actorId of actorIds) {
      const actor = this.#actors.get(actorId);
      if (actor === undefined) continue;
      if (
        actorId === 'senior-engineer' &&
        this.textures.exists('extraction.senior-engineer')
      ) {
        actor.setTexture('extraction.senior-engineer', 0).setTint(0x69f7ff);
      } else {
        actor.setTint(0x69f7ff).setAlpha(0.48);
      }
    }
  }

  private showDialogue(key: string | undefined): void {
    if (key === undefined || this.#localization === undefined) return;
    this.#dialogueText?.setText(this.#localization.translate(key));
    this.#dialoguePanel?.setVisible(true);
    this.#dialogueText?.setVisible(true);
  }

  private hideDialogue(): void {
    this.#dialoguePanel?.setVisible(false);
    this.#dialogueText?.setVisible(false);
  }

  private showActor(actorId: FinalSequenceActorId): void {
    this.#actors.get(actorId)?.setVisible(true);
  }

  private hideActor(actorId: FinalSequenceActorId): void {
    this.#actors.get(actorId)?.setVisible(false);
  }

  private createEffect(
    texture: string,
    x: number,
    y: number,
    scale: number,
  ): Phaser.GameObjects.Sprite | undefined {
    if (!this.textures.exists(texture)) return undefined;
    return this.add.sprite(x, y, texture, 0).setScale(scale);
  }

  private finishSequence(): void {
    const transition = this.#stateMachine.transition('extractionComplete');
    if (!transition.allowed) {
      throw new Error(
        `FinalSequence cannot finish from state "${transition.from}".`,
      );
    }
    this.scene.start(DEMO_END_SCENE_KEY, {
      settings: this.#settings,
      stateMachine: this.#stateMachine,
    });
  }

  private shutdown(): void {
    if (this.#enterHandler !== undefined) {
      this.input.keyboard?.off('keydown-ENTER', this.#enterHandler);
    }
    if (this.#pointerHandler !== undefined) {
      this.input.off('pointerdown', this.#pointerHandler);
    }
    this.#actors.clear();
    this.#controller = undefined;
  }
}
