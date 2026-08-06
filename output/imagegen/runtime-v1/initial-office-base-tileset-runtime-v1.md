# Escenario Inicial — tileset modular base runtime v1

Archivo:

- `initial-office-base-tileset-runtime-v1.png`

## Estructura

- Lienzo: `256 × 256 px`.
- Celda: `32 × 32 px`.
- Cuadrícula lógica: `8 columnas × 8 filas`.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Escalado: vecino más cercano.

## Contenido por filas

1. Ocho variantes de piso gris rústico; las celdas son completamente opacas y enlazables.
2. Módulos estructurales horizontales para muros superiores.
3. Módulos estructurales horizontales para muros inferiores e interiores.
4. Muros laterales, remates y transiciones de esquina.
5. Puerta metálica cerrada de tres módulos horizontales y piezas de muro compatibles.
6. Rellenos, jambas y variantes estructurales complementarias.
7. Divisiones bajas de cubículo en azul petróleo y grafito.
8. Divisiones altas de cubículo, uniones y remates.

## Paleta y estilo

- Piso en grises medios y fríos.
- Muros azul grisáceo pálido con zócalos de grafito.
- Puerta de metal gris oscuro sin ventana ni señalización.
- Cubículos azul petróleo con estructura oscura.
- Pixel art de bordes duros, sin suavizado ni gradientes.

## Validación

- Dimensiones verificadas: `256 × 256 px`.
- Sesenta y cuatro celdas lógicas de `32 × 32 px`.
- Alfa binario verificado.
- Fondo cromático eliminado.
- Sin texto, etiquetas, cuadrícula dibujada, personajes, props o sombras.
- Las ocho celdas de piso fueron normalizadas para ocupar por completo su área y evitar juntas transparentes.

## Prompt de generación

Se solicitó un atlas cuadrado modular para oficina top-down de RPG de 16 bits con piso, muros, esquinas, puerta cerrada y divisiones de cubículo. La fuente se produjo sobre fondo uniforme `#FF00FF`, se convirtió a alfa y se normalizó a una hoja runtime de `256 × 256 px` mediante vecino más cercano.

## Siguiente asset recomendado

Atlas de props del Escenario Inicial: escritorios, sillas, computadoras, rack de servidores, aire acondicionado interior y planta alta.
