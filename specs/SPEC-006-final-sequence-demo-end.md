# SPEC-006 — Mycelial Monolith, extracción y cierre del demo

- **Estado:** Aprobado
- **Versión:** 1.0
- **Fecha:** 2026-08-07
- **Tarea:** TASK-600
- **Requisitos:** REQ-FINAL-001
- **Autoridad:** Esta SPEC concreta el sexto y último incremento jugable sin modificar el alcance definido por SPEC-000.

## 1. Objetivo

Cerrar el demo con una secuencia narrativa dirigida por datos tras la derrota de Boolean Beetle:

```text
encounterCompleted → Transitioning → finalSequenceReady → FinalSequence → extractionComplete → DemoEnd
```

El jugador presencia la aparición de Mycelial Monolith, la infección de enemies anteriores, la advertencia de V4LK y la extracción de emergencia. El demo termina sin comunicar derrota del Monolith ni victoria.

## 2. Alcance

Incluye:

- `FinalSequenceController` dirigido por datos (`final-sequence.json`);
- 10 pasos narrativos deterministas con señales de avance;
- aparición de Mycelial Monolith (entidad narrativa, sin HP);
- corrupción progresiva del escenario;
- infección y reactivación de Boolean Beetle;
- aparición de minions infectados como entidades narrativas;
- diálogos localizados de V4LK (advertencia y extracción);
- extracción del Senior y de V4LK;
- fundido y transición a `DemoEnd`;
- `DemoEndScene` con tarjeta final localizada;
- opciones: reiniciar o salir al menú;
- bloqueo completo de input de gameplay durante `FinalSequence`.

No incluye:

- HP, BossPhase, combate ni Challenges contra Mycelial Monolith;
- IA completa de minions (solo entidades visuales);
- audio;
- victoria ni pantalla de créditos.

## 3. FinalSequenceController

### 3.1 Principios

- Dirigido por datos: lee `FinalSequenceConfig` con pasos tipados.
- Cada paso define: id, type, actorIds, effectKey, dialogueKey, durationMs, completionSignal.
- El controlador avanza al siguiente paso cuando se cumple la condición del paso actual.
- Una señal faltante produce un timeout con diagnóstico (no bloquea indefinidamente).
- No hay Challenges, Score, ni Streak activos durante `FinalSequence`.
- El input de gameplay está completamente bloqueado.

### 3.2 Pasos de la secuencia

| # | id | type | actorIds | Duración/Señal | Descripción |
|---|---|---|---|---|---|
| 1 | `fs-dialogue-01` | dialogue | senior, v4lk | dialogueKey | Senior y V4LK interactúan tras la victoria |
| 2 | `fs-corruption` | environmentCorruption | — | 3000ms | El hábitat comienza a corromperse visualmente |
| 3 | `fs-monolith-appear` | actorAppearance | mycelial-monolith | 2500ms | Mycelial Monolith aparece con efectos |
| 4 | `fs-beetle-infection` | enemyInfection | boolean-beetle | 2000ms | Boolean Beetle es infectado y reactivado |
| 5 | `fs-minions` | minionAppearance | parse-mantis-infected, mutable-widow-infected, cast-hornet-infected | 2000ms | Aparecen versiones infectadas |
| 6 | `fs-warning` | warning | v4lk | dialogueKey | V4LK advierte que el enemigo es demasiado poderoso |
| 7 | `fs-lock-on` | extractionLockOn | senior, v4lk | 1500ms | Lock-on de extracción |
| 8 | `fs-extract-senior` | actorExtraction | senior-engineer | 2000ms | Senior desaparece del escenario |
| 9 | `fs-extract-v4lk` | actorExtraction | v4lk | 1500ms | V4LK desaparece |
| 10 | `fs-fade-end` | demoEndTransition | — | demoEndReady | Fundido y transición a DemoEnd |

### 3.3 Condiciones de avance

- `dialogue`: avanza al completar el diálogo (Enter/clic o auto-advance después de delay).
- `environmentCorruption`: avanza tras durationMs.
- `actorAppearance`: avanza tras durationMs (animación completa).
- `enemyInfection`: avanza tras durationMs.
- `minionAppearance`: avanza tras durationMs.
- `warning`: avanza al completar diálogo.
- `extractionLockOn`: avanza tras durationMs.
- `actorExtraction`: avanza tras durationMs (animación completa).
- `fade`: avanza al completar fade-out.
- `demoEndTransition`: emite `extractionComplete`.

### 3.4 Timeout de seguridad

