# BugSlayer — Checklist de bugs de validación manual

- **Rama evaluada:** `second-version`
- **Baseline:** `e14db3c`
- **Fecha de la prueba:** 2026-08-09
- **Entorno:** Vite local, `http://127.0.0.1:5173`
- **Estado general:** 4 bugs abiertos

## Convención

- `[ ]` Abierto
- `[~]` En progreso
- `[x]` Corregido y verificado
- **Crítico:** impide validar correctamente una parte esencial del demo.
- **Alto:** degrada de forma importante la experiencia o contradice el arte aprobado.

## Checklist

### [ ] BUG-001 — El menú principal duplica la composición visual

- **Prioridad:** Alta
- **Área:** UI / menú principal
- **Evidencia:** capturas 1 y 2 de la prueba manual.
- **Resultado actual:** el fondo contiene el marco y la identidad visual de BugSlayer, pero encima aparece una ventana adicional con otro logo, el título `BugSlayer` y el botón `Start demo`. Esto produce logos y títulos duplicados, además de una composición que parece separada del diseño de fondo.
- **Causa observada:** `MenuScene` dibuja `ui.menu.background` y después superpone un panel opaco, `ui.logo`, un título independiente y controles con geometría propia.
- **Resultado esperado:** el menú interactivo debe formar parte de la composición visual existente. Debe mostrarse una sola identidad de BugSlayer, sin una ventana redundante y con el botón localizado integrado en el espacio previsto por el diseño.

#### Criterios de cierre

- [ ] Existe un solo logo y un solo título visualmente dominante.
- [ ] No aparece un panel opaco que cubra o repita el diseño del fondo.
- [ ] `Iniciar demo` / `Start demo` queda alineado e integrado con el arte aprobado.
- [ ] Los estados normal, foco, hover y pulsado siguen siendo legibles.
- [ ] El menú se valida en español e inglés a 960 × 540.
- [ ] La navegación con teclado y puntero sigue funcionando.

---

### [ ] BUG-002 — La oficina no reproduce el concepto visual aprobado

- **Prioridad:** Crítica
- **Área:** Escenario inicial / composición
- **Evidencia:** captura 3 de la prueba manual y conceptos `initial-office-*`.
- **Resultado actual:** la escena se percibe como una maqueta geométrica básica. La distribución, riqueza visual, escala, iluminación y lectura de los cubículos no corresponden al concepto trabajado para el Escenario Inicial.
- **Resultado esperado:** la oficina debe reproducir la composición aprobada: cuarto cerrado, bloque de cuatro cubículos, Senior en C4, computadora activa en C3, rack, planta alta, aire acondicionado dentro del cuarto y puerta cerrada, conservando la perspectiva top-down y la escala definida.

#### Criterios de cierre

- [ ] La distribución coincide con el concepto y el croquis narrativo aprobados.
- [ ] C3 y C4 se distinguen claramente y mantienen sus funciones narrativas.
- [ ] Rack, planta, aire acondicionado, puerta, escritorios, sillas y computadoras tienen escala y orientación coherentes.
- [ ] El aire acondicionado se percibe dentro del cuarto y expulsa aire hacia el interior.
- [ ] No se utilizan rectángulos provisionales como representación final de props aprobados.
- [ ] El Senior despierta sentado en C4 y puede desplazarse hacia C3 sin saltos visuales.

---

### [ ] BUG-003 — Los assets runtime curados de la oficina no se muestran correctamente

- **Prioridad:** Crítica
- **Área:** Assets / tilemap / props
- **Evidencia:** captura 3 de la prueba manual.
- **Resultado actual:** aunque el manifiesto registra tileset, atlas de props y maquinaria, la escena visible no refleja los assets producidos y aprobados; varios elementos parecen placeholders o frames escalados sin conservar la composición del arte.
- **Assets que deben comprobarse:**
  - `tileset.initial-office.base`
  - `prop.initial-office.atlas`
  - `prop.initial-office.machinery-effects`
  - `player.seated-narrative`
  - `player.wake-stand`
  - `v4lk.materialize-idle`
  - `ui.office.dialogue-window`

#### Criterios de cierre

- [ ] Todos los assets requeridos cargan desde `AssetManifest` sin fallback visual silencioso.
- [ ] El tilemap utiliza frames correctos del tileset runtime.
- [ ] El atlas de props utiliza recortes, tamaños y posiciones correctos.
- [ ] No hay deformación por escalado arbitrario ni pérdida de nearest-neighbor.
- [ ] Los efectos de monitor, aire acondicionado y V4LK usan sus animaciones aprobadas.
- [ ] Un fallo de carga obligatorio produce diagnóstico visible o comprobable, no una maqueta que oculte el error.

---

### [ ] BUG-004 — Los muebles y límites de la oficina no bloquean correctamente al jugador

- **Prioridad:** Crítica
- **Área:** Colisiones / navegación
- **Evidencia:** comportamiento observado durante la prueba manual de la captura 3.
- **Resultado actual:** el Senior puede atravesar bloques o componentes que deberían ser sólidos. El tilemap declara objetos de colisión, pero el bloqueo efectivo no coincide con los elementos visibles.
- **Resultado esperado:** paredes, escritorios, divisores, rack, planta, aire acondicionado y demás props sólidos impiden el paso; las zonas caminables permiten llegar de C4 a C3 y posteriormente a la salida sin atravesar objetos.

#### Criterios de cierre

- [ ] Cada prop sólido visible tiene un collider alineado con su base transitable.
- [ ] Las cuatro paredes limitan el cuarto y la puerta cerrada no puede atravesarse.
- [ ] El jugador no atraviesa escritorios, divisores, rack, planta ni aire acondicionado.
- [ ] El trayecto C4 → C3 permanece accesible.
- [ ] La zona de interacción de C3 puede alcanzarse sin entrar dentro del escritorio.
- [ ] Se añaden pruebas deterministas para colisiones y límites relevantes.
- [ ] Se realiza una nueva prueba manual sin overlaps visibles.

## Orden recomendado de corrección

1. BUG-003 — confirmar que los assets y frames correctos están disponibles.
2. BUG-002 — reconstruir la composición de la oficina con esos assets.
3. BUG-004 — alinear colisiones con la composición definitiva.
4. BUG-001 — integrar el menú con su fondo sin duplicaciones.

## Checklist obligatoria para el PR

El PR que corrija estos hallazgos debe:

- [ ] Enlazar este archivo y enumerar los IDs resueltos.
- [ ] Incluir capturas comparativas antes/después del menú y la oficina.
- [ ] Indicar cuáles bugs permanecen abiertos, si aplica.
- [ ] Reportar pruebas automatizadas y validación manual reales.
- [ ] Confirmar español e inglés en el menú.
- [ ] Confirmar navegación y colisiones de la oficina.
- [ ] No marcar un bug como cerrado sin cumplir todos sus criterios.

### Texto sugerido para la descripción del PR

> Esta entrega da seguimiento a la checklist de validación manual de `BUGS.md`. Bugs atendidos: `BUG-___`. Bugs pendientes: `BUG-___`. Se adjunta evidencia visual antes/después y resultados reales de las pruebas ejecutadas.
