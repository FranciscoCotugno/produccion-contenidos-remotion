// Molde brat-puro: solo letra sobre fondo liso, con la estética de la portada
// de Brat. Ver FICHA.md.
//
// Un bloque de ancho fijo por cada frase (`Line`): las palabras aparecen secas
// en su tiempo y se acumulan; la letra se achica para que el bloque entre en
// su caja, y los renglones completos se justifican (espacios estirados). El
// bloque queda en pantalla hasta que entra la primera palabra de la frase
// siguiente. Sin cierre: la pieza termina con la última frase.

// OffthreadVideo y no Html5Video: Html5Video posiciona un <video> del navegador por
// busqueda y no siempre cae en el cuadro exacto, asi que el fondo se mueve a tirones
// mientras la letra va fluida. OffthreadVideo extrae el cuadro exacto. No acepta
// `loop`: el video de fondo debe durar al menos lo que el fragmento. (2026-10-14)
import React, { useEffect, useId, useMemo, useState } from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  OffthreadVideo,
  Img,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { Dust, FrameWeave, Halation, beatPulse } from "../../shared/effects";
import { ARCHIVO_NARROW, ARIMO, TIKTOK_SANS } from "../../shared/fonts";
import { FranjaBotones, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { VideoEnBucle } from "../../shared/VideoEnBucle";
import { temaSchema, type Tema } from "../../shared/tema";
import { metadataDeFragmento } from "../../shared/fpsFuente";

export const bratPuroSchema = z.object({
  tema: temaSchema,
  /** L01 blanca (fondo blanco, letra negra) o L12 negra */
  piel: z.enum(["blanca", "negra"]),
  /** archivo-narrow por defecto; tiktok-sans-angosta (ancho 75 %) o arimo para sellos que exigen esas */
  tipografia: z.enum(["archivo-narrow", "tiktok-sans-angosta", "arimo"]),
  /** respetar mayúsculas y puntuación de la letra, o pasar todo a minúscula */
  mayusculas: z.enum(["respetar", "minuscula"]),
  /** caja del bloque en px: ancho, alto y centro vertical (el horizontal es el centro del cuadro) */
  bloque: z.object({
    ancho: z.number().min(300).max(1000).step(10),
    alto: z.number().min(300).max(1050).step(10),
    centroY: z.number().min(300).max(800).step(10),
  }),
  /** tamaño máximo y mínimo de la letra en px, e interlineado */
  letra: z.object({
    max: z.number().min(60).max(400).step(1),
    min: z.number().min(50).max(200).step(1),
    interlineado: z.number().min(0.8).max(1.6).step(0.01),
  }),
  /**
   * Cuándo se estira el último renglón del bloque. "completo": cuando la
   * palabra siguiente de la frase ya no entra en él (lo que hace la
   * referencia); "siempre"; "nunca"; "porcentaje": si llena al menos
   * `porcentaje` % del ancho.
   */
  ultimoRenglon: z.enum(["completo", "siempre", "nunca", "porcentaje"]),
  porcentaje: z.number().min(0).max(100).step(1),
  /** ajuste fino de toda la letra, en cuadros: positivo la atrasa, negativo la adelanta */
  ajusteLetra: z.number().int().min(-30).max(30).step(1),
  /**
   * cuadros que cada palabra aparece antes de cantarse: en el tiempo exacto se
   * percibe tarde (los tiempos de Whisper caen sobre el ataque de la voz)
   */
  adelantoLectura: z.number().int().min(0).max(15).step(1),
  /**
   * Fondo: "color" (liso, el de la piel o la frase) o un video / imagen
   * detrás. `src` es una ruta dentro de assets/ (el videoclip del tema o un
   * video generado con IA de los bancos); `inicio`, desde qué segundo arranca
   * el video (se repite si es más corto que la pieza). Encima va un velo del
   * color de fondo con opacidad `velo`, para que la letra se lea.
   */
  fondo: z.object({
    tipo: z.enum(["color", "video", "imagen"]),
    src: z.string(),
    inicio: z.number().min(0),
    desenfoque: z.number().min(0).max(60).step(1),
    velo: z.number().min(0).max(1).step(0.05),
  }),
  /**
   * Textura opcional ("alma"), todo en 0 / apagado = limpio como la referencia.
   * grano: opacidad del ruido; polvo: motas y rayas; temblor: cuánto se mueve
   * el cuadro; halacion: la letra sangra luz (negra) o tinta (blanca);
   * desenfoque: letra levemente borrosa, como la portada de Brat (px).
   */
  efectos: z.object({
    grano: z.number().min(0).max(0.4).step(0.01),
    polvo: z.boolean(),
    temblor: z.number().min(0).max(2).step(0.1),
    halacion: z.number().min(0).max(1).step(0.05),
    desenfoque: z.number().min(0).max(8).step(0.5),
  }),
  /**
   * Golpe al beat: el bloque crece apenas en cada tiempo (escala extra en el
   * tiempo fuerte; 0 = apagado). Usa `tema.beats`; sin grilla no hace nada.
   */
  golpeBeat: z.number().min(0).max(0.05).step(0.005),
  franjaBotones: franjaBotonesSchema,
});

export type BratPuroProps = z.infer<typeof bratPuroSchema>;

const PIELES = {
  blanca: { fondo: "#ffffff", letra: "#000000" },
  negra: { fondo: "#000000", letra: "#ffffff" },
} as const;

const TIPOGRAFIAS = {
  "archivo-narrow": { family: ARCHIVO_NARROW, nombre: "'Archivo Narrow'", stretch: "normal", peso: 400 },
  "tiktok-sans-angosta": { family: TIKTOK_SANS, nombre: "'TikTok Sans'", stretch: "75%", peso: 400 },
  arimo: { family: ARIMO, nombre: "'Arimo'", stretch: "normal", peso: 400 },
} as const;
type Tipografia = (typeof TIPOGRAFIAS)[keyof typeof TIPOGRAFIAS];

/** si la primera palabra se canta antes de esto, se muestra desde el cuadro 0 */
const PRIMERA_PALABRA_DESDE_INICIO_S = 0.5;

/** La duración sale del fragmento: inicio y fin. */
/** La duración sale del fragmento y el fps del video de fondo (ver shared/fpsFuente). */
export const duracionBratPuro: CalculateMetadataFunction<BratPuroProps> = ({ props }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.fondo.tipo === "video" ? props.fondo.src : "");

/**
 * Espera a que cargue la tipografía antes de medir: si se midiera con la de
 * reemplazo, los renglones saldrían mal. (Se repite con reproductor-app.)
 */
const useTipografiaLista = (tipo: Tipografia) => {
  const [lista, setLista] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("tipografía del bloque"));
  const clave = `${tipo.nombre}|${tipo.stretch}`;
  useEffect(() => {
    const ancho = tipo.stretch === "75%" ? "condensed " : "";
    let intentos = 0;
    // después de cargarla, se espera a que el canvas mida con ella de verdad
    const esperar = () => {
      if (medidaConfiable(tipo)) {
        setLista(clave);
        continueRender(handle);
      } else if (++intentos > 200) {
        cancelRender(new Error(`La tipografía ${tipo.nombre} no se aplica al medir`));
      } else {
        setTimeout(esperar, 25);
      }
    };
    document.fonts.load(`${ancho}${tipo.peso} 100px ${tipo.nombre}`).then(esperar, (err) => cancelRender(err));
  }, [clave, tipo, handle]);
  return lista === clave;
};

