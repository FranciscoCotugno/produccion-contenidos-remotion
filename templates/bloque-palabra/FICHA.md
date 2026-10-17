# Bloque de letra palabra por palabra

## Identificación
- **Cuentas:** las de tipografía sobre color. Es lo que sostienen `@v.jxnior`,
  `@omarmusicc_` y `@01.91.h`, con **mediana de 219 mil vistas**, el número más
  alto de todo el relevamiento de octubre.
- **Sale como:** video.
- **Formatos:** **4:3 (1440×1080) como principal**, más 9:16 (1080×1920) y 1:1.
- **Cuadros por segundo:** 30. No hay video (el fondo es un color), así que va al
  valor de las piezas sin video (regla 1 del `CLAUDE.md`).
- **Duración:** la del fragmento.

## Relación con `tipografico`

`tipografico` figura **dado de baja** desde el 2026-10-06 con la nota "no
convenció". Cotu aclaró que lo que no convenció fue **el resultado, no el
formato**, así que esto es un rehacer. La hipótesis de por qué quedó mal está en
"lo que es fácil de arruinar", abajo.

## Qué es

Fondo de color liso muy saturado. El texto en el medio, en mayúscula, itálica,
angosta y pesada. Las palabras **se encienden de a una** con la voz: hasta que
les toca están en pantalla apagadas, en su posición final. Cuando el bloque se
completa, se borra entero y arranca el siguiente.

Dos colores que **se alternan por renglón**, y en dos de las cuatro pieles una
estrellita dorada abajo.

## Lo que es fácil de arruinar

**El renglón se guarda el lugar antes de llenarse.** Todas las palabras del
bloque están desde el principio, apagadas y ya ubicadas, así que el texto **no se
recentra** cuando entra cada una.

Hecho al revés —aparece una palabra y el renglón se recentra— el bloque salta en
cada palabra y se nota la plantilla. Es la diferencia entre que se vea trabajado y
que se vea automático, y es la sospecha de por qué la versión anterior no
convenció.

Se confirma en el fotograma `cuadro-0191h-estrella-bordo.png`: se ve "TAL"
**corrido a la izquierda del centro**, con el resto de su renglón ya reservado y
apenas visible a la derecha. El renglón está centrado como un todo desde el primer
cuadro.

## La palabra apagada es del color de su renglón

Nunca un gris. En el cuadro violeta, el renglón apagado es el **ámbar a media
opacidad sobre el violeta**, y por eso se ve marrón; en el azul marino, es el crema
apagado, y por eso se ve gris. Si se hiciera con un gris fijo, se vería sucio.

Lo controla `colores.fantasma` (0,45 en las pieles con resplandor; 0,4 en las
planas).

## Cómo se arma el bloque

1. El corte de renglones es **voraz, de izquierda a derecha**, sin rebalancear: es
   lo que hacen las referencias.
2. Los renglones se agrupan de a `bloque.renglones` (2 o 3).
3. Cada `Line` de la letra arranca bloque nuevo, que es la convención de
   `brat-puro`. Una línea larga se parte en varios bloques.
4. El bloque **no se vacía al terminar**: queda hasta que entra el siguiente, así
   que nunca hay pantalla vacía.

## Las cuatro pieles

| Piel | Fondo | Color 1 | Color 2 | Adorno |
|---|---|---|---|---|
| `violeta` | Violeta con resplandor, textura y viñeta | Ámbar | Blanco | — |
| `magenta` | Magenta con resplandor, textura y viñeta | Ámbar | Blanco | — |
| `azul` | Azul marino **plano** | Crema | — | Estrella |
| `bordo` | Bordó **plano** | Dorado | Blanco | Estrella |

**El fondo no es una sola receta.** `@v.jxnior` tiene resplandor radial, textura y
viñeteado fuerte; `@omarmusicc_` y `@01.91.h` son color plano y nada más. Por eso
las tres cosas son props y arrancan en cero en las pieles planas.

## El adorno no va pegado al bloque

El análisis dice "centrada justo debajo del bloque de texto". Medido en
`cuadro-0191h-estrella-bordo.png`, la estrella está **abajo de todo, al 94 % del
alto**, pegada al borde inferior y lejos del texto. Va anclada ahí
(`adorno.altura`), no al bloque.

