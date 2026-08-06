# Mutable Widow — Efectos de Scope Web runtime v1

## Entregable

- `mutable-widow-scope-web-effects-runtime-v1.png`

## Estructura

- Atlas: 128 × 96 px.
- Cuadrícula lógica: 4 columnas × 3 filas.
- Celda: 32 × 32 px.
- Columnas: advertencia, conexión, activo y disipación.
- Fila 1: nodo circular.
- Fila 2: segmento horizontal repetible.
- Fila 3: segmento vertical repetible.

## Nodo

1. Anillo petróleo oscuro con señales cian tenues.
2. Anillo cian conectado con acento verde lima.
3. Núcleo blanco-cian con abrazaderas exteriores verde lima.
4. Fragmentos circulares que se disipan hacia dentro.

Los nodos mantienen margen interno y pueden utilizarse como extremos de los
carriles.

## Carriles

### Horizontal

- Segmento recto centrado verticalmente.
- Toca intencionalmente los bordes izquierdo y derecho.
- Puede repetirse para construir cualquier longitud.

### Vertical

- Rotación funcional de 90 grados.
- Toca intencionalmente los bordes superior e inferior.
- Conserva el mismo grosor y ciclo visual.

Los estados de advertencia y disipación son discontinuos; conexión utiliza una
línea delgada cian-lima; activo aumenta a cuatro píxeles con núcleo blanco-cian.

## Validación

- Dimensiones: 128 × 96 px.
- Doce celdas de 32 × 32 px.
- Transparencia RGBA binaria: alfa 0 o 255.
- Nodos contenidos con margen mínimo de 5 px.
- Segmentos horizontales conectan ambos bordes laterales.
- Segmentos verticales conectan ambos bordes verticales.
- Sin residuos magenta.
- Sin sombras, suavizado o gradientes.

## Proceso

La fuente se generó con la herramienta integrada de imágenes usando la hoja
conceptual y la animación corporal Scope Web como referencias. El PNG conceptual
se convirtió temporalmente a JPEG para compatibilidad sin modificar el master.
Después de retirar el fondo cromático, los nodos se ajustaron proporcionalmente.
Los carriles se reconstruyeron como tiles de ancho o alto completo para asegurar
continuidad al repetirse.

## Prompt final

Use case: stylized-concept. Create a clean 4-column by 3-row source effect atlas
for Mutable Widow's Scope Web. Do not include the character.

Columns are warning, linking, active and dissipating. Row 1 contains a centered
circular web node evolving from a dark petroleum warning ring to cyan linking,
a white-cyan and acid-lime active core, and broken fading fragments. Row 2
contains straight horizontal tileable lane segments spanning their left and
right logical edges. Row 3 contains exact vertical equivalents spanning top and
bottom.

Use white-hot highlights, bright cyan, acid lime, muted cyan and dark petroleum
in crisp 16-bit Japanese RPG pixel art on a uniform solid `#ff00ff` chroma-key
background. No spider, character, organic cobweb, projectile bolt, explosion,
smoke, diagonal or curved lane, grid, text or watermark.

## Estado y siguiente asset recomendado

Mutable Widow queda completa dentro de la prioridad de proyectiles y efectos:
proyectil doble, impacto/disipación, nodos y carriles activos.

El siguiente encuentro es Type. Se recomienda continuar con los proyectiles de
`Casting Swarm` de Cast Hornet.
