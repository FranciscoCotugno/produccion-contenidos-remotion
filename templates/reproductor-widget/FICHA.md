# Reproductor compacto sobre fondo

> **Nota del 2026-10-17 (reglas generales).** Lo que esta ficha diga sobre **zona
> segura** quedó como registro de cómo se construyó el molde, **no como regla**.
> Hoy las composiciones van a sangre completa: la única precaución es la columna
> de botones de TikTok sobre el borde derecho, y solo en 9:16. La prop que antes
> se llamaba `safeZone` ahora es `franjaBotones` y solo prende una guía en Studio.
> Tampoco hay marca de agua en ningún molde, y un molde puede salir en varios
> formatos. Ver `CLAUDE.md`.


## Identificación
- **Cuentas:** L07 (sobre el videoclip), C5 (sobre imagen, estética fría y nocturna), C6 (sobre imagen, estética cálida).
- **Sale como:** video, 30 fps.
- **Dimensiones:** sale en tres formatos (pedido de Cotu): **9:16 (1080×1920)**, **1:1 (1080×1080)** y **3:4 (1080×1440)**. El mismo componente se adapta: todo se ubica sobre la zona libre de cada formato.
- **Duración:** la del fragmento (inicio y fin del tema).
- **Punto de partida:** desde cero.
- **Componente:** `ReproductorWidget.tsx`; ejemplos en `ejemplos.ts`; textos e imágenes de prueba en `datos-prueba/<tema>/widgets.json` (los textos son los de `textos.txt`); fotogramas en `render/`.

## Qué es
Un fondo a pantalla completa (el videoclip o una imagen) con el widget del reproductor flotando encima y una línea de texto arriba. A diferencia de `reproductor-app`, acá el reproductor está encima del fondo, no el video adentro del reproductor.

## Por qué funciona
El fondo marca el clima (el videoclip, o una escena vacía con mood) y el widget identifica el tema sin tapar nada. Es de las piezas más fáciles de producir en volumen.

## Composición (de atrás hacia adelante)
1. **Fondo a pantalla completa:** L07, el videoclip desde el inicio del fragmento; C5 y C6, una imagen (en producción, de los bancos de IA) con un zoom lento (6 % en toda la pieza).
2. **Oscurecido** (35 %) y **tinte** suave: frío para C5, cálido para C6, ninguno sobre el videoclip.
3. **El widget**, idéntico al del iPhone y sin logos. Tres pieles:
   - `vidrio`: el gris translúcido de la pantalla bloqueada (la imagen de referencia de Cotu): portada chica, título y artista, ondas, barra con tiempos, anterior / pausa / siguiente y transmitir. Desenfoca lo que tiene detrás.
   - `negro`: el compacto negro de las referencias de C5, con el título en mayúsculas y las ondas en el color del tema.
   - `negro-simple`: el de C6, sin portada, con el título y el artista centrados.
4. **Línea de texto** arriba del widget: TikTok Sans en negrita, blanca, minúscula, 52 px, con renglones balanceados (no quedan palabras sueltas).

## Tamaño y ubicación
- **Ancho del widget: 720 px** (en la referencia de Cotu, a escala de pantalla, ocupaba 938: se achicó por pedido de Cotu). Todo el widget escala con el ancho (prop `ancho`).
- **Altura automática** (`posicion: "auto"`, pedido de Cotu): el bloque (texto + widget) se ubica en la franja más tranquila de la imagen, la de menos detalle, dentro de la zona libre, con una leve preferencia por el centro. Ej.: en la foto de la cama va arriba, sobre la pared lisa; en la ciudad de noche, abajo de los edificios.
- **Fija** (`arriba`, `centro`, `abajo`): para el videoclip, que cambia todo el tiempo (L07 va al centro).
- Centrado a lo ancho: el widget va de x 180 a 900, adentro de la zona libre (hasta 925).

## Qué es fijo y qué varía
- **Fijo:** el diseño de cada piel y la tipografía.
- **Varía (props, `reproductorWidgetSchema`):** `tema` (título, artistas, portada, fragmento, letra, `track` para la barra), `piel`, `fondo` (tipo video o imagen, archivo, inicio, zoom, oscurecido, tinte), `texto` (modo y texto fijo), `posicion`, `ancho`, `adelantoLectura`, `franjaBotones`.

## Modos de texto
1. **Frase fija** de mood (`texto.modo: "fijo"`).
2. **Pregunta fija** (el mismo modo, con una pregunta).
3. **Letra sincronizada**, línea por línea (`"letra"`), con 3 cuadros de adelanto de lectura y un fundido corto. El lugar del texto se reserva para la línea más larga, así el widget no salta.
4. Sin texto (`"ninguno"`).

## Tiempos y animación
- Todo visible desde el primer cuadro.
- La barra y los tiempos avanzan en tiempo real desde `track.displayStart` (dónde cae el fragmento en el tema completo); las ondas se mueven.

## Tipografía
- Línea de texto: TikTok Sans en negrita.
- Widget: Inter (en lugar de la letra del iPhone, ver CLAUDE.md).

## Zona segura
Todo va dentro de la zona libre del formato (`safeArea`), con 40 px de margen. En 1:1 y 3:4, TikTok muestra el cuadro con bandas; la zona libre se calcula sobre cómo se ve en la app.

## Decidido en Studio (Cotu, 2026-10-19)

**Las tres pieles quedan, y la elección es por pieza, no por cuenta.** Cotu:
*"me gustan todas, depende 100 % del mood de la canción y la imagen de fondo"*.
El molde no asigna una piel a una cuenta: ofrece las tres y quien arma la pieza
elige según el material.

| Decisión | Queda |
|---|---|
| Pieles | Las tres (`vidrio`, `negro`, `negro-simple`), a elección por pieza |
| Oscurecido de la imagen | 0,35 por omisión. En 0,20 la foto compite con el widget; en 0,55 se aplana y deja de aportar |
| Tinte y zoom | Sin cambio. También son por pieza, por el mismo criterio |
| Altura del widget | **Automática** |

**La altura automática no está cerrada del todo, y es honesto decirlo.** La
pregunta era si elige bien *en las imágenes de producción*, y acá sólo hay dos
imágenes de prueba. En esas dos elige bien: busca la franja más tranquila y
esquiva el movimiento. Con fotos de otra composición puede fallar, y eso se ve
recién con los bancos reales. Si falla seguido, `posicion` ya es prop y se fija
a mano.

## Se repite con otros moldes
- La barra con tiempos desde `track.displayStart` también está en `reproductor-app`.
- La ubicación automática sobre la franja tranquila de la imagen podría servir para `tarjeta-letra` y `carrusel`.

## Referencias
Ver `referencias/reproductor-widget/REFERENCIAS.md` y la imagen del widget de vidrio que pasó Cotu.
