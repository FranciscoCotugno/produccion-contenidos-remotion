# Temas de prueba

Un `tema.json` por tema, con el esquema de `shared/tema.ts`: título, artistas,
portada, colores, fragmento (archivo, inicio, fin), ubicación dentro del tema
completo (`track`), letra con tiempos por palabra y grilla de beats.

Los tiempos de la letra y de los beats están en segundos desde el inicio del
fragmento. `fragment.src` es una ruta dentro de `assets/`: los clips se copian
a mano a `assets/media/`, que no se sube al repo.

| Tema | Fragmento | Beats | Archivo esperado en `assets/media/` |
|---|---|---|---|
| `agua` | 30 a 59 s | 132,5 BPM | `Maluma, Shakira - AGUA (Official Video) - MalumaVEVO (1080p, h264).mp4` |
| `a-quien-le-importa` | 113,6 a 139,133 s | sin beats | `a-quien-le-importa.mp4` |
| `si-sale-el-sol-150` | 26,9 a 55,5 s | 178,2 BPM | `Si_sale_el_sol/si-sale-el-sol-1080.mp4` |
| `si-sale-el-sol-100` | 61,7 a 86,8 s | 178,2 BPM | `Si_sale_el_sol/si-sale-el-sol-1080.mp4` |

Pendiente para todos: portada (`cover`) y colores (`colors`).

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
