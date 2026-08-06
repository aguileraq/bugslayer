# BugSlayer — Technical Design

- **Estado:** Baseline técnico
- **Versión:** 2.0
- **Fecha:** 2026-08-06
- **Alcance rector:** `SPEC-000-demo-scope.md`
- **Requisitos:** `requirements.md` v2.0

## 1. Propósito

Este documento describe **cómo** se implementarán los requisitos del demo de BugSlayer con Phaser, TypeScript y Vite. No redefine el alcance ni introduce gameplay adicional.

Objetivos:

- Mantener la lógica crítica desacoplada del runtime de Phaser para probarla con Vitest.
- Modelar el flujo mediante una máquina de estados explícita.
- Cargar Challenges, Encounters, localización y balance desde datos validados.
- Mantener un orden de resolución determinista por frame.
- Soportar múltiples Enemies dentro de un Encounter.
- Diferenciar la pausa manual de la pausa de seguridad por pérdida de visibilidad.
- Reproducir Mycelial Monolith como secuencia narrativa, no como Boss combatible.
- Mantener 60 FPS bajo la carga objetivo y evitar asignaciones innecesarias durante el combate.

Los valores de tuning permanecen en datos y se calibran durante playtesting.

## 2. Arquitectura

### 2.1 Capas

```text
+------------------------------------------------------------------+
|                         Phaser Runtime                           |
|                                                                  |
| Scenes                  Entities              Presentation       |
| Boot                    Player                HUD                |
| LanguageSelect          Enemy                 ChallengeOverlay   |
| Menu                    Projectile            PauseOverlay       |
| Office                  V4LK                  DialogueOverlay    |
| Game                    MycelialMonolith      TutorialOverlay    |
| Defeat                                        TransitionOverlay  |
| DemoEnd                                       FinalSequenceView  |
+-------------------------------+----------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                 Framework-agnostic Game Core                     |
|                                                                  |
| GameStateMachine   RunManager          EncounterManager           |
| CombatManager      ChallengeManager    ScoreManager               |
| PenaltyManager     InvulnerabilityTracker                         |
| AnswerValidator    AttackPatternRegistry  DataValidator           |
| LocalizationStore  FinalSequenceController                        |
+-------------------------------+----------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                            Data                                  |
| locales/*.json   challenges/*.json   encounters/*.json            |
| asset-manifest   final-sequence.json                              |
+------------------------------------------------------------------+
```

### 2.2 Principios

- **Core independiente de Phaser.** Managers, validadores, máquina de estados y generadores no importan Phaser.
- **Dependencias explícitas.** Se utilizan interfaces tipadas y callbacks inyectados; no existe un event bus global mutable.
- **Datos antes que condicionales.** Composición, ataques, daño, pools y texto se describen mediante datos validados.
- **Una escena activa por contexto.** Los overlays de gameplay son contenedores de `GameScene`, no escenas paralelas.
- **Timers deterministas.** Gameplay usa `deltaMs`; no utiliza `setTimeout` o `setInterval` para reglas de simulación.
- **Pooling.** Projectiles y efectos repetitivos regresan a pools con capacidad limitada.
- **Separación narrativa.** Mycelial Monolith no tiene HP, fases ni condición de victoria.
- **Localización sin rasterizar texto.** La UI recibe cadenas por clave y la fuente se carga localmente.

## 3. Escenas

| Escena | Responsabilidad | Requisitos |
|---|---|---|
| `BootScene` | Cargar fuente, manifiesto, datos y assets obligatorios; validar recursos | REQ-BOOT-001, REQ-DATA-001 |
| `LanguageSelectScene` | Seleccionar español o inglés | REQ-LOC-001 |
| `MenuScene` | Menú principal e inicio de Run | REQ-MENU-001 |
| `OfficeScene` | Despertar, diálogo, movimiento C4→C3, computadora y V4LK | REQ-INTRO-001, REQ-MOV-001 |
| `GameScene` | Cuatro Encounters, HUD, Challenges, transiciones y `FinalSequence` | REQ-COMBAT-001 a REQ-FINAL-001 |
| `DefeatScene` | Estadísticas, reinicio y regreso al menú | REQ-DEFEAT-001, REQ-RESET-001 |
| `DemoEndScene` | Pantalla final sin comunicar victoria sobre el Monolith | REQ-FINAL-001 |

`OfficeScene` mantiene el estado global entre `Intro`, `Dialogue` y `Exploration`. `GameScene` mantiene `Playing`, `Challenge`, `Paused`, `Transitioning` y `FinalSequence`.

No existen `VictoryScene` ni una escena de Boss combatible.

## 4. Core del juego

### 4.1 GameStateMachine

Estados:

