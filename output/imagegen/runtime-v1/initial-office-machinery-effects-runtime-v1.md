# Escenario Inicial — maquinaria y efectos ambientales runtime v1

Archivo:

- `initial-office-machinery-effects-runtime-v1.png`

## Estructura

- Lienzo: `256 × 256 px`.
- Celda: `32 × 32 px`.
- Cuadrícula lógica: `8 columnas × 8 filas`.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Escalado: vecino más cercano.
- Sombra: ninguna.

## Distribución

### Fila 1 — torre y botón

Columnas 1 a 4:

1. torre apagada;
2. indicador ámbar tenue;
3. indicador ámbar brillante con pulso controlado;
4. indicador cian después de la activación.

Columnas 5 a 8:

1. punto cian compacto;
2. anillo pequeño;
3. anillo máximo;
4. contracción.

Los cuatro últimos frames son overlays de activación independientes.

### Fila 2 — encendido y carga del monitor

1. monitor apagado;
2. línea de ignición cian;
3. pantalla cian oscura;
4. barra vacía;
5. carga inicial;
6. carga media;
7. carga avanzada;
8. carga completa.

La secuencia no contiene letras, números ni texto legible.

### Filas 3 y 4 — rack de servidores

Cuatro frames de `2 × 2` celdas:

1. rack casi apagado;
2. indicadores cian dispersos;
3. actividad máxima con diagnósticos ámbar puntuales;
4. regreso a actividad cian moderada.

La carcasa y los módulos permanecen inmóviles; solo cambian los indicadores.

### Filas 5 y 6 — aire acondicionado completo

Cuatro frames de `2 × 2` celdas:

1. flujo corto;
2. flujo medio;
3. flujo largo;
4. disipación y retorno.

El equipo se mantiene dentro del cuarto, visto principalmente desde arriba. La carcasa conserva la misma posición y escala en toda la secuencia.

### Filas 7 y 8 — overlays de aire

Cuatro frames de `2 × 2` celdas, sin cuerpo de aire acondicionado:

1. flujo corto;
2. flujo medio;
3. flujo largo;
4. disipación.

Estos overlays permiten colocar el efecto sobre el prop estático sin duplicar la maquinaria.

## Ritmo visual recomendado

- Botón parpadeante: ciclo lento y claramente perceptible.
- Encendido del monitor: secuencia de una sola ejecución.
- Barra de carga: avance escalonado, sin retroceso.
- Rack: ciclo ambiental irregular pero discreto.
- Aire acondicionado: ciclo continuo ligeramente más rápido que el rack.

## Identidad visual

- Maquinaria en grafito y grises oscuros.
- Aire acondicionado en gris claro cálido.
- Activación y flujo en cian/azul hielo.
- Diagnósticos secundarios en ámbar.
- Pixel art de bordes duros, sin suavizado, gradientes ni resplandor blando.

## Validación

- Dimensiones verificadas: `256 × 256 px`.
- Sesenta y cuatro celdas lógicas de `32 × 32 px`.
- Alfa binario verificado.
- Cuatro esquinas transparentes.
- Fondo cromático eliminado.
- Sin texto, etiquetas, cuadrícula dibujada, personajes, sombras, holograma o elementos del escenario.
- Ningún frame queda cortado en el borde del atlas.

## Prompt de generación

Se solicitó un atlas cuadrado de maquinaria animada con torre, pulso de activación, monitor y carga, rack de servidores, aire acondicionado interior y overlays de flujo. La fuente se produjo sobre fondo uniforme `#FF00FF`, se convirtió a transparencia alfa y se normalizó a `256 × 256 px` mediante vecino más cercano.

## Siguiente asset recomendado

Materialización y reposo del perro holográfico con el diseño v4 aprobado:

1. aparición de abajo hacia arriba;
2. estabilización;
3. reposo pulsante;
4. movimiento discreto de oreja y cola;
5. interferencia breve.
