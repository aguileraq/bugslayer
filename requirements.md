# BugSlayer — Requirements Document

- **Estado:** Baseline funcional
- **Versión:** 2.0
- **Fecha:** 2026-08-06
- **Alcance rector:** `SPEC-000-demo-scope.md`

## 1. Propósito y autoridad

Este documento define el comportamiento verificable del demo de BugSlayer. Describe **qué** debe hacer el producto; las decisiones sobre clases, escenas, módulos, carpetas y otras estructuras de implementación pertenecen a `design.md`.

`SPEC-000-demo-scope.md` decide qué entra y qué no entra en el demo. Ante un conflicto de alcance, prevalece SPEC-000. El GDD comunica la visión general, pero no puede contradecir estos requisitos.

BugSlayer es un juego web de escritorio que combina *bullet hell* con desafíos breves de corrección de código TypeScript. El jugador controla al Senior Engineer, esquiva ataques y responde preguntas para dañar enemigos. La experiencia termina con la aparición de Mycelial Monolith y una extracción de emergencia; el jefe final no se derrota en el demo.

## 2. Restricciones del producto

- Motor: Phaser.
- Lenguaje de desarrollo: TypeScript.
- Navegador principal: Chrome de escritorio.
- Resolución lógica: 960 × 540 px.
- Distribución: aplicación web estática sin backend obligatorio.
- Idiomas: español e inglés.
- Entrada: teclado y ratón para opción múltiple.
- No se ejecuta el código escrito por el usuario; las respuestas se comparan como datos.

## 3. Glosario

- **Player:** Senior Engineer controlado por el usuario.
- **V4LK:** IA holográfica con forma de perro salchicha que acompaña narrativamente al Player.
- **Enemy:** entidad hostil de un Encounter.
- **Encounter:** enfrentamiento jugable compuesto por uno o más Enemies, ataques y un pool de Challenges.
- **Mycelial Monolith:** jefe final narrativo; no constituye un Encounter derrotado en el demo.
- **Projectile:** entidad hostil móvil generada por un Enemy.
- **Hostile Attack:** fuente de daño enemiga, incluyendo Projectiles y ataques corporales explícitamente configurados.
- **Challenge:** pregunta breve de TypeScript presentada durante el gameplay.
- **Typed Challenge:** Challenge resuelto capturando una respuesta de texto.
- **Multiple-choice Challenge:** Challenge resuelto seleccionando una opción.
- **Correct Answer:** respuesta válida que produce daño, Score y Streak como un resultado atómico.
- **Incorrect Answer:** respuesta inválida o expiración de tiempo; nunca reduce directamente HP.
- **Invulnerability Period:** ventana de 500 ms posterior a un impacto efectivo.
- **Score:** puntuación acumulada durante la sesión.
- **Streak:** cantidad de Correct Answers consecutivas.
- **Run:** recorrido iniciado en la oficina y terminado por Defeat o DemoEnd.

## 4. Requisitos funcionales

### REQ-BOOT-001 — Arranque y precarga

**Historia:** Como jugador, quiero que el demo prepare sus recursos antes de comenzar para no encontrar assets faltantes durante la partida.

#### Criterios de aceptación

1. WHEN la aplicación inicia, THE sistema SHALL entrar en estado `Boot` y cargar los recursos obligatorios del recorrido completo.
2. WHILE la precarga está activa, THE sistema SHALL mostrar feedback de carga y SHALL NOT aceptar controles de gameplay.
3. IF un recurso obligatorio no puede cargarse, THEN THE sistema SHALL impedir el inicio de la Run y mostrar un error identificable.
4. WHEN todos los recursos obligatorios están disponibles, THE sistema SHALL transicionar a `LanguageSelect`.
5. THE fuente Geist Pixel Square SHALL cargarse desde un recurso local y SHALL NOT requerir una solicitud a Google Fonts.

### REQ-LOC-001 — Selección de idioma y localización

**Historia:** Como jugador, quiero elegir español o inglés antes de comenzar para entender toda la experiencia.

