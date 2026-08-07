# SPEC-003 — Combate, Challenges y Parse Mantis (Vertical Slice)

- **Estado:** Aprobado
- **Versión:** 1.0
- **Fecha:** 2026-08-07
- **Tarea:** TASK-300
- **Requisitos:** REQ-STATE-001, REQ-COMBAT-001, REQ-CHL-001–005, REQ-PROG-001, REQ-TUT-001, REQ-SCORE-001, REQ-PAUSE-001, REQ-DEFEAT-001, REQ-RESET-001, REQ-PERF-001
- **Autoridad:** Esta SPEC concreta el tercer incremento ejecutable sin modificar el alcance definido por SPEC-000 ni la arquitectura de `design.md`.

## 1. Objetivo

Entregar un Encounter completo y funcional (Parse Mantis) como vertical slice que demuestre:

```text
Transitioning → Playing ↔ Challenge → Transitioning | Defeat
```

El incremento prueba todo el ciclo de combate: el Player esquiva proyectiles mientras responde Challenges de TypeScript para dañar al enemigo. Incluye scoring, penalización, tutorial, pausa, derrota y reinicio.

## 2. Alcance

Incluye:

- `GameScene` que hostea un Encounter activo con HUD;
- `GameStateMachine` con transiciones Playing↔Challenge, Paused y Defeat;
- `ProjectilePool` y `ProjectileSystem` con pool reutilizable (capacidad ≥ 200);
- `AttackPatternRegistry` con `parse.linearAttack`;
- `CollisionSystem` con hitbox del Player y daño hostil;
- `InvulnerabilityTracker` con ventana de 500 ms;
- `EncounterManager` con un Parse Mantis (Encounter 1);
- `ChallengeManager` con intervalos, selección sin reposición y expiración;
- `AnswerValidator` con normalización para typed y multiple-choice;
- `ScoreManager` con fórmulas configurables y lock en Defeat;
- `PenaltyManager` con `extraProjectiles` (5s, ×2);
- `TextInputWidget` (12 chars, cursor, `n/12`);
- `MultipleChoiceWidget` (3–4 opciones, teclado `1`–`4` y clic);
- `HUD` (HP, Score, Streak, estado del Encounter);
- `TutorialOverlay` de 3 pasos para Encounter 1;
- `PauseOverlay` fuera de Challenge y pausa bloqueada dentro de Challenge;
- `DefeatScene` con estadísticas, reiniciar y menú;
- Transición entre oficina y Encounter 1 (fundido + texto localizado);
- Curación entre Encounters (30 % HP aditivo con tope);
- 3 Challenges Syntax (al menos un typed y un multiple-choice);
- Datos JSON de Parse Mantis Encounter y Challenges;
- Pruebas unitarias y de integración.

No incluye:

- Encounters 2–4 (Mutable Widow, Cast Hornet, Boolean Beetle);
- damageTargetMode multi-enemy (roundRobin/allActive);
- FinalSequence ni DemoEnd;
- Audio;
- Challenges de categorías Variable, Type y Logic;
- persistencia fuera de la sesión.

## 3. Flujo de estados

### 3.1 Transiciones del combate

| Desde | Evento | Hacia |
|---|---|---|
| `Transitioning` | `encounterReady` | `Playing` |
| `Playing` | `challengePresented` | `Challenge` |
| `Challenge` | `challengeClosed` | `Playing` |
| `Playing` | `manualPauseRequested` | `Paused` |
| `Playing` | `safetyPauseRequested` | `Paused` |
| `Challenge` | `safetyPauseRequested` | `Paused` |
| `Paused` | `resumeRequested` | estado guardado |
| `Paused` | `restartRequested` | `Intro` |
| `Paused` | `exitToMenuRequested` | `Menu` |
| `Playing` o `Challenge` | `encounterCompleted` | `Transitioning` |
| `Transitioning` | `nextEncounterReady` | `Playing` |
| `Playing` o `Challenge` | `playerDefeated` | `Defeat` |

### 3.2 Reglas especiales

- `manualPauseRequested` desde `Challenge` → **rechazado**; se emite `pauseBlocked` (feedback visual sin cambio de estado).
- `safetyPauseRequested` desde `Challenge` → **aceptado**; se conserva `ChallengePauseSnapshot`.
- `encounterCompleted` cierra el Challenge activo silenciosamente (sin contarlo como Incorrect).
- `playerDefeated` cierra el Challenge activo silenciosamente (sin evaluarlo).

## 4. Orden determinista del frame

