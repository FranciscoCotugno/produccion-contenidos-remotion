// Molde chat: una conversación de mensajería donde alguien manda el tema. Ver
// FICHA.md. Un solo motor de mensajes y sus pieles.
//
// Piel `instagram-claro` (R3): mensaje directo idéntico a Instagram en modo
// claro: cabecera con avatar, burbujas muy redondeadas (las mías con el
// degradé), reel compartido como tarjeta vertical. Sin logos ni el ícono de
// Reels, y sin el @ del artista (solo "♪ título · artista").
//
// Piel `whatsapp-oscuro` (C3 y R1): idéntica a WhatsApp en modo oscuro en
// iPhone (pedido de Cotu). Todo se mide en puntos de iPhone, tomados de la
// referencia (01-chat-racha.mp4: 682 px = 390 pt), y se lleva a px con
// `escala` (px por punto). Sin logos; el patrón de fondo es propio y la letra
// del sistema se reemplaza por Inter.
//
// Por defecto el chat es FIJO, como una captura: la conversación entera está
// desde el primer cuadro y solo se mueven el video del sticker y el
// reproductor de audio. Con `animacion: "en-vivo"` los mensajes entran en su
// tiempo `t` (con "escribiendo…" y tildes que pasan a leído).
//
// La conversación arranca arriba de la zona libre y crece hacia abajo; si no
// entra, se corre hacia arriba como en la app (lo más nuevo queda abajo).

