
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TransferCard from './components/TransferCard';
import ResultView from './components/ResultView';
import AdOverlay from './components/AdOverlay';
import DemoAd from './components/DemoAd';
import TransferHistory from './components/TransferHistory';
import { AppState, TransferData } from './types';
import { generateCode, saveData, getDataByCode } from './services/storage';
import { addToHistory } from './services/history';
import { useLanguage } from './context/LanguageContext';
import { AlertCircle, HelpCircle, Rocket, Send, X } from 'lucide-react';

const App: React.FC = () => {
  const { t } = useLanguage();
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [currentData, setCurrentData] = useState<TransferData | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'SENT' | 'RECEIVED'>('SENT');
  const [showAd, setShowAd] = useState(false);
  const [adType, setAdType] = useState<'send' | 'receive'>('send');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingMaxDownloads, setPendingMaxDownloads] = useState<number>(1);
  const [pendingExpiryMinutes, setPendingExpiryMinutes] = useState<number>(10);
  const [pendingCode, setPendingCode] = useState<string>('');
  const [urlCode, setUrlCode] = useState<string>('');

  // Check for code in URL on load (from QR scan)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    if (codeFromUrl && codeFromUrl.length === 6) {
      setUrlCode(codeFromUrl);
      // Clear the URL parameter without reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Show ad before sending
  const handleSend = (file: File, maxDownloads: number, expiryMinutes: number) => {
    setPendingFile(file);
    setPendingMaxDownloads(maxDownloads);
    setPendingExpiryMinutes(expiryMinutes);
    setAdType('send');
    setShowAd(true);
  };

  // Actually send after ad is completed
  const processSend = async () => {
    if (!pendingFile) return;
    
    setAppState('SENDING');
    setError(null);
    
    const file = pendingFile;
    setPendingFile(null);
    
    // Convert to base64 for cloud storage
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const transfer: TransferData = {
        id: crypto.randomUUID(),
        code: generateCode(),
        name: file.name,
        size: file.size,
        type: file.type,
        content: reader.result as string,
        createdAt: Date.now(),
        expiresAt: Date.now() + pendingExpiryMinutes * 60 * 1000, // Dynamic expiry
        maxDownloads: pendingMaxDownloads,
        downloadCount: 0,
      };

      try {
        await saveData(transfer);
        // Save to local history
        addToHistory({
          code: transfer.code,
          name: transfer.name,
          size: transfer.size,
          type: 'sent',
          maxDownloads: transfer.maxDownloads,
          expiryMinutes: pendingExpiryMinutes,
        });
        setCurrentData(transfer);
        setMode('SENT');
        setAppState('COMPLETE');
      } catch (err) {
        setError(t.failedUpload);
        setAppState('IDLE');
      }
    };
    reader.onerror = () => {
      setError(t.failedRead);
      setAppState('IDLE');
    };
  };

  // Show ad before receiving
  const handleReceive = (code: string) => {
    setPendingCode(code);
    setAdType('receive');
    setShowAd(true);
  };

  // Actually receive after ad is completed
  const processReceive = async () => {
    if (!pendingCode) return;
    
    setAppState('RECEIVING');
    setError(null);
    
    const code = pendingCode;
    setPendingCode('');

    try {
      const result = await getDataByCode(code);
      if (result.data) {
        // Save to local history
        addToHistory({
          code: result.data.code,
          name: result.data.name,
          size: result.data.size,
          type: 'received',
        });
        setCurrentData(result.data);
        setMode('RECEIVED');
        setAppState('COMPLETE');
      } else if (result.error === 'expired') {
        setError(t.codeExpired || 'This transfer code is no longer valid.');
        setAppState('IDLE');
      } else {
        setError(t.invalidCode);
        setAppState('IDLE');
      }
    } catch (err) {
      setError(t.invalidCode);
      setAppState('IDLE');
    }
  };

  // Handle ad completion
  const handleAdComplete = () => {
    setShowAd(false);
    if (adType === 'send') {
      processSend();
    } else {
      processReceive();
    }
  };

  const reset = () => {
    setAppState('IDLE');
    setCurrentData(undefined);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col hero-gradient dark:bg-slate-900">
      {/* Ad Overlay */}
      {showAd && (
        <AdOverlay onComplete={handleAdComplete} adType={adType} />
      )}
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-red-100 dark:bg-red-500/10 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-100 dark:bg-purple-500/10 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-transparent dark:bg-blue-500/5 rounded-full blur-3xl opacity-0 dark:opacity-100 -z-10" />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {appState === 'COMPLETE' ? (
            <div className="lg:col-span-2">
              <ResultView data={currentData} mode={mode} onBack={reset} />
            </div>
          ) : (
            <>
              {/* Left Side: Product Illustration & Copy */}
              <section className="flex flex-col gap-8 order-2 lg:order-1">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-red-500 w-8 h-2 rounded-full" />
                    <span className="text-red-500 font-bold uppercase tracking-wider text-sm">{t.fastSecure}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 dark:text-white leading-tight mb-6">
                    {t.shareAnything} <br />
                    <span className="text-red-500 dark:text-red-400">{t.instantly}</span>
                  </h1>
                  <p className="text-lg text-gray-500 dark:text-gray-300 leading-relaxed mb-4">
                    {t.heroDescription}
                  </p>
                  <p className="text-sm font-semibold text-gray-400 dark:text-gray-400 tracking-wide">
                    {t.trustLine}
                  </p>
                </div>

                {/* Simulated UI Snapshot (as seen in prompt image) */}
                <div className="relative mt-8 hidden sm:block">
                  <div className="bg-white/60 dark:bg-slate-800/60 dark:glass-effect backdrop-blur-sm p-4 rounded-2xl custom-shadow border border-white/40 dark:border-white/10 flex items-center gap-4 w-fit">
                    <div className="bg-red-50 dark:bg-red-500/20 p-2 rounded-xl">
                      <Send className="w-6 h-6 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-100">Project_Final_v2.zip</p>
                      <p className="text-xs text-gray-400 dark:text-gray-400">12.4 MB • Sent 2m ago</p>
                    </div>
                    <div className="ml-4 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-lg text-xs font-mono font-bold text-gray-600 dark:text-gray-200">
                      492 103
                    </div>
                  </div>
                </div>
              </section>

              {/* Right Side: Action Cards */}
              <section className="flex flex-col gap-6 order-1 lg:order-2">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-6 sm:max-w-md mx-auto w-full">
                  <TransferCard 
                    type="send" 
                    onSend={handleSend} 
                    loading={appState === 'SENDING'} 
                  />
                  <TransferCard 
                    type="receive" 
                    onReceive={handleReceive} 
                    loading={appState === 'RECEIVING'}
                    initialCode={urlCode}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Transfer History Button */}
      <TransferHistory onCodeClick={(code) => {
        setUrlCode(code);
      }} />

      {/* Floating Help Button */}
      <a href="/help" className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-2xl hover:bg-red-600 transition-all flex items-center gap-2 group z-50">
        <HelpCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
          {t.needHelp}
        </span>
      </a>

      {/* Demo Ad Banner - Above Footer */}
      <div className="bg-white dark:bg-slate-800/50 py-6 border-t border-gray-100 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <DemoAd size="728x90" mobileSize="320x50" />
        </div>
      </div>

      {/* Footer Meta */}
      <footer className="bg-gray-50/50 dark:bg-slate-900/80 py-8 md:py-12 border-t border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile Footer */}
          <div className="flex flex-col items-center gap-6 md:hidden">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-red-500 to-pink-500 p-1.5 rounded-lg">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-700 dark:text-white">QuickTransfer</span>
            </div>
            
            {/* Links Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-center text-sm">
              <a href="/help" className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">{t.howItWorks}</a>
              <a href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">{t.terms}</a>
              <a href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">{t.privacy}</a>
              <a href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">{t.contact}</a>
            </div>
            
            {/* Divider */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
            
            {/* Copyright */}
            <p className="text-xs text-gray-400 dark:text-gray-500">© 2026 QuickTransfer Inc.</p>
            <p className="text-xs text-gray-300 dark:text-gray-600">{t.allRightsReserved}</p>
          </div>
          
          {/* Desktop Footer */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-2 grayscale opacity-50">
              <Rocket className="w-5 h-5 dark:text-white" />
              <span className="font-bold dark:text-white">QuickTransfer</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400 dark:text-gray-400 font-medium">
              <a href="/help" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">{t.howItWorks}</a>
              <a href="/terms" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">{t.terms}</a>
              <a href="/privacy" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">{t.privacy}</a>
              <a href="/contact" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">{t.contact}</a>
            </div>
            <p className="text-xs text-gray-300 dark:text-gray-500">© 2026 QuickTransfer Inc. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