- `Boot`
- `LanguageSelect`
- `Menu`
- `Intro`
- `Exploration`
- `Dialogue`
- `Playing`
- `Challenge`
- `Paused`
- `Transitioning`
- `Defeat`
- `FinalSequence`
- `DemoEnd`

Transiciones principales:

| Desde | Evento | Hacia |
|---|---|---|
| `Boot` | `bootComplete` | `LanguageSelect` |
| `LanguageSelect` | `languageConfirmed` | `Menu` |
| `Menu` | `startRun` | `Intro` |
| `Intro` | `wakeDialogueComplete` | `Exploration` |
| `Exploration` | `dialogueStarted` | `Dialogue` |
| `Dialogue` | `dialogueComplete` | `Exploration` |
| `Exploration` | `officeExitReached` | `Transitioning` |
| `Transitioning` | `encounterReady` | `Playing` |
| `Playing` | `challengePresented` | `Challenge` |
| `Challenge` | `challengeClosed` | `Playing` |
| `Exploration` o `Playing` | `manualPauseRequested` | `Paused` |
| `Playing` o `Challenge` | `safetyPauseRequested` | `Paused` |
| `Paused` | `resumeRequested` | estado guardado |
| `Playing` o `Challenge` | `encounterCompleted` | `Transitioning` |
| `Transitioning` | `nextEncounterReady` | `Playing` |
| `Transitioning` | `finalSequenceReady` | `FinalSequence` |
| `Playing` o `Challenge` | `playerDefeated` | `Defeat` |
| `FinalSequence` | `extractionComplete` | `DemoEnd` |
| `Paused` o `Defeat` | `restartRequested` | `Intro` |
| `Paused` o `Defeat` | `exitToMenuRequested` | `Menu` |

Reglas:

- `manualPauseRequested` desde `Challenge` se rechaza sin cambiar de estado y emite `pauseBlocked`.
- `safetyPauseRequested` sí puede guardar `Challenge` como estado de retorno.
- Las transiciones no listadas se rechazan y registran.
- `restartRequested` conserva idioma, reinicia la Run y vuelve a la oficina.
- No existe transición a `Victory`.

### 4.2 PauseContext

La pausa necesita distinguir su origen:

```text
PauseContext
- cause: manual | visibility
- returnState: Exploration | Playing | Challenge
- challengeSnapshot?: tiempo, texto y selección
```

- La pausa manual solo admite `Exploration` o `Playing`.
- La pausa de visibilidad admite `Playing` o `Challenge`.
- Si `returnState` es `Challenge`, el snapshot conserva tiempo, contenido capturado y opciones.
- Volver a una pestaña visible nunca reanuda automáticamente.

### 4.3 SessionSettings

Mantiene configuración que sobrevive al reinicio de una Run:

- `language: 'es' | 'en'`.

No guarda progreso, Score, Encounter ni HP. La persistencia fuera de la sesión queda fuera del alcance.

### 4.4 RunManager

Coordina el ciclo de una Run:

- Inicializa HP, Score, Streak, estadísticas y Encounter.
- Reinicia Managers y entidades.
- Conserva `SessionSettings.language`.
- Distingue `restartRun()` de `exitToMenu()`.
- `restartRun()` carga `OfficeScene` y estado `Intro`.
- `exitToMenu()` restaura la Run y carga `MenuScene`.

### 4.5 EncounterManager

Mantiene cuatro `EncounterConfig` ordenados:

1. Parse Mantis.
2. Mutable Widow.
3. Cast Hornet.
4. Boolean Beetle.

Responsabilidades:

- Instanciar todos los `enemySpawns` del Encounter.
- Mantener la colección de Enemies requeridos.
- Evaluar `completionRule`.
- Resolver el destino de daño declarado por `damageTargetMode`.
- Avanzar al siguiente Encounter.
- Aplicar curación aditiva con tope al iniciar los Encounters 2–4.
- Conservar Score y Streak.
- Después de Boolean Beetle, preparar `FinalSequence` en vez de un quinto Encounter.

Para encuentros múltiples, el Player no selecciona manualmente un objetivo en el demo. La estrategia se declara en datos. Modos soportados inicialmente:

- `roundRobin`: cada Correct Answer avanza al siguiente Enemy activo.
- `allActive`: el daño configurado se aplica a todos los Enemies activos.
- `sharedPool`: todos los Enemies representan un pool de HP común.

El modo definitivo de Mutable Widow y Cast Hornet debe fijarse en sus JSON antes de implementar esas especificaciones; la arquitectura no depende de una opción concreta.

### 4.6 CombatManager

Orquesta el Encounter activo:

