# Proyectil radial — runtime v1

## Entregable

- `radial-projectile-runtime-v1.png`

## Estructura

- Hoja: 96 × 32 px.
- Cuadrícula: 3 columnas × 1 fila.
- Celda: 32 × 32 px.
- Frame 1: energía condensada.
- Frame 2: expansión máxima.
- Frame 3: estabilización.

No requiere filas direccionales. La silueta circular funciona para cualquier
ángulo de desplazamiento dentro de un patrón radial.

## Diseño visual

- Núcleo blanco estable.
- Anillo interior rosa luminoso.
- Cuerpo energético carmesí.
- Cubierta violeta profunda.
- Borde oscuro para mantener legibilidad sobre escenarios claros.
- Pulso concéntrico sin cola ni orientación preferente.
- Sin sombras, degradados, suavizado ni textura ambiental.

La paleta carmesí-violeta lo separa visualmente del proyectil lineal naranja de
Parse Mantis. Esto permite distinguir ambos patrones incluso cuando coinciden en
pantalla.

## Validaciones

- Dimensiones 96 × 32: correctas.
- Celdas 32 × 32: correctas.
- Fondo transparente y alfa binario: correctos.
- Centro visual de los tres frames: X = 15.5, Y = 15.5.
- Diámetros visibles: 14 px, 22 px y 14 px.
- Margen mínimo: 5 px durante la expansión máxima.
- Ningún píxel toca o cruza los límites de una celda.
- Silueta circular sin dirección implícita: correcta.

## Estado del asset

Este proyectil fue creado directamente a resolución runtime. No reemplaza ni
modifica ningún archivo existente.

## Recomendación siguiente

Crear los efectos breves de impacto y disipación de ambos proyectiles antes de
continuar con el siguiente enemigo regular.
