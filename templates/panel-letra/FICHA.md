# Panel de letra

## Identificación
- **Cuentas:** las de lyrics puras, donde la letra es toda la pieza. Cubre las dos
  variantes del relevamiento: la de fondo con portada desenfocada
  (`assets/referencias/03-portada-blureada/`) y la de color liso
  (`assets/referencias/08-spotify/`).
- **Sale como:** video.
- **Formatos:** 9:16 (1080×1920), 1:1 (1080×1080), 3:4 (1080×1440) y 4:3 (1440×1080).
- **Cuadros por segundo:** 30. No hay video de fondo (el fondo es la portada o un
  color), así que va al valor de las piezas sin video (regla 1 del `CLAUDE.md`).
- **Duración:** la del fragmento.

## Por qué es un molde y no una piel de `reproductor-app`

Es otra pantalla de la misma app —el panel de letra abierto— y comparte los datos
de entrada, pero no comparte nada de la estructura: no hay tarjeta, no hay
controles, no hay barra de progreso y no hay fila de texto. `ReproductorApp.tsx`
es, de punta a punta, "una tarjeta con una fila de texto arriba": mide cada línea
para que entre en un renglón y la parte en tramos si no entra. Acá la letra ocupa
muchos renglones a propósito.

Entrar como piel habría dejado el 90 % de ese archivo sin usar y las perillas de
cada uno colgando en el panel del otro. Por eso va en carpeta propia (decisión de
Cotu, 2026-10-17). Lo que sí se comparte son los datos: `shared/tema.ts`,
`shared/lyrics.ts`, las tipografías y la guía de la franja de botones.

## Qué es

Toda la letra en pantalla al mismo tiempo, **con el mismo tamaño y el mismo peso**.
La que suena está nítida y en blanco puro. Las de arriba y las de abajo están
atenuadas, y el efecto **aumenta con la distancia**. No hay palabra resaltada, no
hay cambio de color, no hay karaoke.

La columna **se desplaza hacia arriba** a medida que avanza el tema, de modo que la
línea activa queda siempre a la misma altura.

## Por qué funciona

Es la pantalla que cualquiera reconoce de su propia app de música, y la letra
entera a la vista deja leer hacia adelante: se engancha el que quiere saber cómo
sigue. El título y el artista están en el encabezado, así que quien mira sabe qué
buscar.

## Las dos pieles

| | **A — `desenfoque`** | **B — `liso`** |
|---|---|---|
| Fondo | La portada del tema, muy desenfocada y oscurecida | Color liso sacado de la portada |
| Diferencia activa / inactiva | Desenfoque **y** opacidad crecientes | Solo opacidad |
| Letra | 78 px: entran 4 a 6 líneas | 68 px: entran 8 a 10 |
| Encabezado | Portada chica + título + artista + botón redondo | Galón y título centrado |
| Referencia | `assets/referencias/03-portada-blureada/` | `assets/referencias/08-spotify/` |

La estructura es la misma; lo que cambia es el tratamiento.

## Medidas, de dónde salen

De un cuadro a 1080×1920 de la referencia A (`cuadro-elpipon-activa.png`):

| Elemento | Medida |
|---|---|
| Letra | ~78 px, negrita, mismo tamaño para activa e inactivas |
| Renglón | cada 108 px |
| Aire entre líneas de la letra | ~54 px (media línea) |
| Columna | de x=92 a x=925 |
| Centro de la línea activa | y≈790, el 41 % del alto |
| Portada del encabezado | 200 px de lado, esquinas de 28 px |
| Título / artista | 48 px negrita / 42 px al 70 % |
| Botón redondo | 88 px, blanco al 18 % |

El margen derecho es 155 y no 130 para que la línea que suena no caiga bajo la
columna de botones de TikTok en 9:16 (que arranca en x=925).

La referencia tiene bandas negras arriba y abajo quemadas en el video: son el
encuadre del que la hizo, no parte del formato. Acá la pieza va a sangre.

## Lo que es fácil de hacer mal

Que el apagado sea **parejo** en vez de progresivo: se pierde la profundidad y
queda sucio. Dos cosas lo evitan:

1. **La curva.** `curvaArriba` y `curvaAbajo` deciden cuánto se apaga la vecina
   inmediata. Separadas a propósito: en la referencia, **lo que ya se cantó se
   apaga más rápido que lo que viene**, y eso es lo que da la sensación de avance.
2. **El contraste del fondo.** Con una portada sin color (o en blanco y negro) el
   fondo queda gris parejo y las líneas atenuadas se leen como manchas. Se
   arregla subiendo `oscurecer`: la prueba en blanco y negro va en 0,52 contra
   0,24 de la de color. Al revés, una portada ya oscura (FMK) necesita menos: 0,1.

