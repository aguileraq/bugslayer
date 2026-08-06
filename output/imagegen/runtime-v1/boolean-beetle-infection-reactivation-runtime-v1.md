# Boolean Beetle — infección y reactivación runtime v1

## Entrega

- Archivo: `boolean-beetle-infection-reactivation-runtime-v1.png`
- Lienzo: 768 × 128 px
- Celda: 128 × 128 px
- Estructura: 6 columnas × 1 fila
- Dirección: frente / abajo
- Transparencia: alfa binario
- Línea base: Y = 117

## Alcance narrativo

Esta animación ocurre en una posición fija durante la cinemática final. Boolean Beetle ya está orientado hacia el Senior Engineer, por lo que no necesita repetirse en las otras tres direcciones.

## Secuencia

1. **Apagado:** se conserva exactamente la pose final de derrota.
2. **Primer contacto:** un cable micelial alcanza el caparazón inmóvil.
3. **Conexión:** la red se extiende y el cuerpo comienza a recuperar altura bajo un pulso rojizo.
4. **Toma de control:** cuatro terminales rodean al Beetle; el cuerpo se incorpora y la infección domina los canales.
5. **Conversión:** aparece la identidad infectada aprobada y los cables empiezan a retraerse.
6. **Reactivado:** el Beetle queda estable en el frame neutral de su reposo infectado.

## Continuidad

- Los frames 1–4 reutilizan la derrota en sentido inverso para recuperar la postura sin inventar una anatomía intermedia.
- Los frames 5–6 proceden directamente del spritesheet infectado aprobado.
- La escala, el ancho corporal, las seis patas, las dos placas y los dos cuernos permanecen constantes.
- El último frame puede enlazarse directamente con `boolean-beetle-infected-idle-runtime-v1.png`.

## Validación

- Seis frames presentes y no vacíos.
- Alfa limitado a 0 y 255.
- Línea base compatible con derrota, reposo normal y reposo infectado.
- Sin sombras, texto, fondo, fragmentos externos ni residuos cromáticos.
- Caparazón siempre cerrado; no aparecen alas, explosiones o desmembramiento.
- La infección se lee como control externo del Mycelial Monolith, no como recuperación natural.

## Montaje

Composición determinista con los assets runtime aprobados: derrota de Boolean Beetle, reposo infectado y atlas de corrupción micelial. Se aplicó vecino más cercano y no se modificaron los masters.

## Siguiente asset recomendado

Composición narrativa posterior a la reactivación: Mycelial Monolith activo, Boolean Beetle infectado de pie y V4LK advirtiendo al Senior antes de iniciar la extracción.
