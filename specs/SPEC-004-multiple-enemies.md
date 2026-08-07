# SPEC-004 — Encuentros múltiples: Mutable Widow y Cast Hornet

- **Estado:** Aprobado
- **Versión:** 1.0
- **Fecha:** 2026-08-07
- **Tarea:** TASK-401
- **Requisitos:** REQ-PROG-001, REQ-COMBAT-001, REQ-CHL-004, REQ-CHL-005
- **Autoridad:** Esta SPEC concreta el cuarto incremento sin modificar el alcance definido por SPEC-000 ni la arquitectura de `design.md`.

## 1. Objetivo

Incorporar los Encounters 2 y 3 al demo, demostrando combate contra múltiples enemigos simultáneos con `roundRobin` targeting:

```text
Parse Mantis (completado) → Transitioning → Mutable Widow → Transitioning → Cast Hornet → Transitioning
```

## 2. Alcance

Incluye:

- Encounter 2: dos Mutable Widows simultáneas con Reassignment Volley y Scope Web;
- Encounter 3: tres Cast Hornets voladores con Type Sting y Casting Swarm;
- registro de attack patterns: `widow.reassignmentVolley`, `widow.scopeWeb`, `hornet.typeSting`, `hornet.castingSwarm`;
- 3 Challenges Variable y 3 Challenges Type (6 nuevos);
- damageTargetMode `roundRobin` para ambos (decidido en TASK-400);
- completionRule `allRequiredEnemiesDefeated` para ambos;
- curación entre Encounters (30% HP aditivo con tope);
- transiciones localizadas entre Encounters;
- tilemaps/assets del Jardín de Compilación (ya cargado), Guarida y Router Aéreo;
- pruebas de targeting, derrota parcial, finalización y limpieza.

No incluye:

- Boolean Beetle (Encounter 4) ni FinalSequence;
- audio;
- nuevos mechanics beyond existing systems.

## 3. Mutable Widow — Encounter 2

### 3.1 Configuración

| Campo | Valor |
|---|---|
| id | `mutable-widow` |
| enemies | widow-01 (80 HP), widow-02 (80 HP) |
| damageTargetMode | `roundRobin` |
| completionRule | allRequiredEnemiesDefeated [widow-01, widow-02] |
| challengePool | variable-01, variable-02, variable-03 |
| challengeIntervalMs | 4500 |
| defaultTimeLimitMs | 8000 |
| category | variable |

### 3.2 Ataques

#### widow.reassignmentVolley
- 2 proyectiles lineales con spread angular hacia el Player.
- Velocidad: 140 px/s.
- Daño: 8 HP por proyectil.
- Intervalo: 1800ms (widow-01) / 2200ms (widow-02) — staggered.
- Sprites: `projectile.mutable-widow.reassignment-volley`, `impact.mutable-widow.reassignment-volley`.

#### widow.scopeWeb
- 1 proyectil lento en área.
- Velocidad: 80 px/s.
- Daño: 5 HP.
- Intervalo: 4000ms / 4500ms — staggered.
- Sprite: `projectile.mutable-widow.scope-web`.

### 3.3 Comportamiento con roundRobin

- Correct Answer 1 → daño a widow-01.
- Correct Answer 2 → daño a widow-02.
- Correct Answer 3 → daño a widow-01 (cycle continues).
- Al derrotar widow-01, roundRobin salta a widow-02 (siguiente activa).
- Al derrotar ambas → `encounterCompleted`.

### 3.4 Challenges Variable

| ID | Modo | Código | Instrucción | Respuestas | Daño |
|---|---|---|---|---|---|
| variable-01 | typed | `let x = 5; x = ` | ¿Cuál es el valor reasignado? | `10`, `"10"` | 25 |
| variable-02 | multiple-choice | `const arr = [1, 2, 3]` | ¿Es reasignable? | No (✓), Sí, Depende | 25 |
| variable-03 | typed | `let name = "Ada"; name = ` | Reasigna el valor | `"Bob"`, `'Bob'` | 25 |

## 4. Cast Hornet — Encounter 3

### 4.1 Configuración

| Campo | Valor |
|---|---|
| id | `cast-hornet` |
| enemies | hornet-01 (60 HP), hornet-02 (60 HP), hornet-03 (60 HP) |
| damageTargetMode | `roundRobin` |
| completionRule | allRequiredEnemiesDefeated [hornet-01, hornet-02, hornet-03] |
| challengePool | type-01, type-02, type-03 |
| challengeIntervalMs | 4000 |
| defaultTimeLimitMs | 8000 |
| category | type |

### 4.2 Ataques

#### hornet.typeSting
- 1 proyectil rápido lineal.
- Velocidad: 200 px/s.
- Daño: 12 HP.
- Intervalo: 2500/2800/3000ms — staggered por enemy.
- Sprites: `projectile.cast-hornet.casting-swarm` (reutiliza para simplificación).

#### hornet.castingSwarm
- 3 proyectiles en abanico.
- Velocidad: 120 px/s.
- Daño: 6 HP por proyectil.
- Intervalo: 3500/3800/4000ms — staggered.
- Sprite: `projectile.cast-hornet.casting-swarm`, `impact.cast-hornet.casting-swarm`.

### 4.3 Comportamiento con roundRobin

