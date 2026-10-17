# Reproductor de app de música

> **Nota del 2026-10-17 (reglas generales).** Lo que esta ficha diga sobre **zona
> segura** quedó como registro de cómo se construyó el molde, **no como regla**.
> Hoy las composiciones van a sangre completa: la única precaución es la columna
> de botones de TikTok sobre el borde derecho, y solo en 9:16. La prop que antes
> se llamaba `safeZone` ahora es `franjaBotones` y solo prende una guía en Studio.
> Tampoco hay marca de agua en ningún molde, y un molde puede salir en varios
> formatos. Ver `CLAUDE.md`.


## Identificación
- **Cuentas:** L05 (estilo Apple Music, piel oscura), L13 (estilo Apple Music, piel clara), L06 (estilo Spotify).
- **Sale como:** video.
- **Dimensiones:** 9:16 (1080×1920), 30 fps.
- **Duración:** la del fragmento, típicamente de 10 a 20 segundos.
- **Punto de partida:** LyricPlayer del repo original. Hay que rehacerlo con todo como prop, la interfaz parametrizable y sin Comic Sans.

## Qué es
El videoclip reproduciéndose dentro de un reproductor de app de música, con una línea de texto arriba. Se ve como algo que alguien está escuchando en su celular.

## Por qué funciona
Parece nativo, no publicitario. El nombre del tema y del artista están siempre a la vista, así que quien mira sabe qué buscar.

## Composición (de atrás hacia adelante)

**Piel Apple Music (L05 oscura, L13 clara):**
1. Fondo: el mismo videoclip, muy desenfocado y oscurecido (en la clara, aclarado).
2. Tarjeta del reproductor centrada, con esquinas redondeadas y un degradé vertical tomado de los colores del clip.
3. Dentro de la tarjeta, de arriba hacia abajo: el videoclip en el lugar de la portada (cuadrado, esquinas redondeadas), título en negrita, artistas en un tono más tenue, barra de progreso con tiempo transcurrido y restante, controles (anterior, pausa, siguiente) y barra de volumen.
4. Arriba de la tarjeta: la línea de texto.

**Piel Spotify (L06):**
1. Fondo: color sólido tomado del clip, en lugar del desenfocado.
2. Diagramación de Spotify: portada (el videoclip) grande arriba, título y artistas alineados a la izquierda, barra de progreso, controles con el botón de pausa circular grande al centro.
3. Arriba: la línea de texto.

En las dos pieles: códigos visuales de la app real, **sin logos ni nombres de marca**.

## Qué es fijo y qué varía
- **Fijo:** la diagramación de cada piel y las tipografías.
- **Varía (props):** título, artistas, videoclip, fragmento (inicio y fin), letra, modo de texto, texto fijo (si el modo lo usa), piel, punto de arranque simulado de la barra, duración simulada del tema, audio aparte (opcional).

## Clip de entrada
El molde acepta dos tipos de clip:
- **Videoclip completo:** el fragmento se toma con inicio y fin dentro del video (`fragment.start` y `fragment.end`).
- **Recorte del sello:** un clip que ya es el fragmento (por ejemplo, el de instinto luv: 20 s, 1080×1080, que arranca en el segundo 11,33 del tema). Va con `fragment.start` en 0, y el punto del tema donde arranca se pasa en `track.displayStart`, para que la barra y los tiempos muestren el momento real.

En los dos casos la portada recorta el clip a cuadrado (`zoomPortada` para reencuadrar si trae bandas).

## Audio
Por defecto el audio sale del mismo clip. Opcionalmente puede venir de un archivo aparte (prop `audio`: archivo y segundo de inicio); en ese caso el clip va mudo.

## Modos de texto
1. **Letra sincronizada**, línea por línea.
2. **Texto fijo** durante todo el video: una frase ("esta va para vos") o una pregunta ("¿cómo que esto no es número 1?"). Mismo estilo en los dos casos; solo cambia el texto.

## Tiempos y animación
- El reproductor está completo desde el primer cuadro.
- La barra de progreso avanza en tiempo real desde un punto de arranque simulado (por ejemplo, 0:42 de un tema de 3:13), y los tiempos se actualizan.
- Cada línea de letra entra con un adelanto de lectura antes de que empiece a cantarse (`adelantoLectura`, 3 cuadros por defecto), con una entrada corta (4 a 6 cuadros: aparece y sube unos pocos píxeles).
- `ajusteLetra` corre toda la letra hacia adelante o hacia atrás, en cuadros, para corregir desde Studio un desfase parejo contra la voz.
- En el modo de texto fijo, el texto está desde el primer cuadro.

