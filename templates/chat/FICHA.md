# Chat

> **Nota del 2026-10-17 (reglas generales).** Lo que esta ficha diga sobre **zona
> segura** quedó como registro de cómo se construyó el molde, **no como regla**.
> Hoy las composiciones van a sangre completa: la única precaución es la columna
> de botones de TikTok sobre el borde derecho, y solo en 9:16. La prop que antes
> se llamaba `safeZone` ahora es `franjaBotones` y solo prende una guía en Studio.
> Tampoco hay marca de agua en ningún molde, y un molde puede salir en varios
> formatos. Ver `CLAUDE.md`.


## Identificación
- **Cuentas:** C3 (chat de a dos, modo oscuro), R1 (chat claro con contador o racha), R3 (mensaje directo estilo Instagram).
- **Sale como:** video.
- **Dimensiones** (una por piel): **WhatsApp (C3, R1): horizontal, 1080×912** (la proporción de las referencias, 682×576; en TikTok se ve con bandas). **Instagram (R3): vertical, 1080×1920** (el reel compartido es una tarjeta alta). 30 fps.
- **Duración:** la del fragmento.
- **Punto de partida:** desde cero.
- **Componente:** `Chat.tsx` (motor y piel `whatsapp-oscuro`); ejemplos en `ejemplos.ts`; conversaciones de prueba en `datos-prueba/<tema>/chats.json`; fotogramas clave en `render/`.
- **Estado (2026-10-05):** construidas las dos pieles: WhatsApp oscuro (C3 y R1) e Instagram claro (R3). Falta decidir lo de "Para decidir en Studio".

## Qué es
Una conversación de mensajería donde alguien manda el tema. Se ve como algo que te mandó un amigo, no como una publicación.

**Es la captura de un chat real** (decisiones de Cotu, 2026-10-05): con la barra para escribir abajo, mis mensajes (verdes) a la izquierda y las respuestas a la derecha, pegados a los bordes del cuadro, y **sin reproductor de audio**. **Es fija:** la conversación entera está desde el primer cuadro, como una imagen, y lo único que se mueve es el video del sticker y el reproductor de audio (barra y contador, en sincro con el tema). El chat se dibuja en HTML, no con una imagen: así el texto sale perfecto y cada conversación nueva es cambiar datos. Las imágenes de chat generadas con IA se descartaron por ahora: son más realistas, pero suelen escribir mal el texto y la hora, y no hay garantía de que dejen el lugar del video (si se retoman, el lugar del video se marca a mano en Studio).

## Por qué funciona
Es el formato con más apariencia de contenido nativo. El texto pide una acción concreta (mandárselo a alguien, mantener una racha), y eso empuja a compartir.

## Criterio: idéntico a WhatsApp
Pedido de Cotu (anotado en `CLAUDE.md`): la piel oscura es **idéntica a WhatsApp en modo oscuro en iPhone**: diagramación, colores, proporciones e íconos. Sin logos, y lo que son archivos de la app o de terceros se reemplaza:
- **Patrón de fondo:** dibujos propios (nota, corazón, estrella, carita, nube, auriculares, celular, sol, rayo) con la densidad, el trazo y la opacidad del de la app.
- **Letra del sistema** (SF Pro, sin licencia para servidor): **Inter**.
- **Emojis:** **Noto Color Emoji**.
- **Ícono del audio:** el de la referencia es el círculo rosa de una app de música; acá es un círculo verde con una nota, o la portada del tema (`iconoAudio`).

**Medidas** (de `01-chat-racha.mp4`: 682 px de ancho = 390 pt de iPhone, 1,75 px por punto), en puntos: texto 17, hora 11, burbuja con esquinas de 17, margen al borde 16,6, 2 entre mensajes seguidos del mismo y 8 cuando cambia quien escribe, burbuja de texto de hasta 265 de ancho (con ese ancho la hora baja de renglón, como en la referencia), audio de 288 × 88, video-sticker de 175 × 127 sin burbuja con la hora en una pastilla aparte debajo.
**Colores medidos:** fondo `#070707`, burbuja recibida `#1C1E1D`, barra del audio `#2E302F`. De la app: burbuja enviada `#144D37`, tildes de leído `#53BDEB`.

## El motor: tipos de mensaje
Un solo motor con una lista de mensajes. Cada mensaje tiene un tipo, un remitente (yo o el otro) y un momento de aparición:

| Tipo | Cómo se ve |
|---|---|
| Texto | Burbuja con texto y hora |
| Audio | Burbuja con botón de pausa, barra que avanza en sincronía con el tema y contador de tiempo. Puede llevar la etiqueta "Reenviado" |
| Video | El videoclip suelto, **como un sticker** (sin burbuja), con la hora en una pastilla debajo. Opcional: palabras de la letra encima, en mayúscula (como la referencia 01) |
| Vista previa de link | Tarjeta del tema: portada, título y artista |
| Reacción | Un emoji sobre el mensaje anterior |
| Visto | Las tildes de mis mensajes pasan a celeste (leído), sin respuesta |
| Escribiendo | Burbuja con los tres puntos, durante `duracion` segundos |

Cada mensaje: `tipo`, `de` (`yo` a la derecha, `otro` a la izquierda), `t` (segundo en que aparece) y sus datos (`texto`, `reenviado`, `emoji`, `duracion`). En el texto, `{n}` se reemplaza por el contador. Mis mensajes se marcan leídos con el primer "visto", "escribiendo" o mensaje del otro.

## Pieles
- **C3, oscura:** fondo oscuro con patrón sutil de dibujos, burbujas de mensajería. Inspirada en las apps de mensajería, sin copiar ninguna.
- **R1, clara:** fondo claro con patrón. Estructura fija: texto del contador o la racha, audio reenviado, video y vista previa de link.
- **R3, mensaje directo:** diagramación de mensajes directos de una red social: el videoclip llega como un reel compartido, con un mensaje arriba, y después la respuesta. Sin logos.

## Diagramación
- **Formato horizontal 1080×912**, como las referencias. El ancho del cuadro es el ancho del iPhone: **escala 2,77 px por punto** (texto de 47 px, casi los 50 de `CLAUDE.md`; con 2,94 da 50).
- **Lados:** mis mensajes (verdes) a la **izquierda** y los del otro a la **derecha** (`ladoMio: "izquierda"`, pedido de Cotu; en R1, donde todo es del otro, van a la izquierda como en la referencia).
- **Ancho:** los mensajes van **pegados a los bordes del cuadro** con el margen de la app (`ancho: "cuadro"`). Ojo: los de la derecha quedan debajo de la columna de botones de TikTok (x > 925); `ancho: "zonaSegura"` los deja entre x 60 y 925 (`Comparar-Chat-AnchoZonaSegura`).
- **Barra para escribir** abajo, como la app (`barraEscribir`): "+", campo redondeado con el ícono de sticker, cámara y micrófono.
- **Ajuste al alto:** la conversación completa tiene que entrar arriba de la barra. Si no entra a la `escala` pedida, el molde la achica justo lo necesario (mide una copia invisible, una vez por pieza). Por eso en las conversaciones largas el texto queda por debajo de los 47 px.
- Burbuja de texto de hasta 320 pt (82 % de la pantalla, como la app): la hora va al lado del texto; si el texto llena el renglón, la hora baja (como en la app).

## Qué es fijo y qué varía
- **Fijo:** el diseño de cada piel, las tipografías y la hora de los mensajes.
- **Varía (props, `chatSchema`):** `tema` (fragmento, letra, título, artistas, portada), `piel`, `mensajes`, `n` (contador), `hora`, `cabecera` (`mostrar`, `nombre`, `estado`), `escala`, `iconoAudio` (`nota` / `portada`), `letraEnVideo`, `palabrasEnVideo` (3), `adelantoLectura` (3 cuadros), `animacion` (`fija` / `en-vivo`), `ladoMio` (`izquierda` / `derecha`), `ancho` (`cuadro` / `zonaSegura`), `barraEscribir`, `franjaBotones`. (`iconoAudio` queda para si vuelve el reproductor.)

## Modos
- **C3:** con respuesta ("escuchá esto y pensá en mí" → audio → video → "jaja justo la estaba escuchando") o en visto (el último mensaje queda sin respuesta).
- **R1:** contador ("Día {n} escuchando esto en loop", con {n} como prop) o racha ("Hoy la racha se activa con:").
- **R3:** compartido con mensaje, o solo el reel con una reacción en emoji.

