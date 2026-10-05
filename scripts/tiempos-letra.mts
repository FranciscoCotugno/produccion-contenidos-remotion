// Tiempos por palabra para la letra de un tema de prueba.
//
// El TEXTO sale siempre de la letra oficial (letra.txt o letra*.txt, una línea
// por renglón, junto al clip en assets/media/<tema>/). Whisper solo se usa para sacar los
// tiempos: transcribe el fragmento con tiempos por token y esa transcripción
// se alinea palabra por palabra contra la letra oficial. Las palabras que
// Whisper no reconoce toman tiempos interpolados entre sus vecinas.
//
// Uso:
//   npm run tiempos -- <tema> [--desde <texto>] [--hasta <texto>] [--audio <archivo>] [--sin-prompt] [--fresh]
//   npm run tiempos -- instinto-luv
//   npm run tiempos -- instinto-luv --audio .whisper/voz/instinto-luv.wav
//   npm run tiempos -- fmk-si-sale-el-sol-1 --desde "estando cerca" --hasta "malgastar"
//
// --desde y --hasta eligen el tramo de la letra que suena en el fragmento: de
// la primera línea que contiene --desde a la primera siguiente que contiene
// --hasta (sin importar mayúsculas, tildes ni puntuación).
//
// <tema> es la carpeta en datos-prueba/. El audio por defecto es el del clip
// (fragment.src, de fragment.start a fragment.end). Con --audio se usa otro
// archivo que ya sea el fragmento (por ejemplo, la voz separada).
// Escribe `lyrics` en datos-prueba/<tema>/tema.json y un reporte de la
// alineación en .whisper/reportes/<tema>.txt.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { downloadWhisperModel, installWhisperCpp, transcribe } from "@remotion/install-whisper-cpp";

const RAIZ = process.cwd();
const WHISPER = path.join(RAIZ, ".whisper");
/** el instalador necesita su propia carpeta, separada de cache y temporales */
const WHISPER_CPP = path.join(WHISPER, "whisper.cpp");
const WHISPER_VERSION = "1.7.6";
const MODELO = "large-v3-turbo";
const FFMPEG = path.join(RAIZ, "node_modules", "@remotion", "compositor-win32-x64-msvc", "ffmpeg.exe");

/** cola de la última palabra de cada línea si no hay otra línea pegada */
const COLA_LINEA = 0.6;

type Word = { t: number; text: string };
type Line = { end: number; words: Word[] };
type Tiempo = { t: number; fin: number; texto: string };

const redondear = (n: number) => Math.round(n * 100) / 100;

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ]/g, "");

const args = () => {
  const pos: string[] = [];
  const flags: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--fresh" || argv[i] === "--sin-prompt") flags[argv[i].slice(2)] = "si";
    else if (argv[i].startsWith("--")) flags[argv[i].slice(2)] = argv[++i];
    else pos.push(argv[i]);
  }
  if (!pos[0]) {
    console.error("Uso: npm run tiempos -- <tema> [--desde <texto>] [--hasta <texto>] [--audio <archivo>] [--sin-prompt] [--fresh]");
    process.exit(1);
  }
  return {
    tema: pos[0],
    audio: flags.audio,
    desde: flags.desde as string | undefined,
    hasta: flags.hasta as string | undefined,
    prompt: flags["sin-prompt"] !== "si",
    fresh: flags.fresh === "si",
  };
};

/** WAV de 16 kHz mono, lo que pide whisper.cpp */
const extraerAudio = (entrada: string, inicio: number, fin: number | undefined, salida: string) => {
  const corte = fin === undefined ? [] : ["-ss", String(inicio), "-to", String(fin)];
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", ...corte, "-i", entrada, "-vn", "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", salida]);
};

type Transcripcion = Awaited<ReturnType<typeof transcribe<true>>>["transcription"];

const transcribir = async (wav: string, prompt: string | undefined, fresh: boolean): Promise<Transcripcion> => {
  const clave = createHash("sha1")
    .update(readFileSync(wav))
    .update(`${MODELO}|${prompt ?? ""}`)
    .digest("hex")
    .slice(0, 12);
  const cache = path.join(WHISPER, "cache", `${clave}.json`);
  if (!fresh && existsSync(cache)) {
    console.log(`Transcripción en cache (${path.relative(RAIZ, cache)})`);
    return JSON.parse(readFileSync(cache, "utf8"));
  }
  await installWhisperCpp({ to: WHISPER_CPP, version: WHISPER_VERSION });
  // En Windows el instalador deja los binarios en Release/, pero transcribe()
  // los busca en build/bin/.
  const release = path.join(WHISPER_CPP, "Release");
  const bin = path.join(WHISPER_CPP, "build", "bin");
  if (existsSync(release) && !existsSync(path.join(bin, "whisper-cli.exe"))) cpSync(release, bin, { recursive: true });
  await downloadWhisperModel({ model: MODELO, folder: WHISPER_CPP });
  const { transcription } = await transcribe({
    inputPath: wav,
    whisperPath: WHISPER_CPP,
    whisperCppVersion: WHISPER_VERSION,
    model: MODELO,
    modelFolder: WHISPER_CPP,
    language: "es",
    tokenLevelTimestamps: true,
    splitOnWord: true,
    printOutput: false,
    additionalArgs: prompt ? [["--prompt", prompt]] : undefined,
    onProgress: (p) => process.stdout.write(`\rTranscribiendo... ${Math.round(p * 100)}%`),
  });
  process.stdout.write("\n");
  mkdirSync(path.dirname(cache), { recursive: true });
  writeFileSync(cache, JSON.stringify(transcription));
  return transcription;
};

