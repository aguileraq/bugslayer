# Boolean Beetle — XOR Crossfire impact (runtime v1)

Archivo:

- `boolean-beetle-xor-crossfire-impact-runtime-v1.png`

## Estructura

- Lienzo: `128 × 256 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `4 columnas × 8 filas`
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

Los canales TRUE cian y FALSE naranja comparten exactamente la misma geometría
y distribución de residuos.

## Secuencia

Columnas:

1. contacto y compresión del dardo;
2. fractura bifurcada;
3. destello XOR máximo;
4. disipación diagonal.

## Identidad visual

- Impacto direccional derivado del dardo bifurcado.
- Núcleo claro durante la fractura.
- Fragmentos energéticos cian o naranja.
- Residuos finales alineados con la trayectoria.
- Sin humo, fuego, sombra o explosión circular.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes seguros en las treinta y dos celdas.
- Ningún fragmento queda cortado.
- Siluetas idénticas entre canales.
- Direcciones diagonales construidas mediante transformaciones exactas.
- Sin cuadrícula, texto o fondo residual.

## Prompt de generación

Se solicitó una fuente pixel art de `4 × 2` para el impacto de un dardo XOR que
viaja al noreste. Las columnas representan contacto, fractura, destello y
disipación; las filas corresponden a los canales cian y naranja. La fuente se
generó sobre `#FF00FF`, se convirtió a transparencia alfa y se normalizó para
construir las cuatro diagonales de ambos canales en celdas runtime de
`32 × 32 px`.

## Siguiente asset recomendado

Efectos de rutas falsas y proyectiles reales de `False Path`.
