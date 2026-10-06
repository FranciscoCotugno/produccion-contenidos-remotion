// Datos de ejemplo del molde: con qué tema, video, modo y texto se arma cada
// pieza, y en qué formato. Los textos y los videos de nicho salen de
// datos-prueba/<tema>/videos.json (textos de textos.txt).

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import videosInstinto from "../../datos-prueba/instinto-luv/videos.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import videosSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/videos.json";
import type { LetraSobreVideoProps } from "./LetraSobreVideo";

/** El molde sale en tres formatos (pedido de Cotu). */
export const FORMATOS_LETRA_VIDEO = {
  "9x16": { ancho: 1080, alto: 1920 },
  "1x1": { ancho: 1080, alto: 1080 },
  "3x4": { ancho: 1080, alto: 1440 },
} as const;
export type FormatoLetraVideo = keyof typeof FORMATOS_LETRA_VIDEO;

type Videos = { "l08-fija": string; "l11-hook": string; "hook-letra": string; pov: { texto: string; video: string; inicio: number } };

const base = { adelantoLectura: 3, safeZone: safeZoneOff } as const;

/** L08 y L11: el videoclip del fragmento de fondo (L11, en producción, material en vivo) */
const sobreClip = (tema: Tema, modo: LetraSobreVideoProps["modo"], textoFijo: string, posicionHook: LetraSobreVideoProps["posicionHook"]): LetraSobreVideoProps => ({
  ...base,
  tema,
  video: { src: tema.fragment.src, inicio: tema.fragment.start, oscurecer: 0.15 },
  modo,
  textoFijo,
  posicionHook,
});

/** POV: material de nicho sin sonido y el hook arriba */
const pov = (tema: Tema, v: Videos["pov"]): LetraSobreVideoProps => ({
  ...base,
  tema,
  video: { src: v.video, inicio: v.inicio, oscurecer: 0 },
  modo: "hook",
  textoFijo: v.texto,
  posicionHook: "arriba",
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), videos: videosInstinto as Videos },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), videos: videosSol1 as Videos },
];

export const ejemplosLetraSobreVideo: { id: string; formato: FormatoLetraVideo; props: LetraSobreVideoProps }[] = temas.flatMap(({ id, tema, videos }) => [
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
