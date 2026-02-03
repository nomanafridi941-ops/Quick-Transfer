
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Download, FileText, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TransferCardProps {
  type: 'send' | 'receive';
  onSend?: (file: File) => void;
  onReceive?: (code: string) => void;
  loading?: boolean;
  initialCode?: string;
}

const TransferCard: React.FC<TransferCardProps> = ({ type, onSend, onReceive, loading, initialCode }) => {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill code from URL (QR scan)
  useEffect(() => {
    if (initialCode && type === 'receive') {
      setCode(initialCode);
    }
  }, [initialCode, type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = () => {
    if (selectedFile && onSend) {
      onSend(selectedFile);
    }
  };

  const handleReceive = () => {
    if (code.length === 6 && onReceive) {
      onReceive(code);
    }
  };

  if (type === 'send') {
    return (
      <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-xl dark:border dark:border-white/10 rounded-2xl p-8 custom-shadow flex flex-col gap-6 transition-all hover:scale-[1.01] w-full max-w-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.sendFile}</h2>
          <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">{t.sendHelper}</p>
        </div>
        
        {!selectedFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-h-[160px] border-2 border-dashed border-gray-100 dark:border-slate-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-pink-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/50 group transition-all"
          >
            <div className="bg-red-50 dark:bg-red-500/20 p-4 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-500/30 transition-colors">
              <Plus className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex-1 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 flex items-center justify-between border border-gray-100 dark:border-slate-600">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 truncate max-w-[150px]">{selectedFile.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <button 
          disabled={!selectedFile || loading}
          onClick={handleSend}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
            selectedFile && !loading ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/25 dark:shadow-red-500/20' : 'bg-gray-200 dark:bg-slate-700 cursor-not-allowed text-gray-400 dark:text-gray-500'
          }`}
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? t.sending : t.sendFile.split(' ')[0]}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-xl dark:border dark:border-white/10 rounded-2xl p-8 custom-shadow flex flex-col gap-6 transition-all hover:scale-[1.01] w-full max-w-md">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.receiveFile}</h2>
        <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">{t.receiveHelper}</p>
      </div>
      
      <div className="relative group">
        <label htmlFor="receive-code" className="sr-only">{t.enterCode}</label>
        <input 
          id="receive-code"
          type="text"
          maxLength={6}
          placeholder={t.enterCode}
          aria-label={t.enterCode}
          className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 rounded-xl py-4 px-5 text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500/50 focus:bg-white dark:focus:bg-slate-700 transition-all text-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        />
        <Download className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 dark:text-gray-500 group-focus-within:text-red-400" />
      </div>

      <button 
        disabled={code.length < 6 || loading}
        onClick={handleReceive}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
          code.length === 6 && !loading ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/25 dark:shadow-red-500/20' : 'bg-gray-200 dark:bg-slate-700 cursor-not-allowed text-gray-400 dark:text-gray-500'
        }`}
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? t.receiving : t.receive}
      </button>
    </div>
  );
};

export default TransferCard;