## Tipografía
- Interfaz del reproductor: Geist.
- Línea de texto: TikTok Sans, 60 px, con una sombra suave detrás para que se lea sobre cualquier fondo. Peso a decidir en Studio entre SemiBold (600) y Bold (700) (`pesoLetra`).

## Letra en una sola fila
- La letra va siempre en una fila, en el ancho libre sobre la tarjeta (770 px: centrada y sin pisar los márgenes de la zona segura).
- Si una línea no entra a 60 px, se achica hasta 50 px como mínimo.
- Si con 50 px tampoco entra, se parte en tramos que aparecen uno después del otro. El corte sale de los tiempos de las palabras: donde hay más espacio entre una palabra y la siguiente (con preferencia por las comas), buscando que los tramos entren y queden parejos. Los tramos de una misma línea usan el mismo tamaño. El primer tramo entra con la línea; los siguientes, con su primera palabra (con el mismo adelanto de lectura).
- El texto fijo no tiene tiempos para partirlo: si ni con 50 px entra, pasa a dos filas.

## Zona segura
La tarjeta va centrada y la línea de texto arriba de la tarjeta. Nada de la tarjeta ni del texto puede caer en los 450 px de abajo.

El reproductor va **centrado en vertical en la pantalla completa** (1920 px), no en el área segura; la letra va arriba con 36 px de aire. Las zonas seguras quedan como guía: se revisa qué cae dentro, no se usan para ubicar.

**Escala de la tarjeta en la piel oscura: 1,01** (fija en la piel, `ESCALA_APPLE_OSCURA`). Medido en Studio, en px del cuadro de 1080 × 1920:

| Elemento | x | y | Qué cae en zona |
|---|---|---|---|
| Fila de letra (caja) | 155 – 925 | 279 – 348 | nada; el tramo más ancho ("que me tiene enganchado", 712 px) va de 184 a 896 |
| Tarjeta (vidrio) | 215 – 865 | 384 – 1536 | abajo: 66 px de borde inferior |
| Portada | 252 – 828 | 422 – 997 | nada |
| Título, artistas y botón "más" | 263 – 817 | 1043 – 1129 | nada |
| Barra de progreso y tiempos | 263 – 817 | 1164 – 1224 | nada |
| Controles | 367 – 713 | 1259 – 1330 | nada |
| Volumen | 263 – 817 | 1388 – 1419 | nada (52 px sobre el límite) |
| Fila de íconos | 326 – 754 | 1457 – 1497 | abajo: 27 px de 40 (decorativa) |

Márgenes: arriba, la letra empieza 129 px debajo de los 150 de la guía; a la derecha, la tarjeta queda a 60 px de la columna de botones (x = 925) y la letra a 29 px en el tramo más ancho; a la izquierda, la tarjeta arranca 155 px después del margen.

Reglas con que se eligió la escala: portada, título, barra de progreso y controles no pueden entrar en ninguna zona; volumen e íconos son decorativos y pueden entrar en la de abajo; arriba se tolera hasta 120 px (donde terminan las pestañas en la captura calibrada).

## Notas para la implementación final
- **Se repite con `brat-puro`:** esperar a que cargue la tipografía y medir texto con ella en un canvas (acá, para achicar y partir la línea de letra). En brat-puro apareció que, en el render en paralelo, algunas pestañas miden con la tipografía de reemplazo aunque `document.fonts` la dé por cargada; allá se resolvió esperando a que el canvas mida con la tipografía real. Este molde ya tiene la misma espera (antes de medir, comprueba que el canvas usa TikTok Sans y no la de reemplazo). Los renders exportados antes de este arreglo podrían tener alguna línea partida distinto en algunos cuadros.

## Para decidir en Studio
- Letra por línea (propuesta) o palabra por palabra, como hacía el LyricPlayer original.
- Intensidad del desenfoque del fondo. (Tamaño de la tarjeta: decidido, 1,01.)

## Referencias
Ver `referencias/reproductor-app/REFERENCIAS.md`.
