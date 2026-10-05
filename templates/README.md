# Índice de moldes

Cada molde es un template que sirve a una o más cuentas de la grilla. Se construyen **de a uno**, en este orden. Cada carpeta tiene su `FICHA.md`, y las referencias visuales están en `referencias/<molde>/`.

| # | Molde | Cuentas que cubre | Sale como | Punto de partida | Estado |
|---|---|---|---|---|---|
| 1 | `reproductor-app` | L05, L06, L13 | Video | LyricPlayer del repo original | En iteración (piel Apple oscura) |
| 2 | `brat-puro` | L01, L12 | Video | Desde cero | Terminado (1:1) |
| 2b | `brat-color` | L01, L12 (variante de `brat-puro`, para dar variedad) | Video | La mecánica de `brat-puro` | En iteración |
| 3 | `chat` | C3, R1, R3 | Video | Desde cero | En iteración (WhatsApp oscuro y R3 tipo Instagram) |
| 4 | `tarjeta-letra` | C4, C9 | Imagen | Desde cero | Pendiente |
| 5 | `reproductor-widget` | L07, C5, C6 | Video | Desde cero | Pendiente |
| 6 | `letra-sobre-video` | L08, L11, POV1 a POV8 | Video | Desde cero | Pendiente |
| 7 | `brat-maximal` | L02, L03 | Video | LyricPunch del repo original | Pendiente |
| 8 | `brat-minimal` | L04 | Video | LyricFilm del repo original | Pendiente |
| 9 | `carrusel` | C1, C2, C8, R2 | Imágenes | Desde cero | Pendiente |
| 10 | `nota-celular` | C7 | Video | Desde cero | Pendiente |
| 11 | `karaoke` | L09 | Video | Desde cero | Pendiente |
| 12 | `tipografico` | L10 | Video | Desde cero | Pendiente |
| 13 | `prensa` | P1, P2 | Video | Desde cero | Pendiente |
| 14 | `memes` | M1 | Imagen y video | Desde cero | Pendiente |

**14 moldes cubren las 36 cuentas.** Las cuentas que comparten molde se diferencian por su piel (colores, tipografía, estética) o por el tipo de fondo.

## Por qué este orden

1. **`reproductor-app`** ya existe en una versión anterior: es el más rápido de llevar a terminado.
2. **`brat-puro`** no necesita imágenes ni video: solo letra y tipografía.
3. **`chat`** y **`tarjeta-letra`** no necesitan letra sincronizada por palabra, y cubren 5 cuentas.
4. Después, los que dependen de video de fondo, los que se apoyan en efectos ya existentes, y al final los que necesitan más definición (prensa y memes).

## Imágenes de IA

Varios moldes usan fondos o fotos que en producción van a salir de bancos de imágenes generadas con IA (`reproductor-widget`, `carrusel`, `tarjeta-letra`). En el laboratorio se prueban con **imágenes de ejemplo** cualesquiera, pasadas como prop. El molde no sabe ni le importa de dónde viene la imagen.