## Tiempos y animación

- El panel está completo desde el primer cuadro: no hay entrada.
- **Al principio la columna apoya arriba** (`arranque`) y recién empieza a subir
  cuando la línea que suena bajó hasta el anclaje. Es lo que hacen las dos apps;
  sin eso, los primeros segundos quedan con media pantalla vacía.
- `desplazamiento`: `saltos` (la columna salta al cambiar de línea, con una
  transición corta y frenada) o `continuo` (sube durante toda la línea).
- `adelantoLectura` adelanta el cambio de línea unos cuadros, para dar tiempo a
  leer. `ajusteLetra` corre toda la letra para corregir un desfase parejo.

## Escalas: la letra crece con el ancho, la interfaz no

La letra se mide sobre 1080 de ancho y se escala con el ancho, porque TikTok
muestra la pieza al ancho de la pantalla en todos los formatos: así se ve del
mismo tamaño en el celular.

El encabezado **no**: se topa en 1. Si creciera con el ancho, en 4:3 (1440×1080)
se comía la línea que suena. En 4:3 entran 3 o 4 líneas, más grandes; es un
encuadre distinto, no un error.

## Interludios

Un tramo sin canto más largo que `interludio.segundos` se marca con un símbolo de
nota en una línea propia. Se detecta solo, del hueco entre el final de una línea y
el principio de la siguiente: no hay que cargar nada.

**Ningún tema de prueba tiene un puente instrumental** (el hueco más grande de
Maxi es de 0,4 s), así que con los datos reales no se ve. La composición
`Comparar-Interludio` baja el umbral a 0,3 s solo para mostrar cómo queda.

## Tipografía

Inter, que ya está en el repo en lugar de la letra del sistema del iPhone, para
interfaces que simulan apps. `letra.tipografia` la cambia a TikTok Sans, que es lo
que hay que usar con los sellos que la exigen (FMK, Sony).

Códigos visuales de las apps, **sin logos ni nombres de marca**: los íconos
(el galón y el botón de tres puntos) están dibujados acá.

## Qué es fijo y qué varía

- **Fijo:** la estructura (columna de letra, desplazamiento, línea activa nítida) y
  que todas las líneas van del mismo tamaño y peso.
- **Varía (props):** tema, piel, desenfoque y oscurecido del fondo, color liso,
  viñeta, tipografía, tamaño, peso, interlineado, aire entre líneas, márgenes,
  cuántas líneas se ven arriba y abajo, opacidad mínima, desenfoque máximo, las dos
  curvas, anclaje, arranque, desplazamiento y su transición, encabezado, botón,
  interludio, ajuste de letra y adelanto de lectura.

## Decidido en Studio (Cotu, 2026-10-17)

| Decisión | Queda |
|---|---|
| Curva del desenfoque | El punto medio: 0,45 arriba y 0,6 abajo |
| Cuántas líneas | Muchas: 3 arriba y 6 abajo en la piel A; 6 y 8 en la B |
| Desplazamiento | A saltos |
| Tipografía | **TikTok Sans** (y es la que exigen FMK y Sony) |
| Encabezado | Completo, con el botón redondo |

Sobre la curva: las dos primeras comparaciones que armé (`Suave` y `Media`) eran
casi la misma —0,6 abajo en las dos, 0,5 contra 0,4 arriba— así que no había nada
que distinguir, y Cotu dijo "suave o media" con razón. Queda el punto medio. La
comparación `Comparar-Curva-Suave` se rehizo en 0,3 para que sí se distinga.

Las composiciones `Comparar-*` siguen ahí para volver sobre cualquiera de las cinco.

## Se repite con otros moldes

Esperar a que cargue la tipografía y medir el texto con ella en un canvas antes de
cortar los renglones. Es el mismo problema de `reproductor-app` y `brat-puro`: en
el render en paralelo, algunas pestañas miden con la tipografía de reemplazo aunque
`document.fonts` la dé por cargada. Acá está resuelto igual que allá (se espera a
que el canvas mida distinto que con la de respaldo sola). Si Agustín unifica algo
de `shared/`, este es un candidato.

El corte de renglones es **de izquierda a derecha, sin rebalancear**, que es lo que
hacen las dos apps ("Te haya matado en / la ciudad", y no "Te haya matado / en la
ciudad"). Difiere a propósito de `brat-maximal`, que sí balancea.

## Referencias

- `assets/referencias/03-portada-blureada/` — piel A. **No tenía `ANALISIS.md` ni
  fotogramas**: los cuadros (`cuadro-elpipon-*.png`) se sacaron de los `.mp4` al
  construir este molde, y las medidas de arriba salen de ahí.
- `assets/referencias/08-spotify/` — piel B, con su `ANALISIS.md`.
