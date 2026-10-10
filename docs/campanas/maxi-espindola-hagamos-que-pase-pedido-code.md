# Pedido para Claude Code: preparar el tema "Hagamos que pase" (Maxi Espindola)

Copiá todo lo que sigue y pegalo en Claude Code, dentro de `D:\ESPACIO-REMOTION`.

---

Vamos a preparar el tema de una campaña real: **Maxi Espindola – Hagamos que pase**. Leé primero `docs/campanas/maxi-espindola-hagamos-que-pase.md` (la bajada) y `docs/campanas/maxi-espindola-hagamos-que-pase-plan.md` (el plan de 100 videos, que arranca con una primera tanda de 40). Los medios están en `assets/media/maxi-espindola-hagamos-que-pase/` y no se suben al repo.

**1. Renombrar los medios** (con `mv -n`, sin pisar nada) y actualizar cualquier ruta que los use:

- `Maxi Espindola - HAGAMOS QUE PASE (Official Video).mp4` → `videoclip.mp4`
- `Maxi Espindola - HAGAMOS QUE PASE .mp3` → `audio.mp3`
- `portada-hagamosquepase.jpg` → `portada.jpg`
- Los cuatro `maxi-envivo*.mp4` quedan con su nombre. Ninguno es de esta canción: se usan siempre en mute, con `audio.mp3` encima.

**2. Audio.** El videoclip trae AAC de 128 kb/s y el MP3 que ya está es un transcode del mismo audio, así que no se gana calidad pasando a MP3 de 192 kb/s. Copiá el AAC del videoclip sin recodificar a `audio-videoclip.m4a` (`-c:a copy`) para conservar los bits originales. Para las composiciones seguí usando `audio.mp3` (el MP3 renombrado). Cuando el sello mande el audio en alta calidad, lo reemplazamos.

**3. Letra con tiempos.** La letra oficial está en `assets/media/maxi-espindola-hagamos-que-pase/letra.txt`: no la cambies, ni la ortografía ni la puntuación. La línea "Bienvenidos a DO." no se usa en ninguna pieza. El tema arranca en 0:00,52 del videoclip. El estribillo se repite tres veces, así que medí con `--desde` y `--hasta` y usá la **primera aparición** del estribillo (alrededor de 0:43). Fragmentos aprobados por Cotu (los tres):

- **Fragmento 1:** de "La luna nos sacó a bailar" a "a un solo trago de empezar".
- **Fragmento 2** (lo definió Cotu: del segundo 12 al 28 del tema): de "y ahora" (final de la segunda línea de la estrofa) a "no es por accidente". Incluye "Somos dos extraños con la mirada perdida de frente / Buscando callarnos la mente" y "Y si terminamos aquí, en medio de tanta gente, no es por accidente". Empieza en mitad de una línea y el script recorta por líneas enteras. No hace falta tocar el script: corré por líneas completas (de "Quién iba a pensar que como yo tú también saliste sola, y ahora" hasta "no es por accidente"), y en el `tema.json` sacá las palabras anteriores a "y ahora". El inicio del fragmento queda 0,3 a 0,5 s antes de la "y".
- **Fragmento 3** (aprobado por Cotu): de "Y para qué dejar que pase otra canción" a "Solo hagamos que pase" (alrededor de 0:29 a 0:43).

Que la primera palabra caiga entre 0,3 y 0,5 s del fragmento, como en los otros temas. Si Whisper duda en alguna palabra, probá con la voz separada (como en `instinto-luv`) y decime cuáles quedaron interpoladas.

**4. `tema.json`.** Armá `datos-prueba/maxi-espindola-hagamos-que-pase-1/`, `-2/` y `-3/` (uno por fragmento), con el esquema de `shared/tema.ts`: título, artistas ("Maxi Espindola"), portada, colores (rojo neón, azul noche y naranja, a ojo de la portada; ajustalos si ves mejor), fragmento, `track`, letra con tiempos y beats. Los beats **no** van por ahora: `npm run beats` no existe (el script vivía en `automatizacion-kioscos`) y los moldes que usan beats funcionan sin la grilla (`a-quien-le-importa` ya va así). Antes de seguir, decime si algún molde de la tanda 1 necesita `tema.beats` para verse bien; si alguno la necesita, lo resolvemos aparte. El fragmento usa el `videoclip.mp4`.

**5. Textos.** Los textos por molde están en `datos-prueba/maxi-espindola-hagamos-que-pase/textos.txt`. **Todavía son una propuesta**: no armes las piezas finales hasta que Cotu los apruebe. Podés armar los `*.json` de cada molde con ellos para probar.

**6. Comprobaciones.**

- Armá una composición de prueba por molde de la tanda 1 (L01, L12, L02, L03, L04, L05, L09, L08, L11, C3, R1, R3, C7) en un cuadro estático. Nada de renders de video.
- Con los videos en vivo (576 px de ancho), decime cómo se ven en 9:16 y en 1:1. `maxi-envivo-2.mp4` es 3:4.
- `reproductor-app` tiene solo la piel Apple oscura (ya lo confirmaste): L06 y L13 quedan afuera y esas piezas se suman a L05.

**7. Al terminar,** decime qué cambiaste, qué dudas quedaron y qué falta. No hagas commit ni push: lo reviso yo.

---
