# Pedido para Claude Code: molde `chat`

Siguiente molde del índice, después de `brat-puro`. Cubre C3, R1 y R3 con **un solo motor de mensajes y sus pieles**. Seguí el flujo de `CLAUDE.md`: leé `templates/chat/FICHA.md`, `referencias/chat/` y este pedido, y **proponé un plan antes de escribir código**.

## Lo que muestran las referencias

Las dos referencias (`01-chat-racha.mp4` y `02-chat-cancion-del-dia.mp4`) son la misma estructura en **modo oscuro, tipo WhatsApp**. Son la base de C3 y de R1:

- Fondo casi negro con un patrón sutil de dibujitos.
- Todos los mensajes son **recibidos**: burbujas gris oscuro, alineadas a la izquierda, con la hora chica abajo a la derecha de cada una.
- **Texto:** el hook ("Hoy la racha se activa con:").
- **Audio:** etiqueta "Reenviado" con flecha, botón play/pausa, barra con punto que avanza, contador (0:00, 0:01…) y un ícono redondo a la derecha.
- **Video:** un rectángulo horizontal chico con el clip reproduciéndose. En la 01, encima del video aparecen **palabras de la letra** en mayúscula blanca con sombra ("MIENTRA' ESTE'", "QUE TIENE'").
- El primer cuadro ya muestra los tres mensajes. Lo único que se mueve es el audio (barra y contador) y el video.

**Criterio: simular la app.** Cada piel tiene que parecerse a la app que imita, igual que en las referencias: **oscuro tipo WhatsApp** y **claro tipo Instagram**. La estructura, las proporciones, los tonos y el **video horizontal chico** se copian tal cual de la referencia.

Por `CLAUDE.md` ("sin logos ni copias exactas") solo cambian los elementos que son marca o arte de la app:

- **El ícono rojo de nota** a la derecha del audio es el de una app de música. Se reemplaza por un círculo con una nota en otro color, o por la portada del tema. Lo decide Cotu en Studio.
- **El patrón de fondo** es arte de la app. Se redibuja con dibujitos propios que den el mismo aspecto (densidad, grosor de línea, opacidad).
- **Sin logos ni nombres de app** en ningún lado.

**Variedad:** la idea es generar chats nuevos cada vez por contenido (conversaciones, contactos, momentos del día), no por diseño. El molde tiene que dejar todo eso como prop.

## Las pieles

### C3 · Chat de a dos (oscuro, tipo WhatsApp)

- La referencia tal cual:
  - Fondo casi negro con patrón.
  - Burbujas recibidas gris oscuro a la izquierda, con la hora abajo a la derecha.
  - Audio reenviado con "Reenviado", play/pausa, barra, contador e ícono redondo.
  - **Video horizontal chico.**
- **Lo que suma la grilla:** mis mensajes van como burbujas **enviadas** a la derecha, en el verde oscuro de la app en modo oscuro, con doble tilde de leído.
- **Secuencia:** texto, audio y video. Después, o responde el otro o queda en visto.
- **Modo con respuesta:** antes de la respuesta, un indicador de "escribiendo…" durante alrededor de 1 segundo.
- **Modo en visto:** el último mensaje queda sin respuesta, con la doble tilde de leído.
- **Cabecera** (nombre del contacto arriba): las referencias no la muestran. Decidir en Studio si va.

### R1 · Chat con contador o racha

- Estructura fija, todos los mensajes recibidos, como en las referencias:
  1. Texto: "Día {n} escuchando esto en loop" o "Hoy la racha se activa con:".
  2. Audio reenviado.
  3. Video horizontal.
  4. Vista previa de link: tarjeta del tema con portada, título y artista.
- `{n}` entra como prop.
- **Piel: a definir con Cotu.** La grilla dice "chat claro", pero las referencias de R1 son oscuras, tipo WhatsApp.

### R3 · Mensaje directo (claro, tipo Instagram)