- Crea Enemies y registra sus ataques.
- Mantiene referencias a `ProjectileSystem`, `CollisionSystem` y `EncounterManager`.
- Aplica el daño atómico de una Correct Answer al objetivo resuelto.
- Detecta HP del Player y condiciones de finalización.
- Ejecuta `resetForTransition()`:
  - cierra silenciosamente el Challenge activo;
  - libera Projectiles y efectos al pool;
  - cancela `extraProjectiles`;
  - reinicia el intervalo de Challenges;
  - conserva Score y Streak.

### 4.7 ChallengeManager

Estado interno:

- `activeChallenge: Challenge | null`.
- `remainingChallengeMs`.
- `intervalRemainingMs`.
- `availableIds`.
- `lastPresentedId`.
- `pendingAnswer`.

Comportamiento:

- Selección sin reposición.
- Reconstrucción del pool sin repetir inmediatamente el último Challenge.
- Máximo un Challenge activo; no hay cola.
- El intervalo avanza únicamente en `Playing`.
- El límite de respuesta avanza únicamente en `Challenge`.
- La pausa manual nunca congela un Challenge porque no puede activarse desde ese estado.
- La pausa de visibilidad detiene ambos timers mediante la suspensión completa del update.
- La expiración produce Incorrect Answer.
- `closeSilently(reason)` se utiliza en `encounterCompleted` y `playerDefeated`.
- La validación se delega a `AnswerValidator`.
- El cierre emite un resultado tipado con Challenge, resultado y tiempo restante.

Al cargar datos se valida que existan exactamente 12 Challenges, tres por categoría, y que el conjunto incluya ambas modalidades.

### 4.8 AnswerValidator

Funciones puras:

- Normalizar trim.
- Colapsar espacios internos consecutivos.
- Eliminar caracteres no imprimibles.
- Comparar case-insensitive por defecto.
- Aplicar `caseSensitive` cuando el Challenge lo indique.
- Validar índice de opción múltiple y rechazar índices inexistentes.

Nunca evalúa ni compila código del usuario.

### 4.9 ScoreManager

Estado:

- `score`.
- `currentStreak`.
- `maxStreak`.
- `correctCount`.
- `incorrectCount`.
- `elapsedRunMs`.
- `furthestEncounterId`.
- `locked` después de `Defeat`.

Operaciones:

- `applyCorrect(remainingMs)` calcula Score, aumenta Streak y estadísticas.
- `applyIncorrect()` resta Score con piso en cero y reinicia Streak.
- `lock()` impide cambios después de Defeat.
- `snapshot()` produce estadísticas para `DefeatScene` y, opcionalmente, `DemoEndScene`.
- `reset()` inicia una Run nueva.

Fórmulas iniciales configurables:

- Correct Answer: `100 + floor(remainingMs / 100) + currentStreak × 10`.
- Incorrect Answer: `max(score − 50, 0)`.

El tiempo total se acumula mediante `deltaMs` de Run, no mediante reloj de pared, para no contar pausas.

### 4.10 PenaltyManager

Solo implementa `extraProjectiles`:

- Estado: activo/inactivo y `remainingMs`.
- Duración inicial: 5000 ms, configurable por Encounter.
- Multiplica `projectilesPerBurst` por dos para ataques aplicables.
- Respeta capacidad del pool.
- Una nueva penalización reinicia la duración.
- Se cancela al concluir el Encounter, reiniciar o salir al menú.

No existe `inputLock` ni daño por Incorrect Answer.

### 4.11 InvulnerabilityTracker

- Mantiene `remainingMs`.
- `trigger(500)` solo funciona cuando no existe una ventana activa.
- Colisiones adicionales durante la ventana no la reinician ni extienden.
- El timer avanza por `deltaMs` durante gameplay.
- La pausa aceptada detiene su actualización.

### 4.12 AttackPatternRegistry

Sustituye al generador limitado a `linear`, `radial`, `spiral` y `random`. Registra estrategias puras o controladores deterministas por identificador de ataque:

- `parse.linearAttack`.
- `widow.reassignmentVolley`.
- `widow.scopeWeb`.
- `hornet.typeSting`.
- `hornet.castingSwarm`.
- `beetle.booleanBurst`.
- `beetle.xorCrossfire`.
- `beetle.falsePath`.
- `beetle.branchCharge`.

Cada estrategia recibe configuración, posición, objetivos, tiempo acumulado y un generador pseudoaleatorio inyectado cuando sea necesario. Devuelve comandos de simulación:

- crear Projectile;
- crear área hostil;
- desplazar Enemy;
- activar efecto ambiental;
- programar siguiente paso del ataque.

Esto permite representar ataques no proyectiles, como redes o cargas, sin convertirlos artificialmente en patrones radiales.

### 4.13 FinalSequenceController

Controlador de una secuencia dirigida por datos. No pertenece al sistema de combate.

