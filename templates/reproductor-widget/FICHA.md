# Reproductor compacto sobre fondo

## Identificación
- **Cuentas:** L07 (sobre el videoclip), C5 (sobre imagen, estética fría y nocturna), C6 (sobre imagen, estética cálida).
- **Sale como:** video.
- **Dimensiones:** 9:16 (1080×1920), 30 fps.
- **Duración:** la del fragmento, típicamente de 10 a 20 segundos.
- **Punto de partida:** desde cero. Puede reusar partes de la interfaz de `reproductor-app`.

## Qué es
Un fondo a pantalla completa (el videoclip o una imagen) con un reproductor chico flotando al centro y una línea de texto arriba. A diferencia de `reproductor-app`, acá el reproductor está encima del fondo, no el video adentro del reproductor.

## Por qué funciona
El fondo marca el clima (el videoclip, o una escena vacía con mood) y el reproductor identifica el tema sin tapar nada. Es de las piezas más fáciles de producir en volumen.

## Composición (de atrás hacia adelante)
1. **Fondo a pantalla completa:**
   - L07: el videoclip.
   - C5 y C6: una imagen (en producción, generada con IA; en el laboratorio, cualquier imagen de ejemplo), con un zoom muy lento para que no quede estática.
2. **Oscurecido** del fondo (alrededor de 40%), con un tinte suave según la piel: frío para C5, cálido para C6.
3. **Widget del reproductor** centrado, de unos 620 px de ancho, fondo negro con esquinas muy redondeadas: portada chica a la izquierda, título y artistas, ícono de ondas de audio, barra de progreso con tiempos, controles.
4. **Línea de texto** arriba del widget: chica, blanca, en minúscula y negrita.

## Qué es fijo y qué varía
- **Fijo:** el diseño del widget y la tipografía.
- **Varía (props):** tipo de fondo (video o imagen) y su archivo, título, artistas, portada, fragmento, letra, modo de texto, texto fijo, piel (fría o cálida).

## Modos de texto
1. **Frase fija** de mood (por ejemplo, "no paro de pensarte").
2. **Letra sincronizada**, línea por línea.
3. **Pregunta fija** (por ejemplo, "¿cómo que este álbum no fue nominado a los Grammy?").

## Tiempos y animación
- Todo visible desde el primer cuadro.
- La barra avanza en tiempo real desde un punto de arranque simulado.
- En el modo de letra, cada línea entra en el momento exacto, con un fundido corto.

## Tipografía
- Línea de texto: TikTok Sans en negrita, minúscula, 50 px como mínimo.
- Widget: Geist.

## Zona segura
El widget y el texto van en el centro de la pantalla, lejos de las zonas tapadas.

## Para decidir en Studio
- Nivel de oscurecido y tinte de cada piel.
- Velocidad del zoom lento sobre las imágenes.

## Referencias
Ver `referencias/reproductor-widget/REFERENCIAS.md`.
