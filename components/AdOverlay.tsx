import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Zap } from 'lucide-react';
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
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

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

  // Load the real ad script
  useEffect(() => {
    if (adContainerRef.current && !adLoadedRef.current) {
      adLoadedRef.current = true;
      
      // Set atOptions on window for 300x250 ad
      (window as any).atOptions = {
        'key': '7288f548b0a9b206ac8797f9dd309058',
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };

      // Create and append the script
      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/7288f548b0a9b206ac8797f9dd309058/invoke.js';
      script.async = true;
      
      script.onload = () => {
        setTimeout(() => setAdLoaded(true), 500);
      };
      
      script.onerror = () => {
        setTimeout(() => setAdLoaded(true), 1000);
      };
      
      adContainerRef.current.appendChild(script);

      return () => {
        if (adContainerRef.current) {
          adContainerRef.current.innerHTML = '';
        }
        adLoadedRef.current = false;
      };
    }
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
            {/* Real Ad Container - 300x250 */}
            <div 
              ref={adContainerRef}
              className="flex justify-center items-center"
              style={{ minWidth: '300px', minHeight: '250px' }}
            />
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
