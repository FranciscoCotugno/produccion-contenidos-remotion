import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Halación (traído de LyricFilm): una copia desenfocada y cálida de la imagen,
 * en screen por encima, hace que las luces "sangren". Va encima de la imagen
 * original y recibe como hijo la copia (por ejemplo el mismo video, muteado).
 */
export const Halation: React.FC<{
  children: React.ReactNode;
  opacity?: number;
  filter?: string;
}> = ({ children, opacity = 0.25, filter = "blur(18px) brightness(0.9) sepia(0.6) saturate(1.6)" }) => (
  <AbsoluteFill style={{ mixBlendMode: "screen", opacity, pointerEvents: "none" }}>
    <AbsoluteFill style={{ filter }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);
