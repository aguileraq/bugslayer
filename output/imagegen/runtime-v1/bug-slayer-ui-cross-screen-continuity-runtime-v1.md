# Bug Slayer — continuidad transversal de interfaz runtime v1

## Recorrido validado

1. Selección de idioma.
2. Diálogo narrativo.
3. Exploración o combate con HUD activo.
4. Desafío con pausa bloqueada.
5. Pausa disponible después de resolver la pregunta o terminar el tiempo.

## Reglas compartidas

- Fuente: Geist Pixel Square.
- Retícula: múltiplos de 8 px.
- Bordes activos y selección: cian.
- Texto informativo: blanco o gris azulado.
- Peligro, bloqueo y enemigo: rojo.
- Temporizador: cian con tramo final ámbar.
- Tamaño mínimo recomendado durante gameplay: 16 px.
- El español y el inglés conservan la misma jerarquía y los mismos márgenes.

## Regla de pausa

- Mientras una pregunta está activa, la pausa no está disponible.
- El bloqueo debe comunicarse mediante un aviso compacto rojo sin ocultar la pregunta.
- Al responder o agotarse el tiempo, ESC vuelve a abrir el menú de pausa.

## Continuidad de estado

- La interfaz no cambia de familia tipográfica entre pantallas.
- HUD y escenario se oscurecen detrás de modales, sin perder su contexto.
- Los botones usan la misma altura, borde y estado de foco en selección de idioma y pausa.
- Los paneles de diálogo y desafío comparten grosor de borde, esquinas y espaciado interno.
