// Molde brat-maximal (L02, L03): las frases de la letra en blanco, gigantes,
// ocupando casi todo el cuadro, sobre material del artista desenfocado (sin
// tinte, pedido de Cotu). Ver FICHA.md. Sale en 1:1 (1080×1080), como la referencia.
//
// Tomado de LyricPunch (automatizacion-kioscos): el tratamiento del video
// (contraste, menos saturación) y el golpe al ritmo. Pero acá va la frase
// entera: las líneas largas se parten en frases cortas, como en la referencia.

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  Html5Video,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { TIKTOK_SANS } from "../../shared/fonts";
import { beatPulse } from "../../shared/effects";
import { SafeZone, safeArea, safeZoneSchema } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";

export const bratMaximalSchema = z.object({
  tema: temaSchema,
  /** video de fondo, sin sonido (el audio es el del tema), ruta dentro de assets/ */
  video: z.object({
    src: z.string(),
    inicio: z.number().min(0),
    /** desenfoque del video, en px (0 = nítido) */
    desenfoque: z.number().min(0).max(40).step(1),
    /** brillo del video (1 = el original): más bajo, para que la letra blanca se lea */
    brillo: z.number().min(0.4).max(1).step(0.05),
  }),
  /** golpe de zoom al ritmo sobre el video (usa tema.beats) */
  golpeBeat: z.boolean(),
  /** máximo de palabras por frase: las líneas más largas se parten */
  palabrasPorFrase: z.number().int().min(2).max(10),
  /** cuadros que cada frase aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  safeZone: safeZoneSchema,
});
export type BratMaximalProps = z.infer<typeof bratMaximalSchema>;

/** La duración sale del fragmento: inicio y fin. */
export const duracionBratMaximal: CalculateMetadataFunction<BratMaximalProps> = ({ props }) => ({
  durationInFrames: Math.max(1, Math.round((props.tema.fragment.end - props.tema.fragment.start) * 30)),
});

/** El texto, medido sobre la referencia (a 1080 de ancho). */
const TEXTO = {
  peso: 400,
  interlineado: 1.08,
  /** el bloque no pasa de la zona libre menos este margen, a cada lado */
  margen: 50,
  /** tamaño máximo: una frase de una o dos palabras no crece más que esto */
  maxPx: 240,
  maxRenglones: 3,
};

// --- frases --------------------------------------------------------------------

type Frase = { t: number; palabras: string[] };

/** Palabras con las que una frase no puede terminar: quedan colgando ("Es una adicción que"). */
const COLGANTES = new Set(
  "a al ante con de del el en la las le les lo los me mi mis o para pero por que qué se si sin su sus te tu tus un una uno y ya e ni nos".split(" "),
);
const cuelga = (w: string) => COLGANTES.has(w.toLocaleLowerCase("es").replace(/[^\p{L}]/gu, ""));

/**
 * Parte cada línea en frases de hasta `max` palabras, parejas (7 palabras con
 * máx. 4 → 4 + 3). Si el corte deja colgando una palabra como "que" o "a", se
 * corre una palabra para un lado o el otro.
 */
const frases = (tema: Tema, max: number): Frase[] =>
  tema.lyrics.flatMap((l) => {
    const n = l.words.length;
    const partes = Math.ceil(n / max);
    const out: Frase[] = [];
    let desde = 0;
    for (let p = 0; p < partes; p++) {
      const resto = n - desde;
      let cuantas = Math.round(resto / (partes - p));
      if (p < partes - 1) {
        const candidatas = [cuantas, cuantas - 1, cuantas + 1].filter((c) => c >= 2 && c <= max + 1 && resto - c >= 1);
        cuantas = candidatas.find((c) => !cuelga(l.words[desde + c - 1].text)) ?? cuantas;
      }
      const ws = l.words.slice(desde, desde + cuantas);
      out.push({ t: ws[0].t, palabras: ws.map((w) => w.text) });
      desde += cuantas;
    }
    return out;
  });

// --- medida y diagramación -------------------------------------------------------

const fuente = (px: number) => `${TEXTO.peso} ${px}px ${TIKTOK_SANS}`;

/** Espera a que el canvas mida con TikTok Sans de verdad (y no con la de respaldo). */
const useTipografiaLista = () => {
  const [lista, setLista] = useState(false);
  const [handle] = useState(() => delayRender("tipografía de las frases"));
  useEffect(() => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    const muestra = "Te traje todo lo mío";
    const mide = (f: string) => {
      ctx.font = f;
      return ctx.measureText(muestra).width;
    };
    let intentos = 0;
    const esperar = () => {
      if (Math.abs(mide(`100px ${TIKTOK_SANS.replace(/, .*$/, "")}, monospace`) - mide("100px monospace")) > 1) {
        setLista(true);
        continueRender(handle);
      } else if (++intentos > 200) {
        cancelRender(new Error("TikTok Sans no se aplica al medir"));
      } else {
        setTimeout(esperar, 25);
      }
    };
    document.fonts.load(fuente(100)).then(esperar, (err) => cancelRender(err));
  }, [handle]);
  return lista;
};

/**
 * La frase lo más grande posible dentro de la caja, en 1 a 3 renglones: se
 * prueban todos los cortes y gana el de letra más grande (a igual tamaño, el
 * más parejo).
 */
const diagramar = (palabras: string[], anchoCaja: number, altoCaja: number) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = fuente(100);
  const w = palabras.map((p) => ctx.measureText(p).width);
  const espacio = ctx.measureText(" ").width;
  const anchoRenglon = (a: number, b: number) => w.slice(a, b).reduce((s, x) => s + x, 0) + espacio * (b - a - 1);

  let mejor = { px: 0, renglones: [palabras.join(" ")], desparejo: Infinity };
  const n = palabras.length;
  const probar = (cortes: number[]) => {
    const limites = [0, ...cortes, n];
    const anchos = limites.slice(0, -1).map((a, k) => anchoRenglon(a, limites[k + 1]));
    const r = anchos.length;
    const px = Math.min(TEXTO.maxPx, (anchoCaja / Math.max(...anchos)) * 100, altoCaja / (r * TEXTO.interlineado));
    const desparejo = Math.max(...anchos) - Math.min(...anchos);
    if (px > mejor.px + 0.5 || (Math.abs(px - mejor.px) <= 0.5 && desparejo < mejor.desparejo)) {
      mejor = { px, renglones: limites.slice(0, -1).map((a, k) => palabras.slice(a, limites[k + 1]).join(" ")), desparejo };
    }
  };
  probar([]);
  for (let a = 1; a < n; a++) {
    probar([a]);
    if (TEXTO.maxRenglones >= 3) for (let b = a + 1; b < n; b++) probar([a, b]);
  }
  return { px: Math.floor(mejor.px), renglones: mejor.renglones };
};

