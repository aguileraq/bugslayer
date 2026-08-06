# BugSlayer — Game Design Document

> Documento derivado para comunicar el diseño general del juego. El alcance
> definitivo del demo está fijado por `SPEC-000-demo-scope.md`; ante cualquier
> conflicto de alcance, prevalece SPEC-000. Las futuras especificaciones de
> requisitos, arquitectura y tareas deberán mantener esa decisión.

## 1. Visión general

BugSlayer es un juego de navegador para escritorio que cruza el *bullet hell* con retos breves de corrección de código TypeScript. El jugador es un desarrollador atrapado dentro de una aplicación empresarial corrupta; los bugs se manifiestan como enemigos que disparan proyectiles. Para dañarlos, el jugador esquiva los ataques mientras identifica y corrige errores bajo presión de tiempo.

La tensión nace de dividir la atención: el jugador debe esquivar y resolver simultáneamente. Esquivar solo permite sobrevivir; responder correctamente es la forma de dañar a los enemigos.

El demo entrega una experiencia completa desde la selección de idioma hasta la extracción de emergencia: oficina inicial, presentación de V4LK, cuatro encuentros jugables, aparición de Mycelial Monolith y pantalla final. Mycelial Monolith no se derrota ni tiene un combate completo en el demo.

## 2. Pilares de diseño

1. **Atención dividida.** Movimiento y resolución ocurren a la vez; el movimiento nunca se bloquea durante un desafío.
2. **Consecuencias justas.** Una respuesta incorrecta cuesta puntos, racha y una penalización temporal, pero nunca HP. La vida solo baja por ataques enemigos.
3. **Determinismo.** Cada frame se resuelve en un orden fijo y reproducible.
4. **Contenido dirigido por datos.** Retos, encuentros, balance y textos localizables viven en datos externos.
5. **Legibilidad bajo presión.** Los retos son breves, claros y las respuestas capturadas caben en 12 caracteres.
6. **Identidad de software.** Personajes, escenarios, ataques y narrativa representan errores y malas prácticas de programación.

## 3. Público y plataforma

- **Público:** desarrolladores y personas con nociones de programación.
- **Plataforma principal:** Chrome de escritorio.
- **Motor:** Phaser.
- **Entrada:** teclado y ratón para opción múltiple.
- **Presentación:** canvas lógico fijo de 960 × 540 px.
- **Idiomas:** español e inglés, seleccionados antes del menú principal.
- **Tipografía:** Geist Pixel Square incluida localmente.
- **Distribución:** sitio estático, sin backend obligatorio.
- **Rendimiento:** 60 FPS con aproximadamente 40 proyectiles simultáneos y margen de diseño hasta 80.

Firefox y Edge son plataformas de validación secundaria. Dispositivos móviles y gamepad quedan fuera del alcance del demo.

## 4. Core gameplay loop

```text
Arranque → Idioma → Menú → Oficina inicial → V4LK
→ Parse Mantis → Mutable Widow → Cast Hornet → Boolean Beetle
→ Aparición de Mycelial Monolith → Extracción → Pantalla final
```

Bucle de combate:

1. El enemigo dispara patrones y el jugador esquiva.
2. En intervalos aparece un desafío de código.
3. El jugador sigue moviéndose mientras responde.
4. Una respuesta correcta daña al enemigo, suma puntos e incrementa la racha.
5. Una respuesta incorrecta o el tiempo agotado reduce el puntaje, reinicia la racha y aplica temporalmente `extraProjectiles`.
6. Al llegar el enemigo a 0 HP se limpia el encuentro, se aplica una curación parcial y comienza la transición narrativa.
7. Al llegar el jugador a 0 HP se presenta la derrota.

## 5. Controles

| Entrada | Acción |
|---|---|
| Flechas | Mover al jugador a velocidad constante, incluso durante un desafío |
| Teclas alfanuméricas y símbolos | Escribir una respuesta de hasta 12 caracteres |
| `1`–`4` | Seleccionar una respuesta de opción múltiple |
| Clic | Seleccionar una respuesta de opción múltiple |
| Enter | Enviar una respuesta escrita, confirmar o avanzar diálogo |
| Backspace | Borrar el último carácter |
| Escape | Pausar fuera de un desafío; durante un desafío solo muestra feedback de bloqueo |

Las flechas nunca insertan texto. `Escape` nunca cierra, cancela ni pausa un desafío activo.

## 6. Mecánicas y reglas

**Movimiento.** Velocidad constante, sin inercia ni carrera. El jugador se detiene al soltar la entrada y permanece dentro del área caminable. La oficina inicial también utiliza únicamente desplazamiento a pie.

**Proyectiles y colisión.** Los enemigos generan patrones propios. La colisión utiliza un hitbox del jugador más pequeño que su sprite visible. Los proyectiles que abandonan el área se reciclan.

**Invulnerabilidad.** Después de recibir daño se abre una ventana de 500 ms. Los impactos recibidos dentro de ella no causan daño adicional ni reinician la ventana.

**Desafíos.** Solo existe uno activo a la vez. El pool se recorre sin repetición inmediata. El intervalo entre desafíos se detiene mientras uno permanece activo y se reinicia al cerrarse.

