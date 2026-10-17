// Molde panel-letra: el panel de letra abierto de una app de música. Toda la
// letra en pantalla a la vez, la que suena nítida y blanca, las de arriba y
// abajo atenuadas cada vez más cuanto más lejos están. La columna sube sola
// para que la línea que suena quede siempre a la misma altura. Ver FICHA.md.
//
// Dos pieles hermanas, misma estructura y distinto tratamiento:
//   - "desenfoque": fondo la portada muy desenfocada; las inactivas se
//     desenfocan (referencia assets/referencias/03-portada-blureada/).
//   - "liso": fondo de color liso; las inactivas solo se transparentan
//     (referencia assets/referencias/08-spotify/).
//
// No hay video: el fondo es la portada o un color, así que la pieza va a 30
// cuadros por segundo (regla 1 del CLAUDE.md). La duración sale del fragmento.

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { INTER, TIKTOK_SANS } from "../../shared/fonts";
import { lineStarts, type Line } from "../../shared/lyrics";
import { FranjaBotones, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";

export const panelLetraSchema = z.object({
  tema: temaSchema,
  /** desenfoque: portada desenfocada de fondo; liso: color plano */
  piel: z.enum(["desenfoque", "liso"]),

  fondo: z.object({
    /** cuánto se desenfoca la portada (solo piel desenfoque) */
    desenfoque: z.number().min(0).max(200).step(1),
    /** cuánto se oscurece el fondo, para que la letra blanca se lea */
    oscurecer: z.number().min(0).max(0.9).step(0.01),
    /** agrandado de la portada, para que el desenfoque no deje bordes */
    escala: z.number().min(1).max(2.5).step(0.05),
    /** color plano de la piel lisa; vacío = el primario del tema, oscurecido */
    color: z.union([zColor(), z.literal("")]),
    /** sombreado de arriba y abajo, como en la referencia */
    vineta: z.number().min(0).max(1).step(0.05),
  }),

  letra: z.object({
    tipografia: z.enum(["inter", "tiktok"]),
    /** tamaño en px, medido sobre un cuadro de 1080 de ancho */
    tamano: z.number().min(40).max(130).step(1),
    peso: z.number().min(400).max(800).step(100),
    /** alto de cada renglón en px (el interlineado de la referencia) */
    interlineado: z.number().min(50).max(170).step(1),
    /** aire extra entre una línea de la letra y la siguiente */
    aireBloque: z.number().min(0).max(120).step(2),
    /** margen izquierdo y derecho de la columna, en px sobre 1080 de ancho */
    margenIzquierdo: z.number().min(0).max(300).step(1),
    margenDerecho: z.number().min(0).max(300).step(1),
  }),

  /** cómo se apagan las líneas que no suenan, según la distancia a la activa */
  atenuar: z.object({
    /** cuántas líneas se dibujan arriba y abajo de la activa */
    lineasArriba: z.number().int().min(0).max(12),
    lineasAbajo: z.number().int().min(0).max(12),
    /** opacidad de la más lejana (la activa siempre va en 1) */
    opacidadMin: z.number().min(0).max(1).step(0.05),
    /** desenfoque de la más lejana, en px */
    desenfoqueMax: z.number().min(0).max(40).step(1),
    /**
     * Qué tan rápido crece el apagado con la distancia. 1 es parejo; más de 1
     * deja a la vecina casi nítida y apaga de golpe a las lejanas; menos de 1
     * apaga enseguida. Separado arriba y abajo: en la referencia, lo que ya se
     * cantó se apaga más rápido que lo que viene.
     */
    curvaArriba: z.number().min(0.3).max(3).step(0.1),
    curvaAbajo: z.number().min(0.3).max(3).step(0.1),
  }),

  /** altura donde se ancla el centro de la línea activa, como fracción del alto */
  anclaje: z.number().min(0.15).max(0.75).step(0.01),
  /**
   * Dónde apoya el principio de la columna, como fracción del alto. Mientras
   * las primeras líneas no llegan al anclaje, la columna no se mueve: es lo que
   * hacen las dos apps, y evita que el arranque quede con media pantalla vacía.
   */
  arranque: z.number().min(0).max(0.6).step(0.01),
  /** cómo sube la columna: continuo durante toda la línea, o de un salto al cambiar */
  desplazamiento: z.enum(["continuo", "saltos"]),
  /** cuadros que dura el salto */
  transicion: z.number().int().min(1).max(30),

  encabezado: z.enum(["completo", "minimo", "ninguno"]),
  /** el botón redondo del encabezado completo */
  boton: z.boolean(),

  /** marcar los interludios sin canto con un símbolo de nota */
  interludio: z.object({
    activo: z.boolean(),
    /** segundos de silencio a partir de los cuales se marca */
    segundos: z.number().min(1).max(20).step(0.5),
  }),

  /** ajuste fino de toda la letra, en cuadros: positivo la atrasa */
  ajusteLetra: z.number().int().min(-30).max(30),
  /** cuadros que cada línea aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),

  franjaBotones: franjaBotonesSchema,
});

export type PanelLetraProps = z.infer<typeof panelLetraSchema>;

/** Sin video de fondo: 30 cuadros por segundo. La duración sale del fragmento. */
export const duracionPanelLetra: CalculateMetadataFunction<PanelLetraProps> = ({ props }) => ({
  fps: 30,
  durationInFrames: Math.max(1, Math.round((props.tema.fragment.end - props.tema.fragment.start) * 30)),
});

const FAMILIAS = { inter: INTER, tiktok: TIKTOK_SANS };
/** Símbolo de los tramos sin canto (está en las dos tipografías). */
const NOTA = "♪";

/** color con transparencia, a partir de cualquier color CSS */
const alfa = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

/**
 * Espera a que la tipografía esté cargada de verdad antes de medir: si se
 * midiera con la de reemplazo, los renglones cortarían en otro lado.
 *
 * Se repite con `reproductor-app` y `brat-puro` (ver FICHA): en el render en
 * paralelo, algunas pestañas miden con la tipografía de reemplazo aunque
 * `document.fonts` la dé por cargada, así que además de cargarla se espera a
 * que el canvas mida distinto que con la de respaldo sola.
 */
const useTipografiaLista = (familia: string, peso: number, px: number) => {
  const clave = `${familia}|${peso}`;
  const [lista, setLista] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("tipografía del panel de letra"));
  useEffect(() => {
    let intentos = 0;
    const primera = familia.split(",")[0].trim();
    const mide = () => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      const ancho = (f: string) => {
        ctx.font = `${peso} 100px ${f}`;
        return ctx.measureText("Suena tu canción").width;
      };
      return Math.abs(ancho(`${primera}, monospace`) - ancho("monospace")) > 1;
    };
    const esperar = () => {
      if (mide()) {
        setLista(clave);
        continueRender(handle);
      } else if (++intentos > 200) {
        cancelRender(new Error(`${primera} no se aplica al medir la letra`));
      } else {
        setTimeout(esperar, 25);
      }
    };
    document.fonts.load(`${peso} ${px}px ${primera}`).then(esperar, (err) => cancelRender(err));
  }, [clave, familia, peso, px, handle]);
  return lista === clave;
};

/**
 * Corta un texto en renglones que entren en `ancho`, de izquierda a derecha y
 * sin rebalancear: es lo que hacen las dos apps de referencia ("Te haya matado
 * en / la ciudad", y no "Te haya matado / en la ciudad").
 */
const renglones = (texto: string, ancho: number, medir: (t: string) => number): string[] => {
  const palabras = texto.split(" ").filter((p) => p !== "");
  if (palabras.length === 0) return [""];
  const filas: string[] = [];
  let actual = palabras[0];
  for (const p of palabras.slice(1)) {
    const probar = `${actual} ${p}`;
    if (medir(probar) <= ancho) actual = probar;
    else {
      filas.push(actual);
      actual = p;
    }
  }
  filas.push(actual);
  return filas;
};

/** Una entrada de la columna: una línea de la letra, o un interludio. */
type Entrada = { inicio: number; fin: number; filas: string[]; nota: boolean };

/**
 * La columna entera, ya medida: qué dice cada entrada, cuántos renglones
 * ocupa, dónde empieza y dónde está su centro.
 */
type Columna = { entradas: Entrada[]; centros: number[]; altos: number[] };

const armarColumna = (
  lyrics: Line[],
  medir: (t: string) => number,
  ancho: number,
  interlineado: number,
  aireBloque: number,
  interludio: { activo: boolean; segundos: number },
): Columna => {
  const starts = lineStarts(lyrics);
  const entradas: Entrada[] = [];
  lyrics.forEach((l, i) => {
    // un tramo sin canto antes de esta línea se marca con el símbolo de nota
    const huecoDesde = i === 0 ? 0 : lyrics[i - 1].end;
    if (interludio.activo && starts[i] - huecoDesde >= interludio.segundos) {
      entradas.push({ inicio: huecoDesde, fin: starts[i], filas: [NOTA], nota: true });
    }
    const texto = l.words.map((w) => w.text).join(" ");
    entradas.push({ inicio: starts[i], fin: l.end, filas: renglones(texto, ancho, medir), nota: false });
  });

  const altos = entradas.map((e) => e.filas.length * interlineado);
  const centros: number[] = [];
  let y = 0;
  for (const alto of altos) {
    centros.push(y + alto / 2);
    y += alto + aireBloque;
  }
  return { entradas, centros, altos };
};

/** El "más" del encabezado completo y el galón del mínimo, dibujados a mano. */
const TresPuntos: React.FC<{ lado: number }> = ({ lado }) => (
  <svg width={lado} height={lado} viewBox="0 0 100 100">
    {[28, 50, 72].map((cx) => (
      <circle key={cx} cx={cx} cy={50} r={7} fill="rgba(255,255,255,0.85)" />
    ))}
  </svg>
);

const Galon: React.FC<{ lado: number }> = ({ lado }) => (
  <svg width={lado} height={lado} viewBox="0 0 100 100">
    <path
      d="M24 40 L50 64 L76 40"
      fill="none"
      stroke="rgba(255,255,255,0.92)"
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Portada: React.FC<{ src: string; color: string; lado: number; radio: number }> = ({ src, color, lado, radio }) =>
  src === "" ? (
    <div style={{ width: lado, height: lado, borderRadius: radio, background: color }} />
  ) : (
    <Img
      src={staticFile(src)}
      style={{ width: lado, height: lado, borderRadius: radio, objectFit: "cover" }}
    />
  );

const Encabezado: React.FC<{
  modo: PanelLetraProps["encabezado"];
  boton: boolean;
  titulo: string;
  artistas: string;
  cover: string;
  color: string;
  familia: string;
  escala: number;
  width: number;
  izq: number;
  der: number;
}> = ({ modo, boton, titulo, artistas, cover, color, familia, escala, width, izq, der }) => {
  if (modo === "ninguno") return null;
  const px = (v: number) => v * escala;

  if (modo === "minimo") {
    return (
      <div style={{ position: "absolute", left: 0, top: px(72), width, height: px(96), fontFamily: familia }}>
        <div style={{ position: "absolute", left: izq - px(14), top: 0 }}>
          <Galon lado={px(72)} />
        </div>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: px(34), fontWeight: 700, lineHeight: 1.2 }}>{titulo}</div>
          <div style={{ fontSize: px(32), fontWeight: 400, opacity: 0.72, lineHeight: 1.2 }}>{artistas}</div>
        </div>
      </div>
    );
  }

  const lado = px(200);
  return (
    <div style={{ position: "absolute", left: izq, top: px(86), width: width - izq - der, fontFamily: familia }}>
      <div style={{ display: "flex", alignItems: "center", gap: px(26) }}>
        <Portada src={cover} color={color} lado={lado} radio={px(28)} />
        <div style={{ flex: 1, minWidth: 0, color: "white" }}>
          <div
            style={{
              fontSize: px(48),
              fontWeight: 700,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {titulo}
          </div>
          <div
            style={{
              fontSize: px(42),
              fontWeight: 400,
              opacity: 0.7,
              lineHeight: 1.25,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {artistas}
          </div>
        </div>
        {boton && (
          <div
            style={{
              width: px(88),
              height: px(88),
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TresPuntos lado={px(54)} />
          </div>
        )}
      </div>
    </div>
  );
};

/** suavizado del salto de columna: arranca y termina frenado */
const suave = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

export const PanelLetra: React.FC<PanelLetraProps> = ({
  tema,
  piel,
  fondo,
  letra,
  atenuar,
  anclaje,
  desplazamiento,
  transicion,
  arranque,
  encabezado,
  boton,
  interludio,
  ajusteLetra,
  adelantoLectura,
  franjaBotones,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  // La letra se mide sobre 1080 de ancho y se escala con el ancho: así se ve
  // del mismo tamaño en el celular, porque TikTok muestra la pieza al ancho de
  // la pantalla en todos los formatos.
  const escala = width / 1080;
  // El encabezado no: es interfaz, y si creciera con el ancho en un formato
  // apaisado (4:3, 1440×1080) se comería la línea que suena. Se topa en 1.
  const escalaInterfaz = Math.min(escala, 1);
  const familia = FAMILIAS[letra.tipografia];
  const primario = tema.colors?.primary ?? "#2b2b2b";

  const izq = letra.margenIzquierdo * escala;
  const der = letra.margenDerecho * escala;
  const anchoColumna = width - izq - der;

  const tipografiaLista = useTipografiaLista(familia, letra.peso, letra.tamano);
  const columna = useMemo(() => {
    if (!tipografiaLista) return null;
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.font = `${letra.peso} ${letra.tamano}px ${familia}`;
    const medir = (t: string) => ctx.measureText(t).width;
    // se mide sobre 1080 de ancho y después se escala todo junto
    return armarColumna(
      tema.lyrics,
      medir,
      letra.margenIzquierdo + letra.margenDerecho > 0 ? 1080 - letra.margenIzquierdo - letra.margenDerecho : 1080,
      letra.interlineado,
      letra.aireBloque,
      interludio,
    );
  }, [tipografiaLista, familia, letra, tema.lyrics, interludio]);

  // la línea que suena: la última que ya arrancó
  const t = frame / fps + adelantoLectura / fps - ajusteLetra / fps;
  const i = columna === null ? 0 : Math.max(0, columna.entradas.filter((e) => t >= e.inicio).length - 1);

  // cuánto subió la columna, en px de 1080
  let corrida = 0;
  if (columna !== null) {
    const e = columna.entradas[i];
    if (desplazamiento === "continuo") {
      const siguiente = columna.centros[i + 1] ?? columna.centros[i] + columna.altos[i];
      const avance = e.fin > e.inicio ? (t - e.inicio) / (e.fin - e.inicio) : 1;
      corrida = interpolate(Math.min(1, Math.max(0, avance)), [0, 1], [columna.centros[i], siguiente]);
    } else {
      const anterior = columna.centros[i - 1] ?? columna.centros[i];
      corrida = interpolate(suave(((t - e.inicio) * fps) / transicion), [0, 1], [anterior, columna.centros[i]]);
    }
  }
  // `topColumna` es el borde de arriba de la primera línea. Al principio la
  // columna apoya en `arranque` y recién se mueve cuando la línea que suena
  // bajó hasta el anclaje; si no, el arranque queda con media pantalla vacía.
  const topColumna = Math.min(arranque * height, anclaje * height - corrida * escala);

  const colorLiso = fondo.color !== "" ? fondo.color : `color-mix(in srgb, ${primario} 62%, #111)`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {/* fondo: la portada muy desenfocada, o un color liso */}
      {piel === "desenfoque" && tema.cover !== "" ? (
        <AbsoluteFill style={{ transform: `scale(${fondo.escala})`, overflow: "hidden" }}>
          <Img
            src={staticFile(tema.cover)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `blur(${fondo.desenfoque * escala}px) saturate(1.15)`,
            }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ background: colorLiso }} />
      )}
      {fondo.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${fondo.oscurecer})` }} />}
      {fondo.vineta > 0 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,${fondo.vineta}) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 72%, rgba(0,0,0,${fondo.vineta}) 100%)`,
          }}
        />
      )}

      {/* la columna de letra */}
      {columna !== null &&
        columna.entradas.map((entrada, k) => {
          const d = k - i;
          const lim = d < 0 ? atenuar.lineasArriba : atenuar.lineasAbajo;
          if (Math.abs(d) > lim) return null;
          const curva = d < 0 ? atenuar.curvaArriba : atenuar.curvaAbajo;
          const f = lim === 0 ? 0 : Math.min(1, Math.abs(d) / lim) ** curva;
          const alto = columna.altos[k] * escala;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: izq,
                width: anchoColumna,
                top: topColumna + columna.centros[k] * escala - alto / 2,
                fontFamily: familia,
                fontWeight: letra.peso,
                fontSize: letra.tamano * escala,
                lineHeight: `${letra.interlineado * escala}px`,
                letterSpacing: "-0.01em",
                color: "#FFFFFF",
                opacity: entrada.nota ? interpolate(f, [0, 1], [0.55, atenuar.opacidadMin]) : interpolate(f, [0, 1], [1, atenuar.opacidadMin]),
                filter: f > 0 && atenuar.desenfoqueMax > 0 ? `blur(${f * atenuar.desenfoqueMax * escala}px)` : undefined,
                willChange: "transform",
              }}
            >
              {entrada.filas.map((fila, r) => (
                <div key={r}>{fila}</div>
              ))}
            </div>
          );
        })}

      {/* el encabezado va encima de la columna: la letra pasa por detrás */}
      <Encabezado
        modo={encabezado}
        boton={boton}
        titulo={tema.title}
        artistas={tema.artists}
        cover={tema.cover}
        color={alfa(primario, 70)}
        familia={familia}
        escala={escalaInterfaz}
        width={width}
        izq={izq}
        der={der}
      />

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
