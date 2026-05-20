import React from 'react';
import { cozyDecorations } from '../lib/cozyAssets';

export type AtmosphereCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'night';

interface WeatherAtmosphereProps {
  condition: AtmosphereCondition;
  isDay: boolean;
  windspeed: number;
  weatherCode: number;
}

const rainDrops = [
  { left: 4, delay: -0.1, duration: 1.35, height: 24 },
  { left: 10, delay: -0.8, duration: 1.6, height: 28 },
  { left: 16, delay: -1.25, duration: 1.45, height: 25 },
  { left: 22, delay: -0.45, duration: 1.72, height: 30 },
  { left: 28, delay: -1.7, duration: 1.52, height: 26 },
  { left: 35, delay: -0.3, duration: 1.4, height: 24 },
  { left: 42, delay: -1.05, duration: 1.68, height: 31 },
  { left: 49, delay: -1.45, duration: 1.5, height: 27 },
  { left: 56, delay: -0.65, duration: 1.78, height: 29 },
  { left: 63, delay: -1.9, duration: 1.42, height: 25 },
  { left: 70, delay: -0.22, duration: 1.62, height: 30 },
  { left: 77, delay: -1.18, duration: 1.48, height: 26 },
  { left: 84, delay: -0.92, duration: 1.7, height: 29 },
  { left: 91, delay: -1.55, duration: 1.46, height: 25 },
  { left: 96, delay: -0.52, duration: 1.82, height: 31 }
];

const mistDrops = [
  { left: 7, delay: -0.9, duration: 2.1, height: 18 },
  { left: 15, delay: -1.8, duration: 2.3, height: 16 },
  { left: 25, delay: -0.2, duration: 2.28, height: 19 },
  { left: 37, delay: -1.45, duration: 2.16, height: 17 },
  { left: 49, delay: -0.7, duration: 2.35, height: 18 },
  { left: 61, delay: -1.1, duration: 2.18, height: 16 },
  { left: 73, delay: -0.35, duration: 2.42, height: 19 },
  { left: 84, delay: -1.72, duration: 2.24, height: 17 },
  { left: 94, delay: -0.55, duration: 2.32, height: 18 }
];

const heavyRainDrops = [
  { left: 2, delay: -0.45, duration: 1.08, height: 34 },
  { left: 13, delay: -1.1, duration: 1.16, height: 36 },
  { left: 31, delay: -0.7, duration: 1.02, height: 32 },
  { left: 46, delay: -1.42, duration: 1.14, height: 38 },
  { left: 58, delay: -0.28, duration: 1.1, height: 35 },
  { left: 68, delay: -1.7, duration: 1.2, height: 39 },
  { left: 81, delay: -0.95, duration: 1.06, height: 33 },
  { left: 98, delay: -1.33, duration: 1.18, height: 37 }
];

const windTrails = [
  { top: 28, left: 4, delay: -1.1, duration: 6.8, width: 54 },
  { top: 46, left: 18, delay: -3.6, duration: 7.4, width: 72 },
  { top: 63, left: 9, delay: -2.2, duration: 6.2, width: 48 }
];

const windLeaves = [
  { top: 24, left: 6, delay: -0.8, duration: 8.6 },
  { top: 39, left: 82, delay: -3.1, duration: 9.2 },
  { top: 56, left: 14, delay: -5.4, duration: 8.2 }
];

const stars = [
  { left: 16, top: 12, delay: 0 },
  { left: 28, top: 21, delay: 0.35 },
  { left: 68, top: 16, delay: 0.7 },
  { left: 82, top: 28, delay: 1.05 }
];

const isHeavyRainCode = (weatherCode: number) =>
  weatherCode === 63 ||
  weatherCode === 65 ||
  weatherCode === 66 ||
  weatherCode === 67 ||
  weatherCode === 81 ||
  weatherCode === 82;

