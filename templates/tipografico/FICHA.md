# Tipográfico

> **Nota del 2026-10-17 (reglas generales).** Lo que esta ficha diga sobre **zona
> segura** quedó como registro de cómo se construyó el molde, **no como regla**.
> Hoy las composiciones van a sangre completa: la única precaución es la columna
> de botones de TikTok sobre el borde derecho, y solo en 9:16. La prop que antes
> se llamaba `safeZone` ahora es `franjaBotones` y solo prende una guía en Studio.
> Tampoco hay marca de agua en ningún molde, y un molde puede salir en varios
> formatos. Ver `CLAUDE.md`.


> **Molde de baja (2026-10-06, decisión de Cotu): no convenció.** No se construye más y sus composiciones se sacaron de Studio. El código, los ejemplos y los fotogramas quedan en la carpeta como registro de lo que se probó; no se borró nada. **L10 queda sin molde asignado.**
>
> Se probó en 9:16 con la letra centrada en la zona segura, y después en 1:1 con la frase centrada en el cuadro y la letra mucho más grande. Lo que se resolvió en el camino y puede servir para otro molde: sacar tres colores plenos de la portada (ver "Los tres colores") y el set de cinco animaciones que rota por frase.

## Identificación
- **Cuenta:** L10.
- **Sale como:** video, 30 fps.
- **Dimensiones:** **1:1 (1080×1080)** (pedido de Cotu). Primero se hizo en 9:16 y la letra quedaba chica para lo que pide el formato.
- **Duración:** la del fragmento (inicio y fin).
- **Punto de partida:** desde cero, con el golpe al ritmo de `shared/effects/`.
- **Componente:** `Tipografico.tsx`; ejemplos en `ejemplos.ts`; fotogramas en `render/`.

## Qué es
La letra animada sobre un color plano sacado de la portada, sin video. Las palabras escalan, se deslizan y rebotan con el beat.

## Por qué funciona
La letra se vuelve una pieza de diseño. El movimiento al ritmo retiene, y se distingue del Brat puro por el color y la animación.

## Composición
1. **Fondo de color plano**, que **va rotando entre tres colores** de la portada, uno por frase (decisión de Cotu).
2. **La frase actual**, centrada en el cuadro, lo más grande posible (hasta 300 px), con la animación que le toca.
3. **Audio del tema**, por su lado.
4. **Sin cierre con la portada** (decisión de Cotu, como en los Brats).

## Los tres colores
Salen de la portada: los grupos de color que más pesan (pesan los vivos; casi nada los casi negros, blancos y grises), descartando los que se parecen entre sí.

**Cada uno se lleva a color pleno:** se le conserva el tono, pero se le emparejan la saturación (0,45 a 0,8) y el brillo (claridad 0,42). Sin esto, las portadas oscuras daban fondos casi negros, que no se leen como "color de la cuenta". Si la portada no da tres tonos distintos, los que faltan salen corriendo el tono del primero en la rueda de color.

El texto va en blanco o negro, el que más contraste haga con cada fondo (4,5:1 como mínimo). Con `colores` se pueden forzar los tres.

## Frases y animaciones
- La letra se parte en frases de hasta 3 palabras (la misma idea que en `brat-maximal`), y dentro de cada frase las palabras entran en su tiempo, con 3 cuadros de adelanto.
- Cada frase se arma lo más grande posible, en 1 a 3 renglones, con el corte más parejo.
- **El set de 5 animaciones rota por frase:**
  1. **Escala:** la palabra entra grande (1,7×) y se asienta.
  2. **Deslizamiento:** entra desde un costado, alternando izquierda y derecha.
  3. **Rebote:** cae desde arriba y rebota (resorte suelto).
  4. **Apilado:** una palabra por renglón, entrando de arriba hacia abajo.
  5. **Corte:** aparece seca, sin animación.
- Una frase queda hasta que arranca la siguiente: la pantalla nunca queda vacía, y la primera palabra se ve desde el cuadro 0.
- El lugar de cada palabra queda reservado desde que arranca la frase, así la frase no salta mientras se completa: la primera palabra aparece en su lugar dentro del renglón, no sola al centro.
- **El beat** hace latir apenas el fondo (`golpeBeat`). La grilla de instinto luv es clara; la de FMK es floja, así que el golpe se juzga con instinto.

## Tipografía
**Ronzino** en negrita (decisión de Cotu, sobre AKONY). Interlineado 1,05.

## Qué es fijo y qué varía
- **Fijo:** el set de animaciones, la tipografía y cómo se arman las frases.
- **Varía (props, `tipograficoSchema`):** `tema` (fragmento de audio, letra, portada, colores, beats), `colores` (vacío = de la portada), `palabrasPorFrase`, `golpeBeat`, `adelantoLectura`, `franjaBotones`.

## Zona segura
**Este molde no se ajusta a la zona segura: la frase va centrada en el cuadro** (decisión de Cotu). Acá la letra es la pieza entera, así que manda el centro del cuadro y no el de la zona libre. Solo se dejan 40 px de margen contra los bordes.

Lo que esto implica en TikTok: en 1:1 el cuadro se ve con bandas arriba y abajo, así que a lo alto no se tapa nada, pero las frases más anchas (por ejemplo "distancia") llegan hasta el borde y quedan por debajo de la columna de botones de la derecha. Se asume.

## Para decidir en Studio
- Si tres colores alcanzan o conviene otro criterio para elegirlos.
- Si las frases más anchas molestan abajo de la columna de botones.
- Si el set de animaciones se queda en cinco.

## Se repite con otros moldes
- El color dominante de la portada y el contraste: de `tarjeta-letra` y `carrusel`, acá extendido a una paleta de tres.
- Las frases cortas y la diagramación que agranda hasta llenar la caja: de `brat-maximal`.
- La espera de la tipografía antes de medir en canvas: de `brat-puro` y `brat-maximal`.

## Referencias
No hay capturas específicas: es una propuesta propia, sin referencia de TikTok.
