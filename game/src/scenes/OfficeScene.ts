import Phaser from 'phaser';

import { GAME_DIMENSIONS } from '../foundation';
import { GameStateMachine } from '../core/GameStateMachine';
import { InputManager } from '../entities/InputManager';
import { Player, type CollisionRect } from '../entities/Player';
import { SessionSettings } from '../core/SessionSettings';
import { LocalizationStore } from '../localization/LocalizationStore';
import { INITIAL_LOCALE_BUNDLES } from '../data';
import {
  OFFICE_WAKE_DIALOGUE,
  OFFICE_V4LK_INTRO_DIALOGUE,
} from '../data/dialogues/office-dialogues';
import type { DialogueSequence, DialogueStep, GameState } from '../types';

const FONT_FAMILY = 'Geist Pixel Square';

const TILEMAP_KEY = 'tilemap.initial-office';
const TILESET_KEY = 'tileset.initial-office.base';
const PLAYER_IDLE_KEY = 'player.idle';
const PLAYER_WALK_KEY = 'player.walk';
const PLAYER_WAKE_KEY = 'player.wake-stand';
const V4LK_KEY = 'v4lk.materialize-idle';
const MACHINERY_KEY = 'prop.initial-office.machinery-effects';
const DIALOGUE_WINDOW_KEY = 'ui.office.dialogue-window';

const COLORS = {
  dialogueBg: 0x061526,
  dialogueBorder: 0x1b6f8d,
  speakerSenior: '#d8fbff',
  speakerV4lk: '#69f7ff',
  speakerSystem: '#9eb8c7',
  textBody: '#d8fbff',
  promptHint: '#6b8a99',
} as const;

interface TilemapObject {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

type OfficePhase =
  | 'wake-animation'
  | 'wake-dialogue'
  | 'exploration'
  | 'c3-interaction'
  | 'v4lk-dialogue'
  | 'exit-enabled'
  | 'transitioning';

export class OfficeScene extends Phaser.Scene {
  #stateMachine!: GameStateMachine;
  #inputManager!: InputManager;
  #player!: Player;
  #settings!: SessionSettings;
  #localization!: LocalizationStore;
  #collisions: CollisionRect[] = [];
  #phase: OfficePhase = 'wake-animation';
  #playerSprite?: Phaser.GameObjects.Sprite;
  #v4lkSprite?: Phaser.GameObjects.Sprite;
  #dialogueContainer: Phaser.GameObjects.Container | undefined = undefined;
  #dialogueText?: Phaser.GameObjects.Text;
  #dialogueSpeaker?: Phaser.GameObjects.Text;
  #currentDialogue: DialogueSequence | undefined = undefined;
  #dialogueStepIndex = 0;
  #onDialogueComplete: (() => void) | null = null;
  #c3InteractionZone?: CollisionRect;
  #exitZone?: CollisionRect;
  #c3Interacted = false;
  #v4lkComplete = false;
  #c3Indicator: Phaser.GameObjects.Rectangle | undefined = undefined;
  #c3BlinkTimer?: Phaser.Time.TimerEvent;
  #promptText: Phaser.GameObjects.Text | undefined = undefined;
  #spawnC4 = { x: 224, y: 256 };
  #v4lkSpawnPos = { x: 640, y: 288 };

  public constructor() {
    super({ key: 'OfficeScene' });
  }

  public init(data: Record<string, unknown>): void {
    if (data['settings'] instanceof SessionSettings) {
      this.#settings = data['settings'];
    } else {
      this.#settings = new SessionSettings();
      this.#settings.setLanguage('es');
    }

    this.#localization = new LocalizationStore(INITIAL_LOCALE_BUNDLES, this.#settings);
    this.#stateMachine = new GameStateMachine('Intro');
    this.#inputManager = new InputManager();
    this.#player = new Player({ startX: this.#spawnC4.x, startY: this.#spawnC4.y });
    this.#phase = 'wake-animation';
    this.#c3Interacted = false;
    this.#v4lkComplete = false;
    this.#dialogueStepIndex = 0;
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#07111f');
    this.renderTilemap();
    this.loadTilemapData();
    this.createPlayerSprite();
    this.createC3Indicator();
    this.setupInput();
    this.startWakeSequence();
  }