/** Palabras de Whisper con su tiempo (DTW cuando está, si no el del segmento). */
const palabrasWhisper = (tr: Transcripcion, duracion: number): Tiempo[] => {
  const out: Tiempo[] = [];
  for (const item of tr) {
    const texto = item.text.trim();
    if (!texto || /^[\[(♪*]/.test(texto)) continue;
    if (!normalizar(texto)) continue; // puntuación suelta
    const dtw = item.tokens[0]?.t_dtw ?? -1;
    const t = dtw >= 0 ? dtw / 100 : item.offsets.from / 1000;
    if (t >= duracion) continue;
    out.push({ t, fin: Math.min(duracion, Math.max(t, item.offsets.to / 1000)), texto });
  }
  return out;
};

/** parecido entre dos palabras normalizadas, de 0 a 1 */
const parecido = (a: string, b: string) => {
  if (a === b) return 1;
  const m = a.length;
  const n = b.length;
  if (!m || !n) return 0;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[m][n] / Math.max(m, n);
};

/**
 * Alineación global (tipo Needleman-Wunsch) entre la letra oficial y lo que
 * oyó Whisper. Devuelve, para cada palabra oficial, el índice de la palabra
 * de Whisper que le corresponde, o -1.
 */
const alinear = (oficial: string[], oida: string[]) => {
  const SALTO = -0.4;
  const m = oficial.length;
  const n = oida.length;
  const S = Array.from({ length: m + 1 }, () => new Float64Array(n + 1));
  const P = Array.from({ length: m + 1 }, () => new Uint8Array(n + 1)); // 1 diag, 2 arriba, 3 izq
  for (let i = 1; i <= m; i++) (S[i][0] = i * SALTO), (P[i][0] = 2);
  for (let j = 1; j <= n; j++) (S[0][j] = j * SALTO), (P[0][j] = 3);
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const p = parecido(oficial[i - 1], oida[j - 1]);
      const diag = S[i - 1][j - 1] + (p >= 0.5 ? p : p - 1);
      const arriba = S[i - 1][j] + SALTO;
      const izq = S[i][j - 1] + SALTO;
      if (diag >= arriba && diag >= izq) (S[i][j] = diag), (P[i][j] = 1);
      else if (arriba >= izq) (S[i][j] = arriba), (P[i][j] = 2);
      else (S[i][j] = izq), (P[i][j] = 3);
    }
  const par = new Array<number>(m).fill(-1);
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (P[i][j] === 1) {
      if (parecido(oficial[i - 1], oida[j - 1]) >= 0.5) par[i - 1] = j - 1;
      i--, j--;
    } else if (P[i][j] === 2) i--;
    else j--;
  }
  return par;
};

const silabas = (w: string) => Math.max(1, (w.toLowerCase().match(/[aeiouáéíóúü]+/g) ?? []).length);

