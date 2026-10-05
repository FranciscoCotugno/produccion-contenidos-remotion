# Brat puro

## Identificación
- **Cuentas:** L01 (fondo blanco, letra negra), L12 (fondo negro, letra blanca).
- **Sale como:** video.
- **Dimensiones:** **1:1 (1080×1080)**, 30 fps, como la referencia. En TikTok se ve con bandas arriba y abajo.
- **Duración:** la del fragmento.
- **Punto de partida:** desde cero.
- **Componente:** `BratPuro.tsx`; ejemplos en `ejemplos.ts`; renders en `render/`.

## Qué es
Solo letra sobre un fondo liso, con la estética de la portada del disco Brat de Charli XCX. Las palabras aparecen de a una, sincronizadas con la voz, y se van acumulando en un bloque.

## Por qué funciona
No hay nada más en pantalla: toda la atención va a la letra. Cada palabra nueva reacomoda el bloque y obliga a seguir leyendo. La gente lo vuelve a ver para leerlo y cantarlo. La pantalla blanca, además, se destaca en un feed donde casi todo es oscuro.

## La mecánica del bloque
Medida sobre `referencias/brat-puro/01-brat-puro.mp4`.

1. **Caja fija.** El bloque vive en una caja de ancho y alto fijos (en la referencia es cuadrada: 38 % del ancho del cuadro). Va centrada; el **borde izquierdo queda fijo**: al achicarse la letra no se recentra hacia los costados.
2. **Un bloque por frase.** Cada `Line` de la letra es un bloque: cuando entra la primera palabra de la frase siguiente, el bloque se vacía y vuelve a crecer desde cero. El bloque **no se vacía al terminar la frase**: queda en pantalla hasta que entra la siguiente (nunca hay pantalla vacía entre frases). La última frase queda hasta el final.
3. **Aparición seca.** Cada palabra aparece sin animación, 3 cuadros antes de cantarse (ver Tiempos).
4. **La letra se achica por el alto.** Se usa el tamaño más grande (entre el mínimo y el máximo) con el que las palabras visibles entran en la caja, cortando renglones de forma voraz. Con el máximo entran 3 renglones; con el cuarto la letra empieza a bajar. Si ni con el mínimo entra, el bloque se pasa del alto de la caja (crece hacia arriba y abajo desde su centro).
5. **Justificado.** Los renglones completos se estiran para llenar el ancho (espacios grandes: la firma de Brat). Un renglón está completo cuando la palabra siguiente de la frase ya no entra en él. El último renglón del bloque sigue la regla de `ultimoRenglon` (ver abajo). Un renglón de una sola palabra queda a la izquierda.
6. **Mayúsculas y puntuación** se respetan (como la referencia), salvo que se pida todo en minúscula.

### Regla de la referencia para el último renglón
En la referencia, el último renglón se estira solo cuando ya está completo: "Suena    tu" se estira (no entra "canción"), "Yo sé" no (todavía entra "que"), y el renglón final de cada frase ("al teléfono", "has llama'o") nunca se estira. Es lo mismo que diagramar la frase entera y justificar todos los renglones menos el último, mostrando solo las palabras ya cantadas. Es la opción `completo`, por defecto.

## Qué es fijo y qué varía
- **Fijo:** la mecánica del bloque y los colores de cada piel.
- **Varía (props, esquema en `bratPuroSchema`):**

