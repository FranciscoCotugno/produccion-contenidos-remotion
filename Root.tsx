import React from "react";
import { Composition } from "remotion";
import { FontSpecimen, fontSpecimenSchema } from "./shared/FontSpecimen";
import { SafeZoneDemo, safeZoneDemoSchema } from "./shared/SafeZoneDemo";
import { safeZoneOff } from "./shared/SafeZone";
import { temaSchema, type Tema } from "./shared/tema";
import { ReproductorApp, reproductorAppSchema } from "./templates/reproductor-app/ReproductorApp";
import { ejemplosReproductorApp } from "./templates/reproductor-app/ejemplos";
import { BratPuro, bratPuroSchema, duracionBratPuro } from "./templates/brat-puro/BratPuro";
import { ejemplosBratPuro } from "./templates/brat-puro/ejemplos";
import { BratColor, bratColorSchema, duracionBratColor } from "./templates/brat-color/BratColor";
import { ejemplosBratColor } from "./templates/brat-color/ejemplos";
import { Chat, chatSchema, duracionChat } from "./templates/chat/Chat";
import { FORMATO_CHAT, ejemplosChat } from "./templates/chat/ejemplos";
import agua from "./datos-prueba/agua/tema.json";
import aQuienLeImporta from "./datos-prueba/a-quien-le-importa/tema.json";

const FPS = 30;

// Los temas de prueba se validan contra el esquema al cargar Studio.
const temas = {
  agua: temaSchema.parse(agua),
  aQuienLeImporta: temaSchema.parse(aQuienLeImporta),
};

/** La duración sale del fragmento: fin menos inicio. */
const durationFromTema = <P extends { tema: Tema }>({ props }: { props: P }) => ({
  durationInFrames: Math.max(1, Math.round((props.tema.fragment.end - props.tema.fragment.start) * FPS)),
});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Fonts"
      component={FontSpecimen}
      schema={fontSpecimenSchema}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{ sample: "se hace agua la boca" }}
    />
    <Composition
      id="SafeZone-9x16"
      component={SafeZoneDemo}
      schema={safeZoneDemoSchema}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1}
      calculateMetadata={durationFromTema}
      defaultProps={{
        tema: temas.agua,
        safeZone: { show: true, capture: "safezone/captura-tiktok-iphone.jpg", captureOpacity: 0.5 },
      }}
    />
    <Composition
      id="SafeZone-1x1"
      component={SafeZoneDemo}
      schema={safeZoneDemoSchema}
      width={1080}
      height={1080}
      fps={FPS}
      durationInFrames={1}
      calculateMetadata={durationFromTema}
      defaultProps={{ tema: temas.aQuienLeImporta, safeZone: { ...safeZoneOff, show: true } }}
    />
    {ejemplosReproductorApp.map(({ id, props }) => (
      <Composition
        key={id}
        id={id}
        component={ReproductorApp}
        schema={reproductorAppSchema}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={durationFromTema}
        defaultProps={props}
      />
    ))}
    {ejemplosBratPuro.map(({ id, props }) => (
      <Composition
        key={id}
        id={id}
        component={BratPuro}
        schema={bratPuroSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionBratPuro}
        defaultProps={props}
      />
    ))}
    {ejemplosBratColor.map(({ id, props }) => (
      <Composition
        key={id}
        id={id}
        component={BratColor}
        schema={bratColorSchema}
        width={1080}
        height={1080}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionBratColor}
        defaultProps={props}
      />
    ))}
    {ejemplosChat.map(({ id, props }) => (
      <Composition
        key={id}
        id={id}
        component={Chat}
        schema={chatSchema}
        width={FORMATO_CHAT[props.piel].ancho}
        height={FORMATO_CHAT[props.piel].alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionChat}
        defaultProps={props}
      />
    ))}
  </>
);
