
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ArrowLeft, CheckCircle2, FileText, Info, FileCode, Paperclip, Check } from 'lucide-react';
import { TransferData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { deleteTransfer } from '../services/storage';

interface ResultViewProps {
  data?: TransferData;
  mode: 'SENT' | 'RECEIVED';
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ data, mode, onBack }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  if (!data) return null;

  const downloadFile = async () => {
    const link = document.createElement('a');
    link.href = data.content;
    link.download = data.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Auto-delete from database after download
    try {
      await deleteTransfer(data.code);
      setDownloaded(true);
    } catch (error) {
      console.error('Failed to delete transfer:', error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-8 custom-shadow w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-800 transition-colors flex items-center gap-1 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{t.transferAnother}</span>
        </button>
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">{t.fileReady}</span>
        </div>
      </div>

      {mode === 'SENT' ? (
        <div className="text-center">
          <p className="text-gray-500 mb-2">{t.shareCode}</p>
          <div className="bg-red-50 text-red-600 text-6xl font-black tracking-tighter py-6 rounded-2xl mb-8">
            {data.code}
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center gap-4 mb-8">
             <div className="bg-white p-3 rounded-xl shadow-sm">
                <QRCodeSVG value={data.code} size={150} />
             </div>
             <p className="text-xs text-gray-400 flex items-center gap-1">
               <span className="flex items-center gap-1"><Info className="w-3 h-3" /> {t.codeExpires}</span>
             </p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleCopyCode}
              className="w-full bg-red-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-100"
            >
              <Share2 className="w-5 h-5" />
              {copied ? t.copied : t.copyCode}
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
            >
              <Check className="w-5 h-5" />
              {t.transferAnother}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-800 mb-1">{data.name}</h3>
            <p className="text-gray-400 text-sm font-medium">{(data.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          {/* File Preview / Details Section */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">File Details</h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Filename</p>
                  <p className="text-sm font-semibold text-gray-700 break-all">{data.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <FileCode className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">MIME Type</p>
                  <p className="text-sm font-semibold text-gray-700">{data.type || 'unknown/binary'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={downloadFile}
              className="w-full bg-red-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-100 transform active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              {t.downloadFile}
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
            >
              <Check className="w-5 h-5" />
              {t.transferAnother}
            </button>
          </div>
          
          <p className="mt-4 text-xs text-gray-400">
            {t.virusWarning}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultView;