#### Criterios de aceptación

1. WHEN termina `Boot`, THE sistema SHALL mostrar `LanguageSelect` antes del menú principal.
2. THE sistema SHALL ofrecer exactamente español e inglés.
3. WHEN el jugador confirma un idioma, THE sistema SHALL conservarlo durante toda la sesión y transicionar a `Menu`.
4. THE sistema SHALL cargar en el idioma seleccionado menús, diálogos, tutoriales, preguntas, instrucciones, resultados y mensajes del sistema.
5. THE sistema SHALL mantener fragmentos de TypeScript, operadores y respuestas técnicas sin traducir cuando la traducción alteraría el Challenge.
6. THE interfaz SHALL admitir `¿`, `?`, `¡`, `!`, vocales acentuadas, `ñ` y `ü` sin caracteres faltantes.
7. WHEN el jugador reinicia o vuelve al menú, THE sistema SHALL conservar el idioma seleccionado.

### REQ-MENU-001 — Menú principal e inicio de Run

**Historia:** Como jugador, quiero iniciar una partida desde el menú para comenzar el recorrido del demo.

#### Criterios de aceptación

1. WHEN `Menu` se activa, THE sistema SHALL mostrar el título del juego y una acción clara para iniciar.
2. WHEN el jugador activa la acción de inicio, THE sistema SHALL restaurar los valores iniciales de la Run y transicionar a la oficina inicial.
3. THE menú SHALL usar el idioma seleccionado.

### REQ-INTRO-001 — Oficina inicial y aparición de V4LK

**Historia:** Como jugador, quiero descubrir el contexto mediante una introducción jugable para comprender dónde estoy y quién es V4LK.

#### Criterios de aceptación

1. WHEN comienza una Run, THE sistema SHALL mostrar al Senior Engineer dormido y sentado en el cubículo C4.
2. WHEN el Senior despierta, THE sistema SHALL mostrar el diálogo «¿Qué ha pasado? ¿Dónde estoy?» o su versión localizada.
3. WHEN termina el diálogo inicial, THE Senior SHALL levantarse y THE sistema SHALL habilitar el control del Player.
4. WHILE el Player permanezca en la oficina, THE sistema SHALL permitir caminar y SHALL NOT permitir correr.
5. THE computadora C3 SHALL comunicar visualmente que es el objetivo mediante su estado parpadeante.
6. WHEN el Player interactúa con C3 desde una posición válida, THE sistema SHALL reproducir la pulsación de una tecla y activar el monitor.
7. WHEN se activa el monitor, THE sistema SHALL mostrar una barra de carga que progresa hasta completarse.
8. WHEN termina la carga, THE sistema SHALL materializar y estabilizar a V4LK.
9. WHEN concluye la presentación de V4LK, THE sistema SHALL habilitar la salida hacia el Jardín de Compilación.
10. WHILE la introducción de oficina está activa, THE sistema SHALL NOT generar Enemies, Projectiles ni Challenges.

### REQ-MOV-001 — Movimiento del jugador

**Historia:** Como jugador, quiero moverme de forma precisa para explorar y esquivar ataques.

#### Criterios de aceptación

1. WHILE una flecha direccional está presionada y el estado permite movimiento, THE Player SHALL moverse en esa dirección a velocidad constante.
2. WHEN se liberan todas las flechas, THE Player SHALL detenerse inmediatamente, sin inercia ni movimiento residual.
3. THE sistema SHALL NOT aplicar movimiento automático, momentum ni control por IA al Player.
4. THE sistema SHALL impedir que el Player atraviese límites y colisiones del área caminable.
5. WHILE un Challenge está activo, THE flechas SHALL continuar moviendo al Player y SHALL NOT insertar caracteres en la respuesta.
6. WHILE el estado sea `Exploration`, `Playing` o `Challenge`, THE sistema SHALL conservar la capacidad de movimiento salvo que una secuencia narrativa explícita tome el control.
7. WHILE el estado sea `Boot`, `LanguageSelect`, `Menu`, `Dialogue`, `Paused`, `Transitioning`, `Defeat`, `FinalSequence` o `DemoEnd`, THE sistema SHALL deshabilitar el movimiento manual.
8. THE sistema SHALL NOT ofrecer una acción de correr en el demo.

