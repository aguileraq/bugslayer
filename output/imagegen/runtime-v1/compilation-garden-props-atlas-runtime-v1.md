# Jardín de Compilación — atlas de props runtime v1

Archivo:

- `compilation-garden-props-atlas-runtime-v1.png`

## Propósito

Atlas de elementos decorativos, tecnológicos y narrativos para construir el escenario del tutorial contra Parse Mantis sobre el tileset base del Jardín de Compilación.

Los props se concentran cerca del perímetro para preservar la movilidad y la lectura de proyectiles en la zona central.

## Estructura

- Lienzo: `256 × 256 px`.
- Cuadrícula de props: `4 columnas × 4 filas`.
- Celda de prop: `64 × 64 px`.
- Equivalencia lógica: cada prop dispone de `2 × 2` tiles de `32 × 32 px`.
- Total: `16 props`.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Escalado: vecino más cercano.
- Línea de suelo común: `Y = 61` dentro de cada celda.
- Sombra proyectada: ninguna.

## Distribución

### Fila 1 — árboles de compilación

1. árbol de datos estable con raíces-circuito;
2. árbol bifurcado con nodos sintácticos visibles;
3. árbol moderadamente corrompido con rama duplicada;
4. árbol incompleto con copa parcialmente descargada.

### Fila 2 — vegetación artificial

5. conjunto compacto de plantas-circuito;
6. flores-sintaxis inspiradas en llaves, corchetes y paréntesis;
7. grupo de hongos de neón;
8. césped de datos con brotes y fragmentos verticales.

### Fila 3 — maquinaria de pruebas abandonada

9. terminal de prueba apagada;
10. terminal dañada con interferencia violeta controlada;
11. dron de mantenimiento inactivo y no hostil;
12. panel de tutorial obsoleto con iconos abstractos sin texto.

### Fila 4 — elementos narrativos exclusivos

13. Nodo de V4LK con proyector cian-violeta, sin holograma del perro;
14. nido de Parse Mantis: capullo mecánico, raíces negras, fragmentos de interfaz y acentos naranjas;
15. compuerta de compilación inactiva;
16. compuerta de compilación estabilizada, como estado estático abierto.

## Identidad visual

- Cámara top-down 3/4 consistente con el tileset base.
- Azul petróleo, grafito y negro azulado en estructuras.
- Verde digital moderado en vegetación.
- Cian para circuitos, diagnóstico y comunicación.
- Violeta para V4LK, interferencia y transición.
- Naranja restringido al nido y puntos de interacción.
- Pixel art de bordes duros, sin suavizado, gradientes ni halos.

## Reglas de colocación

- Los árboles, terminales y portales pueden ocupar visualmente hasta `2 × 2` tiles.
- La colisión debe ajustarse principalmente a la base visible, no a toda la copa de los árboles.
- Los hongos y plantas permanecen en los bordes y no deben confundirse con proyectiles.
- El Nodo de V4LK se sitúa cerca del Nodo de Inicialización del Senior, sin bloquearlo.
- El nido de Parse Mantis se coloca en el borde superior o superior derecho.
- La compuerta de salida se coloca detrás de Parse Mantis y permanece inactiva durante el combate.

## Validación

- Dimensiones verificadas: `256 × 256 px`.
- Dieciséis celdas exactas de `64 × 64 px`.
- Alfa binario verificado.
- Cuatro esquinas totalmente transparentes.
- Todos los props están centrados y contenidos en su celda.
- Línea de suelo normalizada en los dieciséis elementos.
- No hay personajes, V4LK visible, Parse Mantis, enemigos, proyectiles, HUD, texto, etiquetas, cuadrícula o marca de agua.

## Prompt de generación

Se solicitó una matriz `4 × 4` de props para el Jardín de Compilación, tomando como referencias el tileset base, la identidad mecánica de Parse Mantis y la paleta holográfica de V4LK. La fuente se generó sobre fondo uniforme `#FF00FF`; después se convirtió a alfa, se recortó por elemento y se normalizó a celdas runtime de `64 × 64 px`.

Modo utilizado: herramienta integrada de generación de imágenes, caso `stylized-concept`.

## Siguiente asset recomendado

Crear el **atlas animado de maquinaria y efectos ambientales** del Jardín de Compilación:

1. pulso del Nodo de Inicialización;
2. activación del Nodo de V4LK;
3. terminal dañada parpadeando;
4. dron intentando reiniciarse;
5. barreras digitales activándose y desactivándose;
6. portal de salida estabilizándose;
7. raíces-circuito transportando energía;
8. corrupción sintáctica con glitch discreto.

Después deberá producirse la composición final de la arena en sus estados narrativos principales.
