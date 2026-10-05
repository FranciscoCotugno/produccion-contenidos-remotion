// Datos de ejemplo del molde: con qué tema, piel y conversación se arma cada
// composición en Studio. Las conversaciones salen de datos-prueba/<tema>/chats.json.

import { safeZoneOff } from "../../shared/SafeZone";
import { temaSchema, type Tema } from "../../shared/tema";
import instintoLuv from "../../datos-prueba/instinto-luv/tema.json";
import chatsInstinto from "../../datos-prueba/instinto-luv/chats.json";
import siSaleElSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/tema.json";
import chatsSol1 from "../../datos-prueba/fmk-si-sale-el-sol-1/chats.json";
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
  safeZone: safeZoneOff,
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

export const ejemplosChat: { id: string; props: ChatProps }[] = [
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
