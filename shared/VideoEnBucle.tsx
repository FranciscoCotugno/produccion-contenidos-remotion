// Un video de fondo que se repite hasta llenar la pieza.
//
// Por qué existe: `OffthreadVideo` no acepta `loop` en Remotion 4.0.529, y hay
// material que dura menos que el fragmento (los loops de la campaña de Maluma
// duran 5 y 8 segundos para piezas de 11). La duración del archivo se lee del
// archivo mismo, así que no hay que cargarla a mano ni pre-procesar nada.
//
// Si el video es más largo que la pieza, el bucle nunca llega a dar la vuelta:
// se puede usar siempre, sin preguntar cuál es cuál.

import React, { useEffect, useState } from "react";
import { Loop, OffthreadVideo, cancelRender, continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import { duracionDeFuente } from "./fpsFuente";

export const VideoEnBucle: React.FC<{
  src: string;
  /** segundo del video donde arranca cada vuelta */
  inicio: number;
  style?: React.CSSProperties;
}> = ({ src, inicio, style }) => {
  const { fps } = useVideoConfig();
  const [cuadros, setCuadros] = useState<number | null>(null);
  const [handle] = useState(() => delayRender(`duración de ${src}`));

  useEffect(() => {
    duracionDeFuente(src).then((segundos) => {
      // una vuelta va del inicio al final del archivo
      setCuadros(Math.max(1, Math.round((segundos - inicio) * fps)));
      continueRender(handle);
    }, (err) => cancelRender(err));
  }, [src, inicio, fps, handle]);

  if (cuadros === null) return null;
  return (
    <Loop durationInFrames={cuadros}>
      <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(inicio * fps)} muted style={style} />
    </Loop>
  );
};
