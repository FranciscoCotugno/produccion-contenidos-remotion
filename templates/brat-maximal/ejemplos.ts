// Datos de ejemplo del molde: con qué tema y video se arma cada pieza.
// Sale en 1:1 (1080×1080), como la referencia.

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import maxi1a from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1a/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import aguaE1 from "../../datos-prueba/maluma-agua-estribillo-1/tema.json";
import aguaLyric from "../../datos-prueba/maluma-agua-lyric-1/tema.json";
import videosMaxi from "../../datos-prueba/maxi-espindola-hagamos-que-pase/videos.json";
import type { BratMaximalProps } from "./BratMaximal";

export const FORMATO_BRAT_MAXIMAL = { ancho: 1080, alto: 1080 } as const;

/**
 * El fondo es el videoclip del fragmento (L03). En L02 va material en vivo, con
 * el mismo tratamiento: no hay de prueba, así que hay un solo ejemplo por tema.
 */
/**
 * Rehecho el 2026-10-14 con la referencia 02-tipeo-ambar: video crudo (sin
 * desenfoque ni golpe al ritmo) y letra chica que se tipea. El color sale del
 * secundario del tema; se puede pisar por pieza con `colorLetra`.
 */
const armar = (tema: Tema, colorLetra = ""): BratMaximalProps => ({
  tema,
  video: { src: tema.fragment.src, inicio: tema.fragment.start, desenfoque: 0, brillo: 0.75 },
  colorLetra,
  tamanoLetra: 76,
  // entrada corta: la palabra aterriza con la voz
  entradaCuadros: 4,
  disposicion: "centrado" as const,
  palabrasPorFrase: 6,
  adelantoLectura: 3,
  franjaBotones: franjaOff,
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv) },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1) },
];

// Campana Maxi Espindola, tanda 1. L02 y L03 van con material en vivo (576 px de
// ancho): el desenfoque del molde (14) tapa la falta de resolucion. Siempre en
// mute, el audio es el del tema. Reparto de videos segun el plan.
const enVivo = (datos: unknown, idVideo: string, colorLetra = ""): BratMaximalProps => {
  const v = videosMaxi.envivo.find((x) => x.id === idVideo)!;
  // el material en vivo es de 576 px: un desenfoque chico lo salva sin tapar la imagen
  return { ...armar(temaSchema.parse(datos), colorLetra), video: { src: v.src, inicio: v.inicio, desenfoque: 4, brillo: 0.75 } };
};
const maxiMaximal: { id: string; props: BratMaximalProps }[] = [
  { id: "Maxi-L02-F1a", props: enVivo(maxi1a, "envivo-1") },
  { id: "Maxi-L02-F2", props: enVivo(maxi2, "envivo-3") },
  { id: "Maxi-L02-F3", props: enVivo(maxi3, "envivo-1") },
  { id: "Maxi-L03-F1a", props: enVivo(maxi1a, "envivo-2") },
  { id: "Maxi-L03-F2", props: enVivo(maxi2, "envivo-4") },
  { id: "Maxi-L03-F3", props: enVivo(maxi3, "envivo-4") },
  // Comparación de color: la misma pieza en blanco. Las de arriba van en el
  // secundario del tema (el naranja de la portada de Maxi).
  // AGUA: el estribillo con revelado palabra por palabra, para comparar contra
  // letra-sobre-video, que muestra la linea entera de golpe.
  { id: "Agua-Lyric-Maximal", props: armar(temaSchema.parse(aguaLyric), "#FFFFFF") },
  // vertEstribillo es 9:16 y el molde es 1:1: el video se recorta arriba y abajo
  { id: "Agua-Estribillo-Maximal", props: armar(temaSchema.parse(aguaE1), "#FFFFFF") },
  // Comparacion de disposiciones, para elegir como se acomoda el texto (2026-10-15)
  ...(["bloque", "centrado", "abajo"] as const).map((d) => ({
    id: `Comparar-BratMaximal-${d}`,
    props: { ...enVivo(maxi3, "envivo-1", "#FFFFFF"), disposicion: d },
  })),
];

export const ejemplosBratMaximal: { id: string; props: BratMaximalProps }[] = [
  ...temas.map(({ id, tema }) => ({ id: `BratMaximal-${id}`, props: armar(tema) })),
  ...maxiMaximal,
];

/** Opción C del pedido Fenix: la mecánica de este molde sobre el clip de Maluma. */
import cuatroBabies3 from "../../datos-prueba/maluma-cuatro-babies-3/tema.json";
export const opcionFenix: { id: string; props: BratMaximalProps }[] = [
  {
    id: "Fenix-Opcion-C-Maximal",
    props: {
      ...armar(temaSchema.parse(cuatroBabies3)),
      video: { src: "media/maluma-fenix/maluma-04.mp4", inicio: 0, desenfoque: 0, brillo: 0.8 },
      tamanoLetra: 92,
    },
  },
];
