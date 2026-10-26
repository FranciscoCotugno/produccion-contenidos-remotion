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

// Cotu, 2026-10-26: "no tan alto como en los otros, con sombra y en negrita
// para que se lea bien".
//   peso 700    negrita
//   sombra 1    la sombra al máximo
//   altura 0,20 son 384 px (antes 317), o sea más abajo
//   enBanda 0,74 lo corre más hacia el borde del video dentro de la banda
//   ancho 960   en negrita el texto crece: con 820 la primera línea se partía
//               igual y el hook salía en tres renglones en vez de dos. A esta
//               altura (384 px) la columna de botones de TikTok todavía no
//               está: arranca bastante más abajo.
const HOOK = { tamano: 54, peso: 700, ancho: 960, fundido: 12, altura: 0.2, enBanda: 0.74, sombra: 1 };

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
        // el apilado cuadrado en todas (Cotu, 2026-10-23)
        archivo: MOSCA.cuadrada,
        modo: c.mosca.modo,
        // 340 px de lado. La mosca es cuadrada, así que el lado manda: a 340
        // centrada en 0,73 va de y=1232 a 1572, o sea dentro del tercio de
        // abajo y por encima de los 320 px que tapa TikTok.
        anchoTercio: 340,
        alturaTercio: 0.73,
        // 1,55 veces el ancho de la marca ajena: la cubre con aire de sobra
        holgura: 1.55,
        colorPlaca: "#000000",
      },
      watermarkBox: c.watermarkBox,
    },
  };
});
