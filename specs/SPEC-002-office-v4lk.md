# SPEC-002 — Oficina inicial y aparición de V4LK

- **Estado:** Aprobado
- **Versión:** 1.0
- **Fecha:** 2026-08-07
- **Tarea:** TASK-200
- **Requisitos:** REQ-INTRO-001, REQ-MOV-001, REQ-PAUSE-001, REQ-STATE-001, REQ-LOC-001
- **Autoridad:** Esta SPEC concreta el segundo incremento ejecutable sin modificar el alcance definido por SPEC-000 ni la arquitectura de `design.md`.

## 1. Objetivo

Entregar la oficina inicial jugable del demo:

```text
Menu → Intro → Exploration → Dialogue → Transitioning
```

El incremento demuestra que el jugador puede despertar en C4, caminar por la oficina, interactuar con la computadora de C3, presenciar la materialización de V4LK y alcanzar la salida hacia el Jardín de Compilación. No incluye combate, Challenges, enemigos ni el Encounter de Parse Mantis.

## 2. Alcance

Incluye:

- `OfficeScene` con tilemap, colisiones, props y maquinaria ambiental;
- secuencia de despertar (animación wake-stand y diálogo inicial);
- `Player` con movimiento constante en cuatro direcciones, sin inercia ni carrera;
- `InputManager` de exploración (flechas, Enter para interacciones, Escape para pausa);
- sistema de colisiones de tilemap que limita el área caminable;
- interacción con la computadora C3 (zona de activación, pulsación, barra de carga);
- materialización y estabilización de V4LK;
- `DialogueOverlay` localizado con avance por Enter o clic;
- habilitación de salida hacia el primer Encounter;
- pausa manual durante `Exploration` (Escape → overlay → continuar/reiniciar/menú);
- pausa de seguridad por pérdida de visibilidad durante `Exploration`;
- transiciones de estado: `Intro` → `Exploration` → `Dialogue` → `Exploration` → `Transitioning`;
- localización completa de todos los textos nuevos en español e inglés;
- pruebas unitarias de movimiento, colisiones y transiciones.

No incluye:

- combate, Enemies, Projectiles ni Challenges;
- segundo o posterior Encounter;
- HUD de combate, Score ni Streak;
- audio;
- persistencia fuera de la sesión;
- `GameScene`, `DefeatScene`, `DemoEndScene` ni `FinalSequence`;
- contenido de tutoriales de combate.

## 3. Flujo de estados

### 3.1 Secuencia válida

1. `MenuScene` emite `startRun`.
2. `GameStateMachine` transiciona `Menu → Intro`.
3. `OfficeScene` se carga y muestra al Senior Engineer sentado en C4.
4. Se reproduce la animación `player.wake-stand` (despertar y levantarse).
5. Aparece el diálogo «¿Qué ha pasado? ¿Dónde estoy?» o su equivalente en inglés.
6. El jugador avanza el diálogo con Enter o clic.
7. Al cerrarse el diálogo, se emite `wakeDialogueComplete`.
8. `GameStateMachine` transiciona `Intro → Exploration`.
9. El control pasa al jugador; puede caminar con las flechas.
10. El jugador se desplaza hasta la computadora C3 (indicador visual parpadeante).
11. Al alcanzar la zona de interacción de C3, el jugador presiona Enter.
12. Se emite `dialogueStarted`; estado → `Dialogue`.
13. Se reproduce la pulsación de tecla y el monitor muestra una barra de carga.
14. Al completarse la carga, V4LK se materializa (`v4lk.materialize-idle`).
15. V4LK se estabiliza y presenta un diálogo de introducción.
16. Al cerrarse el diálogo de V4LK, se emite `dialogueComplete`; estado → `Exploration`.
17. La salida de la oficina se habilita visualmente.
18. Al alcanzar la zona de salida, se emite `officeExitReached`.
19. `GameStateMachine` transiciona `Exploration → Transitioning`.
20. Se reproduce un fundido y la escena se descarga; la transición al Encounter 1 queda preparada para SPEC-003.

### 3.2 Transiciones de estado para este incremento

