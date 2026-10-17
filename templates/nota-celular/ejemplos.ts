// Datos de ejemplo del molde: qué nota se escribe, con qué tema y en qué piel.
// Los textos salen de datos-prueba/<tema>/nota.json (de textos.txt): los
// escribe quien hace la bajada del tema.

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import notaInstinto from "../../datos-prueba/instinto-luv/nota.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import notaSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/nota.json";
import maxi1 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import notaMaxi from "../../datos-prueba/maxi-espindola-hagamos-que-pase/nota.json";
import type { NotaCelularProps } from "./NotaCelular";

/** 1:1 (pedido de Cotu) */
export const FORMATO_NOTA = { ancho: 1080, alto: 1080 } as const;

type Nota = { titulo: string; texto: string };
type Datos = { confesion: Nota; lista: Nota; borrador?: Nota } & Record<`letra-${string}`, Nota>;

const armar = (tema: Tema, modo: NotaCelularProps["modo"], nota: Nota, piel: NotaCelularProps["piel"]): NotaCelularProps => ({
  tema,
  piel,
  modo,
  titulo: nota.titulo,
  texto: nota.texto,
  velocidad: 14,
  fecha: "Hoy 9:40",
  mostrarTarjeta: true,
  franjaBotones: franjaOff,
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), datos: notaInstinto as Datos },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), datos: notaSol1 as Datos },
];

// Campana Maxi Espindola, tanda 1. C7 en piel clara. Las tres notas son
// distintas a proposito: en este molde el fragmento solo cambia el audio, asi
// que repetir texto daria dos piezas iguales en pantalla.
const nm = notaMaxi as Datos;
// PRUEBA del 2026-10-14: la nota lleva la letra literal del fragmento en vez de un
// texto escrito, idea de Cotu ("de ultima se puede escribir toda la letra de la
// cancion"). Pendiente de aprobacion; si no convence, C7 se da de baja como L09.
const maxiC7: { id: string; props: NotaCelularProps }[] = [
  { id: "Maxi-C7-F1", props: armar(temaSchema.parse(maxi1), "confesion", nm["letra-F1"], "clara") },
  { id: "Maxi-C7-F2", props: armar(temaSchema.parse(maxi2), "confesion", nm["letra-F2"], "clara") },
  { id: "Maxi-C7-F3", props: armar(temaSchema.parse(maxi3), "confesion", nm["letra-F3"], "clara") },
];

export const ejemplosNotaCelular: { id: string; props: NotaCelularProps }[] = [
  ...maxiC7,
  ...temas.flatMap(({ id, tema, datos }) => [
    { id: `Nota-Confesion-${id}`, props: armar(tema, "confesion", datos.confesion, "clara") },
    { id: `Nota-Lista-${id}`, props: armar(tema, "lista", datos.lista, "clara") },
  ]),
  // comparación: la misma nota en la piel oscura de la app
  ...temas.map(({ id, tema, datos }) => ({
    id: `Comparar-Nota-Oscura-${id}`,
    props: armar(tema, "confesion", datos.confesion, "oscura"),
  })),
];
