import React from "react";
import { Composition, Still } from "remotion";
import { FontSpecimen, fontSpecimenSchema } from "./shared/FontSpecimen";
import { FranjaBotonesDemo, franjaDemoSchema } from "./shared/FranjaBotonesDemo";
import { franjaOff } from "./shared/FranjaBotones";
import { temaSchema, type Tema } from "./shared/tema";
import { metadataDeFragmento } from "./shared/fpsFuente";
import { ReproductorApp, reproductorAppSchema } from "./templates/reproductor-app/ReproductorApp";
import { ejemplosReproductorApp } from "./templates/reproductor-app/ejemplos";
import { BratPuro, bratPuroSchema, duracionBratPuro } from "./templates/brat-puro/BratPuro";
import { ejemplosBratPuro } from "./templates/brat-puro/ejemplos";
import { BratColor, bratColorSchema, duracionBratColor } from "./templates/brat-color/BratColor";
import { ejemplosBratColor } from "./templates/brat-color/ejemplos";
import { Chat, chatSchema, duracionChat } from "./templates/chat/Chat";
import { FORMATO_CHAT, ejemplosChat } from "./templates/chat/ejemplos";
import { TarjetaLetra, tarjetaLetraSchema } from "./templates/tarjeta-letra/TarjetaLetra";
import { FORMATO_TARJETA, ejemplosTarjetaLetra } from "./templates/tarjeta-letra/ejemplos";
import { ReproductorWidget, duracionWidget, reproductorWidgetSchema } from "./templates/reproductor-widget/ReproductorWidget";
import { FORMATOS_WIDGET, ejemplosReproductorWidget } from "./templates/reproductor-widget/ejemplos";
import { LetraSobreVideo, duracionLetraSobreVideo, letraSobreVideoSchema } from "./templates/letra-sobre-video/LetraSobreVideo";
import { FORMATOS_LETRA_VIDEO, ejemplosLetraSobreVideo } from "./templates/letra-sobre-video/ejemplos";
import { BratMaximal, bratMaximalSchema, duracionBratMaximal } from "./templates/brat-maximal/BratMaximal";
import { FORMATO_BRAT_MAXIMAL, ejemplosBratMaximal } from "./templates/brat-maximal/ejemplos";
import { BratMinimal, bratMinimalSchema, duracionBratMinimal } from "./templates/brat-minimal/BratMinimal";
import { FORMATO_BRAT_MINIMAL, ejemplosBratMinimal } from "./templates/brat-minimal/ejemplos";
import { Carrusel, carruselSchema } from "./templates/carrusel/Carrusel";
import { FORMATO_CARRUSEL, ejemplosCarrusel } from "./templates/carrusel/ejemplos";
import { NotaCelular, notaCelularSchema, duracionNotaCelular } from "./templates/nota-celular/NotaCelular";
import { FORMATO_NOTA, ejemplosNotaCelular } from "./templates/nota-celular/ejemplos";
import { Karaoke, karaokeSchema, duracionKaraoke } from "./templates/karaoke/Karaoke";
import { PanelLetra, panelLetraSchema, duracionPanelLetra } from "./templates/panel-letra/PanelLetra";
import { FORMATOS_PANEL, ejemplosPanelLetra } from "./templates/panel-letra/ejemplos";
import { BloquePalabra, bloquePalabraSchema, duracionBloquePalabra } from "./templates/bloque-palabra/BloquePalabra";
import { FORMATOS_BLOQUE, ejemplosBloquePalabra } from "./templates/bloque-palabra/ejemplos";
import { FORMATOS_KARAOKE, ejemplosKaraoke } from "./templates/karaoke/ejemplos";
import agua from "./datos-prueba/agua/tema.json";
import aQuienLeImporta from "./datos-prueba/a-quien-le-importa/tema.json";

const FPS = 30;

// Los temas de prueba se validan contra el esquema al cargar Studio.
const temas = {
  agua: temaSchema.parse(agua),
  aQuienLeImporta: temaSchema.parse(aQuienLeImporta),
};

