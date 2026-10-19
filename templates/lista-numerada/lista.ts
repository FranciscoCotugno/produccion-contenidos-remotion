// Esquema de una lista: una pieza que recorre varios temas.
//
// Vive acá y no en shared/ porque es el único molde que lo usa y la estructura
// común la decide Agustín (regla 7 del CLAUDE.md). Los datos están en
// datos-prueba/listas/, un archivo por lista; ver el LEEME de esa carpeta.

import { z } from "zod";

export const itemListaSchema = z.object({
  title: z.string(),
  artists: z.string(),
  /** ruta dentro de assets/; vacía = se dibuja un cuadrado de color */
  cover: z.string(),
  /** el recorte que suena de este tema */
  audio: z.object({ src: z.string(), start: z.number().min(0), end: z.number().min(0) }),
  /**
   * El videoclip de este tema, que se ve mientras suena (pedido de Cotu,
   * 2026-10-19). Vacío = se usa el fondo general del molde.
   *
   * OJO con los cuadros por segundo: la pieza es un solo archivo y tiene un
   * solo fps. Si los clips de la lista no coinciden (25, 23,98 y 30 en los
   * temas de prueba), los que no sean el elegido repiten o saltean cuadros y
   * se ven a tirones. Con un ranking **de un solo artista** —que es el caso
   * normal— los clips vienen de la misma entrega y comparten fps, así que el
   * problema no aparece.
   */
  video: z.object({ src: z.string(), inicio: z.number().min(0) }),
});

export const listaSchema = z.object({
  /** rótulo de la pieza; lo escribe una persona, no sale de los datos del tema */
  titulo: z.string(),
  /** el orden del array es el del ranking: el primero es el número 1 */
  items: z.array(itemListaSchema).min(2).max(10),
});

export type ItemLista = z.infer<typeof itemListaSchema>;
export type Lista = z.infer<typeof listaSchema>;

/**
 * Cuánto dura cada tramo y dónde arranca, en segundos desde el principio.
 *
 * Recibe los ítems **en el orden en que suenan**, que no siempre es el del
 * ranking: con revelación "al-1" se recorre al revés, y cada ítem tiene su
 * propio recorte de audio, así que los tramos salen distintos.
 */
export const tramos = (items: ItemLista[]) => {
  let t = 0;
  return items.map((it) => {
    const dura = Math.max(0.1, it.audio.end - it.audio.start);
    const desde = t;
    t += dura;
    return { desde, dura };
  });
};

export const duracionLista = (lista: Lista) =>
  lista.items.reduce((s, it) => s + Math.max(0.1, it.audio.end - it.audio.start), 0);
