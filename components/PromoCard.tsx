import React, { useState } from 'react';
import { cozyDecorations, getHomeSceneAsset, getWeatherAsset } from '../lib/cozyAssets';

interface PromoCardProps {
  onClose: () => void;
  weatherCode: number;
  temperature: number;
  isDay: boolean;
  locationName: string;
  language: 'es' | 'en';
}

const translations = {
  es: {
    appTitle: 'Cozy Weather',
    subtitle: 'El tiempo cozy en',
    footer: 'Un momento sencillo para mirar el cielo con calma.',
    capture: 'Haz una captura o comparte el enlace',
    shareLink: 'Compartir enlace',
    close: 'Cerrar',
    copied: 'Enlace copiado',
    shareText: 'Mira el tiempo cozy de hoy en Cozy Weather:',
    condition: {
      clear: 'Soleado',
      cloudy: 'Nublado',
      rain: 'Lluvia',
      snow: 'Nieve',
      storm: 'Tormenta',
      fog: 'Bruma',
      night: 'Noche tranquila'
    }
  },
  en: {
    appTitle: 'Cozy Weather',
    subtitle: 'Cozy weather in',
    footer: 'A simple moment to check the sky with calm.',
    capture: 'Take a screenshot or share the link',
    shareLink: 'Share link',
    close: 'Close',
    copied: 'Link copied',
    shareText: 'See today’s cozy weather on Cozy Weather:',
    condition: {
      clear: 'Sunny',
      cloudy: 'Cloudy',
      rain: 'Rain',
      snow: 'Snow',
      storm: 'Storm',
      fog: 'Misty',
      night: 'Quiet night'
    }
  }
};

type ConditionKey = keyof typeof translations.es.condition;

const getConditionKey = (weatherCode: number, isDay: boolean): ConditionKey => {
  if (!isDay) return 'night';
  if (weatherCode >= 95) return 'storm';
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) return 'snow';
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return 'rain';
  if (weatherCode === 45 || weatherCode === 48) return 'fog';
  if (weatherCode === 0 || weatherCode === 1) return 'clear';
  return 'cloudy';
};

const PromoCard: React.FC<PromoCardProps> = ({
  onClose,
  weatherCode,
  temperature,
  isDay,
  locationName,
  language
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const conditionKey = getConditionKey(weatherCode, isDay);
  const scene = getHomeSceneAsset(weatherCode, temperature, 0, isDay);
  const weatherAsset = getWeatherAsset(weatherCode, temperature, 0, isDay);

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${t.shareText} ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cozy Weather',
          text: t.shareText,
          url
        });
        return;
      } catch {
        // User cancellation is fine; fall back to copy.
      }
    }

    let success = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      return;
    }

    prompt(language === 'es' ? 'Copia este enlace:' : 'Copy this link:', url);
  };

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-full overflow-hidden bg-[#4b372f]/82 backdrop-blur-md">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-[130] flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-[#fffaf0]/74 text-2xl font-black leading-none text-[#7a5b4f] shadow-xl backdrop-blur-md transition active:scale-95"
        aria-label={t.close}
      >
        ×
      </button>

      <div className="absolute left-1/2 top-[43%] z-10 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none">
        <div className="origin-center scale-[0.36] min-[375px]:scale-[0.39] min-[425px]:scale-[0.43] sm:scale-[0.52] md:scale-[0.62] pointer-events-auto">
          <div
            id="social-card"
            className="relative h-[1400px] w-[900px] overflow-hidden rounded-[4.5rem] border-[10px] border-[#fffaf0] bg-[#f3e3d6] shadow-2xl"
          >
            <div className="absolute inset-x-0 top-0 h-[900px] overflow-hidden">
              <img src={scene.src} alt="" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#fff6dc]/10 via-transparent to-[#f3e3d6]"></div>
            </div>

            <div className="relative z-10 flex h-full flex-col px-20 py-16">
              <header className="text-center">
                <p className="text-7xl font-black tracking-normal text-[#4d382f]">{t.appTitle}</p>
                <div className="mx-auto mt-5 h-1 w-60 rounded-full bg-[#d98c84]/50"></div>
              </header>

              <section className="mt-24 max-w-[560px]">
                <p className="mb-5 text-4xl font-black text-[#7c6a62]">{t.subtitle}</p>
                <h1 className="text-8xl font-black leading-[0.95] tracking-normal text-[#4d382f] drop-shadow-[0_2px_12px_rgba(255,250,240,0.72)]">
                  {locationName}
                </h1>
                <div className="mt-12 flex items-end gap-8">
                  <span className="text-[13rem] font-black leading-[0.76] text-[#4d382f] drop-shadow-[0_3px_16px_rgba(255,250,240,0.7)]">
                    {Math.round(temperature)}°
                  </span>
                </div>
                <div className="mt-8 flex items-center gap-5">
                  <img src={weatherAsset.src} alt={weatherAsset.alt[language]} className="h-24 w-24 object-contain drop-shadow-xl" />
                  <p className="text-6xl font-black text-[#416475]">{t.condition[conditionKey]}</p>
                </div>
              </section>

              <section className="mt-auto rounded-[3.2rem] border border-white/78 bg-[#fffaf0]/82 p-10 shadow-[0_28px_70px_rgba(92,64,45,0.16)] backdrop-blur-md">
                <div className="flex items-center gap-8">
                  <img src={cozyDecorations.leavesAlt.src} alt="" className="h-28 w-28 object-contain" />
                  <div>
                    <p className="text-4xl font-black leading-tight text-[#5f4b42]">{t.footer}</p>
                    <p className="mt-4 text-3xl font-bold text-[#9a7b6d]">{t.appTitle}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[120] flex flex-col items-center gap-4 bg-gradient-to-t from-[#4b372f] via-[#4b372f]/92 to-transparent px-4 pb-7 pt-24">
        <p className="text-center text-sm font-black uppercase tracking-[0.18em] text-[#fff2df]/86">
          {t.capture}
        </p>
        <button
          onClick={handleShare}
          className={`rounded-full px-8 py-4 text-lg font-black shadow-2xl transition active:scale-95 ${
            copied
              ? 'bg-[#9fbf94] text-white'
              : 'bg-[#e09a91] text-[#fffaf0] hover:bg-[#d98c84]'
          }`}
        >
          {copied ? t.copied : t.shareLink}
        </button>
      </div>
    </div>
  );
};

export default PromoCard;
