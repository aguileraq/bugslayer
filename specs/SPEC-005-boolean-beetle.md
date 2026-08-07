# SPEC-005 — Boolean Beetle: Subjefe Logic

- **Estado:** Aprobado
- **Versión:** 1.0
- **Fecha:** 2026-08-07
- **Tarea:** TASK-500
- **Requisitos:** REQ-PROG-001, REQ-COMBAT-001, REQ-CHL-001, REQ-FINAL-001
- **Autoridad:** Esta SPEC concreta el quinto incremento sin modificar el alcance definido por SPEC-000 ni la arquitectura de `design.md`.

## 1. Objetivo

Incorporar el Encounter 4 (Boolean Beetle) como el enfrentamiento jugable más difícil del demo, y producir la transición a `FinalSequence` al completarlo:

```text
Cast Hornet (completado) → Transitioning → Boolean Beetle → encounterCompleted → finalSequenceReady → FinalSequence
```

## 2. Alcance

Incluye:

- Encounter 4: un Boolean Beetle pesado con 4 ataques;
- registro de attack patterns: `beetle.booleanBurst`, `beetle.xorCrossfire`, `beetle.falsePath`, `beetle.branchCharge`;
- 3 Challenges Logic (completando los 12 totales del demo);
- tilemap y assets de la Arboleda de Memoria Legada;
- transición a `FinalSequence` al completar (no a un quinto Encounter);
- pruebas unitarias y de integración.

No incluye:

- Mycelial Monolith, infección, minions, FinalSequence (SPEC-006);
- HP, BossPhase ni Victory para Boolean Beetle;
- audio;
- DemoEndScene.

## 3. Boolean Beetle — Encounter 4

### 3.1 Configuración

| Campo | Valor |
|---|---|
| id | `boolean-beetle` |
| enemies | beetle-01 (150 HP) |
| damageTargetMode | `roundRobin` (single enemy, effectively direct) |
| completionRule | allRequiredEnemiesDefeated [beetle-01] |
| challengePool | logic-01, logic-02, logic-03 |
| challengeIntervalMs | 3500 (más agresivo) |
| defaultTimeLimitMs | 8000 |
| category | logic |

### 3.2 Características del enemy

- **Tamaño**: ~1.45× la altura del Senior, considerablemente más ancho (SPEC-000 §6.4).
- **Movimiento**: `heavy` — se desplaza lentamente (no estático como Parse Mantis).
- **HP**: 150 (mayor que cualquier otro enemy, requiere 6 respuestas correctas).
- **Sprites**: idle, heavy-movement, damage, defeat, ataques dedicados.
- **Posición inicial**: (480, 200) — centro del escenario.

### 3.3 Ataques

#### beetle.booleanBurst
- Ráfaga radial de proyectiles en abanico amplio.
- Proyectiles: configurable por `projectilesPerBurst` (base: 3).
- Velocidad: 130 px/s.
- Daño: 12 HP por proyectil.
- Intervalo: 2500 ms.
- Sprite: `projectile.boolean-beetle.boolean-burst`.

#### beetle.xorCrossfire
- Dos líneas cruzadas de proyectiles en X.
- Proyectiles: 4 por ráfaga (2 por línea).
- Velocidad: 150 px/s.
- Daño: 10 HP.
- Intervalo: 3000 ms.
- Sprite: `projectile.boolean-beetle.xor-crossfire`.

#### beetle.falsePath
- Crea señuelos (decoy routes) y un proyectil real entre ellos.
- Proyectiles: 1 real + 2 señuelos visuales (sin daño).
- Velocidad real: 140 px/s.
- Daño: 15 HP (el más dañino).
- Intervalo: 4000 ms.
- Sprites: `projectile.boolean-beetle.false-path`, señuelos desde `enemy.boolean-beetle.false-path-routes`.

#### beetle.branchCharge
- Hostile Attack corporal: el Beetle se desplaza rápidamente hacia el Player.
- No es un Projectile — es evaluado por CollisionSystem como ataque corporal.
- Daño: 20 HP al contacto.
- Duración del charge: 800 ms.
- Cooldown: 6000 ms.
- El Beetle regresa a su posición después del charge.
- Respeta InvulnerabilityTracker del Player.

### 3.4 Secuencia de ataques

El Boolean Beetle ejecuta sus ataques con intervalos staggered:
1. `booleanBurst` cada 2500 ms.
2. `xorCrossfire` cada 3000 ms (offset +1000 ms del inicio).
3. `falsePath` cada 4000 ms (offset +2000 ms).
4. `branchCharge` cada 6000 ms (offset +3000 ms).

Esto genera presión constante y variada sin sincronizar volleys.

### 3.5 Challenges Logic