| Desde | Evento | Hacia |
|---|---|---|
| `Menu` | `startRun` | `Intro` |
| `Intro` | `wakeDialogueComplete` | `Exploration` |
| `Exploration` | `dialogueStarted` | `Dialogue` |
| `Dialogue` | `dialogueComplete` | `Exploration` |
| `Exploration` | `officeExitReached` | `Transitioning` |
| `Exploration` | `manualPauseRequested` | `Paused` |
| `Exploration` | `safetyPauseRequested` | `Paused` |
| `Paused` | `resumeRequested` | `Exploration` |
| `Paused` | `restartRequested` | `Intro` |
| `Paused` | `exitToMenuRequested` | `Menu` |

### 3.3 Controles por estado

| Estado | Flechas | Enter | Escape | Clic |
|---|---|---|---|---|
| `Intro` | Deshabilitadas | — | — | — |
| `Exploration` | Movimiento | Interactuar (si en zona) | Pausa manual | — |
| `Dialogue` | Deshabilitadas | Avanzar diálogo | — | Avanzar diálogo |
| `Paused` | Deshabilitadas | Seleccionar opción | Reanudar | Seleccionar opción |
| `Transitioning` | Deshabilitadas | — | — | — |

## 4. Oficina: espacio y tilemap

### 4.1 Mapa

- Formato: Tiled JSON (`tilemaps/initial-office.json`).
- Tileset base: `tileset.initial-office.base` (32 × 32 px por tile).
- Props: `prop.initial-office.atlas` (64 × 64 px por frame).
- Maquinaria ambiental: `prop.initial-office.machinery-effects` (32 × 32 px por frame, animada).
- Resolución lógica: 960 × 540 px (cabe en un solo viewport sin scroll).

### 4.2 Capas esperadas

El tilemap debe incluir al menos las siguientes capas lógicas:

| Capa | Tipo | Propósito |
|---|---|---|
| `ground` | Tile layer | Suelo base |
| `walls` | Tile layer | Paredes y obstáculos |
| `collisions` | Object layer | Rectángulos de colisión (área no caminable) |
| `props` | Object layer | Posiciones de props decorativos |
| `spawns` | Object layer | Puntos clave: `spawn-c4`, `computer-c3`, `exit` |
| `interactions` | Object layer | Zonas de interacción con dimensiones |

Reglas:

- El área caminable se define como la inversa de la capa `collisions`.
- `spawn-c4` es la posición inicial del Senior al despertar.
- `computer-c3` define la zona de activación para interactuar con el monitor.
- `exit` define la zona que dispara `officeExitReached`.
- Los nombres de objetos son estables y se referencian desde código por clave.

### 4.3 Cámara

- Viewport fijo a 960 × 540 px (sin scroll ni seguimiento).
- El mapa cabe completamente dentro del viewport.
- Pixel art con nearest-neighbor, sin suavizado.
- La cámara no se mueve durante la escena.

## 5. Player

### 5.1 Movimiento

- Velocidad constante configurable (valor inicial: 120 px/s).
- Cuatro direcciones: arriba, abajo, izquierda, derecha.
- Movimiento diagonal permitido (componentes normalizados para mantener velocidad constante).
- Sin inercia: al soltar las flechas el Player se detiene inmediatamente.
- Sin carrera: no existe acción de correr.
- Sin movimiento automático ni momentum.
- El movimiento se calcula con `deltaMs` para ser independiente de framerate.

### 5.2 Colisiones

- El Player tiene un hitbox rectangular más pequeño que su sprite visible.
- El hitbox se evalúa contra la capa `collisions` del tilemap.
- El Player no puede atravesar límites ni colisiones.
- Resolución de colisión: desplazamiento mínimo (separación por eje).

### 5.3 Animaciones

| Contexto | Asset | Frames |
|---|---|---|
| Despertar | `player.wake-stand` | 96 × 96, secuencia completa una vez |
| Idle | `player.idle` | 128 × 128, loop |
| Caminar | `player.walk` | 128 × 128, loop |

- La animación de caminar se selecciona por dirección dominante.
- Al detenerse, se reproduce idle en la última dirección usada.
- El despertar es una animación única que no se repite.

### 5.4 Habilitación de movimiento

- `Intro`: movimiento deshabilitado (secuencia narrativa).
- `Exploration`: movimiento habilitado.
- `Dialogue`: movimiento deshabilitado.
- `Paused`: movimiento deshabilitado.
- `Transitioning`: movimiento deshabilitado.

## 6. Interacciones

