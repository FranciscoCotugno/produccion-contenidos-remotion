// Datos de ejemplo del molde: con qué tema, piel y formato se arma cada
// composición en Studio.

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import maxi1 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import type { PanelLetraProps } from "./PanelLetra";

export const FORMATOS_PANEL = {
  "9x16": { ancho: 1080, alto: 1920 },
  "1x1": { ancho: 1080, alto: 1080 },
  "3x4": { ancho: 1080, alto: 1440 },
  // 4:3 apaisado: el de las cuentas con mejores números del relevamiento
  "4x3": { ancho: 1440, alto: 1080 },
} as const;
export type FormatoPanel = keyof typeof FORMATOS_PANEL;

const tema = (datos: unknown): Tema => temaSchema.parse(datos);

const maxi = tema(maxi1);
const maxiB = tema(maxi2);
const fmk = tema(siSaleElSol1);
/** la misma portada de Maxi, desaturada, para ver cómo resuelve el fondo en blanco y negro */
const maxiBN: Tema = { ...maxi, cover: "media/maxi-espindola-hagamos-que-pase/portada-bn.jpg" };
/**
 * Una portada sin color deja un fondo gris parejo y las líneas atenuadas se
 * leen como manchas en vez de como profundidad. Se arregla oscureciendo más:
 * por eso `oscurecer` es prop. Misma receta para cualquier portada apagada.
 */
const FONDO_BN = { desenfoque: 105, oscurecer: 0.52, escala: 1.4, color: "", vineta: 0.45 };

/**
 * Piel A, de la referencia 03-portada-blureada (@lyrics.elpipon). Medido sobre
 * su cuadro a 1080×1920: letra de ~78 px, renglones cada 108 px, columna desde
 * x=92 y línea activa centrada en y≈790 (el 41 % del alto).
 *
 * El margen derecho es 155 y no 130 para que la línea que suena no se meta
 * abajo de la columna de botones de TikTok en 9:16.
 */
const DESENFOQUE: Omit<PanelLetraProps, "tema"> = {
  piel: "desenfoque",
  fondo: { desenfoque: 105, oscurecer: 0.24, escala: 1.4, color: "", vineta: 0.38 },
  letra: {
    tipografia: "inter",
    tamano: 78,
    peso: 700,
    interlineado: 108,
    aireBloque: 54,
    margenIzquierdo: 92,
    margenDerecho: 155,
  },
  atenuar: {
    lineasArriba: 2,
    lineasAbajo: 4,
    opacidadMin: 0.14,
    desenfoqueMax: 16,
    // lo que ya se cantó se apaga más rápido que lo que viene (como en la
    // referencia): con la misma distancia, la de arriba queda más borrada
    curvaArriba: 0.4,
    curvaAbajo: 0.6,
  },
  anclaje: 0.41,
  arranque: 0.24,
  desplazamiento: "saltos",
  transicion: 8,
  encabezado: "completo",
  boton: true,
  interludio: { activo: false, segundos: 4 },
  ajusteLetra: 0,
  adelantoLectura: 3,
  franjaBotones: franjaOff,
};

/**
 * Piel B, de la referencia 08-spotify. Letra más chica (entran 8 a 10 líneas),
 * fondo de color liso y las inactivas solo transparentadas, sin desenfoque.
 */
const LISO: Omit<PanelLetraProps, "tema"> = {
  ...DESENFOQUE,
  piel: "liso",
  fondo: { desenfoque: 0, oscurecer: 0, escala: 1, color: "", vineta: 0.2 },
  letra: {
    tipografia: "inter",
    tamano: 68,
    peso: 700,
    interlineado: 82,
    aireBloque: 28,
    margenIzquierdo: 66,
    margenDerecho: 155,
  },
  // sin desenfoque que dé profundidad, la pantalla se llena de líneas: se ven
  // muchas más que en la piel A y el apagado es parejo para los dos lados
  atenuar: { lineasArriba: 6, lineasAbajo: 8, opacidadMin: 0.26, desenfoqueMax: 0, curvaArriba: 0.8, curvaAbajo: 0.8 },
  anclaje: 0.34,
  arranque: 0.13,
  encabezado: "minimo",
  boton: false,
  interludio: { activo: true, segundos: 4 },
};

type Ejemplo = { id: string; formato: FormatoPanel; props: PanelLetraProps };

