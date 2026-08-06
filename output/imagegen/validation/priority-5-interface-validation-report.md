# Validación conjunta — Prioridad 5: interfaz

## Resultado

La prioridad de interfaz queda completa y validada visualmente para español e inglés.

## Entregables cubiertos

1. Selección de idioma.
2. Boot y menú principal.
3. Introducción narrativa.
4. HUD de combate.
5. Desafío con captura de respuesta.
6. Desafío de opción múltiple.
7. Tutorial.
8. Transición entre encuentros.
9. Pausa.
10. Victoria.
11. Derrota.
12. Fundido y pantalla final de la demo.

## Reglas verificadas

- Viewport fijo de 960 × 540 px.
- Textos localizables separados de los assets runtime.
- Español e inglés comparten geometría y jerarquía.
- Código y tokens TypeScript no se traducen.
- Se contemplan caracteres españoles: `¿`, `¡`, vocales acentuadas y `ñ`.
- HUD superior estable durante `Playing` y `Challenge`.
- Paneles typed y multiple-choice claramente diferenciados.
- Captura limitada visualmente a 12 caracteres.
- Opción múltiple admite cuatro espacios y puede reducirse a tres.
- ESC pausa únicamente desde `Playing`.
- ESC no produce transición desde `Challenge`.
- Pausa automática por pérdida de visibilidad se mantiene como protección separada.
- Victoria y derrota presentan las estadísticas exigidas por el GDD.

## Legibilidad

- Cian identifica jugador, sistema y estados seguros.
- Rojo identifica enemigos, peligro y derrota.
- Ámbar identifica tiempo próximo a agotarse.
- Estados importantes también cambian borde, icono o silueta; no dependen solo del color.
- El centro del combate permanece libre de marcos permanentes.

## Archivos de validación principales

- `bug-slayer-language-select-four-states-comparison-runtime-v1.png`
- `bug-slayer-combat-hud-bilingual-comparison-runtime-v1.png`
- `bug-slayer-challenge-variants-bilingual-comparison-runtime-v1.png`
- `bug-slayer-tutorial-transition-bilingual-comparison-runtime-v1.png`
- `bug-slayer-pause-bilingual-comparison-runtime-v1.png`
- `bug-slayer-results-bilingual-comparison-runtime-v1.png`
- `bug-slayer-boot-menu-intro-bilingual-comparison-runtime-v1.png`
- `bug-slayer-ui-runtime-validation-overview-v1.png`

## Producción

Los componentes runtime se construyeron de forma determinista a partir de la hoja conceptual aprobada. ImageGen se utilizó para la exploración conceptual y el fondo de selección de idioma; la geometría, textos de preview y estados finales se normalizaron localmente. No se utilizó la ruta CLI.

## Siguiente prioridad recomendada

La interfaz queda cerrada. La siguiente prioridad debe definirse a partir de la lista maestra de ocho prioridades; si se mantiene el orden habitual, corresponde revisar tipografía integrada, accesibilidad y feedback visual solo como fase de pulido, o avanzar al siguiente grupo de assets aún no iniciado.
