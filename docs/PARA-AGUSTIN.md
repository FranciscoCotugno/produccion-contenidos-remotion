# Para el Claude de Agustín — moldes del laboratorio

Escrito el 2026-10-27 desde `FranciscoCotugno/produccion-contenidos-remotion`
(el laboratorio donde Cotu y Claude diseñan los moldes).

Hay **dos ramas listas para PR** en `Agusschenfelt/automatizacion-kioscos`:

- `molde/panel-letra`
- `molde/letra-sobre-video`

Las dos pasan `npx tsc --noEmit` y `npm run check:template`. Lo que sigue es lo
que no se ve en el diff.

---

## 1. Lo que trae cada rama

### `molde/panel-letra` — molde nuevo

El panel de letra abierto de una app de música. Toda la letra en pantalla, la
que suena nítida y las de alrededor atenuadas **según la distancia**, con la
columna subiendo para que la activa quede siempre a la misma altura.

**No lee ningún archivo de datos: le alcanza con `tema.json`.** Entra derecho a
la tubería automática.

**2 piezas por fragmento**, una por piel: `desenfoque` (la portada muy
desenfocada de fondo, las inactivas se desenfocan además de atenuarse) y `liso`
(color liso, las inactivas sólo se transparentan). Se ven claramente distintas
en el primer cuadro.

`check:template`: 10 piezas, 10 válidas, 0 fallas.

### `molde/letra-sobre-video` — de 1 a 6 piezas con la letra sola

El modo `letra` es el único de los cuatro que no necesita texto escrito, así que
es el único que entra a la tubería. Daba **una** pieza. Ahora da **seis**, con
dos ejes de los que la guía acepta:

| Eje | Valores | Qué es, según la guía |
|---|---|---|
| `virado` | ninguno, sepia, frío | fondo |
| `revelado` | línea, palabra por palabra | animación |

Los otros tres modos siguen dependiendo de `videos.json` y dan una pieza cada
uno. `check:template`: 38 piezas, 38 válidas, 0 fallas.

**Quedaron ejes afuera a propósito**, aplicando las reglas del 2026-10-26:

- Las **mayúsculas**, porque la guía dice que no cuentan.
- Las **partículas** y el **halo de color**: cambian demasiado poco.
- La **altura del subtítulo** (centro contra pie): ésta **sí** se ve distinta y
  es composición, o sea un eje válido. Se dejó afuera para no triplicar de una.
  Sumarla llevaría el modo `letra` de 6 a 12.

---

## 2. Los cambios fuera de `src/templates/`, que el servidor no instala solo

Son tres y están todos en la rama de `letra-sobre-video`.

### `src/shared/fpsFuente.ts` — archivo nuevo

Lee los cuadros por segundo del archivo de video y arma la metadata con ellos.

**Por qué importa.** La duración estaba clavada en 30 fps. Renderizar un clip de
25 fps a 30 obliga a repetir cuadros, y el fondo sale a tirones mientras el
texto va fluido. En la campaña de Maxi Espindola costó un día entero encontrarlo:
se probaron cinco hipótesis equivocadas antes de dar con ésta. Pasó en 31 piezas.

Trae además que **si el clip es más corto que el audio, manda el clip**: antes
mandaba el audio y el video se quedaba congelado en el último cuadro.

### `areaDelCuadro` en `src/shared/SafeZone.tsx` — agregado, no reemplaza nada

Devuelve el cuadro entero. `safeArea` queda igual para los moldes que todavía la
usan.

**Por qué.** Cotu eliminó la zona segura el 2026-10-14 y lo confirmó en las
reglas generales del 17: **las composiciones van a sangre completa**. La caja
vieja dejaba el contenido en el 55 % de un 9:16, empujado arriba y a la
izquierda, y no quedaba bien.

Lo único que se cuida hoy es la columna de botones sobre el borde derecho, y
sólo en 9:16. En 4:3 o 1:1 el epígrafe y los botones caen sobre las bandas
negras: ése es uno de los motivos para no hacer todo en 9:16.

**Esto afecta a todos los moldes del repo, no sólo a los de estas ramas.** Los
demás siguen usando `safeArea` y por eso siguen con el encuadre viejo.

### `conEmoji` en `src/fonts.ts`

Suma Noto Color Emoji como respaldo de una familia, para textos que mezclan
letras y emojis. Sin eso el emoji cae en el del sistema operativo, que no es de
licencia abierta. **`src/fonts.ts` sí está en la lista que el servidor instala
solo**, así que esto no necesita trabajo a mano.

---

## 3. Dos convenciones del repo que no están escritas y cuestan descubrir

