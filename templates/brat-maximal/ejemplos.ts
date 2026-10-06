// Datos de ejemplo del molde: con qué tema y video se arma cada pieza.
// Sale en 1:1 (1080×1080), como la referencia.

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
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

export const ejemplosBratMaximal: { id: string; props: BratMaximalProps }[] = [
  ...temas.map(({ id, tema }) => ({ id: `BratMaximal-${id}`, props: armar(tema) })),
  // comparación: con golpe de zoom al ritmo (instinto luv tiene la grilla de beats más clara)
  { id: "Comparar-BratMaximal-Golpe-InstintoLuv", props: armar(temas[0].tema, true) },
];
