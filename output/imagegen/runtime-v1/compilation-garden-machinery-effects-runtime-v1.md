# Jardín de Compilación — maquinaria y efectos ambientales runtime v1

Archivo:

- `compilation-garden-machinery-effects-runtime-v1.png`

## Propósito

Atlas animado para los nodos, maquinaria abandonada, límites de combate y corrupción ambiental del tutorial contra Parse Mantis.

Los efectos se mantienen deliberadamente contenidos y con menor intensidad que los ataques, para no interferir con la lectura de proyectiles ni con el panel de preguntas.

## Estructura

- Lienzo: `192 × 512 px`.
- Frame: `64 × 64 px`.
- Cuadrícula: `3 columnas × 8 filas`.
- Total: `24 frames`.
- Cada fila contiene una animación de tres frames.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Escalado: vecino más cercano.
- Línea de suelo: `Y = 61` dentro de cada frame.
- Sombras: ninguna.

## Convención de columnas

1. preparación, reposo o energía baja;
2. estado activo o punto máximo;
3. retorno, fallo o estabilización.

## Distribución por filas

### Fila 1 — Nodo de Inicialización

1. anillo cian tenue;
2. pulso brillante con fragmentos ascendentes;
3. estado estable moderado.

### Fila 2 — Nodo de V4LK

1. emisor violeta en reposo;
2. columna de activación cian-violeta;
3. emisor preparado para proyectar a V4LK.

El holograma del perro no forma parte de esta hoja.

### Fila 3 — terminal dañada

1. pantalla oscura con una línea violeta;
2. interferencia desplazada contenida en la pantalla;
3. recuperación parcial.

### Fila 4 — dron de mantenimiento

1. diagnóstico naranja débil;
2. intento de reinicio con pulso cian y movimiento mínimo;
3. nuevo fallo y reposo inerte.

El dron permanece visualmente no hostil y no dispara.

### Fila 5 — barrera digital de combate

1. bases sin muro energético;
2. pared cian-violeta elevándose;
3. barrera completamente cerrada.

### Fila 6 — compuerta de salida

1. apertura oscura;
2. fragmentos cian formando el acceso;
3. portal turquesa estabilizado.

### Fila 7 — raíces-circuito

1. pulso a la izquierda;
2. pulso en el centro;
3. pulso a la derecha.

### Fila 8 — corrupción sintáctica

1. fragmentos violetas aislados;
2. duplicación y desplazamiento de polígonos;
3. estabilización parcial con residuo mínimo.

## Identidad visual

- Cámara top-down 3/4 consistente con tileset y props.
- Grafito, azul petróleo y negro azulado en maquinaria.
- Cian y turquesa para energía estable.
- Violeta para comunicación, glitch y barreras.
- Naranja reservado para diagnóstico del dron.
- Bordes de píxel duros, sin suavizado, gradientes, halos o desenfoque.

## Validación

- Dimensiones verificadas: `192 × 512 px`.
- Veinticuatro celdas exactas de `64 × 64 px`.
- Alfa binario verificado.
- Cuatro esquinas transparentes.
- Escala estable dentro de cada secuencia.
- Línea de suelo uniforme.
- Efectos contenidos dentro de sus respectivos frames.
- Sin texto, etiquetas, cuadrícula, personajes, enemigos, proyectiles, sombras o marcas de agua.

## Prompt de generación

Se solicitó una matriz vertical de ocho animaciones ambientales con tres estados cada una: Nodo de Inicialización, Nodo de V4LK, terminal dañada, dron, barrera, portal, raíces y corrupción sintáctica. Se tomaron como referencias el tileset, el atlas de props y la energía holográfica de V4LK. La fuente se generó sobre `#FF00FF`, se convirtió a alfa y se normalizó a frames de `64 × 64 px`.

Modo utilizado: herramienta integrada de generación de imágenes, caso `stylized-concept`.

## Siguiente asset recomendado

Crear la **composición final del Jardín de Compilación** en tres estados:

1. llegada del Senior, Nodo de Inicialización activo, V4LK presente y barreras abiertas;
2. encuentro contra Parse Mantis, nido abierto y barreras cerradas;
3. Parse Mantis derrotado, corrupción reducida y compuerta de salida estabilizada.

La composición debe mantener la misma arena, cámara y posición de props en los tres estados.
