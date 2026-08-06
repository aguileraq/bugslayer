# Boolean Beetle — Idle runtime v1

## Entregable

- `boolean-beetle-idle-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: neutral, compresión y liberación.

## Animación

- Neutral: seis patas plantadas y canales en intensidad estable.
- Compresión: cuerpo asentado, articulaciones flexionadas y pulso hacia la
  costura central.
- Liberación: retorno a la altura neutral y pulso lógico hacia el exterior.
- El caparazón permanece completamente cerrado.

## Invariantes

- Exactamente seis patas mecánicas.
- Dos placas principales de caparazón.
- Dos cuernos frontales de bifurcación.
- Canal cian y canal naranja conservan sus lados.
- Misma escala, ancho, altura y línea de suelo en los doce frames.

## Estándar runtime

- Línea inferior: Y = 117.
- Perfil derecho: espejo exacto del izquierdo.
- Margen mínimo: 6 px.
- Transparencia RGBA binaria, alfa 0 o 255.
- Residuos magenta: 0.
- Esquinas transparentes en las doce celdas.
- Sin sombra de suelo.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando el concept
sheet de Boolean Beetle como referencia de identidad y Mutable Widow únicamente
como referencia estructural de spritesheet. El fondo cromático se eliminó
localmente. Se aplicó una escala global, vecino más cercano, limpieza de islas
de píxeles, línea base común y simetría lateral determinista.

## Prompt final

Create a strict portrait 3-column by 4-row source sprite sheet for Boolean
Beetle's heavy idle animation. Preserve the exact approved concept: low wide
armored body, exactly six mechanical legs, exactly two closed shell plates,
exactly two branching horns, split cyan-orange visor, cyan logic channel on one
plate and orange channel on the other.

Rows are down/front, left, right and up/back. Columns are: neutral brace;
one-pixel compression with front and middle joints flexing and both channels
brightening toward the central seam; release back to neutral height with rear
joints flexing and pulses moving outward. Keep the shell closed and reactor
hidden. Preserve identical body length, shell width, head, horns and leg scale.
Use one ground baseline and generous padding.

Classic 16-bit Japanese RPG top-down three-quarter pixel art, crisp dark
outline and flat limited palette. No antialiasing, gradients, soft glow, blur,
texture, ambient occlusion or ground shadow. Use a perfectly uniform solid
`#ff00ff` chroma-key background. No grid, borders, text, labels, watermark,
wings, flight, shell opening, attacks, projectiles, damage, defeat or extra
creatures.

## Siguiente asset

Boolean Beetle — desplazamiento pesado en cuatro direcciones.
