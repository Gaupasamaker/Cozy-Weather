export type Language = 'es' | 'en';

export interface RecommendationItem {
  label: string;
  query: string;
  url: string;
}

export interface RecommendationSection {
  title: string;
  items: RecommendationItem[];
}

export interface LocalRecommendationResult {
  text: string;
  sections: RecommendationSection[];
}

type WeatherMood = 'storm' | 'snow' | 'rain' | 'fog' | 'cold' | 'hot' | 'clear' | 'cloudy' | 'wind' | 'night';

const isRainCode = (weatherCode: number) =>
  (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);

const isSnowCode = (weatherCode: number) =>
  (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);

const getMood = (
  weatherCode: number,
  temp: number,
  isDay = true,
  apparentTemp = temp,
  windspeed = 0
): WeatherMood => {
  if (!isDay) return 'night';
  if (weatherCode >= 95) return 'storm';
  if (isSnowCode(weatherCode)) return 'snow';
  if (isRainCode(weatherCode)) return 'rain';
  if (weatherCode === 45 || weatherCode === 48) return 'fog';
  if (windspeed >= 24) return 'wind';
  if (temp < 8 || apparentTemp < 7) return 'cold';
  if (temp >= 29) return 'hot';
  if (weatherCode === 0 || weatherCode === 1) return 'clear';
  return 'cloudy';
};

const getStableIndex = (parts: Array<string | number | boolean>, length: number) => {
  const source = `${new Date().toISOString().slice(0, 10)}:${parts.join(':')}`;
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }
  return hash % length;
};

const pick = <T,>(items: T[], parts: Array<string | number | boolean>): T => {
  return items[getStableIndex(parts, items.length)];
};

const cozyMessages: Record<Language, Record<WeatherMood, string[]>> = {
  es: {
    storm: [
      'Con tormenta, mejor bajar el ritmo y elegir un plan bajo techo.',
      'Día intenso fuera. Ve con calma y evita desplazamientos largos.',
      'Tormenta a la vista: ropa cómoda y plan tranquilo.'
    ],
    snow: [
      'Hace frío de verdad. Abrigo, pasos cortos y algo caliente cerca.',
      'Día de capas y calma. Mejor no complicarse con planes largos.',
      'Nieve o frío fuerte: abrígate bien y sal solo lo justo.'
    ],
    rain: [
      'Con lluvia, mejor paraguas y un plan tranquilo bajo techo.',
      'Día de lluvia: café acogedor o paseo corto si escampa.',
      'Con lluvia, mejor un plan cercano y a cubierto.'
    ],
    fog: [
      'Hay bruma: ve con calma y elige rutas sencillas.',
      'Cielo difuso, plan fácil y buena visibilidad.',
      'Día de niebla: mejor moverse despacio.'
    ],
    cold: [
      'Hace fresco. Una capa cálida y un plan tranquilo van bien.',
      'Mejor llevar abrigo y buscar una pausa caliente.',
      'Día frío: ropa cómoda, manos calientes y plan sencillo.'
    ],
    hot: [
      'Hace calor. Sombra, agua y un plan ligero.',
      'Buen día para salir, pero mejor evitar el sol fuerte.',
      'Calor arriba: ropa fresca y ritmo tranquilo.'
    ],
    clear: [
      'Buen día para un paseo corto o un café fuera.',
      'Cielo despejado en {city}: sal sin prisa y lleva algo cómodo.',
      'Día tranquilo para salir un rato y tomar aire.'
    ],
    cloudy: [
      'Cielo suave, ropa cómoda y plan flexible.',
      'Día tranquilo para improvisar sin complicarse.',
      'Nubes sobre {city}: buen momento para un paseo sin prisa.'
    ],
    wind: [
      'Hay viento. Mejor una capa ligera y un plan fácil.',
      'Día movido: sujeta bien la chaqueta y elige rutas cortas.',
      'Con viento, mejor salir cómodo y sin cargar demasiado.'
    ],
    night: [
      'Noche tranquila: plan corto, cena calmada o volver pronto a casa.',
      'Para esta hora, mejor algo suave y cerca.',
      'Noche cozy: abrigo ligero y plan sin prisas.'
    ]
  },
  en: {
    storm: [
      'With a storm around, slow down and choose an indoor plan.',
      'Big weather outside. Keep it calm and avoid long trips.',
      'Stormy day: comfortable clothes and a quiet plan.'
    ],
    snow: [
      'It is properly cold. Warm coat, short steps, and a hot drink nearby.',
      'Layered day. Keep plans simple and close.',
      'Snow or strong cold: bundle up and keep outings short.'
    ],
    rain: [
      'Rainy day: umbrella ready and a calm indoor plan.',
      'Good day for a cozy cafe or a short walk if it clears.',
      'With rain, choose something nearby and covered.'
    ],
    fog: [
      'Misty out there: take it slow and keep routes simple.',
      'Soft sky, easy plan, good visibility.',
      'Foggy day: move gently and do not rush.'
    ],
    cold: [
      'It is chilly. A warm layer and a calm plan will help.',
      'Bring a coat and look for a warm pause.',
      'Cold day: comfortable clothes, warm hands, simple plan.'
    ],
    hot: [
      'It is hot. Shade, water, and a light plan.',
      'Good day to go out, but avoid the strongest sun.',
      'Heat is up: fresh clothes and an easy pace.'
    ],
    clear: [
      'Good day for a short walk or coffee outside.',
      'Clear sky over {city}: go slow and keep it comfortable.',
      'Calm day to step out and get some air.'
    ],
    cloudy: [
      'Soft sky, comfortable clothes, flexible plan.',
      'Quiet day for easy improvising.',
      'Clouds over {city}: good moment for an unhurried walk.'
    ],
    wind: [
      'Windy out there. A light layer and an easy plan work well.',
      'Breezy day: keep routes short and comfortable.',
      'With wind, travel light and choose simple plans.'
    ],
    night: [
      'Quiet night: short walk, calm dinner, or an early return.',
      'At this hour, something gentle and nearby fits best.',
      'Cozy night: light jacket and an unhurried plan.'
    ]
  }
};

