// Datos de ejemplo del molde: con qué tema y palabras destacadas se arma cada
// pieza. Sale en 1:1 (1080×1080), como la referencia. Las destacadas salen de
// datos-prueba/<tema>/brat-minimal.json (aprobadas por Cotu en textos.txt).

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import destacadasInstinto from "../../datos-prueba/instinto-luv/brat-minimal.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import destacadasSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/brat-minimal.json";
import maxi1a from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1a/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import destacadasMaxi1a from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1a/brat-minimal.json";
import destacadasMaxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/brat-minimal.json";
import destacadasMaxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/brat-minimal.json";
import type { BratMinimalProps } from "./BratMinimal";

export const FORMATO_BRAT_MINIMAL = { ancho: 1080, alto: 1080 } as const;

const armar = (tema: Tema, destacadas: string[], grano = 0, desaturar = 0.88): BratMinimalProps => ({
  tema,
  video: { src: tema.fragment.src, inicio: tema.fragment.start, desaturar, brillo: 0.7 },
  destacadas,
  // chico como en la referencia (pedido de Cotu): las destacadas, al doble
  tamanos: { normal: 36, destacada: 72 },
  // legible (pedido de Cotu): el lugar cambia por línea y a un lugar vecino,
  // ningún golpe dura menos de 0,4 s y cada golpe entra con un fundido corto
  posicion: "por-linea",
  saltos: "cerca",
  minimoGolpe: 0.4,
  fundido: 3,
  grano,
  adelantoLectura: 3,
  safeZone: safeZoneOff,
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), destacadas: destacadasInstinto.destacadas },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), destacadas: destacadasSol1.destacadas },
];

// Campana Maxi Espindola, tanda 1. L04 con las destacadas de cada fragmento.
const maxiL04 = [
  { id: "Maxi-L04-F1a", tema: temaSchema.parse(maxi1a), destacadas: destacadasMaxi1a.destacadas },
  { id: "Maxi-L04-F2", tema: temaSchema.parse(maxi2), destacadas: destacadasMaxi2.destacadas },
  { id: "Maxi-L04-F3", tema: temaSchema.parse(maxi3), destacadas: destacadasMaxi3.destacadas },
];

export const ejemplosBratMinimal: { id: string; props: BratMinimalProps }[] = [
  ...temas.map(({ id, tema, destacadas }) => ({ id: `BratMinimal-${id}`, props: armar(tema, destacadas) })),
  ...maxiL04.map(({ id, tema, destacadas }) => ({ id, props: armar(tema, destacadas) })),
  // variante en color: el mismo molde sin el blanco y negro (pedido de Cotu)
  ...temas.map(({ id, tema, destacadas }) => ({ id: `BratMinimal-Color-${id}`, props: armar(tema, destacadas, 0, 0) })),
  // comparación: como la referencia, cambiando de lugar con cada golpe, saltando lejos y con corte seco
  ...temas.map(({ id, tema, destacadas }) => ({
    id: `Comparar-BratMinimal-PorGolpe-${id}`,
    props: { ...armar(tema, destacadas), posicion: "por-golpe" as const, saltos: "lejos" as const, minimoGolpe: 0, fundido: 0 },
  })),
  // comparación: con grano de película
  ...temas.map(({ id, tema, destacadas }) => ({ id: `Comparar-BratMinimal-Grano-${id}`, props: armar(tema, destacadas, 0.3) })),
];
