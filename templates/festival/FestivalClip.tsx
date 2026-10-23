// Molde festival: un clip de streamer tal cual, con un hook arriba y la mosca
// del festival. Ver FICHA.md.
//
// **El video original no se toca.** No se recorta, no se escala a cubrir, no se
// reencuadra: entra entero y centrado, con bandas negras donde sobra cuadro.
// Si es apaisado queda apaisado; si es 9:16 llena la pantalla. El audio va tal
// cual, sin tocar.
//
// Encima van dos cosas y nada más: el hook y la mosca, los dos durante todo el
// video.

import React from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { TIKTOK_SANS, conEmoji } from "../../shared/fonts";
import { duracionDeFuente } from "../../shared/fpsFuente";

/**
 * Lo que la interfaz de TikTok tapa, en px de un cuadro de 1080×1920. El hook y
 * la mosca tienen que caer fuera de acá.
 *
 * Es más grande que la guía de `shared/FranjaBotones` porque acá lo pidió Cotu
 * con estos números para este pedido.
 */
export const TAPA_TIKTOK = { arriba: 120, abajo: 320, derecha: 180 };

export const festivalSchema = z.object({
  clip: z.object({
    src: z.string(),
    /** tamaño del archivo original: hace falta para ubicar la marca ajena */
    ancho: z.number().int().min(1),
    alto: z.number().int().min(1),
  }),

  /** el texto de arriba. Lo escribe una persona; vacío = sin hook */
  hook: z.string(),
  hookEstilo: z.object({
    tamano: z.number().min(24).max(90).step(1),
    peso: z.number().min(300).max(800).step(100),
    /** ancho de la caja donde corta en renglones, en px */
    ancho: z.number().min(400).max(1000).step(10),
    /** cuadros del fundido de entrada */
    fundido: z.number().int().min(0).max(60),
    /**
     * Altura del hook cuando el video llena el cuadro, como fracción del alto.
     * Tiene que quedar por debajo de los 120 px que tapa TikTok arriba.
     */
    altura: z.number().min(0.06).max(0.4).step(0.005),
    /**
     * Altura del hook cuando el video es apaisado y deja banda, como fracción
     * de esa banda. 0,5 lo centra; más lo baja hacia el borde del video.
     */
    enBanda: z.number().min(0.3).max(0.95).step(0.05),
  }),

  mosca: z.object({
    archivo: z.string(),
    /**
     * `tercio`: en el tercio de abajo, arriba de donde TikTok pone el usuario.
     * `tapar`: centrada sobre la marca ajena, opaca y más grande que ella.
     */
    modo: z.enum(["tercio", "tapar"]),
    /** ancho de la mosca en modo tercio, en px del cuadro final */
    anchoTercio: z.number().min(120).max(900).step(10),
    /** altura del centro en modo tercio, como fracción del alto */
    alturaTercio: z.number().min(0.5).max(0.95).step(0.01),
    /** cuánto más ancha que la caja de la marca, en modo tapar */
    holgura: z.number().min(1).max(3).step(0.05),
    /** color de la placa que tapa la marca ajena */
    colorPlaca: z.string(),
  }),

  /** dónde está la marca ajena, en fracciones del video original */
  watermarkBox: z
    .object({
      cx: z.number().min(0).max(1),
      cy: z.number().min(0).max(1),
      ancho: z.number().min(0).max(1),
      alto: z.number().min(0).max(1),
    })
    .nullable(),
});

export type FestivalProps = z.infer<typeof festivalSchema>;

/** La pieza dura lo que dura el clip. Sale a 30 fps, como pidió Cotu. */
export const duracionFestival: CalculateMetadataFunction<FestivalProps> = async ({ props }) => {
  const segundos = await duracionDeFuente(props.clip.src);
  return { fps: 30, durationInFrames: Math.max(1, Math.round(segundos * 30)) };
};

/**
 * Dónde cae el video dentro del cuadro final cuando entra entero y centrado.
 * Es la misma cuenta que hace `object-fit: contain`, pero la necesitamos
 * nosotros para poder ubicar la marca ajena sobre el cuadro final.
 */
const encuadre = (origen: { ancho: number; alto: number }, W: number, H: number) => {
  const escala = Math.min(W / origen.ancho, H / origen.alto);
  const ancho = origen.ancho * escala;
  const alto = origen.alto * escala;
  return { escala, ancho, alto, left: (W - ancho) / 2, top: (H - alto) / 2 };
};

export const FestivalClip: React.FC<FestivalProps> = ({ clip, hook, hookEstilo, mosca, watermarkBox }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const caja = encuadre(clip, width, height);

  // El hook va arriba, siempre debajo de lo que tapa TikTok. Si el video es
  // apaisado y deja una banda grande, se centra en la banda; si llena el cuadro,
  // va a una altura fija cerca del borde.
  const bandaArriba = caja.top;
  const yHook = bandaArriba > 320 ? bandaArriba * hookEstilo.enBanda : hookEstilo.altura * height;

  const opacidadHook =
    hookEstilo.fundido === 0
      ? 1
      : interpolate(frame, [0, hookEstilo.fundido], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // La mosca: o suelta en el tercio de abajo, o sobre una placa opaca que tapa
  // la marca ajena. La placa es necesaria: el logotipo tiene transparencia y,
  // puesto encima a secas, la marca se sigue leyendo entre las letras.
  const tapando = mosca.modo === "tapar" && watermarkBox !== null;
  const placa = tapando
    ? (() => {
        const w = watermarkBox!.ancho * caja.ancho * mosca.holgura;
        // la caja de la marca es un renglón de texto bajo: la placa necesita
        // alto propio para que el logotipo entre con aire
        const h = Math.max(watermarkBox!.alto * caja.alto * 2.6, w * 0.26);
        return {
          w,
          h,
          cx: caja.left + watermarkBox!.cx * caja.ancho,
          cy: caja.top + watermarkBox!.cy * caja.alto,
        };
      })()
    : null;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* el clip entero, centrado, sin recortar ni reencuadrar */}
      <OffthreadVideo
        src={staticFile(clip.src)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />

      {hook !== "" && (
        <div
          style={{
            position: "absolute",
            left: width / 2 - hookEstilo.ancho / 2,
            width: hookEstilo.ancho,
            top: yHook,
            transform: "translateY(-50%)",
            textAlign: "center",
            fontFamily: conEmoji(TIKTOK_SANS),
            fontWeight: hookEstilo.peso,
            fontSize: hookEstilo.tamano,
            lineHeight: 1.22,
            color: "#FFFFFF",
            textShadow: "0 2px 6px rgba(0,0,0,0.75), 0 0 20px rgba(0,0,0,0.45)",
            textWrap: "balance",
            opacity: opacidadHook,
          }}
        >
          {hook}
        </div>
      )}

      {placa !== null ? (
        <div
          style={{
            position: "absolute",
            left: placa.cx - placa.w / 2,
            top: placa.cy - placa.h / 2,
            width: placa.w,
            height: placa.h,
            background: mosca.colorPlaca,
            borderRadius: placa.h * 0.18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: placa.h * 0.18,
            boxSizing: "border-box",
          }}
        >
          <Img src={staticFile(mosca.archivo)} style={{ maxWidth: "100%", maxHeight: "100%" }} />
        </div>
      ) : (
        <Img
          src={staticFile(mosca.archivo)}
          style={{
            position: "absolute",
            left: width / 2 - mosca.anchoTercio / 2,
            top: mosca.alturaTercio * height,
            width: mosca.anchoTercio,
            transform: "translateY(-50%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
