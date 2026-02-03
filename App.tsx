
import React, { useState } from 'react';
import Header from './components/Header';
import TransferCard from './components/TransferCard';
import ResultView from './components/ResultView';
import AdOverlay from './components/AdOverlay';
import { AppState, TransferData } from './types';
import { generateCode, saveData, getDataByCode } from './services/storage';
import { AlertCircle, HelpCircle, Send, X } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [currentData, setCurrentData] = useState<TransferData | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'SENT' | 'RECEIVED'>('SENT');
  const [showAd, setShowAd] = useState(false);
  const [adType, setAdType] = useState<'send' | 'receive'>('send');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingCode, setPendingCode] = useState<string>('');

  // Show ad before sending
  const handleSend = (file: File) => {
    setPendingFile(file);
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
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };

      try {
        await saveData(transfer);
        setCurrentData(transfer);
        setMode('SENT');
        setAppState('COMPLETE');
      } catch (err) {
        setError("Failed to upload file. Please try again.");
        setAppState('IDLE');
      }
    };
    reader.onerror = () => {
      setError("Failed to read file");
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
      const data = await getDataByCode(code);
      if (data) {
        setCurrentData(data);
        setMode('RECEIVED');
        setAppState('COMPLETE');
      } else {
        setError("Invalid or expired key. Please try again.");
        setAppState('IDLE');
      }
    } catch (err) {
      setError("Failed to retrieve data. Please try again.");
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
    <div className="min-h-screen flex flex-col hero-gradient">
      {/* Ad Overlay */}
      {showAd && (
        <AdOverlay onComplete={handleAdComplete} adType={adType} />
      )}
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {appState === 'COMPLETE' ? (
            <div className="lg:col-span-2">
              <ResultView data={currentData} mode={mode} onBack={reset} />
            </div>
          ) : (
            <>
              {/* Left Side: Product Illustration & Copy */}
              <div className="flex flex-col gap-8 order-2 lg:order-1">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-red-500 w-8 h-2 rounded-full" />
                    <span className="text-red-500 font-bold uppercase tracking-wider text-sm">Fast & Secure</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 leading-tight mb-6">
                    Share anything, <br />
                    <span className="text-red-500">Instantly.</span>
                  </h1>
                  <p className="text-lg text-gray-500 leading-relaxed mb-8">
                    The easiest way to send files across devices. Just upload your content, get a 6-digit key, and share it. No sign-up required.
                  </p>
                </div>

                {/* Simulated UI Snapshot (as seen in prompt image) */}
                <div className="relative mt-8 hidden sm:block">
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl custom-shadow border border-white/40 flex items-center gap-4 w-fit">
                    <div className="bg-red-50 p-2 rounded-xl">
                      <Send className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">Project_Final_v2.zip</p>
                      <p className="text-xs text-gray-400">12.4 MB • Sent 2m ago</p>
                    </div>
                    <div className="ml-4 bg-gray-100 px-3 py-1 rounded-lg text-xs font-mono font-bold text-gray-600">
                      492 103
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Action Cards */}
              <div className="flex flex-col gap-6 order-1 lg:order-2">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
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
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Floating Help Button */}
      <a href="/help" className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-2xl hover:bg-red-600 transition-all flex items-center gap-2 group z-50">
        <HelpCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
          Need Help?
        </span>
      </a>

      {/* Footer Meta */}
      <footer className="bg-gray-50/50 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-2 grayscale opacity-50">
             <Send className="w-5 h-5" />
             <span className="font-bold">QuickTransfer</span>
           </div>
           <div className="flex gap-8 text-sm text-gray-400 font-medium">
             <a href="/terms" className="hover:text-red-500">Terms</a>
             <a href="/privacy" className="hover:text-red-500">Privacy</a>
             <a href="/help" className="hover:text-red-500">Help Center</a>
             <a href="/contact" className="hover:text-red-500">Contact</a>
           </div>
           <p className="text-xs text-gray-300">© 2026 QuickTransfer Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
