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

// ───────────────────────────────────────────────────────────────────────────
// CAMPAÑA MALUMA BEBOTEO (Fenix). El reparto lo armó Cotu en
// assets/media/maluma-beboteo/pedido.txt; acá está pasado a props.
//
// Estilo elegido el 2026-10-20: **se va alternando entre la A (este molde,
// mayúscula grande palabra por palabra) y la C (brat-maximal)**. Las piezas de
// la C están en templates/brat-maximal/ejemplos.ts.
//
// Los clips apaisados (01, 12, 13, 14) salen en 4:3 y no en 9:16: en vertical
// habría que recortarles el 58 % del ancho y se pierde el encuadre.
//
// Los textos de las frases los escribió Cotu.
// ───────────────────────────────────────────────────────────────────────────

import audioDel20 from "../../datos-prueba/maluma-audio-del-20/tema.json";
import cuatroBabiesNuevo1 from "../../datos-prueba/maluma-cuatro-babies-1/tema.json";
import cuatroBabiesNuevo3 from "../../datos-prueba/maluma-cuatro-babies-3/tema.json";
import hawaii from "../../datos-prueba/maluma-hawaii/tema.json";
import chantaje from "../../datos-prueba/maluma-chantaje/tema.json";
import felicesLos4 from "../../datos-prueba/maluma-felices-los-4/tema.json";
import borroCassette from "../../datos-prueba/maluma-borro-cassette/tema.json";
import aguaEstribillo from "../../datos-prueba/maluma-agua-estribillo/tema.json";

/**
 * El 20 lleva **el audio del propio clip** (pedido de Cotu). Como el molde
 * siempre muda el video y reproduce el audio del tema, se le extrajo la pista
 * al clip y se la carga como si fuera el tema: suena exactamente igual.
 */
const venteDelVideo = audioDel20;

const CLIP = (n: string) => `media/maluma-beboteo/beboteo-${n}.mp4`;

/**
 * Los cuatro estilos de subtítulo de la campaña (Cotu, 2026-10-20). Reemplazan
 * a la vieja "opción A": se va variando entre los cuatro, y **todos van arriba**
 * en vez de abajo.
 */
const ARRIBA = 0.2;
const E1_MAYUSCULA = { ...TEXTO_DE_SIEMPRE, tamano: 64, peso: 800, caja: "mayuscula" as const, altura: ARRIBA, ancho: 860 };
const E2_CONTORNO = { ...E1_MAYUSCULA, sombra: "contorno" as const, grosorContorno: 6 };
const E3_CAJANORMAL = { ...E1_MAYUSCULA, caja: "original" as const, tamano: 58 };
const E4_FINO = { ...TEXTO_SUBTITULO_FINO, tamano: 36, peso: 400, altura: ARRIBA, ancho: 860 };

/** El nombre viejo sigue para las piezas del primer lote (Fenix). */
const TEXTO_A = E1_MAYUSCULA;
/** Las frases van más arriba cuando el clip ya trae texto quemado de TikTok. */
const TEXTO_FRASE = (altura: number) => ({ ...TEXTO_DE_SIEMPRE, tamano: 58, peso: 800, caja: "original" as const, altura, ancho: 880 });

type PiezaBeb = { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps };

const conLetra = (
  clip: string,
  datos: unknown,
  estilo: LetraSobreVideoProps["texto"],
  formato: FormatoLetraVideo = "9x16",
  inicio = 0,
  revelado: LetraSobreVideoProps["revelado"] = "palabra",
): PiezaBeb["props"] => ({
  ...base,
  tema: temaSchema.parse(datos),
  video: { src: CLIP(clip), inicio, oscurecer: 0.18, virado: "ninguno" },
  modo: "letra",
  textoFijo: "",
  posicionHook: "arriba",
  revelado,
  texto: estilo,
});

const conLetraA = (clip: string, datos: unknown, formato: FormatoLetraVideo = "9x16", inicio = 0): PiezaBeb["props"] => ({
  ...base,
  tema: temaSchema.parse(datos),
  video: { src: CLIP(clip), inicio, oscurecer: 0.18, virado: "ninguno" },
  modo: "letra",
  textoFijo: "",
  posicionHook: "arriba",
  revelado: "palabra",
  texto: TEXTO_A,
});

const conFrase = (clip: string, datos: unknown, texto: string, altura: number, formato: FormatoLetraVideo = "9x16"): PiezaBeb["props"] => ({
  ...base,
  tema: temaSchema.parse(datos),
  video: { src: CLIP(clip), inicio: 0, oscurecer: 0.18, virado: "ninguno" },
  modo: "hook",
  textoFijo: texto,
  posicionHook: "arriba",
  texto: TEXTO_FRASE(altura),
});

