# Pedido 1 para Claude Code: modo subtítulo fino en `letra-sobre-video`

Leé primero `docs/pedidos/REGLAS-GENERALES.md`, después `templates/letra-sobre-video/FICHA.md` y `ejemplos.ts`. **Proponé un plan antes de escribir código.**

Es el pedido más chico de la serie y el primero a propósito: no hay molde nuevo, es un modo de texto más sobre un molde terminado.

## Por qué este primero

La referencia tiene 495 mil likes, el molde ya existe y funciona, y el material (el videoclip) lo entrega el sello en cada lanzamiento. No depende de ningún banco ni de ninguna decisión pendiente.

## Material

`assets/referencias/11-letra-sobre-videoclip/` — el análisis, el fotograma `cuadro-subtitulo-fino.png` y el video original.

## Lo que se ve en la referencia

- Fragmento del videoclip a pantalla completa, **sin oscurecer**.
- Una sola línea por vez, centrada en horizontal, **a media altura** (alrededor del 50 a 55 % del alto), blanca, **en minúscula**, de peso fino, **chica**, sin caja ni contorno, con una sombra apenas perceptible.
- Las líneas cambian con la voz, sin animación de entrada vistosa.
- Nada más en pantalla: sin encabezado, sin adornos.

Lo que define al formato es que **el texto no compite con la imagen**. Es deliberadamente discreto. Eso es lo contrario de lo que hace hoy el modo `letra` del molde, donde el texto es protagonista.

## Lo que hay que hacer

Un modo de texto nuevo, o un juego de props sobre el modo `letra`, que permita:

1. **Tamaño por debajo del mínimo actual.** La ficha fija 52 px y `CLAUDE.md` pone un mínimo de 50 px. El texto de la referencia es claramente más chico. Si respetamos el mínimo se pierde el efecto.
2. **Peso fino** (la ficha fija peso 500).
3. **Todo en minúscula.**
4. **Posición a media altura**, que no es ni el centro ni el tercio superior que hoy contempla `posicionHook`.
5. **Sombra apenas perceptible**, más suave que la actual.

## Lo que hay que resolver en el plan

El mínimo de 50 px probablemente esté bien puesto para otros moldes y mal para este. Decidí en el plan si conviene bajarlo globalmente, hacerlo configurable por molde, o dejar este modo exento, y decí qué se rompe en cada caso.

## Decisiones para Cotu en Studio

Dejalas como props para poder compararlas:

1. **Tamaño:** renderizá el mismo fragmento a 52 px (lo actual), a 44 px y a 38 px, y dejá las tres para mirar juntas. Es la decisión central del pedido.
2. **Altura exacta** de la línea: 50 %, 52 %, 55 %.
3. **Intensidad de la sombra**, incluida la opción de no tener.

## Criterio de terminado

El de `CLAUDE.md`, con las reglas generales encima: sin marca de agua, y salida en los tres formatos (9:16, 1:1 y 3:4). Renderiza con al menos 2 temas sin tocar código, todo lo variable es prop con su esquema, la ficha queda actualizada con el modo nuevo, y hay un render de comparación de los tres tamaños.
