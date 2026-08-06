# Mutable Widow — Defeat runtime v1

## Entregable

- `mutable-widow-defeat-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: tambaleo, colapso y estado derrotado.

## Comportamiento visual

- Tambaleo: cuerpo aún erguido, patas comenzando a ceder y anillo naranja.
- Colapso: chasis más bajo, patas plegadas y núcleo debilitado.
- Derrotada: pose compacta, mecánica y apagada, sin explosión ni fragmentos.
- El volumen rígido de abdomen, armadura y articulaciones se conserva.

## Estándar y validaciones

- Línea de suelo constante: Y = 117.
- Perfil derecho: espejo exacto del izquierdo en los tres frames.
- Reducción progresiva de altura claramente legible.
- Transparencia RGBA binaria, alfa 0 o 255.
- Residuos magenta: 0.
- Sin sombra de suelo, partículas, humo ni piezas separadas.
- Todas las poses quedan dentro de su celda.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando el concept
sheet de Mutable Widow, su idle runtime y la derrota de Parse Mantis únicamente
como referencia de progresión. Se eliminó el fondo cromático y cada fila se
normalizó desde el tamaño del tambaleo, conservando una misma escala durante la
caída. El perfil derecho se reconstruyó como espejo exacto del izquierdo.

## Prompt final

Use case: stylized-concept. Create a portrait 3-column by 4-row top-down
pixel-art source sprite sheet for Mutable Widow's defeat. Preserve the exact
low wide robotic widow identity, eight articulated mechanical legs, octagonal
abdomen, three scope rings, hourglass core, fang emitters, dark gunmetal and
petroleum-blue armor, acid-lime trim and controlled red lights.

Rows are down, left, right and up. Columns are: stagger while still standing at
normal scale with orange warning ring; mechanical collapse with legs folding
beneath the chassis; compact powered-down final pose with a dark core. Preserve
rigid mechanical volumes and the same components in every frame. Do not melt,
explode, dismember or scatter the enemy. Left and right are true opposites.

Classic 16-bit Japanese RPG top-down three-quarter view, crisp hand-placed
pixel art, bold dark outline and flat limited palette. No antialiasing,
gradients, soft glow, blur, texture noise, ambient occlusion or ground shadow.
Use a perfectly uniform solid `#ff00ff` chroma-key background. No grid, text,
labels, watermark, attack effects, debris or environment.

## Siguiente asset

Conjunto visual de Mutable Widow completo; la siguiente prioridad recomendada
es definir el enemigo Type.
