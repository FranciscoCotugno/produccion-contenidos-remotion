# Letra sobre video

## Identificación
- **Cuentas:** L08 (letra sobre el videoclip), L11 (letra sobre material en vivo), POV1 a POV8 (material de nicho).
- **Sale como:** video, 30 fps.
- **Dimensiones:** sale en tres formatos (pedido de Cotu): **9:16 (1080×1920)**, **1:1 (1080×1080)** y **3:4 (1080×1440)**. Todo se ubica sobre la zona libre de cada formato.
- **Duración:** la del fragmento (inicio y fin). En POV7 y POV8, clips cortos de 8 a 15 segundos.
- **Punto de partida:** desde cero.
- **Componente:** `LetraSobreVideo.tsx`; ejemplos en `ejemplos.ts`; textos y videos de prueba en `datos-prueba/<tema>/videos.json` (los textos son los de `textos.txt`); fotogramas en `render/`.

## Qué es
Un video a pantalla completa con texto encima. Es el molde más versátil: cubre 10 cuentas, que se diferencian por el tipo de video y el modo de texto.

## Por qué funciona
- **L08 y L11:** el formato de lyrics probado.
- **POV:** el tema como banda sonora de un mundo (snow, surf, manejo nocturno, ciudad bajo la lluvia).
- El texto parece escrito por un usuario con la herramienta de texto de la app: nativo, no publicitario.

## Composición
1. **Video a pantalla completa, sin sonido:** el videoclip (L08), material en vivo (L11) o material de nicho (POV). Arranca en `video.inicio` y se repite si es más corto que el fragmento. Oscurecido opcional (en los ejemplos, 15 % sobre el videoclip y nada en los POV).
2. **Audio del tema, por su lado,** con su fragmento: el material de nicho no tiene sonido.
3. **Texto**, según el modo.

## Estilo de texto (uno solo, pedido de Cotu)
El texto nativo de la app, como en las tres referencias:
- TikTok Sans, peso 500, 52 px, blanco, centrado.
- Sin caja ni contorno, con una sombra leve.
- Renglones cortos (hasta 640 px de ancho) y balanceados, sin palabras sueltas.

La letra va en minúscula. Los textos fijos van tal cual se escriben ("POV:" en mayúsculas).

## Modos de texto (`modo`)
1. **`letra`:** la letra sincronizada, línea por línea, al centro, con 3 cuadros de adelanto de lectura y un fundido de 4 cuadros.
2. **`fija`:** una frase de la letra durante todo el video.
3. **`hook`:** un texto fijo todo el video (ej.: "POV: 2 am por la costanera y suena esto", "cuando la tocan en vivo:").
4. **`hook-letra`:** el hook fijo y la letra sincronizada.

## Posición (`posicionHook`)
- **`arriba`:** el hook (o la línea fija) en el tercio de arriba de la zona libre, al 20 % de su alto (en 9:16, y ≈ 415). Como en la referencia de los fuegos artificiales.
- **`centro`:** al centro, como en la referencia de Milo.
- La letra va al centro. Si el hook también va al centro, la letra baja al 72 % de la zona libre.

## Qué es fijo y qué varía
- **Fijo:** el estilo del texto.
- **Varía (props, `letraSobreVideoSchema`):** `tema` (fragmento de audio y letra), `video` (archivo, inicio, oscurecido), `modo`, `textoFijo`, `posicionHook`, `adelantoLectura`, `safeZone`.

## Tiempos y animación
- El texto fijo está desde el primer cuadro.
- La letra entra con un fundido corto, en el momento exacto.
- POV7 y POV8: pensar en el loop, con el clip cortado para que el final empalme con el principio (se resuelve al elegir `video.inicio` y el fragmento; el molde no hace fundidos de cierre).

## Zona segura
Todo va dentro de la zona libre del formato (`safeArea`). En 1:1 y 3:4, TikTok muestra el cuadro con bandas; la zona libre se calcula sobre cómo se ve en la app.

## Ejemplos
Por tema: los cuatro modos y el POV en 9:16, y además la letra y el POV en 1:1 y 3:4. En L11 se prueba con el videoclip: no hay material en vivo de prueba.

## Para decidir en Studio
- Si el oscurecido sobre el videoclip hace falta.
- Si la letra va al centro o un poco más abajo.

## Se repite con otros moldes
- La letra con adelanto de lectura y fundido corto: también en `reproductor-widget` y `reproductor-app`.
- El video de fondo en loop con `Html5Video`: también en `brat-puro`.

## Referencias
Ver `referencias/letra-sobre-video/REFERENCIAS.md`.
