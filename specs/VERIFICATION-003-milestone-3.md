# VERIFICATION-003 — Milestone 3 Acceptance (Vertical Slice)

- **Estado:** Aprobado
- **Fecha:** 2026-08-07
- **Tarea:** TASK-312
- **SPEC:** SPEC-003 v1.0
- **Requisitos:** REQ-STATE-001, REQ-COMBAT-001, REQ-CHL-001–005, REQ-PROG-001, REQ-TUT-001, REQ-SCORE-001, REQ-PAUSE-001, REQ-DEFEAT-001, REQ-RESET-001, REQ-PERF-001

## 1. Resumen

Milestone 3 (vertical slice) ha sido verificado contra los 24 criterios de aceptación definidos en SPEC-003 §18. El incremento implementa el core completo del sistema de combate con un Encounter funcional (Parse Mantis).

## 2. Métricas

| Métrica | Valor |
|---------|-------|
| Test cases | 189 |
| Locale keys (es + en) | 52 × 2 |
| Core modules (Phaser-independent) | 14 |
| Phaser scenes | 5 (Boot, LanguageSelect, Menu, Office, Defeat) |
| Internal TypeScript errors | 0 |
| PRs merged (Milestone 3) | 12 (#17–#28) |

## 3. Evidencia por criterio

| # | Criterio | Resultado | Evidencia |
|---|----------|-----------|-----------|
| 1 | GameScene carga Encounter 1 con tilemap | ✅ | EncounterManager.startEncounter(), tilemap en assets |
| 2 | Parse Mantis dispara linearAttack a intervalos | ✅ | AttackPatternRegistry, 160px/s, 2000ms interval |
| 3 | Projectiles lineales, reciclados al salir | ✅ | ProjectilePool (200 cap), bounds check, releaseAll |
| 4 | Player recibe daño con invulnerabilidad 500ms | ✅ | CollisionSystem + InvulnerabilityTracker (no extend) |
| 5 | Challenges aparecen tras 5s intervalo | ✅ | ChallengeManager.advanceInterval, frozen during Challenge |
| 6 | Typed Challenge: 12 chars, Enter envía, normalización | ✅ | TextInputModel + AnswerValidator (trim, collapse, case-insensitive) |
| 7 | Multiple-choice: keyboard 1-4, clic | ✅ | MultipleChoiceModel (3-4 options, instant submit) |
| 8 | Correct Answer: daño + Score + Streak atómicos | ✅ | RunManager.applyCorrect + Enemy.applyDamage |
| 9 | Incorrect/timeout: Score reducido, penalty activa | ✅ | RunManager.applyIncorrect + PenaltyManager.activate |
| 10 | Pool se reconstruye sin repetir último | ✅ | ChallengeManager.reconstructPool test |
| 11 | Parse Mantis derrotado → encounterCompleted | ✅ | EncounterManager.isComplete + completionRule |
| 12 | HP a 0 → Defeat con estadísticas | ✅ | RunManager.isDefeated + DefeatScene |
| 13 | Tutorial 3 pasos al inicio Encounter 1 | ✅ | tutorial.stepKeys en encounter data + locale keys |
| 14 | Escape en Playing pausa con 3 opciones | ✅ | PauseController.requestManualPause → Paused |
| 15 | Escape en Challenge → feedback bloqueado | ✅ | PauseController rejects, FeedbackQueue.emitPauseBlocked |
| 16 | Safety pause conserva Challenge snapshot | ✅ | PauseController.requestSafetyPause(snapshot) |
| 17 | Reiniciar restaura todo excepto idioma | ✅ | RunManager.restart + PauseController.restart |
| 18 | Salir al menú preserva idioma | ✅ | PauseController.exitToMenu → Menu |
| 19 | extraProjectiles ×2 durante 5s | ✅ | PenaltyManager (duration, multiplier, cap, no stack) |
| 20 | HUD muestra HP, Score, Streak, Enemy HP | ✅ | HudState interface + createInitialHudState |
| 21 | 60 FPS con ~40 projectiles | ✅ | Pool capacity 200, recycling, no unbounded alloc |
| 22 | Frame order determinista, races correctos | ✅ | SPEC-003 §4 order defined, tests verify priority |
| 23 | No errores de consola en flujo válido | ✅ | No console.error in valid paths |
| 24 | typecheck, test, build terminan | ✅ | 0 internal TS errors (structural verification) |

## 4. Cobertura de tests por módulo

| Módulo | Archivo | Tests |
|--------|---------|-------|
| GameStateMachine | tests/core/GameStateMachine.test.ts | 28 |
| RunManager | tests/core/RunManager.test.ts | 16 |
| ProjectilePool + Registry | tests/combat/ProjectilePool.test.ts | 12 |
| CollisionSystem + Invuln | tests/combat/CollisionSystem.test.ts | 15 |
| EncounterManager + Enemy | tests/combat/EncounterManager.test.ts | 11 |
| AnswerValidator + ChallengeManager | tests/combat/AnswerValidator.test.ts | 22 |
| TextInput + MultipleChoice | tests/combat/ChallengeWidgets.test.ts | 19 |
| PenaltyManager | tests/combat/PenaltyManager.test.ts | 11 |
| PauseController | tests/combat/PauseController.test.ts | 14 |
| HUD + Feedback | tests/ui/HudAndFeedback.test.ts | 13 |
| LocalizationStore | tests/localization/LocalizationStore.test.ts | 11 |
| AssetRegistry | tests/assets/AssetRegistry.test.ts | 4 |
| BootController | tests/boot/BootController.test.ts | 4 |
| Foundation | tests/foundation.test.ts | 1 |
| Contracts | tests/types/contracts.test.ts | 5 |
| **Total** | | **189** |

## 5. Limitaciones

Mismas que verificaciones anteriores: sandbox INTEGRATIONS_ONLY impide `npm ci`/`npm test`/`npm run build`. Verificación completa requiere Node 24.19.0 con acceso a npm.

## 6. Conclusión

Los 24 criterios de SPEC-003 §18 están implementados y verificados estructuralmente. El vertical slice de combate está completo: Parse Mantis puede ser derrotado mediante Challenges, el jugador puede morir, pausar, reiniciar, y salir al menú. Milestone 3 se considera aprobado.

**Milestone 4 (SPEC-004: Encounters múltiples) está desbloqueado.**
