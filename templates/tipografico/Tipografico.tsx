// Molde tipografico (L10): la letra animada sobre color plano, sin video. Las
// palabras escalan, se deslizan y rebotan con el beat, y el fondo va rotando
// entre tres colores sacados de la portada. Ver FICHA.md. Sale en 1:1.
//
// La frase va centrada en el cuadro, no en la zona segura (decisión de Cotu):
// acá la letra es la pieza entera, así que manda el centro del cuadro.
//
// Sin cierre con la portada (decisión de Cotu, como en los Brats).

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Html5Audio,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { RONZINO } from "../../shared/fonts";
import { beatPulse } from "../../shared/effects";
import { SafeZone, safeZoneSchema } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";

export const tipograficoSchema = z.object({
  tema: temaSchema,
  /** los tres colores de fondo; vacío = automático, sacados de la portada */
  colores: z.array(z.string()),
  /** máximo de palabras por frase: las líneas más largas se parten */
  palabrasPorFrase: z.number().int().min(1).max(5),
  /** golpe del fondo al ritmo (usa tema.beats) */
  golpeBeat: z.boolean(),
  /** cuadros que cada palabra aparece antes de cantarse */
  adelantoLectura: z.number().int().min(0).max(15),
  safeZone: safeZoneSchema,
});
export type TipograficoProps = z.infer<typeof tipograficoSchema>;

/** La duración sale del fragmento: inicio y fin. */
export const duracionTipografico: CalculateMetadataFunction<TipograficoProps> = ({ props }) => ({
  durationInFrames: Math.max(1, Math.round((props.tema.fragment.end - props.tema.fragment.start) * 30)),
});

const T = {
  peso: 700,
  interlineado: 1.05,
  margen: 40,
  maxPx: 300,
  maxRenglones: 3,
};

/** Las cinco animaciones de la cuenta, que rotan por frase. */
const ANIMACIONES = ["escala", "deslizamiento", "rebote", "apilado", "corte"] as const;
type Animacion = (typeof ANIMACIONES)[number];

// --- color ----------------------------------------------------------------------

type RGB = [number, number, number];
const hex = ([r, g, b]: RGB) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const deHex = (h: string): RGB => {
  const c = h.replace("#", "");
  const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  return [0, 2, 4].map((k) => parseInt(n.slice(k, k + 2), 16)) as RGB;
};
const luminancia = (c: RGB) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a: RGB, b: RGB) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const mezclar = (a: RGB, b: RGB, p: number): RGB => a.map((v, i) => v + (b[i] - v) * p) as RGB;
const BLANCO: RGB = [255, 255, 255];
const NEGRO: RGB = [0, 0, 0];
const distancia = (a: RGB, b: RGB) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));

