# Guarida de Mutable Widow — atlas de props runtime v1

## Entrega

- Archivo: `mutable-widow-lair-props-atlas-runtime-v1.png`
- Lienzo: 256 × 256 px
- Cuadrícula: 4 columnas × 4 filas
- Celda de prop: 64 × 64 px
- Equivalencia: cada prop dispone de 2 × 2 tiles de 32 × 32 px
- Total: 16 props
- Fondo: transparencia alfa real
- Alfa: binario, únicamente 0 y 255
- Escalado: vecino más cercano
- Línea de suelo común: Y = 61 dentro de cada celda
- Sombras proyectadas: ninguna

## Distribución

### Fila 1 — anclas y soportes de red

1. Ancla compacta de suelo con cables e indicador cian.
2. Ancla de unión entre muro y suelo con refuerzo quitinoso.
3. Pilón vertical reforzado con ganchos para fibras.
4. Soporte roto con cables cortados y red desgarrada.

### Fila 2 — capullos y restos atrapados

5. Capullo mecánico individual.
6. Grupo de tres capullos de distinto tamaño.
7. Capullo vacío y fracturado.
8. Equipo informático abandonado atrapado en telarañas.

### Fila 3 — terminales y maquinaria inactiva

9. Terminal de mantenimiento apagada.
10. Consola de reasignación con módulos duplicados.
11. Bobina de cable y unión eléctrica enredada.
12. Mecanismo de mantenimiento con brazos plegados.

### Fila 4 — nidos y elementos del hábitat

13. Entrada de nido orientada hacia la izquierda.
14. Entrada opuesta de nido orientada hacia la derecha.
15. Conjunto de capullos mecánicos sobre base baja.
16. Distribuidor central de red con cuatro brazos de anclaje.

## Identidad visual

- Cámara RPG top-down 3/4 consistente con el tileset base.
- Metal grafito azulado, acero frío y refuerzos quitinosos oscuros.
- Cian restringido a indicadores técnicos pequeños.
- Telarañas azul grisáceo y violeta desaturado.
- Las redes ambientales tienen menos brillo que el ataque `Scope Web`.
- Sin vegetación significativa, personajes, enemigos, proyectiles, texto o interfaz.

## Reglas de colocación

- Las entradas 13 y 14 forman el par de nidos para las dos Mutable Widows.
- Los capullos y soportes deben concentrarse en los bordes y alcobas.
- La terminal y la consola pueden utilizarse como puntos narrativos sin bloquear el corredor principal.
- El distribuidor central funciona como elemento de lectura del hábitat, no como objetivo de combate.
- La colisión debe ajustarse a la base visible del prop, no a toda su altura.

## Validación

- Dimensiones verificadas: 256 × 256 px.
- Dieciséis celdas exactas de 64 × 64 px.
- Dieciséis props presentes y contenidos dentro de su celda.
- Alfa binario verificado.
- Centrado horizontal y línea de suelo normalizados.
- Ningún prop queda cortado ni invade una celda vecina.

## Generación

Modo utilizado: herramienta integrada de generación de imágenes, caso `stylized-concept`.

Referencias utilizadas: tileset base de la guarida, reposo de Mutable Widow y efectos de `Scope Web`. La fuente se creó sobre fondo uniforme `#FF00FF`, se convirtió a alfa y se normalizó mediante vecino más cercano.

## Siguiente asset recomendado

Crear el **atlas animado de maquinaria y efectos ambientales** de la guarida:

1. vibración leve de telarañas;
2. tensión y relajación de fibras de anclaje;
3. indicadores de terminal parpadeando;
4. consola de reasignación desplazando su señal;
5. capullo con movimiento ambiental sutil;
6. mecanismo de mantenimiento intentando activarse;
7. pulsación del distribuidor central;
8. agitación de ambas entradas de nido antes del encuentro.

Después corresponderá construir la composición general del área y sus estados narrativos.
