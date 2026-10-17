# Análisis: carpeta `02-tipografia-cinetica`

Hecho mirando los videos cuadro por cuadro, octubre 2026. Los textos de los ejemplos son inventados: las referencias son temas de terceros y acá solo se describe la mecánica.

## Resumen: en esta carpeta hay tres moldes distintos, no uno

| Cuentas | Qué hacen | ¿Es el molde de la carpeta? |
|---|---|---|
| `@omarmusicc_`, `@01.91.h` | Bloque de texto sobre fondo liso, con **estrellita debajo** | Sí. Y es el mismo molde que `@v.jxnior` de la carpeta 01 |
| `@d4lzy`, `@secherr_xl`, `@mmm.0__0` | **Clip del videoclip con título de tema y signo encima** | No. Es otro molde |
| `@estefaniamarroquinl` | Clip de fondo con bloque de letra chica | No. Es otro molde |
| `@plymusic5` | Placas tipográficas variadas | No es un molde: la cuenta hace cosas distintas |

## Molde A: el de la estrella (`@omarmusicc_`, `@01.91.h`)

**Fotogramas:** `cuadro-omarmusicc-estrella-azul.png`, `cuadro-0191h-estrella-bordo.png`

**Es el mismo molde que `@v.jxnior`** de la carpeta 01, con otra piel. Ver el análisis de esa carpeta para la mecánica completa (palabras que aparecen de a una, primero fantasma; bloque de 2 o 3 renglones que se borra entero; dos colores alternados por renglón).

Lo propio de estas dos cuentas:

- **Una estrellita de cinco puntas, dorada, centrada, justo debajo del bloque de texto.** Es un adorno fijo: no se mueve ni cambia con la letra. Esto es lo que Agustín llamó "letra dentro de una estrella", y está mal descrito: la letra no va adentro de nada.
- `@omarmusicc_`: fondo azul marino, texto en crema. 960×720 (4:3).
- `@01.91.h`: fondo bordó oscuro, texto en blanco y dorado. 960×720 (4:3).

Con esto son **tres cuentas haciendo el mismo molde** con cuatro pieles distintas (violeta, magenta, azul marino, bordó). Es la señal más fuerte de toda la tanda: un molde con mediana de 219 mil vistas y varias cuentas sosteniéndolo.

## Molde B: título de tema y signo sobre clip (`@d4lzy`, `@secherr_xl`, `@mmm.0__0`)

**Fotograma:** `cuadro-d4lzy-signo-sobre-clip.png`

Acá hay una corrección importante respecto de lo que habíamos anotado antes. Estas tres cuentas son las de "qué canción sos según tu signo", y **no son texto sobre fondo liso**. Son:

1. Una **placa de apertura** sobre fondo claro liso, con el texto de la consigna y el nombre del artista destacado en otro color.
2. Después, **una secuencia de fragmentos del videoclip**, y sobre cada uno:
   - El **nombre del tema** en grande, centrado, mayúsculas, con color propio por tarjeta (rosa, celeste, verde).
   - Debajo, el **nombre del signo** entre guiones, más chico y en blanco.
3. Un fragmento por signo, encadenados.

O sea que es `letra-sobre-video` en modo hook, con dos líneas de texto y un corte por cada ítem de una lista. **No necesita letra sincronizada.**

Esto es importante para la grilla: la vertical de "buscate a vos mismo" **no se monta sobre el molde de tipografía**, como habíamos supuesto. Se monta sobre el de video con texto encima, que en el repo ya existe y está terminado.

## Molde C: bloque de letra chica sobre clip (`@estefaniamarroquinl`)

Clip de mar a pantalla completa, con un bloque de letra **chico, blanco, alineado a la izquierda**, ubicado en el tercio superior. Las líneas se van acumulando una debajo de la otra.

Llama la atención lo chico del texto comparado con todo lo demás: ocupa menos de un tercio del ancho. Es otra variante de `letra-sobre-video`, con la letra en modo acumulativo en vez de línea por línea.

## Molde D: no es un molde (`@plymusic5`)

Los dos videos de esta cuenta muestran cosas distintas entre sí: placas de título en serif pesada sobre fondo gris y blanco, y un cuadro amarillo con tipografía condensada y una ilustración de grabado antiguo. Sumado a lo que hace en la carpeta 01 (una palabra gigante sobre azul), la cuenta no sostiene un formato: prueba varios.

**Conclusión:** `@plymusic5` no sirve como cuenta de referencia de un molde. Sirve como banco de ideas tipográficas.

## Con qué se corresponde en el repo

- **Molde A (la estrella):** no existe. Es lo más cercano a `tipografico`, dado de baja el 6 de octubre. Hay que resolver esa contradicción.
- **Molde B (signo sobre clip):** es `letra-sobre-video` en modo `hook`, que ya está **terminado**. Lo único que falta es poder poner **dos líneas de texto con estilos distintos** (título grande con color propio, subtítulo chico) y encadenar varios fragmentos en una pieza. Puede que ya entre con lo que hay.
- **Molde C:** `letra-sobre-video`, modo letra, con la caja de texto corrida a la izquierda y más chica. Probablemente sean props que ya existen.
