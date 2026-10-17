# Reglas generales de los moldes (17 oct 2026)

**Leer esto antes que cualquier pedido.** Son decisiones de Cotu que cambian cosas que ya están escritas en `CLAUDE.md`, en las fichas de los moldes y en el código. Donde este documento y una ficha se contradigan, manda este documento, y hay que actualizar la ficha.

## 1. Nada sale con marca de agua

Ningún molde lleva marca de agua: ni el `@usuario`, ni un logotipo, ni una firma.

Casi todas las cuentas de referencia tienen una, así que aparece descrita en los análisis de `assets/referencias/`. **Ignorar esa parte.** Donde una ficha tenga una prop de marca de agua, sacarla.

## 2. No hay un solo formato de salida

Los videos no tienen que ser todos verticales. Cada molde sale en varios formatos, como ya hace `letra-sobre-video` (9:16, 1:1 y 3:4).

Esto coincide con lo relevado: de las cuentas con mejores números, la mayoría **no publica en 9:16**. Publican en 4:3 o 16:9 y dejan que TikTok ponga las bandas. `@v.jxnior` (mediana 219 mil), `@omarmusicc_`, `@rolitas_gold1` y `@jona_lyrics21` son todas 4:3.

## 3. Se elimina la zona segura

La caja de zona segura (en 9:16: de y=150 a y=1470, de x=155 a x=925) **ya no se usa**. Obliga a dejar márgenes que quedan mal y empujan todo al centro.

En su lugar:

- **Las composiciones van a sangre completa.** El texto puede llegar al borde si el diseño lo pide.
- **Única precaución que queda:** la columna de botones de TikTok, sobre el borde derecho, tapa una franja vertical. Conviene no poner ahí algo que haya que leer. No es una caja: es un borde.
- **El pie de pantalla se resuelve solo con el formato.** En 4:3 o 1:1, el epígrafe y los botones de la app caen sobre las bandas negras y no sobre la pieza. Ese es otro motivo para no hacer todo en 9:16.

**Esto toca código.** La prop `safeZone` de `letra-sobre-video`, las tablas de zona segura de las fichas y lo que diga `CLAUDE.md` al respecto hay que revisarlos. No lo toqué yo porque no escribo código ni fichas.

## 4. El filtro de producción se levanta

La lista de moldes de octubre excluía footage de terceros y personas en cámara. **Esa restricción ya no rige:** el material se consigue por generación con IA o por otras vías.

Para los moldes, significa que el fondo puede ser cualquier cosa y que las verticales que estaban descartadas vuelven a estar disponibles.

Queda una observación, no una regla: material generado con IA es propio y no tiene exposición; material bajado de un índice de imágenes ajenas sí la tiene, y el riesgo no es la pieza sino la cuenta, que es el activo. La recomendación es que los bancos salgan de generación.

## 5. Lo que estas reglas cambian en lo ya escrito

| Dónde | Qué cambia |
|---|---|
| `docs/pedidos/reproductor-app-piel-panel-letra.md` | Reescrito. Tenía una sección entera de zona segura que ya no aplica |
| `assets/referencias/*/ANALISIS.md` | Donde describen marcas de agua y proporción 9:16, leerlo como descripción de la referencia, no como especificación |
| Fichas de los moldes terminados | Las tablas de zona segura quedan como registro de lo que se hizo, no como regla |
| `CLAUDE.md` | Si fija la zona segura o un formato único, hay que actualizarlo |
