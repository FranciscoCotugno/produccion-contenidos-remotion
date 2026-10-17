// Datos de ejemplo del molde: las cuatro pieles relevadas, el modo de frase
// corta y las comparaciones para decidir en Studio.

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import maxi1 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import type { BloquePalabraProps } from "./BloquePalabra";

/**
 * 4:3 es el formato principal: las tres cuentas que sostienen este molde
 * publican así (@v.jxnior en 1440×1080, @omarmusicc_ y @01.91.h en 960×720), y
 * las reglas generales del 2026-10-17 lo respaldan. El análisis de la carpeta
 * decía "nosotros lo haríamos en 9:16", pero está escrito antes de esas reglas.
 */
export const FORMATOS_BLOQUE = {
  "4x3": { ancho: 1440, alto: 1080 },
  "9x16": { ancho: 1080, alto: 1920 },
  "1x1": { ancho: 1080, alto: 1080 },
} as const;
export type FormatoBloque = keyof typeof FORMATOS_BLOQUE;

const tema = (datos: unknown): Tema => temaSchema.parse(datos);
const maxi = tema(maxi1);
const maxiB = tema(maxi2);
const fmk = tema(siSaleElSol1);

const AMBAR = "#F2C21C";
const BLANCO = "#FFFFFF";
const DORADO = "#E8B45C";

/** Lo común a las cuatro pieles: la mecánica y la diagramación del bloque. */
const BASE: Omit<BloquePalabraProps, "tema" | "fondo" | "colores" | "adorno"> = {
  texto: {
    // cumple con FMK y Sony, y con el eje de ancho al 75 % queda angosta como
    // la referencia; el eje de inclinación da la itálica sin deformar
    tipografia: "tiktok-angosta",
    italica: true,
    mayuscula: true,
    // medido en el cuadro de @v.jxnior (1440×1080): la letra son ~105 px, que
    // sobre un cuadro de 1080 de ancho equivalen a 80
    tamano: 80,
    peso: 900,
    interlineado: 1.12,
    espaciado: 0,
    anchoCaja: 0.66,
    centroY: 0.5,
    sombra: 0.5,
    resplandorLetra: 0,
    ajustarAlAncho: 1,
  },
  bloque: { renglones: 3 },
  ajusteLetra: 0,
  adelantoLectura: 2,
  franjaBotones: franjaOff,
};

/** El apagado es el color del propio renglón, nunca un gris. */
const ALTERNA = {
  uno: AMBAR,
  dos: BLANCO,
  arrancaEn: 1 as const,
  alternancia: "por-bloque" as const,
  fantasma: 0.45,
};

const SIN_ADORNO = { cual: "ninguno" as const, color: DORADO, tamano: 54, altura: 0.94 };
/** Medida en la referencia: la estrella va abajo de todo, no pegada al bloque. */
const ESTRELLA = { cual: "estrella" as const, color: "#F5CE7A", tamano: 54, altura: 0.94 };

/** Las cuatro pieles relevadas. */
export const PIELES = {
  violeta: {
    fondo: { color: "#6E17C6", resplandor: 0.85, colorResplandor: "#A552F0", vineta: 0.7, textura: 0.08 },
    colores: ALTERNA,
    adorno: SIN_ADORNO,
  },
  magenta: {
    fondo: { color: "#B8197E", resplandor: 0.8, colorResplandor: "#E85AB4", vineta: 0.7, textura: 0.08 },
    colores: ALTERNA,
    adorno: SIN_ADORNO,
  },
  // azul marino y bordó son fondo plano: sin resplandor, sin textura, sin viñeta
  azul: {
    fondo: { color: "#14203F", resplandor: 0, colorResplandor: "", vineta: 0, textura: 0 },
    colores: { ...ALTERNA, uno: "#F3E7C9", dos: "", fantasma: 0.4 },
    adorno: ESTRELLA,
  },
  bordo: {
    fondo: { color: "#420A06", resplandor: 0, colorResplandor: "", vineta: 0, textura: 0 },
    colores: { ...ALTERNA, uno: DORADO, dos: BLANCO, fantasma: 0.4 },
    adorno: ESTRELLA,
  },
} as const;

const piel = (
  nombre: keyof typeof PIELES,
  t: Tema,
  extra: Partial<BloquePalabraProps> = {},
): BloquePalabraProps => ({ ...BASE, ...PIELES[nombre], tema: t, ...extra });

/**
 * Modo de frase corta (@plymusic5): la misma máquina con el bloque de un solo
 * renglón, letra más grande, separada y con resplandor, y sin itálica.
 */
