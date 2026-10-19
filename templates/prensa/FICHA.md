# Prensa

## Identificación
- **Cuentas:** P1 (medio editorial) y P2 (medio pop).
- **Sale como:** video.
- **Formatos:** 9:16 (1080×1920), 1:1 y 4:3.
- **Cuadros por segundo:** los del material (lo resuelve `metadataDeFragmento`).
- **Duración:** la del fragmento, de 8 a 15 segundos.

## Qué es

Piezas de dos medios de música con marca propia. Lo que las hace parecer un medio
y no una cuenta de fans es el **titular**: el mismo video sin él es contenido de
fan; con él, una nota.

## Las dos pieles

### A — `faja` (la principal)

El material **enmarcado** (cuadrado dentro del 9:16, como la referencia), con el
titular en la banda de arriba y el subtítulo de la letra sobre la imagen.

Lo que el fotograma mostró y el pedido describía distinto: **el marco y la tira son
del mismo negro**, así que no se leen como una tira sobre el video sino como una
sola banda, con el titular flotando sobre el borde del material. Por eso
`faja.colorMarco` y `faja.color` son props separadas y por omisión son iguales.

Con `faja.proporcion` en 0 el material va a sangre y la tira pasa a ser una tira de
verdad, semitransparente (`Prensa-Faja-ASangre-9x16`).

**350 mil likes**, contra los 60 mil de la placa de prensa con foto fija. Cinco
veces el techo con el elemento más barato de construir de todo el relevamiento.

### B — `panel`

La pantalla partida: de un lado el material, del otro un panel de color plano con
la **marca del medio** en una caja clara arriba y el **titular de varias líneas**
abajo, con palabras destacadas en un segundo color.

La marca arriba y el titular en el tercio de abajo, como en la referencia: con todo
pegado arriba, un titular corto deja medio panel vacío.

La referencia tiene una persona hablando y recortes de foto que enmarcan arriba y
abajo. **Tomamos sólo la estructura del panel**, no la persona ni los recortes.

## El titular lo escribe una persona

**No sale de la letra ni de los datos del lanzamiento.** Es una frase editorial que
alguien escribe en la bajada de cada tema, igual que los hooks de
`letra-sobre-video`. El molde lo recibe ya escrito, como prop.

Cotu va a armar un banco de frases para apoyar la redacción. Eso no cambia el
molde.

**Los titulares de `ejemplos.ts` son propuestas sin aprobar**, puestas para que el
molde tenga algo que mostrar y para poder comparar tipografías. Son descriptivos a
propósito (quién y qué), que es lo que hace la referencia, y no afirmaciones que
haya que sostener.

### Cómo se marcan las palabras destacadas

En la piel `panel`, lo que va **entre asteriscos** sale con el color destacado:

```
FMK vuelve con *Si sale el sol*
```

Es lo más simple de escribir para quien redacta y no necesita otro campo.

## La tipografía es la decisión principal

En los otros moldes es estética. Acá es lo que hace que la pieza se lea como un
medio: una faja con la tipografía equivocada no funciona por más bien compuesta que
esté. Por eso hay tres direcciones para cada piel, como composiciones.

| Para la faja | Qué dice |
|---|---|
| **TikTok Sans** 600 (por omisión) | Nativo: parece el texto que escribe un usuario con la herramienta de la app |
| **Geist** 500 | Más sobrio, más de medio |
| **Arimo** 700 | Es Arial: el look de captura de noticia |

| Para el panel | Qué dice |
|---|---|
| **TikTok Sans** 800 (por omisión) | Nativo y contundente |
| **Archivo Narrow** 700 | Angosta: titular de diario, entra más texto |
| **Fraunces** itálica | Editorial con remates; es la que usa P1 |

### La restricción de los sellos

FMK y Sony exigen Arial o TikTok Sans. Esa restricción es sobre **el texto del
tema**, o sea la letra: el titular es la voz editorial del medio, no un activo del
sello. Igual el valor por omisión es TikTok Sans en las dos pieles, porque no
cuesta nada y saca la pregunta del medio. **Si un sello lo discute, está resuelto
sin tocar nada.**

## Los dos medios

Nombre, logo y paleta siguen **pendientes**. Mientras tanto van provisorios:

| | P1, editorial | P2, pop |
|---|---|---|
| Nombre provisorio | LA PÚA | RADAR |
| Panel | `#17171A` (neutro oscuro) | `#E5007A` (magenta) |
| Destacado | `#D8B26A` (dorado) | `#FFE34D` (amarillo) |
| Tipografía | Fraunces itálica | TikTok Sans 800 |

## Qué es fijo y qué varía

- **Fijo:** la estructura de cada piel.
- **Varía (props):** tema y material (archivo, inicio, oscurecido, encuadre);
  titular; de la faja: color del marco y de la tira, alto, proporción de la caja
  del material, tipografía, tamaño, peso y color del texto; del panel: lado, ancho,
  color, marca y los colores de su caja, tipografías, tamaño, peso, color del texto
  y del destacado, y bajada; del subtítulo: mostrarlo, tamaño, peso, itálica,
  altura y si va en minúscula.

## Para decidir en Studio

1. **Dirección tipográfica** de la faja (`Comparar-Faja-*`) y del panel
   (`Comparar-Panel-*`). Es la decisión principal.
2. **Alto de la faja** (`Comparar-Faja-Alta` / `-Baja`) y si el material va
   enmarcado o a sangre (`Prensa-Faja-ASangre-9x16`).
3. **Si el subtítulo de la letra va siempre** (`Comparar-Subtitulo-Con` / `-Sin`).
4. **Qué piel usa cada cuenta.** P1 y P2 son dos medios con marca propia, así que
   probablemente una cada una.
5. **La identidad de cada medio**: nombre, logo y paleta, que siguen pendientes.

## Tipos de pieza que la ficha vieja listaba

De los tres que había anotados, este molde cubre la **placa de noticia**. Los otros
dos (**agenda de estrenos** y **dato o curiosidad**) no están construidos: la
agenda se parece bastante a `lista-numerada` con tarjetas en vez de números, y el
dato es `letra-sobre-video` en modo hook. Ninguno de los dos se pidió todavía.

## Referencias

- `assets/referencias/12-prensa-con-video/cuadro-faja-titular.png` — piel A.
- `assets/referencias/07-fotos-artista/cuadro-panel-de-marca.png` — piel B.
