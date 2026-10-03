import React from "react";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { FontSpecimen, fontSpecimenSchema } from "./shared/FontSpecimen";
import { SafeZoneDemo, safeZoneDemoSchema } from "./shared/SafeZoneDemo";
import type { z } from "zod";
import { safeZoneOff } from "./shared/SafeZone";
import { temaSchema } from "./shared/tema";
import agua from "./datos-prueba/agua/tema.json";
import aQuienLeImporta from "./datos-prueba/a-quien-le-importa/tema.json";

const FPS = 30;

// Los temas de prueba se validan contra el esquema al cargar Studio.
const temas = {
  agua: temaSchema.parse(agua),
  aQuienLeImporta: temaSchema.parse(aQuienLeImporta),
};

/** La duración sale del fragmento: fin menos inicio. */
const durationFromTema: CalculateMetadataFunction<z.infer<typeof safeZoneDemoSchema>> = ({ props }) => ({
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
      defaultProps={{ tema: temas.agua, safeZone: { ...safeZoneOff, show: true } }}
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
  </>
);