- Correct Answers se distribuyen cíclicamente entre los 3 Hornets activos.
- Al derrotar uno, el ciclo continúa entre los restantes.
- Al derrotar los 3 → `encounterCompleted`.
- Cada Hornet derrotado reduce la presión de ataque proporcionalmente.

### 4.4 Challenges Type

| ID | Modo | Código | Instrucción | Respuestas | Daño |
|---|---|---|---|---|---|
| type-01 | typed | `const n: number = 42` | ¿Cuál es el tipo? | `number` | 25 |
| type-02 | multiple-choice | `function greet(): string {}` | ¿Tipo de retorno? | string (✓), void, number | 25 |
| type-03 | typed | `const flag: boolean = true` | ¿Cuál es el tipo? | `boolean` | 25 |

## 5. Transiciones entre Encounters

### 5.1 Secuencia

1. Parse Mantis derrotado → `encounterCompleted` → `Transitioning`.
2. Retirar todos los Projectiles, cancelar extraProjectiles.
3. Mostrar texto localizado: `transition.parse-mantis.complete`.
4. Aplicar curación: `HP = min(HP + 0.30 × maxHp, maxHp)`.
5. Cargar tilemap/assets de Encounter 2 (Guarida de Mutable Widow).
6. `nextEncounterReady` → `Playing` → Encounter 2 inicia.
7. Repetir para Encounter 2 → 3.

### 5.2 Preservación

- Score y Streak se conservan entre Encounters.
- Estadísticas (correct, incorrect, time) continúan acumulando.
- El idioma no cambia.

## 6. Assets consumidos (adicionales a Milestone 3)

| Clave | Encounter |
|---|---|
| `tileset.mutable-widow-lair.base` | 2 |
| `tilemap.mutable-widow-lair` | 2 |
| `prop.mutable-widow-lair.atlas` | 2 |
| `enemy.mutable-widow.idle` | 2 |
| `enemy.mutable-widow.damage` | 2 |
| `enemy.mutable-widow.defeat` | 2 |
| `enemy.mutable-widow.reassignment-volley` | 2 |
| `enemy.mutable-widow.scope-web` | 2 |
| `projectile.mutable-widow.reassignment-volley` | 2 |
| `impact.mutable-widow.reassignment-volley` | 2 |
| `projectile.mutable-widow.scope-web` | 2 |
| `tileset.cast-hornet-aerial-router.base` | 3 |
| `tilemap.cast-hornet-aerial-router` | 3 |
| `prop.cast-hornet-aerial-router.atlas` | 3 |
| `enemy.cast-hornet.idle` | 3 |
| `enemy.cast-hornet.flight` | 3 |
| `enemy.cast-hornet.damage` | 3 |
| `enemy.cast-hornet.defeat` | 3 |
| `enemy.cast-hornet.type-sting` | 3 |
| `enemy.cast-hornet.casting-swarm` | 3 |
| `projectile.cast-hornet.casting-swarm` | 3 |
| `impact.cast-hornet.casting-swarm` | 3 |

Todos ya declarados en `AssetManifest.ts` y precargados durante Boot.

## 7. Localización

Claves nuevas:

| Grupo | Ejemplos |
|---|---|
| Variable challenges | `challenge.variable.01.instruction`, etc. |
| Type challenges | `challenge.type.01.instruction`, etc. |
| Transitions | `transition.mutable-widow.complete`, `transition.cast-hornet.complete` |

## 8. Criterios de aceptación de SPEC-004

1. Encounter 2 presenta dos Mutable Widows simultáneas con ataques staggered.
2. Encounter 3 presenta tres Cast Hornets simultáneos con ataques staggered.
3. roundRobin distribuye daño cíclicamente entre enemigos activos.
4. Al derrotar un enemy, roundRobin salta al siguiente activo.
5. Encounter se completa solo cuando todos los required enemies están derrotados.
6. Curación 30% (con cap) se aplica al iniciar Encounters 2 y 3.
7. Score y Streak se conservan entre Encounters.
8. Todos los Projectiles se retiran al completar un Encounter.
9. extraProjectiles se cancela al completar un Encounter.
10. Las transiciones muestran texto localizado.
11. Los 6 nuevos Challenges (3 Variable + 3 Type) funcionan con ambas modalidades.
12. Los attack patterns registrados producen proyectiles correctos.
13. No existen errores de consola en el flujo válido.
14. `npm run typecheck`, `npm test` y `npm run build` terminan correctamente.

## 9. Trazabilidad

| Requisito | Secciones y criterios |
|---|---|
| REQ-PROG-001 §2-5 | §3, §4, criterios 1-2 |
| REQ-PROG-001 §7 | §3.3, §4.3, criterio 5 |
| REQ-PROG-001 §8-12 | §5, criterios 6-9 |
| REQ-COMBAT-001 §1 | §3.2, §4.2, criterio 12 |
| REQ-CHL-004 §3 | §3.3, §4.3, criterio 3-4 |
| REQ-CHL-005 §5 | criterio 9 |

## 10. Aprobación

- [x] roundRobin para ambos Encounters;
- [x] completionRule allRequiredEnemiesDefeated;
- [x] 6 Challenges (Variable + Type) con ambas modalidades;
- [x] curación y preservación de Score/Streak;
- [x] attack patterns con staggered intervals;
- [x] 14 criterios de aceptación.

La aprobación autoriza TASK-402, TASK-403 y TASK-404.