Cada frame de gameplay se resuelve en este orden fijo:

1. **Capturar intents** — movimiento, respuesta, selección, pausa.
2. **Resolver pausa** — si se acepta, saltar el resto del frame.
3. **Registrar respuesta pendiente** — sin validar aún.
4. **Actualizar movimiento del Player** — por deltaMs.
5. **Actualizar Enemies y generar ataques** — patterns por deltaMs.
6. **Validar respuesta pendiente** — AnswerValidator.
7. **Aplicar efectos atómicos** — daño al Enemy, Score, Streak, penalty.
8. **Actualizar ataques** — Projectiles/áreas avanzan.
9. **Resolver colisiones** — InvulnerabilityTracker + daño hostil.
10. **Resolver estados terminales** — encounterCompleted o playerDefeated.
11. **Ejecutar transiciones y limpiar** — release Projectiles, reset interval.
12. **Sincronizar presentación** — HUD, overlays, animaciones.

### 4.1 Reglas de carrera

- Un Correct Answer validado en paso 6–7 que completa el Encounter se resuelve antes de la colisión del paso 9.
- Una respuesta no validada no impide daño fatal.
- Después de detectar un estado terminal, no se producen más cambios de Score/Challenge en ese frame.

## 5. Parse Mantis — Encounter 1

### 5.1 Configuración

```json
{
  "id": "parse-mantis",
  "mapKey": "tilemap.compilation-garden",
  "category": "syntax",
  "enemySpawns": [{
    "id": "parse-mantis-01",
    "archetypeId": "parse-mantis",
    "position": { "x": 640, "y": 270 },
    "maxHp": 100,
    "attackIds": ["parse.linearAttack"],
    "attackParams": {
      "parse.linearAttack": {
        "damage": 10,
        "projectileSpeed": 160,
        "intervalMs": 2000,
        "projectilesPerBurst": 1
      }
    }
  }],
  "challengePool": ["syntax-01", "syntax-02", "syntax-03"],
  "challengeIntervalMs": 5000,
  "defaultTimeLimitMs": 8000,
  "penalty": {
    "type": "extraProjectiles",
    "multiplier": 2,
    "durationMs": 5000
  },
  "damageTargetMode": "roundRobin",
  "completionRule": {
    "type": "allRequiredEnemiesDefeated",
    "requiredEnemyIds": ["parse-mantis-01"]
  },
  "transitionTextKey": "transition.parse-mantis.complete",
  "tutorial": {
    "stepKeys": ["tutorial.move", "tutorial.dodge", "tutorial.answer"]
  }
}
```

### 5.2 Ataque: parse.linearAttack

- Proyectil lineal desde la posición del Enemy hacia el Player.
- Velocidad: configurable por `projectileSpeed` (160 px/s inicial).
- Daño: configurable por `damage` (10 HP inicial).
- Intervalo: configurable por `intervalMs` (2000 ms inicial).
- Proyectiles por ráfaga: configurable por `projectilesPerBurst` (1 base, ×2 con penalty).
- El proyectil se retira al salir de los límites de simulación (viewport + margen).
- Sprite: `projectile.parse-mantis.linear` (32×32 frames).
- Impacto: `impact.parse-mantis.linear` (32×32 frames, no genera daño adicional).

### 5.3 Enemy

- Sprite idle: `enemy.parse-mantis.idle` (128×128 frames).
- Sprite daño: `enemy.parse-mantis.damage` (128×128).
- Sprite derrota: `enemy.parse-mantis.defeat` (128×128).
- Movimiento: `ground` (estático en Encounter 1; no se desplaza).
- Escala visual: 10–15% menor que el Senior.
- HP: 100 (configurable en datos).

## 6. Challenges (Syntax)

### 6.1 Pool mínimo (3 Challenges)

| ID | Modo | Código | Instrucción | Respuestas | Tiempo |
|---|---|---|---|---|---|
| `syntax-01` | typed | `const total = 1` | Completa el código | `;` | 8000 ms |
| `syntax-02` | multiple-choice | `const answer: number = 42;` | ¿Cuál es el tipo? | `number` (✓), `string`, `boolean` | 8000 ms |
| `syntax-03` | typed | `let name: string = "Ada"` | Completa el código | `;` | 8000 ms |

### 6.2 Daño del Challenge

- Cada Correct Answer aplica 25 HP de daño al Parse Mantis (configurable en datos como `damage` del Challenge).
- Con 4 respuestas correctas el Parse Mantis (100 HP) queda derrotado.

