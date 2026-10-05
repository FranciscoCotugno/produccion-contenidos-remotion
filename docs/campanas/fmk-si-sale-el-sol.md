# Campaña FMK – Si sale el sol

Tema: `fmk-si-sale-el-sol` · Sello: Sony Music Argentina · Cargada: 2026-10-04

## Bajada (pasada en limpio)

**Pedido del sello (aplica a todas las piezas):**

- Letra minimalista, **letra finita**. Los editores tienen que respetarlo sí o sí.
- Animaciones con fade in y fade out. Las animaciones pueden volar más: tipo Brat, etc.
- **Tipografía fija: Arial o TikTok.** En el proyecto: TikTok Sans o Arimo (Arimo es la alternativa a Arial).

**Qué hacer con el material:**

- Lyrics con el videoclip.
- Loops.
- Carruseles con frase. Ejemplo: como dice FMK, "si sale el sol / contigo quiero despertar".

**Fragmentos (cada uno es un video):**

| | Desde | Hasta | Piezas |
|---|---|---|---|
| Parte 1 | 0:28, "estando cerca o a distancia igual te quiero" | 0:55, "yo no la quiero malgastar" | 20 |
| Parte 2 | 1:05, "flaca" | 1:26, "cantando hasta que llegue nuestro encuentro" | 10 |
| **Total** | | | **30** |

**Links de la bajada:**

- Audio oficial (TikTok): https://vt.tiktok.com/ZS9DYKQ4dG9Mr-jFrI2/
- Videoclip completo (bajar en la máxima resolución): https://youtu.be/6e7OT7Hwpl4
- Videos ya recortados por el sello: zip "ASSETS RECORTADOS FMK". **El link no está en la bajada.** Hay que chequear que los recortes sean las partes pedidas.
- Fotos (Drive, fotógrafo facugarayo, JPG de 13 a 26 MB):
  - `facugarayo_-18.JPG`: https://drive.google.com/file/d/1BG8QAJCKGi4_VGjdk5kLIWnaDapoTwBO/view
  - `facugarayo_-19.JPG`: https://drive.google.com/file/d/1uaWzq5Y7SAaH7P3094uHMDQpdLEVumvO/view
  - `facugarayo_-20.JPG`: https://drive.google.com/file/d/1W30kzSYNmJRXWA7pdGztwV--6YOVFkzf/view
  - `facugarayo_-22.JPG`: https://drive.google.com/file/d/1If94KE6jYkN7eSms9K8RE1owHlkm3rQO/view

> La letra de la bajada trae errores de tipeo: "comino" por "camino", "q" por "que", "aterrice", "no se porque", "entre a las olas". Usar siempre `datos-prueba/fmk-si-sale-el-sol/letra.txt`, que ya está corregida.

## Material: qué hay y qué falta

| Material | Estado |
|---|---|
| Audio (`audio.mp3`) | ⚠️ Provisorio: Claude Code lo extrajo del videoclip. Falta el audio en alta calidad del sello. |
| Portada (`portada.jpg`) | ⚠️ Provisoria: es un cuadro del clip. Falta la portada oficial. |
| Videoclip completo | ✅ Está como `videocompleto-fmk-si-sale-el-sol.mp4` (1920×1080, 25 fps, 2:28). El tema arranca en 0:00,65. Se renombra a `clip.mp4`. |
| Recortes del sello | ⚠️ `fmk-si-sale-el-sol-1.mp4` es un recorte vertical (1080×1920) **del fragmento 2**, no del 1. No hay recorte del fragmento 1. Falta el link del zip. |
| Fotos de prensa | ❌ Están en Drive, sin bajar. |
| Material en vivo | ❌ No hay. La bajada no lo menciona. |
| Letra | ✅ Corregida y con tiempos (Claude Code). Hay dudas para confirmar de oído (ver abajo). |
| Datos del tema | ✅ Duración 2:27. El fragmento 1 arranca en 0:26,6, no en 0:28 como dice la bajada. |
| Hook para carruseles | ✅ "si sale el sol / contigo quiero despertar" (sale de la bajada). |

### Campos de la bajada que faltan

Según la plantilla de la grilla (`_plantilla-bajada.md`). Lo que figura acá es una propuesta para que la confirme Cotu.