## Tiempos y animación
- **Fija (por defecto, `animacion: "fija"`):** toda la conversación desde el cuadro 0. El "escribiendo…" no aparece; las tildes de mis mensajes están en su estado final (celestes si el otro los vio, reaccionó o respondió). Solo se mueven el video y el audio.
- **En vivo (`animacion: "en-vivo"`, para comparar):** cada mensaje entra en su `t` en 5 cuadros (la fila crece, el mensaje sube y aparece), con "escribiendo…" y tildes que pasan a leído; en C3 la respuesta cae al 60-65 % del fragmento. Composición `Comparar-Chat-EnVivo`.
- La barra y el contador del audio avanzan en sincro con el tema que suena.

## Tipografía
Inter para toda la interfaz (en lugar de la letra del iPhone). La letra sobre el video: TikTok Sans 900 al 75 % de ancho. Emojis: Noto Color Emoji.

## Zona segura
En 1080×912 las bandas de TikTok quedan fuera del cuadro: arriba y abajo no tapan nada. A la derecha, la columna de botones tapa desde x = 925: con `ancho: "cuadro"` los mensajes de la derecha (las respuestas en C3) quedan ahí abajo (ver `render/c3-respuesta-instinto-zona-segura.png`). Si en el celular se tapan, pasar a `ancho: "zonaSegura"`.

## Para decidir en Studio
Composiciones `Chat-<modo>-<tema>` (C3 con respuesta, C3 en visto, R1 contador, R1 racha; instinto-luv y Si sale el sol 1) y `Comparar-Chat-*`:
- Escala: `Comparar-Chat-Escala-Fiel` (2,77, por defecto) contra `Comparar-Chat-Escala-50px` (2,94).
- Ancho: `Comparar-Chat-AnchoZonaSegura` (contra los mensajes pegados a los bordes, por defecto).
- Animación: `Comparar-Chat-EnVivo` (contra la captura fija, por defecto).
- Cabecera con el nombre del contacto en C3: `Comparar-Chat-ConCabecera`.
- Letra sobre el video: sí o no, y en qué pieles (`letraEnVideo`).
- Piel de R1: hoy usa la oscura (como las referencias); la grilla decía clara.
- Momento de la respuesta en C3 (en `chats.json`).

## Piel R3: mensaje directo (Instagram claro)
Idéntica a un mensaje directo de Instagram en modo claro en iPhone, con el mismo criterio que WhatsApp (sin logos, sin el ícono de Reels, sin el @ del artista):
- **Cabecera** arriba del cuadro: flecha, avatar con la inicial, nombre ficticio (prop) y "Activo(a) ahora"; llamada y video a la derecha.
- **Reel compartido** (`tipo: "reel"`): tarjeta vertical de 200 × 356 pt con esquinas de 16, el clip reproduciéndose y abajo "♪ título · artista". Con `letraEnVideo`, las palabras de la letra encima.
- **Burbujas** muy redondeadas (22 pt): las mías con el degradé violeta-azul y letra blanca, las del otro en gris claro `#EFEFEF`. Sin hora en cada mensaje (Instagram no la muestra).
- **Reacción:** emoji en una pastilla gris pegada abajo de la burbuja.
- **Barra de mensaje** abajo del cuadro: cámara en círculo azul, "Mensaje...", micrófono, galería y sticker.
- **Lados:** mis mensajes a la izquierda (como en C3); así el reel no cae debajo de los botones de TikTok.
- **Formato vertical** (1080×1920): la cabecera queda debajo de las pestañas de TikTok y la barra debajo del caption (son decorativas). La conversación se apoya abajo, sobre y = 1470 (el límite de la zona libre), como en la app.
- Modos (de `textos.txt`): **compartido con mensaje** (`r3-compartido`: el reel, mi mensaje, la respuesta y una reacción) y **solo el reel** con una reacción (`r3-solo-reel`). Composiciones `Chat-R3-Compartido-<tema>` y `Chat-R3-SoloReel-<tema>`.
- Ojo: en `textos.txt` la reacción va después de la respuesta del otro, así que queda sobre su propio mensaje. Si tiene que ir sobre el reel, se cambia el orden en `chats.json`.

## Falta
- **Se repite con otros moldes:** si la letra sobre el video necesita encajarse midiendo, esperar la tipografía y medir (como en `reproductor-app` y `brat-puro`). Hoy no mide: son las últimas 3 palabras, que entran en el sticker.

## Referencias
Ver `referencias/chat/REFERENCIAS.md`.
