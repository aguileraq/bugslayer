# Jardín de Compilación — composición narrativa en tres estados runtime v1

## Archivos

- `compilation-garden-state-1-arrival-runtime-v1.png`
- `compilation-garden-state-2-encounter-runtime-v1.png`
- `compilation-garden-state-3-victory-runtime-v1.png`
- `compilation-garden-three-states-comparison-runtime-v1.png`

## Dimensiones

- Cada estado individual: `960 × 540 px`.
- Relación: `16:9`.
- Comparativa horizontal reducida: `1440 × 270 px`.
- Cada panel de la comparativa: `480 × 270 px`.
- Composiciones opacas completas.
- Escalado: vecino más cercano.

## Invariantes

- Misma cámara top-down 3/4.
- Mismo escenario lineal.
- Misma posición de árboles, vegetación, terminal, nido, nodos y salida.
- Senior Engineer: `44 px` de altura visible.
- Parse Mantis: `38 px` en reposo, aproximadamente `13.6 %` menor que el Senior.
- V4LK: `28 px` de altura visible.
- Sin sombras proyectadas.

## Estado 1 — llegada

- Senior Engineer materializado sobre el Nodo de Inicialización inferior.
- V4LK aparece a la izquierda del nodo.
- Parse Mantis todavía no está visible.
- Las barreras permanecen abiertas.
- El nido está inactivo.
- La compuerta superior permanece oscura y cerrada.

Este estado representa la transferencia desde la oficina al interior del software; el Senior no vuelve a despertar aquí.

## Estado 2 — encuentro activo

- Senior situado en la parte inferior del claro y mirando hacia arriba.
- Parse Mantis común en la parte superior del claro, delante del nido.
- V4LK permanece en el borde izquierdo y fuera de la línea directa de combate.
- Dos barreras bajas cierran únicamente los accesos superior e inferior del claro.
- La compuerta de salida permanece cerrada.
- No se muestran ataques ni proyectiles para conservar la lectura de la distribución.

## Estado 3 — victoria

- Parse Mantis aparece colapsado usando su pose final de derrota y el mismo factor de escala que en reposo.
- Senior avanza ligeramente hacia el centro del claro.
- V4LK conserva su posición lateral.
- Las dos barreras están desactivadas.
- La compuerta superior muestra el estado estabilizado cian-turquesa.
- La ruta vuelve a quedar transitable.

## Escala de derrota

- Parse Mantis en reposo: `43 × 38 px` visibles.
- Pose final derrotada: `48 × 33 px` visibles.
- La reducción vertical se debe al colapso, no a un cambio del factor de escala.

## Validación

- Tres estados individuales verificados en `960 × 540 px`.
- Escenario y cámara sin cambios.
- Escala v3 aplicada en el encuentro y la derrota.
- Barreras reducidas para no ocultar personajes ni parecer una sala de jefe.
- Salida claramente cerrada en llegada/combate y abierta tras la victoria.
- Sin HUD, preguntas, diálogo, texto, etiquetas, proyectiles o marcas de agua.

## Método

Las composiciones se ensamblaron de forma determinista con el escenario, sprites y efectos runtime aprobados. Se utilizó vecino más cercano para preservar el pixel art y evitar variaciones de identidad, escala o geometría.

## Próxima etapa recomendada

El conjunto del Jardín de Compilación queda completo:

- tileset base;
- atlas de props;
- maquinaria y efectos ambientales;
- área lineal;
- escala aprobada;
- tres estados narrativos.

El siguiente escenario corresponde al **Encuentro 2 contra Mutable Widow**. Antes de producir su tileset conviene completar la misma plantilla con función narrativa, dimensiones, distribución, suelo, límites, props, corrupción de variables, iluminación y restricciones de combate.
