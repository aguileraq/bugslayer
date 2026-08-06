# Clasificación de assets previa al primer staging

## Alcance

Inventario generado para TASK-014. El proyecto Phaser todavía no existe, por lo que no se copiaron archivos a `game/public/assets/`. La columna `future_destination` de `ASSET-INVENTORY.csv` registra el destino previsto de forma no destructiva.

## Resultado

- Binarios inventariados: 294.
- Runtime aprobados: 94.
- Licencias y atribuciones: 1.
- Referencias y validaciones no runtime: 75.
- Masters, conceptos y exports heredados: 28.
- Temporales e intermediarios: 79.
- Superseded o rechazados: 17.
- Sin clasificar: 0.

## Política del primer staging

1. La documentación raíz, políticas y configuración se versionan primero.
2. Los binarios con `staging_policy=stage-runtime` son los únicos candidatos de arte para migración futura al runtime.
3. `license-attribution` debe acompañar a la fuente correspondiente.
4. `temporary-intermediate` nunca debe entrar al repositorio.
5. `superseded-rejected` y `validation-reference` no entran al build.
6. Masters y conceptos se conservan sin modificación, pero se excluyen del primer staging hasta decidir su ubicación definitiva bajo `assets-source/`.
7. No usar `git add .`; TASK-015 debe emplear rutas explícitas revisadas.

## Reglas de procedencia

- Los PNG bajo `output/imagegen/runtime-v1/` se relacionan con su archivo Markdown homónimo cuando existe.
- Los assets sin Markdown homónimo conservan como procedencia su ruta actual y la documentación de validación del grupo.
- Geist Pixel Square proviene del paquete oficial de Vercel y conserva `README.md` y `OFL.txt`.
- `output/` y `sprite-export/` siguen siendo ubicaciones heredadas; este inventario no autoriza eliminar ni mover masters.

## Decisiones aplicadas

- Las composiciones, previews, comparativas, hojas conceptuales y validaciones se clasifican como referencias, aunque su nombre contenga `runtime-v1`.
- Las pantallas de victoria se excluyen porque el alcance vigente termina mediante extracción y `DemoEnd`.
- Las variantes antiguas reemplazadas por una versión posterior se marcan como superseded.
- Los archivos que comienzan con guion bajo y las fuentes chroma/alpha se consideran intermediarios.

## Archivos

- `ASSET-INVENTORY.csv`: inventario exhaustivo y política por archivo.
- `.gitignore`: reglas para impedir staging accidental de intermediarios.
- `tasks.md`: estado de TASK-014.
