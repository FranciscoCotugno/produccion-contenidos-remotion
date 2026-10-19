// Molde letra-sobre-video (L08, L11, POV1 a POV8): un video a pantalla completa
// con texto encima, en el estilo del texto nativo de la app (el que escribe un
// usuario con la herramienta de texto): TikTok Sans blanco, chico, centrado, sin
// caja y con una sombra leve. Un solo estilo para todas las cuentas (pedido de
// Cotu). Ver FICHA.md.
//
// El video va sin sonido: el audio del tema entra por su lado, con su fragmento
// (el material de nicho no tiene sonido). Sale en 9:16, 1:1 y 3:4.

// OffthreadVideo y no Html5Video: Html5Video posiciona un <video> del navegador por
// busqueda y no siempre cae en el cuadro exacto, asi que el fondo se mueve a tirones
// mientras la letra va fluida. OffthreadVideo extrae el cuadro exacto. No acepta
// `loop`: el video de fondo debe durar al menos lo que el fragmento. (2026-10-14)
import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
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
import { TIKTOK_SANS, conEmoji } from "../../shared/fonts";
import { activeLineIndex, lineStarts } from "../../shared/lyrics";
import { FranjaBotones, areaDelCuadro, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";
import { duracionDeFuente, metadataDeFragmento } from "../../shared/fpsFuente";

export const letraSobreVideoSchema = z.object({
  tema: temaSchema,
  /** video de fondo, sin sonido, ruta dentro de assets/; se repite si es más corto que el fragmento */
  video: z.object({
    src: z.string(),
    /** segundo del video donde arranca */
    inicio: z.number().min(0),
    /** oscurecido (0-1), para que el texto se lea sobre fondos claros */
    oscurecer: z.number().min(0).max(0.8).step(0.05),
    /** virado de color del material (referencia 07-fotos-artista: recital en sepia) */
    virado: z.enum(["ninguno", "sepia", "frio", "calido"]),
  }),
  /**
   * Capa de partículas sobre el clip (referencia 06-ilustracion). 0 = sin capa.
   * Se dibuja acá, no es un archivo: no hay nada que licenciar.
   */
  particulas: z.number().min(0).max(1).step(0.05),
  /**
   * Placa de apertura (referencia 04-dron-fecha): dos renglones centrados que
   * se ven al principio. Uno de dedicatoria y abajo **la fecha del día escrita
   * con todas las letras**.
   *
   * La fecha es el truco comercial del molde, no un detalle: hace que una pieza
   * de un tema viejo parezca de hoy, y por eso la cuenta de referencia publica
   * todos los días con el mismo material. **Entra como texto**, no la calcula el
   * molde: así la pieza sigue siendo la misma si se vuelve a renderizar, y quien
   * genera la tanda escribe la fecha de ese día.
   */
  placa: z.object({
    mostrar: z.boolean(),
    /** los renglones, separados por saltos de línea */
    texto: z.string(),
    /** hasta qué segundo del fragmento se ve */
    hasta: z.number().min(0).max(20).step(0.5),
    /** altura del centro, como fracción del alto */
    altura: z.number().min(0.1).max(0.9).step(0.01),
  }),
  /**
   * letra: la letra sincronizada, línea por línea; fija: una línea durante todo
   * el video; hook: un texto fijo; hook-letra: el hook y, más abajo, la letra.
   */
  modo: z.enum(["letra", "fija", "hook", "hook-letra"]),
  /** el texto de los modos fija, hook y hook-letra */
  textoFijo: z.string(),
  /** dónde va el hook (o la línea fija): en el tercio de arriba o al centro */
  posicionHook: z.enum(["arriba", "centro"]),
  /**
   * Cómo se ve el texto. Los valores por omisión son los que el molde tenía
   * escritos fijos, así que una pieza que no los toque sale igual que siempre.
   *
   * El modo "subtítulo fino" (referencia 11-letra-sobre-videoclip, @soloporenata)
   * no es un modo aparte: es este mismo molde con la letra chica y fina y la
   * sombra apenas marcada. Medido sobre el fotograma de la referencia, su letra
   * equivale a unos 30 px en un cuadro de 1080 de ancho.
   */
  texto: z.object({
    /** tamaño en px, medido sobre un cuadro de 1080 de ancho */
    tamano: z.number().min(20).max(120).step(1),
    /** grosor: 300 es fino, 500 el de siempre, 700 negrita */
    peso: z.number().min(300).max(800).step(100),
    /** altura de la línea de letra, como fracción del alto (0,5 = la mitad) */
    altura: z.number().min(0.25).max(0.9).step(0.01),
    /**
     * Cuánto se marca la sombra. `resplandor` es el halo de color de la
     * referencia 04-dron-fecha: el texto no lleva contorno ni caja, lleva un
     * halo luminoso que lo despega del paisaje sin ensuciar la imagen.
     */
    sombra: z.enum(["ninguna", "suave", "media", "normal", "resplandor"]),
    /** color del halo, cuando la sombra es `resplandor` */
    colorResplandor: zColor(),
    /** caja del texto de la letra */
    caja: z.enum(["minuscula", "original", "mayuscula"]),
    /** ancho de la caja donde el texto corta en renglones */
    ancho: z.number().min(300).max(1400).step(10),
  }),
  /** la letra entra por línea entera o palabra por palabra (referencia 05-clip-nocturno) */
  revelado: z.enum(["linea", "palabra"]),
  /** cuadros que cada línea de letra aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  franjaBotones: franjaBotonesSchema,
});
export type LetraSobreVideoProps = z.infer<typeof letraSobreVideoSchema>;

/**
 * La duración sale del fragmento y el fps del video de fondo (ver
 * shared/fpsFuente).
 *
 * **Si el clip es más corto que el audio, manda el clip**: la pieza llega hasta
 * donde llegue el video (pedido de Cotu, 2026-10-19). Antes el audio mandaba y
 * el clip se quedaba congelado en el último cuadro al terminarse.
 */
export const duracionLetraSobreVideo: CalculateMetadataFunction<LetraSobreVideoProps> = async ({ props }) => {
  const delAudio = props.tema.fragment.end - props.tema.fragment.start;
  const delClip = (await duracionDeFuente(props.video.src)) - props.video.inicio;
  return metadataDeFragmento(Math.max(0.5, Math.min(delAudio, delClip)), props.video.src);
};

/** Lo que no cambia por pieza. */
const TEXTO = {
  interlineado: 1.22,
  /** cuadros del fundido de entrada de cada línea de letra */
  fundido: 4,
};

/** Cómo se veía el molde antes de que esto fuera configurable: es el valor por omisión. */
export const TEXTO_DE_SIEMPRE = {
  tamano: 52,
  peso: 500,
  altura: 0.5,
  sombra: "normal" as const,
  colorResplandor: "#FFFFFF",
  caja: "minuscula" as const,
  ancho: 640,
};

/** El subtítulo fino de la referencia 11, medido sobre su fotograma. */
export const TEXTO_SUBTITULO_FINO = {
  tamano: 30,
  peso: 300,
  altura: 0.5,
  sombra: "media" as const,
  colorResplandor: "#FFFFFF",
  caja: "minuscula" as const,
  ancho: 760,
};

/** Los seis modos nuevos apagados: una pieza que no los toque sale como siempre. */
export const SIN_EXTRAS = {
  virado: "ninguno" as const,
  particulas: 0,
  placa: { mostrar: false, texto: "", hasta: 3, altura: 0.44 },
  revelado: "linea" as const,
};

const SOMBRAS = {
  ninguna: "none",
  suave: "0 1px 3px rgba(0,0,0,0.45)",
  // un escalon mas que suave, sin llegar al halo de normal (pedido de Cotu, 2026-10-17)
  media: "0 1px 4px rgba(0,0,0,0.6), 0 0 9px rgba(0,0,0,0.2)",
  normal: "0 1px 4px rgba(0,0,0,0.6), 0 0 14px rgba(0,0,0,0.25)",
};

/**
 * El halo de la referencia 04-dron-fecha. Tres capas del mismo color, de más
 * cerrada a más abierta, más una sombra oscura corta que le da apoyo. El texto
 * queda blanco; lo que se tiñe es el halo.
 */
const resplandorDe = (color: string, px: number) =>
  `0 0 ${px * 0.12}px ${color}, 0 0 ${px * 0.3}px ${color}, 0 0 ${px * 0.6}px ${color}, 0 2px 4px rgba(0,0,0,0.55)`;

const sombraDe = (estilo: EstiloTexto, px: number) =>
  estilo.sombra === "resplandor" ? resplandorDe(estilo.colorResplandor, px) : SOMBRAS[estilo.sombra];

/** Virado del material. */
const VIRADOS = {
  ninguno: undefined,
  sepia: "sepia(0.55) saturate(1.25) contrast(1.05)",
  frio: "saturate(0.85) hue-rotate(-12deg) brightness(0.96)",
  calido: "saturate(1.15) hue-rotate(10deg) brightness(1.02)",
};

type EstiloTexto = LetraSobreVideoProps["texto"];

/**
 * Capa de partículas sobre el clip (referencia 06-ilustracion). Puntos claros
 * de tamaños distintos, quietos, en posiciones fijas: se dibujan acá y no hay
 * ningún archivo que licenciar. No se mueven porque el fondo ya se mueve.
 */
const Particulas: React.FC<{ cantidad: number; escala: number }> = ({ cantidad, escala }) => {
  const puntos = Array.from({ length: 70 }, (_, i) => ({
    x: ((i * 2654435761) % 1000) / 10,
    y: ((i * 40503 + 977) % 1000) / 10,
    r: (0.6 + ((i * 7) % 10) / 6) * escala,
    o: 0.25 + ((i * 13) % 10) / 14,
  }));
  return (
    <AbsoluteFill style={{ opacity: cantidad, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {puntos.map((p, k) => (
          <circle key={k} cx={p.x} cy={p.y} r={p.r / 10} fill="white" opacity={p.o} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Texto: React.FC<{ texto: string; centroY: number; estilo: EstiloTexto; opacidad?: number }> = ({
  texto,
  centroY,
  estilo,
  opacidad = 1,
}) => {
  const { width } = useVideoConfig();
  // el tamaño se mide sobre 1080 de ancho: en 4:3 (1440) se escala para verse igual
  const escala = width / 1080;
  return (
    <div
      style={{
        position: "absolute",
        left: width / 2 - (estilo.ancho * escala) / 2,
        width: estilo.ancho * escala,
        top: centroY,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: conEmoji(TIKTOK_SANS),
        fontWeight: estilo.peso,
        fontSize: estilo.tamano * escala,
        lineHeight: TEXTO.interlineado,
        color: "#FFFFFF",
        textShadow: sombraDe(estilo, estilo.tamano * escala),
        textWrap: "balance",
        whiteSpace: "pre-line",
        opacity: opacidad,
      }}
    >
      {texto}
    </div>
  );
};

export const LetraSobreVideo: React.FC<LetraSobreVideoProps> = ({
  tema,
  video,
  modo,
  textoFijo,
  posicionHook,
  texto,
  particulas,
  placa,
  revelado,
  adelantoLectura,
  franjaBotones,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const area = areaDelCuadro(width, height);
  const escala = width / 1080;

  // alturas, sobre la zona libre del formato: el hook en el tercio de arriba
  // (como en las referencias) o al centro; la letra al centro, o más abajo si
  // el hook ocupa el centro
  const yArriba = area.top + area.height * 0.2;
  const yCentro = area.top + area.height * 0.5;
  const yAbajo = area.top + area.height * 0.72;
  const yHook = posicionHook === "arriba" ? yArriba : yCentro;
  // la altura de la letra la decide la pieza; la excepción es hook-letra con el hook
  // al centro, donde la letra tiene que irse abajo para no pisarlo
  const yLetra = modo === "hook-letra" && posicionHook === "centro" ? yAbajo : area.top + area.height * texto.altura;

  // la letra que suena, con un fundido corto al entrar. La caja la decide la
  // pieza: minúscula es como salió siempre el molde, mayúscula es lo que hacen
  // las referencias 04 y 05.
  const t = frame / fps + adelantoLectura / fps;
  const starts = lineStarts(tema.lyrics);
  const i = activeLineIndex(tema.lyrics, t, starts);
  const enCaja = (txt: string) =>
    texto.caja === "mayuscula" ? txt.toLocaleUpperCase("es") : texto.caja === "original" ? txt : txt.toLocaleLowerCase("es");
  // con `revelado` en palabra se ven solo las palabras que ya se cantaron de la
  // línea que corre (referencia 05-clip-nocturno)
  const palabras = i >= 0 ? tema.lyrics[i].words : [];
  const visibles = revelado === "palabra" ? palabras.filter((w) => t >= w.t) : palabras;
  const linea = i >= 0 ? enCaja(visibles.map((w) => w.text).join(" ")) : "";
  const opacidadLinea = i >= 0 ? interpolate((t - starts[i]) * fps, [0, TEXTO.fundido], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const conLetra = modo === "letra" || modo === "hook-letra";
  // La placa es una **apertura**: mientras está, la letra no entra. Si las dos
  // se dibujaran a la vez se pisan, porque viven a la misma altura.
  const placaVisible = placa.mostrar && placa.texto !== "" && frame / fps < placa.hasta;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile(video.src)}
        trimBefore={Math.round(video.inicio * fps)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: VIRADOS[video.virado] }}
      />
      {video.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${video.oscurecer})` }} />}
      {particulas > 0 && <Particulas cantidad={particulas} escala={escala} />}

      {placaVisible && <Texto texto={placa.texto} centroY={area.top + area.height * placa.altura} estilo={texto} />}

      {modo !== "letra" && textoFijo !== "" && !placaVisible && (
        <Texto texto={textoFijo} centroY={yHook} estilo={texto} />
      )}
      {conLetra && linea !== "" && !placaVisible && (
        <Texto texto={linea} centroY={yLetra} estilo={texto} opacidad={opacidadLinea} />
      )}

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
