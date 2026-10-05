// Guía de zona segura de TikTok. Pinta lo que tapa la interfaz de la app
// sobre la composición, para revisar que nada importante quede abajo.
//
// Las medidas son sobre la pantalla de la app en 9:16 (1080×1920). Si la
// composición tiene otra proporción (por ejemplo 1:1), TikTok la muestra
// entera con bandas: la guía encaja el cuadro en la pantalla igual que la app
// y pinta solo la parte de cada zona que cae sobre el cuadro.
//
// Se prende y apaga desde Studio con la prop `safeZone.show` de cada
// composición (arranca apagada, así nunca sale en un render). Para calibrar,
// poné una captura real de TikTok en assets/safezone/ y pasala en
// `safeZone.capture`.

import React from "react";
import { z } from "zod";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";

/**
 * Pantalla de la app y lo que tapa la interfaz, en px.
 *
 * Calibrado con assets/safezone/captura-tiktok-iphone.jpg (iPhone, recortada
 * al área del video y llevada a 1080×1920). Medido en esa captura:
 * - arriba: las pestañas terminan en ~120 px; se deja 150 de margen.
 * - derecha: la columna de botones y sus contadores arranca en x≈927, o sea
 *   ~153 px; se toma 155.
 * - izquierda: el usuario arranca a ~40 px; se deja 60.
 * - abajo: en esa captura el video no tiene caption ni línea de sonido y la
 *   barra de navegación queda fuera del video, así que solo tapa ~80 px. No
 *   sirve para calibrar abajo: se mantienen los 450 px (caption de varias
 *   líneas, sonido, y teléfonos donde la barra se superpone al video).
 */
export const TIKTOK_SCREEN = { width: 1080, height: 1920 };
export const TIKTOK_UI = { top: 150, bottom: 450, right: 155, left: 60 };

export const safeZoneSchema = z.object({
  /** mostrar la guía (solo para revisar en Studio) */
  show: z.boolean(),
  /** captura de TikTok para calibrar, ruta dentro de assets/ (vacío = sin captura) */
  capture: z.string(),
  /** opacidad de la captura */
  captureOpacity: z.number().min(0).max(1).step(0.05),
});

export type SafeZoneProps = z.infer<typeof safeZoneSchema>;

export const safeZoneOff: SafeZoneProps = { show: false, capture: "", captureOpacity: 0.5 };

/** Cómo la app encaja una composición de w×h en la pantalla (contain, centrado). */
const fitInScreen = (width: number, height: number) => {
  const scale = Math.min(TIKTOK_SCREEN.width / width, TIKTOK_SCREEN.height / height);
  return {
    scale,
    offsetX: (TIKTOK_SCREEN.width - width * scale) / 2,
    offsetY: (TIKTOK_SCREEN.height - height * scale) / 2,
  };
};

/**
 * Rectángulo libre de interfaz, en coordenadas de la composición. Los
 * templates pueden usarlo para ubicar letra, títulos y tarjetas.
 */
export const safeArea = (width: number, height: number) => {
  const { scale, offsetX, offsetY } = fitInScreen(width, height);
  const toX = (x: number) => Math.min(width, Math.max(0, (x - offsetX) / scale));
  const toY = (y: number) => Math.min(height, Math.max(0, (y - offsetY) / scale));
  const left = toX(TIKTOK_UI.left);
  const top = toY(TIKTOK_UI.top);
  const right = toX(TIKTOK_SCREEN.width - TIKTOK_UI.right);
  const bottom = toY(TIKTOK_SCREEN.height - TIKTOK_UI.bottom);
  return { left, top, right, bottom, width: right - left, height: bottom - top };
};

const ZONE = "rgba(255, 40, 70, 0.32)";
const LABEL: React.CSSProperties = {
  position: "absolute",
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  fontSize: 26,
  fontWeight: 700,
  color: "white",
  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
  whiteSpace: "nowrap",
};

export const SafeZone: React.FC<{ config: SafeZoneProps }> = ({ config }) => {
  const { width, height } = useVideoConfig();
  if (!config.show) return null;

  const area = safeArea(width, height);
  const { scale, offsetX, offsetY } = fitInScreen(width, height);
  const box = (style: React.CSSProperties) => (
    <div style={{ position: "absolute", background: ZONE, ...style }} />
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {config.capture !== "" && (
        <Img
          src={staticFile(config.capture)}
          style={{
            position: "absolute",
            left: -offsetX / scale,
            top: -offsetY / scale,
            width: TIKTOK_SCREEN.width / scale,
            height: TIKTOK_SCREEN.height / scale,
            opacity: config.captureOpacity,
          }}
        />
      )}

      {box({ left: 0, right: 0, top: 0, height: area.top })}
      {box({ left: 0, right: 0, top: area.bottom, bottom: 0 })}
      {box({ left: 0, width: area.left, top: area.top, height: area.height })}
      {box({ left: area.right, right: 0, top: area.top, height: area.height })}

      <div
        style={{
          position: "absolute",
          left: area.left,
          top: area.top,
          width: area.width,
          height: area.height,
          border: "3px dashed rgba(255,255,255,0.85)",
          boxSizing: "border-box",
        }}
      />

      {area.top > 30 && <div style={{ ...LABEL, left: area.left + 12, top: area.top - 36 }}>arriba {TIKTOK_UI.top}px</div>}
      {height - area.bottom > 30 && (
        <div style={{ ...LABEL, left: area.left + 12, top: area.bottom + 10 }}>abajo {TIKTOK_UI.bottom}px</div>
      )}
      <div
        style={{
          ...LABEL,
          left: area.right + (width - area.right) / 2,
          top: area.top + area.height / 2,
          transform: "translate(-50%, -50%) rotate(90deg)",
        }}
      >
        derecha {TIKTOK_UI.right}px
      </div>
      {width !== TIKTOK_SCREEN.width || height !== TIKTOK_SCREEN.height ? (
        <div style={{ ...LABEL, right: 12, bottom: 8, fontSize: 22 }}>
          {width}×{height} visto en la app a escala {scale.toFixed(2)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
