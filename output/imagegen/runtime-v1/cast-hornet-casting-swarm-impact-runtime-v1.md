# Cast Hornet — Casting Swarm impact (runtime v1)

Archivo:

- `cast-hornet-casting-swarm-impact-runtime-v1.png`

## Estructura

- Lienzo: `128 × 128 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `4 columnas × 4 filas`
- Fondo: transparencia alfa real
- Sombra: ninguna

## Direcciones

Filas:

1. impacto de un proyectil que viaja hacia abajo;
2. impacto de un proyectil que viaja hacia la izquierda;
3. impacto de un proyectil que viaja hacia la derecha;
4. impacto de un proyectil que viaja hacia arriba.

## Secuencia

Columnas:

1. contacto compacto de los tres fragmentos;
2. fractura inicial con núcleo brillante;
3. estallido angular máximo;
4. disipación en pequeños píxeles de energía.

## Identidad visual

- Fragmentos cian, amarillo y violeta derivados de Casting Swarm.
- Formas angulares y mecánico-digitales.
- Núcleo luminoso durante la fractura.
- Residuos finales mínimos y legibles.
- Sin humo, fuego, sombra o elementos externos.

Las filas derecha y arriba son transformaciones exactas de izquierda y abajo.
Esto conserva el volumen y la distribución de color entre direcciones opuestas.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes internos presentes en las dieciséis celdas.
- Ningún fragmento queda cortado.
- Simetría direccional verificada.
- Sin cuadrícula, etiquetas, texto ni fondo residual.

## Prompt de generación

Se solicitó una hoja pixel art de `4 × 4` para el
impacto/desintegración de Casting Swarm. Cada fila representa una dirección y
las columnas muestran contacto, fractura, estallido y disipación. El efecto
conserva los tres colores del proyectil —cian, amarillo y violeta— sobre un
fondo uniforme `#FF00FF`, posteriormente convertido a transparencia alfa. La
hoja fuente se normalizó al estándar runtime de `32 × 32 px` por frame.
