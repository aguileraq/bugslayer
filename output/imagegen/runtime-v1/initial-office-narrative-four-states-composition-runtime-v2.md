# Escenario Inicial — composición narrativa corregida v2

## Archivos

- `initial-office-state-1-dialogue-runtime-v2.png`
- `initial-office-state-2-movement-runtime-v2.png`
- `initial-office-state-3-loading-runtime-v2.png`
- `initial-office-state-4-hologram-runtime-v2.png`
- `initial-office-narrative-four-states-composition-runtime-v2.png`

Los masters y la composición v1 permanecen intactos.

## Dimensiones

- Cada estado: `480 × 384 px`.
- Referencia lógica: `15 × 12` tiles de `32 × 32 px`.
- Comparativa horizontal: `1920 × 384 px`.
- Los cuatro estados son composiciones opacas completas del cuarto.
- Normalización final mediante vecino más cercano.

## Cubículos canónicos

- `C4`, inferior derecho: despertar del Senior Engineer.
- `C3`, inferior izquierdo: terminal narrativo activo.
- La silla de C3 está retirada para marcar el punto de interacción.
- C1, C2 y C4 permanecen inactivos después del despertar.

## Estado 1 — despertar y diálogo en C4

- El Senior continúa sentado en C4, despierto y confundido.
- Todas las pantallas están apagadas.
- C3 conserva el pequeño indicador ámbar que guiará al jugador.
- Se integra la ventana de diálogo aprobada con el texto exacto:

> ¿Qué ha pasado? ¿Dónde estoy?

## Estado 2 — desplazamiento hacia C3

- La ventana de diálogo ya se cerró.
- C4 queda vacío y apagado.
- El Senior camina hacia la izquierda por el pasillo inferior.
- C3 mantiene su silla retirada y el indicador ámbar.
- No se utiliza flecha, ruta dibujada ni otra interfaz de navegación.

## Estado 3 — carga en C3

- El Senior está de pie frente al teclado de C3.
- El monitor de C3 muestra una barra cian sin texto, aproximadamente al `60 %`.
- El indicador de C3 cambia a cian.
- C4 y los dos cubículos superiores permanecen con monitores apagados.
- Todavía no existe holograma.

## Estado 4 — holograma estabilizado en C3

- La barra de carga desaparece.
- El perro salchicha holográfico aparece únicamente dentro de C3.
- Conserva cuerpo largo, patas cortas, orejas caídas, cola levantada, circuitos cian, acentos violetas y anillo de proyección.
- El Senior mantiene su posición frente al terminal.
- Los efectos luminosos quedan contenidos dentro del cubículo.

## Geometría compartida

- Cámara top-down 3/4 fija.
- Puerta cerrada en el centro del muro superior.
- Rack contra el muro izquierdo.
- Planta alta en la esquina superior derecha.
- Cuatro cubículos en bloque `2 × 2` a la derecha.
- Aire acondicionado en la cara interior del muro inferior, visto desde arriba y expulsando aire hacia el cuarto.
- Piso gris rústico y muros azul grisáceo.

## Validación

- Cuatro estados individuales verificados en `480 × 384 px`.
- Comparativa verificada en `1920 × 384 px`.
- C4 se utiliza solamente para despertar y diálogo.
- Movimiento, carga y holograma progresan hacia C3.
- La secuencia se entiende sin etiquetas de cubículo ni flechas.
- Texto del diálogo reproducido exactamente mediante composición controlada.
- Ningún muro, personaje, prop o efecto queda cortado.
- Sin enemigos, corrupción, armas, marcas de agua ni texto accidental.

## Generación

- Modo: herramienta integrada de generación de imágenes.
- Caso de uso: `precise-object-edit`.
- Referencias: composición v1, Senior Engineer runtime, animación de despertar, ventana de diálogo y perro holográfico aprobado.
- Cada estado se generó como archivo nuevo; después se normalizó y se reunió en una comparativa horizontal.

## Siguiente tarea recomendada

El Escenario Inicial queda narrativamente corregido. El siguiente paso de la prioridad 4 es definir el **Escenario del Encuentro 1 / tutorial contra Parse Mantis** antes de crear su tileset, atlas de props y efectos ambientales.

Conviene fijar primero: función narrativa, dimensiones, accesos, obstáculos, áreas de combate, tipo de corrupción, iluminación y elementos exclusivos.
