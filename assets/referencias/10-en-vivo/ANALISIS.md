# Análisis: carpeta `10-en-vivo`

Hecho mirando los videos cuadro por cuadro, octubre 2026. Los textos de ejemplo son inventados: las referencias son temas de terceros y acá solo se describe la mecánica.

**Fotogramas:** `cuadro-vivo-linea-italica.png`, `cuadro-entrevista-subtitulada.png`

Hay dos cosas distintas en esta carpeta.

## `@gabo_lyric_musica`: letra sobre material en vivo

189 mil seguidores, **mediana de 133 mil vistas**: la segunda mejor de todo el relevamiento. Tres videos, los tres en **1080×1920 nativo**.

### Composición

1. **Fondo:** clip de recital a pantalla completa, sin oscurecer o apenas. Planos del artista en el escenario, enteros y de medio cuerpo. Material de buena calidad, no grabado desde el público.
2. **Texto:** una línea por vez, centrada, a media altura, **en itálica**, blanco, tamaño medio, con sombra suave.
3. **Adornos tipográficos alrededor de la línea:** un par de emojis chicos y signos de admiración repetidos, puestos antes o después del texto. Cambian entre videos pero son fijos dentro de cada uno.
4. **Marca de agua centrada debajo del texto:** un logotipo propio de la cuenta, con bastante diseño (en un video un monograma tipo escudo, en otro una firma manuscrita con un moño). No es un `@usuario` en texto plano: es una marca.

### Lo que define al molde

Nada técnico. Es **el material**: planos de recital bien filmados. La capa de texto es la más simple de todas las que vimos.

Por eso este molde no es un problema de código: es un problema de acceso. Si Sony o Fenix nos pasan registro de shows, se resuelve con lo que ya existe.

Lo que sí vale copiar es la **marca de agua con diseño propio** en vez del arroba suelto. Es lo que hace que la cuenta parezca un medio y no un fan.

## `@idolos_elmundo`: entrevista subtitulada

1080×1920. El video que relevamos tiene 1,8 millones de likes, el número más alto de todo el relevamiento.

Composición mínima:

1. Clip de entrevista a pantalla completa: el entrevistado sentado, hablando a cámara.
2. **Subtítulo abajo**, chico, blanco, centrado, una o dos líneas.
3. Nada más. Sin marca de agua visible, sin adornos, sin música.

**No es un molde de letra: no hay canción.** El contenido es lo que dice el artista. Técnicamente es trivial (clip + subtítulos automáticos), y por eso mismo todo el valor está en elegir bien el recorte.

## Con qué se corresponde en el repo

Las dos cosas son `letra-sobre-video`, cuenta **L11** ("letra sobre material en vivo"), que ya está **terminado**.

Lo que falta en los dos casos es material:

- Para `@gabo_lyric_musica`: registro de shows.
- Para `@idolos_elmundo`: entrevistas o podcasts del artista, y una herramienta de subtitulado automático.

Lo único que podría faltar en código es el **modo subtítulo abajo** (hoy la ficha ubica el texto al centro o en el tercio superior) y la **marca de agua como imagen** en vez de texto. Las dos son props chicas.
