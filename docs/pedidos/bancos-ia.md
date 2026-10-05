# Pedido para Claude Code: generador de bancos con IA

Hay que armar un script que lea las listas de prompts y genere los bancos de imágenes y videos con **fal.ai**, el proveedor que define la grilla (sección 7.4). Va en `scripts/`, como `tiempos`. Proponé el plan antes de escribir código.

## Qué tiene que hacer

1. Leer `docs/pedidos/bancos-ia-prompts.csv` (imágenes) y `docs/pedidos/bancos-ia-videos.csv` (videos). Cada renglón es una pieza: banco, número y escena. Los videos traen además ciudad, momento (día o noche) y ritmo (lento o rápido).
2. A cada prompt sumarle el **estilo común de su banco** (ver abajo).
3. Generar en **vertical 9:16** con el modelo que corresponda:
   - **Fotos y fondos:** FLUX.2 Pro (USD 0,03 por imagen, según la grilla).
   - **Videos:** Kling 3.0 vía fal (USD 0,029 por segundo), clips de 8 segundos.
   - El modelo tiene que poder cambiarse con una opción, sin tocar el script.
4. Guardar en `assets/media/bancos/<banco>/ia/<banco>-001.jpg` (o `.mp4`), y así en adelante.
5. Escribir o actualizar `assets/media/bancos/<banco>/ia/manifest.csv` con archivo, prompt completo, modelo, fecha y, en video, ciudad, momento y ritmo. El manifest sirve para repetir una pieza, sacar variantes y que el sistema elija el clip por ritmo.
6. **No pisar** lo que ya existe: si el archivo está, lo saltea.
7. Opciones:
   - `--banco <nombre>` para generar un solo banco.
   - `--candidatas N` para sacar varias versiones por prompt y elegir.
   - `--simular` para mostrar qué se va a generar y cuánto cuesta, sin generar nada.
8. La clave de fal (`FAL_KEY`) va en una variable de entorno o en un `.env` ignorado por git. Nunca en el repo.

## Estilo común por banco

| Banco | Se suma al prompt |
|---|---|
| `fotos-dia`, `fotos-noche`, `fondos-frios`, `fondos-calidos`, `fondos-tarjetas` | `vertical 9:16 photo, shot on a smartphone, candid and unposed, natural imperfect framing, slight grain, realistic, no people's faces, no text, no logos, no watermarks` |
| `fotos-flash` | Lo anterior, más `harsh direct flash, 35mm disposable camera look, film grain, slightly overexposed foreground` |
| `reacciones-img` | `vertical 9:16, centered character, plain white background, no text, no logos, original character design` |
| `nicho-lluvia-ciudad`, `nicho-ciudades` | `vertical 9:16 video, realistic, cinematic but handheld feel, no people's faces in focus, no text, no logos` |

## Qué hay en la fase 1

Alcanza para probar los moldes. La tanda mensual de producción se define después.

| Banco | Cuentas | Cantidad |
|---|---|---|
| `fotos-dia` | C1 | 10 |
| `fotos-noche` | C2 | 10 |
| `fotos-flash` | C8 | 10 |
| `fondos-frios` | C5 | 10 |
| `fondos-calidos` | C6 | 10 |
| `fondos-tarjetas` | C4 | 10 |
| `reacciones-img` | M1 | 6 (opcional, ver nota) |
| `nicho-lluvia-ciudad` | POV7 | 10 clips |
| `nicho-ciudades` | POV8 | 10 clips: Buenos Aires, Medellín, Ciudad de México, Montevideo y Santiago, de día y de noche |

Costo estimado con los precios de la grilla: unos USD 2 en imágenes y entre USD 2 y 7 en video, contando descartes. Antes de generar, corré `--simular` y pasale el número a Cotu.

**Nota sobre `reacciones-img`:** la grilla prevé reacciones de clips virales y de editores. Este banco es una alternativa propia: un personaje 3D original sobre fondo blanco, con licencia limpia. Generalo solo si Cotu lo aprueba.

## Licencia

Antes de la primera tanda, verificá en los términos de fal.ai y de cada modelo que **lo generado se pueda usar comercialmente**. Registralo en `assets/LICENCIAS.md` con servicio, modelo, link a los términos y fecha de consulta.

## Orden de carpetas (pedido aparte, con OK de Cotu)

- Hoy existe `assets/media/bancos/fotos-frias/` con 3 imágenes. Si es el mismo banco que `fondos-frios`, se renombra.
- Las imágenes que ya están en `fotos-dia/`, `fotos-noche/`, `fotos-flash/` y `fotos-frias/` van directo en la carpeta del banco, sin la subcarpeta de origen. Hay que pasarlas a `pinterest/`, `stock/` o lo que corresponda, según de dónde vengan (lo sabe Cotu). Si son de Pinterest, sirven para el laboratorio y no para producción.
