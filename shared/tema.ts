// Esquema de los temas de prueba (datos-prueba/<tema>/tema.json): datos del
// tema, fragmento, letra y pulso. Sigue los "Datos de entrada comunes" del
// CLAUDE.md; los templates toman de acá lo que necesitan como props.

import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { lyricsSchema } from "./lyrics";
import { beatGridSchema } from "./effects/beat";

export const temaSchema = z.object({
  title: z.string(),
  artists: z.string(),
  /** ruta dentro de assets/ (vacía hasta tener la portada) */
  cover: z.string(),
  colors: z.object({ primary: zColor(), secondary: zColor(), text: zColor() }).optional(),
  fragment: z.object({
    /** ruta dentro de assets/, normalmente media/<archivo> */
    src: z.string(),
    start: z.number(),
    end: z.number(),
  }),
  /** dónde cae el fragmento dentro del tema completo, para reproductores */
  track: z.object({ displayStart: z.number(), duration: z.number() }).optional(),
  lyrics: lyricsSchema,
  beats: beatGridSchema.optional(),
});

export type Tema = z.infer<typeof temaSchema>;