Pasos mínimos:

1. Interacción Senior–V4LK.
2. Corrupción progresiva del hábitat.
3. Aparición de Mycelial Monolith.
4. Infección y reactivación de Boolean Beetle.
5. Aparición de minions infectados.
6. Advertencia de V4LK.
7. Lock-on de extracción.
8. Extracción del Senior.
9. Extracción de V4LK.
10. Fundido y transición a `DemoEnd`.

Mientras está activo:

- no se crean Challenges;
- no se calcula daño de combate;
- no se admite movimiento manual;
- Mycelial Monolith no tiene HP;
- los minions no necesitan IA completa;
- cada paso espera su condición de finalización antes de avanzar.

## 5. Entidades y sistemas Phaser

### 5.1 Player

- Sprite y animaciones runtime.
- Hitbox menor que la silueta visible.
- `hp`, `maxHp`, posición y dirección.
- Movimiento constante y sin inercia.
- Sin estado de carrera.
- Animaciones: idle, walk, keyboard attack, damage y defeat.
- Bounds basados en colisiones del tilemap, no únicamente en el viewport.

### 5.2 Enemy

- Entidad genérica configurada por `enemyArchetypeId`.
- `hp`, `maxHp`, dirección, ataques y estado visual.
- Arquetipos: Parse Mantis, Mutable Widow, Cast Hornet y Boolean Beetle.
- Puede ser terrestre o aéreo.
- Un Encounter mantiene una colección de Enemies, no una única referencia.

### 5.3 V4LK

- Entidad narrativa y acompañante visual.
- Materialización y reposo holográfico.
- No tiene HP ni colisiones hostiles.
- Participa en diálogos y `FinalSequence`.

### 5.4 MycelialMonolith

- Entidad narrativa exclusiva de `FinalSequence`.
- No extiende `Enemy`.
- No tiene HP, fases, barra de vida ni respuesta a Challenges.
- Reproduce aparición, corrupción, cables, esporas y control de minions mediante el controlador narrativo.

### 5.5 ProjectileSystem

- Mantiene un pool fijo con capacidad inicial suficiente para 80 entidades activas y margen para efectos de `extraProjectiles`.
- Adquiere, actualiza y libera Projectiles.
- Retira entidades al salir de límites de simulación o concluir su animación.
- Rechaza o limita spawns que excedan la capacidad, sin crear memoria sin límite.

La capacidad concreta se calibra después de medir el conjunto real de ataques; un valor inicial de 200 es aceptable como implementación, no como requisito funcional.

### 5.6 CollisionSystem

- Evalúa Hostile Attacks contra el hitbox del Player.
- Consulta `InvulnerabilityTracker` antes de aplicar daño.
- Distingue Projectiles, áreas hostiles y cargas corporales.
- Emite resultados de colisión; no decide transiciones de estado.

## 6. Presentación e input

### 6.1 UI dentro de GameScene

- **HUD:** HP del Player, estado del Encounter, Score y Streak.
- **EnemyStatus:** representa uno o varios Enemies sin asumir una única barra de Boss.
- **ChallengeOverlay:** código, instrucción, temporizador y widget de respuesta.
- **TextInputWidget:** cursor, máximo 12 caracteres y contador `n/12`.
- **MultipleChoiceWidget:** tres o cuatro opciones en orden estable.
- **PauseOverlay:** continuar, reiniciar y salir al menú.
- **PauseBlockedFeedback:** animación breve sin cambio de estado.
- **TutorialOverlay:** pasos del primer Encounter.
- **TransitionOverlay:** fundido y texto localizado entre Encounters.
- **DialogueOverlay:** diálogos localizados de V4LK y Senior.
- **FinalSequenceView:** presenta efectos y entidades dirigidos por `FinalSequenceController`.

### 6.2 InputManager

Existe un único adaptador de teclado y ratón por escena activa. Convierte eventos del navegador en intents; no modifica directamente Managers.

- Flechas → movimiento en `Exploration`, `Playing` y `Challenge`.
- Texto y símbolos → `TextInputWidget` solo en Typed Challenge.
- `Enter` → confirmar, enviar respuesta o avanzar diálogo según estado.
- `Backspace` → borrar en Typed Challenge.
- `1`–`4` y clic → seleccionar Multiple-choice Challenge.
- `Escape` en `Exploration` o `Playing` → `manualPauseRequested`.
- `Escape` en `Challenge` → `pauseBlocked`; no cambia de estado.

El listener de `visibilitychange` produce un intent diferente: `safetyPauseRequested`. Esta separación evita reutilizar por error las reglas de pausa manual.

## 7. Localización y recursos

### 7.1 LocalizationStore

