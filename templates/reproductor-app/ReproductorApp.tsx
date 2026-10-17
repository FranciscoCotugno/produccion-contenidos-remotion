// Molde reproductor-app: el videoclip sonando dentro de un reproductor de
// app de música, con una línea de texto arriba. Ver FICHA.md.
//
// De atrás hacia adelante: fondo (el mismo clip, desenfocado), tarjeta del
// reproductor según la piel, y la línea de texto apoyada sobre la tarjeta.
// Todo se ubica dentro de la zona segura: la tarjeta apoya su borde de abajo
// sobre el límite inferior y la letra crece hacia arriba desde la tarjeta.

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  OffthreadVideo,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TIKTOK_SANS } from "../../shared/fonts";
import { lineStarts, type Line, type Word } from "../../shared/lyrics";
import { FranjaBotones, areaDelCuadro, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";
import { ESCALA_APPLE_OSCURA, PielApple, TARJETA_APPLE } from "./PielApple";

export const reproductorAppSchema = z.object({
  tema: temaSchema,
  /** por ahora solo la piel oscura; después se suman apple-clara y spotify */
  piel: z.enum(["apple-oscura"]),
  texto: z.object({
    /** "letra": la letra sincronizada; "fijo": el texto de abajo todo el video */
    modo: z.enum(["letra", "fijo"]),
    fijo: z.string(),
  }),
  /** ajuste fino de toda la letra, en cuadros: positivo la atrasa, negativo la adelanta */
  ajusteLetra: z.number().int().min(-30).max(30).step(1),
  /** cuadros que cada línea (o palabra) aparece antes de cantarse, para dar tiempo a leer */
  adelantoLectura: z.number().int().min(0).max(15).step(1),
  /** audio aparte: archivo dentro de assets/ (vacío = sale del clip) y segundo de inicio */
  audio: z.object({ src: z.string(), start: z.number().min(0) }),
  /** encuadre del clip dentro de la portada (1 = sin zoom) */
  zoomPortada: z.number().min(1).max(2.5).step(0.01),
  // Para decidir en Studio; cuando se fijen, pasan a la piel.
  revelado: z.enum(["linea", "palabra"]),
  pesoLetra: z.enum(["light", "regular", "medium", "semibold", "bold"]),
  /** centro horizontal del reproductor y la letra: la pantalla o la zona libre de interfaz */
  centrar: z.enum(["pantalla", "zonaSegura"]),
  desenfoqueFondo: z.number().min(0).max(80).step(1),
  franjaBotones: franjaBotonesSchema,
});

export type ReproductorAppProps = z.infer<typeof reproductorAppSchema>;

/** colores de la tarjeta si el tema todavía no trae los suyos */
const COLORES_POR_DEFECTO = { primary: "#8c2d3c", secondary: "#7a7fd0" };

/** espacio entre la letra y la tarjeta */
const AIRE_LETRA = 36;
/** la letra va siempre en una fila: 60 px, y se achica hasta 50 si no entra */
const LETRA_PX = 60;
const LETRA_MIN_PX = 50;
const ALTO_LINEA = LETRA_PX * 1.15;
const PESOS = { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 } as const;
/** sombra suave detrás de la letra, para que se lea sobre cualquier fondo */
const SOMBRA_LETRA = "0 2px 4px rgba(0,0,0,0.35), 0 4px 22px rgba(0,0,0,0.55)";
/** entrada de la línea (o palabra): aparece en 4 cuadros y sube en 6 */
const ENTRADA = { opacidad: 4, subida: 6, px: 14 };

// El primer cuadro de la entrada ya se ve (edad 0 = 1/4 de opacidad): si
// arrancara en 0, cada cambio de línea dejaría un cuadro sin texto.
const entrada = (edadCuadros: number) => {
  const edad = edadCuadros + 1;
  return {
    opacity: interpolate(edad, [0, ENTRADA.opacidad], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(edad, [0, ENTRADA.subida], [ENTRADA.px, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })}px)`,
  };
};

/**
 * Espera a que cargue TikTok Sans en el peso pedido antes de medir la letra:
 * si se midiera con la tipografía de reemplazo, los cortes saldrían mal.
 */
const useTipografiaLista = (peso: number) => {
  const [lista, setLista] = useState<number | null>(null);
  const [handle] = useState(() => delayRender("TikTok Sans para medir la letra"));
  useEffect(() => {
    let intentos = 0;
    // después de cargarla, se espera a que el canvas mida con ella de verdad
    // (en el render en paralelo, algunas pestañas miden con la de reemplazo
    // aunque document.fonts la dé por cargada; mismo arreglo que brat-puro)
    const esperar = () => {
      if (canvasUsaTikTokSans(peso)) {
        setLista(peso);
        continueRender(handle);
      } else if (++intentos > 200) {
        cancelRender(new Error("TikTok Sans no se aplica al medir la letra"));
      } else {
        setTimeout(esperar, 25);
      }
    };
    document.fonts.load(`${peso} ${LETRA_PX}px 'TikTok Sans'`).then(esperar, (err) => cancelRender(err));
  }, [peso, handle]);
  return lista === peso;
};

/** Si el canvas ya mide con TikTok Sans: con monospace de respaldo, tiene que dar distinto que monospace solo. */
const canvasUsaTikTokSans = (peso: number) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  const ancho = (familia: string) => {
    ctx.font = `${peso} 100px ${familia}`;
    return ctx.measureText("Suena tu canción").width;
  };
  return Math.abs(ancho("'TikTok Sans', monospace") - ancho("monospace")) > 1;
};

/** ancho de un texto en px, con la tipografía de la letra */
type Medir = (texto: string, px: number) => number;
const crearMedidor = (peso: number): Medir => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  return (texto, px) => {
    ctx.font = `${peso} ${px}px ${TIKTOK_SANS}`;
    return ctx.measureText(texto).width;
  };
};

/** tamaño (hasta 60 px) con que un texto entra en el ancho; da menos de 50 si no entra */
const tamanoQueEntra = (texto: string, medir: Medir, ancho: number) =>
  Math.min(LETRA_PX, (LETRA_PX * ancho) / medir(texto, LETRA_PX));

/** palabras [desde, hasta) de una línea que se muestran juntas */
type Tramo = { desde: number; hasta: number };
type Diagrama = { px: number; tramos: Tramo[] };

/**
 * Diagramación de una línea en una sola fila. Si no entra ni con 50 px, se
 * parte en tramos que aparecen uno después del otro. El corte se elige por
 * los tiempos de las palabras: donde hay más espacio entre una y la
 * siguiente (con un plus si hay una coma), prefiriendo cortes donde los dos
 * tramos entren y queden parejos. Todos los tramos de la línea usan el mismo
 * tamaño, para que no salte entre uno y otro.
 */
const diagramar = (words: Word[], medir: Medir, ancho: number): Diagrama => {
  const tamano = (a: number, b: number) =>
    tamanoQueEntra(words.slice(a, b).map((w) => w.text).join(" "), medir, ancho);
  const partir = (a: number, b: number): Tramo[] => {
    if (b - a <= 1 || tamano(a, b) >= LETRA_MIN_PX) return [{ desde: a, hasta: b }];
    let corte = a + 1;
    let mejor = -Infinity;
    for (let c = a + 1; c < b; c++) {
      const entran = tamano(a, c) >= LETRA_MIN_PX && tamano(c, b) >= LETRA_MIN_PX;
      const hueco = words[c].t - words[c - 1].t;
      const coma = /[,;:.!?]$/.test(words[c - 1].text) ? 0.3 : 0;
      const desparejo = Math.abs(c - a - (b - c)) / (b - a);
      const puntaje = (entran ? 100 : 0) + hueco + coma - desparejo;
      if (puntaje > mejor) {
        mejor = puntaje;
        corte = c;
      }
    }
    return [...partir(a, corte), ...partir(corte, b)];
  };
  const tramos = partir(0, words.length);
  const px = Math.max(LETRA_MIN_PX, Math.min(...tramos.map((tr) => tamano(tr.desde, tr.hasta))));
  return { px, tramos };
};

/**
 * Letra sincronizada, siempre en una fila. `t` es el tiempo de la letra (ya
 * con el ajuste fino) y `adelanto` los segundos que cada línea, tramo o
 * palabra aparece antes de cantarse.
 */
const Letra: React.FC<{
  lyrics: Line[];
  diagramas: Diagrama[];
  revelado: "linea" | "palabra";
  t: number;
  adelanto: number;
  fps: number;
}> = ({ lyrics, diagramas, revelado, t, adelanto, fps }) => {
  const starts = lineStarts(lyrics);
  const inicios = starts.map((s) => s - adelanto);
  // la línea que corre es la última que ya arrancó, mientras no haya terminado
  const i = inicios.filter((s) => t >= s).length - 1;
  if (i < 0 || t >= lyrics[i].end) return null;
  const words = lyrics[i].words;
  const { px, tramos } = diagramas[i];
  // el primer tramo arranca con la línea; los siguientes, con su primera palabra
  const iniciosTramo = tramos.map((tr, k) => (k === 0 ? starts[i] : words[tr.desde].t) - adelanto);
  const k = Math.max(0, iniciosTramo.filter((s) => t >= s).length - 1);
  const { desde, hasta } = tramos[k];
  const texto = (n: number) => words[n].text;
  const indices = Array.from({ length: hasta - desde }, (_, j) => desde + j);

  if (revelado === "linea") {
    return <div style={{ fontSize: px, ...entrada((t - iniciosTramo[k]) * fps) }}>{indices.map(texto).join(" ")}</div>;
  }
  return (
    <div style={{ fontSize: px }}>
      {indices.map((n, j) =>
        t >= words[n].t - adelanto ? (
          <React.Fragment key={n}>
            {j > 0 ? " " : null}
            <span style={{ display: "inline-block", ...entrada((t - words[n].t + adelanto) * fps) }}>{texto(n)}</span>
          </React.Fragment>
        ) : null,
      )}
    </div>
  );
};

export const ReproductorApp: React.FC<ReproductorAppProps> = ({
  tema,
  texto,
  ajusteLetra,
  adelantoLectura,
  audio,
  zoomPortada,
  revelado,
  pesoLetra,
  centrar,
  desenfoqueFondo,
  franjaBotones,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const area = areaDelCuadro(width, height);

  const track = tema.track ?? { displayStart: tema.fragment.start, duration: Math.max(180, tema.fragment.end) };
  const colores = { ...COLORES_POR_DEFECTO, ...tema.colors };
  const audioAparte = audio.src !== "";

  // La tarjeta va centrada en vertical en el cuadro completo; en horizontal,
  // en el cuadro o en la zona libre de interfaz. La letra va arriba de la
  // tarjeta, centrada sobre ella y sin pisar los márgenes laterales de la
  // zona segura. Las zonas de arriba y abajo quedan como guía (ver FICHA).
  const centroX = centrar === "pantalla" ? width / 2 : (area.left + area.right) / 2;
  const escala = ESCALA_APPLE_OSCURA;
  const arribaTarjeta = (height - TARJETA_APPLE.height * escala) / 2;
  const abajoTarjeta = arribaTarjeta + TARJETA_APPLE.height * escala;
  const medioAnchoLetra = Math.min(centroX - area.left, area.right - centroX);
  const anchoLetra = medioAnchoLetra * 2;

  // medidas de la letra: tamaño y tramos de cada línea, y tamaño del texto fijo
  const peso = PESOS[pesoLetra];
  const tipografiaLista = useTipografiaLista(peso);
  const medidas = useMemo(() => {
    if (!tipografiaLista) return null;
    const medir = crearMedidor(peso);
    return {
      lineas: tema.lyrics.map((l) => diagramar(l.words, medir, anchoLetra)),
      fijo: tamanoQueEntra(texto.fijo, medir, anchoLetra),
    };
  }, [tipografiaLista, peso, tema.lyrics, texto.fijo, anchoLetra]);

  const clip = (style: React.CSSProperties, muted: boolean) => (
    <OffthreadVideo
      src={staticFile(tema.fragment.src)}
      trimBefore={Math.round(tema.fragment.start * fps)}
      muted={muted}
      style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* fondo: el clip desenfocado y oscurecido */}
      <AbsoluteFill style={{ transform: "scale(1.25)" }}>
        {clip({ filter: `blur(${desenfoqueFondo}px) brightness(0.62) saturate(1.2)` }, true)}
      </AbsoluteFill>

      <PielApple
        portada={clip({ transform: `scale(${zoomPortada})` }, audioAparte)}
        titulo={tema.title}
        artistas={tema.artists}
        transcurrido={track.displayStart + t}
        duracion={track.duration}
        primario={colores.primary}
        secundario={colores.secondary}
        abajo={abajoTarjeta}
        centroX={centroX}
        escala={escala}
      />

      {/* línea de texto: una sola fila apoyada sobre la tarjeta */}
      <div
        style={{
          position: "absolute",
          left: centroX - medioAnchoLetra,
          width: anchoLetra,
          top: arribaTarjeta - AIRE_LETRA - ALTO_LINEA,
          height: ALTO_LINEA,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          textAlign: "center",
          fontFamily: TIKTOK_SANS,
          fontWeight: peso,
          fontSize: LETRA_PX,
          lineHeight: 1.15,
          whiteSpace: "nowrap",
          color: "white",
          textShadow: SOMBRA_LETRA,
        }}
      >
        {medidas === null ? null : texto.modo === "fijo" ? (
          // el texto fijo no tiene tiempos para partirlo: si ni con 50 px
          // entra, pasa a dos filas que crecen hacia arriba
          <div
            style={
              medidas.fijo >= LETRA_MIN_PX
                ? { fontSize: medidas.fijo }
                : { fontSize: LETRA_MIN_PX, whiteSpace: "normal", textWrap: "balance" }
            }
          >
            {texto.fijo}
          </div>
        ) : (
          <Letra
            lyrics={tema.lyrics}
            diagramas={medidas.lineas}
            revelado={revelado}
            t={t - ajusteLetra / fps}
            adelanto={adelantoLectura / fps}
            fps={fps}
          />
        )}
      </div>

      {audioAparte && <Html5Audio src={staticFile(audio.src)} trimBefore={Math.round(audio.start * fps)} />}

      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
