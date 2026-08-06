# Cast Hornet — Casting Swarm projectiles (runtime v1)

Archivo:

- `cast-hornet-casting-swarm-projectiles-runtime-v1.png`

## Estructura

- Lienzo: `96 × 128 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `3 columnas × 4 filas`
- Fondo: transparencia alfa real
- Sombra: ninguna
- Contenido por frame: exactamente tres fragmentos de datos

## Orden de animación

Filas:

1. abajo / hacia el jugador;
2. izquierda;
3. derecha;
4. arriba / alejándose.

Columnas:

1. pulso condensado;
2. pulso de vuelo máximo;
3. pulso contraído.

## Identidad visual

- Fragmento cian
- Fragmento amarillo de advertencia
- Fragmento violeta
- Siluetas angulares tipo cuña
- Contorno oscuro y brillo interior
- Estela corta y pixelada

Las filas derecha y arriba son transformaciones exactas de izquierda y abajo,
respectivamente. Esto evita cambios de escala, color o geometría entre
direcciones opuestas.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes internos presentes en las doce celdas.
- Ningún proyectil queda cortado.
- Simetría direccional verificada.
- Sin grid, etiquetas, texto, sombra o fondo residual.

## Prompt de generación

Se solicitó una hoja fuente pixel art de `3 × 4` para el ataque Casting Swarm,
con exactamente tres fragmentos independientes por celda —cian, amarillo y
violeta—, cuatro direcciones, tres pulsos de vuelo, estética coherente con Cast
Hornet y fondo uniforme `#FF00FF`. La fuente se normalizó después al estándar
runtime de `32 × 32 px` por frame y se convirtió a transparencia alfa.
