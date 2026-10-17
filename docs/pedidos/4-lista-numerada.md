# Pedido 4 para Claude Code: molde `lista-numerada`

Leé primero `docs/pedidos/REGLAS-GENERALES.md` y `templates/README.md`. **Proponé un plan antes de escribir código.**

Es el único molde nuevo de verdad de la serie, y el único que no trabaja sobre un solo tema. Por eso además hay una decisión de estructura de datos que hay que resolver en el plan.

## Qué es

Una pieza que recorre varios temas, numerados, mientras un panel al costado se va completando. Cubre dos verticales de una: ranking ("top 5 del disco nuevo") y playlist por situación ("5 temas para manejar de noche").

Las siete cuentas relevadas van de 76 mil a 574 mil likes.

## Cómo lo quiere Cotu

**Sin persona a cámara. Directamente textos y números rankeando las canciones.**

Esto es importante porque cuatro de las siete referencias tienen a alguien hablando. Las otras tres no, y funcionan igual: lo que sostiene la atención es **la lista que se completa**, no la cara. Construilo sobre un fondo cualquiera (clip o color), no sobre una persona.

## Material

`assets/referencias/13-lista-numerada/` — el análisis, `cuadro-lista-progresiva-con-tarjeta.png` (la versión con persona, para ver el panel) y `cuadro-numero-sobre-clip-sin-persona.png` (la versión sin persona, que es la que queremos).

## Composición

1. **Fondo:** un clip o un color liso, a pantalla completa.
2. **Panel de lista numerada** pegado a un costado (en las referencias, casi siempre la izquierda), con **los números puestos desde el primer cuadro**. Eso es lo que anticipa cuántos faltan.
3. **Los nombres se completan de a uno** a medida que suena cada tema. El que está sonando aparece escrito al lado de su número; los que todavía no sonaron muestran solo el número.
4. **Un fragmento de audio por ítem**, de 5 a 8 segundos.
5. Opcional: una **tarjeta de "sonando ahora"** arriba, con la portada chica, el título y el artista.

## Lo que este molde necesita y los demás no

Todos los otros moldes reciben **un tema** y su letra. Este recibe:

- Una **lista ordenada** de temas, con el nombre de cada uno.
- Un **fragmento de audio por tema** (inicio y fin).
- Opcionalmente la **portada** de cada tema.
- Un **título** para la pieza.

Eso rompe el supuesto de `datos-prueba/<tema>/`, que está armado alrededor de un tema único. **Resolvé en el plan cómo se guardan los datos de una pieza de varios temas** y decí qué implica para el resto del repo. Es la parte difícil del pedido; el dibujo es simple.

## Decisiones para Cotu en Studio

1. **Orden de revelación:** del 5 al 1 (suspenso) o del 1 al 5 (directo). Las referencias hacen las dos cosas.
2. **Cantidad de ítems:** 5 o 10.
3. **Con tarjeta de "sonando ahora" o sin ella.**
4. **De qué lado va el panel**, y si el fondo es clip o color liso.

## Un componente que conviene separar

El panel que se completa aparece también en otro formato que vimos: una columna de verificación con números y marcas que van apareciendo (ver `assets/referencias/14-motivo/cuadro-checklist-sobre-persona.png`).

Si lo construís como **pieza reutilizable** y no como parte interna de este molde, sirve para listas, para rankings y, el día que se quiera, para un test. Proponé en el plan si conviene y a qué costo.

## Criterio de terminado

El de `CLAUDE.md` con las reglas generales encima: sin marca de agua, varios formatos de salida, sin zona segura. Renderiza con al menos 2 listas distintas sin tocar código, todo lo variable es prop con su esquema, la ficha queda escrita, y la estructura de datos de varios temas queda documentada.