### 6.1 Computadora C3

Condiciones para interactuar:

1. El estado es `Exploration`.
2. El hitbox del Player intersecta la zona `computer-c3`.
3. El jugador presiona Enter.

Secuencia al interactuar:

1. Se emite `dialogueStarted`; estado → `Dialogue`.
2. Se deshabilita movimiento.
3. Se reproduce animación de pulsación de tecla (sprite `player.idle` orientado hacia C3 o animación dedicada).
4. El monitor muestra una barra de carga progresiva (duración: 2 segundos).
5. Al completarse la barra, V4LK se materializa.
6. Se reproduce la animación `v4lk.materialize-idle` hasta estabilizarse.
7. Aparece el diálogo de V4LK (localizado).
8. Al cerrarse, se emite `dialogueComplete`; estado → `Exploration`.
9. La salida se habilita (indicador visual en la zona `exit`).

### 6.2 Indicador visual de C3

- Mientras el jugador no ha interactuado con C3, el monitor debe parpadear o mostrar un efecto visual periódico.
- El parpadeo usa la capa de maquinaria ambiental (`prop.initial-office.machinery-effects`).
- Después de la interacción, el monitor permanece encendido (sin parpadeo).

### 6.3 Zona de salida

- Invisible hasta completar la interacción con V4LK.
- Se activa tras `dialogueComplete` del diálogo de V4LK.
- Al entrar en la zona con el Player, se emite `officeExitReached` automáticamente.
- No requiere presionar Enter (activación por proximidad).

## 7. DialogueOverlay

### 7.1 Presentación

- Usa `ui.office.dialogue-window` como fondo del cuadro de diálogo.
- Posición: parte inferior del viewport (centrado horizontalmente).
- Muestra nombre del hablante y texto localizado.
- Fuente: Geist Pixel Square.
- Soporta múltiples líneas de diálogo en secuencia.

### 7.2 Avance

- Enter o clic izquierdo avanza al siguiente paso del diálogo.
- Si el texto actual no ha terminado de mostrarse, Enter/clic lo muestra completo inmediatamente.
- Al final de la secuencia, el overlay se cierra y se emite el evento correspondiente.

### 7.3 Hablantes

| Hablante | Identificador | Color sugerido |
|---|---|---|
| Senior Engineer | `senior` | `#d8fbff` |
| V4LK | `v4lk` | `#69f7ff` |
| Sistema/narrador | `system` | `#9eb8c7` |

### 7.4 Datos de diálogo

Los diálogos se definen como secuencias de pasos en datos:

```text
DialogueSequence
- id: string
- steps: DialogueStep[]

DialogueStep
- speaker: 'senior' | 'v4lk' | 'system'
- textKey: LocalizationKey
- parameters?: Record<string, string | number>
```

Secuencias de este incremento:

1. **`office.wake`** — Despertar (1–2 líneas, Senior).
2. **`office.v4lk-intro`** — Presentación de V4LK (3–5 líneas, V4LK y Senior).

## 8. V4LK

### 8.1 Materialización

- V4LK aparece en una posición fija cerca de la computadora C3.
- Se reproduce `v4lk.materialize-idle` (64 × 64 frames, 256 × 256 sheet = 16 frames).
- La materialización es una animación de ida (no loop).
- Después de materializarse, V4LK permanece en idle (puede reusar los últimos frames del sheet como loop corto).

### 8.2 Comportamiento

- V4LK no tiene HP, hitbox hostil ni colisiones con el Player.
- Durante `Exploration`, V4LK permanece estático en su posición de materialización.
- V4LK no se mueve en este incremento (el seguimiento se implementa en milestones posteriores).
- No participa en combate.

## 9. Pausa

### 9.1 Pausa manual

- Disponible únicamente en `Exploration`.
- Se activa con Escape.
- `GameStateMachine` transiciona a `Paused` con `PauseContext { cause: 'manual', returnState: 'Exploration' }`.
- Se muestra `PauseOverlay` con tres opciones localizadas:
  - Continuar → emite `resumeRequested` → vuelve a `Exploration`.
  - Reiniciar → emite `restartRequested` → vuelve a `Intro` (reinicia la Run, conserva idioma).
  - Salir al menú → emite `exitToMenuRequested` → vuelve a `Menu`.
- Mientras está en pausa: movimiento deshabilitado, animaciones detenidas.

