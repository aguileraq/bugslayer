# Jardín de Compilación — validación de escala runtime v3

Archivo:

- `compilation-garden-scale-validation-runtime-v3.png`

## Escala aprobada propuesta

- Senior Engineer: `23 × 44 px` visibles.
- Parse Mantis: `43 × 38 px` visibles, incluyendo antenas.
- V4LK: `35 × 28 px` visibles.

Parse Mantis es aproximadamente `13.6 %` más bajo que el Senior Engineer. Esta proporción se encuentra dentro del intervalo aprobado de `10–15 %`.

## Diferencia respecto de las versiones anteriores

- v1: Parse Mantis era más alto que el Senior; descartada.
- v2: Parse Mantis era aproximadamente `18 %` más bajo; demasiado pequeño respecto al intervalo solicitado.
- v3: Parse Mantis es aproximadamente `14 %` más bajo; proporción recomendada.

Las versiones anteriores permanecen intactas como referencias históricas.

## Reglas definitivas

- La altura total de Parse Mantis, incluyendo antenas, será `38 px` en composiciones de `960 × 540 px`.
- El Senior conservará `44 px` de altura visible.
- La anchura natural de la mantis se mantiene para conservar patas y pinzas legibles.
- No se aplicará deformación no proporcional.
- Todos los estados narrativos posteriores usarán esta relación de escala.

## Construcción y validación

- Escenario lineal intacto.
- Sprites runtime originales.
- Escalado mediante vecino más cercano.
- Tamaños verificados.
- Sin cambios de posición, identidad, cámara o iluminación.
- Sin proyectiles, HUD, texto, diálogo o marcas de agua.

## Siguiente asset recomendado

Producir los tres estados narrativos del Jardín de Compilación utilizando la escala v3:

1. llegada y aparición de V4LK;
2. encuentro activo con Parse Mantis;
3. derrota de Parse Mantis y apertura de la salida.
