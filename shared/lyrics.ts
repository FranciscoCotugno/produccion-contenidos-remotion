// Formato de letra común a todos los templates (traído de automatizacion-kioscos).
// Tiempos en segundos desde el inicio del fragmento. Las palabras se muestran
// siempre tal cual están en la letra oficial: no se les agregan letras (el
// estiramiento de vocales sostenidas del repo de origen se sacó a propósito).

import { z } from "zod";

export const wordSchema = z.object({
  t: z.number(),
  text: z.string(),
});

export const lineSchema = z.object({
  end: z.number(),
  words: z.array(wordSchema).min(1),
});

export const lyricsSchema = z.array(lineSchema);

export type Word = z.infer<typeof wordSchema>;
export type Line = z.infer<typeof lineSchema>;

/**
 * Inicio efectivo de cada línea: la primera palabra, o el final de la línea
 * anterior si llega antes. Así no quedan huecos entre líneas seguidas.
 */
export const lineStarts = (lyrics: Line[]) =>
  lyrics.map((l, i) => Math.min(l.words[0].t, i > 0 ? lyrics[i - 1].end : l.words[0].t));

/** Índice de la línea que suena en el tiempo `t`, o -1 si no hay ninguna. */
export const activeLineIndex = (lyrics: Line[], t: number, starts = lineStarts(lyrics)) =>
  lyrics.findIndex((l, i) => t >= starts[i] && t < l.end);
