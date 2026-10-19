// Datos de ejemplo del molde: con qué tema, video, modo y texto se arma cada
// pieza, y en qué formato. Los textos y los videos de nicho salen de
// datos-prueba/<tema>/videos.json (textos de textos.txt).

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import videosInstinto from "../../datos-prueba/instinto-luv/videos.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import videosSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/videos.json";
import maxi1 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1/tema.json";
import maxi1b from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1b/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import videosMaxi from "../../datos-prueba/maxi-espindola-hagamos-que-pase/videos.json";
import frasesMaxi from "../../datos-prueba/maxi-espindola-hagamos-que-pase/frases.json";
import aguaE2 from "../../datos-prueba/maluma-agua-estribillo-2/tema.json";
import aguaB1 from "../../datos-prueba/maluma-agua-bailando-1/tema.json";
import aguaB2 from "../../datos-prueba/maluma-agua-bailando-2/tema.json";
import aguaB3 from "../../datos-prueba/maluma-agua-bailando-3/tema.json";
import frasesAgua from "../../datos-prueba/maluma-agua-bailando-1/frases.json";
import { TEXTO_DE_SIEMPRE, TEXTO_SUBTITULO_FINO, SIN_EXTRAS, type LetraSobreVideoProps } from "./LetraSobreVideo";

/** El molde sale en tres formatos (pedido de Cotu). */
export const FORMATOS_LETRA_VIDEO = {
  "9x16": { ancho: 1080, alto: 1920 },
  "1x1": { ancho: 1080, alto: 1080 },
  "3x4": { ancho: 1080, alto: 1440 },
  // 4:3 apaisado: el de la referencia 11 y el de las cuentas con mejores
  // numeros del relevamiento. TikTok lo muestra con bandas arriba y abajo,
  // asi que el epigrafe y los botones no caen sobre la pieza.
  "4x3": { ancho: 1440, alto: 1080 },
} as const;
export type FormatoLetraVideo = keyof typeof FORMATOS_LETRA_VIDEO;

type Videos = { "l08-fija": string; "l11-hook": string; "hook-letra": string; pov: { texto: string; video: string; inicio: number } };

const base = { adelantoLectura: 3, texto: TEXTO_DE_SIEMPRE, ...SIN_EXTRAS, franjaBotones: franjaOff } as const;

/** L08 y L11: el videoclip del fragmento de fondo (L11, en producción, material en vivo) */
const sobreClip = (tema: Tema, modo: LetraSobreVideoProps["modo"], textoFijo: string, posicionHook: LetraSobreVideoProps["posicionHook"]): LetraSobreVideoProps => ({
  ...base,
  tema,
  video: { src: tema.fragment.src, inicio: tema.fragment.start, oscurecer: 0.15 , virado: "ninguno" },
  modo,
  textoFijo,
  posicionHook,
});

/** POV: material de nicho sin sonido y el hook arriba */
const pov = (tema: Tema, v: Videos["pov"]): LetraSobreVideoProps => ({
  ...base,
  tema,
  video: { src: v.video, inicio: v.inicio, oscurecer: 0 , virado: "ninguno" },
  modo: "hook",
  textoFijo: v.texto,
  posicionHook: "arriba",
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), videos: videosInstinto as Videos },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), videos: videosSol1 as Videos },
];

// Campana Maxi Espindola, tanda 1. Frases aprobadas por Cotu el 2026-10-14, del
// banco frases.json: cada pieza toma una distinta por indice, asi no se repiten
// dentro de la cuenta. L08 va con el videoclip y modo "fija" (solo la frase, sin
// letra sincronizada: pedido de Cotu). L11 va con material en vivo, siempre en
// mute, y un hook distinto por pieza. maxi-envivo-2 no se usa en L11: recortado
// se ve mal (chequeo del 2026-10-07).
const temasMaxi = [maxi1, maxi1b, maxi2, maxi3];
// envivo-1 dura 21,9 s y no alcanza para F1 (31,3 s), que va con envivo-3
const videosL11 = ["envivo-3", "envivo-1", "envivo-4", "envivo-1"];
const idsMaxi = ["F1", "F1b", "F2", "F3"];

