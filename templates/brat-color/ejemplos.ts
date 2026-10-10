// Datos de ejemplo del molde: con qué tema y opciones se arma cada
// composición en Studio.

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema } from "../../shared/tema";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import { EFECTOS_PELICULA, FONDO_IA, FONDO_LISO } from "../brat-puro/ejemplos";
import maxi1a from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1a/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import type { BratColorProps } from "./BratColor";

const base: Omit<BratColorProps, "tema"> = {
  tipografia: "archivo-narrow",
  mayusculas: "respetar",
  // 690 de ancho: en el pico del golpe (+8 %) y con el temblor (+3 %), el
  // borde derecho queda en x ≈ 924, dentro de la zona libre (hasta 925)
  bloque: { ancho: 690, alto: 760, centroY: 540 },
  letra: { max: 196, min: 90, interlineado: 1.15 },
  ultimoRenglon: "completo",
  porcentaje: 70,
  ajusteLetra: 0,
  // la palabra entra 3 cuadros (0,1 s) antes de cantarse, como en reproductor-app
  adelantoLectura: 3,
  efectos: EFECTOS_PELICULA.blanca,
  fondo: FONDO_LISO,
  // verde Brat, negro, blanco
  paleta: ["#8ACE00", "#000000", "#FFFFFF"],
  destello: { modo: "invertir", cuadros: 3 },
  golpeBloque: 0.08,
  explosionDesde: 0,
  safeZone: safeZoneOff,
};

// instinto-luv: beat marcado (104,3 BPM, grilla por el bombo)
const instinto = temaSchema.parse(instintoLuv);
// FMK: grilla de 172,3 BPM, poco precisa (ver la ficha)
const sol1 = temaSchema.parse(siSaleElSol1);
// Campana Maxi Espindola, tanda 1. L12 lleva la paleta de la portada (rojo neon y
// azul noche), no la verde Brat. Sin beats: queda el cambio de color por frase.
const PALETA_MAXI = ["#F42C30", "#13316F", "#FFFFFF"];
const maxiL12 = [
  { id: "Maxi-L12-F1a", tema: temaSchema.parse(maxi1a) },
  { id: "Maxi-L12-F2", tema: temaSchema.parse(maxi2) },
  { id: "Maxi-L12-F3", tema: temaSchema.parse(maxi3) },
];

export const ejemplosBratColor: { id: string; props: BratColorProps }[] = [
  { id: "BratColor-InstintoLuv", props: { ...base, tema: instinto } },
  ...maxiL12.map(({ id, tema }) => ({ id, props: { ...base, tema, paleta: PALETA_MAXI } })),
  { id: "BratColor-SiSaleElSol-1", props: { ...base, tema: sol1, tipografia: "tiktok-sans-angosta" } },
  // con video de fondo: el velo toma el color de la frase
  { id: "BratColor-Video-IA-InstintoLuv", props: { ...base, tema: instinto, fondo: { ...FONDO_IA, velo: 0.6 } } },
  {
    id: "BratColor-Video-Clip-SiSaleElSol-1",
    props: {
      ...base,
      tema: sol1,
      tipografia: "tiktok-sans-angosta",
      fondo: { tipo: "video", src: sol1.fragment.src, inicio: sol1.fragment.start, desenfoque: 14, velo: 0.6 },
    },
  },
  // Comparaciones para decidir en Studio
  {
    id: "Comparar-BratColor-SoloFrase",
    props: { ...base, tema: instinto, destello: { ...base.destello, cuadros: 0 }, golpeBloque: 0 },
  },
  { id: "Comparar-BratColor-DestelloSiguiente", props: { ...base, tema: instinto, destello: { modo: "siguiente", cuadros: 3 } } },
  { id: "Comparar-BratColor-Limpio", props: { ...base, tema: instinto, efectos: { grano: 0, polvo: false, temblor: 0, halacion: 0, desenfoque: 0 } } },
];