const quickActivities: Record<Language, Record<WeatherMood, string[]>> = {
  es: {
    storm: ['Plan bajo techo', 'Cine tranquilo', 'Tarde de lectura'],
    snow: ['Manta y té', 'Café caliente', 'Tarde tranquila'],
    rain: ['Café acogedor', 'Lectura en casa', 'Plan bajo techo'],
    fog: ['Café tranquilo', 'Paseo corto', 'Plan cercano'],
    cold: ['Manta y té', 'Café caliente', 'Tarde tranquila'],
    hot: ['Helado', 'Limonada fría', 'Sombra y paseo'],
    clear: ['Paseo al aire libre', 'Terraza tranquila', 'Picnic suave'],
    cloudy: ['Mercado local', 'Café tranquilo', 'Paseo sin prisa'],
    wind: ['Paseo corto', 'Café fuera', 'Ruta sencilla'],
    night: ['Cena tranquila', 'Paseo corto', 'Mirar estrellas']
  },
  en: {
    storm: ['Indoor plan', 'Quiet cinema', 'Reading afternoon'],
    snow: ['Blanket and tea', 'Hot coffee', 'Quiet afternoon'],
    rain: ['Cozy cafe', 'Reading at home', 'Indoor plan'],
    fog: ['Calm cafe', 'Short walk', 'Nearby plan'],
    cold: ['Blanket and tea', 'Hot coffee', 'Quiet afternoon'],
    hot: ['Ice cream', 'Cold lemonade', 'Shade and walk'],
    clear: ['Outdoor walk', 'Calm terrace', 'Soft picnic'],
    cloudy: ['Local market', 'Calm cafe', 'Unhurried walk'],
    wind: ['Short walk', 'Coffee outside', 'Simple route'],
    night: ['Calm dinner', 'Short walk', 'Stargazing']
  }
};

