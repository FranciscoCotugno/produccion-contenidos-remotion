// Guía de la franja de botones de TikTok.
//
// Reemplaza a la vieja guía de zona segura (reglas generales del 2026-10-17).
// Ya no hay zona segura: **las composiciones van a sangre completa** y el texto
// puede llegar al borde si el diseño lo pide. La única precaución que queda es
// la columna de botones de la app sobre el borde derecho: conviene no poner ahí
// algo que haya que leer. Es un borde, no una caja.
//
// El pie de pantalla no se cuida con márgenes sino eligiendo el formato: en 4:3
// o 1:1 el epígrafe y los botones caen sobre las bandas negras, no sobre la
// pieza. Por eso esta guía, en esos formatos, no pinta nada: es correcto.
//
// Se prende y apaga desde Studio con `franjaBotones.show` (arranca apagada, así
// nunca sale en un render). Para calibrar, poné una captura real de TikTok en
// assets/safezone/ y pasala en `franjaBotones.capture`.

import React from "react";
import { z } from "zod";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";

/**
 * Pantalla de la app y lo que tapa la interfaz, en px.
 *
 * Calibrado con assets/safezone/captura-tiktok-iphone.jpg (iPhone, recortada al
 * área del video y llevada a 1080×1920). La columna de botones y sus contadores
 * arranca en x≈927, o sea ~153 px: se toma 155. Las otras medidas quedan como
 * registro de la guía vieja; hoy solo se usa `right`.
 */
export const TIKTOK_SCREEN = { width: 1080, height: 1920 };
export const TIKTOK_UI = { top: 150, bottom: 450, right: 155, left: 60 };

export const franjaBotonesSchema = z.object({
  /** mostrar la guía (solo para revisar en Studio) */
  show: z.boolean(),
  /** captura de TikTok para calibrar, ruta dentro de assets/ (vacío = sin captura) */
  capture: z.string(),
  /** opacidad de la captura */
  captureOpacity: z.number().min(0).max(1).step(0.05),
});

export type FranjaBotonesProps = z.infer<typeof franjaBotonesSchema>;

export const franjaOff: FranjaBotonesProps = { show: false, capture: "", captureOpacity: 0.5 };

/** Cómo la app encaja una composición de w×h en la pantalla (contain, centrado). */
const fitInScreen = (width: number, height: number) => {
  const scale = Math.min(TIKTOK_SCREEN.width / width, TIKTOK_SCREEN.height / height);
  return {
    scale,
    offsetX: (TIKTOK_SCREEN.width - width * scale) / 2,
    offsetY: (TIKTOK_SCREEN.height - height * scale) / 2,
  };
};

/**
 * El cuadro entero: es donde los moldes ubican letra, títulos y tarjetas.
 *
 * Antes se llamaba `safeArea` y descontaba la interfaz de TikTok, lo que en 9:16
 * dejaba el contenido en el 55 % del cuadro, empujado arriba y a la izquierda.
 * Cotu lo sacó el 2026-10-14 y las reglas generales del 17 lo confirmaron: se va
 * a sangre. La función queda porque los moldes la usan para ubicar, pero hoy
 * devuelve el cuadro completo.
 */
export const areaDelCuadro = (width: number, height: number) => ({
  left: 0,
  top: 0,
  right: width,
  bottom: height,
  width,
  height,
});

/**
 * Dónde cae la columna de botones de la app sobre esta composición, en px del
 * cuadro. Si la pieza no es 9:16, los botones caen sobre las bandas negras y
 * esto devuelve ancho 0: no hay nada que cuidar.
 */
export const franjaDeBotones = (width: number, height: number) => {
  const { scale, offsetX } = fitInScreen(width, height);
  const desde = Math.min(width, Math.max(0, (TIKTOK_SCREEN.width - TIKTOK_UI.right - offsetX) / scale));
  return { desde, ancho: width - desde };
};

/** El rectángulo que la interfaz deja libre. Ya no lo usan los moldes: sirve para medir. */
export const areaLibreDeInterfaz = (width: number, height: number) => {
  const { scale, offsetX, offsetY } = fitInScreen(width, height);
  const toX = (x: number) => Math.min(width, Math.max(0, (x - offsetX) / scale));
  const toY = (y: number) => Math.min(height, Math.max(0, (y - offsetY) / scale));
  const left = toX(TIKTOK_UI.left);
  const top = toY(TIKTOK_UI.top);
  const right = toX(TIKTOK_SCREEN.width - TIKTOK_UI.right);
  const bottom = toY(TIKTOK_SCREEN.height - TIKTOK_UI.bottom);
  return { left, top, right, bottom, width: right - left, height: bottom - top };
};

const ZONA = "rgba(255, 40, 70, 0.32)";

export const FranjaBotones: React.FC<{ config: FranjaBotonesProps }> = ({ config }) => {
  const { width, height } = useVideoConfig();
  if (!config.show) return null;

  const { scale, offsetX, offsetY } = fitInScreen(width, height);
  const { desde, ancho } = franjaDeBotones(width, height);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {config.capture !== "" && (
        <Img
          src={staticFile(config.capture)}
          style={{
            position: "absolute",
            left: -offsetX / scale,
            top: -offsetY / scale,
            width: TIKTOK_SCREEN.width / scale,
            height: TIKTOK_SCREEN.height / scale,
            opacity: config.captureOpacity,
          }}
        />
      )}

      {ancho > 0 && (
        <>
          <div style={{ position: "absolute", left: desde, top: 0, width: ancho, height: "100%", background: ZONA }} />
          <div style={{ position: "absolute", left: desde, top: 0, width: 3, height: "100%", background: "rgba(255,255,255,0.85)" }} />
          <div
            style={{
              position: "absolute",
              left: desde + ancho / 2,
              top: height / 2,
              transform: "translate(-50%, -50%) rotate(90deg)",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: "white",
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
              whiteSpace: "nowrap",
            }}
          >
            botones {Math.round(ancho)}px
          </div>
        </>
      )}

      {ancho === 0 && (
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 12,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: "white",
            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          {width}×{height}: los botones caen sobre las bandas
        </div>
      )}
    </AbsoluteFill>
  );
};
