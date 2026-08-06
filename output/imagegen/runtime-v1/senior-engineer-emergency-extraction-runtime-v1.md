# Senior Engineer — Extracción de emergencia runtime v1

## Uso

Efecto tecnológico de rescate utilizado cuando los cuatro minions infectados
rodean al Senior Engineer. No contiene al personaje y debe superponerse a su
celda.

La secuencia también puede reproducirse en orden inverso para representar la
llegada del jugador a la base.

## Archivo

- Imagen: `senior-engineer-emergency-extraction-runtime-v1.png`
- Tamaño total: 768 × 128 px
- Retícula lógica: 6 columnas × 1 fila
- Tamaño de celda: 128 × 128 px
- Fondo: transparencia real, alfa binario
- Sombra: ninguna
- Direcciones: no aplican

## Secuencia

1. **Lock-on:** anillo cian y brackets fijan la posición del jugador.
2. **Escaneo:** rieles verticales y barras blancas verifican el objetivo.
3. **Captura de datos:** bloques rectangulares rodean el volumen del personaje.
4. **Extracción:** la columna cian-blanca cubre completamente el centro.
5. **Ascenso:** los datos se fragmentan hacia arriba y la zona inferior queda
   vacía.
6. **Residuo:** permanecen el anillo roto y unos pocos píxeles ascendentes.

## Transición visual

- El Senior Engineer permanece visible durante los frames 1–3.
- Puede ocultarse bajo la columna del frame 4.
- En los frames 5–6 el personaje ya no está presente.
- Para la llegada a la base puede reproducirse la secuencia en sentido inverso.

## Identidad visual

- Tecnología geométrica y ortogonal.
- Cian, azul hielo y blanco cálido.
- Pequeños nodos ámbar de confirmación.
- Conectores oscuros de grafito.
- Sin micelio, carmesí o señales de infección.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente 0 y 255.
- Centro opaco durante el frame 4.
- Centro inferior transparente durante el frame 5.
- Punto de alineación estable.
- Márgenes mínimos de 4 px.
- Ningún elemento queda cortado.
- Sin personajes, texto, números, grid, sombra o fondo residual.

## Prompt de generación

Extracción tecnológica de emergencia para el Senior Engineer, con seis estados:
lock-on, escaneo, captura de datos, columna de transferencia, ascenso y residuo.
La dirección visual utiliza geometría limpia de base en cian, blanco y ámbar,
en contraste con la invocación infectada. La fuente se generó con la herramienta
integrada sobre fondo `#FF00FF` y se convirtió posteriormente a transparencia
alfa.

## Siguiente asset recomendado

Hoja conceptual del área segura de la base donde reaparece el Senior Engineer,
para definir el escenario del último plano del demo.
