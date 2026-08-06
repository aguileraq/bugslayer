# Boolean Beetle — XOR Crossfire runtime v1

## Entregable

- `boolean-beetle-xor-crossfire-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula lógica: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: armado diagonal, descarga cruzada y recuperación.

## Animación

### Armado diagonal

- El caparazón está abierto y el reactor visible.
- Cuatro nodos cercanos al emisor marcan las dos diagonales.
- Una diagonal utiliza cian y la opuesta naranja.
- No existen proyectiles de vuelo separados del cuerpo.

### Descarga cruzada

- Cuatro destellos cortos forman una X.
- El cruce realiza un pequeño giro respecto al armado.
- Los colores cian y naranja intercambian diagonales.
- Los destellos permanecen contenidos en la celda.

### Recuperación

- El caparazón vuelve a cerrarse.
- El reactor queda oculto.
- El tercer frame coincide píxel por píxel con el neutral de idle.

## Invariantes

- Exactamente seis patas mecánicas.
- Exactamente dos placas principales.
- Dos cuernos frontales de bifurcación.
- Reactor circular y canales cian-naranja consistentes.
- Misma escala corporal y volumen que idle y Boolean Burst.
- El patrón siempre es diagonal; nunca cardinal.
- Sin proyectiles largos, sombra, alas, vuelo, daño o derrota.

## Estándar runtime

- Línea base corporal: Y=117.
- Perfil derecho: espejo horizontal exacto del izquierdo.
- Transparencia RGBA binaria: alfa 0 o 255.
- Residuos magenta: 0.
- Margen mínimo: 2 px en las vistas laterales abiertas.
- Escalado final: vecino más cercano.
- Recuperación exacta respecto al idle aprobado en las cuatro direcciones.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando la hoja
conceptual, Boolean Burst y el idle aprobados. El fondo cromático se retiró
localmente. Se normalizaron el armado y la descarga por celda, se reconstruyó
el perfil derecho mediante espejo y se reemplazó la recuperación con el neutral
original de idle. Los masters existentes no fueron modificados.

## Prompt final de generación

Use case: stylized-concept. Create a strict portrait 3-column by 4-row source
sprite sheet for Boolean Beetle's XOR Crossfire attack. Preserve the approved
identity, shell-open circular reactor, runtime scale, camera, centering and
baseline.

Rows are down/front, left, right as a true opposite, and up/back. Columns are:
shell fully open with four compact emitter points armed around the reactor in
an X, using cyan on one diagonal and orange on the other; four short diagonal
muzzle streaks forming a slightly rotated X while the colors swap diagonals;
recovery to the exact closed neutral idle pose with no residual effects.

Preserve exactly six attached mechanical legs, exactly two shell plates,
exactly two branching horns, split cyan-orange visor, gunmetal and
petroleum-blue armor, controlled red lights, and the cyan/orange logic
channels. Keep the effect close to the reactor. Traveling projectiles remain
separate assets.

Use polished 16-bit Japanese RPG top-down three-quarter pixel art, crisp dark
outlines and flat limited shading. Uniform solid `#ff00ff` chroma-key
background. No grid, text, watermark, cardinal plus-sign fire, long paths,
detached bullets, rings, branches, charge attack, lasers, beams, explosion,
smoke, dust, shadow, wings, flight, extra creature, damage or defeat.

## Siguiente asset recomendado

`False Path`: telegráfico de rutas ramificadas cian y naranja, donde solamente
algunas trayectorias se convierten en disparos reales.
