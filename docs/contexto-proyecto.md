# Contexto del proyecto

## Qué estamos haciendo

Este proyecto es un sistema de producción de contenido para TikTok a gran escala: unos 2000 videos por mes, con la menor edición manual posible. Por ahora los clientes son sellos discográficos (principalmente Sony Music Argentina), que nos encargan mover sus lanzamientos y su catálogo en TikTok.

La base del sistema son los **moldes** (templates de Remotion). Un molde se programa una vez y después produce videos con cualquier tema, cambiando solo los datos. Hoy cada video lo edita una persona a mano; con los moldes, el trabajo pasa a ser decidir qué contar y revisar resultados, no editar pieza por pieza.

Queremos **muchos moldes**, porque la variedad de formato es lo que hace rendir el contenido. Un mismo tema contado en muchos formatos distintos llega a más gente y a más momentos de escucha. Y para el algoritmo, dos videos que solo cambian el texto son casi el mismo video: lo que diferencia es la estructura visual. Por eso cada molde tiene que distinguirse de los demás desde el primer segundo.

La lógica de las cuentas: **la cuenta es el formato, la canción es el contenido.** Cada cuenta de TikTok tiene un formato fijo (reproductor, Brat, chat, carrusel, POV...) y cualquier tema puede entrar en cualquier cuenta. Lo que dice cada pieza sale de la **bajada de línea** de cada lanzamiento.

## Quién hace qué

| Quién | Qué hace |
|---|---|
| Cotu | Define formatos y criterio, escribe las bajadas, revisa los resultados |
| Claude Code | Programa los moldes en `templates/` y `shared/` |
| Claude Cowork | Prepara materiales: archivos de cada tema, letras, bancos, pedidos |
| Agustín | Arma el sistema final que va a producir en serie con los moldes (otro repositorio) |
| Editores | Producen material de stock para los bancos |

## La carpeta D:\ESPACIO-REMOTION

| Carpeta | Qué hay | Quién escribe |
|---|---|---|
| `CLAUDE.md` | Reglas para Claude Code | Claude Code |
| `templates/` | Los moldes (código + `FICHA.md` de cada uno). Índice en `templates/README.md` | Claude Code |
| `shared/` | Piezas de código compartidas | Claude Code |
| `referencias/` | Capturas y videos de TikTok de cada molde | Cotu |
| `datos-prueba/<tema>/` | `datos.txt`, `letra.txt` y `tema.json` de cada tema | Cowork (txt), Claude Code (json) |
| `assets/media/<tema>/` | Audio, videoclip, portada, fotos de cada tema | Cowork |
| `assets/media/bancos/` | Bancos de imágenes y videos que no son de un tema | Cowork |
| `docs/campanas/` | Bajadas de campañas y sus listas de pendientes | Cowork |

## Los moldes

Son 14 moldes que cubren las 36 cuentas de la grilla. El índice, con el orden de construcción, está en `templates/README.md`, y el detalle de cada uno en `templates/<molde>/FICHA.md`. Para tu trabajo importa sobre todo qué material necesita cada molde:

| Molde | Cuentas | Material que necesita |
|---|---|---|
| `reproductor-app` | L05, L06, L13 | Clip, audio, letra con tiempos (o un texto fijo), título y artistas |
| `reproductor-widget` | L07, C5, C6 | Clip (L07) o imagen de `fondos-frios`/`fondos-calidos` (C5, C6), audio, portada, letra o texto fijo |
| `brat-puro` | L01, L12 | Audio, letra con tiempos por palabra |
| `brat-maximal` | L02, L03 | Material en vivo (L02) o clip (L03), audio, letra con tiempos |
| `brat-minimal` | L04 | Clip, audio, letra con tiempos por palabra |
| `letra-sobre-video` | L08, L11, POV1 a POV8 | Clip (L08), material en vivo (L11) o clips de un banco de nicho (POV), audio, letra con tiempos o texto fijo |
| `karaoke` | L09 | Clip, audio, letra con tiempos por palabra |
| `tipografico` | L10 | Audio, portada, letra con tiempos |
| `carrusel` | C1, C2, C8, R2 | Fotos de `fotos-dia`/`fotos-noche`/`fotos-flash`, fotos de prensa, portada, estrofa y hook |
| `tarjeta-letra` | C4, C9 | Portada, líneas de letra, imagen de fondo (C4) |
| `chat` | C3, R1, R3 | Clip, audio, portada, textos de la conversación |
| `nota-celular` | C7 | Audio, portada, texto de la nota |
| `prensa` | P1, P2 | Fotos de prensa o clip, audio, datos del lanzamiento, marca del medio |
| `memes` | M1 | Portada, textos, imágenes o clips de `memes`/`reacciones`, audio |

"Letra con tiempos" la genera Claude Code a partir de `letra.txt` (con `npm run tiempos`). Lo que no sale del material (hooks, conversaciones, textos de notas) sale de la bajada de línea de cada campaña.

## Convenciones de cada tema

**Nombre de carpeta:** `artista-tema`, en minúscula, con guiones, sin espacios ni tildes. Ejemplo: `fmk-si-sale-el-sol`. Se usa el mismo nombre en `datos-prueba/` y en `assets/media/`.

**Archivos en `assets/media/<tema>/`:** `audio.mp3` (tema completo), `clip.mp4` (videoclip completo, o el recorte que dé el sello), `portada.jpg`, `prensa-1.jpg`, `prensa-2.jpg`..., `en-vivo-1.mp4`...

**`datos-prueba/<tema>/datos.txt`:**

```
Título:
Artistas: (el principal primero, después los feats separados por coma)
Duración total del tema: m:ss
En el videoclip, el tema arranca en: m:ss (0:00 si no tiene intro)
Fragmento 1: m:ss a m:ss (qué parte es)
Fragmento 2: m:ss a m:ss
Notas:
```

Si el clip es un recorte del sello, se aclara en Notas en qué segundo del tema arranca. Los tiempos de los fragmentos se toman del audio del tema.

**`datos-prueba/<tema>/letra.txt`:** la letra completa tal cual se canta, un verso por renglón, un renglón vacío entre estrofas, estribillos escritos cada vez que aparecen (nunca "x2"). Ortografía corregida: la letra aparece en pantalla. Las dudas se listan aparte para confirmar de oído.

**Bancos (`assets/media/bancos/<banco>/`):** una subcarpeta por origen (`pinterest/`, `stock/`, `ia/`). Archivos nombrados `<banco>-001.jpg` o `.mp4`.

## Cómo se procesa una campaña

1. Guardar la bajada en `docs/campanas/<campaña>.md`.
2. Crear las carpetas del tema en `datos-prueba/` y `assets/media/`.
3. Escribir `datos.txt` y `letra.txt` corregida.
4. Ordenar y renombrar los materiales que haya.
5. Listar lo que falta y las dudas de la letra.
6. Redactar el pedido para Claude Code (armar `tema.json`, correr los tiempos de la letra, renderizar).

## Estado actual

- Molde `reproductor-app`: piel Apple oscura casi cerrada; faltan las pieles clara y Spotify.
- Siguientes moldes, en orden: `brat-puro`, `letra-sobre-video`, `carrusel`, y después el resto del índice.
- Temas cargados: `instinto-luv` (Santy P, clip recortado por el sello) y `fmk-si-sale-el-sol` (campaña activa).
- Tipografías disponibles: TikTok Sans, Geist, Fraunces, Ronzino, AKONY, Archivo Narrow. Cuando un sello pide Arial: TikTok Sans o Arimo.
