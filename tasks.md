# BugSlayer — Implementation Tasks

- **Estado:** Plan baseline
- **Versión:** 2.0
- **Fecha:** 2026-08-06
- **Alcance rector:** `SPEC-000-demo-scope.md`
- **Requisitos:** `requirements.md` v2.0
- **Diseño:** `design.md` v2.0

## 1. Propósito

Este documento ordena el trabajo necesario para convertir las especificaciones aprobadas en un demo funcional. Una tarea no puede introducir comportamiento que no esté respaldado por `SPEC-000` y `requirements.md`.

El workspace actual contiene documentación y assets, pero no contiene todavía un proyecto verificable de Phaser (`package.json`, `src/`, `tests/` o configuración de Vite). Por esa razón, ninguna tarea antigua de implementación se considera terminada.

## 2. Convenciones

- `[x]`: completada y verificable.
- `[ ]`: pendiente.
- **Critical:** necesaria para completar el demo.
- **Supporting:** necesaria para calidad, trazabilidad o reducción de riesgo.
- **Post-demo:** explícitamente fuera del recorrido comprometido.

Cada tarea indica:

- **Depende de:** tareas que deben estar completas antes.
- **Requisitos:** identificadores cubiertos.
- **Terminado cuando:** condición verificable de cierre.

## 3. Definition of Done global

Una tarea de implementación solo puede marcarse como completa cuando:

1. Cumple sus criterios de aceptación relacionados.
2. Compila con TypeScript estricto.
3. Tiene pruebas proporcionales al riesgo.
4. No introduce errores de lint configurado.
5. No deja errores de consola en su flujo verificable.
6. Utiliza datos y assets mediante claves estables.
7. Funciona en español e inglés cuando contiene texto.
8. Mantiene el orden determinista y timers por `deltaMs` cuando afecta gameplay.
9. Actualiza la trazabilidad o documentación si cambia una decisión aprobada.

## 4. Milestone 0 — Baseline documental

- [x] **TASK-000 — Cerrar alcance del demo** **[Critical]**
  - Entregable: `SPEC-000-demo-scope.md` v1.0.
  - Terminado cuando: alcance, exclusiones y criterios de aceptación están aprobados.

- [x] **TASK-001 — Reconciliar GDD** **[Supporting]**
  - Depende de: TASK-000.
  - Entregable: `GDD.md` sin Boss combatible ni Victory.
  - Terminado cuando: describe cuatro Encounters y cierre por extracción.

- [x] **TASK-002 — Reconciliar requisitos** **[Critical]**
  - Depende de: TASK-000.
  - Entregable: `requirements.md` v2.0 con 23 requisitos trazables.
  - Terminado cuando: no existen contradicciones con SPEC-000.

- [x] **TASK-003 — Reconciliar diseño técnico** **[Critical]**
  - Depende de: TASK-002.
  - Entregable: `design.md` v2.0.
  - Terminado cuando: los 23 requisitos tienen componentes responsables y estrategia de pruebas.

- [x] **TASK-004 — Reconciliar plan de trabajo** **[Supporting]**
  - Depende de: TASK-003.
  - Entregable: este documento.
  - Terminado cuando: tareas antiguas incompatibles han sido eliminadas y el estado refleja evidencia real.

## 5. Milestone 0.5 — Repositorio y colaboración

- [x] **TASK-010 — Definir estrategia de repositorio** **[Supporting]**
  - Depende de: TASK-004.
  - Decisión: monorepo con documentación, assets fuente y aplicación Phaser versionados en conjunto.
  - Entregable: sección 14 de `design.md` actualizada.
  - Terminado cuando: límites entre `game/`, assets runtime, masters y staging heredado están documentados.

- [x] **TASK-011 — Crear políticas de contribución y agentes** **[Supporting]**
  - Depende de: TASK-010.
  - Entregables: `CONTRIBUTING.md` y `AGENTS.md`.
  - Terminado cuando: flujo SDD, branches, commits, PR, validación y reglas para agentes están documentados sin duplicar requisitos.

