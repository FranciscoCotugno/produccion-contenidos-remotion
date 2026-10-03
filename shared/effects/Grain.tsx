import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Grano animado (traído de LyricFilm): ruido distinto en cada frame, a media
 * resolución para que sea grueso como el de película. Va en overlay encima de
 * todo, letra incluida. En LyricFilm: amount 0.35.
 */
export const Grain: React.FC<{ amount?: number }> = ({ amount = 0.35 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const id = `grain${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const w = width / 2;
  const h = height / 2;
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: amount, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={w} height={h} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};
