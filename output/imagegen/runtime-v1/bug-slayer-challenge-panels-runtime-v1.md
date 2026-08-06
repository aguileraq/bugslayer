# Bug Slayer — paneles runtime de desafío v1

## Archivos

- Captura: `bug-slayer-challenge-typed-panel-runtime-v1.png`, 928 × 144 px.
- Opción múltiple: `bug-slayer-challenge-multiple-choice-panel-runtime-v1.png`, 928 × 176 px.
- Previews en español e inglés para las dos modalidades.
- Comparativa: `bug-slayer-challenge-variants-bilingual-comparison-runtime-v1.png`.

## Captura de respuesta

- Código y pregunta a la izquierda.
- Campo de respuesta separado a la derecha.
- Contador máximo `0/12`.
- Confirmación mediante Enter.
- Temporizador inferior compartido.

## Opción múltiple

- Código y pregunta a la izquierda.
- Cuatro espacios de respuesta en matriz 2 × 2.
- Selección por teclas `1`–`4` o clic.
- Un reto de tres opciones puede ocultar el cuarto espacio sin cambiar el panel.
- Temporizador inferior compartido.

## Temporizador

- Cian durante el tiempo seguro.
- Ámbar al aproximarse el límite.
- Rojo en el tramo crítico.
- El cambio no depende únicamente de texto o números.

## Regla técnica de pausa

- Mientras cualquiera de estos paneles está activo, el juego se encuentra en `Challenge`.
- ESC no abre la pausa ni cierra el desafío.
- Movimiento, proyectiles y tiempo continúan.
- Tras responder o agotarse el tiempo, el panel se cierra y el estado vuelve a `Playing`.
- Solo en `Playing` vuelve a habilitarse ESC.
- La pausa automática por pérdida de visibilidad permanece como protección independiente.

## Localización

- Preguntas, instrucciones, feedback y opciones descriptivas se cargan desde JSON.
- Código, operadores y tokens TypeScript permanecen sin traducir.
- Los paneles runtime no contienen texto incrustado.

## Validación

- Las dos modalidades son distinguibles inmediatamente.
- Español e inglés mantienen la misma jerarquía.
- El HUD superior permanece visible.
- Los masters de escenario no se modifican.
