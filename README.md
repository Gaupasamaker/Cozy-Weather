# Cozy Weather

Cozy Weather es una app del tiempo con estilo suave/kawaii, datos de Open-Meteo y planes locales generados de forma local. No usa IA, no usa cuentas y no incluye claves API en el frontend.

## Que hace

- Muestra el clima actual, sensación térmica, viento, pronóstico por horas y próximos días.
- Sugiere mensajes y planes cozy en español e inglés sin usar IA.
- Abre búsquedas contextuales en Google Maps, sin consumir APIs de Google Maps.
- Guarda favoritos y el último clima correcto en el dispositivo.
- Funciona como web app y como app Android con Capacitor.

## Sistema visual: Cozy Storybook Weather

La interfaz usa una dirección visual tipo cuento ilustrado: fondos crema/cielo suave, tarjetas de papel, sombras cálidas y tipografía redondeada. La pantalla principal está pensada como una pequeña escena meteorológica, no como un dashboard técnico.

El sistema de compañeros vive en `components/StorybookCompanion.tsx` y usa una capa semántica pensada para que más adelante se puedan añadir otros animales seleccionables. Ahora todos los estados apuntan a osos PNG porque son los animales disponibles.

Mapeo actual:

- Sunny / clear: Sunny Bear
- Rain: Rainy Bear
- Cloudy / cool: Cloudy Bear
- Wind: Windy Bear
- Storm: Stormy Bear
- Night: Sleepy Bear

El concepto generado con ImageGen se conserva como referencia en `docs/design/cozy-storybook-weather-concept.png`.

### Assets cozy

La libreria de PNG finales vive en `public/assets/cozy/` y se consume desde `lib/cozyAssets.ts`. El registro da nombres semanticos a los archivos sin renombrarlos:

- `animales/osos`: mascota principal por estado de clima.
- `meteo`: ilustraciones meteorologicas para clima actual, horas y dias.
- `ropa`: recomendaciones visuales de outfit.
- `iconos`: objetos cozy para planes y tarjetas.
- `decoracion`: acentos pequenos de fondo y mensaje.

Ahora todos los estados usan osos porque son los animales disponibles. La capa semantica conserva la idea de `CompanionFamily`, de modo que mas adelante se puedan anadir otros animales seleccionables sin rehacer la pantalla principal.

## Privacidad

- La ubicación es opcional y solo se usa para consultar el clima local.
- Si deniegas ubicación, puedes buscar cualquier ciudad manualmente.
- No hay cuentas, analítica propia ni APIs de IA.
- Los favoritos y el último clima guardado se almacenan localmente en el dispositivo.
- Para publicar en Google Play hará falta una política de privacidad pública en una URL accesible.

## Requisitos

- Node.js instalado.
- Android Studio instalado para compilar y firmar la app Android.
- Android SDK configurado en Android Studio. Si compilas desde terminal, `ANDROID_HOME` debe apuntar a tu SDK.
- Un emulador Android API 24+ o un dispositivo físico.

## Uso en web local

```bash
npm install
npm run dev
```

Abre la URL local que muestre Vite, normalmente `http://localhost:5173`.

## Compilar la web

```bash
npm run build
```

El resultado se genera en `dist/`.

## Sincronizar Android

Cada vez que cambies código web, ejecuta:

```bash
npm run cap:sync
```

Esto compila la web y copia `dist/` dentro del proyecto Android.

## Abrir Android Studio

```bash
npm run cap:open:android
```

Android Studio abrirá la carpeta `android/`. Desde ahí puedes ejecutar la app en un emulador o dispositivo.

## Generar APK de prueba

En Android Studio:

1. Abre `android/`.
2. Espera a que Gradle sincronice.
3. Selecciona un emulador o dispositivo.
4. Pulsa Run para instalar una versión de prueba.

También puedes usar la terminal dentro de `android/`:

```bash
.\gradlew assembleDebug
```

El APK debug queda en `android/app/build/outputs/apk/debug/`.

## Generar Android App Bundle para Google Play

En Android Studio:

1. Ve a `Build > Generate Signed App Bundle / APK`.
2. Elige `Android App Bundle`.
3. Crea o selecciona tu keystore.
4. Selecciona variante `release`.
5. Genera el `.aab`.

El bundle de release queda normalmente en `android/app/build/outputs/bundle/release/`.

## Scripts útiles

```bash
npm run build
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
npm run android:build
```

## Nota de publicación

Esta rama prepara la app para Android, pero no publica nada en Google Play. Antes de publicar tendrás que preparar la ficha de Play Store, capturas, clasificación de contenido, Data Safety y una política de privacidad pública.
