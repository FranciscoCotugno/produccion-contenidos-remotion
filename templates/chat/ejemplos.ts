// Datos de ejemplo del molde: con qué tema, piel y conversación se arma cada
// composición en Studio. Las conversaciones salen de datos-prueba/<tema>/chats.json.

import { franjaOff } from "../../shared/FranjaBotones";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import chatsInstinto from "../../datos-prueba/instinto-luv/chats.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import chatsSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/chats.json";
import maxi1 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-1/tema.json";
import maxi2 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-2/tema.json";
import maxi3 from "../../datos-prueba/maxi-espindola-hagamos-que-pase-3/tema.json";
import chatsMaxi from "../../datos-prueba/maxi-espindola-hagamos-que-pase/chats.json";
import { mensajeSchema, type ChatProps } from "./Chat";

const base: Omit<ChatProps, "tema" | "mensajes" | "n" | "cabecera"> = {
  piel: "whatsapp-oscuro",
  hora: "6:21 p. m.",
  // formato horizontal como la referencia (1080 × 912): el ancho del cuadro es el
  // ancho del iPhone, 2,77 px por punto (texto de 47 px). 2,94 = texto de 50 px.
  escala: 2.77,
  iconoAudio: "nota",
  letraEnVideo: true,
  // como una captura: solo se mueve el video
  animacion: "fija",
  // mis mensajes (verdes) a la izquierda y las respuestas a la derecha (pedido de Cotu)
  ladoMio: "izquierda",
  // los mensajes pegados a los bordes del cuadro, como en la app (pedido de Cotu)
  ancho: "cuadro",
  // la barra para escribir de la app: así parece la captura de un chat real
  barraEscribir: true,
  palabrasEnVideo: 3,
  adelantoLectura: 3,
  franjaBotones: franjaOff,
};

type Conversacion = { contacto: string; n?: number; mensajes: unknown[] };

const armar = (tema: Tema, c: Conversacion): ChatProps => ({
  ...base,
  tema,
  mensajes: c.mensajes.map((m) => mensajeSchema.parse(m)),
  n: c.n ?? 0,
  cabecera: { mostrar: false, nombre: c.contacto, estado: "en línea" },
});

const temas = [
  { id: "InstintoLuv", tema: temaSchema.parse(instintoLuv), chats: chatsInstinto as unknown as Record<string, Conversacion> },
  { id: "SiSaleElSol-1", tema: temaSchema.parse(siSaleElSol1), chats: chatsSol1 as unknown as Record<string, Conversacion> },
];

// C3: mis mensajes a la izquierda. R1: todos los mensajes son del otro y van a
// la izquierda, como en la referencia (lado de la app: el mío a la derecha).
const modos = [
  { id: "C3-Respuesta", chat: "c3-respuesta", ladoMio: "izquierda" },
  { id: "C3-Visto", chat: "c3-visto", ladoMio: "izquierda" },
  { id: "R1-Contador", chat: "r1-contador", ladoMio: "derecha" },
  { id: "R1-Racha", chat: "r1-racha", ladoMio: "derecha" },
] as const;

const r1Racha: ChatProps = { ...armar(temas[0].tema, temas[0].chats["r1-racha"]), ladoMio: "derecha" };

/** R3: mensaje directo tipo Instagram, vertical (el reel es una tarjeta alta). Mis mensajes a la izquierda, como en C3. */
const r3 = (tema: Tema, c: Conversacion): ChatProps => ({
  ...armar(tema, c),
  piel: "instagram-claro",
  cabecera: { mostrar: true, nombre: c.contacto, estado: "Activo(a) ahora" },
});
const modosR3 = [
  { id: "R3-Compartido", chat: "r3-compartido" },
  { id: "R3-SoloReel", chat: "r3-solo-reel" },
] as const;

/** Formato de cada piel: WhatsApp horizontal como las referencias; Instagram vertical. */
export const FORMATO_CHAT = {
  "whatsapp-oscuro": { ancho: 1080, alto: 912 },
  "instagram-claro": { ancho: 1080, alto: 1920 },
} as const;

// Campana Maxi Espindola, tanda 1. Los tiempos de chats.json estan calzados a un
// fragmento de 16,14 s (F2): se reescalan a la duracion de cada fragmento para que
// la respuesta siga cayendo al 60 % y no se vaya del final.
const REF_CHAT = 16.14;
const chatsM = chatsMaxi as unknown as Record<string, Conversacion>;
const escalar = (c: Conversacion, dur: number): Conversacion => ({
  ...c,
  mensajes: c.mensajes.map((m) => {
    const msg = m as Record<string, unknown>;
    const t = typeof msg.t === "number" ? msg.t : 0;
    return { ...msg, t: Math.round((t * dur * 100) / REF_CHAT) / 100 };
  }),
});
const piezaMaxi = (id: string, datos: unknown, clave: string, molde: "c3" | "r1" | "r3"): { id: string; props: ChatProps } => {
  const tema = temaSchema.parse(datos);
  const conv = escalar(chatsM[clave], tema.fragment.end - tema.fragment.start);
  if (molde === "r3") return { id, props: r3(tema, conv) };
  return { id, props: { ...armar(tema, conv), ladoMio: molde === "r1" ? "derecha" : "izquierda" } };
};
const maxiChat: { id: string; props: ChatProps }[] = [
  piezaMaxi("Maxi-C3-F1", maxi1, "c3-respuesta", "c3"),
  piezaMaxi("Maxi-C3-F2", maxi2, "c3-respuesta-variante", "c3"),
  piezaMaxi("Maxi-C3-F3", maxi3, "c3-visto", "c3"),
  piezaMaxi("Maxi-R1-F1", maxi1, "r1-contador", "r1"),
  piezaMaxi("Maxi-R1-F2", maxi2, "r1-racha", "r1"),
  piezaMaxi("Maxi-R3-F1", maxi1, "r3-compartido", "r3"),
  piezaMaxi("Maxi-R3-F3", maxi3, "r3-solo-reel", "r3"),
];

export const ejemplosChat: { id: string; props: ChatProps }[] = [
  ...maxiChat,
  ...temas.flatMap(({ id, tema, chats }) => modos.map((modo) => ({ id: `Chat-${modo.id}-${id}`, props: { ...armar(tema, chats[modo.chat]), ladoMio: modo.ladoMio } }))),
  ...temas.flatMap(({ id, tema, chats }) => modosR3.map((modo) => ({ id: `Chat-${modo.id}-${id}`, props: r3(tema, chats[modo.chat]) }))),
  // Comparaciones para decidir en Studio
  { id: "Comparar-Chat-Escala-Fiel", props: { ...r1Racha } },
  { id: "Comparar-Chat-Escala-50px", props: { ...r1Racha, escala: 2.94 } },
  {
    id: "Comparar-Chat-AnchoZonaSegura",
    props: { ...armar(temas[0].tema, temas[0].chats["c3-respuesta"]), ancho: "zonaSegura" },
  },
  { id: "Comparar-Chat-EnVivo", props: { ...armar(temas[0].tema, temas[0].chats["c3-respuesta"]), animacion: "en-vivo" } },
  {
    id: "Comparar-Chat-ConCabecera",
    props: (() => {
      const p = armar(temas[0].tema, temas[0].chats["c3-respuesta"]);
      return { ...p, cabecera: { ...p.cabecera, mostrar: true } };
    })(),
  },
];
