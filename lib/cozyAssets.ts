export type CozyAsset = {
  src: string;
  alt: {
    es: string;
    en: string;
  };
};

export type WeatherMood = 'clear' | 'partlyCloudy' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'wind' | 'night' | 'hot' | 'cold';
export type Season = 'winter' | 'spring' | 'summer' | 'autumn';
export type CompanionFamily = 'bear';
export type CompanionMood = WeatherMood | 'cozy' | 'walk' | 'summer';
export type OutfitRecommendation = CozyAsset & {
  text: {
    es: string;
    en: string;
  };
};

const cozy = '/assets/cozy';

const asset = (src: string, es: string, en: string): CozyAsset => ({
  src,
  alt: { es, en }
});

export const cozyWeatherAssets = {
  clear: asset(`${cozy}/meteo/sol.png`, 'Sol acuarela', 'Watercolor sun'),
  intenseSun: asset(`${cozy}/meteo/sol_intenso.png`, 'Sol intenso', 'Strong sun'),
  cloudy: asset(`${cozy}/meteo/nube.png`, 'Nube acuarela', 'Watercolor cloud'),
  cloudyAlt: asset(`${cozy}/meteo/nube_2.png`, 'Cielo nublado', 'Cloudy sky'),
  partlyCloudy: asset(`${cozy}/meteo/sol_nube.png`, 'Sol entre nubes', 'Sun behind clouds'),
  rain: asset(`${cozy}/meteo/lluvia_ligera.png`, 'Lluvia ligera', 'Light rain'),
  heavyRain: asset(`${cozy}/meteo/lluvia_intensa.png`, 'Lluvia intensa', 'Heavy rain'),
  snow: asset(`${cozy}/meteo/nieve.png`, 'Nieve suave', 'Soft snow'),
  storm: asset(`${cozy}/meteo/tormenta.png`, 'Tormenta', 'Storm'),
  fog: asset(`${cozy}/meteo/niebla.png`, 'Niebla', 'Fog'),
  wind: asset(`${cozy}/meteo/viento_suave.png`, 'Viento suave', 'Soft wind'),
  night: asset(`${cozy}/meteo/luna_nube.png`, 'Luna con nube', 'Moon with cloud'),
  stars: asset(`${cozy}/meteo/estrellas.png`, 'Estrellas', 'Stars'),
  rainbow: asset(`${cozy}/meteo/arcoiris.png`, 'Arcoiris', 'Rainbow')
} as const;

export const cozyHomeScenes = {
  cloudyDay: asset(`${cozy}/escenas/home_scene_cloudy_day.png`, 'Escena nublada de día', 'Cloudy daytime scene'),
  sunnyDay: asset(`${cozy}/escenas/home_scene_sunny_day.png`, 'Escena soleada de día', 'Sunny daytime scene'),
  rainDay: asset(`${cozy}/escenas/home_scene_rain_day.png`, 'Escena lluviosa de día', 'Rainy daytime scene'),
  night: asset(`${cozy}/escenas/home_scene_night.png`, 'Escena nocturna', 'Night scene'),
  cloudyWithBear: asset(`${cozy}/escenas/home_scene_cloudy_with_bear.jpg`, 'Escena nublada con oso', 'Cloudy scene with bear'),
  sunnyWithBear: asset(`${cozy}/escenas/home_scene_sunny_with_bear.jpg`, 'Escena soleada con oso', 'Sunny scene with bear'),
  rainWithBear: asset(`${cozy}/escenas/home_scene_rain_with_bear.jpg`, 'Escena lluviosa con oso', 'Rainy scene with bear'),
  nightWithBear: asset(`${cozy}/escenas/home_scene_night_with_bear.jpg`, 'Escena nocturna con oso', 'Night scene with bear')
} as const;

