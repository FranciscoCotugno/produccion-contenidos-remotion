// Molde nota-celular (C7): una nota de la app de notas del celular, donde el
// texto se va escribiendo letra por letra mientras suena el tema; al final
// entra la tarjeta del tema. Ver FICHA.md. Sale en 1:1 (1080×1080), pedido de Cotu.
//
// La interfaz es idéntica a la de la app de notas del iPhone y sin logos
// (CLAUDE.md), salvo la barra de estado (hora, wifi y batería), que se sacó
// para ganar espacio (pedido de Cotu): barra de navegación con el volver en
// amarillo y los íconos de la derecha, la fecha centrada, el título en negrita,
// el cuerpo y la barra de herramientas de abajo. En letra Inter, en lugar de la del
// sistema. Pieles clara y oscura, las dos de la app.

import React, { useMemo } from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { INTER } from "../../shared/fonts";
import { SafeZone, safeArea, safeZoneSchema } from "../../shared/SafeZone";
import { temaSchema } from "../../shared/tema";

export const notaCelularSchema = z.object({
  tema: temaSchema,
  /** clara (papel blanco) u oscura (negra), las dos de la app */
  piel: z.enum(["clara", "oscura"]),
  /** confesión (un texto corto que termina en una frase de la letra) o lista */
  modo: z.enum(["confesion", "lista"]),
  /** título de la nota, arriba en negrita */
  titulo: z.string(),
  /** cuerpo de la nota, el que se va escribiendo; un renglón por línea */
  texto: z.string(),
  /** letras por segundo del tipeo (se acelera solo si el texto no entra en el fragmento) */
  velocidad: z.number().min(5).max(40),
  /** fecha de la nota, como la escribe la app */
  fecha: z.string(),
  /** la tarjeta del tema entra desde abajo al terminar el tipeo */
  mostrarTarjeta: z.boolean(),
  safeZone: safeZoneSchema,
});
export type NotaCelularProps = z.infer<typeof notaCelularSchema>;

/** La duración sale del fragmento: inicio y fin. */
export const duracionNotaCelular: CalculateMetadataFunction<NotaCelularProps> = ({ props }) => ({
  durationInFrames: Math.max(1, Math.round((props.tema.fragment.end - props.tema.fragment.start) * 30)),
});

/** Medidas de la app, en puntos de pantalla (la de un iPhone, 393 pt de ancho). */
const PT = {
  pantalla: 393,
  nav: { alto: 44, texto: 17, margen: 16, icono: 30 },
  fecha: 13,
  titulo: 24,
  cuerpo: 19,
  interlineado: 1.35,
  margenTexto: 20,
  barra: { alto: 60, icono: 26 },
};

/** Colores de la app, en sus dos pieles. */
const PIELES = {
  clara: {
    fondo: "#FFFFFF",
    texto: "#000000",
    secundario: "#8A8A8E",
    acento: "#D9A520",
    iconoFondo: "rgba(120,120,128,0.12)",
    icono: "#D9A520",
    barraIcono: "#D9A520",
    separador: "rgba(60,60,67,0.18)",
  },
  oscura: {
    fondo: "#000000",
    texto: "#FFFFFF",
    secundario: "#8E8E93",
    acento: "#FFD426",
    iconoFondo: "rgba(120,120,128,0.24)",
    icono: "#FFD426",
    barraIcono: "#FFD426",
    separador: "rgba(84,84,88,0.65)",
  },
} as const;

// --- íconos (dibujados a mano, como los de la app) ---------------------------------

const Volver: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <svg width={u(12)} height={u(20)} viewBox="0 0 12 20">
    <path d="M10 2 L2 10 L10 18" stroke={color} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
/** compartir: cuadro con una flecha para arriba */
const Compartir: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <svg width={u(18)} height={u(20)} viewBox="0 0 18 20">
    <path d="M9 1.5 V12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M5.4 5 L9 1.4 L12.6 5" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 8.4H2.6v9.2h12.8V8.4H14" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