### 6.3 Selección y repetición

- Sin reposición dentro de un ciclo.
- Al agotarse el pool de 3, se reconstruye sin repetir el último presentado.
- Solo un Challenge activo a la vez.
- Mientras un Challenge está activo, el intervalo no avanza.

## 7. Scoring y penalización

### 7.1 Correct Answer (atómico)

1. Daño al Enemy objetivo (según `damage` del Challenge).
2. Score += `100 + floor(remainingMs / 100) + currentStreak × 10`.
3. Streak += 1.
4. correctCount += 1.

### 7.2 Incorrect Answer / Expiración

1. Score = `max(score − 50, 0)`.
2. Streak = 0.
3. incorrectCount += 1.
4. Activar `extraProjectiles` durante 5000 ms (×2 projectilesPerBurst).
5. Mostrar respuesta correcta durante 2 segundos.
6. No reduce HP.

### 7.3 Penalización extraProjectiles

- Multiplica `projectilesPerBurst` de patrones aplicables ×2.
- Respeta capacidad del pool.
- Nueva penalización reinicia duración.
- Se cancela al completar Encounter, reiniciar o salir al menú.

## 8. Tutorial (Encounter 1 exclusivo)

### 8.1 Pasos

| Paso | Clave | Condición de avance | Efecto |
|---|---|---|---|
| 1 | `tutorial.move` | Player demuestra movimiento | Muestra instrucción de movimiento |
| 2 | `tutorial.dodge` | Automático tras paso 1 | Activa Projectiles al 50% velocidad; muestra instrucción de esquiva |
| 3 | `tutorial.answer` | Aparece primer Challenge | Muestra instrucción de respuesta; Projectiles a 100% velocidad |

### 8.2 Reglas

- El tutorial no detiene permanentemente el Encounter.
- No se repite durante la misma Run.
- Projectiles comienzan al 50% de velocidad y escalan a 100% en paso 3.
- Las instrucciones se retiran automáticamente tras 3 segundos o al completar la condición.

## 9. Colisiones e invulnerabilidad

- Hitbox del Player: rectángulo más pequeño que su sprite visible.
- Un Hostile Attack que colisiona con hitbox → reduce HP por `damage` del ataque.
- Inmediatamente inicia InvulnerabilityPeriod de 500 ms.
- Colisiones durante la ventana son ignoradas (sin extender ni reiniciar).
- Un Projectile ignorado por invulnerabilidad conserva su comportamiento y se retira normalmente.

## 10. Pausa durante combate

### 10.1 Pausa manual (Escape en Playing)

- Estado `Playing` → `Paused` con `{ cause: 'manual', returnState: 'Playing' }`.
- Congela: movimiento, Enemies, Projectiles, cronómetros.
- Overlay: Continuar, Reiniciar, Salir al menú.
- Continuar → reanuda exactamente donde se pausó.

### 10.2 Pausa bloqueada (Escape en Challenge)

- No cambia de estado.
- Reproduce feedback visual breve (animación de rechazo).
- El Challenge continúa normalmente.
- Al cerrarse el Challenge, Escape vuelve a estar disponible.

### 10.3 Pausa de seguridad (visibilidad en Playing/Challenge)

- Activa `Paused` con `{ cause: 'visibility', returnState: 'Playing' | 'Challenge' }`.
- Si estaba en `Challenge`: conserva `ChallengePauseSnapshot` (remainingMs, typedAnswer, selectedOptionIndex).
- Al recuperar visibilidad, permanece en pausa hasta acción explícita.

## 11. Derrota

- HP del Player llega a 0 → `playerDefeated` → `Defeat`.
- Challenge activo se cierra sin evaluar (no modifica Score/Streak).
- `DefeatScene` muestra:
  - Score final
  - Correct Answers
  - Streak máxima
  - Tiempo total de Run
  - Encounter alcanzado
- Opciones: Reiniciar (→ Intro, conserva idioma) | Menú (→ Menu, conserva idioma).

## 12. Reinicio

- Reiniciar: restaura HP, Score, Streak, estadísticas, Encounter, cronómetros, Challenges, penalizaciones, Projectiles. Conserva idioma. Vuelve a oficina (Intro).
- Salir al menú: restaura Run completa, conserva idioma, va a Menu.
- Son acciones distintas con destinos distintos.

## 13. Rendimiento

- Objetivo: 60 FPS en Chrome desktop.
- Carga normal: ~40 Projectiles simultáneos.
- Margen técnico: hasta 80 Projectiles sin errores ni crecimiento descontrolado.
- Pool fijo con capacidad inicial ≥ 200.
- Projectiles/efectos se reutilizan o limpian al concluir ciclo.

