# Brat minimal

> **Nota del 2026-10-17 (reglas generales).** Lo que esta ficha diga sobre **zona
> segura** quedó como registro de cómo se construyó el molde, **no como regla**.
> Hoy las composiciones van a sangre completa: la única precaución es la columna
> de botones de TikTok sobre el borde derecho, y solo en 9:16. La prop que antes
> se llamaba `safeZone` ahora es `franjaBotones` y solo prende una guía en Studio.
> Tampoco hay marca de agua en ningún molde, y un molde puede salir en varios
> formatos. Ver `CLAUDE.md`.


## Identificación
- **Cuenta:** L04.
- **Sale como:** video, 30 fps.
- **Dimensiones:** **1:1 (1080×1080)**, como la referencia.
- **Duración:** la del fragmento (inicio y fin).
- **Punto de partida:** desde cero, con el grano de LyricFilm (`shared/effects/`). Las palabras destacadas se pasan a mano (aprobadas por Cotu); `pickKey` de LyricPunch no se trajo.
- **Componente:** `BratMinimal.tsx`; ejemplos en `ejemplos.ts`; palabras destacadas en `datos-prueba/<tema>/brat-minimal.json`; fotogramas en `render/`.

## Qué es
Palabras chicas, en minúscula, apareciendo de a una sobre el videoclip oscuro y casi en blanco y negro. Las palabras destacadas, al doble. Cada golpe de palabras cae en otro lugar del cuadro.

## Por qué funciona
Es cinematográfico: el video es protagonista y la letra lo acompaña. Rinde muy bien con temas de flow y rap.

## Composición (de atrás hacia adelante)
1. **El videoclip** a pantalla completa, sin sonido: desaturado al 88 %, con más contraste (1,2) y oscurecido (brillo 0,7). Se repite si es más corto que el fragmento.
2. **Grano** de película, opcional (`grano`, 0,3 en la comparación).
3. **Las palabras**, blancas, con una sombra leve.
4. **Audio del tema**, por su lado.

## Tipografía y tamaños
- Arimo (la alternativa libre de Arial, la letra de la referencia), regular, en minúscula.
- **Chicas, como en la referencia (pedido de Cotu):** 36 px las normales y 72 px las destacadas. Es una excepción al mínimo de legibilidad de CLAUDE.md (50 px), anotada ahí.

## Golpes de palabras
La letra se arma en golpes chicos, como en la referencia (de 1 a 3 palabras en pantalla):
- Cada destacada va con la palabra de antes y la de después: "una / **adicción** / que", "tiene / **enganchado**".
- El resto, de a 1 o 2: "es", "si sale", "cada día".
- Nunca se mezclan palabras de dos líneas.
- Dentro de un golpe, cada palabra aparece en su tiempo (con 3 cuadros de adelanto) y las normales seguidas comparten renglón; cada destacada va en su propio renglón.
- Un golpe queda hasta que arranca el siguiente: la pantalla nunca queda vacía. Con `minimoGolpe`, los golpes muy cortos se juntan. La primera palabra está desde el cuadro 0.

## Posición y legibilidad
Las palabras cambian de lugar en una grilla de 3 × 3 dentro de la zona libre, recorrida en un orden fijo (no es al azar: cada render sale igual). Props:
- `posicion`: `por-golpe` (cambia con cada golpe, como la referencia), `por-linea` (los golpes de una línea caen en el mismo lugar; cambia al cambiar de línea) o `centro`.
- `saltos`: `lejos` (a la otra punta del cuadro) o `cerca` (a un lugar vecino, dando vueltas alrededor del centro).
- `minimoGolpe`: un golpe que dura menos que esto (en segundos) se junta con el siguiente de su línea ("me" + "tiene enganchado").
- `fundido`: cuadros de fundido de entrada de cada golpe (0 = corte seco).

Cotu notó que, por golpe y saltando lejos, cuesta leer: las palabras aparecen y desaparecen muy rápido y en lugares distintos, y el ojo tiene que salir a buscarlas. Por eso, **por defecto: por línea, saltos cerca, mínimo 0,4 s y fundido de 3 cuadros** (aprobado por Cotu). La versión como la referencia (por golpe, saltando lejos, corte seco) queda para comparar en `Comparar-BratMinimal-PorGolpe-<tema>`.

## Palabras destacadas
En el laboratorio se pasan a mano como prop (`destacadas`), sin importar mayúsculas ni signos. Hoy, las aprobadas por Cotu en `textos.txt`. Más adelante, el sistema las propone (por ejemplo, con `pickKey`) y una persona las aprueba.

## Qué es fijo y qué varía
- **Fijo:** tipografía, reglas de golpes, tratamiento del texto.
- **Varía (props, `bratMinimalSchema`):** `tema` (fragmento de audio y letra), `video` (archivo, inicio, desaturado, brillo), `destacadas`, `tamanos`, `posicion`, `saltos`, `minimoGolpe`, `fundido`, `grano`, `adelantoLectura`, `franjaBotones`.

## Zona segura
En 1:1, TikTok muestra el cuadro con bandas: la zona libre es x 60–925, y 0–1050. La grilla de lugares va dentro, con margen para que ningún golpe se salga.

## Ejemplos
`BratMinimal-<tema>` con los dos temas, `BratMinimal-Color-<tema>` (la variante en color, pedido de Cotu: el mismo molde con `desaturar: 0`) y `Comparar-BratMinimal-Grano-<tema>` (con grano) y `Comparar-BratMinimal-PorGolpe-<tema>` (como la referencia).

## Para decidir en Studio
- Cuánto oscurecer y desaturar, y si lleva grano.

## Se repite con otros moldes
- El video de fondo en loop con `Html5Video`: también en `brat-puro`, `brat-maximal` y `letra-sobre-video`.

## Referencias
Ver `referencias/brat-minimal/REFERENCIAS.md`.
