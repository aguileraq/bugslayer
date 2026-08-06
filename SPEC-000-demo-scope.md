# SPEC-000 — Alcance definitivo del demo de BugSlayer

- **Estado:** Aprobado
- **Versión:** 1.0
- **Fecha:** 2026-08-06
- **Autoridad:** Esta especificación prevalece sobre cualquier descripción incompatible del alcance del demo en el GDD u otros documentos derivados.

## 1. Objetivo

Entregar una experiencia jugable completa en navegador donde el jugador descubre que está atrapado dentro de un software corrupto, conoce a V4LK, supera cuatro zonas de combate y presencia la aparición de Mycelial Monolith. El jefe final no se derrota en el demo: V4LK extrae al Senior Engineer y la demostración termina.

El concepto central debe quedar demostrado de principio a fin: esquivar ataques mientras se resuelven desafíos breves de TypeScript bajo presión de tiempo.

## 2. Plataforma y ejecución

- Motor: Phaser.
- Navegador principal: Chrome de escritorio.
- Resolución lógica: 960 × 540 px.
- Escalado de pixel art: entero y nearest-neighbor siempre que sea posible.
- Entrada: teclado; ratón habilitado para opción múltiple.
- Objetivo: 60 FPS con aproximadamente 40 proyectiles simultáneos y margen técnico de hasta 80.
- Distribución: aplicación web estática, sin backend obligatorio.
- Fuente: Geist Pixel Square alojada localmente; el demo no depende de Google Fonts durante la ejecución.

## 3. Idiomas

- Español.
- Inglés.

El idioma se selecciona al iniciar, antes del menú principal. Menús, diálogos, tutoriales, preguntas, instrucciones, resultados y mensajes del sistema se cargan desde datos localizables. Los fragmentos de TypeScript, operadores y respuestas técnicas no se traducen cuando hacerlo alteraría el desafío.

## 4. Recorrido del demo

1. Arranque y precarga.
2. Selección de idioma.
3. Menú principal.
4. Oficina inicial.
5. Aparición de V4LK.
6. Jardín de Compilación — Parse Mantis.
7. Guarida de Mutable Widow — dos Mutable Widows.
8. Router Aéreo — tres Cast Hornets.
9. Arboleda de Memoria Legada — Boolean Beetle.
10. Aparición de Mycelial Monolith y enemigos infectados.
11. Extracción de emergencia.
12. Fundido y pantalla final del demo.

## 5. Oficina inicial

1. El Senior Engineer despierta sentado en la silla del cubículo C4.
2. Aparece el diálogo «¿Qué ha pasado? ¿Dónde estoy?» o su equivalente en inglés.
3. El Senior se levanta y el control pasa al jugador.
4. El jugador puede caminar, pero no correr.
5. El jugador avanza hasta la computadora parpadeante de C3.
6. Al interactuar, el Senior pulsa una tecla y el monitor muestra una barra de carga.
7. V4LK se materializa como un perro salchicha holográfico y comienza el acompañamiento narrativo.
8. Se habilita la salida hacia el primer encuentro.

No existen enemigos ni desafíos de programación en esta sala.

## 6. Encuentros jugables

### 6.1 Parse Mantis — Syntax

- Función: tutorial de combate y desafíos.
- Enemigo común, entre 10 % y 15 % más pequeño que el Senior.
- Escenario lineal: Jardín de Compilación.
- Introduce movimiento, esquiva, preguntas, respuestas y daño al enemigo.

### 6.2 Mutable Widow — Variable

- Dos Mutable Widows simultáneas.
- Escenario amplio, con poca vegetación y abundantes telarañas.
- Ataques principales: Reassignment Volley y Scope Web.
- Introduce control territorial y proyectiles dobles.

### 6.3 Cast Hornet — Type

- Tres Cast Hornets durante el encuentro.
- Enemigos voladores y más pequeños que Parse Mantis.
- Escenario abierto con cielo híbrido de software.
- Ataques principales: Type Sting y Casting Swarm.

### 6.4 Boolean Beetle — Logic

- Subjefe y enfrentamiento jugable más difícil del demo.
- Aproximadamente 1.45 veces la altura del Senior y considerablemente más ancho.
- Escenario: Arboleda de Memoria Legada.
- Ataques principales: Boolean Burst, XOR Crossfire, False Path y Branch Charge.

## 7. Mycelial Monolith

Mycelial Monolith — The God Object es el jefe final narrativo. No tiene un combate completo ni puede ser derrotado en el demo.

