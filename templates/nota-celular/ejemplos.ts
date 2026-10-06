// Datos de ejemplo del molde: qué nota se escribe, con qué tema y en qué piel.
// Los textos salen de datos-prueba/<tema>/nota.json (de textos.txt): los
// escribe quien hace la bajada del tema.

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import notaInstinto from "../../datos-prueba/instinto-luv/nota.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import notaSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/nota.json";
import type { NotaCelularProps } from "./NotaCelular";

/** 1:1 (pedido de Cotu) */
export const FORMATO_NOTA = { ancho: 1080, alto: 1080 } as const;

type Nota = { titulo: string; texto: string };
type Datos = { confesion: Nota; lista: Nota };

const armar = (tema: Tema, modo: NotaCelularProps["modo"], nota: Nota, piel: NotaCelularProps["piel"]): NotaCelularProps => ({
  tema,
  piel,
  modo,
  titulo: nota.titulo,
  texto: nota.texto,
  velocidad: 14,
  fecha: "Hoy 9:40",
  mostrarTarjeta: true,
  safeZone: safeZoneOff,
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), datos: notaInstinto as Datos },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), datos: notaSol1 as Datos },
];

export const ejemplosNotaCelular: { id: string; props: NotaCelularProps }[] = [
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