### 9.2 Pausa de seguridad

- Se activa cuando el documento pierde visibilidad (`visibilitychange`) durante `Exploration`.
- Misma presentación que la pausa manual.
- `PauseContext { cause: 'visibility', returnState: 'Exploration' }`.
- Al recuperar visibilidad, el sistema permanece en pausa hasta que el jugador actúe explícitamente.

### 9.3 PauseOverlay

- Usa `ui.pause.frame` como fondo (480 × 320 px).
- Tres opciones con foco visible, navegación por teclado (↑↓ + Enter) y ratón.
- Textos localizados:
  - `pause.continue` / `pause.restart` / `pause.exitToMenu`
- Escape dentro de la pausa equivale a "Continuar".

## 10. Localización

### 10.1 Claves nuevas

Los siguientes grupos de claves se añaden a `es.json` y `en.json`:

| Grupo | Claves | Ejemplo |
|---|---|---|
| Despertar | `dialogue.office.wake.*` | "¿Qué ha pasado? ¿Dónde estoy?" |
| V4LK intro | `dialogue.office.v4lk.*` | "Soy V4LK. No tenemos mucho tiempo." |
| Interacción C3 | `office.interact.prompt` | "Presiona Enter para interactuar" |
| Pausa | `pause.continue`, `pause.restart`, `pause.exitToMenu` | "Continuar" / "Reiniciar" / "Salir al menú" |
| Pausa título | `pause.title` | "Pausa" / "Paused" |

### 10.2 Reglas

- Cada clave debe existir en ambos idiomas.
- Los textos de diálogo usan `LocalizationStore.translate()` con el idioma confirmado.
- Los textos de la pausa se resuelven al crear el overlay.
- No se utilizan textos rasterizados; todo se renderiza con Geist Pixel Square.

## 11. Assets consumidos

| Clave | Tipo | Uso |
|---|---|---|
| `tileset.initial-office.base` | spritesheet | Tileset del mapa |
| `tilemap.initial-office` | tilemap | Mapa Tiled JSON |
| `prop.initial-office.atlas` | spritesheet | Props decorativos |
| `prop.initial-office.machinery-effects` | spritesheet | Animaciones ambientales |
| `player.wake-stand` | spritesheet | Animación de despertar |
| `player.idle` | spritesheet | Idle del Player |
| `player.walk` | spritesheet | Caminar del Player |
| `ui.office.dialogue-window` | spritesheet | Fondo del diálogo |
| `ui.intro.panel` | image | Panel de introducción |
| `ui.pause.frame` | image | Marco de la pausa |
| `v4lk.materialize-idle` | spritesheet | Materialización de V4LK |

Todos estos assets ya están declarados en `AssetManifest.ts` y se precargan durante Boot.

## 12. Validación y pruebas

### 12.1 Unitarias

- `GameStateMachine` permite las transiciones de §3.2 y rechaza las no listadas.
- `Player` se mueve a velocidad constante, se detiene sin inercia y respeta colisiones.
- `Player` no se mueve cuando el estado no lo permite.
- `DialogueOverlay` avanza y cierra correctamente con datos simulados.
- `PauseContext` se construye con los valores correctos según el origen.
- Las claves de localización nuevas existen en ambos idiomas.

### 12.2 Integración

- `startRun` desde Menu llega a `Intro` y muestra OfficeScene.
- La animación de despertar se reproduce antes de habilitar movimiento.
- El diálogo inicial aparece en el idioma seleccionado.
- Cerrar el diálogo habilita el movimiento del Player.
- El Player no puede salir de la oficina antes de interactuar con C3.
- Interactuar con C3 produce la secuencia completa: pulsación → carga → V4LK.
- Después de V4LK, la salida se habilita.
- Alcanzar la salida emite `officeExitReached`.
- Escape durante Exploration produce la pausa con las tres opciones.
- "Continuar" regresa a Exploration con el Player en su posición.
- "Reiniciar" vuelve a mostrar el despertar en C4.
- "Salir al menú" vuelve al menú conservando el idioma.
- La pérdida de visibilidad activa pausa de seguridad.

### 12.3 Smoke test manual en Chrome

