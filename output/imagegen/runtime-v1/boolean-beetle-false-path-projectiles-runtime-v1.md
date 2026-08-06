# Boolean Beetle — False Path real projectiles (runtime v1)

Archivo:

- `boolean-beetle-false-path-projectiles-runtime-v1.png`

## Estructura

- Lienzo: `96 × 256 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `3 columnas × 8 filas`
- Fondo: transparencia alfa real
- Sombra: ninguna

## Variantes direccionales

Filas:

1. cian — abajo;
2. cian — izquierda;
3. cian — derecha;
4. cian — arriba;
5. naranja — abajo;
6. naranja — izquierda;
7. naranja — derecha;
8. naranja — arriba.

Los canales TRUE cian y FALSE naranja comparten exactamente la misma silueta.
Las direcciones se construyeron mediante rotaciones exactas.

## Animación

Columnas:

1. punta sólida compacta;
2. pulso extendido con núcleo claro;
3. pulso contraído.

## Identidad visual

- Cursor o punta lógica estrecha.
- Un solo cuerpo energético, sin bifurcación.
- Collar mecánico oscuro.
- Estela muy corta y conectada.
- Diferente del orbe circular de Boolean Burst y del dardo bifurcado de XOR.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes seguros en las veinticuatro celdas.
- Ningún proyectil queda cortado.
- Siluetas idénticas entre canales.
- Sin rutas, nodos, cuadrícula, texto o fondo residual.

## Prompt de generación

Se solicitó una fuente pixel art de `3 × 2` con un proyectil real de False Path
orientado hacia abajo, en variantes cian y naranja y tres pulsos de vuelo. La
fuente se generó sobre `#FF00FF`, se convirtió a transparencia alfa y se
normalizó para construir las cuatro direcciones en celdas de `32 × 32 px`. La
estela del pulso central se redujo para mantener la silueta compacta.

## Siguiente asset recomendado

Impacto y disipación de los proyectiles reales de `False Path`.
