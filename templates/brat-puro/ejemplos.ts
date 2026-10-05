// Datos de ejemplo del molde: con qué tema, piel y opciones se arma cada
// composición en Studio.

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema } from "../../shared/tema";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import siSaleElSol2 from "../../datos-prueba/fmk-si-sale-el-sol-2/tema.json";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import type { BratPuroProps } from "./BratPuro";

// Efectos de la versión "película" (elegida por Cotu, 2026-10-05), por piel:
// en la blanca la tinta se corre apenas; en la negra la letra sangra luz.
export const EFECTOS_PELICULA = {
  blanca: { grano: 0.15, polvo: true, temblor: 1, halacion: 0.2, desenfoque: 1.5 },
  negra: { grano: 0.12, polvo: true, temblor: 1, halacion: 0.35, desenfoque: 1 },
} as const;

/** Fondo liso (el de siempre). */
export const FONDO_LISO = { tipo: "color", src: "", inicio: 0, desenfoque: 0, velo: 1 } as const;
/** Video generado con IA de los bancos, un poco desenfocado. */
export const FONDO_IA = {
  tipo: "video",
  // copia en 1080p del original 4K del banco: el render es mucho más rápido
  src: "media/bancos/nicho-driving-night/1080p/nicho-driving-night-001.mp4",
  inicio: 0,
  desenfoque: 14,
  velo: 0.5,
} as const;

// Valores por defecto, a escala de la referencia (bloque cuadrado; "Suena" a
// tamaño máximo ocupa el 61 % del ancho, como en 01-brat-puro.mp4).
const base: Omit<BratPuroProps, "tema"> = {
  piel: "blanca",
  tipografia: "archivo-narrow",
  mayusculas: "respetar",
  // formato 1:1: el bloque va centrado en el cuadro (zona libre: x 60-925, y 0-1050).
  // 740 de ancho: con el temblor (escala 1,03) el borde derecho queda en x ≈ 922
  bloque: { ancho: 740, alto: 760, centroY: 540 },
  letra: { max: 196, min: 90, interlineado: 1.15 },
  ultimoRenglon: "completo",
  porcentaje: 70,
  ajusteLetra: 0,
  // la palabra entra 3 cuadros (0,1 s) antes de cantarse, como en reproductor-app
  adelantoLectura: 3,
  efectos: EFECTOS_PELICULA.blanca,
  fondo: FONDO_LISO,
  golpeBeat: 0,
  safeZone: safeZoneOff,
};

const sol1 = temaSchema.parse(siSaleElSol1);
const sol2 = temaSchema.parse(siSaleElSol2);
const instinto = temaSchema.parse(instintoLuv);

// FMK exige TikTok Sans o Arial: va con TikTok Sans angosta
const fmk = { tipografia: "tiktok-sans-angosta" } as const;
const negra = { piel: "negra", efectos: EFECTOS_PELICULA.negra } as const;

export const ejemplosBratPuro: { id: string; props: BratPuroProps }[] = [
  { id: "BratPuro-Blanca-SiSaleElSol-1", props: { ...base, ...fmk, tema: sol1 } },
  { id: "BratPuro-Blanca-SiSaleElSol-2", props: { ...base, ...fmk, tema: sol2 } },
  { id: "BratPuro-Negra-InstintoLuv", props: { ...base, ...negra, tema: instinto } },
  // Con video de fondo: el videoclip del tema (sincronizado con el audio) o un video de IA
  {
    id: "BratPuro-Video-Clip-SiSaleElSol-1",
    props: {
      ...base,
      ...fmk,
      ...negra,
      tema: sol1,
      fondo: { tipo: "video", src: sol1.fragment.src, inicio: sol1.fragment.start, desenfoque: 14, velo: 0.5 },
    },
  },
  { id: "BratPuro-Video-IA-InstintoLuv", props: { ...base, ...negra, tema: instinto, fondo: FONDO_IA } },
];