- Carga `es.json` y `en.json` durante Boot.
- Mantiene el idioma seleccionado en `SessionSettings`.
- Resuelve claves con parámetros simples.
- Separa texto técnico no traducible de instrucciones localizadas.
- En desarrollo, una clave faltante produce un error visible y registro identificable.
- `DataValidator` rechaza el inicio si falta una clave obligatoria en cualquiera de los dos idiomas.

### 7.2 AssetManifest y AssetRegistry

El manifiesto clasifica recursos por clave estable:

- fuente;
- spritesheets de Player;
- Enemies normales e infectados;
- Projectiles e impactos;
- tilesets, tilemaps y props;
- V4LK;
- Mycelial Monolith y extracción;
- UI e iconos.

`BootScene` carga el manifiesto y `AssetRegistry` valida:

- clave única;
- archivo disponible;
- tipo correcto;
- dimensiones esperadas cuando sean críticas;
- configuración de frames válida.

Geist Pixel Square se carga desde el WOFF2 local y Boot espera a que esté disponible antes de medir o crear texto dependiente de la fuente.

## 8. Modelos de datos

Los siguientes modelos describen contratos conceptuales; sus nombres finales pueden ajustarse durante implementación sin cambiar el comportamiento.

### 8.1 Challenge

```text
ChallengeCategory = syntax | variable | type | logic
ChallengeMode = typed | multiple-choice

BaseChallenge
- id
- category
- mode
- code
- instructionKey
- damage
- timeLimitMs

TypedChallenge
- acceptedAnswers[]
- caseSensitive?

MultipleChoiceChallenge
- options[]
- correctIndex
```

Validaciones:

- IDs únicos.
- Exactamente tres Challenges por categoría.
- Total exacto de 12.
- Al menos una instancia de cada modalidad en la Run.
- `correctIndex` dentro del rango.
- Entre tres y cuatro opciones.
- Respuestas capturadas de diseño compatible con el límite de 12 caracteres.

### 8.2 EncounterConfig

```text
EncounterConfig
- id
- mapKey
- category
- enemySpawns[]
- challengePool[]
- challengeIntervalMs
- defaultTimeLimitMs
- penalty
- damageTargetMode
- completionRule
- transitionTextKey
- tutorial?

EnemySpawnConfig
- id
- archetypeId
- position
- maxHp
- attackIds[]
- attackParams

PenaltyConfig
- type: extraProjectiles
- multiplier
- durationMs
```

Validaciones obligatorias:

- Cuatro Encounters en el orden aprobado.
- Un Parse Mantis, dos Mutable Widows, tres Cast Hornets y un Boolean Beetle.
- Todos los Challenges referenciados existen y pertenecen a la categoría correcta.
- Todos los ataques existen en `AttackPatternRegistry`.
- `completionRule` reconoce todos los objetivos requeridos.
- `damageTargetMode` es compatible con la composición.

### 8.3 GameState y estadísticas

```text
GameState =
  Boot | LanguageSelect | Menu | Intro | Exploration | Dialogue |
  Playing | Challenge | Paused | Transitioning | Defeat |
  FinalSequence | DemoEnd

Stats
- finalScore
- correctCount
- incorrectCount
- maxStreak
- totalPlayTimeMs
- furthestEncounterId
```

### 8.4 FinalSequenceStep

```text
FinalSequenceStep
- id
- type
- actorIds[]
- effectKey?
- dialogueKey?
- durationMs?
- completionSignal?
```

Los pasos se validan para impedir una secuencia sin extracción o sin transición a `DemoEnd`.

## 9. Orden de resolución por frame

`GameScene.update(time, deltaMs)` procesa fases estrictas:

1. **Capturar intents.** Movimiento, respuesta, selección y pausa.
2. **Resolver pausa aceptada.** Si se acepta pausa manual o de seguridad, se omiten las fases de gameplay restantes.
3. **Registrar respuesta pendiente.** Se registra sin validar todavía.
4. **Actualizar movimiento del Player.** Se aplican dirección y colisiones del mapa.
5. **Actualizar Enemies y generar ataques.** Se procesan estrategias y spawns.
6. **Validar respuesta pendiente.** `AnswerValidator` produce Correct o Incorrect Answer.
7. **Aplicar efectos atómicos.** Daño de Challenge, Score, Streak y penalización.
8. **Actualizar ataques.** Projectiles, áreas y cargas avanzan.
9. **Resolver colisiones.** Se aplica invulnerabilidad y daño hostil.
10. **Resolver estados terminales.** Encounter completado o Player derrotado.
11. **Ejecutar transiciones y limpiar.** Se cierran Challenges y se liberan entidades.
12. **Sincronizar presentación.** HUD, overlays y animaciones reflejan el estado resultante.

Reglas de carrera:

- Una Correct Answer validada y aplicada en el paso 7 puede completar el Encounter antes de la colisión del paso 9.
- Una respuesta aún no validada no evita daño fatal resuelto primero.
- Después de detectar una condición terminal no se procesan nuevos cambios de Score o Challenge en ese frame.
- Todos los timers reciben el mismo `deltaMs` autorizado por el estado.

`OfficeScene` utiliza un update simplificado de intents, movimiento, colisiones, interacciones y presentación. `FinalSequenceController` utiliza su propia secuencia sin pasos de combate.

## 10. Flujos clave

### 10.1 Arranque e idioma

```text
BootScene
→ carga fuente, manifiesto, locales y datos
→ DataValidator valida contratos y referencias
→ LanguageSelectScene
→ SessionSettings.language
→ MenuScene
```

Un error obligatorio detiene el inicio y muestra la clave o recurso responsable.

### 10.2 Oficina inicial

```text
Menu startRun
→ OfficeScene / Intro
→ despertar y diálogo
→ Exploration
→ interacción con C3
→ Dialogue + barra de carga
→ materialización de V4LK
→ salida habilitada
→ Transitioning
→ Encounter 1
```

### 10.3 Ciclo de Challenge

```text
Playing
→ intervalo agotado
→ ChallengeManager selecciona Challenge
→ Challenge
→ Player continúa moviéndose
→ respuesta o expiración
→ validación y efectos
→ cierre
→ Playing
```

### 10.4 Intento de pausa durante Challenge

```text
Challenge + Escape
→ InputManager emite manualPauseRequested
→ GameStateMachine rechaza transición
→ emite pauseBlocked
→ feedback visual breve
→ Challenge, Enemies, ataques y timer continúan
```

### 10.5 Pausa de seguridad durante Challenge

```text
Challenge + visibility hidden
→ safetyPauseRequested
→ snapshot del Challenge
→ Paused(cause=visibility, returnState=Challenge)
→ todos los timers se congelan
→ visibility visible no reanuda
→ continuar restaura exactamente el snapshot
```

### 10.6 Encuentro completado

```text
completionRule satisfecha
→ closeSilently del Challenge restante
→ liberar Projectiles y efectos
→ cancelar penalización
→ conservar Score y Streak
→ Transitioning
→ curación parcial
→ siguiente Encounter
```

Después de Boolean Beetle, el destino es `FinalSequence`.

### 10.7 Derrota con Challenge activo

```text
HP del Player llega a cero
→ ChallengeManager.closeSilently(playerDefeated)
→ descartar respuesta parcial
→ ScoreManager.lock()
→ limpiar simulación
→ DefeatScene
```

### 10.8 Reinicio

```text
Paused o Defeat → reiniciar
→ RunManager.restartRun()
→ preservar idioma
→ reset de Managers y entidades
→ OfficeScene / Intro
```

Salir al menú usa el mismo reset, pero termina en `MenuScene`.

### 10.9 Cierre del demo

```text
Boolean Beetle derrotado
→ FinalSequenceController
→ corrupción
→ Mycelial Monolith
→ infección y minions
→ advertencia de V4LK
→ extracción
→ fundido
→ DemoEndScene
```

## 11. Validación de datos

`DataValidator` se ejecuta durante Boot y agrega todos los errores antes de bloquear el inicio.

Comprueba:

- manifiesto y archivos obligatorios;
- claves de localización presentes en ambos idiomas;
- 12 Challenges y distribución 3/3/3/3;
- ambas modalidades;
- referencias de pools válidas;
- cuatro EncounterConfigs en orden;
- composición exacta de Enemies;
- ataques registrados;
- valores numéricos finitos y rangos positivos;
- índices de opción correctos;
- reglas de finalización y targeting válidas;
- pasos obligatorios de `FinalSequence`.

En producción se muestra un mensaje de error general; el detalle se registra en consola. En desarrollo se presenta un reporte completo.

## 12. Estrategia de pruebas

### 12.1 Pruebas unitarias críticas con Vitest

- `GameStateMachine`
  - todas las transiciones permitidas;
  - rechazo de transiciones inválidas;
  - pausa manual rechazada desde Challenge;
  - pausa de seguridad y restauración de Challenge;
  - reinicio hacia Intro y ausencia de Victory.
- `AnswerValidator`
  - normalización, alternativas, sensibilidad y caracteres invisibles;
  - índices inválidos de opción múltiple.
- `ChallengeManager`
  - selección sin reposición;
  - no repetición entre ciclos;
  - expiración;
  - máximo un Challenge;
  - timers por estado;
  - cierre silencioso.
- `ScoreManager`
  - fórmulas, piso cero, Streak máxima, lock y reset.