**`pieza.ts` no puede importar de `ejemplos.ts`.** El generador carga `pieza.ts`
con el runtime de Node, que no resuelve imports sin extensión ni sabe leer
`.tsx`. Por eso `brat-puro` tiene su `constantes.ts`. Los dos moldes de estas
ramas siguen el mismo patrón: las constantes compartidas viven en un módulo
plano, sin React ni Remotion, con la extensión escrita en cada import.

**`safeZoneOff` hay que tomarlo de `src/shared/safe-zone-off.ts`**, no de
`SafeZone.tsx`, por lo mismo.

**En Node 22.15 los scripts `.mts` no corren solos.** `npm run check:template`
falla con `ERR_UNKNOWN_FILE_EXTENSION`. Se arregla con
`node --experimental-strip-types scripts/check-template.mts <id>`. En Node 23+
no hace falta.

---

## 4. Lo que quedó en el laboratorio y no se subió

| Molde | Por qué no |
|---|---|
| `lista-numerada` | Necesita **varias canciones** y un rótulo escrito. Un pedido del panel es una sección de una canción, así que no hay con qué armarlo |
| `prensa` | Necesita un titular editorial escrito a mano. Cotu además lo encajonó |
| `festival` | Es un pedido propio del Festival Generación, no de la grilla. Necesita hooks y una mosca específica |
| `bloque-palabra` | Cotu lo dio de baja el 18/10 después de ver el video |

Los cuatro están terminados y funcionan; no entran por lo que pide la tubería,
no por calidad.

### Y algo que conviene saber

**`karaoke` figura como terminado en el repo del laboratorio pero Cotu lo dio de
baja el 2026-10-17**: *"el template de karaoke no va más"*. No le gustó el
efecto de los subtítulos rellenándose. Es la misma objeción que después hundió a
`bloque-palabra`. Si en este repo `karaoke` sigue activo en los pedidos,
conviene confirmarlo con Cotu antes de seguir usándolo.

---

## 5. Los 10 moldes que ya están acá y divergieron poco

Medido en líneas de los `.tsx`:

| Molde | Diferencia |
|---|---|
| `brat-maximal` | +42 |
| `brat-puro`, `brat-minimal`, `karaoke`, `chat`, `brat-color`, `nota-celular` | entre +1 y +5 |
| `carrusel`, `tarjeta-letra` | 0 |
| `reproductor-app`, `reproductor-widget` | −5 y −6 |

Casi todo lo que cambió en el laboratorio son **valores elegidos por Cotu
mirando en Studio**, que viven en `ejemplos.ts` y no en el componente. Los que
valen la pena traer:

- **`reproductor-app`**: la fila de letra se parte en **tramos cortos**
  (`anchoLinea` 0,62) en vez de usar todo el ancho. Cotu lo eligió el 19/10. El
  modo palabra por palabra existe pero **no es el de producción**: recentra la
  fila con cada palabra y por eso se ve automático.
- **`tarjeta-letra`**: portada en 320 (bajó de 376) y, en C9, el color de fondo
  sale **del tema** y no del automático, que daba un marrón barroso sin relación
  con la portada.
- **`chat`**: escala 2,94 en vez de 2,77. Hay un choque entre dos reglas del
  proyecto —"las interfaces son idénticas a las de la app" contra "texto de 50 px
  o más"— y Cotu resolvió a favor de la legibilidad.
- **`brat-color`**: destello `invertir`, elegido el 19/10 sobre `siguiente`.
- **`reproductor-widget`**: las tres pieles quedan y **se eligen por pieza**, no
  por cuenta. Cotu: *"me gustan todas, depende 100 % del mood de la canción y la
  imagen de fondo"*.

Ninguno de esos suma piezas: son correcciones de cómo se ve.

---

## 6. Una observación sobre tipografías

`src/fonts.ts` registra **Sk-Modernist** y **Arial Narrow**. En el laboratorio
las dos están explícitamente fuera por licencia (junto con Comic Sans): el
`CLAUDE.md` pide que cada tipografía cubra uso comercial en video e imagen,
instalación en el servidor de render y uso compartido con el equipo.

No las toqué porque no es mi repo, pero conviene revisarlo antes de que entren
en un molde de producción.

---

## 7. Qué falta hacer

1. **Abrir los dos PR.** Las ramas están pusheadas; falta la descripción, que
   sale de los mensajes de commit de cada una.
2. **Decidir los tres cambios de `src/shared/` y `src/fonts.ts`** del punto 2.
   Los dos primeros los instala Agus a mano.
3. **Si querés más piezas de `letra-sobre-video`**, sumar la altura del
   subtítulo como tercer eje: lo lleva de 6 a 12 por fragmento.
