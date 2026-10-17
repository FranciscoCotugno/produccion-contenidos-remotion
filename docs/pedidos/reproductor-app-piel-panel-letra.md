# Pedido para Claude Code: piel `panel-letra` de `reproductor-app`

Antes de escribir código: leé `templates/reproductor-app/FICHA.md`, `PielApple.tsx` y `ejemplos.ts`, y **proponé un plan**. El plan tiene que decir si esto entra como piel nueva del molde o como molde aparte (ver "La decisión de fondo"), qué de `shared/` reusás, y qué props nuevas hacen falta.

## De dónde sale este pedido

Del relevamiento de referencias de octubre. El formato quedó identificado como **el que mejor rinde en cuentas nuevas**: `@lyrics.elpipon` tiene 5,8 mil seguidores y picos de 660 mil vistas, y `@adrielserrano33464` tiene 2 mil seguidores y un video de 2 millones. Con 36 cuentas de la grilla por abrir más 4 de Maluma arrancando de cero, es el formato de apertura de cuenta.

## La decisión de fondo

La ficha de `reproductor-app` describe la piel Apple como **la pantalla de reproducción**: una tarjeta centrada con portada cuadrada, barra de progreso, controles y volumen, y una fila de letra arriba de la tarjeta.

La referencia es **otra pantalla de la misma app**: el panel de letra abierto. No hay tarjeta, no hay controles, no hay barra de progreso. La letra ocupa toda la pantalla.

Comparten todos los datos de entrada (portada, título, artista, letra sincronizada, fragmento), así que no necesita ningún dato nuevo. Pero la composición y la lógica de dibujado son distintas: en la piel actual la letra es **una fila**, acá es **una columna con varias líneas a la vez**.

Mi recomendación es que entre como **piel nueva dentro de `reproductor-app`** (`panel-letra`), no como molde aparte: reusa el esquema de props, el recorte y partido de líneas, el `adelantoLectura` y el `ajusteLetra`. Si al mirar el código te parece que la columna fuerza demasiado la estructura de la piel actual, decilo en el plan y lo decide Cotu.

## Material

- **Referencias en video:** `assets/referencias/03-portada-blureada/` (4 archivos, recién bajados).
  - `lyrics.elpipon-7682761305668898069.mp4` — **la referencia principal.** 1080×1920, 30 fps, 50 s. Fondo de portada en blanco y negro, que deja ver bien la mecánica.
  - `lyrics.elpipon-7692965446751964417.mp4` — misma cuenta, fondo de portada en color cálido. Sirve para ver cómo se comporta el fondo cuando la portada tiene color.
  - `lyrics.elpipon-7679269313567771925.mp4` — tercera del mismo molde.
  - `adrielserrano33464-7665211989438139655.mp4` — **no es un molde construido**: es una captura de pantalla de una app real con el panel de letra abierto. Sirve para entender la mecánica, no para copiar. Vale lo que ya dice la ficha: códigos visuales, sin logos ni nombres de marca, y sin reproducir la interfaz de una app real tal cual (ahí se ven sus íconos y sus botones; los nuestros son propios).

## La mecánica, que es lo que hay que copiar

Es lo único realmente nuevo respecto de lo que el molde ya hace.

**La profundidad se da con desenfoque, no con color.** Todas las líneas de la letra están en pantalla al mismo tiempo, con el mismo tamaño y el mismo peso. La línea que suena está nítida y en blanco puro. Las de arriba y las de abajo están desenfocadas y más transparentes, y el desenfoque **aumenta con la distancia** a la línea activa. No hay palabra resaltada, no hay cambio de color, no hay karaoke.

La columna **se desplaza hacia arriba** a medida que avanza el tema, de modo que la línea activa queda siempre más o menos a la misma altura.

Eso es todo. Es muy simple de describir y muy fácil de hacer mal: si el desenfoque es parejo en vez de progresivo, se pierde el efecto de profundidad y queda sucio.

## Medidas tomadas de la referencia principal

Medido sobre un cuadro a 1080×1920. Son el punto de partida, no la verdad revelada: varias hay que corregirlas por zona segura (ver abajo).

**Fondo**
- La portada del tema, escalada para llenar los 1080×1920, muy desenfocada y oscurecida.
- Conserva el color de la portada: con portada en color el fondo queda del tono de la portada, no gris.
- El desenfoque es fuerte, del orden de 60 a 90 px a ese ancho. Dejalo como prop, que ya es una decisión pendiente en la ficha ("intensidad del desenfoque del fondo").

