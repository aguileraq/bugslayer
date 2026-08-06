# Invocación de minion infectado — Runtime v1

## Uso

Efecto compartido para presentar a Parse Mantis, Mutable Widow, Cast Hornet y
Boolean Beetle infectados durante el cierre del demo.

No contiene al enemigo. La hoja debe combinarse con el sprite del minion
correspondiente.

## Archivo

- Imagen: `infected-minion-summon-runtime-v1.png`
- Tamaño total: 768 × 128 px
- Retícula lógica: 6 columnas × 1 fila
- Tamaño de celda: 128 × 128 px
- Fondo: transparencia real, alfa binario
- Sombra: ninguna
- Direcciones: no aplican; el efecto es radial

## Secuencia

1. **Marca de infección:** aparece el nodo carmesí y un anillo incompleto.
2. **Enraizamiento:** cuatro hifas mecánicas completan el sello.
3. **Ascenso del capullo:** los arcos de micelio forman la jaula de control.
4. **Takeover:** el núcleo naranja-blanco oculta el centro de aparición.
5. **Revelación:** el capullo se abre y deja el centro transparente.
6. **Residuo:** el anillo roto y las últimas partículas se disipan.

## Transición visual

- Antes del frame 4 puede mantenerse oculto el minion.
- El frame 4 cubre el centro y permite cambiar al sprite infectado.
- Desde el frame 5 el minion infectado puede quedar visible bajo el efecto.
- El mismo atlas sirve para los cuatro enemigos.

## Identidad visual

- Micelio mecánico marfil.
- Abrazaderas de grafito.
- Nodos de control carmesí.
- Energía naranja-blanca.
- Pequeños acentos azul petróleo.
- Capullo de infección, no teletransporte amistoso.

## Validación

- Dimensiones verificadas.
- Alfa binario: únicamente 0 y 255.
- Punto central estable.
- Centro opaco en el frame 4.
- Centro transparente en el frame 5.
- Márgenes mínimos de 4 px.
- Ningún elemento queda cortado.
- Sin personajes, texto, grid, sombra o fondo residual.

## Prompt de generación

Secuencia compartida de invocación e infección para los cuatro minions del
cierre del demo. Se solicitaron seis etapas: marca, enraizamiento, capullo,
takeover, revelación y residuo. La paleta deriva de Dependency Takeover y de
los minions infectados. La fuente se generó con la herramienta integrada sobre
fondo uniforme `#FF00FF` y se convirtió posteriormente a transparencia alfa.

## Siguiente asset recomendado

Efecto de extracción y teletransporte del Senior Engineer hacia la base,
inmediatamente después de que los cuatro minions rodeen al jugador.