const enVivoMaxi = (datos: unknown, idVideo: string, textoFijo: string): LetraSobreVideoProps => {
  const v = videosMaxi.envivo.find((x) => x.id === idVideo)!;
  return {
    ...base,
    tema: temaSchema.parse(datos),
    video: { src: v.src, inicio: v.inicio, oscurecer: 0.15 , virado: "ninguno" },
    modo: "hook" as const,
    textoFijo,
    posicionHook: "arriba" as const,
  };
};

const nueve = (props: LetraSobreVideoProps) => ({ formato: "9x16" as const, props });

// Campana Maluma "AGUA". Cada video trae su propio audio, asi que el fragmento es
// el video mismo. Los tres de baile llevan una frase fija aprobada por Cotu.
const sobreSiMismo = (
  datos: unknown,
  modo: LetraSobreVideoProps["modo"],
  textoFijo: string,
  posicionHook: LetraSobreVideoProps["posicionHook"],
): LetraSobreVideoProps => {
  const tema = temaSchema.parse(datos);
  return { ...base, tema, video: { src: tema.fragment.src, inicio: tema.fragment.start, oscurecer: 0.15 , virado: "ninguno" }, modo, textoFijo, posicionHook };
};

const ejemplosAgua: { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps }[] = [
  // Agua-Estribillo-1 y Agua-Lyric-1 salieron de acá: Cotu los vio aburridos y
  // esas dos piezas pasaron a brat-maximal (2026-10-17). Se borraron.
  // vertEstribillo2 no tiene el estribillo cantado: va con frase fija, como los de baile
  { id: "Agua-Estribillo-2", formato: "9x16", props: sobreSiMismo(aguaE2, "hook", frasesAgua["estribillo-2"], "arriba") },
  ...[aguaB1, aguaB2, aguaB3].map((t, i) => ({
    id: `Agua-Bailando-${i + 1}`,
    formato: "9x16" as const,
    props: sobreSiMismo(t, "hook", frasesAgua.bailando[i], "arriba"),
  })),
];

const ejemplosMaxi: { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps }[] = [
  ...idsMaxi.map((f, i) => ({
    id: `Maxi-L08-${f}`,
    ...nueve(sobreClip(temaSchema.parse(temasMaxi[i]), "fija", frasesMaxi.L08[i], "centro")),
  })),
  ...idsMaxi.map((f, i) => ({
    id: `Maxi-L11-${f}`,
    ...nueve(enVivoMaxi(temasMaxi[i], videosL11[i], frasesMaxi.L11[i])),
  })),
];

const ejemplosBase: { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps }[] = temas.flatMap(({ id, tema, videos }) => [
  // los cuatro modos, en 9:16
  { id: `LetraVideo-L08-Letra-9x16-${id}`, formato: "9x16" as const, props: sobreClip(tema, "letra", "", "centro") },
  { id: `LetraVideo-L08-Fija-9x16-${id}`, formato: "9x16" as const, props: sobreClip(tema, "fija", videos["l08-fija"], "centro") },
  { id: `LetraVideo-L11-Hook-9x16-${id}`, formato: "9x16" as const, props: sobreClip(tema, "hook", videos["l11-hook"], "arriba") },
  { id: `LetraVideo-HookLetra-9x16-${id}`, formato: "9x16" as const, props: sobreClip(tema, "hook-letra", videos["hook-letra"], "arriba") },
  { id: `LetraVideo-POV-9x16-${id}`, formato: "9x16" as const, props: pov(tema, videos.pov) },
  // los otros formatos, con la letra y con el POV
  ...(["1x1", "3x4"] as const).flatMap((formato) => [
    { id: `LetraVideo-L08-Letra-${formato}-${id}`, formato, props: sobreClip(tema, "letra", "", "centro") },
    { id: `LetraVideo-POV-${formato}-${id}`, formato, props: pov(tema, videos.pov) },
  ]),
]);

// --- Comparaciones del subtitulo fino (pedido 1) -----------------------------
// En 4:3 y sobre el videoclip, que es la situacion de la referencia 11.
// Medido sobre su fotograma, su letra equivale a unos 30 px en 1080 de ancho.
const subBase = sobreClip(temaSchema.parse(maxi3), "letra", "", "centro");
const sub = (texto: Partial<LetraSobreVideoProps["texto"]>): LetraSobreVideoProps => ({
  ...subBase,
  texto: { ...TEXTO_SUBTITULO_FINO, ...texto },
});
const cuatroTercios = (props: LetraSobreVideoProps) => ({ formato: "4x3" as const, props });

