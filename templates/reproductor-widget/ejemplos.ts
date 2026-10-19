// Datos de ejemplo del molde: con qué tema, piel, fondo y texto se arma cada
// pieza, y en qué formato. Los textos y las imágenes de prueba salen de
// datos-prueba/<tema>/widgets.json (textos de textos.txt).

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import widgetsInstinto from "../../datos-prueba/instinto-luv/widgets.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import widgetsSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/widgets.json";
import type { ReproductorWidgetProps } from "./ReproductorWidget";

/** El molde sale en tres formatos (pedido de Cotu). */
export const FORMATOS_WIDGET = {
  "9x16": { ancho: 1080, alto: 1920 },
  "1x1": { ancho: 1080, alto: 1080 },
  "3x4": { ancho: 1080, alto: 1440 },
} as const;
export type FormatoWidget = keyof typeof FORMATOS_WIDGET;

type Item = { texto: string; fondo: string };
type Widgets = { "c5-frase": Item; "c5-pregunta": Item; "c6-frase": Item };

const base = {
  posicion: "auto",
  ancho: 720,
  adelantoLectura: 3,
  franjaBotones: franjaOff,
} as const;

const conImagen = (tema: Tema, piel: ReproductorWidgetProps["piel"], item: Item, tinte: ReproductorWidgetProps["fondo"]["tinte"]): ReproductorWidgetProps => ({
  ...base,
  tema,
  piel,
  fondo: { tipo: "imagen", src: item.fondo, inicio: 0, zoom: 0.06, oscurecer: 0.35, tinte },
  texto: { modo: "fijo", fijo: item.texto },
});

/** L07: el videoclip de fondo y la letra que suena arriba del widget */
const conVideo = (tema: Tema): ReproductorWidgetProps => ({
  ...base,
  posicion: "centro",
  tema,
  piel: "vidrio",
  fondo: { tipo: "video", src: tema.fragment.src, inicio: tema.fragment.start, zoom: 0, oscurecer: 0.3, tinte: "ninguno" },
  texto: { modo: "letra", fijo: "" },
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), widgets: widgetsInstinto as Widgets },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), widgets: widgetsSol1 as Widgets },
];

export const ejemplosReproductorWidget: { id: string; formato: FormatoWidget; props: ReproductorWidgetProps }[] = temas.flatMap(({ id, tema, widgets }) => [
  // C5: el widget de vidrio con una frase, en los tres formatos
  ...(["9x16", "1x1", "3x4"] as const).map((formato) => ({
    id: `Widget-C5-Vidrio-Frase-${formato}-${id}`,
    formato,
    props: conImagen(tema, "vidrio", widgets["c5-frase"], "frio"),
  })),
  // C5: el negro compacto con una pregunta
  { id: `Widget-C5-Negro-Pregunta-9x16-${id}`, formato: "9x16" as const, props: conImagen(tema, "negro", widgets["c5-pregunta"], "frio") },
  // C6: el negro simple sobre una imagen cálida
  { id: `Widget-C6-Simple-Frase-9x16-${id}`, formato: "9x16" as const, props: conImagen(tema, "negro-simple", widgets["c6-frase"], "calido") },
  // L07: el videoclip con la letra
  { id: `Widget-L07-Vidrio-Letra-9x16-${id}`, formato: "9x16" as const, props: conVideo(tema) },
]);

/** Comparaciones para cerrar el molde (ver FICHA, "Para decidir en Studio"). */
const uno = temas[0];
const item = uno.widgets["c5-frase"];
export const compararWidget: { id: string; formato: FormatoWidget; props: ReproductorWidgetProps }[] = [
  // oscurecido de la imagen de fondo
  ...([0.2, 0.35, 0.55] as const).map((oscurecer) => ({
    id: `Comparar-Widget-Oscurecer-${String(oscurecer).replace("0.", "")}`,
    formato: "9x16" as const,
    props: {
      ...conImagen(uno.tema, "vidrio", item, "frio"),
      fondo: { ...conImagen(uno.tema, "vidrio", item, "frio").fondo, oscurecer },
    },
  })),
  // tinte
  ...(["ninguno", "frio", "calido"] as const).map((tinte) => ({
    id: `Comparar-Widget-Tinte-${tinte}`,
    formato: "9x16" as const,
    props: conImagen(uno.tema, "vidrio", item, tinte),
  })),
  // altura: automática contra fija al centro
  { id: "Comparar-Widget-Altura-Auto", formato: "9x16" as const, props: conImagen(uno.tema, "vidrio", item, "frio") },
  {
    id: "Comparar-Widget-Altura-Centro",
    formato: "9x16" as const,
    props: { ...conImagen(uno.tema, "vidrio", item, "frio"), posicion: "centro" },
  },
];
