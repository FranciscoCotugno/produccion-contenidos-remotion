# Qué dejar en esta carpeta — pedido Fenix / Maluma

## Cómo funciona, en corto

1. **Vos tirás todo acá**: videos y audios, sin ordenar nada.
2. **Yo miro todo y lleno `pedido.txt`** con una propuesta: una línea por pieza,
   diciendo qué video va con qué tema y de qué tipo es.
3. **Vos corregís lo que no te guste** en ese archivo.
4. Yo renderizo.

Así vos solo decidís, no escribís. El formato de `pedido.txt` está explicado
adentro del archivo.

**Regla por omisión: un video, una pieza.** Un mismo clip no se repite con
varios temas salvo que lo pongas dos veces.

## Los videos

Tiralos acá con el nombre que tengan. No hace falta renombrarlos ni ordenarlos:
yo los inventario (duración, resolución, si traen texto quemado de TikTok, de
qué cuenta son) y te paso la lista.

## Los audios

Dejalos acá nomás, en `assets/media/maluma-fenix/`.

**El nombre tiene que decir de qué tema es.** Si los tres son partes del mismo
tema, numeralos:

```
felices-los-4-1.mp3
felices-los-4-2.mp3
felices-los-4-3.mp3
```

Si son tres temas distintos, uno por nombre:

```
felices-los-4.mp3
borro-cassette.mp3
corazon.mp3
```

Sirve cualquier formato: mp3, m4a, wav.

## La letra

Un archivo de texto por tema, al lado de los audios:

```
letra-felices-los-4.txt
```

Adentro, **la letra tal cual se canta, una línea por renglón**, sin tiempos y
sin nombres de sección:

```
Ella tiene dueño
Pero yo igual la invité
Sabía que tenía novio
Pero me hice el que no sé
```

**Importante:** el texto de la letra se usa tal cual. El programa escucha el
audio y le pone el tiempo a cada palabra, pero **las palabras salen de este
archivo**, no de lo que entienda la máquina. Por eso tiene que estar bien
escrito y coincidir con lo que se canta.

Si la parte que mandaste es solo el estribillo, alcanza con la letra de esa
parte. Si mandás la letra completa, mejor: yo recorto.

## Lo que no hace falta

- No hace falta cortar el audio al segundo exacto: yo recorto.
- No hace falta marcar los tiempos: eso lo saca el programa.
- No hace falta portada ni colores: para este formato no se usan.