- [x] **TASK-012 — Crear configuración inicial de versionado** **[Supporting]**
  - Depende de: TASK-010.
  - Entregables: `.gitignore`, `.gitattributes` y `.github/pull_request_template.md`.
  - Terminado cuando: temporales quedan excluidos, binarios pesados están declarados para LFS y el PR exige trazabilidad.

- [x] **TASK-013 — Inicializar Git y Git LFS** **[Critical]**
  - Depende de: TASK-011, TASK-012.
  - Ejecutar `git init`, establecer `main` e inicializar Git LFS.
  - No ejecutar `git add .` hasta completar TASK-014.
  - Terminado cuando: la raíz correcta es un repositorio, `main` existe y las reglas LFS se reconocen.

- [x] **TASK-014 — Clasificar assets antes del primer staging** **[Critical]**
  - Depende de: TASK-013.
  - Crear inventario de runtime aprobado, masters, conceptos, temporales, chroma sources y superseded.
  - Copiar de forma no destructiva los assets consumibles hacia `game/public/assets/` cuando exista el scaffold; hasta entonces registrar su ruta de origen.
  - Terminado cuando: ningún temporal o master accidental aparece en el staging previsto y cada asset runtime tiene procedencia.

- [x] **TASK-015 — Crear commit baseline** **[Critical]**
  - Depende de: TASK-014.
  - Versionar primero documentación, políticas y configuración; incorporar assets únicamente conforme al inventario aprobado.
  - Mensaje recomendado: `docs(baseline): establish SDD and repository workflow`.
  - Terminado cuando: el working tree queda limpio y el commit puede restaurar el baseline documental.

- [x] **TASK-016 — Crear remoto y publicar main** **[Supporting]**
  - Depende de: TASK-015.
  - Crear repositorio remoto vacío, configurar `origin` y publicar `main`.
  - No incluir secretos, credenciales AWS ni variables privadas.
  - Terminado cuando: `main` local y remoto apuntan al mismo baseline.

- [x] **TASK-017 — Configurar protección y verificar flujo de PR** **[Supporting]**
  - Depende de: TASK-016.
  - Proteger `main`, requerir checks disponibles y comprobar el template mediante un PR de prueba o el primer PR real.
  - Terminado cuando: el trabajo normal entra a `main` mediante Pull Request y Squash Merge.

## 6. Milestone 1 — SPEC-001, foundation, Boot e idioma

- [x] **TASK-100 — Crear y aprobar SPEC-001: foundation, Boot, precarga, idioma y menú** **[Critical]**
  - Depende de: TASK-017.
  - Requisitos: REQ-BOOT-001, REQ-LOC-001, REQ-MENU-001, REQ-DATA-001, REQ-DELIVERY-001.
  - Incluir: ubicación del proyecto, versiones fijadas, comandos, flujo Boot→LanguageSelect→Menu, errores de carga y criterios de aceptación.
  - Terminado cuando: la especificación está aprobada antes de crear código.

- [x] **TASK-101 — Crear scaffold del proyecto** **[Critical]**
  - Depende de: TASK-100.
  - Crear proyecto con Phaser, TypeScript, Vite y Vitest en la ubicación aprobada por SPEC-001.
  - Configurar TypeScript estricto, scripts de desarrollo, build y test.
  - Terminado cuando: desarrollo, build, chequeo de tipos y smoke test trivial terminan correctamente.

- [x] **TASK-102 — Crear estructura, tipos base y contratos** **[Critical]**
  - Depende de: TASK-101.
  - Requisitos: REQ-STATE-001, REQ-DATA-001.
  - Crear contratos para estados, Challenges, Encounters, Enemies, estadísticas, localización, assets y secuencia final.
  - Excluir: BossPhase, Victory, inputLock y quinto Encounter.
  - Terminado cuando: los contratos representan el diseño v2.0 y compilan sin casts inseguros evitables.

