# Parse Mantis — Proyectil lineal runtime v1

## Entregable

- `parse-mantis-linear-projectile-runtime-v1.png`

## Estructura

- Hoja: 96 × 128 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 32 × 32 px.
- Fila 1: abajo.
- Fila 2: izquierda.
- Fila 3: derecha.
- Fila 4: arriba.
- Columna 1: pulso condensado.
- Columna 2: máxima intensidad.
- Columna 3: contracción del pulso.

## Diseño visual

- Proyectil energético compacto con silueta direccional.
- Núcleo blanco.
- Halo amarillo y ámbar.
- Cubierta naranja profunda.
- Borde oscuro tomado de la identidad mecánica de Parse Mantis.
- Cola corta y partículas mínimas para indicar la dirección de avance.
- Sin sombra, degradados, suavizado ni textura ambiental.

La paleta se derivó visualmente de los destellos del ataque lineal de Parse
Mantis. El centro luminoso permanece estable entre los tres frames para evitar
que el pulso parezca desviarse durante el vuelo.

## Validaciones

- Dimensiones 96 × 128: correctas.
- Celdas 32 × 32: correctas.
- Fondo transparente y alfa binario: correctos.
- Izquierda/derecha: espejo exacto.
- Arriba/abajo: espejo exacto.
- Margen mínimo: 2 px en el frame de máxima intensidad.
- Ninguna partícula toca o cruza los límites de una celda.
- Los tres frames mantienen el mismo núcleo visual.

## Estado del asset

Este proyectil fue creado directamente a resolución runtime para conservar
control de píxel y evitar una reducción desde un master sobredimensionado.
No reemplaza ni modifica ningún archivo existente.

## Siguiente asset

Proyectil radial del juego.
