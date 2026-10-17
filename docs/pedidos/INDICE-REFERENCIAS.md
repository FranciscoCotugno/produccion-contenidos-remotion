# Índice de referencias relevadas (octubre 2026)

Punto de entrada para Claude Code. Son 55 videos de TikTok bajados y analizados uno por uno, repartidos en 14 carpetas dentro de `assets/referencias/`.

## Cómo usar esto

Cada carpeta tiene:

- **`ANALISIS.md`** — qué es ese molde, cómo funciona la mecánica, con qué molde del repo se corresponde y qué falta.
- **Fotogramas sueltos en `.png`** — cuadros representativos a tamaño real. **Mirá estos, no los `.mp4`**: los videos no se pueden abrir, las imágenes sí.
- Los `.mp4` originales, por si alguien los quiere revisar a mano.

Antes de tocar un molde, leé el `ANALISIS.md` de su carpeta y mirá sus fotogramas.

## Advertencia sobre los nombres de las carpetas

Los nombres salieron de una lista previa y **varios están mal**. El `ANALISIS.md` de cada carpeta dice qué hay realmente adentro. Los casos:

- `01-estrella` — no hay ninguna estrella. La estrella está en `02`.
- `02-tipografia-cinetica` — adentro hay tres moldes distintos, no uno.
- `06-ilustracion` — no hay ilustraciones: son clips de terceros.
- `07-fotos-artista` — no hay fotos: son clips de recital y un formato de prensa.

## Tabla de correspondencias

| Carpeta | Qué es realmente | Molde del repo | Qué falta |
|---|---|---|---|
| `01-estrella` | Bloque que se arma palabra por palabra, sobre fondo liso | **Ninguno** | Molde nuevo. Lo más parecido era `tipografico`, dado de baja |
| `02-tipografia-cinetica` | Lo mismo que `01`, más otras dos cosas mezcladas | **Ninguno** / `letra-sobre-video` | Ver análisis: hay tres moldes adentro |
| `03-portada-blureada` | Panel de letra sobre portada desenfocada | `reproductor-app` | Piel nueva. Pedido escrito en `docs/pedidos/` |
| `04-dron-fecha` | Clip de dron + fecha del día + letra | `letra-sobre-video` ✅ | Banco de clips, y un resplandor de texto |
| `05-clip-nocturno` | Clip nocturno + fila de emojis + letra | `letra-sobre-video` ✅ | Banco de clips, y el modo "una palabra por vez" |
| `06-ilustracion` | Clip + capa de partículas + letra | `letra-sobre-video` ✅ | Capa de partículas (prop chica) y banco de fondos |
| `07-fotos-artista` | Recital con virado sepia, y un formato de prensa | `letra-sobre-video` (L11) y `prensa` | Virado de color como prop; el de prensa está pendiente |
| `08-spotify` | Panel de letra sobre color liso | `reproductor-app` | Segunda piel, hermana de la de `03` |
| `10-en-vivo` | Recital con letra, y entrevista subtitulada | `letra-sobre-video` (L11) ✅ | Material. Modo subtítulo abajo y marca de agua como imagen |
| `11-letra-sobre-videoclip` | Videoclip + subtítulo fino y discreto | `letra-sobre-video` (L08) ✅ | Solo ajuste de tamaño y peso en Studio |
| `12-prensa-con-video` | Faja de titular arriba + video + subtítulo | `prensa` | Molde pendiente. Esta es su mejor referencia |
| `13-lista-numerada` | Lista que se completa tema por tema | **Ninguno** | Molde nuevo. Cubre ranking y playlist |
| `14-motivo` | Referencias de motivo, no de molde | — | Nada: dependen de una persona a cámara |

✅ = el molde del repo ya está terminado y en principio alcanza.

## Lo que sale de todo esto

**Solo tres cosas necesitan código nuevo:**

1. La **piel de panel de letra** de `reproductor-app`, con sus dos variantes (carpetas `03` y `08`). Hay pedido escrito.
2. El **molde de bloque palabra por palabra** de las carpetas `01` y `02`. Tres cuentas lo sostienen, con mediana de 219 mil vistas. **Antes hay que resolver por qué se dio de baja `tipografico`**, que es lo más parecido.
3. El **molde de lista numerada** de la carpeta `13`. Es el único que trabaja con varios temas por pieza, así que además hay que decidir cómo se guardan sus datos.

**Y el molde `prensa`**, que ya estaba pendiente y ahora tiene dos referencias buenas (carpetas `07` y `12`).

**Todo el resto no necesita código: necesita material.** Las carpetas `04`, `05`, `06`, `10` y `11` son `letra-sobre-video`, que ya está terminado, con distinto banco de fondos y ajustes chicos. Conseguir esos bancos rinde más que cualquier molde nuevo.

## Dos cosas que conviene dejar fijadas en el flujo

1. **Claude Code no puede abrir un `.mp4`, pero sí un `.png`.** Toda referencia nueva tiene que llegar como fotogramas medidos, no como video.
2. **Claude Code puede renderizar un cuadro con Remotion y después mirarlo.** O sea que puede construir, renderizar, revisar y corregir solo, sin esperar una ronda con Cotu. Si eso queda escrito en `CLAUDE.md`, se ahorra una ida y vuelta por molde.

## Nota sobre el material

Las referencias son videos de terceros con temas de otros artistas. Están para estudiar la mecánica, nada más: no se usan dentro de las piezas, y los renders de ejemplo van con los temas de `datos-prueba/`.
