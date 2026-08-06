# Guarida de Mutable Widow — composición final runtime v1

## Archivos

- `mutable-widow-lair-complete-area-runtime-v1.png`
- `mutable-widow-lair-state-1-exploration-runtime-v1.png`
- `mutable-widow-lair-state-2-dual-encounter-runtime-v1.png`
- `mutable-widow-lair-state-3-cleared-runtime-v1.png`
- `mutable-widow-lair-three-states-comparison-runtime-v1.png`

## Dimensiones

- Área completa y cada estado: 1920 × 1080 px.
- Viewport de referencia: 960 × 540 px.
- El área equivale a cuatro viewports y no puede verse completa durante el juego.
- Comparativa: 1440 × 270 px, tres paneles de 480 × 270 px.
- Cámara: top-down 3/4 fija.
- Composiciones opacas completas.
- Escalado: vecino más cercano.

## Distribución espacial

- Entrada desde el borde inferior izquierdo.
- Cámara de mantenimiento y corredores webados de aproximación.
- Alcobas laterales con terminales, capullos y maquinaria.
- Cámara central irregular y asimétrica para el encuentro.
- Dos nidos enfrentados en los límites izquierdo y derecho.
- Salida mediante corredor hacia el borde superior derecho.
- Vegetación prácticamente inexistente.
- Centro de combate despejado para permitir evasión y proyectiles dobles.

## Estado 1 — exploración

- Senior Engineer y V4LK recorren el corredor de entrada.
- Ambas entradas de nido permanecen inactivas.
- No hay enemigos visibles.
- La zona comunica progresivamente el hábitat mediante redes y capullos.

## Estado 2 — encuentro doble

- Senior Engineer se sitúa en el acceso inferior de la cámara y mira hacia arriba.
- V4LK permanece detrás y fuera de la línea directa de combate.
- Una Mutable Widow aparece desde el nido izquierdo mirando hacia la derecha.
- La segunda aparece desde el nido derecho mirando hacia la izquierda.
- Ambas usan la misma escala, volumen y estado de reposo.
- No se muestran proyectiles para validar claramente el espacio disponible.

## Estado 3 — zona despejada

- Las dos Mutable Widows utilizan sus poses finales de derrota.
- El Senior avanza hacia el centro y la salida superior derecha.
- V4LK mantiene una posición lateral segura.
- Los nidos quedan oscuros y la ruta vuelve a ser transitable.

## Validación

- Mismo mapa, cámara y posición de props en los tres estados.
- Dos Widows simultáneas sin apariencia de jefe ni saturación del espacio.
- Direcciones izquierda y derecha realmente opuestas.
- Escala del Senior, V4LK y ambas Widows tomada directamente de los sprites runtime aprobados.
- Las poses derrotadas conservan el mismo factor de escala.
- Corredores y cámara central mantienen lectura de colisiones.
- Las redes ambientales no se confunden con `Scope Web`.
- Sin HUD, diálogo, texto, etiquetas, proyectiles o marcas de agua.

## Generación y montaje

El mapa base se generó con la herramienta integrada de imágenes, caso `stylized-concept`, usando el tileset, los props y la maquinaria aprobados como referencias.

Los tres estados se montaron de forma determinista con los sprites runtime para conservar identidad, posición y escala entre composiciones.

## Estado del escenario

El escenario de Mutable Widow queda completo:

- tileset base;
- atlas de props y telarañas;
- maquinaria y efectos ambientales;
- área completa desplazable;
- encuentro con dos enemigos;
- tres estados narrativos;
- comparativa de validación.

## Siguiente escenario recomendado

Continuar con el hábitat de **Cast Hornet**. Antes del tileset conviene definir cómo comunicar verticalidad, corrientes de aire, plataformas o pasarelas y espacio de maniobra para un enemigo volador.
