// Datos de ejemplo del molde: con qué tema se arma. El fondo rota entre tres
// colores sacados de la portada (vacío = automático). Sale en 1:1 (pedido de Cotu).

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import type { TipograficoProps } from "./Tipografico";

/** 1:1 (pedido de Cotu) */
export const FORMATO_TIPOGRAFICO = { ancho: 1080, alto: 1080 } as const;

const armar = (tema: Tema): TipograficoProps => ({
  tema,
  // los tres colores salen de la portada (decisión de Cotu)
  colores: [],
  palabrasPorFrase: 3,
  golpeBeat: true,
  adelantoLectura: 3,
  safeZone: safeZoneOff,
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv) },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1) },
];

export const ejemplosTipografico: { id: string; props: TipograficoProps }[] = temas.map(({ id, tema }) => ({
  id: `Tipografico-${id}`,
  props: armar(tema),
}));
