# Análisis: carpeta `01-estrella`

Hecho mirando los videos cuadro por cuadro, octubre 2026. Los textos de los ejemplos son inventados: las referencias son temas de terceros y acá solo se describe la mecánica.

## Primero: el nombre de la carpeta está mal

No hay ninguna estrella en los cinco videos de esta carpeta. La estrella aparece en `02-tipografia-cinetica`, en `@omarmusicc_` y `@01.91.h`, y es **una estrellita dorada debajo del bloque de texto**, no un contenedor donde va la letra.

Además, las dos cuentas de esta carpeta no hacen el mismo molde.

## Molde A: bloque que se arma palabra por palabra (`@v.jxnior`)

Tres de los cinco videos. Es el molde fuerte: mediana de 219 mil vistas.

**Fotogramas:** `cuadro-vjxnior-bloque-3-renglones.png`, `cuadro-vjxnior-piel-magenta.png`

### Composición

1. **Fondo:** color liso muy saturado (violeta en un video, magenta en otro), con un **resplandor radial** en el centro que aclara el medio, una textura de patrón muy tenue encima, y un **viñeteado oscuro fuerte** en los bordes. El fondo no se mueve.
2. **Texto:** centrado en horizontal, bloque centrado en vertical (alrededor del 45 % del alto). Mayúsculas, itálica, sans condensada y pesada.
3. No hay portada, ni encabezado, ni barra de progreso. Solo fondo y texto.

### La mecánica, que es lo único que importa copiar

Verificado sacando 12 cuadros consecutivos de un tramo de 3 segundos:

- Las palabras **aparecen de a una**, en el momento en que se cantan.
- Cada palabra aparece primero **fantasma** (misma posición y tamaño, opacidad baja, del orden del 30 %) y pasa a sólida cuando le toca. O sea que el renglón reserva su espacio antes de llenarse: el texto **no se recentra** al aparecer cada palabra.
- Las palabras se acumulan hasta formar un bloque de **2 o 3 renglones**, y después el bloque **se borra entero** y arranca uno nuevo. El corte es por línea de la letra, igual que la convención de `brat-puro` ("un bloque por `Line`").
- **Dos colores que se alternan por renglón:** ámbar dorado y blanco. Un bloque típico sale ámbar / blanco / ámbar.

El punto 2 es el que hace que se vea bien hecho. Si cada palabra aparece y el renglón se recentra, queda saltando y se nota la plantilla.

### Qué habría que decidir en Studio

- **La regla exacta de la alternancia de color.** Es por renglón, pero no pude determinar si el contador sigue corrido a lo largo de todo el tema o se reinicia en cada bloque. En un video un bloque arranca en blanco y en otro en ámbar. Conviene dejarlo como prop con las dos opciones y mirarlo.
- Cuántos renglones por bloque antes de borrar (en la referencia, 2 o 3).
- Opacidad de la palabra fantasma.

### Pieles vistas

| Fondo | Color 1 | Color 2 |
|---|---|---|
| Violeta saturado | Ámbar dorado | Blanco |
| Magenta | Ámbar dorado | Blanco |

El par de colores se mantuvo en las dos; lo que cambia es el fondo.

### Proporción

Los tres videos están en **1440×1080, o sea 4:3**, no en 9:16. TikTok los muestra con bandas arriba y abajo. Es decisión de la cuenta, no del molde: nosotros lo haríamos en 9:16.

## Molde B: una palabra gigante por vez (`@plymusic5`)

**Fotograma:** `cuadro-plymusic5-palabra-unica.png`

Otra cosa completamente distinta:

- Fondo azul marino liso, sin resplandor ni textura.
- **Una sola palabra** en pantalla por vez, enorme, centrada, en blanco, sans condensada y pesada, con un **resplandor suave** alrededor de las letras.
- Marca de agua de la cuenta justo debajo de la palabra, en azul más claro, chica.
- Proporción 720×1280 (9:16).

Es el mismo mecanismo que Agustín le atribuyó a `@mimusic593` dentro del molde 5. Conviene tratarlo como **una variante del molde A** (misma lógica de sincronía, con el bloque limitado a una palabra), no como molde aparte.

## Con qué se corresponde en el repo

Ninguno de los dos existe hoy. El molde A es lo más parecido a lo que era `tipografico`, que está **dado de baja** desde el 6 de octubre. Antes de construir nada acá hay que resolver esa contradicción: este molde tiene mediana de 219 mil vistas.
