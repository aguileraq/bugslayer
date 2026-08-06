# Boolean Beetle — Boolean Burst runtime v1

## Entregable

- `boolean-beetle-boolean-burst-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula lógica: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: apertura, descarga radial y recuperación.

## Animación

### Apertura

- Las dos placas principales se levantan hacia los lados.
- El reactor circular comienza a quedar expuesto.
- El cuerpo y las seis patas permanecen apoyados.

### Descarga radial

- El caparazón está completamente abierto.
- El reactor muestra sus anillos alternados cian y naranja.
- El efecto queda concentrado en el emisor.
- Los proyectiles que viajan por la arena permanecen como assets independientes.

### Recuperación

- Las placas vuelven a cerrarse.
- El reactor queda totalmente oculto.
- El tercer frame coincide píxel por píxel con el neutral de idle.

## Invariantes

- Exactamente seis patas mecánicas.
- Exactamente dos placas principales.
- Dos cuernos frontales con forma de bifurcación.
- Canales lógicos cian y naranja conservados.
- Misma identidad, escala corporal y volumen que idle.
- Reactor visible únicamente durante apertura y descarga.
- Sin alas, vuelo, sombra, daño o derrota.

## Estándar runtime

- Línea base corporal: Y=117.
- Perfil derecho: espejo horizontal exacto del izquierdo.
- Transparencia RGBA binaria: alfa 0 o 255.
- Residuos magenta: 0.
- Margen mínimo: 2 px en los frames de máxima apertura.
- Escalado final mediante vecino más cercano.
- Recuperación exacta respecto al idle aprobado en las cuatro direcciones.

## Proceso

Se generó una fuente sobre fondo cromático uniforme usando como referencias la
hoja conceptual, el idle y el desplazamiento pesado aprobados. Se corrigió la
secuencia de la vista trasera antes de retirar el fondo. Los frames de apertura
y descarga se normalizaron por celda; el perfil derecho se reconstruyó por
espejo y la recuperación se sustituyó por el neutral original de idle. Los
masters existentes permanecieron intactos.

## Prompt final de generación

Use case: stylized-concept. Create one clean portrait 3-column by 4-row source
sprite sheet for Boolean Beetle's Boolean Burst attack. Preserve the exact
approved identity, shell-open circular reactor design, runtime scale, camera,
row order, centering and baseline.

Rows are down/front, left, right as a true opposite, and up/back. Columns are:
the two shell plates lifting symmetrically while the reactor activates; shell
fully open with the circular reactor producing a compact cyan-orange radial
discharge origin; recovery to the exact closed neutral idle pose with the
reactor hidden and no residual effect.

Preserve exactly six attached mechanical legs, exactly two shell plates,
exactly two branching horns, split cyan-orange visor, charcoal gunmetal and
petroleum-blue armor, controlled red lights, and consistent cyan/orange logic
channels. Keep all effects attached close to the reactor. Full traveling
projectiles are separate assets.

Use classic polished 16-bit Japanese RPG top-down three-quarter pixel art,
crisp dark outlines and flat limited shading. Uniform solid `#ff00ff`
chroma-key background. No grid, text, watermark, shadow, long projectile paths,
lasers, beams, explosion, smoke, dust, wings, flight, extra creature, damage or
defeat.

## Siguiente asset recomendado

`XOR Crossfire`: ataque diagonal rotatorio de Boolean Beetle, manteniendo la
misma apertura del reactor y separando nuevamente los proyectiles de vuelo.