/** lápiz (escribir a mano) */
const Lapiz: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <svg width={u(18)} height={u(18)} viewBox="0 0 18 18">
    <path d="M3 13.2 11.6 4.6l2.8 2.8L5.8 16 2.4 16.6Z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    <path d="M12.6 3.6 14 2.2a1.4 1.4 0 0 1 2 0l0.8 0.8a1.4 1.4 0 0 1 0 2l-1.4 1.4Z" fill={color} />
  </svg>
);
const Mas: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <svg width={u(18)} height={u(5)} viewBox="0 0 18 5">
    {[2.5, 9, 15.5].map((x) => (
      <circle key={x} cx={x} cy="2.5" r="1.9" fill={color} />
    ))}
  </svg>
);
/** lista con tildes */
const Lista: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <svg width={u(22)} height={u(18)} viewBox="0 0 22 18">
    {[2, 9, 16].map((y) => (
      <React.Fragment key={y}>
        <circle cx="3.2" cy={y} r="2.6" stroke={color} strokeWidth="1.4" fill="none" />
        <rect x="9" y={y - 0.9} width="12.4" height="1.8" rx="0.9" fill={color} />
      </React.Fragment>
    ))}
  </svg>
);
/** formato: "Aa" */
const Formato: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <span style={{ fontSize: u(17), fontWeight: 500, color, letterSpacing: u(-0.3) }}>Aa</span>
);
const Camara: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <svg width={u(24)} height={u(19)} viewBox="0 0 24 19">
    <rect x="1" y="3.6" width="22" height="14.4" rx="3.4" stroke={color} strokeWidth="1.6" fill="none" />
    <path d="M8 3.6 9.4 1h5.2L16 3.6" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    <circle cx="12" cy="10.8" r="4" stroke={color} strokeWidth="1.6" fill="none" />
  </svg>
);
/** nota nueva: cuadro con lápiz */
const NotaNueva: React.FC<{ u: (pt: number) => number; color: string }> = ({ u, color }) => (
  <svg width={u(21)} height={u(21)} viewBox="0 0 21 21">
    <path d="M18.4 11.4v6a2.6 2.6 0 0 1-2.6 2.6H3.6A2.6 2.6 0 0 1 1 17.4V5.2a2.6 2.6 0 0 1 2.6-2.6h6" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    <path d="M7.6 12.2 16.4 3.4l2.2 2.2-8.8 8.8-2.9 0.7Z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
  </svg>
);

// --- el tipeo ------------------------------------------------------------------------

/**
 * Cuándo aparece cada letra: ritmo humano, con la velocidad variando un poco
 * (sin azar: sale del índice de la letra) y pausas cortas después de cada coma,
 * punto o salto de línea. Si el texto no entra en el fragmento, todo se acelera
 * parejo para que termine a tiempo.
 */
const tiemposTipeo = (texto: string, velocidad: number, desde: number, hasta: number) => {
  const base = 1 / velocidad;
  const t: number[] = [];
  let ahora = desde;
  for (let i = 0; i < texto.length; i++) {
    // la velocidad oscila ±25 %, siempre igual para el mismo texto
    ahora += base * (1 + 0.25 * Math.sin(i * 1.7));
    const c = texto[i];
    if (c === ",") ahora += 0.18;
    else if (c === "." || c === "?" || c === "!") ahora += 0.35;
    else if (c === "\n") ahora += 0.4;
    t.push(ahora);
  }
  const fin = t[t.length - 1] ?? desde;
  if (fin > hasta && fin > desde) {
    const factor = (hasta - desde) / (fin - desde);
    return t.map((x) => desde + (x - desde) * factor);
  }
  return t;
};

// --- la pieza --------------------------------------------------------------------------

