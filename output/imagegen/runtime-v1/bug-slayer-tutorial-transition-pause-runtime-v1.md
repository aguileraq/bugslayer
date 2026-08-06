# Bug Slayer — tutorial, transición y pausa runtime v1

## Archivos

- Kit: `bug-slayer-tutorial-transition-kit-runtime-v1.png`, 960 × 256 px.
- Pausa: `bug-slayer-pause-menu-frame-runtime-v1.png`, 480 × 320 px.
- Previews bilingües de tutorial, transición y pausa.

## Tutorial

- Panel modular de 448 × 132 px.
- Espacio de icono y área de instrucciones independientes.
- Indicador de paso, por ejemplo `1/3`, generado como texto dinámico.
- El tutorial puede ubicarse en una esquina sin cubrir al jugador.
- Las instrucciones iniciales priorizan movimiento, esquiva y respuesta.

## Transición

- Banner modular de 640 × 104 px.
- Presenta número de encuentro, nombre del enemigo y una línea narrativa.
- La escena inferior se atenúa sin alterar su geometría.
- Nombres propios de enemigos permanecen iguales en ambos idiomas.

## Pausa

- Tres acciones: continuar, reiniciar y salir al menú.
- No incluye una opción de configuración dentro del alcance actual.
- Solo puede mostrarse desde `Playing`.
- Nunca debe abrirse desde `Challenge`, incluso si se pulsa ESC.
- La escena queda congelada y atenuada detrás del panel.

## Localización

Todos los textos se aplican dinámicamente desde español o inglés; los marcos runtime están libres de texto.

## Validación

- Las traducciones caben sin variar el tamaño de los componentes.
- El tutorial no parece un menú modal.
- La transición se diferencia del panel de desafío.
- La pausa se reconoce como estado bloqueante.