### REQ-STATE-001 — Máquina de estados

**Historia:** Como sistema, quiero transiciones explícitas para que el comportamiento sea determinista y verificable.

#### Criterios de aceptación

1. THE sistema SHALL reconocer los estados `Boot`, `LanguageSelect`, `Menu`, `Intro`, `Exploration`, `Dialogue`, `Playing`, `Challenge`, `Paused`, `Transitioning`, `Defeat`, `FinalSequence` y `DemoEnd`.
2. THE sistema SHALL rechazar o registrar cualquier transición no permitida.
3. THE sistema SHALL mantener como máximo un estado principal activo.
4. THE sistema SHALL NOT definir un estado de victoria causado por derrotar a Mycelial Monolith.
5. WHEN se entra en un estado no jugable, THE sistema SHALL suspender o limpiar las entradas de gameplay según corresponda.

### REQ-COMBAT-001 — Ataques, colisiones e invulnerabilidad

**Historia:** Como jugador, quiero ataques predecibles y colisiones consistentes para poder mejorar mediante habilidad.

#### Criterios de aceptación

1. WHILE un Encounter está activo, THE Enemies SHALL ejecutar únicamente los ataques configurados para ese Encounter.
2. IF un Hostile Attack colisiona con el hitbox del Player y no existe Invulnerability Period, THEN THE sistema SHALL reducir el HP según el daño configurado.
3. WHEN se aplica daño efectivo, THE sistema SHALL iniciar un Invulnerability Period de 500 ms.
4. IF una colisión ocurre durante Invulnerability Period, THEN THE sistema SHALL ignorar el daño y SHALL NOT reiniciar ni extender la ventana.
5. A Hostile Attack ignorado por invulnerabilidad SHALL conservar el comportamiento definido para su tipo; una colisión ignorada no puede crear daño adicional por sí misma.
6. WHEN un Projectile abandona los límites de simulación o concluye su ciclo, THE sistema SHALL retirarlo de la simulación activa y dejar sus recursos disponibles para reutilización.
7. WHILE un Challenge está activo, THE Enemies y Projectiles SHALL continuar funcionando normalmente.
8. THE sistema SHALL resolver cada frame en un orden fijo: entrada, registro de respuesta, movimiento, generación de ataques, validación, efectos, avance, colisiones, estados terminales y transiciones.
9. IF una Correct Answer ya validada completa el Encounter en el mismo frame en que un ataque reduciría el HP del Player a cero, THEN THE sistema SHALL priorizar la finalización del Encounter.
10. IF el daño fatal se resuelve antes de validar una respuesta pendiente, THEN THE sistema SHALL entrar en `Defeat` y descartar la respuesta pendiente.
11. THE HP del Player SHALL reducirse únicamente por Hostile Attacks; una Incorrect Answer SHALL NOT reducir HP.

### REQ-CHL-001 — Ciclo general de Challenges

**Historia:** Como jugador, quiero que aparezcan desafíos durante el combate para poder dañar a los enemigos.

#### Criterios de aceptación

1. WHEN transcurre el intervalo configurado y no existe Challenge activo, THE sistema SHALL seleccionar uno del pool del Encounter sin reposición.
2. IF el pool se agota y el Encounter continúa, THEN THE sistema SHALL reconstruirlo evitando que el primer Challenge del nuevo ciclo sea igual al último presentado.
3. WHEN aparece un Challenge, THE sistema SHALL mostrar código TypeScript, una instrucción breve y un límite de tiempo.
4. THE sistema SHALL mantener como máximo un Challenge activo y SHALL NOT encolar Challenges pendientes.
5. WHILE un Challenge está activo, THE Player SHALL continuar moviéndose y esquivando.
6. WHILE un Challenge está activo, THE cronómetro del intervalo entre Challenges SHALL permanecer detenido.
7. WHEN el Challenge se cierra por Correct Answer, Incorrect Answer o expiración, THE intervalo SHALL reiniciarse desde cero.
8. IF expira el límite de tiempo, THEN THE sistema SHALL tratar el resultado como Incorrect Answer.
9. THE demo SHALL contener exactamente 12 Challenges: tres Syntax, tres Variable, tres Type y tres Logic.
10. THE demo SHALL presentar al menos un Typed Challenge y un Multiple-choice Challenge durante una Run completa.

