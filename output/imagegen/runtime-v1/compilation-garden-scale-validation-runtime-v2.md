# Jardín de Compilación — validación de escala runtime v2

Archivo:

- `compilation-garden-scale-validation-runtime-v2.png`

## Corrección

Parse Mantis debe ser visualmente más pequeño que el Senior Engineer porque es un enemigo común del primer tutorial.

Esta versión sustituye la escala propuesta en `compilation-garden-scale-validation-runtime-v1.png`. La versión v1 permanece intacta como referencia histórica.

## Dimensiones

- Lienzo: `960 × 540 px`.
- Senior Engineer: `23 × 44 px` visibles.
- Parse Mantis: `41 × 36 px` visibles, incluyendo antenas.
- V4LK: `35 × 28 px` visibles.

## Relación de escala

- Altura de Parse Mantis respecto al Senior: aproximadamente `0.82 ×`.
- Parse Mantis es `8 px` más bajo que el Senior contando las antenas.
- El cuerpo central de la mantis es claramente más pequeño.
- La anchura se conserva parcialmente para mantener la lectura de patas, pinzas y silueta insectoide.
- Su huella total queda muy por debajo de la escala utilizada en la arena ovalada.

## Reglas definitivas para el encuentro

- Parse Mantis nunca debe superar al Senior en altura visible.
- Las antenas no justifican aumentar la escala global.
- El enemigo debe ocupar una fracción pequeña del claro.
- Debe conservar espacio de esquiva a ambos lados.
- Nido, salida y props no cambiarán de escala para hacerlo parecer más importante.
- Las futuras animaciones de reposo, ataque, daño y derrota deberán representarse con esta misma escala relativa dentro del escenario.

## Construcción

- Escenario lineal preservado sin regeneración.
- Sprites runtime originales utilizados como fuente.
- Escalado mediante vecino más cercano.
- Sin deformación, suavizado, sombras nuevas ni cambios de identidad.

## Validación

- Senior: altura visible `44 px`.
- Parse Mantis: altura visible `36 px`.
- Diferencia verificada: Parse Mantis es menor.
- V4LK continúa subordinado visualmente.
- Sin proyectiles, HUD, diálogo, texto, etiquetas o marcas de agua.

## Siguiente asset recomendado

Con esta escala corregida, producir los tres estados narrativos del Jardín de Compilación:

1. llegada del Senior y aparición de V4LK;
2. encuentro activo con Parse Mantis pequeño;
3. Parse Mantis derrotado y salida estabilizada.

La escala v2 es la referencia obligatoria para esas composiciones.