  public override update(_time: number, delta: number): void {
    const state = this.#stateMachine.state;

    this.processInput(state);

    if (state === 'Exploration') {
      const intent = this.#inputManager.movementIntent();
      this.#player.applyIntent(intent.x, intent.y, state);
      this.#player.update(delta, this.#collisions);
      this.updatePlayerSprite();
      this.checkInteractions();
    }
  }

  // ─── Tilemap rendering ──────────────────────────────────────

  private renderTilemap(): void {
    // Create the visual tilemap using Phaser's tilemap system
    const map = this.make.tilemap({ key: TILEMAP_KEY });
    if (map === undefined) return;

    const tileset = map.addTilesetImage('initial-office-base', TILESET_KEY);
    if (tileset === null) return;

    // Render tile layers
    const groundLayer = map.createLayer('ground', tileset);
    if (groundLayer !== null) {
      groundLayer.setDepth(0);
    }

    const wallsLayer = map.createLayer('walls', tileset);
    if (wallsLayer !== null) {
      wallsLayer.setDepth(1);
    }
  }

  // ─── Tilemap data ──────────────────────────────────────────

  private loadTilemapData(): void {
    // Extract collision rects and spawn positions from tilemap cache
    const tilemapData = this.cache.tilemap.get(TILEMAP_KEY);
    if (tilemapData === undefined) {
      // Fallback: use default collision bounds if tilemap not loaded
      this.#collisions = [
        { x: 0, y: 0, width: 960, height: 64 },
        { x: 0, y: 480, width: 960, height: 60 },
        { x: 0, y: 0, width: 64, height: 540 },
        { x: 896, y: 0, width: 64, height: 540 },
      ];
      return;
    }

    const data = tilemapData.data;
    if (data === undefined || data === null) return;

    // Parse object layers
    const layers = (data as { layers?: unknown[] }).layers;
    if (!Array.isArray(layers)) return;

    for (const layer of layers) {
      const layerObj = layer as { name?: string; type?: string; objects?: TilemapObject[] };
      if (layerObj.type !== 'objectgroup') continue;

      if (layerObj.name === 'collisions' && Array.isArray(layerObj.objects)) {
        for (const obj of layerObj.objects) {
          this.#collisions.push({ x: obj.x, y: obj.y, width: obj.width, height: obj.height });
        }
      }

      if (layerObj.name === 'spawns' && Array.isArray(layerObj.objects)) {
        for (const obj of layerObj.objects) {
          if (obj.name === 'spawn-c4') {
            this.#spawnC4 = { x: obj.x, y: obj.y };
            this.#player.setPosition(obj.x, obj.y);
          }
          if (obj.name === 'v4lk-spawn') {
            this.#v4lkSpawnPos = { x: obj.x, y: obj.y };
          }
        }
      }

      if (layerObj.name === 'interactions' && Array.isArray(layerObj.objects)) {
        for (const obj of layerObj.objects) {
          if (obj.name === 'computer-c3') {
            this.#c3InteractionZone = { x: obj.x, y: obj.y, width: obj.width, height: obj.height };
          }
          if (obj.name === 'exit') {
            this.#exitZone = { x: obj.x, y: obj.y, width: obj.width, height: obj.height };
          }
        }
      }
    }
  }

  // ─── Player sprite ─────────────────────────────────────────

