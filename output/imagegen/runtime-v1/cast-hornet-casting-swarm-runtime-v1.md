# Cast Hornet — Casting Swarm runtime v1

## Entregable

- `cast-hornet-casting-swarm-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: carga, liberación y recuperación.

## Animación

- Carga: tres canales energéticos conectan el núcleo con los emisores.
- Los canales usan cian, amarillo y violeta.
- Liberación: aparecen exactamente tres fragmentos angulares próximos al
  frente de Cast Hornet.
- Los fragmentos solo representan el inicio del disparo.
- Recuperación: regreso exacto al idle neutral, sin residuos.

## Separación de responsabilidades

Esta hoja contiene únicamente la animación del enemigo y el comienzo visual de
la descarga. Los proyectiles de Casting Swarm deberán producirse posteriormente
como assets independientes dentro de la prioridad de proyectiles.

## Estándar runtime

- Cuerpo tomado directamente del idle runtime validado.
- Perfil derecho: espejo exacto del izquierdo.
- Recovery: coincidencia píxel por píxel con idle neutral.
- Efectos contenidos con margen mínimo de 2 px.
- Transparencia RGBA binaria, alfa 0 o 255.
- Residuos magenta: 0.
- Sin estelas largas, explosiones ni sombra de suelo.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando el concept
sheet, idle y Type Sting como referencias. La fuente confirmó la paleta y la
dirección de los tres disparos. Para evitar proyectiles demasiado largos, el
runtime final conserva el cuerpo exacto de idle y reconstruye canales y
fragmentos con píxel duro, simetría exacta y composición determinista.

## Prompt final

Use case: stylized-concept. Create a portrait 3-column by 4-row source sprite
sheet for Cast Hornet's Casting Swarm ranged attack. Preserve the exact concept
and runtime identity: wedge head, cyan-violet visor, yellow mandibles, armored
thorax, conversion core, straight segmented abdomen, rear stinger, exactly six
tucked legs and exactly four framed cyan energy wings.

Rows are down, left, right and up. Columns are: compile charge with three
hard-edged energy channels attached between the core and the emitter ports,
using cyan, warning-yellow and violet; simultaneous release showing only the
short beginnings of exactly three compact angular shards in a shallow fan
pointing in the facing direction; recovery to the exact neutral idle pose.

Column 1 must contain no detached shard. Column 2 must contain exactly three
compact launch shards close to the silhouette. Column 3 must contain no effect.
No full-flight projectile, beam, long trail, explosion or target marker.

Use classic 16-bit Japanese RPG top-down three-quarter pixel art, bold dark
outlines and flat limited shading. No antialiasing, gradients, soft glow, blur,
texture noise, ambient occlusion or ground shadow. Use a perfectly uniform
solid `#ff00ff` chroma-key background. No grid, text, labels, watermark,
additional insects, Type Sting curl, Mismatch Dive, damage, defeat or
environment.

## Siguiente asset

Cast Hornet — Mismatch Dive en cuatro direcciones.
