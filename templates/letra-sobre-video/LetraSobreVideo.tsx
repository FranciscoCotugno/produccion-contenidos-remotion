// Molde letra-sobre-video (L08, L11, POV1 a POV8): un video a pantalla completa
// con texto encima, en el estilo del texto nativo de la app (el que escribe un
// usuario con la herramienta de texto): TikTok Sans blanco, chico, centrado, sin
// caja y con una sombra leve. Un solo estilo para todas las cuentas (pedido de
// Cotu). Ver FICHA.md.
//
// El video va sin sonido: el audio del tema entra por su lado, con su fragmento
// (el material de nicho no tiene sonido). Sale en 9:16, 1:1 y 3:4.

// OffthreadVideo y no Html5Video: Html5Video posiciona un <video> del navegador por
// busqueda y no siempre cae en el cuadro exacto, asi que el fondo se mueve a tirones
// mientras la letra va fluida. OffthreadVideo extrae el cuadro exacto. No acepta
// `loop`: el video de fondo debe durar al menos lo que el fragmento. (2026-10-14)
import React from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { TIKTOK_SANS, conEmoji } from "../../shared/fonts";
import { activeLineIndex, lineStarts } from "../../shared/lyrics";
import { FranjaBotones, areaDelCuadro, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";
import { metadataDeFragmento } from "../../shared/fpsFuente";

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
  /**
   * Cómo se ve el texto. Los valores por omisión son los que el molde tenía
   * escritos fijos, así que una pieza que no los toque sale igual que siempre.
   *
   * El modo "subtítulo fino" (referencia 11-letra-sobre-videoclip, @soloporenata)
   * no es un modo aparte: es este mismo molde con la letra chica y fina y la
   * sombra apenas marcada. Medido sobre el fotograma de la referencia, su letra
   * equivale a unos 30 px en un cuadro de 1080 de ancho.
   */
  texto: z.object({
    /** tamaño en px, medido sobre un cuadro de 1080 de ancho */
    tamano: z.number().min(20).max(120).step(1),
    /** grosor: 300 es fino, 500 el de siempre, 700 negrita */
    peso: z.number().min(300).max(800).step(100),
    /** altura de la línea de letra, como fracción del alto (0,5 = la mitad) */
    altura: z.number().min(0.25).max(0.9).step(0.01),
    /** cuánto se marca la sombra */
    sombra: z.enum(["ninguna", "suave", "media", "normal"]),
    /** ancho de la caja donde el texto corta en renglones */
    ancho: z.number().min(300).max(1400).step(10),
  }),
  /** cuadros que cada línea de letra aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  franjaBotones: franjaBotonesSchema,
});
export type LetraSobreVideoProps = z.infer<typeof letraSobreVideoSchema>;

/** La duración sale del fragmento: inicio y fin. */
/** La duración sale del fragmento y el fps del video de fondo (ver shared/fpsFuente). */
export const duracionLetraSobreVideo: CalculateMetadataFunction<LetraSobreVideoProps> = ({ props }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.video.src);

/** Lo que no cambia por pieza. */
const TEXTO = {
  interlineado: 1.22,
  /** cuadros del fundido de entrada de cada línea de letra */
  fundido: 4,
};

/** Cómo se veía el molde antes de que esto fuera configurable: es el valor por omisión. */
export const TEXTO_DE_SIEMPRE = {
  tamano: 52,
  peso: 500,
  altura: 0.5,
  sombra: "normal" as const,
  ancho: 640,
};

/** El subtítulo fino de la referencia 11, medido sobre su fotograma. */
export const TEXTO_SUBTITULO_FINO = {
  tamano: 30,
  peso: 300,
  altura: 0.5,
  sombra: "media" as const,
  ancho: 760,
};

const SOMBRAS = {
  ninguna: "none",
  suave: "0 1px 3px rgba(0,0,0,0.45)",
  // un escalon mas que suave, sin llegar al halo de normal (pedido de Cotu, 2026-10-17)
  media: "0 1px 4px rgba(0,0,0,0.6), 0 0 9px rgba(0,0,0,0.2)",
  normal: "0 1px 4px rgba(0,0,0,0.6), 0 0 14px rgba(0,0,0,0.25)",
};

type EstiloTexto = LetraSobreVideoProps["texto"];

const Texto: React.FC<{ texto: string; centroY: number; estilo: EstiloTexto; opacidad?: number }> = ({
  texto,
  centroY,
  estilo,
  opacidad = 1,
}) => {
  const { width } = useVideoConfig();
  // el tamaño se mide sobre 1080 de ancho: en 4:3 (1440) se escala para verse igual
  const escala = width / 1080;
  return (
    <div
      style={{
        position: "absolute",
        left: width / 2 - (estilo.ancho * escala) / 2,
        width: estilo.ancho * escala,
        top: centroY,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: conEmoji(TIKTOK_SANS),
        fontWeight: estilo.peso,
        fontSize: estilo.tamano * escala,
        lineHeight: TEXTO.interlineado,
        color: "#FFFFFF",
        textShadow: SOMBRAS[estilo.sombra],
        textWrap: "balance",
        opacity: opacidad,
      }}
    >
      {texto}
    </div>
  );
};

export const LetraSobreVideo: React.FC<LetraSobreVideoProps> = ({ tema, video, modo, textoFijo, posicionHook, texto, adelantoLectura, franjaBotones }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const area = areaDelCuadro(width, height);

  // alturas, sobre la zona libre del formato: el hook en el tercio de arriba
  // (como en las referencias) o al centro; la letra al centro, o más abajo si
  // el hook ocupa el centro
  const yArriba = area.top + area.height * 0.2;
  const yCentro = area.top + area.height * 0.5;
  const yAbajo = area.top + area.height * 0.72;
  const yHook = posicionHook === "arriba" ? yArriba : yCentro;
  // la altura de la letra la decide la pieza; la excepción es hook-letra con el hook
  // al centro, donde la letra tiene que irse abajo para no pisarlo
  const yLetra = modo === "hook-letra" && posicionHook === "centro" ? yAbajo : area.top + area.height * texto.altura;

  // la letra que suena, en minúscula, con un fundido corto al entrar
  const t = frame / fps + adelantoLectura / fps;
  const starts = lineStarts(tema.lyrics);
  const i = activeLineIndex(tema.lyrics, t, starts);
  const linea = i >= 0 ? tema.lyrics[i].words.map((w) => w.text).join(" ").toLocaleLowerCase("es") : "";
  const opacidadLinea = i >= 0 ? interpolate((t - starts[i]) * fps, [0, TEXTO.fundido], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const conLetra = modo === "letra" || modo === "hook-letra";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(video.src)}
        trimBefore={Math.round(video.inicio * fps)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {video.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${video.oscurecer})` }} />}

      {modo !== "letra" && textoFijo !== "" && <Texto texto={textoFijo} centroY={yHook} estilo={texto} />}
      {conLetra && linea !== "" && <Texto texto={linea} centroY={yLetra} estilo={texto} opacidad={opacidadLinea} />}

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
