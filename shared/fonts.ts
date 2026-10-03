// Registro de tipografías (traído de automatizacion-kioscos, solo las de
// licencia verificada). Los archivos viven en assets/fonts junto a su licencia
// y cada uno está registrado en assets/LICENCIAS.md. Importá la constante de
// la familia y usala como `fontFamily`: se registra una vez y el render espera
// a que cargue.

import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

type Face = { file: string; weight?: string; style?: string; stretch?: string };

const register = (family: string, faces: Face[], fallback: string) => {
  for (const f of faces) {
    loadFont({ family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style, stretch: f.stretch });
  }
  return `'${family}', ${fallback}`;
};

/** Variable: peso 300-900, ancho 75-150 ('wdth'), inclinación 0 a -6 ('slnt'). */
export const TIKTOK_SANS = register(
  "TikTok Sans",
  [{ file: "TikTokSans-Variable.ttf", weight: "300 900", stretch: "75% 150%", style: "oblique 0deg 6deg" }],
  "'Helvetica Neue', sans-serif",
);

/** Solo itálica. Variable: peso 100-900, 'SOFT' 0-100, 'WONK' 0-1, 'opsz' 9-144. */
export const FRAUNCES_ITALIC = register(
  "Fraunces",
  [{ file: "Fraunces-Italic-Variable.ttf", weight: "100 900", style: "italic" }],
  "Georgia, serif",
);

/** Variable: peso 100-900, redonda e itálica. */
export const GEIST = register(
  "Geist",
  [
    { file: "Geist-Variable.ttf", weight: "100 900", style: "normal" },
    { file: "Geist-Italic-Variable.ttf", weight: "100 900", style: "italic" },
  ],
  "'Helvetica Neue', sans-serif",
);

/** 400 / 500 / 700, cada uno con oblicua (fontStyle "italic"). */
export const RONZINO = register(
  "Ronzino",
  [
    { file: "Ronzino-Regular.woff2", weight: "400", style: "normal" },
    { file: "Ronzino-Oblique.woff2", weight: "400", style: "italic" },
    { file: "Ronzino-Medium.woff2", weight: "500", style: "normal" },
    { file: "Ronzino-MediumOblique.woff2", weight: "500", style: "italic" },
    { file: "Ronzino-Bold.woff2", weight: "700", style: "normal" },
    { file: "Ronzino-BoldOblique.woff2", weight: "700", style: "italic" },
  ],
  "'Helvetica Neue', sans-serif",
);

/** Display, un solo peso. Para palabras cortas y títulos. */
export const AKONY = register("AKONY", [{ file: "AKONY.woff2" }], "Impact, sans-serif");

export const FONT_LIST = [
  { name: "TikTok Sans", family: TIKTOK_SANS },
  { name: "Fraunces Italic", family: FRAUNCES_ITALIC },
  { name: "Geist", family: GEIST },
  { name: "Ronzino", family: RONZINO },
  { name: "AKONY", family: AKONY },
];
