# Boolean Beetle — False Path decoy routes (runtime v1)

Archivo:

- `boolean-beetle-false-path-decoy-routes-runtime-v1.png`

## Estructura

- Lienzo: `128 × 128 px`
- Celda: `32 × 32 px`
- Cuadrícula lógica: `4 columnas × 4 filas`
- Fondo: transparencia alfa real
- Sombra: ninguna

Este atlas contiene piezas modulares para construir rutas falsas de diferentes
longitudes sin almacenar trayectorias completas.

## Módulos

Filas:

1. nodo terminal hueco con entrada corta;
2. segmento horizontal discontinuo;
3. codo angular de 90 grados;
4. bifurcación corta en Y.

Los módulos están definidos en una orientación canónica y conservan márgenes
para poder rotarlos o reflejarlos sin cortes.

## Ciclo visual

Columnas:

1. aparición tenue;
2. ruta falsa completamente legible;
3. parpadeo discontinuo;
4. desaparición casi completa.

## Identidad visual

- Paleta limitada a cuatro tonos azul petróleo.
- Nodos terminales huecos.
- Circuitos discontinuos y angulares.
- Sin punta brillante de disparo.
- Sin cian o naranja saturados.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente `0` y `255`.
- Márgenes seguros en las dieciséis celdas.
- Ningún módulo queda cortado.
- Sin tonos de ruta real, cuadrícula, texto o fondo residual.

## Prompt de generación

Se solicitó un atlas modular pixel art de `4 × 4` con nodo, segmento, codo y
bifurcación, cada uno en cuatro fases de visibilidad. La fuente utilizó fondo
verde cromático para preservar los tonos azul petróleo. Después se convirtió a
transparencia alfa, se normalizó a `32 × 32 px` y se limitó a cuatro tonos.
