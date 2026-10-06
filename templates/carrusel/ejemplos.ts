// Datos de ejemplo del molde: qué slides lleva el carrusel de cada cuenta, con
// qué foto y qué texto. Cada slide es una imagen 3:4. Los textos y las fotos
// salen de datos-prueba/<tema>/carrusel.json (textos de textos.txt).

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import carruselInstinto from "../../datos-prueba/instinto-luv/carrusel.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import carruselSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/carrusel.json";
import type { CarruselProps } from "./Carrusel";

/** 3:4, el formato de una foto (pedido de Cotu) */
export const FORMATO_CARRUSEL = { ancho: 1080, alto: 1440 } as const;

type Datos = {
  hooks: { C1: string; C2: string; C8: string; R2: string };
  /** la frase de la slide 2: una sola frase de la estrofa, la elige quien hace la bajada */
  frase: string[];
  fotos: { C1: string; C2: string; C8: string };
  artista: { frase: string; tarjeta: string };
};

const slide = (tema: Tema, tipo: CarruselProps["tipo"], foto: string, texto: string, extra: Partial<CarruselProps> = {}): CarruselProps => ({
  tema,
  tipo,
  foto,
  oscurecer: tipo === "B-artista-frase" ? 0.45 : tipo === "A-foto-hook" ? 0.1 : 0,
  texto,
  posicionTexto: "centro",
  colorTexto: "",
  colorFondo: "",
  safeZone: safeZoneOff,
  ...extra,
});

/** C1, C2 y C8: foto con hook + artista con una frase de la letra. R2: hook sobre color + artista con tarjeta. */
const carruseles = (tema: Tema, d: Datos) => ({
  C1: [slide(tema, "A-foto-hook", d.fotos.C1, d.hooks.C1), slide(tema, "B-artista-frase", d.artista.frase, d.frase.join("\n"))],
  // en C2 el hook va en el tercio de arriba, como en una de las referencias
  C2: [
    slide(tema, "A-foto-hook", d.fotos.C2, d.hooks.C2, { posicionTexto: "arriba" }),
    slide(tema, "B-artista-frase", d.artista.frase, d.frase.join("\n")),
  ],
  C8: [slide(tema, "A-foto-hook", d.fotos.C8, d.hooks.C8), slide(tema, "B-artista-frase", d.artista.frase, d.frase.join("\n"))],
  R2: [slide(tema, "C-hook-color", "", d.hooks.R2), slide(tema, "D-artista-tarjeta", d.artista.tarjeta, "")],
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), datos: carruselInstinto as Datos },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), datos: carruselSol1 as Datos },
];

export const ejemplosCarrusel: { id: string; props: CarruselProps }[] = [
  ...temas.flatMap(({ id, tema, datos }) =>
    Object.entries(carruseles(tema, datos)).flatMap(([cuenta, slides]) =>
      slides.map((props, k) => ({ id: `Carrusel-${cuenta}-${k + 1}-${id}`, props })),
    ),
  ),
  // comparación: la frase en el color del tema (como la referencia en rojo)
  {
    id: "Comparar-Carrusel-FraseColor-InstintoLuv",
    props: slide(temas[0].tema, "B-artista-frase", temas[0].datos.artista.frase, temas[0].datos.frase.join("\n"), {
      colorTexto: temas[0].tema.colors?.secondary ?? "",
    }),
  },
];