**Respuesta correcta.** Daño al enemigo, puntos y aumento de racha forman un único resultado atómico.

**Respuesta incorrecta o tiempo agotado.** Reduce el puntaje con piso en cero, reinicia la racha, muestra la respuesta correcta durante un tiempo breve y activa `extraProjectiles`. Nunca reduce directamente el HP.

**Orden determinista.** Cada frame resuelve, en orden: entrada, registro de respuesta, movimiento, generación de proyectiles, validación, efectos, avance de proyectiles, colisiones, estados terminales y transiciones. Los temporizadores de gameplay avanzan mediante `deltaMs` acumulado.

Si una respuesta correcta derrota al enemigo en el mismo frame en que un proyectil derrotaría al jugador, prevalece la finalización del encuentro.

## 7. Estados del juego

| Estado | Descripción |
|---|---|
| `Boot` | Precarga y preparación de recursos |
| `LanguageSelect` | Selección inicial de español o inglés |
| `Menu` | Menú principal |
| `Intro` | Entrada narrativa y despertar |
| `Exploration` | Recorrido sin combate |
| `Dialogue` | Conversación o interacción narrativa |
| `Playing` | Gameplay sin desafío activo |
| `Challenge` | Gameplay con desafío activo y pausa bloqueada |
| `Paused` | Estado congelado al que solo se entra fuera de `Challenge` |
| `Transitioning` | Limpieza y transición entre encuentros |
| `Defeat` | HP del jugador agotado |
| `FinalSequence` | Aparición del Monolith, infección y extracción |
| `DemoEnd` | Pantalla final del demo |

No existe un estado de victoria por derrotar a Mycelial Monolith.

La pérdida de visibilidad puede activar una pausa de seguridad independiente. Esta pausa nunca reanuda el juego automáticamente.

## 8. Encuentros y progresión

El demo contiene cuatro encuentros jugables y una secuencia final narrativa. Al completar un encuentro se eliminan sus proyectiles, se cancela la penalización activa, se reinicia el intervalo de desafíos y se aplica una curación parcial con tope en el HP máximo. Puntaje y racha se conservan entre encuentros.

| Encuentro | Enemigo | Categoría | Estructura | Ataques principales |
|---|---|---|---|---|
| 1 | Parse Mantis | Syntax | Un enemigo común; tutorial lineal | Ataque lineal y proyectil básico |
| 2 | Mutable Widow | Variable | Dos enemigos simultáneos | Reassignment Volley y Scope Web |
| 3 | Cast Hornet | Type | Tres enemigos voladores | Type Sting y Casting Swarm |
| 4 | Boolean Beetle | Logic | Un subjefe pesado | Boolean Burst, XOR Crossfire, False Path y Branch Charge |

Los valores de HP, intervalos, daño y densidad se calibran mediante datos. La escala, número de enemigos y composición de cada encuentro ya están fijados por los assets aprobados.

**Tutorial del encuentro 1:**

1. Movimiento antes de activar proyectiles.
2. Esquiva con proyectiles a velocidad reducida.
3. Presentación del primer desafío mientras el movimiento continúa.

## 9. Enemigos y jefe final

### Parse Mantis

Representa errores de sintaxis. Es un enemigo común y visualmente menor que el Senior Engineer.

### Mutable Widow

Representa mutabilidad, reasignaciones y problemas de alcance. Aparecen dos simultáneamente y controlan el espacio mediante proyectiles y redes.

### Cast Hornet

Representa conversiones de tipo inseguras. Es un enemigo pequeño, aéreo y grupal; aparecen tres durante el encuentro.

### Boolean Beetle

Representa errores de lógica y ramificación. Es un enemigo grande y pesado que funciona como subjefe.

### Mycelial Monolith — The God Object

Representa el *God Object*: una dependencia central descontrolada que infecta y domina otros componentes. Es el jefe final narrativo, no un encuentro derrotado en el demo.

Después de la derrota de Boolean Beetle, Mycelial Monolith corrompe el hábitat, infecta o reactiva al Beetle y presenta versiones infectadas de enemigos anteriores. V4LK concluye que el Senior no puede vencerlo, inicia la extracción de emergencia y cierra el demo.

Sus ataques y minions se utilizan como amenaza narrativa; no requieren un ciclo completo de combate.

## 10. Sistema de desafíos

**Modalidades obligatorias:**

- Respuesta capturada.
- Opción múltiple.

**Validación capturada.** La entrada se normaliza mediante trim, colapso de espacios internos y descarte de caracteres no imprimibles. Se compara contra una lista de respuestas aceptadas. No se ejecuta código ingresado por el jugador.

**Longitud.** Máximo 12 caracteres. El carácter 13 se ignora sin modificar la respuesta.

**Contenido del demo.** Doce desafíos, distribuidos en tres por categoría:

- Syntax: 3.
- Variable: 3.
- Type: 3.
- Logic: 3.

Cada desafío declara modalidad, respuestas aceptadas u opciones, límite de tiempo, daño y sensibilidad a mayúsculas cuando corresponda. Ambas modalidades deben aparecer durante una partida completa.

