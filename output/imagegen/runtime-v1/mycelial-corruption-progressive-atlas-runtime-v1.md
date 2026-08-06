# Corrupción micelial progresiva — atlas runtime v1

## Entrega

- Archivo: `mycelial-corruption-progressive-atlas-runtime-v1.png`
- Lienzo: 192 × 512 px
- Celda: 64 × 64 px
- Cuadrícula: 3 columnas × 8 filas
- Total: 24 celdas
- Transparencia: alfa binario
- Línea base interna: Y = 61

## Progresión por columnas

1. Contaminación inicial: presencia escasa y todavía localizada.
2. Propagación: la red micelial conecta y ocupa el elemento.
3. Dominio: el elemento queda completamente sometido al Monolito Micelial.

## Elementos por filas

1. Infección de raíces-cable.
2. Grietas y venas de esporas sobre el suelo.
3. Infección de tocón tecnológico en descomposición.
4. Toma de tallos de control.
5. Corrupción progresiva del carril de combate.
6. Conexión de cuatro cables para corromper al Boolean Beetle derrotado; el enemigo se compone aparte.
7. Brecha y soporte de aparición del Mycelial Monolith; el jefe se compone aparte.
8. Pulso ambiental sincronizado de la red micelial.

## Uso visual

- El atlas funciona como capa superpuesta sobre la arena existente de Boolean Beetle.
- No reemplaza el tileset ni modifica la geometría o las colisiones del escenario.
- Las columnas representan estados narrativos y pueden mantenerse en pantalla; no son un ciclo de reposo.
- Los efectos ambientales deben permanecer por debajo del brillo de ataques y proyectiles.
- Las filas 6 y 7 dejan libres al enemigo y al jefe para conservar su escala runtime independiente.

## Validación

- Las 24 celdas contienen un elemento visible.
- Todos los elementos quedan dentro de su celda y comparten la línea base definida.
- Paleta coherente con Mycelial Monolith: metal carbón, filamentos marfil/cobre, nodos naranja-rojo y residuos digitales fríos.
- Sin personajes, texto, bordes de celda, sombras de suelo ni fondo visible.
- Sin halo continuo ni residuos del croma `#FF00FF`.

## Generación

Herramienta integrada de generación de imágenes, caso `stylized-concept`. Fuente preservada sobre croma plano y versión runtime normalizada con vecino más cercano.
