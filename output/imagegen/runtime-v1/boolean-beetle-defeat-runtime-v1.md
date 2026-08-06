# Boolean Beetle — Derrota runtime v1

## Entregable

- `boolean-beetle-defeat-runtime-v1.png`

## Estructura

- Hoja: 384 × 512 px.
- Cuadrícula lógica: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Columnas: tambaleo, colapso y estado apagado.

## Animación

### Tambaleo pesado

- El caparazón permanece cerrado y completo.
- Las patas delanteras ceden y las traseras intentan sostener el peso.
- Los canales cian y naranja parpadean de forma irregular.
- Solo aparece un destello pequeño unido a una articulación.

### Colapso controlado

- El cuerpo baja claramente hacia su parte inferior.
- Las seis patas permanecen unidas, plegadas y abiertas alrededor del cuerpo.
- Los cuernos descienden sin romperse.
- Los canales quedan muy tenues.
- El enemigo no se voltea ni pierde su orientación.

### Estado apagado

- El cuerpo queda apoyado sobre su parte inferior.
- Las seis patas permanecen plegadas e inactivas.
- Las dos placas y los dos cuernos siguen completos.
- Visor, luces rojas y canales cian-naranja quedan completamente apagados.
- La pose es estable y puede mantenerse indefinidamente.

## Invariantes

- Exactamente seis patas mecánicas en los doce frames.
- Exactamente dos placas principales siempre cerradas.
- Exactamente dos cuernos frontales.
- Reactor oculto durante toda la derrota.
- El cuerpo no se desarma, derrite, encoge ni cambia de identidad.
- La dirección se conserva en cada fila.
- Sin explosión, fragmentos, sombra, alas o vuelo.

## Estándar runtime

- Línea de contacto inferior: Y=117.
- Perfil derecho: espejo horizontal exacto del izquierdo.
- Transparencia RGBA binaria: alfa 0 o 255.
- Residuos magenta: 0.
- Margen mínimo: 2 px en perfiles laterales.
- Escalado final: vecino más cercano.
- La altura visual disminuye progresivamente sin cambiar el ancho corporal.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando la hoja
conceptual, daño e idle como referencias. Una primera versión se corrigió porque
la pose frontal y trasera apagada seguía demasiado cercana al reposo. La versión
final baja el cuerpo, pliega las seis patas y apaga por completo los canales.
Después se eliminó el fondo cromático, se normalizó cada celda sobre la misma
línea inferior y se reconstruyó la derecha por espejo. Los masters existentes
permanecieron intactos.

## Prompt final de generación

Use case: stylized-concept. Create a strict portrait 3-column by 4-row source
sprite sheet for Boolean Beetle's defeat animation. Preserve the approved
closed-shell identity, heavy grounded six-leg anatomy, runtime scale, camera,
centering and direction order.

Rows are down/front, left, right as an exact opposite, and up/back. Columns are:
heavy stagger with front legs buckling, rear legs spreading and cyan/orange
channels flickering; controlled collapse with the complete body dropping onto
its underside, all six legs attached and folding outward, horns lowering and
channels fading; a stable powered-down final pose, visibly lower and flatter
than idle, with all six legs folded inactive and all visor, warning lights,
cyan channel and orange channel completely off.

Preserve exactly six attached mechanical legs, exactly two closed shell plates
and exactly two intact branching horns. Keep the body complete, retain the
facing direction and rest the lowest contact point on one common baseline.

Use polished 16-bit Japanese RPG top-down three-quarter pixel art, crisp dark
outlines and flat limited shading. Uniform solid `#ff00ff` chroma-key
background. No grid, text, watermark, open shell, reactor, explosion, fire,
smoke, dust, detached shard, missing leg, missing horn, upside-down pose, side
roll, disappearance, attack, projectile, shadow, wings, flight or extra
creature.

## Estado y siguiente prioridad

Boolean Beetle queda visualmente completo: idle, desplazamiento pesado, Boolean
Burst, XOR Crossfire, False Path, Branch Charge, daño y derrota.

Con Parse Mantis, Mutable Widow, Cast Hornet y Boolean Beetle terminados, la
prioridad 2 de enemigos queda completa. La siguiente es la prioridad 3:
proyectiles. Se recomienda comenzar por la familia de proyectiles de Parse
Mantis para mantener el orden de encuentros.
