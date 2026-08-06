# Bug Slayer — fundido y pantalla final runtime v1

## Archivos

- `legacy-grove-demo-fade-state-1-dim-runtime-v1.png`
- `legacy-grove-demo-fade-state-2-near-black-runtime-v1.png`
- `bug-slayer-demo-end-card-runtime-v1.png`
- `bug-slayer-demo-ending-comparison-runtime-v1.png`

La secuencia comienza desde `legacy-grove-final-extraction-state-3-residue-runtime-v1.png`.

## Dimensiones

- Fundidos y tarjeta final: 960 × 540 px.
- Comparativa: 1920 × 270 px.
- Formato: PNG opaco.
- Relación de aspecto: 16:9.

## Orden visual

1. Plano con el residuo de extracción todavía visible.
2. Arena atenuada al 52 % de luminosidad.
3. Arena casi negra al 14 % de luminosidad.
4. Corte a la tarjeta final sobre negro.

## Pantalla final

- Wordmark aprobado `BUG SLAYER` centrado.
- Texto exacto: `FIN DE LA DEMO`.
- Fondo negro puro.
- Paleta roja, azul hielo, cian y blanco tomada del logotipo original.
- El botón `ENTER` y los elementos propios de la pantalla de título fueron excluidos.

## Recomendación de ritmo

- Mantener el residuo de extracción brevemente antes de iniciar el fundido.
- Los dos pasos de oscuridad deben sentirse rápidos y continuos.
- Insertar un instante completamente negro antes de la tarjeta final si se requiere separar la escena del cierre.
- La pantalla final puede mantenerse hasta que el jugador decida salir o volver al menú.

## Validación

- El fundido conserva exactamente el último plano del demo; solo cambia la luminosidad.
- Mycelial Monolith y Boolean Beetle siguen siendo apenas reconocibles en el estado casi negro.
- El wordmark no contiene el botón `ENTER`.
- `FIN DE LA DEMO` es legible y utiliza tratamiento monoespaciado con bordes duros.
- Sin créditos, mensajes promocionales, adelantos, personajes adicionales o marcas de agua.

## Montaje

Composición determinista a partir del plano final y `bugslayer_logo.png`. El logotipo original permanece intacto; únicamente se recortó el wordmark para esta tarjeta. Los escalados utilizan vecino más cercano.

## Estado de la prioridad

El recorrido de escenarios, tilesets y composiciones narrativas de la demo queda cerrado, incluyendo su último plano y pantalla final.

## Siguiente prioridad recomendada

Avanzar a la interfaz del juego definida en el GDD: HUD de combate, overlay de reto, tutoriales, transiciones, pausa, victoria y derrota.
