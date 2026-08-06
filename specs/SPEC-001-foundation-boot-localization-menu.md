# SPEC-001 — Foundation, Boot, precarga, idioma y menú

- **Estado:** Borrador para aprobación
- **Versión:** 0.1
- **Fecha:** 2026-08-06
- **Tarea:** TASK-100
- **Requisitos:** REQ-BOOT-001, REQ-LOC-001, REQ-MENU-001, REQ-DATA-001, REQ-DELIVERY-001
- **Autoridad:** Esta SPEC concreta el primer incremento ejecutable sin modificar el alcance definido por SPEC-000 ni la arquitectura de `design.md`.

## 1. Objetivo

Entregar la base reproducible del proyecto y el primer flujo navegable del demo:

```text
Boot → LanguageSelect → Menu
```

El incremento debe demostrar que la aplicación puede arrancar, precargar y validar sus recursos obligatorios, cargar la fuente local, seleccionar español o inglés y presentar un menú localizado. No incluye todavía la oficina ni gameplay.

## 2. Alcance

Incluye:

- scaffold de Phaser, TypeScript, Vite y Vitest;
- configuración estricta de TypeScript;
- estructura mínima del proyecto dentro del monorepo;
- contratos base requeridos por la precarga;
- manifiesto y registro de todos los assets runtime aprobados del demo;
- datos iniciales y localización en español e inglés;
- validación agregada de datos antes de iniciar el contenido;
- `BootScene`, `LanguageSelectScene` y `MenuScene`;
- feedback visual de progreso y error bloqueante;
- persistencia del idioma durante la sesión;
- build estático reproducible;
- pruebas unitarias, integración del flujo y smoke test en Chrome.

No incluye:

- oficina inicial, Senior Engineer jugable o V4LK;
- combate, enemigos, proyectiles o Challenges activos;
- pausa, derrota, puntuación o progreso de Run;
- audio, backend, autenticación o persistencia entre sesiones;
- despliegue en S3;
- ejecución de código escrito por el jugador.

## 3. Ubicación y límites del proyecto

La aplicación se crea en:

```text
GameAssets/game/
```

Reglas:

- `game/` contiene el proyecto ejecutable.
- `game/src/` contiene TypeScript, escenas, lógica y datos versionados como módulos o JSON.
- `game/public/assets/` contiene únicamente assets runtime aprobados.
- `game/public/assets/fonts/` contiene Geist Pixel Square y su licencia.
- `output/`, `sprite-export/` y los masters no son rutas de carga del juego.
- Vite genera la entrega estática en `game/dist/`.
- `dist/`, dependencias instaladas y archivos locales de entorno no se versionan.
- No se mueve, renombra ni elimina ningún master durante este milestone.

Estructura mínima del incremento:

```text
game/
├── public/
│   └── assets/
│       ├── fonts/
│       ├── sprites/
│       ├── projectiles/
│       ├── tilesets/
│       ├── tilemaps/
│       ├── ui/
│       └── effects/
├── src/
│   ├── main.ts
│   ├── config.ts
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── LanguageSelectScene.ts
│   │   └── MenuScene.ts
│   ├── core/
│   │   ├── GameStateMachine.ts
│   │   └── SessionSettings.ts
│   ├── assets/
│   │   ├── AssetManifest.ts
│   │   └── AssetRegistry.ts
│   ├── localization/
│   │   └── LocalizationStore.ts
│   ├── logic/
│   │   └── DataValidator.ts
│   ├── data/
│   │   ├── locales/
│   │   │   ├── es.json
│   │   │   └── en.json
│   │   ├── challenges/
│   │   ├── encounters/
│   │   └── final-sequence.json
│   └── types/
├── tests/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

TASK-102 puede ampliar esta estructura sin contradecir estos límites.

## 4. Versiones fijadas

Versiones aprobadas para crear el scaffold:

| Herramienta | Versión | Política |
|---|---:|---|
| Node.js | 24.19.0 LTS | Versión de ejecución local y CI |
| npm | 11.18.0 | Administrador de paquetes; lockfile obligatorio |
| Phaser | 4.2.1 | Dependencia runtime exacta |
| TypeScript | 7.0.2 | Dependencia de desarrollo exacta |
| Vite | 8.1.5 | Dependencia de desarrollo exacta |
| Vitest | 4.1.10 | Dependencia de desarrollo exacta |

Reglas de versionado:

- `package.json` declara versiones exactas, sin `^` ni `~`.
- `package-lock.json` se versiona y `npm ci` es la instalación normativa para CI y validación limpia.
- Cambiar una versión fijada requiere actualizar esta SPEC o una decisión sucesora aprobada.
- Se usa Node LTS; Node 26 Current no es la base de este milestone.

Las versiones se verificaron el 2026-08-06 contra la [tabla oficial de releases de Node.js](https://nodejs.org/en/about/previous-releases) y los metadatos publicados en npm para [Phaser](https://www.npmjs.com/package/phaser), [TypeScript](https://www.npmjs.com/package/typescript), [Vite](https://www.npmjs.com/package/vite), [Vitest](https://www.npmjs.com/package/vitest) y [npm](https://www.npmjs.com/package/npm).

## 5. Configuración técnica

### 5.1 TypeScript

Configuración obligatoria:

- modo `strict` activo;
- `noUncheckedIndexedAccess` activo;
- `exactOptionalPropertyTypes` activo;
- `noImplicitOverride` activo;
- `noFallthroughCasesInSwitch` activo;
- módulos ESM;
- APIs de navegador tipadas;
- código de producción sin `any` explícito salvo frontera documentada e inevitable;
- core crítico sin imports directos de Phaser.

### 5.2 Phaser y render

- Resolución lógica: 960 × 540 px.
- Escalado que preserve proporción y centre el canvas.
- Pixel art con nearest-neighbor y antialias desactivado.
- Fondo de Boot, selección y menú coherente con el sistema visual aprobado.
- Ningún control de gameplay está activo durante Boot.

### 5.3 Vite y entrega estática

- La aplicación produce archivos estáticos en `game/dist/`.
- El build no requiere servidor de aplicación.
- Las rutas de assets deben funcionar en una publicación estática y no depender de rutas absolutas del equipo.
- La ejecución normal no solicita fuentes a Google Fonts ni a otro CDN.
- No se incluyen secretos ni variables privadas en el bundle.

### 5.4 Vitest

- El entorno predeterminado de pruebas del core es Node.
- Las pruebas de escenas o DOM utilizan únicamente el entorno adicional estrictamente necesario.
- Las pruebas no requieren red ni servicios externos.

## 6. Comandos normativos

Los siguientes comandos se ejecutan desde `GameAssets/game/`:

| Comando | Resultado esperado |
|---|---|
| `npm install` | Crea o actualiza el lockfile únicamente durante mantenimiento intencional |
| `npm ci` | Instala exactamente el lockfile en un entorno limpio |
| `npm run dev` | Inicia el servidor local de Vite |
| `npm run typecheck` | Valida TypeScript estricto sin emitir archivos |
| `npm test` | Ejecuta Vitest una vez y termina |
| `npm run test:watch` | Ejecuta Vitest en modo interactivo local |
| `npm run build` | Produce `dist/` después de validar tipos |
| `npm run preview` | Sirve localmente el build generado para smoke test |
| `npm run check` | Ejecuta typecheck, pruebas y build en secuencia |

TASK-101 debe implementar estos scripts. No se exige lint hasta que exista una tarea o configuración explícita para incorporarlo.

## 7. Flujo de estados

### 7.1 Secuencia válida

1. La aplicación crea `BootScene` y el estado funcional es `Boot`.
2. Boot presenta feedback de progreso desde 0 % hasta 100 %.
3. Boot carga fuente local, manifiesto, locales y datos obligatorios.
4. `DataValidator` agrega y reporta todos los errores encontrados.
5. Si no hay errores y la fuente está realmente disponible, Boot emite `bootComplete`.
6. La máquina de estados permite `Boot → LanguageSelect`.
7. `LanguageSelectScene` ofrece exactamente Español y English.
8. El jugador selecciona una opción y la confirma.
9. `SessionSettings.language` conserva `es` o `en` durante la sesión.
10. La máquina de estados permite `LanguageSelect → Menu`.
11. `MenuScene` resuelve todos sus textos desde `LocalizationStore`.
12. La acción principal localizada queda preparada para iniciar una Run y entrar a `Intro`; esa transición se conecta funcionalmente cuando se implemente la oficina.

No se permite saltar directamente de Boot a Menu ni cambiar el idioma sin confirmación.

### 7.2 Controles

- Boot ignora teclado y ratón de gameplay.
- LanguageSelect permite navegación por teclado y selección por ratón.
- Deben existir foco visible, opción seleccionada y confirmación explícita.
- `Enter` confirma la opción enfocada.
- La selección de idioma no comienza automáticamente por pasar el cursor.
- Menu ofrece una acción principal clara y accesible por teclado y ratón.

## 8. Contrato de precarga

Boot considera obligatorios para este milestone:

- archivo WOFF2 de Geist Pixel Square;
- licencia y atribución versionadas junto a la fuente;
- manifiesto de assets;
- locales `es` y `en`;
- claves usadas por Boot, LanguageSelect, Menu y errores de carga;
- todos los assets runtime aprobados que `AssetManifest` declare obligatorios para el recorrido completo;
- datos disponibles en el milestone que `DataValidator` necesite para validar referencias iniciales.

El manifiesto inicial debe cubrir fuente, Player, Enemies, Projectiles, escenarios, UI, V4LK, corrupción y extracción, aunque una parte todavía no tenga consumidor jugable. Los datos definitivos que se incorporen en milestones posteriores deben usar el mismo contrato de Boot sin añadir rutas de carga paralelas.

El progreso visual representa recursos contabilizados por el cargador. Llegar a 100 % no autoriza la transición mientras la fuente o la validación sigan pendientes.

`AssetRegistry` debe distinguir al menos:

- clave estable;
- tipo de recurso;
- ruta relativa dentro del build;
- obligatoriedad;
- dimensiones o configuración de frames cuando sean críticas.

Una ruta válida en el equipo de desarrollo pero ausente del build se considera error.

Los contratos de datos deben permitir que Challenges y Encounters se carguen desde JSON externo, sin condicionales de contenido incrustados en las escenas. Cada Challenge podrá declarar identificador, categoría, modalidad, contenido, respuesta u opciones, límite de tiempo y daño. Cada Encounter podrá declarar Enemies, ataques, pool, HP, intervalos, daño, penalización y condición de finalización. TASK-102 fija los tipos y TASK-103 implementa su validación; el contenido definitivo se completa en las tareas de contenido posteriores.

## 9. Localización

### 9.1 Idiomas

Se admiten exactamente:

- `es`: español;
- `en`: inglés.

No existe fallback silencioso entre idiomas. Una clave obligatoria ausente en cualquiera de los dos locales bloquea el flujo durante Boot.

### 9.2 Claves iniciales mínimas

Los locales deben cubrir:

- nombre visible de cada idioma;
- título y ayuda de selección;
- acción de confirmación;
- título del juego;
- acción principal del menú;
- feedback de carga;
- título y detalle del error de carga;
- instrucciones de reintento o recarga;
- etiquetas accesibles necesarias para controles iniciales.

Las claves finales se definen en TASK-105 y deben ser idénticas entre `es.json` y `en.json`.

### 9.3 Texto y fuente

- Geist Pixel Square se sirve desde un WOFF2 local.
- Boot espera `document.fonts.load` y confirma disponibilidad antes de crear texto que dependa de sus métricas.
- El repertorio debe mostrar `¿`, `?`, `¡`, `!`, vocales acentuadas, `ñ` y `ü`.
- Fragmentos TypeScript, operadores y respuestas técnicas permanecen sin traducir cuando traducirlos alteraría su significado.
- Una clave desconocida produce un error identificable en desarrollo; no se muestra la clave cruda como experiencia normal de producción.
- El contrato de claves debe admitir, sin crear un sistema alterno, menús, diálogos, tutoriales, preguntas, instrucciones, resultados y mensajes del sistema que se incorporen en milestones posteriores.

### 9.4 Persistencia

- El idioma vive en `SessionSettings` durante la sesión de la página.
- Cambiar de escena, reiniciar una Run o volver al menú conserva el idioma.
- Recargar o cerrar la página puede reiniciar la selección; persistencia en almacenamiento local queda fuera de esta SPEC.

## 10. Menú inicial

Menu debe presentar:

- título `BugSlayer`;
- una acción principal equivalente a «Iniciar demo» / «Start demo»;
- feedback claro de foco, hover, pulsación y deshabilitado;
- composición legible a 960 × 540;
- texto resuelto íntegramente con el idioma confirmado.

Durante este milestone, activar la acción principal puede dirigir a una escena placeholder de integración o emitir `startRun` verificable sin implementar la oficina. La implementación definitiva de `OfficeScene` pertenece a SPEC-002.

## 11. Manejo de errores

### 11.1 Principio

Un fallo obligatorio detiene el inicio de la Run. La aplicación no continúa con assets faltantes, datos parciales, fuente sustituta silenciosa ni idioma incompleto.

### 11.2 Categorías identificables

| Código | Condición | Información mínima |
|---|---|---|
| `BOOT_ASSET_LOAD_FAILED` | Un archivo obligatorio no carga | clave y ruta lógica |
| `BOOT_FONT_LOAD_FAILED` | Geist Pixel Square no queda disponible | familia y recurso |
| `BOOT_MANIFEST_INVALID` | Manifiesto inválido o con claves duplicadas | errores agregados |
| `BOOT_DATA_INVALID` | Datos requeridos inválidos | archivo, campo y causa |
| `BOOT_LOCALE_INVALID` | Clave ausente o estructura desigual | idioma y clave |
| `BOOT_UNEXPECTED_ERROR` | Error no clasificado | identificador correlacionable sin exponer secretos |

### 11.3 Presentación

- El progreso deja de avanzar y aparece un panel localizado de error.
- El panel muestra un identificador corto y una acción para reintentar mediante recarga.
- Los detalles técnicos completos se registran en consola en desarrollo.
- Producción no muestra rutas absolutas, stack traces, tokens ni datos privados.
- No existe transición a LanguageSelect mientras persista el error.
- Si ocurren varios errores de validación, se agregan y se reportan juntos de forma determinista.

## 12. Validación y pruebas

### 12.1 Unitarias

- `GameStateMachine` permite únicamente Boot→LanguageSelect→Menu para este flujo.
- `SessionSettings` acepta solo `es` o `en` y conserva la selección.
- `LocalizationStore` resuelve claves y parámetros simples.
- `LocalizationStore` detecta una clave obligatoria ausente.
- `DataValidator` agrega errores de manifiesto, locales y datos.
- `AssetRegistry` rechaza claves duplicadas, tipos incorrectos y configuración crítica inválida.

### 12.2 Integración

- Boot válido llega a LanguageSelect.
- Fuente ausente impide abandonar Boot.
- Asset obligatorio ausente impide abandonar Boot.
- Locale incompleto impide abandonar Boot.
- Español confirmado llega a Menu en español.
- Inglés confirmado llega a Menu en inglés.
- Regresar o reiniciar escenas conserva el idioma de la sesión.
- La acción principal de Menu emite una única solicitud `startRun`.

### 12.3 Smoke test manual en Chrome

- El canvas aparece centrado y sin suavizado de pixel art.
- El progreso de Boot es visible.
- No se aceptan controles de gameplay durante Boot.
- Los caracteres españoles se muestran sin glifos faltantes.
- Teclado y ratón pueden seleccionar y confirmar idioma.
- Menu aparece en el idioma elegido.
- DevTools no registra solicitudes a Google Fonts ni a CDN de fuente.
- No existen errores bloqueantes ni errores de consola en el camino válido.
- El build servido desde `dist/` reproduce el mismo flujo.

## 13. Criterios de aceptación de SPEC-001

SPEC-001 se considera implementada cuando:

1. El proyecto existe únicamente bajo `game/` y respeta los límites del monorepo.
2. Las versiones fijadas y el lockfile permiten una instalación limpia con `npm ci`.
3. `npm run typecheck`, `npm test`, `npm run build` y `npm run check` terminan correctamente.
4. El build resultante es estático, autocontenido y no requiere backend.
5. Boot muestra progreso y bloquea input de gameplay.
6. Todos los recursos obligatorios del incremento se cargan antes de continuar.
7. Geist Pixel Square carga desde WOFF2 local y no genera solicitudes externas.
8. Un fallo obligatorio muestra un error identificable y evita iniciar la Run.
9. Los errores de datos se agregan de manera determinista.
10. El flujo válido es Boot→LanguageSelect→Menu sin saltos.
11. LanguageSelect ofrece exactamente español e inglés con confirmación explícita.
12. Menu usa el idioma seleccionado.
13. El idioma se conserva durante toda la sesión y al reiniciar escenas o volver al menú.
14. Los caracteres requeridos del español se renderizan correctamente.
15. La plantilla, datos y recursos usados por el incremento están incluidos en el build.
16. Las pruebas unitarias, de integración y el smoke test cubren los escenarios descritos.
17. No se cargan masters, temporales, chroma sources ni assets superseded.
18. No existen errores de consola durante el flujo válido en Chrome.

## 14. Trazabilidad

| Requisito | Decisiones y evidencia esperada |
|---|---|
| REQ-BOOT-001 | Secciones 7, 8, 11, 12 y criterios 5–10 |
| REQ-LOC-001 | Secciones 7 y 9, pruebas bilingües y criterios 11–14 |
| REQ-MENU-001 | Secciones 7 y 10, integración de `startRun` y criterio 12 |
| REQ-DATA-001 | Secciones 8, 9 y 11, pruebas de validación agregada |
| REQ-DELIVERY-001 | Secciones 3–6, smoke test de `dist/` y criterios 2–4 y 15 |

## 15. Decisiones y riesgos

- Se adopta Phaser 4 porque el proyecto no tiene código legado y es la versión estable vigente al crear esta SPEC.
- Node 24 LTS se prioriza sobre Node 26 Current para reducir variación del entorno.
- Los valores de gameplay, contratos completos de Encounter y Challenges pertenecen a tareas posteriores.
- No hay status checks remotos hasta que TASK-101 cree los comandos ejecutables y una tarea posterior configure CI.
- La apariencia debe seguir los assets de interfaz aprobados, pero esta SPEC no reabre decisiones artísticas.

## 16. Aprobación

Antes de marcar TASK-100 como completa deben confirmarse explícitamente:

- [ ] ubicación `game/`;
- [ ] versiones fijadas;
- [ ] comandos normativos;
- [ ] flujo Boot→LanguageSelect→Menu;
- [ ] contrato de localización y persistencia de sesión;
- [ ] política de error bloqueante;
- [ ] criterios de aceptación y pruebas.

La aprobación de esta SPEC autoriza iniciar TASK-101. No autoriza adelantar Office, gameplay ni contenido de SPEC-002.
