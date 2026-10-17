# Laboratorio de templates

## Propósito

Este proyecto es un laboratorio: acá se diseñan y prueban templates de referencia para los formatos de contenido de TikTok (lyrics, reproductores, chats, carruseles, etc.). No es el sistema de producción: la estructura final y la integración las arma Agustín en otro repositorio. Lo que sale de acá es la referencia que él implementa: cómo se ve cada formato, cómo se mueve, qué varía y con qué criterio.

La prioridad es que el resultado se vea y se sienta bien en TikTok, por encima de la elegancia del código.

## Qué se entrega por template

Cada template terminado vive en `templates/<molde>/` y tiene:

- El componente de Remotion funcionando.
- Datos de ejemplo con los que renderiza: al menos 2 temas distintos.
- Un render de ejemplo exportado (video o imágenes).
- `FICHA.md`: qué formato es y para qué cuenta, por qué funciona, qué es fijo y qué varía, reglas de tiempo y animación, referencias de TikTok.
- Los assets que usa (tipografías, texturas, elementos de interfaz) en `assets/`, cada uno con su licencia.

## Reglas mínimas

1. **No hay un formato único de salida** (reglas generales, 2026-10-17): un molde sale en varios, como ya hace `letra-sobre-video` (9:16, 1:1 y 3:4). El relevamiento de octubre lo respalda: de las cuentas con mejores números, la mayoría **no publica en 9:16** sino en 4:3 o 16:9, y deja que TikTok ponga las bandas. Cada molde declara sus formatos en su ficha y en su composición; se le suman a medida que se trabaja ese molde, no todos de golpe. **Los cuadros por segundo salen del video de fondo, no se eligen**: la composición se renderiza al fps de su material (25 si el videoclip es de 25, 30 si es de 30), y una pieza sin video va a 30. Lo resuelve solo `metadataDeFragmento` de `shared/fpsFuente.ts`, que lee el fps del archivo; ningún molde escribe un fps a mano. Renderizar a un fps distinto al de la fuente obliga a repetir o saltear cuadros y el fondo sale a tirones. Remotion 4.0.529, versión fija.
2. Todo lo variable (textos, tiempos, colores, imágenes, video, audio) entra como prop, con su esquema declarado. Nada de textos ni rutas de un tema escritos dentro del componente.
3. La duración sale de los datos: inicio y fin del fragmento.
4. Tipografías y assets solo con licencia que cubra el uso real: uso comercial en video e imagen, instalación en el servidor de render y uso compartido con el equipo. Las de licencia abierta cumplen todo; las pagas sirven si su licencia lo cubre. Cada asset se registra en `assets/LICENCIAS.md`.
5. **No hay zona segura: las composiciones van a sangre completa** y el texto puede llegar al borde si el diseño lo pide (`areaDelCuadro()` devuelve el cuadro entero). La caja vieja obligaba a márgenes que quedaban mal y empujaban todo al centro. **La única precaución que queda es la columna de botones de TikTok sobre el borde derecho**: conviene no poner ahí algo que haya que leer. Es un borde, no una caja. El pie de pantalla no se cuida con márgenes sino **eligiendo el formato**: en 4:3 o 1:1 el epígrafe y los botones caen sobre las bandas negras y no sobre la pieza. La guía `shared/FranjaBotones` marca esa franja en Studio (apagada por defecto).
6. **Ningún molde lleva marca de agua**: ni `@usuario`, ni logotipo, ni firma. Las cuentas de referencia casi todas tienen una y por eso aparece descrita en `assets/referencias/*/ANALISIS.md`: eso es descripción de la referencia, no especificación.
7. Reusar lo que ya existe en `shared/` (formato de letra, tipografías, efectos), pero no armar arquitectura nueva: la estructura común la decide Agustín. Si algo se repite entre templates, se anota en la ficha.

## Datos de entrada comunes

- **Letra:** `Line = { end, words: Word[] }`, `Word = { t, text }`. Tiempos en segundos desde el inicio del fragmento. Las palabras se muestran tal cual están en la letra: nunca se les agregan vocales ni letras para "estirar" una nota sostenida.
- **Tema:** título, artistas, portada, colores.
- **Fragmento:** archivo de audio o video, inicio, fin.

## Criterio de contenido

Lo que hace que un formato funcione. Aplica a todos los templates.

- **La cuenta es el formato; el tema es el contenido.** Un template es una plantilla visual fija con 2 o 3 modos de texto. Nunca un diseño distinto por tema.
- **Cada formato se distingue de los demás en el primer segundo.** La variedad que importa es visual y de estructura, no de texto.
- **Algo pasa desde el primer cuadro.** Nada de arrancar con pantalla vacía ni con fundidos largos desde negro: un fundido de entrada no dura más de 6 cuadros.
- **El ritmo manda.** Los cambios de texto caen con la voz o con el beat. Una letra desfasada es lo primero que se nota y arruina la pieza.
- **Legible en un celular.** Texto principal de 50 px o más, texto secundario de 32 px o más, siempre con contraste suficiente contra el fondo. Excepciones pedidas por Cotu, ambas a propósito: `brat-minimal` lleva la letra chica como su referencia, y el **modo subtítulo fino** de `letra-sobre-video` va a 33 px, medido sobre su referencia, porque respetar el mínimo rompe el formato.
- **El tema identificado.** Si el formato lo permite, título y artista visibles (tarjeta o reproductor): quien mira tiene que saber qué buscar.
- **Nativo, no publicitario.** Tiene que parecer contenido de un usuario. **Las interfaces (chats, reproductores, tarjetas, notas) son idénticas a las de la app que imitan** (pedido de Cotu): diagramación, colores, proporciones e íconos. Sin logos ni nombres de marca, y los elementos que son archivos de la app o de terceros (patrón de fondo, tipografía propia de la app, emojis) se reemplazan por equivalentes propios o con licencia abierta.
- **En los formatos de mood** (paisajes, POV, fondos), intervención mínima: una línea de texto o una tarjeta chica, nada más.
- **Pensar en el loop.** Si el final empalma bien con el principio, la pieza se mira más de una vez.

