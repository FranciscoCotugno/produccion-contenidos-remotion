# Índice de moldes

Cada molde es un template que sirve a una o más cuentas de la grilla. Se construyen **de a uno**, en este orden. Cada carpeta tiene su `FICHA.md`, y las referencias visuales están en `referencias/<molde>/`.

| # | Molde | Cuentas que cubre | Sale como | Punto de partida | Estado |
|---|---|---|---|---|---|
| 1 | `reproductor-app` | L05, L06, L13 | Video | LyricPlayer del repo original | **Terminado** (9:16, piel Apple oscura). Variantes elegidas el 2026-10-19 |
| 2 | `brat-puro` | L01, L12 | Video | Desde cero | Terminado (1:1) |
| 2b | `brat-color` | L01, L12 (variante de `brat-puro`, para dar variedad) | Video | La mecánica de `brat-puro` | En iteración |
| 3 | `chat` | C3, R1, R3 | Video | Desde cero | En iteración (WhatsApp oscuro y R3 tipo Instagram) |
| 4 | `tarjeta-letra` | C4, C9 | Imagen (3:4) | Desde cero | **Terminado** (3:4). Variantes elegidas el 2026-10-19 |
| 5 | `reproductor-widget` | L07, C5, C6 | Video | Desde cero | En revisión con Cotu |
| 6 | `letra-sobre-video` | L08, L11, POV1 a POV8 | Video | Desde cero | Terminado (9:16, 1:1, 3:4) |
| 7 | `brat-maximal` | L02, L03 | Video | LyricPunch del repo original | Terminado (1:1) |
| 8 | `brat-minimal` | L04 | Video | LyricFilm del repo original | Terminado (1:1, en B/N y en color) |
| 9 | `carrusel` | C1, C2, C8, R2 | Imágenes (3:4) | Desde cero | Terminado (3:4) |
| 10 | `nota-celular` | C7 | Video | Desde cero | Terminado (1:1) |
| 11 | `karaoke` | L09 | Video | Desde cero | Terminado (9:16, 1:1) |
| 12 | ~~`tipografico`~~ | L10 | Video | Desde cero | **De baja** (2026-10-06, decisión de Cotu): no convenció. |
| 12a | ~~`bloque-palabra`~~ | L10 | Video | Rehizo `tipografico` (pedido 3) | **De baja** (2026-10-18, decisión de Cotu): vio el video y no le gustó el contenido. Segunda vez que se cae este formato. L10 sigue sin molde. |
| 12b | `panel-letra` | lyrics puras (el panel de letra abierto de una app) | Video | Desde cero (pedido 2) | **Terminado** (9:16, 1:1, 3:4, 4:3). Variantes elegidas por Cotu el 2026-10-17 |
| 12c | `lista-numerada` | las 4 de recomendación | Video | Desde cero (pedido 4) | En revisión con Cotu (9:16, 4:3, 1:1). **Destrabado el 2026-10-19**: el ranking es de un solo artista, así que no hace falta material de otros sellos |
| 13 | `prensa` | P1, P2 | Video | Desde cero (pedido 5) | En revisión con Cotu (9:16, 1:1, 4:3). Falta la identidad de cada medio y los titulares reales |
| 14 | `memes` | M1 | Imagen y video | Desde cero | Pendiente |

**14 moldes cubren las 36 cuentas.** Las cuentas que comparten molde se diferencian por su piel (colores, tipografía, estética) o por el tipo de fondo.

## Entrega a producción (2026-10-06)

Acá se corta el laboratorio por ahora: **con estos 11 moldes se puede empezar a generar en masa.** Queda uno de baja (`tipografico`) y dos sin empezar (`prensa` y `memes`).

### Cómo se usa un molde
- Cada molde es un componente de Remotion con su esquema de props (`<molde>Schema`, con Zod). **Todo lo variable entra por prop:** no hay textos ni rutas de un tema adentro de un componente.
- `ejemplos.ts` de cada carpeta muestra con qué props se arma cada pieza, y es el lugar donde está la decisión de qué variante usa cada cuenta.
- Los IDs de composición siguen el patrón `<Molde>-<variante>-<formato>-<tema>`. Los que arrancan con `Comparar-` son pruebas para mirar en Studio, no piezas de producción.
- **La duración sale de los datos** (`calculateMetadata`, con el inicio y el fin del fragmento), menos en los moldes que salen como imagen.
- Los datos de cada tema viven en `datos-prueba/<tema>/`: `tema.json` (título, artistas, portada, colores, fragmento, `track`, letra con tiempos por palabra y grilla de beats) y un archivo por molde con los textos que elige la bajada.
- El audio y el video no están en el repo: viven en `assets/media/` y se referencian por ruta.

