// Molde brat-color: la escena de brat-puro con el color en movimiento. Ver
// FICHA.md. Variante de brat-puro para las mismas cuentas (L01, L12).
//
// - Por frase: cada frase nueva pasa al siguiente color de la paleta para el
//   fondo; la letra va en negro o blanco, la de más contraste.
// - Por beat (si el tema trae grilla), alternado: en los tiempos pares destella
//   el fondo, en los impares golpea el bloque. El fondo cambia como mucho una
//   vez cada 2 beats (cuidado con los destellos).

import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { useCurrentFrame, useVideoConfig, type CalculateMetadataFunction } from "remotion";
import { BratEscena, bratPuroSchema, fraseEnPantalla, tiempoLetra } from "../brat-puro/BratPuro";

export const bratColorSchema = bratPuroSchema.omit({ piel: true, golpeBeat: true }).extend({
  /** colores de fondo, en orden: uno por frase y vuelve a empezar */
  paleta: z.array(zColor()).min(2),
  /** destello del fondo en los tiempos pares: "invertir" (fondo y letra se cambian) o "siguiente" (el próximo color de la paleta) */
  destello: z.object({
    modo: z.enum(["invertir", "siguiente"]),
    /** cuánto dura el destello, en cuadros (0 = sin destello) */
    cuadros: z.number().int().min(0).max(8).step(1),
  }),
  /** escala extra del bloque en el golpe de los tiempos impares (0 = sin golpe) */
  golpeBloque: z.number().min(0).max(0.2).step(0.01),
  /** segundo (del fragmento) desde el que arranca la explosión */
  explosionDesde: z.number().min(0).step(0.1),
});

export type BratColorProps = z.infer<typeof bratColorSchema>;

/** La duración sale del fragmento: inicio y fin (igual que brat-puro). */
export const duracionBratColor: CalculateMetadataFunction<BratColorProps> = ({ props }) => {
  const s = props.tema.fragment.end - props.tema.fragment.start;
  return { durationInFrames: Math.max(1, Math.round(s * 30)) };
};

/** cuánto tarda en volver el golpe del bloque */
const CAIDA_GOLPE_S = 0.12;

const NEGRO = "#000000";
const BLANCO = "#ffffff";

/** negro o blanco, el que más contraste haga con el fondo */
const letraPara = (fondo: string) => {
  const c = fondo.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((k) => parseInt(c.length === 3 ? c[k / 2] + c[k / 2] : c.slice(k, k + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? NEGRO : BLANCO;
};

export const BratColor: React.FC<BratColorProps> = ({ paleta, destello, golpeBloque, explosionDesde, ...resto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { tema, ajusteLetra, adelantoLectura } = resto;

  // color por frase (antes de la primera, el de la primera); cambia junto con el bloque
  const frase = Math.max(0, fraseEnPantalla(tema, tiempoLetra(t, ajusteLetra, adelantoLectura, fps)));
  const fondoBase = paleta[frase % paleta.length];
  let colores = { fondo: fondoBase, letra: letraPara(fondoBase) };
  let escalaBloque = 1;

  // explosión al beat, alternada: pares destella el fondo, impares golpea el bloque
  const g = tema.beats;
  if (g && t >= explosionDesde && t >= g.first) {
    const n = Math.floor((t - g.first) / g.period);
    const desde = t - (g.first + n * g.period);
    if (n % 2 === 0) {
      if (desde * fps < destello.cuadros) {
        colores =
          destello.modo === "invertir"
            ? { fondo: colores.letra, letra: colores.fondo }
            : (() => {
                const otro = paleta[(frase + 1) % paleta.length];
                return { fondo: otro, letra: letraPara(otro) };
              })();
      }
    } else {
      escalaBloque = 1 + golpeBloque * Math.exp(-desde / CAIDA_GOLPE_S);
    }
  }

  return <BratEscena {...resto} colores={colores} escalaBloque={escalaBloque} />;
};