## La franja de botones de TikTok

Lo único que hay que cuidar del borde. En una pieza 9:16 (1080×1920), la columna
de botones de la app (like, comentarios, compartir) tapa unos **155 px sobre el
borde derecho**. No conviene poner ahí algo que haya que leer.

En los demás formatos no hay nada que cuidar: en 4:3, 1:1 o 16:9 la app muestra
la pieza con bandas negras arriba y abajo, y tanto los botones como el epígrafe
caen sobre esas bandas. Ese es uno de los motivos para no hacer todo en 9:16.

La guía `shared/FranjaBotones` pinta esa franja sobre cualquier composición para
revisarla en Studio; arranca apagada, así nunca sale en un render. Se calibra con
una captura real de TikTok en `assets/safezone/`. En un formato que no sea 9:16
no pinta nada, y eso es correcto.

## Estructura del proyecto

```
laboratorio/
├── CLAUDE.md
├── templates/<molde>/     ← un molde por carpeta: componente,
│                            FICHA.md, datos de ejemplo y render
├── shared/                ← formato de letra, tipografías, efectos,
│                            SafeZone
├── assets/                ← tipografías, texturas, elementos de
│                            interfaz, con LICENCIAS.md
├── referencias/<molde>/   ← capturas y videos de TikTok de cada molde
└── datos-prueba/          ← temas de prueba: letra, beats, portada,
                             datos del tema
```

Cada template es un molde que puede servir a varias cuentas de la grilla. Los moldes se nombran por formato (`reproductor-app`, `brat-puro`, `chat`, etc.) y su ficha dice qué cuentas cubre. El índice de moldes, con el orden de construcción, está en `templates/README.md`. El audio y los videos de prueba no se suben al repo: viven en `assets/media/` (ignorada por git) y se referencian por ruta.

## Cómo se trabaja un template nuevo

1. **Antes de construir:** leer la `FICHA.md` del molde (si no existe, escribirla primero con Cotu) y mirar todo lo que hay en `referencias/<molde>/`, empezando por su `REFERENCIAS.md`. Se construye un molde por vez, en el orden de `templates/README.md`.
2. **Proponer un plan:** qué piezas de `shared/` se usan, qué props va a tener el template y qué hay que construir. No escribir código hasta que el plan esté aprobado.
3. **Construir** y dejar el template abierto en Studio con los datos de prueba.
4. **Iterar con Cotu sobre lo visual:** proporciones, tiempos, colores, animaciones. Cambios concretos y chicos, uno por vez.
5. **Cerrar:** exportar el render de ejemplo (fotogramas clave, ver "Renders") y completar la ficha.

## Criterio de terminado

Un template está terminado cuando:

- Renderiza con al menos 2 temas de prueba distintos sin tocar código.
- Nada que haya que leer cae bajo la franja de botones, si la pieza es 9:16.
- Todo lo variable es prop, con su esquema declarado.
- Usa solo assets con licencia verificada para el uso real, registrados en `assets/LICENCIAS.md`.
- Tiene su `FICHA.md` completa y un render de ejemplo exportado.

## Assets disponibles

- **Tipografías (licencia abierta):** TikTok Sans, Fraunces, Geist, Ronzino, AKONY, Archivo Narrow (la angosta para Brat), Arimo (alternativa a Arial, mismas métricas), Inter (en lugar de la letra del iPhone, para interfaces de apps), Noto Color Emoji (emojis).
- **Datos de prueba:** Agua, Si sale el sol (dos versiones) y A quién le importa, con letra y tiempos por palabra.
- **Efectos heredados:** grano, polvo, halación, temblor de cuadro, golpe al ritmo.

## Renders

- **Claude Code puede construir, renderizar un cuadro, mirarlo y corregir solo.** Un `.png` se abre y se ve; un `.mp4` no. Conviene usarlo en vez de esperar una ronda de revisión por cada ajuste intermedio.
- **No renderizar videos** (`npx remotion render`) salvo que Cotu lo pida explícitamente.
- Para revisar o mostrar un molde: dejarlo abierto en Studio. Si hace falta mostrar algo, generar solo fotogramas con `npx remotion still`: de 4 a 6 cuadros clave, en `templates/<molde>/render/`.
- Nunca dejar un `remotion render` corriendo en segundo plano.

## Comandos

- Abrir Studio: `npx remotion studio`
- Renderizar una imagen fija (fotograma clave): `npx remotion still <id> templates/<molde>/render/<nombre>.png --frame=<n>`
- Renderizar un video (solo si Cotu lo pide): `npx remotion render <id> out/<id>.mp4`
- Tiempos por palabra de la letra de un tema de prueba (texto de `letra.txt`, tiempos de Whisper): `npm run tiempos -- <tema>`. Opciones: `--audio <archivo>` (por ejemplo, la voz separada), `--sin-prompt`, `--fresh`.

## Qué no hacer

- No escribir textos, rutas ni datos de un tema dentro de un componente.
- No usar tipografías ni assets sin verificar que su licencia cubra el uso real. Hoy quedan afuera Arial Narrow, Sk-Modernist y Comic Sans.
- No armar arquitectura nueva ni refactorizar `shared/` sin pedido: la estructura final la decide Agustín.
- No dar un template por terminado sin probarlo con un segundo tema.