export const cozyCompanions: Record<CompanionFamily, Record<CompanionMood, CozyAsset>> = {
  bear: {
    clear: asset(`${cozy}/animales/osos/invierno/oso_sol.png`, 'Oso soleado', 'Sunny Bear'),
    partlyCloudy: asset(`${cozy}/animales/osos/verano/oso_paseo.png`, 'Oso de paseo', 'Walking Bear'),
    cloudy: asset(`${cozy}/animales/osos/invierno/oso_taza.png`, 'Oso de nubes', 'Cloudy Bear'),
    rain: asset(`${cozy}/animales/osos/invierno/oso_lluvia.png`, 'Oso de lluvia', 'Rainy Bear'),
    snow: asset(`${cozy}/animales/osos/invierno/oso_frio.png`, 'Oso de nieve', 'Snowy Bear'),
    storm: asset(`${cozy}/animales/osos/invierno/oso_chubasquero.png`, 'Oso de tormenta', 'Stormy Bear'),
    fog: asset(`${cozy}/animales/osos/invierno/oso_manta.png`, 'Oso de bruma', 'Misty Bear'),
    wind: asset(`${cozy}/animales/osos/invierno/oso_paseando.png`, 'Oso de viento', 'Windy Bear'),
    night: asset(`${cozy}/animales/osos/invierno/oso_noche.png`, 'Oso dormilon', 'Sleepy Bear'),
    hot: asset(`${cozy}/animales/osos/verano/oso_limonada_2.png`, 'Oso con limonada', 'Lemonade Bear'),
    cold: asset(`${cozy}/animales/osos/invierno/oso_frio_2.png`, 'Oso abrigado', 'Bundled Bear'),
    cozy: asset(`${cozy}/animales/osos/invierno/oso_leyendo.png`, 'Oso lector', 'Reading Bear'),
    walk: asset(`${cozy}/animales/osos/verano/oso_paseo.png`, 'Oso de paseo', 'Walking Bear'),
    summer: asset(`${cozy}/animales/osos/verano/oso_picnic.png`, 'Oso de picnic', 'Picnic Bear')
  }
};

export const cozyOutfits = {
    umbrella: asset(`${cozy}/ropa/invierno/paraguas.png`, 'Paraguas', 'Umbrella'),
  raincoat: asset(`${cozy}/ropa/invierno/abrigo_lluvia.png`, 'Abrigo de lluvia', 'Rain coat'),
  boots: asset(`${cozy}/ropa/invierno/botas_invierno.png`, 'Botas de lluvia', 'Rain boots'),
  scarf: asset(`${cozy}/ropa/invierno/bufanda.png`, 'Bufanda', 'Scarf'),
  coat: asset(`${cozy}/ropa/invierno/abrigo_frio.png`, 'Abrigo calentito', 'Warm coat'),
  beanie: asset(`${cozy}/ropa/invierno/gorro_invierno.png`, 'Gorro de invierno', 'Winter hat'),
  gloves: asset(`${cozy}/ropa/invierno/guantes_invierno.png`, 'Guantes de invierno', 'Winter gloves'),
  jacket: asset(`${cozy}/ropa/invierno/jersey.png`, 'Jersey ligero', 'Light sweater'),
  sunglasses: asset(`${cozy}/ropa/verano/gafas_sol.png`, 'Gafas de sol', 'Sunglasses'),
  tshirt: asset(`${cozy}/ropa/verano/camiseta_verano.png`, 'Camiseta de verano', 'Summer t-shirt'),
  shirt: asset(`${cozy}/ropa/verano/camisa_verano_hombre.png`, 'Camisa de verano', 'Summer shirt'),
  polo: asset(`${cozy}/ropa/verano/polo_verano_hombre.png`, 'Polo de verano', 'Summer polo'),
  hat: asset(`${cozy}/ropa/verano/sombrero_verano_mujer.png`, 'Sombrero de verano', 'Summer hat'),
  sandals: asset(`${cozy}/ropa/verano/sandalias_verano_mujer.png`, 'Sandalias', 'Sandals')
} as const;

export const cozyPlanIcons = {
  cafe: asset(`${cozy}/iconos/taza_cafe.png`, 'Taza de cafe', 'Coffee cup'),
  takeawayCoffee: asset(`${cozy}/iconos/cafe_llevar.png`, 'Cafe para llevar', 'Takeaway coffee'),
  book: asset(`${cozy}/iconos/libro_2.png`, 'Libro', 'Book'),
  books: asset(`${cozy}/iconos/books.png`, 'Libros', 'Books'),
  picnic: asset(`${cozy}/iconos/cesta_picnic.png`, 'Cesta de picnic', 'Picnic basket'),
  iceCream: asset(`${cozy}/iconos/helado.png`, 'Helado', 'Ice cream'),
  lemonade: asset(`${cozy}/iconos/limonada.png`, 'Limonada', 'Lemonade'),
  bike: asset(`${cozy}/iconos/bicicleta.png`, 'Bicicleta', 'Bike'),
  map: asset(`${cozy}/iconos/mapa.png`, 'Mapa', 'Map'),
  scenicMap: asset(`${cozy}/iconos/map.png`, 'Mapa ilustrado', 'Illustrated map'),
  blanket: asset(`${cozy}/iconos/manta.png`, 'Manta', 'Blanket'),
  candle: asset(`${cozy}/iconos/vela.png`, 'Vela', 'Candle'),
  plant: asset(`${cozy}/iconos/planta.png`, 'Planta', 'Plant'),
  fan: asset(`${cozy}/iconos/ventilador.png`, 'Ventilador', 'Fan'),
  croissant: asset(`${cozy}/iconos/croissant.png`, 'Croissant', 'Croissant'),
  compass: asset(`${cozy}/iconos/brujula.png`, 'Brujula', 'Compass'),
  cinema: asset(`${cozy}/iconos/cinema.png`, 'Cine', 'Cinema'),
  theatre: asset(`${cozy}/iconos/theatre.png`, 'Teatro', 'Theatre'),
  terrace: asset(`${cozy}/iconos/terrace.png`, 'Terraza', 'Terrace'),
  coffeeShop: asset(`${cozy}/iconos/coffee_shop.png`, 'Cafeteria', 'Coffee shop'),
  hotCoffee: asset(`${cozy}/iconos/hot_coffee.png`, 'Cafe caliente', 'Hot coffee'),
  museum: asset(`${cozy}/iconos/museum.png`, 'Museo', 'Museum'),
  park: asset(`${cozy}/iconos/park.png`, 'Parque', 'Park'),
  market: asset(`${cozy}/iconos/vegetables.png`, 'Mercado', 'Market stall')
} as const;

