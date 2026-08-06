# Mycelial Monolith — Idle runtime v1

## Entregable

- `mycelial-monolith-idle-runtime-v1.png`

## Estructura

- Hoja: `576 × 768 px`
- Cuadrícula lógica: `3 columnas × 4 filas`
- Celda: `192 × 192 px`
- Filas: frente/abajo, izquierda, derecha, espalda/arriba
- Columnas: reposo dormido, neutral estable y pulso contenido

## Animación

### Frame 1 — Dormant Intake

- El núcleo central reduce ligeramente su intensidad.
- Los puertos de infección permanecen en espera.
- La corona fúngica mantiene una postura contenida.
- Los cuatro soportes continúan firmemente apoyados.

### Frame 2 — Stable Neutral

- El núcleo mantiene una emisión constante.
- El cuerpo permanece completamente cerrado.
- No existen cables-hifas extendidos.
- No se emiten partículas o esporas.

### Frame 3 — Contained Spore Pulse

- El núcleo y los puertos aumentan brevemente su brillo.
- Las puntas de la corona alcanzan su máxima lectura.
- La activación permanece unida al cuerpo.
- No hay transformación, ataque o apertura de placas.

## Invariantes

- Fortaleza-servidor vertical no humanoide y no insecto.
- Fase 1 completamente cerrada.
- Cuatro soportes mecánicos.
- Cuatro puertos de infección alrededor del núcleo.
- Un único procesador God Object central.
- Micelio marfil integrado entre placas.
- Corona Cordyceps naranja-marfil.
- Paleta carbón, metal, petróleo, marfil, naranja, chartreuse y carmesí.
- Sin minions, cables extendidos, ataques o partículas separadas.

## Estándar runtime

- Altura máxima visible: `176 px`.
- Línea base: `Y = 187`.
- Margen inferior: `5 px`.
- Perfil derecho: espejo horizontal exacto del izquierdo.
- Transparencia RGBA binaria: alfa `0` o `255`.
- Escalado final mediante vecino más cercano.
- Fondo cromático eliminado.
- Sin sombras de suelo.

## Validación

- Dimensiones y celdas correctas.
- Doce frames presentes y no vacíos.
- Escala global constante.
- Línea base idéntica en las doce celdas.
- Márgenes mínimos de 4 px.
- Sin fragmentos aislados.
- Sin residuos magenta.
- Simetría lateral exacta.
- Ningún elemento queda cortado.

## Proceso

La fuente se generó con ImageGen integrado usando la hoja conceptual aprobada
como referencia. Se utilizó un fondo cromático `#FF00FF`, posteriormente
convertido a transparencia alfa. Las vistas frontal, izquierda y trasera se
normalizaron con una escala global; la vista derecha se reconstruyó mediante
espejo. Se eliminaron componentes aislados provenientes de los límites de la
hoja fuente sin modificar el master conceptual.

## Prompt final

Se solicitó una hoja fuente pixel art de `3 × 4` para la fase 1 cerrada de
Mycelial Monolith. Las filas representan las cuatro direcciones y las columnas
un ciclo de reposo dormido, neutral y pulso de esporas contenido. Se exigió
preservar la fortaleza vertical, cuatro soportes, cuatro puertos, núcleo
central, micelio y corona Cordyceps, sin minions, apertura, ataques, sombra,
texto o elementos separados.

## Siguiente asset recomendado

Animación de `Spore Injection` en cuatro direcciones y tres frames, como primer
ataque de la fase 1.