const WeatherAtmosphere: React.FC<WeatherAtmosphereProps> = ({ condition, isDay, windspeed, weatherCode }) => {
  const hasRain = condition === 'rain' || condition === 'storm';
  const rainIntensity = condition === 'storm'
    ? 'storm'
    : isHeavyRainCode(weatherCode)
      ? 'heavy'
      : 'light';
  const isWindy = windspeed >= 18;
  const showWarmGlow = isDay && condition === 'clear';
  const visibleRainDrops = rainIntensity === 'light'
    ? rainDrops
    : [...rainDrops, ...heavyRainDrops];

  return (
    <div className={`weather-atmosphere weather-atmosphere--${condition} weather-atmosphere--rain-${rainIntensity}`} aria-hidden="true">
      {showWarmGlow && <span className="storybook-sun-glow" />}

      <img src={cozyDecorations.cloudCluster.src} alt="" className="storybook-cloud-image storybook-cloud-image--slow left-[6%] top-[8%] w-36 opacity-60" />
      <img src={cozyDecorations.cloud.src} alt="" className="storybook-cloud-image storybook-cloud-image--mid left-[58%] top-[17%] w-28 opacity-45 [animation-delay:-14s]" />
      <img src={cozyDecorations.cloud.src} alt="" className="storybook-cloud-image storybook-cloud-image--fast left-[18%] top-[43%] w-20 opacity-35 [animation-delay:-27s]" />
      {showWarmGlow && (
        <img src={cozyDecorations.flowers.src} alt="" className="storybook-sun-accent right-[7%] top-[58%] w-16 opacity-50" />
      )}

      {hasRain && (
        <>
          <div className="storybook-rain-layer storybook-rain-layer--back">
            {mistDrops.map((drop) => (
              <span
                key={`mist-${drop.left}`}
                className="storybook-rain-drop storybook-rain-drop--soft"
                style={{
                  left: `${drop.left}%`,
                  animationDelay: `${drop.delay}s`,
                  animationDuration: `${drop.duration}s`,
                  height: `${drop.height}px`
                }}
              />
            ))}
          </div>
          <div className="storybook-rain-layer storybook-rain-layer--front">
            {visibleRainDrops.map((drop) => (
              <span
                key={`rain-${drop.left}`}
                className="storybook-rain-drop"
                style={{
                  left: `${drop.left}%`,
                  animationDelay: `${drop.delay}s`,
                  animationDuration: `${drop.duration}s`,
                  height: `${drop.height}px`
                }}
              />
            ))}
          </div>
        </>
      )}

      {(condition === 'cloudy' || isWindy) && (
        <>
          {windTrails.map((trail) => (
            <span
              key={`trail-${trail.top}`}
              className={`storybook-wind-trail ${isWindy ? 'storybook-wind-trail--active' : ''}`}
              style={{
                top: `${trail.top}%`,
                left: `${trail.left}%`,
                width: `${trail.width}px`,
                animationDelay: `${trail.delay}s`,
                animationDuration: `${trail.duration}s`
              }}
            />
          ))}
          {windLeaves.map((leaf, index) => (
            <img
              key={`leaf-${leaf.top}`}
              src={index % 2 === 0 ? cozyDecorations.leaves.src : cozyDecorations.leavesAlt.src}
              alt=""
              className={`storybook-wind-leaf ${isWindy ? 'storybook-wind-leaf--active' : ''}`}
              style={{
                top: `${leaf.top}%`,
                left: `${leaf.left}%`,
                animationDelay: `${leaf.delay}s`,
                animationDuration: `${leaf.duration}s`
              }}
            />
          ))}
        </>
      )}

      {condition === 'night' && stars.map((star) => (
        <span
          key={`star-${star.left}`}
          className="storybook-star"
          style={{ left: `${star.left}%`, top: `${star.top}%`, animationDelay: `${star.delay}s` }}
        />
      ))}
    </div>
  );
};

export default WeatherAtmosphere;
