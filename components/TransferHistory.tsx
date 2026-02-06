import React, { useState, useEffect } from 'react';
import { History, Send, Download, Trash2, Clock, X, FileText } from 'lucide-react';
import { getHistory, clearHistory, HistoryItem } from '../services/history';
import { useLanguage } from '../context/LanguageContext';

interface TransferHistoryProps {
  onCodeClick?: (code: string) => void;
}

const TransferHistory: React.FC<TransferHistoryProps> = ({ onCodeClick }) => {
  const { t } = useLanguage();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, [isOpen]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  if (history.length === 0) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 p-4 rounded-full shadow-2xl hover:shadow-xl transition-all flex items-center gap-2 group z-50 border border-gray-100 dark:border-slate-700"
      >
        <History className="w-6 h-6 text-red-500" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
          {t.recentTransfers || 'Recent'}
        </span>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {history.length}
        </span>
      </button>

      {/* History Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <History className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">{t.transferHistory || 'Transfer History'}</h3>
                  <p className="text-xs text-white/80">{t.storedLocally || 'Stored only on your device'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* History List */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[50vh]">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-100 dark:border-slate-600 hover:border-red-200 dark:hover:border-red-500/50 transition-all cursor-pointer group"
                  onClick={() => {
                    if (item.type === 'received' && onCodeClick) {
                      onCodeClick(item.code);
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${
                      item.type === 'sent' 
                        ? 'bg-green-100 dark:bg-green-500/20' 
                        : 'bg-blue-100 dark:bg-blue-500/20'
                    }`}>
                      {item.type === 'sent' ? (
                        <Send className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-3 h-3 text-gray-400" />
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-100 truncate">
                          {item.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                        <span>{formatSize(item.size)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Code Badge */}
                    <div className="bg-gray-100 dark:bg-slate-600 px-3 py-1.5 rounded-lg">
                      <p className="font-mono font-bold text-sm text-gray-600 dark:text-gray-200">
                        {item.code}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={handleClear}
                className="w-full flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t.clearHistory || 'Clear History'}
              </button>
              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
                {t.last3Transfers || 'Your last 3 transfers (stored only on your device)'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferHistory;
