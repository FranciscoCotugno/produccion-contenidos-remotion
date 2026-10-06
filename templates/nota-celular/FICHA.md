# Nota del celular

## Identificación
- **Cuenta:** C7.
- **Sale como:** video, 30 fps.
- **Dimensiones:** **1:1 (1080×1080)** (pedido de Cotu). Primero se hizo en 9:16 y no convenció. En 1:1 TikTok muestra el cuadro con bandas: la zona libre es x 60–925, y 0–1050, así que se ve casi todo, barra de herramientas incluida.
- **Duración:** la del fragmento (inicio y fin).
- **Punto de partida:** desde cero.
- **Componente:** `NotaCelular.tsx`; ejemplos en `ejemplos.ts`; textos de prueba en `datos-prueba/<tema>/nota.json` (de `textos.txt`); fotogramas en `render/`.

## Qué es
Una nota de la app de notas del celular, donde un texto se va escribiendo letra por letra mientras suena el tema. Al final aparece la tarjeta del tema.

## Por qué funciona
Es confesional e identificable: parece algo que alguien escribió y nunca mandó. El efecto de "alguien escribiendo" retiene la atención.

## Composición (de arriba hacia abajo)
La interfaz es **idéntica a la de la app de notas del iPhone y sin logos** (CLAUDE.md):
La barra de estado (hora, señal, wifi y batería) **se sacó**, para ganar espacio (pedido de Cotu).

1. **Barra de navegación:** la flecha de volver con "Notas" en el amarillo de la app y, a la derecha, compartir, lápiz y "...", cada uno en su círculo gris.
2. **La fecha**, chica, gris y centrada.
3. **El título** de la nota, en negrita.
4. **El cuerpo**, que se escribe letra por letra con el cursor parpadeando (en el amarillo de la app).
5. **La tarjeta del tema**, que entra al terminar el tipeo: portada chica, título y artistas sobre un fondo oscuro redondeado.
6. **Barra de herramientas** de la app: lista, Aa, lápiz, cámara y nota nueva.

## Pieles
`clara` (papel blanco, amarillo oscuro) y `oscura` (negra, amarillo brillante), las dos de la app. Los ejemplos van en clara; `Comparar-Nota-Oscura-<tema>` muestra la oscura.

## Tipografía
**Inter**, en lugar de la del sistema del iPhone (CLAUDE.md). La ficha vieja decía Geist, pero Inter se parece mucho más a la de la app. Cuerpo 19 pt (52 px) y título 24 pt (66 px), sobre una pantalla de 393 pt de ancho: todo el diseño escala con eso.

## El tipeo
- Arranca a los 0,25 s: el título y la interfaz están desde el primer cuadro.
- Ritmo humano: la velocidad oscila un 25 % (sin azar, sale del índice de cada letra, así cada render sale igual) y hace pausas después de cada coma (0,18 s), punto (0,35 s) y salto de línea (0,4 s).
- `velocidad` está en letras por segundo (14 en los ejemplos). **Si el texto no entra en el fragmento, todo el tipeo se acelera parejo** para terminar a tiempo, con 2,4 s de margen para la tarjeta.
- El cursor queda fijo mientras se escribe y parpadea una vez por segundo cuando termina.

## Modos
1. **Confesión:** un texto corto que termina en una frase de la letra.
2. **Lista:** "cosas que me recuerdan a vos: 1. el calor de enero, 2. los cortes de luz…".

## Qué decide la bajada
El título y el texto de la nota los escribe quien hace la bajada del tema (están en `textos.txt`). La última línea de la confesión es una frase de la letra, dentro del mismo texto (decisión de Cotu): el molde no la separa ni la destaca.

## Qué es fijo y qué varía
- **Fijo:** el diseño de la interfaz y la tipografía.
- **Varía (props, `notaCelularSchema`):** `tema` (fragmento, portada, título, artistas), `piel`, `modo`, `titulo`, `texto`, `velocidad`, `fecha`, `mostrarTarjeta`, `safeZone`.

## Zona segura y ubicación de la tarjeta
- **El texto no pasa de la zona libre:** el margen de la app es de 20 pt, pero el bloque se corta en x = 925, porque si no los renglones largos quedan abajo de la columna de botones. Los renglones cortan antes, como cortaría la app en una pantalla más angosta.
- **La tarjeta va centrada a lo ancho de la zona libre y centrada en el espacio que queda** entre el final del texto y la barra de herramientas (pedido de Cotu: antes estaba abajo a la izquierda). Va en el flujo de la nota, así nunca se superpone ni con lo escrito ni con la barra, por larga que sea la nota.
- La barra de navegación queda sobre el borde de arriba, fuera de lo que tapa TikTok.

## Para decidir en Studio
- Velocidad de tipeo (hoy 14 letras por segundo).
- Si conviene recuperar la barra de estado en algún caso (hoy va sin ella).
- Piel clara u oscura por defecto.

## Se repite con otros moldes
- La tarjeta chica del tema: la misma del carrusel R2 (`D-artista-tarjeta`).
- `chat` arma su propia interfaz de app aparte.

## Referencias
No hay capturas específicas: la referencia es la app de notas de cualquier celular.
