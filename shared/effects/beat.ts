// Golpe al ritmo (traído de LyricPunch en automatizacion-kioscos).
// El pulso sale de una grilla de beats: primer tiempo y período, en segundos
// desde el inicio del fragmento.

import { z } from "zod";

export const beatGridSchema = z.object({
  /** primer tiempo fuerte, en segundos */
  first: z.number(),
  /** segundos entre beats (60 / BPM) */
  period: z.number().positive(),
});

export type BeatGrid = z.infer<typeof beatGridSchema>;

/**
 * Golpe del ritmo: 1 en el tiempo fuerte (beats pares), 0.35 en los débiles,
 * y decae rápido (90 ms). En LyricPunch se usa como zoom del video:
 * `scale = zoomBase + beatPulse(t, grid) * 0.055`, con transformOrigin "50% 35%".
 */
export const beatPulse = (t: number, g: BeatGrid) => {
  if (t < g.first || g.period <= 0) return 0;
  const n = Math.floor((t - g.first) / g.period);
  const since = t - (g.first + n * g.period);
  const strong = n % 2 === 0 ? 1 : 0.35;
  return strong * Math.exp(-since / 0.09);
};
