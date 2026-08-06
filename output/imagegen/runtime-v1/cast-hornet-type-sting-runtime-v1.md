# Cast Hornet — Type Sting runtime v1

## Entregable

- `cast-hornet-type-sting-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: carga, aguijonazo y recuperación.

## Animación

- Carga: abdomen comprimido y curvándose bajo el tórax.
- Aguijonazo: el abdomen articulado lleva el inyector más allá de la cabeza.
- El destello cian-blanco aparece únicamente en la punta del aguijón.
- Recuperación: regreso exacto al frame neutral de idle.
- El abdomen permanece conectado y conserva segmentos mecánicos rígidos.

## Estándar runtime

- Misma identidad y escala base que idle y flight.
- Los perfiles laterales de carga y ataque se compactan ligeramente para
  contener la articulación completa.
- Perfil derecho: espejo exacto del izquierdo.
- Recovery: coincidencia píxel por píxel con idle neutral.
- Margen mínimo para los frames de ataque: 5 px.
- Transparencia RGBA binaria, alfa 0 o 255.
- Residuos magenta: 0.
- Sin proyectil, estela ni sombra de suelo.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando el concept
sheet, idle y flight de Cast Hornet. Se realizó una segunda edición localizada
para corregir los ataques laterales y hacer que el aguijón rebasara la cabeza
en la dirección correcta. Después se retiró el fondo cromático, se normalizó
con vecino más cercano, se reconstruyó el perfil derecho por espejo y se
reemplazó recovery por el idle neutral exacto.

## Prompt final

Use case: stylized-concept. Create a portrait 3-column by 4-row source sprite
sheet for Cast Hornet's Type Sting attack. Preserve the exact concept, idle and
flight identity: wedge head, cyan-violet visor, yellow mandibles, armored
thorax, cyan conversion core, segmented abdomen, one injector stinger, exactly
six tucked legs and exactly four framed cyan energy wings.

Rows are down, left, right and up. Columns are: charge with the rigid abdomen
segments compressing and curling beneath the thorax; sting with the connected
abdomen snapping forward so the injector tip emerges just beyond the head in
the same direction as the face, plus one compact cyan-white contact flare;
recovery to the exact calm neutral idle pose. The abdomen must behave like a
robotic scorpion tail without stretching, melting, detaching or duplicating.

For the lateral attack frames, left must place the connected stinger and flare
beyond the head on the left with nothing at the rear; right must be the exact
opposite. Keep every part inside its cell and maintain a stable hover pivot.

Use classic 16-bit Japanese RPG top-down three-quarter pixel art, bold dark
outlines and flat limited shading. No antialiasing, gradients, soft glow, blur,
texture noise, ambient occlusion or ground shadow. Use a perfectly uniform
solid `#ff00ff` chroma-key background. No grid, text, labels, watermark,
projectiles, target markers, long trails, extra appendages, damage, defeat or
environment.

## Siguiente asset

Cast Hornet — Casting Swarm en cuatro direcciones.