export const beboteo: PiezaBeb[] = [
  // ── Con letra (opción A). Las de la opción C están en brat-maximal ──
  // se va variando entre los cuatro estilos, todos arriba
  { id: "Beb-06-CuatroBabies3", formato: "9x16", props: conLetra("06", cuatroBabiesNuevo3, E1_MAYUSCULA) },
  { id: "Beb-08-Hawaii", formato: "9x16", props: conLetra("08", hawaii, E2_CONTORNO) },
  { id: "Beb-10-CuatroBabies3", formato: "9x16", props: conLetra("10", cuatroBabiesNuevo3, E3_CAJANORMAL) },
  { id: "Beb-17-FelicesLos4", formato: "9x16", props: conLetra("17", felicesLos4, E4_FINO, "9x16", 0, "linea") },
  { id: "Beb-19-Chantaje", formato: "9x16", props: conLetra("19", chantaje, E1_MAYUSCULA) },
  // apaisado: sale en 4:3
  { id: "Beb-01-CuatroBabies1", formato: "4x3", props: conLetra("01", cuatroBabiesNuevo1, E2_CONTORNO, "4x3") },

  // ── Con frase. Los textos los escribió Cotu ──
  { id: "Beb-05-Frase", formato: "9x16", props: conFrase("05", aguaEstribillo, "ESTOY HECHA 💦💦💦", 0.22) },
  { id: "Beb-09-Frase", formato: "9x16", props: conFrase("09", chantaje, "JUAN ERES TAN PERFECTO", 0.22) },
  { id: "Beb-02-Frase", formato: "9x16", props: conFrase("02", aguaEstribillo, "DIOS BAJO DEL CIELO Y:", 0.22) },
  { id: "Beb-16-Frase", formato: "9x16", props: conFrase("16", aguaEstribillo, "💦💦💦", 0.22) },
  { id: "Beb-04-Frase", formato: "9x16", props: conFrase("04", cuatroBabiesNuevo1, "😍😍😍😍", 0.22) },
  // estos tres ya traen texto quemado de TikTok: la frase va bien arriba para
  // que al menos los dos textos no se toquen
  { id: "Beb-18-Frase", formato: "9x16", props: conFrase("18", felicesLos4, "HOTTTT🔥", 0.14) },
  { id: "Beb-20-Frase", formato: "9x16", props: conFrase("20", venteDelVideo, "solo mandale este video a tu amiga", 0.14) },
  { id: "Beb-12-Frase", formato: "4x3", props: conFrase("12", aguaEstribillo, "😍😍😍😍", 0.14, "4x3") },
  { id: "Beb-14-Frase", formato: "4x3", props: conFrase("14", borroCassette, "POV: sos la elegida de dios", 0.18, "4x3") },

  // ── Sin texto ──
  {
    id: "Beb-11-SinTexto",
    formato: "9x16",
    props: { ...conLetraA("11", hawaii), modo: "fija", textoFijo: "" },
  },
];

/**
 * Muestrario de subtítulos: el mismo clip y la misma letra con los tratamientos
 * que da el molde, para elegir mirando. Son todos props, no formatos nuevos.
 */
const muestra = (texto: Partial<LetraSobreVideoProps["texto"]>, extra: Partial<LetraSobreVideoProps> = {}): LetraSobreVideoProps => ({
  ...base,
  tema: temaSchema.parse(felicesLos4),
  video: { src: CLIP("17"), inicio: 0, oscurecer: 0.18, virado: "ninguno" },
  modo: "letra",
  textoFijo: "",
  posicionHook: "arriba",
  revelado: "palabra",
  texto: { ...TEXTO_A, ...texto },
  ...extra,
});

export const muestrarioSubs: PiezaBeb[] = [
  // 1. lo que ya viste
  { id: "Sub-1-MayusculaBlanca", formato: "9x16", props: muestra({}) },
  // 2. contorno duro: el recurso más nativo de TikTok
  { id: "Sub-2-ContornoDuro", formato: "9x16", props: muestra({ sombra: "contorno", grosorContorno: 6 }) },
  // 3. contorno, la letra en ámbar (como las referencias de tipografía)
  { id: "Sub-3-ContornoAmbar", formato: "9x16", props: muestra({ sombra: "contorno", color: "#FFD93D", grosorContorno: 6 }) },
  // 4. halo de color, sin contorno ni caja
  { id: "Sub-4-HaloRosa", formato: "9x16", props: muestra({ sombra: "resplandor", colorResplandor: "#FF2E63" }) },
  // 5. línea entera de golpe, en vez de palabra por palabra
  { id: "Sub-5-LineaEntera", formato: "9x16", props: muestra({}, { revelado: "linea" }) },
  // 6. caja normal, no mayúscula
  { id: "Sub-6-CajaNormal", formato: "9x16", props: muestra({ caja: "original", tamano: 58 }) },
  // 7. chico y fino, el minimalista
  { id: "Sub-7-Fino", formato: "9x16", props: muestra({ ...TEXTO_SUBTITULO_FINO, tamano: 36, altura: 0.82 }, { revelado: "linea" }) },
  // 8. arriba en vez de abajo
  { id: "Sub-8-Arriba", formato: "9x16", props: muestra({ sombra: "contorno", grosorContorno: 6, altura: 0.2 }) },
];