### Qué está listo

| Molde | Cuentas | Sale como | Formatos | IDs | Qué necesita de la bajada |
|---|---|---|---|---|---|
| `reproductor-app` | L05, L06, L13 | Video | 9:16 | `ReproductorApp-*` | nada (o una frase fija) |
| `brat-puro` | L01, L12 | Video | 1:1 | `BratPuro-*` | nada |
| `brat-color` | L01, L12 | Video | 1:1 | `BratColor-*` | nada |
| `chat` | C3, R1, R3 | Video | 1080×912 (WhatsApp), 9:16 (Instagram) | `Chat-*` | la conversación (`chats.json`) |
| `tarjeta-letra` | C4, C9 | Imagen | 3:4 | `Tarjeta-*` | la foto de fondo (`tarjetas.json`) |
| `reproductor-widget` | L07, C5, C6 | Video | 9:16, 1:1, 3:4 | `Widget-*` | frase o pregunta (`widgets.json`) |
| `letra-sobre-video` | L08, L11, POV1 a POV8 | Video | 9:16, 1:1, 3:4 | `LetraVideo-*` | hook o línea fija (`videos.json`) |
| `brat-maximal` | L02, L03 | Video | 1:1 | `BratMaximal-*` | nada |
| `brat-minimal` | L04 | Video | 1:1 | `BratMinimal-*` | palabras destacadas (`brat-minimal.json`) |
| `carrusel` | C1, C2, C8, R2 | Imágenes (2 por posteo) | 3:4 | `Carrusel-*` | un hook por cuenta y **una frase** de la letra (`carrusel.json`) |
| `nota-celular` | C7 | Video | 1:1 | `Nota-*` | título y texto de la nota (`nota.json`) |
| `panel-letra` | lyrics puras | Video | 9:16, 1:1, 3:4, 4:3 | `PanelLetra-*` | nada (la letra es toda la pieza) |
| `bloque-palabra` | L10 y tipografía sobre color | Video | 4:3, 9:16, 1:1 | `BloquePalabra-*` | **de baja** |
| `lista-numerada` | las 4 de recomendación | Video | 9:16, 4:3, 1:1 | `ListaNumerada-*` | la lista de temas y su rótulo (`datos-prueba/listas/`) |
| `prensa` | P1, P2 | Video | 9:16, 1:1, 4:3 | `Prensa-*` | **el titular**, que lo escribe una persona |
| `karaoke` | L09 | Video | 9:16, 1:1 | `Karaoke-*` | nada |

### Lo que decide una persona antes de producir
La bajada de cada tema define el fragmento (inicio y fin) y **los textos exactos de cada molde**: hooks, la frase que va en una slide, las palabras destacadas. El molde recibe el texto ya elegido, no la letra entera para recortar. Están todos juntos en `datos-prueba/<tema>/textos.txt`.

### Qué falta
- **`prensa` (P1, P2) y `memes` (M1):** sin empezar, con su `FICHA.md` escrita.
- **L10 quedó sin molde:** `tipografico` se dio de baja.
- Los moldes marcados "En iteración" andan y renderizan; lo que queda son ajustes visuales con Cotu, no cosas que falten.

## Por qué este orden

1. **`reproductor-app`** ya existe en una versión anterior: es el más rápido de llevar a terminado.
2. **`brat-puro`** no necesita imágenes ni video: solo letra y tipografía.
3. **`chat`** y **`tarjeta-letra`** no necesitan letra sincronizada por palabra, y cubren 5 cuentas.
4. Después, los que dependen de video de fondo, los que se apoyan en efectos ya existentes, y al final los que necesitan más definición (prensa y memes).

## Imágenes de IA

Varios moldes usan fondos o fotos que en producción van a salir de bancos de imágenes generadas con IA (`reproductor-widget`, `carrusel`, `tarjeta-letra`). En el laboratorio se prueban con **imágenes de ejemplo** cualesquiera, pasadas como prop. El molde no sabe ni le importa de dónde viene la imagen.