| ID | Modo | Código | Instrucción | Respuestas | Daño |
|---|---|---|---|---|---|
| logic-01 | typed | `true && false` | ¿Cuál es el resultado? | `false` | 25 |
| logic-02 | multiple-choice | `!true \|\| false` | ¿Resultado de la expresión? | false (✓), true, undefined | 25 |
| logic-03 | typed | `true ^ false` | ¿Resultado XOR? | `1`, `true` | 25 |

- Con 6 respuestas correctas (6 × 25 = 150 HP) el Beetle queda derrotado.
- Los pools se reconstruyen sin repetición.

## 4. Transición a FinalSequence

### 4.1 Al completar Boolean Beetle

1. `encounterCompleted` emitido.
2. Estado → `Transitioning`.
3. Retirar todos los Projectiles, cancelar penalty.
4. Mostrar texto localizado: `transition.boolean-beetle.complete`.
5. NO avanzar a un quinto Encounter.
6. Emitir `finalSequenceReady`.
7. Estado → `FinalSequence`.

### 4.2 Verificación

- `EncounterManager.isLastEncounter` es `true` para Boolean Beetle.
- `advance()` retorna `false` (no hay siguiente Encounter).
- El código emite `finalSequenceReady` en vez de `nextEncounterReady`.
- `FinalSequence` se implementa en SPEC-006.

## 5. Assets consumidos

| Clave | Uso |
|---|---|
| `tileset.boolean-beetle-legacy-grove.base` | Tileset del Encounter 4 |
| `tilemap.boolean-beetle-legacy-grove` | Mapa de la Arboleda |
| `prop.boolean-beetle-legacy-grove.atlas` | Props decorativos |
| `prop.boolean-beetle-legacy-grove.machinery-effects` | Efectos ambientales |
| `enemy.boolean-beetle.idle` | Idle |
| `enemy.boolean-beetle.move` | Heavy movement |
| `enemy.boolean-beetle.damage` | Daño recibido |
| `enemy.boolean-beetle.defeat` | Derrota |
| `enemy.boolean-beetle.boolean-burst` | Animación Boolean Burst |
| `enemy.boolean-beetle.xor-crossfire` | Animación XOR Crossfire |
| `enemy.boolean-beetle.false-path` | Animación False Path |
| `enemy.boolean-beetle.branch-charge` | Animación Branch Charge |
| `enemy.boolean-beetle.false-path-routes` | Señuelos visuales |
| `projectile.boolean-beetle.boolean-burst` | Proyectiles burst |
| `impact.boolean-beetle.boolean-burst` | Impactos burst |
| `projectile.boolean-beetle.xor-crossfire` | Proyectiles XOR |
| `impact.boolean-beetle.xor-crossfire` | Impactos XOR |
| `projectile.boolean-beetle.false-path` | Proyectil real |
| `impact.boolean-beetle.false-path` | Impacto false path |

## 6. Localización

Claves nuevas:

| Grupo | Claves |
|---|---|
| Logic challenges | `challenge.logic.01-03.instruction` |
| Transición | `transition.boolean-beetle.complete` |

## 7. Criterios de aceptación de SPEC-005

1. Boolean Beetle aparece con 150 HP y movimiento heavy.
2. Los 4 ataques se ejecutan con intervalos staggered configurados.
3. `booleanBurst` produce ráfaga radial de proyectiles.
4. `xorCrossfire` produce líneas cruzadas de proyectiles.
5. `falsePath` produce señuelos visuales y un proyectil real dañino.
6. `branchCharge` es un ataque corporal que respeta InvulnerabilityTracker.
7. El Beetle regresa a su posición después de un branchCharge.
8. 6 Correct Answers (6 × 25 = 150) derrotan al Beetle.
9. Al completar el Encounter, se emite `finalSequenceReady` (no `nextEncounterReady`).
10. Los 3 Challenges Logic funcionan en ambas modalidades (typed + MC).
11. Los 12 Challenges totales del demo están definidos (3 por categoría).
12. No existe BossPhase, Victory, HP para Mycelial Monolith ni quinto Encounter.
13. No existen errores de consola en el flujo válido.
14. `npm run typecheck`, `npm test` y `npm run build` terminan correctamente.

## 8. Trazabilidad

| Requisito | Secciones |
|---|---|
| REQ-PROG-001 §5 | §3 (Boolean Beetle, Logic) |
| REQ-PROG-001 §13 | §4 (finalSequenceReady, no quinto Encounter) |
| REQ-COMBAT-001 §1 | §3.3-3.4 (ataques configurados) |
| REQ-CHL-001 §9 | §3.5 + criterio 11 (12 challenges total) |
| REQ-FINAL-001 §1 | §4 (transición a FinalSequence tras derrota) |

## 9. Aprobación

- [x] Boolean Beetle con 4 ataques y movimiento heavy;
- [x] branchCharge como ataque corporal (no Projectile);
- [x] 3 Challenges Logic completan el inventario de 12;
- [x] transición a FinalSequence (no quinto Encounter);
- [x] 14 criterios de aceptación.

La aprobación autoriza TASK-501, TASK-502 y TASK-503.
