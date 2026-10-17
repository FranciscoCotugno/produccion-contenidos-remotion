# Análisis: carpeta `13-lista-numerada`

Hecho mirando los videos cuadro por cuadro, octubre 2026. Los textos de ejemplo son inventados: las referencias son contenido de terceros y acá solo se describe la mecánica.

**Fotogramas:** `cuadro-lista-progresiva-con-tarjeta.png`, `cuadro-numero-sobre-clip-sin-persona.png`

Siete cuentas, todas con números altos (de 76 mil a 574 mil likes). Este molde **no existe en el repo** y cubre dos verticales de una sola vez: ranking y playlist por situación. En la grilla son las 4 cuentas de recomendación.

## La mecánica

Es siempre la misma, y es más simple de lo que parece:

1. **Un fondo**, que puede ser una persona hablando o un clip cualquiera.
2. **Un panel de lista numerada** pegado a un costado (casi siempre la izquierda), con los números del 1 al 5 o del 1 al 10 puestos desde el principio.
3. **Los nombres se van completando** a medida que suena cada tema: el ítem que está sonando aparece escrito al lado de su número; los que todavía no sonaron muestran solo el número.
4. **Un fragmento corto de audio por ítem**, del orden de 5 a 8 segundos.
5. En varias cuentas, además, una **tarjeta de "sonando ahora"** arriba, con la portada chica, el título y el artista.

El panel que se completa es lo que sostiene la atención: el espectador se queda para ver qué cae en el número 1.

## El hallazgo que nos importa

**Cuatro de las siete cuentas tienen una persona hablando a cámara. Tres no.**

Las que no:
- `@user2014974982`: la pantalla de un reproductor filmada de cerca, con un rótulo corto arriba.
- `@villa90s`: clips oscuros con el número y el nombre del tema sobreimpresos, en color.
- `@core.nostalgia`: clips con un rótulo de mes.

O sea que **el formato funciona sin cara**. La persona ayuda, pero no es lo que lo hace funcionar: lo que lo hace funcionar es la lista que se completa. Eso significa que este molde **sí pasa el filtro de producción** si lo construimos sobre un clip de fondo en vez de sobre una persona.

Es la conclusión más útil de toda la tanda: habíamos dado la vertical de recomendación por bloqueada y no lo está.

## Qué necesita este molde que los otros no

Es el único del relevamiento que **no trabaja sobre un solo tema**. Todos los demás reciben una canción y su letra. Este recibe:

- Una **lista ordenada de temas**, con el nombre de cada uno.
- Un **fragmento de audio por tema** (inicio y fin).
- Opcionalmente, la **portada de cada tema**.
- Un **título** para la pieza.

Eso rompe el supuesto de `datos-prueba/<tema>/`, que está armado alrededor de un tema único. Hay que decidir cómo se guardan los datos de una pieza de varios temas, y es una decisión de estructura, no de diseño.

## Lo que hay que decidir antes de construirlo

1. **De dónde salen los otros temas.** Una playlist funciona porque pone el tema del cliente al lado de temas conocidos de otros sellos. Hay que definir si eso se puede hacer en una campaña paga. Es una pregunta comercial, no técnica, y bloquea las 4 cuentas de recomendación.
2. **Orden de revelación:** del 5 al 1 (suspenso) o del 1 al 5 (directo). Las referencias hacen las dos cosas.
3. **Con tarjeta de "sonando ahora" o sin ella.**

## Con qué se corresponde en el repo

Con nada. Es molde nuevo. El más parecido es `carrusel` por la idea de ítems, pero sale como imagen y no sirve.

De todo lo relevado, **es el único molde que realmente hay que construir desde cero**, junto con la piel de panel de letra y el de la estrella.
