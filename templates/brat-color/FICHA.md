# Brat color

> **Nota del 2026-10-17 (reglas generales).** Lo que esta ficha diga sobre **zona
> segura** quedó como registro de cómo se construyó el molde, **no como regla**.
> Hoy las composiciones van a sangre completa: la única precaución es la columna
> de botones de TikTok sobre el borde derecho, y solo en 9:16. La prop que antes
> se llamaba `franjaBotones` ahora es `franjaBotones` y solo prende una guía en Studio.
> Tampoco hay marca de agua en ningún molde, y un molde puede salir en varios
> formatos. Ver `CLAUDE.md`.


> Escrita con Cotu (2026-10-05). Construido y en iteración: falta decidir en Studio lo de "Para decidir" y exportar el render de ejemplo.

## Identificación
- **Cuentas:** L01 y L12, las mismas de `brat-puro`. No es una cuenta nueva: es una **variante para dar variedad** a esas cuentas.
- **Sale como:** video.
- **Dimensiones:** 1:1 (1080×1080), 30 fps, como `brat-puro`.
- **Duración:** la del fragmento.
- **Punto de partida:** `brat-puro` (la mecánica del bloque se reusa tal cual).
- **Componente:** `BratColor.tsx` (usa `BratEscena` de `brat-puro`); ejemplos en `ejemplos.ts`.

## Qué es
La letra de Brat (el mismo bloque justificado que se llena palabra por palabra) pero con el color en movimiento: el fondo y la letra cambian de color con cada frase, y con el ritmo el tema "explota": un tiempo destella el fondo, el siguiente golpea el bloque.

## Por qué funciona
Mantiene la identidad Brat (bloque, tipografía, formato) para que siga siendo reconocible como L01/L12, pero cambia la energía: los cortes de color marcan las frases y el golpe marca el ritmo. Sirve para alternar con `brat-puro` en las mismas cuentas sin repetir siempre la misma pieza.

## Qué es fijo y qué varía
- **Fijo:** la mecánica del bloque de `brat-puro` (ancho fijo, justificado, letra que se achica, un bloque por frase), la tipografía y el formato.
- **Varía (props, esquema `bratColorSchema`):** todo lo de `brat-puro` salvo la piel (los colores los decide este molde), más:

| Prop | Qué es | Por defecto |
|---|---|---|
| `paleta` | colores de fondo en orden, uno por frase | verde Brat `#8ACE00`, negro, blanco |
| `destello` | `modo` (`invertir` / `siguiente`) y `cuadros` (0 = sin destello) | `invertir`, 3 |
| `golpeBloque` | escala extra del bloque en el golpe (0 = sin golpe) | 0,08 |
| `explosionDesde` | segundo desde el que arranca la explosión | 0 |
| `efectos` | los de `brat-puro` | versión "película" (la de la piel blanca) |
| `fondo` | el de `brat-puro`: color liso, video o imagen | liso |

**Con video de fondo**, el velo toma el color de la frase (y del destello), así el cambio de color sigue funcionando sobre el video. Composiciones: `BratColor-Video-IA-InstintoLuv` (velo 0,6) y `BratColor-Video-Clip-SiSaleElSol-1`.

## Color
- **Paleta:** blanco, negro y el **verde lima de la portada de Brat** (#8ACE00), configurable como prop (lista de colores).
- **Por frase:** cada frase nueva (cuando el bloque se vacía y vuelve a crecer) pasa al siguiente color de la paleta para el fondo. La letra se elige sola entre negro y blanco, la de más contraste con el fondo.
- **Intercambio:** caso particular de la paleta blanco/negro: en cada frase fondo y letra cambian de lugar.

## Ritmo: la explosión
- Necesita la grilla de beats del tema (`tema.beats`). Sin grilla, el molde funciona igual, solo con los cambios por frase.
- **Se alterna beat a beat:**
  - **Tiempo par: destella el fondo** (pasa un instante al color de la letra, o al siguiente de la paleta, y vuelve).
  - **Tiempo impar: golpea el bloque** (un zoom notorio que vuelve rápido; bastante más que el 1,5 % de la prueba de `brat-puro`).
- **Límite de destellos:** un cambio de color de pantalla completa como mucho cada 2 beats (a 172 BPM, unas 1,4 veces por segundo). Más de 3 destellos por segundo puede afectar a personas fotosensibles y TikTok lo marca.

## Modos de texto
1. **Letra palabra por palabra**, como `brat-puro` (con el mismo adelanto de lectura de 3 cuadros). Sin cierre con tema y artista, como `brat-puro`.

## Zona segura
La misma que `brat-puro` en 1:1: área libre x 60–925, y 0–1050. El golpe del bloque agranda la letra, así que el bloque va más angosto: **690 × 760**. Con el golpe al máximo (+8 %) y el temblor (+3 %), el borde derecho queda en x ≈ 924. Medido en todos los cuadros de instinto-luv sin efectos: la letra llega a x = 911 y y = 933; sumando el temblor, x ≈ 924 e y ≈ 947. Si se sube `golpeBloque`, hay que bajar el ancho.

## Ojo con los beats
La explosión se nota mucho si cae fuera de tiempo.
- **instinto-luv** (tema de prueba principal): beat marcado. Grilla detectada con librosa y fijada por el bombo (ataques en graves): **104,3 BPM, `first` 0,140, `period` 0,5754**. En esa fase los ataques de graves son 1,8 veces el promedio, y se sostiene en todo el fragmento. A contratiempo hay más ataques en general (hi-hats), por eso la fase se tomó del bombo.
- **Si sale el sol (FMK):** grilla de 172,3 BPM poco precisa (no coincide fuerte con los ataques). Sirve para ver el color por frase; la explosión hay que juzgarla a ojo y oído.

## Composiciones
- `BratColor-InstintoLuv` y `BratColor-SiSaleElSol-1` (TikTok Sans angosta).
- Para comparar: `Comparar-BratColor-SoloFrase` (sin destello ni golpe), `Comparar-BratColor-DestelloSiguiente` y `Comparar-BratColor-Limpio` (sin efectos de película).

## Render
`render/instinto-luv.mp4` se exportó antes de sacar el cierre y de sumar el adelanto de lectura: termina con 2 s de título y artista. Para una versión al día, re-exportar `BratColor-InstintoLuv`.

## Decidido en Studio (Cotu, 2026-10-19)

| Decisión | Queda |
|---|---|
| Destello | **`invertir`**: el fondo salta al color de la letra. Se comparó contra `siguiente` (el próximo color de la paleta) y contra no tenerlo |
| Golpe del bloque y duración del destello | Sin cambio: 0,08 y 3 cuadros |
| Paleta y orden de los colores | **Por pieza**, según el mood del tema |
| Cuándo arranca la explosión | **Por pieza** (`explosionDesde`) |

Se decidió mirando tres videos de 20 segundos y no fotogramas: **el destello
dura 3 cuadros** y en una imagen fija no se ve.

## Referencias
Todavía no hay referencias en `referencias/brat-color/`. Si hay un TikTok con este estilo, sumarlo.
