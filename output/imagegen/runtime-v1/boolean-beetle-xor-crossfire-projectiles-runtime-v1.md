# Boolean Beetle — XOR Crossfire projectiles (runtime v1)

Archivo:

- `boolean-beetle-xor-crossfire-projectiles-runtime-v1.png`

## Estructura

- Lienzo: `96 × 256 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `3 columnas × 8 filas`
- Fondo: transparencia alfa real
- Sombra: ninguna

## Variantes direccionales

Filas:

1. cian — noreste;
2. cian — sureste;
3. cian — suroeste;
4. cian — noroeste;
5. naranja — noreste;
6. naranja — sureste;
7. naranja — suroeste;
8. naranja — noroeste.

Los canales TRUE cian y FALSE naranja comparten exactamente las mismas
siluetas. Las cuatro diagonales se construyeron mediante transformaciones
exactas para evitar variaciones de escala.

## Animación

Columnas:

1. pulso compacto;
2. pulso extendido de máxima energía;
3. pulso contraído.

## Identidad visual

- Dardo diagonal bifurcado.
- Dos puntas energéticas que evocan el cruce XOR.
- Centro mecánico oscuro.
- Estela corta y siempre unida.
- Sin forma circular, para distinguirlo de Boolean Burst.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes seguros en las veinticuatro celdas.
- Ningún dardo queda cortado.
- Siluetas idénticas entre los canales cian y naranja.
- Direcciones opuestas geométricamente consistentes.
- Sin cuadrícula, texto, sombra o fondo residual.

## Prompt de generación

Se solicitó una fuente pixel art de dardos XOR bifurcados que viajan en
diagonal, con variantes cian y naranja y tres pulsos de vuelo. La fuente se
generó sobre un fondo uniforme `#FF00FF`, posteriormente convertido a
transparencia alfa. Las cuatro direcciones diagonales y los dos canales se
normalizaron a celdas runtime de `32 × 32 px`.

## Siguiente asset recomendado

Impacto y disipación diagonal de los proyectiles de `XOR Crossfire`.
