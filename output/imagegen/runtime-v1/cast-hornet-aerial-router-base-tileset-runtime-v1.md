# Instalación aérea invadida — tileset base runtime v1

## Entrega

- Archivo: `cast-hornet-aerial-router-base-tileset-runtime-v1.png`
- Lienzo: 256 × 256 px
- Retícula: 8 × 8
- Celda: 32 × 32 px
- Fondo: transparencia alfa real
- Alfa: binario, únicamente 0 y 255

## Filas

1. Suelos gris azulados y paneles de concreto tecnológico.
2. Transiciones, grietas, ventilación y conexiones de tipos.
3. Bordes suspendidos, esquinas y soportes inferiores.
4. Puentes, barandales, umbrales y conectores.
5. Fibras secas, fragmentos de nido y ventilación invadida.
6. Corrupción de conversión, sockets desplazados y cables rotos.
7. Cielo de software: bandas, cuadrículas y bloques de datos.
8. Corrientes de aire, ventilación, pilón y accesos modulares.

## Validación

- Suelos y cielo llenan completamente sus celdas.
- Estructuras y overlays conservan margen transparente.
- Residuos del fondo cromático eliminados.
- Sin miel, cera, líquidos dorados, texto o iconografía de abejas.
- Compatible con mapas amplios de terrazas y puentes.

## Generación

Herramienta integrada de generación de imágenes, caso `stylized-concept`. Fuente sobre `#FF00FF`, limpieza cromática y normalización mediante vecino más cercano.
