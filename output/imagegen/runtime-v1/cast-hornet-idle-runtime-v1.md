# Cast Hornet — Idle runtime v1

## Entregable

- `cast-hornet-idle-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: alas elevadas, posición media y alas descendidas.

## Animación

- El cuerpo mantiene una escala constante.
- El segundo frame baja solamente un píxel para reforzar la flotación.
- Las cuatro alas recorren una secuencia elevada, media y descendida.
- Las seis patas permanecen replegadas durante todo el ciclo.
- El núcleo, visor, abdomen y aguijón conservan posición y diseño.

## Estándar runtime

- Escala global única para las cuatro direcciones.
- Perfil derecho: espejo exacto del izquierdo.
- Margen mínimo del contenido: 8 px.
- Transparencia RGBA binaria, alfa 0 o 255.
- Residuos magenta: 0.
- Píxeles y componentes aislados: 0.
- Esquinas transparentes en las doce celdas.
- Sin sombra de suelo.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando la hoja
conceptual de Cast Hornet como referencia de identidad y el idle de Mutable
Widow únicamente como referencia de estructura runtime. El fondo cromático se
retiró localmente. Se aplicó una escala global, vecino más cercano, limpieza de
islas de píxeles y simetría lateral determinista.

## Prompt final

Use case: stylized-concept. Create a portrait 3-column by 4-row source sprite
sheet for Cast Hornet's hovering idle animation. Preserve the exact concept
design: wedge-shaped head, cyan-violet visor, yellow mandibles, armored thorax,
conversion core, segmented abdomen, injector stinger, exactly six tucked
mechanical legs and exactly four angular framed cyan energy wings.

Rows are down, left, right and up. Columns form a seamless hovering loop:
wing-up phase, mid-wing phase with only a one-or-two-pixel body drop, and
wing-down phase returning to neutral hover height. Only wing angles and minimal
vertical motion may change. Keep identical body scale, proportions and wing
roots. Left and right must be true opposites. Keep all parts inside each cell.

Use a classic 16-bit Japanese RPG top-down three-quarter view, crisp
handcrafted pixel art, bold near-black outlines and flat limited shading. No
antialiasing, gradients, soft glow, blur, texture noise, ambient occlusion or
ground shadow.

Use a perfectly uniform solid `#ff00ff` chroma-key background. No grid,
borders, labels, text, watermark, attacks, projectiles, target markers, speed
trails, damage, defeat, environment or additional insects.

## Siguiente asset

Cast Hornet — desplazamiento/flight movement en cuatro direcciones.