### REQ-CHL-002 — Respuesta capturada

**Historia:** Como jugador, quiero escribir una corrección breve para resolver Challenges de texto.

#### Criterios de aceptación

1. WHEN un Typed Challenge está activo, THE sistema SHALL mostrar un campo, cursor y contador `n/12`.
2. THE campo SHALL aceptar caracteres alfanuméricos y símbolos imprimibles hasta un máximo de 12 caracteres.
3. IF el campo contiene 12 caracteres, THEN cualquier carácter adicional SHALL ignorarse silenciosamente.
4. THE flechas SHALL mover al Player y SHALL NOT modificar el campo.
5. WHEN el jugador presiona Enter, THE sistema SHALL enviar la respuesta.
6. WHEN el jugador presiona Backspace, THE sistema SHALL eliminar el último carácter.
7. EACH Typed Challenge SHALL declarar una o más respuestas aceptadas.
8. BEFORE comparar, THE sistema SHALL aplicar trim, colapsar espacios internos consecutivos y descartar caracteres invisibles no imprimibles.
9. THE comparación SHALL ser case-insensitive por defecto y SHALL admitir una bandera de sensibilidad a mayúsculas.
10. IF la respuesta normalizada coincide con alguna respuesta aceptada, THEN THE sistema SHALL producir Correct Answer.
11. THE sistema SHALL NOT ejecutar, evaluar ni compilar el texto ingresado.

### REQ-CHL-003 — Opción múltiple

**Historia:** Como jugador, quiero seleccionar una opción para resolver Challenges de reconocimiento.

#### Criterios de aceptación

1. WHEN un Multiple-choice Challenge está activo, THE sistema SHALL mostrar entre tres y cuatro opciones numeradas.
2. WHEN el jugador presiona `1`–`4` y existe la opción correspondiente, THE sistema SHALL enviar esa selección.
3. WHEN el jugador hace clic en una opción válida, THE sistema SHALL enviar esa selección.
4. THE sistema SHALL ignorar números sin una opción correspondiente.
5. EACH Multiple-choice Challenge SHALL declarar exactamente una opción correcta.

### REQ-CHL-004 — Respuesta correcta

**Historia:** Como jugador, quiero que una respuesta correcta produzca progreso claro.

#### Criterios de aceptación

1. WHEN se valida una Correct Answer, THE sistema SHALL producir atómicamente daño de Challenge, incremento de Score e incremento de Streak.
2. THE tres efectos SHALL ocurrir siempre juntos aunque estén implementados en sistemas distintos.
3. THE Encounter SHALL declarar mediante datos qué objetivo o conjunto de objetivos recibe el daño en encuentros con múltiples Enemies.
4. WHEN se produce Correct Answer, THE sistema SHALL reproducir feedback visual positivo aprobado.

### REQ-CHL-005 — Respuesta incorrecta y tiempo agotado

**Historia:** Como jugador, quiero consecuencias visibles pero no fatales ante un error.

#### Criterios de aceptación

