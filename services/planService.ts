import { CozyAsset, cozyPlanIcons, cozyWeatherAssets, getWeatherMood } from '../lib/cozyAssets';
import { Language, LocalRecommendationResult } from './cozyService';

export interface PlanSuggestion {
  id: string;
  title: string;
  description: string;
  asset: CozyAsset;
  categories: string[];
}

export interface PlanBundle {
  primary: PlanSuggestion;
  alternatives: PlanSuggestion[];
}

interface PlanInput {
  weatherCode?: number;
  temperature?: number;
  apparentTemperature?: number;
  windspeed?: number;
  isDay?: boolean;
  lang: Language;
}

const makeMapsUrl = (query: string, lat: number, lon: number) => {
  const fullQuery = `${query} near ${lat.toFixed(5)},${lon.toFixed(5)}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;
};

const plan = (
  id: string,
  title: string,
  description: string,
  asset: CozyAsset,
  categories: string[]
): PlanSuggestion => ({ id, title, description, asset, categories });

const plansByMood = (lang: Language): Record<string, PlanSuggestion[]> => ({
  clear: lang === 'es'
    ? [
        plan('soft-picnic', 'Picnic suave', 'Buen momento para salir un rato sin complicarse.', cozyPlanIcons.picnic, ['parques', 'zonas de picnic', 'rutas para caminar', 'heladerías']),
        plan('outdoor-walk', 'Paseo al aire libre', 'Un paseo corto encaja bien con este cielo.', cozyPlanIcons.park, ['rutas para caminar', 'parques', 'miradores']),
        plan('ice-cream', 'Helado', 'Un capricho fresco y sencillo cerca.', cozyPlanIcons.iceCream, ['heladerías', 'cafeterías con terraza']),
        plan('calm-terrace', 'Terraza tranquila', 'Algo fuera, con calma y buena parada.', cozyPlanIcons.terrace, ['terrazas', 'cafeterías', 'plazas'])
      ]
    : [
        plan('soft-picnic', 'Soft picnic', 'Good moment to step out without overthinking it.', cozyPlanIcons.picnic, ['parks', 'picnic areas', 'walking routes', 'ice cream']),
        plan('outdoor-walk', 'Outdoor walk', 'A short walk fits this sky nicely.', cozyPlanIcons.park, ['walking routes', 'parks', 'viewpoints']),
        plan('ice-cream', 'Ice cream', 'A simple fresh treat nearby.', cozyPlanIcons.iceCream, ['ice cream', 'cafes with terrace']),
        plan('calm-terrace', 'Calm terrace', 'Something outside, easy and close.', cozyPlanIcons.terrace, ['terraces', 'cafes', 'squares'])
      ],
  partlyCloudy: lang === 'es'
    ? [
        plan('short-walk', 'Paseo corto', 'Cielo variable, plan flexible y sin prisa.', cozyPlanIcons.scenicMap, ['parques cercanos', 'rutas para caminar']),
        plan('local-market', 'Mercado local', 'Buena idea para moverte un poco y curiosear.', cozyPlanIcons.market, ['mercados locales', 'mercados cubiertos']),
        plan('coffee-outside', 'Café fuera', 'Una parada tranquila si el día acompaña.', cozyPlanIcons.terrace, ['cafeterías', 'terrazas'])
      ]
    : [
        plan('short-walk', 'Short walk', 'Changeable sky, flexible and easy plan.', cozyPlanIcons.scenicMap, ['nearby parks', 'walking routes']),
        plan('local-market', 'Local market', 'Good idea to move a little and browse.', cozyPlanIcons.market, ['local markets', 'covered markets']),
        plan('coffee-outside', 'Coffee outside', 'A calm stop if the day holds.', cozyPlanIcons.terrace, ['cafes', 'terraces'])
      ],
  cloudy: lang === 'es'
    ? [
        plan('unhurried-walk', 'Paseo sin prisa', 'Cielo suave para moverte con calma.', cozyPlanIcons.scenicMap, ['parques cercanos', 'rutas para caminar']),
        plan('local-market', 'Mercado local', 'Plan sencillo para mirar y pasear un rato.', cozyPlanIcons.market, ['mercados locales', 'mercados cubiertos']),
        plan('calm-cafe', 'Café tranquilo', 'Buena parada si apetece algo cómodo.', cozyPlanIcons.coffeeShop, ['cafeterías', 'pastelerías']),
        plan('bookstore', 'Librería cercana', 'Plan bajo techo sin perder el paseo.', cozyPlanIcons.books, ['librerías', 'bibliotecas'])
      ]
    : [
        plan('unhurried-walk', 'Unhurried walk', 'Soft sky for moving calmly.', cozyPlanIcons.scenicMap, ['nearby parks', 'walking routes']),
        plan('local-market', 'Local market', 'Simple plan to browse and walk a little.', cozyPlanIcons.market, ['local markets', 'covered markets']),
        plan('calm-cafe', 'Calm cafe', 'Good stop if you want something comfortable.', cozyPlanIcons.coffeeShop, ['cafes', 'bakeries']),
        plan('bookstore', 'Nearby bookstore', 'Indoor plan without losing the walk.', cozyPlanIcons.books, ['bookstores', 'libraries'])
      ],
  rain: lang === 'es'
    ? [
        plan('cozy-cafe', 'Café acogedor', 'Con lluvia, mejor planes tranquilos y bajo techo.', cozyPlanIcons.coffeeShop, ['cafeterías', 'pastelerías', 'chocolaterías']),
        plan('bookstore', 'Librería', 'Un plan cubierto y fácil para un día de lluvia.', cozyPlanIcons.books, ['librerías', 'bibliotecas']),
        plan('museum', 'Museo', 'Plan cultural sin depender del cielo.', cozyPlanIcons.museum, ['museos', 'centros culturales']),
        plan('cinema', 'Cine', 'Una opción cómoda si la lluvia aprieta.', cozyPlanIcons.cinema, ['cines'])
      ]
    : [
        plan('cozy-cafe', 'Cozy cafe', 'With rain, calm indoor plans work best.', cozyPlanIcons.coffeeShop, ['cafes', 'bakeries', 'hot chocolate']),
        plan('bookstore', 'Bookstore', 'Covered and easy plan for a rainy day.', cozyPlanIcons.books, ['bookstores', 'libraries']),
        plan('museum', 'Museum', 'Cultural plan without depending on the sky.', cozyPlanIcons.museum, ['museums', 'cultural centers']),
        plan('cinema', 'Cinema', 'Comfortable choice if the rain gets stronger.', cozyPlanIcons.cinema, ['cinemas'])
      ],
  storm: lang === 'es'
    ? [
        plan('indoor-plan', 'Plan bajo techo', 'Con tormenta, mejor quedarse en sitios cómodos y cercanos.', cozyPlanIcons.books, ['cafeterías', 'cines', 'museos']),
        plan('quiet-cinema', 'Cine tranquilo', 'Una opción prudente y cubierta.', cozyPlanIcons.cinema, ['cines']),
        plan('warm-cafe', 'Café caliente', 'Pausa cercana sin complicarse.', cozyPlanIcons.hotCoffee, ['cafeterías', 'chocolaterías'])
      ]
    : [
        plan('indoor-plan', 'Indoor plan', 'With a storm, keep it covered and close.', cozyPlanIcons.books, ['cafes', 'cinemas', 'museums']),
        plan('quiet-cinema', 'Quiet cinema', 'A sensible covered option.', cozyPlanIcons.cinema, ['cinemas']),
        plan('warm-cafe', 'Hot coffee', 'Nearby pause without overthinking.', cozyPlanIcons.hotCoffee, ['cafes', 'hot chocolate'])
      ],
  cold: lang === 'es'
    ? [
        plan('blanket-tea', 'Manta y té', 'Hace frío: mejor algo caliente y tranquilo.', cozyPlanIcons.blanket, ['teterías', 'cafeterías', 'chocolaterías']),
        plan('hot-coffee', 'Café caliente', 'Una pausa sencilla para entrar en calor.', cozyPlanIcons.hotCoffee, ['cafeterías', 'pastelerías']),
        plan('indoor-afternoon', 'Tarde tranquila', 'Plan bajo techo y sin prisa.', cozyPlanIcons.books, ['bibliotecas', 'museos', 'cines'])
      ]
    : [
        plan('blanket-tea', 'Blanket and tea', 'It is cold: warm and calm works best.', cozyPlanIcons.blanket, ['tea rooms', 'cafes', 'hot chocolate']),
        plan('hot-coffee', 'Hot coffee', 'Simple pause to warm up.', cozyPlanIcons.hotCoffee, ['cafes', 'bakeries']),
        plan('indoor-afternoon', 'Quiet afternoon', 'Indoor and unhurried plan.', cozyPlanIcons.books, ['libraries', 'museums', 'cinemas'])
      ],
  snow: lang === 'es'
    ? [
        plan('warm-cafe', 'Café caliente', 'Con nieve o frío fuerte, mejor cerca y caliente.', cozyPlanIcons.hotCoffee, ['cafeterías', 'chocolaterías']),
        plan('blanket-tea', 'Manta y té', 'Plan sencillo para no pelearse con el frío.', cozyPlanIcons.blanket, ['teterías', 'cafeterías']),
        plan('museum', 'Museo', 'Cubierto, tranquilo y fácil.', cozyPlanIcons.museum, ['museos'])
      ]
    : [
        plan('warm-cafe', 'Hot coffee', 'With snow or strong cold, keep it close and warm.', cozyPlanIcons.hotCoffee, ['cafes', 'hot chocolate']),
        plan('blanket-tea', 'Blanket and tea', 'Simple plan for cold weather.', cozyPlanIcons.blanket, ['tea rooms', 'cafes']),
        plan('museum', 'Museum', 'Covered, calm, and easy.', cozyPlanIcons.museum, ['museums'])
      ],
  hot: lang === 'es'
    ? [
        plan('ice-cream', 'Helado', 'Hace calor: algo fresco y cercano encaja bien.', cozyPlanIcons.iceCream, ['heladerías', 'cafeterías con terraza']),
        plan('fresh-drink', 'Bebida fresca', 'Mejor hidratarse y bajar el ritmo.', cozyPlanIcons.lemonade, ['zumos naturales', 'limonadas', 'cafeterías']),
        plan('shade-walk', 'Paseo a la sombra', 'Sal un rato evitando el sol fuerte.', cozyPlanIcons.park, ['parques con sombra', 'jardines', 'rutas sombreadas']),
        plan('shaded-terrace', 'Terraza con sombra', 'Plan exterior, pero cómodo.', cozyPlanIcons.terrace, ['terrazas con sombra', 'cafeterías'])
      ]
    : [
        plan('ice-cream', 'Ice cream', 'It is hot: something fresh nearby fits well.', cozyPlanIcons.iceCream, ['ice cream', 'cafes with terrace']),
        plan('fresh-drink', 'Cold drink', 'Hydrate and keep the pace easy.', cozyPlanIcons.lemonade, ['fresh juice', 'lemonade', 'cafes']),
        plan('shade-walk', 'Shaded walk', 'Step out while avoiding strong sun.', cozyPlanIcons.park, ['shaded parks', 'gardens', 'shaded walking routes']),
        plan('shaded-terrace', 'Shaded terrace', 'Outdoor plan, but comfortable.', cozyPlanIcons.terrace, ['shaded terraces', 'cafes'])
      ],
  wind: lang === 'es'
    ? [
        plan('short-walk', 'Paseo corto', 'Con viento, mejor ruta sencilla y sin cargar mucho.', cozyPlanIcons.scenicMap, ['rutas cortas', 'parques cercanos']),
        plan('covered-market', 'Mercado cubierto', 'Un plan cómodo si fuera se mueve demasiado.', cozyPlanIcons.market, ['mercados cubiertos', 'mercados locales']),
        plan('calm-cafe', 'Café tranquilo', 'Pausa fácil y protegida.', cozyPlanIcons.coffeeShop, ['cafeterías'])
      ]
    : [
        plan('short-walk', 'Short walk', 'With wind, choose an easy route and travel light.', cozyPlanIcons.scenicMap, ['short walking routes', 'nearby parks']),
        plan('covered-market', 'Covered market', 'Comfortable plan if outside is too breezy.', cozyPlanIcons.market, ['covered markets', 'local markets']),
        plan('calm-cafe', 'Calm cafe', 'Easy and protected pause.', cozyPlanIcons.coffeeShop, ['cafes'])
      ],
  night: lang === 'es'
    ? [
        plan('calm-dinner', 'Cena tranquila', 'Para esta hora, algo cercano y sin prisa.', cozyPlanIcons.terrace, ['restaurantes tranquilos', 'bares tranquilos']),
        plan('short-walk', 'Paseo corto', 'Un paseo breve si la zona acompaña.', cozyPlanIcons.scenicMap, ['paseos cercanos', 'miradores']),
        plan('stargazing', 'Mirar estrellas', 'Si el cielo está despejado, busca un sitio abierto.', cozyWeatherAssets.stars, ['miradores', 'parques']),
        plan('dessert', 'Café o postre', 'Plan suave para cerrar el día.', cozyPlanIcons.hotCoffee, ['cafeterías', 'pastelerías', 'heladerías'])
      ]
    : [
        plan('calm-dinner', 'Calm dinner', 'At this hour, nearby and unhurried works best.', cozyPlanIcons.terrace, ['quiet restaurants', 'quiet bars']),
        plan('short-walk', 'Short walk', 'A brief walk if the area feels right.', cozyPlanIcons.scenicMap, ['nearby walks', 'viewpoints']),
        plan('stargazing', 'Stargazing', 'If the sky is clear, find an open spot.', cozyWeatherAssets.stars, ['viewpoints', 'parks']),
        plan('dessert', 'Coffee or dessert', 'Soft plan to close the day.', cozyPlanIcons.hotCoffee, ['cafes', 'bakeries', 'ice cream'])
      ],
  fog: lang === 'es'
    ? [
        plan('nearby-cafe', 'Café cercano', 'Con bruma, mejor cerca y fácil.', cozyPlanIcons.coffeeShop, ['cafeterías cercanas']),
        plan('bookstore', 'Librería', 'Plan tranquilo sin depender de la visibilidad.', cozyPlanIcons.books, ['librerías', 'bibliotecas']),
        plan('short-walk', 'Paseo corto', 'Solo si la visibilidad acompaña.', cozyPlanIcons.scenicMap, ['paseos cercanos'])
      ]
    : [
        plan('nearby-cafe', 'Nearby cafe', 'With mist, close and easy is better.', cozyPlanIcons.coffeeShop, ['nearby cafes']),
        plan('bookstore', 'Bookstore', 'Calm plan without depending on visibility.', cozyPlanIcons.books, ['bookstores', 'libraries']),
        plan('short-walk', 'Short walk', 'Only if visibility feels fine.', cozyPlanIcons.scenicMap, ['nearby walks'])
      ]
});

export const getPlanBundle = ({
  weatherCode,
  temperature,
  apparentTemperature,
  windspeed = 0,
  isDay = true,
  lang
}: PlanInput): PlanBundle => {
  if (weatherCode === undefined || temperature === undefined) {
    const neutralPlans = lang === 'es'
      ? [
          plan('neutral-walk', 'Paseo tranquilo', 'Una idea sencilla para empezar el día con calma.', cozyPlanIcons.scenicMap, ['cafeterías', 'parques', 'librerías']),
          plan('neutral-cafe', 'Café tranquilo', 'Una parada cercana siempre encaja bien.', cozyPlanIcons.coffeeShop, ['cafeterías', 'pastelerías']),
          plan('neutral-bookstore', 'Librería cercana', 'Plan sencillo y sin depender del tiempo.', cozyPlanIcons.books, ['librerías', 'bibliotecas'])
        ]
      : [
          plan('neutral-walk', 'Calm walk', 'A simple idea to start the day gently.', cozyPlanIcons.scenicMap, ['cafes', 'parks', 'bookstores']),
          plan('neutral-cafe', 'Calm cafe', 'A nearby pause always fits nicely.', cozyPlanIcons.coffeeShop, ['cafes', 'bakeries']),
          plan('neutral-bookstore', 'Nearby bookstore', 'Simple plan without depending on the weather.', cozyPlanIcons.books, ['bookstores', 'libraries'])
        ];
    return { primary: neutralPlans[0], alternatives: neutralPlans.slice(1) };
  }

  const mood = getWeatherMood(weatherCode, temperature, windspeed, isDay, apparentTemperature ?? temperature);
  const options = plansByMood(lang)[mood] ?? plansByMood(lang).cloudy;
  return {
    primary: options[0],
    alternatives: options.slice(1, 4)
  };
};

export const buildPlanRecommendations = (
  planSuggestion: PlanSuggestion,
  lat: number,
  lon: number,
  lang: Language
): LocalRecommendationResult => ({
  text: planSuggestion.description,
  sections: [
    {
      title: lang === 'es' ? 'Cerca de ti' : 'Near you',
      items: planSuggestion.categories.map((query) => ({
        label: query,
        query,
        url: makeMapsUrl(query, lat, lon)
      }))
    }
  ]
});
