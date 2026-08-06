# Cast Hornet — Flight runtime v1

## Entregable

- `cast-hornet-flight-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: impulso, crucero y compensación.

## Animación

- Impulso: alas parcialmente barridas y patas recogidas.
- Crucero: cuerpo extendido y alas en la parte estrecha del ciclo.
- Compensación: alas abiertas para regresar naturalmente al idle.
- El segundo frame avanza solamente un píxel en la dirección de movimiento.
- No utiliza estelas, partículas ni efectos separados.

## Estándar runtime

- Misma escala global que `cast-hornet-idle-runtime-v1.png`.
- Perfil derecho: espejo exacto del izquierdo.
- Pivote visual estable y desplazamiento interno máximo de un píxel.
- Margen mínimo del contenido: 8 px.
- Transparencia RGBA binaria, alfa 0 o 255.
- Residuos magenta: 0.
- Esquinas transparentes en las doce celdas.
- Sin sombra de suelo.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando el concept
sheet como referencia de identidad y el idle runtime como referencia exacta de
escala y dirección. El fondo cromático se eliminó localmente. Se reutilizó la
escala global del idle, se aplicó vecino más cercano, se retiraron islas de
píxeles y el perfil derecho se reconstruyó como espejo exacto del izquierdo.

## Prompt final

Use case: stylized-concept. Create a portrait 3-column by 4-row source sprite
sheet for Cast Hornet's directional flight movement. Preserve the exact
concept and idle design: wedge-shaped head, cyan-violet visor, yellow
mandibles, armored thorax, conversion core, segmented abdomen, injector
stinger, exactly six tucked mechanical legs and exactly four angular framed
cyan energy wings.

Rows are down, left, right and up. Columns are: impulse with wings pulled
partway backward and bright wing-root thrusters; cruise with the body extended
along the direction of travel and wings at the narrow middle of the stroke;
compensation with wings opening wider and the body returning close to idle.
Communicate movement only through wing sweep, subtle body pitch, tight legs and
controlled cyan energy. No speed trails or detached effects.

Maintain constant body scale, length and pivot. Left and right must be true
opposites. Keep all appendages inside each logical cell. Use classic 16-bit
Japanese RPG top-down three-quarter pixel art, bold dark outlines and flat
limited shading. No antialiasing, gradients, soft glow, blur, texture noise,
ambient occlusion or ground shadow.

Use a perfectly uniform solid `#ff00ff` chroma-key background. No grid,
borders, text, labels, watermark, attacks, projectiles, target markers,
particles, damage, defeat, environment or extra insects.

## Siguiente asset

Cast Hornet — Type Sting en cuatro direcciones.
