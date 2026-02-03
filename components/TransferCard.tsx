
import React, { useState, useRef } from 'react';
import { Plus, Download, FileText, X, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TransferCardProps {
  type: 'send' | 'receive';
  onSend?: (file: File) => void;
  onReceive?: (code: string) => void;
  loading?: boolean;
}

const TransferCard: React.FC<TransferCardProps> = ({ type, onSend, onReceive, loading }) => {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <div className="bg-white rounded-2xl p-8 custom-shadow flex flex-col gap-6 transition-all hover:scale-[1.01] w-full max-w-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.sendFile}</h2>
          <p className="text-sm text-gray-400 mt-1">{t.sendHelper}</p>
        </div>
        
        {!selectedFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-h-[160px] border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-pink-50 hover:border-red-200 group transition-all"
          >
            <div className="bg-red-50 p-4 rounded-full group-hover:bg-red-100 transition-colors">
              <Plus className="w-10 h-10 text-red-500" />
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex-1 bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 truncate max-w-[150px]">{selectedFile.name}</p>
                <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
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
            selectedFile && !loading ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200' : 'bg-gray-200 cursor-not-allowed text-gray-400'
          }`}
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? t.sending : t.sendFile.split(' ')[0]}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 custom-shadow flex flex-col gap-6 transition-all hover:scale-[1.01] w-full max-w-md">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{t.receiveFile}</h2>
        <p className="text-sm text-gray-400 mt-1">{t.receiveHelper}</p>
      </div>
      
      <div className="relative group">
        <label htmlFor="receive-code" className="sr-only">{t.enterCode}</label>
        <input 
          id="receive-code"
          type="text"
          maxLength={6}
          placeholder={t.enterCode}
          aria-label={t.enterCode}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-5 text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all text-gray-700"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        />
        <Download className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-red-400" />
      </div>

      <button 
        disabled={code.length < 6 || loading}
        onClick={handleReceive}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
          code.length === 6 && !loading ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200' : 'bg-gray-200 cursor-not-allowed text-gray-400'
        }`}
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? t.receiving : t.receive}
      </button>
    </div>
  );
};

export default TransferCard;