/**
 * Ancho de cada palabra y del espacio a 100 px, con la tipografía real. Se mide
 * en un canvas (no depende del DOM); `fontStretch` "condensed" es el 75 % de
 * ancho de TikTok Sans, y da lo mismo que medir en el DOM.
 */
type Medidas = { palabra: (texto: string) => number; espacio: number };
const medir = (tipo: Tipografia): Medidas => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${tipo.peso} 100px ${tipo.family}`;
  ctx.fontStretch = tipo.stretch === "75%" ? "condensed" : "normal";
  const cache = new Map<string, number>();
  const palabra = (texto: string) => {
    if (!cache.has(texto)) cache.set(texto, ctx.measureText(texto).width);
    return cache.get(texto)!;
  };
  return { palabra, espacio: palabra(" ") };
};

/**
 * Si el canvas ya mide con la tipografía real. En el render en paralelo,
 * algunas pestañas miden con la de reemplazo del sistema aunque
 * `document.fonts` dé la tipografía por cargada; con esa medida el bloque
 * sale con otros renglones. Se mide la tipografía sola con monospace de
 * respaldo: si da igual que monospace, todavía no está en uso. Para TikTok
 * Sans angosta se pide además que el 75 % de ancho mida menos que el normal.
 */
const medidaConfiable = (tipo: Tipografia) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  const ancho = (familia: string, stretch: CanvasFontStretch) => {
    ctx.font = `${tipo.peso} 100px ${familia}`;
    ctx.fontStretch = stretch;
    return ctx.measureText("Suena tu canción").width;
  };
  const estirar: CanvasFontStretch = tipo.stretch === "75%" ? "condensed" : "normal";
  const propia = ancho(`${tipo.nombre}, monospace`, estirar);
  const mono = ancho("monospace", estirar);
  if (Math.abs(propia - mono) < 1) return false;
  return tipo.stretch !== "75%" || propia < ancho(`${tipo.nombre}, monospace`, "normal") * 0.97;
};

/** Renglones de un grupo de palabras con un tamaño dado (corte voraz). */
const cortar = (anchos: number[], espacio: number, px: number, ancho: number) => {
  const k = px / 100;
  const renglones: number[][] = [];
  let actual: number[] = [];
  let usado = 0;
  anchos.forEach((w, i) => {
    const suma = actual.length === 0 ? w * k : usado + espacio * k + w * k;
    if (actual.length > 0 && suma > ancho) {
      renglones.push(actual);
      actual = [i];
      usado = w * k;
    } else {
      actual.push(i);
      usado = suma;
    }
  });
  if (actual.length) renglones.push(actual);
  return renglones;
};

type Renglon = { palabras: string[]; justificado: boolean };

/**
 * Diagrama el bloque: el tamaño más grande (entre mín. y máx.) con el que las
 * palabras visibles entran en la caja. Cada grupo arranca renglón nuevo.
 * `siguiente` es la próxima palabra de la
 * frase que todavía no se ve: decide si el último renglón está completo.
 */
const diagramar = (
  grupos: string[][],
  siguiente: string | undefined,
  m: Medidas,
  props: Pick<BratPuroProps, "bloque" | "letra" | "ultimoRenglon" | "porcentaje">,
): { px: number; renglones: Renglon[] } => {
  const { ancho, alto } = props.bloque;
  const { max, min, interlineado } = props.letra;
  const anchos = grupos.map((g) => g.map(m.palabra));
  const renglonesCon = (px: number) => anchos.map((a) => cortar(a, m.espacio, px, ancho));
  const entra = (px: number) => {
    const rs = renglonesCon(px);
    const total = rs.reduce((n, r) => n + r.length, 0);
    const anchoOk = anchos.every((a) => a.every((w) => (w * px) / 100 <= ancho));
    return anchoOk && total * px * interlineado <= alto;
  };
  // búsqueda binaria del tamaño (al píxel)
  let px = min;
  if (entra(max)) px = max;
  else {
    let lo = min;
    let hi = max;
    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2;
      if (entra(mid)) lo = mid;
      else hi = mid;
    }
    px = lo;
  }
  const k = px / 100;
  const natural = (idx: number[], a: number[]) =>
    idx.reduce((s, i) => s + a[i] * k, 0) + (idx.length - 1) * m.espacio * k;

  const renglones: Renglon[] = [];
  renglonesCon(px).forEach((rs, g) => {
    rs.forEach((idx, r) => {
      const ultimoDelGrupo = r === rs.length - 1;
      const ultimoDelBloque = ultimoDelGrupo && g === grupos.length - 1;
      let justificado = !ultimoDelGrupo;
      if (ultimoDelGrupo) {
        const lleno = natural(idx, anchos[g]) / ancho;
        if (props.ultimoRenglon === "siempre") justificado = true;
        else if (props.ultimoRenglon === "nunca") justificado = false;
        else if (props.ultimoRenglon === "porcentaje") justificado = lleno * 100 >= props.porcentaje;
        else {
          // completo: la próxima palabra de la frase ya no entra en este renglón
          const prox = ultimoDelBloque && siguiente !== undefined ? m.palabra(siguiente) * k : undefined;
          justificado = prox !== undefined && natural(idx, anchos[g]) + m.espacio * k + prox > ancho;
        }
      }
      renglones.push({ palabras: idx.map((i) => grupos[g][i]), justificado: justificado && idx.length > 1 });
    });
  });
  return { px, renglones };
};

const Bloque: React.FC<{
  px: number;
  renglones: Renglon[];
  tipo: Tipografia;
  color: string;
  ancho: number;
  centroX: number;
  centroY: number;
  interlineado: number;
  espacio: number;
}> = ({ px, renglones, tipo, color, ancho, centroX, centroY, interlineado, espacio }) => {
  const altoRenglon = px * interlineado;
  const altoBloque = renglones.length * altoRenglon;
  return (
    <div
      style={{
        position: "absolute",
        // borde izquierdo fijo: el bloque no se recentra al achicarse
        left: centroX - ancho / 2,
        width: ancho,
        top: centroY - altoBloque / 2,
        fontFamily: tipo.family,
        fontWeight: tipo.peso,
        fontStretch: tipo.stretch,
        fontSize: px,
        lineHeight: `${altoRenglon}px`,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {renglones.map((r, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            height: altoRenglon,
            justifyContent: r.justificado ? "space-between" : "flex-start",
            columnGap: (espacio * px) / 100,
          }}
        >
          {r.palabras.map((p, j) => (
            <span key={j}>{p}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

/** Temblor de cuadro de shared/effects, solo si está prendido (en 0 no escala ni mueve nada). */
const Temblor: React.FC<{ cantidad: number; children: React.ReactNode }> = ({ cantidad, children }) =>
  cantidad > 0 ? <FrameWeave amount={cantidad}>{children}</FrameWeave> : <>{children}</>;

/** Tiempo de la letra en el tiempo `t` del video: con el ajuste fino y el adelanto de lectura. */
export const tiempoLetra = (t: number, ajusteLetra: number, adelantoLectura: number, fps: number) =>
  t + (adelantoLectura - ajusteLetra) / fps;

/** Cuándo se ve cada palabra: la primera, si se canta enseguida, desde el cuadro 0. */
const tiempoPalabra = (tema: Tema, i: number, j: number) =>
  i === 0 && j === 0 && tema.lyrics[0].words[0].t < PRIMERA_PALABRA_DESDE_INICIO_S ? 0 : tema.lyrics[i].words[j].t;

/**
 * Índice de la frase en pantalla en el tiempo `t` (de la letra), o -1 antes de
 * la primera: la última que ya arrancó, que queda hasta que arranca la siguiente.
 */
export const fraseEnPantalla = (tema: Tema, t: number) => {
  let i = -1;
  tema.lyrics.forEach((_, k) => {
    if (t >= tiempoPalabra(tema, k, 0)) i = k;
  });
  return i;
};

/** Qué se ve en el tiempo `t` (de la letra): grupos de palabras visibles y la próxima palabra. */
const estado = (tema: Tema, t: number, mayus: (s: string) => string) => {
  const lineas = tema.lyrics;
  const tiempo = (i: number, j: number) => tiempoPalabra(tema, i, j);
  const i = fraseEnPantalla(tema, t);
  if (i < 0) return null;
  const visibles = lineas[i].words.filter((_, j) => t >= tiempo(i, j)).map((w) => mayus(w.text));
  const siguiente = lineas[i].words[visibles.length];
  return { grupos: [visibles], siguiente: siguiente ? mayus(siguiente.text) : undefined };
};

/**
 * Grano para fondo liso. Variante de `Grain` de shared/effects: aquel se
 * mezcla en overlay, que deja intactos el blanco y el negro puros (sobre este
 * fondo no se vería). Acá va en mezcla normal con poca opacidad: ensucia el
 * blanco hacia gris claro y el negro hacia gris oscuro, con textura.
 */
const GranoFondoLiso: React.FC<{ opacidad: number }> = ({ opacidad }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const id = `grano${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const w = width / 2;
  const h = height / 2;
  return (
    <AbsoluteFill style={{ opacity: opacidad, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={w} height={h} filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Lo que necesita la escena: todo lo de brat-puro salvo la piel y el golpe, que se resuelven afuera. */
export type BratEscenaProps = Omit<BratPuroProps, "piel" | "golpeBeat"> & {
  colores: { fondo: string; letra: string };
  /** escala del bloque en este cuadro (1 = sin golpe), desde su centro */
  escalaBloque: number;
};

/** si la letra es clara (decide halación y polvo) */
const esClaro = (color: string) => {
  const c = color.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((k) => parseInt(c.length === 3 ? c[k / 2] + c[k / 2] : c.slice(k, k + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 140;
};

/**
 * Escena Brat: fondo, bloque con su mecánica, efectos y audio. brat-puro le
 * pasa los colores de la piel; brat-color, los que van cambiando con la
 * frase y el ritmo.
 */
export const BratEscena: React.FC<BratEscenaProps> = (props) => {
  const { tema, tipografia, mayusculas, bloque, letra, ajusteLetra, adelantoLectura, efectos, fondo, franjaBotones, colores, escalaBloque } =
    props;
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = frame / fps;
  const tipo = TIPOGRAFIAS[tipografia];
  const lista = useTipografiaLista(tipo);
  const m = useMemo(() => (lista ? medir(tipo) : null), [lista, tipo]);
  const letraClara = esClaro(colores.letra);

  const mayus = (s: string) => (mayusculas === "minuscula" ? s.toLocaleLowerCase("es") : s);
  const contenido = estado(tema, tiempoLetra(t, ajusteLetra, adelantoLectura, fps), mayus);

  const diagrama = m && contenido && contenido.grupos[0].length > 0 ? diagramar(contenido.grupos, contenido.siguiente, m, props) : null;
  const bloqueVisible =
    diagrama && m ? (
      <Bloque
        px={diagrama.px}
        renglones={diagrama.renglones}
        tipo={tipo}
        color={colores.letra}
        ancho={bloque.ancho}
        centroX={width / 2}
        centroY={bloque.centroY}
        interlineado={letra.interlineado}
        espacio={m.espacio}
      />
    ) : null;

  // video o imagen de fondo: cubre el cuadro, desenfocado (agrandado para que
  // el desenfoque no deje bordes claros) y mudo (el audio es el del tema)
  const estiloFondo: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: fondo.desenfoque > 0 ? `blur(${fondo.desenfoque}px)` : undefined,
    transform: fondo.desenfoque > 0 ? `scale(${1 + (fondo.desenfoque * 3) / 1080})` : undefined,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colores.fondo }}>
      {fondo.tipo !== "color" && fondo.src !== "" && (
        <>
          <AbsoluteFill>
            {fondo.tipo === "video" ? (
              <VideoEnBucle src={fondo.src} inicio={fondo.inicio} style={estiloFondo} />
            ) : (
              <Img src={staticFile(fondo.src)} style={estiloFondo} />
            )}
          </AbsoluteFill>
          {/* velo del color de fondo (el de la piel o la frase): la letra se lee encima */}
          <AbsoluteFill style={{ backgroundColor: colores.fondo, opacity: fondo.velo }} />
        </>
      )}
      <AbsoluteFill
        style={escalaBloque !== 1 ? { transform: `scale(${escalaBloque})`, transformOrigin: `50% ${bloque.centroY}px` } : undefined}
      >
        <Temblor cantidad={efectos.temblor}>
          {bloqueVisible && (
            <AbsoluteFill style={efectos.desenfoque > 0 ? { filter: `blur(${efectos.desenfoque}px)` } : undefined}>
              {bloqueVisible}
            </AbsoluteFill>
          )}
          {bloqueVisible &&
            efectos.halacion > 0 &&
            (letraClara ? (
              // la letra clara sangra luz cálida sobre el fondo
              <Halation opacity={efectos.halacion}>{bloqueVisible}</Halation>
            ) : (
              // equivalente con letra oscura: la tinta se corre un poco
              <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: efectos.halacion, filter: "blur(14px)" }}>
                {bloqueVisible}
              </AbsoluteFill>
            ))}
        </Temblor>
      </AbsoluteFill>
      {efectos.grano > 0 && <GranoFondoLiso opacidad={efectos.grano} />}
      {efectos.polvo && <Dust color={letraClara ? "255,240,220" : "40,32,24"} />}
      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};

export const BratPuro: React.FC<BratPuroProps> = ({ piel, golpeBeat, ...resto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { tema } = resto;
  // golpe al beat (prueba, apagado por defecto): escala desde el centro del bloque
  const golpe = golpeBeat > 0 && tema.beats ? 1 + beatPulse(t, tema.beats) * golpeBeat : 1;
  return <BratEscena {...resto} colores={PIELES[piel]} escalaBloque={golpe} />;
};
