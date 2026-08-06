# Boolean Beetle — Daño runtime v1

## Entregable

- `boolean-beetle-damage-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula lógica: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: impacto, retroceso y recuperación.

## Animación

### Impacto

- Un destello compacto blanco-amarillo golpea el borde delantero del blindaje.
- El cuerpo se comprime ligeramente.
- Las patas cercanas al golpe flexionan sin desprenderse.
- La escala y el volumen del caparazón permanecen constantes.

### Retroceso

- El cuerpo se desplaza internamente un máximo de 2 px en sentido contrario.
- Las patas delanteras se repliegan y las traseras sostienen el peso.
- Los canales cian y naranja reducen su intensidad sin cambiar de color.
- No permanecen fragmentos ni un segundo destello.

### Recuperación

- El cuerpo vuelve a su posición y energía neutrales.
- El tercer frame coincide píxel por píxel con el neutral de idle.

## Invariantes

- Exactamente seis patas mecánicas.
- Exactamente dos placas principales siempre cerradas.
- Exactamente dos cuernos frontales.
- Reactor oculto durante toda la reacción.
- Misma identidad, escala y volumen que los assets anteriores.
- No pierde piezas ni adopta una pose de derrota.
- Sin sombra, alas o vuelo.

## Estándar runtime

- Línea base corporal: Y=117.
- Retroceso máximo: 2 px.
- El retroceso trasero puede alcanzar Y=119 en la vista de espalda.
- Perfil derecho: espejo horizontal exacto del izquierdo.
- Transparencia RGBA binaria: alfa 0 o 255.
- Residuos magenta: 0.
- Escalado final: vecino más cercano.
- Recuperación exacta respecto al idle aprobado.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando la hoja
conceptual, el idle y Branch Charge aprobados. El fondo cromático se eliminó
localmente. El anclaje se calculó usando únicamente el volumen oscuro del cuerpo
para impedir que el destello moviera la silueta. Se aplicó un retroceso
direccional máximo de dos píxeles, se reconstruyó la derecha por espejo y se
reemplazó la recuperación por el neutral original. Los masters no se
modificaron.

## Prompt final de generación

Use case: stylized-concept. Create a strict portrait 3-column by 4-row source
sprite sheet for Boolean Beetle's damage reaction. Preserve the approved
closed-shell identity, heavy grounded six-leg anatomy, runtime scale, camera,
centering and baseline.

Rows are down/front, left, right as an exact opposite, and up/back. Columns are:
one compact white-yellow impact star with an orange-red edge striking the
forward shell edge while nearby legs buckle; a short backward recoil with the
front legs drawn inward, rear legs braced and cyan/orange channels uniformly
dimmed; recovery to the exact neutral idle pose with channels restored and no
residual effect.

Preserve exactly six attached mechanical legs, exactly two closed shell plates,
exactly two branching horns, split cyan-orange visor, gunmetal and
petroleum-blue armor, controlled red lights, and consistent cyan/orange logic
channels. The shell never opens and the reactor never appears.

Use polished 16-bit Japanese RPG top-down three-quarter pixel art, crisp dark
outlines and flat limited shading. Uniform solid `#ff00ff` chroma-key
background. No grid, text, watermark, attack, projectile, long trail, dust,
smoke, explosion, large flame, electricity arc, detached shard, missing leg,
defeat, upside-down pose, shadow, wings, flight or extra creature.

## Siguiente asset recomendado

`Boolean Beetle — derrota`: transición de tambaleo pesado a estado apagado,
manteniendo el cuerpo completo y una pose final claramente legible.
