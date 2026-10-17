// Datos de ejemplo del molde: con qué tema, piel y modo de texto se arma
// cada composición en Studio.

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import siSaleElSol2 from "../../datos-prueba/fmk-si-sale-el-sol-2/tema.json";
import agua from "../../datos-prueba/agua/tema.json";
import aQuienLeImporta from "../../datos-prueba/a-quien-le-importa/tema.json";
import maxi1 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1/tema.json";
import maxi1b from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1b/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import reproductorMaxi from "../../datos-prueba/maxi-espindola-hagamos-que-pase/reproductor.json";
import type { ReproductorAppProps } from "./ReproductorApp";

// Reemplazo para los temas cuyo clip todavía no está en assets/media/: un
// video de referencias copiado a assets/media/_reemplazo/clip.mp4 (42 s),
// desde el segundo 0 y con la duración del fragmento real.
const CLIP_REEMPLAZO = "media/_reemplazo/clip.mp4";

const tema = (datos: unknown, { reemplazo }: { reemplazo: boolean }): Tema => {
  const t = temaSchema.parse(datos);
  if (!reemplazo) return t;
  return { ...t, fragment: { src: CLIP_REEMPLAZO, start: 0, end: t.fragment.end - t.fragment.start } };
};

const base: Omit<ReproductorAppProps, "tema"> = {
  piel: "apple-oscura",
  texto: { modo: "letra", fijo: "" },
  ajusteLetra: 0,
  adelantoLectura: 3,
  audio: { src: "", start: 0 },
  zoomPortada: 1,
  revelado: "linea",
  pesoLetra: "bold",
  centrar: "pantalla",
  desenfoqueFondo: 38,
  franjaBotones: franjaOff,
};

const instinto = tema(instintoLuv, { reemplazo: false });
// Campana Maxi Espindola, tanda 1. L05 va en piel Apple oscura. L06 y L13 no
// tienen piel todavia, asi que sus piezas se suman a L05 (Cotu, 2026-10-07).
const maxiL05: { id: string; props: ReproductorAppProps }[] = [
  { id: "Maxi-L05-F1", props: { ...base, tema: tema(maxi1, { reemplazo: false }) } },
  { id: "Maxi-L05-F1b", props: { ...base, tema: tema(maxi1b, { reemplazo: false }), texto: { modo: "fijo", fijo: reproductorMaxi["l05-fijo"] } } },
  { id: "Maxi-L05-F2", props: { ...base, tema: tema(maxi2, { reemplazo: false }) } },
  { id: "Maxi-L05-F3", props: { ...base, tema: tema(maxi3, { reemplazo: false }) } },
];

export const ejemplosReproductorApp: { id: string; props: ReproductorAppProps }[] = [
  { id: "ReproductorApp-AppleOscura-InstintoLuv", props: { ...base, tema: instinto } },
  {
    // mismo tema con el audio del tema completo; el fragmento cae en el 11,33 s
    id: "ReproductorApp-AppleOscura-InstintoLuv-AudioAparte",
    props: { ...base, tema: instinto, audio: { src: "media/santy-p-insintoluv/santy-p-instintoluv.MP3", start: 11.33 } },
  },
  {
    id: "ReproductorApp-AppleOscura-TextoFijo",
    props: { ...base, tema: instinto, texto: { modo: "fijo", fijo: "esta va para vos" } },
  },
  // Si sale el sol (FMK), los dos fragmentos de la campaña; el sello pide letra fina
  {
    id: "ReproductorApp-AppleOscura-SiSaleElSol-1",
    props: { ...base, tema: tema(siSaleElSol1, { reemplazo: false }), pesoLetra: "light" },
  },
  {
    id: "ReproductorApp-AppleOscura-SiSaleElSol-2",
    props: { ...base, tema: tema(siSaleElSol2, { reemplazo: false }), pesoLetra: "light" },
  },
  ...maxiL05,
  // Comparaciones para decidir en Studio
  { id: "Comparar-Peso-Bold", props: { ...base, tema: instinto, pesoLetra: "bold" } },
  { id: "Comparar-Peso-SemiBold", props: { ...base, tema: instinto, pesoLetra: "semibold" } },
  { id: "ReproductorApp-AppleOscura-Agua", props: { ...base, tema: tema(agua, { reemplazo: true }) } },
  {
    id: "ReproductorApp-AppleOscura-AQuienLeImporta",
    props: { ...base, tema: tema(aQuienLeImporta, { reemplazo: true }) },
  },
];
