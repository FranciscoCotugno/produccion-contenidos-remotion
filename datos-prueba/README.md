# Temas de prueba

Un `tema.json` por tema, con el esquema de `shared/tema.ts`: título, artistas,
portada, colores, fragmento (archivo, inicio, fin), ubicación dentro del tema
completo (`track`), letra con tiempos por palabra y grilla de beats.

Los tiempos de la letra y de los beats están en segundos desde el inicio del
fragmento. `fragment.src` es una ruta dentro de `assets/`: los clips se copian
a mano a `assets/media/`, que no se sube al repo.

| Tema | Fragmento | Beats | Archivo esperado en `assets/media/` |
|---|---|---|---|
| `fmk-si-sale-el-sol` | tema completo (0,65 a 147,9 s del videoclip) | sin beats | `fmk-si-sale-el-sol/videocompleto-fmk-si-sale-el-sol.mp4` (está) |
| `fmk-si-sale-el-sol-1` | 0:26,6 a 0:55 del tema | 172,3 BPM (poco precisa) | ídem |
| `fmk-si-sale-el-sol-2` | 1:05,1 a 1:26 del tema | 172,3 BPM (poco precisa) | ídem |
| `instinto-luv` | 0 a 20 s del clip (cae en 11,33 s del tema) | 104,3 BPM (por el bombo) | `santy-p-insintoluv/santy-p-instintoluv.mp4` (está) |
| `agua` | 30 a 59 s | 132,5 BPM | `Maluma, Shakira - AGUA (Official Video) - MalumaVEVO (1080p, h264).mp4` |
| `a-quien-le-importa` | 113,6 a 139,133 s | sin beats | `a-quien-le-importa.mp4` |
| `si-sale-el-sol-150` | 26,9 a 55,5 s | 178,2 BPM | `Si_sale_el_sol/si-sale-el-sol-1080.mp4` |
| `si-sale-el-sol-100` | 61,7 a 86,8 s | 178,2 BPM | `Si_sale_el_sol/si-sale-el-sol-1080.mp4` |

Pendiente en `agua`, `a-quien-le-importa` y `si-sale-el-sol`: el clip, la portada (`cover`) y los colores (`colors`).

## instinto-luv (Santy P)

Armado a partir de `assets/media/santy-p-insintoluv/` (`datos.txt`, `letra.txt`, clip, MP3, portada y dos fotos de prensa).

- **Clip:** `santy-p-instintoluv.mp4`, 1080×1080, 20,18 s con audio. Es el fragmento entero (0:00 a 0:20, estribillo).
- **Tema completo:** `santy-p-instintoluv.MP3`, 2:12,89. `datos.txt` dice "duración total 0:20", pero esa es la del clip: para la barra se usa la del MP3.
- **Colores:** tomados a ojo de la portada (violeta sobre marrón oscuro).
- **Letra:** texto de `letra.txt` (la oficial); tiempos por palabra de Whisper (`large-v3-turbo`, `npm run tiempos -- instinto-luv`). Se corrió tres veces: sobre la mezcla con la letra como prompt, sobre la mezcla sin prompt, y sobre la voz separada (BS-RoFormer, con `audio-separator`). Las tres coinciden (diferencias de 0 a 2 cuadros, media 0,07), así que la música no corría los tiempos. Quedó la de la voz separada: 73 de 73 palabras ancladas, ninguna interpolada. Un desfase parejo que se note de oído se corrige con `ajusteLetra` en el reproductor.
- **Clip recortado por el sello:** arranca en el segundo 11,33 del tema (dato del sello).
- **Fotos de prensa** (`prensa-1.jpg`, `prensa-2.jpg`, 1170×1560): no entran en el esquema del tema; quedan para el molde `prensa`.
- La carpeta de medios se llama `santy-p-insintoluv` (falta una "t"); los archivos de adentro dicen `instintoluv`. Se dejó como está.

## fmk-si-sale-el-sol (FMK)