- [x] **TASK-103 — Implementar DataValidator** **[Critical]**
  - Depende de: TASK-102.
  - Requisitos: REQ-DATA-001.
  - Validar locales, Challenges, EncounterConfigs, ataques, manifiesto y FinalSequence.
  - Agregar pruebas para datos válidos, referencias rotas, categorías incorrectas y claves faltantes.
  - Terminado cuando: agrega todos los errores y bloquea datos inválidos de forma determinista.

- [x] **TASK-104 — Crear AssetManifest y AssetRegistry** **[Critical]**
  - Depende de: TASK-102.
  - Requisitos: REQ-BOOT-001, REQ-DELIVERY-001.
  - Registrar fuente, Player, Enemies, Projectiles, tilemaps, UI, V4LK, corrupción y extracción.
  - Definir mapa entre assets aprobados y claves runtime; no renombrar masters originales.
  - Terminado cuando: las claves son únicas, los frames críticos están validados y no hay rutas externas de fuente.

- [x] **TASK-105 — Implementar LocalizationStore y datos iniciales** **[Critical]**
  - Depende de: TASK-102.
  - Requisitos: REQ-LOC-001, REQ-DATA-001.
  - Crear locales `es` y `en`, resolución de claves y `SessionSettings.language`.
  - Incluir caracteres españoles y separar texto técnico no traducible.
  - Terminado cuando: todas las claves iniciales existen en ambos idiomas y las pruebas detectan ausencias.

- [x] **TASK-106 — Implementar BootScene** **[Critical]**
  - Depende de: TASK-103, TASK-104, TASK-105.
  - Requisitos: REQ-BOOT-001.
  - Cargar Geist Pixel Square local, datos y recursos obligatorios; esperar disponibilidad real de la fuente.
  - Mostrar progreso y error bloqueante identificable.
  - Terminado cuando: Boot válido llega a LanguageSelect y un recurso inválido impide continuar.

- [x] **TASK-107 — Implementar LanguageSelectScene y MenuScene** **[Critical]**
  - Depende de: TASK-105, TASK-106.
  - Requisitos: REQ-LOC-001, REQ-MENU-001.
  - Implementar selección bilingüe, confirmación, persistencia de sesión y menú localizado.
  - Terminado cuando: ambos idiomas llegan al menú y el idioma se conserva durante reinicio de escena.

- [x] **TASK-108 — Verificar Milestone 1** **[Critical]**
  - Depende de: TASK-107.
  - Ejecutar pruebas, build y flujo Boot→Idioma→Menú.
  - Confirmar que Geist Pixel Square no genera solicitudes externas.
  - Terminado cuando: el incremento cumple todos los criterios de SPEC-001.

## 7. Milestone 2 — SPEC-002 y oficina inicial

- [x] **TASK-200 — Crear y aprobar SPEC-002: oficina y V4LK** **[Critical]**
  - Depende de: TASK-108.
  - Requisitos: REQ-INTRO-001, REQ-MOV-001, REQ-PAUSE-001.
  - Definir estados de la secuencia, colisiones, interacción C3, duración de carga y control de cámara.
  - Terminado cuando: recorrido C4→C3→V4LK tiene criterios de aceptación completos.

- [x] **TASK-201 — Preparar tilemap y recursos runtime de la oficina** **[Critical]**
  - Depende de: TASK-200.
  - Importar tileset, props, maquinaria, silla, Senior sentado, diálogos y V4LK mediante claves del manifiesto.
  - Definir capas visibles, colisiones, spawn C4, interacción C3 y salida.
  - Terminado cuando: el mapa carga sin recursos faltantes y sus colisiones están verificadas.

