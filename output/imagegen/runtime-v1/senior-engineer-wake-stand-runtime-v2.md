# Senior Engineer — despertar y levantarse runtime v2

Archivo:

- `senior-engineer-wake-stand-runtime-v2.png`

## Propósito

Sustituye la parte narrativa incorrecta del asset sentado v1. El Senior ya no pulsa el teclado de C4 después de despertar. Se levanta, abandona la silla y el control pasa al jugador para caminar hacia C3.

El archivo v1 permanece intacto como master histórico.

## Estructura

- Lienzo: `384 × 384 px`.
- Frame: `96 × 96 px`.
- Cuadrícula: `4 columnas × 4 filas`.
- Total: `16 frames`.
- Fondo: transparencia alfa real.
- Alfa: binario, únicamente `0` y `255`.
- Sombra: ninguna.

## Secuencia

### Fila 1 — despertar

1. dormido e inclinado;
2. movimiento leve de hombros;
3. cabeza levantándose;
4. ojos abiertos, todavía encorvado.

### Fila 2 — diálogo y recuperación

5. espalda comenzando a enderezarse;
6. postura sentada estable;
7. ajuste de las gafas;
8. pose neutra para sostener la ventana de diálogo externa.

Mensaje asociado:

> ¿Qué ha pasado? ¿Dónde estoy?

### Fila 3 — levantarse

9. manos y pies preparándose;
10. torso inclinado hacia delante;
11. cadera separándose del asiento;
12. postura casi erguida.

### Fila 4 — abandonar C4

13. completamente de pie frente a la silla;
14. giro hacia abajo/frente;
15. primer paso hacia abajo-izquierda;
16. pose de transición que conecta con la caminata estándar rumbo a C3.

## Identidad y alineación

- Mismas gafas negras, cabello, barba, piel, hoodie, jeans, zapatos y gafete del Senior Engineer runtime.
- Silla azul oscuro/grafito consistente.
- Línea base común en los dieciséis frames.
- Escala global uniforme.
- Márgenes transparentes seguros.
- La silla permanece anclada durante el levantamiento.

## Validación

- Dimensiones verificadas.
- Alfa binario verificado.
- Fondo verde y halos eliminados.
- Ningún frame corta cabeza, manos, pies, gafete o silla.
- No existe escritorio, teclado, computadora, holograma, texto dibujado ni escenario.
- El último frame puede enlazarse con el spritesheet de caminata.

## Generación

- Modo: herramienta integrada de generación de imágenes.
- Caso de uso: `identity-preserve`.
- Referencias: animación sentada v1, Senior Engineer idle y atlas de props.
- La fuente cromática se convirtió a alfa y cada pose se extrajo desde sus separaciones reales antes de normalizarla a `96 × 96 px`.

## Siguiente asset recomendado

Ventana de diálogo runtime con el mensaje exacto:

> ¿Qué ha pasado? ¿Dónde estoy?

Después se actualizará la composición narrativa para trasladar el botón parpadeante, la carga y el holograma desde C4 hasta C3.