/** La duración sale del fragmento y el fps del video del tema (ver shared/fpsFuente). */
const durationFromTema = <P extends { tema: Tema }>({ props }: { props: P }) =>
  metadataDeFragmento(props.tema.fragment.end - props.tema.fragment.start, props.tema.fragment.src);

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
      id="FranjaBotones-9x16"
      component={FranjaBotonesDemo}
      schema={franjaDemoSchema}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1}
      calculateMetadata={durationFromTema}
      defaultProps={{
        tema: temas.agua,
        franjaBotones: { show: true, capture: "safezone/captura-tiktok-iphone.jpg", captureOpacity: 0.5 },
      }}
    />
    <Composition
      id="FranjaBotones-1x1"
      component={FranjaBotonesDemo}
      schema={franjaDemoSchema}
      width={1080}
      height={1080}
      fps={FPS}
      durationInFrames={1}
      calculateMetadata={durationFromTema}
      defaultProps={{ tema: temas.aQuienLeImporta, franjaBotones: { ...franjaOff, show: true } }}
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
    {/* tarjeta-letra sale como imagen */}
    {ejemplosTarjetaLetra.map(({ id, props }) => (
      <Still
        key={id}
        id={id}
        component={TarjetaLetra}
        schema={tarjetaLetraSchema}
        width={FORMATO_TARJETA.ancho}
        height={FORMATO_TARJETA.alto}
        defaultProps={props}
      />
    ))}
    {ejemplosReproductorWidget.map(({ id, formato, props }) => (
      <Composition
        key={id}
        id={id}
        component={ReproductorWidget}
        schema={reproductorWidgetSchema}
        width={FORMATOS_WIDGET[formato].ancho}
        height={FORMATOS_WIDGET[formato].alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionWidget}
        defaultProps={props}
      />
    ))}
    {ejemplosLetraSobreVideo.map(({ id, formato, props }) => (
      <Composition
        key={id}
        id={id}
        component={LetraSobreVideo}
        schema={letraSobreVideoSchema}
        width={FORMATOS_LETRA_VIDEO[formato].ancho}
        height={FORMATOS_LETRA_VIDEO[formato].alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionLetraSobreVideo}
        defaultProps={props}
      />
    ))}
    {ejemplosBratMaximal.map(({ id, props }) => (
      <Composition
        key={id}
        id={id}
        component={BratMaximal}
        schema={bratMaximalSchema}
        width={FORMATO_BRAT_MAXIMAL.ancho}
        height={FORMATO_BRAT_MAXIMAL.alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionBratMaximal}
        defaultProps={props}
      />
    ))}
    {ejemplosBratMinimal.map(({ id, props }) => (
      <Composition
        key={id}
        id={id}
        component={BratMinimal}
        schema={bratMinimalSchema}
        width={FORMATO_BRAT_MINIMAL.ancho}
        height={FORMATO_BRAT_MINIMAL.alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionBratMinimal}
        defaultProps={props}
      />
    ))}
    {/* carrusel: cada slide sale como imagen */}
    {ejemplosCarrusel.map(({ id, props }) => (
      <Still
        key={id}
        id={id}
        component={Carrusel}
        schema={carruselSchema}
        width={FORMATO_CARRUSEL.ancho}
        height={FORMATO_CARRUSEL.alto}
        defaultProps={props}
      />
    ))}
    {ejemplosNotaCelular.map(({ id, props }) => (
      <Composition
        key={id}
        id={id}
        component={NotaCelular}
        schema={notaCelularSchema}
        width={FORMATO_NOTA.ancho}
        height={FORMATO_NOTA.alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionNotaCelular}
        defaultProps={props}
      />
    ))}
    {ejemplosKaraoke.map(({ id, formato, props }) => (
      <Composition
        key={id}
        id={id}
        component={Karaoke}
        schema={karaokeSchema}
        width={FORMATOS_KARAOKE[formato].ancho}
        height={FORMATOS_KARAOKE[formato].alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionKaraoke}
        defaultProps={props}
      />
    ))}
    {ejemplosPanelLetra.map(({ id, formato, props }) => (
      <Composition
        key={id}
        id={id}
        component={PanelLetra}
        schema={panelLetraSchema}
        width={FORMATOS_PANEL[formato].ancho}
        height={FORMATOS_PANEL[formato].alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionPanelLetra}
        defaultProps={props}
      />
    ))}
    {ejemplosBloquePalabra.map(({ id, formato, props }) => (
      <Composition
        key={id}
        id={id}
        component={BloquePalabra}
        schema={bloquePalabraSchema}
        width={FORMATOS_BLOQUE[formato].ancho}
        height={FORMATOS_BLOQUE[formato].alto}
        fps={FPS}
        durationInFrames={1}
        calculateMetadata={duracionBloquePalabra}
        defaultProps={props}
      />
    ))}
  </>
);
