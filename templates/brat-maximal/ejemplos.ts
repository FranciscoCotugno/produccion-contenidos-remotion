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
 * El molde nacio en 1:1, como su referencia. Se le suman 9:16 y 4:3 el
 * 2026-10-20 para la campana de Maluma: los clips son verticales y apaisados,
 * y en 1:1 se recortaban feo. Las piezas que no declaran formato siguen en 1:1.
 */
export const FORMATOS_BRAT_MAXIMAL = {
  "1x1": { ancho: 1080, alto: 1080 },
  "9x16": { ancho: 1080, alto: 1920 },
  "4x3": { ancho: 1440, alto: 1080 },
} as const;
export type FormatoBratMaximal = keyof typeof FORMATOS_BRAT_MAXIMAL;

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

// ───────────────────────────────────────────────────────────────────────────
// CAMPAÑA MALUMA BEBOTEO (Fenix): las piezas que van con la opción C.
// Las de la opción A están en templates/letra-sobre-video/ejemplos.ts.
// El reparto lo armó Cotu; el estilo se va alternando entre las dos.
// ───────────────────────────────────────────────────────────────────────────

import felicesLos4 from "../../datos-prueba/maluma-felices-los-4/tema.json";
import borroCassette from "../../datos-prueba/maluma-borro-cassette/tema.json";
import cuatroBabies1 from "../../datos-prueba/maluma-cuatro-babies-1/tema.json";
import aguaEstribillo from "../../datos-prueba/maluma-agua-estribillo/tema.json";

const bebC = (
  clip: string,
  datos: unknown,
  formato: FormatoBratMaximal = "9x16",
  inicio = 0,
): BratMaximalProps => ({
  ...armar(temaSchema.parse(datos)),
  video: { src: `media/maluma-beboteo/beboteo-${clip}.mp4`, inicio, desenfoque: 0, brillo: 0.78 },
  tamanoLetra: formato === "4x3" ? 96 : 88,
});

export const beboteoC: { id: string; formato: FormatoBratMaximal; props: BratMaximalProps }[] = [
  { id: "Beb-07-FelicesLos4", formato: "9x16", props: bebC("07", felicesLos4) },
  { id: "Beb-15-BorroCassette", formato: "9x16", props: bebC("15", borroCassette) },
  { id: "Beb-03-Agua", formato: "9x16", props: bebC("03", aguaEstribillo) },
  { id: "Beb-21-BorroCassette", formato: "9x16", props: bebC("21", borroCassette) },
  // apaisado: sale en 4:3. Arranca en el segundo 3 (pedido de Cotu)
  { id: "Beb-13-CuatroBabies1", formato: "4x3", props: bebC("13", cuatroBabies1, "4x3", 3) },
];