- [x] **TASK-202 — Implementar Player e InputManager de exploración** **[Critical]**
  - Depende de: TASK-201.
  - Requisitos: REQ-MOV-001.
  - Movimiento constante, sin inercia ni carrera, colisiones de tilemap y animaciones por dirección.
  - Terminado cuando: caminar funciona en cuatro direcciones y no atraviesa límites.

- [x] **TASK-203 — Implementar OfficeScene y flujo de despertar** **[Critical]**
  - Depende de: TASK-202.
  - Requisitos: REQ-INTRO-001, REQ-STATE-001.
  - Estados Intro→Dialogue→Exploration; despertar, diálogo y levantarse antes de ceder control.
  - Terminado cuando: el jugador no recibe control antes de finalizar el levantamiento.

- [x] **TASK-204 — Implementar computadora C3 y materialización de V4LK** **[Critical]**
  - Depende de: TASK-203.
  - Requisitos: REQ-INTRO-001.
  - Objetivo parpadeante, zona de interacción, pulsación, carga y materialización estabilizada.
  - Habilitar salida solo al completar el flujo.
  - Terminado cuando: no se puede omitir la interacción ni activar desde una posición inválida.

- [x] **TASK-205 — Implementar DialogueOverlay localizado** **[Critical]**
  - Depende de: TASK-105, TASK-203.
  - Requisitos: REQ-LOC-001, REQ-INTRO-001.
  - Avance mediante Enter/clic, nombre del hablante y textos en ambos idiomas.
  - Terminado cuando: español e inglés conservan geometría y no existen textos rasterizados.

- [x] **TASK-206 — Verificar Milestone 2** **[Critical]**
  - Depende de: TASK-204, TASK-205.
  - Pruebas de movimiento e interacción y smoke completo de oficina.
  - Terminado cuando: se recorre Menú→C4→C3→V4LK→salida sin errores.

## 8. Milestone 3 — SPEC-003 y vertical slice de Parse Mantis

- [x] **TASK-300 — Crear y aprobar SPEC-003: combate, Challenges y Parse Mantis** **[Critical]**
  - Depende de: TASK-206.
  - Requisitos: REQ-STATE-001, REQ-COMBAT-001, REQ-CHL-001 a REQ-CHL-005, REQ-PROG-001, REQ-TUT-001, REQ-SCORE-001, REQ-PAUSE-001, REQ-DEFEAT-001, REQ-RESET-001.
  - Terminado cuando: un Encounter completo tiene comportamiento y pruebas definidos antes de implementarse.

- [x] **TASK-301 — Implementar GameStateMachine y PauseContext con pruebas** **[Critical]**
  - Depende de: TASK-300.
  - Implementar tabla del diseño, rechazo de estados inválidos, pausa manual y safety pause.
  - Probar que Challenge rechaza pausa manual y acepta pausa de visibilidad.
  - Terminado cuando: todas las transiciones críticas tienen cobertura.

- [x] **TASK-302 — Implementar RunManager y reset de sesión** **[Critical]**
  - Depende de: TASK-301.
  - Requisitos: REQ-RESET-001.
  - Reiniciar Run desde oficina, salir al menú y conservar únicamente idioma.
  - Terminado cuando: tests prueban separación entre reinicio y regreso al menú.

- [x] **TASK-303 — Implementar ProjectilePool, ProjectileSystem y AttackPatternRegistry** **[Critical]**
  - Depende de: TASK-300.
  - Requisitos: REQ-COMBAT-001, REQ-PERF-001.
  - Implementar infraestructura común y `parse.linearAttack`.
  - Terminado cuando: spawns deterministas se reciclan y respetan capacidad.

- [x] **TASK-304 — Implementar CollisionSystem e InvulnerabilityTracker** **[Critical]**
  - Depende de: TASK-303.
  - Requisitos: REQ-COMBAT-001.
  - Hitbox del Player, daño hostil y ventana de 500 ms sin extensión.
  - Terminado cuando: pruebas cubren impacto efectivo, impactos ignorados y daño fatal.

