// Molde brat-minimal (L04): palabras chicas, en minúscula, apareciendo de a una
// sobre el videoclip oscuro y casi en blanco y negro; las palabras destacadas,
// al doble. Las palabras cambian de lugar en el cuadro. Ver FICHA.md. Sale en 1:1
// (1080×1080), como la referencia.
//
// Tamaño chico como en la referencia (pedido de Cotu), por debajo del mínimo
// de legibilidad de CLAUDE.md: es una excepción de este molde.

// OffthreadVideo y no Html5Video: Html5Video posiciona un <video> del navegador por
// busqueda y no siempre cae en el cuadro exacto, asi que el fondo se mueve a tirones
// mientras la letra va fluida. OffthreadVideo extrae el cuadro exacto. No acepta
// `loop`: el video de fondo debe durar al menos lo que el fragmento. (2026-10-14)
import React, { useMemo } from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { ARIMO } from "../../shared/fonts";
import { Grain } from "../../shared/effects";
import { FranjaBotones, areaDelCuadro, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { VideoEnBucle } from "../../shared/VideoEnBucle";
import { temaSchema } from "../../shared/tema";
import { metadataDeFragmento } from "../../shared/fpsFuente";

export const bratMinimalSchema = z.object({
  tema: temaSchema,
  /** el videoclip, sin sonido (el audio es el del tema), ruta dentro de assets/ */
  video: z.object({
    src: z.string(),
    inicio: z.number().min(0),
    /** desaturado (0-1): 1 = blanco y negro */
    desaturar: z.number().min(0).max(1).step(0.05),
    /** brillo (1 = el original) */
    brillo: z.number().min(0.3).max(1).step(0.05),
  }),
  /** palabras destacadas (al doble de tamaño), tal cual se escriben en la letra; sin importar mayúsculas ni signos */
  destacadas: z.array(z.string()),
  /** tamaño de las palabras normales y de las destacadas, en px */
  tamanos: z.object({ normal: z.number().min(16).max(80), destacada: z.number().min(30).max(160) }),
  /**
   * dónde cae cada golpe de palabras: cambia de lugar con cada golpe (como la
   * referencia), con cada línea (los golpes de una línea, en el mismo lugar) o
   * siempre al centro
   */
  posicion: z.enum(["por-golpe", "por-linea", "centro"]),
  /** saltos de un lugar al siguiente: lejos (a la otra punta) o cerca (a un lugar vecino) */
  saltos: z.enum(["lejos", "cerca"]),
  /** segundos mínimos en pantalla: un golpe más corto se junta con el siguiente de su línea (0 = no se juntan) */
  minimoGolpe: z.number().min(0).max(1.5).step(0.05),
  /** cuadros del fundido de entrada de cada golpe (0 = corte seco) */
  fundido: z.number().int().min(0).max(8),
  /** grano de película (0 = sin grano) */
  grano: z.number().min(0).max(0.6).step(0.05),
  /** cuadros que cada palabra aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  franjaBotones: franjaBotonesSchema,
});
export type BratMinimalProps = z.infer<typeof bratMinimalSchema>;

/** La duración sale del fragmento: inicio y fin. */
/** La duración sale del fragmento y el fps del video de fondo (ver shared/fpsFuente). */
export const duracionBratMinimal: CalculateMetadataFunction<BratMinimalProps> = ({ props }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.video.src);

/** ancho máximo de un renglón: las palabras normales seguidas comparten renglón hasta este ancho */
const ANCHO_RENGLON = 420;

const normalizar = (s: string) => s.toLocaleLowerCase("es").replace(/[^\p{L}\p{N}]/gu, "");

type Palabra = { t: number; texto: string; grande: boolean };
type Golpe = { t: number; linea: number; palabras: Palabra[] };

/**
 * La letra en golpes chicos, como en la referencia (de 1 a 3 palabras en
 * pantalla): cada destacada va con la palabra de antes y la de después ("una
 * ADICCIÓN que"); el resto, de a 1 o 2 ("es", "si sale"). Nunca se mezclan
 * palabras de dos líneas.
 */
const golpes = (tema: BratMinimalProps["tema"], destacadas: string[], minimo: number): Golpe[] => {
  const set = new Set(destacadas.map(normalizar));
  return tema.lyrics.flatMap((l, linea) => {
    const ps: Palabra[] = l.words.map((w) => ({ t: w.t, texto: w.text.toLocaleLowerCase("es"), grande: set.has(normalizar(w.text)) }));
    // a qué golpe va cada palabra: primero las destacadas con sus vecinas
    const grupo = new Array<number>(ps.length).fill(-1);
    let n = 0;
    ps.forEach((p, j) => {
      if (!p.grande) return;
      const g = n++;
      grupo[j] = g;
      if (j > 0 && grupo[j - 1] === -1 && !ps[j - 1].grande) grupo[j - 1] = g;
      if (j < ps.length - 1 && !ps[j + 1].grande) grupo[j + 1] = g;
    });
    // las sueltas que quedan, en tramos seguidos, de a 1 o 2
    for (let j = 0; j < ps.length; ) {
      if (grupo[j] !== -1) {
        j++;
        continue;
      }
      let k = j;
      while (k < ps.length && grupo[k] === -1) k++;
      const tramo = k - j;
      const partes = Math.ceil(tramo / 2);
      let desde = j;
      for (let p = 0; p < partes; p++) {
        const cuantas = Math.round((k - desde) / (partes - p));
        const g = n++;
        for (let q = desde; q < desde + cuantas; q++) grupo[q] = g;
        desde += cuantas;
      }
      j = k;
    }
    // los golpes, en el orden de la letra
    const orden = [...new Set(grupo)];
    const lista: Golpe[] = orden.map((g) => {
      const palabras = ps.filter((_, j) => grupo[j] === g);
      return { t: palabras[0].t, linea, palabras };
    });
    // un golpe que dura menos que el mínimo se junta con el siguiente de la línea
    for (let k = 0; k < lista.length - 1; ) {
      if (lista[k + 1].t - lista[k].t < minimo) {
        lista[k] = { ...lista[k], palabras: [...lista[k].palabras, ...lista[k + 1].palabras] };
        lista.splice(k + 1, 1);
      } else k++;
    }
    return lista;
  });
};

/**
 * Lugares posibles de un golpe: una grilla de 3 × 3 dentro de la zona libre,
 * con margen para que el bloque no se salga. Cada golpe toma uno, fijo (sale
 * del orden en la letra, no del azar), y nunca el mismo que el anterior.
 */
const lugares = (area: ReturnType<typeof areaDelCuadro>) => {
  const mx = ANCHO_RENGLON / 2 + 20;
  const xs = [area.left + mx, (area.left + area.right) / 2, area.right - mx];
  const ys = [area.top + area.height * 0.22, area.top + area.height * 0.5, area.top + area.height * 0.76];
  return ys.flatMap((y) => xs.map((x) => ({ x, y })));
};
/** orden en que se recorren los 9 lugares: saltando lejos, o a un lugar vecino (una vuelta alrededor del centro) */
const ORDEN = { lejos: [3, 2, 7, 4, 0, 8, 1, 6, 5], cerca: [4, 1, 2, 5, 8, 7, 6, 3] };

export const BratMinimal: React.FC<BratMinimalProps> = ({ tema, video, destacadas, tamanos, posicion, saltos, minimoGolpe, fundido, grano, adelantoLectura, franjaBotones }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const area = areaDelCuadro(width, height);
  const t = frame / fps + adelantoLectura / fps;

  // el golpe en pantalla: el último que ya arrancó (queda hasta el siguiente); el primero, desde el cuadro 0
  const lista = useMemo(() => golpes(tema, destacadas, minimoGolpe), [tema, destacadas, minimoGolpe]);
  let i = 0;
  lista.forEach((g, k) => {
    if (t >= g.t) i = k;
  });
  // sus palabras ya cantadas (la primera de la pieza, desde el cuadro 0)
  const visibles = lista[i].palabras.filter((p, j) => (i === 0 && j === 0) || t >= p.t);

  // renglones: las normales seguidas comparten renglón; cada destacada va sola
  const renglones: { texto: string; grande: boolean }[] = [];
  visibles.forEach((p) => {
    const ultimo = renglones[renglones.length - 1];
    if (!p.grande && ultimo && !ultimo.grande) ultimo.texto += " " + p.texto;
    else renglones.push({ ...p });
  });

  const ls = lugares(area);
  const orden = ORDEN[saltos];
  const paso = posicion === "por-linea" ? lista[i].linea : i;
  const lugar = posicion === "centro" ? ls[4] : ls[orden[paso % orden.length]];
  // fundido de entrada del golpe (el primero, entero desde el cuadro 0)
  const opacidad = fundido > 0 && i > 0 ? interpolate((t - lista[i].t) * fps, [0, fundido], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <VideoEnBucle
        src={video.src}
        inicio={video.inicio}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `grayscale(${video.desaturar}) contrast(1.2) brightness(${video.brillo})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: lugar.x,
          top: lugar.y,
          width: ANCHO_RENGLON,
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontFamily: ARIMO,
          fontWeight: 400,
          color: "#FFFFFF",
          textShadow: "0 1px 6px rgba(0,0,0,0.5)",
          opacity: opacidad,
        }}
      >
        {renglones.map((r, k) => (
          <div key={k} style={{ fontSize: r.grande ? tamanos.destacada : tamanos.normal, lineHeight: r.grande ? 1.05 : 1.5 }}>
            {r.texto}
          </div>
        ))}
      </div>

      {grano > 0 && <Grain amount={grano} />}
      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
