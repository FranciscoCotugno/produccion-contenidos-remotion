# Lista numerada

## Identificación
- **Cuentas:** las 4 de recomendación de la grilla. Cubre dos verticales de una
  sola vez: **ranking** ("top 4 del mes") y **playlist por situación** ("temas
  para manejar de noche").
- **Sale como:** video.
- **Formatos:** 9:16 (1080×1920), 4:3 (1440×1080) y 1:1.
- **Cuadros por segundo:** los del clip de fondo; si el fondo es un color, 30.
- **Duración:** la suma de los recortes de audio de la lista (con 4 ítems de 7,5 s,
  unos 30 segundos).

## Qué es

**El videoclip del tema que suena**, un panel numerado pegado a un costado con
**los números puestos desde el primer cuadro**, y los nombres que **se completan de
a uno** a medida que suena cada tema. Arriba, una tarjeta de "sonando ahora" con la
portada, el título y el artista.

## El ranking es de un solo artista

Decisión de Cotu (2026-10-19): **las canciones del ranking son de un mismo
artista**, salvo que se pida lo contrario. Un top de un artista, no una playlist
mezclada.

Esto **destraba el molde**. La pregunta comercial que lo bloqueaba —de dónde salen
los temas de otros sellos para armar una playlist en una campaña paga— deja de
existir: el catálogo es el del cliente.

Las dos listas de prueba son de **cuatro artistas distintos**, y es a propósito: en
el repo no hay cuatro temas de un mismo artista. Sirven para probar la mecánica,
no son el caso de uso. **Para probarlo de verdad hace falta un catálogo con cuatro
temas de un artista.**

## Por qué funciona

Los números desde el principio **anuncian cuántos faltan**, y el que mira se queda
para ver qué cae en el número 1. No es el contenido de cada ítem lo que sostiene la
atención: es la lista completándose.

Las siete cuentas relevadas van de 76 mil a 574 mil likes.

## Va sin persona a cámara

Pedido de Cotu, y el relevamiento lo respalda: **cuatro de las siete referencias
tienen a alguien hablando, tres no, y las tres funcionan igual**. La cara ayuda
pero no es lo que hace funcionar el formato. Por eso el fondo es un clip o un
color, nunca una persona.

Esto es lo que destraba la vertical de recomendación, que estaba dada por
bloqueada.

## El dato que este molde necesita y los demás no

**Es el único que no trabaja sobre un tema.** Recibe una lista: varios temas, cada
uno con su nombre, su artista, su portada, **su propio recorte de audio** y **su
propio videoclip**.

## Cada tema muestra su videoclip

Pedido de Cotu (2026-10-19): mientras suena un tema se ve **su** videoclip, no un
fondo único para toda la pieza. Cada ítem trae su `video` (archivo y segundo de
inicio); si viene vacío, se usa el fondo general del molde.

### El problema de los cuadros por segundo, y por qué el ranking de un artista lo resuelve

Una pieza es **un solo archivo de video y tiene un solo fps**. Si los clips de la
lista no coinciden, los que no sean el elegido tienen que repetir o saltear
cuadros, y esos tramos se ven a tirones. Es el mismo problema que costó un día de
trabajo en la campaña de Maxi.

El molde elige **el fps que cubre más segundos de la pieza** y renderiza todo a
ese. No hay forma de evitarlo dentro de un mismo archivo.

En los temas de prueba conviven 25, 23,98 y 30 fps, justamente porque son cuatro
artistas distintos. **Con un ranking de un solo artista los clips vienen de la
misma entrega del sello y comparten fps, así que el problema no aparece.** Es otra
razón a favor de la regla de un solo artista.

### Cómo se guardan los datos

En `datos-prueba/listas/`, un archivo por lista (ver el `LEEME.md` de esa carpeta).
El esquema vive en `templates/lista-numerada/lista.ts`, **no en `shared/`**: es el
único molde que lo usa y la estructura común la decide Agustín (regla 7 del
`CLAUDE.md`).

**Esto no cambia nada del resto del repo.** `datos-prueba/<tema>/` sigue igual;
la carpeta de listas queda al lado y cada ítem apunta a los archivos de `assets/`
que ya están.

El orden del array es el del ranking: el primero es el número 1. En qué orden se
revelan lo decide el molde (`orden`), no los datos.

## El panel: por qué está en su propio archivo

`PanelLista.tsx` está separado del molde porque el mismo panel aparece en otro
formato relevado (la columna de verificación de
`assets/referencias/14-motivo/cuadro-checklist-sobre-persona.png`).

**No se movió a `shared/`** y es a propósito: hoy lo usa un solo molde, y
`CLAUDE.md` dice no armar arquitectura nueva sin pedido. Dejarlo en un archivo
aparte cuesta nada y, si aparece el segundo usuario, es mover un archivo, no un
refactor. Si nunca aparece, no sobra nada.

## El contorno es lo que lo hace legible

Los números van sobre un clip, así que llevan un contorno de ocho direcciones
(`panel.grosorContorno`), que es como TikTok despega su propio texto del video.
Sin contorno, sobre un fondo movido, la lista se pierde: está
`Comparar-Contorno-Sin` para verlo.

## Escalas: los números crecen con el ancho, la tarjeta no

Los números y nombres escalan con el ancho, que es lo que mantiene la legibilidad
en el celular en todos los formatos.

La tarjeta y el rótulo **no**: se topan en 1. Si crecieran con el ancho, en 4:3
(1440×1080) la tarjeta se comía la lista. Mismo criterio que `panel-letra`.

En los cuadros bajos (4:3 y 1:1) la columna además necesita más recorrido, porque
el cuadro es más corto y los números más grandes: por eso esos ejemplos llevan
`PANEL_BAJO` y `PANEL_CUADRADO`.

## Dónde cae el último ítem

Con 4 ítems repartidos hasta el 0,82 del alto, el último caía donde TikTok pone el
epígrafe y no se leía. El rango va hasta 0,72. Si se suben a 10 ítems hay que
revisarlo de nuevo.

## Qué es fijo y qué varía

- **Fijo:** la mecánica (números desde el principio, nombres que se completan, un
  recorte de audio por ítem).
- **Varía (props):** la lista entera; tipo de fondo, clip y su inicio, color y
  oscurecido; orden de revelación; del panel: lado, margen, rango vertical,
  tamaños, peso, color, contorno y su grosor, opacidad del pendiente y cuadros de
  entrada; de la tarjeta: mostrarla, alto, distancia al borde, color y rótulo; y si
  se muestra el rótulo de la pieza.

## Los textos los escribe una persona

El rótulo de la pieza ("TOP 4 DEL MES") **no sale de los datos**: es texto
editorial. Los de las dos listas de prueba son **de relleno** y están para que el
molde tenga algo que mostrar. Mismo caso que los hooks de `letra-sobre-video`.

## Para decidir en Studio

1. **Orden de revelación** (`Comparar-Orden-Al1` / `-Del1`). Hoy va del último al
   1, como el fotograma de referencia: el 1 queda para el final.
2. **Con tarjeta de "sonando ahora" o sin ella** (`Comparar-Tarjeta-Con` / `-Sin`).
3. **De qué lado va el panel** (`Comparar-Panel-Izquierda` / `-Derecha`).
4. **El contorno** (`Comparar-Contorno-Con` / `-Sin`).
5. **Color del panel** (`Comparar-Color-Amarillo` / `-Blanco`).
6. **Fondo:** clip o color liso (`ListaNumerada-FondoColor-9x16`).
7. **Cantidad de ítems:** las pruebas son de 4 porque hay 4 temas con portada,
   audio y videoclip en el repo. El esquema acepta de 2 a 10.
8. **Segundos por tema:** 5 en las pruebas (Cotu los bajó de 7,5 el 2026-10-19).
   Salen de los datos, no del molde: es `audio.end - audio.start` de cada ítem.

## Referencias

`assets/referencias/13-lista-numerada/` — el análisis y los dos fotogramas. El de
la tarjeta (`cuadro-lista-progresiva-con-tarjeta.png`) es la versión con persona:
de ahí salen las medidas del panel y de la tarjeta, no la persona.
