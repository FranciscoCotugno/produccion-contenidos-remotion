// Datos de ejemplo del molde: con qué tema, piel y foto se arma cada imagen.
// Las fotos de prueba salen de datos-prueba/<tema>/tarjetas.json (las líneas
// de letra de ese archivo ya no se usan: la tarjeta va sin letra).

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import tarjetasInstinto from "../../datos-prueba/instinto-luv/tarjetas.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import tarjetasSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tarjetas.json";
import type { TarjetaLetraProps } from "./TarjetaLetra";

/** 3:4, el formato de una foto (pedido de Cotu) */
export const FORMATO_TARJETA = { ancho: 1080, alto: 1440 } as const;

const base: Omit<TarjetaLetraProps, "tema" | "piel" | "fondo"> = {
  colorFondo: "",
  // en el tercio de arriba de la imagen (pedido de Cotu).
  // Portada 320: Cotu la bajó de 376 el 2026-10-19.
  tarjeta: { portada: 320, centroY: 400 },
  franjaBotones: franjaOff,
};

type Tarjeta = { lineas: string[]; foto: string };
type Tarjetas = { una: Tarjeta; carrusel: Tarjeta[] };

const armar = (tema: Tema, t: Tarjeta, piel: TarjetaLetraProps["piel"]): TarjetaLetraProps => ({
  ...base,
  tema,
  piel,
  // C9 va con el color del tema, no con el automático (Cotu, 2026-10-19): el
  // automático sacaba un marrón barroso que no se correspondía con la portada.
  // Si un tema no trae colores, vacío = vuelve al automático.
  colorFondo: piel === "c9-color" ? (tema.colors?.primary ?? "") : "",
  // la foto de C4 va limpia, sin desenfoque ni oscurecido
  fondo: { foto: t.foto, desenfoque: 0, oscurecer: 0 },
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), tarjetas: tarjetasInstinto as Tarjetas },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), tarjetas: tarjetasSol1 as Tarjetas },
];

const pieles = [
  { id: "C4", piel: "c4-foto" },
  { id: "C9", piel: "c9-color" },
] as const;

export const ejemplosTarjetaLetra: { id: string; props: TarjetaLetraProps }[] = [
  ...temas.flatMap(({ id, tema, tarjetas }) =>
    pieles.flatMap(({ id: pid, piel }) => [
      // modo 1: una tarjeta
      { id: `Tarjeta-${pid}-${id}`, props: armar(tema, tarjetas.una, piel) },
      // modo 2: carrusel de 3, la tarjeta sobre tres fotos distintas
      ...tarjetas.carrusel.map((t, k) => ({ id: `Tarjeta-${pid}-Carrusel-${k + 1}-${id}`, props: armar(tema, t, piel) })),
    ]),
  ),
  // Comparación (C9): el fondo forzado al color del tema (el violeta de la portada) contra el automático
  {
    id: "Comparar-Tarjeta-ColorTema-InstintoLuv",
    props: { ...armar(temas[0].tema, temas[0].tarjetas.una, "c9-color"), colorFondo: temas[0].tema.colors?.primary ?? "" },
  },
  { id: "Comparar-Tarjeta-ColorAuto-InstintoLuv", props: armar(temas[0].tema, temas[0].tarjetas.una, "c9-color") },

  // Tamaño de la portada y altura del conjunto (ver FICHA)
  ...([320, 376, 440] as const).map((portada) => ({
    id: `Comparar-Tarjeta-Portada-${portada}`,
    props: { ...armar(temas[0].tema, temas[0].tarjetas.una, "c4-foto"), tarjeta: { portada, centroY: 400 } },
  })),
  ...([340, 400, 500] as const).map((centroY) => ({
    id: `Comparar-Tarjeta-Altura-${centroY}`,
    props: { ...armar(temas[0].tema, temas[0].tarjetas.una, "c4-foto"), tarjeta: { portada: 376, centroY } },
  })),

  // C4: si la foto de fondo lleva desenfoque u oscurecido (hoy, sin nada)
  { id: "Comparar-Tarjeta-Foto-Limpia", props: armar(temas[0].tema, temas[0].tarjetas.una, "c4-foto") },
  {
    id: "Comparar-Tarjeta-Foto-Oscurecida",
    props: { ...armar(temas[0].tema, temas[0].tarjetas.una, "c4-foto"), fondo: { foto: temas[0].tarjetas.una.foto, desenfoque: 0, oscurecer: 0.3 } },
  },
  {
    id: "Comparar-Tarjeta-Foto-Desenfocada",
    props: { ...armar(temas[0].tema, temas[0].tarjetas.una, "c4-foto"), fondo: { foto: temas[0].tarjetas.una.foto, desenfoque: 10, oscurecer: 0.15 } },
  },
];
