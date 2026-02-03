import React, { useEffect, useRef, useState } from 'react';

interface DemoAdProps {
  size: '468x60' | '300x250' | '160x300' | '160x600' | '320x50' | '728x90';
  label?: string;
}

const adConfigs: Record<string, { key: string; width: number; height: number }> = {
  '728x90': { key: 'c5d97d6d1ecc30b8a042c176dc9893a4', width: 728, height: 90 },
  '468x60': { key: '5b98560d19e63c6c041f75cc6e58ca45', width: 468, height: 60 },
  '300x250': { key: '7288f548b0a9b206ac8797f9dd309058', width: 300, height: 250 },
  '320x50': { key: '579f81a3f62b6d79cd4eef433d9dc487', width: 320, height: 50 },
};

const DemoAd: React.FC<DemoAdProps> = ({ size }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [adId] = useState(() => `ad-${size}-${Math.random().toString(36).substr(2, 9)}`);

  const config = adConfigs[size];

  useEffect(() => {
    if (!config || !adContainerRef.current) return;
    
    const container = adContainerRef.current;
    
    // Clear previous content
    container.innerHTML = '';

    // Set atOptions on window with unique timing
    const loadAd = () => {
      (window as any).atOptions = {
        'key': config.key,
        'format': 'iframe',
        'height': config.height,
        'width': config.width,
        'params': {}
      };

      // Create and append the script
      const script = document.createElement('script');
      script.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;
      script.async = true;
      container.appendChild(script);
    };

    // Small delay to prevent conflicts between multiple ads
    const timer = setTimeout(loadAd, 100);

    return () => {
      clearTimeout(timer);
      container.innerHTML = '';
    };
  }, [config, adId]);

  // Fallback for sizes without real ads
  if (!config) {
    return (
      <div 
        className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-500 rounded-xl flex flex-col items-center justify-center mx-auto"
        style={{ width: size.split('x')[0] + 'px', height: size.split('x')[1] + 'px', maxWidth: '100%' }}
      >
        <div className="bg-gray-300 dark:bg-slate-500 px-3 py-1 rounded-full text-xs font-bold text-gray-600 dark:text-gray-200 mb-2">
          AD SPACE
        </div>
        <p className="text-gray-500 dark:text-gray-300 text-sm font-medium">{size}</p>
      </div>
    );
  }

  return (
    <div 
      id={adId}
      ref={adContainerRef}
      className="flex items-center justify-center mx-auto"
      style={{ minWidth: config.width + 'px', minHeight: config.height + 'px', maxWidth: '100%' }}
    />
  );
};

export default DemoAd;
