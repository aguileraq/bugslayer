# Escenario Inicial — composición final en tres estados

## Archivos

- `initial-office-state-1-inactive-runtime-v1.png`
- `initial-office-state-2-loading-runtime-v1.png`
- `initial-office-state-3-hologram-runtime-v1.png`
- `initial-office-three-states-composition-runtime-v1.png`

## Dimensiones

- Cada estado: `480 × 384 px`.
- Referencia lógica: `15 × 12` tiles de `32 × 32 px`.
- Comparativa horizontal: `1440 × 384 px`.
- Escalado de normalización: vecino más cercano.
- Fondo: composición opaca completa del cuarto.

## Geometría compartida

- Cámara fija top-down 3/4.
- Cuarto completo visible.
- Puerta cerrada en el centro del muro superior.
- Rack contra el muro izquierdo.
- Planta alta en la esquina superior derecha.
- Bloque de cuatro cubículos en disposición `2 × 2` en la zona derecha.
- C4 corresponde al cubículo inferior derecho.
- Aire acondicionado en la cara interior del muro inferior, visto principalmente desde arriba y sin rejilla frontal.
- Flujo de aire dirigido hacia el interior del cuarto.
- Piso gris rústico y muros azul grisáceo.

## Estado 1 — cuarto inactivo

- Senior Engineer dormido e inclinado en la silla de C4.
- Monitor de C4 apagado.
- Botón físico con indicador ámbar tenue.
- Las demás computadoras permanecen apagadas.
- Rack con actividad mínima.
- No existe holograma ni luz cian de monitor.

## Estado 2 — carga

- Senior Engineer erguido y esperando frente a la computadora.
- Monitor de C4 encendido.
- Barra gráfica cian aproximadamente al `60 %`.
- Indicador de la torre en cian.
- Reflejo cian controlado en las gafas.
- No existe holograma ni anillo de proyección.

## Estado 3 — holograma estabilizado

- Senior Engineer conserva la misma posición de espera.
- Monitor activo sin texto ni barra.
- Perro salchicha holográfico sobre el escritorio, detrás del monitor.
- El perro está orientado hacia la izquierda, mirando al Senior.
- Se conservan oreja caída, cuerpo largo, patas cortas, lengua magenta, ojo cian, circuitos y anillo cian/violeta.
- Los fragmentos de datos permanecen contenidos dentro de C4.

## Validación visual

- Los tres estados conservan el mismo encuadre y distribución.
- La progresión se entiende sin texto ni etiquetas.
- Ningún muro, prop o personaje queda cortado.
- El cambio se concentra en la postura del Senior, el monitor, el indicador de la torre y el holograma.
- Las otras tres estaciones permanecen apagadas.
- El holograma no invade los cubículos vecinos.
- No hay enemigos, corrupción, armas, UI, sombras de personajes, marcas de agua ni texto dentro del arte.

## Uso

Estas imágenes son referencias de composición y validación visual. El escenario jugable debe ensamblarse con el tileset, los props y las animaciones runtime ya producidas; la tira comparativa no sustituye esos assets modulares.

## Generación

- Modo: generación inicial y ediciones sucesivas mediante la herramienta integrada.
- Caso de uso base: `stylized-concept`.
- Ediciones: `precise-object-edit`.
- Referencias: hoja conceptual, Senior Engineer sentado, atlas de props, tileset base, maquinaria animada y perro holográfico.

## Siguiente escenario recomendado

La composición visual del Escenario Inicial queda completa. El siguiente trabajo de la prioridad 4 debe ser definir el escenario del **Encuentro 1 / tutorial contra Parse Mantis** antes de producir su tileset.

Conviene especificar:

1. función narrativa y momento de entrada;
2. dimensiones y distribución;
3. suelo, muros y límites;
4. obstáculos y zonas seguras;
5. maquinaria y props exclusivos;
6. tipo de corrupción;
7. paleta e iluminación;
8. restricciones de movimiento y combate.
