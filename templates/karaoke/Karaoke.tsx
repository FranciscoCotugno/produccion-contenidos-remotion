// Molde karaoke (L09): la línea completa de la letra sobre el videoclip, donde
// cada palabra se va rellenando del color del tema mientras se canta, de
// izquierda a derecha. Ver FICHA.md. Sale en 9:16 (1080×1920).
//
// Sin el modo "completá la letra": lo sacó Cotu.

// OffthreadVideo y no Html5Video: Html5Video posiciona un <video> del navegador por
// busqueda y no siempre cae en el cuadro exacto, asi que el fondo se mueve a tirones
// mientras la letra va fluida. OffthreadVideo extrae el cuadro exacto. No acepta
// `loop`: el video de fondo debe durar al menos lo que el fragmento. (2026-10-14)
import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  Html5Audio,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { TIKTOK_SANS } from "../../shared/fonts";
import { lineStarts } from "../../shared/lyrics";
import { metadataDeFragmento } from "../../shared/fpsFuente";
import { FranjaBotones, areaDelCuadro, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";

export const karaokeSchema = z.object({
  tema: temaSchema,
  /** el videoclip de fondo, sin sonido (el audio es el del tema) */
  video: z.object({
    src: z.string(),
    inicio: z.number().min(0),
    /** oscurecido (0-1), para que la letra se lea */
    oscurecer: z.number().min(0).max(0.8).step(0.05),
  }),
  /** color con el que se rellena cada palabra; vacío = el secundario del tema */
  colorResaltado: z.union([zColor(), z.literal("")]),
  /** también la línea siguiente, más tenue (Cotu eligió solo la actual) */
  lineaSiguiente: z.boolean(),
  /** cuadros que la línea aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  franjaBotones: franjaBotonesSchema,
});
export type KaraokeProps = z.infer<typeof karaokeSchema>;

/** La duración sale del fragmento y el fps del video de fondo (ver shared/fpsFuente). */
export const duracionKaraoke: CalculateMetadataFunction<KaraokeProps> = ({ props }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.video.src);

const T = {
  px: 60,
  peso: 700,
  interlineado: 1.2,
  /** ancho del bloque: el de la zona libre menos un margen a cada lado */
  margen: 30,
  sombra: "0 2px 10px rgba(0,0,0,0.6), 0 0 26px rgba(0,0,0,0.3)",
  /** separación entre palabras, en eme */
  espacio: 0.3,
  siguiente: 0.45,
};

/**
 * Una palabra con el relleno avanzando: abajo la blanca entera y encima la de
 * color, recortada a lo que ya se cantó.
 */
const Palabra: React.FC<{ texto: string; progreso: number; color: string; ultima: boolean }> = ({ texto, progreso, color, ultima }) => (
  <span style={{ position: "relative", display: "inline-block", marginRight: ultima ? 0 : `${T.espacio}em` }}>
    <span style={{ color: "#FFFFFF" }}>{texto}</span>
    {progreso > 0 && (
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `${progreso * 100}%`,
          overflow: "hidden",
          whiteSpace: "nowrap",
          color,
        }}
      >
        {texto}
      </span>
    )}
  </span>
);

export const Karaoke: React.FC<KaraokeProps> = ({ tema, video, colorResaltado, lineaSiguiente, adelantoLectura, franjaBotones }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const area = areaDelCuadro(width, height);
  const t = frame / fps + adelantoLectura / fps;
  const color = colorResaltado || tema.colors?.secondary || "#FFD426";

  // la línea en pantalla: la última que ya arrancó (queda hasta la siguiente);
  // la primera, desde el cuadro 0, así algo se ve desde el principio
  const starts = lineStarts(tema.lyrics);
  let i = 0;
  starts.forEach((s, k) => {
    if (t >= s) i = k;
  });
  const linea = tema.lyrics[i];
  const proxima = tema.lyrics[i + 1];

  // cuánto lleva cantado de cada palabra: de su tiempo al de la siguiente
  const palabras = linea.words.map((w, j) => {
    const hasta = j + 1 < linea.words.length ? linea.words[j + 1].t : linea.end;
    const progreso = hasta > w.t ? Math.min(1, Math.max(0, (t - w.t) / (hasta - w.t))) : t >= w.t ? 1 : 0;
    return { texto: w.text, progreso };
  });

  const ancho = area.width - 2 * T.margen;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(video.src)}
        trimBefore={Math.round(video.inicio * fps)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {video.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${video.oscurecer})` }} />}

      <div
        style={{
          position: "absolute",
          left: area.left + T.margen,
          width: ancho,
          top: (area.top + area.bottom) / 2,
          transform: "translateY(-50%)",
          textAlign: "center",
          fontFamily: TIKTOK_SANS,
          fontWeight: T.peso,
          fontSize: T.px,
          lineHeight: T.interlineado,
          textShadow: T.sombra,
        }}
      >
        <div>
          {palabras.map((p, k) => (
            <Palabra key={k} texto={p.texto} progreso={p.progreso} color={color} ultima={k === palabras.length - 1} />
          ))}
        </div>
        {lineaSiguiente && proxima && (
          <div style={{ color: "#FFFFFF", opacity: T.siguiente, marginTop: T.px * 0.3 }}>
            {proxima.words.map((w) => w.text).join(" ")}
          </div>
        )}
      </div>

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
