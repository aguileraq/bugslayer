# VERIFICATION-006 — Milestone 6: cierre narrativo

- **Estado:** Aprobado para el alcance de SPEC-006
- **Fecha:** 2026-08-09
- **Tarea:** TASK-605
- **SPEC:** SPEC-006 v1.0
- **Requisitos:** REQ-FINAL-001, REQ-RESET-001

## 1. Resultado

El cierre narrativo cuenta con una ruta explícita desde la finalización de Boolean Beetle hacia `FinalSequence`, una escena Phaser que consume la secuencia dirigida por datos y una transición terminal a `DemoEnd`. Mycelial Monolith y los enemigos infectados se mantienen como entidades narrativas, sin HP, ataques, IA ni Challenges.

La secuencia conserva el orden determinista de diez pasos definido por SPEC-006: diálogo, corrupción, aparición del Monolith, infección de Boolean Beetle, minions, advertencia, lock-on, extracción del Senior, extracción de V4LK y fundido final.

## 2. Evidencia por criterio de SPEC-006

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | Inicia después de Boolean Beetle | Aprobado | `EncounterManager.completionDestination()` y transición `finalSequenceReady` |
| 2 | Diez pasos en orden determinista | Aprobado | `FinalSequenceNarrative.test.ts` y `FinalSequenceController.test.ts` |
| 3 | Input de gameplay bloqueado | Aprobado | `FinalSequenceScene` no crea controles de movimiento, pausa ni combate; solo avance narrativo |
| 4 | Monolith sin HP, fases ni Challenges | Aprobado | Configuración narrativa y prueba de ausencia de propiedades de combate |
| 5 | Boolean Beetle infectado visualmente | Aprobado | Paso `fs-beetle-infection` y asset `enemy.boolean-beetle.infection-reactivation` |
| 6 | Minions narrativos sin IA | Aprobado | Paso `fs-minions` y sprites infectados registrados |
| 7 | Advertencia localizada de V4LK | Aprobado | Claves `finalSequence.*` verificadas en español e inglés |
| 8 | Extracción Senior → V4LK | Aprobado | Pasos 8 y 9 y presentación de escena |
| 9 | Ambos actores desaparecen | Aprobado | Finalización de `actorExtraction` en `FinalSequenceScene` |
| 10 | Fundido vía `extractionComplete` | Aprobado | Paso `fs-fade-end`, transición de estado y apertura de `DemoEndScene` |
| 11 | Tarjeta final sin afirmar victoria | Aprobado | Mensajes ES/EN y prueba contra afirmaciones de victoria |
| 12 | Reiniciar a Intro conservando idioma | Aprobado | `DemoEndFlow` probado en ES/EN |
| 13 | Salir a Menu conservando idioma | Aprobado | `DemoEndFlow` probado en ES/EN |
| 14 | Timeout de seguridad de 30 s | Aprobado | Pruebas de timeout de `FinalSequenceController` |
| 15 | Flujo válido sin errores internos | Aprobado | Typecheck, suite completa y build finalizados sin errores |
| 16 | Textos en español e inglés | Aprobado | Pruebas parametrizadas sobre ambos locales |

## 3. Validaciones ejecutadas

Desde `game/`:

- `npm run typecheck`: aprobado, cero errores TypeScript.
- Pruebas enfocadas: 4 archivos, 48 pruebas aprobadas.
- `npm run check`: 20 archivos, 223 pruebas aprobadas y build de producción exitoso.

Durante la validación completa se corrigieron dos aserciones preexistentes: una descartaba el primer Challenge devuelto por el intervalo y otra esperaba 310 puntos donde la fórmula produce 320. No se modificó el comportamiento de gameplay.

## 4. Alcance de la verificación

Esta verificación cubre el subsistema y la escena runtime del cierre narrativo. El recorrido automatizado completo desde selección de idioma, oficina y cuatro Encounters hasta `DemoEnd` corresponde a TASK-704; por ello no se presenta aquí como evidencia de navegador extremo a extremo.

## 5. Conclusión

TASK-605 y SPEC-006 quedan verificadas dentro del alcance del Milestone 6. El siguiente bloque de trabajo es TASK-700: completar y validar los 12 Challenges definitivos.
