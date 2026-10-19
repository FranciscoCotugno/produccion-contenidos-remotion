# Tarjeta de letra

> **Nota del 2026-10-17 (reglas generales).** Lo que esta ficha diga sobre **zona
> segura** quedó como registro de cómo se construyó el molde, **no como regla**.
> Hoy las composiciones van a sangre completa: la única precaución es la columna
> de botones de TikTok sobre el borde derecho, y solo en 9:16. La prop que antes
> se llamaba `safeZone` ahora es `franjaBotones` y solo prende una guía en Studio.
> Tampoco hay marca de agua en ningún molde, y un molde puede salir en varios
> formatos. Ver `CLAUDE.md`.


> El nombre del molde quedó de antes: desde el 2026-10-05 la tarjeta va **sin letra** (decisión de Cotu). La estructura final y el nombre los decide Agustín.

## Identificación
- **Cuentas:** C4 (tarjeta sobre una foto), C9 (tarjeta sobre color plano).
- **Sale como:** imagen. También como carrusel de 3 imágenes (modo 2).
- **Dimensiones:** **3:4 (1080×1440)**, el formato de una foto (pedido de Cotu). En TikTok se ve con bandas: la zona libre sobre la imagen es x 60–925, y 0–1230 (el caption tapa los últimos 210 px).
- **Punto de partida:** desde cero.
- **Componente:** `TarjetaLetra.tsx` (sale como imagen: `<Still>` de Remotion); ejemplos en `ejemplos.ts`; fotos de prueba en `datos-prueba/<tema>/tarjetas.json` (las líneas de letra de ese archivo ya no se usan); fotogramas en `render/`.

## Qué es
La tarjeta del tema que arma la app de música más usada cuando compartís una canción, **idéntica y sin logo** ni nombre de la app (pedido de Cotu): la portada grande con esquinas redondeadas y, debajo, el título en negrita y los artistas, centrados. Es lo que muestra la referencia `01-imagen-con-tarjeta.png`.

## Por qué funciona
Parece algo que alguien compartió desde la app: nativo, no publicitario. Deja el tema identificado (portada, título y artista) sobre una imagen de mood.

## Composición (de atrás hacia adelante)
1. **Fondo:** una foto (C4; en producción, generada con IA) o un color plano tomado de la portada (C9).
2. **La portada** (376 px de lado, esquinas de 13, sombra suave), centrada a lo ancho y **en el tercio de arriba** de la imagen (centro del conjunto en y = 400; va de y ≈ 165 a 635). Dos veces un 15 % más chica que en la referencia (pedidos de Cotu).
3. **Debajo**, centrados: el título en negrita (50 px) y los artistas (32 px): no bajan de ahí por ser texto principal y secundario (CLAUDE.md). Sobre la foto, en blanco con una sombra suave; en C9, en blanco o negro según el fondo.

## Qué es fijo y qué varía
- **Fijo:** el diseño de la tarjeta y la tipografía.
- **Varía (props, `tarjetaLetraSchema`):** `tema` (portada, título, artistas), `piel` (`c4-foto` / `c9-color`), `fondo` (foto, desenfoque, oscurecido), `colorFondo` (C9; vacío = automático), `tarjeta` (lado de la portada 376, centro vertical 400), `franjaBotones`.

## Modos
1. **Una tarjeta**, una imagen.
2. **Carrusel de 3:** la misma tarjeta sobre tres fotos distintas (C4) o en color (C9).

## Color (C9)
- **Automático:** el fondo sale del color dominante de la portada, como lo elige la app (pesan los colores vivos, saturados y de brillo medio; casi nada los casi negros, casi blancos y grises), un poco más oscuro.
- **Contraste:** el texto va en blanco o negro (el que más contraste haga); si no llega a 4,5:1, el fondo se oscurece o se aclara hasta que se lea.
- **Forzado:** `colorFondo`. Ej.: en instinto luv el automático da un marrón cálido (la portada es casi toda foto oscura y piel; el violeta está solo en las letras del título): `Comparar-Tarjeta-ColorTema-InstintoLuv` lo fuerza al violeta del tema.

## Tipografía
Geist para el título y los artistas (la de la app es propia de la app y no se puede usar).

## Zona segura
En 3:4 TikTok muestra la imagen con bandas (ocupa de y = 240 a 1680 de la pantalla): arriba no tapa nada, el caption tapa los últimos 210 px y la columna de botones, desde x = 925. Zona libre sobre la imagen: x 60–925, y 0–1230. El conjunto va centrado a lo ancho (texto de x 160 a 920), en el tercio de arriba: lejos del caption.

## Fotos de fondo (C4)
En producción salen de los bancos de IA. Para probar se usan las de `assets/media/bancos/` (día para Si sale el sol, noche para instinto luv). Ojo: las de prueba son chicas (unos 675×1200): en 1080×1440 se ven estiradas; las de producción tienen que tener al menos 1080×1440.

## Decidido en Studio (Cotu, 2026-10-19)

| Decisión | Queda |
|---|---|
| Portada | **320** (bajó de 376) |
| Altura del conjunto | 400, sin cambio |
| C9, color de fondo | **El del tema**. El automático sacaba un marrón barroso que no se correspondía con la portada. Si un tema no trae colores, vuelve al automático |
| C4, la foto | **Limpia**: sin desenfoque ni oscurecido |

**Riesgo asumido con la foto limpia:** las fotos de prueba son oscuras y la
tarjeta se lee bien. **Con una foto clara la tarjeta se pierde**, y a volumen de
producción nadie va a mirar foto por foto para decidir si hay que oscurecerla. Se
propuso un piso de oscurecido de 0,15–0,2 (invisible en fotos oscuras, salva las
claras) y Cotu eligió dejarlo limpio. `fondo.oscurecer` sigue siendo prop: si
aparece el problema, se sube por pieza o se pone el piso.

## Referencias
Ver `referencias/tarjeta-letra/REFERENCIAS.md`: la imagen de mood con la tarjeta del tema al centro es la referencia de este diseño.