- El Senior aparece sentado en C4 al iniciar una Run.
- La animación de despertar es fluida.
- El diálogo aparece con Geist Pixel Square y caracteres españoles correctos.
- Enter y clic avanzan el diálogo.
- El Player se mueve con las flechas sin inercia.
- El Player no atraviesa paredes ni muebles.
- El monitor de C3 parpadea como indicador visual.
- Enter cerca de C3 activa la interacción.
- La barra de carga progresa y V4LK se materializa.
- El diálogo de V4LK aparece correctamente.
- La salida se habilita solo después de V4LK.
- Escape abre la pausa; "Continuar" la cierra.
- No existen errores de consola en el flujo válido.

## 13. Criterios de aceptación de SPEC-002

SPEC-002 se considera implementada cuando:

1. `OfficeScene` carga el tilemap y muestra el espacio con tileset, props y maquinaria.
2. El Senior aparece sentado en C4 y reproduce la animación de despertar.
3. El diálogo inicial aparece localizado y se avanza con Enter o clic.
4. El movimiento se habilita solo después de completar el despertar.
5. El Player se mueve a velocidad constante, sin inercia y sin correr.
6. Las colisiones del tilemap impiden atravesar paredes y límites.
7. La computadora C3 tiene un indicador visual parpadeante.
8. Interactuar con C3 desde una posición válida produce: pulsación → carga → V4LK.
9. No se puede interactuar con C3 desde una posición inválida.
10. V4LK se materializa y presenta su diálogo de introducción localizado.
11. La salida se habilita solo después de completar la secuencia de V4LK.
12. Alcanzar la zona de salida emite `officeExitReached` y transiciona a `Transitioning`.
13. Escape durante `Exploration` abre la pausa con Continuar, Reiniciar y Salir al menú.
14. La pausa conserva la posición del Player al reanudar.
15. Reiniciar vuelve a `Intro` conservando el idioma.
16. Salir al menú regresa a `Menu` conservando el idioma.
17. La pérdida de visibilidad activa pausa de seguridad.
18. Todos los textos están localizados en español e inglés.
19. No existen enemigos, projectiles ni Challenges durante la oficina.
20. `npm run typecheck`, `npm test` y `npm run build` terminan correctamente.
21. No existen errores de consola durante el flujo válido.

## 14. Trazabilidad

| Requisito | Decisiones y evidencia esperada |
|---|---|
| REQ-INTRO-001 | Secciones 3, 4, 6, 8 y criterios 1–12 |
| REQ-MOV-001 | Sección 5 y criterios 4–6 |
| REQ-PAUSE-001 | Sección 9 y criterios 13–17 |
| REQ-STATE-001 | Sección 3.2 y pruebas de transición |
| REQ-LOC-001 | Sección 10 y criterio 18 |

## 15. Decisiones y riesgos

- El tilemap JSON (`initial-office.json`) debe crearse o incorporarse antes de TASK-201. Si no existe aún, se crea un placeholder funcional con las capas mínimas.
- La velocidad del Player (120 px/s) es un valor inicial de calibración; puede ajustarse sin cambiar esta SPEC siempre que cumpla "velocidad constante sin carrera".
- V4LK permanece estático en este incremento; su seguimiento del Player pertenece a un milestone posterior.
- La duración de la barra de carga de C3 (2 segundos) es configurable sin cambiar esta SPEC.
- El contenido exacto de los diálogos (texto narrativo) se define al crear las claves de localización en TASK-205; esta SPEC aprueba la estructura y el flujo pero no fija la prosa.
- `Transitioning` al final de la oficina prepara la transición al Encounter 1 pero no lo implementa; esa conexión pertenece a SPEC-003.

## 16. Aprobación

Antes de marcar TASK-200 como completa deben confirmarse explícitamente:

- [x] flujo Intro → Exploration → Dialogue → Exploration → Transitioning;
- [x] mecánica de movimiento constante, sin inercia, sin carrera;
- [x] tilemap con colisiones y zonas de interacción;
- [x] secuencia C3: pulsación → carga → V4LK;
- [x] DialogueOverlay localizado con avance por Enter/clic;
- [x] pausa manual y pausa de seguridad;
- [x] criterios de aceptación y pruebas;
- [x] alcance limitado (sin combate, sin Encounter activo).

La aprobación de esta SPEC autoriza iniciar TASK-201. No autoriza adelantar combate, Challenges ni contenido de SPEC-003.
