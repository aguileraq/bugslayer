# Boolean Beetle — Branch Charge runtime v1

## Entregable

- `boolean-beetle-branch-charge-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula lógica: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: preparación, embestida y recuperación.

## Animación

### Preparación

- El caparazón permanece completamente cerrado.
- El reactor sigue oculto.
- El cuerpo baja y las patas se comprimen.
- Los dos cuernos incrementan su energía cian y naranja.
- Dos indicadores angulares cortos anticipan la bifurcación.

### Embestida

- El cuerpo avanza internamente dos píxeles en la dirección de la fila.
- Las patas delanteras alcanzan y las traseras empujan.
- Los cuernos alcanzan intensidad máxima.
- Dos cuñas cortas divergen aproximadamente ±25 grados.
- No hay estelas largas, polvo ni proyectiles separados.

### Recuperación

- El cuerpo vuelve a la posición neutral.
- Los cuernos regresan a intensidad normal.
- El tercer frame coincide píxel por píxel con el neutral de idle.

## Invariantes

- Exactamente seis patas mecánicas.
- Exactamente dos placas principales siempre cerradas.
- Exactamente dos cuernos frontales de bifurcación.
- Reactor oculto durante toda la animación.
- Misma identidad, escala y volumen que idle y movimiento.
- Ataque completamente terrestre.
- Sin sombra, alas, vuelo, daño o derrota.

## Estándar runtime

- Línea base corporal neutral: Y=117.
- Los indicadores energéticos frontales pueden alcanzar Y=119.
- Desplazamiento máximo de embestida: 2 px.
- Perfil derecho: espejo horizontal exacto del izquierdo.
- Transparencia RGBA binaria: alfa 0 o 255.
- Residuos magenta: 0.
- Margen mínimo: 1 px en la embestida lateral.
- Escalado final: vecino más cercano.
- Recuperación exacta respecto al idle aprobado.

## Proceso

La fuente se generó mediante la herramienta integrada de imágenes usando la hoja
conceptual, el desplazamiento pesado y el idle aprobados. Después de eliminar el
fondo cromático, el anclaje vertical se calculó a partir del cuerpo oscuro para
evitar que las cuñas de energía alteraran la línea de apoyo. Se añadió un avance
direccional máximo de dos píxeles, se reconstruyó el perfil derecho por espejo y
se sustituyó la recuperación por el neutral original. Los masters existentes
permanecieron intactos.

## Prompt final de generación

Use case: stylized-concept. Create a strict portrait 3-column by 4-row source
sprite sheet for Boolean Beetle's Branch Charge attack. Preserve the approved
closed-shell identity, heavy grounded six-leg anatomy, runtime scale, camera,
centering and baseline.

Rows are down/front, left, right as an exact opposite, and up/back. Columns are:
heavy brace with front legs planted, rear legs compressed and both horns
energized cyan and orange with tiny angular branch indicators; a short grounded
forward lunge with the legs extending and two compact energy wedges diverging
from the horn tips at roughly plus and minus 25 degrees; recovery to the exact
closed neutral idle pose with no residual effects.

Preserve exactly six attached mechanical legs, exactly two closed shell plates,
exactly two branching horns, split cyan-orange visor, gunmetal and
petroleum-blue armor, controlled red lights, and consistent cyan/orange logic
channels. The shell never opens and the reactor never appears.

Use polished 16-bit Japanese RPG top-down three-quarter pixel art, crisp dark
outlines and flat limited shading. Uniform solid `#ff00ff` chroma-key
background. No grid, text, watermark, open shell, reactor, projectile attack,
long trail, dust, smoke, explosion, laser, beam, shadow, wings, flight, extra
creature, damage or defeat.

## Siguiente asset recomendado

`Boolean Beetle — recibir daño`: reacción de impacto en cuatro direcciones,
conservando el peso del caparazón y evitando deformaciones o apertura accidental.