- `EncounterManager`
  - cuatro Encounters en orden;
  - múltiples Enemies;
  - completionRule;
  - damageTargetMode;
  - destino FinalSequence después de Boolean Beetle.
- `PenaltyManager`
  - solo extraProjectiles;
  - duración, reemplazo, límite y cancelación.
- `InvulnerabilityTracker`
  - ventana de 500 ms sin extensión.
- `DataValidator`
  - distribución de Challenges, locales, referencias y secuencia final.

### 12.2 Pruebas de integración

- Boot → idioma → menú.
- Oficina completa C4 → C3 → V4LK.
- Correct Answer aplica daño, Score y Streak juntos.
- Incorrect Answer aplica feedback y extraProjectiles sin reducir HP.
- Mutable Widow y Cast Hornet no terminan hasta satisfacer su completionRule.
- Escape durante Challenge no congela nada.
- Visibility pause conserva exactamente el Challenge.
- Defeat cierra silenciosamente el Challenge.
- Reinicio conserva idioma y vuelve a la oficina.
- Boolean Beetle conduce a FinalSequence y nunca a Victory.

### 12.3 Smoke test manual en Chrome

- Recorrido completo desde idioma hasta DemoEnd.
- Ambas modalidades aparecen.
- Rendimiento con carga normal y prueba de margen.
- Pixel art nítido a diferentes tamaños de ventana.
- Ausencia de assets faltantes, claves sin traducir y errores de consola.
- Fuente local sin solicitud a Google Fonts.

Firefox y Edge se validan de forma secundaria, sin bloquear el primer build.

## 13. Entrega

- `vite build` genera archivos estáticos en `dist/`.
- El build incluye código, JSON, tilemaps, sprites, UI y fuente local.
- El primer despliegue puede utilizar S3 static website hosting.
- CloudFront y HTTPS quedan fuera del requisito del primer build.
- No se requiere backend.
- El smoke test se ejecuta sobre la URL publicada en Chrome.

## 14. Estrategia de repositorio y estructura propuesta

El proyecto utiliza un **monorepo**. La raíz actual `GameAssets` contiene la documentación normativa, los assets fuente y el proyecto ejecutable. Esta decisión mantiene sincronizadas las versiones de código, datos y arte utilizadas por cada release.

Límites:

- `game/` contiene la aplicación Phaser y únicamente consume assets runtime curados.
- `game/public/assets/` es la fuente de assets que entra al build; no debe contener masters, conceptos, chroma sources ni archivos superseded.
- `assets-source/` conserva masters y fuentes editables que no entran al build.
- `output/` y `sprite-export/` son ubicaciones heredadas de producción artística hasta que TASK-014 clasifique y copie los entregables aprobados. No son fuentes de carga directa para el juego.
- La documentación baseline permanece en la raíz. Las nuevas SPEC pueden organizarse bajo `specs/`.
- Binarios pesados se administran con Git LFS conforme a `.gitattributes`.
- La política de colaboración vive en `CONTRIBUTING.md`; `AGENTS.md` contiene instrucciones operativas para agentes.
- Git, ramas, commits y PR no forman parte de la arquitectura runtime, pero deben preservar la trazabilidad definida por estos documentos.

