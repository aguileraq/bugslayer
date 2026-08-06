# Bug Slayer — Boot, menú e introducción runtime v1

## Archivos

- Boot: `bug-slayer-boot-screen-runtime-v1.png`, 960 × 540 px.
- Menú sin texto: `bug-slayer-main-menu-background-runtime-v1.png`, 960 × 540 px.
- Panel de introducción: `bug-slayer-intro-panel-frame-runtime-v1.png`, 800 × 168 px.
- Previews bilingües de menú e introducción.
- Comparativa: `bug-slayer-boot-menu-intro-bilingual-comparison-runtime-v1.png`.

## Flujo

1. Boot y precarga, sin texto dependiente del idioma.
2. Selección de idioma.
3. Menú principal localizado.
4. Introducción narrativa localizada.
5. Inicio del Escenario Inicial.

## Menú principal

- Acción primaria: iniciar demo.
- Acción secundaria: volver a seleccionar idioma.
- No se incluye `Salir`, porque el MVP se ejecuta en navegador.
- Los dos botones utilizan jerarquía visual diferente y texto dinámico.

## Introducción

- Panel inferior con espacio de identidad, texto narrativo y progreso.
- Admite entre tres y cinco paneles según el GDD.
- Enter o clic avanza al siguiente panel.
- La primera validación utiliza el despertar del Senior y su duda sobre la computadora parpadeante.
- La habitación original de 480 × 384 se presenta completa y centrada dentro del viewport 16:9, sin recortes.

## Localización

- Boot y logotipo no requieren traducción.
- Menú, narrativa, contador y ayuda se cargan desde JSON.
- El marco runtime no contiene texto incrustado.

## Validación

- Español e inglés utilizan la misma composición.
- No se introduce una pantalla adicional de llegada a la base al final del demo.
- La selección de idioma ocurre antes de mostrar narrativa localizada.