- Pantalla de mensajes directos **en modo claro**: fondo blanco, cabecera con flecha atrás, avatar redondo y nombre de usuario ficticio (prop).
- **Reel compartido:** tarjeta vertical con esquinas redondeadas y el clip reproduciéndose, como se ve un reel compartido en esa app. Abajo, una línea chica con ♪ título · artista. **No usar un @ del artista**: un usuario inventado con su nombre se acerca a imitar una cuenta real.
- **Mensajes:**
  - Enviados a la derecha, en burbuja de color, como en esa app.
  - Recibidos a la izquierda, en gris claro.
  - Burbujas muy redondeadas.
- **Reacción:** emoji chico pegado abajo de la burbuja reaccionada.
- **Modos:**
  - Compartido con mensaje: llega el reel con un mensaje y después mi respuesta.
  - Solo el reel, con una reacción en emoji.

## Motor de mensajes

Una lista de mensajes. Cada uno tiene **tipo**, **remitente** (yo u otro) y **momento de aparición** en segundos. Los tipos son los de la ficha: texto, audio, video, vista previa de link, reacción y visto. Se suman dos:

- **Escribiendo:** el indicador de tres puntos, con duración.
- **Reel:** solo para R3.

**Opción del video:** letra encima sí o no. Usa las palabras de la letra con tiempos, como en la referencia 01.

## Tiempos y animación

- **Primer mensaje desde el cuadro 0.** En R1 se ven los mensajes de la estructura completa desde el inicio, como en las referencias.
- **Cada mensaje nuevo** sube y aparece en 4 a 6 cuadros (ficha).
- **Barra y contador del audio** avanzan con el fragmento que suena.
- **El video** reproduce el clip del fragmento, sin sonido propio: el audio es el del tema.
- **Momento de la respuesta en C3** (propuesta): entre el 60 % y el 70 % del fragmento, después del "escribiendo…". Así el final del video todavía tiene algo que mirar.

## Legibilidad y zona segura

- Texto de las burbujas: **50 px como mínimo**. Hora, "Reenviado", "Visto" y "en línea": **32 px como mínimo** (`CLAUDE.md`).
- Nada a la derecha de x = 925 ni debajo de y = 1470, ni arriba de y = 150 (`CLAUDE.md`; la ficha dice 140 a la derecha, vale el número de `CLAUDE.md`).
- **Ojo, posible choque:** si la referencia se escala tal cual al ancho útil (de x = 60 a x = 925), el texto de las burbujas queda en unos 35 px, debajo de los 50 que pide `CLAUDE.md`. Mostrale a Cotu en Studio las dos versiones: fiel a la referencia y con texto de 50 px. El video horizontal se mantiene en las dos.

## Datos de prueba

- **Temas:** `fmk-si-sale-el-sol-1` e `instinto-luv`.
- **Textos de las conversaciones:** sección `== chat ==` de `datos-prueba/<tema>/textos.txt`. Más variantes en `docs/contenidos/textos/carruseles-chats.md` (C3) y `recomendacion.md` (R1 y R3).
- **Nombres de contacto** de prueba (propuesta, a revisar por Cotu): "lu", "tomi", "cami", "mati", "flor".

## Decisiones para Cotu en Studio

1. Piel de R1: oscura tipo WhatsApp (como las referencias) o clara.
2. Qué va en lugar del ícono rojo de nota: círculo con nota en otro color, o la portada.
3. Tamaño del texto: fiel a la referencia o 50 px.
4. Cabecera con nombre del contacto en C3: sí o no.
5. Letra encima del video: sí o no, y en qué pieles.
6. Momento de la respuesta en C3.

## Criterio de terminado

El de `CLAUDE.md`: las pieles renderizan con 2 temas sin tocar código, respetan la zona segura, todo lo variable es prop con su esquema, la ficha queda completa y hay un render de ejemplo por piel y modo.
