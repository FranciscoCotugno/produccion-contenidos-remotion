// Molde prensa: piezas de un medio de música. Ver FICHA.md.
//
// Dos pieles:
//   A "faja": el material enmarcado, con un titular en la banda de arriba y el
//     subtítulo de la letra encima de la imagen. Referencia
//     assets/referencias/12-prensa-con-video/ (350 mil likes).
//   B "panel": la pantalla partida, con un panel de color saturado que lleva la
//     marca del medio y un titular de varias líneas con palabras destacadas.
//     Referencia assets/referencias/07-fotos-artista/.
//
// La faja es lo que convierte una pieza de lyrics en una pieza de prensa: el
// mismo video sin la tira es una cuenta de fans; con la tira, un medio.
//
// **El titular no sale de la letra ni de los datos del lanzamiento**: es una
// frase editorial que escribe una persona en la bajada de cada tema, igual que
// los hooks de letra-sobre-video. El molde lo recibe ya escrito, como prop.

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
import { ARCHIVO_NARROW, ARIMO, FRAUNCES_ITALIC, GEIST, TIKTOK_SANS, conEmoji } from "../../shared/fonts";
import { activeLineIndex, lineStarts } from "../../shared/lyrics";
import { FranjaBotones, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";
import { metadataDeFragmento } from "../../shared/fpsFuente";

/**
 * Direcciones tipográficas, para comparar en Studio. La restricción de los
 * sellos (FMK y Sony exigen Arial o TikTok Sans) es sobre **el texto del tema**:
 * la letra. El titular es la voz editorial del medio, no un activo del sello.
 * Igual el valor por omisión es TikTok Sans en las dos pieles, porque no cuesta
 * nada y saca la pregunta del medio.
 */
export const TIPOGRAFIAS = {
  "tiktok-sans": TIKTOK_SANS,
  geist: GEIST,
  arimo: ARIMO,
  "archivo-narrow": ARCHIVO_NARROW,
  fraunces: FRAUNCES_ITALIC,
};
const TIPO = z.enum(["tiktok-sans", "geist", "arimo", "archivo-narrow", "fraunces"]);

export const prensaSchema = z.object({
  tema: temaSchema,
  piel: z.enum(["faja", "panel"]),

  video: z.object({
    src: z.string(),
    inicio: z.number().min(0),
    oscurecer: z.number().min(0).max(0.8).step(0.05),
    /** encuadre del material dentro de su caja */
    zoom: z.number().min(1).max(2.5).step(0.05),
  }),

  /**
   * El titular. Lo escribe una persona en la bajada, no sale de los datos.
   * En la piel panel, las palabras entre asteriscos van con el color destacado:
   * "FMK vuelve con *Si sale el sol*".
   */
  titular: z.string(),

  faja: z.object({
    /** color del marco que rodea al material */
    colorMarco: zColor(),
    /** color de la tira; si es igual al marco, se lee como una sola banda (es lo que hace la referencia) */
    color: zColor(),
    alto: z.number().min(60).max(300).step(2),
    /** proporción de la caja del material: 1 = cuadrado, 0.8 = 4:5, 0 = a sangre */
    proporcion: z.number().min(0).max(1.8).step(0.05),
    tipografia: TIPO,
    tamano: z.number().min(26).max(90).step(1),
    peso: z.number().min(400).max(900).step(100),
    colorTexto: zColor(),
  }),

  panel: z.object({
    lado: z.enum(["izquierda", "derecha"]),
    /** qué fracción del ancho ocupa el panel */
    ancho: z.number().min(0.3).max(0.7).step(0.01),
    color: zColor(),
    /** nombre del medio, en la caja de arriba */
    marca: z.string(),
    colorCajaMarca: zColor(),
    colorMarca: zColor(),
    tipografiaMarca: TIPO,
    tipografia: TIPO,
    tamano: z.number().min(30).max(120).step(1),
    peso: z.number().min(400).max(900).step(100),
    colorTexto: zColor(),
    /** el de las palabras entre asteriscos */
    colorDestacado: zColor(),
    /** dos renglones chicos debajo del titular; vacío = sin bajada */
    bajada: z.string(),
  }),

  /** el subtítulo de la letra sobre el material */
  subtitulo: z.object({
    mostrar: z.boolean(),
    tamano: z.number().min(20).max(70).step(1),
    peso: z.number().min(300).max(800).step(100),
    italica: z.boolean(),
    /** altura dentro de la caja del material, como fracción */
    altura: z.number().min(0.1).max(0.95).step(0.01),
    minuscula: z.boolean(),
  }),

  /** cuadros que cada línea aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  franjaBotones: franjaBotonesSchema,
});

export type PrensaProps = z.infer<typeof prensaSchema>;

/** La duración sale del fragmento y los cuadros por segundo del material. */
export const duracionPrensa: CalculateMetadataFunction<PrensaProps> = ({ props }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.video.src);

const SOMBRA = "0 1px 4px rgba(0,0,0,0.55), 0 0 12px rgba(0,0,0,0.3)";

/** Parte un titular en tramos, marcando los que van entre asteriscos. */
const tramosDestacados = (texto: string) =>
  texto.split(/(\*[^*]+\*)/).filter((t) => t !== "").map((t) =>
    t.startsWith("*") && t.endsWith("*") ? { texto: t.slice(1, -1), destacado: true } : { texto: t, destacado: false },
  );

export const Prensa: React.FC<PrensaProps> = ({
  tema,
  piel,
  video,
  titular,
  faja,
  panel,
  subtitulo,
  adelantoLectura,
  franjaBotones,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const escala = width / 1080;

  // la línea de letra que suena
  const t = frame / fps + adelantoLectura / fps;
  const starts = lineStarts(tema.lyrics);
  const i = activeLineIndex(tema.lyrics, t, starts);
  const cruda = i >= 0 ? tema.lyrics[i].words.map((w) => w.text).join(" ") : "";
  const linea = subtitulo.minuscula ? cruda.toLocaleLowerCase("es") : cruda;

  const material = (estilo: React.CSSProperties) => (
    <>
      <OffthreadVideo
        src={staticFile(video.src)}
        trimBefore={Math.round(video.inicio * fps)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${video.zoom})`, ...estilo }}
      />
      {video.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${video.oscurecer})` }} />}
    </>
  );

  const Subtitulo: React.FC<{ alto: number; arriba: number }> = ({ alto, arriba }) =>
    subtitulo.mostrar && linea !== "" ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          width,
          top: arriba + alto * subtitulo.altura,
          transform: "translateY(-50%)",
          textAlign: "center",
          fontFamily: conEmoji(TIKTOK_SANS),
          fontStyle: subtitulo.italica ? "italic" : "normal",
          fontWeight: subtitulo.peso,
          fontSize: subtitulo.tamano * escala,
          color: "white",
          textShadow: SOMBRA,
          padding: `0 ${60 * escala}px`,
          boxSizing: "border-box",
          textWrap: "balance",
        }}
      >
        {linea}
      </div>
    ) : null;

  if (piel === "faja") {
    // la caja del material: cuadrada por omisión (es lo que hace la
    // referencia), o a sangre si la proporción es 0
    const altoCaja = faja.proporcion <= 0 ? height : Math.min(height, width * faja.proporcion);
    const arribaCaja = (height - altoCaja) / 2;
    const altoFaja = faja.alto * escala;

    return (
      <AbsoluteFill style={{ backgroundColor: faja.colorMarco }}>
        <div style={{ position: "absolute", left: 0, top: arribaCaja, width, height: altoCaja, overflow: "hidden" }}>
          {material({})}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            width,
            top: Math.max(0, arribaCaja - altoFaja),
            height: altoFaja,
            background: faja.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: conEmoji(TIPOGRAFIAS[faja.tipografia]),
            fontWeight: faja.peso,
            fontSize: faja.tamano * escala,
            color: faja.colorTexto,
            padding: `0 ${50 * escala}px`,
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          {titular}
        </div>

        <Subtitulo alto={altoCaja} arriba={arribaCaja} />
        <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
        <FranjaBotones config={franjaBotones} />
      </AbsoluteFill>
    );
  }

  // piel panel: la pantalla partida
  const anchoPanel = width * panel.ancho;
  const izquierda = panel.lado === "izquierda";
  const pad = 56 * escala;

  return (
    <AbsoluteFill style={{ backgroundColor: panel.color }}>
      <div
        style={{
          position: "absolute",
          [izquierda ? "right" : "left"]: 0,
          top: 0,
          width: width - anchoPanel,
          height,
          overflow: "hidden",
        }}
      >
        {material({})}
      </div>

      <div
        style={{
          position: "absolute",
          [izquierda ? "left" : "right"]: 0,
          top: 0,
          width: anchoPanel,
          height,
          background: panel.color,
          padding: pad,
          // el titular no va pegado al piso: queda en el tercio de abajo, como
          // en la referencia
          paddingBottom: pad * 3.2,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          // la marca arriba y el titular abajo: con todo pegado arriba, un
          // titular corto deja medio panel vacío
          justifyContent: "space-between",
          gap: pad,
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            background: panel.colorCajaMarca,
            color: panel.colorMarca,
            padding: `${pad * 0.16}px ${pad * 0.3}px`,
            fontFamily: TIPOGRAFIAS[panel.tipografiaMarca],
            fontWeight: 900,
            fontSize: 44 * escala,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {panel.marca}
        </div>

        {/* el titular y su bajada van juntos, apoyados abajo */}
        <div style={{ display: "flex", flexDirection: "column", gap: pad * 0.4 }}>
          <div
            style={{
              fontFamily: TIPOGRAFIAS[panel.tipografia],
              fontWeight: panel.peso,
              fontSize: panel.tamano * escala,
              lineHeight: 1.06,
              color: panel.colorTexto,
              letterSpacing: "-0.015em",
            }}
          >
            {tramosDestacados(titular).map((tr, k) => (
              <span key={k} style={{ color: tr.destacado ? panel.colorDestacado : panel.colorTexto }}>
                {tr.texto}
              </span>
            ))}
          </div>

          {panel.bajada !== "" && (
            <div
              style={{
                fontFamily: TIPOGRAFIAS[panel.tipografia],
                fontWeight: 700,
                fontSize: 28 * escala,
                lineHeight: 1.18,
                color: panel.colorTexto,
                whiteSpace: "pre-line",
                opacity: 0.9,
              }}
            >
              {panel.bajada}
            </div>
          )}
        </div>
      </div>

      {subtitulo.mostrar && linea !== "" && (
        <div
          style={{
            position: "absolute",
            [izquierda ? "right" : "left"]: 0,
            width: width - anchoPanel,
            top: height * subtitulo.altura,
            transform: "translateY(-50%)",
            textAlign: "center",
            fontFamily: conEmoji(TIKTOK_SANS),
            fontStyle: subtitulo.italica ? "italic" : "normal",
            fontWeight: subtitulo.peso,
            fontSize: subtitulo.tamano * escala,
            color: "white",
            textShadow: SOMBRA,
            padding: `0 ${30 * escala}px`,
            boxSizing: "border-box",
            textWrap: "balance",
          }}
        >
          {linea}
        </div>
      )}

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
