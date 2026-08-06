# Escenario Inicial — atlas de props runtime v1

Archivo:

- `initial-office-props-atlas-runtime-v1.png`

## Estructura

- Lienzo: `256 × 256 px`.
- Celda: `32 × 32 px`.
- Cuadrícula lógica: `8 columnas × 8 filas`.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Escalado: vecino más cercano.
- Sombra: ninguna.

## Distribución

### Filas 1 y 2

Cuatro escritorios de `2 × 2` celdas:

1. escritorio limpio;
2. escritorio con cajonera izquierda;
3. escritorio con cajonera derecha;
4. estación preparada con computadora apagada.

### Fila 3

Ocho módulos informáticos de `1 × 1` celda:

- monitor apagado frontal;
- monitor apagado en perfil izquierdo;
- monitor apagado en perfil derecho;
- teclado;
- ratón;
- torre frontal;
- torre lateral;
- módulo compacto de cableado/energía.

### Filas 4 y 5

Cuatro orientaciones de la misma silla ergonómica, cada una dentro de una asignación de `2 × 2` celdas:

- frente/abajo;
- izquierda;
- derecha;
- espalda/arriba.

### Filas 6 y 7

Cuatro props grandes de `2 × 2` celdas:

- rack de servidores frontal;
- rack lateral/posterior;
- planta alta, variante A;
- planta alta, variante B.

### Fila 8

- aire acondicionado interior, variante A, `2 × 1` celdas;
- aire acondicionado interior, variante B, `2 × 1` celdas;
- dos cajoneras compactas;
- cubierta de cableado;
- módulo utilitario compatible.

## Regla del aire acondicionado

- Se instala contra la cara interior del muro inferior.
- La cámara muestra principalmente su cubierta superior.
- No se representa una rejilla frontal visible.
- Este atlas contiene únicamente el cuerpo estático; el flujo de aire se generará como efecto separado.

## Identidad visual

- Grafito y azul petróleo para mobiliario.
- Superficies de escritorio en marrón carbón.
- Monitores y torres apagados.
- Rack oscuro con indicadores pequeños y restringidos.
- Planta en verde desaturado y maceta cilíndrica de grafito.
- Carcasa del aire acondicionado en gris claro cálido.
- Pixel art de bordes duros, sin suavizado ni gradientes.

## Validación

- Dimensiones verificadas: `256 × 256 px`.
- Sesenta y cuatro celdas lógicas de `32 × 32 px`.
- Alfa binario verificado.
- Cuatro esquinas transparentes.
- Fondo cromático eliminado.
- Sin texto, etiquetas, cuadrícula dibujada, personajes, sombras o props fuera de la lista aprobada.
- Ningún prop queda cortado por el borde del atlas.

## Prompt de generación

Se solicitó un atlas cuadrado de props para la oficina inicial, organizado sobre una estructura lógica de `8 × 8`. Incluye escritorios, equipo informático apagado, sillas en cuatro orientaciones, rack de servidores, plantas, aire acondicionado interior y módulos auxiliares. La fuente se generó sobre fondo uniforme `#FF00FF`, se convirtió a transparencia alfa y se normalizó a `256 × 256 px` mediante vecino más cercano.

## Siguiente asset recomendado

Atlas animado de maquinaria y efectos ambientales:

1. botón de encendido parpadeante;
2. monitor encendiéndose y barra de carga;
3. indicadores del rack;
4. flujo de aire del aire acondicionado.

Después deberá producirse la materialización y el reposo del perro holográfico con el diseño v4 aprobado.
