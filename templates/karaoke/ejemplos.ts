// Datos de ejemplo del molde: el videoclip de fondo y el color de resaltado.
// Sale en 9:16 y en 1:1 (pedido de Cotu): el mismo componente se adapta a la
// zona libre de cada formato.

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import maxi1 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import type { KaraokeProps } from "./Karaoke";

export const FORMATOS_KARAOKE = {
  "9x16": { ancho: 1080, alto: 1920 },
  "1x1": { ancho: 1080, alto: 1080 },
} as const;
export type FormatoKaraoke = keyof typeof FORMATOS_KARAOKE;

const armar = (tema: Tema): KaraokeProps => ({
  tema,
  video: { src: tema.fragment.src, inicio: tema.fragment.start, oscurecer: 0.35 },
  // el color sale del tema (decisión de Cotu): violeta en instinto, naranja en FMK
  colorResaltado: "",
  lineaSiguiente: false,
  adelantoLectura: 3,
  safeZone: safeZoneOff,
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv) },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1) },
];

// Campana Maxi Espindola, tanda 1. L09 va en 9:16; el resaltado sale del
// secundario del tema (el naranja de la portada).
const maxiL09 = [
  { id: "Maxi-L09-F1", tema: temaSchema.parse(maxi1) },
  { id: "Maxi-L09-F2", tema: temaSchema.parse(maxi2) },
  { id: "Maxi-L09-F3", tema: temaSchema.parse(maxi3) },
];

export const ejemplosKaraoke: { id: string; formato: FormatoKaraoke; props: KaraokeProps }[] = temas
  .flatMap(({ id, tema }) => (["9x16", "1x1"] as const).map((formato) => ({ id: `Karaoke-${formato}-${id}`, formato, props: armar(tema) })))
  .concat(maxiL09.map(({ id, tema }) => ({ id, formato: "9x16" as const, props: armar(tema) })));