const main = async () => {
  const { tema, audio, desde, hasta, prompt, fresh } = args();
  const archivoTema = path.join(RAIZ, "datos-prueba", tema, "tema.json");
  const datos = JSON.parse(readFileSync(archivoTema, "utf8"));
  const carpetaMedios = path.join(RAIZ, "assets", path.dirname(datos.fragment.src));
  // letra.txt, o el primer letra*.txt de la carpeta (ej. letra-si-sale-el-sol.txt)
  const archivoLetra = existsSync(path.join(carpetaMedios, "letra.txt"))
    ? "letra.txt"
    : readdirSync(carpetaMedios).find((f) => /^letra.*\.txt$/i.test(f));
  if (!archivoLetra) throw new Error(`No hay letra.txt en ${carpetaMedios}`);
  const todas = readFileSync(path.join(carpetaMedios, archivoLetra), "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  // con --desde/--hasta se toma solo el tramo de la letra que suena en el fragmento
  const contiene = (l: string, buscado: string) => normalizar(l).includes(normalizar(buscado));
  const primera = desde ? todas.findIndex((l) => contiene(l, desde)) : 0;
  const ultima = hasta ? todas.findIndex((l, i) => i >= primera && contiene(l, hasta)) : todas.length - 1;
  if (primera < 0 || ultima < 0) throw new Error(`No encontré "${desde ?? ""}" / "${hasta ?? ""}" en ${archivoLetra}`);
  const letra = todas.slice(primera, ultima + 1);
  const duracion = datos.fragment.end - datos.fragment.start;

  mkdirSync(path.join(WHISPER, "tmp"), { recursive: true });
  const wav = path.join(WHISPER, "tmp", `${tema}.wav`);
  if (audio) extraerAudio(path.resolve(audio), 0, undefined, wav);
  else extraerAudio(path.join(RAIZ, "assets", datos.fragment.src), datos.fragment.start, datos.fragment.end, wav);

  const tr = await transcribir(wav, prompt ? letra.join(" ") : undefined, fresh);
  rmSync(wav, { force: true });
  const oidas = palabrasWhisper(tr, duracion);

  // palabras oficiales, recordando a qué línea pertenecen
  const oficiales = letra.flatMap((l, li) => l.split(/\s+/).map((texto) => ({ texto, li })));
  const par = alinear(
    oficiales.map((w) => normalizar(w.texto)),
    oidas.map((w) => normalizar(w.texto)),
  );

  // tiempos: los alineados directo; los demás, interpolados por sílabas
  // entre la última palabra anclada y la siguiente
  const tiempos: { t: number; fin: number; anclada: boolean }[] = oficiales.map((_, k) =>
    par[k] >= 0 ? { t: oidas[par[k]].t, fin: oidas[par[k]].fin, anclada: true } : { t: NaN, fin: NaN, anclada: false },
  );
  // las anclas tienen que ir en orden; si alguna retrocede, se descarta
  let ultimo = -Infinity;
  for (const x of tiempos) {
    if (!x.anclada) continue;
    if (x.t < ultimo) (x.anclada = false), (x.t = NaN);
    else ultimo = x.t;
  }
  for (let k = 0; k < tiempos.length; k++) {
    if (tiempos[k].anclada) continue;
    let a = k - 1;
    while (a >= 0 && !tiempos[a].anclada) a--;
    let b = k;
    while (b < tiempos.length && !tiempos[b].anclada) b++;
    const desde = a >= 0 ? tiempos[a].fin : 0.1;
    const hasta = b < tiempos.length ? tiempos[b].t : duracion - 0.2;
    const tramo = oficiales.slice(a + 1, b);
    const total = tramo.reduce((s, w) => s + silabas(w.texto), 0);
    let acc = 0;
    for (let q = a + 1; q < b; q++) {
      const t = desde + ((hasta - desde) * acc) / total;
      acc += silabas(oficiales[q].texto);
      tiempos[q] = { t, fin: desde + ((hasta - desde) * acc) / total, anclada: false };
    }
    k = b - 1;
  }

  // líneas oficiales con sus palabras
  const lineas: Line[] = letra.map((_, li) => {
    const ks = oficiales.flatMap((w, k) => (w.li === li ? [k] : []));
    const words = ks.map((k): Word => ({ t: redondear(tiempos[k].t), text: oficiales[k].texto }));
    return { end: 0, words };
  });
  lineas.forEach((l, i) => {
    const ultima = tiempos[oficiales.findLastIndex((w) => w.li === i)];
    const siguiente = lineas[i + 1]?.words[0].t;
    const cola = Math.min(duracion, ultima.fin + COLA_LINEA);
    l.end = redondear(siguiente !== undefined ? Math.min(siguiente, Math.max(cola, ultima.t + 0.3)) : cola);
  });

  datos.lyrics = lineas;
  writeFileSync(archivoTema, JSON.stringify(datos, null, 2) + "\n");

  // reporte para revisar a mano
  const ancladas = tiempos.filter((x) => x.anclada).length;
  const reporte = [
    `Tema: ${tema}  |  audio: ${audio ?? datos.fragment.src}  |  prompt: ${prompt ? "letra oficial" : "no"}`,
    `Palabras oficiales: ${oficiales.length}, ancladas a Whisper: ${ancladas} (${Math.round((ancladas / oficiales.length) * 100)} %)`,
    "",
    "Whisper oyó:",
    oidas.map((w) => `${w.t.toFixed(2)} ${w.texto}`).join("\n"),
    "",
    "Letra con tiempos (* = interpolada):",
    ...lineas.map(
      (l) =>
        `[${l.words[0].t.toFixed(2)} - ${l.end.toFixed(2)}] ` +
        l.words
          .map((w) => {
            const k = oficiales.findIndex((o, idx) => o.texto === w.text && redondear(tiempos[idx].t) === w.t);
            return `${w.text}@${w.t.toFixed(2)}${k >= 0 && !tiempos[k].anclada ? "*" : ""}`;
          })
          .join(" "),
    ),
  ].join("\n");
  mkdirSync(path.join(WHISPER, "reportes"), { recursive: true });
  const archivoReporte = path.join(WHISPER, "reportes", `${tema}.txt`);
  writeFileSync(archivoReporte, reporte + "\n");
  console.log(reporte);
  console.log(`\nEscrito ${path.relative(RAIZ, archivoTema)} y ${path.relative(RAIZ, archivoReporte)}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
