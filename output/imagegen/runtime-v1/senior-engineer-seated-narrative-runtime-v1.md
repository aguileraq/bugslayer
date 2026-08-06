# Senior Engineer sentado — secuencia narrativa runtime v1

Archivo:

- `senior-engineer-seated-narrative-runtime-v1.png`

## Estructura

- Lienzo: `384 × 384 px`.
- Frame: `96 × 96 px`.
- Cuadrícula: `4 columnas × 4 filas`.
- Total: `16 frames`.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Escalado: vecino más cercano.
- Sombra: ninguna.

## Composición fija

- Senior Engineer sentado de perfil, orientado hacia la derecha.
- Misma silla ergonómica azul oscuro/grafito en todos los frames.
- Borde reducido de escritorio y teclado negro en posición fija.
- Monitor, torre y cubículo se mantienen fuera del spritesheet para evitar duplicar los props del escenario.
- La silla no gira ni se desplaza.
- Los pies conservan una línea base común.

## Identidad del personaje

- Gafas rectangulares negras.
- Cabello corto castaño oscuro con línea ligeramente retraída.
- Barba y bigote completos con tonos grises discretos.
- Piel clara a media.
- Camiseta carbón, hoodie gris oscuro abierto y gafete visible.
- Jeans azul oscuro y sneakers limpios.
- Expresión calmada, desorientada al despertar y enfocada al interactuar.

## Secuencia

### Fila 1 — despertar

1. dormido e inclinado hacia delante;
2. pequeño movimiento de hombros;
3. cabeza levantada a medio recorrido;
4. ojos abiertos, todavía ligeramente encorvado.

### Fila 2 — recuperar la postura

5. espalda comenzando a enderezarse;
6. hombros y pies estabilizados;
7. ajuste de las gafas con la mano derecha;
8. postura erguida y mirada enfocada hacia la computadora.

### Fila 3 — pulsar una tecla

9. inclinación leve hacia el escritorio;
10. extensión del antebrazo derecho;
11. contacto del índice con una sola tecla y pulso cian mínimo;
12. dedo levantándose y brazo comenzando a regresar.

### Fila 4 — espera durante la carga

13. regreso a postura erguida;
14. mirada fija hacia el monitor y respiración discreta;
15. reflejo cian controlado sobre las gafas;
16. retorno a la postura del frame 13.

## Reproducción recomendada

- Frames 1 a 8: secuencia de despertar de una sola ejecución.
- Frames 9 a 12: interacción de una sola ejecución cuando se activa la computadora.
- Frames 13 a 16: ciclo continuo durante la carga del monitor.
- El frame 11 debe ser breve para que la pulsación se sienta precisa.
- El ciclo de espera debe ser lento y casi inmóvil.

## Validación

- Dimensiones verificadas: `384 × 384 px`.
- Dieciséis frames de `96 × 96 px`.
- Alfa binario verificado.
- Sin residuos del fondo verde.
- Margen transparente seguro en todos los frames.
- Cuatro esquinas transparentes.
- Perfil derecho consistente.
- Misma silla, escritorio, teclado, identidad y escala en toda la secuencia.
- Sin texto, etiquetas, cuadrícula dibujada, escenario, holograma, animales o sombras.
- Ninguna mano, rueda, pie, cabeza o teclado queda cortado.

## Prompt de generación

Se solicitó una hoja narrativa `4 × 4` basada en el Senior Engineer runtime, la escena conceptual y el atlas de props. La animación cubre despertar, recuperación de postura, atención a la computadora, pulsación de una tecla y espera durante la carga. La fuente se generó sobre fondo uniforme `#00FF00`, se convirtió a alfa y se normalizó a `384 × 384 px` mediante vecino más cercano.

## Siguiente asset recomendado

Composición visual final del Escenario Inicial en tres estados:

1. cuarto inactivo con el Senior dormido;
2. computadora encendida y barra de carga;
3. holograma estabilizado frente al Senior.

Esta validación permitirá revisar escala, capas, posiciones y lectura conjunta antes de considerar terminado el escenario inicial.
