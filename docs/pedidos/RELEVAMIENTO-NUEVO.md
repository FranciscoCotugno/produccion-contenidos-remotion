# Cómo juntar una tanda de referencias nueva

Escrito el 2026-10-19, con lo que se aprendió de la tanda de octubre (55 videos,
14 carpetas, de donde salieron casi todos los moldes del repo).

## El reparto del trabajo

| Quién | Qué |
|---|---|
| **Una persona** | Elegir qué cuentas y qué videos. Esto no lo puede hacer Claude Code |
| **El script** | Bajarlos: `bajar-nuevas.ps1`, que lee `_nuevas.txt` |
| **Claude Code** | Mirarlos cuadro por cuadro, escribir el `ANALISIS.md`, sacar los fotogramas y proponer el molde |

**Por qué la elección no la puede hacer Claude Code:** lo que una cuenta está
rindiendo hoy vive adentro de la app de TikTok. No está indexado, no se busca
desde afuera y no se puede estimar. Elegir sobre lo que sí se ve desde afuera
daría una lista que parece una lista pero no lo es.

## Qué buscar

**Formatos que no tengamos.** El repo ya cubre: letra sobre video con siete
modos, panel de letra, reproductor de app, widget, los tres brats, chat,
tarjeta, carrusel, nota de celular, lista numerada y prensa. Si el video que
estás mirando es uno de esos con otros colores, no hace falta bajarlo.

**Lo que define a un formato es la mecánica, no la estética.** El color y la
tipografía son props; que las palabras se enciendan de a una, que una lista se
complete o que el fondo se parta en dos, no.

## Lo que se aprendió en octubre

**Mirá la mediana de la cuenta, no el video que te llamó la atención.** En la
tanda de octubre entró `@mis.rolitas.city` por un video de 251 mil likes, y la
mediana reciente de esa cuenta es de **2,5 mil vistas**. Un pico no es un
formato que funciona: es un pico.

**Tres cuentas haciendo lo mismo vale más que una con números altos.** El molde
más fuerte del relevamiento (`@v.jxnior`, `@omarmusicc_`, `@01.91.h`, mediana de
219 mil) se detectó porque eran tres, no por el número de una.

**Dos o tres videos por cuenta, no uno.** Con uno solo no se distingue qué es el
molde y qué es ese tema en particular. Con tres se ve qué se repite.

**Anotá el formato del cuadro.** Varias de las cuentas con mejores números
publican en 4:3, no en 9:16, y eso cambió una regla del proyecto.

**Los posteos de fotos hay que guardarlos a mano.** Si la url dice `/photo/` en
vez de `/video/`, la herramienta no los baja. Pasó en octubre con
`@mundo_canserbero` y por eso `09-carrusel` quedó sin material.

## Qué pasarme, en concreto

Llená `assets/referencias/_nuevas.txt` con una línea por video:

```
carpeta|cuenta|url
```

Y si podés, para cada cuenta: **la mediana de vistas** y **cuántos seguidores
tiene**. No es imprescindible, pero es lo que permite decidir qué construir
primero sin adivinar.

Con eso corro el script, miro todo y te traigo el análisis y la propuesta de
molde, que es como se trabajó en octubre.
