# Pedido para Claude Code: molde `brat-puro`

Siguiente molde del índice. Seguí el flujo de `CLAUDE.md`: leé `templates/brat-puro/FICHA.md` y `referencias/brat-puro/` y **proponé un plan antes de escribir código**. El plan tiene que decir qué piezas de `shared/` usás, qué props y con qué esquema, y qué hay que construir.

## Material listo

- **Ficha y referencia:** `templates/brat-puro/FICHA.md` y `referencias/brat-puro/01-brat-puro.mp4` (720×720, 32 s).
- **Tipografía:** Archivo Narrow ya está en `assets/fonts/`, registrada en `LICENCIAS.md`.
- **Temas de prueba**, todos con tiempos por palabra:
  - `fmk-si-sale-el-sol-1`: "estando cerca…" a "…malgastar". Letra en minúscula, ritmo rápido.
  - `fmk-si-sale-el-sol-2`: "flaca…" a "…encuentro". Arranca con una palabra sola, lo que sirve para probar el bloque con un solo renglón.
  - `instinto-luv`: estribillo de 20 s. Letra con mayúsculas y apóstrofos ("Chocolate'", "lo' show"). Sirve para probar renglones con palabras largas y puntuación.
  - `si-sale-el-sol-150`, `agua` y `a-quien-le-importa` no sirven por ahora: no tienen el archivo de audio o video en `assets/media/`.

## Lo que se ve en la referencia

Sumalo a lo que dice la ficha:

- El bloque tiene el **borde izquierdo fijo** y está centrado en vertical. Al achicarse, la letra no se recentra hacia los costados.
- El reset no espera a que termine la oración: pasa por frase o renglón de la letra ("Yo sé que no debo" → bloque nuevo → "que te pienso demasia'o"). Con nuestro formato, eso equivale a **un bloque por `Line`**.
- El último renglón **no siempre** se estira: "canción y" queda a la izquierda, "no debo" se estira. Parece depender de cuánto llena el renglón. Hay que decidirlo (ver abajo).
- Respeta las mayúsculas y los apóstrofos de la letra original.

## Ojo con la zona segura

- **Vertical:** la zona libre va de y=150 a y=1470, así que su centro está en **y=810**, no en 960. Si el bloque se centra en la pantalla, un bloque alto puede meterse en los 450 px de abajo. Proponé dónde va el centro.
- **Horizontal:** un bloque de 760 px centrado ocupa de x=160 a x=920. El límite derecho es 925. Entra justo: no lo agrandes sin mover el centro.

## Decisiones para Cotu en Studio

Dejalas como props o controles para poder probarlas sin tocar código:

1. Ancho del bloque (ficha: alrededor de 760 px), tamaño máximo y tamaño mínimo de la letra.
2. Último renglón: siempre justificado, nunca, o solo si pasa de cierto porcentaje del ancho.
3. Mayúsculas y puntuación: respetar la letra (como la referencia) o pasar todo a minúscula.
4. **Tipografía:** la ficha la marca como fija, pero ya hay un sello (FMK, Sony) que exige Arial o TikTok Sans y prohíbe otra. Proponé si conviene que la tipografía sea un prop, con Archivo Narrow por defecto. Si te parece que eso es arquitectura nueva, consultalo.
5. Cierre de 2 segundos con tema y artista: si va por defecto o no.

## Criterio de terminado

El de `CLAUDE.md`: renderiza con al menos 2 temas sin tocar código, respeta la zona segura, todo lo variable es prop con su esquema, la ficha queda completa y hay un render de ejemplo de cada piel (L01 blanca, L12 negra).
