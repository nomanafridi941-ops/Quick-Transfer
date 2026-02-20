import React, { useEffect } from 'react';
import { Rocket, Monitor, Smartphone, Download as DownloadIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DownloadPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    document.title = 'Download – QuickTransfer';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Download QuickTransfer for Android or Windows, or use the web app directly.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-pink-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-red-500 p-1.5 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">QuickTransfer</span>
          </a>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <a href="/" className="text-red-500 font-medium hover:underline">← Back to Home</a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
              <DownloadIcon className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white">Download QuickTransfer</h1>
          </div>

          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Choose your platform below to download an installer or use the web app directly.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                  <Smartphone className="w-8 h-8 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Mobile (Android)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Download the APK for Android or use QuickTransfer in your mobile browser.</p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <a
                  href="/downloads/quicktransfer-android.apk"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:opacity-95"
                  download
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download APK
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-50"
                >
                  Open Web App
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <Monitor className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Windows / Desktop</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Download the desktop installer or use the browser-based web app.</p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <a
                  href="/downloads/quicktransfer-windows.zip"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-95"
                  download
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download for Windows
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-50"
                >
                  Open Web App
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6 items-start">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <h4 className="font-semibold mb-2">Notes</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>APK and installer files are provided for convenience.</li>
                <li>Files may be removed or updated periodically; check back for the latest versions.</li>
                <li>Prefer the web app? It works across devices without downloads.</li>
              </ul>
            </div>

            <div className="flex justify-center md:justify-end">
              {/* Ad removed per request */}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-8 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 dark:text-gray-500 text-sm">
          © 2026 QuickTransfer. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DownloadPage;