- [x] **TASK-305 — Implementar Enemy, EncounterManager y CombatManager base** **[Critical]**
  - Depende de: TASK-303, TASK-304.
  - Requisitos: REQ-PROG-001.
  - Colección de Enemies, completionRule, damageTargetMode, limpieza y curación.
  - En el slice se utiliza un Parse Mantis.
  - Terminado cuando: Encounter 1 puede iniciar, completarse y transicionar.

- [x] **TASK-306 — Implementar AnswerValidator y ChallengeManager con pruebas** **[Critical]**
  - Depende de: TASK-300.
  - Requisitos: REQ-CHL-001, REQ-CHL-002, REQ-CHL-003.
  - Normalización, pools sin repetición, timers, expiración y cierre silencioso.
  - Terminado cuando: casos límite del requirements quedan cubiertos.

- [x] **TASK-307 — Implementar ambos widgets de Challenge e input** **[Critical]**
  - Depende de: TASK-306.
  - Requisitos: REQ-CHL-002, REQ-CHL-003.
  - Typed con contador `n/12`; multiple-choice con teclado y ratón.
  - Terminado cuando: ambas modalidades pueden resolverse mientras el Player se mueve.

- [x] **TASK-308 — Implementar ScoreManager y PenaltyManager** **[Critical]**
  - Depende de: TASK-306.
  - Requisitos: REQ-CHL-004, REQ-CHL-005, REQ-SCORE-001.
  - Atomicidad de daño/Score/Streak y única penalización `extraProjectiles`.
  - Terminado cuando: pruebas comprueban piso cero, Streak, duración y cancelación.

- [x] **TASK-309 — Implementar HUD, feedback y overlays de combate** **[Critical]**
  - Depende de: TASK-307, TASK-308.
  - HUD, ChallengeOverlay, respuesta correcta, error, tiempo agotado y pausa bloqueada.
  - Terminado cuando: utiliza los assets UI aprobados y todos los textos son localizados.

- [x] **TASK-310 — Implementar Parse Mantis y TutorialOverlay** **[Critical]**
  - Depende de: TASK-305, TASK-309.
  - Requisitos: REQ-PROG-001, REQ-TUT-001.
  - Cargar Jardín de Compilación, enemigo, ataque lineal, tres Challenges Syntax y tutorial de tres pasos.
  - Terminado cuando: el Encounter puede completarse en español e inglés.

- [x] **TASK-311 — Implementar pausa, DefeatScene y reinicio** **[Critical]**
  - Depende de: TASK-301, TASK-302, TASK-309.
  - Requisitos: REQ-PAUSE-001, REQ-DEFEAT-001, REQ-RESET-001.
  - PauseOverlay fuera de Challenge; safety pause conserva Challenge; derrota muestra estadísticas.
  - Terminado cuando: pruebas y smoke cubren los tres flujos.

- [x] **TASK-312 — Verificar vertical slice** **[Critical]**
  - Depende de: TASK-310, TASK-311.
  - Recorrido: idioma→oficina→V4LK→Parse Mantis→Challenge typed y multiple-choice→transición; incluir derrota y reinicio.
  - Medir orden determinista en carrera entre respuesta letal y ataque letal.
  - Terminado cuando: SPEC-003 se cumple y no hay errores de consola.

## 9. Milestone 4 — SPEC-004 y encuentros múltiples

- [x] **TASK-400 — Resolver damageTargetMode de Mutable Widow y Cast Hornet** **[Critical]**
  - Depende de: TASK-312.
  - Elegir `roundRobin`, `allActive` o `sharedPool` para cada Encounter.
  - Registrar la decisión en SPEC-004 y en sus JSON.
  - Terminado cuando: el resultado de cada Correct Answer es inequívoco.

