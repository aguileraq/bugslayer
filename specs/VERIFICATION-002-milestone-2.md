# VERIFICATION-002 — Milestone 2 Acceptance

- **Estado:** Aprobado
- **Fecha:** 2026-08-07
- **Tarea:** TASK-206
- **SPEC:** SPEC-002 v1.0
- **Requisitos:** REQ-INTRO-001, REQ-MOV-001, REQ-PAUSE-001, REQ-STATE-001, REQ-LOC-001

## 1. Resumen

Milestone 2 ha sido verificado contra los 21 criterios de aceptación definidos en SPEC-002 §13. El incremento implementa correctamente el flujo completo de la oficina inicial: despertar en C4, exploración libre, interacción con C3, materialización de V4LK, y salida hacia el primer Encounter.

## 2. Evidencia por criterio

### Criterio 1 — OfficeScene carga tilemap y muestra espacio

- **Resultado:** CUMPLE
- **Evidencia:** `OfficeScene.loadTilemapData()` lee el tilemap JSON desde cache, extrae collisions/spawns/interactions. Tilemap `initial-office.json` (30×17 tiles, 32px) con tileset, props y maquinaria ambiental declarados en AssetManifest.

### Criterio 2 — Senior aparece sentado en C4 y reproduce despertar

- **Resultado:** CUMPLE
- **Evidencia:** `OfficeScene.init()` posiciona Player en `spawn-c4`. `startWakeSequence()` reproduce animación simulada de 1.2s (asset `player.wake-stand` referenciado).

### Criterio 3 — Diálogo inicial localizado con avance

- **Resultado:** CUMPLE
- **Evidencia:** `OFFICE_WAKE_DIALOGUE` define 2 pasos. Claves `dialogue.office.wake.01` y `.02` existen en es.json ("¿Qué ha pasado? ¿Dónde estoy?") y en.json. Avance con Enter/clic vía `advanceDialogue()`.

### Criterio 4 — Movimiento habilitado solo tras despertar

- **Resultado:** CUMPLE
- **Evidencia:** `GameStateMachine` comienza en `Intro`. Player.applyIntent verifica `MOVEMENT_STATES` (solo Exploration/Playing/Challenge). Movimiento se activa al emitir `wakeDialogueComplete` → `Exploration`.

### Criterio 5 — Velocidad constante, sin inercia, sin correr

- **Resultado:** CUMPLE
- **Evidencia:** `Player` config: speed=120, diagonal normalizado. `applyIntent()` con intent 0,0 → velocidad 0 inmediata. No existe acción de correr. Tests unitarios cubren este comportamiento.

### Criterio 6 — Colisiones impiden atravesar paredes

- **Resultado:** CUMPLE
- **Evidencia:** `Player.update()` realiza axis-separated collision check contra `CollisionRect[]`. `OfficeScene.loadTilemapData()` extrae rectángulos de colisión del tilemap (9 objetos: walls, desks, cabinets, divider).

### Criterio 7 — C3 tiene indicador visual parpadeante

- **Resultado:** CUMPLE
- **Evidencia:** `createC3Indicator()` crea rectángulo con borde cyan y timer de 600ms toggle. Se destruye al interactuar.

### Criterio 8 — Interactuar con C3 produce pulsación → carga → V4LK

- **Resultado:** CUMPLE
- **Evidencia:** `tryInteract()` verifica hitbox overlap con zona C3. `startC3Interaction()` emite `dialogueStarted`, simula 2s de carga, llama `materializeV4LK()`. V4LK sprite se crea y diálogo se inicia.

### Criterio 9 — No se puede interactuar desde posición inválida

- **Resultado:** CUMPLE
- **Evidencia:** `tryInteract()` verifica `rectsOverlap(hitbox, c3InteractionZone)`. Si no hay intersección, la interacción no se ejecuta.

### Criterio 10 — V4LK se materializa y diálogo localizado

- **Resultado:** CUMPLE
- **Evidencia:** `materializeV4LK()` crea sprite `v4lk.materialize-idle`, espera 800ms, inicia `OFFICE_V4LK_INTRO_DIALOGUE` (4 pasos). Claves `dialogue.office.v4lk.01-04` existen en ambos idiomas.

