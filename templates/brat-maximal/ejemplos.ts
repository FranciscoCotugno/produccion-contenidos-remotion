// Datos de ejemplo del molde: con qué tema y video se arma cada pieza.
// Sale en 1:1 (1080×1080), como la referencia.

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import maxi1a from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1a/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import videosMaxi from "../../datos-prueba/maxi-espindola-hagamos-que-pase/videos.json";
import type { BratMaximalProps } from "./BratMaximal";

export const FORMATO_BRAT_MAXIMAL = { ancho: 1080, alto: 1080 } as const;

/**
 * El fondo es el videoclip del fragmento (L03). En L02 va material en vivo, con
 * el mismo tratamiento: no hay de prueba, así que hay un solo ejemplo por tema.
 */
const armar = (tema: Tema, golpeBeat = false): BratMaximalProps => ({
  tema,
  // desenfocado, sin tinte (pedido de Cotu)
  video: { src: tema.fragment.src, inicio: tema.fragment.start, desenfoque: 14, brillo: 0.8 },
  golpeBeat,
  palabrasPorFrase: 4,
  adelantoLectura: 3,
  safeZone: safeZoneOff,
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv) },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1) },
];

// Campana Maxi Espindola, tanda 1. L02 y L03 van con material en vivo (576 px de
// ancho): el desenfoque del molde (14) tapa la falta de resolucion. Siempre en
// mute, el audio es el del tema. Reparto de videos segun el plan.
const enVivo = (datos: unknown, idVideo: string): BratMaximalProps => {
  const v = videosMaxi.envivo.find((x) => x.id === idVideo)!;
  return { ...armar(temaSchema.parse(datos)), video: { src: v.src, inicio: v.inicio, desenfoque: 14, brillo: 0.8 } };
};
const maxiMaximal: { id: string; props: BratMaximalProps }[] = [
  { id: "Maxi-L02-F1a", props: enVivo(maxi1a, "envivo-1") },
  { id: "Maxi-L02-F2", props: enVivo(maxi2, "envivo-3") },
  { id: "Maxi-L02-F3", props: enVivo(maxi3, "envivo-1") },
  { id: "Maxi-L03-F1a", props: enVivo(maxi1a, "envivo-2") },
  { id: "Maxi-L03-F2", props: enVivo(maxi2, "envivo-4") },
  { id: "Maxi-L03-F3", props: enVivo(maxi3, "envivo-4") },
];

export const ejemplosBratMaximal: { id: string; props: BratMaximalProps }[] = [
  ...temas.map(({ id, tema }) => ({ id: `BratMaximal-${id}`, props: armar(tema) })),
  ...maxiMaximal,
  // comparación: con golpe de zoom al ritmo (instinto luv tiene la grilla de beats más clara)
  { id: "Comparar-BratMaximal-Golpe-InstintoLuv", props: armar(temas[0].tema, true) },
];