1. WHEN se produce Incorrect Answer, THE sistema SHALL reducir Score, reiniciar Streak, cerrar el Challenge y continuar el Encounter.
2. THE Score SHALL tener un mínimo de cero.
3. Incorrect Answer y expiración SHALL NOT reducir HP.
4. WHEN se produce Incorrect Answer, THE sistema SHALL mostrar la respuesta correcta durante 2 segundos.
5. WHEN se produce Incorrect Answer, THE sistema SHALL activar `extraProjectiles` durante 5 segundos.
6. WHILE `extraProjectiles` está activo, THE sistema SHALL multiplicar por dos `projectilesPerBurst` de los patrones aplicables sin superar la capacidad configurada.
7. WHEN el tiempo se agota, THE sistema SHALL reproducir feedback de tiempo agotado además de los efectos de Incorrect Answer.
8. THE demo SHALL NOT incluir `inputLock`, daño por respuesta incorrecta ni selección de dificultad.

### REQ-PROG-001 — Encuentros y progresión

**Historia:** Como jugador, quiero avanzar por encuentros diferenciados para percibir progreso y aumento de dificultad.

#### Criterios de aceptación

1. THE sistema SHALL presentar cuatro Encounters jugables en este orden: Parse Mantis, Mutable Widow, Cast Hornet y Boolean Beetle.
2. Encounter 1 SHALL contener un Parse Mantis y utilizar la categoría Syntax.
3. Encounter 2 SHALL contener dos Mutable Widows simultáneas y utilizar Variable.
4. Encounter 3 SHALL contener tres Cast Hornets voladores y utilizar Type.
5. Encounter 4 SHALL contener un Boolean Beetle pesado y utilizar Logic.
6. EACH Encounter SHALL declarar sus Enemies, ataques, pool de Challenges, HP, daño, intervalos y reglas de finalización mediante datos.
7. AN Encounter con múltiples Enemies SHALL completarse únicamente cuando todos los objetivos requeridos por su configuración hayan sido derrotados.
8. WHEN se completa un Encounter, THE sistema SHALL cerrar cualquier Challenge activo sin convertirlo en Incorrect Answer.
9. WHEN comienza `Transitioning`, THE sistema SHALL retirar todos los Projectiles activos y cancelar `extraProjectiles`.
10. WHEN comienza el siguiente Encounter, THE sistema SHALL reiniciar el intervalo de Challenges.
11. BETWEEN Encounters, THE sistema SHALL aplicar curación aditiva con tope mediante `HP = min(HP + 0.30 × HPmax, HPmax)`.
12. Score y Streak SHALL conservarse entre Encounters.
13. WHEN termina Boolean Beetle, THE sistema SHALL transicionar a `FinalSequence`, no a un quinto Encounter.

### REQ-TUT-001 — Tutorial integrado

**Historia:** Como jugador nuevo, quiero aprender movimiento, esquiva y respuestas dentro del primer Encounter.

#### Criterios de aceptación

1. WHEN comienza Encounter 1, THE sistema SHALL mostrar instrucciones de movimiento antes de activar Projectiles.
2. WHEN el Player demuestra movimiento, THE sistema SHALL mostrar instrucciones de esquiva y activar los primeros Projectiles al 50 % de velocidad.
3. WHEN aparece el primer Challenge, THE sistema SHALL mostrar instrucciones de respuesta correspondientes a su modalidad.
4. THE tutorial SHALL finalizar sin detener permanentemente el Encounter ni repetirse durante la misma Run.

### REQ-SCORE-001 — Score, Streak y estadísticas

**Historia:** Como jugador, quiero resultados consistentes para evaluar mi desempeño.

#### Criterios de aceptación

1. Correct Answer SHALL incrementar Score usando la fórmula configurada.
2. Incorrect Answer SHALL reducir Score usando la fórmula configurada, con piso en cero.
3. Correct Answer SHALL incrementar Streak y Incorrect Answer o expiración SHALL reiniciarla.
4. Streak SHALL conservarse entre Encounters.
5. THE sistema SHALL registrar Correct Answers, Streak máxima, tiempo total y Encounter alcanzado.
6. AFTER `Defeat`, THE sistema SHALL dejar de modificar Score y Streak.
7. THE valores exactos de puntuación SHALL poder calibrarse sin cambiar estos requisitos.