**Encabezado** (arriba, fijo durante todo el video)
| Elemento | x | y | Notas |
|---|---|---|---|
| Portada chica | 85 – 300 | 182 – 378 | ~200 px de lado, esquinas redondeadas ~28 px |
| Título | desde 320 | ~250 – 290 | ~48 px, negrita, blanco |
| Artista | desde 320 | ~305 – 340 | ~42 px, normal, blanco al ~70 % |
| Botón "más" | centro 945 | centro 288 | círculo de ~88 px, blanco al ~20 % |

**Columna de letra**
- Caja de texto: x 85 – 950, o sea ~865 px de ancho.
- Tamaño de línea: ~78 a 84 px, negrita. Mismo tamaño y peso para la activa y las inactivas.
- Interlineado: ~105 px.
- Separación entre líneas de la letra: aproximadamente una línea de alto.
- El bloque activo queda centrado alrededor de y = 790.
- Líneas inactivas: opacidad del orden de 45 a 55 %, con desenfoque creciente (la vecina bastante menos que la que está a dos lugares).

**Marca de agua**
- Centrada en horizontal, alrededor de y = 1380, ~48 px, blanco al ~35 %.
- En la referencia hay dos variantes (texto solo, y un dibujo con texto): es de cuenta, no del molde. Que entre por prop.

## Zona segura: acá hay que apartarse de la referencia

La referencia **no respeta** nuestra zona segura: pone la letra desde x = 85 (nuestro margen izquierdo es 155) y deja líneas por debajo de y = 1470.

Propuesta, a validar en el plan:

1. **Ancho de columna 770 px, de x = 155 a x = 925**, que es exactamente el ancho que la ficha ya usa para la fila de letra de la piel actual. Deja el molde consistente consigo mismo.
2. **La línea activa va centrada en y = 810**, el centro vertical de la zona libre. La referencia la tiene en ~790, así que casi no hay que mover nada.
3. **Las líneas que todavía no sonaron pueden caer en los 450 px de abajo.** Están desenfocadas y no son para leer: son textura, no información. Esta es la única excepción, y conviene dejarla escrita en la ficha para que no parezca un descuido.
4. **La línea activa nunca puede caer ahí.** Si el bloque activo es muy alto (cuatro renglones), lo que se corre es el bloque, no el límite.

## Qué tiene que entrar por prop

Además de lo que la ficha ya define para el molde:

- Intensidad del desenfoque del fondo y oscurecimiento.
- Cantidad de líneas visibles arriba y abajo de la activa.
- Desenfoque máximo de las inactivas y cómo crece con la distancia.
- Opacidad de las inactivas.
- Altura donde se ancla la línea activa.
- Marca de agua: texto o imagen, posición y opacidad.
- Mostrar u ocultar el encabezado (hay cuentas que pueden quererlo sin él).

## Decisiones para Cotu en Studio

Dejalas como props o controles para poder probarlas sin tocar código:

1. **Desplazamiento de la columna:** continuo (se mueve todo el tiempo) o a saltos (se queda quieta y salta al cambiar de línea). En la referencia parece a saltos, con una transición corta, pero conviene poder comparar.
2. **Cantidad de líneas a la vista:** la referencia muestra del orden de 5 a 7 bloques. Más líneas llenan más la pantalla; menos deja respirar el fondo.
3. **Curva del desenfoque:** cuánto desenfoque tiene la vecina inmediata. Es lo que decide si el efecto se lee como profundidad o como suciedad.
4. **Tipografía:** la ficha fija Geist para la interfaz y TikTok Sans para la letra. Acá la letra es el 90 % de la pantalla, así que conviene confirmar cuál va. Recordá que hay sellos (FMK, Sony) que exigen Arial o TikTok Sans.
5. **Encabezado sí o no**, y si el botón "más" aporta algo o es ruido.

## Criterio de terminado

El de `CLAUDE.md`: renderiza con al menos 2 temas sin tocar código, respeta la zona segura según las reglas de arriba (con la excepción escrita en la ficha), todo lo variable es prop con su esquema, la ficha queda actualizada con la piel nueva, y hay un render de ejemplo con una portada en color y otro con una en blanco y negro, que es donde se nota si el fondo está bien resuelto.

## Una advertencia sobre el texto de prueba

Las referencias son videos de terceros con temas de otros artistas. Son para estudiar la mecánica. Los renders de ejemplo van con los temas de prueba que ya están en `datos-prueba/`, no con la letra de las referencias.
