# Jardín de Compilación — validación de escala runtime v1

Archivo:

- `compilation-garden-scale-validation-runtime-v1.png`

## Propósito

Validar la proporción y ubicación del Senior Engineer, V4LK y un Parse Mantis común dentro del nuevo escenario lineal antes de producir los estados narrativos completos.

Esta composición no representa un ataque ni un frame definitivo del encuentro.

## Dimensiones

- Lienzo: `960 × 540 px`.
- Relación: `16:9`.
- Composición opaca completa.
- Cámara y escenario idénticos al área lineal aprobada.

## Ubicación

- Senior Engineer: parte inferior del claro, sobre el eje del corredor y mirando hacia arriba.
- Parse Mantis: parte superior del claro, delante del nido y mirando hacia abajo.
- V4LK: borde izquierdo del claro, fuera de la línea directa del combate.
- La salida permanece cerrada.
- El centro conserva espacio libre para movimiento y esquiva.

## Medidas visibles utilizadas

### Senior Engineer

- Ancho visible: `23 px`.
- Alto visible: `44 px`.
- Funciona como unidad humana de referencia.

### Parse Mantis común

- Ancho visible incluyendo patas y pinzas: `61 px`.
- Alto visible incluyendo antenas: `54 px`.
- Relación de altura frente al Senior: aproximadamente `1.23 ×`.
- El cuerpo central, sin antenas, mantiene una altura cercana a la del Senior.
- La anchura mayor proviene de la postura insectoide y no de un aumento de masa corporal.

### V4LK

- Ancho visible: `35 px`.
- Alto visible: `28 px`.
- Se mantiene claramente subordinado a los combatientes.

## Lectura visual

- Parse Mantis ya no domina el claro.
- Existen rutas de esquiva a izquierda y derecha del enemigo.
- El nido permanece como elemento secundario del borde.
- No hay composición radial, barrera circular ni escala de jefe.
- La diferencia entre enemigo común y jefe se basa principalmente en altura, masa y ocupación del escenario.

## Construcción

- El escenario se conservó sin regenerar.
- Se utilizaron frames neutrales de los sprites runtime aprobados.
- Senior: vista de espalda/arriba.
- Parse Mantis: vista frontal/abajo.
- V4LK: frame estable de reposo.
- Escalado y colocación mediante vecino más cercano.
- Sin sombras nuevas, suavizado o deformación de identidad.

## Validación

- Dimensiones verificadas: `960 × 540 px`.
- Escenario idéntico al área lineal base.
- Únicamente aparecen Senior, V4LK y un Parse Mantis.
- Los tres elementos permanecen dentro del área jugable.
- Sin proyectiles, ataques, HUD, preguntas, diálogo, texto, etiquetas o marcas de agua.

## Prompt y método

La herramienta integrada de generación de imágenes se utilizó en modo `precise-object-edit` para explorar la ubicación y jerarquía visual. La versión runtime final se ensambló con los sprites aprobados sobre el escenario intacto para fijar medidas exactas y evitar variaciones de identidad o escala.

## Siguiente asset recomendado

Con la escala aprobada, producir la composición del Jardín de Compilación en tres estados:

1. llegada del Senior al Nodo de Inicialización y aparición de V4LK;
2. encuentro activo con Parse Mantis pequeño y barreras cortas cerradas;
3. Parse Mantis derrotado y compuerta de salida estabilizada.

Los tres estados deberán conservar la misma cámara, geometría y escala definida en esta hoja.
