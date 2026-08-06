# Boolean Beetle — Boolean Burst impact (runtime v1)

Archivo:

- `boolean-beetle-boolean-burst-impact-runtime-v1.png`

## Estructura

- Lienzo: `128 × 64 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `4 columnas × 2 filas`
- Fondo: transparencia alfa real
- Sombra: ninguna

El impacto conserva la naturaleza circular y omnidireccional de los proyectiles
de Boolean Burst, por lo que no requiere filas adicionales por dirección.

## Variantes

Filas:

1. canal TRUE — cian;
2. canal FALSE — naranja.

Las dos filas comparten exactamente la misma geometría, distribución de
fragmentos, escala y progresión. Solo cambia el color del canal lógico.

## Secuencia

Columnas:

1. contacto y agrietamiento de la carcasa;
2. ruptura mecánica y expansión del anillo;
3. estallido lógico máximo con ocho radios;
4. disipación en residuos cuadrados mínimos.

## Identidad visual

- Fragmentos de carcasa oscura.
- Energía cian o naranja según el canal.
- Núcleo claro durante la ruptura.
- Simetría radial.
- Sin humo, fuego, sombra o estela direccional.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes seguros en las ocho celdas.
- Ningún fragmento queda cortado.
- Máscaras alfa idénticas entre TRUE y FALSE.
- Sin cuadrícula, texto o fondo residual.

## Prompt de generación

Se solicitó un atlas pixel art de `4 × 2` para el impacto y disipación de los
orbes de Boolean Burst. La primera fila corresponde al canal TRUE cian y la
segunda al canal FALSE naranja. Las columnas representan contacto, ruptura,
estallido y disipación. La fuente se generó sobre un fondo uniforme `#FF00FF`,
posteriormente convertido a transparencia alfa y normalizado a celdas runtime
de `32 × 32 px`.

## Siguiente asset recomendado

Proyectiles diagonales de `XOR Crossfire`, manteniendo los canales lógicos cian
y naranja de Boolean Beetle.
