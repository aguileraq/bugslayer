# Parse Mantis — Fase 3 runtime v1

## Entregables

- `parse-mantis-idle-runtime-v1.png`
- `parse-mantis-linear-attack-runtime-v1.png`
- `parse-mantis-damage-runtime-v1.png`
- `parse-mantis-defeat-runtime-v1.png`

El archivo `parse-mantis-concept-sheet.png` se utilizó únicamente como referencia
de identidad visual.

## Estándar runtime

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Escala desde master: 25%, sin interpolación.
- Orden de filas: frente/abajo, izquierda, derecha, espalda/arriba.
- Línea de suelo: límite inferior Y = 117 dentro de cada celda.
- Transparencia: RGBA binaria, alfa 0 o 255.
- Sombra de suelo: eliminada.
- Perfil derecho: espejo exacto del perfil izquierdo.
- Margen mínimo observado: 6 px durante el ataque; 9 px en defeat.

Parse Mantis conserva una altura similar a la del Senior Engineer contando las
antenas, pero presenta casi el doble de anchura en su pose neutral. Esto mantiene
la compatibilidad con celdas de 128 px y lo hace visualmente más grande y
amenazante que el jugador.

## Secuencias

### Idle

1. Entrada de energía.
2. Pose neutral.
3. Pulso o escaneo.

La escala, el cuerpo central y la línea de suelo permanecen estables. Los cambios
se concentran en las antenas, el núcleo y pequeños acentos de energía.

### Linear attack

1. Carga.
2. Descarga lineal.
3. Recuperación.

El punto visual de disparo sigue el eje frontal central situado entre las pinzas.
En perfiles aparece en la pinza delantera. En la vista trasera, donde las pinzas
quedan ocultas, el destello se muestra en el borde frontal superior del chasis.
La carga y la descarga traseras fueron reubicadas para que apunten hacia arriba.

El frame de recuperación coincide píxel por píxel con el neutral de idle en las
cuatro direcciones.

### Damage / hit

1. Impacto.
2. Retroceso mecánico.
3. Recuperación.

Los destellos permanecen contenidos en la celda y desaparecen completamente en
la recuperación. El tercer frame coincide píxel por píxel con idle neutral.

### Defeat

1. Falla crítica.
2. Colapso.
3. Pose inerte.

La progresión mantiene una escala constante. Las poses finales conservan margen,
no presentan piezas cortadas y pueden mantenerse en pantalla como estado final.

## Validaciones

- Dimensiones 384 × 512: correctas.
- Celdas 128 × 128: correctas.
- Alfa binario y fondo transparente: correctos.
- Línea inferior Y = 117 en todos los frames: correcta.
- Izquierda/derecha opuestas y equivalentes: espejo exacto.
- Attack recovery e idle neutral: coincidencia exacta.
- Damage recovery e idle neutral: coincidencia exacta.
- Antenas, patas, brazos y efectos sin recortes: correctos.
- Efectos sin residuos en los frames de recuperación: correctos.
- Escala relativa frente al Senior Engineer: correcta.

## Masters protegidos

- Concept sheet SHA-256:
  `8B073BBA1D5B935A88129BE6E22B26AD6A10FB37E36287B357B06AF943D758FC`
- Idle SHA-256:
  `C1A7FA268EED25D20D5FABFB7136798D2502A4FBA08B0A3B7C1C24F07EBB33BD`
- Linear attack SHA-256:
  `E277D8C558DB2ACEFB2CEEC25EA05FB02CD5BD9543C4A719E5D56C156448BEDC`
- Damage SHA-256:
  `CC10B158A60E5AE99910278F6F1E19DE5E5BDE9381105C9C9464758ECC9DB032`
- Defeat SHA-256:
  `5C6B30D7D9C8A08A5FDF2FB83C317DE3DAC1235A8C4A723EFB8924224EEE960A`

Los masters y el concept sheet no se reemplazan ni se modifican.

## Siguiente prioridad

Creación de proyectiles y efectos de ataque:

1. Proyectil lineal de Parse Mantis.
2. Proyectil radial del juego.
