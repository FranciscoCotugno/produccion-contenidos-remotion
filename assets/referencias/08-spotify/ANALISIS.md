# Análisis: carpeta `08-spotify`

Hecho mirando los videos cuadro por cuadro, octubre 2026. Los textos de los ejemplos son inventados: las referencias son temas de terceros y acá solo se describe la mecánica.

**Fotogramas:** `cuadro-lista-letra-clara.png`, `cuadro-lista-letra-oscura.png`

## Lo principal: es el mismo molde que la carpeta 03

Esta carpeta y `03-portada-blureada` son **la misma pantalla**: el panel de letra de una app de música, con la letra entera a la vista y la línea que suena destacada.

Lo único que cambia es **cómo se marca la diferencia entre la línea activa y las demás**:

| | Carpeta 03 | Carpeta 08 |
|---|---|---|
| Fondo | Portada del tema, muy desenfocada | Color liso, tomado de la portada |
| Diferencia activa/inactiva | **Desenfoque** creciente con la distancia | **Opacidad**: la inactiva más transparente |
| Alineación | Izquierda, texto grande | Izquierda, texto más chico |
| Líneas a la vista | 5 a 7 | 8 a 10 |

Son **dos pieles de un mismo molde**, no dos moldes. Conviene construirlos juntos: la estructura (lista de líneas, scroll, línea activa) es idéntica, y lo que cambia es el tratamiento.

## Composición

1. **Fondo:** color liso, sin degradé ni textura. En un video es un gris verdoso medio y en el otro un gris oscuro; los dos parecen tomados de la portada del tema.
2. **Encabezado, chico y centrado:** un galón hacia abajo a la izquierda, y al centro el **título del tema** en negrita y los **artistas** debajo, más chicos y atenuados. Mucho más discreto que el encabezado de la carpeta 03.
3. **Lista de letra:** ocupa todo el resto de la pantalla.
   - Alineada a la **izquierda**, con margen generoso.
   - Negrita, tamaño medio (bastante más chica que en la carpeta 03: entran 8 a 10 líneas).
   - Interlineado holgado entre líneas, y las líneas largas **envuelven** en dos renglones pegados.
   - Las líneas ya cantadas y la activa van en **color sólido** (negro sobre fondo claro, blanco sobre fondo oscuro). Las que todavía no sonaron van **atenuadas**, del orden del 40 a 50 % de opacidad.
   - La lista **se desplaza hacia arriba** a medida que avanza el tema.
   - Los interludios instrumentales se marcan con un **símbolo de nota musical** en una línea propia.

## Por qué conviene construirlo igual aunque la mediana sea baja

La mediana de la cuenta es de 2,8 mil vistas, con picos de 422 mil y 146 mil. Es el molde más barato de todos: no necesita portada desenfocada, ni banco de imágenes, ni video. Solo color, letra y tiempos. Sirve para llenar grilla y para dar volumen mientras los moldes caros se construyen.

Y si se construye como piel del mismo molde que la carpeta 03, **sale casi gratis**: es la misma lista con otro tratamiento.

## Detalle que conviene no copiar

Los dos videos reproducen la interfaz de una app real bastante de cerca, incluido el galón de cerrar. Vale lo que ya dice la ficha de `reproductor-app`: códigos visuales, sin logos ni nombres de marca, y con nuestros propios íconos y tipografía. La mecánica de la lista es genérica y es lo que hay que tomar.

## Con qué se corresponde en el repo

Con `reproductor-app`, igual que la carpeta 03. Las dos entran como **pieles nuevas del mismo molde**: una con desenfoque sobre portada borrosa, otra con opacidad sobre color liso.

Ojo que la piel Spotify que ya existe en el repo (cuenta L06) **no es esto**: esa es la pantalla de reproducción, con portada grande y controles. Esta es la pantalla de letra. Son dos pantallas distintas de la misma app.