  private createPlayerSprite(): void {
    // Create animations from spritesheets
    // player.idle: 384×512, 128×128 frames → 3 cols × 4 rows
    // Row 0 (frames 0-2): down, Row 1 (3-5): left, Row 2 (6-8): right, Row 3 (9-11): up
    if (!this.anims.exists('player-idle-down')) {
      this.anims.create({ key: 'player-idle-down', frames: this.anims.generateFrameNumbers(PLAYER_IDLE_KEY, { start: 0, end: 2 }), frameRate: 4, repeat: -1 });
      this.anims.create({ key: 'player-idle-left', frames: this.anims.generateFrameNumbers(PLAYER_IDLE_KEY, { start: 3, end: 5 }), frameRate: 4, repeat: -1 });
      this.anims.create({ key: 'player-idle-right', frames: this.anims.generateFrameNumbers(PLAYER_IDLE_KEY, { start: 6, end: 8 }), frameRate: 4, repeat: -1 });
      this.anims.create({ key: 'player-idle-up', frames: this.anims.generateFrameNumbers(PLAYER_IDLE_KEY, { start: 9, end: 11 }), frameRate: 4, repeat: -1 });
    }

    // player.walk: 384×512, 128×128 frames → same layout
    if (!this.anims.exists('player-walk-down')) {
      this.anims.create({ key: 'player-walk-down', frames: this.anims.generateFrameNumbers(PLAYER_WALK_KEY, { start: 0, end: 2 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'player-walk-left', frames: this.anims.generateFrameNumbers(PLAYER_WALK_KEY, { start: 3, end: 5 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'player-walk-right', frames: this.anims.generateFrameNumbers(PLAYER_WALK_KEY, { start: 6, end: 8 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'player-walk-up', frames: this.anims.generateFrameNumbers(PLAYER_WALK_KEY, { start: 9, end: 11 }), frameRate: 8, repeat: -1 });
    }

    // player.wake-stand: 384×384, 96×96 frames → 4×4 = 16 frames
    if (!this.anims.exists('player-wake')) {
      this.anims.create({
        key: 'player-wake',
        frames: this.anims.generateFrameNumbers(PLAYER_WAKE_KEY, { start: 0, end: 15 }),
        frameRate: 12,
        repeat: 0,
      });
    }

    this.#playerSprite = this.add
      .sprite(this.#player.x, this.#player.y, PLAYER_IDLE_KEY, 0)
      .setOrigin(0.5, 0.75)
      .setDisplaySize(64, 64)
      .setDepth(10);
  }

  private updatePlayerSprite(): void {
    if (this.#playerSprite === undefined) return;
    this.#playerSprite.setPosition(this.#player.x, this.#player.y);

    const dir = this.#player.direction;
    if (this.#player.moving) {
      const walkKey = `player-walk-${dir}`;
      if (this.#playerSprite.anims.currentAnim?.key !== walkKey) {
        this.#playerSprite.play(walkKey);
      }
    } else {
      const idleKey = `player-idle-${dir}`;
      if (this.#playerSprite.anims.currentAnim?.key !== idleKey) {
        this.#playerSprite.play(idleKey);
      }
    }
  }

  // ─── C3 indicator ──────────────────────────────────────────

  private createC3Indicator(): void {
    if (this.#c3InteractionZone === undefined) return;
    const zone = this.#c3InteractionZone;
    this.#c3Indicator = this.add
      .rectangle(
        zone.x + zone.width / 2,
        zone.y + zone.height / 2,
        40, 30,
        0x69f7ff, 0.4,
      )
      .setStrokeStyle(1, 0x69f7ff);

    // Blink effect
    this.#c3BlinkTimer = this.time.addEvent({
      delay: 600,
      loop: true,
      callback: () => {
        if (this.#c3Indicator !== undefined) {
          this.#c3Indicator.setVisible(!this.#c3Indicator.visible);
        }
      },
    });
  }

  // ─── Input ─────────────────────────────────────────────────

  private setupInput(): void {
    if (this.input.keyboard === null) return;

    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      this.#inputManager.keyDown(event.key);
    });
    this.input.keyboard.on('keyup', (event: KeyboardEvent) => {
      this.#inputManager.keyUp(event.key);
    });
    this.input.on('pointerdown', () => {
      // Click advances dialogue (during Intro wake or Dialogue state)
      if (this.#currentDialogue !== undefined) {
        this.advanceDialogue();
      }
    });
  }

  private processInput(state: GameState): void {
    // Dialogue advance: works during Intro (wake) and Dialogue states
    const hasDialogue = this.#currentDialogue !== undefined;
    if (hasDialogue && this.#inputManager.state.confirm) {
      this.advanceDialogue();
      return;
    }

    // Standard confirm (Enter) for Exploration/Dialogue/Paused
    if (this.#inputManager.hasConfirm(state)) {
      if (state === 'Dialogue' && hasDialogue) {
        this.advanceDialogue();
      } else if (state === 'Exploration') {
        this.tryInteract();
      }
    }

    // Pause (Escape)
    if (this.#inputManager.hasPause(state)) {
      if (state === 'Exploration') {
        this.#stateMachine.transition('manualPauseRequested', {
          cause: 'manual',
          returnState: 'Exploration',
        });
        this.showPauseOverlay();
      }
    }
  }

  // ─── Wake sequence ─────────────────────────────────────────

  private startWakeSequence(): void {
    this.#phase = 'wake-animation';

    // Play the wake-stand animation
    if (this.#playerSprite !== undefined) {
      this.#playerSprite.setDisplaySize(64, 64);
      this.#playerSprite.play('player-wake');
      this.#playerSprite.once('animationcomplete', () => {
        // Switch back to idle sprite after wake animation
        this.#playerSprite?.setTexture(PLAYER_IDLE_KEY, 0);
        this.#playerSprite?.play('player-idle-down');
        this.#phase = 'wake-dialogue';
        this.startDialogue(OFFICE_WAKE_DIALOGUE, () => {
          this.#stateMachine.transition('wakeDialogueComplete');
          this.#phase = 'exploration';
          this.showPromptIfNearC3();
        });
      });
    } else {
      // Fallback if sprite not ready
      this.time.delayedCall(1200, () => {
        this.#phase = 'wake-dialogue';
        this.startDialogue(OFFICE_WAKE_DIALOGUE, () => {
          this.#stateMachine.transition('wakeDialogueComplete');
          this.#phase = 'exploration';
          this.showPromptIfNearC3();
        });
      });
    }
  }

  // ─── Dialogue system ───────────────────────────────────────

  private startDialogue(sequence: DialogueSequence, onComplete: () => void): void {
    this.#currentDialogue = sequence;
    this.#dialogueStepIndex = 0;

    if (this.#stateMachine.state !== 'Dialogue') {
      if (this.#stateMachine.state === 'Intro') {
        // During intro, dialogue is part of the intro state
      } else {
        this.#stateMachine.transition('dialogueStarted');
      }
    }

    this.createDialogueUI();
    this.showCurrentDialogueStep();

    // Store completion callback
    this.#onDialogueComplete = onComplete;
  }

  private createDialogueUI(): void {
    const centerX = GAME_DIMENSIONS.width / 2;
    const y = GAME_DIMENSIONS.height - 120;

    this.#dialogueContainer?.destroy();
    this.#dialogueContainer = this.add.container(centerX, y);

    const bg = this.add
      .rectangle(0, 0, 700, 100, COLORS.dialogueBg, 0.95)
      .setStrokeStyle(2, COLORS.dialogueBorder);

    this.#dialogueSpeaker = this.add
      .text(-320, -35, '', {
        color: COLORS.speakerV4lk,
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
      });

    this.#dialogueText = this.add
      .text(-320, -10, '', {
        color: COLORS.textBody,
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        wordWrap: { width: 640 },
      });

    this.#dialogueContainer.add([bg, this.#dialogueSpeaker, this.#dialogueText]);
    this.#dialogueContainer.setDepth(100);
  }

  private showCurrentDialogueStep(): void {
    if (this.#currentDialogue === undefined) return;
    const step = this.#currentDialogue.steps[this.#dialogueStepIndex];
    if (step === undefined) return;

    const speakerColors: Record<string, string> = {
      senior: COLORS.speakerSenior,
      v4lk: COLORS.speakerV4lk,
      system: COLORS.speakerSystem,
    };

    const speakerNames: Record<string, string> = {
      senior: 'Senior Engineer',
      v4lk: 'V4LK',
      system: '',
    };

    this.#dialogueSpeaker?.setText(speakerNames[step.speaker] ?? '');
    this.#dialogueSpeaker?.setColor(speakerColors[step.speaker] ?? COLORS.textBody);

    const text = this.#localization.translate(step.textKey, step.parameters);
    this.#dialogueText?.setText(text);
  }

  private advanceDialogue(): void {
    if (this.#currentDialogue === undefined) return;

    this.#dialogueStepIndex++;

    if (this.#dialogueStepIndex >= this.#currentDialogue.steps.length) {
      this.closeDialogue();
      return;
    }

    this.showCurrentDialogueStep();
  }

  private closeDialogue(): void {
    this.#dialogueContainer?.destroy();
    this.#dialogueContainer = undefined;
    this.#currentDialogue = undefined;
    this.#dialogueStepIndex = 0;

    const onComplete = this.#onDialogueComplete;
    this.#onDialogueComplete = null;

    if (this.#stateMachine.state === 'Dialogue') {
      this.#stateMachine.transition('dialogueComplete');
    }

    if (onComplete !== null) {
      onComplete();
    }
  }

  // ─── Interactions ──────────────────────────────────────────

  private tryInteract(): void {
    if (this.#c3Interacted) return;
    if (this.#c3InteractionZone === undefined) return;

    const hitbox = this.#player.hitbox;
    if (!this.rectsOverlap(hitbox, this.#c3InteractionZone)) return;

    this.#c3Interacted = true;
    this.#phase = 'c3-interaction';
    this.hideC3Indicator();
    this.hidePrompt();
    this.startC3Interaction();
  }

  private startC3Interaction(): void {
    this.#stateMachine.transition('dialogueStarted');

    // Loading bar simulation (2 seconds per SPEC-002 §6.1)
    this.time.delayedCall(2000, () => {
      this.materializeV4LK();
    });
  }

  private materializeV4LK(): void {
    // Create V4LK sprite at spawn position
    this.#v4lkSprite = this.add
      .sprite(this.#v4lkSpawnPos.x, this.#v4lkSpawnPos.y, V4LK_KEY, 0)
      .setOrigin(0.5, 0.75)
      .setDisplaySize(40, 40)
      .setDepth(10);

    // Materialization animation (simulated delay)
    this.time.delayedCall(800, () => {
      this.#phase = 'v4lk-dialogue';
      this.startDialogue(OFFICE_V4LK_INTRO_DIALOGUE, () => {
        this.#v4lkComplete = true;
        this.#phase = 'exit-enabled';
        this.enableExit();
      });
    });
  }

  // ─── Exit ──────────────────────────────────────────────────

  private enableExit(): void {
    // Visual indicator at exit zone
    if (this.#exitZone !== undefined) {
      this.add
        .rectangle(
          this.#exitZone.x + this.#exitZone.width / 2,
          this.#exitZone.y + this.#exitZone.height / 2,
          this.#exitZone.width,
          this.#exitZone.height,
          0x69f7ff, 0.2,
        )
        .setStrokeStyle(1, 0x69f7ff)
        .setDepth(1);
    }
  }

  private checkInteractions(): void {
    // Check proximity to C3 for prompt
    if (!this.#c3Interacted && this.#c3InteractionZone !== undefined) {
      const hitbox = this.#player.hitbox;
      if (this.rectsOverlap(hitbox, this.#c3InteractionZone)) {
        this.showPrompt();
      } else {
        this.hidePrompt();
      }
    }

    // Check exit zone
    if (this.#v4lkComplete && this.#exitZone !== undefined) {
      const hitbox = this.#player.hitbox;
      if (this.rectsOverlap(hitbox, this.#exitZone)) {
        this.#phase = 'transitioning';
        this.#stateMachine.transition('officeExitReached');
        this.startTransitionOut();
      }
    }
  }

  private startTransitionOut(): void {
    // Fade out and transition to next scene (Encounter 1 placeholder)
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.on('camerafadeoutcomplete', () => {
      // Future: scene.start('GameScene') when SPEC-003 is implemented
      this.events.emit('officeComplete');
    });
  }

  // ─── Prompt ────────────────────────────────────────────────

  private showPromptIfNearC3(): void {
    if (this.#c3Interacted) return;
    if (this.#c3InteractionZone === undefined) return;
    const hitbox = this.#player.hitbox;
    if (this.rectsOverlap(hitbox, this.#c3InteractionZone)) {
      this.showPrompt();
    }
  }

  private showPrompt(): void {
    if (this.#promptText !== undefined) return;
    const text = this.#localization.translate('office.interact.prompt', {
      confirmKey: 'Enter',
    });
    this.#promptText = this.add
      .text(GAME_DIMENSIONS.width / 2, GAME_DIMENSIONS.height - 30, text, {
        color: COLORS.promptHint,
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
      })
      .setOrigin(0.5)
      .setDepth(50);
  }

  private hidePrompt(): void {
    this.#promptText?.destroy();
    this.#promptText = undefined;
  }

  // ─── Pause ─────────────────────────────────────────────────

  private showPauseOverlay(): void {
    // Simplified pause overlay — full implementation in TASK-205+
    const centerX = GAME_DIMENSIONS.width / 2;
    const centerY = GAME_DIMENSIONS.height / 2;

    const container = this.add.container(centerX, centerY).setDepth(200);
    const bg = this.add.rectangle(0, 0, 400, 250, 0x061526, 0.96).setStrokeStyle(2, 0x1b6f8d);
    const title = this.add
      .text(0, -80, this.#localization.translate('pause.title'), {
        color: '#69f7ff',
        fontFamily: FONT_FAMILY,
        fontSize: '28px',
      })
      .setOrigin(0.5);

    const continueText = this.add
      .text(0, -20, this.#localization.translate('pause.continue'), {
        color: '#d8fbff',
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const restartText = this.add
      .text(0, 20, this.#localization.translate('pause.restart'), {
        color: '#9eb8c7',
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const exitText = this.add
      .text(0, 60, this.#localization.translate('pause.exitToMenu'), {
        color: '#9eb8c7',
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    container.add([bg, title, continueText, restartText, exitText]);

    continueText.on('pointerdown', () => {
      container.destroy();
      this.#stateMachine.transition('resumeRequested');
    });

    restartText.on('pointerdown', () => {
      container.destroy();
      this.#stateMachine.transition('restartRequested');
      this.scene.restart({ settings: this.#settings });
    });

    exitText.on('pointerdown', () => {
      container.destroy();
      this.#stateMachine.transition('exitToMenuRequested');
      this.scene.start('MenuScene', { settings: this.#settings });
    });

    // Escape in pause = continue
    const escHandler = () => {
      container.destroy();
      this.#stateMachine.transition('resumeRequested');
      this.input.keyboard?.off('keydown-ESC', escHandler);
    };
    this.input.keyboard?.on('keydown-ESC', escHandler);
  }

  // ─── C3 indicator helpers ──────────────────────────────────

  private hideC3Indicator(): void {
    this.#c3BlinkTimer?.remove();
    this.#c3Indicator?.destroy();
    this.#c3Indicator = undefined;
  }

  // ─── Utilities ─────────────────────────────────────────────

  private rectsOverlap(
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number },
  ): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  public shutdown(): void {
    if (this.input.keyboard !== null) {
      this.input.keyboard.removeAllListeners();
    }
    this.input.removeAllListeners();
  }
}
