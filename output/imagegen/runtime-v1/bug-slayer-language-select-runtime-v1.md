# Bug Slayer — selección de idioma runtime v1

## Archivos runtime

- Fondo: `bug-slayer-language-select-background-runtime-v1.png`
- Estados de botón: `bug-slayer-language-select-button-states-runtime-v1.png`
- Fuente visual preservada: `_bug-slayer-language-select-background-source.png`

## Archivos de validación

- `bug-slayer-language-select-preview-neutral-runtime-v1.png`
- `bug-slayer-language-select-preview-es-focus-runtime-v1.png`
- `bug-slayer-language-select-preview-en-focus-runtime-v1.png`
- `bug-slayer-language-select-preview-confirmed-runtime-v1.png`
- `bug-slayer-language-select-four-states-comparison-runtime-v1.png`

Los previews contienen textos rasterizados únicamente para validar composición. No deben utilizarse como pantalla localizada final.

## Dimensiones

- Pantalla: 960 × 540 px.
- Atlas de botones: 768 × 72 px.
- Celda de botón: 256 × 72 px.
- Estructura del atlas: 3 columnas × 1 fila.
- Transparencia del atlas: RGBA.

## Estados del botón

1. **Normal:** marco azul oscuro y texto subordinado.
2. **Seleccionado:** borde cian brillante, texto blanco y flechas laterales.
3. **Confirmado:** borde blanco/azul hielo y nodos ámbar de confirmación.

El mismo componente se reutiliza para `ESPAÑOL` y `ENGLISH`; las palabras no están incrustadas en el atlas.

## Texto dinámico

Las siguientes cadenas deben proceder de los JSON de idioma o del diccionario inicial bilingüe:

- `SELECCIONA IDIOMA / SELECT LANGUAGE`
- `ESPAÑOL`
- `ENGLISH`
- `ELEGIR / SELECT`
- `CONFIRMAR / CONFIRM`
- `IDIOMA CONFIRMADO / LANGUAGE CONFIRMED`

El logotipo `BUG SLAYER` no es localizable y forma parte del fondo.

## Interacción definida

- Flecha izquierda/derecha cambia la opción seleccionada.
- Movimiento del puntero sobre una opción utiliza el estado seleccionado.
- Enter o clic confirma la opción activa.
- Tras confirmar se muestra brevemente el tercer estado antes de continuar.
- La selección ocurre antes del menú o introducción y establece el diccionario utilizado por el resto del demo.

## Legibilidad

- La selección no depende únicamente del color: utiliza flechas y cambio de borde.
- Las dos opciones tienen el mismo tamaño y jerarquía.
- Los textos bilingües previos a la selección permanecen breves.
- No hay banderas nacionales; el idioma se identifica por su nombre.
- La pantalla conserva márgenes seguros y funciona en el viewport fijo de 960 × 540 px.

## Generación y montaje

El fondo se generó mediante ImageGen integrado, caso `ui-mockup`, sin texto ni logotipo. La versión runtime se montó de forma determinista con el wordmark aprobado. Los botones y textos de preview se construyeron con bordes duros y escalado de vecino más cercano. No se utilizó la ruta CLI y los masters permanecen intactos.

## Siguiente asset recomendado

Crear el kit runtime del HUD de combate: marcos de HP, rellenos, encuentro, puntaje, racha e indicadores de estado; después validarlo sobre un escenario real de 960 × 540 px.
