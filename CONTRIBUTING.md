# Contributing to BugSlayer

## 1. Fuente de verdad

Antes de proponer cambios, leer en este orden:

1. `SPEC-000-demo-scope.md`: decide qué entra en el demo.
2. `requirements.md`: define comportamiento verificable.
3. `design.md`: define la solución técnica aprobada.
4. La SPEC del incremento activo.
5. `tasks.md`: define dependencias, estado y Definition of Done.
6. `GDD.md`: comunica la visión general.

Un cambio no puede alterar comportamiento o alcance únicamente desde código.

## 2. Flujo Spec-Driven Development

Por cada incremento:

1. Seleccionar la siguiente tarea no bloqueada.
2. Crear o actualizar la SPEC correspondiente.
3. Aprobar criterios de aceptación antes de implementar.
4. Dividir el incremento en paquetes revisables.
5. Crear una branch por paquete.
6. Derivar pruebas de los criterios de aceptación.
7. Implementar mediante commits atómicos.
8. Ejecutar validaciones.
9. Abrir Pull Request.
10. Hacer merge únicamente cuando cumple Definition of Done.
11. Marcar en `tasks.md` solo las tareas realmente completadas.

### Cambio de comportamiento

Si el código no cumple la SPEC, se corrige el código. Si el comportamiento deseado cambia, actualizar antes de implementar:

1. SPEC afectada.
2. `requirements.md`, si cambia comportamiento.
3. `design.md`, si cambia arquitectura.
4. `tasks.md`, si cambia trabajo o dependencias.
5. `SPEC-000-demo-scope.md`, si cambia el alcance del demo.

## 3. Branches

`main` debe permanecer integrable y reproducible. No se utiliza una branch `develop` permanente.

Prefijos:

- `spec/`: especificaciones.
- `feat/`: funcionalidad.
- `fix/`: correcciones.
- `test/`: cobertura de pruebas.
- `docs/`: documentación.
- `chore/`: herramientas y mantenimiento.
- `release/`: preparación excepcional de una entrega.

Ejemplos:

- `spec/001-foundation`
- `feat/001-project-foundation`
- `feat/002-office-v4lk`
- `fix/challenge-pause-block`

Reglas:

- Crear la branch desde `main` actualizado.
- Una branch corresponde a un paquete coherente, no necesariamente a una tarea individual.
- Mantenerla corta y evitar mezclar milestones.
- No incluir refactors no relacionados.
- No comenzar implementación si su SPEC o dependencia sigue pendiente.

## 4. Commits

Se recomienda Conventional Commits:

```text
docs(spec-001): define boot and language flow
chore(project): scaffold Phaser and Vite
feat(localization): add session language selection
test(state): cover invalid transitions
fix(pause): reject manual pause during challenge
```

Un commit debe:

- tener un propósito;
- compilar siempre que sea posible;
- incluir o actualizar pruebas cuando cambia comportamiento;
- evitar binarios temporales;
- no contener secretos;
- mencionar TASK y requisitos en el cuerpo cuando aporte trazabilidad.

## 5. Pull Requests

Una PR entrega un resultado revisable y mantiene `main` funcional. Debe usar `.github/pull_request_template.md` e incluir:

- SPEC, TASK y requisitos relacionados;
- resumen del cambio;
- pruebas y comandos ejecutados;
- verificación manual;
- screenshots o video para cambios visuales;
- riesgos, limitaciones y decisiones pendientes.

Tamaño recomendado: lo bastante pequeño para revisar como una unidad. Un milestone completo suele requerir varias PR.

Política de merge recomendada: **Squash Merge**. La PR debe tener checks aprobados, estar actualizada y no contener trabajo parcial oculto.

## 6. Validaciones

Cuando el proyecto exista, ejecutar según el cambio:

- chequeo de tipos;
- lint;
- pruebas unitarias;
- pruebas de integración relevantes;
- build de producción;
- smoke test manual para flujos visuales o de input.

La PR debe indicar exactamente qué se ejecutó. No afirmar que una prueba pasó si no se ejecutó.

## 7. Actualización de tasks.md

- No marcar `[x]` al comenzar.
- Marcar completa dentro de la PR que aporta evidencia de cierre.
- Si una tarea queda parcial, permanece `[ ]`.
- Dividir formalmente una tarea si creció más allá de una unidad revisable.
- Registrar nuevos bloqueos y dependencias antes de continuar.

## 8. Assets

- El build consume únicamente `game/public/assets/`.
- `assets-source/` y ubicaciones heredadas no son rutas runtime.
- No modificar ni reemplazar masters sin autorización explícita.
- No versionar chroma sources, alpha intermediates, temporales o archivos superseded.
- Conservar la licencia de recursos externos, incluida Geist Pixel Square.
- Mantener nearest-neighbor y dimensiones documentadas para pixel art.
- Cada asset runtime debe tener clave estable y procedencia registrable.

## 9. Git LFS

Los binarios definidos en `.gitattributes` requieren Git LFS.

Antes del primer staging de assets:

1. Instalar Git LFS.
2. Inicializarlo en el repositorio.
3. Verificar las reglas con `git check-attr`.
4. Revisar el staging antes de commit.

No usar `git add .` como sustituto de la clasificación inicial de assets.

## 10. Secretos y despliegue

- No versionar credenciales AWS, tokens, `.env` privados o identificadores sensibles.
- Proporcionar `.env.example` si se requieren variables públicas de configuración.
- El primer build no requiere backend ni CloudFront.
- Cualquier operación remota o despliegue debe ser explícitamente autorizada.

## 11. Invariantes del demo

- Mycelial Monolith no se derrota ni tiene combate completo.
- El demo contiene cuatro Encounters jugables.
- `Escape` no pausa manualmente un Challenge.
- Una Incorrect Answer no reduce HP.
- Reiniciar conserva idioma y vuelve a la oficina.
- Español e inglés utilizan datos localizados.
- El juego no ejecuta código proporcionado por el jugador.