const FRASE_CORTA = (t: Tema): BloquePalabraProps => ({
  ...piel("azul", t),
  texto: {
    ...BASE.texto,
    italica: false,
    tamano: 96,
    espaciado: 0.12,
    anchoCaja: 0.62,
    sombra: 0,
    resplandorLetra: 0.5,
    // en @plymusic5 todas las frases llenan el ancho, sean cortas o largas
    ajustarAlAncho: 2.2,
  },
  colores: { ...ALTERNA, uno: BLANCO, dos: "", fantasma: 0 },
  bloque: { renglones: 1 },
  adorno: SIN_ADORNO,
});

/** El bloque agrandado para los formatos altos. */
const VERTICAL = { ...BASE.texto, tamano: 100, anchoCaja: 0.84 };
const CUADRADO = { ...BASE.texto, tamano: 92, anchoCaja: 0.78 };

type Ejemplo = { id: string; formato: FormatoBloque; props: BloquePalabraProps };

const base: Ejemplo[] = [
  // las cuatro pieles, en el formato principal
  { id: "BloquePalabra-Violeta-4x3", formato: "4x3", props: piel("violeta", maxi) },
  { id: "BloquePalabra-Magenta-4x3", formato: "4x3", props: piel("magenta", maxi) },
  { id: "BloquePalabra-Azul-4x3", formato: "4x3", props: piel("azul", maxi) },
  { id: "BloquePalabra-Bordo-4x3", formato: "4x3", props: piel("bordo", maxi) },
  // Los otros formatos llevan el bloque más grande. El tamaño se mide sobre
  // 1080 de ancho, así que en un cuadro alto el bloque ocupa menos pantalla
  // aunque en el celular se vea igual de grande: en 9:16 conviene agrandarlo.
  { id: "BloquePalabra-Violeta-9x16", formato: "9x16", props: piel("violeta", maxi, { texto: VERTICAL }) },
  { id: "BloquePalabra-Violeta-1x1", formato: "1x1", props: piel("violeta", maxi, { texto: CUADRADO }) },
  // segundo tema y segundo fragmento, sin tocar código
  { id: "BloquePalabra-Magenta-FMK-4x3", formato: "4x3", props: piel("magenta", fmk) },
  { id: "BloquePalabra-Bordo-MaxiF2-4x3", formato: "4x3", props: piel("bordo", maxiB) },
  // frase corta
  { id: "BloquePalabra-FraseCorta-9x16", formato: "9x16", props: FRASE_CORTA(maxi) },
  { id: "BloquePalabra-FraseCorta-FMK-9x16", formato: "9x16", props: FRASE_CORTA(fmk) },
];

const comparar: Ejemplo[] = [
  // 1. renglones por bloque
  { id: "Comparar-Renglones-2", formato: "4x3", props: piel("violeta", maxi, { bloque: { renglones: 2 } }) },
  { id: "Comparar-Renglones-3", formato: "4x3", props: piel("violeta", maxi) },

  // 2. cuánto se ve la palabra apagada
  ...([0.2, 0.45, 0.65] as const).map((f) => ({
    id: `Comparar-Fantasma-${String(f).replace("0.", "")}`,
    formato: "4x3" as const,
    props: piel("violeta", maxi, { colores: { ...ALTERNA, fantasma: f } }),
  })),

  // 3. la alternancia de color: reiniciada en cada bloque o corrida
  { id: "Comparar-Alternancia-PorBloque", formato: "4x3", props: piel("violeta", maxi) },
  {
    id: "Comparar-Alternancia-Corrida",
    formato: "4x3",
    props: piel("violeta", maxi, { colores: { ...ALTERNA, alternancia: "corrida" } }),
  },

  // 4. tipografía e itálica
  { id: "Comparar-Tipografia-TikTokAngosta", formato: "4x3", props: piel("violeta", maxi) },
  {
    id: "Comparar-Tipografia-ArchivoNarrow",
    formato: "4x3",
    props: piel("violeta", maxi, { texto: { ...BASE.texto, tipografia: "archivo-narrow", peso: 700 } }),
  },
  {
    id: "Comparar-SinItalica",
    formato: "4x3",
    props: piel("violeta", maxi, { texto: { ...BASE.texto, italica: false } }),
  },

  // 5. el adorno
  { id: "Comparar-Adorno-Estrella", formato: "4x3", props: piel("violeta", maxi, { adorno: ESTRELLA }) },
  { id: "Comparar-Adorno-Ninguno", formato: "4x3", props: piel("violeta", maxi) },
];

export const ejemplosBloquePalabra: Ejemplo[] = [...base, ...comparar];
