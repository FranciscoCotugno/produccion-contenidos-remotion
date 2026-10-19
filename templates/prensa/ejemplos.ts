// Datos de ejemplo del molde: las dos pieles, los dos medios y las
// comparaciones tipográficas para decidir en Studio.
//
// **Los titulares son propuestas, no texto aprobado.** El titular es una frase
// editorial que escribe una persona en la bajada de cada tema; acá están para
// que el molde tenga algo que mostrar y para poder comparar tipografías. Antes
// de usar cualquiera de estas piezas, Cotu tiene que aprobar el texto.

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import maxi1 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import type { PrensaProps } from "./Prensa";

export const FORMATOS_PRENSA = {
  "9x16": { ancho: 1080, alto: 1920 },
  "1x1": { ancho: 1080, alto: 1080 },
  "4x3": { ancho: 1440, alto: 1080 },
} as const;
export type FormatoPrensa = keyof typeof FORMATOS_PRENSA;

const tema = (datos: unknown): Tema => temaSchema.parse(datos);
const maxi = tema(maxi1);
const maxiB = tema(maxi3);
const fmk = tema(siSaleElSol1);

/**
 * TITULARES PROPUESTOS — pendientes de aprobación de Cotu.
 * Son descriptivos a propósito (quién y qué), que es lo que hace la referencia
 * ("La nueva del R&B Argentino"), y no afirmaciones que haya que sostener.
 */
export const TITULARES = {
  maxiFaja: "La nueva de Maxi Espindola 🇦🇷",
  maxiFaja2: "Lo que viene sonando de Maxi Espindola 🎸",
  fmkFaja: "FMK volvió, y volvió cantando 🔥",
  maxiPanel: "Maxi Espindola estrena *Hagamos que pase*",
  fmkPanel: "FMK vuelve con *Si sale el sol*",
};

/** P1, editorial: sobrio, paleta neutra. */
const P1 = { marca: "LA PÚA", color: "#17171A", destacado: "#D8B26A" };
/** P2, pop: colores fuertes. */
const P2 = { marca: "RADAR", color: "#E5007A", destacado: "#FFE34D" };

const SUBTITULO: PrensaProps["subtitulo"] = {
  mostrar: true,
  tamano: 34,
  peso: 400,
  italica: true,
  altura: 0.5,
  minuscula: true,
};

/** Piel A: el material enmarcado, el titular en la banda de arriba. */
const FAJA: Omit<PrensaProps, "tema" | "titular"> = {
  piel: "faja",
  video: { src: "", inicio: 0, oscurecer: 0, zoom: 1 },
  faja: {
    // marco y tira del mismo color: en la referencia se leen como una sola
    // banda negra, y el titular parece flotar sobre el borde del material
    colorMarco: "#000000",
    color: "#000000",
    alto: 130,
    // caja cuadrada: en la referencia el material es 1:1 dentro de un 9:16
    proporcion: 1,
    tipografia: "tiktok-sans",
    tamano: 46,
    peso: 600,
    colorTexto: "#FFFFFF",
  },
  panel: {
    lado: "derecha",
    ancho: 0.46,
    color: P2.color,
    marca: P2.marca,
    colorCajaMarca: "#FFFFFF",
    colorMarca: "#111111",
    tipografiaMarca: "tiktok-sans",
    tipografia: "tiktok-sans",
    tamano: 62,
    peso: 800,
    colorTexto: "#FFFFFF",
    colorDestacado: P2.destacado,
    bajada: "",
  },
  subtitulo: SUBTITULO,
  adelantoLectura: 3,
  franjaBotones: franjaOff,
};

/** Piel B: la pantalla partida con el panel de marca. */
const PANEL: Omit<PrensaProps, "tema" | "titular"> = {
  ...FAJA,
  piel: "panel",
  subtitulo: { ...SUBTITULO, altura: 0.82, tamano: 30, peso: 700, italica: false },
};

const conVideo = (
  base: Omit<PrensaProps, "tema" | "titular">,
  t: Tema,
  titular: string,
  extra: Partial<PrensaProps> = {},
): PrensaProps => ({
  ...base,
  tema: t,
  titular,
  video: { ...base.video, src: t.fragment.src, inicio: t.fragment.start },
  ...extra,
});

type Ejemplo = { id: string; formato: FormatoPrensa; props: PrensaProps };