1. Boolean Beetle es derrotado.
2. El Senior y V4LK interactúan.
3. El hábitat comienza a corromperse.
4. Mycelial Monolith aparece y extiende cables, esporas y corrupción micelial.
5. Boolean Beetle es infectado y reactivado.
6. Aparecen versiones infectadas de enemigos anteriores.
7. V4LK explica que el enemigo es demasiado poderoso y ordena huir.
8. V4LK extrae al Senior y después a sí mismo.
9. Ambos desaparecen del escenario.
10. Se produce un fundido y aparece la pantalla final.

Los ataques del Monolith y los minions infectados funcionan como amenaza narrativa. No requieren un encuentro jugable completo ni todos los estados de combate.

## 8. Sistema de desafíos

- Modalidades obligatorias: respuesta capturada y opción múltiple.
- Contenido: 12 desafíos, tres por categoría: Syntax, Variable, Type y Logic.
- Cada encuentro utiliza su propio pool.
- Selección sin repetición inmediata.
- Respuesta capturada: máximo 12 caracteres.
- Opción múltiple: hasta cuatro respuestas.
- Cada desafío tiene límite de tiempo.
- El jugador continúa moviéndose y esquivando mientras responde.

### Respuesta correcta

- Daña al enemigo.
- Suma puntos.
- Incrementa la racha.
- Activa feedback de confirmación.

### Respuesta incorrecta o tiempo agotado

- Reduce el puntaje sin bajar de cero.
- Reinicia la racha.
- Muestra brevemente la respuesta correcta.
- Aplica temporalmente `extraProjectiles`.
- Activa feedback de error o tiempo agotado.
- Nunca reduce directamente la vida; el HP solo baja por ataques enemigos.

## 9. Pausa

- `Escape` abre la pausa durante gameplay normal.
- Un desafío activo no puede pausarse.
- Presionar `Escape` durante un desafío solo muestra feedback de pausa bloqueada; el movimiento, los enemigos y el temporizador continúan.
- Al responder o agotarse el tiempo, la pausa vuelve a estar disponible.
- Las escenas narrativas no interactivas no se pausan manualmente.
- La pérdida de visibilidad puede activar una pausa de seguridad independiente que nunca reanuda automáticamente.

## 10. Estados funcionales

- Boot.
- LanguageSelect.
- Menu.
- Intro.
- Exploration.
- Dialogue.
- Playing.
- Challenge.
- Paused.
- Transitioning.
- Defeat.
- FinalSequence.
- DemoEnd.

No existe un estado de victoria por derrotar a Mycelial Monolith.

## 11. Derrota y reinicio

El jugador puede ser derrotado durante cualquiera de los cuatro encuentros. La pantalla de derrota muestra puntaje, respuestas correctas, mejor racha, tiempo jugado y encuentro alcanzado.

- Reiniciar conserva el idioma y comienza una partida nueva.
- Volver al menú conserva el idioma y reinicia el progreso de la sesión.

## 12. Fuera del alcance

- Combate completo y derrota de Mycelial Monolith.
- Base segura después del teletransporte.
- Guardado permanente.
- Selección de dificultad.
- Configuración de controles.
- Dispositivos móviles y gamepad.
- Backend, cuentas, autenticación y leaderboard.
- Multijugador.
- Audio.
- VFX avanzados.
- Ejecución real del código escrito.
- Preguntas generadas mediante IA.
- Editor de niveles.
- CloudFront y HTTPS como requisito del primer build.

## 13. Criterios de aceptación

El demo está completo cuando:

- Puede recorrerse desde la selección de idioma hasta la pantalla final.
- Español e inglés funcionan sin cambiar la geometría de la interfaz.
- Los cuatro encuentros pueden completarse.
- Ambas modalidades de desafío aparecen durante una partida completa.
- El jugador puede moverse mientras responde.
- La pausa queda bloqueada durante los desafíos y vuelve a estar disponible al cerrarlos.
- Los errores no reducen directamente la vida.
- Todos los enemigos utilizan sus sprites, ataques y escenarios aprobados.
- Mycelial Monolith funciona únicamente como amenaza narrativa.
- La extracción concluye el demo.
- Es posible perder, reiniciar y volver al menú.
- No existen errores bloqueantes ni errores de consola durante una partida completa en Chrome.
- El juego mantiene el objetivo de rendimiento.
- No faltan assets durante el recorrido.
- La fuente se carga localmente sin solicitudes externas.

## 14. Variables de tuning

Los siguientes valores pueden ajustarse mediante datos sin cambiar el alcance:

- HP y daño.
- Daño causado por respuestas.
- Fórmula de puntuación.
- Duración de desafíos.
- Frecuencia y densidad de ataques.
- Curación entre encuentros.
- Duración de transiciones.
- Distribución exacta de retos capturados y de opción múltiple.
