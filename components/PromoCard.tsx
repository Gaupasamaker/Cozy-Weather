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
    capture: 'COMPARTE UNA TARJETA COZY',
    shareImage: 'Compartir imagen',
    shareLink: 'Compartir enlace',
    shareX: 'X / Twitter',
    shareWhatsApp: 'WhatsApp',
    preparing: 'Preparando imagen...',
    close: 'Cerrar',
    copied: 'Enlace copiado',
    imageReady: 'Imagen lista',
    imageError: 'No pudimos preparar la imagen',
    socialNote: 'Para redes con imagen, usa Compartir imagen.',
    shareText: 'Mira el tiempo cozy de hoy en Cozy Weather:',
    copyPrompt: 'Copia este enlace:',
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
    capture: 'SHARE A COZY CARD',
    shareImage: 'Share image',
    shareLink: 'Share link',
    shareX: 'X / Twitter',
    shareWhatsApp: 'WhatsApp',
    preparing: 'Preparing image...',
    close: 'Close',
    copied: 'Link copied',
    imageReady: 'Image ready',
    imageError: 'Could not prepare the image',
    socialNote: 'For image-friendly apps, use Share image.',
    shareText: "See today's cozy weather on Cozy Weather:",
    copyPrompt: 'Copy this link:',
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

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
};

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error('Canvas export failed'));
    }, 'image/png', 0.95);
  });

const fitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  initialSize: number,
  weight = 900
) => {
  let size = initialSize;

  while (size > 34) {
    ctx.font = `${weight} ${size}px Nunito, Quicksand, Arial, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 3;
  }

  return size;
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
  const [status, setStatus] = useState<string | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const conditionKey = getConditionKey(weatherCode, isDay);
  const scene = getHomeSceneAsset(weatherCode, temperature, 0, isDay);
  const weatherAsset = getWeatherAsset(weatherCode, temperature, 0, isDay);
  const shareUrl = window.location.href;
  const socialText = `${t.shareText} ${locationName} - ${Math.round(temperature)}° ${t.condition[conditionKey]}.`;

  const flashStatus = (message: string) => {
    setStatus(message);
    setTimeout(() => setStatus(null), 2400);
  };

  const createSocialImageFile = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas is not available');

    const [sceneImage, weatherImage, leavesImage] = await Promise.all([
      loadImage(scene.src),
      loadImage(weatherAsset.src),
      loadImage(cozyDecorations.leavesAlt.src)
    ]);

    ctx.fillStyle = '#f3e3d6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawImageCover(ctx, sceneImage, 0, 0, canvas.width, canvas.height);

    const softWash = ctx.createLinearGradient(0, 0, 760, 0);
    softWash.addColorStop(0, 'rgba(255, 250, 240, 0.82)');
    softWash.addColorStop(0.55, 'rgba(255, 250, 240, 0.48)');
    softWash.addColorStop(1, 'rgba(255, 250, 240, 0)');
    ctx.fillStyle = softWash;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bottomFade = ctx.createLinearGradient(0, 375, 0, 675);
    bottomFade.addColorStop(0, 'rgba(243, 227, 214, 0)');
    bottomFade.addColorStop(1, 'rgba(243, 227, 214, 0.92)');
    ctx.fillStyle = bottomFade;
    ctx.fillRect(0, 375, canvas.width, 300);

    ctx.fillStyle = '#4d382f';
    ctx.font = '900 58px Nunito, Quicksand, Arial, sans-serif';
    ctx.fillText(t.appTitle, 72, 86);
    ctx.fillStyle = 'rgba(217, 140, 132, 0.55)';
    drawRoundedRect(ctx, 72, 108, 260, 5, 999);
    ctx.fill();

    ctx.fillStyle = '#7c6a62';
    ctx.font = '900 36px Nunito, Quicksand, Arial, sans-serif';
    ctx.fillText(t.subtitle, 72, 185);

    ctx.fillStyle = '#4d382f';
    fitText(ctx, locationName, 620, 76, 900);
    ctx.fillText(locationName, 72, 265);

    ctx.font = '900 160px Nunito, Quicksand, Arial, sans-serif';
    ctx.fillText(`${Math.round(temperature)}°`, 72, 432);
    ctx.drawImage(weatherImage, 80, 454, 88, 88);

    ctx.fillStyle = '#416475';
    fitText(ctx, t.condition[conditionKey], 420, 58, 900);
    ctx.fillText(t.condition[conditionKey], 184, 520);

    drawRoundedRect(ctx, 72, 564, 330, 62, 31);
    ctx.fillStyle = 'rgba(255, 250, 240, 0.82)';
    ctx.fill();
    ctx.drawImage(leavesImage, 90, 572, 46, 46);
    ctx.fillStyle = '#6f5146';
    ctx.font = '900 28px Nunito, Quicksand, Arial, sans-serif';
    ctx.fillText(t.appTitle, 150, 604);

    const blob = await canvasToBlob(canvas);
    return new File([blob], 'cozy-weather-social-card.png', { type: 'image/png' });
  };

  const handleShareImage = async () => {
    setIsPreparingImage(true);

    try {
      const file = await createSocialImageFile();
      const canShareFiles = navigator.canShare?.({ files: [file] }) ?? false;

      if (navigator.share && canShareFiles) {
        await navigator.share({
          title: t.appTitle,
          text: socialText,
          files: [file]
        });
        flashStatus(t.imageReady);
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(imageUrl);
      flashStatus(t.imageReady);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      flashStatus(t.imageError);
    } finally {
      setIsPreparingImage(false);
    }
  };

  const handleShareLink = async () => {
    const text = `${t.shareText} ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t.appTitle,
          text: t.shareText,
          url: shareUrl
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
      flashStatus(t.copied);
      setTimeout(() => setCopied(false), 2200);
      return;
    }

    prompt(t.copyPrompt, shareUrl);
  };

  const openSocialShare = (target: 'x' | 'whatsapp') => {
    const url = target === 'x'
      ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialText)}&url=${encodeURIComponent(shareUrl)}`
      : `https://wa.me/?text=${encodeURIComponent(`${socialText} ${shareUrl}`)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
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

      <div className="absolute left-1/2 top-[35%] z-10 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none">
        <div className="origin-center scale-[0.28] min-[375px]:scale-[0.31] min-[425px]:scale-[0.34] sm:scale-[0.43] md:scale-[0.52] pointer-events-auto">
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

      <div className="absolute inset-x-0 bottom-0 z-[120] flex flex-col items-center gap-3 bg-gradient-to-t from-[#4b372f] via-[#4b372f]/92 to-transparent px-4 pb-6 pt-24">
        <p className="text-center text-sm font-black uppercase tracking-[0.18em] text-[#fff2df]/86">
          {t.capture}
        </p>
        <div className="grid w-full max-w-[22rem] grid-cols-2 gap-2">
          <button
            onClick={handleShareImage}
            disabled={isPreparingImage}
            className="col-span-2 rounded-full bg-[#e09a91] px-6 py-3.5 text-base font-black text-[#fffaf0] shadow-2xl transition hover:bg-[#d98c84] active:scale-95 disabled:cursor-wait disabled:opacity-75"
          >
            {isPreparingImage ? t.preparing : t.shareImage}
          </button>
          <button
            onClick={() => openSocialShare('x')}
            className="rounded-full border border-white/24 bg-[#fffaf0]/14 px-4 py-3 text-sm font-black text-[#fffaf0] shadow-xl transition active:scale-95"
          >
            {t.shareX}
          </button>
          <button
            onClick={() => openSocialShare('whatsapp')}
            className="rounded-full border border-white/24 bg-[#fffaf0]/14 px-4 py-3 text-sm font-black text-[#fffaf0] shadow-xl transition active:scale-95"
          >
            {t.shareWhatsApp}
          </button>
          <button
            onClick={handleShareLink}
            className={`col-span-2 rounded-full px-6 py-3 text-sm font-black shadow-xl transition active:scale-95 ${
              copied
                ? 'bg-[#9fbf94] text-white'
                : 'bg-[#fffaf0] text-[#6f5146]'
            }`}
          >
            {status ?? (copied ? t.copied : t.shareLink)}
          </button>
        </div>
        <p className="max-w-[21rem] text-center text-xs font-bold leading-snug text-[#fff2df]/68">
          {t.socialNote}
        </p>
      </div>
    </div>
  );
};

export default PromoCard;