import React, { useLayoutEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  continueRender,
  delayRender,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { INTER, NOTO_EMOJI, TIKTOK_SANS } from "../../shared/fonts";
import { activeLineIndex, lineStarts } from "../../shared/lyrics";
import { FranjaBotones, areaDelCuadro, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";
import { metadataDeFragmento } from "../../shared/fpsFuente";

export const mensajeSchema = z.object({
  /** texto, audio (el fragmento), video (sticker con el clip), link (tarjeta del tema), reel (tarjeta vertical con el clip, R3), reaccion (emoji sobre el mensaje anterior), visto, escribiendo */
  tipo: z.enum(["texto", "audio", "video", "link", "reel", "reaccion", "visto", "escribiendo"]),
  /** yo (enviado, a la derecha) u otro (recibido, a la izquierda) */
  de: z.enum(["yo", "otro"]),
  /** segundo del fragmento en que aparece */
  t: z.number().min(0),
  /** texto del mensaje; {n} se reemplaza por el contador */
  texto: z.string().optional(),
  /** audio con la etiqueta "Reenviado" */
  reenviado: z.boolean().optional(),
  /** emoji de la reacción */
  emoji: z.string().optional(),
  /** cuánto dura el "escribiendo…", en segundos */
  duracion: z.number().min(0).optional(),
});
export type Mensaje = z.infer<typeof mensajeSchema>;

export const chatSchema = z.object({
  tema: temaSchema,
  /** whatsapp-oscuro (C3 y R1) o instagram-claro (R3, mensaje directo) */
  piel: z.enum(["whatsapp-oscuro", "instagram-claro"]),
  mensajes: z.array(mensajeSchema),
  /** contador de R1 ("Día {n}…") */
  n: z.number().int().min(0),
  /** hora que muestran los mensajes */
  hora: z.string(),
  /** cabecera con el nombre del contacto (las referencias no la tienen) */
  cabecera: z.object({ mostrar: z.boolean(), nombre: z.string(), estado: z.string() }),
  /** px por punto de iPhone: 2,77 = el ancho del cuadro horizontal es el del iPhone, como la referencia (texto de 47 px); 2,94 = texto de 50 px */
  escala: z.number().min(1.5).max(3.5).step(0.01),
  /** círculo a la derecha del audio: nota musical sobre color, o la portada del tema */
  iconoAudio: z.enum(["nota", "portada"]),
  /** palabras de la letra sobre el video (como la referencia 01) */
  letraEnVideo: z.boolean(),
  /** de qué lado van mis mensajes (verdes): "izquierda" (C3, pedido de Cotu) o "derecha" (como en la app); los del otro, del lado opuesto */
  ladoMio: z.enum(["izquierda", "derecha"]),
  /**
   * ancho de la conversación: "cuadro" = los mensajes pegados a los bordes del
   * cuadro, como en la app (pedido de Cotu; los de la derecha quedan debajo de
   * los botones de TikTok, x > 925); "zonaSegura" = entre x 60 y 925
   */
  ancho: z.enum(["cuadro", "zonaSegura"]),
  /** barra para escribir de la app abajo (+, campo con sticker, cámara, micrófono): parece la captura de un chat real */
  barraEscribir: z.boolean(),
  /** "fija": la conversación entera desde el cuadro 0, como una captura (solo se mueven video y audio); "en-vivo": los mensajes entran en su tiempo */
  animacion: z.enum(["fija", "en-vivo"]),
  /** cuántas palabras de la letra se ven sobre el video a la vez */
  palabrasEnVideo: z.number().int().min(1).max(6),
  /** cuadros que la letra del video aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  franjaBotones: franjaBotonesSchema,
});
export type ChatProps = z.infer<typeof chatSchema>;

/** La duración sale del fragmento: inicio y fin. */
/** La duración sale del fragmento y el fps del video de fondo (ver shared/fpsFuente). */
export const duracionChat: CalculateMetadataFunction<ChatProps> = ({ props }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.tema.fragment.src);

/**
 * WhatsApp oscuro en iPhone. Colores medidos en la referencia (fondo,
 * burbuja recibida, barra del audio); el resto, de la app.
 */
const WA = {
  fondo: "#070707",
  patron: "rgba(255,255,255,0.055)",
  recibida: "#1C1E1D",
  enviada: "#144D37",
  texto: "#F2F2F2",
  secundario: "#8D8D92",
  enviadaSecundario: "rgba(255,255,255,0.6)",
  leido: "#53BDEB",
  barra: "#2E302F",
  barraEnviada: "rgba(255,255,255,0.22)",
  punto: "#8D8F8E",
  pausa: "#A1A3A2",
  // el círculo de la referencia es rosa (el de una app de música): acá, otro color
  nota: "#25A86B",
  cabecera: "#161616",
  previa: "#262827",
  previaEnviada: "#0E3B2A",
  fondoBarraEscribir: "#1A1A1A",
  campo: "#2A2A2C",
  iconos: "#F2F2F2",
};

/** Instagram, mensajes directos en modo claro, en iPhone. */
const IG = {
  fondo: "#FFFFFF",
  recibida: "#EFEFEF",
  enviada: "linear-gradient(160deg, #8B3DFF 0%, #5B5BF5 55%, #3478F6 100%)",
  texto: "#000000",
  textoEnviado: "#FFFFFF",
  secundario: "#8E8E8E",
  borde: "#DBDBDB",
  azul: "#3797F0",
  campo: "#EFEFEF",
};
const PT_IG = {
  texto: 16.5,
  lineaTexto: 21,
  padX: 13,
  padY: 9,
  radio: 22,
  anchoMaximo: 270,
  reel: { ancho: 200, alto: 356, radio: 16 },
  cabecera: 56,
  barra: { alto: 60, campo: 44 },
};

/** Medidas en puntos de iPhone (de la referencia: 682 px = 390 pt). */
const PT = {
  margen: 16.6, // de la burbuja al borde de la pantalla
  margenSticker: 24.6,
  texto: 17,
  lineaTexto: 22,
  hora: 11,
  padX: 10,
  padArriba: 7,
  padAbajo: 7,
  radio: 17,
  separacion: 2, // entre mensajes seguidos del mismo
  separacionCambio: 8, // cuando cambia quien escribe
  anchoMaximo: 320, // de una burbuja de texto (82 % de la pantalla, como en la app): la hora entra al lado del texto
  audio: { ancho: 288, alto: 88 },
  sticker: { ancho: 175, alto: 127 },
  pildora: { alto: 26 },
  previa: { ancho: 270, portada: 64 },
  barra: { alto: 52, campo: 36 },
};

const ENTRADA_CUADROS = 5;

const minutos = (s: number) => {
  const v = Math.max(0, Math.floor(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
};

/** Doble tilde: gris (entregado) o celeste (leído). */
const Tildes: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <svg width={u(16)} height={u(11)} viewBox="0 0 16 11" style={{ display: "block" }}>
    <path d="M1 6 L4.2 9.2 L11 1.8 M6.4 9.2 L7.4 10 L15 1.8" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Hora (y tildes si es mío), en la esquina de la burbuja. */
const Hora: React.FC<{ u: (pt: number) => number; hora: string; mio: boolean; leido: boolean }> = ({ u, hora, mio, leido }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: u(3), fontSize: u(PT.hora), color: mio ? WA.enviadaSecundario : WA.secundario, whiteSpace: "nowrap" }}>
    {hora}
    {mio && <Tildes u={u} color={leido ? WA.leido : WA.enviadaSecundario} />}
  </span>
);

/** Barra para escribir de la app, abajo: "+", campo redondeado con sticker, cámara y micrófono. */
const BarraEscribir: React.FC<{ u: (pt: number) => number; left: number; width: number; bottom: number }> = ({ u, left, width, bottom }) => {
  const ic = { stroke: WA.iconos, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div
      style={{
        position: "absolute",
        left,
        width,
        bottom,
        height: u(PT.barra.alto),
        background: WA.fondoBarraEscribir,
        borderTop: `${Math.max(1, u(0.5))}px solid rgba(255,255,255,0.08)`,
        display: "flex",
        alignItems: "center",
        gap: u(12),
        padding: `0 ${u(12)}px`,
        boxSizing: "border-box",
      }}
    >
      {/* + */}
      <svg width={u(24)} height={u(24)} viewBox="0 0 24 24">
        <path d="M12 4 V20 M4 12 H20" {...ic} strokeWidth={2} />
      </svg>
      {/* campo de texto con el ícono de sticker adentro */}
      <div
        style={{
          flex: 1,
          height: u(PT.barra.campo),
          borderRadius: u(PT.barra.campo / 2),
          background: WA.campo,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: u(9),
        }}
      >
        <svg width={u(22)} height={u(22)} viewBox="0 0 22 22">
          <path d="M14 20 H6 a4 4 0 0 1 -4 -4 V6 a4 4 0 0 1 4 -4 H16 a4 4 0 0 1 4 4 V14 Z M14 20 V17 a3 3 0 0 1 3 -3 H20" {...ic} />
          <path d="M7.5 9 h0.1 M14.5 9 h0.1" {...ic} strokeWidth={2.4} />
          <path d="M7.5 13 q3.5 2.5 7 0" {...ic} />
        </svg>
      </div>
      {/* cámara */}
      <svg width={u(26)} height={u(24)} viewBox="0 0 26 24">
        <path d="M3 8 a2 2 0 0 1 2 -2 h3.5 l1.8 -2.6 h5.4 l1.8 2.6 H21 a2 2 0 0 1 2 2 v11 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 Z" {...ic} />
        <circle cx="13" cy="13" r="4.3" {...ic} />
      </svg>
      {/* micrófono */}
      <svg width={u(20)} height={u(26)} viewBox="0 0 20 26">
        <rect x="6" y="2" width="8" height="14" rx="4" {...ic} />
        <path d="M2.5 12 a7.5 7.5 0 0 0 15 0 M10 19.5 V24" {...ic} />
      </svg>
    </div>
  );
};

/** Cabecera de un mensaje directo de Instagram: flecha, avatar, nombre y estado; llamada y video a la derecha. */
const CabeceraIG: React.FC<{ u: (pt: number) => number; left: number; width: number; nombre: string; estado: string }> = ({ u, left, width, nombre, estado }) => {
  const ic = { stroke: IG.texto, strokeWidth: 1.9, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div
      style={{
        position: "absolute",
        left,
        width,
        top: 0,
        height: u(PT_IG.cabecera),
        background: IG.fondo,
        borderBottom: `${Math.max(1, u(0.5))}px solid ${IG.borde}`,
        display: "flex",
        alignItems: "center",
        gap: u(12),
        padding: `0 ${u(14)}px`,
        boxSizing: "border-box",
        color: IG.texto,
      }}
    >
      <svg width={u(12)} height={u(20)} viewBox="0 0 12 20">
        <path d="M10 2 L2 10 L10 18" {...ic} strokeWidth={2.4} />
      </svg>
      <div
        style={{
          width: u(34),
          height: u(34),
          borderRadius: "50%",
          background: "linear-gradient(135deg, #D9D9DE, #B8B8C0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: u(15),
          fontWeight: 600,
          color: "#FFFFFF",
        }}
      >
        {nombre.slice(0, 1).toLocaleUpperCase("es")}
      </div>
      <div style={{ flex: 1, lineHeight: 1.2, minWidth: 0 }}>
        <div style={{ fontSize: u(16), fontWeight: 600 }}>{nombre}</div>
        <div style={{ fontSize: u(12), color: IG.secundario }}>{estado}</div>
      </div>
      {/* llamada */}
      <svg width={u(24)} height={u(24)} viewBox="0 0 24 24">
        <path d="M5 3.5 h3.5 l1.8 4.3 -2.2 1.6 a12 12 0 0 0 6.5 6.5 l1.6 -2.2 4.3 1.8 V19 a1.5 1.5 0 0 1 -1.6 1.5 A16.5 16.5 0 0 1 3.5 5.1 A1.5 1.5 0 0 1 5 3.5 Z" {...ic} />
      </svg>
      {/* video */}
      <svg width={u(28)} height={u(24)} viewBox="0 0 28 24">
        <rect x="2" y="5" width="16" height="14" rx="3.5" {...ic} />
        <path d="M18 10 L25.5 6 V18 L18 14" {...ic} />
      </svg>
    </div>
  );
};

/** Barra de mensaje de Instagram: cámara en círculo azul, "Mensaje...", micrófono, galería y sticker. */
const BarraIG: React.FC<{ u: (pt: number) => number; left: number; width: number }> = ({ u, left, width }) => {
  const ic = { stroke: IG.texto, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div
      style={{
        position: "absolute",
        left,
        width,
        bottom: 0,
        height: u(PT_IG.barra.alto),
        background: IG.fondo,
        display: "flex",
        alignItems: "center",
        padding: `0 ${u(10)}px`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          height: u(PT_IG.barra.campo),
          borderRadius: u(PT_IG.barra.campo / 2),
          background: IG.campo,
          display: "flex",
          alignItems: "center",
          gap: u(10),
          padding: `0 ${u(6)}px 0 ${u(6)}px`,
        }}
      >
        <div style={{ width: u(34), height: u(34), borderRadius: "50%", background: IG.azul, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={u(19)} height={u(17)} viewBox="0 0 26 24">
            <path d="M3 8 a2 2 0 0 1 2 -2 h3.5 l1.8 -2.6 h5.4 l1.8 2.6 H21 a2 2 0 0 1 2 2 v11 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 Z" stroke="white" strokeWidth={2.2} fill="none" strokeLinejoin="round" />
            <circle cx="13" cy="13" r="4.3" stroke="white" strokeWidth={2.2} fill="none" />
          </svg>
        </div>
        <div style={{ flex: 1, fontSize: u(16), color: IG.secundario }}>Mensaje...</div>
        {/* micrófono */}
        <svg width={u(18)} height={u(24)} viewBox="0 0 20 26">
          <rect x="6" y="2" width="8" height="14" rx="4" {...ic} />
          <path d="M2.5 12 a7.5 7.5 0 0 0 15 0 M10 19.5 V24" {...ic} />
        </svg>
        {/* galería */}
        <svg width={u(22)} height={u(22)} viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="4" {...ic} />
          <circle cx="9" cy="9" r="1.8" {...ic} />
          <path d="M3.5 17 l5 -5 l4 4 l3 -3 l5 5" {...ic} />
        </svg>
        {/* sticker */}
        <svg width={u(22)} height={u(22)} viewBox="0 0 22 22" style={{ marginRight: u(6) }}>
          <path d="M14 20 H6 a4 4 0 0 1 -4 -4 V6 a4 4 0 0 1 4 -4 H16 a4 4 0 0 1 4 4 V14 Z M14 20 V17 a3 3 0 0 1 3 -3 H20" {...ic} />
          <path d="M7.5 9 h0.1 M14.5 9 h0.1" {...ic} strokeWidth={2.4} />
          <path d="M7.5 13 q3.5 2.5 7 0" {...ic} />
        </svg>
      </div>
    </div>
  );
};

/** Patrón de fondo: dibujos propios con la densidad y el trazo del de la app. */
const Patron: React.FC<{ u: (pt: number) => number }> = ({ u }) => {
  const lado = u(130);
  return (
    <AbsoluteFill>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="patron-chat" width={lado} height={lado} patternUnits="userSpaceOnUse">
            <g transform={`scale(${lado / 130})`} stroke={WA.patron} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* nota */}
              <path d="M14 26 V12 L24 10 V24 M14 26 a3 3 0 1 1 -3 -3 M24 24 a3 3 0 1 1 -3 -3" />
              {/* corazón */}
              <path d="M58 20 c-4 -6 -12 -2 -8 4 l8 8 l8 -8 c4 -6 -4 -10 -8 -4z" />
              {/* estrella */}
              <path d="M100 8 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1z" />
              {/* carita */}
              <circle cx="22" cy="62" r="9" />
              <path d="M18 64 q4 4 8 0 M19 59 h0.1 M25 59 h0.1" />
              {/* nube */}
              <path d="M52 70 h18 a5 5 0 0 0 -2 -10 a7 7 0 0 0 -13 2 a4 4 0 0 0 -3 8z" />
              {/* auriculares */}
              <path d="M94 70 v-6 a10 10 0 0 1 20 0 v6 M92 66 h4 v8 h-4z M112 66 h4 v8 h-4z" />
              {/* celular */}
              <rect x="14" y="94" width="13" height="22" rx="3" />
              <path d="M19 112 h3" />
              {/* sol */}
              <circle cx="62" cy="104" r="5" />
              <path d="M62 94 v3 M62 111 v3 M52 104 h3 M69 104 h3 M55 97 l2 2 M67 109 l2 2 M55 111 l2 -2 M67 99 l2 -2" />
              {/* rayo */}
              <path d="M104 92 l-6 12 h6 l-4 12 l10 -15 h-6 l4 -9z" />
              {/* puntitos */}
              <circle cx="40" cy="40" r="1.2" />
              <circle cx="82" cy="40" r="1.2" />
              <circle cx="40" cy="86" r="1.2" />
              <circle cx="84" cy="122" r="1.2" />
              <circle cx="122" cy="44" r="1.2" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#patron-chat)" />
      </svg>
    </AbsoluteFill>
  );
};

/** La letra sobre el video: las últimas palabras ya cantadas de la línea actual, en mayúscula. */
const LetraVideo: React.FC<{ props: ChatProps; t: number; u: (pt: number) => number }> = ({ props, t, u }) => {
  const { tema, palabrasEnVideo } = props;
  const starts = lineStarts(tema.lyrics);
  const i = activeLineIndex(tema.lyrics, t, starts);
  if (i < 0) return null;
  const dichas = tema.lyrics[i].words.filter((w) => t >= w.t);
  if (dichas.length === 0) return null;
  const texto = dichas
    .slice(-palabrasEnVideo)
    .map((w) => w.text)
    .join(" ")
    .toLocaleUpperCase("es");
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: u(6) }}>
      <div
        style={{
          fontFamily: TIKTOK_SANS,
          fontWeight: 900,
          fontStretch: "75%",
          fontSize: u(15),
          lineHeight: 1,
          color: "white",
          textAlign: "center",
          textShadow: "0 0 3px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9)",
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};

export const Chat: React.FC<ChatProps> = (props) => {
  const { tema, piel, mensajes, n, hora, cabecera, escala, iconoAudio, letraEnVideo, adelantoLectura, animacion, ladoMio, ancho, barraEscribir, franjaBotones } = props;
  const ig = piel === "instagram-claro";
  // alto de la barra para escribir (a la escala pedida)
  const altoBarra = barraEscribir ? (ig ? PT_IG.barra.alto : PT.barra.alto) * escala : 0;
  const altoCabecera = cabecera.mostrar ? (ig ? PT_IG.cabecera : 56) * escala : 0;
  /** si un mensaje va a la derecha */
  const aLaDerecha = (mio: boolean) => mio === (ladoMio === "derecha");
  const fija = animacion === "fija";
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const area = areaDelCuadro(width, height);
  const duracion = tema.fragment.end - tema.fragment.start;

  // la columna de la conversación: el cuadro entero (los mensajes pegados a los bordes, como en la app) o la zona libre
  const izquierda = ancho === "cuadro" ? 0 : area.left;
  const columna = ancho === "cuadro" ? width : area.right - area.left;

  // cuándo se leen mis mensajes: el primer "visto", "escribiendo", reacción o mensaje del otro después
  const leidoEn = (m: Mensaje) => Math.min(...mensajes.filter((x) => x.de === "otro" && x.t >= m.t).map((x) => x.t), Infinity);

  /** Las filas de una lista de mensajes, con cada reacción pegada al mensaje anterior. */
  const armar = (lista: { m: Mensaje; i: number }[]) => {
    const reaccionDe = new Map<number, Mensaje>();
    lista.forEach(({ m, i }) => {
      if (m.tipo !== "reaccion") return;
      for (let k = i - 1; k >= 0; k--) {
        if (!["reaccion", "visto", "escribiendo"].includes(mensajes[k].tipo)) {
          reaccionDe.set(k, m);
          break;
        }
      }
    });
    return { filas: lista.filter(({ m }) => m.tipo !== "reaccion"), reaccionDe };
  };
  const indexados = mensajes.map((m, i) => ({ m, i }));
  // la conversación completa, como queda al final (la captura)
  const completa = armar(indexados.filter(({ m }) => m.tipo !== "visto" && m.tipo !== "escribiendo"));
  // lo que se ve ahora: en la captura, todo; en vivo, lo que ya apareció (el "escribiendo" solo mientras dura)
  const ahora = fija
    ? completa
    : armar(indexados.filter(({ m }) => t >= m.t && m.tipo !== "visto" && (m.tipo !== "escribiendo" || t < m.t + (m.duracion ?? 1))));

  // ajuste: si la conversación completa no entra en el alto a la `escala` pedida,
  // se achica hasta que entre (se mide una copia invisible, una vez por pieza)
  // la conversación va entre la cabecera (arriba del cuadro) y la barra (abajo), sin salir de la zona libre
  const arribaConversacion = Math.max(area.top, altoCabecera);
  const abajoConversacion = Math.min(area.bottom, height - altoBarra);
  const altoDisponible = abajoConversacion - arribaConversacion;
  const refMedida = useRef<HTMLDivElement>(null);
  const [escalaFinal, setEscalaFinal] = useState<number | null>(null);
  const [handle] = useState(() => delayRender("ajuste del chat al alto"));
  useLayoutEffect(() => {
    let vivo = true;
    document.fonts.load(`400 17px Inter`).then(() => {
      if (!vivo || !refMedida.current) return;
      const alto = refMedida.current.offsetHeight;
      setEscalaFinal(alto > altoDisponible ? escala * (altoDisponible / alto) * 0.99 : escala);
      continueRender(handle);
    });
    return () => {
      vivo = false;
    };
  }, [escala, altoDisponible, handle, mensajes, cabecera.mostrar]);

  /** La conversación dibujada a una escala (px por punto). `medir`: copia invisible, sin video. */
  const dibujar = (esc: number, { filas, reaccionDe }: ReturnType<typeof armar>, medir: boolean) => {
    const u = (pt: number) => pt * esc;
    const anchoUtil = columna - 2 * u(PT.margen);

    const clip = (style: React.CSSProperties) =>
      medir ? (
        <div style={{ width: "100%", height: "100%" }} />
      ) : (
      <OffthreadVideo
        src={staticFile(tema.fragment.src)}
        trimBefore={Math.round(tema.fragment.start * fps)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      />
      );

    const burbuja = (mio: boolean): React.CSSProperties =>
      ig
        ? { background: mio ? IG.enviada : IG.recibida, borderRadius: u(PT_IG.radio), color: mio ? IG.textoEnviado : IG.texto }
        : { background: mio ? WA.enviada : WA.recibida, borderRadius: u(PT.radio), color: WA.texto };

    const contenido = (m: Mensaje, i: number) => {
      const mio = m.de === "yo";
      // en la captura, mis mensajes están leídos si el otro los vio o respondió
      const leido = mio && (fija ? leidoEn(m) < Infinity : t >= leidoEn(m));
      const horaEl = <Hora u={u} hora={hora} mio={mio} leido={leido} />;
      switch (m.tipo) {
        case "texto": {
          const texto = (m.texto ?? "").replaceAll("{n}", String(n));
          if (ig) {
            // Instagram no muestra la hora en cada mensaje
            return (
              <div style={{ ...burbuja(mio), maxWidth: Math.min(u(PT_IG.anchoMaximo), anchoUtil), padding: `${u(PT_IG.padY)}px ${u(PT_IG.padX)}px` }}>
                <span style={{ fontSize: u(PT_IG.texto), lineHeight: `${u(PT_IG.lineaTexto)}px` }}>{texto}</span>
              </div>
            );
          }
          return (
            <div style={{ ...burbuja(mio), position: "relative", maxWidth: Math.min(u(PT.anchoMaximo), anchoUtil), padding: `${u(PT.padArriba)}px ${u(PT.padX)}px ${u(PT.padAbajo)}px` }}>
              <span style={{ fontSize: u(PT.texto), lineHeight: `${u(PT.lineaTexto)}px` }}>
                {texto}{" "}
                {/* espacio para la hora: si no entra en el último renglón, baja solo él a uno nuevo (como en la app) */}
                <span style={{ display: "inline-block", width: u(mio ? 70 : 54), height: 1 }} />
              </span>
              <span style={{ position: "absolute", right: u(PT.padX - 1), bottom: u(PT.padAbajo - 1) }}>{horaEl}</span>
            </div>
          );
        }
        case "audio": {
          const p = Math.min(1, t / duracion);
          const a = PT.audio;
          const ancho = Math.min(u(a.ancho), anchoUtil * 0.95);
          // la barra va de la pausa al círculo; si la burbuja se angosta, la barra se acorta
          const barra = ancho - u(57) - u(10 + 46 + 12);
          const sec = mio ? WA.enviadaSecundario : WA.secundario;
          return (
            <div style={{ ...burbuja(mio), position: "relative", width: ancho, height: u(a.alto) }}>
              {m.reenviado && (
                <div style={{ position: "absolute", left: u(11), top: u(7), display: "flex", alignItems: "center", gap: u(4), fontSize: u(15), fontStyle: "italic", color: sec }}>
                  <svg width={u(14)} height={u(11)} viewBox="0 0 14 11">
                    <path d="M8 0.5 L13.5 5.5 L8 10.5 V7.3 C4.5 7.1 2 8.2 0.5 10.5 C1 6.5 3.5 3.8 8 3.6 Z" fill={sec} />
                  </svg>
                  Reenviado
                </div>
              )}
              {/* pausa */}
              <div style={{ position: "absolute", left: u(24), top: u(42), display: "flex", gap: u(3.4) }}>
                {[0, 1].map((b) => (
                  <div key={b} style={{ width: u(4.2), height: u(14), borderRadius: u(1), background: mio ? "rgba(255,255,255,0.8)" : WA.pausa }} />
                ))}
              </div>
              {/* barra y punto */}
              <div style={{ position: "absolute", left: u(57), top: u(48), width: barra, height: u(3), borderRadius: u(1.5), background: mio ? WA.barraEnviada : WA.barra }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, borderRadius: u(1.5), background: mio ? "rgba(255,255,255,0.45)" : "#3E403F" }} />
                <div style={{ position: "absolute", left: `${p * 100}%`, top: "50%", width: u(11), height: u(11), marginLeft: -u(5.5), marginTop: -u(5.5), borderRadius: "50%", background: mio ? "rgba(255,255,255,0.85)" : WA.punto }} />
              </div>
              {/* contador y hora */}
              <div style={{ position: "absolute", left: u(57), top: u(62), fontSize: u(13), color: sec, fontVariantNumeric: "tabular-nums" }}>{minutos(t)}</div>
              <div style={{ position: "absolute", left: u(57) + barra, top: u(63), transform: "translateX(-100%)" }}>{horaEl}</div>
              {/* círculo de la derecha: nota sobre color, o la portada */}
              <div
                style={{
                  position: "absolute",
                  right: u(10),
                  top: u(26),
                  width: u(46),
                  height: u(46),
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: WA.nota,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {iconoAudio === "portada" && tema.cover ? (
                  <Img src={staticFile(tema.cover)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <svg width={u(22)} height={u(22)} viewBox="0 0 22 22">
                    <path d="M8 16.5 V5 L18 3 V14.5" stroke="white" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
                    <ellipse cx="5.6" cy="16.6" rx="2.9" ry="2.4" fill="white" />
                    <ellipse cx="15.6" cy="14.6" rx="2.9" ry="2.4" fill="white" />
                  </svg>
                )}
              </div>
            </div>
          );
        }
        case "video": {
          const s = PT.sticker;
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: aLaDerecha(mio) ? "flex-end" : "flex-start", gap: u(2) }}>
              {/* el clip suelto, como un sticker: sin burbuja */}
              <div
                style={{
                  position: "relative",
                  width: u(s.ancho),
                  height: u(s.alto),
                  marginLeft: aLaDerecha(mio) ? 0 : u(PT.margenSticker - PT.margen),
                  marginRight: aLaDerecha(mio) ? u(PT.margenSticker - PT.margen) : 0,
                  overflow: "hidden",
                }}
              >
                {clip({})}
                {letraEnVideo && <LetraVideo props={props} t={t + adelantoLectura / fps} u={u} />}
              </div>
              <div style={{ ...burbuja(mio), height: u(PT.pildora.alto), padding: `0 ${u(9)}px`, display: "flex", alignItems: "center", borderRadius: u(PT.pildora.alto / 2) }}>
                {horaEl}
              </div>
            </div>
          );
        }
        case "reel": {
          // reel compartido: tarjeta vertical con el clip; abajo, ♪ título · artista (sin @ del artista)
          const r = PT_IG.reel;
          return (
            <div style={{ position: "relative", width: u(r.ancho), height: u(r.alto), borderRadius: u(r.radio), overflow: "hidden", background: "#000" }}>
              {clip({})}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: u(80), background: "linear-gradient(transparent, rgba(0,0,0,0.65))" }} />
              <div
                style={{
                  position: "absolute",
                  left: u(10),
                  right: u(10),
                  bottom: u(10),
                  display: "flex",
                  alignItems: "center",
                  gap: u(5),
                  color: "#FFFFFF",
                  fontSize: u(12.5),
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <svg width={u(11)} height={u(12)} viewBox="0 0 22 22" style={{ flexShrink: 0 }}>
                  <path d="M8 16.5 V5 L18 3 V14.5" stroke="white" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
                  <ellipse cx="5.6" cy="16.6" rx="3" ry="2.5" fill="white" />
                  <ellipse cx="15.6" cy="14.6" rx="3" ry="2.5" fill="white" />
                </svg>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tema.title} · {tema.artists}
                </span>
              </div>
              {letraEnVideo && <LetraVideo props={props} t={t + adelantoLectura / fps} u={u} />}
            </div>
          );
        }
        case "link": {
          const pv = PT.previa;
          return (
            <div style={{ ...burbuja(mio), position: "relative", width: Math.min(u(pv.ancho), anchoUtil * 0.9), padding: u(4), paddingBottom: u(20) }}>
              <div style={{ display: "flex", gap: u(8), alignItems: "center", background: mio ? WA.previaEnviada : WA.previa, borderRadius: u(12), overflow: "hidden" }}>
                {tema.cover ? (
                  <Img src={staticFile(tema.cover)} style={{ width: u(pv.portada), height: u(pv.portada), objectFit: "cover" }} />
                ) : (
                  <div style={{ width: u(pv.portada), height: u(pv.portada), background: WA.nota }} />
                )}
                <div style={{ minWidth: 0, paddingRight: u(8) }}>
                  <div style={{ fontSize: u(15), fontWeight: 600, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tema.title}</div>
                  <div style={{ fontSize: u(13), color: mio ? WA.enviadaSecundario : WA.secundario, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tema.artists}
                  </div>
                </div>
              </div>
              <span style={{ position: "absolute", right: u(PT.padX - 1), bottom: u(5) }}>{horaEl}</span>
            </div>
          );
        }
        case "escribiendo": {
          const fase = (frame / fps) * 3;
          return (
            <div style={{ ...burbuja(false), height: u(36), padding: `0 ${u(13)}px`, display: "flex", alignItems: "center", gap: u(5) }}>
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  style={{
                    width: u(7.5),
                    height: u(7.5),
                    borderRadius: "50%",
                    background: WA.secundario,
                    opacity: 0.4 + 0.6 * Math.max(0, Math.sin((fase - d * 0.35) * Math.PI)),
                  }}
                />
              ))}
            </div>
          );
        }
        default:
          return null;
      }
    };


    return (
      <div style={{ flexShrink: 0, padding: `${u(8)}px ${u(PT.margen)}px` }}>
          {filas.map(({ m, i }, k) => {
            const mio = m.de === "yo";
            const anterior = filas[k - 1]?.m;
            const separacion = k === 0 ? 0 : anterior?.de === m.de ? PT.separacion : PT.separacionCambio;
            // entrada: crece la fila (empuja lo de arriba), sube y aparece en 5 cuadros
            const edad = (t - m.t) * fps;
            const pr = fija || m.t <= 0 ? 1 : interpolate(edad, [0, ENTRADA_CUADROS], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const reaccion = reaccionDe.get(i);
            const edadReaccion = reaccion && !fija ? (t - reaccion.t) * fps : 100;
            return (
              <div key={i} style={{ display: "grid", gridTemplateRows: `${pr}fr`, opacity: pr }}>
                <div style={{ minHeight: 0, overflow: pr < 1 ? "hidden" : "visible" }}>
                  <div
                    style={{
                      paddingTop: u(separacion),
                      paddingBottom: reaccion ? u(16) : 0,
                      display: "flex",
                      justifyContent: aLaDerecha(mio) ? "flex-end" : "flex-start",
                      transform: `translateY(${(1 - pr) * u(10)}px)`,
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      {contenido(m, i)}
                      {reaccion && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -u(18),
                            [aLaDerecha(mio) ? "right" : "left"]: u(10),
                            height: u(24),
                            minWidth: u(28),
                            padding: `0 ${u(4)}px`,
                            borderRadius: u(12),
                            background: ig ? IG.campo : WA.recibida,
                            border: `${u(2)}px solid ${ig ? IG.fondo : WA.fondo}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: NOTO_EMOJI,
                            fontSize: u(14),
                            transform: `scale(${interpolate(edadReaccion, [0, 4, 7], [0.3, 1.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                          }}
                        >
                          {reaccion.emoji}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const esc = escalaFinal ?? escala;
  const u = (pt: number) => pt * esc;

  return (
    <AbsoluteFill style={{ backgroundColor: ig ? IG.fondo : WA.fondo, fontFamily: INTER }}>
      {!ig && <Patron u={u} />}

      {ig && cabecera.mostrar && (
        <CabeceraIG u={(pt) => pt * escala} left={izquierda} width={columna} nombre={cabecera.nombre} estado={cabecera.estado} />
      )}
      {!ig && cabecera.mostrar && (
        <div
          style={{
            position: "absolute",
            left: izquierda,
            width: columna,
            top: 0,
            height: altoCabecera,
            display: "flex",
            alignItems: "center",
            gap: u(10),
            padding: `0 ${u(10)}px`,
            background: WA.cabecera,
            color: WA.texto,
            boxSizing: "border-box",
          }}
        >
          <svg width={u(12)} height={u(20)} viewBox="0 0 12 20">
            <path d="M10 2 L2 10 L10 18" stroke={WA.texto} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ width: u(36), height: u(36), borderRadius: "50%", background: "#3A3C3B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: u(16), fontWeight: 600 }}>
            {cabecera.nombre.slice(0, 1).toLocaleUpperCase("es")}
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: u(17), fontWeight: 600 }}>{cabecera.nombre}</div>
            <div style={{ fontSize: u(12), color: WA.secundario }}>{cabecera.estado}</div>
          </div>
        </div>
      )}

      {/* la conversación: arriba si entra; si no, se corre hacia arriba (lo nuevo queda abajo) */}
      <div
        style={{
          position: "absolute",
          left: izquierda,
          width: columna,
          top: arribaConversacion,
          bottom: height - abajoConversacion,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {escalaFinal !== null && dibujar(esc, ahora, false)}
        {/* WhatsApp: si la conversación es corta, arranca arriba (lo que sobra queda abajo).
            Instagram: se apoya abajo, sobre la barra, como en la app */}
        {!ig && <div style={{ flexGrow: 1 }} />}
      </div>

      {barraEscribir &&
        (ig ? (
          <BarraIG u={(pt) => pt * escala} left={izquierda} width={columna} />
        ) : (
          <BarraEscribir u={(pt) => pt * escala} left={izquierda} width={columna} bottom={0} />
        ))}

      {/* copia invisible de la conversación completa a la escala pedida, para medir el alto */}
      <div ref={refMedida} style={{ position: "absolute", left: izquierda, width: columna, top: 0, visibility: "hidden", pointerEvents: "none" }}>
        {dibujar(escala, completa, true)}
      </div>

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};

