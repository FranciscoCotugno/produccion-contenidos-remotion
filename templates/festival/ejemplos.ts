// Las piezas del Festival Generación. Salen de
// assets/media/festival-generacion/clips.json, que tiene los hooks que escribió
// Cotu y las cajas de la marca ajena medidas en la etapa 2.

import clips from "../../datos-prueba/festival-generacion/clips.json";
import type { FestivalProps } from "./FestivalClip";

export const FORMATO_FESTIVAL = { ancho: 1080, alto: 1920 } as const;

const MEDIA = "media/festival-generacion";

/** Dos versiones de la mosca; cuál va la decide el modo, no la cuenta. */
const MOSCA = {
  /** el logotipo apaisado: una barra ancha, lee como logo de festival */
  horizontal: `${MEDIA}/mosca/generacion-horizontal.webp`,
  /** el apilado cuadrado: compacto, rinde mejor para tapar una caja */
  cuadrada: `${MEDIA}/mosca/generacion-cuadrada.png`,
};

// Cotu, 2026-10-23: un poco más grande y unos píxeles más abajo.
// `altura` 0,165 son 317 px: bien por debajo de los 120 que tapa TikTok.
// `enBanda` 0,62 lo corre hacia el borde del video en vez de centrarlo.
const HOOK = { tamano: 54, peso: 400, ancho: 820, fundido: 12, altura: 0.165, enBanda: 0.62 };

type Clip = {
  archivo: string;
  hook: string;
  grupo: string;
  fuente: { ancho: number; alto: number; fps: number; duracion: number };
  mosca: { modo: "tercio" | "tapar"; archivo: string };
  watermarkBox: { cx: number; cy: number; ancho: number; alto: number } | null;
};

export const ejemplosFestival: { id: string; props: FestivalProps }[] = (clips.clips as Clip[]).map((c) => {
  const tapar = c.mosca.modo === "tapar" && c.watermarkBox !== null;
  return {
    id: `Festival-${c.archivo.replace(".mp4", "")}`,
    props: {
      clip: { src: `${MEDIA}/${c.archivo}`, ancho: c.fuente.ancho, alto: c.fuente.alto },
      hook: c.hook,
      hookEstilo: HOOK,
      mosca: {
        // el logotipo apaisado en los dos modos: la marca ajena es un renglón
        // de texto ancho, así que una placa ancha la cubre con menos superficie
        // que una cuadrada. La cuadrada queda disponible si hiciera falta.
        archivo: MOSCA.horizontal,
        modo: c.mosca.modo,
        // 440 px de ancho: entra holgado y no se mete en los 180 px que tapa
        // TikTok a la derecha
        anchoTercio: 440,
        // 0,745 del alto deja la mosca en el tercio de abajo y por encima de
        // los 320 px donde TikTok pone el usuario y el epígrafe
        alturaTercio: 0.745,
        // 1,55 veces el ancho de la marca ajena: la cubre con aire de sobra
        holgura: 1.55,
        colorPlaca: "#000000",
      },
      watermarkBox: c.watermarkBox,
    },
  };
});
