# Mutable Widow — Reassignment Volley runtime v1

## Entregable

- `mutable-widow-reassignment-volley-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columna 1: carga y transferencia de energía.
- Columna 2: descarga doble.
- Columna 3: recuperación neutral.

## Comportamiento visual

### Carga

- El anillo interior cambia a verde lima.
- Dos rutas energéticas conectan el abdomen con los colmillos.
- No existen proyectiles separados del cuerpo.

### Descarga

- Ambos emisores disparan al mismo tiempo.
- Los destellos cian-blancos apuntan en la dirección de cada fila.
- Solo se muestra el inicio corto de los dos rayos.
- Los proyectiles de vuelo continúan siendo assets independientes.

### Recuperación

- El tercer frame coincide píxel por píxel con el neutral de idle.
- No conserva destellos ni partículas de la descarga.

## Estándar runtime

- Línea inferior corporal: Y = 117.
- Los destellos pueden extenderse hasta Y = 120 en la descarga frontal sin
  desplazar el cuerpo.
- Perfil derecho: espejo exacto del izquierdo.
- Margen mínimo de silueta y efectos: 7 px.
- Transparencia: RGBA binaria, alfa 0 o 255.
- Residuos similares al fondo cromático: 0.
- Sin sombra de suelo.
- Escalado final: vecino más cercano.

## Validaciones

- Dimensiones y doce celdas: correctas.
- Identidad, abdomen, patas y emisores: consistentes con idle.
- Dirección de los cuatro ataques: correcta.
- Izquierda/derecha: espejo exacto en los tres frames.
- Recovery/idle neutral: coincidencia exacta en las cuatro direcciones.
- Efectos contenidos y sin cruces entre celdas: correctos.
- Fondo y esquinas transparentes: correctos.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando el concept
sheet como referencia de identidad y el idle runtime como referencia de escala.
Se utilizó un fondo cromático uniforme `#ff00ff`, eliminado localmente antes de
normalizar el resultado de forma determinista a 384 × 512 px. Las fuentes
temporales no forman parte de los entregables.

## Prompt final

Use case: stylized-concept.
Asset type: source sprite sheet for a top-down pixel-art action RPG enemy attack
animation.
Input image 1 role: exact Mutable Widow character design, materials, color
identity, fang emitters, abdomen rings, and Reassignment Volley behavior
reference.
Input image 2 role: exact runtime direction order, silhouette scale, centering,
proportions, camera, and idle recovery reference. Preserve its body width,
abdomen size, leg length, and directional reading.

Create one clean 3-column by 4-row sprite sheet containing the same single
Mutable Widow design in all 12 logical square cells. Strict portrait 3:4 sheet
layout. Do not draw grid lines or cell borders.

Rows:
1. Facing down/toward viewer; paired fangs point downward.
2. Facing left; fang emitters point left.
3. Facing right; exact opposite profile with fang emitters pointing right.
4. Facing up/away from viewer; discharge points upward from the forward upper
edge, with the fangs mostly occluded by the body.

Columns form Reassignment Volley:
1. Charge: the acid-lime inner abdomen ring activates and two thin cyan-lime
energy paths travel from the abdomen toward both fang emitters; no projectile
has left the body.
2. Double discharge: both fang emitters fire simultaneously. Show two compact,
crisp cyan-white muzzle flashes and only very short beginnings of two parallel
lime-edged bolts, fully contained within the same cell. The flashes must clearly
point in the row's facing direction. No long beams and no detached projectile
sprites.
3. Recovery: calm neutral pose matching the idle reference, cyan hourglass core
stable, no muzzle flash, no stray particles.

Character invariants: low wide robotic widow spider, exactly eight articulated
mechanical legs wherever anatomy is visible, octagonal abdomen with three
concentric scope rings, subtle hourglass core, paired cyan fang emitters,
bracket-shaped front clamps, near-black gunmetal and petroleum-blue armor, cyan
stable energy, acid-lime reassignment accents, tiny controlled red warning
lights. Same character scale, body volume, abdomen diameter, head height, and
leg length in all cells. Center horizontally. All feet share one common
horizontal baseline. Right and left must be true opposites. No limb or effect
may touch or cross a logical cell edge.

Camera and style: classic 16-bit Japanese RPG top-down three-quarter view, about
60 degrees above horizon; crisp hand-placed pixel art; bold dark pixel outline;
flat limited palette; no antialiasing; no gradients; no soft glow; no blur; no
texture noise; no ambient occlusion; no ground shadow.

Background: perfectly flat uniform solid `#ff00ff` chroma-key background across
the entire sheet. No shadows, gradients, texture, floor plane, reflections,
checkerboard, panel lines, grid, or lighting variation. Do not use `#ff00ff` in
the character or effects.

Strict constraints: exactly one character per logical cell; exactly twelve
instances total; no extra or missing legs; no web nodes; no Scope Web attack; no
damage; no defeat; no environment; no text, labels, letters, numbers, logo, or
watermark. Keep all energy effects compact and separate from the cell
boundaries.

## Siguiente asset

Scope Web de Mutable Widow.