Armado a partir de `assets/media/fmk-si-sale-el-sol/` (`datos-si-sale-el-sol.txt`, `letra-si-sale-el-sol.txt`, videoclip completo y un recorte vertical). Es otra bajada que la de `si-sale-el-sol-150` / `-100` (que vienen del repo de origen).

- **Videoclip:** `videocompleto-fmk-si-sale-el-sol.mp4`, 1920×1080, 25 fps, 148,89 s. **El tema arranca en 0:00,65** del clip (antes hay silencio digital) y termina con un fundido que se apaga en 147,9 s: **dura 2:27,25** (`datos` decía 2:28, que es el largo del video).
- **Audio:** no había `audio.mp3`; se extrajo del videoclip completo (`audio.mp3`, 192 kb/s). Es el audio del clip entero, con los 0,65 s de silencio al principio.
- **Recorte vertical:** `fmk-si-sale-el-sol-1.mp4`, 1080×1920, 25 fps, 33,88 s. Por correlación de audio (0,98) es el tramo 63,735 a 97,62 s del videoclip: un recorte vertical del fragmento 2. Los fragmentos usan el videoclip completo.
- **Portada:** no había; es un cuadro del clip (segundo 20, plano general de la banda), recortado al cuadrado del centro: `portada.jpg`. Colores tomados de esa escena (ladrillo y ámbar de las lámparas).
- **Tiempos de los fragmentos contra la letra** (los de `datos` salen de la bajada; tiempos del tema, no del clip):
  - Fragmento 1 (`datos`: 0:28 a 0:55): **no coincide el inicio.** "estando cerca o a distancia" empieza en **0:26,7**; a 0:28 ya va por "a distancia". El final sí: "malgastar" en 0:52,7 y después entra una parte hablada ("esto es FMK con Kchiporros…", no está en la letra) desde 0:55,2. Fragmento usado: **0:26,6 a 0:55**.
  - Fragmento 2 (`datos`: 1:05 a 1:26): **coincide.** "flaca" en **1:05,5** y "encuentro" en 1:24,9; el estribillo vuelve en 1:26,4. Fragmento usado: **1:05 a 1:26**.
- **Letra:** texto de la letra oficial, tiempos de Whisper.
  - Tema completo: 206 de 211 palabras ancladas, sobre la mezcla. "flaca" Whisper no la oía (la tomaba como "Te" o "yo"): se ubicó con la voz separada y se corrigió a mano en el tema completo (flaca 65,52 s, "te invito" 66,70 s).
  - Fragmento 1: sobre la mezcla, `--desde "estando cerca" --hasta malgastar`, 51 de 52 ancladas; coincide con el tema completo.
  - Fragmento 2: sobre la voz separada (BS-RoFormer) recortada al fragmento, `--desde flaca --hasta encuentro`, 46 de 46.
- **Pedido del sello** (en `datos`): letra minimalista y fina, fundido de entrada y salida, estética tipo Brat, tipografía Arial o TikTok Sans. El fundido y la estética Brat son para otro molde, no para el reproductor. La letra fina sí se usa acá (TikTok Sans Light). Arial se reemplaza por Arimo (mismas métricas, licencia abierta).

## Origen

Traídos de `automatizacion-kioscos` (`src/lyrics*`, `src/beats/`, `src/Root.tsx`).

- La letra salió de Whisper y se corrigió a mano contra la letra oficial. En
  Agua y Si sale el sol los tiempos están adelantados 0,3 s respecto de
  Whisper, porque caía tarde contra la voz.
- Si sale el sol "150" va de "estando cerca..." a "...malgastar"; "100" va de
  "flaca..." a "...encuentro". Es un proxy 1080p del original 4K.
- Beats de `si-sale-el-sol-150`: el fragmento solo detectaba 172,3 BPM. La
  sección 20-100 s y el fragmento 100 coinciden en 178,2 BPM, así que la
  grilla se proyectó desde esa detección más larga.
- A quién le importa no tiene beats: no se detectaron en el repo de origen.
