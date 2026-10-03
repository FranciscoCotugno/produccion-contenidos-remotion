// Formato de letra común a todos los templates (traído de automatizacion-kioscos).
// Tiempos en segundos desde el inicio del fragmento. `stretch` estira una
// vocal mientras la palabra se sostiene (ej. "yoooo") y vuelve a la forma
// normal cuando entra la palabra siguiente.

import { z } from "zod";

export const wordSchema = z.object({
  t: z.number(),
  text: z.string(),
  stretch: z.object({ char: z.string(), max: z.number().int().min(1) }).optional(),
});

export const lineSchema = z.object({
  end: z.number(),
  words: z.array(wordSchema).min(1),
});

export const lyricsSchema = z.array(lineSchema);

export type Word = z.infer<typeof wordSchema>;
export type Line = z.infer<typeof lineSchema>;

/** Texto de la palabra en el tiempo `t`, con la vocal estirada mientras se sostiene. */
export const wordText = (w: Word, next: Word | undefined, t: number) => {
  if (!w.stretch || (next && t >= next.t)) return w.text;
  const holdEnd = next ? next.t : w.t + 1.2;
  const p = Math.min(1, (t - w.t) / (holdEnd - w.t));
  const extra = Math.floor(p * w.stretch.max);
  return w.text + w.stretch.char.repeat(extra);
};

/**
 * Inicio efectivo de cada línea: la primera palabra, o el final de la línea
 * anterior si llega antes. Así no quedan huecos entre líneas seguidas.
 */
export const lineStarts = (lyrics: Line[]) =>
  lyrics.map((l, i) => Math.min(l.words[0].t, i > 0 ? lyrics[i - 1].end : l.words[0].t));

/** Índice de la línea que suena en el tiempo `t`, o -1 si no hay ninguna. */
export const activeLineIndex = (lyrics: Line[], t: number, starts = lineStarts(lyrics)) =>
  lyrics.findIndex((l, i) => t >= starts[i] && t < l.end);
