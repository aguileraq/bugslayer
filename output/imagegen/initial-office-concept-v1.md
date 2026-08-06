# Escenario Inicial — hoja conceptual v1

## Propósito

Referencia visual aprobable para construir el tileset, los props y la secuencia narrativa del cuarto inicial. Esta imagen no es un asset runtime ni define colisiones por sí sola.

## Distribución fijada

- Cuarto cerrado de aproximadamente 5 × 4 m.
- Cámara fija top-down 3/4 que muestra el cuarto completo.
- Puerta cerrada, centrada en el muro superior.
- Rack de servidores contra el muro izquierdo.
- Bloque de cuatro cubículos, dispuesto 2 × 2 en la zona inferior derecha.
- C4 corresponde al cubículo inferior derecho y contiene al Senior Engineer.
- Planta alta en la esquina superior derecha.
- Aire acondicionado en el muro inferior, con efecto de aire visible.
- Piso gris rústico y paredes azul grisáceo claro.
- No hay corrupción ni enemigos.

## Evento narrativo

1. El Senior Engineer despierta sentado frente al equipo de C4.
2. El botón físico de la computadora parpadea.
3. El jugador interactúa y el monitor se enciende.
4. Una barra gráfica de carga progresa, sin texto legible.
5. El holograma se construye de abajo hacia arriba sobre el monitor.
6. Aparece un perro salchicha holográfico orientado hacia el Senior Engineer.

## Lenguaje visual del holograma

- Silueta inequívoca de perro salchicha: cuerpo largo y bajo, patas cortas, hocico largo, orejas caídas y cola delgada.
- Colores: azul eléctrico, cian, azul hielo y blanco puntual.
- Líneas de circuito, bandas de escaneo horizontales, fragmentos de datos y huecos internos.
- Intensidad pulsante sin gradientes ni resplandor suave.
- Base circular de proyección usada únicamente durante el evento holográfico.

## Estándar runtime recomendado

- Rejilla: 32 × 32 px.
- Sala jugable de referencia: 15 × 12 tiles, equivalente a 480 × 384 px antes del escalado de pantalla.
- Pixel art con bordes duros, sin antialiasing y con un máximo aproximado de cuatro tonos por material.
- La hoja conceptual puede tener mayor resolución; los assets derivados deberán normalizarse al estándar runtime.

## Orden de producción recomendado

1. Tileset modular base: suelo, muros, esquinas, puerta y paneles de cubículo.
2. Atlas de props: escritorios, sillas, computadoras, rack, aire acondicionado y planta.
3. Estados animados del entorno: botón, monitor, barra de carga, rack y flujo de aire.
4. Animaciones narrativas: despertar, interacción y materialización/idle del holograma.

## Generación

- Modo: herramienta integrada de generación de imágenes.
- Caso de uso: `stylized-concept`.
- Referencias: Senior Engineer runtime y efecto tecnológico de extracción.
- Restricciones principales: conservar la identidad del jugador, no incluir texto, enemigos, corrupción, armas, marcas de agua ni estética fotorrealista.
