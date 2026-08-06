# Senior Engineer — Fase 2 runtime v1

## Entregables

- `senior-engineer-attack-keyboard-runtime-v1.png`
- `senior-engineer-damage-runtime-v1.png`
- `senior-engineer-defeat-runtime-v1.png`

Estos archivos complementan:

- `senior-engineer-idle-runtime-v1.png`
- `senior-engineer-walk-runtime-v1.png`

## Geometría compartida

- Hoja: 384 × 512 px.
- Cuadrícula: 3 columnas × 4 filas.
- Celda: 128 × 128 px.
- Orden de filas: frente, izquierda, derecha, espalda.
- Orden de columnas:
  - Attack: primera pulsación, escritura central, segunda pulsación.
  - Damage: impacto, retroceso, recuperación.
  - Defeat: tambaleo, caída, pose derrotada.
- Línea de suelo: Y = 117 dentro de cada celda.
- Transparencia: RGBA binaria, únicamente alfa 0 o 255.
- Escalado: vecino más cercano.
- Sombra de suelo: eliminada.
- Perfil derecho: espejo exacto del perfil izquierdo.

## Decisiones visuales

### Typing attack

- Conserva el teclado y las posiciones diferenciadas de las manos.
- Mantiene la altura y la línea base de idle/walk.
- El cuerpo permanece registrado al centro de la celda.
- El teclado forma parte de la silueta y no produce recortes.

### Damage / hit

- Los frames 1 y 2 mantienen la escala original del personaje.
- Se eliminaron destellos y partículas desconectadas para evitar residuos aislados.
- El impacto se comunica mediante postura, expresión y retroceso.
- El frame 3 es idéntico al frame neutral de idle en cada dirección.

### Defeat

- Se conserva una escala constante durante tambaleo, caída y derrota.
- Los frames horizontales se anclan a la misma línea de suelo.
- La pose final mantiene al menos 9 px de margen lateral.
- Ningún miembro queda recortado.

## Validaciones

- Dimensiones y estructura: correctas.
- Alfa binario y esquinas transparentes: correctos.
- Izquierda/derecha opuestas y equivalentes: correctas.
- Línea de suelo uniforme: correcta.
- Recovery de damage e idle neutral: coincidencia exacta.
- Ausencia de sombras y partículas residuales: correcta.
- Lectura de gafas, barba, hoodie, jeans, zapatos y gafete: conservada.

## Masters protegidos

- Attack keyboard SHA-256:
  `FC2E3796ECF7BC96F90C21016ECDAC076E5AA5E8A8FE0A7F6DA5CC219D624293`
- Damage SHA-256:
  `79FB2BA50D1D6A2D0C3EB346413D234AE2538D12E891B6E36F1B842A0603C99F`
- Defeat SHA-256:
  `78FD141DE53E8EBB33CFA647F64C8676226C61C02136456BFF50106357836755`

Los masters no se reemplazan ni se modifican.
