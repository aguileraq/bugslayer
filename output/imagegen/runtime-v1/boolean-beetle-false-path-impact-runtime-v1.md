# Boolean Beetle — False Path impact (runtime v1)

Archivo:

- `boolean-beetle-false-path-impact-runtime-v1.png`

## Estructura

- Lienzo: `128 × 256 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `4 columnas × 8 filas`
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

Los canales TRUE cian y FALSE naranja comparten exactamente la misma geometría
y distribución de fragmentos.

## Secuencia

Columnas:

1. contacto y compresión del cursor;
2. ruptura en fragmentos angulares;
3. destello de confirmación de ruta;
4. disipación sobre el eje de movimiento.

## Identidad visual

- Impacto estrecho y direccional.
- Fragmentos derivados de una punta lógica sólida.
- Destello central corto con forma de T.
- Residuos alineados con la trayectoria.
- Sin anillo circular ni cruce diagonal.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes seguros en las treinta y dos celdas.
- Ningún fragmento queda cortado.
- Siluetas idénticas entre canales.
- Direcciones construidas mediante rotaciones exactas.
- Sin cuadrícula, texto, sombra o fondo residual.

## Prompt de generación

Se solicitó una fuente pixel art de `4 × 2` para el impacto de un proyectil real
de False Path que viaja hacia abajo. Las columnas representan contacto,
ruptura, destello de confirmación y disipación; las filas corresponden a los
canales cian y naranja. La fuente se generó sobre `#FF00FF`, se convirtió a
transparencia alfa y se normalizó para construir las cuatro direcciones en
celdas runtime de `32 × 32 px`.

## Estado de la prioridad

Con este asset quedan cubiertas las familias de proyectiles y efectos de Parse
Mantis, Mutable Widow, Cast Hornet y Boolean Beetle.
