# Análisis: carpeta `04-dron-fecha`

Hecho mirando los videos cuadro por cuadro, octubre 2026. Los textos de ejemplo son inventados: las referencias son temas de terceros y acá solo se describe la mecánica.

**Cuenta:** `@rolitas_gold1`, 585 mil seguidores, mediana de 25 mil vistas, publica todos los días con el mismo molde.
**Fotogramas:** `cuadro-placa-fecha.png`, `cuadro-palabra-con-resplandor.png`
**Proporción:** 1440×1080 (4:3). Lo nuestro iría en 9:16.
**Duración:** 12 a 17 segundos.

## Esta vez la etiqueta de la carpeta sí acierta

Es lo que decía Agustín: paisaje de dron, "te la dedico hoy" y la fecha.

## Composición

1. **Fondo:** tomas aéreas de dron a pantalla completa, levemente oscurecidas. Paisajes de montaña, ciudades europeas vistas desde arriba, ríos. Son clips de banco, no material propio.
2. **Placa de apertura**, dos renglones centrados, blanco, negrita, chica: una línea de dedicatoria y debajo la **fecha del día escrita con todas las letras** ("hoy 6 de octubre").
3. **Letra**, palabra por palabra, centrada, mayúsculas, blanco, negrita.
4. **Marca de agua:** el nombre de la cuenta, centrado justo debajo del texto, muy tenue y con las letras muy separadas.
5. Un **emoji chico** fijo cerca del centro, arriba del texto.

## Lo único que define a este molde

El **resplandor alrededor de las letras**. El texto no tiene contorno ni caja: tiene un halo suave y luminoso que lo despega del paisaje. Es lo que hace que se lea sobre un fondo claro (cielo, agua) sin ensuciar la imagen.

Y **la fecha del día**. Es el truco comercial del molde, no un detalle: hace que una pieza de un tema viejo parezca de hoy. Por eso la cuenta puede publicar todos los días con el mismo material.

## Con qué se corresponde en el repo

Es `letra-sobre-video` en modo `hook-letra`, que **ya está terminado**. Lo que falta no es un molde: es

1. **El banco de clips de dron.** Es lo caro y es trabajo nuestro, no de Claude Code.
2. **La fecha del día.** Puede resolverse sin tocar código, escribiéndola en el texto del hook cuando se arma la bajada. Si se quiere automática, es una prop chica.
3. **El resplandor del texto.** La ficha de `letra-sobre-video` dice "sin caja ni contorno, con una sombra leve". Acá hace falta un halo más marcado. Conviene mirar si la sombra actual alcanza o si hay que sumar una prop de resplandor.

Dicho de otro modo: de este molde, lo que hay que construir es casi nada. Lo que hay que conseguir es el banco.