export const cozyDecorations = {
  hearts: asset(`${cozy}/decoracion/corazones.png`, 'Corazones decorativos', 'Decorative hearts'),
  stars: asset(`${cozy}/decoracion/estrellas.png`, 'Estrellas decorativas', 'Decorative stars'),
  flowers: asset(`${cozy}/decoracion/flores.png`, 'Flores decorativas', 'Decorative flowers'),
  leaves: asset(`${cozy}/decoracion/hojas.png`, 'Hojas decorativas', 'Decorative leaves'),
  leavesAlt: asset(`${cozy}/decoracion/hojas_2.png`, 'Hojas al viento', 'Wind leaves'),
  lemons: asset(`${cozy}/decoracion/limones.png`, 'Limones decorativos', 'Decorative lemons'),
  cloud: asset(`${cozy}/decoracion/nubes.png`, 'Nubes decorativas', 'Decorative clouds'),
  cloudCluster: asset(`${cozy}/decoracion/nubes_varias.png`, 'Grupo de nubes', 'Cloud cluster'),
  picnic: asset(`${cozy}/decoracion/picnic.png`, 'Picnic decorativo', 'Decorative picnic'),
  heroCloudSleepy: asset(`${cozy}/decoracion/hero_cloud_sleepy.png`, 'Nube dormida', 'Sleepy cloud'),
  brandLeafPair: asset(`${cozy}/decoracion/brand_leaf_pair.png`, 'Ramas decorativas de marca', 'Decorative brand branches'),
  footerLeafPair: asset(`${cozy}/decoracion/footer_leaf_pair.png`, 'Ramas decorativas de pie', 'Decorative footer branches')
} as const;