// --- la pieza --------------------------------------------------------------------

export const BratMaximal: React.FC<BratMaximalProps> = ({ tema, video, golpeBeat, palabrasPorFrase, adelantoLectura, safeZone }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const area = safeArea(width, height);
  const lista = useTipografiaLista();

  const lista_frases = useMemo(() => frases(tema, palabrasPorFrase), [tema, palabrasPorFrase]);
  // la frase en pantalla: la última que ya arrancó (con el adelanto); la primera, desde el cuadro 0
  const tLetra = t + adelantoLectura / fps;
  let i = 0;
  lista_frases.forEach((f, k) => {
    if (tLetra >= f.t) i = k;
  });
  const frase = lista_frases[i];

  const caja = { ancho: area.width - 2 * TEXTO.margen, alto: area.height - 2 * TEXTO.margen };
  const diagrama = useMemo(
    () => (lista && frase ? diagramar(frase.palabras, caja.ancho, caja.alto) : null),
    [lista, frase, caja.ancho, caja.alto],
  );

  // el video: el tratamiento de LyricPunch y, si va, un golpe de zoom al ritmo
  const golpe = golpeBeat && tema.beats ? beatPulse(t, tema.beats) * 0.055 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* agrandado para que el desenfoque no deje bordes claros */}
      <AbsoluteFill style={{ transform: `scale(${1.02 + (video.desenfoque > 0 ? 0.06 : 0) + golpe})`, transformOrigin: "50% 35%" }}>
        <Html5Video
          src={staticFile(video.src)}
          trimBefore={Math.round(video.inicio * fps)}
          muted
          loop
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${video.desenfoque}px) brightness(${video.brillo})` }}
        />
      </AbsoluteFill>

      {diagrama && (
        <div
          style={{
            position: "absolute",
            left: area.left + TEXTO.margen,
            width: caja.ancho,
            top: (area.top + area.bottom) / 2,
            transform: "translateY(-50%)",
            textAlign: "center",
            fontFamily: TIKTOK_SANS,
            fontWeight: TEXTO.peso,
            fontSize: diagrama.px,
            lineHeight: TEXTO.interlineado,
            color: "#FFFFFF",
            textShadow: "0 3px 10px rgba(0,0,0,0.45), 0 0 28px rgba(0,0,0,0.25)",
            whiteSpace: "nowrap",
          }}
        >
          {diagrama.renglones.map((r, k) => (
            <div key={k}>{r}</div>
          ))}
        </div>
      )}

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <SafeZone config={safeZone} />
    </AbsoluteFill>
  );
};