const aHsl = ([r, g, b]: RGB): [number, number, number] => {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const min = Math.min(R, G, B);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === R ? ((G - B) / d + (G < B ? 6 : 0)) / 6 : max === G ? ((B - R) / d + 2) / 6 : ((R - G) / d + 4) / 6;
  return [h, sat, l];
};
const deHsl = ([h, sat, l]: [number, number, number]): RGB => {
  if (sat === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
  const p = 2 * l - q;
  const canal = (x: number) => {
    let v = x < 0 ? x + 1 : x > 1 ? x - 1 : x;
    if (v < 1 / 6) v = p + (q - p) * 6 * v;
    else if (v < 1 / 2) v = q;
    else if (v < 2 / 3) v = p + (q - p) * (2 / 3 - v) * 6;
    else v = p;
    return v * 255;
  };
  return [canal(h + 1 / 3), canal(h), canal(h - 1 / 3)] as RGB;
};

/**
 * El color de fondo de la cuenta: se queda con el tono de la portada, pero con
 * saturación y brillo parejos, para que el fondo sea un color pleno y no un
 * casi negro (que es lo que devuelven las portadas oscuras).
 */
const colorPleno = (c: RGB, l = 0.42): RGB => {
  const [h, sat] = aHsl(c);
  return deHsl([h, Math.max(0.45, Math.min(0.8, sat)), l]);
};

/** Texto blanco o negro, el que más contraste haga; si no llega a 4,5:1, el fondo se oscurece o aclara. */
const coloresLegibles = (base: RGB) => {
  const texto = contraste(base, BLANCO) >= contraste(base, NEGRO) ? BLANCO : NEGRO;
  let fondo = base;
  for (let i = 0; i < 20 && contraste(fondo, texto) < 4.5; i++) fondo = mezclar(fondo, texto === BLANCO ? NEGRO : BLANCO, 0.08);
  return { fondo, texto };
};

/**
 * Tres colores de la portada: los grupos que más pesan (pesan los vivos y casi
 * nada los casi negros, blancos y grises), descartando los que se parecen
 * demasiado entre sí para que el fondo cambie de verdad al rotar.
 */
const paleta = (img: HTMLImageElement): RGB[] => {
  const lado = 48;
  const cv = document.createElement("canvas");
  cv.width = lado;
  cv.height = lado;
  const ctx = cv.getContext("2d")!;
  ctx.drawImage(img, 0, 0, lado, lado);
  const { data } = ctx.getImageData(0, 0, lado, lado);
  const grupos = new Map<number, { n: number; suma: RGB; peso: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const brillo = max / 255;
    const vivo = brillo < 0.2 || brillo > 0.97 ? 0.05 : 1;
    const clave = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const gr = grupos.get(clave) ?? { n: 0, suma: [0, 0, 0] as RGB, peso: 0 };
    gr.n++;
    gr.suma = [gr.suma[0] + r, gr.suma[1] + g, gr.suma[2] + b];
    gr.peso += vivo * (0.08 + sat * sat);
    grupos.set(clave, gr);
  }
  const ordenados = [...grupos.values()].sort((a, b) => b.peso - a.peso).map((g) => g.suma.map((v) => v / g.n) as RGB);
  // tonos distintos entre sí, ya llevados a color pleno
  const elegidos: RGB[] = [];
  for (const c of ordenados) {
    const pleno = colorPleno(c);
    if (elegidos.every((e) => distancia(e, pleno) > 70)) elegidos.push(pleno);
    if (elegidos.length === 3) break;
  }
  // si la portada no da para tres tonos, se corre el primero en la rueda de color
  const [h0, s0] = aHsl(elegidos[0] ?? [128, 128, 128]);
  while (elegidos.length < 3) {
    elegidos.push(deHsl([(h0 + 0.09 * elegidos.length) % 1, Math.max(0.45, s0), 0.42]));
  }
  return elegidos;
};

/** Tres colores a partir de uno solo, corriendo el tono. */
const respaldos = (base: string): RGB[] => {
  const [h, sat] = aHsl(deHex(base));
  return [0, 1, 2].map((k) => deHsl([(h + 0.09 * k) % 1, Math.max(0.45, sat), 0.42]));
};

/** Los tres colores de fondo (espera a que cargue la portada antes de dibujar). */
const useColoresPortada = (src: string, forzados: string[], respaldo: string) => {
  const fijos = forzados.filter((c) => c !== "");
  const [colores, setColores] = useState<RGB[] | null>(fijos.length === 3 ? fijos.map(deHex) : null);
  const [handle] = useState(() => delayRender("colores de la portada"));
  useEffect(() => {
    if (fijos.length === 3 || !src) {
      setColores(fijos.length === 3 ? fijos.map(deHex) : respaldos(respaldo));
      continueRender(handle);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setColores(paleta(img));
      continueRender(handle);
    };
    img.onerror = () => {
      setColores(respaldos(respaldo));
      continueRender(handle);
    };
    img.src = staticFile(src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, forzados.join(","), respaldo, handle]);
  return colores;
};

// --- frases ------------------------------------------------------------------------

type Palabra = { t: number; texto: string };
type Frase = { t: number; palabras: Palabra[] };

/** Las líneas de la letra, partidas en frases cortas (la misma idea que en `brat-maximal`). */
const frases = (tema: Tema, max: number): Frase[] =>
  tema.lyrics.flatMap((l) => {
    const n = l.words.length;
    const partes = Math.ceil(n / max);
    const out: Frase[] = [];
    let desde = 0;
    for (let p = 0; p < partes; p++) {
      const cuantas = Math.round((n - desde) / (partes - p));
      const ws = l.words.slice(desde, desde + cuantas).map((w) => ({ t: w.t, texto: w.text }));
      out.push({ t: ws[0].t, palabras: ws });
      desde += cuantas;
    }
    return out;
  });

// --- medida ------------------------------------------------------------------------

const fuente = (px: number) => `${T.peso} ${px}px ${RONZINO}`;

/** Espera a que el canvas mida con Ronzino de verdad (y no con la de respaldo). */
const useTipografiaLista = () => {
  const [lista, setLista] = useState(false);
  const [handle] = useState(() => delayRender("tipografía de las frases"));
  useEffect(() => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    const mide = (f: string) => {
      ctx.font = f;
      return ctx.measureText("si sale el sol").width;
    };
    let intentos = 0;
    const esperar = () => {
      if (Math.abs(mide(`${T.peso} 100px 'Ronzino', monospace`) - mide(`${T.peso} 100px monospace`)) > 1) {
        setLista(true);
        continueRender(handle);
      } else if (++intentos > 200) {
        cancelRender(new Error("Ronzino no se aplica al medir"));
      } else {
        setTimeout(esperar, 25);
      }
    };
    document.fonts.load(fuente(100)).then(esperar, (err) => cancelRender(err));
  }, [handle]);
  return lista;
};

/** La frase lo más grande posible dentro de la caja, en 1 a 3 renglones (o uno por palabra, apilada). */
const diagramar = (palabras: string[], anchoCaja: number, altoCaja: number, apilado: boolean) => {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = fuente(100);
  const w = palabras.map((p) => ctx.measureText(p).width);
  const espacio = ctx.measureText(" ").width;
  const anchoRenglon = (a: number, b: number) => w.slice(a, b).reduce((s, x) => s + x, 0) + espacio * (b - a - 1);
  const n = palabras.length;

  if (apilado) {
    const px = Math.min(T.maxPx, (anchoCaja / Math.max(...w)) * 100, altoCaja / (n * T.interlineado));
    return { px: Math.floor(px), renglones: palabras.map((p) => [p]) };
  }

  let mejor = { px: 0, renglones: [palabras], desparejo: Infinity };
  const probar = (cortes: number[]) => {
    const limites = [0, ...cortes, n];
    const anchos = limites.slice(0, -1).map((a, k) => anchoRenglon(a, limites[k + 1]));
    const r = anchos.length;
    const px = Math.min(T.maxPx, (anchoCaja / Math.max(...anchos)) * 100, altoCaja / (r * T.interlineado));
    const desparejo = Math.max(...anchos) - Math.min(...anchos);
    if (px > mejor.px + 0.5 || (Math.abs(px - mejor.px) <= 0.5 && desparejo < mejor.desparejo)) {
      mejor = { px, renglones: limites.slice(0, -1).map((a, k) => palabras.slice(a, limites[k + 1])), desparejo };
    }
  };
  probar([]);
  for (let a = 1; a < n; a++) {
    probar([a]);
    if (T.maxRenglones >= 3) for (let b = a + 1; b < n; b++) probar([a, b]);
  }
  return { px: Math.floor(mejor.px), renglones: mejor.renglones };
};

// --- la pieza ------------------------------------------------------------------------

/** Cómo entra cada palabra, según la animación de su frase. */
const entradaPalabra = (animacion: Animacion, edad: number, fps: number, indice: number) => {
  if (animacion === "corte") return { transform: "none", opacity: edad >= 0 ? 1 : 0 };
  const s = spring({ frame: Math.round(edad * fps), fps, config: { damping: animacion === "rebote" ? 9 : 200 }, durationInFrames: animacion === "rebote" ? 26 : 16 });
  const opacidad = interpolate(edad * fps, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (animacion === "escala") return { transform: `scale(${interpolate(s, [0, 1], [1.7, 1])})`, opacity: opacidad };
  if (animacion === "deslizamiento") {
    const desde = indice % 2 === 0 ? -1 : 1;
    return { transform: `translateX(${interpolate(s, [0, 1], [desde * 420, 0])}px)`, opacity: opacidad };
  }
  if (animacion === "rebote") return { transform: `translateY(${interpolate(s, [0, 1], [-260, 0])}px)`, opacity: opacidad };
  // apilado: entra desde arriba, cortito
  return { transform: `translateY(${interpolate(s, [0, 1], [-60, 0])}px)`, opacity: opacidad };
};

export const Tipografico: React.FC<TipograficoProps> = ({ tema, colores, palabrasPorFrase, golpeBeat, adelantoLectura, safeZone }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const tLetra = t + adelantoLectura / fps;
  const lista = useTipografiaLista();
  const paletaRGB = useColoresPortada(tema.cover, colores, tema.colors?.primary ?? "#535353");

  const listaFrases = useMemo(() => frases(tema, palabrasPorFrase), [tema, palabrasPorFrase]);
  // la frase en pantalla: la última que ya arrancó; la primera, desde el cuadro 0
  let i = 0;
  listaFrases.forEach((f, k) => {
    if (tLetra >= f.t) i = k;
  });
  const frase = listaFrases[i];
  const animacion = ANIMACIONES[i % ANIMACIONES.length];

  // la caja es el cuadro entero menos el margen: la frase va al medio, sin la zona segura
  const caja = { ancho: width - 2 * T.margen, alto: height - 2 * T.margen };
  const diagrama = useMemo(
    () => (lista ? diagramar(frase.palabras.map((p) => p.texto), caja.ancho, caja.alto, animacion === "apilado") : null),
    [lista, frase, caja.ancho, caja.alto, animacion],
  );
  if (!paletaRGB || !diagrama) return null;

  const { fondo, texto } = coloresLegibles(paletaRGB[i % paletaRGB.length]);
  // el golpe del ritmo: el fondo late apenas
  const golpe = golpeBeat && tema.beats ? beatPulse(t, tema.beats) : 0;

  // a qué palabra de la frase corresponde cada lugar del diagrama
  let cuenta = -1;

  return (
    <AbsoluteFill style={{ backgroundColor: hex(mezclar(fondo, BLANCO, golpe * 0.06)) }}>
      <div
        style={{
          position: "absolute",
          left: T.margen,
          width: caja.ancho,
          top: height / 2,
          transform: "translateY(-50%)",
          textAlign: "center",
          fontFamily: RONZINO,
          fontWeight: T.peso,
          fontSize: diagrama.px,
          lineHeight: T.interlineado,
          color: hex(texto),
          whiteSpace: "nowrap",
        }}
      >
        {diagrama.renglones.map((renglon, k) => (
          <div key={k}>
            {renglon.map((palabra) => {
              cuenta++;
              const p = frase.palabras[cuenta];
              const edad = tLetra - (i === 0 && cuenta === 0 ? -1 : p.t);
              if (edad < 0) return <span key={cuenta} style={{ visibility: "hidden" }}>{palabra} </span>;
              const { transform, opacity } = entradaPalabra(animacion, edad, fps, cuenta);
              return (
                <span key={cuenta} style={{ display: "inline-block", transform, opacity, marginRight: "0.26em" }}>
                  {palabra}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <Html5Audio src={staticFile(tema.fragment.src)} trimBefore={Math.round(tema.fragment.start * fps)} />
      <SafeZone config={safeZone} />
    </AbsoluteFill>
  );
};
