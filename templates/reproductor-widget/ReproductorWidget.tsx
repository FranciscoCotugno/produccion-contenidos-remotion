// Molde reproductor-widget (L07, C5, C6): un fondo a pantalla completa (el
// videoclip o una imagen) con el widget del reproductor flotando encima y, si
// lleva, una línea de texto arriba. Ver FICHA.md.
//
// Pieles del widget, idénticas a las del iPhone (sin logos):
// - "vidrio": el widget gris translúcido de la pantalla bloqueada (la imagen
//   de referencia de Cotu): portada, título y artista, ondas, barra con
//   tiempos, anterior / pausa / siguiente y transmitir.
// - "negro": el compacto negro de las referencias de C5.
// - "negro-simple": el de C6, sin portada, con el título centrado en mayúsculas.
//
// El molde sale en varios formatos (9:16, 1:1, 3:4): todo se ubica sobre la
// zona libre del formato. La altura del widget puede ser automática: busca la
// franja más tranquila de la imagen (la de menos detalle) dentro de la zona libre.

import React, { useEffect, useState } from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  OffthreadVideo,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { INTER, TIKTOK_SANS } from "../../shared/fonts";
import { activeLineIndex, lineStarts } from "../../shared/lyrics";
import { FranjaBotones, areaDelCuadro, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";
import { metadataDeFragmento } from "../../shared/fpsFuente";

export const reproductorWidgetSchema = z.object({
  tema: temaSchema,
  piel: z.enum(["vidrio", "negro", "negro-simple"]),
  /** fondo: el videoclip (L07) o una imagen (C5, C6), ruta dentro de assets/ */
  fondo: z.object({
    tipo: z.enum(["video", "imagen"]),
    src: z.string(),
    /** segundo del video donde arranca (L07: el inicio del fragmento) */
    inicio: z.number().min(0),
    /** zoom lento sobre la imagen, total en toda la pieza (0,06 = 6 %) */
    zoom: z.number().min(0).max(0.3).step(0.01),
    /** oscurecido (0-1) y tinte de color según la piel de la cuenta */
    oscurecer: z.number().min(0).max(0.9).step(0.05),
    tinte: z.enum(["ninguno", "frio", "calido"]),
  }),
  /** línea de texto arriba del widget: ninguna, fija (frase o pregunta) o la letra, línea por línea */
  texto: z.object({ modo: z.enum(["ninguno", "fijo", "letra"]), fijo: z.string() }),
  /** altura del widget: automática (la franja más tranquila de la imagen) o fija */
  posicion: z.enum(["auto", "arriba", "centro", "abajo"]),
  /** ancho del widget en px (en la imagen de referencia, 938; acá más chico, pedido de Cotu) */
  ancho: z.number().min(400).max(865).step(5),
  /** cuadros que cada línea de letra aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  franjaBotones: franjaBotonesSchema,
});
export type ReproductorWidgetProps = z.infer<typeof reproductorWidgetSchema>;

/** La duración sale del fragmento: inicio y fin. */
/** La duración sale del fragmento y el fps del video de fondo (ver shared/fpsFuente). */
export const duracionWidget: CalculateMetadataFunction<ReproductorWidgetProps> = ({ props }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.fondo.tipo === "video" ? props.fondo.src : "");

/**
 * Medidas del widget de vidrio, tomadas de la imagen de referencia de Cotu
 * (335 px de ancho, el widget de 291 × 128) y llevadas a un widget de 720 px.
 * Todo escala con el ancho del widget.
 */
const W = {
  ancho: 720,
  alto: 317,
  radio: 45,
  pad: 22,
  portada: 104,
  radioPortada: 12,
  titulo: 34,
  artista: 32,
  barraY: 171,
  barraAlto: 7,
  tiempos: 25,
  controlesY: 255,
};

const minutos = (s: number) => {
  const v = Math.max(0, Math.floor(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
};

// --- íconos (dibujados a mano, como los del iPhone) -------------------------

const Anterior: React.FC<{ k: number; color: string }> = ({ k, color }) => (
  <svg width={74 * k} height={40 * k} viewBox="0 0 74 40">
    <path d="M35 2 L2 20 L35 38 Z M72 2 L39 20 L72 38 Z" fill={color} stroke={color} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);
const Siguiente: React.FC<{ k: number; color: string }> = ({ k, color }) => (
  <svg width={74 * k} height={40 * k} viewBox="0 0 74 40">
    <path d="M2 2 L35 20 L2 38 Z M39 2 L72 20 L39 38 Z" fill={color} stroke={color} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);
const Pausa: React.FC<{ k: number; color: string }> = ({ k, color }) => (
  <svg width={44 * k} height={60 * k} viewBox="0 0 44 60">
    <rect x="3" y="2" width="13" height="56" rx="3" fill={color} />
    <rect x="28" y="2" width="13" height="56" rx="3" fill={color} />
  </svg>
);
/** transmitir: pantalla con un triángulo (genérico) */
const Transmitir: React.FC<{ k: number; color: string }> = ({ k, color }) => (
  <svg width={46 * k} height={46 * k} viewBox="0 0 46 46">
    <circle cx="23" cy="20" r="16" stroke={color} strokeWidth="3.4" fill="none" />
    <circle cx="23" cy="20" r="8.5" stroke={color} strokeWidth="3.4" fill="none" />
    <path d="M12 44 L23 31 L34 44 Z" fill={color} />
  </svg>
);
/** ondas de audio que se mueven con el tiempo */
const Ondas: React.FC<{ k: number; color: string; t: number }> = ({ k, color, t }) => (
  <svg width={64 * k} height={40 * k} viewBox="0 0 64 40">
    {[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const h = 10 + 26 * Math.abs(Math.sin(t * 5.3 + i * 1.7)) * (i % 3 === 1 ? 1 : 0.75);
      return <rect key={i} x={i * 9 + 1} y={20 - h / 2} width="5" height={h} rx="2.5" fill={color} />;
    })}
  </svg>
);

// --- ubicación automática ----------------------------------------------------

/**
 * Altura del bloque (texto + widget) en la franja más tranquila de la imagen:
 * se recorta la imagen como la muestra el cuadro (cubriéndolo), se mide el
 * detalle (cambios bruscos de brillo) y se elige la franja con menos, dentro
 * de la zona libre, con una leve preferencia por el centro de la zona.
 */
const useArribaAuto = (src: string, activo: boolean, ancho: number, alto: number, desde: number, hasta: number, altoBloque: number) => {
  const [arriba, setArriba] = useState<number | null>(activo ? null : -1);
  const [handle] = useState(() => delayRender("ubicación del widget"));
  useEffect(() => {
    if (!activo) {
      setArriba(-1);
      continueRender(handle);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const w = 108;
      const h = Math.round((w * alto) / ancho);
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext("2d")!;
      // object-fit: cover, centrada
      const escala = Math.max(w / img.width, h / img.height);
      ctx.drawImage(img, (w - img.width * escala) / 2, (h - img.height * escala) / 2, img.width * escala, img.height * escala);
      const d = ctx.getImageData(0, 0, w, h).data;
      const lum = (x: number, y: number) => {
        const i = (y * w + x) * 4;
        return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      };
      // detalle por fila: suma de cambios de brillo en el centro (donde va el widget)
      const fila = new Float64Array(h);
      for (let y = 1; y < h - 1; y++) {
        for (let x = Math.round(w * 0.15); x < Math.round(w * 0.85); x++) {
          fila[y] += Math.abs(lum(x + 1, y) - lum(x - 1, y)) + Math.abs(lum(x, y + 1) - lum(x, y - 1));
        }
      }
      const px = (yFrame: number) => Math.min(h - 1, Math.max(0, Math.round((yFrame / alto) * h)));
      let mejor = desde;
      let mejorPuntaje = Infinity;
      const centro = (desde + hasta - altoBloque) / 2;
      for (let y = desde; y <= hasta - altoBloque; y += 8) {
        let s = 0;
        for (let r = px(y); r <= px(y + altoBloque); r++) s += fila[r];
        const puntaje = s / (px(y + altoBloque) - px(y) + 1) + Math.abs(y - centro) * 0.02;
        if (puntaje < mejorPuntaje) {
          mejorPuntaje = puntaje;
          mejor = y;
        }
      }
      setArriba(mejor);
      continueRender(handle);
    };
    img.onerror = () => {
      setArriba(-1);
      continueRender(handle);
    };
    img.src = staticFile(src);
  }, [src, activo, ancho, alto, desde, hasta, altoBloque, handle]);
  return arriba;
};

// --- el widget -----------------------------------------------------------------

const Widget: React.FC<{ props: ReproductorWidgetProps; t: number; k: number }> = ({ props, t, k }) => {
  const { tema, piel } = props;
  const track = tema.track ?? { displayStart: tema.fragment.start, duration: Math.max(180, tema.fragment.end) };
  const transcurrido = track.displayStart + t;
  const p = Math.min(1, transcurrido / track.duration);
  const vidrio = piel === "vidrio";
  const simple = piel === "negro-simple";
  const u = (px: number) => px * k;
  const blanco = "#FFFFFF";
  const gris = vidrio ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.55)";
  const titulo = simple || piel === "negro" ? tema.title.toLocaleUpperCase("es") : tema.title;

  const barra = (
    <div style={{ position: "relative", flex: 1, height: u(W.barraAlto), borderRadius: u(W.barraAlto), background: vidrio ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.22)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, borderRadius: u(W.barraAlto), background: blanco }} />
    </div>
  );
  const tiempos = (lado: "izq" | "der") => (
    <span style={{ fontSize: u(W.tiempos), color: gris, fontVariantNumeric: "tabular-nums", minWidth: u(64), textAlign: lado === "izq" ? "left" : "right" }}>
      {lado === "izq" ? minutos(transcurrido) : `−${minutos(track.duration - transcurrido)}`}
    </span>
  );

  return (
    <div
      style={{
        width: u(W.ancho),
        height: u(W.alto),
        borderRadius: u(W.radio),
        boxSizing: "border-box",
        padding: u(W.pad),
        position: "relative",
        overflow: "hidden",
        fontFamily: INTER,
        color: blanco,
        ...(vidrio
          ? {
              background: "rgba(72,72,78,0.5)",
              backdropFilter: `blur(${u(40)}px) saturate(1.6)`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
            }
          : { background: "rgba(0,0,0,0.92)" }),
      }}
    >
      {/* arriba: portada, título y artista, ondas (o, en la simple, título centrado) */}
      {simple ? (
        <div style={{ textAlign: "center", marginTop: u(6) }}>
          <div style={{ fontSize: u(W.titulo), fontWeight: 700, letterSpacing: u(0.5), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{titulo}</div>
          <div style={{ fontSize: u(W.artista), color: gris, marginTop: u(2), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tema.artists}</div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: u(20) }}>
          {tema.cover ? (
            <Img src={staticFile(tema.cover)} style={{ width: u(W.portada), height: u(W.portada), borderRadius: u(W.radioPortada), objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{ width: u(W.portada), height: u(W.portada), borderRadius: u(W.radioPortada), background: "#333", flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
            <div style={{ fontSize: u(W.titulo), fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{titulo}</div>
            <div style={{ fontSize: u(W.artista), color: gris, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tema.artists}</div>
          </div>
          <Ondas k={k} color={vidrio ? blanco : (tema.colors?.secondary ?? "#B48CFF")} t={t} />
        </div>
      )}

      {/* barra con tiempos */}
      <div style={{ position: "absolute", left: u(W.pad), right: u(W.pad), top: u(W.barraY) - u(W.tiempos) / 2, display: "flex", alignItems: "center", gap: u(14) }}>
        {tiempos("izq")}
        {barra}
        {tiempos("der")}
      </div>

      {/* controles: anterior, pausa, siguiente (centrados) y transmitir a la derecha */}
      <div style={{ position: "absolute", left: 0, right: 0, top: u(W.controlesY), transform: "translateY(-50%)", display: "flex", justifyContent: "center", alignItems: "center", gap: u(86) }}>
        <Anterior k={k} color={blanco} />
        <Pausa k={k} color={blanco} />
        <Siguiente k={k} color={blanco} />
      </div>
      {!simple && (
        <div style={{ position: "absolute", right: u(W.pad + 8), top: u(W.controlesY), transform: "translateY(-50%)" }}>
          <Transmitir k={k} color={vidrio ? blanco : gris} />
        </div>
      )}
    </div>
  );
};

// --- la pieza ------------------------------------------------------------------

const TINTES = { ninguno: "transparent", frio: "rgba(40,70,140,0.22)", calido: "rgba(170,90,30,0.2)" } as const;
/** alto de la línea de texto y separación con el widget, para ubicar el bloque */
const TEXTO = { px: 52, interlineado: 1.15, letrasPorRenglon: 26, separacion: 34 };
/** renglones que ocupa un texto en el ancho del widget (estimado por cantidad de letras, de 1 a 3) */
const renglones = (s: string) => Math.min(3, Math.max(1, Math.ceil(s.length / TEXTO.letrasPorRenglon)));

export const ReproductorWidget: React.FC<ReproductorWidgetProps> = (props) => {
  const { tema, fondo, texto, posicion, ancho, adelantoLectura, franjaBotones } = props;
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const area = areaDelCuadro(width, height);

  // el widget no pasa del ancho libre del formato
  const anchoWidget = Math.min(ancho, area.right - area.left);
  const k = anchoWidget / W.ancho;
  // en modo letra se reserva lugar para la línea más larga, así el widget no salta
  const masLarga = texto.modo === "fijo" ? renglones(texto.fijo) : Math.max(1, ...tema.lyrics.map((l) => renglones(l.words.map((w) => w.text).join(" "))));
  const altoTexto = texto.modo === "ninguno" ? 0 : TEXTO.px * TEXTO.interlineado * masLarga + TEXTO.separacion;
  const altoBloque = altoTexto + W.alto * k;

  // altura del bloque: automática sobre la imagen, o fija
  const margen = 40;
  const desde = area.top + margen;
  const hasta = area.bottom - margen;
  const arribaAuto = useArribaAuto(fondo.src, posicion === "auto" && fondo.tipo === "imagen", width, height, desde, hasta, altoBloque);
  if (arribaAuto === null) return null;
  const fija = posicion === "auto" ? "centro" : posicion;
  const arribaFija = fija === "arriba" ? desde : fija === "abajo" ? hasta - altoBloque : (desde + hasta - altoBloque) / 2;
  const arriba = arribaAuto >= 0 ? arribaAuto : arribaFija;

  // centro horizontal: el del cuadro (el widget entra en la zona libre)
  const centroX = width / 2;

  // la línea de texto: fija, o la letra que suena (con un fundido corto al entrar)
  const tLetra = t + adelantoLectura / fps;
  const starts = lineStarts(tema.lyrics);
  const i = texto.modo === "letra" ? activeLineIndex(tema.lyrics, tLetra, starts) : -1;
  const linea = texto.modo === "fijo" ? texto.fijo : i >= 0 ? tema.lyrics[i].words.map((w) => w.text).join(" ") : "";
  const opacidadLinea = texto.modo === "letra" && i >= 0 ? interpolate((tLetra - starts[i]) * fps, [0, 4], [0.25, 1], { extrapolateRight: "clamp" }) : 1;

  const zoom = 1 + fondo.zoom * (frame / Math.max(1, durationInFrames - 1));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* fondo a pantalla completa */}
      <AbsoluteFill style={{ transform: fondo.tipo === "imagen" ? `scale(${zoom})` : undefined }}>
        {fondo.tipo === "video" ? (
          <OffthreadVideo src={staticFile(fondo.src)} trimBefore={Math.round(fondo.inicio * fps)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={staticFile(fondo.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </AbsoluteFill>
      {fondo.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${fondo.oscurecer})` }} />}
      {fondo.tinte !== "ninguno" && <AbsoluteFill style={{ background: TINTES[fondo.tinte], mixBlendMode: "color" }} />}

      {/* bloque: línea de texto arriba y el widget */}
      <div style={{ position: "absolute", left: centroX - anchoWidget / 2, width: anchoWidget, top: arriba, height: altoBloque }}>
        {texto.modo !== "ninguno" && (
          <div
            style={{
              height: altoTexto - TEXTO.separacion,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: TIKTOK_SANS,
              fontWeight: 700,
              fontSize: TEXTO.px,
              lineHeight: TEXTO.interlineado,
              color: "#FFFFFF",
              textShadow: "0 2px 12px rgba(0,0,0,0.55)",
              opacity: opacidadLinea,
              textWrap: "balance",
            }}
          >
            {linea.toLocaleLowerCase("es")}
          </div>
        )}
        <div style={{ position: "absolute", left: 0, bottom: 0 }}>
          <Widget props={props} t={t} k={k} />
        </div>
      </div>

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
