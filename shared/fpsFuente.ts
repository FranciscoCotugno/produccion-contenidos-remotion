// Cuadros por segundo de una pieza: salen del archivo de video de fondo.
//
// Por qué existe esto: si la composición se renderiza a un fps distinto al del
// video de fondo, Remotion tiene que repetir o saltear cuadros de la fuente y el
// fondo se mueve a tirones. Pasó con la campaña de Maxi Espindola, cuyo videoclip
// es de 25 fps mientras los moldes renderizaban a 30: un cuadro repetido de cada
// seis, cinco veces por segundo.
//
// La regla es: **la composición se renderiza al fps de su video de fondo**. El
// valor no se escribe a mano en ningún lado, se lee del archivo, así que no puede
// quedar desactualizado ni mal cargado. Una pieza sin video (fondo liso, una nota)
// va a 30, que es el estándar del proyecto.

import { parseMedia } from "@remotion/media-parser";
import { staticFile } from "remotion";

/** fps de las piezas sin video de fondo */
export const FPS_POR_DEFECTO = 30;

/** velocidades de cuadro reales que usa el video */
const ESTANDAR = [24, 25, 30, 50, 60];

/**
 * El valor que sale del archivo puede traer ruido de punto flotante
 * (30.000000000000004) o, si el video es de fps variable, un promedio sin
 * sentido (29.45 en un celular que filma a 30). Se lleva al estándar más cercano
 * cuando está a menos del 3 %, que es el que la cámara quiso grabar.
 */
const normalizar = (fps: number) => {
  const cerca = ESTANDAR.filter((e) => Math.abs(e - fps) / e < 0.03).sort(
    (a, b) => Math.abs(a - fps) - Math.abs(b - fps),
  );
  return cerca[0] ?? Math.round(fps * 1000) / 1000;
};

// Un mismo video lo usan muchas composiciones: se lee una sola vez.
const leidos = new Map<string, Promise<number>>();

/** fps real del archivo, normalizado; 30 si no hay video o no se puede leer */
export const fpsDeFuente = (src: string): Promise<number> => {
  if (!src) return Promise.resolve(FPS_POR_DEFECTO);
  const yaEmpezado = leidos.get(src);
  if (yaEmpezado) return yaEmpezado;
  const leyendo = parseMedia({ src: staticFile(src), fields: { fps: true } })
    .then((m) => (typeof m.fps === "number" && m.fps > 0 ? normalizar(m.fps) : FPS_POR_DEFECTO))
    .catch(() => FPS_POR_DEFECTO);
  leidos.set(src, leyendo);
  return leyendo;
};

/**
 * Lo que devuelve `calculateMetadata` de cualquier molde: la duración sale del
 * fragmento y el fps del video de fondo. `src` vacío = sin video.
 */
export const metadataDeFragmento = async (segundos: number, src: string) => {
  const fps = await fpsDeFuente(src);
  return { fps, durationInFrames: Math.max(1, Math.round(segundos * fps)) };
};

// Un mismo video lo piden varias composiciones: se lee una sola vez.
const duraciones = new Map<string, Promise<number>>();

/**
 * Duración real del archivo, en segundos. La usa `VideoEnBucle` para saber cada
 * cuánto repetir un video más corto que la pieza. 0 si no se puede leer.
 */
export const duracionDeFuente = (src: string): Promise<number> => {
  if (!src) return Promise.resolve(0);
  const yaEmpezado = duraciones.get(src);
  if (yaEmpezado) return yaEmpezado;
  const leyendo = parseMedia({ src: staticFile(src), fields: { durationInSeconds: true } })
    .then((m) => (typeof m.durationInSeconds === "number" && m.durationInSeconds > 0 ? m.durationInSeconds : 0))
    .catch(() => 0);
  duraciones.set(src, leyendo);
  return leyendo;
};
