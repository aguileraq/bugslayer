# Mutable Widow — Idle runtime v1

## Entregable

- `mutable-widow-idle-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Fila 1: frente/abajo.
- Fila 2: izquierda.
- Fila 3: derecha.
- Fila 4: espalda/arriba.
- Columna 1: entrada de energía.
- Columna 2: pose neutral.
- Columna 3: pulso de reasignación.

## Estándar visual

- Línea inferior de la silueta: Y = 117.
- Centro horizontal: X = 63.5, con variación máxima de 0.5 px causada por
  anchos impares.
- Perfil derecho: espejo exacto del izquierdo.
- Transparencia: RGBA binaria, alfa 0 o 255.
- Fondo y esquinas: completamente transparentes.
- Píxeles residuales similares al croma magenta: 0.
- Sin sombra de suelo.
- Escalado final: vecino más cercano.

Dimensiones visibles aproximadas:

- Frente: 106–107 px de ancho y 88 px de alto.
- Perfil: 107–108 px de ancho y 76 px de alto.
- Espalda: 103 px de ancho y 82 px de alto.

Mutable Widow mantiene una silueta más baja que Parse Mantis, pero una presencia
horizontal grande y claramente superior al jugador.

## Validaciones

- Doce celdas completas: correctas.
- Misma identidad, abdomen, emisores y paleta: correctos.
- Ocho patas visibles y sin recortes: correctas.
- Direcciones frontal, lateral y trasera: correctas.
- Frames de energía diferenciables sin deformación importante: correctos.
- Línea inferior uniforme: correcta.
- Izquierda/derecha opuestas: espejo exacto.
- Alfa binario y ausencia de croma residual: correctos.

## Proceso

La fuente se generó con la herramienta integrada de imágenes sobre fondo
cromático plano `#ff00ff`, usando
`mutable-widow-concept-sheet.png` como referencia de identidad. El fondo se
eliminó localmente y el resultado se normalizó de forma determinista a la hoja
runtime. La fuente cromática temporal no forma parte de los entregables.

## Prompt final

Use case: stylized-concept.
Asset type: source sprite sheet for a top-down pixel-art action RPG enemy idle
animation.
Input image 1 role: exact character identity and design reference. Preserve
Mutable Widow's low wide robotic spider silhouette, exactly eight articulated
legs, octagonal abdomen with three concentric scope rings, subtle hourglass
core, paired cyan fang emitters, bracket-shaped front clamps, near-black
gunmetal and petroleum-blue armor, cyan stable energy, acid-lime reassignment
accents, and tiny controlled red warning lights.

Create one clean 3-column by 4-row sprite sheet containing the same single
Mutable Widow design in all 12 cells. Use a strict portrait 3:4 sheet layout with
twelve equally sized square logical cells. Do not draw cell borders or grid
lines.

Rows:
1. Facing down/toward viewer, front visible.
2. Facing left, true left profile.
3. Facing right, exact opposite profile with equivalent proportions.
4. Facing up/away from viewer, rear visible.

Columns form a subtle idle loop:
1. Energy entering the abdomen: cyan outer ring beginning to illuminate, legs
steady.
2. Neutral pose: stable cyan hourglass core and rings, mechanically calm.
3. Reassignment pulse: inner ring briefly acid-lime with a small controlled
concentric scan pulse; do not deform or enlarge the body.

Camera: classic 16-bit Japanese RPG top-down three-quarter view, about 60 degrees
above horizon. The same scale, same abdomen size, same leg length, same body
volume, and same head height in every cell. Character centered horizontally. All
feet on one common horizontal baseline in every frame. Generous padding for
every leg; no limb may touch or cross a logical cell edge. Right and left must be
true opposites. The three frames must differ only through tiny mechanical idle
movement and ring/core light state.

Style: crisp hand-placed pixel art, limited flat palette, bold dark pixel
outline, hard edges, no antialiasing, no gradients, no soft glow blur, no
texture noise, no ambient occlusion. Keep energy effects compact and
pixel-sharp. No ground shadow.

Background: perfectly flat uniform solid `#ff00ff` chroma-key background across
the entire sheet. No shadows, gradients, texture, floor plane, reflections,
checkerboard, panel lines, grid, or lighting variation. Do not use `#ff00ff`
anywhere in the character.

Strict constraints: exactly one character per logical cell; exactly twelve
character instances total; exactly eight legs wherever visible; no missing or
extra legs; no weapons or projectiles; no attack pose; no damage; no collapse;
no web; no environmental elements; no text, labels, letters, frame numbers,
logo, or watermark; do not alter the character design or colors between cells.

## Siguiente asset

Reassignment Volley de Mutable Widow en cuatro direcciones.
