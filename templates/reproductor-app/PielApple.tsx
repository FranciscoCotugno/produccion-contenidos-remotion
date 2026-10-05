// Piel estilo Apple Music (L05 oscura). Tarjeta de vidrio con el videoclip
// en el lugar de la portada, título, artistas, barra de progreso, controles,
// volumen y la fila de íconos de abajo. Rehecha a partir del LyricPlayer de
// automatizacion-kioscos, sin nombres de marca.
//
// La tarjeta se diseña a su tamaño natural (TARJETA_APPLE) y el template la
// escala desde el borde de abajo para que entre en la zona segura.

import React from "react";
import { GEIST } from "../../shared/fonts";
import { Iconos } from "./iconos";

export const TARJETA_APPLE = { width: 644, height: 1140 };

/**
 * Escala de la tarjeta en la piel oscura, decidida en Studio. Con el
 * reproductor centrado en vertical, solo la fila de íconos y el borde de abajo
 * de la tarjeta entran en la zona segura de abajo (ver FICHA).
 */
export const ESCALA_APPLE_OSCURA = 1.01;

/** controles: arriba y alto de la fila (el botón de pausa mide 70) */
const CONTROLES = { top: 866, alto: 70 };

const PAD = 37;
const ANCHO_INTERNO = TARJETA_APPLE.width - PAD * 2 - 11 * 2;
/** volumen simulado de la barra, decorativo */
const VOLUMEN = 0.37;

const tiempo = (s: number) => {
  const v = Math.max(0, Math.floor(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
};

/** color con transparencia, a partir de cualquier color CSS */
const alfa = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

export const PielApple: React.FC<{
  portada: React.ReactNode;
  titulo: string;
  artistas: string;
  /** segundo simulado del tema y duración total, para barra y contadores */
  transcurrido: number;
  duracion: number;
  primario: string;
  secundario: string;
  /** borde de abajo de la tarjeta, centro horizontal y escala */
  abajo: number;
  centroX: number;
  escala: number;
}> = ({ portada, titulo, artistas, transcurrido, duracion, primario, secundario, abajo, centroX, escala }) => {
  const progreso = Math.min(1, Math.max(0, transcurrido / duracion));
  const tenue = "rgba(255,255,255,0.55)";
  const left = PAD + 11;

  return (
    <div
      style={{
        position: "absolute",
        left: centroX - TARJETA_APPLE.width / 2,
        top: abajo - TARJETA_APPLE.height,
        width: TARJETA_APPLE.width,
        height: TARJETA_APPLE.height,
        borderRadius: 84,
        overflow: "hidden",
        transform: `scale(${escala})`,
        transformOrigin: "50% 100%",
        backdropFilter: "blur(40px) saturate(1.5)",
        background: `linear-gradient(180deg, rgba(80,80,86,0.5) 0%, rgba(60,58,64,0.36) 50%, ${alfa(primario, 42)} 100%)`,
        boxShadow:
          "inset 0 2px 0 rgba(255,255,255,0.22), inset 0 0 0 1.5px rgba(255,255,255,0.12), 0 30px 80px rgba(0,0,0,0.45)",
        fontFamily: GEIST,
        color: "white",
      }}
    >
      {/* portada = videoclip */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: PAD,
          width: TARJETA_APPLE.width - PAD * 2,
          height: TARJETA_APPLE.width - PAD * 2,
          borderRadius: 44,
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        }}
      >
        {portada}
      </div>

      {/* título y artistas */}
      <div style={{ position: "absolute", left, top: 652, right: 120 }}>
        {[
          { texto: titulo, peso: 700, color: "white" },
          { texto: artistas, peso: 500, color: tenue },
        ].map(({ texto, peso, color }, i) => (
          <div
            key={i}
            style={{
              fontSize: 34,
              fontWeight: peso,
              color,
              lineHeight: 1.25,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {texto}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: left, top: 660 }}>{Iconos.mas("rgba(255,255,255,0.14)", "white")}</div>

      {/* barra de progreso y tiempos */}
      <div
        style={{
          position: "absolute",
          left,
          top: 772,
          width: ANCHO_INTERNO,
          height: 13,
          borderRadius: 7,
          overflow: "hidden",
          background: `linear-gradient(90deg, ${alfa(secundario, 60)}, ${alfa(primario, 65)})`,
        }}
      >
        <div style={{ width: `${progreso * 100}%`, height: "100%", background: "rgba(255,255,255,0.95)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left,
          width: ANCHO_INTERNO,
          top: 800,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          fontWeight: 600,
          color: tenue,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>{tiempo(transcurrido)}</span>
        <span>-{tiempo(duracion - transcurrido)}</span>
      </div>

      {/* controles */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CONTROLES.top,
          height: CONTROLES.alto,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 64,
        }}
      >
        {Iconos.anterior("white")}
        {Iconos.pausa("white")}
        {Iconos.siguiente("white")}
      </div>

      {/* volumen */}
      <div style={{ position: "absolute", left, width: ANCHO_INTERNO, top: 994, display: "flex", alignItems: "center", gap: 18 }}>
        {Iconos.volumenBajo(tenue)}
        <div
          style={{
            flex: 1,
            height: 13,
            borderRadius: 7,
            overflow: "hidden",
            background: `linear-gradient(90deg, ${alfa(primario, 40)}, ${alfa(primario, 70)})`,
          }}
        >
          <div style={{ width: `${VOLUMEN * 100}%`, height: "100%", background: "rgba(255,255,255,0.95)" }} />
        </div>
        {Iconos.volumenAlto(tenue)}
      </div>

      {/* fila de abajo: letra, salida de audio, cola */}
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 1062,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {Iconos.letra(tenue)}
        {Iconos.salida(tenue)}
        {Iconos.cola(tenue)}
      </div>
    </div>
  );
};