const comparaciones: { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps }[] = [
  // 1. el tamano: 52 es el de siempre, 30 es el medido en la referencia
  // 33 es el que mide igual que la referencia (22 px de altura de minuscula a 1440 de ancho)
  ...[52, 44, 38, 33, 30].map((tamano) => ({ id: `Sub-Tamano-${tamano}`, ...cuatroTercios(sub({ tamano })) })),
  // 2. la altura de la linea
  ...[0.5, 0.52, 0.55].map((altura) => ({
    id: `Sub-Altura-${Math.round(altura * 100)}`,
    ...cuatroTercios(sub({ altura })),
  })),
  // 3. la sombra
  ...(["ninguna", "suave", "media", "normal"] as const).map((sombra) => ({
    id: `Sub-Sombra-${sombra}`,
    ...cuatroTercios(sub({ sombra })),
  })),
];

export const ejemplosLetraSobreVideo: { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps }[] = [
  ...ejemplosBase,
  ...ejemplosMaxi,
  ...ejemplosAgua,
  ...comparaciones,
];

// ───────────────────────────────────────────────────────────────────────────
// Los seis modos que salieron del relevamiento de octubre y no tenían molde.
// Todos son props sobre este molde, no formatos nuevos: cada uno da un look
// distinto con el mismo motor, que es lo que hace falta para que una cuenta no
// se sature publicando siempre lo mismo.
//
// OJO con los textos: la dedicatoria de la placa y la fila de emojis son
// **propuestas sin aprobar**. Ese texto lo escribe una persona.
// ───────────────────────────────────────────────────────────────────────────

const CLIP_NOCHE = "media/bancos/nicho-driving-night/nicho-driving-night-001.mp4";
const CLIP_MAXI = "media/maxi-espindola-hagamos-que-pase/videoclip.mp4";

const sobre = (datos: unknown, src: string, extra: Partial<LetraSobreVideoProps>): LetraSobreVideoProps => {
  const tema = temaSchema.parse(datos);
  return {
    ...base,
    tema,
    video: { src, inicio: 0, oscurecer: 0.3, virado: "ninguno" },
    modo: "letra",
    textoFijo: "",
    posicionHook: "arriba",
    ...extra,
  };
};

export const modosNuevos: { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps }[] = [
  // 04-dron-fecha: la placa con la fecha del día y el halo de color.
  // La fecha es el truco del molde: hace que un tema viejo parezca de hoy.
  {
    id: "LetraVideo-Modo-PlacaFecha",
    formato: "9x16",
    props: sobre(maxi1, CLIP_NOCHE, {
      texto: { ...TEXTO_DE_SIEMPRE, caja: "mayuscula", peso: 800, sombra: "resplandor", colorResplandor: "#2BE08A" },
      placa: { mostrar: true, texto: "TE LA DEDICO\nHOY 19 DE OCTUBRE", hasta: 4, altura: 0.44 },
    }),
  },
  // el mismo halo, en otro color y sin placa
  {
    id: "LetraVideo-Modo-Resplandor",
    formato: "9x16",
    props: sobre(maxi1, CLIP_NOCHE, {
      texto: { ...TEXTO_DE_SIEMPRE, caja: "mayuscula", peso: 800, sombra: "resplandor", colorResplandor: "#7FB2FF" },
    }),
  },

  // 05-clip-nocturno A: la fila de dos emojis entre comillas arriba del texto.
  // No necesitó código: es el hook del modo hook-letra.
  {
    id: "LetraVideo-Modo-FilaEmojis",
    formato: "9x16",
    props: sobre(maxi1, CLIP_NOCHE, {
      modo: "hook-letra",
      textoFijo: '"\u{1F319}" "\u{1F5A4}"',
      posicionHook: "arriba",
      texto: { ...TEXTO_DE_SIEMPRE, peso: 700, altura: 0.55 },
    }),
  },

  // 05-clip-nocturno B: una palabra por vez
  {
    id: "LetraVideo-Modo-PalabraPorVez",
    formato: "9x16",
    props: sobre(maxi1, CLIP_NOCHE, {
      revelado: "palabra",
      texto: { ...TEXTO_DE_SIEMPRE, peso: 700, caja: "mayuscula" },
    }),
  },

  // 06-ilustracion: la capa de partículas
  { id: "LetraVideo-Modo-Particulas", formato: "9x16", props: sobre(maxi1, CLIP_NOCHE, { particulas: 0.55 }) },

  // 07-fotos-artista: el virado sepia sobre material de recital
  {
    id: "LetraVideo-Modo-Sepia",
    formato: "9x16",
    props: sobre(maxi1, CLIP_MAXI, { video: { src: CLIP_MAXI, inicio: 41.1, oscurecer: 0.2, virado: "sepia" } }),
  },

  // 10-en-vivo: el subtítulo abajo. Tampoco necesitó código: es `texto.altura`.
  {
    id: "LetraVideo-Modo-SubtituloAbajo",
    formato: "9x16",
    props: sobre(maxi1, CLIP_MAXI, {
      video: { src: CLIP_MAXI, inicio: 41.1, oscurecer: 0.15, virado: "ninguno" },
      texto: { ...TEXTO_SUBTITULO_FINO, altura: 0.84, tamano: 36 },
    }),
  },
];

