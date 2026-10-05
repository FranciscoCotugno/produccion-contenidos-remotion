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

1. Cada template tiene su propio formato de video (9:16 de 1080×1920, 1:1 de 1080×1080 u otro), el que pide ese formato: no hay uno por defecto. Se declara en su ficha y en su composición. Siempre a 30 fps. Remotion 4.0.529, versión fija.
2. Todo lo variable (textos, tiempos, colores, imágenes, video, audio) entra como prop, con su esquema declarado. Nada de textos ni rutas de un tema escritos dentro del componente.
3. La duración sale de los datos: inicio y fin del fragmento.
4. Tipografías y assets solo con licencia que cubra el uso real: uso comercial en video e imagen, instalación en el servidor de render y uso compartido con el equipo. Las de licencia abierta cumplen todo; las pagas sirven si su licencia lo cubre. Cada asset se registra en `assets/LICENCIAS.md`.
5. Respetar la zona segura de TikTok, aplicada sobre cómo se ve el formato final en la app (guía en `shared/SafeZone`).
6. Reusar lo que ya existe en `shared/` (formato de letra, tipografías, efectos), pero no armar arquitectura nueva: la estructura común la decide Agustín. Si algo se repite entre templates, se anota en la ficha.

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
- **Legible en un celular.** Texto principal de 50 px o más, texto secundario de 32 px o más, siempre con contraste suficiente contra el fondo.
- **El tema identificado.** Si el formato lo permite, título y artista visibles (tarjeta o reproductor): quien mira tiene que saber qué buscar.
- **Nativo, no publicitario.** Tiene que parecer contenido de un usuario. Las interfaces (reproductores, notas) se inspiran en apps reales, sin logos ni copias exactas. **Excepción, pedida por Cotu: el chat es idéntico a WhatsApp** (diagramación, colores, proporciones, íconos). Igual, sin logos, y los elementos que son archivos de la app o de terceros (patrón de fondo, tipografía del sistema, emojis) se reemplazan por equivalentes propios o con licencia abierta.
- **En los formatos de mood** (paisajes, POV, fondos), intervención mínima: una línea de texto o una tarjeta chica, nada más.
- **Pensar en el loop.** Si el final empalma bien con el principio, la pieza se mira más de una vez.

## Zona segura de TikTok

En un 9:16 (1080×1920), la interfaz de TikTok tapa aproximadamente:

- **Arriba:** 150 px (pestañas y estado).
- **Abajo:** 450 px (caption, sonido y barra de navegación).
- **Derecha:** 155 px (botones de like, comentarios, compartir).
- **Izquierda:** 60 px de margen.

Nada importante (letra, título, tarjeta) puede quedar en esas zonas. Las medidas son aproximadas: la guía `shared/SafeZone` se calibra con una captura real de TikTok superpuesta, y se prende y apaga desde Studio.

En formatos que no son 9:16 (por ejemplo 1:1), TikTok los muestra con bandas arriba y abajo: la zona segura se aplica sobre el cuadro final tal como se ve en la app.

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
- Respeta la zona segura.
- Todo lo variable es prop, con su esquema declarado.
- Usa solo assets con licencia verificada para el uso real, registrados en `assets/LICENCIAS.md`.
- Tiene su `FICHA.md` completa y un render de ejemplo exportado.

## Assets disponibles

- **Tipografías (licencia abierta):** TikTok Sans, Fraunces, Geist, Ronzino, AKONY, Archivo Narrow (la angosta para Brat), Arimo (alternativa a Arial, mismas métricas), Inter (en lugar de la letra del iPhone, para interfaces de apps), Noto Color Emoji (emojis).
- **Datos de prueba:** Agua, Si sale el sol (dos versiones) y A quién le importa, con letra y tiempos por palabra.
- **Efectos heredados:** grano, polvo, halación, temblor de cuadro, golpe al ritmo.

## Renders

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