const intros: Record<Language, Record<WeatherMood, string[]>> = {
  es: {
    storm: ['Con tormenta, mejor elegir lugares cubiertos y fáciles.'],
    snow: ['Para el frío van bien planes cálidos, cerca y sin prisa.'],
    rain: ['La lluvia encaja mejor con cafés, librerías y planes bajo techo.'],
    fog: ['Con bruma, mejor planes sencillos y cercanos.'],
    cold: ['Hace fresco: aquí van ideas calientes y fáciles.'],
    hot: ['Para el calor, busca sombra, agua y planes ligeros.'],
    clear: ['El tiempo acompaña para salir un rato sin complicarse.'],
    cloudy: ['Día flexible: paseo suave y una parada agradable.'],
    wind: ['Con viento, mejor planes cortos y zonas cómodas.'],
    night: ['Para la noche, mejor planes tranquilos y cercanos.']
  },
  en: {
    storm: ['With a storm, covered and easy places are the best pick.'],
    snow: ['Cold weather suits warm, close, unhurried plans.'],
    rain: ['Rain fits cafes, bookstores, and indoor plans best.'],
    fog: ['With mist around, keep plans simple and nearby.'],
    cold: ['It is chilly: here are warm and easy ideas.'],
    hot: ['For the heat, look for shade, water, and light plans.'],
    clear: ['The weather works well for stepping out without overthinking it.'],
    cloudy: ['Flexible day: gentle walk and a pleasant stop.'],
    wind: ['With wind, short plans and comfortable places work best.'],
    night: ['For night, choose calm and nearby plans.']
  }
};

const categorySets: Record<Language, Record<WeatherMood, RecommendationSection[]>> = {
  es: {
    storm: [{ title: 'Bajo techo', items: [] }, { title: 'Pausa caliente', items: [] }],
    snow: [{ title: 'Calor y calma', items: [] }, { title: 'Plan cultural', items: [] }],
    rain: [{ title: 'Bajo techo', items: [] }, { title: 'Pausa cozy', items: [] }],
    fog: [{ title: 'Cerca y fácil', items: [] }, { title: 'Interior agradable', items: [] }],
    cold: [{ title: 'Calor y calma', items: [] }, { title: 'Plan cultural', items: [] }],
    hot: [{ title: 'Fresco y sombra', items: [] }, { title: 'Bebidas frías', items: [] }],
    clear: [{ title: 'Aire libre', items: [] }, { title: 'Capricho cercano', items: [] }],
    cloudy: [{ title: 'Paseo suave', items: [] }, { title: 'Parada agradable', items: [] }],
    wind: [{ title: 'Paseo corto', items: [] }, { title: 'Pausa cómoda', items: [] }],
    night: [{ title: 'Noche tranquila', items: [] }, { title: 'Algo cerca', items: [] }]
  },
  en: {
    storm: [{ title: 'Indoors', items: [] }, { title: 'Warm pause', items: [] }],
    snow: [{ title: 'Warm and calm', items: [] }, { title: 'Cultural plan', items: [] }],
    rain: [{ title: 'Indoors', items: [] }, { title: 'Cozy pause', items: [] }],
    fog: [{ title: 'Close and easy', items: [] }, { title: 'Pleasant indoors', items: [] }],
    cold: [{ title: 'Warm and calm', items: [] }, { title: 'Cultural plan', items: [] }],
    hot: [{ title: 'Cool and shaded', items: [] }, { title: 'Cold drinks', items: [] }],
    clear: [{ title: 'Fresh air', items: [] }, { title: 'Nearby treat', items: [] }],
    cloudy: [{ title: 'Gentle walk', items: [] }, { title: 'Nice stop', items: [] }],
    wind: [{ title: 'Short walk', items: [] }, { title: 'Comfortable pause', items: [] }],
    night: [{ title: 'Calm night', items: [] }, { title: 'Nearby stop', items: [] }]
  }
};

