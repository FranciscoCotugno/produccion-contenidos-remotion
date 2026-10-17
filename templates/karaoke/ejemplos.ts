// Datos de ejemplo del molde: el videoclip de fondo y el color de resaltado.
// Sale en 9:16 y en 1:1 (pedido de Cotu): el mismo componente se adapta a la
// zona libre de cada formato.

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
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
  franjaBotones: franjaOff,
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv) },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1) },
];

// Molde dado de baja por Cotu el 2026-10-14 ("el template de karaoke no va mas"): no
// retiene la atencion. L09 queda sin molde, como L10. Quedan los ejemplos viejos para
// no perder el trabajo; la campana de Maxi ya no lo usa.
export const ejemplosKaraoke: { id: string; formato: FormatoKaraoke; props: KaraokeProps }[] = temas.flatMap(
  ({ id, tema }) => (["9x16", "1x1"] as const).map((formato) => ({ id: `Karaoke-${formato}-${id}`, formato, props: armar(tema) })),
);