// ───────────────────────────────────────────────────────────────────────────
// Pedido Fenix: Maluma con "Cuatro Babies". Clips de su TikTok, mudos, con el
// audio del tema encima y la letra en modo subtítulo fino, que es el
// minimalista (pedido de Cotu, 2026-10-19).
//
// El audio de los clips originales NO es la canción: TikTok los lista como
// "sonido original" y es él hablando. Por eso el video va mudo, como los de
// Maxi en vivo.
//
// **Cada pieza dura lo que dura su audio**, así que el clip tiene que ser más
// largo. Por eso la parte 3 (14,5 s) va con los clips de 15 s y las partes 1 y
// 2 (19,5 y 20 s) sólo con el 01, que es el único de 28 s.
//
// La altura del subtítulo cambia por clip: cuatro de los ocho traen el texto
// de TikTok quemado en la imagen y hay que esquivarlo.
// ───────────────────────────────────────────────────────────────────────────

import cuatroBabies1 from "../../datos-prueba/maluma-cuatro-babies-1/tema.json";
import cuatroBabies2 from "../../datos-prueba/maluma-cuatro-babies-2/tema.json";
import cuatroBabies3 from "../../datos-prueba/maluma-cuatro-babies-3/tema.json";

/** El subtítulo fino, con la altura que cada clip permita. */
const subFino = (altura: number) => ({ ...TEXTO_SUBTITULO_FINO, tamano: 34, peso: 400, altura });

const fenix = (datos: unknown, clip: string, inicio: number, altura: number): LetraSobreVideoProps => ({
  ...base,
  tema: temaSchema.parse(datos),
  video: { src: `media/maluma-fenix/${clip}`, inicio, oscurecer: 0.12, virado: "ninguno" },
  modo: "letra",
  textoFijo: "",
  posicionHook: "arriba",
  texto: subFino(altura),
});

export const piezasFenix: { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps }[] = [
  // el 01 es el único largo: lleva las dos partes de 20 s, desde segundos
  // distintos para que no sean la misma toma
  { id: "Fenix-Maluma-P1-Clip01", formato: "9x16", props: fenix(cuatroBabies1, "maluma-01-sin-marca.mp4", 0, 0.84) },
  { id: "Fenix-Maluma-P2-Clip01", formato: "9x16", props: fenix(cuatroBabies2, "maluma-01-sin-marca.mp4", 8, 0.84) },

  // la parte 3 (14,5 s) con los clips de 15 s
  { id: "Fenix-Maluma-P3-Clip04", formato: "9x16", props: fenix(cuatroBabies3, "maluma-04.mp4", 0, 0.84) },
  { id: "Fenix-Maluma-P3-Clip08", formato: "9x16", props: fenix(cuatroBabies3, "maluma-08.mp4", 0, 0.84) },
  // el 03 tiene "La saco ?" quemado arriba: el subtítulo abajo no lo toca
  { id: "Fenix-Maluma-P3-Clip03", formato: "9x16", props: fenix(cuatroBabies3, "maluma-03.mp4", 0, 0.84) },
  // el 05 y el 06 lo tienen abajo: el subtítulo sube
  { id: "Fenix-Maluma-P3-Clip05", formato: "9x16", props: fenix(cuatroBabies3, "maluma-05.mp4", 0, 0.68) },
  { id: "Fenix-Maluma-P3-Clip06", formato: "9x16", props: fenix(cuatroBabies3, "maluma-06.mp4", 0, 0.66) },
];