### REQ-FINAL-001 — Aparición de Mycelial Monolith y extracción

**Historia:** Como jugador, quiero un cierre narrativo intenso que presente la amenaza principal y concluya el demo.

#### Criterios de aceptación

1. WHEN Boolean Beetle es derrotado, THE sistema SHALL iniciar `FinalSequence`.
2. THE secuencia SHALL mostrar la interacción del Senior con V4LK y la corrupción progresiva del hábitat.
3. THE secuencia SHALL presentar a Mycelial Monolith — The God Object.
4. THE Monolith SHALL infectar o reactivar a Boolean Beetle.
5. THE secuencia SHALL presentar versiones infectadas de enemigos anteriores como amenaza narrativa.
6. V4LK SHALL comunicar que el enemigo es demasiado poderoso y que deben huir.
7. THE sistema SHALL reproducir la extracción del Senior y de V4LK.
8. AFTER la extracción, THE sistema SHALL realizar un fundido y transicionar a `DemoEnd`.
9. `DemoEnd` SHALL comunicar el cierre del demo y SHALL NOT afirmar que Mycelial Monolith fue derrotado.
10. THE sistema SHALL NOT iniciar un combate completo contra Mycelial Monolith.

### REQ-DEFEAT-001 — Derrota

**Historia:** Como jugador, quiero comprender mi resultado y poder volver a intentarlo.

#### Criterios de aceptación

1. WHEN el HP del Player llega a cero durante un Encounter, THE sistema SHALL entrar en `Defeat`.
2. IF existe un Challenge activo, THEN THE sistema SHALL cerrarlo sin evaluarlo y descartar su entrada sin modificar Score ni Streak por ese cierre.
3. THE transición a `Defeat` SHALL cancelar efectos pendientes incompatibles y tener prioridad sobre estados internos no resueltos del Challenge.
4. THE pantalla SHALL mostrar Score, Correct Answers, Streak máxima, tiempo total y Encounter alcanzado.
5. THE pantalla SHALL ofrecer reiniciar y volver al menú.

### REQ-PAUSE-001 — Pausa manual y pausa de seguridad

**Historia:** Como jugador, quiero pausar fuera de los desafíos sin poder detener artificialmente su temporizador.

#### Criterios de aceptación

1. WHEN el jugador presiona Escape durante `Playing` o `Exploration`, THE sistema SHALL entrar en `Paused`.
2. WHILE `Paused` está activo, THE sistema SHALL congelar movimiento, Enemies, Projectiles y cronómetros de gameplay.
3. THE overlay SHALL ofrecer continuar, reiniciar y salir al menú.
4. WHEN se selecciona continuar, THE sistema SHALL restaurar exactamente el estado previo permitido.
5. WHEN el jugador presiona Escape durante `Challenge`, THE sistema SHALL NOT entrar en `Paused`, SHALL mantener activo el Challenge y SHALL reproducir feedback de pausa bloqueada.
6. AFTER cerrar el Challenge, Escape SHALL volver a estar disponible para pausar.
7. WHEN la visibilidad del documento deja de ser `visible` durante `Playing` o `Challenge`, THE sistema SHALL activar una pausa de seguridad.
8. A diferencia de la pausa manual, la pausa de seguridad MAY congelar un Challenge activo y SHALL conservar tiempo restante, entrada y opciones.
9. WHEN la visibilidad regresa, THE sistema SHALL permanecer pausado hasta recibir una acción explícita del jugador.

### REQ-RESET-001 — Reinicio y regreso al menú

**Historia:** Como jugador, quiero reiniciar o volver al menú sin perder el idioma seleccionado.

#### Criterios de aceptación

1. WHEN el jugador selecciona reiniciar desde `Paused` o `Defeat`, THE sistema SHALL restaurar HP, Score, Streak, estadísticas, Encounter, cronómetros, Challenges, penalizaciones y Projectiles.
2. AFTER reiniciar, THE sistema SHALL conservar el idioma y comenzar una Run nueva desde la oficina inicial.
3. WHEN el jugador selecciona salir al menú, THE sistema SHALL restaurar la Run, conservar el idioma y transicionar a `Menu`.
4. Reiniciar y salir al menú SHALL ser acciones distintas con destinos distintos.

