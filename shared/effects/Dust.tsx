import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Polvo y rayas (traído de LyricFilm): pocas marcas por frame, en posiciones
 * pseudoaleatorias deterministas, y de vez en cuando una raya vertical.
 */
export const Dust: React.FC<{ color?: string }> = ({ color = "255,240,220" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const specks = Array.from({ length: 4 }, (_, i) => ({
    x: random(`dx${frame}-${i}`) * width,
    y: random(`dy${frame}-${i}`) * height,
    r: 1 + random(`dr${frame}-${i}`) * 3,
    show: random(`ds${frame}-${i}`) > 0.55,
  }));
  const scratch = random(`sc${frame}`) > 0.8;
  const sx = random(`sx${Math.floor(frame / 6)}`) * width;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height}>
        {specks
          .filter((s) => s.show)
          .map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={`rgba(${color},0.55)`} />
          ))}
        {scratch && <line x1={sx} y1={0} x2={sx + 6} y2={height} stroke={`rgba(${color},0.18)`} strokeWidth={1.5} />}
      </svg>
    </AbsoluteFill>
  );
};
