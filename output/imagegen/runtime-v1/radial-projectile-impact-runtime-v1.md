# Proyectil radial — Impacto y disipación runtime v1

## Entregable

- `radial-projectile-impact-runtime-v1.png`

## Estructura

- Hoja: 128 × 32 px.
- Cuadrícula: 4 columnas × 1 fila.
- Celda: 32 × 32 px.
- Frame 1: contacto.
- Frame 2: expansión máxima.
- Frame 3: anillo de disipación.
- Frame 4: partículas finales.

No requiere direcciones porque el efecto es circular y concéntrico.

## Diseño visual

- Núcleo blanco y rosa.
- Expansión carmesí.
- Anillo violeta en la disipación.
- Partículas finales simétricas.
- Sin sombra, orientación preferente, suavizado ni degradados.

## Validaciones

- Dimensiones y celdas: correctas.
- Fondo transparente y alfa binario: correctos.
- Centro de los cuatro frames: X = 15.5, Y = 15.5.
- Margen mínimo: 3 px durante expansión y anillo.
- Ninguna partícula toca o cruza una celda.
- Secuencia visual contacto → expansión → anillo → disipación: correcta.

## Estado

Creado directamente a resolución runtime. No modifica ningún asset existente.

## Siguiente prioridad

Diseño y producción del segundo enemigo regular: Variable.