### REQ-DATA-001 — Contenido dirigido por datos

**Historia:** Como equipo de desarrollo, queremos ajustar contenido y balance sin alterar la lógica central.

#### Criterios de aceptación

1. THE sistema SHALL obtener de datos externos la configuración de Encounters y Challenges.
2. THE sistema SHALL obtener de datos localizables los textos en español e inglés.
3. EACH Challenge SHALL declarar identificador, categoría, modalidad, contenido, respuesta u opciones, límite de tiempo y daño.
4. EACH Encounter SHALL declarar Enemies, ataques, pool, HP, intervalos, daño, penalización y condición de finalización.
5. IF los datos requeridos son inválidos o incompletos, THEN THE sistema SHALL impedir el inicio del contenido afectado y emitir un error identificable.
6. Cambiar valores de balance SHALL NOT requerir modificar la lógica central.

## 5. Requisitos no funcionales

### REQ-PERF-001 — Rendimiento

1. THE demo SHALL mantener un objetivo de 60 FPS en Chrome de escritorio bajo la carga normal definida.
2. THE carga normal SHALL contemplar aproximadamente 40 Projectiles simultáneos.
3. THE sistema SHALL disponer de margen técnico hasta 80 Projectiles sin errores ni crecimiento no controlado de recursos.
4. THE sistema SHALL limpiar o reutilizar Projectiles, efectos y entidades que concluyan su ciclo.

### REQ-COMPAT-001 — Compatibilidad y presentación

1. THE demo SHALL ser jugable en Chrome de escritorio.
2. THE canvas lógico SHALL medir 960 × 540 px.
3. THE escalado SHALL conservar píxeles nítidos y SHALL NOT aplicar suavizado visible al pixel art.
4. THE interfaz SHALL permanecer legible en español e inglés.
5. THE recorrido completo SHALL poder finalizarse sin errores bloqueantes ni errores de consola.

### REQ-DELIVERY-001 — Entrega estática

1. THE aplicación SHALL poder distribuirse como archivos estáticos.
2. THE demo SHALL NOT requerir backend, autenticación ni base de datos.
3. THE build SHALL incluir los assets runtime, datos localizados y fuente necesarios.
4. AFTER cargar el build publicado, THE ejecución normal SHALL NOT depender de servicios externos para obtener la fuente.

## 6. Exclusiones normativas

El demo SHALL NOT incluir:

- Combate completo o derrota de Mycelial Monolith.
- Base segura posterior a la extracción.
- Guardado permanente.
- Selector de dificultad.
- Configuración de controles.
- Soporte móvil o gamepad.
- Backend, cuentas, autenticación o leaderboard.
- Multijugador.
- Audio.
- VFX avanzados ajenos a los assets ya aprobados.
- Ejecución de código del usuario.
- Challenges generados mediante IA.
- Editor de niveles.

## 7. Trazabilidad con SPEC-000

| Área de SPEC-000 | Requisitos relacionados |
|---|---|
| Plataforma | REQ-BOOT-001, REQ-PERF-001, REQ-COMPAT-001, REQ-DELIVERY-001 |
| Idiomas | REQ-LOC-001 |
| Oficina inicial | REQ-INTRO-001, REQ-MOV-001 |
| Estados | REQ-STATE-001 |
| Combate | REQ-COMBAT-001 |
| Challenges | REQ-CHL-001 a REQ-CHL-005 |
| Encuentros | REQ-PROG-001, REQ-TUT-001 |
| Puntuación | REQ-SCORE-001 |
| Mycelial Monolith y extracción | REQ-FINAL-001 |
| Derrota y reinicio | REQ-DEFEAT-001, REQ-RESET-001 |
| Pausa | REQ-PAUSE-001 |
| Contenido por datos | REQ-DATA-001 |
