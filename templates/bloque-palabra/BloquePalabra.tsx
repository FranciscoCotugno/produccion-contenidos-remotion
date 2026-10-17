// Molde bloque-palabra: el bloque de letra que se arma palabra por palabra
// sobre un fondo de color saturado. Ver FICHA.md.
//
// Es lo más parecido a `tipografico`, que estaba dado de baja desde el
// 2026-10-06. Cotu aclaró que lo que no convenció fue el resultado, no el
// formato, y el relevamiento lo pone primero de todo: tres cuentas lo
// sostienen (@v.jxnior, @omarmusicc_, @01.91.h) con mediana de 219 mil vistas.
//
// Lo que hace que se vea bien hecho, y lo único que hay que copiar con cuidado:
// **el renglón se guarda el lugar antes de llenarse**. Las palabras que todavía
// no se cantaron ya están en pantalla, apagadas y en su posición final, así que
// el texto NO se recentra cuando entra cada una. Hecho al revés, el bloque
// salta en cada palabra y se nota la plantilla.
//
// No hay video: el fondo es un color, así que la pieza va a 30 cuadros por
// segundo (regla 1 del CLAUDE.md). La duración sale del fragmento.

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  Html5Audio,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { ARCHIVO_NARROW, TIKTOK_SANS } from "../../shared/fonts";
import { type Line } from "../../shared/lyrics";
import { FranjaBotones, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";

export const bloquePalabraSchema = z.object({
  tema: temaSchema,

  fondo: z.object({
    color: zColor(),
    /** resplandor radial que aclara el centro (0 = fondo plano) */
    resplandor: z.number().min(0).max(1).step(0.05),
    /** color del resplandor; vacío = el del fondo aclarado */
    colorResplandor: z.union([zColor(), z.literal("")]),
    /** viñeteado oscuro en los bordes */
    vineta: z.number().min(0).max(1).step(0.05),
    /** textura de manchas suaves encima del fondo, dibujada acá (sin archivo) */
    textura: z.number().min(0).max(0.4).step(0.01),
  }),

  texto: z.object({
    /** tiktok-angosta cumple con FMK y Sony; archivo-narrow es la angosta de Brat */
    tipografia: z.enum(["tiktok-angosta", "archivo-narrow"]),
    italica: z.boolean(),
    mayuscula: z.boolean(),
    /** tamaño en px, medido sobre un cuadro de 1080 de ancho */
    tamano: z.number().min(40).max(220).step(2),
    peso: z.number().min(400).max(900).step(100),
    /** alto de cada renglón, como múltiplo del tamaño */
    interlineado: z.number().min(0.8).max(1.8).step(0.02),
    /** separación entre letras, en em (el modo de frase corta la lleva ancha) */
    espaciado: z.number().min(-0.05).max(0.3).step(0.01),
    /** ancho de la caja donde cortan los renglones, como fracción del ancho */
    anchoCaja: z.number().min(0.3).max(0.98).step(0.01),
    /** centro vertical del bloque, como fracción del alto */
    centroY: z.number().min(0.2).max(0.8).step(0.01),
    /** sombra detrás del texto */
    sombra: z.number().min(0).max(1).step(0.05),
    /** resplandor alrededor de las letras (el de la frase corta de @plymusic5) */
    resplandorLetra: z.number().min(0).max(1).step(0.05),
    /**
     * Cuánto puede crecer la letra para que el renglón más ancho del bloque
     * llene la caja. 1 = apagado, tamaño fijo, que es lo que hacen las pieles
     * de bloque. El modo de frase corta lo necesita: en @plymusic5 todas las
     * frases ocupan el ancho, sean cortas o largas.
     */
    ajustarAlAncho: z.number().min(1).max(3).step(0.1),
  }),

  colores: z.object({
    uno: zColor(),
    /** segundo color de la alternancia; vacío = un solo color para todo */
    dos: z.union([zColor(), z.literal("")]),
    /** con cuál arranca */
    arrancaEn: z.union([z.literal(1), z.literal(2)]),
    /**
     * Si el contador de la alternancia se reinicia en cada bloque o sigue
     * corrido a lo largo del tema. El análisis no pudo determinar cuál usa la
     * referencia: en un video un bloque arranca en blanco y en otro en ámbar.
     */
    alternancia: z.enum(["por-bloque", "corrida"]),
    /**
     * Cuánto se ve la palabra que todavía no se cantó. Es el color de su
     * propio renglón a esta opacidad, nunca un gris: medido en la referencia,
     * el renglón apagado es el ámbar a media opacidad sobre el violeta.
     */
    fantasma: z.number().min(0).max(0.8).step(0.01),
  }),

  bloque: z.object({
    /** renglones por bloque antes de borrar y empezar otro */
    renglones: z.number().int().min(1).max(4),
  }),

  adorno: z.object({
    cual: z.enum(["ninguno", "estrella"]),
    color: zColor(),
    /** lado en px, sobre un cuadro de 1080 de ancho */
    tamano: z.number().min(20).max(160).step(2),
    /**
     * Altura del centro, como fracción del alto. Medido en la referencia, la
     * estrella va **abajo de todo** (al 94 %), pegada al borde, no pegada al
     * bloque como decía el análisis.
     */
    altura: z.number().min(0.5).max(0.98).step(0.01),
  }),

  /** ajuste fino de toda la letra, en cuadros: positivo la atrasa */
  ajusteLetra: z.number().int().min(-30).max(30),
  /** cuadros que cada palabra se enciende antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),

  franjaBotones: franjaBotonesSchema,
});

export type BloquePalabraProps = z.infer<typeof bloquePalabraSchema>;

/** Sin video de fondo: 30 cuadros por segundo. La duración sale del fragmento. */
export const duracionBloquePalabra: CalculateMetadataFunction<BloquePalabraProps> = ({ props }) => ({
  fps: 30,
  durationInFrames: Math.max(1, Math.round((props.tema.fragment.end - props.tema.fragment.start) * 30)),
});

const TIPOS = {
  "tiktok-angosta": { family: TIKTOK_SANS, nombre: "'TikTok Sans'", stretch: "75%" as const },
  "archivo-narrow": { family: ARCHIVO_NARROW, nombre: "'Archivo Narrow'", stretch: "normal" as const },
};
type Tipo = (typeof TIPOS)[keyof typeof TIPOS];

/**
 * Espera a que la tipografía esté cargada antes de medir. Tercera vez que
 * aparece en el repo (ver FICHA): en el render en paralelo algunas pestañas
 * miden con la de reemplazo aunque `document.fonts` la dé por cargada. Para
 * TikTok Sans angosta se pide además que el 75 % de ancho mida menos que el
 * normal, que es como lo resolvió `brat-puro`.
 */
const useTipografiaLista = (tipo: Tipo, peso: number, px: number) => {
  const clave = `${tipo.nombre}|${tipo.stretch}|${peso}`;
  const [lista, setLista] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("tipografía del bloque"));
  useEffect(() => {
    let intentos = 0;
    const mide = () => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      const ancho = (familia: string, estirar: CanvasFontStretch) => {
        ctx.font = `${peso} 100px ${familia}`;
        ctx.fontStretch = estirar;
        return ctx.measureText("Suena tu canción").width;
      };
      const propia = ancho(`${tipo.nombre}, monospace`, tipo.stretch === "75%" ? "condensed" : "normal");
      if (Math.abs(propia - ancho("monospace", "normal")) <= 1) return false;
      // la angosta tiene que medir menos que la normal de la misma familia
      return tipo.stretch !== "75%" || propia < ancho(`${tipo.nombre}, monospace`, "normal") * 0.97;
    };
    const esperar = () => {
      if (mide()) {
        setLista(clave);
        continueRender(handle);
      } else if (++intentos > 200) {
        cancelRender(new Error(`${tipo.nombre} no se aplica al medir el bloque`));
      } else {
        setTimeout(esperar, 25);
      }
    };
    const ancho = tipo.stretch === "75%" ? "condensed " : "";
    document.fonts.load(`${peso} ${ancho}${px}px ${tipo.nombre}`).then(esperar, (err) => cancelRender(err));
  }, [clave, tipo, peso, px, handle]);
  return lista === clave;
};

/** Una palabra ya ubicada: su texto y el segundo en que se enciende. */
type Pieza = { texto: string; t: number };
/** Un renglón: sus palabras y el color que le toca. */
type Renglon = { piezas: Pieza[]; color: number };
/** Un bloque: los renglones que se ven juntos y desde cuándo. */
type Bloque = { renglones: Renglon[]; desde: number; anchoMax: number };

/**
 * Arma los bloques de todo el tema.
 *
 * El corte de renglones es voraz, de izquierda a derecha (es lo que hacen las
 * referencias). Los renglones se agrupan de a `maxRenglones`; una línea de la
 * letra que no entra se parte en varios bloques, y cada línea nueva arranca
 * bloque nuevo, que es la convención de `brat-puro` (un bloque por `Line`).
 */
const armarBloques = (
  lyrics: Line[],
  medir: (t: string) => number,
  ancho: number,
  maxRenglones: number,
  mayuscula: boolean,
  alternancia: "por-bloque" | "corrida",
  arrancaEn: 1 | 2,
): Bloque[] => {
  const bloques: Bloque[] = [];
  let contador = arrancaEn - 1;

  for (const linea of lyrics) {
    const piezas = linea.words.map((w) => ({
      texto: mayuscula ? w.text.toLocaleUpperCase("es") : w.text,
      t: w.t,
    }));

    // corte voraz en renglones
    const filas: Pieza[][] = [];
    let actual: Pieza[] = [];
    for (const p of piezas) {
      const probar = [...actual, p].map((x) => x.texto).join(" ");
      if (actual.length > 0 && medir(probar) > ancho) {
        filas.push(actual);
        actual = [p];
      } else {
        actual.push(p);
      }
    }
    if (actual.length > 0) filas.push(actual);

    // agrupadas de a maxRenglones
    for (let i = 0; i < filas.length; i += maxRenglones) {
      const grupo = filas.slice(i, i + maxRenglones);
      if (alternancia === "por-bloque") contador = arrancaEn - 1;
      bloques.push({
        desde: grupo[0][0].t,
        anchoMax: Math.max(...grupo.map((f) => medir(f.map((x) => x.texto).join(" ")))),
        renglones: grupo.map((piezasFila) => ({ piezas: piezasFila, color: contador++ % 2 })),
      });
    }
  }
  return bloques;
};

/** La estrellita de cinco puntas, dibujada acá (sin archivo, sin licencia). */
const Estrella: React.FC<{ lado: number; color: string }> = ({ lado, color }) => (
  <svg width={lado} height={lado} viewBox="0 0 100 100">
    <path
      d="M50 6 L61 38 L95 38 L68 58 L78 92 L50 72 L22 92 L32 58 L5 38 L39 38 Z"
      fill={color}
      strokeLinejoin="round"
      strokeWidth={6}
      stroke={color}
    />
  </svg>
);

/**
 * Textura de manchas suaves, dibujada acá: unas curvas claras muy desenfocadas
 * repartidas por el cuadro. Es lo que se ve en el fondo violeta de la
 * referencia. Las posiciones salen de una cuenta fija, así que no cambian entre
 * cuadros ni entre renders.
 */
const Textura: React.FC<{ opacidad: number; escala: number }> = ({ opacidad, escala }) => {
  const trazos = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 2654435761) % 1000;
    const b = (i * 40503 + 977) % 1000;
    const c = (i * 69069 + 311) % 360;
    return { x: a, y: b, r: c, s: 0.35 + ((i * 7) % 11) / 20 };
  });
  return (
    <AbsoluteFill style={{ opacity: opacidad, filter: `blur(${4 * escala}px)`, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        {trazos.map((t, i) => (
          <path
            key={i}
            d="M0 0 C 26 -38, 78 -38, 104 0 C 130 38, 78 64, 52 38"
            transform={`translate(${t.x} ${t.y}) rotate(${t.r}) scale(${t.s})`}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const BloquePalabra: React.FC<BloquePalabraProps> = ({
  tema,
  fondo,
  texto,
  colores,
  bloque,
  adorno,
  ajusteLetra,
  adelantoLectura,
  franjaBotones,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  // los tamaños se miden sobre 1080 de ancho, como en los demás moldes
  const escala = width / 1080;
  const tipo = TIPOS[texto.tipografia];
  const anchoCaja = width * texto.anchoCaja;

  const lista = useTipografiaLista(tipo, texto.peso, texto.tamano);
  const bloques = useMemo(() => {
    if (!lista) return null;
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.font = `${texto.peso} ${texto.tamano}px ${tipo.family}`;
    ctx.fontStretch = tipo.stretch === "75%" ? "condensed" : "normal";
    // el espaciado entre letras no lo mide el canvas: se suma aparte
    const medir = (t: string) => ctx.measureText(t).width + t.length * texto.espaciado * texto.tamano;
    return armarBloques(
      tema.lyrics,
      medir,
      texto.anchoCaja * 1080,
      bloque.renglones,
      texto.mayuscula,
      colores.alternancia,
      colores.arrancaEn,
    );
  }, [lista, tipo, texto, tema.lyrics, bloque.renglones, colores.alternancia, colores.arrancaEn]);

  const t = frame / fps + adelantoLectura / fps - ajusteLetra / fps;
  // el bloque que corre es el último que ya arrancó; queda hasta que entra el
  // siguiente, así que nunca hay pantalla vacía (convención de brat-puro)
  const i = bloques === null ? -1 : bloques.filter((b) => t >= b.desde).length - 1;
  const actual = i >= 0 && bloques !== null ? bloques[i] : null;

  // la letra crece para que el renglón más ancho llene la caja (1 = apagado)
  const crecer =
    actual === null || actual.anchoMax <= 0
      ? 1
      : Math.min(texto.ajustarAlAncho, (texto.anchoCaja * 1080) / actual.anchoMax);
  const px = texto.tamano * crecer * escala;

  const colorDe = (n: number) => (colores.dos !== "" && n === 1 ? colores.dos : colores.uno);
  const claro = fondo.colorResplandor !== "" ? fondo.colorResplandor : `color-mix(in srgb, white 40%, ${fondo.color})`;

  const sombra =
    texto.sombra > 0 ? `0 ${0.04 * px}px ${0.06 * px}px rgba(0,0,0,${texto.sombra * 0.6})` : "";
  const halo =
    texto.resplandorLetra > 0
      ? `0 0 ${0.22 * px}px rgba(255,255,255,${texto.resplandorLetra})`
      : "";
  const textShadow = [sombra, halo].filter((s) => s !== "").join(", ") || undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: fondo.color }}>
      {fondo.resplandor > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% ${texto.centroY * 100}%, ${claro} 0%, transparent 62%)`,
            opacity: fondo.resplandor,
          }}
        />
      )}
      {fondo.textura > 0 && <Textura opacidad={fondo.textura} escala={escala} />}
      {fondo.vineta > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 50%, transparent 32%, rgba(0,0,0,${fondo.vineta}) 100%)`,
          }}
        />
      )}

      {/* el bloque: todos los renglones ya en su lugar, las palabras que
          todavía no se cantaron apagadas pero ocupando su espacio */}
      {actual !== null && (
        <div
          style={{
            position: "absolute",
            left: (width - anchoCaja) / 2,
            width: anchoCaja,
            top: texto.centroY * height,
            transform: "translateY(-50%)",
            fontFamily: tipo.family,
            fontStretch: tipo.stretch,
            fontStyle: texto.italica ? (tipo.stretch === "75%" ? "oblique 6deg" : "italic") : "normal",
            fontWeight: texto.peso,
            fontSize: px,
            lineHeight: texto.interlineado,
            letterSpacing: `${texto.espaciado}em`,
            textAlign: "center",
            whiteSpace: "nowrap",
            textShadow,
          }}
        >
          {actual.renglones.map((renglon, r) => (
            <div key={r} style={{ color: colorDe(renglon.color) }}>
              {renglon.piezas.map((p, k) => (
                <React.Fragment key={k}>
                  {k > 0 ? " " : null}
                  <span style={{ opacity: t >= p.t ? 1 : colores.fantasma }}>{p.texto}</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      )}

      {adorno.cual === "estrella" && (
        <div
          style={{
            position: "absolute",
            left: width / 2 - (adorno.tamano * escala) / 2,
            top: adorno.altura * height - (adorno.tamano * escala) / 2,
          }}
        >
          <Estrella lado={adorno.tamano * escala} color={adorno.color} />
        </div>
      )}

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
