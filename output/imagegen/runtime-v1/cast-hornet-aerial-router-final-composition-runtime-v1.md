# Instalación aérea invadida — composición final runtime v1

## Archivos

- `cast-hornet-aerial-router-complete-area-runtime-v1.png`
- `cast-hornet-aerial-router-state-1-exploration-runtime-v1.png`
- `cast-hornet-aerial-router-state-2-swarm-encounter-runtime-v1.png`
- `cast-hornet-aerial-router-state-3-cleared-runtime-v1.png`
- `cast-hornet-aerial-router-three-states-comparison-runtime-v1.png`

## Dimensiones

- Área completa y estados: 1920 × 1080 px.
- Viewport de referencia: 960 × 540 px.
- El mapa ocupa cuatro viewports.
- Comparativa: 1440 × 270 px.
- Cámara top-down 3/4 y escalado mediante vecino más cercano.

## Distribución

- Entrada desde el borde inferior izquierdo.
- Terraza inicial de enrutamiento.
- Dos rutas amplias de aproximación.
- Plataforma secundaria superior izquierda.
- Campo irregular de maniobra en la zona central derecha.
- Tres accesos invasivos distribuidos en el perímetro.
- Puente de salida hacia el borde superior derecho.
- Aproximadamente 65–70 % del suelo permanece libre.

## Estado 1 — exploración

- Senior Engineer y V4LK ingresan por el puente inferior izquierdo.
- No hay Cast Hornets visibles.
- La infestación se descubre progresivamente sobre la infraestructura.

## Estado 2 — encuentro de colonia

- Tres Cast Hornets permanecen volando en formación triangular abierta.
- Cada enemigo ocupa una trayectoria distinta.
- Senior y V4LK permanecen en el acceso inferior del campo.
- No se muestran proyectiles para validar escala y espacio de maniobra.

## Estado 3 — área despejada

- Los tres Cast Hornets utilizan sus poses finales de derrota.
- Senior y V4LK avanzan hacia la salida superior derecha.
- El recorrido completo vuelve a quedar transitable.

## Escala

- Cast Hornet utiliza una altura visible de 70 px en el mapa de 1920 × 1080.
- Su cuerpo sigue siendo menor que Parse Mantis y claramente menor que el Senior.
- Las alas amplían la silueta sin aumentar su masa visual.
- Los estados de derrota utilizan el mismo factor de escala que el reposo aéreo.

## Validación

- Mismo mapa y posición de elementos en los tres estados.
- Tres enemigos pequeños, separados y siempre aéreos durante el combate.
- Sin apariencia de jefe, simetría radial o plataforma ceremonial.
- Cielo híbrido de software en lugar de cielo terrestre.
- No hay miel, cera, líquidos dorados o arquitectura de abejas.
- Sin HUD, texto, diálogo, proyectiles o marcas de agua.

## Generación y montaje

El mapa se generó con la herramienta integrada de imágenes, caso `stylized-concept`, usando el concepto v2 aprobado. Los estados se montaron de forma determinista con los sprites runtime para conservar identidad y escala.

## Estado del escenario

El escenario de Cast Hornet queda completo:

- concepto v2;
- tileset base;
- atlas de props;
- maquinaria y efectos ambientales;
- área completa desplazable;
- encuentro con tres enemigos;
- tres estados narrativos;
- comparativa final.

## Siguiente escenario recomendado

Continuar con el entorno previo a **Boolean Beetle**, usando la arena tecnológica más monumental reservada anteriormente como antesala de jefe. Conviene definir primero cómo evoluciona el entorno desde la zona aérea hasta un espacio de lógica binaria más pesado y cerrado.