La estrella está dibujada en código, no es un archivo: no hay nada que licenciar.
Lo mismo la textura del fondo, que son curvas claras muy desenfocadas en posiciones
fijas (no cambian entre cuadros ni entre renders).

## El modo de frase corta

Lo que hacen `@plymusic5` y `@mimusic593`: una frase corta gigante por vez. **Es el
mismo molde**, no uno aparte: `bloque.renglones` en 1, la caja más angosta, sin
itálica, con las letras separadas y con resplandor alrededor.

Lo que sí necesitó de propio es **`texto.ajustarAlAncho`**: en la referencia todas
las frases ocupan el ancho, sean cortas o largas, así que la letra crece hasta que
el renglón más ancho del bloque llena la caja. En 1 está apagado, que es lo que
usan las pieles de bloque (ahí el tamaño es fijo y parejo para todo el bloque).

## El formato principal es 4:3

Las tres cuentas publican así: `@v.jxnior` en 1440×1080, `@omarmusicc_` y
`@01.91.h` en 960×720. El `ANALISIS.md` de la carpeta dice "nosotros lo haríamos en
9:16", pero está escrito **antes** de las reglas generales del 2026-10-17, que
dicen lo contrario y citan justamente a estas cuentas.

El tamaño se mide sobre 1080 de ancho y escala con el ancho, así que en el celular
se ve igual en todos los formatos. Pero en un cuadro alto el bloque ocupa menos
pantalla: por eso los ejemplos de 9:16 y 1:1 llevan el bloque más grande
(`VERTICAL` y `CUADRADO` en `ejemplos.ts`).

## Tipografía

**TikTok Sans angosta**, peso 900, inclinada 6°. Tiene eje de ancho (75 %) y de
inclinación, así que da la angosta itálica sin deformar nada, y **cumple con FMK y
Sony**, que exigen TikTok Sans o Arial.

La alternativa es **Archivo Narrow** negrita itálica, la angosta de Brat
(`Comparar-Tipografia-ArchivoNarrow`).

La letra del fotograma bordó es otra cosa, una display con remates: no está en el
repo y no se imitó.

## Qué es fijo y qué varía

- **Fijo:** la mecánica (el renglón reserva su lugar, las palabras se encienden, el
  bloque se borra entero) y que todas las palabras del bloque van del mismo tamaño.
- **Varía (props):** tema; color de fondo, resplandor y su color, viñeta y textura;
  tipografía, itálica, mayúscula, tamaño, peso, interlineado, espaciado entre
  letras, ancho de caja, centro vertical, sombra, resplandor de letra y ajuste al
  ancho; los dos colores, con cuál arranca, si la alternancia se reinicia por
  bloque o sigue corrida, y la opacidad de la palabra apagada; renglones por
  bloque; adorno, su color, tamaño y altura; ajuste de letra y adelanto de lectura.

## Para decidir en Studio

1. **Renglones por bloque** (`Comparar-Renglones-2` / `-3`).
2. **Cuánto se ve la palabra apagada** (`Comparar-Fantasma-2` / `-45` / `-65`).
   Define si se lee como "ya está escrito" o como ruido.
3. **La alternancia de color** (`Comparar-Alternancia-PorBloque` / `-Corrida`). El
   análisis no pudo determinar cuál usa la referencia: en un video un bloque
   arranca en blanco y en otro en ámbar.
4. **Tipografía e itálica** (`Comparar-Tipografia-*`, `Comparar-SinItalica`).
5. **El adorno** (`Comparar-Adorno-Estrella` / `-Ninguno`).

## Se repite con otros moldes

Esperar a que la tipografía esté cargada y medir con ella en un canvas antes de
cortar renglones. **Es la cuarta vez** que aparece: lo tienen `brat-puro`,
`reproductor-app`, `panel-letra` y este. Acá se resolvió como en `brat-puro`, que
además pide que el 75 % de ancho mida menos que el normal. Si Agustín unifica algo
de `shared/`, este es el candidato más claro.

## Referencias

- `assets/referencias/01-estrella/` — `@v.jxnior` (molde de bloque) y `@plymusic5`
  (frase corta). Ojo: el nombre de la carpeta está mal, ahí no hay ninguna estrella.
- `assets/referencias/02-tipografia-cinetica/` — `@omarmusicc_` y `@01.91.h`, las
  dos pieles planas con estrella.
