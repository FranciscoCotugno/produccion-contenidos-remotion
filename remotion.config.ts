import { Config } from "@remotion/cli/config";

Config.setEntryPoint("./index.ts");
// staticFile() sirve desde assets/: tipografías, texturas y medios de prueba (assets/media/)
Config.setPublicDir("./assets");
Config.setVideoImageFormat("jpeg");
