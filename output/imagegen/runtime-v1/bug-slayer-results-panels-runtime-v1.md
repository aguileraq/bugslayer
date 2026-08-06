# Bug Slayer — victoria y derrota runtime v1

## Entrega

- Atlas: `bug-slayer-results-panels-runtime-v1.png`.
- Tamaño: 1280 × 400 px.
- Retícula: 2 columnas × 1 fila.
- Celda: 640 × 400 px.
- Columna 1: victoria, acento cian.
- Columna 2: derrota, acento rojo.

## Estadísticas

Ambas pantallas muestran:

- puntaje;
- aciertos;
- mejor racha;
- tiempo total.

Derrota añade el encuentro donde cayó el jugador.

## Acciones

- Reiniciar.
- Volver al menú.

## Localización

- Todos los títulos, etiquetas y botones se cargan desde JSON.
- Valores numéricos y tiempos se generan dinámicamente.
- El atlas contiene marcos, divisores y botones vacíos, sin texto.

## Validación

- Victoria y derrota se distinguen por color, título y contexto.
- Las estadísticas en ambos idiomas caben en la misma estructura.
- Derrota no permite que el puntaje o la racha sigan cambiando.
- No existe contenido promocional o adelanto posterior al demo.
