// El panel de lista numerada: los números puestos desde el primer cuadro y los
// nombres que se completan de a uno. Es lo que sostiene la atención del
// formato: el que mira se queda para ver qué cae en el número 1.
//
// Está en su propio archivo, separado del molde, porque el mismo panel aparece
// en otro formato relevado (la columna de verificación de
// assets/referencias/14-motivo/). Hoy lo usa un solo molde, así que NO se
// mueve a shared/: la estructura común la decide Agustín (regla 7 del
// CLAUDE.md). Si aparece el segundo usuario, es un archivo que se cambia de
// lugar, no un refactor.

import React from "react";
import { z } from "zod";
import { interpolate } from "remotion";

export const panelListaSchema = z.object({
  lado: z.enum(["izquierda", "derecha"]),
  /** margen contra el borde, en px sobre un cuadro de 1080 de ancho */
  margen: z.number().min(0).max(300).step(2),
  /** dónde empieza y dónde termina la columna, como fracción del alto */
  desde: z.number().min(0).max(1).step(0.01),
  hasta: z.number().min(0).max(1).step(0.01),
  /** tamaño del número y del nombre, en px sobre 1080 de ancho */
  tamanoNumero: z.number().min(30).max(140).step(2),
  tamanoNombre: z.number().min(24).max(120).step(2),
  peso: z.number().min(500).max(900).step(100),
  color: z.string(),
  /** color del contorno que despega el texto del fondo */
  contorno: z.string(),
  /** grosor del contorno, en px sobre 1080 de ancho */
  grosorContorno: z.number().min(0).max(14).step(1),
  /** opacidad del número que todavía no sonó */
  opacidadPendiente: z.number().min(0.1).max(1).step(0.05),
  /** cuadros que tarda el nombre en entrar */
  entrada: z.number().int().min(1).max(20),
});

export type PanelListaProps = z.infer<typeof panelListaSchema>;

/** Sombra que hace de contorno: ocho direcciones, como el texto de TikTok. */
const contornoDe = (color: string, grosor: number) =>
  grosor <= 0
    ? undefined
    : [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [0.7, 0.7],
        [-0.7, 0.7],
        [0.7, -0.7],
        [-0.7, -0.7],
      ]
        .map(([x, y]) => `${(x * grosor).toFixed(1)}px ${(y * grosor).toFixed(1)}px 0 ${color}`)
        .join(", ");

export const PanelLista: React.FC<{
  config: PanelListaProps;
  /** nombres en el orden del ranking (el 0 es el número 1) */
  nombres: string[];
  /** qué ítems ya se revelaron, y hace cuántos cuadros el último */
  revelado: boolean[];
  edad: number[];
  familia: string;
  escala: number;
  width: number;
  height: number;
}> = ({ config, nombres, revelado, edad, familia, escala, width, height }) => {
  const px = (v: number) => v * escala;
  const arriba = config.desde * height;
  const alto = Math.max(0, (config.hasta - config.desde) * height);
  const paso = nombres.length > 1 ? alto / (nombres.length - 1) : 0;
  const izquierda = config.lado === "izquierda";
  const sombra = contornoDe(config.contorno, px(config.grosorContorno));

  return (
    <>
      {nombres.map((nombre, i) => {
        const entro = revelado[i];
        const avance = entro ? Math.min(1, edad[i] / config.entrada) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              [izquierda ? "left" : "right"]: px(config.margen),
              top: arriba + paso * i,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "baseline",
              gap: px(14),
              flexDirection: izquierda ? "row" : "row-reverse",
              fontFamily: familia,
              fontWeight: config.peso,
              color: config.color,
              textShadow: sombra,
              whiteSpace: "nowrap",
              maxWidth: width - px(config.margen) * 2,
            }}
          >
            <span
              style={{
                fontSize: px(config.tamanoNumero),
                opacity: entro ? 1 : config.opacidadPendiente,
              }}
            >
              {i + 1}.
            </span>
            {entro && (
              <span
                style={{
                  fontSize: px(config.tamanoNombre),
                  opacity: avance,
                  transform: `translateX(${interpolate(avance, [0, 1], [izquierda ? -px(18) : px(18), 0])}px)`,
                  display: "inline-block",
                }}
              >
                {nombre}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
};
