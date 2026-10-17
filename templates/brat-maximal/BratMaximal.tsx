// Molde brat-maximal (L02, L03): la letra se **tipea letra por letra** siguiendo la
// voz, sobre material del artista. Ver FICHA.md. Sale en 1:1 (1080×1080).
//
// Rehecho el 2026-10-14. Antes mostraba frases gigantes que aparecían de golpe, de a
// 4 palabras: Cotu lo bajó por predecible ("no te lo quedas mirando"). La referencia
// que pasó (`referencias/brat-maximal/02-tipeo-ambar.mp4`) retiene porque se ve el
// texto formarse: letra chica, en color, dos renglones que se van llenando, y un
// video que no hace nada. Toda la atención está en el tipeo.
//
// OffthreadVideo y no Html5Video: Html5Video posiciona un <video> del navegador por
// busqueda y no siempre cae en el cuadro exacto, asi que el fondo se mueve a tirones
// mientras la letra va fluida. OffthreadVideo extrae el cuadro exacto. No acepta
// `loop`: el video de fondo debe durar al menos lo que el fragmento. (2026-10-14)
import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  Html5Audio,
  OffthreadVideo,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { TIKTOK_SANS } from "../../shared/fonts";
import { FranjaBotones, areaDelCuadro, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import { metadataDeFragmento } from "../../shared/fpsFuente";

export const bratMaximalSchema = z.object({
  tema: temaSchema,
  /** video de fondo, sin sonido (el audio es el del tema), ruta dentro de assets/ */
  video: z.object({
    src: z.string(),
    inicio: z.number().min(0),
    /** desenfoque del video, en px. 0 = crudo, como la referencia */
    desenfoque: z.number().min(0).max(40).step(1),
    /** brillo del video (1 = el original): más bajo, para que la letra se lea */
    brillo: z.number().min(0.4).max(1).step(0.05),
  }),
  /** color de la letra; vacío = el secundario del tema. Cambia según la canción */
  colorLetra: z.union([zColor(), z.literal("")]),
  /** tamaño de la letra en px: chico, como la referencia (no gigante) */
  tamanoLetra: z.number().min(40).max(160).step(2),
  /**
   * Cuadros que tarda cada palabra en entrar. Corto: la palabra aterriza con la
   * voz. Se probó tipeo letra por letra (2026-10-14) y no funcionó: nuestras
   * palabras están a 0,2 s una de otra y quedaba un goteo de letras sin ritmo,
   * nunca un golpe. La referencia tiene la mitad de densidad de palabras.
   */
  entradaCuadros: z.number().int().min(1).max(12),
  /**
   * Cómo se acomoda el texto:
   * - `bloque`: renglones alineados a la izquierda, bloque centrado
   * - `centrado`: cada renglón centrado (estable: el reparto se calcula sobre la frase entera)
   * - `abajo`: igual que centrado pero apoyado abajo, como un subtítulo
   *
   * Se probó también "una palabra por vez" (2026-10-15) y Cotu lo descartó.
   */
  disposicion: z.enum(["bloque", "centrado", "abajo"]),
  /** máximo de palabras por frase: cuánto texto se acumula antes de limpiar */
  palabrasPorFrase: z.number().int().min(2).max(10),
  /** cuadros que cada frase aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  franjaBotones: franjaBotonesSchema,
});
export type BratMaximalProps = z.infer<typeof bratMaximalSchema>;

/** La duración sale del fragmento y el fps del video de fondo (ver shared/fpsFuente). */
export const duracionBratMaximal: CalculateMetadataFunction<BratMaximalProps> = ({ props }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.video.src);

const TEXTO = {
  peso: 500,
  interlineado: 1.25,
  /**
   * Ancho del bloque, como fracción del cuadro. El bloque va centrado y el texto
   * alineado a la izquierda adentro: centrar renglón por renglón haría temblar el
   * texto, porque cada letra nueva lo correría medio carácter. La referencia
   * tampoco centra: deja el texto quieto y el bloque al medio.
   */
  anchoBloque: 0.64,
};

// --- frases --------------------------------------------------------------------

type Palabra = { t: number; text: string };
type Frase = { t: number; fin: number; palabras: Palabra[] };

/** Palabras con las que una frase no puede terminar: quedan colgando ("Es una adicción que"). */
const COLGANTES = new Set(
  "a al ante con de del el en la las le les lo los me mi mis o para pero por que qué se si sin su sus te tu tus un una uno y ya e ni nos".split(" "),
);
const cuelga = (w: string) => COLGANTES.has(w.toLocaleLowerCase("es").replace(/[^\p{L}]/gu, ""));

/**
 * Parte cada línea en frases de hasta `max` palabras, parejas (7 palabras con
 * máx. 4 → 4 + 3). Si el corte deja colgando una palabra como "que" o "a", se
 * corre una palabra para un lado o el otro. Cada frase guarda los tiempos de sus
 * palabras, que son los que marcan el tipeo.
 */
const frases = (tema: Tema, max: number): Frase[] =>
  tema.lyrics.flatMap((l) => {
    const n = l.words.length;
    const partes = Math.ceil(n / max);
    const out: Frase[] = [];
    let desde = 0;
    for (let p = 0; p < partes; p++) {
      const resto = n - desde;
      let cuantas = Math.round(resto / (partes - p));
      if (p < partes - 1) {
        const candidatas = [cuantas, cuantas - 1, cuantas + 1].filter((c) => c >= 2 && c <= max + 1 && resto - c >= 1);
        cuantas = candidatas.find((c) => !cuelga(l.words[desde + c - 1].text)) ?? cuantas;
      }
      const ws = l.words.slice(desde, desde + cuantas);
      const siguiente = l.words[desde + cuantas];
      out.push({ t: ws[0].t, fin: siguiente ? siguiente.t : l.end, palabras: ws.map((w) => ({ t: w.t, text: w.text })) });
      desde += cuantas;
    }
    return out;
  });

/** separación entre palabras, en eme (tiene que coincidir con el marginRight del render) */
const SEPARACION = 0.28;

/**
 * Reparte la frase en renglones **parejos**, midiendo con la tipografía real.
 * Se prueban todos los cortes y gana el de renglones más parejos que entren en la
 * caja; un corte que deja colgando una palabra como "que" o "de" se penaliza.
 * Dejar que corte el navegador daba cosas como "Solo hagamos que / pase.".
 *
 * Se calcula sobre la frase **completa**, no sobre las palabras ya cantadas, así
 * el texto no se reacomoda a medida que aparecen.
 */
const repartir = (palabras: Palabra[], ancho: number, px: number): Palabra[][] => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${TEXTO.peso} ${px}px ${TIKTOK_SANS}`;
  const w = palabras.map((p) => ctx.measureText(p.text).width);
  const sep = px * SEPARACION;
  const anchoDe = (a: number, b: number) => w.slice(a, b).reduce((x, y) => x + y, 0) + sep * (b - a - 1);
  const n = palabras.length;

  const candidatos: { lineas: Palabra[][]; puntaje: number }[] = [];
  const evaluar = (cortes: number[]) => {
    const limites = [0, ...cortes, n];
    const anchos = limites.slice(0, -1).map((a, k) => anchoDe(a, limites[k + 1]));
    if (Math.max(...anchos) > ancho) return; // no entra en la caja
    const colgando = cortes.filter((c) => cuelga(palabras[c - 1].text)).length;
    candidatos.push({
      lineas: limites.slice(0, -1).map((a, k) => palabras.slice(a, limites[k + 1])),
      puntaje: Math.max(...anchos) - Math.min(...anchos) + colgando * ancho,
    });
  };
  evaluar([]);
  for (let a = 1; a < n; a++) {
    evaluar([a]);
    for (let b = a + 1; b < n; b++) evaluar([a, b]);
  }
  if (candidatos.length === 0) return [palabras];
  return candidatos.reduce((x, y) => (y.puntaje < x.puntaje ? y : x)).lineas;
};

/** Espera a que la tipografía esté aplicada, para que no se dibuje con la de respaldo. */
const useTipografiaLista = () => {
  const [lista, setLista] = useState(false);
  const [handle] = useState(() => delayRender("tipografía de las frases"));
  useEffect(() => {
    document.fonts
      .load(`${TEXTO.peso} 100px ${TIKTOK_SANS}`)
      .then(() => {
        setLista(true);
        continueRender(handle);
      }, (err) => cancelRender(err));
  }, [handle]);
  return lista;
};

// --- la pieza --------------------------------------------------------------------

export const BratMaximal: React.FC<BratMaximalProps> = ({
  tema,
  video,
  colorLetra,
  tamanoLetra,
  entradaCuadros,
  disposicion,
  palabrasPorFrase,
  adelantoLectura,
  franjaBotones,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const area = areaDelCuadro(width, height);
  const anchoBloque = area.width * TEXTO.anchoBloque;
  const lista = useTipografiaLista();

  const listaFrases = useMemo(() => frases(tema, palabrasPorFrase), [tema, palabrasPorFrase]);
  // la frase en pantalla: la última que ya arrancó (con el adelanto)
  const tLetra = t + adelantoLectura / fps;
  let i = 0;
  listaFrases.forEach((f, k) => {
    if (tLetra >= f.t) i = k;
  });
  const frase = listaFrases[i];
  const renglones = useMemo(
    () => (lista && frase ? repartir(frase.palabras, anchoBloque, tamanoLetra) : null),
    [lista, frase, anchoBloque, tamanoLetra],
  );
  const color = colorLetra || tema.colors?.secondary || "#FFFFFF";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* agrandado apenas para que el desenfoque, si va, no deje bordes claros */}
      <AbsoluteFill style={{ transform: `scale(${1.02 + (video.desenfoque > 0 ? 0.06 : 0)})` }}>
        <OffthreadVideo
          src={staticFile(video.src)}
          trimBefore={Math.round(video.inicio * fps)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${video.desenfoque}px) brightness(${video.brillo})` }}
        />
      </AbsoluteFill>

      {renglones && (
        <div
          style={{
            position: "absolute",
            left: (area.left + area.right) / 2 - anchoBloque / 2,
            width: anchoBloque,
            top: disposicion === "abajo" ? area.bottom - area.height * 0.22 : (area.top + area.bottom) / 2,
            transform: disposicion === "abajo" ? "translateY(-100%)" : "translateY(-50%)",
            textAlign: disposicion === "bloque" ? "left" : "center",
            fontFamily: TIKTOK_SANS,
            fontWeight: TEXTO.peso,
            fontSize: tamanoLetra,
            lineHeight: TEXTO.interlineado,
            color,
            textShadow: "0 3px 10px rgba(0,0,0,0.5), 0 0 28px rgba(0,0,0,0.35)",
          }}
        >
          {renglones.map((renglon, r) => (
            <div key={r} style={{ whiteSpace: "nowrap" }}>
              {renglon.map((w, k) => {
                const p = Math.min(1, Math.max(0, ((tLetra - w.t) * fps) / entradaCuadros));
                return (
                  <span
                    key={k}
                    style={{
                      display: "inline-block",
                      opacity: p,
                      transform: `translateY(${(1 - p) * 14}px)`,
                      filter: `blur(${(1 - p) * 5}px)`,
                      marginRight: `${SEPARACION}em`,
                    }}
                  >
                    {w.text}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
