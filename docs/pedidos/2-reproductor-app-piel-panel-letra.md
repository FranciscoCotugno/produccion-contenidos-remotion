# Pedido 2 para Claude Code: pieles `panel-letra` de `reproductor-app`

**Reemplaza al pedido anterior con este nombre.** El anterior se escribió antes de que se eliminara la zona segura y tenía una sección entera que ya no aplica.

Leé primero `docs/pedidos/REGLAS-GENERALES.md`, después `templates/reproductor-app/FICHA.md`, `PielApple.tsx` y `ejemplos.ts`. **Proponé un plan antes de escribir código.**

## Qué es y por qué no es un molde nuevo

La ficha de `reproductor-app` describe **la pantalla de reproducción**: tarjeta centrada con portada cuadrada, barra de progreso y controles, con una fila de letra arriba.

Esto es **otra pantalla de la misma app**: el panel de letra abierto. No hay tarjeta, no hay controles, no hay barra. La letra ocupa toda la pantalla.

Comparte todos los datos de entrada con el molde (portada, título, artista, letra sincronizada, fragmento), así que entra como **piel nueva**, no como molde aparte. Si al ver el código te parece que la columna fuerza demasiado la estructura, decilo en el plan.

## Son dos pieles hermanas, y van juntas

| | Piel A: portada desenfocada | Piel B: color liso |
|---|---|---|
| Carpeta | `assets/referencias/03-portada-blureada/` | `assets/referencias/08-spotify/` |
| Fondo | La portada del tema, muy desenfocada y oscurecida, conservando su color | Color liso tomado de la portada |
| Diferencia activa / inactiva | **Desenfoque** creciente con la distancia | **Opacidad**: las no cantadas al 40-50 % |
| Tamaño de letra | Grande: entran 5 a 7 líneas | Medio: entran 8 a 10 líneas |
| Encabezado | Portada chica + título + artista + botón redondo | Mínimo: galón y título centrado |

La estructura es idéntica (lista de líneas, desplazamiento, línea activa). Lo que cambia es el tratamiento. Construirlas juntas sale casi gratis; construir solo una y volver después, no.

## La mecánica, que es lo único realmente nuevo

Todas las líneas de la letra están en pantalla al mismo tiempo, **con el mismo tamaño y el mismo peso**. La que suena está nítida y en blanco puro. Las de arriba y las de abajo están atenuadas, y el efecto **aumenta con la distancia** a la línea activa. No hay palabra resaltada, no hay cambio de color, no hay karaoke.

La columna **se desplaza hacia arriba** a medida que avanza el tema, de modo que la línea activa queda siempre a la misma altura.

Es fácil de hacer mal: si el desenfoque (o la opacidad) es parejo en vez de progresivo, se pierde la profundidad y queda sucio.

## Medidas de la piel A

Medidas tomadas de un cuadro a 1080×1920 de `@lyrics.elpipon`. Son punto de partida, no verdad revelada.

**Encabezado**

| Elemento | x | y | Notas |
|---|---|---|---|
| Portada chica | 85 – 300 | 182 – 378 | ~200 px de lado, esquinas redondeadas ~28 px |
| Título | desde 320 | ~250 – 290 | ~48 px, negrita, blanco |
| Artista | desde 320 | ~305 – 340 | ~42 px, normal, blanco al ~70 % |
| Botón redondo | centro 945 | centro 288 | ~88 px de diámetro, blanco al ~20 % |

**Columna de letra**

- Caja de texto de x=85 a x=950 (~865 px de ancho). Con la zona segura eliminada, **esa medida ahora se puede respetar tal cual**.
- Línea de ~78 a 84 px, negrita. Mismo tamaño y peso para activa e inactivas.
- Interlineado ~105 px. Entre bloques, aproximadamente una línea de alto.
- Bloque activo centrado alrededor de y=790.
- Inactivas: opacidad 45 a 55 %, con desenfoque creciente.

**Piel B:** mismo esquema con el texto más chico, alineado a la izquierda, encabezado mínimo, y los interludios instrumentales marcados con un símbolo de nota musical en una línea propia.

## Reglas generales que aplican acá

- **Sin marca de agua.** Las dos referencias tienen una; va afuera.
- **Varios formatos de salida.** Las medidas de arriba son de 1080×1920; hay que resolver cómo se reacomoda la columna en 1:1 y 3:4.
- **Sin zona segura.** Las líneas que todavía no sonaron pueden caer donde caigan: están atenuadas y son textura, no información. La única precaución es no dejar la línea activa bajo la columna de botones de la derecha.
- Las dos referencias reproducen bastante de cerca la interfaz de una app real. Vale lo que ya dice la ficha: códigos visuales, **sin logos ni nombres de marca**, con íconos y tipografía propios.

## Qué tiene que entrar por prop

Intensidad del desenfoque y del oscurecimiento del fondo; cantidad de líneas visibles arriba y abajo de la activa; desenfoque y opacidad máximos de las inactivas y cómo crecen con la distancia; altura donde se ancla la línea activa; mostrar u ocultar el encabezado.

## Decisiones para Cotu en Studio

1. **Desplazamiento de la columna:** continuo o a saltos al cambiar de línea. En la referencia parece a saltos, con transición corta.
2. **Cantidad de líneas a la vista.**
3. **Curva del desenfoque:** cuánto tiene la vecina inmediata. Decide si se lee como profundidad o como suciedad.
4. **Tipografía.** Acá la letra es el 90 % de la pantalla. Recordá que hay sellos (FMK, Sony) que exigen Arial o TikTok Sans.
5. **Encabezado sí o no**, y si el botón redondo aporta o es ruido.

## Criterio de terminado

El de `CLAUDE.md` con las reglas generales encima. Renderiza con al menos 2 temas sin tocar código, las dos pieles funcionan, todo lo variable es prop con su esquema, la ficha queda actualizada, y hay un render de ejemplo con una portada en color y otro con una en blanco y negro, que es donde se nota si el fondo está bien resuelto.
