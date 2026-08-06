# Boolean Beetle — Desplazamiento pesado runtime v1

## Archivo

- `boolean-beetle-heavy-movement-runtime-v1.png`
- Lienzo: 384 × 512 px
- Cuadrícula lógica: 3 columnas × 4 filas
- Celda: 128 × 128 px
- Fondo: transparencia real RGBA

## Orden de direcciones

1. Frente / abajo
2. Izquierda
3. Derecha
4. Espalda / arriba

La fila derecha se construyó como opuesto horizontal exacto de la fila izquierda.

## Secuencia de desplazamiento

1. Apoyo diagonal inicial.
2. Transferencia central del peso.
3. Apoyo diagonal opuesto.

La marcha es corta, lenta y contenida. El caparazón permanece estable para comunicar el gran peso del jefe; el movimiento se concentra en las seis patas.

## Invariantes visuales

- Exactamente seis patas mecánicas.
- Dos placas cerradas de caparazón.
- Dos cuernos ramificados.
- Canal cian y canal naranja conservados.
- Reactor oculto.
- Sin alas, ataques, proyectiles, polvo, sombra ni efectos.
- Misma escala global del asset de reposo.
- Línea base común en Y=117 dentro de todas las celdas.

## Validación

- Dimensiones finales: 384 × 512 px.
- Doce celdas de 128 × 128 px.
- Alfa binario: únicamente 0 y 255.
- Sin píxeles magenta residuales.
- Ningún elemento toca los bordes.
- Todas las poses terminan sobre la misma línea base.
- Izquierda y derecha tienen simetría exacta.

## Proceso

Se generó una fuente independiente sobre fondo cromático uniforme usando como referencias la hoja conceptual aprobada y el spritesheet runtime de reposo. Después se eliminó el fondo, se limpiaron fragmentos aislados y se normalizó cada frame mediante escalado nearest-neighbor y alineación por línea base. Los masters existentes no fueron modificados.

## Prompt final de generación

Use case: stylized-concept. Create a strict portrait 3-column by 4-row source sprite sheet for Boolean Beetle's heavy directional movement. Input 1 is the exact approved identity; input 2 is the exact runtime scale, camera, direction order, baseline and idle transition.

Rows: moving down/front, left, right as exact opposite, up/back. Columns form slow alternating-tripod gait: front-left plus rear-right support; central weight transfer with one-pixel forward/lower motion; front-right plus rear-left support returning to neutral.

Preserve exactly six attached mechanical legs; two closed shell plates; two branching horns; split visor; cyan/orange channels never swap. Same shell width, body length, head, horns, scale. Shell closed, reactor hidden. Common baseline, centered, max one-pixel internal shift.

Classic 16-bit JRPG top-down 3/4 pixel art. Uniform #ff00ff. No grid, text, watermark, shell opening, wings, flight, attacks, projectiles, trails, dust, damage, defeat, extra creatures.

## Siguiente asset recomendado

`Boolean Burst`: primer ataque principal del jefe, partiendo desde este desplazamiento y regresando al reposo sin saltos de escala o posición.
