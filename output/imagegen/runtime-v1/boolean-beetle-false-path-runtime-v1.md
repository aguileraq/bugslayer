# Boolean Beetle — False Path runtime v1

## Entregable

- `boolean-beetle-false-path-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula lógica: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: rutas candidatas, revelación y recuperación.

## Animación

### Rutas candidatas

- El caparazón permanece abierto y el reactor visible.
- Cuatro grupos de circuito parten del emisor.
- Dos grupos son cian y dos naranja.
- Cada grupo incluye una bifurcación corta con nodos terminales.
- Todas las rutas tienen intensidad equivalente y todavía son ambiguas.

### Revelación

- Una ruta cian y una naranja se convierten en trayectorias reales.
- Las rutas reales reciben punta clara y una salida corta.
- Las otras dos rutas permanecen visibles en azul petróleo tenue.
- Las rutas falsas son discontinuas y terminan en nodos huecos.
- Las trayectorias largas de arena continúan como assets independientes.

### Recuperación

- El caparazón se cierra y el reactor queda oculto.
- No permanecen ramas, nodos ni partículas.
- El tercer frame coincide píxel por píxel con el neutral de idle.

## Invariantes

- Exactamente seis patas mecánicas.
- Exactamente dos placas principales.
- Dos cuernos frontales de bifurcación.
- Reactor circular y canales cian-naranja consistentes.
- Misma identidad y escala corporal que los assets anteriores.
- Las ramas son circuitos angulares, no raíces, rayos, telas o enredaderas.
- Sin sombra, alas, vuelo, daño o derrota.

## Estándar runtime

- Línea base corporal: Y=117.
- Perfil derecho: espejo horizontal exacto del izquierdo.
- Transparencia RGBA binaria: alfa 0 o 255.
- Residuos magenta: 0.
- Margen mínimo: 2 px en vistas laterales.
- Escalado final: vecino más cercano.
- Recuperación exacta respecto al idle aprobado en las cuatro direcciones.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando la hoja
conceptual, XOR Crossfire y el idle aprobados. Se realizó una corrección dirigida
de los efectos para reducirlos a cuatro grupos y separar las rutas verdaderas de
las falsas. Antes de extraer el fondo, las rutas falsas se normalizaron a azul
petróleo para que no se confundieran con el chroma magenta. Después se aplicaron
escala, línea base, simetría lateral y recuperación deterministas. Los masters
existentes permanecieron intactos.

## Prompt final de generación

Use case: stylized-concept. Create a strict portrait 3-column by 4-row source
sprite sheet for Boolean Beetle's False Path telegraph. Preserve the approved
identity, open-shell circular reactor, runtime scale, camera, centering and
baseline.

Rows are down/front, left, right as a true opposite, and up/back. Columns are:
four compact candidate circuit groups around the reactor, two cyan and two
orange, each with one short Y-shaped fork and tiny terminal nodes; reveal
exactly one real cyan route and one real orange route with bright solid firing
tips while the other two routes become dim broken petroleum-blue circuits with
hollow terminal nodes; recovery to the exact closed neutral idle pose with no
residual effects.

Preserve exactly six attached mechanical legs, exactly two shell plates,
exactly two branching horns, split cyan-orange visor, gunmetal and
petroleum-blue armor, controlled red lights, and consistent cyan/orange logic
channels. Keep every route close to the body. Long arena telegraphs and flying
projectiles remain separate assets.

Use polished 16-bit Japanese RPG top-down three-quarter pixel art, crisp dark
outlines and flat limited shading. Uniform solid `#ff00ff` chroma-key
background. No grid, text, watermark, organic roots, lightning, web, vine,
X-cross, plus sign, projectile ring, long trajectory, detached bullet, laser,
beam, explosion, smoke, dust, shadow, wings, flight, extra creature, damage or
defeat.

## Siguiente asset recomendado

`Branch Charge`: embestida pesada con los cuernos energizados y una bifurcación
corta hacia uno de dos ángulos.
