import type {
  AssetCategory,
  AssetDefinition,
  AssetManifest,
  ImageAssetDefinition,
  SpriteSheetAssetDefinition,
  TilemapAssetDefinition,
} from '../types';

const ROOT = 'assets';

function image(
  key: string,
  category: AssetCategory,
  path: string,
  width: number,
  height: number,
): ImageAssetDefinition {
  return {
    key,
    type: 'image',
    category,
    url: `${ROOT}/${path}`,
    required: true,
    expectedDimensions: { width, height },
  };
}

function sheet(
  key: string,
  category: AssetCategory,
  path: string,
  width: number,
  height: number,
  frameWidth: number,
  frameHeight: number,
): SpriteSheetAssetDefinition {
  return {
    key,
    type: 'spritesheet',
    category,
    url: `${ROOT}/${path}`,
    required: true,
    expectedDimensions: { width, height },
    frameConfig: { frameWidth, frameHeight },
  };
}

function tilemap(key: string, filename: string): TilemapAssetDefinition {
  return {
    key,
    type: 'tilemap',
    category: 'tilemap',
    url: `${ROOT}/tilemaps/${filename}`,
    required: false,
    format: 'tiled-json',
  };
}

const playerAssets = [
  sheet('player.idle', 'player', 'sprites/player/senior-engineer-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('player.walk', 'player', 'sprites/player/senior-engineer-walk-runtime-v1.png', 384, 512, 128, 128),
  sheet('player.attack.keyboard', 'player', 'sprites/player/senior-engineer-attack-keyboard-runtime-v1.png', 384, 512, 128, 128),
  sheet('player.damage', 'player', 'sprites/player/senior-engineer-damage-runtime-v1.png', 384, 512, 128, 128),
  sheet('player.defeat', 'player', 'sprites/player/senior-engineer-defeat-runtime-v1.png', 384, 512, 128, 128),
  sheet('player.wake-stand', 'player', 'sprites/player/senior-engineer-wake-stand-runtime-v2.png', 384, 384, 96, 96),
  sheet('extraction.senior-engineer', 'extraction', 'sprites/player/senior-engineer-emergency-extraction-runtime-v1.png', 768, 128, 128, 128),
] as const;

const enemyAssets = [
  sheet('enemy.parse-mantis.idle', 'enemy', 'sprites/enemies/parse-mantis-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.parse-mantis.damage', 'enemy', 'sprites/enemies/parse-mantis-damage-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.parse-mantis.defeat', 'enemy', 'sprites/enemies/parse-mantis-defeat-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.parse-mantis.linear-attack', 'enemy', 'sprites/enemies/parse-mantis-linear-attack-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.parse-mantis.infected-idle', 'infected-enemy', 'sprites/enemies/parse-mantis-infected-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.mutable-widow.idle', 'enemy', 'sprites/enemies/mutable-widow-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.mutable-widow.damage', 'enemy', 'sprites/enemies/mutable-widow-damage-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.mutable-widow.defeat', 'enemy', 'sprites/enemies/mutable-widow-defeat-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.mutable-widow.reassignment-volley', 'enemy', 'sprites/enemies/mutable-widow-reassignment-volley-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.mutable-widow.scope-web', 'enemy', 'sprites/enemies/mutable-widow-scope-web-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.mutable-widow.infected-idle', 'infected-enemy', 'sprites/enemies/mutable-widow-infected-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.idle', 'enemy', 'sprites/enemies/cast-hornet-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.flight', 'enemy', 'sprites/enemies/cast-hornet-flight-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.damage', 'enemy', 'sprites/enemies/cast-hornet-damage-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.defeat', 'enemy', 'sprites/enemies/cast-hornet-defeat-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.type-sting', 'enemy', 'sprites/enemies/cast-hornet-type-sting-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.casting-swarm', 'enemy', 'sprites/enemies/cast-hornet-casting-swarm-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.mismatch-dive', 'enemy', 'sprites/enemies/cast-hornet-mismatch-dive-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.type-shift', 'enemy', 'sprites/enemies/cast-hornet-type-shift-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.cast-hornet.infected-idle', 'infected-enemy', 'sprites/enemies/cast-hornet-infected-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.idle', 'enemy', 'sprites/enemies/boolean-beetle-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.move', 'enemy', 'sprites/enemies/boolean-beetle-heavy-movement-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.damage', 'enemy', 'sprites/enemies/boolean-beetle-damage-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.defeat', 'enemy', 'sprites/enemies/boolean-beetle-defeat-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.boolean-burst', 'enemy', 'sprites/enemies/boolean-beetle-boolean-burst-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.xor-crossfire', 'enemy', 'sprites/enemies/boolean-beetle-xor-crossfire-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.false-path', 'enemy', 'sprites/enemies/boolean-beetle-false-path-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.branch-charge', 'enemy', 'sprites/enemies/boolean-beetle-branch-charge-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.false-path-routes', 'enemy', 'sprites/enemies/boolean-beetle-false-path-decoy-routes-runtime-v1.png', 128, 128, 32, 32),
  sheet('enemy.boolean-beetle.infected-idle', 'infected-enemy', 'sprites/enemies/boolean-beetle-infected-idle-runtime-v1.png', 384, 512, 128, 128),
  sheet('enemy.boolean-beetle.infection-reactivation', 'infected-enemy', 'sprites/enemies/boolean-beetle-infection-reactivation-runtime-v1.png', 768, 128, 128, 128),
] as const;

const monolithAssets = [
  sheet('monolith.idle', 'mycelial-monolith', 'sprites/enemies/mycelial-monolith-idle-runtime-v1.png', 576, 768, 192, 192),
  sheet('monolith.spore-injection', 'mycelial-monolith', 'sprites/enemies/mycelial-monolith-spore-injection-runtime-v1.png', 576, 768, 192, 192),
  sheet('monolith.dependency-takeover', 'mycelial-monolith', 'sprites/enemies/mycelial-monolith-dependency-takeover-runtime-v1.png', 576, 768, 192, 192),
  sheet('monolith.corruption', 'mycelial-monolith', 'projectiles/mycelial-corruption-progressive-atlas-runtime-v1.png', 192, 512, 64, 64),
  sheet('monolith.dependency-network', 'mycelial-monolith', 'projectiles/mycelial-monolith-dependency-takeover-network-runtime-v1.png', 1024, 256, 256, 256),
  sheet('infected-enemy.summon', 'infected-enemy', 'projectiles/infected-minion-summon-runtime-v1.png', 768, 128, 128, 128),
] as const;

const projectileAssets = [
  sheet('projectile.parse-mantis.linear', 'projectile', 'projectiles/parse-mantis-linear-projectile-runtime-v1.png', 96, 128, 32, 32),
  sheet('impact.parse-mantis.linear', 'impact', 'projectiles/parse-mantis-linear-projectile-impact-runtime-v1.png', 128, 128, 32, 32),
  sheet('projectile.mutable-widow.reassignment-volley', 'projectile', 'projectiles/mutable-widow-reassignment-volley-projectile-runtime-v1.png', 96, 128, 32, 32),
  sheet('impact.mutable-widow.reassignment-volley', 'impact', 'projectiles/mutable-widow-reassignment-volley-impact-runtime-v1.png', 128, 128, 32, 32),
  sheet('projectile.mutable-widow.scope-web', 'projectile', 'projectiles/mutable-widow-scope-web-effects-runtime-v1.png', 128, 96, 32, 32),
  sheet('projectile.cast-hornet.casting-swarm', 'projectile', 'projectiles/cast-hornet-casting-swarm-projectiles-runtime-v1.png', 96, 128, 32, 32),
  sheet('impact.cast-hornet.casting-swarm', 'impact', 'projectiles/cast-hornet-casting-swarm-impact-runtime-v1.png', 128, 128, 32, 32),
  sheet('projectile.boolean-beetle.boolean-burst', 'projectile', 'projectiles/boolean-beetle-boolean-burst-projectiles-runtime-v1.png', 128, 64, 32, 32),
  sheet('impact.boolean-beetle.boolean-burst', 'impact', 'projectiles/boolean-beetle-boolean-burst-impact-runtime-v1.png', 128, 64, 32, 32),
  sheet('projectile.boolean-beetle.xor-crossfire', 'projectile', 'projectiles/boolean-beetle-xor-crossfire-projectiles-runtime-v1.png', 96, 256, 32, 32),
  sheet('impact.boolean-beetle.xor-crossfire', 'impact', 'projectiles/boolean-beetle-xor-crossfire-impact-runtime-v1.png', 128, 256, 32, 32),
  sheet('projectile.boolean-beetle.false-path', 'projectile', 'projectiles/boolean-beetle-false-path-projectiles-runtime-v1.png', 96, 256, 32, 32),
  sheet('impact.boolean-beetle.false-path', 'impact', 'projectiles/boolean-beetle-false-path-impact-runtime-v1.png', 128, 256, 32, 32),
  sheet('projectile.radial', 'projectile', 'projectiles/radial-projectile-runtime-v1.png', 96, 32, 32, 32),
  sheet('impact.radial', 'impact', 'projectiles/radial-projectile-impact-runtime-v1.png', 128, 32, 32, 32),
  sheet('projectile.monolith.spore-injection', 'projectile', 'projectiles/mycelial-monolith-spore-injection-projectile-runtime-v1.png', 96, 128, 32, 32),
  sheet('impact.monolith.spore-injection', 'impact', 'projectiles/mycelial-monolith-spore-injection-impact-runtime-v1.png', 128, 32, 32, 32),
] as const;

const worldAssets = [
  sheet('tileset.initial-office.base', 'tileset', 'tilesets/initial-office-base-tileset-runtime-v1.png', 256, 256, 32, 32),
  sheet('tileset.compilation-garden.base', 'tileset', 'tilesets/compilation-garden-base-tileset-runtime-v1.png', 256, 256, 32, 32),
  sheet('tileset.mutable-widow-lair.base', 'tileset', 'tilesets/mutable-widow-lair-base-tileset-runtime-v1.png', 256, 256, 32, 32),
  sheet('tileset.cast-hornet-aerial-router.base', 'tileset', 'tilesets/cast-hornet-aerial-router-base-tileset-runtime-v1.png', 256, 256, 32, 32),
  sheet('tileset.boolean-beetle-legacy-grove.base', 'tileset', 'tilesets/boolean-beetle-legacy-grove-base-tileset-runtime-v1.png', 256, 256, 32, 32),
  sheet('prop.initial-office.atlas', 'prop', 'tilesets/props/initial-office-props-atlas-runtime-v1.png', 256, 256, 64, 64),
  sheet('prop.compilation-garden.atlas', 'prop', 'tilesets/props/compilation-garden-props-atlas-runtime-v1.png', 256, 256, 64, 64),
  sheet('prop.mutable-widow-lair.atlas', 'prop', 'tilesets/props/mutable-widow-lair-props-atlas-runtime-v1.png', 256, 256, 64, 64),
  sheet('prop.cast-hornet-aerial-router.atlas', 'prop', 'tilesets/props/cast-hornet-aerial-router-props-atlas-runtime-v1.png', 256, 256, 64, 64),
  sheet('prop.boolean-beetle-legacy-grove.atlas', 'prop', 'tilesets/props/boolean-beetle-legacy-grove-props-atlas-runtime-v1.png', 256, 256, 64, 64),
  sheet('prop.initial-office.machinery-effects', 'prop', 'effects/environment/initial-office-machinery-effects-runtime-v1.png', 256, 256, 32, 32),
  sheet('prop.compilation-garden.machinery-effects', 'prop', 'effects/environment/compilation-garden-machinery-effects-runtime-v1.png', 192, 512, 64, 64),
  sheet('prop.mutable-widow-lair.machinery-effects', 'prop', 'effects/environment/mutable-widow-lair-machinery-effects-runtime-v1.png', 192, 512, 64, 64),
  sheet('prop.cast-hornet-aerial-router.machinery-effects', 'prop', 'effects/environment/cast-hornet-aerial-router-machinery-effects-runtime-v1.png', 192, 512, 64, 64),
  sheet('prop.boolean-beetle-legacy-grove.machinery-effects', 'prop', 'effects/environment/boolean-beetle-legacy-grove-machinery-effects-runtime-v1.png', 192, 512, 64, 64),
  tilemap('tilemap.initial-office', 'initial-office.json'),
  tilemap('tilemap.compilation-garden', 'compilation-garden.json'),
  tilemap('tilemap.mutable-widow-lair', 'mutable-widow-lair.json'),
  tilemap('tilemap.cast-hornet-aerial-router', 'cast-hornet-aerial-router.json'),
  tilemap('tilemap.boolean-beetle-legacy-grove', 'boolean-beetle-legacy-grove.json'),
] as const;

const interfaceAssets = [
  image('ui.logo', 'ui', 'ui/bugslayer_logo.png', 1254, 1254),
  image('ui.boot.background', 'ui', 'ui/bug-slayer-boot-screen-runtime-v1.png', 960, 540),
  image('ui.language.background', 'ui', 'ui/bug-slayer-language-select-background-runtime-v1.png', 960, 540),
  sheet('ui.language.button-states', 'ui', 'ui/bug-slayer-language-select-button-states-runtime-v1.png', 768, 72, 256, 72),
  image('ui.menu.background', 'ui', 'ui/bug-slayer-main-menu-background-runtime-v1.png', 960, 540),
  image('ui.intro.panel', 'ui', 'ui/bug-slayer-intro-panel-frame-runtime-v1.png', 800, 168),
  image('ui.challenge.typed-panel', 'ui', 'ui/bug-slayer-challenge-typed-panel-runtime-v1.png', 928, 144),
  image('ui.challenge.multiple-choice-panel', 'ui', 'ui/bug-slayer-challenge-multiple-choice-panel-runtime-v1.png', 928, 176),
  image('ui.combat-hud', 'ui', 'ui/bug-slayer-combat-hud-kit-runtime-v1.png', 960, 160),
  image('ui.pause.frame', 'ui', 'ui/bug-slayer-pause-menu-frame-runtime-v1.png', 480, 320),
  image('ui.tutorial-transition-kit', 'ui', 'ui/bug-slayer-tutorial-transition-kit-runtime-v1.png', 960, 256),
  sheet('ui.results.panels', 'ui', 'ui/bug-slayer-results-panels-runtime-v1.png', 1280, 400, 640, 400),
  sheet('ui.feedback.animations', 'ui', 'ui/bug-slayer-ui-feedback-animations-runtime-v1.png', 512, 640, 128, 128),
  sheet('ui.icons', 'icon', 'ui/bug-slayer-ui-icons-runtime-v1.png', 1024, 512, 128, 128),
  image('ui.demo-end.card', 'ui', 'ui/bug-slayer-demo-end-card-runtime-v1.png', 960, 540),
  sheet('ui.office.dialogue-window', 'ui', 'effects/initial-office-dialogue-window-runtime-v1.png', 448, 448, 448, 112),
] as const;

const v4lkAssets = [
  sheet('v4lk.materialize-idle', 'v4lk', 'sprites/v4lk/holographic-dachshund-materialize-idle-runtime-v1.png', 256, 256, 64, 64),
] as const;

const fontAsset: AssetDefinition = {
  key: 'font.geist-pixel-square',
  type: 'font',
  category: 'font',
  url: `${ROOT}/fonts/GeistPixel-Square.woff2`,
  required: true,
  family: 'Geist Pixel Square',
};

export const assetManifest = {
  version: '1.0.0',
  assets: [
    fontAsset,
    ...playerAssets,
    ...enemyAssets,
    ...monolithAssets,
    ...projectileAssets,
    ...worldAssets,
    ...interfaceAssets,
    ...v4lkAssets,
  ],
} as const satisfies AssetManifest;

export type RuntimeAssetKey = (typeof assetManifest.assets)[number]['key'];
