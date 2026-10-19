// Molde lista-numerada: una pieza que recorre varios temas, numerados, mientras
// el panel del costado se va completando. Ver FICHA.md.
//
// Cubre dos verticales de una: ranking ("top 5 del disco nuevo") y playlist por
// situación ("temas para manejar de noche"). Las siete cuentas relevadas van de
// 76 mil a 574 mil likes.
//
// Va **sin persona a cámara** (pedido de Cotu): el fondo es un clip o un color.
// Cuatro de las siete referencias tienen a alguien hablando y tres no, y las
// tres funcionan igual: lo que sostiene la atención es la lista que se
// completa, no la cara.
//
// Es el único molde que NO trabaja sobre un tema: recibe una lista. Los datos
// viven en datos-prueba/listas/ y el esquema en ./lista.ts (ver el LEEME de esa
// carpeta para por qué no están en shared/).

import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { GEIST, TIKTOK_SANS } from "../../shared/fonts";
import { FranjaBotones, franjaBotonesSchema } from "../../shared/FranjaBotones";
import { VideoEnBucle } from "../../shared/VideoEnBucle";
import { metadataDeFragmento } from "../../shared/fpsFuente";
import { PanelLista, panelListaSchema } from "./PanelLista";
import { duracionLista, listaSchema, tramos } from "./lista";

export const listaNumeradaSchema = z.object({
  lista: listaSchema,

  fondo: z.object({
    /** clip = un video en bucle; color = un color liso */
    tipo: z.enum(["clip", "color"]),
    src: z.string(),
    inicio: z.number().min(0),
    color: zColor(),
    oscurecer: z.number().min(0).max(0.9).step(0.05),
  }),

  /**
   * Del 1 para abajo (directo) o del último al 1 (suspenso). Las referencias
   * hacen las dos cosas; la del fotograma va del 5 al 1.
   */
  orden: z.enum(["del-1", "al-1"]),

  panel: panelListaSchema,

  /** la tarjeta de "sonando ahora" de arriba */
  tarjeta: z.object({
    mostrar: z.boolean(),
    /** alto de la tarjeta en px sobre 1080 de ancho */
    alto: z.number().min(140).max(420).step(4),
    /** distancia al borde de arriba, en px sobre 1080 de ancho */
    arriba: z.number().min(0).max(500).step(4),
    color: z.string(),
    rotulo: z.string(),
  }),

  /** el rótulo de la pieza, arriba de todo */
  mostrarTitulo: z.boolean(),

  franjaBotones: franjaBotonesSchema,
});

export type ListaNumeradaProps = z.infer<typeof listaNumeradaSchema>;

/**
 * La duración es la suma de los recortes de audio de la lista. Los cuadros por
 * segundo salen del clip de fondo; si el fondo es color, van a 30.
 */
export const duracionListaNumerada: CalculateMetadataFunction<ListaNumeradaProps> = async ({ props }) => {
  const segundos = duracionLista(props.lista);
  if (props.fondo.tipo === "clip" && props.fondo.src !== "") {
    return metadataDeFragmento(segundos, props.fondo.src);
  }
  return { fps: 30, durationInFrames: Math.max(1, Math.round(segundos * 30)) };
};

