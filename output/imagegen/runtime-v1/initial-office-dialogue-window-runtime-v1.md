# Ventana de diálogo del Escenario Inicial — runtime v1

Archivos:

- `initial-office-dialogue-window-runtime-v1.png`
- `initial-office-dialogue-message-runtime-v1.png`

## Propósito

Ventana de pensamiento que aparece mientras el Senior Engineer permanece sentado en C4, inmediatamente después de despertar y antes de levantarse para caminar hacia C3.

Mensaje exacto:

> ¿Qué ha pasado? ¿Dónde estoy?

No incluye retrato, nombre de hablante ni texto adicional.

## Atlas animado

- Lienzo: `448 × 448 px`.
- Frame: `448 × 112 px`.
- Distribución: `1 columna × 4 filas`.
- Total: `4 frames`.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Bordes: duros, sin suavizado.

### Secuencia

1. línea horizontal de aparición;
2. ventana parcialmente desplegada;
3. ventana completamente abierta y vacía;
4. mensaje completo con indicador de continuación.

Los frames 1–3 forman una apertura breve. El frame 4 se mantiene hasta que el jugador confirme. Para cerrar, pueden reproducirse los estados visuales en orden inverso.

## Frame final independiente

`initial-office-dialogue-message-runtime-v1.png` contiene solamente el cuarto estado, en un lienzo de `448 × 112 px`. Sirve para colocar directamente el diálogo completo cuando no sea necesario reproducir la apertura.

## Dirección visual

- Marco tecnológico discreto, coherente con la oficina y su maquinaria.
- Interior azul marino muy oscuro.
- Contorno negro, cian y azul hielo.
- Texto blanco frío de píxel duro.
- Indicador triangular cian en la esquina inferior derecha.
- Sin sombra exterior, ornamentos excesivos ni elementos narrativos ajenos.

## Validación

- Dimensiones verificadas: atlas `448 × 448 px`; frame final `448 × 112 px`.
- Cuatro frames de igual tamaño y orden vertical.
- Transparencia real con esquinas totalmente transparentes.
- Alfa binario verificado.
- Texto y signos de interrogación reproducidos exactamente.
- Ventana y texto contenidos dentro de márgenes seguros.
- Sin retrato, etiqueta de nombre, fondo de escenario, marca de agua o texto residual.

## Generación

- El marco y sus estados se diseñaron mediante generación de imagen.
- La fuente cromática se convirtió a transparencia alfa.
- El texto se incorporó de forma determinista para conservar exactamente signos y acentos.
- El arte fuente permanece separado y el runtime se entrega como archivo nuevo.

## Siguiente asset recomendado

Actualizar la composición narrativa del Escenario Inicial para mostrar correctamente:

1. despertar y diálogo en C4;
2. silla de C3 ligeramente retirada y botón parpadeante;
3. recorrido del Senior desde C4 hasta C3;
4. barra de carga en la computadora de C3;
5. materialización del perro holográfico frente al Senior en C3.
