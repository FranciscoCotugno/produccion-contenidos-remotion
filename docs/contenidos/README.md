# Tablero de contenidos

Lo que cada molde necesita en contenido (no código) para construirse y probarse, qué hay y qué falta. Va en el orden de `templates/README.md`. Lo mantiene Cowork y lo actualiza cada vez que entra material.

✅ listo · ⚠️ parcial o provisorio · ❌ falta

## Por molde

| # | Molde | Cuentas | Referencias | Temas de prueba | Textos | Bancos | Falta | Quién |
|---|---|---|---|---|---|---|---|---|
| 1 | `reproductor-app` | L05, L06, L13 | ⚠️ solo Apple oscuro | ✅ | ✅ | No usa | Capturas de Spotify (L06) y Apple claro (L13) | Cotu |
| 2 | `brat-puro` | L01, L12 | ✅ | ✅ | No usa | No usa | Nada. Pedido listo en `docs/pedidos/brat-puro.md` | — |
| 3 | `chat` | C3, R1, R3 | ⚠️ solo R1 | ✅ | ✅ | No usa | Referencias de C3 (chat oscuro de a dos) y R3 (mensaje directo) | Cotu |
| 4 | `tarjeta-letra` | C4, C9 | ⚠️ 1 de integración, ninguna de tarjeta de letra | ✅ | ✅ (criterios) | ❌ `fondos-tarjetas` | Captura de una tarjeta de letra compartida desde una app de música. Banco de fondos (pedido IA). Mientras tanto se prueba con `fotos-dia` y `fotos-noche` | Cotu y Code |
| 5 | `reproductor-widget` | L07, C5, C6 | ✅ | ✅ | ✅ | ⚠️ 3 en `fotos-frias`, ninguno cálido | `fondos-frios` y `fondos-calidos` (pedido IA) | Code |
| 6 | `letra-sobre-video` | L08, L11, POV1 a POV8 | ⚠️ 3 en total, ninguna por nicho | ⚠️ sin material en vivo | ✅ | ⚠️ solo `nicho-driving-night` (3) | Material en vivo (L11). Bancos de nicho (ver abajo). Una referencia por nicho | Cotu, editores y Code |
| 7 | `brat-maximal` | L02, L03 | ✅ | ⚠️ sin material en vivo | No usa | No usa | Material en vivo de algún tema de prueba (L02) | Cotu |
| 8 | `brat-minimal` | L04 | ✅ | ✅ | ✅ palabras destacadas aprobadas | No usa | Nada | — |
| 9 | `carrusel` | C1, C2, C8, R2 | ✅ | ⚠️ fotos de FMK sin bajar | ✅ | ⚠️ existen, sin origen claro | Bajar las fotos de prensa de FMK. Bancos IA de fotos | Cotu y Code |
| 10 | `nota-celular` | C7 | ❌ | ✅ | ✅ | No usa | Una o dos capturas de la app de notas, clara y oscura | Cotu |
| 11 | `karaoke` | L09 | ❌ | ✅ | ✅ | No usa | Referencias de karaoke en TikTok | Cotu |
| 12 | `tipografico` | L10 | ❌ | ⚠️ sin beats en FMK ni en Instinto Luv | No usa | No usa | Referencias de lyrics tipográficos animados. Beats de FMK e Instinto Luv | Cotu y Code |
| 13 | `prensa` | P1, P2 | ❌ | ⚠️ sin datos de lanzamiento | ✅ | No usa | Marcas (propuesta en `prensa-marcas.md`). Datos de lanzamiento de un tema. Referencias de medios de música | Cotu |
| 14 | `memes` | M1 | ✅ | ✅ | ✅ | ❌ reacciones | Clips de reacción (editores). Imágenes de reacción (IA opcional) | Editores y Cotu |

"Temas de prueba ✅" quiere decir que hay al menos 2 temas con el material que pide el molde. Hoy esos dos son `fmk-si-sale-el-sol` e `instinto-luv`.

## Temas de prueba

| Tema | Audio | Clip | Portada | Letra con tiempos | Beats | Prensa | En vivo | Datos de prensa |
|---|---|---|---|---|---|---|---|---|
| `fmk-si-sale-el-sol` | ⚠️ sacado del clip | ✅ | ⚠️ cuadro del clip | ✅ | ❌ | ⚠️ 4 en Drive | ❌ | ❌ |
| `instinto-luv` | ✅ | ✅ (recorte de 20 s) | ✅ | ✅ | ❌ | ✅ 2 | ❌ | ❌ |
| `agua` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `a-quien-le-importa` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `si-sale-el-sol-150` y `-100` | ❌ | ❌ (falta el proxy 1080p) | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |

Con FMK e Instinto Luv alcanza para todos los moldes menos `prensa` y `tipografico`. `brat-maximal` y `letra-sobre-video` se pueden construir, pero sin probar sus cuentas en vivo (L02 y L11). Lo que bloquea:

