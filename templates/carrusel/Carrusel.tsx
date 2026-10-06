// Molde carrusel (C1, C2, C8, R2): un posteo de dos imágenes en modo foto. La
// primera, con una frase que invita a deslizar; la segunda la resuelve con una
// frase de la letra o con la tarjeta del tema. Ver FICHA.md. Cada slide es una imagen 3:4
// (1080×1440).
//
// Cuatro tipos de slide, en un solo componente (prop `tipo`):
// - A. foto con hook; B. artista con una frase de la estrofa; C. hook sobre color (R2);
//   D. artista con la tarjeta chica del tema arriba a la derecha (R2).
// El texto es el nativo de la app (TikTok Sans blanco, sombra leve, sin caja),
// como en las referencias.

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import { TIKTOK_SANS } from "../../shared/fonts";
import { SafeZone, safeArea, safeZoneSchema } from "../../shared/SafeZone";
import { temaSchema } from "../../shared/tema";

export const carruselSchema = z.object({
  tema: temaSchema,
  /** A: foto con hook; B: artista con una frase de la letra; C: hook sobre color; D: artista con tarjeta */
  tipo: z.enum(["A-foto-hook", "B-artista-frase", "C-hook-color", "D-artista-tarjeta"]),
  /** foto de fondo (A, B, D), ruta dentro de assets/ */
  foto: z.string(),
  /** oscurecido de la foto (0-1): la de la frase va más oscura */
  oscurecer: z.number().min(0).max(0.8).step(0.05),
  /** el hook (A, C) o la frase de la letra (B), un renglón por línea */
  texto: z.string(),
  /** dónde va el texto: al centro o en el tercio de arriba */
  posicionTexto: z.enum(["centro", "arriba"]),
  /** color del texto; vacío = blanco (en C, el que más contraste haga con el fondo) */
  colorTexto: z.string(),
  /** color de fondo de la slide C; vacío = automático desde la portada */
  colorFondo: z.string(),
  safeZone: safeZoneSchema,
});
export type CarruselProps = z.infer<typeof carruselSchema>;

/** El texto nativo de la app (como en letra-sobre-video), a 1080 de ancho. */
const TEXTO = {
  hook: 56,
  /** la frase de la letra: 56 px, y 48 si es larga (es una sola frase, pedido de Cotu) */
  frase: 56,
  fraseLarga: 48,
  /** el hook de la slide C, sobre color plano */
  hookColor: 80,
  /** ancho máximo, centrado en el cuadro: de x 155 a 925 (hasta la columna de botones) */
  ancho: 770,
  sombra: "0 1px 4px rgba(0,0,0,0.6), 0 0 14px rgba(0,0,0,0.25)",
};

/** La tarjeta chica del tema (slide D), arriba a la derecha, sin logo. */
const TARJETA = { ancho: 250, pad: 12, radio: 16, radioPortada: 8, titulo: 34, artistas: 32, margen: 40 };

// --- color de la portada (slide C), como en tarjeta-letra ------------------------

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

/** Texto blanco o negro, el que más contraste haga; si no llega a 4,5:1, el fondo se oscurece o aclara. */
const coloresLegibles = (base: RGB) => {
  const texto = contraste(base, BLANCO) >= contraste(base, NEGRO) ? BLANCO : NEGRO;
  let fondo = base;
  for (let i = 0; i < 20 && contraste(fondo, texto) < 4.5; i++) fondo = mezclar(fondo, texto === BLANCO ? NEGRO : BLANCO, 0.08);
  return { fondo, texto };
};

/** Color dominante de la portada: pesan los colores vivos; casi nada los casi negros, casi blancos y grises. */
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

/** Color de fondo de la slide C (espera a que cargue la portada antes de dibujar). */
const useColorPortada = (activo: boolean, src: string, forzado: string, respaldo: string) => {
  const [color, setColor] = useState<RGB | null>(!activo || forzado ? deHex(forzado || respaldo) : null);
  const [handle] = useState(() => delayRender("color de la portada"));
  useEffect(() => {
    if (!activo || forzado || !src) {
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
  }, [activo, src, forzado, respaldo, handle]);
  return color;
};

// --- la slide ----------------------------------------------------------------------

export const Carrusel: React.FC<CarruselProps> = ({ tema, tipo, foto, oscurecer, texto, posicionTexto, colorTexto, colorFondo, safeZone }) => {
  const { width, height } = useVideoConfig();
  const area = safeArea(width, height);
  const esC = tipo === "C-hook-color";
  const base = useColorPortada(esC, tema.cover, colorFondo, tema.colors?.primary ?? "#535353");
  if (!base) return null;

  const legibles = coloresLegibles(mezclar(base, NEGRO, 0.2));
  const esFrase = tipo === "B-artista-frase";
  const renglones = texto.split("\n").filter((r) => r.trim() !== "");
  const larga = renglones.length > 2 || texto.length > 60;
  const px = esC ? TEXTO.hookColor : esFrase ? (larga ? TEXTO.fraseLarga : TEXTO.frase) : TEXTO.hook;
  const color = colorTexto || (esC ? hex(legibles.texto) : "#FFFFFF");
  const centroY = posicionTexto === "arriba" ? area.top + area.height * 0.25 : (area.top + area.bottom) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: esC ? hex(legibles.fondo) : "#000" }}>
      {!esC && foto && (
        <AbsoluteFill>
          <Img src={staticFile(foto)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${oscurecer})` }} />}
        </AbsoluteFill>
      )}

      {/* el hook o la estrofa, un renglón de la letra por línea */}
      {tipo !== "D-artista-tarjeta" && renglones.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: width / 2 - TEXTO.ancho / 2,
            width: TEXTO.ancho,
            top: centroY,
            transform: "translateY(-50%)",
            textAlign: "center",
            fontFamily: TIKTOK_SANS,
            fontWeight: esC ? 600 : 500,
            fontSize: px,
            lineHeight: esC ? 1.12 : 1.22,
            color,
            textShadow: esC ? "none" : TEXTO.sombra,
          }}
        >
          {renglones.map((r, k) => (
            <div key={k} style={{ textWrap: "balance" }}>
              {r}
            </div>
          ))}
        </div>
      )}

      {/* la tarjeta chica del tema, arriba a la derecha (dentro de la zona libre) */}
      {tipo === "D-artista-tarjeta" && (
        <div
          style={{
            position: "absolute",
            left: area.right - TARJETA.margen - TARJETA.ancho,
            top: area.top + TARJETA.margen,
            width: TARJETA.ancho,
            boxSizing: "border-box",
            padding: TARJETA.pad,
            borderRadius: TARJETA.radio,
            background: "rgba(24,24,24,0.88)",
            fontFamily: TIKTOK_SANS,
            color: "#FFFFFF",
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          }}
        >
          {tema.cover && (
            <Img
              src={staticFile(tema.cover)}
              style={{ width: "100%", aspectRatio: "1", borderRadius: TARJETA.radioPortada, objectFit: "cover", display: "block" }}
            />
          )}
          <div style={{ marginTop: 10, fontSize: TARJETA.titulo, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {tema.title}
          </div>
          <div style={{ marginTop: 2, fontSize: TARJETA.artistas, fontWeight: 400, opacity: 0.7, lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {tema.artists}
          </div>
        </div>
      )}

      <SafeZone config={safeZone} />
    </AbsoluteFill>
  );
};
