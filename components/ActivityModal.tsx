import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { getLocalRecommendations, LocalRecommendationResult, RecommendationItem } from '../services/cozyService';
import { buildPlanRecommendations, PlanSuggestion } from '../services/planService';

interface ActivityModalProps {
  onClose: () => void;
  lat: number;
  lon: number;
  weatherCode: number;
  temp: number;
  activityContext: string;
  lang: 'es' | 'en';
  selectedPlan?: PlanSuggestion;
}

const openExternalUrl = async (url: string) => {
  if (!Capacitor.isNativePlatform()) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  try {
    await Browser.open({ url });
  } catch (error) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

const LinkCard: React.FC<{ item: RecommendationItem }> = ({ item }) => (
  <button
    type="button"
    onClick={() => openExternalUrl(item.url)}
    className="modal-link-card group flex w-full box-border items-center gap-3 rounded-2xl border border-white/80 bg-[#fffaf0]/90 p-3 shadow-sm transition-all hover:border-[#eacb82] hover:bg-white hover:shadow-md active:scale-[0.98]"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7d6cc] text-[#b86f68] transition-colors group-hover:bg-[#f3c7bd]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-left text-sm font-black capitalize text-[#4d382f] transition-colors group-hover:text-[#8e5d35]">{item.label}</p>
      <p className="text-left text-[10px] font-black uppercase tracking-wide text-[#9c8c80]">Google Maps</p>
    </div>
    <div className="shrink-0 text-[#b5792c] transition-transform group-hover:translate-x-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  </button>
);

const ActivityModal: React.FC<ActivityModalProps> = ({ onClose, lat, lon, weatherCode, temp, activityContext, lang, selectedPlan }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string>('');
  const [recommendations, setRecommendations] = useState<LocalRecommendationResult | null>(null);
  const modalTitle = selectedPlan?.title ?? (lang === 'es' ? 'Planes cercanos' : 'Nearby plans');
  const modalSubtitle = selectedPlan?.description ?? activityContext;
  const showIntroText = !selectedPlan && Boolean(content);

  useEffect(() => {
    let isMounted = true;

    const fetchPlans = async () => {
      setLoading(true);
      const result = selectedPlan
        ? buildPlanRecommendations(selectedPlan, lat, lon, lang)
        : await getLocalRecommendations(lat, lon, weatherCode, temp, activityContext, lang);
      if (!isMounted) return;

      setContent(result.text);
      setRecommendations(result);
      setLoading(false);
    };

    fetchPlans();

    return () => { isMounted = false; };
  }, [lat, lon, weatherCode, temp, activityContext, lang, selectedPlan]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="modal-backdrop-enter absolute inset-0 bg-[#4d382f]/35 backdrop-blur-sm" onClick={onClose}></div>

      <div className="cozy-modal-card modal-card-enter storybook-paper relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-[2rem] border border-white/85 shadow-2xl sm:max-w-lg">
        <div className="cozy-modal-header z-10 flex shrink-0 items-start justify-between border-b border-[#eadbc8]/70 bg-[#fff7e7]/92 p-5 pb-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-black leading-tight text-[#4d382f]">
              {modalTitle}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#b5792c]">
              {modalSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 shrink-0 rounded-full border border-white/80 bg-white/80 p-2 text-[#7c6a62] shadow-sm transition hover:bg-white"
            aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="cozy-modal-body flex-1 overflow-y-auto overflow-x-hidden p-5 pt-4 scrollbar-thin scrollbar-thumb-[#e6c2b7] scrollbar-track-transparent">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f3d4ca] border-t-[#d98c84]"></div>
              <p className="animate-pulse font-bold text-[#9c8c80]">
                {lang === 'es' ? 'Preparando planes cercanos...' : 'Preparing nearby plans...'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {showIntroText && (
                <div className="rounded-2xl bg-white/58 p-4 text-sm font-bold leading-relaxed text-[#6f574b]">
                  {content}
                </div>
              )}

              {recommendations?.sections.map((section, sectionIndex) => (
                <div
                  key={section.title}
                  className={`${sectionIndex === 0 ? 'border-[#f3d4ca] bg-[#fffaf0]/70' : 'border-[#eacb82]/60 bg-[#fff7e7]/72'} w-full box-border rounded-2xl border p-4`}
                >
                  <h4 className={`mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${sectionIndex === 0 ? 'text-[#d98c84]' : 'text-[#b5792c]'}`}>
                    <span className="h-2 w-2 rounded-full bg-current"></span> {section.title}
                  </h4>
                  <div className="grid w-full grid-cols-1 gap-2">
                    {section.items.map((item) => (
                      <LinkCard key={item.url} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cozy-modal-footer shrink-0 border-t border-[#eadbc8]/70 bg-white/45 p-4 text-center text-xs font-bold text-[#9c8c80]">
          {lang === 'es' ? 'Búsquedas abiertas en Google Maps' : 'Searches open in Google Maps'}
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
