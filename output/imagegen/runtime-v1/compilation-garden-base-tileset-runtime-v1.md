# Jardín de Compilación — tileset modular base runtime v1

Archivo:

- `compilation-garden-base-tileset-runtime-v1.png`

## Propósito

Tileset base para el primer encuentro y tutorial contra Parse Mantis. Construye la arena ovalada del Jardín de Compilación sin incorporar personajes, enemigos, props grandes ni elementos de interfaz.

La zona central utiliza superficies oscuras y de bajo ruido visual para conservar la lectura del Senior Engineer, Parse Mantis, los proyectiles y el panel de preguntas.

## Estructura

- Lienzo: `256 × 256 px`.
- Celda: `32 × 32 px`.
- Cuadrícula lógica: `8 columnas × 8 filas`.
- Total: `64 tiles`.
- Fondo: transparencia alfa real en los módulos estructurales.
- Alfa: binario, únicamente `0` y `255`.
- Escalado de normalización: vecino más cercano.
- No existe cuadrícula dibujada dentro del arte.

## Contenido por filas

1. Ocho variantes enlazables de suelo tecnológico oscuro con placas, césped digital moderado y líneas cian discretas.
2. Transiciones entre metal, vegetación artificial, raíces-circuito y paneles de diagnóstico.
3. Límites de arena: segmentos rectos y curvas compatibles con una composición ovalada, reforzados por líneas de contención cian.
4. Vegetación no transitable: arbustos digitales, raíces de cable, remates rectos, verticales y esquinas.
5. Bases y troncos para árboles de compilación: raíces, bifurcaciones, uniones laterales y nodos de estructura sintáctica.
6. Suelo con corrupción sintáctica baja o media: polígonos rotos, geometría duplicada y motivos gráficos inspirados en llaves, corchetes y paréntesis.
7. Barreras digitales: bases inactivas, muros de energía, terminales, esquinas, cruces y variante dañada.
8. Módulos de suelo complementarios: cuartos del Nodo de Inicialización, conexiones, marcas de tutorial, paneles de diagnóstico y rellenos neutros.

## Paleta y estilo

- Azul petróleo, negro azulado y gris carbón como base.
- Verde digital apagado para vegetación.
- Cian brillante en circuitos y límites.
- Violeta y magenta controlados para corrupción y barreras.
- Naranja reservado para futuros puntos narrativos.
- Pixel art top-down 3/4 con bordes duros, sin suavizado, gradientes ni sombras proyectadas.

## Reglas de uso

- Filas 1, 2, 3, 6 y 8: tiles opacos que ocupan completamente la celda.
- Filas 4, 5 y 7: módulos con transparencia y margen interno seguro.
- Mantener despejada la mayor parte del suelo central usando principalmente la fila 1.
- Concentrar vegetación densa, árboles y corrupción cerca del perímetro.
- Usar las barreras de la fila 7 únicamente para los límites del combate; su violeta ambiental debe permanecer menos intenso que los ataques.
- El nido de Parse Mantis, V4LK, terminales, drones y props narrativos se entregarán en atlas separados.

## Validación

- Dimensiones verificadas: `256 × 256 px`.
- Sesenta y cuatro celdas exactas de `32 × 32 px`.
- Alfa binario verificado.
- Los tiles de suelo cubren completamente su celda para evitar juntas transparentes.
- Los módulos estructurales permanecen dentro de su celda y conservan margen.
- Sin texto, etiquetas, números, personajes, enemigos, proyectiles, HUD, marcas de agua o cuadrícula visible.
- La paleta no compite con el naranja de Parse Mantis ni con sus proyectiles.

## Prompt de generación

Se solicitó una hoja modular `8 × 8` para un RPG japonés de 16 bits, con suelo tecnológico nocturno, vegetación artificial, raíces-circuito, límites ovalados, árboles de compilación, corrupción sintáctica, barreras digitales y módulos del nodo de inicialización. La generación se realizó sobre fondo uniforme `#FF00FF`; después se convirtió a alfa y se normalizó a celdas runtime de `32 × 32 px`.

Modo utilizado: herramienta integrada de generación de imágenes, caso `stylized-concept`.

## Siguiente asset recomendado

Crear el **atlas de props del Jardín de Compilación** con:

1. árboles de compilación completos;
2. plantas-circuito y flores-sintaxis;
3. hongos de neón;
4. terminales de prueba dañadas;
5. drones de mantenimiento inactivos;
6. paneles de tutorial;
7. Nodo de V4LK;
8. nido de Parse Mantis;
9. portal o compuerta de salida.

Después deberá producirse el atlas animado de maquinaria, barreras y efectos ambientales.
