
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ArrowLeft, CheckCircle2, FileText, Info, FileCode, Paperclip, Check, Users, Clock, AlertTriangle } from 'lucide-react';
import { TransferData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { incrementDownloadCount, getDataByCode } from '../services/storage';
import DemoAd from './DemoAd';

interface ResultViewProps {
  data?: TransferData;
  mode: 'SENT' | 'RECEIVED';
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ data, mode, onBack }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [currentDownloadCount, setCurrentDownloadCount] = useState<number>(data?.downloadCount || 0);
  const [isExpired, setIsExpired] = useState(false);
  
  if (!data) return null;

  // Live countdown timer and download count refresh
  useEffect(() => {
    if (mode !== 'SENT') return;
    
    const updateStatus = async () => {
      // Update time remaining
      const remaining = Math.max(0, data.expiresAt - Date.now());
      setTimeRemaining(remaining);
      
      // Check if expired by time
      if (remaining <= 0) {
        setIsExpired(true);
        return;
      }
      
      // Refresh download count from database
      try {
        const freshData = await getDataByCode(data.code);
        if (freshData) {
          setCurrentDownloadCount(freshData.downloadCount);
          // Check if expired by download limit
          if (freshData.downloadCount >= data.maxDownloads) {
            setIsExpired(true);
          }
        } else {
          // Data was deleted (download limit reached)
          setIsExpired(true);
        }
      } catch (error) {
        // Code might be expired/deleted
        setIsExpired(true);
      }
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    
    return () => clearInterval(interval);
  }, [mode, data]);

  // Format time remaining
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadFile = async () => {
    const link = document.createElement('a');
    link.href = data.content;
    link.download = data.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Increment download count and delete if limit reached
    try {
      await incrementDownloadCount(data.code);
      setDownloaded(true);
    } catch (error) {
      console.error('Failed to update download count:', error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-xl dark:border dark:border-white/10 rounded-3xl p-8 custom-shadow w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center gap-1 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>{t.transferAnother}</span>
        </button>
        <div className="flex items-center gap-2 text-green-500 dark:text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">{t.fileReady}</span>
        </div>
      </div>

      {mode === 'SENT' ? (
        <div className="text-center">
          {/* Expired State */}
          {isExpired ? (
            <div className="py-8">
              <div className="bg-red-50 dark:bg-red-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-200 dark:border-red-500/30">
                <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">{t.codeExpired || 'Code Expired'}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t.codeExpiredDesc || 'This transfer code is no longer valid.'}</p>
              <button 
                onClick={onBack}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-pink-600 transition-all shadow-lg shadow-red-500/25 dark:shadow-red-500/20"
              >
                {t.transferAnother}
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 dark:text-gray-300 mb-2">{t.shareCode}</p>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-500/20 dark:to-pink-500/20 text-red-600 dark:text-red-400 text-6xl font-black tracking-tighter py-6 rounded-2xl mb-4 border border-red-100 dark:border-red-500/30">
                {data.code}
              </div>

              {/* Live Stats Bar */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Time Remaining */}
                <div className="bg-orange-50 dark:bg-orange-500/20 rounded-xl p-3 border border-orange-200 dark:border-orange-500/30">
                  <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-2xl font-black">{formatTime(timeRemaining)}</span>
                  </div>
                  <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">{t.timeLeft || 'Time Left'}</p>
                </div>
                {/* Downloads */}
                <div className="bg-blue-50 dark:bg-blue-500/20 rounded-xl p-3 border border-blue-200 dark:border-blue-500/30">
                  <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                    <Users className="w-4 h-4" />
                    <span className="text-2xl font-black">{currentDownloadCount}/{data.maxDownloads}</span>
                  </div>
                  <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">{t.downloads || 'Downloads'}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl flex flex-col items-center gap-4 mb-8 border border-gray-100 dark:border-slate-600">
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                    <QRCodeSVG value={`https://quicktransfer.site/?code=${data.code}`} size={150} />
                 </div>
                 <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-400">
                   <span className="flex items-center gap-1 bg-red-50 dark:bg-red-500/20 text-red-500 dark:text-red-400 px-2 py-1 rounded-full font-medium">
                     <Users className="w-3 h-3" /> {data.maxDownloads - currentDownloadCount} {t.remaining || 'remaining'}
                   </span>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleCopyCode}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-pink-600 transition-all shadow-lg shadow-red-500/25 dark:shadow-red-500/20"
                >
                  <Share2 className="w-5 h-5" />
                  {copied ? t.copied : t.copyCode}
                </button>
                <button 
                  onClick={onBack}
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
                >
                  <Check className="w-5 h-5" />
                  {t.transferAnother}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-blue-500/30">
            <FileText className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-1">{data.name}</h3>
            <p className="text-gray-400 dark:text-gray-400 text-sm font-medium">{(data.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          {/* File Preview / Details Section */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-5 mb-8 text-left border border-gray-100 dark:border-slate-600">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-4 px-1">File Details</h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Filename</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 break-all">{data.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                  <FileCode className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">MIME Type</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-100">{data.type || 'unknown/binary'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={downloadFile}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-pink-600 transition-all shadow-lg shadow-red-500/25 dark:shadow-red-500/20 transform active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              {t.downloadFile}
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
            >
              <Check className="w-5 h-5" />
              {t.transferAnother}
            </button>
          </div>
          
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-400">
            {t.virusWarning}
          </p>
          
          {/* Demo Ad - After Download */}
          <div className="mt-6">
            <DemoAd size="320x50" label="After Download" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;
