# Boolean Beetle — Boolean Burst projectiles (runtime v1)

Archivo:

- `boolean-beetle-boolean-burst-projectiles-runtime-v1.png`

## Estructura

- Lienzo: `128 × 64 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `4 columnas × 2 filas`
- Fondo: transparencia alfa real
- Sombra: ninguna

Boolean Burst utiliza proyectiles circulares omnidireccionales. Por ello, el
atlas no duplica el mismo orbe en cuatro direcciones.

## Variantes

Filas:

1. canal TRUE — cian;
2. canal FALSE — naranja.

Las dos variantes comparten exactamente la misma silueta y animación. Solo
cambia el color del canal lógico.

## Animación

Columnas:

1. anillo compacto;
2. pulso estable con marcadores cardinales;
3. descarga máxima con ocho dientes de circuito;
4. contracción y retorno al primer frame.

La animación modifica principalmente el reactor interior y sus marcadores. El
diámetro general permanece estable para conservar una lectura visual coherente
durante el movimiento.

## Identidad visual

- Carcasa circular de metal oscuro.
- Anillo lógico cian o naranja.
- Núcleo claro de alta energía.
- Simetría radial.
- Sin punta direccional ni estela larga.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes seguros en las ocho celdas.
- Ningún proyectil queda cortado.
- Máscaras alfa idénticas entre TRUE y FALSE.
- Sin cuadrícula, texto, sombra o fondo residual.

## Prompt de generación

Se solicitó un atlas pixel art de `4 × 2` para los proyectiles individuales de
Boolean Burst. La primera fila representa el canal TRUE cian y la segunda el
canal FALSE naranja. Las cuatro columnas forman un ciclo de pulso y rotación
interna. Los orbes se basan en los pequeños nodos circulares del concepto
aprobado de Boolean Beetle y se generaron sobre un fondo uniforme `#FF00FF`,
posteriormente convertido a transparencia alfa. La hoja se normalizó a celdas
runtime de `32 × 32 px`.

## Siguiente asset recomendado

Impacto y disipación de los orbes TRUE/FALSE de Boolean Burst.
