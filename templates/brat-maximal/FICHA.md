# Brat maximal

## Identificación
- **Cuentas:** L02 (sobre material en vivo), L03 (sobre el videoclip).
- **Sale como:** video, 30 fps.
- **Dimensiones:** **1:1 (1080×1080)**, como la referencia.
- **Duración:** la del fragmento (inicio y fin).
- **Punto de partida:** LyricPunch del repo original (el tratamiento del video y el golpe al ritmo). Pero acá va la frase entera, no una sola palabra.
- **Componente:** `BratMaximal.tsx`; ejemplos en `ejemplos.ts`; fotogramas en `render/`.

## Qué es
Las frases de la letra en blanco, gigantes, ocupando casi todo el cuadro, sobre material del artista desenfocado.

## Por qué funciona
Las frases pegadizas son imposibles de no leer. Funciona aunque el video se mire sin sonido.

## Composición (de atrás hacia adelante)
1. **Video a pantalla completa, sin sonido, desenfocado:** material en vivo (L02) o el videoclip (L03). Desenfoque de 14 px y brillo al 80 %, para que la letra blanca se lea; agrandado un 6 % para que el desenfoque no deje bordes claros. Se repite si es más corto que el fragmento.
2. **Sin tinte** (pedido de Cotu). Primero se probó un tinte de color por cuenta (verde lima en L02, magenta en L03), fuerte y después suave: dejaba el video plano o casi no se notaba. En la referencia, el verde es la luz del escenario, no un filtro.
3. **La frase actual**, en blanco, centrada en la zona libre, en 1 a 3 renglones, lo más grande posible.
4. **Audio del tema**, por su lado.

## Tipografía
TikTok Sans regular (400), con mayúsculas y minúsculas tal cual la letra. Como en la referencia, y no la angosta de `brat-puro` (decisión de Cotu). Interlineado 1,08, con una sombra suave (más marcada que la de la referencia, pedido de Cotu). Una frase de una o dos palabras no pasa de 240 px.

## Frases
- Cada línea de la letra se parte en frases de hasta 4 palabras, parejas (`palabrasPorFrase`).
- Una frase nunca termina en una palabra que queda colgando ("que", "a", "de", "me", "la", etc.): el corte se corre una palabra. Ej.: "Es una adicción / que me tiene enganchado", "estando cerca o a distancia / igual te quiero".
- Diagramación: se prueban todos los cortes en 1 a 3 renglones y gana el de letra más grande; a igual tamaño, el más parejo.

## Qué es fijo y qué varía
- **Fijo:** tipografía, tamaño máximo y tratamiento del texto.
- **Varía (props, `bratMaximalSchema`):** `tema` (fragmento de audio, letra, beats), `video` (archivo, inicio, desenfoque, brillo), `golpeBeat`, `palabrasPorFrase`, `adelantoLectura`, `safeZone`.

## Tiempos y animación
- Cada frase entra con corte seco cuando se canta su primera palabra, con 3 cuadros de adelanto de lectura. Queda hasta que entra la siguiente.
- La primera frase está desde el cuadro 0: algo pasa desde el primer cuadro.
- Opcional: golpe de zoom al ritmo sobre el video (`beatPulse` de `shared/`, 5,5 %), con la grilla de `tema.beats`.
- Sin cierre con tema y artista (como en los demás Brats, pedido de Cotu).

## Zona segura
En 1:1, TikTok muestra el cuadro con bandas: la zona libre es x 60–925, y 0–1050. El texto va dentro, con 50 px de margen, centrado en esa zona (un poco a la izquierda del centro del cuadro, por la columna de botones).

## Ejemplos
`BratMaximal-<tema>` con los dos temas, sobre el videoclip, y `Comparar-BratMaximal-Golpe-InstintoLuv` (con golpe al ritmo). L02 y L03 se arman igual y solo cambia el material; como no hay material en vivo de prueba, hay un solo ejemplo por tema.

## Para decidir en Studio
- Si lleva golpe al ritmo o no.
- Cuánto desenfoque (hoy 14 px).

## Se repite con otros moldes
- La espera de la tipografía antes de medir en canvas: también en `brat-puro` y `reproductor-app`.
- El video de fondo en loop con `Html5Video`: también en `brat-puro` y `letra-sobre-video`.

## Referencias
Ver `referencias/brat-maximal/REFERENCIAS.md`.
