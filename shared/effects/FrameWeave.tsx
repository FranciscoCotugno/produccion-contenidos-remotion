import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

/**
 * Temblor de cuadro (traído de LyricFilm): el cuadro se corre un par de
 * píxeles por frame como película en el proyector, y la luz parpadea.
 * `flicker` se multiplica al brightness de la imagen.
 */
export const useFrameWeave = (amount = 1) => {
  const frame = useCurrentFrame();
  return {
    x: (random(`wx${frame}`) - 0.5) * 3 * amount,
    y: (random(`wy${frame}`) - 0.5) * 4 * amount,
    flicker: 1 + (random(`fl${frame}`) - 0.5) * 0.06 * amount,
  };
};

/** Envuelve la imagen y la mueve con el temblor; escala 1.03 para no mostrar bordes. */
export const FrameWeave: React.FC<{ children: React.ReactNode; amount?: number }> = ({ children, amount = 1 }) => {
  const { x, y } = useFrameWeave(amount);
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(1.03)` }}>{children}</AbsoluteFill>;
};
