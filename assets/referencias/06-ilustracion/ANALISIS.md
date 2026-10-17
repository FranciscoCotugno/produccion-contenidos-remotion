# Análisis: carpeta `06-ilustracion`

Hecho mirando los videos cuadro por cuadro, octubre 2026. Los textos de ejemplo son inventados: las referencias son temas de terceros y acá solo se describe la mecánica.

**Cuenta:** `@jona_lyrics21`, 362 mil seguidores, mediana de 20 mil, picos de 7,6 y 2,8 millones.
**Fotogramas:** `cuadro-particulas-sobre-clip.png`, `cuadro-emojis-y-texto.png`
**Proporción:** 960×720 (4:3).

## La etiqueta está mal, y esta vez importa

Agustín la describió como "ilustración de pareja con letra", y dijo que la mayor parte de la grilla son ilustraciones en tono sepia que se pueden generar con IA en el mismo estilo.

**No es eso.** En los tres videos el fondo es **video de terceros**: clips de romance de archivo (parejas, paisajes, interiores) y, en uno de los tres, **clips de anime**. No hay ilustraciones.

Esto importa por dos motivos:

1. **La cuenta no pasa el filtro de producción** que define la lista de moldes ("sin footage de terceros"). Como modelo de qué material usar, no sirve.
2. **La idea de Agustín sigue siendo buena igual.** El molde funciona con cualquier fondo emotivo; que ellos usen anime y archivo no nos obliga. Un banco de ilustraciones generadas por IA cumple la misma función y además es nuestro. Pero entonces el banco hay que inventarlo, no copiarlo: estas referencias no muestran qué estilo de ilustración funciona, porque no hay ninguna.

## Composición

1. **Fondo:** clip a pantalla completa, oscurecido.
2. **Capa de partículas:** puntitos blancos de distintos tamaños, como polvo o destellos, flotando sobre toda la imagen con un movimiento lento. **Es la firma del molde** y es lo único realmente propio que tiene.
3. **Par de emojis** chiquitos, centrados, justo arriba del texto. Fijos, no cambian con la letra.
4. **Texto:** centrado, blanco, tamaño chico a medio, con sombra suave. Alterna entre minúscula y mayúscula inicial según el video.
5. **Nombre de la cuenta** en tipografía minúscula, muy chico, centrado justo debajo del texto.
6. Un glifo chico en el extremo inferior derecho.

## Lo que hay que copiar

La capa de partículas. Todo lo demás ya lo hace `letra-sobre-video`.

Es barata de hacer y es lo que da la sensación de pieza trabajada: sin partículas, es un clip con texto encima como cualquier otro.

## Con qué se corresponde en el repo

`letra-sobre-video`, **ya terminado**. Lo que falta:

1. **La capa de partículas**, como prop opcional (densidad, tamaño, velocidad). Es lo único que requiere código, y es chico.
2. **El banco de fondos.** Si se va por el camino de las ilustraciones con IA, hay que definir el estilo desde cero: estas referencias no sirven de guía para eso.
3. El par de emojis y la marca de agua son texto, no necesitan nada.