const categoryItems: Record<Language, Record<WeatherMood, string[][]>> = {
  es: {
    storm: [['cines', 'museos', 'centros culturales'], ['cafeterías', 'chocolate caliente', 'pastelerías']],
    snow: [['cafeterías', 'teterías', 'chocolaterías'], ['cines', 'museos', 'bibliotecas']],
    rain: [['cafeterías', 'bibliotecas', 'librerías'], ['museos', 'cines', 'pastelerías']],
    fog: [['cafeterías cercanas', 'bibliotecas cercanas', 'centros culturales'], ['museos', 'librerías', 'restaurantes acogedores']],
    cold: [['cafeterías', 'chocolaterías', 'teterías'], ['cines', 'museos', 'bibliotecas']],
    hot: [['parques con sombra', 'piscinas', 'playas cercanas'], ['heladerías', 'zumos naturales', 'cafeterías con terraza']],
    clear: [['parques', 'rutas para caminar', 'miradores'], ['heladerías', 'terrazas', 'cafeterías']],
    cloudy: [['mercados locales', 'parques cercanos', 'rutas para caminar'], ['cafeterías', 'librerías', 'pastelerías']],
    wind: [['parques cercanos', 'rutas cortas', 'calles tranquilas'], ['cafeterías', 'mercados cubiertos', 'librerías']],
    night: [['restaurantes tranquilos', 'miradores', 'paseos cercanos'], ['cafeterías', 'heladerías', 'bares tranquilos']]
  },
  en: {
    storm: [['cinemas', 'museums', 'cultural centers'], ['cafes', 'hot chocolate', 'bakeries']],
    snow: [['cafes', 'tea rooms', 'hot chocolate'], ['cinemas', 'museums', 'libraries']],
    rain: [['cafes', 'libraries', 'bookstores'], ['museums', 'cinemas', 'bakeries']],
    fog: [['nearby cafes', 'nearby libraries', 'cultural centers'], ['museums', 'bookstores', 'cozy restaurants']],
    cold: [['cafes', 'hot chocolate', 'tea rooms'], ['cinemas', 'museums', 'libraries']],
    hot: [['shaded parks', 'swimming pools', 'nearby beaches'], ['ice cream', 'fresh juice', 'cafes with terrace']],
    clear: [['parks', 'walking routes', 'viewpoints'], ['ice cream', 'terraces', 'cafes']],
    cloudy: [['local markets', 'nearby parks', 'walking routes'], ['cafes', 'bookstores', 'bakeries']],
    wind: [['nearby parks', 'short walking routes', 'quiet streets'], ['cafes', 'covered markets', 'bookstores']],
    night: [['quiet restaurants', 'viewpoints', 'nearby walks'], ['cafes', 'ice cream', 'quiet bars']]
  }
};

const formatCity = (message: string, city: string) => message.replace('{city}', city);

const makeMapsUrl = (query: string, lat: number, lon: number) => {
  const fullQuery = `${query} near ${lat.toFixed(5)},${lon.toFixed(5)}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;
};

export const getCozyMessage = async (
  weatherCode: number,
  temp: number,
  isDay: boolean,
  city: string,
  lang: Language = 'es',
  apparentTemp = temp,
  windspeed = 0
): Promise<string> => {
  const mood = getMood(weatherCode, temp, isDay, apparentTemp, windspeed);
  return formatCity(pick(cozyMessages[lang][mood], [weatherCode, Math.round(temp), isDay, city, lang]), city);
};

export const getQuickActivity = async (
  weatherCode: number,
  temp: number,
  isDay: boolean,
  lang: Language = 'es',
  apparentTemp = temp,
  windspeed = 0
): Promise<string> => {
  const mood = getMood(weatherCode, temp, isDay, apparentTemp, windspeed);
  return pick(quickActivities[lang][mood], [weatherCode, Math.round(temp), isDay, lang]);
};

export const getLocalRecommendations = async (
  lat: number,
  lon: number,
  weatherCode: number,
  temp: number,
  activityContext: string,
  lang: Language = 'es'
): Promise<LocalRecommendationResult> => {
  const mood = getMood(weatherCode, temp);
  const sections = categorySets[lang][mood].map((section, sectionIndex) => ({
    ...section,
    items: categoryItems[lang][mood][sectionIndex].map((query) => ({
      label: query,
      query,
      url: makeMapsUrl(query, lat, lon)
    }))
  }));

  const intro = pick(intros[lang][mood], [weatherCode, Math.round(temp), activityContext, lang]);
  return { text: intro, sections };
};
