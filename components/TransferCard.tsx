
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Download, FileText, X, Loader2, Users, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TransferCardProps {
  type: 'send' | 'receive';
  onSend?: (file: File, expiryMinutes: number) => void;
  onReceive?: (code: string) => void;
  loading?: boolean;
  initialCode?: string;
}

const TransferCard: React.FC<TransferCardProps> = ({ type, onSend, onReceive, loading, initialCode }) => {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [expiryMinutes, setExpiryMinutes] = useState<number>(10);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Maximum file size: 100MB
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

  // Pre-fill code from URL (QR scan)
  useEffect(() => {
    if (initialCode && type === 'receive') {
      setCode(initialCode);
    }
  }, [initialCode, type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      if (totalSize > MAX_FILE_SIZE) {
        setFileError('Total size exceeds 100MB limit. Please select fewer or smaller files.');
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setFileError('');
      setSelectedFiles(files);
    }
  };

  const handleSend = () => {
    if (selectedFiles.length && onSend) {
      // Call onSend for each file so parent can handle files individually
      for (const f of selectedFiles) {
        try {
          onSend(f as unknown as File, expiryMinutes as number);
        } catch (err) {
          // ignore individual errors here; parent will report if needed
        }
      }
    }
  };

  const expiryOptions = [5, 10];

  const handleReceive = () => {
    if (code.length === 6 && onReceive) {
      onReceive(code);
    }
  };

  // downloadOptions removed - download limit option disabled

  if (type === 'send') {
    return (
      <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-xl dark:border dark:border-white/10 rounded-2xl p-8 custom-shadow flex flex-col gap-6 transition-all hover:scale-[1.01] w-full max-w-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.sendFile}</h2>
          <p className="text-sm text-gray-400 dark:text-gray-400 mt-1">{t.sendHelper}</p>
        </div>
        
        {selectedFiles.length === 0 ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-h-[160px] border-2 border-dashed border-gray-100 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/50 group transition-all"
          >
            <div className="bg-red-50 dark:bg-red-500/20 p-4 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-500/30 transition-colors mb-3">
              <Plus className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Click to select files</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Maximum total size: 100MB</p>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              multiple
            />
          </div>
        ) : (
          <div className="flex-1 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-100 dark:border-slate-600">
            <div className="flex flex-col gap-2">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 truncate max-w-[150px]">{file.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => {
                    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                    setFileError('');
                  }} className="text-gray-400 hover:text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Total size: {(selectedFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button onClick={() => {
              setSelectedFiles([]);
              setFileError('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }} className="mt-3 text-gray-400 hover:text-red-500">
              <X className="w-5 h-5" /> Remove all
            </button>
          </div>
        )}

        {/* File size error message */}
        {fileError && (
          <div className="bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-xl p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{fileError}</p>
          </div>
        )}

        {/* Download limit option removed per request */}

        {/* Expiry Time Selector */}
        {selectedFiles.length > 0 && (
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-100 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.expiryTime || 'Expiry Time'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {expiryOptions.map((mins) => (
                <button
                  key={mins}
                  onClick={() => setExpiryMinutes(mins)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    expiryMinutes === mins
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-600 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-slate-500 hover:border-red-300 dark:hover:border-red-500'
                  }`}
                >
                  {mins} {t.minutes || 'min'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          disabled={selectedFiles.length === 0 || loading}
          onClick={handleSend}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
            selectedFiles.length > 0 && !loading ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/25 dark:shadow-red-500/20' : 'bg-gray-200 dark:bg-slate-700 cursor-not-allowed text-gray-400 dark:text-gray-500'
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
