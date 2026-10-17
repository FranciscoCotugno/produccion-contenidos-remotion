# Análisis: carpeta `05-clip-nocturno`

Hecho mirando los videos cuadro por cuadro, octubre 2026. Los textos de ejemplo son inventados: las referencias son temas de terceros y acá solo se describe la mecánica.

**Fotogramas:** `cuadro-musica1m-fila-emojis.png`, `cuadro-mimusic-palabra-unica.png`

Acá hay dos variantes de la misma cosa.

## Variante A: bloque de letra con fila de emojis (`@musica_1m`)

138 mil seguidores, varios videos arriba del millón, el mejor 4,3 millones. **1080×1920 (9:16)**, las únicas referencias de toda la tanda que vienen en vertical real.

### Composición

1. **Fondo:** clip nocturno a pantalla completa, bastante oscurecido. Ciudad de noche, manos entrelazadas, parejas caminando, calles con luces. Material de banco.
2. **Fila de emojis arriba del texto:** dos emojis entre comillas dobles, centrados, chicos. Es un elemento fijo que no cambia con la letra. Esto es lo que Agustín llamó "fila de emojis" y acierta.
3. **Letra:** centrada, blanco, negrita, tamaño medio, con una sombra oscura detrás para que se lea sobre el clip. Una o dos líneas por vez.
4. **Marca de agua:** el nombre de la cuenta, chiquísimo, centrado justo debajo del texto.
5. A veces una **segunda fila de emojis** más abajo, también fija.

### Lo que define al molde

La fila de emojis. No es decoración al azar: le da a cada cuenta una firma reconocible sin tener que diseñar nada. Dos emojis entre comillas, siempre en el mismo lugar.

Y es **texto**, no una imagen. O sea que no necesita código: entra como parte del hook.

## Variante B: una palabra gigante por vez (`@mimusic593`)

180 mil seguidores, picos de 772 mil. 1440×1080 (4:3).

Igual que la variante A, pero con **una sola palabra en pantalla por vez**, en mayúsculas y bastante más grande. Mantiene la fila de emojis arriba.

**Es la misma variante que hace `@plymusic5` en la carpeta 01**, y la que aparece de nuevo en otras cuentas. Se repite lo suficiente como para tratarla no como un molde aparte sino como un **modo del bloque de texto**: en vez de acumular la línea entera, mostrar una palabra por vez.

## Con qué se corresponde en el repo

`letra-sobre-video`, **ya terminado**, en modo `hook-letra`. Lo que falta:

1. **El banco de clips nocturnos.** Otra vez: lo caro es el material, no el código.
2. **El modo "una palabra por vez"**, si se quiere la variante B. La ficha actual dice que la letra va "línea por línea". Habría que ver si agregar un modo de palabra única es chico o si toca la estructura.
3. La fila de emojis no necesita nada: es texto en el hook.

## Observación aparte

`@musica_1m` es la única cuenta de todo el relevamiento que publica en 1080×1920 nativo, y es también la de mejores picos (4,3 millones). No alcanza para afirmar que una cosa explique la otra, pero vale anotarlo: casi todas las demás publican en 4:3 o 16:9 y dejan que TikTok les ponga bandas.
