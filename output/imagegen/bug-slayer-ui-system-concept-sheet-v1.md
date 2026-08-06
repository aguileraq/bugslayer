# Bug Slayer — hoja conceptual del sistema de interfaz v1

## Entrega

- Imagen: `bug-slayer-ui-system-concept-sheet-v1.png`
- Lienzo conceptual: 1536 × 1024 px
- Uso: referencia visual para producir los assets runtime de interfaz
- Resolución objetivo del juego: 960 × 540 px

Esta hoja no debe utilizarse directamente como HUD ni sustituye los componentes modulares finales.

## Dirección visual aprobada

- Base en negro y grafito.
- Cian y azul hielo para jugador, sistema, V4LK y estados seguros.
- Rojo y naranja para enemigos, peligro y derrota.
- Ámbar para advertencia de tiempo.
- Blanco para valores críticos y código.
- Marcos mecánicos rectos de 2–3 px, inspirados en el logotipo pero con menor densidad ornamental.
- Tipografía monoespaciada de lectura rápida.
- Bordes duros, sin antialiasing, desenfoque, gradientes suaves o tarjetas redondeadas.

## Jerarquía del HUD

1. HP del jugador en la esquina superior izquierda.
2. Indicador de encuentro en el centro superior.
3. HP del enemigo en la esquina superior derecha.
4. Puntaje y racha subordinados al bloque superior derecho.
5. Área central reservada para movimiento, enemigos y proyectiles.
6. Panel de reto en la franja inferior.

## Panel de reto typed

- Fragmento de TypeScript corto en tipografía monoespaciada.
- Campo de respuesta separado visualmente del código.
- Máximo de 12 caracteres con contador `0/12`.
- Confirmación mediante Enter.
- Barra de tiempo horizontal con progresión cian → ámbar → rojo.
- El panel no debe bloquear el movimiento ni ocupar más de aproximadamente el 25 % del viewport.
- La respuesta correcta tras un fallo debe mostrarse durante 2 s en un área breve y estable, sin desplazar el resto del layout.

## Componentes secundarios representados

- Tutorial.
- Pausa.
- Transición entre encuentros.
- Resumen de victoria.
- Resumen de derrota.

## Correcciones obligatorias para runtime

- El logotipo lateral solo pertenece a la presentación de la hoja; no forma parte del HUD de combate.
- La pausa final seguirá el GDD: `CONTINUAR`, `REINICIAR` y `SALIR AL MENÚ`. No se requiere `OPCIONES` para el MVP.
- Victoria y derrota deben incluir: puntaje, aciertos, mejor racha y tiempo total.
- Derrota debe añadir el encuentro donde cayó el jugador.
- Los textos de la imagen conceptual no se reutilizarán como raster; se reconstruirán con ortografía y métricas exactas.
- El overlay de opción múltiple queda como secundario; primero se producirá el flujo `typed`.

## Retícula runtime recomendada

- Margen seguro: 16 px.
- Franja superior del HUD: aproximadamente 48 px.
- Panel inferior de reto: entre 132 y 144 px de altura.
- Área jugable central: conservar al menos 65 % del viewport sin cobertura opaca.
- El fondo del reto puede atenuar ligeramente la escena, pero debe conservar suficiente contraste para leer proyectiles cercanos.

## Validación conceptual

- La atención se divide entre combate y código sin ocultar el centro de la arena.
- La información esencial puede localizarse por posición y color.
- Jugador y enemigo no comparten color de estado.
- El temporizador comunica urgencia sin depender únicamente del texto.
- La interfaz es coherente con el pixel art y con la identidad visual de `BUG SLAYER`.

## Generación

Hoja creada con ImageGen integrado, caso `ui-mockup`, tomando como referencias el logotipo aprobado y una composición jugable de la Arboleda. La imagen se conserva como referencia conceptual; no se utilizó la ruta CLI.

## Siguiente asset recomendado

Crear el kit runtime del HUD de combate: marcos modulares de HP, barras de relleno, encuentro, puntaje, racha e iconos de estado; después validarlo sobre un viewport real de 960 × 540 px.