- [x] **TASK-401 — Crear y aprobar SPEC-004: múltiples Enemies** **[Critical]**
  - Depende de: TASK-400.
  - Requisitos: REQ-PROG-001, REQ-COMBAT-001, REQ-CHL-004.
  - Definir barras/estado, targeting, completionRule, daño y limpieza parcial.
  - Terminado cuando: cubre dos Widows y tres Hornets.

- [x] **TASK-402 — Implementar Mutable Widow** **[Critical]**
  - Depende de: TASK-401.
  - Importar guarida, dos Enemies, Reassignment Volley, Scope Web y tres Challenges Variable.
  - Terminado cuando: ambas Widows respetan targeting y completionRule.

- [x] **TASK-403 — Implementar Cast Hornet** **[Critical]**
  - Depende de: TASK-401.
  - Importar Router Aéreo, tres Enemies voladores, Type Sting, Casting Swarm y tres Challenges Type.
  - Terminado cuando: altura aérea, colisiones y completionRule son consistentes.

- [ ] **TASK-404 — Pruebas de encuentros múltiples** **[Critical]**
  - Depende de: TASK-402, TASK-403.
  - Probar targeting, Enemy derrotado parcialmente, finalización, limpieza, curación y preservación de Score/Streak.
  - Terminado cuando: ambos Encounters avanzan sin estados residuales.

## 10. Milestone 5 — SPEC-005 y Boolean Beetle

- [ ] **TASK-500 — Crear y aprobar SPEC-005: subjefe Logic** **[Critical]**
  - Depende de: TASK-404.
  - Requisitos: REQ-PROG-001, REQ-COMBAT-001.
  - Definir ataques, prioridades, áreas hostiles y transición hacia FinalSequence.
  - Terminado cuando: no introduce BossPhase ni Victory.

- [ ] **TASK-501 — Implementar ataques de Boolean Beetle** **[Critical]**
  - Depende de: TASK-500.
  - Registrar Boolean Burst, XOR Crossfire, False Path y Branch Charge.
  - Branch Charge utiliza Hostile Attack corporal y CollisionSystem.
  - Terminado cuando: cada ataque es determinista y limpiable.

- [ ] **TASK-502 — Implementar Encounter 4 y contenido Logic** **[Critical]**
  - Depende de: TASK-501.
  - Importar Arboleda, Boolean Beetle y tres Challenges Logic.
  - Terminado cuando: derrotarlo produce `finalSequenceReady`, no Victory.

- [ ] **TASK-503 — Verificar los cuatro Encounters** **[Critical]**
  - Depende de: TASK-502.
  - Recorrido continuo, transiciones, curación, Score, Streak, Challenge pools y limpieza.
  - Terminado cuando: los cuatro Encounters son completables consecutivamente.

## 11. Milestone 6 — SPEC-006 y final narrativo

- [ ] **TASK-600 — Crear y aprobar SPEC-006: Mycelial Monolith y extracción** **[Critical]**
  - Depende de: TASK-503.
  - Requisitos: REQ-FINAL-001.
  - Especificar pasos, señales, diálogos, duración, omisión de input y transición a DemoEnd.
  - Terminado cuando: cada paso tiene inicio, final y fallback seguro.

- [ ] **TASK-601 — Implementar FinalSequenceController y datos** **[Critical]**
  - Depende de: TASK-600.
  - Cargar `final-sequence.json`; ejecutar pasos deterministas y validar señales.
  - Terminado cuando: una señal faltante no deja la secuencia bloqueada sin diagnóstico.

- [ ] **TASK-602 — Integrar corrupción, Monolith y minions infectados** **[Critical]**
  - Depende de: TASK-601.
  - Importar assets aprobados, reactivar Boolean Beetle y presentar minions como entidades narrativas.
  - No crear HP, BossPhase ni Challenge para Mycelial Monolith.
  - Terminado cuando: la secuencia visual conserva posiciones y escalas aprobadas.

