# Bug Slayer — feedback UI animado runtime v1

- Archivo: `bug-slayer-ui-feedback-animations-runtime-v1.png`
- Tamaño: 512 × 640 px.
- Retícula: 4 columnas × 5 filas.
- Celda: 128 × 128 px.
- Frames por animación: 4.
- Fondo: transparente.
- Lectura: izquierda a derecha.

## Animaciones

1. Fila 1: pulso de foco.
2. Fila 2: respuesta o acción confirmada.
3. Fila 3: error o respuesta incorrecta.
4. Fila 4: pausa bloqueada durante un desafío.
5. Fila 5: agotamiento del temporizador.

## Recomendaciones

- Pulso de foco: bucle suave.
- Confirmación y error: reproducir una vez y conservar brevemente el último frame.
- Bloqueo: reproducir una vez cada vez que el jugador intente pausar durante el desafío.
- Temporizador: asociar cada frame al estado restante, no reproducirlo como un bucle continuo.
- Mostrar a 32 × 32 o 64 × 64 px con escalado entero y nearest-neighbor.
