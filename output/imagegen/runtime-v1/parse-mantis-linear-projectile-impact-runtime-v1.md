# Parse Mantis — Impacto del proyectil lineal runtime v1

## Entregable

- `parse-mantis-linear-projectile-impact-runtime-v1.png`

## Estructura

- Hoja: 128 × 128 px.
- Cuadrícula: 4 columnas × 4 filas.
- Celda: 32 × 32 px.
- Filas: abajo, izquierda, derecha, arriba.
- Frame 1: contacto.
- Frame 2: expansión máxima.
- Frame 3: fragmentación.
- Frame 4: disipación final.

## Diseño visual

- Conserva la paleta blanca, amarilla, ámbar y naranja del proyectil lineal.
- Borde oscuro durante contacto y expansión.
- Fragmentos orientados según la dirección del impacto.
- El último frame contiene únicamente residuos energéticos mínimos.
- Sin sombra, suavizado, degradados ni elementos persistentes.

## Validaciones

- Dimensiones y celdas: correctas.
- Fondo transparente y alfa binario: correctos.
- Izquierda/derecha: espejo exacto.
- Arriba/abajo: espejo exacto.
- Margen mínimo: 2 px durante la expansión máxima.
- Ningún fragmento toca o cruza una celda.
- Secuencia visual contacto → expansión → fragmentación → disipación: correcta.

## Estado

Creado directamente a resolución runtime. No modifica ningún asset existente.