/** Las dos pieles con los dos temas, en los cuatro formatos de salida. */
const base: Ejemplo[] = [
  { id: "PanelLetra-Desenfoque-Maxi-9x16", formato: "9x16", props: { ...DESENFOQUE, tema: maxi } },
  { id: "PanelLetra-Desenfoque-Maxi-1x1", formato: "1x1", props: { ...DESENFOQUE, tema: maxi } },
  { id: "PanelLetra-Desenfoque-Maxi-3x4", formato: "3x4", props: { ...DESENFOQUE, tema: maxi } },
  { id: "PanelLetra-Desenfoque-Maxi-4x3", formato: "4x3", props: { ...DESENFOQUE, tema: maxi } },
  // la portada de FMK ya es oscura: con el oscurecido de siempre el fondo queda
  // pesado, así que va más bajo. Es el mismo caso que la de blanco y negro al revés.
  {
    id: "PanelLetra-Desenfoque-FMK-9x16",
    formato: "9x16",
    props: { ...DESENFOQUE, tema: fmk, fondo: { ...DESENFOQUE.fondo, oscurecer: 0.1 } },
  },
  { id: "PanelLetra-Desenfoque-MaxiF2-9x16", formato: "9x16", props: { ...DESENFOQUE, tema: maxiB } },
  // la misma portada en blanco y negro: ahí se ve si el fondo está bien resuelto
  { id: "PanelLetra-Desenfoque-MaxiBN-9x16", formato: "9x16", props: { ...DESENFOQUE, tema: maxiBN, fondo: FONDO_BN } },

  { id: "PanelLetra-Liso-Maxi-9x16", formato: "9x16", props: { ...LISO, tema: maxi } },
  { id: "PanelLetra-Liso-Maxi-1x1", formato: "1x1", props: { ...LISO, tema: maxi } },
  { id: "PanelLetra-Liso-Maxi-3x4", formato: "3x4", props: { ...LISO, tema: maxi } },
  { id: "PanelLetra-Liso-Maxi-4x3", formato: "4x3", props: { ...LISO, tema: maxi } },
  { id: "PanelLetra-Liso-FMK-9x16", formato: "9x16", props: { ...LISO, tema: fmk } },
  { id: "PanelLetra-Liso-MaxiBN-9x16", formato: "9x16", props: { ...LISO, tema: maxiBN } },
];

/** Comparaciones para decidir en Studio (ver FICHA, "Para decidir en Studio"). */
const comparar: Ejemplo[] = [
  // 1. curva del desenfoque: cuánto tiene la vecina inmediata
  {
    id: "Comparar-Curva-Suave",
    formato: "9x16",
    props: { ...DESENFOQUE, tema: maxi, atenuar: { ...DESENFOQUE.atenuar, curvaAbajo: 0.6, curvaArriba: 0.5 } },
  },
  { id: "Comparar-Curva-Media", formato: "9x16", props: { ...DESENFOQUE, tema: maxi } },
  {
    id: "Comparar-Curva-Marcada",
    formato: "9x16",
    props: { ...DESENFOQUE, tema: maxi, atenuar: { ...DESENFOQUE.atenuar, curvaAbajo: 2.4, curvaArriba: 1.6 } },
  },

  // 2. cuántas líneas se ven
  {
    id: "Comparar-Lineas-Pocas",
    formato: "9x16",
    props: { ...DESENFOQUE, tema: maxi, atenuar: { ...DESENFOQUE.atenuar, lineasArriba: 1, lineasAbajo: 3 } },
  },
  {
    id: "Comparar-Lineas-Muchas",
    formato: "9x16",
    props: { ...DESENFOQUE, tema: maxi, atenuar: { ...DESENFOQUE.atenuar, lineasArriba: 3, lineasAbajo: 6 } },
  },

  // 3. desplazamiento de la columna
  { id: "Comparar-Desplazamiento-Saltos", formato: "9x16", props: { ...DESENFOQUE, tema: maxi } },
  { id: "Comparar-Desplazamiento-Continuo", formato: "9x16", props: { ...DESENFOQUE, tema: maxi, desplazamiento: "continuo" } },

  // 4. tipografía
  { id: "Comparar-Tipografia-Inter", formato: "9x16", props: { ...DESENFOQUE, tema: maxi } },
  {
    id: "Comparar-Tipografia-TikTokSans",
    formato: "9x16",
    props: { ...DESENFOQUE, tema: maxi, letra: { ...DESENFOQUE.letra, tipografia: "tiktok" } },
  },

  // 5. encabezado
  { id: "Comparar-Encabezado-Completo", formato: "9x16", props: { ...DESENFOQUE, tema: maxi } },
  { id: "Comparar-Encabezado-SinBoton", formato: "9x16", props: { ...DESENFOQUE, tema: maxi, boton: false } },
  { id: "Comparar-Encabezado-Minimo", formato: "9x16", props: { ...DESENFOQUE, tema: maxi, encabezado: "minimo" } },
  { id: "Comparar-Encabezado-Ninguno", formato: "9x16", props: { ...DESENFOQUE, tema: maxi, encabezado: "ninguno" } },

  // 6. el símbolo de interludio. Ningún tema de prueba tiene un tramo
  // instrumental largo (el hueco más grande de Maxi es de 0,4 s), así que el
  // umbral va bajo a propósito: es para ver cómo se ve el símbolo, no un valor
  // de producción. En un tema con un puente instrumental, el de siempre (4 s)
  // lo marca solo.
  {
    id: "Comparar-Interludio",
    formato: "9x16",
    props: { ...LISO, tema: maxi, interludio: { activo: true, segundos: 0.3 } },
  },
];

export const ejemplosPanelLetra: Ejemplo[] = [...base, ...comparar];
