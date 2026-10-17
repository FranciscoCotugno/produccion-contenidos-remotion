# Pedido 3 para Claude Code: molde `bloque-palabra`

Leé primero `docs/pedidos/REGLAS-GENERALES.md`, después `templates/brat-puro/FICHA.md` (comparte la lógica de bloques) y `templates/README.md`. **Proponé un plan antes de escribir código.**

## Contexto importante

Este molde es lo más parecido a `tipografico`, que figura **dado de baja** en el índice desde el 6 de octubre, con la nota "no convenció, decisión de Cotu".

Cotu confirmó que lo que no convenció fue **cómo quedó el resultado, no el formato**. Y el relevamiento de octubre lo pone arriba de todo: tres cuentas lo sostienen (`@v.jxnior`, `@omarmusicc_`, `@01.91.h`) con **mediana de 219 mil vistas**, el número más alto de todo lo relevado.

Así que esto es un rehacer, no un empezar. La hipótesis de por qué quedó mal la primera vez está abajo, en "lo que es fácil de arruinar".

## Material

- `assets/referencias/01-estrella/` — análisis, `cuadro-vjxnior-bloque-3-renglones.png`, `cuadro-vjxnior-piel-magenta.png`, `cuadro-plymusic5-palabra-unica.png`.
- `assets/referencias/02-tipografia-cinetica/` — análisis, `cuadro-omarmusicc-estrella-azul.png`, `cuadro-0191h-estrella-bordo.png`.

## Composición

1. **Fondo:** color liso muy saturado, con un **resplandor radial** que aclara el centro, una textura de patrón muy tenue encima y un **viñeteado oscuro** fuerte en los bordes. No se mueve.
2. **Texto:** centrado en horizontal, bloque centrado en vertical (alrededor del 45 % del alto). Mayúsculas, **itálica**, sans condensada y pesada.
3. **Adorno opcional debajo del bloque:** en dos de las cuatro pieles hay una estrellita de cinco puntas, dorada, centrada. Es fijo, no se mueve ni cambia con la letra.
4. Nada más. Sin portada, sin encabezado, sin marca de agua.

## La mecánica

Verificado sacando 12 cuadros consecutivos de un tramo de 3 segundos:

- Las palabras **aparecen de a una**, en el momento en que se cantan.
- Cada palabra aparece primero **fantasma** (misma posición y tamaño, opacidad del orden del 30 %) y pasa a sólida cuando le toca.
- Se acumulan hasta 2 o 3 renglones y **el bloque se borra entero**. El corte es por línea de la letra, igual que la convención de `brat-puro` (un bloque por `Line`).
- **Dos colores que se alternan por renglón:** ámbar dorado y blanco.

## Lo que es fácil de arruinar

**El renglón reserva su espacio antes de llenarse.** Por eso la palabra aparece primero fantasma: el ancho del renglón ya está tomado, y el texto **no se recentra** cuando cada palabra entra.

Si se implementa como "aparece una palabra y el renglón se recentra", el bloque salta en cada palabra y se nota la plantilla. Es la diferencia entre que se vea trabajado y que se vea automático, y es mi sospecha de por qué la versión anterior no convenció.

## El modo de palabra única

Varias cuentas (`@plymusic5`, `@mimusic593`) hacen la misma cosa con **una sola palabra gigante en pantalla por vez**, centrada, con un resplandor suave alrededor de las letras.

Cotu preguntó si conviene molde aparte o el mismo. **El mismo**: la lógica de sincronía es idéntica y lo único que cambia es cuántas palabras quedan en pantalla. Entra como una prop del tipo "palabras por bloque", donde 1 da la palabra gigante y 2 o 3 renglones dan el bloque acumulado. Una prop, dos formatos, y de paso queda la variedad gratis para rotar entre cuentas.

## Lo que hay que resolver en el plan

**La alternancia de color.** Es por renglón, pero no pude determinar si el contador sigue corrido a lo largo del tema o se reinicia en cada bloque: en un video un bloque arranca en blanco y en otro en ámbar. Dejalo como prop con las dos opciones.

## Qué tiene que entrar por prop

Color de fondo; intensidad del resplandor radial y del viñeteado; textura de fondo (cuál y con cuánta opacidad); los dos colores del texto y desde cuál arranca; opacidad de la palabra fantasma; palabras o renglones por bloque; adorno debajo del bloque (cuál, o ninguno).

## Decisiones para Cotu en Studio

1. **Renglones por bloque** antes de borrar: 2 o 3 en la referencia.
2. **Opacidad de la palabra fantasma.**
3. **El adorno:** la estrella, otro símbolo por cuenta, o ninguno.
4. **Itálica sí o no**, y qué tipografía. Acordate de la restricción de Arial o TikTok Sans de algunos sellos.

## Las cuatro pieles relevadas

| Fondo | Color 1 | Color 2 | Adorno |
|---|---|---|---|
| Violeta saturado | Ámbar dorado | Blanco | — |
| Magenta | Ámbar dorado | Blanco | — |
| Azul marino | Crema | — | Estrella dorada |
| Bordó oscuro | Dorado | Blanco | Estrella dorada |

## Criterio de terminado

El de `CLAUDE.md` con las reglas generales encima: sin marca de agua, varios formatos de salida, sin zona segura. Renderiza con al menos 2 temas sin tocar código, funcionan el modo de bloque y el de palabra única, todo lo variable es prop con su esquema, la ficha queda escrita, y hay un render de ejemplo de al menos dos pieles.