/** La tarjeta de "sonando ahora", con los códigos de una app de música. */
const Tarjeta: React.FC<{
  titulo: string;
  artistas: string;
  cover: string;
  config: ListaNumeradaProps["tarjeta"];
  escala: number;
  width: number;
  opacidad: number;
}> = ({ titulo, artistas, cover, config, escala, width, opacidad }) => {
  const px = (v: number) => v * escala;
  const alto = px(config.alto);
  const pad = alto * 0.11;
  const lado = alto - pad * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: px(70),
        width: width - px(140),
        top: px(config.arriba),
        height: alto,
        borderRadius: alto * 0.16,
        background: config.color,
        backdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        gap: pad,
        padding: pad,
        boxSizing: "border-box",
        fontFamily: GEIST,
        color: "white",
        opacity: opacidad,
        overflow: "hidden",
      }}
    >
      {cover === "" ? (
        <div
          style={{
            width: lado,
            height: lado,
            borderRadius: lado * 0.09,
            background: "rgba(255,255,255,0.15)",
            flexShrink: 0,
          }}
        />
      ) : (
        <Img
          src={staticFile(cover)}
          style={{ width: lado, height: lado, borderRadius: lado * 0.09, objectFit: "cover", flexShrink: 0 }}
        />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: alto * 0.1,
            fontWeight: 600,
            letterSpacing: "0.09em",
            opacity: 0.72,
            textTransform: "uppercase",
          }}
        >
          {config.rotulo}
        </div>
        <div
          style={{
            fontSize: alto * 0.185,
            fontWeight: 700,
            lineHeight: 1.18,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {titulo}
        </div>
        <div
          style={{
            fontSize: alto * 0.15,
            fontWeight: 400,
            opacity: 0.68,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {artistas}
        </div>
      </div>
    </div>
  );
};

export const ListaNumerada: React.FC<ListaNumeradaProps> = ({
  lista,
  fondo,
  orden,
  panel,
  tarjeta,
  mostrarTitulo,
  franjaBotones,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const escala = width / 1080;
  // La tarjeta y el rótulo son interfaz: si crecieran con el ancho, en 4:3
  // (1440×1080) la tarjeta se come la lista. Se topan en 1. Los números del
  // panel sí escalan con el ancho, que es lo que mantiene la legibilidad en el
  // celular (mismo criterio que panel-letra).
  const escalaInterfaz = Math.min(escala, 1);
  const t = frame / fps;

  // El orden del panel es el del ranking; el del audio puede ir al revés. Con
  // "al-1" suena primero el último número y el 1 queda para el final. Los
  // tramos se miden sobre el orden en que suena, porque cada ítem tiene su
  // propio recorte y no todos duran lo mismo.
  const indiceDe = (paso: number) => (orden === "del-1" ? paso : lista.items.length - 1 - paso);
  const pasoDe = (i: number) => (orden === "del-1" ? i : lista.items.length - 1 - i);
  const enOrden = lista.items.map((_, paso) => lista.items[indiceDe(paso)]);
  const partes = tramos(enOrden);

  // en qué paso de la pieza estamos
  const k = Math.max(0, partes.filter((p) => t >= p.desde).length - 1);
  const sonando = indiceDe(k);

  const revelado = lista.items.map((_, i) => pasoDe(i) <= k);
  const edad = lista.items.map((_, i) => (pasoDe(i) <= k ? (t - partes[pasoDe(i)].desde) * fps : 0));

  const item = lista.items[sonando];
  // la tarjeta cambia con el ítem, con una entrada corta
  const entradaTarjeta = interpolate((t - partes[k].desde) * fps, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: fondo.color }}>
      {fondo.tipo === "clip" && fondo.src !== "" && (
        <VideoEnBucle
          src={fondo.src}
          inicio={fondo.inicio}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {fondo.oscurecer > 0 && <AbsoluteFill style={{ background: `rgba(0,0,0,${fondo.oscurecer})` }} />}

      {mostrarTitulo && lista.titulo !== "" && (
        <div
          style={{
            position: "absolute",
            left: 0,
            width,
            top: escalaInterfaz * 60,
            textAlign: "center",
            fontFamily: TIKTOK_SANS,
            fontWeight: 800,
            fontSize: escalaInterfaz * 52,
            letterSpacing: "0.02em",
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          {lista.titulo}
        </div>
      )}

      {tarjeta.mostrar && (
        <Tarjeta
          titulo={item.title}
          artistas={item.artists}
          cover={item.cover}
          config={tarjeta}
          escala={escalaInterfaz}
          width={width}
          opacidad={entradaTarjeta}
        />
      )}

      <PanelLista
        config={panel}
        nombres={lista.items.map((it) => it.title)}
        revelado={revelado}
        edad={edad}
        familia={TIKTOK_SANS}
        escala={escala}
        width={width}
        height={height}
      />

      {/* un recorte de audio por ítem, uno atrás del otro */}
      {lista.items.map((_, paso) => {
        const i = indiceDe(paso);
        const p = partes[paso];
        return (
          <Sequence
            key={paso}
            from={Math.round(p.desde * fps)}
            durationInFrames={Math.max(1, Math.round(p.dura * fps))}
            layout="none"
          >
            <Html5Audio
              src={staticFile(lista.items[i].audio.src)}
              trimBefore={Math.round(lista.items[i].audio.start * fps)}
            />
          </Sequence>
        );
      })}

      <FranjaBotones config={franjaBotones} />
    </AbsoluteFill>
  );
};
