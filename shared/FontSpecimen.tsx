import React from "react";
import { z } from "zod";
import { AbsoluteFill } from "remotion";
import { FONT_LIST } from "./fonts";

// Muestrario de tipografías: sirve para comprobar que cargan todas.

export const fontSpecimenSchema = z.object({ sample: z.string() });

export const FontSpecimen: React.FC<z.infer<typeof fontSpecimenSchema>> = ({ sample }) => (
  <AbsoluteFill style={{ backgroundColor: "#111", color: "white", padding: "180px 90px", gap: 56 }}>
    {FONT_LIST.map(({ name, family }) => (
      <div key={name}>
        <div style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 32, opacity: 0.6 }}>{name}</div>
        <div style={{ fontFamily: family, fontSize: 84, lineHeight: 1.1 }}>{sample}</div>
      </div>
    ))}
  </AbsoluteFill>
);