const base: Ejemplo[] = [
  // piel A, los dos temas y dos titulares distintos
  { id: "Prensa-Faja-Maxi-9x16", formato: "9x16", props: conVideo(FAJA, maxi, TITULARES.maxiFaja) },
  { id: "Prensa-Faja-MaxiF3-9x16", formato: "9x16", props: conVideo(FAJA, maxiB, TITULARES.maxiFaja2) },
  { id: "Prensa-Faja-FMK-9x16", formato: "9x16", props: conVideo(FAJA, fmk, TITULARES.fmkFaja) },
  // a sangre, sin marco
  {
    id: "Prensa-Faja-ASangre-9x16",
    formato: "9x16",
    props: conVideo(FAJA, maxi, TITULARES.maxiFaja, {
      faja: { ...FAJA.faja, proporcion: 0, color: "rgba(0,0,0,0.82)" },
    }),
  },

  // piel B, los dos medios
  { id: "Prensa-Panel-P2-Maxi-9x16", formato: "9x16", props: conVideo(PANEL, maxi, TITULARES.maxiPanel) },
  {
    id: "Prensa-Panel-P1-FMK-9x16",
    formato: "9x16",
    props: conVideo(PANEL, fmk, TITULARES.fmkPanel, {
      panel: {
        ...PANEL.panel,
        color: P1.color,
        marca: P1.marca,
        colorDestacado: P1.destacado,
        tipografia: "fraunces",
        peso: 700,
        bajada: "El disco sale\nel viernes",
      },
    }),
  },

  // otros formatos
  { id: "Prensa-Faja-Maxi-1x1", formato: "1x1", props: conVideo(FAJA, maxi, TITULARES.maxiFaja) },
  { id: "Prensa-Panel-P2-Maxi-4x3", formato: "4x3", props: conVideo(PANEL, maxi, TITULARES.maxiPanel) },
];

/** Las direcciones tipográficas, que es la decisión principal del molde. */
const comparar: Ejemplo[] = [
  // faja: nativo, editorial, o captura de noticia
  { id: "Comparar-Faja-TikTokSans", formato: "9x16", props: conVideo(FAJA, maxi, TITULARES.maxiFaja) },
  {
    id: "Comparar-Faja-Geist",
    formato: "9x16",
    props: conVideo(FAJA, maxi, TITULARES.maxiFaja, { faja: { ...FAJA.faja, tipografia: "geist", peso: 500 } }),
  },
  {
    id: "Comparar-Faja-Arimo",
    formato: "9x16",
    props: conVideo(FAJA, maxi, TITULARES.maxiFaja, { faja: { ...FAJA.faja, tipografia: "arimo", peso: 700 } }),
  },

  // panel: nativo, titular de diario, o editorial con serifas
  { id: "Comparar-Panel-TikTokSans", formato: "9x16", props: conVideo(PANEL, maxi, TITULARES.maxiPanel) },
  {
    id: "Comparar-Panel-ArchivoNarrow",
    formato: "9x16",
    props: conVideo(PANEL, maxi, TITULARES.maxiPanel, {
      panel: { ...PANEL.panel, tipografia: "archivo-narrow", peso: 700, tamano: 74 },
    }),
  },
  {
    id: "Comparar-Panel-Fraunces",
    formato: "9x16",
    props: conVideo(PANEL, maxi, TITULARES.maxiPanel, {
      panel: { ...PANEL.panel, tipografia: "fraunces", peso: 700, tamano: 66 },
    }),
  },

  // alto de la faja
  {
    id: "Comparar-Faja-Alta",
    formato: "9x16",
    props: conVideo(FAJA, maxi, TITULARES.maxiFaja, { faja: { ...FAJA.faja, alto: 190 } }),
  },
  {
    id: "Comparar-Faja-Baja",
    formato: "9x16",
    props: conVideo(FAJA, maxi, TITULARES.maxiFaja, { faja: { ...FAJA.faja, alto: 96 } }),
  },

  // con subtítulo de la letra y sin él
  { id: "Comparar-Subtitulo-Con", formato: "9x16", props: conVideo(FAJA, maxi, TITULARES.maxiFaja) },
  {
    id: "Comparar-Subtitulo-Sin",
    formato: "9x16",
    props: conVideo(FAJA, maxi, TITULARES.maxiFaja, { subtitulo: { ...SUBTITULO, mostrar: false } }),
  },
];

export const ejemplosPrensa: Ejemplo[] = [...base, ...comparar];
