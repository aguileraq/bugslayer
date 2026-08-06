# AGENTS.md

## Alcance

Estas instrucciones aplican a todo el repositorio. Archivos `AGENTS.md` más específicos pueden añadir reglas locales sin contradecir este documento.

## Antes de trabajar

Leer:

1. `SPEC-000-demo-scope.md`.
2. `requirements.md`.
3. `design.md`.
4. La SPEC activa.
5. `tasks.md`.
6. `CONTRIBUTING.md`.

No implementar una tarea bloqueada ni comportamiento sin requisito.

## Cambios documentales

- Si cambia alcance, actualizar primero SPEC-000.
- Si cambia comportamiento, actualizar requirements.
- Si cambia arquitectura, actualizar design.
- Si cambia orden, dependencia o estado, actualizar tasks.
- No modificar documentos para justificar retrospectivamente una implementación incorrecta.

## Código y pruebas

- Mantener TypeScript estricto.
- Mantener el core crítico sin dependencia directa de Phaser según `design.md`.
- Gameplay usa `deltaMs`; no usar timers del navegador para reglas de simulación.
- Añadir o actualizar pruebas cuando cambia comportamiento.
- Ejecutar las validaciones relevantes y reportar resultados reales.
- No marcar una TASK completa sin evidencia verificable.

## Git

- No inicializar Git, crear/cambiar branches, hacer commits, push, PR, merge, tags o despliegues salvo petición explícita del usuario.
- No trabajar directamente sobre `main` cuando exista un flujo de branches activo.
- Seguir nombres y política de `CONTRIBUTING.md`.
- No reescribir historial ni usar operaciones destructivas sin autorización explícita.
- Nunca versionar secretos.

## Assets

- No modificar masters ni eliminar fuentes artísticas sin autorización.
- El juego consume únicamente assets runtime curados.
- No añadir chroma sources, alpha intermediates, temporales o superseded.
- Preservar transparencia, dimensiones, retícula, línea base y nearest-neighbor.
- Mantener licencias y atribuciones.
- Tratar binarios declarados en `.gitattributes` mediante Git LFS.

## Invariantes funcionales

- Cuatro Encounters: Parse Mantis, Mutable Widow, Cast Hornet y Boolean Beetle.
- Mycelial Monolith es cierre narrativo, no Boss derrotado.
- Challenge permite movimiento y bloquea pausa manual.
- Safety pause por visibilidad puede conservar y congelar Challenge.
- Incorrect Answer nunca reduce HP.
- Reinicio conserva idioma y vuelve a la oficina.
- No ejecutar código del usuario.

## Finalización

Al entregar un cambio:

- resumir archivos modificados;
- indicar pruebas ejecutadas y resultados;
- mencionar riesgos o decisiones abiertas;
- enlazar archivos relevantes;
- no afirmar completitud si quedan criterios pendientes.
