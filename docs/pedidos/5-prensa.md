# Pedido 5 para Claude Code: molde `prensa`

Leé primero `docs/pedidos/REGLAS-GENERALES.md`, después la `FICHA.md` de `templates/prensa/` (está escrita, el molde no está empezado) y `templates/README.md`. **Proponé un plan antes de escribir código.**

Cubre las cuentas P1 y P2 de la grilla.

## Material

- `assets/referencias/12-prensa-con-video/` — `cuadro-faja-titular.png`. La referencia principal: 350 mil likes.
- `assets/referencias/07-fotos-artista/` — `cuadro-panel-de-marca.png`. La segunda piel, más elaborada.

## Por qué vale la pena

El formato de faja tiene 350 mil likes, contra los 60 mil que rinde la placa de prensa con foto fija. Cinco veces el techo, con el elemento más barato de construir de todo el relevamiento: una tira de color con un texto centrado.

## Piel A: faja de titular (la principal)

Tres capas horizontales, cada una con un trabajo distinto:

1. **Faja pegada al borde superior:** una tira de fondo oscuro que cruza todo el ancho, con un texto corto en blanco, chico, centrado, y un emoji al final.
2. **Contenido a pantalla completa** debajo: el videoclip o material del artista.
3. **Subtítulo de la letra** sobre la imagen, chico y centrado, en el tercio inferior.

La faja es lo que convierte una pieza de lyrics en una pieza de prensa. El mismo video sin la tira es una cuenta de fans; con la tira, un medio.

## Piel B: panel de marca

Más elaborada, para cuando la cuenta tiene que verse como un medio con identidad propia:

1. La pantalla **partida**: de un lado el material, del otro un **panel vertical de color plano y saturado**.
2. En el panel, la **marca del medio** arriba, en una caja de fondo claro, y debajo un **titular de varias líneas** en tipografía pesada, con palabras destacadas alternando dos colores.
3. Recortes de foto que enmarcan la composición arriba y abajo.

La referencia de esta piel es contenido con una persona hablando. **Nosotros tomamos solo la estructura del panel**, no la persona.

## Lo que decide una persona, no el molde

El titular **no sale de la letra ni de los datos del lanzamiento**: es una frase editorial que alguien escribe en la bajada de cada tema ("la nueva de tal género", "tal artista entró al top 10").

Cotu va a armar un **banco de frases** para que la IA se apoye en él al redactar titulares. Eso no cambia el molde: el molde recibe el titular ya escrito, como prop. Pero sí conviene que la ficha diga explícitamente que ese texto viene de la bajada, como ya pasa con los hooks de `letra-sobre-video`.

## La tipografía es la decisión principal

En los otros moldes la tipografía es una elección estética. Acá es lo que hace que la pieza se lea como un medio y no como una cuenta de fans: una faja con la tipografía equivocada no funciona por más bien compuesta que esté.

Proponé en el plan dos o tres direcciones tipográficas distintas para la faja y para el panel, y dejalas como prop para comparar en Studio. Tené en cuenta la restricción de los sellos (FMK, Sony exigen Arial o TikTok Sans) y decí en el plan si eso aplica también a la faja o solo al texto de la letra.

## Qué tiene que entrar por prop

Texto del titular; alto, color y opacidad de la faja; tipografía y tamaño del titular; palabras destacadas y con qué color; posición del subtítulo; y para la piel B, de qué lado va el panel, su color, la marca del medio y los recortes de foto.

## Decisiones para Cotu en Studio

1. **Dirección tipográfica** de la faja y del panel.
2. **Alto de la faja** y si va pegada al borde o con aire.
3. **Si el subtítulo de la letra va siempre** o solo cuando el titular es corto.
4. **Qué piel usa cada cuenta:** P1 y P2 son dos medios con marca propia, así que probablemente una cada una.

## Criterio de terminado

El de `CLAUDE.md` con las reglas generales encima: sin marca de agua, varios formatos de salida, sin zona segura. Renderiza con al menos 2 temas y 2 titulares distintos sin tocar código, las dos pieles funcionan, todo lo variable es prop con su esquema, y la ficha queda actualizada.