| Prop | Qué es | Por defecto |
|---|---|---|
| `tema` | letra, fragmento, título y artistas (`temaSchema`) | — |
| `piel` | `blanca` (L01) o `negra` (L12) | `blanca` |
| `tipografia` | `archivo-narrow`, `tiktok-sans-angosta` (TikTok Sans al 75 % de ancho) o `arimo` | `archivo-narrow` |
| `mayusculas` | `respetar` o `minuscula` | `respetar` |
| `bloque` | `ancho`, `alto`, `centroY` en px | 740 × 760, centro en y = 540 |
| `letra` | `max`, `min` (px), `interlineado` | 196 / 90 / 1,15 |
| `ultimoRenglon` | `completo`, `siempre`, `nunca` o `porcentaje` | `completo` |
| `porcentaje` | umbral para `porcentaje` (0–100) | 70 |
| `ajusteLetra` | ajuste fino de toda la letra, en cuadros | 0 |
| `adelantoLectura` | cuadros que cada palabra aparece antes de cantarse | 3 |
| `fondo` | `tipo` (`color` / `video` / `imagen`), `src`, `inicio`, `desenfoque` (px), `velo` (0–1) | liso (`color`) |
| `golpeBeat` | el bloque crece apenas en cada tiempo (escala extra, 0 = apagado); usa `tema.beats` | 0 |
| `efectos` | textura opcional: `grano` (0–0,4), `polvo` (sí/no), `temblor` (0–2), `halacion` (0–1), `desenfoque` (px) | versión "película" por piel (`EFECTOS_PELICULA` en `ejemplos.ts`) |
| `safeZone` | guía de zona segura (solo Studio) | apagada |

Tamaño de letra a escala de la referencia: "Suena" a tamaño máximo ocupa el 61 % del ancho del bloque, como en el original (Archivo Narrow mide 2,37 em en "Suena": 0,61 × 760 / 2,37 ≈ 196 px; se calculó con 760 de ancho, antes de bajarlo a 740). En la referencia el bloque ocupa el 38 % del ancho del cuadrado (unos 410 px en 1080); acá es más grande (740) para que se lea mejor en el celular.

## Modos de texto
1. **Letra palabra por palabra.**
**Sin cierre con tema y artista** (decisión de Cotu, 2026-10-05): se probó un cierre de 2 s con título y artistas y se sacó; la pieza termina con la última frase (mejor para el loop). El tema queda identificado por el sonido de TikTok.

## Fondo de video o imagen
Para tener más variedad en las mismas cuentas, el fondo puede ser un video (o una imagen) en lugar del color liso. La mecánica del bloque no cambia.
- **Dos tipos de video:** el **videoclip del tema** (`src` = el clip, `inicio` = el inicio del fragmento: va sincronizado con el audio) o un **video generado con IA** de los bancos (`assets/media/bancos/`).
- El video cubre el cuadro 1:1, va mudo (el audio es el del tema), desenfocado (14 px en los ejemplos) y se repite si es más corto que la pieza.
- Encima va un **velo del color de la piel** (blanco o negro) con opacidad `velo` (0,5 en los ejemplos), para que la letra se lea.
- Los efectos de película van encima de todo, igual que con fondo liso.
- **Distinto de `brat-maximal`** (decisión de Cotu): aquel son frases enteras gigantes sobre el video con tinte; este es el bloque que se arma palabra por palabra, sobre el video desenfocado. Se busca la máxima variedad posible en las cuentas.
- **Videos de IA en 1080p:** los del banco vienen en 4K (2160×3840) y desenfocarlos en cada cuadro hace muy lento el render. Se usan copias en 1080×1920 (`assets/media/bancos/<banco>/1080p/`, mismo nombre); los originales quedan.
- Composiciones: `BratPuro-Video-Clip-SiSaleElSol-1` (videoclip) y `BratPuro-Video-IA-InstintoLuv` (`nicho-driving-night-001`, en 1080p).

## Efectos (textura)
La referencia es limpia; los efectos son opcionales, para darle "alma" sin cambiar la mecánica. Todos apagados = limpio.
- **Grano:** ruido de película que cambia en cada cuadro. Ensucia el blanco hacia gris claro y el negro hacia gris oscuro. 0,12 es sutil.
- **Desenfoque:** la letra levemente borrosa, como en la portada del disco Brat (texto de baja resolución). 1 a 2,5 px.
- **Polvo:** motas y alguna raya vertical (oscuras en la piel blanca, claras en la negra).
- **Temblor:** el cuadro se corre un par de píxeles, como película en el proyector.
- **Halación:** en la piel negra, la letra blanca sangra luz cálida; en la blanca, la tinta se corre apenas (sombra difusa).

