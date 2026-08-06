# Mutable Widow Lair — Base Tileset Runtime v1

## Entrega

- Archivo: `mutable-widow-lair-base-tileset-runtime-v1.png`
- Tamaño total: 256 × 256 px
- Retícula lógica: 8 columnas × 8 filas
- Celda runtime: 32 × 32 px
- Fondo: transparente (canal alfa real)
- Cámara: RPG top-down 3/4
- Uso: construcción modular de un mapa desplazable mayor que la pantalla

## Distribución

1. Suelos industriales oscuros y variantes de desgaste.
2. Transiciones, grietas, canales y residuos de telaraña.
3. Muros y límites tecnológicos reforzados con material de nido.
4. Corredores, alcobas, umbrales y boca de túnel.
5. Telarañas ambientales apagadas: líneas, diagonales, esquinas y parches.
6. Corrupción de reasignación: paneles duplicados, rutas desplazadas y conectores repetidos.
7. Arquitectura de nido: túnel, capullos, rejilla, anclas, pilares y conectores dobles.
8. Suelos de encuentro y transición para cámaras, ramificaciones y salidas.

## Estándar visual

- Grafito azulado, acero frío y carbón industrial.
- Cian técnico y verde ácido reservados para indicadores pequeños.
- Telarañas ambientales en azul grisáceo y violeta desaturado.
- Las redes ambientales tienen menor brillo que `Scope Web` para distinguir escenario y ataque.
- Vegetación casi inexistente; el hábitat se comunica mediante túneles, capullos, redes y soportes.
- Sin personajes, enemigos, proyectiles, texto, cuadrícula dibujada ni marcas de interfaz.

## Validación runtime

- Las piezas de suelo llenan por completo la celda de 32 × 32 px.
- Muros, redes y elementos estructurales conservan margen transparente.
- Ninguna pieza cruza el límite de su celda.
- Transparencia normalizada a alfa binario: 0 o 255.
- Los módulos permiten pasillos estrechos conectados con una cámara amplia y dos accesos de nido.

## Recomendación de montaje

- Usar pasillos conectados y cámaras parciales para que el área no se perciba completa en una sola pantalla.
- Colocar cada Mutable Widow en un acceso de nido distinto.
- Reservar los parches de red más densos para aproximarse a la cámara de encuentro.
- Evitar simetría perfecta: alternar grietas, canales y reasignaciones visuales refuerza el tema del enemigo.

## Siguiente asset

Atlas de props y telarañas del hábitat de Mutable Widow: anclas, capullos, terminales, soportes, restos atrapados, maquinaria inactiva y variantes de nido para ambas entradas.