export const getApproxSeason = (date = new Date()): Season => {
  const month = date.getMonth();
  if (month === 11 || month <= 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
};

const isRainCode = (weatherCode: number) =>
  (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);

const isSnowCode = (weatherCode: number) =>
  (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);

export const getWeatherMood = (
  weatherCode: number,
  temperature: number,
  windspeed = 0,
  isDay = true,
  apparentTemperature = temperature
): WeatherMood => {
  if (!isDay) return 'night';
  if (weatherCode >= 95) return 'storm';
  if (isSnowCode(weatherCode)) return 'snow';
  if (isRainCode(weatherCode)) return 'rain';
  if (weatherCode === 45 || weatherCode === 48) return 'fog';
  if (windspeed >= 24) return 'wind';
  if (temperature >= 28) return 'hot';
  if (temperature <= 7 || apparentTemperature <= 6) return 'cold';
  if (weatherCode === 0) return 'clear';
  if (weatherCode === 1 || weatherCode === 2) return 'partlyCloudy';
  return 'cloudy';
};

export const getWeatherAsset = (
  weatherCode: number,
  temperature: number,
  windspeed: number,
  isDay: boolean
): CozyAsset => {
  if (!isDay) {
    if (weatherCode >= 95) return cozyWeatherAssets.storm;
    if (isRainCode(weatherCode)) return weatherCode >= 61 ? cozyWeatherAssets.heavyRain : cozyWeatherAssets.rain;
    if (isSnowCode(weatherCode)) return cozyWeatherAssets.snow;
    if (weatherCode === 0) return cozyWeatherAssets.night;
    return cozyWeatherAssets.night;
  }

  const mood = getWeatherMood(weatherCode, temperature, windspeed, isDay);
  if (mood === 'hot') return cozyWeatherAssets.intenseSun;
  if (mood === 'cold') return cozyWeatherAssets.cloudy;
  if (mood === 'wind') return cozyWeatherAssets.wind;
  if (mood === 'rain' && weatherCode >= 61) return cozyWeatherAssets.heavyRain;
  if (mood === 'cloudy' && weatherCode === 3) return cozyWeatherAssets.cloudyAlt;
  return cozyWeatherAssets[mood] ?? cozyWeatherAssets.cloudy;
};

export const getHomeSceneAsset = (
  weatherCode: number,
  temperature: number,
  windspeed: number,
  isDay: boolean
): CozyAsset => {
  if (!isDay) return cozyHomeScenes.nightWithBear;

  const mood = getWeatherMood(weatherCode, temperature, windspeed, isDay);
  if (mood === 'rain' || mood === 'storm') return cozyHomeScenes.rainWithBear;
  if (mood === 'clear' || mood === 'hot') return cozyHomeScenes.sunnyWithBear;
  return cozyHomeScenes.cloudyWithBear;
};

export const getCompanionAsset = (
  weatherCode: number,
  temperature: number,
  windspeed: number,
  isDay: boolean,
  family: CompanionFamily = 'bear'
): CozyAsset => {
  const mood = getWeatherMood(weatherCode, temperature, windspeed, isDay);
  const season = getApproxSeason();

  if (!isDay) {
    return temperature < 10 ? cozyCompanions[family].night : asset(`${cozy}/animales/osos/invierno/oso_noche_2.png`, 'Oso de noche', 'Night Bear');
  }

  if (isDay && (weatherCode === 0 || weatherCode === 1) && temperature >= 18) {
    if (temperature >= 27) return cozyCompanions[family].hot;
    if (temperature >= 23) return cozyCompanions[family].summer;
    return cozyCompanions[family].walk;
  }

  if (isDay && (mood === 'cloudy' || mood === 'partlyCloudy') && temperature >= 16 && temperature <= 20) {
    if (season === 'spring' || season === 'summer') return cozyCompanions[family].walk;
    return cozyCompanions[family].cozy;
  }

  if (isDay && mood === 'cloudy' && temperature < 16 && temperature >= 10) {
    return cozyCompanions[family].cloudy;
  }

  return cozyCompanions[family][mood] ?? cozyCompanions[family].cloudy;
};

const withOutfitText = (assetValue: CozyAsset, es: string, en: string): OutfitRecommendation => ({
  ...assetValue,
  text: { es, en }
});

export const getOutfitRecommendation = (
  temperature: number,
  weatherCode: number,
  isDay: boolean,
  apparentTemperature = temperature,
  windspeed = 0
): OutfitRecommendation => {
  const mood = getWeatherMood(weatherCode, temperature, windspeed, isDay, apparentTemperature);
  const comfortTemp = Math.min(temperature, apparentTemperature);

  if (mood === 'storm') return withOutfitText(cozyOutfits.raincoat, 'Chaqueta de lluvia', 'Rain jacket');
  if (mood === 'rain') {
    if (comfortTemp < 12) return withOutfitText(cozyOutfits.raincoat, 'Chaqueta de lluvia', 'Rain jacket');
    return withOutfitText(cozyOutfits.umbrella, 'Paraguas', 'Umbrella');
  }
  if (mood === 'snow' || comfortTemp < 5) return withOutfitText(cozyOutfits.coat, 'Abrigo', 'Warm coat');
  if (comfortTemp < 9) return withOutfitText(cozyOutfits.scarf, 'Bufanda', 'Scarf');
  if (windspeed >= 24 && comfortTemp < 18) return withOutfitText(cozyOutfits.jacket, 'Chaqueta ligera', 'Light jacket');
  if (comfortTemp < 16) return withOutfitText(cozyOutfits.jacket, 'Jersey ligero', 'Light sweater');
  if ((mood === 'clear' || mood === 'partlyCloudy') && isDay && temperature >= 20) {
    if (temperature >= 27) return withOutfitText(cozyOutfits.hat, 'Sombrero ligero', 'Light hat');
    if (temperature >= 24) return withOutfitText(cozyOutfits.polo, 'Ropa ligera', 'Light clothes');
    return withOutfitText(cozyOutfits.tshirt, 'Ropa ligera', 'Light clothes');
  }
  if ((mood === 'cloudy' || mood === 'partlyCloudy') && comfortTemp >= 16 && comfortTemp <= 20) {
    return withOutfitText(cozyOutfits.shirt, 'Capa fina', 'Light layer');
  }
  if (!isDay && comfortTemp < 18) return withOutfitText(cozyOutfits.jacket, 'Capa fina', 'Light layer');
  if (temperature >= 28) return withOutfitText(cozyOutfits.hat, 'Sombrero ligero', 'Light hat');
  return withOutfitText(cozyOutfits.tshirt, 'Ropa ligera', 'Light clothes');
};

export const getOutfitAsset = (temperature: number, weatherCode: number, isDay: boolean): CozyAsset => {
  return getOutfitRecommendation(temperature, weatherCode, isDay);
};

export const getPlanAsset = (
  activity: string,
  weatherCode: number,
  temperature: number,
  isDay: boolean
): CozyAsset => {
  const normalized = activity.toLowerCase();
  const mood = getWeatherMood(weatherCode, temperature, 0, isDay);

  if (normalized.includes('hot coffee') || normalized.includes('café caliente') || normalized.includes('cafe caliente')) return cozyPlanIcons.hotCoffee;
  if (normalized.includes('cafeter') || normalized.includes('coffee shop')) return cozyPlanIcons.coffeeShop;
  if (normalized.includes('caf') || normalized.includes('coffee')) return cozyPlanIcons.cafe;
  if (normalized.includes('librer') || normalized.includes('bookstore') || normalized.includes('biblioteca') || normalized.includes('library')) return cozyPlanIcons.books;
  if (normalized.includes('libro') || normalized.includes('book') || normalized.includes('leer')) return cozyPlanIcons.book;
  if (normalized.includes('helado') || normalized.includes('ice')) return cozyPlanIcons.iceCream;
  if (normalized.includes('limonada') || normalized.includes('drink') || normalized.includes('bebida')) return cozyPlanIcons.lemonade;
  if (normalized.includes('bici') || normalized.includes('bike')) return cozyPlanIcons.bike;
  if (normalized.includes('picnic')) return cozyPlanIcons.picnic;
  if (normalized.includes('terraza') || normalized.includes('terrace')) return cozyPlanIcons.terrace;
  if (normalized.includes('parque') || normalized.includes('park')) return cozyPlanIcons.park;
  if (normalized.includes('mercado') || normalized.includes('market')) return cozyPlanIcons.market;
  if (normalized.includes('museo') || normalized.includes('museum')) return cozyPlanIcons.museum;
  if (normalized.includes('teatro') || normalized.includes('theatre') || normalized.includes('theater')) return cozyPlanIcons.theatre;
  if (normalized.includes('cine') || normalized.includes('cinema')) return cozyPlanIcons.cinema;
  if (normalized.includes('cena') || normalized.includes('dinner') || normalized.includes('restaurante') || normalized.includes('restaurant')) return cozyPlanIcons.terrace;
  if (normalized.includes('estrella') || normalized.includes('star')) return cozyWeatherAssets.stars;
  if (normalized.includes('postre') || normalized.includes('dessert')) return cozyPlanIcons.hotCoffee;
  if (normalized.includes('bajo techo') || normalized.includes('indoor')) return cozyPlanIcons.books;
  if (normalized.includes('brujula') || normalized.includes('explorar')) return cozyPlanIcons.compass;
  if (normalized.includes('croissant') || normalized.includes('merienda')) return cozyPlanIcons.croissant;
  if (normalized.includes('manta') || normalized.includes('blanket')) return cozyPlanIcons.blanket;
  if (normalized.includes('paseo') || normalized.includes('walk') || normalized.includes('ruta')) return cozyPlanIcons.scenicMap;
  if (mood === 'rain' || mood === 'storm' || mood === 'cold') return cozyPlanIcons.cafe;
  if (mood === 'hot') return cozyPlanIcons.lemonade;
  if (mood === 'clear') return cozyPlanIcons.picnic;
  if (mood === 'night') return cozyPlanIcons.hotCoffee;
  return cozyPlanIcons.plant;
};

export const getCozyMessageAsset = (
  weatherCode: number,
  temperature: number,
  isDay: boolean,
  apparentTemperature = temperature,
  windspeed = 0
): CozyAsset => {
  const mood = getWeatherMood(weatherCode, temperature, windspeed, isDay, apparentTemperature);

  if (mood === 'rain' || mood === 'storm') return cozyPlanIcons.cafe;
  if (mood === 'snow' || mood === 'cold') return cozyPlanIcons.blanket;
  if (mood === 'night') return cozyPlanIcons.candle;
  if (mood === 'hot') return cozyPlanIcons.lemonade;
  if (mood === 'clear') return cozyDecorations.leaves;
  if (mood === 'wind') return cozyWeatherAssets.wind;
  return cozyPlanIcons.plant;
};