- **Artistas:** en 0:55 hay una parte hablada: "esto es FMK con Kchiporros". ¿El tema es FMK con Kchiporros? Cambia lo que va en tarjetas, reproductores y prensa.
- **De qué habla** (propuesta): ganas de despertar con alguien. Verano, calor y escaparse juntos.
- **Frases clave** (propuesta): "si sale el sol / contigo quiero despertar" · "aterricé y ya te pensé" · "flaca, te invito a disfrutar este momento" · "que las penas se vayan con el viento".
- **Ángulos** (propuesta): a quien extrañás estando lejos · plan de verano o de escapada · domingo de sol.
- **Datos para prensa:** fecha, productor, director del clip, shows. Faltan todos.
- **Límites del sello:** solo la tipografía y la "letra finita". ¿Hay algo más?

### Por molde (solo los que pide la bajada)

| Molde | Cuentas | ¿Alcanza el material? | Molde construido |
|---|---|---|---|
| `reproductor-app` | L05, L06, L13 | Sí. Faltan los tiempos de la letra (Code). | Sí (piel Apple oscura) |
| `letra-sobre-video` | L08 | Sí | No |
| `brat-minimal` | L04 | Sí | No |
| `brat-puro` | L01, L12 | Sí | No |
| `karaoke` | L09 | Sí | No |
| `tipografico` | L10 | Sí | No |
| `reproductor-widget` | L07 | Sí (con clip) | No |
| `carrusel` | C1, C2, C8, R2 | Faltan las fotos de prensa bajadas | No |
| `tarjeta-letra` | C4, C9 | Sí | No |

Quedan afuera porque la bajada no los pide y faltan textos o material: `chat`, `nota-celular`, `memes`, `prensa`, `brat-maximal` L02 (en vivo).

## Dudas de letra (confirmar de oído)

Por orden de prioridad. Las que caen dentro de los fragmentos salen en pantalla en las 30 piezas.

1. **[Parte 1] "bajo la luz que nos domina cada día"**: ¿"domina" o "ilumina"? Dos versos después aparece "hay tanta piel que nos domina", y la repetición llama la atención.
2. **[Parte 1] "no sé por qué no te animas"**: ¿"animas" (tú) o "animás" (vos)? La canción mezcla los dos ("contigo", "vos y yo").
3. **[Parte 2] "flaca"**: ¿va sola en su renglón o pegada a "te invito a disfrutar este momento"? Define cómo arranca la parte 2 en pantalla.
4. [Fuera de fragmentos] El mismo tema de vos o tú en "imagina", "cambias de idea" y "ya sabes". ¿Llevan tilde de voseo (imaginá, cambiás, sabés)?
5. [Fuera de fragmentos] "entre las olas del mar". La bajada dice "entre a las olas", que parece error de tipeo.
6. [Tema completo] ¿Termina en "ya sabes lo que te espera" o hay un estribillo u outro al final? La letra corta ahí.

Criterio de mayúsculas en `letra.txt`: todo en minúscula salvo nombres propios (Buenos Aires, Asunción, Necochea). Cómo se muestra en pantalla lo decide cada molde.

## Pendientes

**Cotu:**

- [ ] Confirmar las dudas de letra 1 a 3, que entran en los fragmentos.
- [ ] Pasar el link del zip "ASSETS RECORTADOS FMK". Hoy solo hay un recorte vertical del fragmento 2.
- [ ] Pedirle al sello el audio en alta calidad, la portada oficial y los datos para prensa.
- [ ] Confirmar los artistas: ¿FMK solo, o con Kchiporros?
- [ ] Bajar las 4 fotos de Drive a `assets/media/fmk-si-sale-el-sol/`. Code las renombra.
- [ ] Decidir el reparto de las 30 piezas por cuenta o molde (20 de la parte 1, 10 de la parte 2). Hoy solo `reproductor-app` está construido.
- [ ] Confirmar si la tipografía obligatoria aplica solo a la letra o también a la interfaz del reproductor (título, artista).
- [ ] Confirmar si las fotos llevan crédito del fotógrafo.

**Claude Code** (ver `fmk-si-sale-el-sol-pedido.md`):

- [ ] Movimientos y renombres de archivos.
- [x] Duración del tema, offset del tema en el clip y verificación de los tiempos de los fragmentos (hecho por Code, ver `datos-prueba/README.md`).
- [x] Tiempos de la letra y `tema.json` del tema y de los fragmentos.
- [ ] Volver a correr los tiempos si cambian las dudas de letra.
- [ ] Renders.
