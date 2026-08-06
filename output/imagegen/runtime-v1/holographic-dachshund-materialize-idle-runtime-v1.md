# Perrito holográfico — materialización y reposo runtime v1

Archivo:

- `holographic-dachshund-materialize-idle-runtime-v1.png`

## Estructura

- Lienzo: `256 × 256 px`.
- Frame: `64 × 64 px`.
- Cada frame ocupa `2 × 2` celdas de `32 × 32 px`.
- Cuadrícula de animación: `4 columnas × 4 filas`.
- Total: `16 frames`.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Escalado: vecino más cercano.
- Sombra: ninguna.

## Identidad visual

- Perro salchicha orientado hacia la izquierda.
- Cuerpo largo, patas cortas, hocico alargado y oreja grande caída.
- Cola delgada curvada hacia arriba.
- Expresión amistosa con boca abierta y lengua magenta.
- Ojo luminoso cian/blanco.
- Contorno cian eléctrico e interior azul profundo.
- Placas segmentadas, circuitos y bandas de escaneo.
- Acentos violetas y magenta en oreja, lengua, articulaciones, circuitos y anillo.
- La transparencia holográfica se representa mediante huecos y píxeles ausentes, no mediante alfa parcial.

## Materialización

### Fila 1 — frames 1 a 4

1. anillo compacto y primeras columnas de datos;
2. patas y apoyos inferiores;
3. patas, vientre y mitad inferior del torso;
4. torso largo, espalda incompleta y fragmentos de cola.

### Fila 2 — frames 5 a 8

5. construcción del cuello, hocico y frente;
6. aparición de oreja, ojo y contorno de la cabeza;
7. silueta casi completa con interferencia horizontal controlada;
8. perro completamente estabilizado.

La secuencia progresa de abajo hacia arriba y debe reproducirse una sola vez.

## Reposo

### Fila 3 — frames 1 a 4

1. intensidad media estable;
2. aumento discreto de brillo;
3. pequeño movimiento ascendente de la cola;
4. retorno de la cola y ligera inclinación de la oreja.

### Fila 4 — frames 5 a 8

5. intensidad baja con menos líneas internas;
6. interferencia horizontal breve;
7. recuperación luminosa del ojo y los nodos;
8. retorno a intensidad media.

Los ocho frames forman un ciclo continuo.

## Ritmo visual recomendado

- Materialización: pasos rápidos y progresivos, sin retroceso.
- La cabeza debe aparecer después del cuerpo para reforzar la construcción vertical.
- El último frame de materialización puede sostenerse brevemente antes de iniciar el reposo.
- Reposo: ciclo lento; la interferencia debe ser el frame más corto.
- Oreja y cola se mueven pocos píxeles para no deformar la identidad.

## Validación

- Dimensiones verificadas: `256 × 256 px`.
- Dieciséis frames de `64 × 64 px`.
- Alfa binario verificado.
- Sin residuos del fondo verde.
- Margen transparente seguro en los dieciséis frames.
- Misma dirección, línea base, anatomía y escala en los frames completos.
- Sin texto, etiquetas, cuadrícula dibujada, personajes adicionales, computadora, escenario o sombra.
- Ninguna oreja, pata, cola, anillo o fragmento queda cortado.

## Prompt de generación

Se solicitó un atlas `4 × 4` basado en el diseño holográfico proporcionado por el usuario. Las dos primeras filas representan ocho etapas de materialización ascendente y las dos últimas ocho estados de reposo. La fuente se generó sobre fondo uniforme `#00FF00`, se convirtió a alfa y se normalizó a `256 × 256 px` mediante vecino más cercano.

## Siguiente asset recomendado

Animación narrativa del Senior Engineer sentado:

1. despertar en la silla;
2. recuperar la postura;
3. observar la computadora;
4. extender la mano;
5. pulsar una tecla;
6. volver a una espera sentada mientras carga el monitor.
