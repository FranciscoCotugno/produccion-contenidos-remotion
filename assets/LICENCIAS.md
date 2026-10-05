# Licencias de assets

Cada asset que usa un template se registra acá. Solo entran assets cuya
licencia cubra el uso real: uso comercial en video e imagen, instalación en el
servidor de render y uso compartido con el equipo.

## Tipografías (`assets/fonts/`)

| Familia | Archivos | Licencia | Autor | Texto de la licencia | Cubre el uso real |
|---|---|---|---|---|---|
| TikTok Sans | `TikTokSans-Variable.ttf` | SIL OFL 1.1 | TikTok Inc. | `TikTokSans-OFL.txt` | Sí |
| Fraunces (itálica) | `Fraunces-Italic-Variable.ttf` | SIL OFL 1.1 | The Fraunces Project Authors (Undercase Type) | `Fraunces-OFL.txt` | Sí |
| Geist | `Geist-Variable.ttf`, `Geist-Italic-Variable.ttf` | SIL OFL 1.1 | The Geist Project Authors (Vercel) | `Geist-OFL.txt` | Sí |
| Ronzino | `Ronzino-Regular/Oblique/Medium/MediumOblique/Bold/BoldOblique.woff2` | SIL OFL 1.1 | Collletttivo | `Ronzino-OFL.txt` | Sí |
| Archivo Narrow | `ArchivoNarrow-Variable.ttf`, `ArchivoNarrow-Italic-Variable.ttf` | SIL OFL 1.1 | The Archivo Narrow Project Authors (Omnibus-Type) | `ArchivoNarrow-OFL.txt` | Sí |
| Arimo | `Arimo-Variable.ttf`, `Arimo-Italic-Variable.ttf` | SIL OFL 1.1 | The Arimo Project Authors (Steve Matteson) | `Arimo-OFL.txt` | Sí |
| Inter | `Inter-Variable.ttf` | SIL OFL 1.1 | The Inter Project Authors (Rasmus Andersson) | `Inter-OFL.txt` | Sí |
| Noto Color Emoji | `NotoColorEmoji-Regular.ttf` | SIL OFL 1.1 | Google | `NotoColorEmoji-OFL.txt` | Sí |
| AKONY | `AKONY.woff2` | Libre para uso comercial y personal (licencia propia del autor) | Vladimir Klenov | `AKONY-License.txt` | Uso comercial: sí. Ver nota |

**Nota AKONY:** el texto de la licencia solo dice que la fuente es libre para
uso comercial y personal y que el crédito es opcional. No menciona
explícitamente instalarla en un servidor ni redistribuirla dentro del equipo.
No es una licencia abierta estándar como la OFL: conviene confirmarlo con el
autor (grinfleim@gmail.com) antes de usarla en producción.

## Excluidas

No se usan porque su licencia no cubre el uso real: Arial Narrow (Monotype),
Sk-Modernist (licencia paga de escritorio para 2 equipos, sin
redistribución) y Comic Sans.

## Origen

Archivo Narrow se bajó del repositorio oficial de Google Fonts
(`github.com/google/fonts`, `ofl/archivonarrow`), junto con su `OFL.txt`.

Arimo se bajó del mismo repositorio (`ofl/arimo`), junto con su `OFL.txt`.

Inter (`ofl/inter`) y Noto Color Emoji (`ofl/notocoloremoji`) también, con su
`OFL.txt`. Inter reemplaza a SF Pro (la letra del iPhone, sin licencia para
servidor) en los moldes que simulan apps; Noto Color Emoji da los emojis de
las reacciones sin depender de los del sistema operativo.
Es la alternativa libre a Arial (métricas compatibles). Arial es de Monotype y
viene con el sistema operativo: esa licencia no cubre instalarla en el servidor
de render ni compartirla con el equipo.
