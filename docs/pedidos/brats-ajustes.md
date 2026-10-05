# Pedido para Claude Code: ajustes de `brat-puro` y `brat-color`

Revisión de Cowork del 2026-10-05, sobre las fichas, los ejemplos y los cuadros de los renders. La mecánica está bien resuelta en los dos moldes. Lo que sigue son ajustes concretos.

## 1. Texto que sale mal en pantalla

- **instinto-luv: "Vos cámbiate,"** lleva una tilde de más. En voseo es **"cambiate"**. Se ve en el render de la piel negra y en brat-color. Corregilo en `letra.txt` y en el `tema.json` (es la misma palabra, así que no hace falta volver a correr los tiempos). Esperá el OK de Cotu, porque es la letra oficial del sello.
- **FMK fragmento 1: "bajo la luz que nos domina cada día"** sale en pantalla, pero la palabra "domina" (¿o "ilumina"?) está pendiente de confirmar de oído. No hay que cambiar nada hasta que Cotu confirme.

## 2. Pedido del sello FMK: letra finita y fundido

Las piezas de FMK usan TikTok Sans angosta en **peso 400**, pero el sello pidió "letra finita" y "fade in / fade out". El eje de peso de TikTok Sans va de **300** a 900, así que se puede afinar. Archivo Narrow y Arimo arrancan en 400.

- Sumá el prop **`peso`** (por defecto 400). Para FMK, 300.
- Sumá el prop **`aparicion`**: `seca` (por defecto, la referencia) o `fundido` (cada palabra entra con un fundido corto de 4 a 6 cuadros). El "fade in / fade out" del sello se puede leer así, sin romper la mecánica.
- Proponé dos composiciones para comparar en Studio: `BratPuro-FMK-Fino` (peso 300, seca) y `BratPuro-FMK-Fino-Fundido` (peso 300, fundido).

## 3. Regla del primer cuadro

`CLAUDE.md` pide que algo pase desde el primer cuadro. Hoy, si la primera palabra se canta después del medio segundo, la pieza arranca con la pantalla vacía. En FMK fragmento 2 se arregló moviendo el fragmento, pero en producción los fragmentos salen de la bajada y esto se va a repetir.

Propuesta, en dos partes:

- **En los datos:** cuando se arma el `tema.json` de un fragmento, si la primera palabra cae después de los 0,5 s, se corre el inicio del fragmento para que caiga en 0,3 a 0,5 s (como hiciste con FMK 2). Anotalo en la ficha como regla de preparación.
- **En el molde, de respaldo:** si igual cae tarde, la primera palabra se muestra desde el cuadro 0.

## 4. Renders viejos

Los tres videos de `render/` (`blanca-si-sale-el-sol-1.mp4`, `negra-instinto-luv.mp4` y `brat-color/render/instinto-luv.mp4`, unos 120 MB) son de antes de sacar el cierre y de sumar el adelanto: terminan con título y artista. Según la regla nueva (no renderizar videos):

- Reemplazalos por **hojas de fotogramas** con `npx remotion still`: 4 a 6 cuadros por composición en una imagen, en `render/`.
- Los videos viejos se borran solo con OK de Cotu.

## 5. `CLAUDE.md` no tiene los cambios de reglas

Todavía dice "sin logos ni copias exactas" y no tiene la regla de no renderizar videos. Si Cotu ya te los pidió, aplicalos. Si no, esperá su texto.

## 6. Para confirmar con Cotu (no hay que tocar nada)

- **1:1 con bandas.** La grilla pedía vertical para evitar las bandas, pero se decidió 1:1. Conviene una subida privada de prueba para ver cómo queda la piel blanca con las bandas de TikTok.
- **brat-color con FMK:** la grilla de beats de FMK es poco precisa. Por ahora, la explosión se juzga con instinto-luv.