## 11. Puntuación y balance

Fórmulas iniciales, calibrables después de playtesting:

- **Correcta:** `100 + floor(msRestantes / 100) + racha × 10`.
- **Incorrecta:** `max(puntajeActual − 50, 0)`.

La racha se rompe con una respuesta incorrecta o tiempo agotado, no entre encuentros. Después de la derrota dejan de modificarse puntaje y racha.

La pantalla de derrota muestra:

- Puntaje.
- Respuestas correctas.
- Mejor racha.
- Tiempo total.
- Encuentro alcanzado.

La pantalla final del demo puede mostrar estadísticas de la sesión, pero no comunica que Mycelial Monolith fue derrotado.

## 12. Narrativa

El Senior Engineer despierta sentado en el cubículo C4 de una oficina digital sin saber qué ocurrió. Después de preguntarse «¿Qué ha pasado? ¿Dónde estoy?», se levanta y camina hasta la computadora parpadeante de C3. Al pulsar una tecla aparece una barra de carga y se materializa V4LK, una IA holográfica con forma de perro salchicha.

V4LK acompaña al Senior a través de cuatro ecosistemas de software. Cada encuentro representa una categoría de error de programación y contiene una transición narrativa breve.

Después de derrotar a Boolean Beetle, la Arboleda de Memoria Legada se corrompe y aparece Mycelial Monolith. El jefe infecta al Beetle y convoca versiones infectadas de enemigos anteriores. V4LK advierte que combatir es imposible, extrae al Senior y a sí mismo, y el demo termina con un fundido y una tarjeta final.

El tono combina humor de oficina técnica, aventura y amenaza digital.

## 13. Dirección visual y audio

- **Estilo:** pixel art funcional, consistente y legible.
- **Cámara:** top-down en tres cuartos.
- **Paleta UI:** cian para sistema y jugador, rojo para peligro y corrupción, ámbar para tiempo crítico.
- **Tipografía:** Geist Pixel Square local.
- **Legibilidad:** HUD y desafíos priorizan lectura rápida.
- **Feedback:** confirmación, error, bloqueo de pausa y tiempo agotado cuentan con iconos y animaciones aprobadas.
- **Audio:** fuera del alcance del demo.
- **VFX avanzados:** fuera del alcance; solo se utilizan los efectos necesarios ya producidos para ataques, corrupción, holograma y extracción.

Los assets de jugador, enemigos, proyectiles, escenarios, narrativa e interfaz están finalizados.

## 14. UI y pantallas

- Selección de idioma antes del menú.
- Menú principal.
- Diálogos narrativos.
- HUD de combate con HP, encuentro, puntaje y racha.
- Overlay de respuesta capturada con cursor y contador `n/12`.
- Overlay de opción múltiple con hasta cuatro opciones.
- Temporizador de desafío.
- Tutorial y transiciones.
- Pausa: continuar, reiniciar y salir al menú.
- Derrota y reinicio.
- Secuencia final y pantalla de cierre del demo.

Durante `Challenge`, `Escape` no abre la pausa. El intento muestra feedback de bloqueo y el gameplay continúa. Al cerrarse el desafío, la pausa vuelve a estar disponible.

Todos los textos localizables se cargan desde datos según el idioma seleccionado; no se incrustan en los assets raster.

## 15. Alcance del demo

### Obligatorio

- Selección de español o inglés.
- Oficina inicial y materialización de V4LK.
- Cuatro encuentros completos.
- Doce desafíos distribuidos entre las cuatro categorías.
- Respuesta capturada y opción múltiple.
- Movimiento activo durante los desafíos.
- Patrones y ataques aprobados para cada enemigo.
- Penalización `extraProjectiles`.
- Pausa fuera de desafíos y bloqueo durante desafíos.
- Derrota, reinicio y regreso al menú.
- Aparición narrativa de Mycelial Monolith.
- Enemigos infectados, extracción y pantalla final.
- Chrome de escritorio, 960 × 540 y 60 FPS objetivo.
- Build estático sin backend.

### Fuera del alcance

- Combate completo o derrota de Mycelial Monolith.
- Base segura después de la extracción.
- Guardado permanente.
- Selector de dificultad y configuración de controles.
- Móvil y gamepad.
- Backend, cuentas, autenticación y leaderboard.
- Multijugador.
- Audio y VFX avanzados.
- Ejecución de código del usuario.
- Retos generados mediante IA.
- CloudFront y HTTPS como requisito del primer build.

### Cierre técnico pendiente

- Construcción del build de producción.
- Despliegue estático inicial.
- Prueba completa en Chrome sobre la versión publicada.

## 16. Preguntas abiertas de tuning

Estas decisiones no cambian el alcance y se resuelven mediante pruebas:

- Fórmula final de puntuación.
- HP, daño, intervalos y densidad por encuentro.
- Duración exacta de desafíos y transiciones.
- Curación entre encuentros.
- Distribución exacta de los 12 desafíos entre respuesta capturada y opción múltiple.
- Balance final de dificultad.
