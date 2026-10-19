// Datos de ejemplo del molde: las dos listas de prueba, los formatos y las
// comparaciones para decidir en Studio.
//
// OJO con los rótulos ("TOP 4 DEL MES", "4 TEMAS PARA MANEJAR DE NOCHE"): son
// **de relleno**. El texto de una pieza lo escribe una persona, no sale de los
// datos del tema; acá están sólo para que el molde tenga algo que mostrar.

import { franjaOff } from "../../shared/FranjaBotones";
import topDelMes from "../../datos-prueba/listas/top-4-del-mes.json";
import manejarDeNoche from "../../datos-prueba/listas/para-manejar-de-noche.json";
import { listaSchema, type Lista } from "./lista";
import type { ListaNumeradaProps } from "./ListaNumerada";

export const FORMATOS_LISTA = {
  "9x16": { ancho: 1080, alto: 1920 },
  "4x3": { ancho: 1440, alto: 1080 },
  "1x1": { ancho: 1080, alto: 1080 },
} as const;
export type FormatoLista = keyof typeof FORMATOS_LISTA;

const lista = (datos: unknown): Lista => listaSchema.parse(datos);
const top = lista(topDelMes);
const noche = lista(manejarDeNoche);

/** Clip de fondo del banco de nicho; dura 25 s y se repite si hace falta. */
const CLIP_NOCHE = "media/bancos/nicho-driving-night/nicho-driving-night-001.mp4";

const AMARILLO = "#FFE34D";

const BASE: Omit<ListaNumeradaProps, "lista"> = {
  fondo: { tipo: "clip", src: CLIP_NOCHE, inicio: 0, color: "#101014", oscurecer: 0.42 },
  // la referencia del fotograma revela del último al 1: el 1 queda para el final
  orden: "al-1",
  panel: {
    lado: "izquierda",
    margen: 92,
    // el rango va hasta 0,72 y no más abajo: con 4 ítems repartidos hasta 0,82
    // el último caía donde TikTok pone el epígrafe y no se leía
    desde: 0.45,
    hasta: 0.72,
    tamanoNumero: 76,
    tamanoNombre: 60,
    peso: 800,
    color: AMARILLO,
    contorno: "rgba(0,0,0,0.9)",
    grosorContorno: 5,
    opacidadPendiente: 0.85,
    entrada: 7,
  },
  tarjeta: {
    mostrar: true,
    alto: 230,
    arriba: 150,
    color: "rgba(28,26,32,0.78)",
    rotulo: "sonando ahora",
  },
  mostrarTitulo: true,
  franjaBotones: franjaOff,
};

/** La columna repartida para los cuadros bajos. */
const PANEL_BAJO = { ...BASE.panel, desde: 0.46, hasta: 0.9, tamanoNumero: 64, tamanoNombre: 50 };
const PANEL_CUADRADO = { ...BASE.panel, desde: 0.42, hasta: 0.86, tamanoNumero: 68, tamanoNombre: 54 };

type Ejemplo = { id: string; formato: FormatoLista; props: ListaNumeradaProps };

const base: Ejemplo[] = [
  { id: "ListaNumerada-TopDelMes-9x16", formato: "9x16", props: { ...BASE, lista: top } },
  // segunda lista, sin tocar código
  { id: "ListaNumerada-Noche-9x16", formato: "9x16", props: { ...BASE, lista: noche } },
  // en los formatos bajos la columna necesita más recorrido: el cuadro es más
  // corto y los números, que escalan con el ancho, son más grandes
  { id: "ListaNumerada-TopDelMes-4x3", formato: "4x3", props: { ...BASE, lista: top, panel: PANEL_BAJO } },
  { id: "ListaNumerada-TopDelMes-1x1", formato: "1x1", props: { ...BASE, lista: top, panel: PANEL_CUADRADO } },
  // fondo de color liso en vez de clip
  {
    id: "ListaNumerada-FondoColor-9x16",
    formato: "9x16",
    props: { ...BASE, lista: top, fondo: { tipo: "color", src: "", inicio: 0, color: "#13112A", oscurecer: 0 } },
  },
];

const comparar: Ejemplo[] = [
  // 1. orden de revelación
  { id: "Comparar-Orden-Al1", formato: "9x16", props: { ...BASE, lista: top } },
  { id: "Comparar-Orden-Del1", formato: "9x16", props: { ...BASE, lista: top, orden: "del-1" } },

  // 2. con tarjeta de "sonando ahora" y sin ella
  { id: "Comparar-Tarjeta-Con", formato: "9x16", props: { ...BASE, lista: top } },
  {
    id: "Comparar-Tarjeta-Sin",
    formato: "9x16",
    props: { ...BASE, lista: top, tarjeta: { ...BASE.tarjeta, mostrar: false }, panel: { ...BASE.panel, desde: 0.32, hasta: 0.70 } },
  },

  // 3. de qué lado va el panel
  { id: "Comparar-Panel-Izquierda", formato: "9x16", props: { ...BASE, lista: top } },
  { id: "Comparar-Panel-Derecha", formato: "9x16", props: { ...BASE, lista: top, panel: { ...BASE.panel, lado: "derecha" } } },

  // 4. el contorno del panel: lo que lo despega del clip
  {
    id: "Comparar-Contorno-Sin",
    formato: "9x16",
    props: { ...BASE, lista: top, panel: { ...BASE.panel, grosorContorno: 0 } },
  },
  { id: "Comparar-Contorno-Con", formato: "9x16", props: { ...BASE, lista: top } },

  // 5. color del panel
  {
    id: "Comparar-Color-Blanco",
    formato: "9x16",
    props: { ...BASE, lista: top, panel: { ...BASE.panel, color: "#FFFFFF" } },
  },
  { id: "Comparar-Color-Amarillo", formato: "9x16", props: { ...BASE, lista: top } },
];

export const ejemplosListaNumerada: Ejemplo[] = [...base, ...comparar];