```text
GameAssets/
├── SPEC-000-demo-scope.md
├── GDD.md
├── requirements.md
├── design.md
├── tasks.md
├── CONTRIBUTING.md
├── AGENTS.md
├── specs/
├── assets-source/
├── output/                       # staging artístico heredado
├── sprite-export/                # export artístico heredado
├── game/
│   ├── public/
│   │   └── assets/               # solo runtime aprobado
│   │       ├── fonts/
│   │       ├── sprites/
│   │       ├── projectiles/
│   │       ├── tilesets/
│   │       ├── tilemaps/
│   │       ├── ui/
│   │       └── effects/
│   ├── src/
│   │   ├── main.ts
│   │   ├── config.ts
│   │   ├── scenes/
│   │   │   ├── BootScene.ts
│   │   │   ├── LanguageSelectScene.ts
│   │   │   ├── MenuScene.ts
│   │   │   ├── OfficeScene.ts
│   │   │   ├── GameScene.ts
│   │   │   ├── DefeatScene.ts
│   │   │   └── DemoEndScene.ts
│   │   ├── core/
│   │   │   ├── GameStateMachine.ts
│   │   │   ├── SessionSettings.ts
│   │   │   ├── RunManager.ts
│   │   │   ├── EncounterManager.ts
│   │   │   ├── CombatManager.ts
│   │   │   ├── ChallengeManager.ts
│   │   │   ├── ScoreManager.ts
│   │   │   ├── PenaltyManager.ts
│   │   │   ├── InvulnerabilityTracker.ts
│   │   │   └── FinalSequenceController.ts
│   │   ├── logic/
│   │   │   ├── AnswerValidator.ts
│   │   │   ├── AttackPatternRegistry.ts
│   │   │   └── DataValidator.ts
│   │   ├── entities/
│   │   │   ├── Player.ts
│   │   │   ├── Enemy.ts
│   │   │   ├── Projectile.ts
│   │   │   ├── V4LK.ts
│   │   │   └── MycelialMonolith.ts
│   │   ├── systems/
│   │   │   ├── ProjectileSystem.ts
│   │   │   ├── CollisionSystem.ts
│   │   │   └── ProjectilePool.ts
│   │   ├── input/
│   │   │   └── InputManager.ts
│   │   ├── localization/
│   │   │   └── LocalizationStore.ts
│   │   ├── assets/
│   │   │   ├── AssetManifest.ts
│   │   │   └── AssetRegistry.ts
│   │   ├── ui/
│   │   │   ├── HUD.ts
│   │   │   ├── ChallengeOverlay.ts
│   │   │   ├── TextInputWidget.ts
│   │   │   ├── MultipleChoiceWidget.ts
│   │   │   ├── PauseOverlay.ts
│   │   │   ├── PauseBlockedFeedback.ts
│   │   │   ├── TutorialOverlay.ts
│   │   │   ├── DialogueOverlay.ts
│   │   │   └── TransitionOverlay.ts
│   │   ├── data/
│   │   │   ├── locales/{es,en}.json
│   │   │   ├── challenges/{syntax,variable,type,logic}.json
│   │   │   ├── encounters/{parse-mantis,mutable-widow,cast-hornet,boolean-beetle}.json
│   │   │   └── final-sequence.json
│   │   └── types/
│   ├── tests/
│   │   ├── core/
│   │   ├── logic/
│   │   └── integration/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
├── .github/
│   └── pull_request_template.md
├── .gitignore
└── .gitattributes
```

La migración hacia esta estructura debe ser incremental y no autoriza eliminar masters. `tasks.md` decide el orden y exige verificar cada movimiento antes de retirar una ubicación heredada.

## 15. Trazabilidad requisito → diseño

| Requisito | Componentes principales |
|---|---|
| REQ-BOOT-001 | BootScene, AssetManifest, AssetRegistry, DataValidator |
| REQ-LOC-001 | LanguageSelectScene, SessionSettings, LocalizationStore |
| REQ-MENU-001 | MenuScene, RunManager, GameStateMachine |
| REQ-INTRO-001 | OfficeScene, DialogueOverlay, V4LK |
| REQ-MOV-001 | Player, InputManager, tilemap collisions |
| REQ-STATE-001 | GameStateMachine, PauseContext |
| REQ-COMBAT-001 | CombatManager, CollisionSystem, ProjectileSystem, InvulnerabilityTracker |
| REQ-CHL-001 | ChallengeManager, ChallengeOverlay |
| REQ-CHL-002 | TextInputWidget, AnswerValidator, InputManager |
| REQ-CHL-003 | MultipleChoiceWidget, AnswerValidator, InputManager |
| REQ-CHL-004 | ChallengeManager, CombatManager, ScoreManager, EncounterManager |
| REQ-CHL-005 | ChallengeManager, ScoreManager, PenaltyManager, HUD |
| REQ-PROG-001 | EncounterManager, CombatManager, TransitionOverlay |
| REQ-TUT-001 | TutorialOverlay, Encounter 1 data |
| REQ-SCORE-001 | ScoreManager, HUD, DefeatScene |
| REQ-FINAL-001 | FinalSequenceController, MycelialMonolith, DemoEndScene |
| REQ-DEFEAT-001 | CombatManager, ScoreManager, DefeatScene |
| REQ-PAUSE-001 | GameStateMachine, PauseContext, PauseOverlay, InputManager |
| REQ-RESET-001 | RunManager, SessionSettings |
| REQ-DATA-001 | DataValidator, EncounterConfig, Challenge, LocalizationStore |
| REQ-PERF-001 | ProjectilePool, ProjectileSystem, performance smoke test |
| REQ-COMPAT-001 | Phaser config, canvas scaling, browser smoke test |
| REQ-DELIVERY-001 | Vite build, static deployment, AssetManifest |

## 16. Decisiones abiertas

No bloquean `SPEC-001`, pero deben resolverse antes de implementar el contenido que afectan:

- `damageTargetMode` definitivo para Mutable Widow y Cast Hornet.
- Valores de HP, daño, intervalos y densidad.
- Fórmula final de Score.
- Duración exacta de transiciones.
- Distribución concreta de los 12 Challenges entre modalidades.
- Capacidad final del ProjectilePool después de medir los ataques reales.
