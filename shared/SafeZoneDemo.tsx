import React from "react";
import { z } from "zod";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TIKTOK_SANS } from "./fonts";
import { activeLineIndex, lineStarts } from "./lyrics";
import { SafeZone, safeArea, safeZoneSchema } from "./SafeZone";
import { temaSchema } from "./tema";

// Composición de prueba de la base: título y letra de un tema de prueba
// ubicados dentro de la zona segura, para ver la guía funcionando en 9:16
// y en 1:1. No es un template.

export const safeZoneDemoSchema = z.object({ tema: temaSchema, safeZone: safeZoneSchema });

export const SafeZoneDemo: React.FC<z.infer<typeof safeZoneDemoSchema>> = ({ tema, safeZone }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const area = safeArea(width, height);
  const starts = lineStarts(tema.lyrics);
  const line = tema.lyrics[activeLineIndex(tema.lyrics, t, starts)];

  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #3a2a5c, #0d0b14)", fontFamily: TIKTOK_SANS, color: "white" }}>
      <div
        style={{
          position: "absolute",
          left: area.left,
          top: area.top,
          width: area.width,
          height: area.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 24,
          boxSizing: "border-box",
        }}
      >
        <div>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{tema.title}</div>
          <div style={{ fontSize: 34, opacity: 0.75, marginTop: 8 }}>{tema.artists}</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15, textAlign: "center" }}>
          {line?.words
            .filter((w) => t >= w.t)
            .map((w) => w.text)
            .join(" ")}
        </div>
      </div>
      <SafeZone config={safeZone} />
    </AbsoluteFill>
  );
};