Los filtros de color (LUT, archivos `.cube`) no suman en este molde: solo hay blanco y negro, y un LUT casi no los cambia. Se dejan para `reproductor-app`. Los filtros de CapCut no se pueden usar: no son archivos portables y su licencia no cubre usarlos fuera de CapCut.

**Elegida: versión "película"** (Cotu, 2026-10-05), por piel:
- Blanca: grano 0,15, polvo, temblor 1, halación (tinta) 0,2, desenfoque 1,5 px.
- Negra: grano 0,12, polvo, temblor 1, halación (luz) 0,35, desenfoque 1 px.

Ojo con "nativo, no publicitario": con todo más fuerte deja de parecer contenido de usuario. El grano hace que el render pese más (unos 50 MB los 22 s en negra).

## Prueba: golpe al beat
- **Golpe al beat** (`golpeBeat`, apagado): el bloque escala desde su centro con el golpe de `shared/effects/beat` (tiempo fuerte 1, débil 0,35, decae en 90 ms). Valor de prueba 0,015 (1,5 %). Necesita la grilla `beats` del tema.
  - FMK: la grilla de `si-sale-el-sol-150` (178,2 BPM) **no sirve**: viene de otro archivo y sobre este audio cae al azar. Se detectó de nuevo con librosa sobre el tema completo: **172,3 BPM**, estable. Grillas: fragmento 1 `first 0,300 / period 0,3481`, fragmento 2 `first 0,136 / period 0,3485`. Ojo: la grilla regular no coincide fuerte con los ataques (en el fragmento 1 cae igual que el promedio; desvíos de hasta 0,19 s), así que hay que juzgarla a ojo y oído antes de usarla.
- Quedó como prop apagada (sin composición). La explosión al ritmo se lleva a `brat-color`.
- **Vocales estiradas: probado y descartado** (2026-10-05). Agregar vocales a la palabra que se sostiene ("quierooo"), aun rápido, no queda bien: la regla que decide qué palabra se estira se nota arbitraria. No se usa en este molde.

## Tiempos
- **Adelanto de lectura: 3 cuadros** (`adelantoLectura`). En el tiempo exacto la letra se percibía tarde. Medido contra la voz separada, los tiempos de Whisper caen sobre el ataque de la voz (mediana +10 ms en instinto-luv, +16 ms en fmk-2): los datos no están atrasados, pero la palabra tiene que aparecer un poco antes que el sonido para verse en sincro. Mismo adelanto que `reproductor-app`.
- La primera palabra, si se canta dentro del primer medio segundo, se muestra desde el cuadro 0 (para que algo pase desde el primer cuadro). Si cae después, la pantalla arranca vacía hasta que aparece.
- `ajusteLetra` corre toda la letra en cuadros (además del adelanto), para un desfase parejo de un tema.

## Tipografía
- **Por defecto:** Archivo Narrow 400 (alternativa abierta a Arial Narrow, que no se puede usar por licencia).
- **Para sellos que exigen TikTok Sans o Arial** (FMK / Sony): `tiktok-sans-angosta`, TikTok Sans 400 al 75 % de ancho (eje `wdth`). Cumple "TikTok Sans" y mantiene la letra angosta. `arimo` cumple "Arial" (mismas métricas), pero no es angosta: el bloque entra menos palabras por renglón.
- La tipografía es prop por pedido de los sellos; la mecánica no cambia con ella.