- **Material en vivo** (L02 y L11).
- **Datos de lanzamiento** (prensa).
- **Beats** (tipográfico): ninguno de los dos temas completos tiene beats. Los de `si-sale-el-sol-150` no tienen clip.

Pedirle al sello material en vivo y datos de prensa de FMK o de Santy P desbloquea los dos primeros. Los beats de FMK los puede sacar Code (librosa) o reusar los de `si-sale-el-sol-150` (178,2 BPM).

## Bancos

| Banco | Cuentas | Fuente (grilla) | Estado | Siguiente paso |
|---|---|---|---|---|
| `fotos-dia` | C1 | Imagen IA | ⚠️ 8 de origen desconocido | Generar con IA (pedido) |
| `fotos-noche` | C2 | Imagen IA | ⚠️ 8 de origen desconocido | Generar con IA |
| `fotos-flash` | C8 | Imagen IA | ⚠️ 4 de origen desconocido | Generar con IA |
| `fondos-frios` | C5 | Imagen IA | ⚠️ 3 en `fotos-frias` | Generar con IA y unificar nombre |
| `fondos-calidos` | C6 | Imagen IA | ❌ | Generar con IA |
| `fondos-tarjetas` | C4 | Imagen IA | ❌ | Generar con IA |
| `nicho-lluvia-ciudad` | POV7 | Video IA | ❌ | Generar con IA (Kling) |
| `nicho-ciudades` | POV8 | Video IA y stock | ❌ | Generar con IA (Kling) |
| `nicho-snowboard` | POV1 | Stock y editores | ❌ | Editores |
| `nicho-surf` | POV2 | Stock y editores | ❌ | Editores |
| `nicho-downhill` | POV3 | Stock y editores | ❌ | Editores |
| `nicho-driving-night` | POV4 | Stock y filmación | ⚠️ 3 clips | Editores |
| `nicho-gta` | POV5 | Grabación de juego | ❌ | Editores (ver licencias) |
| `nicho-futbol` | POV6 | Editores | ❌ | Editores (ver licencias) |
| `reacciones` | M1 | Clips virales y editores | ❌ | Editores (ver licencias) |

Pedido de bancos IA: `docs/pedidos/bancos-ia.md`.

### Para los editores (bancos de video)

Clips verticales 9:16, sin sonido o con el sonido descartable, de 8 a 15 segundos, sin caras reconocibles en primer plano y sin logos ni marcas visibles. Nombres: `<banco>-001.mp4`, dentro de la subcarpeta de origen (`stock/`, `editores/`, `filmacion/`). Para arrancar alcanzan 10 por banco.

## Licencias: ojo

`CLAUDE.md` exige licencia que cubra el uso real, comercial. Hay tres bancos con riesgo:

- **`nicho-gta`:** el gameplay es propiedad de Rockstar. Hay que revisar si su política de videos permite el uso comercial para promocionar música de terceros.
- **`nicho-futbol`:** las jugadas de partidos oficiales tienen derechos de transmisión. Es el banco más riesgoso. Alternativas: fútbol amateur filmado propio o stock con licencia.
- **`reacciones`:** los clips virales son de sus autores. Mejor reacciones filmadas propias, stock o el banco IA opcional.
- **Stock y Pinterest:** el stock tiene que tener licencia comercial para redes. Lo de Pinterest no tiene licencia: sirve solo para el laboratorio.

## Referencias a buscar en TikTok

Para Cotu. Van en `referencias/<molde>/`, con su `REFERENCIAS.md`.

- **`reproductor-app`:** una captura del reproductor de Spotify en pantalla completa (L06) y una de Apple Music en modo claro (L13).
- **`chat`:** un chat oscuro de a dos con audio y video (C3), y un DM de Instagram con un reel compartido y respuesta (R3).
- **`tarjeta-letra`:** la tarjeta que genera Spotify o Apple Music al compartir un fragmento de letra.
- **`letra-sobre-video`:** un video por nicho (snow, surf, downhill, manejo nocturno, GTA, fútbol, ciudades) con texto POV arriba, para tomar posición y tamaño del texto.
- **`nota-celular`:** captura de la app de notas, clara y oscura.
- **`karaoke`:** 2 o 3 cuentas de karaoke con palabra resaltada.
- **`tipografico`:** 2 o 3 lyric videos tipográficos con animaciones al beat.
- **`prensa`:** 2 o 3 cuentas de medios de música en TikTok, una sobria y una pop.

## Biblioteca de textos

En `textos/`: plantillas por cuenta para cualquier tema. Los ejemplos ya aplicados a un tema están en `datos-prueba/<tema>/textos.txt`. Revisados y aprobados por Cotu. Las marcas de prensa (`prensa-marcas.md`) siguen como propuesta hasta que se elija el nombre.

## Plantilla de bajada

`docs/campanas/_plantilla-bajada.md`, con los 8 campos de la grilla.
