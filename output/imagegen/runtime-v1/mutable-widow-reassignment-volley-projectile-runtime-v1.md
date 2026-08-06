# Mutable Widow — Proyectil doble de Reassignment Volley runtime v1

## Entregable

- `mutable-widow-reassignment-volley-projectile-runtime-v1.png`

## Estructura

- Hoja: 96 × 128 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 32 × 32 px.
- Filas: abajo, izquierda, derecha y arriba.
- Columnas: pulso condensado, intensidad máxima y contracción.

## Diseño

- Cada celda contiene exactamente dos proyectiles paralelos.
- Los núcleos permanecen separados durante todo el vuelo.
- Núcleo blanco, cuerpo cian y borde ácido verde lima.
- Contorno petróleo oscuro para mantener legibilidad.
- Separación, longitud y dirección comunes dentro de cada par.
- Cola muy corta y siempre unida al proyectil.

## Validación

- Dimensiones: 96 × 128 px.
- Doce celdas de 32 × 32 px.
- Transparencia RGBA binaria: alfa 0 o 255.
- Izquierda/derecha: espejo exacto.
- Abajo/arriba: espejo vertical exacto.
- Margen mínimo: 3 px.
- Ningún proyectil cruza los límites de una celda.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando la hoja
conceptual y Reassignment Volley como referencias de identidad. El PNG
conceptual original requirió una copia JPEG temporal para la herramienta; el
master permaneció intacto. Después se retiró el fondo cromático y la fuente se
normalizó directamente a celdas runtime mediante vecino más cercano y simetría
determinista.

## Prompt final

Use case: stylized-concept. Create a strict portrait 3-column by 4-row source
sprite sheet for Mutable Widow's paired Reassignment Volley projectile. Each
cell contains exactly two separate compact parallel bolts. Rows are down, left,
right and up. Columns are condensed pulse, peak pulse and contracted pulse.

Each bolt has a white-hot core, bright cyan body, acid-lime edge accent and dark
petroleum outline. Preserve identical bolt shapes and fixed parallel spacing.
Use crisp 16-bit Japanese RPG pixel art on a uniform solid `#ff00ff` chroma-key
background. No character, fang, spider, impact burst, web node, long beam,
lightning arc, grid, text or watermark.

## Siguiente asset

Impacto y disipación del mismo par de proyectiles.