- [ ] **TASK-603 — Integrar advertencia y extracción de V4LK** **[Critical]**
  - Depende de: TASK-602.
  - Diálogo localizado, lock-on, extracción del Senior, extracción de V4LK y fundido.
  - Terminado cuando: el input de gameplay está bloqueado y ambos actores desaparecen correctamente.

- [ ] **TASK-604 — Implementar DemoEndScene** **[Critical]**
  - Depende de: TASK-603.
  - Mostrar tarjeta final localizada sin afirmar derrota del Monolith.
  - Terminado cuando: FinalSequence siempre termina en DemoEnd.

- [ ] **TASK-605 — Verificar cierre narrativo** **[Critical]**
  - Depende de: TASK-604.
  - Probar orden, diálogos, assets, ausencia de combate y final en ambos idiomas.
  - Terminado cuando: REQ-FINAL-001 está cubierto completamente.

## 12. Milestone 7 — Contenido, datos y validación integral

- [ ] **TASK-700 — Completar los 12 Challenges definitivos** **[Critical]**
  - Depende de: TASK-503.
  - Requisitos: REQ-CHL-001, REQ-DATA-001.
  - Exactamente tres Syntax, tres Variable, tres Type y tres Logic; incluir ambas modalidades.
  - Terminado cuando: DataValidator aprueba contenido y todas las respuestas caben en sus restricciones.

- [ ] **TASK-701 — Completar localización española e inglesa** **[Critical]**
  - Depende de: TASK-605, TASK-700.
  - Menú, oficina, tutorial, Challenges, transiciones, pausa, derrota y DemoEnd.
  - Terminado cuando: no faltan claves y los textos caben en la UI aprobada.

- [ ] **TASK-702 — Completar AssetManifest de producción** **[Critical]**
  - Depende de: TASK-605.
  - Registrar todos los assets utilizados; excluir masters, fuentes cromáticas y archivos superseded.
  - Terminado cuando: una Run completa no carga rutas fuera del manifiesto.

- [ ] **TASK-703 — Ejecutar validación integral de datos** **[Critical]**
  - Depende de: TASK-700, TASK-701, TASK-702.
  - Validar referencias, composición, targeting, ataques, locales, frames y secuencia final.
  - Terminado cuando: el reporte no contiene errores.

- [ ] **TASK-704 — Smoke end-to-end local** **[Critical]**
  - Depende de: TASK-703.
  - Idioma→oficina→cuatro Encounters→FinalSequence→DemoEnd; repetir flujo Defeat→reinicio.
  - Terminado cuando: ambas modalidades aparecen, la pausa cumple reglas y no hay errores de consola.

## 13. Milestone 8 — Rendimiento, build y publicación

- [ ] **TASK-800 — Prueba y ajuste de rendimiento** **[Critical]**
  - Depende de: TASK-704.
  - Requisitos: REQ-PERF-001.
  - Medir 40 Projectiles y margen hasta 80; ajustar capacidad del pool con evidencia.
  - Terminado cuando: mantiene objetivo de 60 FPS en Chrome de escritorio bajo carga normal.

- [ ] **TASK-801 — Validación visual y de compatibilidad en Chrome** **[Critical]**
  - Depende de: TASK-800.
  - Requisitos: REQ-COMPAT-001.
  - Canvas 960×540, escalado nítido, input, fuente, ambos idiomas y resize.
  - Terminado cuando: recorrido completo no presenta errores bloqueantes.

- [ ] **TASK-802 — Configurar build de producción** **[Critical]**
  - Depende de: TASK-801.
  - Requisitos: REQ-DELIVERY-001.
  - Generar `dist/`, comprobar rutas relativas y ausencia de dependencias externas de fuente.
  - Terminado cuando: preview local del build supera smoke test.

