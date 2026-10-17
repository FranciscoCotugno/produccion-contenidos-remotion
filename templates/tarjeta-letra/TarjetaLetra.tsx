// Molde tarjeta-letra (C4 y C9): la tarjeta del tema que arma la app de música
// más usada al compartir una canción, idéntica y sin logo (pedido de Cotu). Ver
// FICHA.md. Sale como imagen, en 3:4 (1080×1440). Sin letra (pedido de Cotu):
// la portada grande con esquinas redondeadas y, debajo, el título en negrita y
// los artistas, centrados, como en la referencia 01-imagen-con-tarjeta.png.
//
// Fondo: una foto (C4) o un color plano sacado de la portada (C9). El color de
// la portada también decide si el texto va en blanco o negro (en C9).

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import { GEIST } from "../../shared/fonts";
import { FranjaBotones, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { temaSchema } from "../../shared/tema";

export const tarjetaLetraSchema = z.object({
  tema: temaSchema,
  /** c4-foto (tarjeta sobre una foto) o c9-color (sobre un color plano sacado de la portada) */
  piel: z.enum(["c4-foto", "c9-color"]),
  /** foto de fondo (C4), ruta dentro de assets/, con desenfoque (px) y oscurecido (0-1) opcionales */
  fondo: z.object({
    foto: z.string(),
    desenfoque: z.number().min(0).max(40).step(1),
    oscurecer: z.number().min(0).max(0.8).step(0.05),
  }),
  /** color de fondo en C9; vacío = automático desde la portada */
  colorFondo: z.string(),
  /** lado de la portada y centro vertical del conjunto, en px */
  tarjeta: z.object({ portada: z.number().min(300).max(800).step(5), centroY: z.number().min(300).max(1100).step(5) }),
  franjaBotones: franjaBotonesSchema,
});
export type TarjetaLetraProps = z.infer<typeof tarjetaLetraSchema>;

/**
 * Medidas, en px a 1080 de ancho: más chicas que las de la referencia (dos
 * veces un 15 % menos, pedido de Cotu), salvo el título y los artistas, que no
 * bajan de 50 y 32 px (texto principal y secundario, CLAUDE.md).
 */
const T = {
  radioPortada: 13,
  entrePortadaYTitulo: 22,
  titulo: 50,
  artistas: 32,
  anchoTexto: 760, // el título y los artistas no pasan de este ancho (x 160 a 920)
};

// --- color -----------------------------------------------------------------

type RGB = [number, number, number];
const hex = ([r, g, b]: RGB) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const deHex = (h: string): RGB => {
  const c = h.replace("#", "");
  const n = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  return [0, 2, 4].map((k) => parseInt(n.slice(k, k + 2), 16)) as RGB;
};
/** luminancia relativa (WCAG) */
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

/** Fondo de C9 y su texto: blanco o negro, el que más contraste haga; si no llega a 4,5:1, el fondo se oscurece o aclara. */
const coloresLegibles = (base: RGB) => {
  const texto = contraste(base, BLANCO) >= contraste(base, NEGRO) ? BLANCO : NEGRO;
  let fondo = base;
  for (let i = 0; i < 20 && contraste(fondo, texto) < 4.5; i++) fondo = mezclar(fondo, texto === BLANCO ? NEGRO : BLANCO, 0.08);
  return { fondo, texto };
};

/**
 * Color dominante de la portada, como lo elige la app: el grupo de colores que
 * más pesa, donde pesan los colores vivos (saturados, de brillo medio) y casi
 * nada los casi negros, casi blancos y grises.
 */
const dominante = (img: HTMLImageElement): RGB => {
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
  const mejor = [...grupos.values()].sort((a, b) => b.peso - a.peso)[0];
  return mejor.suma.map((v) => v / mejor.n) as RGB;
};

/** Color dominante de la portada (espera a que cargue la imagen antes de dibujar). */
const useColorPortada = (src: string, forzado: string, respaldo: string) => {
  const [color, setColor] = useState<RGB | null>(forzado ? deHex(forzado) : null);
  const [handle] = useState(() => delayRender("color de la portada"));
  useEffect(() => {
    if (forzado || !src) {
      setColor(deHex(forzado || respaldo));
      continueRender(handle);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setColor(dominante(img));
      continueRender(handle);
    };
    img.onerror = () => {
      setColor(deHex(respaldo));
      continueRender(handle);
    };
    img.src = staticFile(src);
  }, [src, forzado, respaldo, handle]);
  return color;
};

export const TarjetaLetra: React.FC<TarjetaLetraProps> = ({ tema, piel, fondo, colorFondo, tarjeta, franjaBotones }) => {
  const { width } = useVideoConfig();
  const base = useColorPortada(tema.cover, colorFondo, tema.colors?.primary ?? "#535353");
  if (!base) return null;

  const c9 = piel === "c9-color";
  const { fondo: fondoC9, texto: textoC9 } = coloresLegibles(mezclar(base, NEGRO, 0.25));
  // sobre la foto, texto blanco con sombra suave (como la referencia)
  const colorTexto = c9 ? `rgb(${textoC9.join(",")})` : "#FFFFFF";
  const sombraTexto = c9 ? "none" : "0 2px 10px rgba(0,0,0,0.55)";

  return (
    <AbsoluteFill style={{ backgroundColor: c9 ? hex(fondoC9) : "#000" }}>
      {!c9 && fondo.foto && (
        <AbsoluteFill>
          <Img
            src={staticFile(fondo.foto)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: fondo.desenfoque > 0 ? `blur(${fondo.desenfoque}px)` : undefined,
              transform: fondo.desenfoque > 0 ? "scale(1.06)" : undefined,
            }}
          />
          {fondo.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${fondo.oscurecer})` }} />}
        </AbsoluteFill>
      )}

      {/* la tarjeta del tema: portada grande y, debajo, título y artistas, centrados */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - T.anchoTexto / 2,
          width: T.anchoTexto,
          top: tarjeta.centroY,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: GEIST,
          color: colorTexto,
          textShadow: sombraTexto,
          textAlign: "center",
        }}
      >
        {tema.cover ? (
          <Img
            src={staticFile(tema.cover)}
            style={{
              width: tarjeta.portada,
              height: tarjeta.portada,
              borderRadius: T.radioPortada,
              objectFit: "cover",
              boxShadow: "0 16px 50px rgba(0,0,0,0.45)",
            }}
          />
        ) : null}
        <div style={{ marginTop: T.entrePortadaYTitulo, fontSize: T.titulo, fontWeight: 700, lineHeight: 1.15, maxWidth: T.anchoTexto }}>{tema.title}</div>
        <div style={{ marginTop: 6, fontSize: T.artistas, fontWeight: 500, opacity: 0.85, lineHeight: 1.2, maxWidth: T.anchoTexto }}>{tema.artists}</div>
      </div>

      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