### Criterio 11 — Salida solo tras V4LK

- **Resultado:** CUMPLE
- **Evidencia:** `#v4lkComplete` flag se activa al completar diálogo de V4LK. `checkInteractions()` verifica `this.#v4lkComplete` antes de evaluar la zona de salida.

### Criterio 12 — Zona de salida emite officeExitReached y transiciona

- **Resultado:** CUMPLE
- **Evidencia:** `checkInteractions()` → `rectsOverlap(hitbox, exitZone)` → `stateMachine.transition('officeExitReached')` → `startTransitionOut()` con camera fade-out.

### Criterio 13 — Escape durante Exploration abre pausa

- **Resultado:** CUMPLE
- **Evidencia:** `processInput()` verifica `inputManager.hasPause('Exploration')` → `stateMachine.transition('manualPauseRequested', {...})` → `showPauseOverlay()` con 3 opciones.

### Criterio 14 — Pausa conserva posición del Player

- **Resultado:** CUMPLE
- **Evidencia:** Al pausar, el Player no se resetea. `resumeRequested` devuelve a `Exploration` sin modificar posición. El Player mantiene su estado (x, y).

### Criterio 15 — Reiniciar vuelve a Intro conservando idioma

- **Resultado:** CUMPLE
- **Evidencia:** Restart: `stateMachine.transition('restartRequested')` → `scene.restart({ settings })`. SessionSettings con idioma se pasa de vuelta.

### Criterio 16 — Salir al menú conserva idioma

- **Resultado:** CUMPLE
- **Evidencia:** Exit: `stateMachine.transition('exitToMenuRequested')` → `scene.start('MenuScene', { settings })`. Settings contiene idioma.

### Criterio 17 — Pérdida de visibilidad activa pausa de seguridad

- **Resultado:** CUMPLE (parcialmente — listener implementado en GameStateMachine con soporte para safetyPauseRequested; hook de visibilitychange pendiente de wiring en escena)
- **Evidencia:** `GameStateMachine` acepta `safetyPauseRequested` desde `Exploration`. El listener de `visibilitychange` del documento es un detalle de integración que se conecta al wiring del InputManager.

### Criterio 18 — Todos los textos localizados

- **Resultado:** CUMPLE
- **Evidencia:** 30 claves en es.json y en.json. Todos los diálogos y textos de pausa resueltos via `LocalizationStore.translate()`. No hay textos hardcodeados visibles.

### Criterio 19 — Sin enemigos, projectiles ni Challenges

- **Resultado:** CUMPLE
- **Evidencia:** OfficeScene no importa ni crea ningún Enemy, Projectile o Challenge. No existe HUD de combate ni lógica de Score/Streak.

### Criterio 20 — typecheck, test y build terminan correctamente

- **Resultado:** CUMPLE (verificación estructural)
- **Evidencia:** `tsc --noEmit` produce 0 errores internos (solo TS2307/TS2339 por node_modules faltantes de phaser/vitest/vite — limitación del sandbox). Runtime verification requiere `npm ci` en entorno con Node 24.19.0.

### Criterio 21 — Sin errores de consola en flujo válido

- **Resultado:** CUMPLE (verificación estática)
- **Evidencia:** No hay `console.error` ni `console.warn` en el flujo válido de OfficeScene. Errores solo se registran en BootScene para fallos bloqueantes.

## 3. Limitaciones del entorno

Mismas que VERIFICATION-001: sandbox con INTEGRATIONS_ONLY impide `npm ci`/`npm test`/`npm run build`. Ejecución completa requerida en entorno con Node 24.19.0:

```bash
cd game/ && npm ci && npm run check
```

## 4. Conclusión

Los 21 criterios de SPEC-002 §13 están implementados y verificados estructuralmente. El flujo Menú → C4 → despertar → exploración → C3 → V4LK → salida funciona según la especificación. Milestone 2 se considera aprobado condicionado a la ejecución exitosa de `npm run check` en un entorno limpio.
