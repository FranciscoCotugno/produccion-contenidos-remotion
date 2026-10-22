# Festival Generación

## Identificación
- **Cuentas:** las del Festival Generación. No es un molde de la grilla de
  kioskos: es un pedido propio.
- **Sale como:** video.
- **Formato:** 9:16 (1080×1920), 30 fps.
- **Duración:** la del clip.

## Qué es

Un clip de streamer **tal cual**, con dos cosas encima y nada más: un hook de
texto arriba y la mosca del festival. Los dos duran todo el video.

## La regla que manda: el original no se toca

**No se recorta, no se escala a cubrir, no se reencuadra.** El clip entra entero
y centrado, con bandas negras donde sobra cuadro. Si es apaisado queda apaisado;
si es 9:16 llena la pantalla. El audio va tal cual, sin tocar.

Lo resuelve `object-fit: contain`. La misma cuenta se hace aparte en `encuadre()`
porque hace falta saber dónde cayó el video para poder ubicar la marca ajena
sobre el cuadro final.

## El hook

- Arriba, TikTok Sans, peso fino, blanco con sombra para que se lea sobre
  cualquier fondo. Entra con un fundido de 12 cuadros.
- **Si el video es apaisado y deja una banda de más de 320 px, el hook se centra
  en la banda.** Si el video llena el cuadro, va a una altura fija cerca del
  borde, debajo de lo que tapa TikTok.
- Lo escribe una persona. Un clip puede no tener hook: entonces no se dibuja nada.

## La mosca

Dos modos, por clip:

**`tercio`** — para los clips sin marca ajena. El logotipo suelto, centrado, al
0,745 del alto: queda en el tercio de abajo y **por encima de los 320 px** donde
TikTok pone el usuario y el epígrafe.

**`tapar`** — para los que traen marca de agua de la cuenta de origen. El
logotipo va **sobre una placa opaca** centrada en la marca.

### Por qué hace falta la placa

El logotipo tiene transparencia. Puesto encima a secas, **la marca ajena se sigue
leyendo entre las letras**: se probó y se leía "Clipsnhu" perfectamente a través
del amarillo. La placa es lo que efectivamente tapa; el logotipo va arriba.

La placa mide `ancho de la marca × holgura` (1,55) y alto suficiente para que el
logotipo entre con aire. Esquinas redondeadas, para que lea como un elemento de
diseño y no como un parche.

### Por qué el logotipo apaisado en los dos modos

La marca ajena es **un renglón de texto ancho**. Una placa ancha la cubre con
mucha menos superficie que una cuadrada, que tendría que crecer para los costados
sin necesidad. La versión cuadrada queda en `assets/` por si hiciera falta.

## Dónde está la marca ajena

Se mide una vez por clip y se guarda en `clips.json`, en **fracciones del video
original** (`cx`, `cy`, `ancho`, `alto`), no en píxeles: así el molde la ubica
solo, sea cual sea el encuadre final.

En los cinco clips de `@clipsnhu` la marca está **centrada horizontalmente y
estática**, pero a distinta altura en cada uno (de 0,465 a 0,864 del alto). Se
verificó comparando un cuadro del principio con uno del final.

## Lo que tapa la interfaz de TikTok

`TAPA_TIKTOK`: arriba 120 px, abajo 320 px, a la derecha 180 px. El hook y la
mosca caen fuera.

**Una excepción, y conviene saberla:** en `clip-09` la marca ajena cae al 0,864
del alto, o sea **dentro de los 320 px de abajo**. Taparla gana sobre respetar la
zona: la alternativa es publicar con la marca de otra cuenta a la vista.

## Qué es fijo y qué varía

- **Fijo:** que el original no se toca, y que encima van sólo el hook y la mosca.
- **Varía (props):** el clip y su tamaño original; el hook y su tamaño, peso,
  ancho de caja y fundido; archivo de la mosca, modo, ancho y altura en modo
  tercio, holgura y color de la placa en modo tapar; y la caja de la marca ajena.

## Los datos

`assets/media/festival-generacion/clips.json` (copiado a
`datos-prueba/festival-generacion/`), con una entrada por clip: archivo, hook,
grupo, tamaño de la fuente, modo de mosca y caja de la marca.

## Cómo se trabajó

Tres etapas: bajar los clips, ubicar la marca ajena, y el molde. La etapa 2 se
hizo mirando un cuadro de cada clip y midiendo sobre un recorte a resolución
real, no a ojo sobre una miniatura.

**Todo lo que no sea la descarga corre sin internet.**
