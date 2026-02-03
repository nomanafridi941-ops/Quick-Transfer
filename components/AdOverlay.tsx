import React, { useState, useEffect } from 'react';
import { X, Clock, Zap, MousePointer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AdOverlayProps {
  onComplete: () => void;
  adType: 'send' | 'receive';
}

const AdOverlay: React.FC<AdOverlayProps> = ({ onComplete, adType }) => {
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  // Start countdown only after ad is loaded
  useEffect(() => {
    if (!adLoaded) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [adLoaded]);

  // Simulate ad loading with demo ad
  useEffect(() => {
    // Simulate ad load delay
    const loadTimer = setTimeout(() => {
      setAdLoaded(true);
    }, 500);

    return () => clearTimeout(loadTimer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 dark:border dark:border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Ad Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5" />
            <span className="font-bold text-sm">{t.sponsored}</span>
          </div>
          <div className="flex items-center gap-3">
            {!canSkip ? (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">{countdown}s</span>
              </div>
            ) : (
              <button
                onClick={onComplete}
                className="flex items-center gap-1 bg-white text-red-500 px-4 py-1.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-all"
              >
                {t.skip} <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ad Content - Real Ad */}
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[250px] relative">
            {/* Loading indicator while ad loads */}
            {!adLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-10 h-10 border-4 border-red-200 dark:border-red-500/30 border-t-red-500 rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-500 dark:text-gray-300">Loading...</p>
              </div>
            )}
            {/* Demo Ad Container - 300x250 */}
            {adLoaded && (
              <div 
                className="flex flex-col justify-center items-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
                style={{ width: '300px', height: '250px' }}
              >
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MousePointer className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Your Ad Here</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">300 × 250</p>
                  <div className="text-xs text-slate-400 dark:text-slate-500 px-3 py-1 bg-white/50 dark:bg-slate-900/50 rounded-full inline-block">
                    Demo Advertisement
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ad Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-400">
              {adType === 'send' 
                ? t.preparingFile 
                : t.fetchingFile}
            </p>
            <div className="mt-2 h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-1000"
                style={{ width: adLoaded ? `${((5 - countdown) / 5) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdOverlay;
