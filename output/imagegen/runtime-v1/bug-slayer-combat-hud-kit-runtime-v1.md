# Bug Slayer — kit runtime del HUD de combate v1

## Entrega

- Atlas: `bug-slayer-combat-hud-kit-runtime-v1.png`
- Tamaño: 960 × 160 px
- Fondo: transparencia RGBA
- Previews: español, inglés y comparativa bilingüe

## Componentes

- Marco de HP del jugador: 300 × 48 px, acento cian.
- Marco de HP enemigo: 300 × 48 px, acento rojo.
- Indicador de encuentro: 240 × 48 px.
- Puntaje: 240 × 36 px.
- Racha: 200 × 36 px.
- Mensaje breve de feedback: 440 × 36 px, acento ámbar.
- Rellenos segmentados para las dos barras de HP.
- Iconos de estado: invulnerabilidad, respuesta correcta, tiempo crítico y proyectiles extra.

## Reglas

- Los valores, nombres y etiquetas se cargan desde los diccionarios de idioma.
- Los rellenos de HP se recortan dinámicamente y no forman parte del marco.
- El feedback de respuesta incorrecta permanece estable durante 2 s sin desplazar el HUD.
- El color rojo se reserva para enemigo, peligro y penalización.
- Los iconos se distinguen por silueta además de color.

## Validación

- Probado sobre viewport real de 960 × 540 px.
- Español e inglés caben sin cambiar tamaños.
- El centro y la zona inferior del combate permanecen libres.
- Sin textos localizables incrustados en el atlas.

## Siguiente integración

Superponer el panel de desafío activo conservando el HUD superior sin cambios.
