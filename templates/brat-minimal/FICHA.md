# Brat minimal

## Identificación
- **Cuenta:** L04.
- **Sale como:** video.
- **Dimensiones:** la referencia es cuadrada (1:1). Probar también 9:16 y decidir en Studio.
- **Duración:** la del fragmento.
- **Punto de partida:** los efectos de LyricFilm (ya en `shared/effects/`) y la elección automática de palabra protagonista de LyricPunch (`pickKey`, todavía no traída a `shared/`).

## Qué es
Palabras chicas, en minúscula, apareciendo de a una sobre el videoclip oscuro y desaturado. Las palabras clave aparecen más grandes.

## Por qué funciona
Es cinematográfico: el video es protagonista y la letra lo acompaña. Rinde muy bien con temas de flow y rap.

## Composición (de atrás hacia adelante)
1. El videoclip a pantalla completa, oscurecido y desaturado.
2. Opcional: grano de película (de `shared/effects/`).
3. La palabra actual, chica y centrada. Las palabras clave, más grandes.

## Qué es fijo y qué varía
- **Fijo:** tratamiento de color, tipografía, reglas de tamaño.
- **Varía (props):** video, audio, letra, fragmento, lista de palabras destacadas.

## Modos de texto
1. **Palabra por palabra, con palabras destacadas.**

## Tiempos y animación
- Cada palabra aparece en su tiempo exacto y queda hasta la siguiente.
- A veces aparecen 2 o 3 palabras juntas (por ejemplo, "quiero encontrarme"): respetar las líneas de la letra.

## Palabras destacadas
En el laboratorio se pasan a mano como prop. Más adelante, el sistema las propone con `pickKey` y una persona las aprueba.

## Tipografía
Una sans simple (Geist o TikTok Sans) en minúscula. Palabras normales: 50 px; destacadas: alrededor del doble.

## Para decidir en Studio
- Formato cuadrado o vertical.
- Cuánto oscurecer y desaturar, y si lleva grano.

## Referencias
Ver `referencias/brat-minimal/REFERENCIAS.md`.