## 14. HUD

- **HP**: barra visual con valor numérico.
- **Score**: valor numérico actualizado en tiempo real.
- **Streak**: contador visible; reset visual en Incorrect.
- **Enemy HP**: barra o indicador proporcional al HP restante del Parse Mantis.
- **Challenge timer**: barra decreciente visible durante Challenge activo.
- Posición: parte superior del viewport, no obstruye área de movimiento.
- Fuente: Geist Pixel Square.

## 15. Assets consumidos (adicionales a Milestones 1–2)

| Clave | Uso |
|---|---|
| `tileset.compilation-garden.base` | Tileset del Encounter 1 |
| `tilemap.compilation-garden` | Mapa del Jardín |
| `prop.compilation-garden.atlas` | Props decorativos |
| `prop.compilation-garden.machinery-effects` | Efectos ambientales |
| `enemy.parse-mantis.idle` | Idle del enemigo |
| `enemy.parse-mantis.damage` | Daño recibido |
| `enemy.parse-mantis.defeat` | Derrota |
| `enemy.parse-mantis.linear-attack` | Animación de ataque |
| `projectile.parse-mantis.linear` | Sprite del proyectil |
| `impact.parse-mantis.linear` | Impacto visual |
| `ui.combat-hud` | Fondo del HUD |
| `ui.challenge.typed-panel` | Panel typed |
| `ui.challenge.multiple-choice-panel` | Panel multiple-choice |
| `ui.feedback.animations` | Correct/incorrect/timeout feedback |
| `ui.tutorial-transition-kit` | Tutorial y transición |

## 16. Localización

Claves nuevas requeridas:

| Grupo | Ejemplos |
|---|---|
| Tutorial | `tutorial.move`, `tutorial.dodge`, `tutorial.answer` |
| Challenge instrucciones | `challenge.syntax.01.instruction`, etc. |
| Feedback | `feedback.correct`, `feedback.incorrect`, `feedback.timeout` |
| Transición | `transition.parse-mantis.complete` |
| Derrota | `defeat.title`, `defeat.score`, `defeat.correct`, `defeat.streak`, `defeat.time`, `defeat.encounter` |
| Derrota acciones | `defeat.restart`, `defeat.exitToMenu` |
| HUD | `hud.score`, `hud.streak`, `hud.hp` |
| Pausa bloqueada | `pause.blocked` |

## 17. Validación y pruebas

### 17.1 Unitarias

- `GameStateMachine`: Playing↔Challenge, Paused con Context, rechazo de pausa en Challenge.
- `ProjectilePool`: adquirir, liberar, capacidad, reutilización.
- `CollisionSystem`: impacto efectivo, invulnerabilidad, sin extensión.
- `AnswerValidator`: normalización, case-insensitive, typed y multiple-choice.
- `ChallengeManager`: selección sin reposición, reconstrucción, expiración, cierre silencioso.
- `ScoreManager`: fórmula correct, incorrect, piso cero, lock en Defeat.
- `PenaltyManager`: activación, duración, cancelación, multiplicador.
- `InvulnerabilityTracker`: trigger, no extensión, advance por deltaMs.

### 17.2 Integración

- Encounter inicia con tutorial (3 pasos).
- Challenge aparece tras intervalo; Player se mueve mientras responde.
- Correct Answer: daño + Score + Streak atómicos.
- Incorrect Answer: feedback + penalty + no daño HP.
- Expiración: mismo flujo que Incorrect.
- Enemy derrotado → `encounterCompleted` → Transitioning.
- HP a 0 → `playerDefeated` → Defeat con estadísticas.
- Race: Correct en mismo frame que daño fatal → priorizar completion.
- Pausa manual: congela todo, resume restaura.
- Pausa bloqueada: feedback sin cambio de estado.
- Reiniciar: vuelve a oficina con valores iniciales.
- Salir al menú: conserva idioma, va a Menu.

### 17.3 Smoke test manual

- Projectiles visibles y esquivables.
- HUD actualiza Score/Streak en tiempo real.
- Typed Challenge: campo, cursor, 12 chars max, Enter envía.
- Multiple-choice: opciones numeradas, clic y teclado.
- Feedback positivo/negativo visible.
- Parse Mantis muestra animación de daño al recibir hit.
- Tutorial aparece solo en primer Encounter.
- 60 FPS estable con ~40 projectiles.
- No errores de consola en flujo válido.

