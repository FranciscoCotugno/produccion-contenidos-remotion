// Molde letra-sobre-video (L08, L11, POV1 a POV8): un video a pantalla completa
// con texto encima, en el estilo del texto nativo de la app (el que escribe un
// usuario con la herramienta de texto): TikTok Sans blanco, chico, centrado, sin
// caja y con una sombra leve. Un solo estilo para todas las cuentas (pedido de
// Cotu). Ver FICHA.md.
//
// El video va sin sonido: el audio del tema entra por su lado, con su fragmento
// (el material de nicho no tiene sonido). Sale en 9:16, 1:1 y 3:4.

import React from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  Html5Video,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { TIKTOK_SANS } from "../../shared/fonts";
import { activeLineIndex, lineStarts } from "../../shared/lyrics";
import { SafeZone, safeArea, safeZoneSchema } from "../../shared/SafeZone";
import { temaSchema } from "../../shared/tema";

export const letraSobreVideoSchema = z.object({
  tema: temaSchema,
  /** video de fondo, sin sonido, ruta dentro de assets/; se repite si es más corto que el fragmento */
  video: z.object({
    src: z.string(),
    /** segundo del video donde arranca */
    inicio: z.number().min(0),
    /** oscurecido (0-1), para que el texto se lea sobre fondos claros */
    oscurecer: z.number().min(0).max(0.8).step(0.05),
  }),
  /**
   * letra: la letra sincronizada, línea por línea; fija: una línea durante todo
   * el video; hook: un texto fijo; hook-letra: el hook y, más abajo, la letra.
   */
  modo: z.enum(["letra", "fija", "hook", "hook-letra"]),
  /** el texto de los modos fija, hook y hook-letra */
  textoFijo: z.string(),
  /** dónde va el hook (o la línea fija): en el tercio de arriba o al centro */
  posicionHook: z.enum(["arriba", "centro"]),
  /** cuadros que cada línea de letra aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  safeZone: safeZoneSchema,
});
export type LetraSobreVideoProps = z.infer<typeof letraSobreVideoSchema>;

/** La duración sale del fragmento: inicio y fin. */
export const duracionLetraSobreVideo: CalculateMetadataFunction<LetraSobreVideoProps> = ({ props }) => ({
  durationInFrames: Math.max(1, Math.round((props.tema.fragment.end - props.tema.fragment.start) * 30)),
});

/** El texto nativo de la app, medido sobre las referencias (a 1080 de ancho). */
const TEXTO = {
  px: 52,
  peso: 500,
  interlineado: 1.22,
  /** ancho máximo: en las referencias el texto corta en renglones cortos, de 3 a 5 palabras */
  ancho: 640,
  sombra: "0 1px 4px rgba(0,0,0,0.6), 0 0 14px rgba(0,0,0,0.25)",
  /** cuadros del fundido de entrada de cada línea de letra */
  fundido: 4,
};

const Texto: React.FC<{ texto: string; centroY: number; opacidad?: number }> = ({ texto, centroY, opacidad = 1 }) => {
  const { width } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: width / 2 - TEXTO.ancho / 2,
        width: TEXTO.ancho,
        top: centroY,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: TIKTOK_SANS,
        fontWeight: TEXTO.peso,
        fontSize: TEXTO.px,
        lineHeight: TEXTO.interlineado,
        color: "#FFFFFF",
        textShadow: TEXTO.sombra,
        textWrap: "balance",
        opacity: opacidad,
      }}
    >
      {texto}
    </div>
  );
};

export const LetraSobreVideo: React.FC<LetraSobreVideoProps> = ({ tema, video, modo, textoFijo, posicionHook, adelantoLectura, safeZone }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const area = safeArea(width, height);

  // alturas, sobre la zona libre del formato: el hook en el tercio de arriba
  // (como en las referencias) o al centro; la letra al centro, o más abajo si
  // el hook ocupa el centro
  const yArriba = area.top + area.height * 0.2;
  const yCentro = area.top + area.height * 0.5;
  const yAbajo = area.top + area.height * 0.72;
  const yHook = posicionHook === "arriba" ? yArriba : yCentro;
  const yLetra = modo === "hook-letra" && posicionHook === "centro" ? yAbajo : yCentro;

  // la letra que suena, en minúscula, con un fundido corto al entrar
  const t = frame / fps + adelantoLectura / fps;
  const starts = lineStarts(tema.lyrics);
  const i = activeLineIndex(tema.lyrics, t, starts);
  const linea = i >= 0 ? tema.lyrics[i].words.map((w) => w.text).join(" ").toLocaleLowerCase("es") : "";
  const opacidadLinea = i >= 0 ? interpolate((t - starts[i]) * fps, [0, TEXTO.fundido], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const conLetra = modo === "letra" || modo === "hook-letra";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Html5Video
        src={staticFile(video.src)}
        trimBefore={Math.round(video.inicio * fps)}
        muted
        loop
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {video.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${video.oscurecer})` }} />}

      {modo !== "letra" && textoFijo !== "" && <Texto texto={textoFijo} centroY={yHook} />}
      {conLetra && linea !== "" && <Texto texto={linea} centroY={yLetra} opacidad={opacidadLinea} />}

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <SafeZone config={safeZone} />
    </AbsoluteFill>
  );
};