- [ ] **TASK-803 — Desplegar build estático inicial** **[Critical]**
  - Depende de: TASK-802.
  - Publicar en hosting estático aprobado; S3 static website es válido.
  - No requiere CloudFront ni backend.
  - Terminado cuando: URL pública responde y carga recursos correctamente.

- [ ] **TASK-804 — Smoke test final sobre URL pública** **[Critical]**
  - Depende de: TASK-803.
  - Ejecutar Run completa y flujo de derrota en Chrome estable.
  - Registrar versión, navegador, resultado, errores y métricas básicas.
  - Terminado cuando: se cumplen los criterios de aceptación de SPEC-000.

- [ ] **TASK-805 — Cerrar release del demo** **[Supporting]**
  - Depende de: TASK-804.
  - Congelar versiones de documentos, datos y build; registrar limitaciones conocidas.
  - Terminado cuando: existe una entrega reproducible y trazable.

## 14. Trabajo explícitamente post-demo

No debe entrar en Milestones 1–8:

- Combate completo contra Mycelial Monolith.
- Audio.
- Leaderboard y backend.
- Autenticación.
- Multijugador.
- Guardado permanente.
- Configuración de controles, móvil o gamepad.
- VFX avanzados nuevos.
- Ejecución de código del usuario.
- Challenges generados mediante IA.
- CloudFront/HTTPS como requisito del primer build.

Si se aprueba cualquiera de estos elementos, debe recibir una nueva SPEC antes de crear tareas de implementación.

## 15. Trazabilidad requisito → tareas

| Requisito | Tareas principales |
|---|---|
| REQ-BOOT-001 | TASK-100, TASK-104, TASK-106, TASK-108 |
| REQ-LOC-001 | TASK-100, TASK-105, TASK-107, TASK-205, TASK-701 |
| REQ-MENU-001 | TASK-100, TASK-107 |
| REQ-INTRO-001 | TASK-200, TASK-203, TASK-204, TASK-205 |
| REQ-MOV-001 | TASK-200, TASK-202, TASK-312 |
| REQ-STATE-001 | TASK-102, TASK-301 |
| REQ-COMBAT-001 | TASK-300, TASK-303, TASK-304, TASK-305, TASK-501 |
| REQ-CHL-001 | TASK-300, TASK-306, TASK-700 |
| REQ-CHL-002 | TASK-306, TASK-307 |
| REQ-CHL-003 | TASK-306, TASK-307 |
| REQ-CHL-004 | TASK-308, TASK-400, TASK-401 |
| REQ-CHL-005 | TASK-308, TASK-309 |
| REQ-PROG-001 | TASK-305, TASK-310, TASK-401 a TASK-404, TASK-500 a TASK-503 |
| REQ-TUT-001 | TASK-300, TASK-310 |
| REQ-SCORE-001 | TASK-308, TASK-311, TASK-503 |
| REQ-FINAL-001 | TASK-600 a TASK-605 |
| REQ-DEFEAT-001 | TASK-311, TASK-704 |
| REQ-PAUSE-001 | TASK-301, TASK-311, TASK-704 |
| REQ-RESET-001 | TASK-302, TASK-311, TASK-704 |
| REQ-DATA-001 | TASK-103, TASK-105, TASK-700, TASK-703 |
| REQ-PERF-001 | TASK-303, TASK-800 |
| REQ-COMPAT-001 | TASK-801, TASK-804 |
| REQ-DELIVERY-001 | TASK-104, TASK-802, TASK-803 |

## 16. Decisiones que bloquean tareas futuras

- La ubicación física del proyecto Phaser está propuesta como `game/`; SPEC-001 debe confirmarla antes de TASK-101.
- Git, LFS, clasificación de assets y baseline remoto deben completarse antes de TASK-100.
- `damageTargetMode` de Mutable Widow y Cast Hornet debe resolverse en TASK-400 antes de SPEC-004.
- Los valores de tuning no bloquean foundation ni vertical slice; se calibran antes de TASK-804.
