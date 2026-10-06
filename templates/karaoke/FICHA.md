# Karaoke

## Identificación
- **Cuenta:** L09.
- **Sale como:** video, 30 fps.
- **Dimensiones:** **9:16 (1080×1920)** y **1:1 (1080×1080)** (pedido de Cotu). El mismo componente se adapta: la línea se centra en la zona libre de cada formato.
- **Duración:** la del fragmento (inicio y fin).
- **Punto de partida:** desde cero. Usa la letra con tiempos por palabra de `shared/`.
- **Componente:** `Karaoke.tsx`; ejemplos en `ejemplos.ts`; fotogramas en `render/`.

## Qué es
La línea completa de la letra, visible sobre el videoclip. Cada palabra se va rellenando del color del tema en el momento en que se canta, como en un karaoke.

## Por qué funciona
Invita a cantar: se ve la línea entera y, al mismo tiempo, exactamente dónde va la voz.

## Composición
1. **El videoclip** a pantalla completa, sin sonido, oscurecido un 35 % para que la letra se lea.
2. **La línea actual**, centrada en la zona libre, en blanco.
3. **El relleno:** cada palabra se pinta del color de resaltado **de izquierda a derecha mientras se canta**, no de golpe. Cada palabra son dos capas: la blanca entera y, encima, la de color recortada a lo que ya se cantó. El avance va del tiempo de la palabra al de la siguiente (en la última, hasta el fin de la línea).
4. **Audio del tema**, por su lado.

## Modos
Uno solo: la línea completa con el relleno. **El modo "completá la letra" se sacó** (decisión de Cotu); los cortes que estaban aprobados quedan en `textos.txt` por si vuelve.

## Color de resaltado
Sale del **color secundario del tema** (decisión de Cotu), así cada tema se ve distinto sin tocar código: violeta en instinto luv, naranja en Si sale el sol. Con `colorResaltado` se fuerza otro, por ejemplo si el del tema no contrasta contra ese videoclip.

## Línea en pantalla
**Solo la actual** (decisión de Cotu). Queda hasta que arranca la siguiente, así la pantalla nunca queda vacía, y la primera se ve desde el cuadro 0. El prop `lineaSiguiente` muestra además la próxima, más tenue: hoy va en `false`.

## Tipografía
TikTok Sans en negrita, 60 px, con sombra suave. La línea se arma sola en los renglones que haga falta.

## Qué es fijo y qué varía
- **Fijo:** la tipografía, el diseño de la línea y la mecánica del relleno.
- **Varía (props, `karaokeSchema`):** `tema` (fragmento de audio, letra, colores), `video` (archivo, inicio, oscurecido), `colorResaltado`, `lineaSiguiente`, `adelantoLectura`, `safeZone`.

## Tiempos
- Tres cuadros de adelanto de lectura, como en los demás moldes.
- El relleno sigue los tiempos por palabra de la letra: si están corridos, se nota enseguida.

## Zona segura
La línea va centrada en la zona libre de cada formato, con 30 px más de margen a cada lado:
- **9:16:** x 60–925, y 150–1470.
- **1:1:** x 60–925, y 0–1050 (TikTok lo muestra con bandas arriba y abajo).

## Para decidir en Studio
- Cuánto oscurecer el videoclip (hoy 35 %): en Si sale el sol el naranja del tema pelea con el fondo cálido.

## Se repite con otros moldes
- El video de fondo en loop con `Html5Video`: también en `brat-puro`, `brat-maximal`, `brat-minimal` y `letra-sobre-video`.
- La línea activa con adelanto de lectura: también en `letra-sobre-video` y los reproductores.

## Referencias
No hay capturas específicas: es una propuesta propia, sin referencia de TikTok.