Si un paso no completa en 30 segundos, el controlador:
1. Registra un warning en consola con el step ID.
2. Avanza al siguiente paso forzosamente.
3. No bloquea el demo indefinidamente.

## 4. Mycelial Monolith

- Entidad exclusivamente narrativa.
- No tiene HP, fases, barra de vida ni respuesta a Challenges.
- Aparece con la animación `monolith.idle` y efectos de corrupción.
- Assets: `monolith.idle`, `monolith.spore-injection`, `monolith.dependency-takeover`, `monolith.corruption`, `monolith.dependency-network`.
- Escala visual: significativamente mayor que Boolean Beetle (192×192 frames).

## 5. Minions infectados

- Entidades visuales sin IA completa.
- No atacan, no tienen HP, no generan Challenges.
- Sprites: `enemy.*.infected-idle` + `infected-enemy.summon`.
- Aparecen brevemente para reforzar la amenaza narrativa.

## 6. DemoEndScene

### 6.1 Contenido

- Tarjeta final: `ui.demo-end.card` (960×540).
- Texto localizado: agradecimiento y cierre sin afirmar victoria.
- No muestra Score, estadísticas ni resultados de la Run.

### 6.2 Opciones

- **Reiniciar** (Enter) → `restartRequested` → `Intro` (conserva idioma).
- **Menú** (Escape) → `exitToMenuRequested` → `Menu` (conserva idioma).

## 7. Localización

Claves nuevas:

| Grupo | Ejemplos |
|---|---|
| FinalSequence diálogos | `finalSequence.dialogue.01`, `finalSequence.warning.01` |
| DemoEnd | `demoEnd.title`, `demoEnd.thanks`, `demoEnd.restart`, `demoEnd.exitToMenu` |

## 8. Assets consumidos

| Clave | Uso |
|---|---|
| `monolith.idle` | Idle del Monolith |
| `monolith.spore-injection` | Efecto de esporas |
| `monolith.dependency-takeover` | Animación de takeover |
| `monolith.corruption` | Corrupción progresiva |
| `monolith.dependency-network` | Red de dependencias |
| `infected-enemy.summon` | Summon de minions |
| `enemy.parse-mantis.infected-idle` | Minion infectado |
| `enemy.mutable-widow.infected-idle` | Minion infectado |
| `enemy.cast-hornet.infected-idle` | Minion infectado |
| `enemy.boolean-beetle.infected-idle` | Beetle reactivado |
| `enemy.boolean-beetle.infection-reactivation` | Reactivación |
| `extraction.senior-engineer` | Extracción del Senior |
| `ui.demo-end.card` | Tarjeta final |

## 9. Criterios de aceptación de SPEC-006

1. `FinalSequence` inicia tras `finalSequenceReady` después de Boolean Beetle.
2. Los 10 pasos se ejecutan en orden determinista.
3. El input de gameplay está completamente bloqueado durante `FinalSequence`.
4. Mycelial Monolith aparece sin HP, fases ni Challenges.
5. Boolean Beetle es infectado y reactivado visualmente.
6. Los minions infectados aparecen como entidades narrativas (sin IA).
7. V4LK advierte y ordena huir con diálogo localizado.
8. Senior y V4LK son extraídos en secuencia.
9. Ambos actores desaparecen correctamente del escenario.
10. El fundido transiciona a `DemoEnd` vía `extractionComplete`.
11. `DemoEndScene` muestra tarjeta final sin afirmar victoria.
12. Reiniciar va a Intro conservando idioma.
13. Salir al menú va a Menu conservando idioma.
14. El timeout de 30s por paso evita bloqueo indefinido.
15. No existen errores de consola en el flujo válido.
16. Todos los textos están localizados en español e inglés.

## 10. Trazabilidad

| Requisito | Criterios |
|---|---|
| REQ-FINAL-001 §1 | Criterio 1 |
| REQ-FINAL-001 §2-6 | Criterios 2, 4-6 |
| REQ-FINAL-001 §7-8 | Criterios 7-9 |
| REQ-FINAL-001 §9 | Criterio 10-11 |
| REQ-RESET-001 | Criterios 12-13 |

## 11. Aprobación

- [x] 10 pasos narrativos deterministas;
- [x] Monolith sin HP/BossPhase/Challenge;
- [x] Minions como entidades visuales sin IA;
- [x] Extracción Senior → V4LK → fundido;
- [x] DemoEndScene sin victoria;
- [x] 16 criterios de aceptación;
- [x] Timeout de seguridad por paso.

La aprobación autoriza TASK-601 a TASK-605.
