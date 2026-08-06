# Mutable Widow — Scope Web runtime v1

## Entregable

- `mutable-widow-scope-web-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columna 1: despliegue de tres nodos.
- Columna 2: formación de tres carriles paralelos.
- Columna 3: recuperación neutral.

## Comportamiento visual

### Despliegue

- El anillo interior del abdomen se activa en verde lima.
- Aparecen tres nodos cian-blancos delante de Mutable Widow.
- Los nodos quedan dentro de su propia celda y señalan la dirección del ataque.

### Formación de carriles

- Cada nodo se conecta al cuerpo mediante un carril recto y paralelo.
- Los carriles usan contorno oscuro, cian y un núcleo verde lima.
- El efecto es corto y funciona como anticipación visual, no como proyectil.

### Recuperación

- El tercer frame coincide píxel por píxel con el neutral de idle.
- No quedan nodos, carriles ni residuos del ataque.

## Estándar runtime

- Cuerpo y proporciones tomados directamente del idle runtime validado.
- Perfil derecho: espejo exacto del izquierdo durante despliegue y formación.
- Efectos contenidos entre X/Y = 2 y X/Y = 125.
- Transparencia RGBA binaria, alfa 0 o 255.
- Sin sombra de suelo.
- Sin antialiasing, gradientes ni brillo suave.

## Validaciones

- Dimensiones 384 × 512 y doce celdas: correctas.
- Dirección de los cuatro ataques: correcta.
- Izquierda/derecha: espejo exacto en despliegue y carriles.
- Recovery/idle neutral: coincidencia exacta en las cuatro direcciones.
- Efectos contenidos y sin cruces entre celdas: correctos.
- Residuos magenta: 0.
- Fondo y esquinas transparentes: correctos.

## Proceso

Se generó una fuente conceptual con la herramienta integrada de imágenes usando
el concept sheet y el idle runtime como referencias. Para asegurar legibilidad
y evitar recortes en celdas de 128 × 128 px, el runtime final conserva el cuerpo
validado de idle y reconstruye los tres nodos y carriles con píxel duro,
simetría exacta y composición determinista.

## Prompt final

Use case: stylized-concept. Create a clean top-down pixel-art source sprite
sheet for Mutable Widow's Scope Web attack. Use the supplied concept sheet as
the exact character, materials, palette, abdomen rings, mechanical legs and
fang-emitter identity reference. Use the supplied idle runtime as the exact
camera, silhouette scale, centering and four-direction reference.

Layout: exactly 3 columns by 4 rows, one identical Mutable Widow per square
logical cell. Rows are down, left, right and up. Columns are: deployment of
three compact cyan-white web nodes; formation of three short parallel
cyan-and-acid-lime targeting lanes between the enemy and those nodes; recovery
to the calm neutral idle pose. Each row's nodes and lanes point clearly in its
facing direction. Left and right are true opposites.

Preserve the low wide robotic widow silhouette, eight articulated mechanical
legs where visible, octagonal abdomen, three concentric scope rings, hourglass
core, paired cyan fang emitters, dark gunmetal and petroleum-blue armor, cyan
energy, acid-lime attack accents and controlled red warning lights. Maintain
the same body scale and baseline in every cell.

Classic 16-bit Japanese RPG top-down three-quarter view, crisp hand-placed pixel
art, bold dark pixel outline, flat limited palette, no antialiasing, gradients,
soft glow, blur, texture noise, ambient occlusion or ground shadow. All limbs,
nodes and lanes must remain fully inside their cells.

Use a perfectly uniform solid `#ff00ff` chroma-key background. Do not use that
color in the character or attack. No grid, borders, text, labels, watermark,
environment, projectiles, damage or defeat poses.

## Siguiente asset

Mutable Widow recibiendo daño en las cuatro direcciones.
