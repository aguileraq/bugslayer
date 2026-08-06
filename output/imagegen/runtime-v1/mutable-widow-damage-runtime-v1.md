# Mutable Widow — Damage runtime v1

## Entregable

- `mutable-widow-damage-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: impacto, retroceso y recuperación.

## Comportamiento visual

- Impacto: estrella compacta amarilla y blanca junto a la armadura.
- Retroceso: patas tensas y anillo abdominal en naranja de advertencia.
- Recuperación: regreso exacto al neutral de idle, sin residuos.
- El destello cambia de lado con la dirección y permanece unido a la silueta.

## Estándar y validaciones

- Línea inferior: Y = 117.
- Perfil derecho: espejo exacto del izquierdo.
- Recovery: coincidencia píxel por píxel con idle neutral.
- Transparencia RGBA binaria, alfa 0 o 255.
- Residuos magenta: 0.
- Sin sombra de suelo, proyectiles ni partículas separadas.
- Todos los cuerpos y efectos quedan dentro de su celda.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando el concept
sheet de Mutable Widow, su idle runtime y el daño de Parse Mantis únicamente
como referencia de ritmo. Se retiró el fondo cromático y se normalizó con
vecino más cercano. La escala se calculó desde el frame de recuperación y el
perfil derecho se reconstruyó como espejo exacto del izquierdo.

## Prompt final

Use case: stylized-concept. Create a portrait 3-column by 4-row top-down
pixel-art source sprite sheet for Mutable Widow receiving damage. Preserve the
exact low wide robotic widow design, eight mechanical legs, octagonal abdomen,
three scope rings, hourglass core, fang emitters, gunmetal and petroleum-blue
armor, cyan energy, acid-lime trim and red warning lights.

Rows are down, left, right and up. Columns are: compact cyan-white and warm
yellow impact star close to the forward armor; short recoil with braced legs
and controlled orange warning ring; recovery to the exact neutral idle pose.
Maintain identical scale, volume and baseline. Left and right are true
opposites. Keep all effects inside each logical cell.

Classic 16-bit Japanese RPG top-down three-quarter view, crisp hand-placed
pixel art, bold dark outline and flat limited palette. No antialiasing,
gradients, soft glow, blur, texture noise, ambient occlusion or ground shadow.
Use a perfectly uniform solid `#ff00ff` chroma-key background. No grid, text,
labels, watermark, projectiles, Scope Web, defeat pose or environment.

## Siguiente asset

Mutable Widow — Defeat runtime v1.