export const NotaCelular: React.FC<NotaCelularProps> = ({ tema, piel, titulo, texto, velocidad, fecha, mostrarTarjeta, safeZone }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const c = PIELES[piel];
  const u = (pt: number) => (pt * width) / PT.pantalla;
  const area = safeArea(width, height);
  const duracion = durationInFrames / fps;
  const margenTexto = Math.max(u(PT.margenTexto), area.left);

  // el tipeo arranca enseguida y termina con tiempo para que se vea la tarjeta
  const inicio = 0.25;
  const margenFinal = mostrarTarjeta ? 2.4 : 0.6;
  const tiempos = useMemo(() => tiemposTipeo(texto, velocidad, inicio, duracion - margenFinal), [texto, velocidad, duracion, margenFinal]);
  const escritas = tiempos.filter((x) => x <= t).length;
  const visible = texto.slice(0, escritas);
  const tipeando = escritas < texto.length;
  // el cursor parpadea una vez por segundo y queda fijo mientras se escribe
  const cursor = tipeando || Math.floor(t * 2) % 2 === 0;

  // la tarjeta entra desde abajo al terminar el tipeo
  const finTipeo = tiempos[tiempos.length - 1] ?? inicio;
  const entrada = mostrarTarjeta
    ? spring({ frame: frame - Math.round((finTipeo + 0.35) * fps), fps, config: { damping: 200 }, durationInFrames: 18 })
    : 0;

  const icono = (hijo: React.ReactNode) => (
    <div
      style={{
        width: u(PT.nav.icono),
        height: u(PT.nav.icono),
        borderRadius: u(PT.nav.icono),
        background: c.iconoFondo,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hijo}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: c.fondo, fontFamily: INTER, color: c.texto }}>
      {/* barra de navegación: volver a "Notas" y, a la derecha, compartir, lápiz y más */}
      <div
        style={{
          height: u(PT.nav.alto),
          padding: `0 ${u(PT.nav.margen)}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: u(5), color: c.acento }}>
          <Volver u={u} color={c.acento} />
          <span style={{ fontSize: u(PT.nav.texto) }}>Notas</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: u(10) }}>
          {icono(<Compartir u={u} color={c.icono} />)}
          {icono(<Lapiz u={u} color={c.icono} />)}
          {icono(<Mas u={u} color={c.icono} />)}
        </div>
      </div>

      {/* la nota: fecha centrada, título y cuerpo que se escribe. El margen de
          la app es de 20 pt, pero el texto no pasa de la zona libre: si no, los
          renglones largos quedan abajo de los botones de TikTok. Ocupa todo el
          alto que queda hasta la barra de herramientas, así la tarjeta del tema
          se apoya arriba de ella. */}
      <div
        style={{
          position: "absolute",
          top: u(PT.nav.alto + 10),
          bottom: u(PT.barra.alto),
          left: margenTexto,
          width: area.right - margenTexto,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ textAlign: "center", fontSize: u(PT.fecha), color: c.secundario, marginBottom: u(10) }}>{fecha}</div>
        <div style={{ fontSize: u(PT.titulo), fontWeight: 700, lineHeight: 1.25, marginBottom: u(6) }}>{titulo}</div>
        <div style={{ fontSize: u(PT.cuerpo), lineHeight: PT.interlineado, whiteSpace: "pre-wrap" }}>
          {visible}
          <span
            style={{
              display: "inline-block",
              width: u(2),
              height: u(PT.cuerpo * 1.1),
              marginBottom: u(-2),
              background: c.acento,
              opacity: cursor ? 1 : 0,
            }}
          />
        </div>

        {/* la tarjeta del tema, centrada a lo ancho y
            centrada en el espacio que queda entre el texto y la barra de
            herramientas (la misma tarjeta chica del carrusel R2): va en el
            flujo de la nota, así nunca se superpone con lo escrito */}
        {mostrarTarjeta && (
        <div
          style={{
            width: u(250),
            margin: "auto",
            transform: `translateY(${interpolate(entrada, [0, 1], [u(40), 0])}px)`,
            padding: u(10),
            borderRadius: u(16),
            background: piel === "clara" ? "rgba(28,28,30,0.92)" : "rgba(44,44,46,0.96)",
            color: "#FFFFFF",
            boxShadow: "0 10px 34px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: u(10),
            opacity: entrada,
          }}
        >
          {tema.cover && <Img src={staticFile(tema.cover)} style={{ width: u(46), height: u(46), borderRadius: u(7), objectFit: "cover", flexShrink: 0 }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: u(15), fontWeight: 700, lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tema.title}</div>
            <div style={{ fontSize: u(13), opacity: 0.7, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tema.artists}</div>
          </div>
        </div>
        )}
      </div>

      {/* barra de herramientas de la app, abajo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: u(PT.barra.alto),
          padding: `0 ${u(22)}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `${Math.max(1, u(0.5))}px solid ${c.separador}`,
        }}
      >
        <Lista u={u} color={c.barraIcono} />
        <Formato u={u} color={c.barraIcono} />
        <Lapiz u={u} color={c.barraIcono} />
        <Camara u={u} color={c.barraIcono} />
        <NotaNueva u={u} color={c.barraIcono} />
      </div>

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <SafeZone config={safeZone} />
    </AbsoluteFill>
  );
};
