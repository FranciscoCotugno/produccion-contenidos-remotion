# Carrusel

> **Nota del 2026-10-17 (reglas generales).** Lo que esta ficha diga sobre **zona
> segura** quedó como registro de cómo se construyó el molde, **no como regla**.
> Hoy las composiciones van a sangre completa: la única precaución es la columna
> de botones de TikTok sobre el borde derecho, y solo en 9:16. La prop que antes
> se llamaba `safeZone` ahora es `franjaBotones` y solo prende una guía en Studio.
> Tampoco hay marca de agua en ningún molde, y un molde puede salir en varios
> formatos. Ver `CLAUDE.md`.


## Identificación
- **Cuentas:** C1 (fotos de día, cálidas), C2 (fotos de noche, frías), C8 (fotos con flash, estética de cámara de rollo), R2 (descubrimiento).
- **Sale como:** imágenes (2 por carrusel). Se publican en modo foto de TikTok, y el sonido oficial se elige al publicar.
- **Dimensiones:** **3:4 (1080×1440)** cada imagen, el formato de una foto (decisión de Cotu). En TikTok se ve con bandas: la zona libre sobre la imagen es x 60–925, y 0–1230.
- **Punto de partida:** desde cero.
- **Componente:** `Carrusel.tsx` (cada slide es un `<Still>`); ejemplos en `ejemplos.ts`; textos y fotos de prueba en `datos-prueba/<tema>/carrusel.json` (textos de `textos.txt`); imágenes en `render/`.

## Qué es
Un posteo de dos imágenes. La primera tiene una frase que invita a deslizar; la segunda resuelve con una frase de la letra o con la tarjeta del tema.

## Por qué funciona
La primera foto parece el posteo de alguien real. La frase genera curiosidad y la segunda imagen la resuelve, así que deslizar es casi automático.

## Tipos de slide (prop `tipo`)

| Tipo | Contenido | Se usa en |
|---|---|---|
| `A-foto-hook` | Foto "de celular" a pantalla completa (oscurecida un 10 %) con el hook encima | Slide 1 de C1, C2 y C8 |
| `B-artista-frase` | Foto del artista, oscurecida un 45 %, con **una frase** de la letra, centrada, un renglón por línea | Slide 2 de C1, C2 y C8 |
| `C-hook-color` | El hook grande (80 px, semibold) sobre un color plano tomado de la portada | Slide 1 de R2 |
| `D-artista-tarjeta` | Foto del artista con la tarjeta chica del tema arriba a la derecha: portada, título y artistas sobre un fondo oscuro redondeado, sin logo | Slide 2 de R2 |

## Texto
El texto nativo de la app, como en las referencias (y como en `letra-sobre-video`): TikTok Sans 500, blanco, centrado, sin caja, con una sombra leve, en renglones balanceados.
- **Hook:** 56 px. Al centro o en el tercio de arriba (`posicionTexto`; en los ejemplos, C2 va arriba).
- **Frase (slide B):** 56 px; 48 si es larga (más de 2 renglones o 60 letras). En blanco o en otro color (`colorTexto`; una referencia la tiene en rojo): `Comparar-Carrusel-FraseColor-InstintoLuv` la prueba en el color secundario del tema.
- **Tarjeta (D):** título 34 px en negrita y artistas 32 px.
- Ancho máximo del texto: 770 px, centrado en el cuadro (de x 155 a 925).

## Color (slide C)
Como en `tarjeta-letra` (C9): el fondo sale del color dominante de la portada, un poco más oscuro, y el texto va en blanco o negro, el que más contraste haga (4,5:1 como mínimo). Forzable con `colorFondo`.

## Qué es fijo y qué varía
- **Fijo:** el diseño de cada tipo de slide y la tipografía.
- **Varía (props, `carruselSchema`):** `tema` (título, artistas, portada, colores), `tipo`, `foto`, `oscurecer`, `texto`, `posicionTexto`, `colorTexto`, `colorFondo`, `franjaBotones`. Un carrusel es la lista de sus slides (en `ejemplos.ts`, `Carrusel-<cuenta>-<n>-<tema>`).

## Qué decide la bajada (antes de armar el carrusel)
La bajada de cada tema la escribe una persona, y de ahí salen los textos del carrusel (pedido de Cotu):
- **El hook** de la slide 1, uno por cuenta.
- **La frase** de la slide 2: **una sola frase de la letra, no la estrofa completa.** La estrofa entera queda en `textos.txt` como referencia, pero el molde recibe solo la frase elegida.

## Ejemplos de hook (los define la bajada de cada tema)
- "[artista] la escribió y yo la viví..."
- "Tranqui ma, solo va a ser un tatuaje chiquito que diga:"
- "Spotify me tiró esta en aleatorio y no la saqué más"

## Fotos
- Las fotos de la slide A no muestran caras: siluetas, espaldas, manos, pies, objetos o paisajes. En el laboratorio se usan los bancos de prueba (día C1, noche C2, flash C8); algunas de flash muestran caras, en producción no.
- Slides B y D: fotos de prensa del artista. En instinto luv, `prensa-1` y `prensa-2`. En FMK no hay fotos de prensa de prueba: se usan dos cuadros del videoclip (`cuadro-videoclip-1.jpg` y `-2.jpg`, decisión de Cotu).

## Zona segura
Todo va dentro de la zona libre del 3:4 (x 60–925, y 0–1230). El hook y la estrofa, centrados; la tarjeta de R2, arriba a la derecha con 40 px de margen (termina en x 885).

## Para decidir en Studio
- Tamaño del hook y de la frase según el largo del texto.
- Frase en blanco o en el color del tema.

## Se repite con otros moldes
- El color dominante de la portada y el contraste: copiados de `tarjeta-letra`.
- El estilo de texto nativo de la app: también en `letra-sobre-video`.

## Referencias
Ver `referencias/carrusel/REFERENCIAS.md`.
