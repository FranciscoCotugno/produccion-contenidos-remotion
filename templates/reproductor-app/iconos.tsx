// Íconos del reproductor, dibujados a mano: siguen los códigos visuales de
// las apps de música (anterior, pausa, siguiente, volumen) sin copiar logos.

import React from "react";

export const Iconos = {
  anterior: (color: string) => (
    <svg width="76" height="44" viewBox="0 0 76 44">
      <path d="M36 2 L2 22 L36 42 Z M74 2 L40 22 L74 42 Z" fill={color} stroke={color} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  ),
  siguiente: (color: string) => (
    <svg width="76" height="44" viewBox="0 0 76 44">
      <path d="M2 2 L36 22 L2 42 Z M40 2 L74 22 L40 42 Z" fill={color} stroke={color} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  ),
  pausa: (color: string) => (
    <svg width="62" height="70" viewBox="0 0 62 70">
      <rect x="6" y="3" width="17" height="64" rx="4" fill={color} />
      <rect x="39" y="3" width="17" height="64" rx="4" fill={color} />
    </svg>
  ),
  volumenBajo: (color: string) => (
    <svg width="22" height="26" viewBox="0 0 22 26">
      <path d="M2 9 H8 L16 2 V24 L8 17 H2 Z" fill={color} />
    </svg>
  ),
  volumenAlto: (color: string) => (
    <svg width="44" height="30" viewBox="0 0 44 30">
      <path d="M2 10 H8 L16 3 V27 L8 20 H2 Z" fill={color} />
      <path
        d="M22 9 Q26 15 22 21 M28 5 Q34 15 28 25 M34 1 Q42 15 34 29"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
  /** botón "más" junto al título: tres puntos en un círculo */
  mas: (fondo: string, color: string) => (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="26" fill={fondo} />
      <circle cx="16" cy="26" r="3.6" fill={color} />
      <circle cx="26" cy="26" r="3.6" fill={color} />
      <circle cx="36" cy="26" r="3.6" fill={color} />
    </svg>
  ),
  /** fila de abajo: letra (globo de diálogo) */
  letra: (color: string) => (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <path
        d="M6 6 H34 Q37 6 37 9 V26 Q37 29 34 29 H18 L10 36 V29 H6 Q3 29 3 26 V9 Q3 6 6 6 Z"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M12 14 Q12 12 14 12 H16 V18 Q16 21 13 22 M23 14 Q23 12 25 12 H27 V18 Q27 21 24 22" stroke={color} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  ),
  /** fila de abajo: salida de audio (parlante genérico) */
  salida: (color: string) => (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="9" y="3" width="22" height="34" rx="5" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="20" cy="24" r="6" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="20" cy="11" r="2.2" fill={color} />
    </svg>
  ),
  /** fila de abajo: cola de reproducción */
  cola: (color: string) => (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <path d="M13 9 H36 M13 20 H36 M13 31 H36" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="5" cy="9" r="2.4" fill={color} />
      <circle cx="5" cy="20" r="2.4" fill={color} />
      <circle cx="5" cy="31" r="2.4" fill={color} />
    </svg>
  ),
};
