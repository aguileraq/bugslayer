# Guarida de Mutable Widow — maquinaria y efectos ambientales runtime v1

## Entrega

- Archivo: `mutable-widow-lair-machinery-effects-runtime-v1.png`
- Lienzo: 192 × 512 px
- Frame: 64 × 64 px
- Cuadrícula: 3 columnas × 8 filas
- Total: 24 frames
- Cada fila contiene una animación de tres frames
- Fondo: transparencia alfa real
- Alfa: binario, únicamente 0 y 255
- Línea de suelo: Y = 61 dentro de cada frame
- Sombras: ninguna

## Columnas

1. Reposo o preparación.
2. Punto máximo del movimiento.
3. Retorno o estabilización.

## Filas

1. Vibración de red conectada a un ancla.
2. Tensión de fibras alrededor de un capullo mecánico.
3. Terminal de mantenimiento: apagada, escaneo y reposo.
4. Consola de reasignación: señal desplazada entre módulos duplicados.
5. Entrada circular del nido: presión interna y apertura oscura.
6. Mecanismo inactivo: diagnóstico, movimiento del brazo y nuevo reposo.
7. Distribuidor central: pulso secuencial por sus cuatro anclas.
8. Entrada de nido: aviso previo a la aparición del enemigo.

## Identidad y validación

- Misma cámara, materiales y paleta que tileset y props.
- Telarañas ambientales en violeta apagado, siempre menos intensas que `Scope Web`.
- Escala y silueta estables entre los tres frames de cada fila.
- Veinticuatro frames presentes y contenidos dentro de su celda.
- Alfa binario y escalado mediante vecino más cercano.
- Sin enemigos, proyectiles, texto, cuadrícula, sombras o marcas de agua.

## Generación

Modo utilizado: herramienta integrada de generación de imágenes, caso `stylized-concept`.

Se utilizaron como referencias el tileset base, el atlas de props y el efecto hostil `Scope Web`. La fuente se generó sobre fondo `#FF00FF`, se convirtió a alfa y se normalizó a frames de 64 × 64 px.