## Zona segura
El formato es **1:1**: TikTok lo muestra a escala 1, centrado en la pantalla, con bandas arriba y abajo (el cuadrado ocupa de y = 420 a y = 1500 de la pantalla). Sobre el cuadrado:
- **Arriba:** las pestañas (hasta y = 150 de la pantalla) caen en la banda: no tapan nada.
- **Abajo:** los 450 px de abajo empiezan en y = 1470 de la pantalla: tapan los últimos **30 px** del cuadrado.
- **Derecha / izquierda:** igual que en vertical: libre de x = 60 a x = 925.

Área libre dentro del cuadrado: **x 60–925, y 0–1050**. El bloque va centrado en el cuadro (centro en y = 540) y mide **740 × 760**: el temblor de cuadro agranda la imagen un 3 %, y con 760 de ancho el borde derecho se pasaba unos 6 px de x = 925. Medido con la versión "película" en piel negra (4 renglones, con temblor): la letra queda entre x = 165–918 e y = 184–896.

## Notas para la implementación final
- **brat-color reusa este molde:** `BratPuro.tsx` exporta la escena (`BratEscena`: fondo, bloque, efectos, audio; recibe los colores y la escala del bloque), el esquema, `fraseEnPantalla` y `tiempoLetra`; `ejemplos.ts` exporta `EFECTOS_PELICULA`. Es una dependencia entre moldes: en la estructura final conviene que la mecánica del bloque Brat sea una pieza común.
- **Medir texto con la tipografía cargada:** el render en paralelo usa varias pestañas, y en algunas el canvas mide con la tipografía de reemplazo del sistema aunque `document.fonts` la dé por cargada (el bloque salía con otros renglones en algunos cuadros). El molde espera a que el canvas mida con la tipografía real (comparando contra monospace, y para TikTok Sans angosta, contra su ancho normal) antes de habilitar el render.
- **Grano para fondo liso:** `Grain` de `shared/effects` se mezcla en overlay, que deja intactos el blanco y el negro puros: sobre este fondo no se ve. El molde usa una variante local (`GranoFondoLiso`, mismo ruido en mezcla normal con poca opacidad). Si otro molde de fondo liso lo necesita, conviene que `Grain` acepte el modo de mezcla.
- **Se repite con `reproductor-app`:** esperar la tipografía y medir texto con ella (allá para achicar y partir la línea). Ver la nota de esa ficha.

## Decisiones tomadas
- **Formato:** 1:1.
- **Efectos:** versión "película" por piel.
- **Bloque y letra:** 740 × 760 centrado; letra de 90 a 196 px, interlineado 1,15.
- **Último renglón:** `completo` (la regla de la referencia). **Mayúsculas:** se respetan. **Cierre:** no. **Adelanto de lectura:** 3 cuadros.
- **Tipografía:** Archivo Narrow por defecto; TikTok Sans angosta para sellos que exigen TikTok Sans o Arial (FMK).
- Todo sigue siendo prop: se puede cambiar desde Studio sin tocar código.

## Primer cuadro de fmk-si-sale-el-sol-2
"flaca" se cantaba en 0,54 s del fragmento, apenas después del medio segundo en que la primera palabra se muestra desde el cuadro 0, y el video arrancaba con cuadros vacíos. Se corrió el fragmento a **1:05,1** (todos los tiempos 0,1 s antes): "flaca" queda en 0,44 s y aparece desde el cuadro 0.

## Ejemplos y renders
- `BratPuro-Blanca-SiSaleElSol-1` y `-2` (FMK, TikTok Sans angosta) y `BratPuro-Negra-InstintoLuv` (Archivo Narrow).
- `BratPuro-Video-Clip-SiSaleElSol-1` y `BratPuro-Video-IA-InstintoLuv` (fondo de video).
- Renders: `render/blanca-si-sale-el-sol-1.mp4` (L01) y `render/negra-instinto-luv.mp4` (L12), en 1:1 con efecto película. Se exportaron antes de sacar el cierre y de sumar el adelanto de lectura: terminan con 2 s de título y artista. Para una versión al día, re-exportar desde Studio.

## Referencias
Ver `referencias/brat-puro/REFERENCIAS.md`.