## 18. Criterios de aceptación de SPEC-003

SPEC-003 se considera implementada cuando:

1. `GameScene` carga Encounter 1 con tilemap del Jardín de Compilación.
2. Parse Mantis aparece con idle, dispara `linearAttack` a intervalos.
3. Projectiles se mueven linealmente y se reciclan al salir de límites.
4. El Player recibe daño al colisionar (respetando invulnerabilidad 500 ms).
5. Challenges aparecen tras el intervalo configurado (5s).
6. Typed Challenge: campo funcional con 12 chars max, Enter envía, normalización correcta.
7. Multiple-choice Challenge: opciones con teclado `1`–`4` y clic.
8. Correct Answer produce daño al Enemy + Score + Streak atómicamente.
9. Incorrect Answer / timeout: Score reducido, penalty activa, respuesta correcta mostrada.
10. El pool de Challenges se reconstruye sin repetir el último.
11. Parse Mantis derrotado (HP=0) → `encounterCompleted` → Transitioning.
12. HP del Player a 0 → `Defeat` con estadísticas.
13. El tutorial de 3 pasos aparece al inicio de Encounter 1.
14. Escape en Playing pausa correctamente con 3 opciones.
15. Escape en Challenge muestra feedback bloqueado sin pausar.
16. Pausa de seguridad conserva Challenge snapshot.
17. Reiniciar restaura todo excepto idioma y vuelve a oficina.
18. Salir al menú preserva idioma y va a Menu.
19. `extraProjectiles` duplica ráfaga durante 5 s tras Incorrect.
20. HUD muestra HP, Score, Streak y estado del Enemy.
21. 60 FPS con ~40 projectiles en Chrome.
22. Frame order determinista resuelve races correctamente.
23. No errores de consola en el flujo válido.
24. `npm run typecheck`, `npm test` y `npm run build` terminan correctamente.

## 19. Trazabilidad

| Requisito | Secciones y criterios |
|---|---|
| REQ-COMBAT-001 | §4, §5, §9; criterios 2–4, 22 |
| REQ-CHL-001 | §6; criterios 5, 10 |
| REQ-CHL-002 | §6; criterio 6 |
| REQ-CHL-003 | §6; criterio 7 |
| REQ-CHL-004 | §7.1; criterio 8 |
| REQ-CHL-005 | §7.2; criterio 9, 19 |
| REQ-PROG-001 | §5; criterios 1, 11 |
| REQ-TUT-001 | §8; criterio 13 |
| REQ-SCORE-001 | §7; criterios 8–9 |
| REQ-PAUSE-001 | §10; criterios 14–16 |
| REQ-DEFEAT-001 | §11; criterio 12 |
| REQ-RESET-001 | §12; criterios 17–18 |
| REQ-PERF-001 | §13; criterio 21 |
| REQ-STATE-001 | §3; criterio 22 |

## 20. Decisiones y riesgos

- Parse Mantis es estático (no se desplaza) para simplificar el vertical slice.
- Los 3 Challenges Syntax son placeholder para el slice; contenido definitivo puede refinarse sin cambiar esta SPEC.
- El Challenge `damage` (25 HP) permite derrotar a Parse Mantis (100 HP) en 4 respuestas correctas.
- La fórmula de Score es configurable; los valores de esta SPEC son iniciales.
- `parse.linearAttack` dispara un proyectil cada 2s; con penalty son 2 por ráfaga.
- El tilemap `compilation-garden.json` debe crearse o incorporarse antes de TASK-310.
- La curación entre Encounters (30% HP) no se ejerce en este slice (solo hay un Encounter), pero el código debe implementarla para SPEC-004.

## 21. Aprobación

Antes de marcar TASK-300 como completa deben confirmarse explícitamente:

- [x] Flujo Playing↔Challenge con pausa y derrota;
- [x] Orden determinista del frame y reglas de carrera;
- [x] Parse Mantis con linearAttack y datos JSON;
- [x] 3 Challenges Syntax con ambas modalidades;
- [x] Scoring atómico y penalización extraProjectiles;
- [x] Tutorial de 3 pasos;
- [x] HUD y feedback visual;
- [x] DefeatScene con estadísticas y opciones;
- [x] Reinicio y salida al menú;
- [x] 24 criterios de aceptación y pruebas.

La aprobación de esta SPEC autoriza iniciar TASK-301. No autoriza adelantar Encounters 2–4, FinalSequence ni contenido de SPEC-004.
