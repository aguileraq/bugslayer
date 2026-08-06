# Validación conjunta — Prioridad 3: proyectiles y efectos

## Resultado

**Aprobado: 16 de 16 assets.**

No se requieren correcciones visuales o técnicas antes de cerrar la prioridad.
Los masters y los archivos runtime existentes permanecieron intactos.

## Inventario

### Parse Mantis

1. `parse-mantis-linear-projectile-runtime-v1.png`
2. `parse-mantis-linear-projectile-impact-runtime-v1.png`
3. `radial-projectile-runtime-v1.png`
4. `radial-projectile-impact-runtime-v1.png`

### Mutable Widow

5. `mutable-widow-reassignment-volley-projectile-runtime-v1.png`
6. `mutable-widow-reassignment-volley-impact-runtime-v1.png`
7. `mutable-widow-scope-web-effects-runtime-v1.png`

### Cast Hornet

8. `cast-hornet-casting-swarm-projectiles-runtime-v1.png`
9. `cast-hornet-casting-swarm-impact-runtime-v1.png`

### Boolean Beetle

10. `boolean-beetle-boolean-burst-projectiles-runtime-v1.png`
11. `boolean-beetle-boolean-burst-impact-runtime-v1.png`
12. `boolean-beetle-xor-crossfire-projectiles-runtime-v1.png`
13. `boolean-beetle-xor-crossfire-impact-runtime-v1.png`
14. `boolean-beetle-false-path-decoy-routes-runtime-v1.png`
15. `boolean-beetle-false-path-projectiles-runtime-v1.png`
16. `boolean-beetle-false-path-impact-runtime-v1.png`

Cada PNG cuenta con su ficha `.md` correspondiente.

## Validación técnica

| Asset | Dimensiones | Margen mínimo | Resultado |
|---|---:|---:|---|
| Parse — proyectil lineal | 96 × 128 | 2 px | Aprobado |
| Parse — impacto lineal | 128 × 128 | 2 px | Aprobado |
| Proyectil radial | 96 × 32 | 5 px | Aprobado |
| Impacto radial | 128 × 32 | 3 px | Aprobado |
| Mutable — Reassignment Volley | 96 × 128 | 3 px | Aprobado |
| Mutable — impacto Volley | 128 × 128 | 4 px | Aprobado |
| Mutable — Scope Web | 128 × 96 | bordes conectables | Aprobado |
| Cast — Casting Swarm | 96 × 128 | 2 px | Aprobado |
| Cast — impacto Swarm | 128 × 128 | 2 px | Aprobado |
| Boolean Burst | 128 × 64 | 3 px | Aprobado |
| Boolean Burst — impacto | 128 × 64 | 2 px | Aprobado |
| XOR Crossfire | 96 × 256 | 2 px | Aprobado |
| XOR Crossfire — impacto | 128 × 256 | 2 px | Aprobado |
| False Path — rutas falsas | 128 × 128 | 2 px | Aprobado |
| False Path — proyectiles | 96 × 256 | 2 px | Aprobado |
| False Path — impacto | 128 × 256 | 2 px | Aprobado |

Comprobaciones superadas:

- celdas runtime de `32 × 32 px`;
- dimensiones compatibles con la cuadrícula declarada;
- transparencia RGBA binaria, únicamente alfa `0` y `255`;
- ninguna celda vacía;
- ningún residuo visible del fondo cromático;
- ningún elemento cortado accidentalmente;
- simetrías y rotaciones direccionales correctas;
- máscaras equivalentes entre variantes TRUE/FALSE;
- 16 PNG y 16 fichas de especificación presentes.

### Excepción intencional

Los segmentos horizontales y verticales de Scope Web tocan sus bordes
correspondientes. Esto es correcto y necesario para repetirlos como tiles sin
separaciones. Los nodos circulares permanecen contenidos dentro de sus celdas.

## Validación visual

### Legibilidad por encuentro

- **Parse Mantis:** el proyectil lineal naranja y el radial
  carmesí-violeta se distinguen de inmediato.
- **Mutable Widow:** el par de Reassignment Volley conserva separación estable;
  Scope Web utiliza nodos y carriles cian-lima claramente diferentes.
- **Cast Hornet:** Casting Swarm mantiene tres fragmentos reconocibles —cian,
  amarillo y violeta— durante vuelo e impacto.
- **Boolean Beetle:** cada patrón tiene silueta propia:
  - Boolean Burst: orbe circular;
  - XOR Crossfire: dardo bifurcado diagonal;
  - False Path: cursor sólido cardinal;
  - rutas falsas: circuitos azul petróleo sin punta activa.

### Continuidad de animación

- Los impactos conservan la paleta y la geometría de su proyectil de origen.
- Las secuencias de vuelo tienen pulsos estables y no cambian de escala de forma
  accidental.
- Las secuencias de impacto progresan claramente desde contacto hasta
  disipación.
- Las direcciones opuestas no introducen cambios de diseño.

## Conclusión

La Prioridad 3 puede marcarse como **cerrada y validada**. Se recomienda
conservar `runtime-v1` como línea base aprobada y realizar cambios posteriores
mediante nuevas versiones, sin sobrescribir estos archivos.

La siguiente etapa es iniciar la **Prioridad 4** de assets.
